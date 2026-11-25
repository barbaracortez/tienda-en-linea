import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '@shared/services/cart.service';

/** El checkout solo tiene sentido con productos en el carrito. */
export const cartNotEmptyGuard: CanActivateFn = () =>
  inject(CartService).count() > 0 || inject(Router).createUrlTree(['/']);
