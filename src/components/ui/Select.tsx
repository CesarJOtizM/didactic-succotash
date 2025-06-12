'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from 'src/lib/utils';

interface SelectContextType {
	value: string;
	onValueChange: (value: string) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

const useSelectContext = () => {
	const context = React.useContext(SelectContext);
	if (!context) {
		throw new Error('Select components must be used within a Select provider');
	}
	return context;
};

interface SelectProps {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	children: React.ReactNode;
}

const Select = ({ value, defaultValue, onValueChange, children }: SelectProps) => {
	const [internalValue, setInternalValue] = React.useState(defaultValue || '');
	const [open, setOpen] = React.useState(false);

	const currentValue = value !== undefined ? value : internalValue;
	const handleValueChange = (newValue: string) => {
		if (value === undefined) {
			setInternalValue(newValue);
		}
		onValueChange?.(newValue);
		setOpen(false);
	};

	return (
		<SelectContext.Provider
			value={{ value: currentValue, onValueChange: handleValueChange, open, setOpen }}
		>
			<div className="relative">{children}</div>
		</SelectContext.Provider>
	);
};

const SelectTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }
>(({ className, children, ...props }, ref) => {
	const { open, setOpen } = useSelectContext();

	return (
		<button
			ref={ref}
			className={cn(
				'flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			onClick={() => setOpen(!open)}
			{...props}
		>
			{children}
			<ChevronDown className="h-4 w-4 opacity-50" />
		</button>
	);
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, ...props }, ref) => {
	const { value } = useSelectContext();

	return (
		<span ref={ref} className={cn(className)} {...props}>
			{value || placeholder}
		</span>
	);
});
SelectValue.displayName = 'SelectValue';

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, children, ...props }, ref) => {
		const { open } = useSelectContext();

		if (!open) return null;

		return (
			<div
				ref={ref}
				className={cn(
					'animate-in fade-in-0 zoom-in-95 absolute top-full z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md',
					className
				)}
				{...props}
			>
				<div className="p-1">{children}</div>
			</div>
		);
	}
);
SelectContent.displayName = 'SelectContent';

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
	({ className, children, value, ...props }, ref) => {
		const { onValueChange, value: currentValue } = useSelectContext();
		const isSelected = currentValue === value;

		return (
			<div
				ref={ref}
				className={cn(
					'relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none hover:bg-gray-100 focus:bg-gray-100',
					isSelected && 'bg-gray-100',
					className
				)}
				onClick={() => onValueChange(value)}
				{...props}
			>
				{isSelected && (
					<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
						<div className="h-2 w-2 rounded-full bg-gray-900" />
					</span>
				)}
				{children}
			</div>
		);
	}
);
SelectItem.displayName = 'SelectItem';

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
