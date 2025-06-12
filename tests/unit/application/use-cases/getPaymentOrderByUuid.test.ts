import {
	createGetPaymentOrderByUuid,
	GetPaymentOrderByUuidInput,
	GetPaymentOrderByUuidOutput
} from 'src/application/use-cases/getPaymentOrderByUuid';
import { PaymentOrderRepository } from 'src/application/ports';
import {
	createMockRepository,
	createMockPaymentOrder,
	TEST_CONSTANTS
} from '../../../helpers/testHelpers';

// Mock del módulo de validación
jest.mock('src/lib/utils/validation', () => ({
	validateWithZod: jest.fn()
}));

// Mock del esquema
jest.mock('src/lib/schemas', () => ({
	getPaymentOrderParamsSchema: {}
}));

import { validateWithZod } from 'src/lib/utils/validation';

const mockValidateWithZod = validateWithZod as jest.MockedFunction<typeof validateWithZod>;

describe('GetPaymentOrderByUuid Use Case', () => {
	let mockRepository: jest.Mocked<PaymentOrderRepository>;
	let getPaymentOrderByUuid: (input: unknown) => Promise<GetPaymentOrderByUuidOutput>;

	beforeEach(() => {
		mockRepository = createMockRepository();
		getPaymentOrderByUuid = createGetPaymentOrderByUuid(mockRepository);
		jest.clearAllMocks();
	});

	describe('createGetPaymentOrderByUuid', () => {
		it('debería obtener una payment order exitosamente con UUID válido', async () => {
			// Arrange
			const input: GetPaymentOrderByUuidInput = {
				uuid: TEST_CONSTANTS.VALID_UUID
			};

			const mockPaymentOrder = createMockPaymentOrder({
				uuid: TEST_CONSTANTS.VALID_UUID,
				description: 'Orden encontrada exitosamente',
				amount: 75000
			});

			mockValidateWithZod.mockReturnValue({
				success: true,
				data: input
			});

			mockRepository.findByUuid.mockResolvedValue(mockPaymentOrder);

			// Act
			const result = await getPaymentOrderByUuid(input);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(mockPaymentOrder);
				expect(result.data.uuid).toBe(TEST_CONSTANTS.VALID_UUID);
				expect(result.data.amount).toBe(75000);
				expect(result.data.description).toBe('Orden encontrada exitosamente');
			}

			expect(mockValidateWithZod).toHaveBeenCalledTimes(1);
			expect(mockRepository.findByUuid).toHaveBeenCalledWith(TEST_CONSTANTS.VALID_UUID);
		});

		it('debería retornar error cuando la payment order no existe', async () => {
			// Arrange
			const input: GetPaymentOrderByUuidInput = {
				uuid: 'non-existent-uuid'
			};

			mockValidateWithZod.mockReturnValue({
				success: true,
				data: input
			});

			mockRepository.findByUuid.mockResolvedValue(null);

			// Act
			const result = await getPaymentOrderByUuid(input);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe('PaymentOrder no encontrada');
			}

			expect(mockRepository.findByUuid).toHaveBeenCalledWith('non-existent-uuid');
		});

		it('debería retornar error cuando la validación de entrada falla', async () => {
			// Arrange
			const invalidInput = {
				uuid: 'invalid-uuid-format'
			};

			mockValidateWithZod.mockReturnValue({
				success: false,
				error: 'Error de validación',
				details: ['UUID debe tener formato válido']
			});

			// Act
			const result = await getPaymentOrderByUuid(invalidInput);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe('Error de validación: UUID debe tener formato válido');
			}

			expect(mockRepository.findByUuid).not.toHaveBeenCalled();
		});

		it('debería retornar error cuando la validación falla sin detalles', async () => {
			// Arrange
			const invalidInput = {};

			mockValidateWithZod.mockReturnValue({
				success: false,
				error: 'UUID es requerido'
			});

			// Act
			const result = await getPaymentOrderByUuid(invalidInput);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe('UUID es requerido');
			}
		});

		it('debería manejar errores del repositorio correctamente', async () => {
			// Arrange
			const input: GetPaymentOrderByUuidInput = {
				uuid: TEST_CONSTANTS.VALID_UUID
			};

			mockValidateWithZod.mockReturnValue({
				success: true,
				data: input
			});

			const repositoryError = new Error('Error de conexión a la base de datos');
			mockRepository.findByUuid.mockRejectedValue(repositoryError);

			// Act
			const result = await getPaymentOrderByUuid(input);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe(
					'Error al obtener PaymentOrder: Error de conexión a la base de datos'
				);
			}
		});

		it('debería manejar errores desconocidos', async () => {
			// Arrange
			const input: GetPaymentOrderByUuidInput = {
				uuid: TEST_CONSTANTS.VALID_UUID
			};

			mockValidateWithZod.mockReturnValue({
				success: true,
				data: input
			});

			mockRepository.findByUuid.mockRejectedValue('Error string desconocido');

			// Act
			const result = await getPaymentOrderByUuid(input);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe('Error al obtener PaymentOrder: Error desconocido');
			}
		});

		it('debería preservar todos los campos de la payment order encontrada', async () => {
			// Arrange
			const input: GetPaymentOrderByUuidInput = {
				uuid: 'complete-uuid-test'
			};

			const completePaymentOrder = createMockPaymentOrder({
				uuid: 'complete-uuid-test',
				amount: 125000,
				description: 'Orden completa con todos los campos',
				countryIsoCode: 'BR',
				status: 'completed',
				provider: 'stripe',
				attempts: 1,
				transactionId: 'txn_complete_123',
				processedAt: new Date('2024-01-15T14:30:00Z')
			});

			mockValidateWithZod.mockReturnValue({
				success: true,
				data: input
			});

			mockRepository.findByUuid.mockResolvedValue(completePaymentOrder);

			// Act
			const result = await getPaymentOrderByUuid(input);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.uuid).toBe('complete-uuid-test');
				expect(result.data.amount).toBe(125000);
				expect(result.data.description).toBe('Orden completa con todos los campos');
				expect(result.data.countryIsoCode).toBe('BR');
				expect(result.data.status).toBe('completed');
				expect(result.data.provider).toBe('stripe');
				expect(result.data.attempts).toBe(1);
				expect(result.data.transactionId).toBe('txn_complete_123');
				expect(result.data.processedAt).toEqual(new Date('2024-01-15T14:30:00Z'));
			}
		});

		it('debería trabajar con payment orders en diferentes estados', async () => {
			// Arrange
			const testCases = [
				{
					uuid: 'pending-order',
					status: 'pending',
					attempts: 0,
					description: 'Orden pendiente'
				},
				{
					uuid: 'processing-order',
					status: 'processing',
					attempts: 1,
					description: 'Orden en procesamiento'
				},
				{
					uuid: 'failed-order',
					status: 'failed',
					attempts: 3,
					description: 'Orden fallida'
				}
			];

			// Act & Assert
			for (const testCase of testCases) {
				const input: GetPaymentOrderByUuidInput = {
					uuid: testCase.uuid
				};

				const mockPaymentOrder = createMockPaymentOrder({
					uuid: testCase.uuid,
					status: testCase.status,
					attempts: testCase.attempts,
					description: testCase.description
				});

				mockValidateWithZod.mockReturnValue({
					success: true,
					data: input
				});

				mockRepository.findByUuid.mockResolvedValue(mockPaymentOrder);

				const result = await getPaymentOrderByUuid(input);

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.uuid).toBe(testCase.uuid);
					expect(result.data.status).toBe(testCase.status);
					expect(result.data.attempts).toBe(testCase.attempts);
					expect(result.data.description).toBe(testCase.description);
				}
			}
		});

		it('debería validar entrada con formato de objeto completo', async () => {
			// Arrange
			const complexInput = {
				uuid: TEST_CONSTANTS.VALID_UUID,
				extraField: 'should-be-ignored' // Campo adicional que debería ser ignorado
			};

			const validatedInput: GetPaymentOrderByUuidInput = {
				uuid: TEST_CONSTANTS.VALID_UUID
			};

			const mockPaymentOrder = createMockPaymentOrder({
				uuid: TEST_CONSTANTS.VALID_UUID
			});

			mockValidateWithZod.mockReturnValue({
				success: true,
				data: validatedInput // Solo retorna los campos validados
			});

			mockRepository.findByUuid.mockResolvedValue(mockPaymentOrder);

			// Act
			const result = await getPaymentOrderByUuid(complexInput);

			// Assert
			expect(result.success).toBe(true);
			expect(mockValidateWithZod).toHaveBeenCalledWith(expect.anything(), complexInput);
			expect(mockRepository.findByUuid).toHaveBeenCalledWith(TEST_CONSTANTS.VALID_UUID);
		});

		it('debería manejar múltiples llamadas concurrentes correctamente', async () => {
			// Arrange
			const uuid1 = 'concurrent-uuid-1';
			const uuid2 = 'concurrent-uuid-2';

			const input1: GetPaymentOrderByUuidInput = { uuid: uuid1 };
			const input2: GetPaymentOrderByUuidInput = { uuid: uuid2 };

			const mockPaymentOrder1 = createMockPaymentOrder({ uuid: uuid1, amount: 10000 });
			const mockPaymentOrder2 = createMockPaymentOrder({ uuid: uuid2, amount: 20000 });

			mockValidateWithZod
				.mockReturnValueOnce({ success: true, data: input1 })
				.mockReturnValueOnce({ success: true, data: input2 });

			mockRepository.findByUuid
				.mockResolvedValueOnce(mockPaymentOrder1)
				.mockResolvedValueOnce(mockPaymentOrder2);

			// Act
			const [result1, result2] = await Promise.all([
				getPaymentOrderByUuid(input1),
				getPaymentOrderByUuid(input2)
			]);

			// Assert
			expect(result1.success).toBe(true);
			expect(result2.success).toBe(true);

			if (result1.success && result2.success) {
				expect(result1.data.uuid).toBe(uuid1);
				expect(result1.data.amount).toBe(10000);
				expect(result2.data.uuid).toBe(uuid2);
				expect(result2.data.amount).toBe(20000);
			}
		});
	});
});
