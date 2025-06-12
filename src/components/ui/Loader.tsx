import React from 'react';

export const Loader = () => {
	return (
		<div className="py-12 text-center">
			<div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
			<p className="text-gray-600">Cargando órdenes...</p>
		</div>
	);
};
