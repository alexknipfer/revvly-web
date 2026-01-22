import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { CheckIcon } from 'lucide-react';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { useFieldContext } from '../../hooks/use-form';
import { Field, FieldContent, FieldDescription, FieldLabel } from './field';

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'border-input dark:bg-input/30 data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-primary aria-invalid:aria-checked:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 flex size-4 items-center justify-center rounded-[4px] border transition-colors group-has-disabled/field:opacity-50 focus-visible:ring-[3px] aria-invalid:ring-[3px] peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

interface CheckboxFieldProps {
  label?: string;
  description?: ReactNode;
  className?: string;
  orientation?: 'vertical' | 'horizontal' | 'responsive';
}

function FormCheckbox({
  label,
  description,
  className,
  orientation = 'horizontal',
}: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();

  return (
    <Field className={className} orientation={orientation}>
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => {
          if (typeof checked === 'boolean') {
            field.handleChange(checked);
          }
        }}
      />
      {(label || description) && (
        <FieldContent>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
          {description && <FieldDescription>{description}</FieldDescription>}
        </FieldContent>
      )}
    </Field>
  );
}

export { Checkbox, FormCheckbox };
