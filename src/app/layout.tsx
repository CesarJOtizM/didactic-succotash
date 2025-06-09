import { PropsWithChildren } from 'react';

import 'src/styles/global.css';

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className="bg-gray-50 transition-colors duration-300 dark:bg-gray-900">{children}</body>
		</html>
	);
}
