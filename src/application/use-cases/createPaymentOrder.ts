import { v4 as uuidv4 } from 'uuid';

import {
	CreatePaymentOrderDto,
	PaymentOrderResponseDto,
	mapPaymentOrderToResponseDto
} from 'src/application/dtos';
import { PaymentOrderRepository } from 'src/application/ports';
import { PaymentOrder } from 'src/domain/entities';

// Resultado del caso de uso
export type CreatePaymentOrderResult =
	| { success: true; data: PaymentOrderResponseDto }
	| { success: false; error: string };

// Parámetros para el caso de uso
export interface CreatePaymentOrderParams {
	dto: CreatePaymentOrderDto;
	repository: PaymentOrderRepository;
	baseUrl: string;
}

// Caso de uso principal
export const createPaymentOrderUseCase = async (
	params: CreatePaymentOrderParams
): Promise<CreatePaymentOrderResult> => {
	try {
		// Generar UUID único
		const uuid = uuidv4();

		// Crear la entidad PaymentOrder con status "pending" por defecto
		const paymentOrder: PaymentOrder = {
			uuid,
			type: 'payment_order',
			amount: params.dto.amount,
			description: params.dto.description,
			countryIsoCode: params.dto.countryIsoCode,
			createdAt: new Date(),
			paymentUrl: `${params.baseUrl}/payment_order/${uuid}`,
			status: 'pending',
			attempts: 0
		};

		// Guardar en el repositorio
		const savedPaymentOrder = await params.repository.save(paymentOrder);

		// Mapear a DTO de respuesta
		const responseDto = mapPaymentOrderToResponseDto(savedPaymentOrder, params.baseUrl);

		return {
			success: true,
			data: responseDto
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Error desconocido al crear la payment order'
		};
	}
};

// Helper para validar el DTO
export const validateCreatePaymentOrderDto = (dto: CreatePaymentOrderDto): string[] => {
	const errors: string[] = [];

	if (dto.amount <= 0) {
		errors.push('El monto debe ser mayor a 0');
	}

	if (!dto.description || dto.description.trim().length === 0) {
		errors.push('La descripción es requerida');
	}

	if (dto.description && dto.description.length > 255) {
		errors.push('La descripción es muy larga');
	}

	if (!dto.countryIsoCode || !/^[A-Z]{2}$/.test(dto.countryIsoCode)) {
		errors.push('El código ISO del país debe tener exactamente 2 caracteres en mayúsculas');
	}

	return errors;
};
