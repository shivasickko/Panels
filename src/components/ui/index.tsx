import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

export { Button, buttonVariants } from './button';

// Input Component
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-950 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// Separator Component
export const Separator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("shrink-0 bg-emerald-200/60 h-[1px] w-full", className)} {...props} />
);

// Slider Component
interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number | number[];
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}
export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    const val = Array.isArray(value) ? value[0] : value;
    const currentVal = val ?? min;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = Number(e.target.value);
      if (!isNaN(num)) {
        onValueChange?.(num);
      }
    };

    return (
      <input
        type="range"
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={currentVal}
        onInput={handleChange}
        onChange={handleChange}
        className={cn(
          "w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
          className
        )}
        {...props}
      />
    );
  }
);
Slider.displayName = "Slider";

// Select Components
interface SelectContextType {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}
const SelectContext = createContext<SelectContextType>({});

export const Select = ({
  children,
  value,
  defaultValue,
  onValueChange
}: {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [selectedValue, setSelectedValue] = useState(value ?? defaultValue ?? '');

  const handleChange = (val: string) => {
    setSelectedValue(val);
    onValueChange?.(val);
  };

  const currentVal = value !== undefined ? value : selectedValue;

  return (
    <SelectContext.Provider value={{ value: currentVal, defaultValue, onValueChange: handleChange }}>
      <div className="w-full">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children, className }: { children?: React.ReactNode; className?: string }) => null;
export const SelectValue = ({ placeholder }: { placeholder?: string }) => null;

export const SelectContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { value, onValueChange } = useContext(SelectContext);

  const items: { value: string; label: React.ReactNode }[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      items.push({
        value: child.props.value,
        label: child.props.children
      });
    }
  });

  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn(
          "w-full h-10 px-4 py-2 pr-8 text-xs font-extrabold bg-white text-emerald-950 border border-emerald-200/90 rounded-full shadow-sm hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer transition-all appearance-none",
          className
        )}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value} className="py-1 text-emerald-950 font-semibold bg-white">
            {item.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};

export const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => null;


// Dialog Components
interface DialogContextType {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
const DialogContext = createContext<DialogContextType>({});

export const Dialog = ({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) => {
  return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>;
};

export const DialogTrigger = ({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) => {
  const { onOpenChange } = useContext(DialogContext);
  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      onOpenChange?.(true);
    }
  });
};

export const DialogContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { open, onOpenChange } = useContext(DialogContext);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className={cn("relative w-full max-w-3xl rounded-3xl bg-[#faf9f5] border border-emerald-200/80 p-6 md:p-8 shadow-2xl my-8 text-emerald-950 flex flex-col", className)}>
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute right-5 top-5 h-9 w-9 rounded-full bg-emerald-100/70 hover:bg-emerald-200 flex items-center justify-center text-emerald-800 transition-colors focus:outline-none font-bold"
          aria-label="Close"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("flex flex-col space-y-1 text-left mb-4 pr-8", className)}>{children}</div>
);

export const DialogTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h3 className={cn("text-2xl font-extrabold tracking-tight text-emerald-950", className)}>{children}</h3>
);

export const DialogDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <p className={cn("text-sm text-emerald-700/80", className)}>{children}</p>
);

export const DialogFooter = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-2 mt-6 pt-4 border-t border-emerald-200/60", className)}>{children}</div>
);

// Tooltip Components
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const Tooltip = ({ children }: { asChild?: boolean; children: React.ReactNode }) => {
  return <div className="relative inline-block group">{children}</div>;
};

export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const TooltipContent = ({ children, className }: { children: React.ReactNode; sideOffset?: number; className?: string }) => {
  return (
    <div className={cn("absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col z-50 rounded-xl bg-emerald-950 px-3 py-2 text-xs text-emerald-100 shadow-xl pointer-events-none transition-all border border-emerald-800 whitespace-nowrap", className)}>
      {children}
    </div>
  );
};

// ScrollArea Components
export const ScrollArea = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("relative overflow-auto custom-scrollbar", className)}>{children}</div>
);

export const ScrollAreaScrollbar = ({ className }: { className?: string }) => null;

export const ScrollAreaViewport = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("w-full h-full", className)}>{children}</div>
);
