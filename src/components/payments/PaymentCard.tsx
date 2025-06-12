'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calendar, CheckCircle, Clock, MapPin, XCircle } from 'lucide-react';
import { PaymentOrderResponseDto } from 'src/application/dtos';
import { formatCurrency } from 'src/lib/utils/formatCurrency';
import { Badge, Button, Card, CardContent } from '../ui';

interface Iprops {
	paymentOrder: PaymentOrderResponseDto;
}

export const PaymentCard: React.FC<Iprops> = ({ paymentOrder }) => {
	const router = useRouter();
	const {
		uuid,
		attributes: {
			description,
			amount,
			status,
			created_at,
			processed_at,
			provider,
			attempts,
			country_iso_code
		}
	} = paymentOrder;

	const onViewDetail = () => {
		router.push(`/payments/${uuid}`);
	};

	const renderStatusBadge = (status: string) => {
		switch (status) {
			case 'completed':
				return (
					<Badge
						variant="outline"
						className="flex shrink-0 items-center gap-1 border-green-200 bg-green-100 text-green-800"
					>
						<CheckCircle className="h-3 w-3" />
						<span className="text-xs">Completado</span>
					</Badge>
				);
			case 'failed':
				return (
					<Badge
						variant="outline"
						className="flex shrink-0 items-center gap-1 border-red-200 bg-red-100 text-red-800"
					>
						<XCircle className="h-3 w-3" />
						<span className="text-xs">Fallido</span>
					</Badge>
				);
			case 'pending':
			default:
				return (
					<Badge
						variant="outline"
						className="flex shrink-0 items-center gap-1 border-yellow-200 bg-yellow-100 text-yellow-800"
					>
						<Clock className="h-3 w-3" />
						<span className="text-xs">Pendiente</span>
					</Badge>
				);
		}
	};

	return (
		<Card
			className="h-full cursor-pointer transition-shadow hover:shadow-md"
			onClick={onViewDetail}
		>
			<CardContent className="flex h-full flex-col p-4">
				<div className="flex-1 space-y-3">
					{/* Header con mejor distribución */}
					<div className="flex items-start gap-3">
						<div className="min-w-0 flex-1">
							<h3 className="mb-1 line-clamp-2 text-sm leading-tight font-medium">{description}</h3>
							<p className="font-mono text-xs text-gray-500">{uuid.substring(0, 8)}...</p>
						</div>
						<div className="shrink-0">{renderStatusBadge(status || 'pending')}</div>
					</div>

					{/* Amount - más prominente */}
					<div className="py-1 text-lg font-semibold text-blue-600">
						{formatCurrency(amount, country_iso_code || 'USD')}
					</div>

					{/* Details en grid compacto */}
					<div className="space-y-1.5 text-xs text-gray-600">
						<div className="flex items-center gap-1.5">
							<MapPin className="h-3 w-3 shrink-0" />
							<span className="truncate">{country_iso_code}</span>
						</div>
						<div className="flex items-center gap-1.5">
							<Calendar className="h-3 w-3 shrink-0" />
							<span className="truncate">
								{status === 'pending' ? 'Creado: ' : 'Procesado: '}
								{processed_at || created_at}
							</span>
						</div>

						{provider && (
							<div className="flex items-start gap-1.5">
								<span className="shrink-0 font-medium">Proveedor:</span>
								<span className="truncate">{provider}</span>
							</div>
						)}
						{attempts && attempts > 1 && (
							<div className="flex items-center gap-1.5">
								<span className="shrink-0 font-medium">Intentos:</span>
								<span>{attempts}</span>
							</div>
						)}
					</div>
				</div>

				{/* Action button siempre al final */}
				<div className="mt-4 border-t border-gray-100 pt-3">
					<Button size="sm" variant="outline" onClick={onViewDetail} className="w-full">
						<span className="mr-2 text-xs">Ver detalle</span>
						<ArrowRight className="h-4 w-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
