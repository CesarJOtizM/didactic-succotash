'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, Clock, Shield, Zap } from 'lucide-react';
import { PaymentOrderResponseDto } from 'src/application/dtos';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	EmptyResults,
	PaymentCard,
	StatusTabs
} from 'src/components';

interface Iprops {
	orders: PaymentOrderResponseDto[];
}

interface IOrder {
	pendingOrders: PaymentOrderResponseDto[];
	completedOrders: PaymentOrderResponseDto[];
	failedOrders: PaymentOrderResponseDto[];
}

export const PaymentList: React.FC<Iprops> = ({ orders }) => {
	const [activeTab, setActiveTab] = useState('pending');
	const [sortedOrders, setSortedOrders] = useState<IOrder>({
		pendingOrders: [
			{
				uuid: '2f239a85-5f06-4960-a010-b4517e18dd3e',
				type: 'payment_order',
				attributes: {
					amount: 70000,
					description: 'Pago de prueba',
					country_iso_code: 'MX',
					created_at: '2025-06-11T23:30:31.023Z',
					payment_url:
						'http://localhost:3000/api/payment_order/2f239a85-5f06-4960-a010-b4517e18dd3e',
					status: 'pending',
					provider: 'stripe',
					attempts: 0
				}
			},
			{
				uuid: 'af524644-ab83-4424-b848-58344ba7fd68',
				type: 'payment_order',
				attributes: {
					amount: 70000,
					description: 'Pago de prueba',
					country_iso_code: 'CO',
					created_at: '2025-06-11T23:25:10.641Z',
					payment_url:
						'http://localhost:3000/api/payment_order/af524644-ab83-4424-b848-58344ba7fd68',
					status: 'pending',
					provider: ' ',
					attempts: 0
				}
			}
		],
		completedOrders: [
			{
				uuid: '5e291c13-65e1-4e0c-803f-bd610ecbee9b',
				type: 'payment_order',
				attributes: {
					amount: 70000,
					description: 'Pago de prueba',
					country_iso_code: 'CL',
					created_at: '2025-06-11T23:25:02.086Z',
					payment_url:
						'http://localhost:3000/api/payment_order/5e291c13-65e1-4e0c-803f-bd610ecbee9b',
					status: 'completed',
					provider: ' ',
					attempts: 0
				}
			},
			{
				uuid: '3c8d5a01-b8e6-4c31-a81a-7158b668e8e7',
				type: 'payment_order',
				attributes: {
					amount: 70000,
					description: 'Pago de prueba',
					country_iso_code: 'CL',
					created_at: '2025-06-11T23:23:09.894Z',
					payment_url:
						'http://localhost:3000/api/payment_order/3c8d5a01-b8e6-4c31-a81a-7158b668e8e7',
					status: 'completed',
					provider: ' ',
					attempts: 0
				}
			}
		],
		failedOrders: [
			{
				uuid: 'e590b87c-5b22-4a2c-a3a9-109ecca3477e',
				type: 'payment_order',
				attributes: {
					amount: 70000,
					description: 'Pago de prueba',
					country_iso_code: 'CO',
					created_at: '2025-06-11T23:25:08.607Z',
					payment_url:
						'http://localhost:3000/api/payment_order/e590b87c-5b22-4a2c-a3a9-109ecca3477e',
					status: 'failed',
					provider: ' ',
					attempts: 0
				}
			},
			{
				uuid: '827f1965-e60c-43f2-8e37-7aede84fd6ef',
				type: 'payment_order',
				attributes: {
					amount: 70000,
					description: 'Pago de prueba',
					country_iso_code: 'CL',
					created_at: '2025-06-11T23:23:08.404Z',
					payment_url:
						'http://localhost:3000/api/payment_order/827f1965-e60c-43f2-8e37-7aede84fd6ef',
					status: 'failed',
					provider: ' ',
					attempts: 0
				}
			}
		]
	});

	const getOrdersByStatus = (orders: PaymentOrderResponseDto[]) => {
		const pendingOrders: PaymentOrderResponseDto[] = [];
		const completedOrders: PaymentOrderResponseDto[] = [];
		const failedOrders: PaymentOrderResponseDto[] = [];

		orders.forEach(order => {
			if (order.attributes.status === 'pending') {
				pendingOrders.push(order);
			} else if (order.attributes.status === 'completed') {
				completedOrders.push(order);
			} else if (order.attributes.status === 'failed') {
				failedOrders.push(order);
			}
		});
		return { pendingOrders, completedOrders, failedOrders };
	};

	useEffect(() => {
		const sortedOrders = getOrdersByStatus(orders);
		setSortedOrders(sortedOrders);
	}, [orders]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="container mx-auto max-w-6xl px-4 py-8">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="mb-2 text-3xl font-bold text-gray-900">Orquestación de Pagos</h1>
					<p className="mb-6 text-gray-600">
						Sistema inteligente de procesamiento de pagos con ruteo automático
					</p>
				</div>

				{/* Main Content */}
				<div className="grid gap-8">
					{/* Payment Orders */}
					<Card>
						<CardHeader>
							<CardTitle>Órdenes de Pago</CardTitle>
							<CardDescription>
								Gestiona todas tus órdenes de pago desde un solo lugar
							</CardDescription>
						</CardHeader>
						<CardContent>
							<StatusTabs
								pendingCount={sortedOrders.pendingOrders.length}
								completedCount={sortedOrders.completedOrders.length}
								failedCount={sortedOrders.failedOrders.length}
								activeTab={activeTab}
								onTabChange={setActiveTab}
							>
								<div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
									{orders.length === 0 && (
										<EmptyResults
											icon={<Clock className="mx-auto h-12 w-12" />}
											message="No hay órdenes de pago"
										/>
									)}

									{activeTab === 'pending' &&
										sortedOrders.pendingOrders.map(order => (
											<PaymentCard key={order.uuid} paymentOrder={order} />
										))}

									{activeTab === 'completed' &&
										sortedOrders.completedOrders.map(order => (
											<PaymentCard key={order.uuid} paymentOrder={order} />
										))}

									{activeTab === 'failed' &&
										sortedOrders.failedOrders.map(order => (
											<PaymentCard key={order.uuid} paymentOrder={order} />
										))}
								</div>
							</StatusTabs>
						</CardContent>
					</Card>

					{/* Features */}
					<div className="mt-4 grid gap-6 md:grid-cols-3">
						<Card className="text-center">
							<CardContent className="pt-6">
								<Zap className="mx-auto mb-4 h-10 w-10 text-yellow-600" />
								<h3 className="mb-2 font-semibold">Ruteo Inteligente</h3>
								<p className="text-sm text-gray-600">
									Failover automático entre proveedores de pago
								</p>
							</CardContent>
						</Card>

						<Card className="text-center">
							<CardContent className="pt-6">
								<Shield className="mx-auto mb-4 h-10 w-10 text-green-600" />
								<h3 className="mb-2 font-semibold">Seguridad</h3>
								<p className="text-sm text-gray-600">Encriptación SSL y cumplimiento PCI DSS</p>
							</CardContent>
						</Card>

						<Card className="text-center">
							<CardContent className="pt-6">
								<BarChart3 className="mx-auto mb-4 h-10 w-10 text-purple-600" />
								<h3 className="mb-2 font-semibold">Métricas</h3>
								<p className="text-sm text-gray-600">Seguimiento completo de transacciones</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};
