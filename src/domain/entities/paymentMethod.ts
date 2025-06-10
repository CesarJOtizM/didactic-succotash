// Entidad PaymentMethod - Dominio
export interface PaymentMethod {
	readonly id: string;
	readonly name: string;
	readonly type: PaymentMethodType;
	readonly countryIsoCode: string;
	readonly enabled: boolean;
	readonly configuration: PaymentMethodConfiguration;
	readonly metadata: PaymentMethodMetadata;
}

// Tipos de métodos de pago
export type PaymentMethodType =
	| 'credit_card'
	| 'debit_card'
	| 'bank_transfer'
	| 'digital_wallet'
	| 'cash'
	| 'credit'
	| 'cryptocurrency';

// Configuración específica del método de pago
export interface PaymentMethodConfiguration {
	readonly minAmount?: number;
	readonly maxAmount?: number;
	readonly currency: string;
	readonly processingTime?: string;
	readonly fees?: {
		readonly fixed?: number;
		readonly percentage?: number;
	};
}

// Metadatos adicionales
export interface PaymentMethodMetadata {
	readonly displayName: string;
	readonly description: string;
	readonly iconUrl?: string;
	readonly supported_currencies: string[];
	readonly requires_document?: boolean;
	readonly instant_payment?: boolean;
}

// Factory para crear un PaymentMethod
export const createPaymentMethod = (params: {
	id: string;
	name: string;
	type: PaymentMethodType;
	countryIsoCode: string;
	enabled: boolean;
	configuration: PaymentMethodConfiguration;
	metadata: PaymentMethodMetadata;
}): PaymentMethod => ({
	id: params.id,
	name: params.name,
	type: params.type,
	countryIsoCode: params.countryIsoCode,
	enabled: params.enabled,
	configuration: params.configuration,
	metadata: params.metadata
});

// Helper para validar si un método de pago está disponible para un monto
export const isPaymentMethodAvailableForAmount = (
	paymentMethod: PaymentMethod,
	amount: number
): boolean => {
	const { minAmount, maxAmount } = paymentMethod.configuration;

	if (minAmount && amount < minAmount) return false;
	if (maxAmount && amount > maxAmount) return false;

	return paymentMethod.enabled;
};

// Helper para calcular fees de un método de pago
export const calculatePaymentMethodFees = (
	paymentMethod: PaymentMethod,
	amount: number
): number => {
	const { fees } = paymentMethod.configuration;

	if (!fees) return 0;

	let totalFee = 0;

	if (fees.fixed) {
		totalFee += fees.fixed;
	}

	if (fees.percentage) {
		totalFee += (amount * fees.percentage) / 100;
	}

	return totalFee;
};
