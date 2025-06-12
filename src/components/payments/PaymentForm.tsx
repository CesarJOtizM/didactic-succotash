'use client';

import type React from 'react';
import { useState } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { PaymentMethodResponseDto, PaymentOrderResponseDto } from 'src/application/dtos';
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '../ui';
import { IFormValues } from './PaymentDetails';

interface IProps {
	paymentMethod: PaymentMethodResponseDto;
	paymentOrder: PaymentOrderResponseDto;
	onSubmit: (formData: IFormValues) => void;
	onBack: () => void;
}

export const PaymentForm: React.FC<IProps> = ({
	paymentMethod,
	paymentOrder,
	onSubmit,
	onBack
}) => {
	const [formData, setFormData] = useState<IFormValues>({
		name: '',
		documentType: '',
		documentNumber: '',
		email: ''
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const isFormValid =
		formData.name && formData.documentType && formData.documentNumber && formData.email;

	return (
		<Card>
			<CardHeader>
				<div className="mb-2 flex items-center gap-2">
					<Button variant="ghost" size="sm" onClick={onBack}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div className="flex items-center gap-2">
						<span className="text-xl">💳</span>
						<div>
							<CardTitle className="text-lg">{paymentMethod.name}</CardTitle>
							<CardDescription>Completa tus datos para continuar</CardDescription>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Información del método de pago */}
					<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
						<div className="mb-2 flex items-center gap-2">
							<CreditCard className="h-4 w-4 text-blue-600" />
							<span className="text-sm font-medium text-blue-800">
								Procesado por {paymentMethod.name}
							</span>
						</div>
						<p className="text-sm text-blue-700">{paymentMethod.description}</p>
					</div>

					{/* Formulario */}
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Nombre Completo *</Label>
							<Input
								id="name"
								type="text"
								placeholder="Ingresa tu nombre completo"
								value={formData.name}
								onChange={e => handleInputChange('name', e.target.value)}
								required
							/>
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="grid gap-2">
								<Label htmlFor="documentType">Tipo de Documento *</Label>
								<Select
									value={formData.documentType}
									onValueChange={value => handleInputChange('documentType', value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona tipo" />
									</SelectTrigger>
									<SelectContent>
										{paymentOrder.attributes.country_iso_code === 'CL' && (
											<>
												<SelectItem value="rut">RUT</SelectItem>
												<SelectItem value="passport">Pasaporte</SelectItem>
											</>
										)}
										{paymentOrder.attributes.country_iso_code === 'CO' && (
											<>
												<SelectItem value="cc">Cédula de Ciudadanía</SelectItem>
												<SelectItem value="ce">Cédula de Extranjería</SelectItem>
												<SelectItem value="passport">Pasaporte</SelectItem>
											</>
										)}
										<SelectItem value="other">Otro</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="documentNumber">Número de Documento *</Label>
								<Input
									id="documentNumber"
									type="text"
									placeholder="Número sin puntos ni guiones"
									value={formData.documentNumber}
									onChange={e => handleInputChange('documentNumber', e.target.value)}
									required
								/>
							</div>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="email">Correo Electrónico *</Label>
							<Input
								id="email"
								type="email"
								placeholder="tu@email.com"
								value={formData.email}
								onChange={e => handleInputChange('email', e.target.value)}
								required
							/>
						</div>
					</div>

					{/* Términos y condiciones */}
					<div className="rounded bg-gray-50 p-3 text-xs text-gray-600">
						Al continuar, aceptas nuestros términos y condiciones de uso. Tu información será
						procesada de forma segura por {paymentMethod.name}.
					</div>

					{/* Botón de envío */}
					<Button type="submit" className="w-full" size="lg" disabled={!isFormValid}>
						Procesar Pago
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};
