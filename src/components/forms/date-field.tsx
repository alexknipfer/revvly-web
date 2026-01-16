import { useFieldContext } from '../../hooks/use-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { DateTimePicker } from '@/components/ui/date-time-picker';

interface DateFieldProps {
  label?: string;
  className?: string;
  showLabels?: boolean;
  defaultValue?: Date;
}

export function DateField({
  label,
  className = 'col-span-2',
  showLabels = false,
  defaultValue,
}: DateFieldProps) {
  const field = useFieldContext<Date>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid} className={className}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <DateTimePicker
        value={field.state.value}
        onChange={(date) => field.handleChange(date)}
        defaultValue={defaultValue || new Date()}
        id={field.name}
        aria-invalid={isInvalid}
        showLabels={showLabels}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
