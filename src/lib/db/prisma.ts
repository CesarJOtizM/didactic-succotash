import { PrismaClient } from 'src/prisma/generated';

// Singleton para el cliente de Prisma
declare global {
	// eslint-disable-next-line no-var
	var __prisma: PrismaClient | undefined;
}

// Crear o reutilizar la instancia del cliente Prisma
const createPrismaClient = (): PrismaClient => {
	return new PrismaClient({
		log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
	});
};

// En desarrollo, usar una variable global para evitar crear múltiples conexiones
export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV === 'development') {
	globalThis.__prisma = prisma;
}

// Helper para desconectar Prisma (útil en tests)
export const disconnectPrisma = async (): Promise<void> => {
	await prisma.$disconnect();
};
