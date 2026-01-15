import { useFieldContext } from '../../modules/core/hooks/use-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Combobox } from '@/components/ui/combobox';

interface ComboboxItem {
  value: string;
  label: string;
}

interface ComboboxFieldProps<T extends string = string> {
  label?: string;
  className?: string;
  items: ComboboxItem[];
  placeholder?: string;
  onChange?: (value: T) => T;
}

export function ComboboxField<T extends string = string>({
  label,
  className,
  items,
  placeholder,
  onChange,
}: ComboboxFieldProps<T>) {
  const field = useFieldContext<T>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid} className={className}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Combobox
        label={placeholder || label || 'Select an option'}
        items={items}
        value={field.state.value}
        onChange={(value) => {
          const newValue = onChange ? onChange(value as T) : (value as T);
          field.handleChange(newValue);
        }}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
