import { NextResponse } from 'next/server';

interface HealthResponse {
	status: 'healthy';
	timestamp: string;
	service: string;
}

interface ErrorResponse {
	status: 'unhealthy';
	error: string;
}

export async function GET(): Promise<NextResponse<HealthResponse | ErrorResponse>> {
	try {
		const response: HealthResponse = {
			status: 'healthy',
			timestamp: new Date().toISOString(),
			service: 'didactic-succotash'
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error(error);

		const errorResponse: ErrorResponse = {
			status: 'unhealthy',
			error: 'Service unavailable'
		};

		return NextResponse.json(errorResponse, { status: 503 });
	}
}
