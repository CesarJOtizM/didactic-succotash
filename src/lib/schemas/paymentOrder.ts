import { z } from 'zod';

// Schema para validar el request body de crear payment order
export const createPaymentOrderSchema = z.object({
	amount: z.number().int().positive().min(1, 'El monto debe ser mayor a 0'),
	description: z
		.string()
		.min(1, 'La descripción es requerida')
		.max(255, 'La descripción es muy larga'),
	country_iso_code: z
		.string()
		.length(2, 'El código ISO del país debe tener exactamente 2 caracteres')
		.regex(/^[A-Z]{2}$/, 'El código ISO debe estar en mayúsculas')
});

// Tipos TypeScript inferidos del schema
export type CreatePaymentOrderRequest = z.infer<typeof createPaymentOrderSchema>;

// Schema para la respuesta de payment order
export const paymentOrderResponseSchema = z.object({
	uuid: z.string().uuid(),
	type: z.literal('payment_order'),
	attributes: z.object({
		amount: z.number().int().positive(),
		description: z.string(),
		country_iso_code: z.string().length(2),
		created_at: z.string().datetime(),
		payment_url: z.string().url()
	})
});

export type PaymentOrderResponse = z.infer<typeof paymentOrderResponseSchema>;
