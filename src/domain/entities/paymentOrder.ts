// Entidad PaymentOrder - Dominio
export interface PaymentOrder {
	readonly uuid: string;
	readonly type: string;
	readonly amount: number;
	readonly description: string;
	readonly countryIsoCode: string;
	readonly createdAt: Date;
	readonly paymentUrl: string;
	readonly status?: string;
	readonly provider?: string;
	readonly attempts?: number;
	readonly processedAt?: Date;
	readonly transactionId?: string;
}

// Helper para validar que el amount sea positivo
export const isValidAmount = (amount: number): boolean => amount > 0;

// Helper para validar que el código ISO sea válido
export const isValidCountryIsoCode = (code: string): boolean =>
	/^[A-Z]{2}$/.test(code) && code.length === 2;
