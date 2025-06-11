import { PaymentOrder } from 'src/domain/entities/paymentOrder';

// Port (interfaz) para el repositorio de PaymentOrder
export interface PaymentOrderRepository {
	save: (paymentOrder: PaymentOrder) => Promise<PaymentOrder>;
	findByUuid: (uuid: string) => Promise<PaymentOrder | null>;
	findAll: () => Promise<PaymentOrder[]>;
	update: (uuid: string, updates: Partial<PaymentOrder>) => Promise<PaymentOrder | null>;
}

// Resultado encapsulado para operaciones del repositorio
export type RepositoryResult<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			error: string;
	  };

// Helper para crear resultado exitoso
export const createSuccessResult = <T>(data: T): RepositoryResult<T> => ({
	success: true,
	data
});

// Helper para crear resultado de error
export const createErrorResult = <T>(error: string): RepositoryResult<T> => ({
	success: false,
	error
});
