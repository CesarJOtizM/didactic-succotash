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
		pendingOrders: [],
		completedOrders: [],
		failedOrders: []
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
								<div className="gap-4">
									{orders.length === 0 && (
										<EmptyResults
											icon={<Clock className="mx-auto h-12 w-12" />}
											message="No hay órdenes de pago"
										/>
									)}

									<div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
