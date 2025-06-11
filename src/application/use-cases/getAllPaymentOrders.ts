import { PaymentOrderResponseDto, mapPaymentOrderToResponseDto } from 'src/application/dtos';
import { PaymentOrderRepository } from 'src/application/ports';

// Resultado del caso de uso
export type GetAllPaymentOrdersResult =
	| { success: true; data: PaymentOrderResponseDto[] }
	| { success: false; error: string };

// Parámetros para el caso de uso
export interface GetAllPaymentOrdersParams {
	repository: PaymentOrderRepository;
	baseUrl: string;
}

// Caso de uso principal
export const getAllPaymentOrdersUseCase = async (
	params: GetAllPaymentOrdersParams
): Promise<GetAllPaymentOrdersResult> => {
	try {
		// Obtener todas las órdenes de pago del repositorio
		const paymentOrders = await params.repository.findAll();

		// Mapear a DTOs de respuesta
		const responseDtos = paymentOrders.map(paymentOrder =>
			mapPaymentOrderToResponseDto(paymentOrder, params.baseUrl)
		);

		return {
			success: true,
			data: responseDtos
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Error desconocido al obtener las payment orders'
		};
	}
};
