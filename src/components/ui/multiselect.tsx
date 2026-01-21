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

interface Props {
  name: string;
  items: Array<string>;
  value: Array<string>;
  placeholder?: string;
  onChange: (value: Array<string>) => void;
}

export function Multiselect({
  name,
  items,
  value,
  placeholder,
  onChange,
}: Props) {
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
