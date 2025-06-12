import React from 'react';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PaymentDetails } from 'src/components/payments';
import { PaymentOrderResponseDto } from 'src/application/dtos';

// Configurar como página dinámica ya que depende del UUID y datos pueden cambiar
export const dynamic = 'force-dynamic';

interface Props {
	params: Promise<{ uuid: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const resolvedParams = await params;
	return {
		title: `Detalle de Pago - ${resolvedParams.uuid}`,
		description: `Detalles de la orden de pago ${resolvedParams.uuid}`
	};
}

// Función para obtener los detalles de una payment order específica
async function getPaymentOrderByUuid(uuid: string): Promise<PaymentOrderResponseDto | null> {
	try {
		// Construir la URL base
		const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

		// Hacer fetch a la API
		const response = await fetch(`${baseUrl}/api/payment_order/${uuid}`, {
			cache: 'no-store', // Para obtener datos siempre frescos
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.status === 404) {
			return null;
		}

		if (!response.ok) {
			console.error('Error fetching payment order:', response.status, response.statusText);
			return null;
		}

		const data: PaymentOrderResponseDto = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching payment order:', error);
		return null;
	}
}

const PaymentDetailPage: React.FC<Props> = async ({ params }) => {
	// Resolver params primero
	const resolvedParams = await params;
	const { uuid } = resolvedParams;

	// Obtener los datos en el servidor
	const paymentOrder = await getPaymentOrderByUuid(uuid);

	// Si no se encuentra, mostrar 404
	if (!paymentOrder) {
		notFound();
	}

	return (
		<PaymentDetails
			paymentOrder={{
				...paymentOrder,
				available_payment_methods: []
			}}
			paymentMethods={paymentOrder.available_payment_methods || []}
		/>
	);
};

export default PaymentDetailPage;
