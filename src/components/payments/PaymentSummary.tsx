'use client';

import React from 'react';
import { Calendar, FileText, MapPin } from 'lucide-react';
import { PaymentOrderResponseDto } from 'src/application/dtos';
import { formatCurrency } from 'src/lib/utils/formatCurrency';
import { getCountryName } from 'src/lib/utils/getCountryName';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '../ui';
import { Separator } from '../ui/Separator';

interface OrderSummaryProps {
	paymentOrder: PaymentOrderResponseDto;
}

export const PaymentSummary: React.FC<OrderSummaryProps> = ({ paymentOrder }) => {
	return (
		<Card className="sticky top-4">
			<CardHeader>
				<CardTitle className="text-lg">Resumen de la Orden</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Información básica */}
				<div className="space-y-3">
					<div className="flex items-start gap-2">
						<FileText className="mt-1 h-4 w-4 text-gray-500" />
						<div className="flex-1">
							<p className="text-sm font-medium">Descripción</p>
							<p className="text-sm text-gray-600">{paymentOrder.attributes.description}</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<MapPin className="h-4 w-4 text-gray-500" />
						<div className="flex-1">
							<p className="text-sm font-medium">País</p>
							<p className="text-sm text-gray-600">
								{getCountryName(paymentOrder.attributes.country_iso_code)}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Calendar className="h-4 w-4 text-gray-500" />
						<div className="flex-1">
							<p className="text-sm font-medium">Fecha de creación</p>
							<p className="text-sm text-gray-600">{paymentOrder.attributes.created_at}</p>
						</div>
					</div>
				</div>

				<Separator />

				{/* Monto */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm">Subtotal</span>
						<span className="text-sm">
							{formatCurrency(
								paymentOrder.attributes.amount,
								paymentOrder.attributes.country_iso_code
							)}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm">Comisión</span>
						<span className="text-sm text-green-600">$0</span>
					</div>
					<Separator />
					<div className="flex items-center justify-between text-lg font-semibold">
						<span>Total</span>
						<span className="text-blue-600">
							{formatCurrency(
								paymentOrder.attributes.amount,
								paymentOrder.attributes.country_iso_code
							)}
						</span>
					</div>
				</div>

				{/* ID de orden */}
				<div className="rounded-lg bg-gray-50 p-3">
					<p className="mb-1 text-xs text-gray-500">ID de Orden</p>
					<p className="font-mono text-xs break-all">{paymentOrder.uuid}</p>
				</div>

				{/* Estado */}
				<div className="flex justify-center">
					{paymentOrder.attributes.status === 'completed' ? (
						<Badge variant="secondary" className="bg-green-100 text-green-800">
							✓ Pago Completado
						</Badge>
					) : paymentOrder.attributes.status === 'failed' ? (
						<Badge variant="secondary" className="bg-red-100 text-red-800">
							✗ Pago Fallido
						</Badge>
					) : (
						<Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
							⏳ Pendiente de Pago
						</Badge>
					)}
				</div>

				{/* Información adicional para pagos completados */}
				{paymentOrder.attributes.status === 'completed' &&
					paymentOrder.attributes.transaction_id && (
						<div className="rounded-lg border border-green-200 bg-green-50 p-3">
							<p className="mb-1 text-xs text-green-700">Información de Transacción</p>
							<div className="space-y-1">
								<div className="flex justify-between text-xs">
									<span className="text-green-600">ID:</span>
									<span className="font-mono text-green-800">
										{paymentOrder.attributes.transaction_id?.substring(0, 12)}...
									</span>
								</div>
								<div className="flex justify-between text-xs">
									<span className="text-green-600">Proveedor:</span>
									<span className="text-green-800">{paymentOrder.attributes.provider}</span>
								</div>
								{paymentOrder.attributes.processed_at && (
									<div className="flex justify-between text-xs">
										<span className="text-green-600">Procesado:</span>
										<span className="text-green-800">{paymentOrder.attributes.processed_at}</span>
									</div>
								)}
							</div>
						</div>
					)}
			</CardContent>
		</Card>
	);
};
