'use client';

import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { PaymentMethodResponseDto } from 'src/application/dtos';
import { Badge, Button, Card, CardContent } from '../ui';

interface IProps {
	method: PaymentMethodResponseDto;
	onSelect: () => void;
	disabled?: boolean;
}

export const PaymentMethodCard: React.FC<IProps> = ({ method, onSelect, disabled }) => {
	return (
		<Card
			className={`transition-all duration-200 hover:shadow-md ${
				disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-blue-300'
			}`}
		>
			<CardContent className="p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="text-2xl">💳</div>
						<div className="flex-1">
							<div className="mb-1 flex items-center gap-2">
								<h3 className="font-semibold text-gray-900">{method.name}</h3>
								<Badge variant="secondary" className="bg-green-100 text-green-800">
									<CheckCircle className="mr-1 h-3 w-3" />
									Disponible
								</Badge>
							</div>
							<p className="mb-2 text-sm text-gray-600">{method.description}</p>
							<div className="flex items-center gap-4 text-xs text-gray-500">
								<span>Proveedor: {method.name}</span>
								<div className="flex items-center gap-1">
									<Clock className="h-3 w-3" />
									{method.configuration.processing_time}
								</div>
							</div>
						</div>
					</div>
					<Button onClick={onSelect} disabled={disabled} className="ml-4">
						Seleccionar
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
