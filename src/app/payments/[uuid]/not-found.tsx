'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { Button, Card, CardContent } from 'src/components/ui';

export default function NotFound() {
	const router = useRouter();

	const handleGoBack = () => {
		router.push('/payments');
	};

	return (
		<div className="container mx-auto max-w-2xl px-4 py-16">
			<Card>
				<CardContent className="p-8 text-center">
					<div className="mb-6">
						<AlertCircle className="mx-auto h-16 w-16 text-gray-400" />
					</div>

					<h1 className="mb-4 text-2xl font-bold text-gray-900">Orden de Pago No Encontrada</h1>

					<p className="mb-8 text-gray-600">
						La orden de pago que estás buscando no existe o ha sido eliminada. Por favor, verifica
						el UUID y vuelve a intentarlo.
					</p>

					<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
						<Button onClick={handleGoBack} className="flex items-center gap-2">
							<ArrowLeft className="h-4 w-4" />
							Volver a Pagos
						</Button>

						<Button
							variant="outline"
							onClick={() => router.push('/payments')}
							className="flex items-center gap-2"
						>
							<Search className="h-4 w-4" />
							Buscar Otras Órdenes
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
