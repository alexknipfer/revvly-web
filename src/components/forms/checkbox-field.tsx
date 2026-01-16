import { ReactNode } from 'react';
import { useFieldContext } from '../../hooks/use-form';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';

interface CheckboxFieldProps {
  label?: string;
  description?: ReactNode;
  className?: string;
  orientation?: 'vertical' | 'horizontal' | 'responsive';
}

export function CheckboxField({
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
