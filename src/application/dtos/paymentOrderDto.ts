import { PaymentOrder } from 'src/domain/entities/paymentOrder';
import { PaymentOrderResponse } from 'src/lib/schemas';

// DTO para crear una payment order
export interface CreatePaymentOrderDto {
	readonly amount: number;
	readonly description: string;
	readonly countryIsoCode: string;
}

// DTO para la respuesta de payment order
export interface PaymentOrderResponseDto {
	readonly uuid: string;
	readonly type: 'payment_order';
	readonly attributes: {
		readonly amount: number;
		readonly description: string;
		readonly country_iso_code: string;
		readonly created_at: string;
		readonly payment_url: string;
	};
}

// Mapper para convertir entidad de dominio a DTO de respuesta
export const mapPaymentOrderToResponseDto = (
	paymentOrder: PaymentOrder,
	baseUrl: string
): PaymentOrderResponseDto => ({
	uuid: paymentOrder.uuid,
	type: 'payment_order',
	attributes: {
		amount: paymentOrder.amount,
		description: paymentOrder.description,
		country_iso_code: paymentOrder.countryIsoCode,
		created_at: paymentOrder.createdAt.toISOString(),
		payment_url: `${baseUrl}/api/payment_order/${paymentOrder.uuid}`
	}
});

// Mapper para convertir DTO a entidad de dominio
export const mapCreateDtoToPaymentOrder = (
	dto: CreatePaymentOrderDto,
	uuid: string,
	baseUrl: string
): PaymentOrderResponse => ({
	uuid,
	type: 'payment_order',
	attributes: {
		amount: dto.amount,
		description: dto.description,
		country_iso_code: dto.countryIsoCode,
		created_at: new Date().toString(),
		payment_url: `${baseUrl}/api/payment_order/${uuid}`
	}
});
