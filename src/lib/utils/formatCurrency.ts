export const formatCurrency = (amount: number, currency: string) => {
	const symbols = {
		CLP: '$',
		COP: '$',
		PEN: 'S/',
		MXN: '$',
		USD: '$'
	};

	const symbol = symbols[currency as keyof typeof symbols] || '$';

	// Formatear número manualmente para consistencia entre servidor y cliente
	const formattedAmount = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(amount);

	return `${symbol}${formattedAmount} ${currency}`;
};
