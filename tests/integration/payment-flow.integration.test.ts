import { createPaymentOrderUseCase } from 'src/application/use-cases/createPaymentOrder';
import { createProcessPaymentOrderUseCase } from 'src/application/use-cases/processPaymentOrder';
import { getAllPaymentOrdersUseCase } from 'src/application/use-cases/getAllPaymentOrders';
import { CreatePaymentOrderDto } from 'src/application/dtos';
import {
	createMockRepository,
	createMockPaymentOrder,
	createMockPaymentMethods,
	TEST_CONSTANTS,
	setupConsoleMocks,
	restoreConsoleMocks
} from '../helpers/testHelpers';

// Mock de las dependencias externas
jest.mock('uuid', () => ({
	v4: jest.fn(() => 'integration-test-uuid-123')
}));

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

describe('Payment Flow Integration Tests', () => {
	const mockRepository = createMockRepository();
	const processPaymentOrderUseCase = createProcessPaymentOrderUseCase(mockRepository);

	beforeEach(() => {
		jest.clearAllMocks();
		setupConsoleMocks();

		// Setup default valid UUID behavior
		mockIsValidUuid.mockImplementation(
			(uuid: string) => uuid === 'integration-test-uuid-123' || uuid === TEST_CONSTANTS.VALID_UUID
		);
	});

	afterEach(() => {
		restoreConsoleMocks();
	});

	describe('Flujo completo: Crear y procesar una orden de pago exitosa', () => {
		it('debería crear una orden, procesarla exitosamente y obtenerla en la lista', async () => {
			// Paso 1: Crear una orden de pago
			const createDto: CreatePaymentOrderDto = {
				amount: 75000,
				description: 'Compra de productos premium',
				countryIsoCode: 'CO'
			};

			const createdPaymentOrder = createMockPaymentOrder({
				uuid: 'integration-test-uuid-123',
				amount: 75000,
				description: 'Compra de productos premium',
				countryIsoCode: 'CO',
				status: 'pending',
				attempts: 0
			});

			mockRepository.save.mockResolvedValue(createdPaymentOrder);

			const createResult = await createPaymentOrderUseCase({
				dto: createDto,
				repository: mockRepository,
				baseUrl: TEST_CONSTANTS.BASE_URL
			});

			// Verificar creación exitosa
			expect(createResult.success).toBe(true);
			if (!createResult.success) return;

			expect(createResult.data.uuid).toBe('integration-test-uuid-123');
			expect(createResult.data.attributes.amount).toBe(75000);
			expect(createResult.data.attributes.status).toBe('pending');

			// Paso 2: Procesar la orden de pago
			const availablePaymentMethods = createMockPaymentMethods(2);
			mockGetAvailablePaymentMethods.mockReturnValue(availablePaymentMethods);

			mockRepository.findByUuid.mockResolvedValue(createdPaymentOrder);

			mockProcessPayment.mockResolvedValue({
				success: true,
				provider_id: 'stripe',
				transaction_id: 'txn_integration_12345',
				error_message: undefined
			});

			const processedPaymentOrder = {
				...createdPaymentOrder,
				status: 'completed',
				attempts: 1,
				provider: 'stripe',
				transactionId: 'txn_integration_12345',
				processedAt: new Date()
			};

			mockRepository.update.mockResolvedValue(processedPaymentOrder);

			const processResult = await processPaymentOrderUseCase({
				uuid: 'integration-test-uuid-123'
			});

			// Verificar procesamiento exitoso
			expect(processResult.success).toBe(true);
			if (!processResult.success) return;

			expect(processResult.data.status).toBe('success');
			expect(processResult.data.transaction_id).toBe('txn_integration_12345');

			// Paso 3: Verificar que la orden aparece en la lista con el estado actualizado
			mockRepository.findAll.mockResolvedValue([processedPaymentOrder]);

			const getAllResult = await getAllPaymentOrdersUseCase({
				repository: mockRepository,
				baseUrl: TEST_CONSTANTS.BASE_URL
			});

			expect(getAllResult.success).toBe(true);
			if (!getAllResult.success) return;

			expect(getAllResult.data).toHaveLength(1);
			expect(getAllResult.data[0].uuid).toBe('integration-test-uuid-123');
			expect(getAllResult.data[0].attributes.status).toBe('completed');
			expect(getAllResult.data[0].attributes.provider).toBe('stripe');
			expect(getAllResult.data[0].attributes.transaction_id).toBe('txn_integration_12345');
			expect(getAllResult.data[0].attributes.attempts).toBe(1);

			// Verificar llamadas al repositorio
			expect(mockRepository.save).toHaveBeenCalledTimes(1);
			expect(mockRepository.findByUuid).toHaveBeenCalledTimes(1);
			expect(mockRepository.update).toHaveBeenCalledTimes(1);
			expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
		});
	});

	describe('Flujo completo: Crear orden y fallar en el procesamiento', () => {
		it('debería crear una orden, fallar en el procesamiento y reflejar el estado fallido', async () => {
			// Paso 1: Crear orden de pago
			const createDto: CreatePaymentOrderDto = {
				amount: 50000,
				description: 'Pago que fallará',
				countryIsoCode: 'MX'
			};

			const createdPaymentOrder = createMockPaymentOrder({
				uuid: 'integration-test-uuid-123',
				amount: 50000,
				description: 'Pago que fallará',
				countryIsoCode: 'MX'
			});

			mockRepository.save.mockResolvedValue(createdPaymentOrder);

			const createResult = await createPaymentOrderUseCase({
				dto: createDto,
				repository: mockRepository,
				baseUrl: TEST_CONSTANTS.BASE_URL
			});

			expect(createResult.success).toBe(true);

			// Paso 2: Intentar procesar y fallar
			const availablePaymentMethods = createMockPaymentMethods(1);
			mockGetAvailablePaymentMethods.mockReturnValue(availablePaymentMethods);

			mockRepository.findByUuid.mockResolvedValue(createdPaymentOrder);

			mockProcessPayment.mockResolvedValue({
				success: false,
				provider_id: 'stripe',
				transaction_id: 'txn_failed_67890',
				error_message: 'Insufficient funds'
			});

			const failedPaymentOrder = {
				...createdPaymentOrder,
				status: 'failed',
				attempts: 1,
				provider: 'stripe',
				transactionId: 'txn_failed_67890',
				processedAt: new Date()
			};

			mockRepository.update.mockResolvedValue(failedPaymentOrder);

			const processResult = await processPaymentOrderUseCase({
				uuid: 'integration-test-uuid-123'
			});

			// El caso de uso es exitoso, pero el pago falla
			expect(processResult.success).toBe(true);
			if (!processResult.success) return;

			expect(processResult.data.status).toBe('Error');
			expect(processResult.data.transaction_id).toBe('txn_failed_67890');

			// Paso 3: Verificar estado en la lista
			mockRepository.findAll.mockResolvedValue([failedPaymentOrder]);

			const getAllResult = await getAllPaymentOrdersUseCase({
				repository: mockRepository,
				baseUrl: TEST_CONSTANTS.BASE_URL
			});

			expect(getAllResult.success).toBe(true);
			if (!getAllResult.success) return;

			const failedOrder = getAllResult.data[0];
			expect(failedOrder.attributes.status).toBe('failed');
			expect(failedOrder.attributes.provider).toBe('stripe');
			expect(failedOrder.attributes.transaction_id).toBe('txn_failed_67890');
		});
	});

	describe('Flujo con múltiples intentos de procesamiento', () => {
		it('debería manejar múltiples intentos y incrementar el contador correctamente', async () => {
			const uuid = 'integration-test-uuid-123';

			// Crear orden inicial
			const initialPaymentOrder = createMockPaymentOrder({
				uuid,
				attempts: 0,
				status: 'pending'
			});

			// Primer intento fallido
			mockRepository.findByUuid.mockResolvedValueOnce(initialPaymentOrder);
			mockGetAvailablePaymentMethods.mockReturnValue(createMockPaymentMethods(1));
			mockProcessPayment.mockResolvedValueOnce({
				success: false,
				provider_id: 'paypal',
				transaction_id: 'txn_attempt_1',
				error_message: 'Network error'
			});

			const firstAttemptOrder = {
				...initialPaymentOrder,
				attempts: 1,
				status: 'failed',
				provider: 'paypal',
				transactionId: 'txn_attempt_1',
				processedAt: new Date()
			};

			mockRepository.update.mockResolvedValueOnce(firstAttemptOrder);

			const firstResult = await processPaymentOrderUseCase({ uuid });
			expect(firstResult.success).toBe(true);

			// Segundo intento exitoso
			mockRepository.findByUuid.mockResolvedValueOnce({
				...firstAttemptOrder,
				status: 'pending' // Resetear para nuevo intento
			});

			mockProcessPayment.mockResolvedValueOnce({
				success: true,
				provider_id: 'stripe',
				transaction_id: 'txn_attempt_2',
				error_message: undefined
			});

			const secondAttemptOrder = {
				...firstAttemptOrder,
				attempts: 2,
				status: 'completed',
				provider: 'stripe',
				transactionId: 'txn_attempt_2',
				processedAt: new Date()
			};

			mockRepository.update.mockResolvedValueOnce(secondAttemptOrder);

			const secondResult = await processPaymentOrderUseCase({ uuid });
			expect(secondResult.success).toBe(true);
			if (!secondResult.success) return;

			expect(secondResult.data.status).toBe('success');
			expect(secondResult.data.transaction_id).toBe('txn_attempt_2');

			// Verificar que se llamó update con attempts: 2
			expect(mockRepository.update).toHaveBeenLastCalledWith(uuid, {
				status: 'completed',
				attempts: 2,
				processedAt: expect.any(Date),
				provider: 'stripe',
				transactionId: 'txn_attempt_2'
			});
		});
	});

	describe('Flujo de error: Sin métodos de pago disponibles', () => {
		it('debería fallar cuando no hay métodos de pago disponibles para el país/monto', async () => {
			const uuid = 'integration-test-uuid-123';

			const paymentOrder = createMockPaymentOrder({
				uuid,
				amount: 1000000, // Monto muy alto
				countryIsoCode: 'XX' // País no soportado
			});

			mockRepository.findByUuid.mockResolvedValue(paymentOrder);
			mockGetAvailablePaymentMethods.mockReturnValue([]); // Sin métodos disponibles

			const failedOrder = {
				...paymentOrder,
				status: 'failed',
				attempts: 1,
				processedAt: new Date()
			};

			mockRepository.update.mockResolvedValue(failedOrder);

			const result = await processPaymentOrderUseCase({ uuid });

			expect(result.success).toBe(false);
			if (result.success) return;

			expect(result.error).toBe('No hay métodos de pago disponibles para XX con monto 1000000');

			expect(mockRepository.update).toHaveBeenCalledWith(uuid, {
				status: 'failed',
				attempts: 1,
				processedAt: expect.any(Date)
			});
		});
	});

	describe('Flujo de resilencia: Errores de repositorio', () => {
		it('debería manejar errores de conexión del repositorio durante la creación', async () => {
			const createDto: CreatePaymentOrderDto = {
				amount: 25000,
				description: 'Orden con error de BD',
				countryIsoCode: 'CO'
			};

			mockRepository.save.mockRejectedValue(new Error('Connection timeout'));

			const result = await createPaymentOrderUseCase({
				dto: createDto,
				repository: mockRepository,
				baseUrl: TEST_CONSTANTS.BASE_URL
			});

			expect(result.success).toBe(false);
			if (result.success) return;

			expect(result.error).toBe('Connection timeout');
		});

		it('debería manejar errores de repositorio durante el procesamiento', async () => {
			const uuid = 'integration-test-uuid-123';

			// Mock findByUuid para fallar en la primera llamada y retornar null en el recovery
			mockRepository.findByUuid
				.mockRejectedValueOnce(new Error('Database error'))
				.mockResolvedValueOnce(null);

			// Mock para el intento de actualizar status a failed
			mockRepository.update.mockResolvedValue(null);

			const result = await processPaymentOrderUseCase({ uuid });

			expect(result.success).toBe(false);
			if (result.success) return;

			expect(result.error).toBe('Database error');

			// Debería intentar actualizar el status a failed
			expect(mockRepository.update).toHaveBeenCalled();
		});
	});
});
