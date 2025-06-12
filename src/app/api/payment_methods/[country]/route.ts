import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { getPaymentMethodsByCountryUseCase } from 'src/application/use-cases';
import { getPaymentMethodsParamsSchema, getPaymentMethodsQuerySchema } from 'src/lib/schemas';
import { createSuccessResponse, handleZodError, handleGenericError } from 'src/lib/utils';

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

// GET /api/payment_methods/[country]
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ country: string }> }
): Promise<NextResponse> {
	try {
		// Await params y luego validar parámetros de ruta
		const resolvedParams = await params;
		const { country } = getPaymentMethodsParamsSchema.parse(resolvedParams);

		// Obtener y validar query parameters
		const url = new URL(request.url);
		const queryParams = Object.fromEntries(url.searchParams.entries());
		const { amount } = getPaymentMethodsQuerySchema.parse(queryParams);

		// Ejecutar caso de uso
		const result = await getPaymentMethodsByCountryUseCase({
			countryIsoCode: country,
			amount
		});

		if (!result.success) {
			// Determinar código de estado basado en el error
			const status = result.error.includes('código ISO')
				? 400
				: result.error.includes('no encontrado')
					? 404
					: 500;

			return createErrorResponse(result.error, status);
		}

		// Respuesta exitosa
		return createSuccessResponse(result.data, 200);
	} catch (error) {
		// Manejar errores de validación de Zod
		if (error instanceof ZodError) {
			return handleZodError(error);
		}

		// Manejar otros errores
		console.error('Error en GET /api/payment_methods/[country]:', error);
		return handleGenericError(error);
	}
}
