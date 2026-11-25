import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import {
  Component,
  ElementRef,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  CHECKOUT_FIELDS,
  CheckoutField,
  checkoutErrorMessage,
  createCheckoutForm,
} from '@checkout/forms/checkout-form';
import { OrderService } from '@checkout/services/order.service';
import {
  IMAGE_PLACEHOLDER,
  ImgFallbackDirective,
} from '@shared/directives/img-fallback.directive';
import { CartService } from '@shared/services/cart.service';

type Step = 'details' | 'review';

@Component({
  selector: 'app-checkout',
  imports: [
    CurrencyPipe,
    NgOptimizedImage,
    ReactiveFormsModule,
    RouterLink,
    ImgFallbackDirective,
  ],
  templateUrl: './checkout.component.html',
})
export default class CheckoutComponent {
  private readonly cart = inject(CartService);
  private readonly orders = inject(OrderService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly stepHeading =
    viewChild<ElementRef<HTMLHeadingElement>>('stepHeading');

  readonly items = this.cart.items;
  readonly total = this.cart.total;
  readonly count = this.cart.count;

  readonly form = createCheckoutForm();
  readonly fields = CHECKOUT_FIELDS;
  readonly placeholder = IMAGE_PLACEHOLDER;

  readonly step = signal<Step>('details');
  readonly submitting = signal(false);
  readonly submitError = signal(false);

  errorFor(field: CheckoutField): string | null {
    const control = this.form.controls[field];
    return control.touched ? checkoutErrorMessage(field, control.errors) : null;
  }

  continueToReview() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalidField();
      return;
    }
    this.goTo('review');
  }

  editDetails() {
    this.goTo('details');
  }

  confirmOrder() {
    if (this.submitting() || this.form.invalid) {
      return;
    }
    this.submitting.set(true);
    this.submitError.set(false);

    this.orders
      .placeOrder(this.form.getRawValue(), this.items())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: order => {
          this.cart.clear();
          this.router.navigate(['/checkout/confirmacion', order.id]);
        },
        error: () => {
          this.submitting.set(false);
          this.submitError.set(true);
        },
      });
  }

  private goTo(step: Step) {
    this.step.set(step);
    // Lleva el foco al título del paso para lectores de pantalla y teclado.
    setTimeout(() => this.stepHeading()?.nativeElement.focus());
  }

  private focusFirstInvalidField() {
    setTimeout(() =>
      this.host.nativeElement
        .querySelector<HTMLInputElement>('input.ng-invalid')
        ?.focus()
    );
  }
}
