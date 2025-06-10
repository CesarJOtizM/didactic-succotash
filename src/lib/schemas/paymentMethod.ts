import { z } from 'zod';

// Schema para validar el parámetro de país
export const getPaymentMethodsParamsSchema = z.object({
	country: z
		.string()
		.length(2, 'El código ISO del país debe tener exactamente 2 caracteres')
		.regex(/^[A-Z]{2}$/, 'El código ISO debe estar en mayúsculas')
});

// Schema para validar query parameters opcionales
export const getPaymentMethodsQuerySchema = z.object({
	amount: z
		.string()
		.optional()
		.transform(val => (val ? parseInt(val, 10) : undefined))
		.refine(
			val => val === undefined || (Number.isInteger(val) && val > 0),
			'El monto debe ser un número entero positivo'
		)
});

// Schema para la respuesta de método de pago
export const paymentMethodResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum([
		'credit_card',
		'debit_card',
		'bank_transfer',
		'digital_wallet',
		'cash',
		'credit',
		'cryptocurrency'
	]),
	display_name: z.string(),
	description: z.string(),
	icon_url: z.string().optional(),
	configuration: z.object({
		min_amount: z.number().optional(),
		max_amount: z.number().optional(),
		currency: z.string(),
		processing_time: z.string().optional(),
		fees: z
			.object({
				fixed: z.number().optional(),
				percentage: z.number().optional()
			})
			.optional()
	}),
	metadata: z.object({
		supported_currencies: z.array(z.string()),
		requires_document: z.boolean().optional(),
		instant_payment: z.boolean().optional()
	})
});

// Schema para la respuesta de lista de métodos de pago
export const paymentMethodsListResponseSchema = z.object({
	country_iso_code: z.string().length(2),
	payment_methods: z.array(paymentMethodResponseSchema),
	total_methods: z.number().int().min(0)
});

// Tipos TypeScript inferidos
export type GetPaymentMethodsParams = z.infer<typeof getPaymentMethodsParamsSchema>;
export type GetPaymentMethodsQuery = z.infer<typeof getPaymentMethodsQuerySchema>;
export type PaymentMethodResponse = z.infer<typeof paymentMethodResponseSchema>;
export type PaymentMethodsListResponse = z.infer<typeof paymentMethodsListResponseSchema>;
