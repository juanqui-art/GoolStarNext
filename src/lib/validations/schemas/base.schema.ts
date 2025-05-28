import { z } from 'zod';

// Validaciones comunes reutilizables
export const baseValidations = {
  requiredString: (fieldName: string) =>
    z.string({ required_error: `${fieldName} es obligatorio` }).min(1, `${fieldName} es obligatorio`),

  optionalString: () =>
    z.string().optional(),

  email: () =>
    z.string().email('Correo electrónico inválido'),

  phone: () =>
    z.string().regex(
      /^[0-9\-\s+()]*$/,
      'Número de teléfono inválido'
    ).min(6, 'Mínimo 6 caracteres'),

  url: () =>
    z.string().url('URL inválida').or(z.literal('')),

  positiveNumber: (fieldName: string) =>
    z.number({
      required_error: `${fieldName} es obligatorio`,
      invalid_type_error: `${fieldName} debe ser un número`
    }).min(0, `${fieldName} no puede ser negativo`),
};

// Tipos de validación comunes
export type ValidationSchema<T> = z.ZodType<T>;
