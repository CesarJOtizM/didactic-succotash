import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
	try {
		return NextResponse.json(
			{
				message: '¡Hola mundo!',
				timestamp: new Date().toISOString(),
				status: 'success'
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: 'Error en el endpoint',
				error: error instanceof Error ? error.message : 'Error desconocido'
			},
			{ status: 500 }
		);
	}
}
