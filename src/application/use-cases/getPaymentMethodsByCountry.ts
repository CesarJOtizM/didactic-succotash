import {
	PaymentMethodsListResponseDto,
	mapPaymentMethodsListToResponseDto,
	mapAvailablePaymentMethodsToResponseDto
} from 'src/application/dtos';
import { isValidCountryIsoCode, PaymentMethod } from 'src/domain/entities';
import {
	getEnabledPaymentMethodsByCountry,
	getAvailablePaymentMethodsForAmount
} from 'src/infrastructure/mocks';

// Parámetros del caso de uso
export interface GetPaymentMethodsParams {
	readonly countryIsoCode: string;
	readonly amount?: number;
}

// Resultado del caso de uso
export type GetPaymentMethodsResult =
	| { success: true; data: PaymentMethodsListResponseDto }
	| { success: false; error: string };

// Caso de uso principal
export const getPaymentMethodsByCountryUseCase = async (
	params: GetPaymentMethodsParams
): Promise<GetPaymentMethodsResult> => {
	try {
		// Validar código ISO del país
		if (!isValidCountryIsoCode(params.countryIsoCode)) {
			return {
				success: false,
				error: 'El código ISO del país debe tener exactamente 2 caracteres en mayúsculas'
			};
		}

		// Obtener métodos de pago según si se filtra por monto o no
		const paymentMethods: PaymentMethod[] = params.amount
			? getAvailablePaymentMethodsForAmount(params.countryIsoCode, params.amount)
			: getEnabledPaymentMethodsByCountry(params.countryIsoCode);

		// Mapear a DTO de respuesta
		const responseDto = params.amount
			? mapAvailablePaymentMethodsToResponseDto(
					paymentMethods,
					params.countryIsoCode,
					params.amount
				)
			: mapPaymentMethodsListToResponseDto(paymentMethods, params.countryIsoCode);

		return {
			success: true,
			data: responseDto
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Error desconocido al obtener métodos de pago'
		};
	}
};

// Helper para validar código ISO del país

// Helper para validar que el monto sea válido
export const isValidAmount = (amount: number): boolean => {
	return amount > 0 && Number.isFinite(amount);
};
