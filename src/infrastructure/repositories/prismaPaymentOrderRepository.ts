import { PaymentOrderRepository } from 'src/application/ports/paymentOrderRepository';
import { PaymentOrder } from 'src/domain/entities/paymentOrder';
import { prisma } from 'src/lib/db';

// Implementación del repositorio usando Prisma
export const createPrismaPaymentOrderRepository = (): PaymentOrderRepository => {
	const save = async (paymentOrder: PaymentOrder): Promise<PaymentOrder> => {
		try {
			const saved = await prisma.paymentOrder.create({
				data: {
					uuid: paymentOrder.uuid,
					type: paymentOrder.type,
					amount: paymentOrder.amount,
					description: paymentOrder.description,
					countryIsoCode: paymentOrder.countryIsoCode,
					createdAt: paymentOrder.createdAt,
					paymentUrl: paymentOrder.paymentUrl
				}
			});

			return mapPrismaToPaymentOrder(saved);
		} catch (error) {
			throw new Error(
				`Error al guardar PaymentOrder: ${error instanceof Error ? error.message : 'Error desconocido'}`
			);
		}
	};

	const findByUuid = async (uuid: string): Promise<PaymentOrder | null> => {
		try {
			const found = await prisma.paymentOrder.findUnique({
				where: { uuid }
			});

			return found ? mapPrismaToPaymentOrder(found) : null;
		} catch (error) {
			throw new Error(
				`Error al buscar PaymentOrder: ${error instanceof Error ? error.message : 'Error desconocido'}`
			);
		}
	};

	return {
		save,
		findByUuid
	};
};

// Mapper de entidad Prisma a entidad de dominio
const mapPrismaToPaymentOrder = (prismaPaymentOrder: PaymentOrder): PaymentOrder => ({
	uuid: prismaPaymentOrder.uuid,
	type: prismaPaymentOrder.type,
	amount: prismaPaymentOrder.amount,
	description: prismaPaymentOrder.description,
	countryIsoCode: prismaPaymentOrder.countryIsoCode,
	createdAt: prismaPaymentOrder.createdAt,
	paymentUrl: prismaPaymentOrder.paymentUrl
});

// Instancia singleton del repositorio
export const paymentOrderRepository = createPrismaPaymentOrderRepository();
