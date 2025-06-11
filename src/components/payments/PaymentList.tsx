'use client';

import React, { useState } from 'react';
import { BarChart3, Clock, Shield, Zap } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	EmptyResults,
	StatusTabs
} from 'src/components';
import { PaymentOrder } from 'src/domain/entities';

interface Iprops {
	orders: PaymentOrder[];
}

export const PaymentList: React.FC<Iprops> = ({ orders }) => {
	const [activeTab, setActiveTab] = useState('pending');

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
								pendingCount={0}
								completedCount={0}
								failedCount={0}
								activeTab={activeTab}
								onTabChange={setActiveTab}
							>
								<div className="mt-4">
									{orders.length === 0 && (
										<EmptyResults
											icon={<Clock className="mx-auto h-12 w-12" />}
											message="No hay órdenes de pago"
										/>
									)}

									{/* {activeTab === "pending" && renderOrders(pendingOrders, "pending")}
                  {activeTab === "completed" && renderOrders(completedOrders, "completed")}
                  {activeTab === "failed" && renderOrders(failedOrders, "failed")} */}
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
