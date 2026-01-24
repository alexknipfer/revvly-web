import * as React from 'react';

import { cn } from '@/lib/utils';
import { useFieldContext } from '@/hooks/use-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-transparent flex h-9 w-full min-w-0 rounded-none border border-input px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-mono',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:border-ring/70',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

interface FormInputProps {
  label?: string;
  className?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

function FormInput({
  label,
  className,
  type = 'text',
  placeholder,
  disabled,
  readOnly,
}: FormInputProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid} className={className}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Input
        name={field.name}
        type={type}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={isInvalid}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}

export { Input, FormInput };
