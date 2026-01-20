import { useFieldContext } from '@/hooks/use-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Multiselect } from '@/components/ui/multiselect';

interface Props {
  className?: string;
  label?: string;
  items: Array<string>;
  placeholder?: string;
}

export function MultiselectField({
  className,
  label,
  items,
  placeholder,
}: Props) {
  const field = useFieldContext<Array<string>>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid} className={className}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Multiselect
        placeholder={placeholder}
        name={field.name}
        items={items}
        value={field.state.value}
        onChange={(value) => field.handleChange(value)}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
