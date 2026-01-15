import { useFieldContext } from '../../modules/core/hooks/use-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

interface TextareaFieldProps {
  label?: string;
  className?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

export function TextareaField({
  label,
  className,
  placeholder,
  rows,
  disabled,
}: TextareaFieldProps) {
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
