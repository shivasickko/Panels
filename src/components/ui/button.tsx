import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none shadow-sm active:scale-[0.98] cursor-pointer rounded-xl",
  {
    variants: {
      variant: {
        default: "bg-emerald-800 text-white hover:bg-emerald-900 shadow-md hover:shadow-emerald-900/20 border border-transparent font-semibold",
        outline: "border border-emerald-300/80 bg-white text-emerald-900 hover:bg-emerald-50 hover:border-emerald-500 shadow-sm",
        secondary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-emerald-600/20 border border-transparent font-semibold",
        ghost: "hover:bg-emerald-100/60 text-emerald-800 hover:text-emerald-950 border border-transparent shadow-none",
        destructive: "bg-rose-600 text-white hover:bg-rose-700 shadow-md border border-transparent",
        link: "text-emerald-700 underline-offset-4 hover:underline border-transparent shadow-none p-0",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        xs: "h-7 px-2.5 text-xs rounded-lg",
        sm: "h-8 px-3 text-xs rounded-lg",
        lg: "h-12 px-6 text-base rounded-2xl font-bold",
        icon: "h-10 w-10 p-0 rounded-xl",
        "icon-xs": "h-6 w-6 p-0 rounded-lg",
        "icon-sm": "h-8 w-8 p-0 rounded-lg",
        "icon-lg": "h-12 w-12 p-0 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
