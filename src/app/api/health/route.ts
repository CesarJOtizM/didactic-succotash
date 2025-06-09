import { NextResponse } from 'next/server';

export async function GET() {
	try {
		return NextResponse.json({
			status: 'healthy',
			timestamp: new Date().toISOString(),
			service: 'didactic-succotash'
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ status: 'unhealthy', error: 'Service unavailable' },
			{ status: 503 }
		);
	}
}
