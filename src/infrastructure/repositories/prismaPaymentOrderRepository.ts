import { PaymentOrderRepository } from 'src/application/ports/paymentOrderRepository';
import { PaymentOrder } from 'src/domain/entities/paymentOrder';
import { PaymentOrder as PrismaPaymentOrder } from 'src/prisma/generated';
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
					paymentUrl: paymentOrder.paymentUrl,
					status: paymentOrder.status || 'pending'
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

	const findAll = async (): Promise<PaymentOrder[]> => {
		try {
			const paymentOrders = await prisma.paymentOrder.findMany({
				orderBy: {
					createdAt: 'desc'
				}
			});

			return paymentOrders.map(mapPrismaToPaymentOrder);
		} catch (error) {
			throw new Error(
				`Error al obtener PaymentOrders: ${error instanceof Error ? error.message : 'Error desconocido'}`
			);
		}
	};

	const update = async (
		uuid: string,
		updates: Partial<PaymentOrder>
	): Promise<PaymentOrder | null> => {
		try {
			const updated = await prisma.paymentOrder.update({
				where: { uuid },
				data: {
					...(updates.status && { status: updates.status }),
					...(updates.provider && { provider: updates.provider }),
					...(updates.attempts !== undefined && { attempts: updates.attempts }),
					...(updates.processedAt && { processedAt: updates.processedAt }),
					...(updates.transactionId && { transactionId: updates.transactionId })
				}
			});

			return mapPrismaToPaymentOrder(updated);
		} catch (error) {
			throw new Error(
				`Error al actualizar PaymentOrder: ${error instanceof Error ? error.message : 'Error desconocido'}`
			);
		}
	};

	return {
		save,
		findByUuid,
		findAll,
		update
	};
};

// Mapper de entidad Prisma a entidad de dominio
const mapPrismaToPaymentOrder = (prismaPaymentOrder: PrismaPaymentOrder): PaymentOrder => ({
	uuid: prismaPaymentOrder.uuid,
	type: prismaPaymentOrder.type,
	amount: prismaPaymentOrder.amount,
	description: prismaPaymentOrder.description,
	countryIsoCode: prismaPaymentOrder.countryIsoCode,
	createdAt: prismaPaymentOrder.createdAt,
	paymentUrl: prismaPaymentOrder.paymentUrl,
	status: prismaPaymentOrder.status,
	provider: prismaPaymentOrder.provider,
	attempts: prismaPaymentOrder.attempts,
	processedAt: prismaPaymentOrder?.processedAt || undefined,
	transactionId: prismaPaymentOrder.transactionId || undefined
});

// Instancia singleton del repositorio
export const paymentOrderRepository = createPrismaPaymentOrderRepository();
