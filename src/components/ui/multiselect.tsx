import * as React from 'react';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import { useFieldContext } from '@/hooks/use-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

interface Props {
  name: string;
  items: Array<string>;
  value: Array<string>;
  placeholder?: string;
  onChange: (value: Array<string>) => void;
}

function Multiselect({ name, items, value, placeholder, onChange }: Props) {
  const anchor = useComboboxAnchor();

  return (
    <Combobox
      name={name}
      items={items}
      multiple
      value={value}
      onValueChange={onChange}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values.map((value: string) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder={placeholder} />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList className="max-h-48 overflow-y-auto">
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

interface FormMultiselectProps {
  className?: string;
  label?: string;
  items: Array<string>;
  placeholder?: string;
}

function FormMultiselect({
  className,
  label,
  items,
  placeholder,
}: FormMultiselectProps) {
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

export { Multiselect, FormMultiselect };
