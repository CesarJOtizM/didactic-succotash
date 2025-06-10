import { NextRequest, NextResponse } from 'next/server';
import { mapPaymentOrderToResponseDto } from 'src/application/dtos/paymentOrderDto';
import { createGetPaymentOrderByUuid } from 'src/application/use-cases/getPaymentOrderByUuid';
import { paymentOrderRepository } from 'src/infrastructure/repositories/prismaPaymentOrderRepository';

// Instancia del caso de uso
const getPaymentOrderByUuidUseCase = createGetPaymentOrderByUuid(paymentOrderRepository);

// Helper para obtener la URL base de la petición
const getBaseUrl = (request: NextRequest): string => {
	const host = request.headers.get('host') || 'localhost:3000';
	const protocol = request.headers.get('x-forwarded-proto') || 'http';
	return `${protocol}://${host}`;
};

// Helper para crear respuestas de error estándar
const createErrorResponse = (message: string, status: number) => {
	return NextResponse.json(
		{
			error: {
				message,
				status
			}
		},
		{ status }
	);
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

		// Mapear a DTO de respuesta
		const responseDto = mapPaymentOrderToResponseDto(result.data, baseUrl);

		return NextResponse.json(responseDto, { status: 200 });
	} catch (error) {
		console.error('Error en GET /api/payment_order/[uuid]:', error);
		return createErrorResponse('Error interno del servidor', 500);
	}
}
