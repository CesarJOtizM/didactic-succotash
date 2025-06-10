import { NextRequest } from 'next/server';
import { ZodError } from 'zod';

import { createPaymentOrderUseCase } from 'src/application/use-cases';
import { paymentOrderRepository } from 'src/infrastructure/repositories';
import { createPaymentOrderSchema } from 'src/lib/schemas';
import {
	getBaseUrl,
	parseRequestBody,
	createSuccessResponse,
	handleZodError,
	handleGenericError
} from 'src/lib/utils';

export async function POST(request: NextRequest) {
	try {
		// 1. Parsear el body del request
		const body = await parseRequestBody(request);

		// 2. Validar con Zod
		const validatedData = createPaymentOrderSchema.parse(body);

		// 3. Obtener la URL base
		const baseUrl = getBaseUrl(request);

		// 4. Ejecutar el caso de uso
		const result = await createPaymentOrderUseCase({
			dto: {
				amount: validatedData.amount,
				description: validatedData.description,
				countryIsoCode: validatedData.country_iso_code
			},
			repository: paymentOrderRepository,
			baseUrl
		});

		// 5. Manejar el resultado
		if (result.success) {
			return createSuccessResponse(result.data, 201);
		} else {
			return createSuccessResponse({ error: result.error }, 400);
		}
	} catch (error) {
		// Manejar errores de validación de Zod
		if (error instanceof ZodError) {
			return handleZodError(error);
		}

		// Manejar otros errores
		return handleGenericError(error);
	}
}
