import { ReactNode } from 'react';
import { useFieldContext } from '../../hooks/use-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface NumberFieldProps {
  label?: string;
  className?: string;
  step?: string;
  min?: number;
  max?: number;
  labelSuffix?: ReactNode;
  parseValue?: (value: string) => number;
}

export function NumberField({
  label,
  className,
  step = '1',
  min,
  max,
  labelSuffix,
  parseValue = (v) => parseFloat(v),
}: NumberFieldProps) {
  const field = useFieldContext<number>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid} className={className}>
      {label && (
        <FieldLabel
          htmlFor={field.name}
          className={
            labelSuffix ? 'flex items-center justify-between' : undefined
          }
        >
          <span>{label}</span>
          {labelSuffix}
        </FieldLabel>
      )}
      <Input
        name={field.name}
        type="number"
        step={step}
        min={min}
        max={max}
        value={field.state.value.toString()}
        onChange={(e) => field.handleChange(parseValue(e.target.value))}
        aria-invalid={isInvalid}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
