import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { debounceTime, filter, map } from 'rxjs';

/**
 * Buscador global. El término vive en la URL (`?q=`) para que la búsqueda
 * se pueda compartir, recargar y navegar con el botón "atrás".
 */
@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  private readonly router = inject(Router);
  readonly query = new FormControl('', { nonNullable: true });

  constructor() {
    // URL → input (al navegar, recargar o usar "atrás").
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.currentQuery()),
        takeUntilDestroyed()
      )
      .subscribe(q => {
        if (q !== this.query.value.trim()) {
          this.query.setValue(q, { emitEvent: false });
        }
      });

    // Input → URL, con debounce para no pedir a la API en cada tecla.
    this.query.valueChanges
      .pipe(debounceTime(350), takeUntilDestroyed())
      .subscribe(() => this.search());
  }

  search() {
    const q = this.query.value.trim();
    if (q === this.currentQuery()) {
      return;
    }
    // En el listado se mantiene la categoría; desde otras páginas se va al inicio.
    const path = this.router.url.split(/[?#]/)[0];
    const onList = path === '/' || path.startsWith('/category/');
    this.router.navigate([onList ? path : '/'], {
      queryParams: { q: q || null },
      queryParamsHandling: 'merge',
    });
  }

  private currentQuery(): string {
    return this.router.parseUrl(this.router.url).queryParams['q'] ?? '';
  }
}
