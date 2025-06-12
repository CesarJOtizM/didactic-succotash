'use client';

import React, { useState } from 'react';
import { Clock, CreditCard, Shield } from 'lucide-react';
import { PaymentMethodResponseDto, PaymentOrderResponseDto } from 'src/application/dtos';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui';
import { PaymentForm } from './PaymentForm';
import { PaymentMethodCard } from './PaymentMethodCard';
import { PaymentSummary } from './PaymentSummary';

interface Props {
	paymentOrder: PaymentOrderResponseDto;
	paymentMethods: PaymentMethodResponseDto[];
}

export interface IFormValues {
	name: string;
	documentType: string;
	documentNumber: string;
	email: string;
}

export const PaymentDetails: React.FC<Props> = ({ paymentOrder, paymentMethods }) => {
	const [step, setStep] = useState<'select' | 'form' | 'processing' | 'success' | 'error'>(
		'select'
	);
	const [loading, setLoading] = useState(false);
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethodResponseDto | null>(null);
	const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod?.id);

	const handleMethodSelect = (method: PaymentMethodResponseDto) => {
		setSelectedMethod(method);
		setStep('form');
	};

	const handlePaymentSubmit = async (formData: IFormValues) => {
		setLoading(true);
		setStep('processing');
		console.log(formData);

		try {
			// Simular procesamiento de pago
			await new Promise(resolve => setTimeout(resolve, 3000));

			// Simular éxito/error aleatorio para demostración
			const success = Math.random() > 0.3;

			if (success) {
				setStep('success');
			} else {
				setStep('error');
			}
		} catch (error) {
			console.error(error);
			setStep('error');
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			{/* Header */}
			<div className="mb-8 text-center">
				<h1 className="mb-2 text-3xl font-bold text-gray-900">Orquestación de Pagos</h1>
				<p className="text-gray-600">Completa tu pago de forma segura y rápida</p>
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					{step === 'select' && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<CreditCard className="h-5 w-5" />
									Métodos de Pago Disponibles
								</CardTitle>
								<CardDescription>
									Selecciona tu método de pago preferido para{' '}
									{paymentOrder.attributes.country_iso_code}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4">
									{paymentMethods?.map(method => (
										<PaymentMethodCard
											key={method.id}
											method={method}
											onSelect={() => handleMethodSelect(method)}
											disabled={loading}
										/>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{step === 'form' && selectedMethodData && (
						<PaymentForm
							paymentMethod={selectedMethodData}
							paymentOrder={paymentOrder}
							onSubmit={handlePaymentSubmit}
							onBack={() => setStep('select')}
						/>
					)}

					{step === 'processing' && (
						<Card>
							<CardContent className="py-12">
								<div className="space-y-4 text-center">
									<div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
									<h3 className="text-lg font-semibold">Procesando tu pago...</h3>
									<p className="text-gray-600">
										Estamos procesando tu transacción con {selectedMethodData?.name}
									</p>
									<div className="flex items-center justify-center gap-2 text-sm text-gray-500">
										<Clock className="h-4 w-4" />
										Tiempo estimado: {selectedMethodData?.configuration?.processing_time}
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{step === 'success' && (
						<Card className="border-green-200 bg-green-50">
							<CardContent className="py-12">
								<div className="space-y-4 text-center">
									<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
										<svg
											className="h-8 w-8 text-green-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<h3 className="text-lg font-semibold text-green-800">
										{paymentOrder.attributes.status === 'completed'
											? '¡Pago Completado!'
											: '¡Pago Exitoso!'}
									</h3>
									<p className="text-green-700">
										{paymentOrder.attributes.status === 'completed'
											? 'Este pago ya ha sido procesado exitosamente'
											: 'Tu transacción ha sido procesada correctamente'}
									</p>
									<div className="rounded-lg border border-green-200 bg-white p-4">
										<p className="text-sm text-gray-600">ID de Transacción:</p>
										<p className="font-mono text-sm">
											{paymentOrder.attributes.transaction_id ||
												'12345678-1234-5678-1234-567812345678'}
										</p>
										{paymentOrder.attributes?.provider && (
											<>
												<p className="mt-2 text-sm text-gray-600">Procesado por:</p>
												<p className="text-sm font-medium">{paymentOrder.attributes.provider}</p>
											</>
										)}
										{paymentOrder.attributes.processed_at && (
											<>
												<p className="mt-2 text-sm text-gray-600">Fecha de procesamiento:</p>
												<p className="text-sm">{paymentOrder.attributes.processed_at}</p>
											</>
										)}
									</div>
									{paymentOrder.attributes.status === 'completed' && (
										<div className="pt-4">
											<Button
												onClick={() => (window.location.href = '/')}
												variant="outline"
												className="border-green-300 text-green-700 hover:bg-green-100"
											>
												Volver al Dashboard
											</Button>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					{step === 'error' && (
						<Card className="border-red-200 bg-red-50">
							<CardContent className="py-12">
								<div className="space-y-4 text-center">
									<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
										<svg
											className="h-8 w-8 text-red-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</div>
									<h3 className="text-lg font-semibold text-red-800">Error en el Pago</h3>
									<p className="text-red-700">
										No pudimos procesar tu pago. Intentando con otro proveedor...
									</p>
									<Button
										onClick={() => setStep('select')}
										variant="outline"
										className="border-red-300 text-red-700 hover:bg-red-100"
									>
										Intentar Nuevamente
									</Button>
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					<PaymentSummary paymentOrder={paymentOrder} />

					{/* Security Info */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-sm">
								<Shield className="h-4 w-4" />
								Pago Seguro
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<div className="h-2 w-2 rounded-full bg-green-500"></div>
								Conexión SSL encriptada
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<div className="h-2 w-2 rounded-full bg-green-500"></div>
								Datos protegidos PCI DSS
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<div className="h-2 w-2 rounded-full bg-green-500"></div>
								Ruteo inteligente de pagos
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};
