import {
	createPaymentOrderUseCase,
	validateCreatePaymentOrderDto,
	CreatePaymentOrderParams,
	CreatePaymentOrderResult
} from 'src/application/use-cases/createPaymentOrder';
import { CreatePaymentOrderDto } from 'src/application/dtos';
import { PaymentOrderRepository } from 'src/application/ports';
import { PaymentOrder } from 'src/domain/entities';

// Mock del módulo uuid
jest.mock('uuid', () => ({
	v4: jest.fn(() => 'mocked-uuid-1234')
}));

describe('CreatePaymentOrder Use Case', () => {
	let mockRepository: jest.Mocked<PaymentOrderRepository>;
	let validDto: CreatePaymentOrderDto;
	let baseUrl: string;

	beforeEach(() => {
		// Setup mock repository
		mockRepository = {
			save: jest.fn(),
			findByUuid: jest.fn(),
			findAll: jest.fn(),
			update: jest.fn()
		};

		// Setup valid DTO
		validDto = {
			amount: 50000,
			description: 'Compra de productos',
			countryIsoCode: 'CO'
		};

		baseUrl = 'https://api.example.com';

		jest.clearAllMocks();
	});

	describe('createPaymentOrderUseCase', () => {
		it('debería crear una payment order exitosamente con datos válidos', async () => {
			// Arrange
			const savedPaymentOrder: PaymentOrder = {
				uuid: 'mocked-uuid-1234',
				type: 'payment_order',
				amount: 50000,
				description: 'Compra de productos',
				countryIsoCode: 'CO',
				createdAt: new Date('2024-01-15T10:30:00Z'),
				paymentUrl: 'https://api.example.com/payment_order/mocked-uuid-1234',
				status: 'pending',
				attempts: 0
			};

			mockRepository.save.mockResolvedValue(savedPaymentOrder);

			const params: CreatePaymentOrderParams = {
				dto: validDto,
				repository: mockRepository,
				baseUrl
			};

			// Act
			const result: CreatePaymentOrderResult = await createPaymentOrderUseCase(params);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.uuid).toBe('mocked-uuid-1234');
				expect(result.data.attributes.amount).toBe(50000);
				expect(result.data.attributes.description).toBe('Compra de productos');
				expect(result.data.attributes.country_iso_code).toBe('CO');
				expect(result.data.attributes.status).toBe('pending');
				expect(result.data.attributes.payment_url).toBe(
					'https://api.example.com/api/payment_order/mocked-uuid-1234'
				);
			}

			expect(mockRepository.save).toHaveBeenCalledTimes(1);
			expect(mockRepository.save).toHaveBeenCalledWith({
				uuid: 'mocked-uuid-1234',
				type: 'payment_order',
				amount: 50000,
				description: 'Compra de productos',
				countryIsoCode: 'CO',
				createdAt: expect.any(Date),
				paymentUrl: 'https://api.example.com/payment_order/mocked-uuid-1234',
				status: 'pending',
				attempts: 0
			});
		});

		it('debería manejar errores del repositorio correctamente', async () => {
			// Arrange
			const repositoryError = new Error('Error de conexión a la base de datos');
			mockRepository.save.mockRejectedValue(repositoryError);

			const params: CreatePaymentOrderParams = {
				dto: validDto,
				repository: mockRepository,
				baseUrl
			};

			// Act
			const result: CreatePaymentOrderResult = await createPaymentOrderUseCase(params);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe('Error de conexión a la base de datos');
			}

			expect(mockRepository.save).toHaveBeenCalledTimes(1);
		});

		it('debería manejar errores desconocidos', async () => {
			// Arrange
			mockRepository.save.mockRejectedValue('Error string desconocido');

			const params: CreatePaymentOrderParams = {
				dto: validDto,
				repository: mockRepository,
				baseUrl
			};

			// Act
			const result: CreatePaymentOrderResult = await createPaymentOrderUseCase(params);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe('Error desconocido al crear la payment order');
			}
		});

		it('debería generar UUID único para cada payment order', async () => {
			// Arrange
			const savedPaymentOrder: PaymentOrder = {
				uuid: 'mocked-uuid-1234',
				type: 'payment_order',
				amount: 25000,
				description: 'Test order',
				countryIsoCode: 'MX',
				createdAt: new Date(),
				paymentUrl: 'https://api.example.com/payment_order/mocked-uuid-1234',
				status: 'pending',
				attempts: 0
			};

			mockRepository.save.mockResolvedValue(savedPaymentOrder);

			const params: CreatePaymentOrderParams = {
				dto: { amount: 25000, description: 'Test order', countryIsoCode: 'MX' },
				repository: mockRepository,
				baseUrl
			};

			// Act
			await createPaymentOrderUseCase(params);

			// Assert
			const savedCallArgs = mockRepository.save.mock.calls[0][0];
			expect(savedCallArgs.uuid).toBe('mocked-uuid-1234');
			expect(savedCallArgs.paymentUrl).toContain('mocked-uuid-1234');
		});

		it('debería configurar correctamente la URL de pago', async () => {
			// Arrange
			const customBaseUrl = 'https://custom-api.com';
			const savedPaymentOrder: PaymentOrder = {
				uuid: 'mocked-uuid-1234',
				type: 'payment_order',
				amount: 30000,
				description: 'URL test',
				countryIsoCode: 'US',
				createdAt: new Date(),
				paymentUrl: 'https://custom-api.com/payment_order/mocked-uuid-1234',
				status: 'pending',
				attempts: 0
			};

			mockRepository.save.mockResolvedValue(savedPaymentOrder);

			const params: CreatePaymentOrderParams = {
				dto: { amount: 30000, description: 'URL test', countryIsoCode: 'US' },
				repository: mockRepository,
				baseUrl: customBaseUrl
			};

			// Act
			const result = await createPaymentOrderUseCase(params);

			// Assert
			if (result.success) {
				expect(result.data.attributes.payment_url).toBe(
					'https://custom-api.com/api/payment_order/mocked-uuid-1234'
				);
			}
		});
	});

	describe('validateCreatePaymentOrderDto', () => {
		it('debería retornar array vacío para DTO válido', () => {
			// Act
			const errors = validateCreatePaymentOrderDto(validDto);

			// Assert
			expect(errors).toEqual([]);
		});

		it('debería validar que el monto sea mayor a 0', () => {
			// Arrange
			const invalidDto = { ...validDto, amount: 0 };

			// Act
			const errors = validateCreatePaymentOrderDto(invalidDto);

			// Assert
			expect(errors).toContain('El monto debe ser mayor a 0');
		});

		it('debería validar que el monto no sea negativo', () => {
			// Arrange
			const invalidDto = { ...validDto, amount: -100 };

			// Act
			const errors = validateCreatePaymentOrderDto(invalidDto);

			// Assert
			expect(errors).toContain('El monto debe ser mayor a 0');
		});

		it('debería validar que la descripción sea requerida', () => {
			// Arrange
			const invalidDto = { ...validDto, description: '' };

			// Act
			const errors = validateCreatePaymentOrderDto(invalidDto);

			// Assert
			expect(errors).toContain('La descripción es requerida');
		});

		it('debería validar que la descripción no sea solo espacios', () => {
			// Arrange
			const invalidDto = { ...validDto, description: '   ' };

			// Act
			const errors = validateCreatePaymentOrderDto(invalidDto);

			// Assert
			expect(errors).toContain('La descripción es requerida');
		});

		it('debería validar que la descripción no sea muy larga', () => {
			// Arrange
			const longDescription = 'a'.repeat(256);
			const invalidDto = { ...validDto, description: longDescription };

			// Act
			const errors = validateCreatePaymentOrderDto(invalidDto);

			// Assert
			expect(errors).toContain('La descripción es muy larga');
		});

		it('debería validar el formato del código ISO del país', () => {
			// Arrange
			const testCases = [
				{
					countryIsoCode: '',
					expectedError: 'El código ISO del país debe tener exactamente 2 caracteres en mayúsculas'
				},
				{
					countryIsoCode: 'C',
					expectedError: 'El código ISO del país debe tener exactamente 2 caracteres en mayúsculas'
				},
				{
					countryIsoCode: 'COL',
					expectedError: 'El código ISO del país debe tener exactamente 2 caracteres en mayúsculas'
				},
				{
					countryIsoCode: 'co',
					expectedError: 'El código ISO del país debe tener exactamente 2 caracteres en mayúsculas'
				},
				{
					countryIsoCode: 'C1',
					expectedError: 'El código ISO del país debe tener exactamente 2 caracteres en mayúsculas'
				}
			];

			// Act & Assert
			testCases.forEach(({ countryIsoCode, expectedError }) => {
				const invalidDto = { ...validDto, countryIsoCode };
				const errors = validateCreatePaymentOrderDto(invalidDto);
				expect(errors).toContain(expectedError);
			});
		});

		it('debería acumular múltiples errores de validación', () => {
			// Arrange
			const invalidDto = {
				amount: -50,
				description: '',
				countryIsoCode: 'invalid'
			};

			// Act
			const errors = validateCreatePaymentOrderDto(invalidDto);

			// Assert
			expect(errors).toHaveLength(3);
			expect(errors).toContain('El monto debe ser mayor a 0');
			expect(errors).toContain('La descripción es requerida');
			expect(errors).toContain(
				'El código ISO del país debe tener exactamente 2 caracteres en mayúsculas'
			);
		});

		it('debería aceptar descripciones de longitud máxima válida', () => {
			// Arrange
			const validDescription = 'a'.repeat(255);
			const validDtoWithMaxDescription = { ...validDto, description: validDescription };

			// Act
			const errors = validateCreatePaymentOrderDto(validDtoWithMaxDescription);

			// Assert
			expect(errors).toEqual([]);
		});
	});
});
