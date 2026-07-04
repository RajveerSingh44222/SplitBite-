import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-soft">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">{icon}</span>}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "h-12 w-full rounded-xl border border-border-subtle bg-surface px-4 text-sm outline-none transition-all placeholder:text-ink-soft/50 focus:border-ember focus:ring-4 focus:ring-ember/10",
              icon && "pl-11",
              error && "border-chili focus:border-chili focus:ring-chili/10",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-chili">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-soft">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm outline-none transition-all placeholder:text-ink-soft/50 focus:border-ember focus:ring-4 focus:ring-ember/10",
            error && "border-chili",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs font-medium text-chili">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
