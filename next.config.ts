import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				source: '/',
				destination: '/payments',
				permanent: true
			}
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**' // Permite cualquier host (no recomendado para producción)
			},
			{
				protocol: 'http',
				hostname: '**' // Si necesitas http también
			}
		]
	}
};

export default nextConfig;
