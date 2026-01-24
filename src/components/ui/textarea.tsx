import * as React from 'react';

import { cn } from '@/lib/utils';
import { useFieldContext } from '@/hooks/use-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] hover:border-ring/70 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-mono',
        className,
      )}
      {...props}
    />
  );
}

interface FormTextareaProps {
  label?: string;
  className?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

function FormTextarea({
  label,
  className,
  placeholder,
  rows,
  disabled,
}: FormTextareaProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid} className={className}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Textarea
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        aria-invalid={isInvalid}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}

export { Textarea, FormTextarea };
