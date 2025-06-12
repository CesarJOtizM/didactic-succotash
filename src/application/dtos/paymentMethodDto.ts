import { PaymentMethod, PaymentMethodType } from 'src/domain/entities';

// DTO para respuesta de método de pago
export interface PaymentMethodResponseDto {
	readonly id: string;
	readonly name: string;
	readonly type: PaymentMethodType;
	readonly display_name: string;
	readonly description: string;
	readonly icon_url?: string;
	readonly configuration: {
		readonly min_amount?: number;
		readonly max_amount?: number;
		readonly currency: string;
		readonly processing_time?: string;
		readonly fees?: {
			readonly fixed?: number;
			readonly percentage?: number;
		};
	};
	readonly metadata: {
		readonly supported_currencies: string[];
		readonly requires_document?: boolean;
		readonly instant_payment?: boolean;
	};
}

// DTO para respuesta de lista de métodos de pago
export interface PaymentMethodsListResponseDto {
	readonly country_iso_code: string;
	readonly payment_methods: PaymentMethodResponseDto[];
	readonly total_methods: number;
}

// Mapper para convertir entidad de dominio a DTO de respuesta
export const mapPaymentMethodToResponseDto = (
	paymentMethod: PaymentMethod
): PaymentMethodResponseDto => ({
	id: paymentMethod.id,
	name: paymentMethod.name,
	type: paymentMethod.type,
	display_name: paymentMethod.metadata.displayName,
	description: paymentMethod.metadata.description,
	icon_url: paymentMethod.metadata.iconUrl,
	configuration: {
		min_amount: paymentMethod.configuration.minAmount,
		max_amount: paymentMethod.configuration.maxAmount,
		currency: paymentMethod.configuration.currency,
		processing_time: paymentMethod.configuration.processingTime,
		fees: paymentMethod.configuration.fees
	},
	metadata: {
		supported_currencies: paymentMethod.metadata.supported_currencies,
		requires_document: paymentMethod.metadata.requires_document,
		instant_payment: paymentMethod.metadata.instant_payment
	}
});

// Mapper para convertir lista de entidades a DTO de respuesta
export const mapPaymentMethodsListToResponseDto = (
	paymentMethods: PaymentMethod[],
	countryIsoCode: string
): PaymentMethodsListResponseDto => ({
	country_iso_code: countryIsoCode,
	payment_methods: paymentMethods.map(mapPaymentMethodToResponseDto),
	total_methods: paymentMethods.length
});

// Mapper con filtro por monto
export const mapAvailablePaymentMethodsToResponseDto = (
	paymentMethods: PaymentMethod[],
	countryIsoCode: string,
	amount?: number
): PaymentMethodsListResponseDto => {
	let filteredMethods = paymentMethods;

	if (amount !== undefined) {
		filteredMethods = paymentMethods.filter(method => {
			const { minAmount, maxAmount } = method.configuration;
			if (minAmount && amount < minAmount) return false;
			if (maxAmount && amount > maxAmount) return false;
			return true;
		});
	}

	return mapPaymentMethodsListToResponseDto(filteredMethods, countryIsoCode);
};
