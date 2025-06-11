import * as React from 'react';
import { cn } from 'src/lib/utils';

const Label = React.forwardRef<
	HTMLLabelElement,
	React.LabelHTMLAttributes<HTMLLabelElement> & { className?: string }
>(({ className, ...props }, ref) => (
	<label
		ref={ref}
		className={cn(
			'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
			className
		)}
		{...props}
	/>
));
Label.displayName = 'Label';

export { Label };
