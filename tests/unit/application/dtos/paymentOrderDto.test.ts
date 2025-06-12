import {
	mapPaymentOrderToResponseDto,
	mapCreateDtoToPaymentOrder,
	mapToProcessPaymentSuccessResponse,
	mapToProcessPaymentErrorResponse,
	CreatePaymentOrderDto,
	PaymentOrderResponseDto,
	ProcessPaymentSuccessResponseDto,
	ProcessPaymentErrorResponseDto
} from 'src/application/dtos/paymentOrderDto';
import { PaymentOrder } from 'src/domain/entities';
import { createMockPaymentOrder, TEST_CONSTANTS } from '../../../helpers/testHelpers';

describe('PaymentOrder DTOs and Mappers', () => {
	describe('mapPaymentOrderToResponseDto', () => {
		it('debería mapear correctamente una PaymentOrder completa a ResponseDto', () => {
			// Arrange
			const paymentOrder: PaymentOrder = createMockPaymentOrder({
				uuid: 'test-uuid-123',
				amount: 75000,
				description: 'Compra de productos',
				countryIsoCode: 'CO',
				createdAt: new Date('2024-01-15T10:30:00Z'),
				status: 'completed',
				provider: 'stripe',
				attempts: 2,
				transactionId: 'txn_abc123',
				processedAt: new Date('2024-01-15T10:35:00Z')
			});

			const baseUrl = 'https://api.example.com';

			// Act
			const result: PaymentOrderResponseDto = mapPaymentOrderToResponseDto(paymentOrder, baseUrl);

			// Assert
			expect(result).toEqual({
				uuid: 'test-uuid-123',
				type: 'payment_order',
				attributes: {
					amount: 75000,
					description: 'Compra de productos',
					country_iso_code: 'CO',
					created_at: '2024-01-15T10:30:00.000Z',
					payment_url: 'https://api.example.com/api/payment_order/test-uuid-123',
					status: 'completed',
					provider: 'stripe',
					attempts: 2,
					transaction_id: 'txn_abc123',
					processed_at: '2024-01-15T10:35:00.000Z'
				}
			});
		});

		it('debería mapear PaymentOrder con campos opcionales undefined', () => {
			// Arrange
			const paymentOrder: PaymentOrder = {
				uuid: 'minimal-uuid',
				type: 'payment_order',
				amount: 25000,
				description: 'Orden mínima',
				countryIsoCode: 'MX',
				createdAt: new Date('2024-01-15T12:00:00Z'),
				paymentUrl: 'https://api.example.com/payment_order/minimal-uuid'
				// Sin campos opcionales
			};

			const baseUrl = 'https://test-api.com';

			// Act
			const result = mapPaymentOrderToResponseDto(paymentOrder, baseUrl);

			// Assert
			expect(result.attributes.status).toBe('completed'); // Valor por defecto
			expect(result.attributes.provider).toBe(''); // Valor por defecto
			expect(result.attributes.attempts).toBe(0); // Valor por defecto
			expect(result.attributes.processed_at).toBeUndefined();
			expect(result.attributes.transaction_id).toBeUndefined();
			expect(result.attributes.payment_url).toBe(
				'https://test-api.com/api/payment_order/minimal-uuid'
			);
		});

		it('debería incluir métodos de pago disponibles cuando se proporcionan', () => {
			// Arrange
			const paymentOrder = createMockPaymentOrder();
			const availablePaymentMethods = [
				{
					id: '1',
					name: 'Credit Card',
					type: 'credit_card',
					country_iso_code: 'CO',
					enabled: true,
					configuration: {
						min_amount: 1000,
						max_amount: 100000,
						currency: 'COP'
					},
					metadata: {
						display_name: 'Tarjeta de Crédito',
						description: 'Pago con tarjeta',
						supported_currencies: ['COP']
					}
				}
			];

			// Act
			const result = mapPaymentOrderToResponseDto(
				paymentOrder,
				TEST_CONSTANTS.BASE_URL,
				availablePaymentMethods
			);

			// Assert
			expect(result.available_payment_methods).toEqual(availablePaymentMethods);
		});

		it('debería manejar diferentes baseUrls correctamente', () => {
			// Arrange
			const paymentOrder = createMockPaymentOrder({ uuid: 'url-test-uuid' });
			const testCases = [
				{
					baseUrl: 'https://api.example.com',
					expected: 'https://api.example.com/api/payment_order/url-test-uuid'
				},
				{
					baseUrl: 'http://localhost:3000',
					expected: 'http://localhost:3000/api/payment_order/url-test-uuid'
				},
				{
					baseUrl: 'https://prod.api.com/',
					expected: 'https://prod.api.com//api/payment_order/url-test-uuid'
				}
			];

			// Act & Assert
			testCases.forEach(({ baseUrl, expected }) => {
				const result = mapPaymentOrderToResponseDto(paymentOrder, baseUrl);
				expect(result.attributes.payment_url).toBe(expected);
			});
		});
	});

	describe('mapCreateDtoToPaymentOrder', () => {
		it('debería mapear CreateDto a PaymentOrderResponse correctamente', () => {
			// Arrange
			const dto: CreatePaymentOrderDto = {
				amount: 50000,
				description: 'Test payment',
				countryIsoCode: 'BR'
			};
			const uuid = 'create-test-uuid';
			const baseUrl = 'https://api.test.com';

			// Act
			const result = mapCreateDtoToPaymentOrder(dto, uuid, baseUrl);

			// Assert
			expect(result.uuid).toBe(uuid);
			expect(result.type).toBe('payment_order');
			expect(result.attributes.amount).toBe(50000);
			expect(result.attributes.description).toBe('Test payment');
			expect(result.attributes.country_iso_code).toBe('BR');
			expect(result.attributes.payment_url).toBe(
				'https://api.test.com/api/payment_order/create-test-uuid'
			);
			expect(result.attributes.created_at).toBeDefined();
		});

		it('debería generar fecha de creación válida', () => {
			// Arrange
			const dto: CreatePaymentOrderDto = {
				amount: 30000,
				description: 'Date test',
				countryIsoCode: 'AR'
			};
			const uuid = 'date-test-uuid';
			const baseUrl = 'https://api.test.com';

			// Act
			const result = mapCreateDtoToPaymentOrder(dto, uuid, baseUrl);

			const createdDate = new Date(result.attributes.created_at);

			// Assert - Solo verificar que sea una fecha válida
			expect(createdDate).toBeInstanceOf(Date);
			expect(createdDate.getTime()).not.toBeNaN();
		});
	});

	describe('mapToProcessPaymentSuccessResponse', () => {
		it('debería crear respuesta de éxito correctamente', () => {
			// Arrange
			const transactionId = 'txn_success_12345';

			// Act
			const result: ProcessPaymentSuccessResponseDto =
				mapToProcessPaymentSuccessResponse(transactionId);

			// Assert
			expect(result).toEqual({
				status: 'success',
				transaction_id: 'txn_success_12345'
			});
		});

		it('debería manejar diferentes formatos de transaction ID', () => {
			// Arrange
			const testCases = [
				'txn_12345',
				'stripe_pi_1234567890',
				'paypal_TRANSACTION_ABC123',
				'simple_id',
				'123456789'
			];

			// Act & Assert
			testCases.forEach(transactionId => {
				const result = mapToProcessPaymentSuccessResponse(transactionId);
				expect(result.status).toBe('success');
				expect(result.transaction_id).toBe(transactionId);
			});
		});
	});

	describe('mapToProcessPaymentErrorResponse', () => {
		it('debería crear respuesta de error correctamente', () => {
			// Arrange
			const transactionId = 'txn_failed_67890';

			// Act
			const result: ProcessPaymentErrorResponseDto =
				mapToProcessPaymentErrorResponse(transactionId);

			// Assert
			expect(result).toEqual({
				status: 'Error',
				transaction_id: 'txn_failed_67890'
			});
		});

		it('debería manejar transaction IDs de pagos fallidos', () => {
			// Arrange
			const testCases = [
				'txn_failed_12345',
				'error_stripe_12345',
				'declined_paypal_67890',
				'timeout_transaction_abc'
			];

			// Act & Assert
			testCases.forEach(transactionId => {
				const result = mapToProcessPaymentErrorResponse(transactionId);
				expect(result.status).toBe('Error');
				expect(result.transaction_id).toBe(transactionId);
			});
		});
	});

	describe('DTO Interfaces', () => {
		it('CreatePaymentOrderDto debería aceptar solo campos requeridos', () => {
			// Arrange & Assert - Verificar que el tipo acepta solo los campos requeridos
			const validDto: CreatePaymentOrderDto = {
				amount: 40000,
				description: 'Interfaz test',
				countryIsoCode: 'PE'
			};

			expect(validDto.amount).toBe(40000);
			expect(validDto.description).toBe('Interfaz test');
			expect(validDto.countryIsoCode).toBe('PE');
		});

		it('PaymentOrderResponseDto debería tener estructura correcta', () => {
			// Arrange
			const responseDto: PaymentOrderResponseDto = {
				uuid: 'interface-test-uuid',
				type: 'payment_order',
				attributes: {
					amount: 60000,
					description: 'Structure test',
					country_iso_code: 'CL',
					created_at: '2024-01-15T15:00:00Z',
					payment_url: 'https://api.test.com/payment_order/interface-test-uuid',
					status: 'pending',
					provider: 'test-provider',
					attempts: 1,
					processed_at: '2024-01-15T15:05:00Z',
					transaction_id: 'txn_interface_test'
				}
			};

			// Assert
			expect(responseDto.uuid).toBeDefined();
			expect(responseDto.type).toBe('payment_order');
			expect(responseDto.attributes).toBeDefined();
			expect(typeof responseDto.attributes.amount).toBe('number');
			expect(typeof responseDto.attributes.description).toBe('string');
			expect(typeof responseDto.attributes.country_iso_code).toBe('string');
		});

		it('ProcessPaymentResponseDto debería ser union type correcto', () => {
			// Arrange & Act
			const successResponse: ProcessPaymentSuccessResponseDto = {
				status: 'success',
				transaction_id: 'txn_union_success'
			};

			const errorResponse: ProcessPaymentErrorResponseDto = {
				status: 'Error',
				transaction_id: 'txn_union_error'
			};

			// Assert - TypeScript debería permitir ambos tipos
			expect(successResponse.status).toBe('success');
			expect(errorResponse.status).toBe('Error');
		});
	});

	describe('Edge Cases and Error Handling', () => {
		it('debería manejar UUIDs extremadamente largos', () => {
			// Arrange
			const longUuid = 'a'.repeat(100);
			const paymentOrder = createMockPaymentOrder({ uuid: longUuid });

			// Act
			const result = mapPaymentOrderToResponseDto(paymentOrder, TEST_CONSTANTS.BASE_URL);

			// Assert
			expect(result.uuid).toBe(longUuid);
			expect(result.attributes.payment_url).toContain(longUuid);
		});

		it('debería manejar descripciones con caracteres especiales', () => {
			// Arrange
			const specialDescription = 'Pago con émojis 🎉💳 y "comillas" & símbolos <test>';
			const paymentOrder = createMockPaymentOrder({ description: specialDescription });

			// Act
			const result = mapPaymentOrderToResponseDto(paymentOrder, TEST_CONSTANTS.BASE_URL);

			// Assert
			expect(result.attributes.description).toBe(specialDescription);
		});

		it('debería preservar precisión de montos decimales', () => {
			// Arrange
			const preciseAmount = 99.99;
			const paymentOrder = createMockPaymentOrder({ amount: preciseAmount });

			// Act
			const result = mapPaymentOrderToResponseDto(paymentOrder, TEST_CONSTANTS.BASE_URL);

			// Assert
			expect(result.attributes.amount).toBe(preciseAmount);
		});
	});
});
