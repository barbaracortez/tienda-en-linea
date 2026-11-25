import {
  CheckoutField,
  checkoutErrorMessage,
  createCheckoutForm,
} from './checkout-form';

describe('Formulario de checkout', () => {
  const valid = {
    fullName: 'Ana Pérez',
    email: 'ana@ejemplo.com',
    address: 'Av. Corrientes 1234',
    city: 'Buenos Aires',
    postalCode: 'C1425ABC',
  };

  const errorFor = (field: CheckoutField, value: string) => {
    const form = createCheckoutForm();
    form.setValue({ ...valid, [field]: value });
    return checkoutErrorMessage(field, form.controls[field].errors);
  };

  it('arranca vacío e inválido', () => {
    const form = createCheckoutForm();

    expect(form.invalid).toBeTrue();
    expect(Object.values(form.getRawValue()).every(v => v === '')).toBeTrue();
  });

  it('es válido con datos correctos', () => {
    const form = createCheckoutForm();
    form.setValue(valid);

    expect(form.valid).toBeTrue();
  });

  it('exige todos los campos', () => {
    for (const field of Object.keys(valid) as CheckoutField[]) {
      expect(errorFor(field, ''))
        .withContext(field)
        .toBe('Este campo es obligatorio.');
    }
  });

  it('no acepta campos con solo espacios', () => {
    expect(errorFor('address', '     ')).toBe('Este campo es obligatorio.');
  });

  describe('nombre', () => {
    it('acepta acentos, ñ, apóstrofes y guiones', () => {
      expect(errorFor('fullName', 'María José Núñez-O’Brien')).toBeNull();
      expect(errorFor('fullName', "Juan D'Angelo")).toBeNull();
    });

    it('rechaza números y nombres demasiado cortos', () => {
      expect(errorFor('fullName', 'Ana 123')).toBe(
        'Usá solo letras y espacios.'
      );
      expect(errorFor('fullName', 'Al')).toBe('Ingresá al menos 3 caracteres.');
    });
  });

  describe('email', () => {
    it('acepta emails válidos', () => {
      expect(errorFor('email', 'ana.perez+demo@empresa.com.ar')).toBeNull();
    });

    it('rechaza emails sin dominio o sin extensión', () => {
      for (const email of ['ana', 'ana@', 'ana@ejemplo', 'ana @x.com']) {
        expect(errorFor('email', email))
          .withContext(email)
          .toContain('Ingresá un email válido');
      }
    });
  });

  describe('código postal', () => {
    it('acepta el formato de 4 dígitos y el CPA', () => {
      expect(errorFor('postalCode', '1425')).toBeNull();
      expect(errorFor('postalCode', 'c1425abc')).toBeNull();
    });

    it('rechaza formatos inválidos', () => {
      for (const code of ['142', '14255', 'ABCD', 'C1425AB']) {
        expect(errorFor('postalCode', code))
          .withContext(code)
          .toContain('código postal válido');
      }
    });
  });

  it('limita el largo máximo', () => {
    expect(errorFor('city', 'x'.repeat(61))).toBe(
      'Usá como máximo 60 caracteres.'
    );
  });
});
