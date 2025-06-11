import React from 'react';

interface Iprops {
	icon: React.ReactNode;
	message: string;
}

export const EmptyResults: React.FC<Iprops> = ({ icon, message }) => {
	return (
		<div className="py-12 text-center">
			<div className="mb-2 text-gray-400">{icon}</div>
			<p className="text-gray-500">{message}</p>
		</div>
	);
};
