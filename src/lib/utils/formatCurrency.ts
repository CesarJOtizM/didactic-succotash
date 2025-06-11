export const formatCurrency = (amount: number, currency: string) => {
	const symbols = {
		CLP: '$',
		COP: '$',
		PEN: 'S/',
		MXN: '$',
		USD: '$'
	};

	// Mapeo de códigos de país a configuraciones regionales para formateo consistente
	const localeMap = {
		CL: 'es-CL',
		CO: 'es-CO',
		PE: 'es-PE',
		MX: 'es-MX',
		USD: 'en-US'
	};

	const symbol = symbols[currency as keyof typeof symbols] || '$';
	const locale = localeMap[currency as keyof typeof localeMap] || 'en-US';

	// Usar configuración regional específica para evitar diferencias entre servidor y cliente
	return `${symbol}${amount.toLocaleString(locale)} ${currency}`;
};
