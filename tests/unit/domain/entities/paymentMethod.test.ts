import {
	PaymentMethod,
	PaymentMethodType,
	createPaymentMethod,
	isPaymentMethodAvailableForAmount,
	calculatePaymentMethodFees
} from 'src/domain/entities/paymentMethod';

describe('PaymentMethod Entity', () => {
	describe('createPaymentMethod', () => {
		it('debería crear un método de pago válido con todos los campos requeridos', () => {
			// Arrange
			const params = {
				id: '1',
				name: 'Tarjeta de Crédito',
				type: 'credit_card' as PaymentMethodType,
				countryIsoCode: 'CO',
				enabled: true,
				configuration: {
					minAmount: 1000,
					maxAmount: 50000000,
					currency: 'COP',
					processingTime: '24h',
					fees: {
						fixed: 2900,
						percentage: 2.5
					}
				},
				metadata: {
					displayName: 'Tarjeta de Crédito Visa/Mastercard',
					description: 'Pago con tarjeta de crédito',
					iconUrl: 'https://example.com/credit-card.png',
					supported_currencies: ['COP', 'USD'],
					requires_document: true,
					instant_payment: false
				}
			};

			// Act
			const paymentMethod = createPaymentMethod(params);

			// Assert
			expect(paymentMethod).toEqual(params);
			expect(paymentMethod.id).toBe('1');
			expect(paymentMethod.type).toBe('credit_card');
			expect(paymentMethod.enabled).toBe(true);
		});

		it('debería crear un método de pago con configuración mínima', () => {
			// Arrange
			const params = {
				id: '2',
				name: 'Efectivo',
				type: 'cash' as PaymentMethodType,
				countryIsoCode: 'CO',
				enabled: true,
				configuration: {
					currency: 'COP'
				},
				metadata: {
					displayName: 'Pago en Efectivo',
					description: 'Pago en efectivo en punto físico',
					supported_currencies: ['COP']
				}
			};

			// Act
			const paymentMethod = createPaymentMethod(params);

			// Assert
			expect(paymentMethod.configuration.minAmount).toBeUndefined();
			expect(paymentMethod.configuration.maxAmount).toBeUndefined();
			expect(paymentMethod.configuration.fees).toBeUndefined();
			expect(paymentMethod.metadata.iconUrl).toBeUndefined();
		});
	});

	describe('isPaymentMethodAvailableForAmount', () => {
		const basePaymentMethod: PaymentMethod = {
			id: '1',
			name: 'Test Method',
			type: 'credit_card',
			countryIsoCode: 'CO',
			enabled: true,
			configuration: {
				minAmount: 1000,
				maxAmount: 50000,
				currency: 'COP'
			},
			metadata: {
				displayName: 'Test Method',
				description: 'Test description',
				supported_currencies: ['COP']
			}
		};

		it('debería retornar true para montos dentro del rango permitido', () => {
			// Arrange
			const amount = 25000;

			// Act
			const isAvailable = isPaymentMethodAvailableForAmount(basePaymentMethod, amount);

			// Assert
			expect(isAvailable).toBe(true);
		});

		it('debería retornar false para montos menores al mínimo', () => {
			// Arrange
			const amount = 500;

			// Act
			const isAvailable = isPaymentMethodAvailableForAmount(basePaymentMethod, amount);

			// Assert
			expect(isAvailable).toBe(false);
		});

		it('debería retornar false para montos mayores al máximo', () => {
			// Arrange
			const amount = 100000;

			// Act
			const isAvailable = isPaymentMethodAvailableForAmount(basePaymentMethod, amount);

			// Assert
			expect(isAvailable).toBe(false);
		});

		it('debería retornar false cuando el método de pago está deshabilitado', () => {
			// Arrange
			const disabledPaymentMethod = { ...basePaymentMethod, enabled: false };
			const amount = 25000;

			// Act
			const isAvailable = isPaymentMethodAvailableForAmount(disabledPaymentMethod, amount);

			// Assert
			expect(isAvailable).toBe(false);
		});

		it('debería retornar true cuando no hay límite mínimo definido', () => {
			// Arrange
			const noMinPaymentMethod = {
				...basePaymentMethod,
				configuration: { ...basePaymentMethod.configuration, minAmount: undefined }
			};
			const amount = 1;

			// Act
			const isAvailable = isPaymentMethodAvailableForAmount(noMinPaymentMethod, amount);

			// Assert
			expect(isAvailable).toBe(true);
		});

		it('debería retornar true cuando no hay límite máximo definido', () => {
			// Arrange
			const noMaxPaymentMethod = {
				...basePaymentMethod,
				configuration: { ...basePaymentMethod.configuration, maxAmount: undefined }
			};
			const amount = 1000000;

			// Act
			const isAvailable = isPaymentMethodAvailableForAmount(noMaxPaymentMethod, amount);

			// Assert
			expect(isAvailable).toBe(true);
		});
	});

	describe('calculatePaymentMethodFees', () => {
		it('debería calcular fees con tarifa fija y porcentual', () => {
			// Arrange
			const paymentMethod: PaymentMethod = {
				id: '1',
				name: 'Tarjeta de Crédito',
				type: 'credit_card',
				countryIsoCode: 'CO',
				enabled: true,
				configuration: {
					currency: 'COP',
					fees: {
						fixed: 2900,
						percentage: 2.5
					}
				},
				metadata: {
					displayName: 'Tarjeta de Crédito',
					description: 'Test',
					supported_currencies: ['COP']
				}
			};
			const amount = 100000;

			// Act
			const fees = calculatePaymentMethodFees(paymentMethod, amount);

			// Assert
			expect(fees).toBe(5400); // 2900 + (100000 * 2.5 / 100)
		});

		it('debería calcular fees solo con tarifa fija', () => {
			// Arrange
			const paymentMethod: PaymentMethod = {
				id: '1',
				name: 'Transferencia',
				type: 'bank_transfer',
				countryIsoCode: 'CO',
				enabled: true,
				configuration: {
					currency: 'COP',
					fees: {
						fixed: 3000
					}
				},
				metadata: {
					displayName: 'Transferencia Bancaria',
					description: 'Test',
					supported_currencies: ['COP']
				}
			};
			const amount = 100000;

			// Act
			const fees = calculatePaymentMethodFees(paymentMethod, amount);

			// Assert
			expect(fees).toBe(3000);
		});

		it('debería calcular fees solo con tarifa porcentual', () => {
			// Arrange
			const paymentMethod: PaymentMethod = {
				id: '1',
				name: 'Billetera Digital',
				type: 'digital_wallet',
				countryIsoCode: 'CO',
				enabled: true,
				configuration: {
					currency: 'COP',
					fees: {
						percentage: 1.5
					}
				},
				metadata: {
					displayName: 'Billetera Digital',
					description: 'Test',
					supported_currencies: ['COP']
				}
			};
			const amount = 50000;

			// Act
			const fees = calculatePaymentMethodFees(paymentMethod, amount);

			// Assert
			expect(fees).toBe(750); // 50000 * 1.5 / 100
		});

		it('debería retornar 0 cuando no hay fees configuradas', () => {
			// Arrange
			const paymentMethod: PaymentMethod = {
				id: '1',
				name: 'Efectivo',
				type: 'cash',
				countryIsoCode: 'CO',
				enabled: true,
				configuration: {
					currency: 'COP'
				},
				metadata: {
					displayName: 'Efectivo',
					description: 'Test',
					supported_currencies: ['COP']
				}
			};
			const amount = 50000;

			// Act
			const fees = calculatePaymentMethodFees(paymentMethod, amount);

			// Assert
			expect(fees).toBe(0);
		});

		it('debería manejar fees vacías', () => {
			// Arrange
			const paymentMethod: PaymentMethod = {
				id: '1',
				name: 'Test Method',
				type: 'cash',
				countryIsoCode: 'CO',
				enabled: true,
				configuration: {
					currency: 'COP',
					fees: {}
				},
				metadata: {
					displayName: 'Test Method',
					description: 'Test',
					supported_currencies: ['COP']
				}
			};
			const amount = 50000;

			// Act
			const fees = calculatePaymentMethodFees(paymentMethod, amount);

			// Assert
			expect(fees).toBe(0);
		});
	});
});
