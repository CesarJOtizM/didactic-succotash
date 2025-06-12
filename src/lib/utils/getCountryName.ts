export const getCountryName = (code: string) => {
	const countries = {
		CL: 'Chile',
		CO: 'Colombia',
		PE: 'Perú',
		MX: 'México'
	};
	return countries[code as keyof typeof countries] || code;
};
