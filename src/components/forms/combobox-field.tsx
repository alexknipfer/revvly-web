import { useFieldContext } from '../../hooks/use-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';

interface ComboboxFieldItem {
  value: string;
  label: string;
}

interface ComboboxFieldProps<T extends string = string> {
  label?: string;
  className?: string;
  items: ComboboxFieldItem[];
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
        items={items}
        onValueChange={(value) => {
          const newValue = onChange ? onChange(value as T) : (value as T);
          field.handleChange(newValue);
        }}
      >
        <ComboboxInput
          placeholder={placeholder || label || 'Select an option'}
        />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
