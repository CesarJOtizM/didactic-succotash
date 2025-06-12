import { PaymentMethod } from 'src/domain/entities';

// Mock de métodos de pago por país
export const PAYMENT_METHODS_BY_COUNTRY: Record<string, PaymentMethod[]> = {
	// Colombia
	CO: [
		{
			id: 'co_credit_card',
			name: 'credit_card',
			type: 'credit_card',
			countryIsoCode: 'CO',
			enabled: true,
			configuration: {
				minAmount: 1000,
				maxAmount: 50000000,
				currency: 'COP',
				processingTime: 'instant',
				fees: {
					percentage: 3.5
				}
			},
			metadata: {
				displayName: 'Tarjeta de Crédito',
				description: 'Paga con tu tarjeta de crédito Visa, Mastercard o American Express',
				iconUrl: '/icons/credit-card.svg',
				supported_currencies: ['COP'],
				requires_document: false,
				instant_payment: true
			}
		},
		{
			id: 'co_pse',
			name: 'pse',
			type: 'bank_transfer',
			countryIsoCode: 'CO',
			enabled: true,
			configuration: {
				minAmount: 5000,
				maxAmount: 100000000,
				currency: 'COP',
				processingTime: '1-2 minutes',
				fees: {
					fixed: 2900,
					percentage: 1.2
				}
			},
			metadata: {
				displayName: 'PSE',
				description: 'Pago Seguro en Línea - Transferencia bancaria inmediata',
				iconUrl: '/icons/pse.svg',
				supported_currencies: ['COP'],
				requires_document: true,
				instant_payment: true
			}
		},
		{
			id: 'co_nequi',
			name: 'nequi',
			type: 'digital_wallet',
			countryIsoCode: 'CO',
			enabled: true,
			configuration: {
				minAmount: 1000,
				maxAmount: 20000000,
				currency: 'COP',
				processingTime: 'instant',
				fees: {
					percentage: 2.0
				}
			},
			metadata: {
				displayName: 'Nequi',
				description: 'Billetera digital de Bancolombia',
				iconUrl: '/icons/nequi.svg',
				supported_currencies: ['COP'],
				requires_document: false,
				instant_payment: true
			}
		},
		{
			id: 'co_daviplata',
			name: 'daviplata',
			type: 'digital_wallet',
			countryIsoCode: 'CO',
			enabled: true,
			configuration: {
				minAmount: 1000,
				maxAmount: 15000000,
				currency: 'COP',
				processingTime: 'instant',
				fees: {
					percentage: 2.5
				}
			},
			metadata: {
				displayName: 'DaviPlata',
				description: 'Billetera digital del Banco Davivienda',
				iconUrl: '/icons/daviplata.svg',
				supported_currencies: ['COP'],
				requires_document: false,
				instant_payment: true
			}
		}
	],

	// México
	MX: [
		{
			id: 'mx_credit_card',
			name: 'credit_card',
			type: 'credit_card',
			countryIsoCode: 'MX',
			enabled: true,
			configuration: {
				minAmount: 20,
				maxAmount: 500000,
				currency: 'MXN',
				processingTime: 'instant',
				fees: {
					percentage: 3.8
				}
			},
			metadata: {
				displayName: 'Tarjeta de Crédito',
				description: 'Paga con Visa, Mastercard, American Express o Carnet',
				iconUrl: '/icons/credit-card.svg',
				supported_currencies: ['MXN'],
				requires_document: false,
				instant_payment: true
			}
		},
		{
			id: 'mx_spei',
			name: 'spei',
			type: 'bank_transfer',
			countryIsoCode: 'MX',
			enabled: true,
			configuration: {
				minAmount: 100,
				maxAmount: 1000000,
				currency: 'MXN',
				processingTime: '1-3 hours',
				fees: {
					fixed: 15,
					percentage: 1.0
				}
			},
			metadata: {
				displayName: 'SPEI',
				description: 'Sistema de Pagos Electrónicos Interbancarios',
				iconUrl: '/icons/spei.svg',
				supported_currencies: ['MXN'],
				requires_document: true,
				instant_payment: false
			}
		},
		{
			id: 'mx_oxxo',
			name: 'oxxo',
			type: 'cash',
			countryIsoCode: 'MX',
			enabled: true,
			configuration: {
				minAmount: 20,
				maxAmount: 10000,
				currency: 'MXN',
				processingTime: '2-24 hours',
				fees: {
					fixed: 10
				}
			},
			metadata: {
				displayName: 'OXXO',
				description: 'Pago en efectivo en tiendas OXXO',
				iconUrl: '/icons/oxxo.svg',
				supported_currencies: ['MXN'],
				requires_document: false,
				instant_payment: false
			}
		}
	],

	// Brasil
	BR: [
		{
			id: 'br_credit_card',
			name: 'credit_card',
			type: 'credit_card',
			countryIsoCode: 'BR',
			enabled: true,
			configuration: {
				minAmount: 500,
				maxAmount: 1000000,
				currency: 'BRL',
				processingTime: 'instant',
				fees: {
					percentage: 4.2
				}
			},
			metadata: {
				displayName: 'Cartão de Crédito',
				description: 'Pague com Visa, Mastercard, Elo ou American Express',
				iconUrl: '/icons/credit-card.svg',
				supported_currencies: ['BRL'],
				requires_document: false,
				instant_payment: true
			}
		},
		{
			id: 'br_pix',
			name: 'pix',
			type: 'bank_transfer',
			countryIsoCode: 'BR',
			enabled: true,
			configuration: {
				minAmount: 100,
				maxAmount: 2000000,
				currency: 'BRL',
				processingTime: 'instant',
				fees: {
					percentage: 0.5
				}
			},
			metadata: {
				displayName: 'PIX',
				description: 'Pagamento instantâneo do Banco Central do Brasil',
				iconUrl: '/icons/pix.svg',
				supported_currencies: ['BRL'],
				requires_document: true,
				instant_payment: true
			}
		},
		{
			id: 'br_boleto',
			name: 'boleto',
			type: 'bank_transfer',
			countryIsoCode: 'BR',
			enabled: true,
			configuration: {
				minAmount: 100,
				maxAmount: 500000,
				currency: 'BRL',
				processingTime: '1-3 business days',
				fees: {
					fixed: 350,
					percentage: 0.8
				}
			},
			metadata: {
				displayName: 'Boleto Bancário',
				description: 'Boleto para pagamento em bancos e casas lotéricas',
				iconUrl: '/icons/boleto.svg',
				supported_currencies: ['BRL'],
				requires_document: true,
				instant_payment: false
			}
		}
	],

	// Estados Unidos
	US: [
		{
			id: 'us_credit_card',
			name: 'credit_card',
			type: 'credit_card',
			countryIsoCode: 'US',
			enabled: true,
			configuration: {
				minAmount: 100,
				maxAmount: 2500000,
				currency: 'USD',
				processingTime: 'instant',
				fees: {
					percentage: 2.9
				}
			},
			metadata: {
				displayName: 'Credit Card',
				description: 'Pay with Visa, Mastercard, Discover or American Express',
				iconUrl: '/icons/credit-card.svg',
				supported_currencies: ['USD'],
				requires_document: false,
				instant_payment: true
			}
		},
		{
			id: 'us_ach',
			name: 'ach',
			type: 'bank_transfer',
			countryIsoCode: 'US',
			enabled: true,
			configuration: {
				minAmount: 100,
				maxAmount: 10000000,
				currency: 'USD',
				processingTime: '3-5 business days',
				fees: {
					fixed: 25
				}
			},
			metadata: {
				displayName: 'ACH Transfer',
				description: 'Automated Clearing House bank transfer',
				iconUrl: '/icons/ach.svg',
				supported_currencies: ['USD'],
				requires_document: true,
				instant_payment: false
			}
		},
		{
			id: 'us_paypal',
			name: 'paypal',
			type: 'digital_wallet',
			countryIsoCode: 'US',
			enabled: true,
			configuration: {
				minAmount: 100,
				maxAmount: 5000000,
				currency: 'USD',
				processingTime: 'instant',
				fees: {
					percentage: 3.2
				}
			},
			metadata: {
				displayName: 'PayPal',
				description: 'Pay with your PayPal account or linked card',
				iconUrl: '/icons/paypal.svg',
				supported_currencies: ['USD'],
				requires_document: false,
				instant_payment: true
			}
		}
	],

	// Argentina
	AR: [
		{
			id: 'ar_credit_card',
			name: 'credit_card',
			type: 'credit_card',
			countryIsoCode: 'AR',
			enabled: true,
			configuration: {
				minAmount: 1000,
				maxAmount: 10000000,
				currency: 'ARS',
				processingTime: 'instant',
				fees: {
					percentage: 5.2
				}
			},
			metadata: {
				displayName: 'Tarjeta de Crédito',
				description: 'Paga con Visa, Mastercard o American Express',
				iconUrl: '/icons/credit-card.svg',
				supported_currencies: ['ARS'],
				requires_document: false,
				instant_payment: true
			}
		},
		{
			id: 'ar_mercado_pago',
			name: 'mercado_pago',
			type: 'digital_wallet',
			countryIsoCode: 'AR',
			enabled: true,
			configuration: {
				minAmount: 500,
				maxAmount: 5000000,
				currency: 'ARS',
				processingTime: 'instant',
				fees: {
					percentage: 4.8
				}
			},
			metadata: {
				displayName: 'Mercado Pago',
				description: 'Billetera digital de Mercado Libre',
				iconUrl: '/icons/mercado-pago.svg',
				supported_currencies: ['ARS'],
				requires_document: false,
				instant_payment: true
			}
		},
		{
			id: 'ar_rapipago',
			name: 'rapipago',
			type: 'cash',
			countryIsoCode: 'AR',
			enabled: true,
			configuration: {
				minAmount: 500,
				maxAmount: 200000,
				currency: 'ARS',
				processingTime: '2-24 hours',
				fees: {
					fixed: 150,
					percentage: 2.0
				}
			},
			metadata: {
				displayName: 'Rapipago',
				description: 'Pago en efectivo en sucursales Rapipago',
				iconUrl: '/icons/rapipago.svg',
				supported_currencies: ['ARS'],
				requires_document: false,
				instant_payment: false
			}
		}
	],

	// Chile
	CL: [
		{
			id: 'cl_credit_card',
			name: 'credit_card',
			type: 'credit_card',
			countryIsoCode: 'CL',
			enabled: true,
			configuration: {
				minAmount: 1000,
				maxAmount: 30000000,
				currency: 'CLP',
				processingTime: 'instant',
				fees: {
					percentage: 2.9
				}
			},
			metadata: {
				displayName: 'Tarjeta de Crédito',
				description: 'Paga con Visa, Mastercard o American Express',
				iconUrl: '/icons/credit-card.svg',
				supported_currencies: ['CLP'],
				requires_document: false,
				instant_payment: true
			}
		},
		{
			id: 'cl_redcompra',
			name: 'redcompra',
			type: 'debit_card',
			countryIsoCode: 'CL',
			enabled: true,
			configuration: {
				minAmount: 500,
				maxAmount: 10000000,
				currency: 'CLP',
				processingTime: 'instant',
				fees: {
					percentage: 1.9
				}
			},
			metadata: {
				displayName: 'RedCompra',
				description: 'Tarjeta de débito del sistema nacional chileno',
				iconUrl: '/icons/redcompra.svg',
				supported_currencies: ['CLP'],
				requires_document: false,
				instant_payment: true
			}
		},
		{
			id: 'cl_webpay',
			name: 'webpay',
			type: 'bank_transfer',
			countryIsoCode: 'CL',
			enabled: true,
			configuration: {
				minAmount: 1000,
				maxAmount: 50000000,
				currency: 'CLP',
				processingTime: 'instant',
				fees: {
					percentage: 1.49
				}
			},
			metadata: {
				displayName: 'Webpay Plus',
				description: 'Sistema de pago seguro de Transbank',
				iconUrl: '/icons/webpay.svg',
				supported_currencies: ['CLP'],
				requires_document: true,
				instant_payment: true
			}
		},
		{
			id: 'cl_khipu',
			name: 'khipu',
			type: 'bank_transfer',
			countryIsoCode: 'CL',
			enabled: true,
			configuration: {
				minAmount: 500,
				maxAmount: 20000000,
				currency: 'CLP',
				processingTime: 'instant',
				fees: {
					percentage: 0.69
				}
			},
			metadata: {
				displayName: 'Khipu',
				description: 'Transferencias bancarias simplificadas',
				iconUrl: '/icons/khipu.svg',
				supported_currencies: ['CLP'],
				requires_document: true,
				instant_payment: true
			}
		},
		{
			id: 'cl_mach',
			name: 'mach',
			type: 'digital_wallet',
			countryIsoCode: 'CL',
			enabled: true,
			configuration: {
				minAmount: 500,
				maxAmount: 15000000,
				currency: 'CLP',
				processingTime: 'instant',
				fees: {
					percentage: 2.2
				}
			},
			metadata: {
				displayName: 'MACH',
				description: 'Billetera digital de Banco BCI',
				iconUrl: '/icons/mach.svg',
				supported_currencies: ['CLP'],
				requires_document: false,
				instant_payment: true
			}
		},
		{
			id: 'cl_servipag',
			name: 'servipag',
			type: 'cash',
			countryIsoCode: 'CL',
			enabled: true,
			configuration: {
				minAmount: 1000,
				maxAmount: 5000000,
				currency: 'CLP',
				processingTime: '2-24 hours',
				fees: {
					fixed: 1200,
					percentage: 1.5
				}
			},
			metadata: {
				displayName: 'Servipag',
				description: 'Pago en efectivo en sucursales Servipag',
				iconUrl: '/icons/servipag.svg',
				supported_currencies: ['CLP'],
				requires_document: false,
				instant_payment: false
			}
		},
		{
			id: 'cl_cleo',
			name: 'cleo',
			type: 'credit',
			countryIsoCode: 'CL',
			enabled: true,
			configuration: {
				minAmount: 10000,
				maxAmount: 2000000,
				currency: 'CLP',
				processingTime: 'instant',
				fees: {
					percentage: 3.5
				}
			},
			metadata: {
				displayName: 'Cleo',
				description: 'Compra ahora, paga después en cuotas',
				iconUrl: '/icons/cleo.svg',
				supported_currencies: ['CLP'],
				requires_document: true,
				instant_payment: true
			}
		}
	]
};

// Función para obtener métodos de pago por país
export const getPaymentMethodsByCountry = (countryIsoCode: string): PaymentMethod[] => {
	return PAYMENT_METHODS_BY_COUNTRY[countryIsoCode] || [];
};

// Función para obtener métodos de pago habilitados por país
export const getEnabledPaymentMethodsByCountry = (countryIsoCode: string): PaymentMethod[] => {
	const paymentMethods = getPaymentMethodsByCountry(countryIsoCode);
	return paymentMethods.filter(method => method.enabled);
};

// Función para obtener métodos de pago disponibles para un monto específico
export const getAvailablePaymentMethodsForAmount = (
	countryIsoCode: string,
	amount: number
): PaymentMethod[] => {
	const paymentMethods = getEnabledPaymentMethodsByCountry(countryIsoCode);
	return paymentMethods.filter(method => {
		const { minAmount, maxAmount } = method.configuration;
		if (minAmount && amount < minAmount) return false;
		if (maxAmount && amount > maxAmount) return false;
		return true;
	});
};

// Función para obtener un método de pago específico
export const getPaymentMethodById = (id: string): PaymentMethod | null => {
	for (const countryMethods of Object.values(PAYMENT_METHODS_BY_COUNTRY)) {
		const method = countryMethods.find(method => method.id === id);
		if (method) return method;
	}
	return null;
};

// Función para obtener países soportados
export const getSupportedCountries = (): string[] => {
	return Object.keys(PAYMENT_METHODS_BY_COUNTRY);
};
