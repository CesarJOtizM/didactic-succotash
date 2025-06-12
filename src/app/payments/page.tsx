import React from 'react';
import { type Metadata, type NextPage } from 'next';
import { PaymentOrderResponseDto } from 'src/application/dtos';
import { PaymentList } from 'src/components';

// Configurar como página dinámica ya que los datos cambian frecuentemente
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Payments',
	description: 'Payments'
};

// Función para obtener los datos desde la API
async function getPaymentOrders(): Promise<PaymentOrderResponseDto[]> {
	try {
		// Construir la URL base
		const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

		// Hacer fetch a la API
		const response = await fetch(`${baseUrl}/api/payment_order`, {
			cache: 'no-store', // Para obtener datos siempre frescos
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			console.error('Error fetching payment orders:', response.status, response.statusText);
			return [];
		}

		const data: PaymentOrderResponseDto[] = await response.json();

		return data;
	} catch (error) {
		console.error('Error fetching payment orders:', error);
		return [];
	}
}

const PaymentsPage: NextPage = async () => {
	// Obtener los datos en el servidor
	const orders = await getPaymentOrders();

	return <PaymentList orders={orders} />;
};

export default PaymentsPage;
