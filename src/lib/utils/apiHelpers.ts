import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

// Helper para obtener la URL base del request
export const getBaseUrl = (request: NextRequest): string => {
	const protocol = request.headers.get('x-forwarded-proto') ?? 'http';
	const host = request.headers.get('host') ?? 'localhost:3000';
	return `${protocol}://${host}`;
};

// Helper para parsear el body del request
export const parseRequestBody = async <T>(request: NextRequest): Promise<T> => {
	try {
		return await request.json();
	} catch (error) {
		console.error('Error parsing request body:', error);
		throw new Error('Invalid JSON in request body');
	}
};

// Helper para crear respuesta de error
export const createErrorResponse = (message: string, status: number = 400, details?: unknown) => {
	return NextResponse.json(
		{
			error: message,
			details,
			timestamp: new Date().toISOString()
		},
		{ status }
	);
};

// Helper para crear respuesta de éxito
export const createSuccessResponse = <T>(data: T, status: number = 200) => {
	return NextResponse.json(data, { status });
};

// Helper para manejar errores de validación de Zod
export const handleZodError = (error: ZodError) => {
	const errors = error.errors.map(err => ({
		field: err.path.join('.'),
		message: err.message
	}));

	return createErrorResponse('Errores de validación', 400, { validation_errors: errors });
};

// Helper para manejar errores generales
export const handleGenericError = (error: unknown) => {
	console.error('Error:', error);

	if (error instanceof Error) {
		return createErrorResponse(error.message, 500);
	}

	return createErrorResponse('Error interno del servidor', 500);
};
