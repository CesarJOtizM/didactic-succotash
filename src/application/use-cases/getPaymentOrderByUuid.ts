import {
	PaymentOrderRepository,
	RepositoryResult,
	createSuccessResult,
	createErrorResult
} from 'src/application/ports';
import { PaymentOrder } from 'src/domain/entities/paymentOrder';
import { getPaymentOrderParamsSchema, GetPaymentOrderParams } from 'src/lib/schemas';
import { validateWithZod } from 'src/lib/utils/validation';

// Tipos para el caso de uso
export type GetPaymentOrderByUuidInput = GetPaymentOrderParams;
export type GetPaymentOrderByUuidOutput = RepositoryResult<PaymentOrder>;

// Función para validar entrada usando Zod con utilidades robustas
const validateInput = (input: unknown): RepositoryResult<GetPaymentOrderParams> => {
	const validationResult = validateWithZod(getPaymentOrderParamsSchema, input);

	if (validationResult.success) {
		return createSuccessResult(validationResult.data);
	}

	// Formatear el error con detalles adicionales si están disponibles
	const errorMessage = validationResult.details
		? `${validationResult.error}: ${validationResult.details.join(', ')}`
		: validationResult.error;

	return createErrorResult(errorMessage);
};

// Caso de uso principal
export const createGetPaymentOrderByUuid =
	(repository: PaymentOrderRepository) =>
	async (input: unknown): Promise<GetPaymentOrderByUuidOutput> => {
		try {
			// Validar entrada usando Zod
			const validationResult = validateInput(input);
			if (!validationResult.success) {
				return validationResult;
			}

			const { uuid } = validationResult.data;

			// Buscar PaymentOrder
			const paymentOrder = await repository.findByUuid(uuid);

			if (!paymentOrder) {
				return createErrorResult('PaymentOrder no encontrada');
			}

			return createSuccessResult(paymentOrder);
		} catch (error) {
			return createErrorResult(
				`Error al obtener PaymentOrder: ${error instanceof Error ? error.message : 'Error desconocido'}`
			);
		}
	};

// Helper para crear instancia del caso de uso con repositorio por defecto
export const getPaymentOrderByUuid = (repository: PaymentOrderRepository) =>
	createGetPaymentOrderByUuid(repository);
