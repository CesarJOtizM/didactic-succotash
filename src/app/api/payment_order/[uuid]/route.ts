import { NextRequest, NextResponse } from 'next/server';
import { mapPaymentMethodToResponseDto } from 'src/application/dtos/paymentMethodDto';
import { mapPaymentOrderToResponseDto } from 'src/application/dtos/paymentOrderDto';
import {
	createGetPaymentOrderByUuid,
	createProcessPaymentOrderUseCase
} from 'src/application/use-cases';
import { getAvailablePaymentMethodsForAmount } from 'src/infrastructure/mocks';
import { paymentOrderRepository } from 'src/infrastructure/repositories/prismaPaymentOrderRepository';
import { createErrorResponse } from 'src/lib/utils';

// Instancias de los casos de uso
const getPaymentOrderByUuidUseCase = createGetPaymentOrderByUuid(paymentOrderRepository);
const processPaymentOrderUseCase = createProcessPaymentOrderUseCase(paymentOrderRepository);

// Helper para obtener la URL base de la petición
const getBaseUrl = (request: NextRequest): string => {
	const host = request.headers.get('host') || 'localhost:3000';
	const protocol = request.headers.get('x-forwarded-proto') || 'http';
	return `${protocol}://${host}`;
};

// GET /api/payment_order/[uuid]
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ uuid: string }> }
): Promise<NextResponse> {
	try {
		// Await params para obtener el uuid
		const resolvedParams = await params;
		const { uuid } = resolvedParams;

		if (!uuid) {
			return createErrorResponse('UUID es requerido', 400);
		}

		// Ejecutar caso de uso (ahora con validación Zod integrada)
		const result = await getPaymentOrderByUuidUseCase({ uuid });

		if (!result.success) {
			// Determinar código de estado basado en el error
			const status = result.error.includes('no es válido')
				? 400
				: result.error.includes('no encontrada')
					? 404
					: 500;

			return createErrorResponse(result.error, status);
		}

		// Obtener URL base para construir payment_url
		const baseUrl = getBaseUrl(request);

		// Obtener métodos de pago disponibles para esta orden
		const availablePaymentMethods = getAvailablePaymentMethodsForAmount(
			result.data.countryIsoCode,
			result.data.amount
		);

		// Mapear métodos de pago a DTOs
		const paymentMethodDtos = availablePaymentMethods.map(method =>
			mapPaymentMethodToResponseDto(method)
		);

		// Mapear a DTO de respuesta con métodos de pago incluidos
		const responseDto = mapPaymentOrderToResponseDto(result.data, baseUrl, paymentMethodDtos);

		return NextResponse.json(responseDto, { status: 200 });
	} catch (error) {
		console.error('Error en GET /api/payment_order/[uuid]:', error);
		return createErrorResponse('Error interno del servidor', 500);
	}
}

// POST /api/payment_order/[uuid] - Procesar orden de pago
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ uuid: string }> }
): Promise<NextResponse> {
	try {
		// Await params para obtener el uuid
		const resolvedParams = await params;
		const { uuid } = resolvedParams;

		if (!uuid) {
			return createErrorResponse('UUID es requerido', 400);
		}

		// Obtener body de la request (opcional payment_method_id)
		const body = await request.json().catch(() => ({}));
		const paymentMethodId = body?.payment_method_id;

		// Ejecutar caso de uso para procesar el pago
		const result = await processPaymentOrderUseCase({
			uuid,
			paymentMethodId
		});

		if (!result.success) {
			// Determinar código de estado basado en el error
			const status = result.error.includes('no es válido')
				? 400
				: result.error.includes('no encontrada')
					? 404
					: result.error.includes('No hay métodos de pago disponibles')
						? 422
						: 500;

			return createErrorResponse(result.error, status);
		}

		// Retornar respuesta de procesamiento (éxito o error de pago)
		const statusCode = result.data.status === 'success' ? 200 : 402; // 402 Payment Required para fallos de pago

		return NextResponse.json(result.data, { status: statusCode });
	} catch (error) {
		console.error('Error en POST /api/payment_order/[uuid]:', error);
		return createErrorResponse('Error interno del servidor', 500);
	}
}
