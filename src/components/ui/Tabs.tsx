'use client';

import * as React from 'react';
import { cn } from 'src/lib/utils';

interface TabsContextType {
	value: string;
	onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
	const context = React.useContext(TabsContext);
	if (!context) {
		throw new Error('Tabs components must be used within a Tabs provider');
	}
	return context;
};

interface TabsProps {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	children: React.ReactNode;
	className?: string;
}

const Tabs = ({ value, defaultValue, onValueChange, children, className }: TabsProps) => {
	const [internalValue, setInternalValue] = React.useState(defaultValue || '');

	const currentValue = value !== undefined ? value : internalValue;
	const handleValueChange = (newValue: string) => {
		if (value === undefined) {
			setInternalValue(newValue);
		}
		onValueChange?.(newValue);
	};

	return (
		<TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
			<div className={cn('w-full', className)}>{children}</div>
		</TabsContext.Provider>
	);
};

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				'inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500',
				className
			)}
			{...props}
		/>
	)
);
TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
	({ className, value, ...props }, ref) => {
		const { value: currentValue, onValueChange } = useTabsContext();
		const isActive = currentValue === value;

		return (
			<button
				ref={ref}
				className={cn(
					'inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap ring-offset-white transition-all focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
					isActive ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500 hover:text-gray-900',
					className
				)}
				onClick={() => onValueChange(value)}
				{...props}
			/>
		);
	}
);
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
	({ className, value, ...props }, ref) => {
		const { value: currentValue } = useTabsContext();

		if (currentValue !== value) {
			return null;
		}

		return (
			<div
				ref={ref}
				className={cn(
					'mt-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 focus-visible:outline-none',
					className
				)}
				{...props}
			/>
		);
	}
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
