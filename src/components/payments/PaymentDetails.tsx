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

export const PaymentDetails: React.FC<Props> = ({
	paymentOrder: initialPaymentOrder,
	paymentMethods
}) => {
	const [step, setStep] = useState<'select' | 'form' | 'processing' | 'success' | 'error'>(
		'select'
	);
	const [loading, setLoading] = useState(false);
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethodResponseDto | null>(null);
	const [paymentOrder, setPaymentOrder] = useState<PaymentOrderResponseDto>(initialPaymentOrder);
	const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod?.id);

	const handleMethodSelect = (method: PaymentMethodResponseDto) => {
		setSelectedMethod(method);
		setStep('form');
	};

	// Función para actualizar el payment order desde el servidor
	const refreshPaymentOrder = async () => {
		try {
			const response = await fetch(`/api/payment_order/${paymentOrder.uuid}`);
			if (response.ok) {
				const updatedPaymentOrder = await response.json();
				setPaymentOrder(updatedPaymentOrder);
			}
		} catch (error) {
			console.error('Error al actualizar payment order:', error);
		}
	};

	const handlePaymentSubmit = async (formData: IFormValues) => {
		setLoading(true);
		setStep('processing');

		try {
			// Hacer llamada al API para procesar el pago
			const response = await fetch(`/api/payment_order/${paymentOrder.uuid}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					payment_method_id: selectedMethod?.id,
					// Se pueden agregar más datos del formulario si son necesarios
					customer_data: formData
				})
			});

			if (!response.ok) {
				// Si el response no es ok, intentamos obtener el mensaje de error
				const errorData = await response.json().catch(() => null);
				throw new Error(errorData?.error || `Error del servidor: ${response.status}`);
			}

			// Parsear la respuesta
			const result = await response.json();

			// Verificar el status de la respuesta del procesamiento
			if (result.status === 'success') {
				console.log('✅ Pago procesado exitosamente:', result.transaction_id);
				setStep('success');
				await refreshPaymentOrder();
			} else if (result.status === 'Error') {
				console.log('❌ Error en el procesamiento del pago:', result.transaction_id);
				setStep('error');
				await refreshPaymentOrder();
			} else {
				// Manejar casos inesperados
				console.warn('⚠️ Respuesta inesperada del API:', result);
				setStep('error');
				await refreshPaymentOrder();
			}
		} catch (error) {
			console.error('💥 Error al procesar el pago:', error);
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
