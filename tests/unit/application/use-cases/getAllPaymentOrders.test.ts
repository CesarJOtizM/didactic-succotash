import {
	getAllPaymentOrdersUseCase,
	GetAllPaymentOrdersParams,
	GetAllPaymentOrdersResult
} from 'src/application/use-cases/getAllPaymentOrders';
import { PaymentOrderRepository } from 'src/application/ports';
import { PaymentOrder } from 'src/domain/entities';

describe('GetAllPaymentOrders Use Case', () => {
	let mockRepository: jest.Mocked<PaymentOrderRepository>;
	let baseUrl: string;
	let mockPaymentOrders: PaymentOrder[];

	beforeEach(() => {
		// Setup mock repository
		mockRepository = {
			save: jest.fn(),
			findByUuid: jest.fn(),
			findAll: jest.fn(),
			update: jest.fn()
		};

		baseUrl = 'https://api.example.com';

		// Setup mock payment orders
		mockPaymentOrders = [
			{
				uuid: '550e8400-e29b-41d4-a716-446655440000',
				type: 'payment_order',
				amount: 50000,
				description: 'Primera orden',
				countryIsoCode: 'CO',
				createdAt: new Date('2024-01-15T10:30:00Z'),
				paymentUrl: 'https://api.example.com/payment_order/550e8400-e29b-41d4-a716-446655440000',
				status: 'pending',
				attempts: 0
			},
			{
				uuid: '550e8400-e29b-41d4-a716-446655440001',
				type: 'payment_order',
				amount: 25000,
				description: 'Segunda orden',
				countryIsoCode: 'MX',
				createdAt: new Date('2024-01-15T11:00:00Z'),
				paymentUrl: 'https://api.example.com/payment_order/550e8400-e29b-41d4-a716-446655440001',
				status: 'completed',
				attempts: 1,
				provider: 'stripe',
				transactionId: 'txn_12345',
				processedAt: new Date('2024-01-15T11:05:00Z')
			}
		];

		jest.clearAllMocks();
	});

	describe('getAllPaymentOrdersUseCase', () => {
		it('debería retornar todas las órdenes de pago exitosamente', async () => {
			// Arrange
			mockRepository.findAll.mockResolvedValue(mockPaymentOrders);

			const params: GetAllPaymentOrdersParams = {
				repository: mockRepository,
				baseUrl
			};

			// Act
			const result: GetAllPaymentOrdersResult = await getAllPaymentOrdersUseCase(params);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toHaveLength(2);

				// Verificar primera orden
				expect(result.data[0].uuid).toBe('550e8400-e29b-41d4-a716-446655440000');
				expect(result.data[0].attributes.amount).toBe(50000);
				expect(result.data[0].attributes.description).toBe('Primera orden');
				expect(result.data[0].attributes.country_iso_code).toBe('CO');
				expect(result.data[0].attributes.status).toBe('pending');

				// Verificar segunda orden
				expect(result.data[1].uuid).toBe('550e8400-e29b-41d4-a716-446655440001');
				expect(result.data[1].attributes.amount).toBe(25000);
				expect(result.data[1].attributes.description).toBe('Segunda orden');
				expect(result.data[1].attributes.country_iso_code).toBe('MX');
				expect(result.data[1].attributes.status).toBe('completed');
				expect(result.data[1].attributes.provider).toBe('stripe');
				expect(result.data[1].attributes.transaction_id).toBe('txn_12345');
			}

			expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
		});

		it('debería retornar array vacío cuando no hay órdenes de pago', async () => {
			// Arrange
			mockRepository.findAll.mockResolvedValue([]);

			const params: GetAllPaymentOrdersParams = {
				repository: mockRepository,
				baseUrl
			};

			// Act
			const result: GetAllPaymentOrdersResult = await getAllPaymentOrdersUseCase(params);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual([]);
			}

			expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
		});

		it('debería manejar errores del repositorio correctamente', async () => {
			// Arrange
			const repositoryError = new Error('Error de conexión a la base de datos');
			mockRepository.findAll.mockRejectedValue(repositoryError);

			const params: GetAllPaymentOrdersParams = {
				repository: mockRepository,
				baseUrl
			};

			// Act
			const result: GetAllPaymentOrdersResult = await getAllPaymentOrdersUseCase(params);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe('Error de conexión a la base de datos');
			}

			expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
		});

		it('debería manejar errores desconocidos', async () => {
			// Arrange
			mockRepository.findAll.mockRejectedValue('Error string desconocido');

			const params: GetAllPaymentOrdersParams = {
				repository: mockRepository,
				baseUrl
			};

			// Act
			const result: GetAllPaymentOrdersResult = await getAllPaymentOrdersUseCase(params);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe('Error desconocido al obtener las payment orders');
			}
		});

		it('debería mapear correctamente las URLs de pago con el baseUrl proporcionado', async () => {
			// Arrange
			const customBaseUrl = 'https://custom-domain.com';
			mockRepository.findAll.mockResolvedValue([mockPaymentOrders[0]]);

			const params: GetAllPaymentOrdersParams = {
				repository: mockRepository,
				baseUrl: customBaseUrl
			};

			// Act
			const result: GetAllPaymentOrdersResult = await getAllPaymentOrdersUseCase(params);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data[0].attributes.payment_url).toBe(
					'https://custom-domain.com/api/payment_order/550e8400-e29b-41d4-a716-446655440000'
				);
			}
		});

		it('debería preservar todos los campos opcionales cuando están presentes', async () => {
			// Arrange
			const completePaymentOrder: PaymentOrder = {
				uuid: '550e8400-e29b-41d4-a716-446655440000',
				type: 'payment_order',
				amount: 75000,
				description: 'Orden completa',
				countryIsoCode: 'BR',
				createdAt: new Date('2024-01-15T12:00:00Z'),
				paymentUrl: 'https://api.example.com/payment_order/550e8400-e29b-41d4-a716-446655440000',
				status: 'failed',
				attempts: 3,
				provider: 'paypal',
				transactionId: 'txn_failed_67890',
				processedAt: new Date('2024-01-15T12:10:00Z')
			};

			mockRepository.findAll.mockResolvedValue([completePaymentOrder]);

			const params: GetAllPaymentOrdersParams = {
				repository: mockRepository,
				baseUrl
			};

			// Act
			const result: GetAllPaymentOrdersResult = await getAllPaymentOrdersUseCase(params);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				const dto = result.data[0];
				expect(dto.attributes.status).toBe('failed');
				expect(dto.attributes.attempts).toBe(3);
				expect(dto.attributes.provider).toBe('paypal');
				expect(dto.attributes.transaction_id).toBe('txn_failed_67890');
				expect(dto.attributes.processed_at).toBe('2024-01-15T12:10:00.000Z');
			}
		});

		it('debería manejar órdenes con campos opcionales undefined', async () => {
			// Arrange
			const minimalPaymentOrder: PaymentOrder = {
				uuid: '550e8400-e29b-41d4-a716-446655440000',
				type: 'payment_order',
				amount: 30000,
				description: 'Orden mínima',
				countryIsoCode: 'AR',
				createdAt: new Date('2024-01-15T13:00:00Z'),
				paymentUrl: 'https://api.example.com/payment_order/550e8400-e29b-41d4-a716-446655440000'
			};

			mockRepository.findAll.mockResolvedValue([minimalPaymentOrder]);

			const params: GetAllPaymentOrdersParams = {
				repository: mockRepository,
				baseUrl
			};

			// Act
			const result: GetAllPaymentOrdersResult = await getAllPaymentOrdersUseCase(params);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				const dto = result.data[0];
				expect(dto.attributes.status).toBe('completed'); // Valor por defecto
				expect(dto.attributes.attempts).toBe(0); // Valor por defecto
				expect(dto.attributes.provider).toBe(''); // Valor por defecto
				expect(dto.attributes.processed_at).toBeUndefined();
				expect(dto.attributes.transaction_id).toBeUndefined();
			}
		});
	});
});
