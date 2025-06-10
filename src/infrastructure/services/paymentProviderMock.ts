import { v4 as uuidv4 } from 'uuid';
import { PaymentMethod } from 'src/domain/entities';

// Respuesta del proveedor de pago (mock)
export interface PaymentProviderResponse {
	success: boolean;
	transaction_id: string;
	error_message?: string;
	provider_id: string;
}

// Simulación de la confiabilidad de cada proveedor (% de éxito)
const PROVIDER_RELIABILITY: Record<string, number> = {
	// Tarjetas de crédito - alta confiabilidad
	credit_card: 0.95,
	// Transferencias bancarias - alta confiabilidad
	bank_transfer: 0.92,
	pse: 0.9,
	spei: 0.88,
	pix: 0.96,
	ach: 0.85,
	webpay: 0.93,
	khipu: 0.89,
	boleto: 0.78,
	// Billeteras digitales - confiabilidad media-alta
	digital_wallet: 0.87,
	nequi: 0.89,
	daviplata: 0.86,
	paypal: 0.91,
	mercado_pago: 0.88,
	mach: 0.84,
	// Pagos en efectivo - confiabilidad media
	cash: 0.75,
	oxxo: 0.8,
	rapipago: 0.72,
	servipag: 0.77,
	// Tarjetas de débito - alta confiabilidad
	debit_card: 0.93,
	redcompra: 0.94,
	// Crédito - confiabilidad media
	credit: 0.82,
	cleo: 0.81
};

// Función para simular delay de procesamiento
const simulateProcessingDelay = (processingTime: string = 'instant'): Promise<void> => {
	if (processingTime === 'instant') {
		return Promise.resolve();
	}

	// Simular delay mínimo de 100ms para requests no instantáneos
	const delay = Math.random() * 500 + 100;
	return new Promise(resolve => setTimeout(resolve, delay));
};

// Función para determinar si un pago será exitoso (basado en confiabilidad)
const shouldPaymentSucceed = (paymentMethod: PaymentMethod): boolean => {
	const reliability =
		PROVIDER_RELIABILITY[paymentMethod.name] || PROVIDER_RELIABILITY[paymentMethod.type] || 0.75; // fallback confiabilidad

	return Math.random() < reliability;
};

// Función principal para procesar pago con un proveedor específico
export const processPaymentWithProvider = async (
	paymentMethod: PaymentMethod,
	_amount: number,
	_orderId: string
): Promise<PaymentProviderResponse> => {
	// Simular delay de procesamiento
	await simulateProcessingDelay(paymentMethod.configuration.processingTime);

	const transactionId = uuidv4();
	const success = shouldPaymentSucceed(paymentMethod);

	if (success) {
		console.log(
			`✅ Pago exitoso con proveedor ${paymentMethod.name} - Transaction: ${transactionId}`
		);
		return {
			success: true,
			transaction_id: transactionId,
			provider_id: paymentMethod.id
		};
	} else {
		console.log(
			`❌ Pago falló con proveedor ${paymentMethod.name} - Transaction: ${transactionId}`
		);
		return {
			success: false,
			transaction_id: transactionId,
			error_message: `Error procesando pago con ${paymentMethod.metadata.displayName}`,
			provider_id: paymentMethod.id
		};
	}
};

// Función para ruteo inteligente - intenta con múltiples proveedores
export const processPaymentWithSmartRouting = async (
	availablePaymentMethods: PaymentMethod[],
	amount: number,
	orderId: string,
	preferredMethodId?: string
): Promise<PaymentProviderResponse> => {
	if (!availablePaymentMethods.length) {
		return {
			success: false,
			transaction_id: uuidv4(),
			error_message: 'No hay métodos de pago disponibles',
			provider_id: 'none'
		};
	}

	// Ordenar métodos por prioridad (preferido primero, luego por confiabilidad)
	const sortedMethods = [...availablePaymentMethods].sort((a, b) => {
		// Si hay un método preferido, ponerlo primero
		if (preferredMethodId) {
			if (a.id === preferredMethodId) return -1;
			if (b.id === preferredMethodId) return 1;
		}

		// Luego ordenar por confiabilidad (mayor a menor)
		const reliabilityA = PROVIDER_RELIABILITY[a.name] || PROVIDER_RELIABILITY[a.type] || 0.75;
		const reliabilityB = PROVIDER_RELIABILITY[b.name] || PROVIDER_RELIABILITY[b.type] || 0.75;

		return reliabilityB - reliabilityA;
	});

	// Intentar con cada proveedor hasta encontrar uno exitoso
	for (const method of sortedMethods) {
		console.info(`🔄 Intentando procesar pago con ${method.metadata.displayName}...`);

		const result = await processPaymentWithProvider(method, amount, orderId);

		if (result.success) {
			console.info(
				`🎉 Pago procesado exitosamente con ruteo inteligente usando ${method.metadata.displayName}`
			);
			return result;
		}

		console.info(`⚠️ Fallo con ${method.metadata.displayName}, intentando siguiente proveedor...`);
	}

	// Si todos los proveedores fallaron
	console.info(`💥 Todos los proveedores fallaron para la orden ${orderId}`);
	return {
		success: false,
		transaction_id: uuidv4(),
		error_message: 'Todos los proveedores de pago fallaron',
		provider_id: 'all_failed'
	};
};

// Función para obtener la confiabilidad de un proveedor
export const getProviderReliability = (paymentMethod: PaymentMethod): number => {
	return (
		PROVIDER_RELIABILITY[paymentMethod.name] || PROVIDER_RELIABILITY[paymentMethod.type] || 0.75
	);
};

// Función para obtener estadísticas de los proveedores (para debugging/monitoreo)
export const getProviderStats = (): Record<string, number> => {
	return { ...PROVIDER_RELIABILITY };
};
