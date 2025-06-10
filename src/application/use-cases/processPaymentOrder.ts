import {
	ProcessPaymentResponseDto,
	mapToProcessPaymentSuccessResponse,
	mapToProcessPaymentErrorResponse
} from 'src/application/dtos';
import { PaymentOrderRepository } from 'src/application/ports';
import { getAvailablePaymentMethodsForAmount } from 'src/infrastructure/mocks';
import { processPaymentWithSmartRouting } from 'src/infrastructure/services/paymentProviderMock';
import { isValidUuid } from 'src/lib/utils';

// Resultado del caso de uso
export type ProcessPaymentOrderResult =
	| { success: true; data: ProcessPaymentResponseDto }
	| { success: false; error: string };

// Parámetros para el caso de uso
export interface ProcessPaymentOrderParams {
	uuid: string;
	paymentMethodId?: string;
}

// Función factory para crear el caso de uso
export const createProcessPaymentOrderUseCase = (
	paymentOrderRepository: PaymentOrderRepository
) => {
	return async (params: ProcessPaymentOrderParams): Promise<ProcessPaymentOrderResult> => {
		try {
			// Validar formato de UUID
			if (!isValidUuid(params.uuid)) {
				return {
					success: false,
					error: 'El formato del UUID no es válido'
				};
			}

			// Buscar la orden de pago
			const paymentOrder = await paymentOrderRepository.findByUuid(params.uuid);

			if (!paymentOrder) {
				return {
					success: false,
					error: 'Orden de pago no encontrada'
				};
			}

			// Obtener métodos de pago disponibles para el país y monto
			const availablePaymentMethods = getAvailablePaymentMethodsForAmount(
				paymentOrder.countryIsoCode,
				paymentOrder.amount
			);

			if (!availablePaymentMethods.length) {
				return {
					success: false,
					error: `No hay métodos de pago disponibles para ${paymentOrder.countryIsoCode} con monto ${paymentOrder.amount}`
				};
			}

			// Procesar pago con ruteo inteligente
			console.info(`🚀 Iniciando procesamiento de pago para orden ${params.uuid}`);
			console.info(`💰 Monto: ${paymentOrder.amount} | País: ${paymentOrder.countryIsoCode}`);
			console.info(`🔧 Métodos disponibles: ${availablePaymentMethods.length}`);

			const paymentResult = await processPaymentWithSmartRouting(
				availablePaymentMethods,
				paymentOrder.amount,
				params.uuid,
				params.paymentMethodId
			);

			// Mapear respuesta según el resultado
			if (paymentResult.success) {
				const successResponse = mapToProcessPaymentSuccessResponse(paymentResult.transaction_id);
				console.info(
					`✅ Pago completado exitosamente - Transaction: ${paymentResult.transaction_id}`
				);

				return {
					success: true,
					data: successResponse
				};
			} else {
				const errorResponse = mapToProcessPaymentErrorResponse(paymentResult.transaction_id);
				console.info(
					`❌ Pago falló - Transaction: ${paymentResult.transaction_id} | Error: ${paymentResult.error_message}`
				);

				return {
					success: true, // El caso de uso es exitoso, pero el pago falló
					data: errorResponse
				};
			}
		} catch (error) {
			console.error('Error en processPaymentOrderUseCase:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Error desconocido al procesar el pago'
			};
		}
	};
};

// Validaciones adicionales
export const validateProcessPaymentOrderParams = (params: ProcessPaymentOrderParams): string[] => {
	const errors: string[] = [];

	if (!params.uuid || params.uuid.trim().length === 0) {
		errors.push('UUID es requerido');
	}

	if (params.uuid && !isValidUuid(params.uuid)) {
		errors.push('El formato del UUID no es válido');
	}

	return errors;
};
