import { ZodSchema, ZodError } from 'zod';

// Resultado encapsulado para validaciones
export type ValidationResult<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			error: string;
			details?: string[];
	  };

// Helper para crear resultado exitoso de validación
export const createValidationSuccess = <T>(data: T): ValidationResult<T> => ({
	success: true,
	data
});

// Helper para crear resultado de error de validación
export const createValidationError = <T>(
	error: string,
	details?: string[]
): ValidationResult<T> => ({
	success: false,
	error,
	details
});

// Función genérica para validar con cualquier schema de Zod
export const validateWithZod = <T>(schema: ZodSchema<T>, input: unknown): ValidationResult<T> => {
	try {
		const validatedData = schema.parse(input);
		return createValidationSuccess(validatedData);
	} catch (error) {
		if (error instanceof ZodError) {
			const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
			return createValidationError('Datos de entrada inválidos', errorMessages);
		}

		if (error instanceof Error) {
			return createValidationError(error.message);
		}

		return createValidationError('Error de validación desconocido');
	}
};

// Helper para formatear errores de validación para respuestas HTTP
export const formatValidationErrorResponse = <T>(result: ValidationResult<T>) => {
	if (result.success) {
		throw new Error('No se puede formatear un resultado exitoso como error');
	}

	return {
		error: {
			message: result.error,
			details: result.details || [],
			type: 'validation_error'
		}
	};
};
