import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CustomerInfo } from '@checkout/models/order.model';

export type CheckoutForm = FormGroup<{
  [K in keyof CustomerInfo]: FormControl<string>;
}>;

export type CheckoutField = keyof CustomerInfo;

/** Letras (con acentos), espacios, apóstrofes, puntos y guiones. */
export const NAME_PATTERN = /^[\p{L}][\p{L} '’.-]*$/u;
/** Requiere usuario, @, dominio y extensión de al menos 2 letras. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Código postal argentino: 4 dígitos (1425) o CPA (C1425ABC). */
export const POSTAL_CODE_PATTERN = /^([A-Za-z]\d{4}[A-Za-z]{3}|\d{4})$/;

/** Evita que un campo con solo espacios pase como completo. */
export function notBlank(
  control: AbstractControl<string>
): ValidationErrors | null {
  return control.value && control.value.trim() === '' ? { blank: true } : null;
}

export function createCheckoutForm(): CheckoutForm {
  const text = (
    ...validators: ((c: AbstractControl) => ValidationErrors | null)[]
  ) =>
    new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notBlank, ...validators],
    });

  return new FormGroup({
    fullName: text(
      Validators.minLength(3),
      Validators.maxLength(80),
      Validators.pattern(NAME_PATTERN)
    ),
    email: text(Validators.maxLength(120), Validators.pattern(EMAIL_PATTERN)),
    address: text(Validators.minLength(5), Validators.maxLength(120)),
    city: text(Validators.minLength(2), Validators.maxLength(60)),
    postalCode: text(Validators.pattern(POSTAL_CODE_PATTERN)),
  });
}

export interface FieldConfig {
  name: CheckoutField;
  label: string;
  type: 'text' | 'email';
  autocomplete: string;
  placeholder: string;
  hint?: string;
  /** Ocupa las dos columnas del formulario en pantallas medianas. */
  wide?: boolean;
}

export const CHECKOUT_FIELDS: FieldConfig[] = [
  {
    name: 'fullName',
    wide: true,
    label: 'Nombre y apellido',
    type: 'text',
    autocomplete: 'name',
    placeholder: 'Ej.: Ana Pérez',
  },
  {
    name: 'email',
    wide: true,
    label: 'Email',
    type: 'email',
    autocomplete: 'email',
    placeholder: 'Ej.: ana@ejemplo.com',
  },
  {
    name: 'address',
    wide: true,
    label: 'Dirección',
    type: 'text',
    autocomplete: 'street-address',
    placeholder: 'Ej.: Av. Corrientes 1234, piso 5',
  },
  {
    name: 'city',
    label: 'Ciudad',
    type: 'text',
    autocomplete: 'address-level2',
    placeholder: 'Ej.: Buenos Aires',
  },
  {
    name: 'postalCode',
    label: 'Código postal',
    type: 'text',
    autocomplete: 'postal-code',
    placeholder: 'Ej.: 1425',
    hint: 'Ej.: 1425 o C1425ABC',
  },
];

const PATTERN_MESSAGES: Record<CheckoutField, string> = {
  fullName: 'Usá solo letras y espacios.',
  email: 'Ingresá un email válido, por ejemplo ana@ejemplo.com.',
  address: 'Revisá la dirección.',
  city: 'Revisá la ciudad.',
  postalCode: 'Ingresá un código postal válido, por ejemplo 1425 o C1425ABC.',
};

/** Mensaje claro para el primer error del campo, o `null` si es válido. */
export function checkoutErrorMessage(
  field: CheckoutField,
  errors: ValidationErrors | null
): string | null {
  if (!errors) {
    return null;
  }
  if (errors['required'] || errors['blank']) {
    return 'Este campo es obligatorio.';
  }
  if (errors['minlength']) {
    return `Ingresá al menos ${errors['minlength'].requiredLength} caracteres.`;
  }
  if (errors['maxlength']) {
    return `Usá como máximo ${errors['maxlength'].requiredLength} caracteres.`;
  }
  if (errors['pattern']) {
    return PATTERN_MESSAGES[field];
  }
  return 'Revisá este campo.';
}
