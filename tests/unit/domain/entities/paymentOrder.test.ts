import {
	PaymentOrder,
	isValidAmount,
	isValidCountryIsoCode
} from 'src/domain/entities/paymentOrder';

describe('PaymentOrder Entity', () => {
	describe('isValidAmount', () => {
		it('debería retornar true para montos positivos', () => {
			// Arrange & Act & Assert
			expect(isValidAmount(100)).toBe(true);
			expect(isValidAmount(0.01)).toBe(true);
			expect(isValidAmount(1000000)).toBe(true);
		});

		it('debería retornar false para montos negativos o cero', () => {
			// Arrange & Act & Assert
			expect(isValidAmount(0)).toBe(false);
			expect(isValidAmount(-1)).toBe(false);
			expect(isValidAmount(-100.5)).toBe(false);
		});

		it('debería manejar números decimales correctamente', () => {
			// Arrange & Act & Assert
			expect(isValidAmount(99.99)).toBe(true);
			expect(isValidAmount(0.001)).toBe(true);
		});
	});

	describe('isValidCountryIsoCode', () => {
		it('debería retornar true para códigos ISO válidos', () => {
			// Arrange & Act & Assert
			expect(isValidCountryIsoCode('CO')).toBe(true);
			expect(isValidCountryIsoCode('US')).toBe(true);
			expect(isValidCountryIsoCode('MX')).toBe(true);
			expect(isValidCountryIsoCode('BR')).toBe(true);
		});

		it('debería retornar false para códigos ISO inválidos', () => {
			// Arrange & Act & Assert
			expect(isValidCountryIsoCode('COL')).toBe(false); // Muy largo
			expect(isValidCountryIsoCode('C')).toBe(false); // Muy corto
			expect(isValidCountryIsoCode('co')).toBe(false); // Minúsculas
			expect(isValidCountryIsoCode('C0')).toBe(false); // Con números
			expect(isValidCountryIsoCode('')).toBe(false); // Vacío
			expect(isValidCountryIsoCode('12')).toBe(false); // Solo números
		});

		it('debería retornar false para caracteres especiales', () => {
			// Arrange & Act & Assert
			expect(isValidCountryIsoCode('C-')).toBe(false);
			expect(isValidCountryIsoCode('C@')).toBe(false);
			expect(isValidCountryIsoCode('C_')).toBe(false);
		});
	});

	describe('PaymentOrder Interface', () => {
		it('debería permitir crear una PaymentOrder con todos los campos requeridos', () => {
			// Arrange
			const paymentOrder: PaymentOrder = {
				uuid: '550e8400-e29b-41d4-a716-446655440000',
				type: 'payment_order',
				amount: 50000,
				description: 'Compra de productos',
				countryIsoCode: 'CO',
				createdAt: new Date('2024-01-15T10:30:00Z'),
				paymentUrl: 'https://api.example.com/payment_order/550e8400-e29b-41d4-a716-446655440000'
			};

			// Assert
			expect(paymentOrder.uuid).toBe('550e8400-e29b-41d4-a716-446655440000');
			expect(paymentOrder.type).toBe('payment_order');
			expect(paymentOrder.amount).toBe(50000);
			expect(paymentOrder.description).toBe('Compra de productos');
			expect(paymentOrder.countryIsoCode).toBe('CO');
			expect(paymentOrder.paymentUrl).toBe(
				'https://api.example.com/payment_order/550e8400-e29b-41d4-a716-446655440000'
			);
		});

		it('debería permitir crear una PaymentOrder con campos opcionales', () => {
			// Arrange
			const paymentOrder: PaymentOrder = {
				uuid: '550e8400-e29b-41d4-a716-446655440000',
				type: 'payment_order',
				amount: 25000,
				description: 'Pago de servicios',
				countryIsoCode: 'US',
				createdAt: new Date('2024-01-15T10:30:00Z'),
				paymentUrl: 'https://api.example.com/payment_order/550e8400-e29b-41d4-a716-446655440000',
				status: 'completed',
				provider: 'stripe',
				attempts: 1,
				processedAt: new Date('2024-01-15T10:35:00Z'),
				transactionId: 'txn_1234567890'
			};

			// Assert
			expect(paymentOrder.status).toBe('completed');
			expect(paymentOrder.provider).toBe('stripe');
			expect(paymentOrder.attempts).toBe(1);
			expect(paymentOrder.transactionId).toBe('txn_1234567890');
			expect(paymentOrder.processedAt).toEqual(new Date('2024-01-15T10:35:00Z'));
		});

		it('debería permitir PaymentOrder sin campos opcionales', () => {
			// Arrange
			const paymentOrder: PaymentOrder = {
				uuid: '550e8400-e29b-41d4-a716-446655440000',
				type: 'payment_order',
				amount: 15000,
				description: 'Pago básico',
				countryIsoCode: 'MX',
				createdAt: new Date(),
				paymentUrl: 'https://api.example.com/payment_order/550e8400-e29b-41d4-a716-446655440000'
			};

			// Assert
			expect(paymentOrder.status).toBeUndefined();
			expect(paymentOrder.provider).toBeUndefined();
			expect(paymentOrder.attempts).toBeUndefined();
			expect(paymentOrder.processedAt).toBeUndefined();
			expect(paymentOrder.transactionId).toBeUndefined();
		});
	});

	describe('PaymentOrder Business Logic', () => {
		it('debería validar coherencia entre campos relacionados', () => {
			// Arrange
			const paymentOrder: PaymentOrder = {
				uuid: '550e8400-e29b-41d4-a716-446655440000',
				type: 'payment_order',
				amount: 75000,
				description: 'Test payment',
				countryIsoCode: 'CO',
				createdAt: new Date('2024-01-15T10:30:00Z'),
				paymentUrl: 'https://api.example.com/payment_order/550e8400-e29b-41d4-a716-446655440000',
				status: 'completed',
				processedAt: new Date('2024-01-15T10:35:00Z')
			};

			// Assert
			expect(isValidAmount(paymentOrder.amount)).toBe(true);
			expect(isValidCountryIsoCode(paymentOrder.countryIsoCode)).toBe(true);
			expect(paymentOrder.processedAt!.getTime()).toBeGreaterThan(paymentOrder.createdAt.getTime());
		});

		it('debería validar que el UUID esté presente en la URL de pago', () => {
			// Arrange
			const uuid = '550e8400-e29b-41d4-a716-446655440000';
			const paymentOrder: PaymentOrder = {
				uuid,
				type: 'payment_order',
				amount: 30000,
				description: 'URL validation test',
				countryIsoCode: 'BR',
				createdAt: new Date(),
				paymentUrl: `https://api.example.com/payment_order/${uuid}`
			};

			// Assert
			expect(paymentOrder.paymentUrl).toContain(uuid);
		});
	});
});
