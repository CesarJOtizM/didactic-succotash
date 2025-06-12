import { PaymentOrder } from 'src/domain/entities';
import { PaymentMethod, PaymentMethodType } from 'src/domain/entities/paymentMethod';
import { PaymentOrderRepository } from 'src/application/ports';

// Factory para crear PaymentOrder mock
export const createMockPaymentOrder = (overrides: Partial<PaymentOrder> = {}): PaymentOrder => ({
	uuid: '550e8400-e29b-41d4-a716-446655440000',
	type: 'payment_order',
	amount: 50000,
	description: 'Test payment order',
	countryIsoCode: 'CO',
	createdAt: new Date('2024-01-15T10:30:00Z'),
	paymentUrl: 'https://api.example.com/payment_order/550e8400-e29b-41d4-a716-446655440000',
	status: 'pending',
	attempts: 0,
	...overrides
});

// Factory para crear PaymentMethod mock
export const createMockPaymentMethod = (overrides: Partial<PaymentMethod> = {}): PaymentMethod => ({
	id: '1',
	name: 'Test Payment Method',
	type: 'credit_card' as PaymentMethodType,
	countryIsoCode: 'CO',
	enabled: true,
	configuration: {
		minAmount: 1000,
		maxAmount: 100000,
		currency: 'COP',
		fees: {
			fixed: 2900,
			percentage: 2.5
		}
	},
	metadata: {
		displayName: 'Test Payment Method',
		description: 'Test payment method for testing',
		supported_currencies: ['COP'],
		requires_document: false,
		instant_payment: true
	},
	...overrides
});

// Mock completo del repositorio
export const createMockRepository = (): jest.Mocked<PaymentOrderRepository> => ({
	save: jest.fn(),
	findByUuid: jest.fn(),
	findAll: jest.fn(),
	update: jest.fn()
});

// Datos de test comunes
export const TEST_CONSTANTS = {
	VALID_UUID: '550e8400-e29b-41d4-a716-446655440000',
	INVALID_UUID: 'invalid-uuid',
	BASE_URL: 'https://api.example.com',
	CUSTOM_BASE_URL: 'https://custom-api.com',
	VALID_COUNTRY_CODES: ['CO', 'MX', 'US', 'BR', 'AR'],
	INVALID_COUNTRY_CODES: ['', 'C', 'COL', 'co', '12'],
	VALID_AMOUNTS: [1000, 50000, 100000, 999999],
	INVALID_AMOUNTS: [0, -100, -0.01]
};

// Helper para crear múltiples payment orders
export const createMockPaymentOrders = (count: number): PaymentOrder[] => {
	return Array.from({ length: count }, (_, index) =>
		createMockPaymentOrder({
			uuid: `550e8400-e29b-41d4-a716-44665544000${index}`,
			description: `Test payment order ${index + 1}`,
			amount: 10000 * (index + 1)
		})
	);
};

// Helper para crear múltiples payment methods
export const createMockPaymentMethods = (count: number): PaymentMethod[] => {
	const types: PaymentMethodType[] = [
		'credit_card',
		'debit_card',
		'bank_transfer',
		'digital_wallet',
		'cash'
	];

	return Array.from({ length: count }, (_, index) =>
		createMockPaymentMethod({
			id: `${index + 1}`,
			name: `Payment Method ${index + 1}`,
			type: types[index % types.length],
			configuration: {
				...createMockPaymentMethod().configuration,
				minAmount: 1000 * (index + 1),
				maxAmount: 100000 * (index + 1)
			}
		})
	);
};

// Helper para limpiar mocks
export const clearAllMocks = (
	...mocks: jest.MockedFunction<(...args: unknown[]) => unknown>[]
): void => {
	mocks.forEach(mock => mock.mockClear());
	jest.clearAllMocks();
};

// Helper para verificar estructura de response DTO
export const expectValidPaymentOrderResponseDto = (dto: Record<string, unknown>): void => {
	expect(dto).toHaveProperty('uuid');
	expect(dto).toHaveProperty('type', 'payment_order');
	expect(dto).toHaveProperty('attributes');
	expect(dto.attributes).toHaveProperty('amount');
	expect(dto.attributes).toHaveProperty('description');
	expect(dto.attributes).toHaveProperty('country_iso_code');
	expect(dto.attributes).toHaveProperty('created_at');
	expect(dto.attributes).toHaveProperty('payment_url');
	expect(dto.attributes).toHaveProperty('status');
	expect(dto.attributes).toHaveProperty('provider');
	expect(dto.attributes).toHaveProperty('attempts');
};

// Helper para simular delays en tests async
export const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Helper para generar fechas de test
export const generateTestDates = () => ({
	createdAt: new Date('2024-01-15T10:30:00Z'),
	processedAt: new Date('2024-01-15T10:35:00Z'),
	futureDate: new Date('2024-12-31T23:59:59Z'),
	pastDate: new Date('2023-01-01T00:00:00Z')
});

// Helper para configurar console mocks
export const setupConsoleMocks = (): void => {
	console.info = jest.fn();
	console.error = jest.fn();
	console.warn = jest.fn();
	console.log = jest.fn();
};

// Helper para restaurar console
export const restoreConsoleMocks = (): void => {
	jest.restoreAllMocks();
};
