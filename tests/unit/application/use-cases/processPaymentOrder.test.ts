import {
	createProcessPaymentOrderUseCase,
	validateProcessPaymentOrderParams,
	ProcessPaymentOrderParams,
	ProcessPaymentOrderResult
} from 'src/application/use-cases/processPaymentOrder';
import { PaymentOrderRepository } from 'src/application/ports';
import { PaymentOrder } from 'src/domain/entities';
import { PaymentMethod } from 'src/domain/entities/paymentMethod';

// Mock de las dependencias externas
jest.mock('src/infrastructure/mocks', () => ({
	getAvailablePaymentMethodsForAmount: jest.fn()
}));

jest.mock('src/infrastructure/services/paymentProviderMock', () => ({
	processPaymentWithSmartRouting: jest.fn()
}));

jest.mock('src/lib/utils', () => ({
	isValidUuid: jest.fn()
}));

import { getAvailablePaymentMethodsForAmount } from 'src/infrastructure/mocks';
import { processPaymentWithSmartRouting } from 'src/infrastructure/services/paymentProviderMock';
import { isValidUuid } from 'src/lib/utils';

const mockGetAvailablePaymentMethods = getAvailablePaymentMethodsForAmount as jest.MockedFunction<
	typeof getAvailablePaymentMethodsForAmount
>;
const mockProcessPayment = processPaymentWithSmartRouting as jest.MockedFunction<
	typeof processPaymentWithSmartRouting
>;
const mockIsValidUuid = isValidUuid as jest.MockedFunction<typeof isValidUuid>;

describe('ProcessPaymentOrder Use Case', () => {
	let mockRepository: jest.Mocked<PaymentOrderRepository>;
	let processPaymentOrderUseCase: ReturnType<typeof createProcessPaymentOrderUseCase>;
	let mockPaymentOrder: PaymentOrder;
	let mockPaymentMethods: PaymentMethod[];

	beforeEach(() => {
		// Setup mock repository
		mockRepository = {
			save: jest.fn(),
			findByUuid: jest.fn(),
			findAll: jest.fn(),
			update: jest.fn()
		};

		// Create use case with mocked repository
		processPaymentOrderUseCase = createProcessPaymentOrderUseCase(mockRepository);

		// Setup mock payment order
		mockPaymentOrder = {
			uuid: '550e8400-e29b-41d4-a716-446655440000',
			type: 'payment_order',
			amount: 50000,
			description: 'Test payment',
			countryIsoCode: 'CO',
			createdAt: new Date('2024-01-15T10:30:00Z'),
			paymentUrl: 'https://api.example.com/payment_order/550e8400-e29b-41d4-a716-446655440000',
			status: 'pending',
			attempts: 0
		};

		// Setup mock payment methods
		mockPaymentMethods = [
			{
				id: '1',
				name: 'Credit Card',
				type: 'credit_card',
				countryIsoCode: 'CO',
				enabled: true,
				configuration: {
					minAmount: 1000,
					maxAmount: 100000,
					currency: 'COP'
				},
				metadata: {
					displayName: 'Tarjeta de Crédito',
					description: 'Pago con tarjeta',
					supported_currencies: ['COP']
				}
			}
		];

		// Reset all mocks
		jest.clearAllMocks();
		console.info = jest.fn();
		console.error = jest.fn();
	});

	describe('createProcessPaymentOrderUseCase', () => {
		it('debería procesar una orden de pago exitosamente', async () => {
			// Arrange
			const params: ProcessPaymentOrderParams = {
				uuid: '550e8400-e29b-41d4-a716-446655440000'
			};

			mockIsValidUuid.mockReturnValue(true);
			mockRepository.findByUuid.mockResolvedValue(mockPaymentOrder);
			mockGetAvailablePaymentMethods.mockReturnValue(mockPaymentMethods);
			mockProcessPayment.mockResolvedValue({
				success: true,
				provider_id: 'stripe',
				transaction_id: 'txn_12345',
				error_message: undefined
			});

			const updatedPaymentOrder = {
				...mockPaymentOrder,
				status: 'completed',
				attempts: 1,
				processedAt: expect.any(Date),
				provider: 'stripe',
				transactionId: 'txn_12345'
			};

			mockRepository.update.mockResolvedValue(updatedPaymentOrder);

			// Act
			const result: ProcessPaymentOrderResult = await processPaymentOrderUseCase(params);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.status).toBe('success');
				expect(result.data.transaction_id).toBe('txn_12345');
			}

			expect(mockRepository.findByUuid).toHaveBeenCalledWith(params.uuid);
			expect(mockGetAvailablePaymentMethods).toHaveBeenCalledWith('CO', 50000);
			expect(mockProcessPayment).toHaveBeenCalledWith(
				mockPaymentMethods,
				50000,
				params.uuid,
				undefined
			);
			expect(mockRepository.update).toHaveBeenCalledWith(params.uuid, {
				status: 'completed',
				attempts: 1,
				processedAt: expect.any(Date),
				provider: 'stripe',
				transactionId: 'txn_12345'
			});
		});

		it('debería manejar pago fallido y retornar respuesta de error', async () => {
			// Arrange
			const params: ProcessPaymentOrderParams = {
				uuid: '550e8400-e29b-41d4-a716-446655440000'
			};

			mockIsValidUuid.mockReturnValue(true);
			mockRepository.findByUuid.mockResolvedValue(mockPaymentOrder);
			mockGetAvailablePaymentMethods.mockReturnValue(mockPaymentMethods);
			mockProcessPayment.mockResolvedValue({
				success: false,
				provider_id: 'stripe',
				transaction_id: 'txn_failed_12345',
				error_message: 'Insufficient funds'
			});

			const updatedPaymentOrder = {
				...mockPaymentOrder,
				status: 'failed',
				attempts: 1,
				processedAt: expect.any(Date),
				provider: 'stripe',
				transactionId: 'txn_failed_12345'
			};

			mockRepository.update.mockResolvedValue(updatedPaymentOrder);

			// Act
			const result: ProcessPaymentOrderResult = await processPaymentOrderUseCase(params);

			// Assert
			expect(result.success).toBe(true); // El caso de uso es exitoso aunque el pago falle
			if (result.success) {
				expect(result.data.status).toBe('Error');
				expect(result.data.transaction_id).toBe('txn_failed_12345');
			}

			expect(mockRepository.update).toHaveBeenCalledWith(params.uuid, {
				status: 'failed',
				attempts: 1,
				processedAt: expect.any(Date),
				provider: 'stripe',
				transactionId: 'txn_failed_12345'
			});
		});

		it('debería retornar error cuando el UUID es inválido', async () => {
			// Arrange
			const params: ProcessPaymentOrderParams = {
				uuid: 'invalid-uuid'
			};

			mockIsValidUuid.mockReturnValue(false);

			// Act
			const result: ProcessPaymentOrderResult = await processPaymentOrderUseCase(params);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe('El formato del UUID no es válido');
			}

			expect(mockRepository.findByUuid).not.toHaveBeenCalled();
		});

		it('debería retornar error cuando la orden de pago no existe', async () => {
			// Arrange
			const params: ProcessPaymentOrderParams = {
				uuid: '550e8400-e29b-41d4-a716-446655440000'
			};

			mockIsValidUuid.mockReturnValue(true);
			mockRepository.findByUuid.mockResolvedValue(null);

			// Act
			const result: ProcessPaymentOrderResult = await processPaymentOrderUseCase(params);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe('Orden de pago no encontrada');
			}
		});

		it('debería retornar error cuando la orden ya fue procesada', async () => {
			// Arrange
			const params: ProcessPaymentOrderParams = {
				uuid: '550e8400-e29b-41d4-a716-446655440000'
			};

			const completedPaymentOrder = {
				...mockPaymentOrder,
				status: 'completed'
			};

			mockIsValidUuid.mockReturnValue(true);
			mockRepository.findByUuid.mockResolvedValue(completedPaymentOrder);

			// Act
			const result: ProcessPaymentOrderResult = await processPaymentOrderUseCase(params);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe('La orden de pago ya fue procesada exitosamente');
			}

			expect(mockGetAvailablePaymentMethods).not.toHaveBeenCalled();
		});

		it('debería manejar el caso cuando no hay métodos de pago disponibles', async () => {
			// Arrange
			const params: ProcessPaymentOrderParams = {
				uuid: '550e8400-e29b-41d4-a716-446655440000'
			};

			mockIsValidUuid.mockReturnValue(true);
			mockRepository.findByUuid.mockResolvedValue(mockPaymentOrder);
			mockGetAvailablePaymentMethods.mockReturnValue([]);

			const failedPaymentOrder = {
				...mockPaymentOrder,
				status: 'failed',
				attempts: 1,
				processedAt: expect.any(Date)
			};

			mockRepository.update.mockResolvedValue(failedPaymentOrder);

			// Act
			const result: ProcessPaymentOrderResult = await processPaymentOrderUseCase(params);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe('No hay métodos de pago disponibles para CO con monto 50000');
			}

			expect(mockRepository.update).toHaveBeenCalledWith(params.uuid, {
				status: 'failed',
				attempts: 1,
				processedAt: expect.any(Date)
			});
			expect(mockProcessPayment).not.toHaveBeenCalled();
		});

		it('debería incrementar correctamente el número de intentos', async () => {
			// Arrange
			const params: ProcessPaymentOrderParams = {
				uuid: '550e8400-e29b-41d4-a716-446655440000'
			};

			const paymentOrderWithAttempts = {
				...mockPaymentOrder,
				attempts: 2
			};

			mockIsValidUuid.mockReturnValue(true);
			mockRepository.findByUuid.mockResolvedValue(paymentOrderWithAttempts);
			mockGetAvailablePaymentMethods.mockReturnValue(mockPaymentMethods);
			mockProcessPayment.mockResolvedValue({
				success: true,
				provider_id: 'paypal',
				transaction_id: 'txn_67890',
				error_message: undefined
			});

			// Act
			await processPaymentOrderUseCase(params);

			// Assert
			expect(mockRepository.update).toHaveBeenCalledWith(params.uuid, {
				status: 'completed',
				attempts: 3, // 2 + 1
				processedAt: expect.any(Date),
				provider: 'paypal',
				transactionId: 'txn_67890'
			});
		});

		it('debería pasar el paymentMethodId al servicio de procesamiento', async () => {
			// Arrange
			const params: ProcessPaymentOrderParams = {
				uuid: '550e8400-e29b-41d4-a716-446655440000',
				paymentMethodId: 'credit_card_1'
			};

			mockIsValidUuid.mockReturnValue(true);
			mockRepository.findByUuid.mockResolvedValue(mockPaymentOrder);
			mockGetAvailablePaymentMethods.mockReturnValue(mockPaymentMethods);
			mockProcessPayment.mockResolvedValue({
				success: true,
				provider_id: 'stripe',
				transaction_id: 'txn_12345',
				error_message: undefined
			});

			// Act
			await processPaymentOrderUseCase(params);

			// Assert
			expect(mockProcessPayment).toHaveBeenCalledWith(
				mockPaymentMethods,
				50000,
				params.uuid,
				'credit_card_1'
			);
		});

		it('debería manejar errores del repositorio al actualizar', async () => {
			// Arrange
			const params: ProcessPaymentOrderParams = {
				uuid: '550e8400-e29b-41d4-a716-446655440000'
			};

			mockIsValidUuid.mockReturnValue(true);
			mockRepository.findByUuid.mockResolvedValue(mockPaymentOrder);
			mockGetAvailablePaymentMethods.mockReturnValue(mockPaymentMethods);
			mockProcessPayment.mockResolvedValue({
				success: true,
				provider_id: 'stripe',
				transaction_id: 'txn_12345',
				error_message: undefined
			});
			mockRepository.update.mockRejectedValue(new Error('Database error'));

			// Act
			const result: ProcessPaymentOrderResult = await processPaymentOrderUseCase(params);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe('Database error');
			}
		});

		it('debería manejar errores no esperados', async () => {
			// Arrange
			const params: ProcessPaymentOrderParams = {
				uuid: '550e8400-e29b-41d4-a716-446655440000'
			};

			mockIsValidUuid.mockReturnValue(true);
			// Mock findByUuid para fallar en la primera llamada y retornar null en el recovery
			mockRepository.findByUuid
				.mockRejectedValueOnce(new Error('Unexpected error'))
				.mockResolvedValueOnce(null);
			mockRepository.update.mockResolvedValue(null);

			// Act
			const result: ProcessPaymentOrderResult = await processPaymentOrderUseCase(params);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe('Unexpected error');
			}

			// Debería intentar actualizar el status a failed
			expect(mockRepository.update).toHaveBeenCalled();
		});
	});

	describe('validateProcessPaymentOrderParams', () => {
		it('debería retornar array vacío para parámetros válidos', () => {
			// Arrange
			const params: ProcessPaymentOrderParams = {
				uuid: '550e8400-e29b-41d4-a716-446655440000'
			};

			mockIsValidUuid.mockReturnValue(true);

			// Act
			const errors = validateProcessPaymentOrderParams(params);

			// Assert
			expect(errors).toEqual([]);
		});

		it('debería validar que el UUID sea requerido', () => {
			// Arrange
			const params = { uuid: '' } as ProcessPaymentOrderParams;

			// Act
			const errors = validateProcessPaymentOrderParams(params);

			// Assert
			expect(errors).toContain('UUID es requerido');
		});

		it('debería validar que el UUID tenga formato válido', () => {
			// Arrange
			const params: ProcessPaymentOrderParams = {
				uuid: 'invalid-uuid-format'
			};

			mockIsValidUuid.mockReturnValue(false);

			// Act
			const errors = validateProcessPaymentOrderParams(params);

			// Assert
			expect(errors).toContain('El formato del UUID no es válido');
		});

		it('debería acumular múltiples errores', () => {
			// Arrange
			const params = { uuid: '' } as ProcessPaymentOrderParams;

			// Act
			const errors = validateProcessPaymentOrderParams(params);

			// Assert
			expect(errors.length).toBeGreaterThan(0);
			expect(errors).toContain('UUID es requerido');
		});
	});
});
