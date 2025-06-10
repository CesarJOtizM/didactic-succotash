// Entidad PaymentOrder - Dominio
export interface PaymentOrder {
	readonly uuid: string;
	readonly type: string;
	readonly amount: number;
	readonly description: string;
	readonly countryIsoCode: string;
	readonly createdAt: Date;
	readonly paymentUrl: string;
}

// Factory para crear una PaymentOrder
export const createPaymentOrder = (params: {
	uuid: string;
	amount: number;
	description: string;
	countryIsoCode: string;
	paymentUrl: string;
}): PaymentOrder => ({
	uuid: params.uuid,
	type: 'payment_order',
	amount: params.amount,
	description: params.description,
	countryIsoCode: params.countryIsoCode,
	createdAt: new Date(),
	paymentUrl: params.paymentUrl
});

// Helper para validar que el amount sea positivo
export const isValidAmount = (amount: number): boolean => amount > 0;

// Helper para validar que el código ISO sea válido
export const isValidCountryIsoCode = (code: string): boolean =>
	/^[A-Z]{2}$/.test(code) && code.length === 2;
