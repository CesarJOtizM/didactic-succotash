export const formatCurrency = (amount: number, currency: string) => {
	const symbols = {
		CLP: '$',
		COP: '$',
		PEN: 'S/',
		MXN: '$',
		USD: '$'
	};
	const symbol = symbols[currency as keyof typeof symbols] || '$';
	return `${symbol}${amount.toLocaleString()} ${currency}`;
};
