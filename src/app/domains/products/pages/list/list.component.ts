import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Params, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { combineLatest, switchMap } from 'rxjs';
import { ProductComponent } from '@products/components/product/product.component';
import { SORT_OPTIONS, parseListQuery } from '@products/utils/list-query';
import { CATALOG_SOURCE } from '@shared/data-sources/catalog-source.token';
import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { ToastService } from '@shared/services/toast.service';
import { LoadState, toLoadState } from '@shared/utils/load-state';

type PriceForm = FormGroup<{
  min: FormControl<number | null>;
  max: FormControl<number | null>;
}>;

const priceRangeValidator = (
  group: AbstractControl
): ValidationErrors | null => {
  const { min, max } = (group as PriceForm).getRawValue();
  return min !== null && max !== null && min > max
    ? { invalidRange: true }
    : null;
};

@Component({
  selector: 'app-list',
  imports: [
    ProductComponent,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
  ],
  templateUrl: './list.component.html',
})
export default class ListComponent {
  private readonly cartService = inject(CartService);
  private readonly catalog = inject(CATALOG_SOURCE);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  // Parámetro de ruta y query params, enlazados con withComponentInputBinding.
  readonly slug = input<string>();
  readonly q = input<string>();
  readonly sort = input<string>();
  readonly min = input<string>();
  readonly max = input<string>();

  readonly sortOptions = SORT_OPTIONS;
  readonly skeletons = Array.from({ length: 8 }, (_, i) => i);

  readonly query = computed(() =>
    parseListQuery({
      slug: this.slug(),
      q: this.q(),
      sort: this.sort(),
      min: this.min(),
      max: this.max(),
    })
  );

  readonly searchTerm = computed(() => this.query().title ?? '');
  readonly hasFilters = computed(() => {
    const { categorySlug, title, sort, minPrice, maxPrice } = this.query();
    return [categorySlug, title, sort, minPrice, maxPrice].some(
      value => value !== undefined
    );
  });

  readonly categories = toSignal(this.catalog.getCategories(), {
    initialValue: [],
  });
  readonly currentCategory = computed(() =>
    this.categories().find(c => c.slug === this.query().categorySlug)
  );
  readonly heading = computed(
    () => this.currentCategory()?.name ?? 'Todos los productos'
  );

  readonly priceForm: PriceForm = new FormGroup(
    {
      min: new FormControl<number | null>(null, Validators.min(0)),
      max: new FormControl<number | null>(null, Validators.min(0)),
    },
    { validators: priceRangeValidator }
  );

  private readonly retry = signal(0);

  private readonly state = toSignal(
    combineLatest([toObservable(this.query), toObservable(this.retry)]).pipe(
      switchMap(([query]) =>
        this.catalog.getProducts(query).pipe(toLoadState())
      )
    ),
    { initialValue: { status: 'loading' } as LoadState<Product[]> }
  );

  readonly loading = computed(() => this.state().status === 'loading');
  readonly error = computed(() => this.state().status === 'error');
  readonly products = computed(() => {
    const state = this.state();
    return state.status === 'success' ? state.data : [];
  });

  constructor() {
    // URL → formulario de precio (al navegar, recargar o limpiar filtros).
    effect(() => {
      const { minPrice, maxPrice } = this.query();
      this.priceForm.setValue({
        min: minPrice ?? null,
        max: maxPrice ?? null,
      });
    });
  }

  changeSort(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.updateQueryParams({ sort: value || null });
  }

  applyPrice() {
    if (this.priceForm.invalid) {
      this.priceForm.markAllAsTouched();
      return;
    }
    const { min, max } = this.priceForm.getRawValue();
    this.updateQueryParams({ min, max });
  }

  clearFilters() {
    this.router.navigate(['/']);
  }

  reload() {
    this.retry.update(n => n + 1);
  }

  addToCart(product: Product) {
    this.cartService.add(product);
    this.toast.show(`“${product.title}” se agregó al carrito`);
  }

  private updateQueryParams(queryParams: Params) {
    const path = this.router.url.split(/[?#]/)[0];
    this.router.navigate([path], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
