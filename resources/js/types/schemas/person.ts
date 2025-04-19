import { z } from 'zod';

const identificationTypes = z.enum([
    'CC', // Cédula de Ciudadanía
    'NIT', // Número de Identificación Tributaria
    'CE', // Cédula de Extranjería
    'PAS', // Pasaporte
    'TI', // Tarjeta de Identidad
    'PPT', //Permiso de proteccioon temporal
  ], {
    required_error: "El tipo de identificación es requerido.",
    invalid_type_error: "Tipo de identificación inválido.",
});

const personBaseSchema = z.object({
    identification_type: identificationTypes,
    identification_number: z.string({ required_error: "El número de identificación es requerido."})
      .min(1, { message: "El número de identificación no puede estar vacío." }),
      // Podrías añadir validaciones regex específicas aquí usando .refine() más adelante
  
    email: z.string()
      .email({ message: "Email inválido." })
      .nullable()
      .optional(), // .optional() si el campo puede no estar presente, .nullable() si siempre está pero puede ser null. Elige uno.
  
    address: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
});

const naturalPersonSchema = personBaseSchema.extend({
    type: z.literal('natural'),
  
    first_name: z.string({ required_error: "El nombre es requerido." })
      .min(1, { message: "El nombre no puede estar vacío." }),
  
    last_name: z.string({ required_error: "Los apellidos son requeridos." })
      .min(1, { message: "Los apellidos no pueden estar vacíos." }),
  
    date_of_birth: z.string({ required_error: "La fecha de nacimiento es requerida."})
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Formato de fecha inválido (YYYY-MM-DD)."}),
      // O usar z.date() si trabajas directamente con objetos Date
  
    occupation: z.string().nullable().optional(),
  
    salary: z.number({ invalid_type_error: "El salario debe ser un número." })
      .gte(0, { message: "El salario no puede ser negativo." })
      .nullable()
      .optional(),
  
    // Aseguramos que el campo de persona jurídica esté ausente o null
    company_name: z.literal(null).or(z.undefined()).or(z.literal(''))
                  .optional(),
  
});

const juridicalPersonSchema = personBaseSchema.extend({
    type: z.literal('juridica'),
  
    company_name: z.string({ required_error: "La razón social es requerida." })
      .min(1, { message: "La razón social no puede estar vacía." }),
  
    // Aseguramos que los campos de persona natural estén ausentes o null
    first_name: z.literal(null).or(z.undefined()).or(z.literal(''))
                .optional(),
    last_name: z.literal(null).or(z.undefined()).or(z.literal(''))
               .optional(),
    date_of_birth: z.literal(null).or(z.undefined()).or(z.literal(''))
                   .optional(),
    occupation: z.literal(null).or(z.undefined()).or(z.literal(''))
                .optional(),
    salary: z.literal(null).or(z.undefined())
            .optional(),
});

// Agregamos id, created_at y updated_at como opcionales para ambos esquemas
export const personCreateSchema = z.discriminatedUnion('type', [
    naturalPersonSchema.extend({
        id: z.number().optional(),
        created_at: z.string().optional(),
        updated_at: z.string().optional(),
    }),
    juridicalPersonSchema.extend({
        id: z.number().optional(),
        created_at: z.string().optional(),
        updated_at: z.string().optional(),
    }),
], {
    errorMap: (issue, ctx) => {
      // Puedes personalizar mensajes de error aquí si lo necesitas
      // console.log(issue.code, issue.path);
      if (issue.code === z.ZodIssueCode.invalid_union_discriminator) {
          return { message: 'El tipo de persona debe ser "natural" o "jurídica".' };
      }
      return { message: ctx.defaultError };
    },
});

const naturalPersonUpdateSchema = personBaseSchema
    .partial() // Hace opcionales los campos base (id_type, id_number, email, etc.)
    .extend({
        type: z.literal('natural'), // <-- Mantenemos 'type' REQUERIDO
        // Hacemos opcionales los campos específicos de natural
        first_name: z.string().min(1).optional(),
        last_name: z.string().min(1).optional(),
        date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(), // Permite null u omitido
        occupation: z.string().nullable().optional(),
        salary: z.number().gte(0).nullable().optional(),
        // Aseguramos que el campo de jurídica siga siendo nulo/undefined si se envía
        company_name: z.literal(null).or(z.undefined()).or(z.literal('')).optional(),
        created_at: z.string().optional(),
        updated_at: z.string().optional(),
    });

const juridicalPersonUpdateSchema = personBaseSchema
    .partial() // Hace opcionales los campos base
    .extend({
        type: z.literal('juridica'), // <-- Mantenemos 'type' REQUERIDO
        // Hacemos opcional el campo específico de jurídica
        company_name: z.string().min(1).optional(),
        // Aseguramos que los campos de natural sigan siendo nulos/undefined si se envían
        first_name: z.literal(null).or(z.undefined()).or(z.literal('')).optional(),
        last_name: z.literal(null).or(z.undefined()).or(z.literal('')).optional(),
        date_of_birth: z.literal(null).or(z.undefined()).or(z.literal('')).optional(),
        occupation: z.literal(null).or(z.undefined()).or(z.literal('')).optional(),
        salary: z.literal(null).or(z.undefined()).optional(),
        created_at: z.string().optional(),
        updated_at: z.string().optional(),
    });

// Agregamos id, created_at y updated_at como opcionales para ambos esquemas
export const personUpdateSchema = z.discriminatedUnion('type', [
    naturalPersonUpdateSchema.extend({
        id: z.number().optional(),
        created_at: z.string().optional(),
        updated_at: z.string().optional(),
    }),
    juridicalPersonUpdateSchema.extend({
        id: z.number().optional(),
        created_at: z.string().optional(),
        updated_at: z.string().optional(),
    }),
], {
    errorMap: (issue, ctx) => {
       if (issue.code === z.ZodIssueCode.invalid_union_discriminator) {
            // Este error no debería ocurrir si 'type' está presente y es 'natural' o 'juridica'
            return { message: 'El tipo de persona ("type") es inválido o falta.' };
        }
        return { message: ctx.defaultError };
    }
});

export type PersonFormData = z.infer<typeof personCreateSchema>;
export type PersonCreateFormData = z.infer<typeof personCreateSchema>;
export type PersonUpdateFormData = z.infer<typeof personUpdateSchema>;
export type Person = z.infer<typeof personCreateSchema>;