import * as React from 'react';
import { CheckIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Item {
  label: string;
  value: string;
}

interface ComboboxContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string[];
  onValueChange: (value: string[]) => void;
  items: Item[];
  multiple: boolean;
}

const ComboboxContext = React.createContext<ComboboxContextValue | undefined>(
  undefined,
);

function useCombobox() {
  const context = React.useContext(ComboboxContext);
  if (!context) {
    throw new Error('Combobox components must be used within a Combobox');
  }
  return context;
}

interface ComboboxProps {
  items: Item[];
  multiple?: boolean;
  value?: string[];
  onValueChange?: (value: string[]) => void;
  children: React.ReactNode;
  defaultValue?: string[];
}

export function Combobox({
  items,
  multiple = false,
  value: controlledValue,
  onValueChange,
  children,
  defaultValue = [],
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] =
    React.useState<string[]>(defaultValue);

  const value = controlledValue ?? internalValue;
  const setValue = onValueChange ?? setInternalValue;

  return (
    <ComboboxContext.Provider
      value={{
        open,
        setOpen,
        value,
        onValueChange: setValue,
        items,
        multiple,
      }}
    >
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  );
}

interface ComboboxChipsProps {
  children: React.ReactNode;
  className?: string;
}

export function ComboboxChips({ children, className }: ComboboxChipsProps) {
  const { open } = useCombobox();

  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        className={cn(
          'flex h-auto min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      >
        {children}
      </button>
    </PopoverTrigger>
  );
}

interface ComboboxValueProps {
  children: (values: string[]) => React.ReactNode;
}

export function ComboboxValue({ children }: ComboboxValueProps) {
  const { value } = useCombobox();
  return <div className="flex flex-wrap gap-1 flex-1">{children(value)}</div>;
}

interface ComboboxChipProps {
  children: React.ReactNode;
}

export function ComboboxChip({ children }: ComboboxChipProps) {
  const { value, onValueChange } = useCombobox();

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const itemValue = children?.toString() || '';
    onValueChange(value.filter((v) => v !== itemValue));
  };

  return (
    <Badge variant="secondary" className="gap-1 pr-1">
      {children}
      <button
        type="button"
        onClick={handleRemove}
        className="rounded-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <XIcon className="h-3 w-3" />
      </button>
    </Badge>
  );
}

interface ComboboxChipsInputProps {
  placeholder?: string;
}

export function ComboboxChipsInput({ placeholder }: ComboboxChipsInputProps) {
  const { value } = useCombobox();

  return (
    <span
      className={cn('text-muted-foreground text-sm', {
        hidden: value.length > 0,
      })}
    >
      {placeholder}
    </span>
  );
}

interface ComboboxContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ComboboxContent({ children, className }: ComboboxContentProps) {
  return (
    <PopoverContent
      className={cn(
        'p-0 max-h-20 md:max-h-none w-[var(--radix-popover-trigger-width)]',
        className,
      )}
      side="bottom"
      align="start"
    >
      <Command>{children}</Command>
    </PopoverContent>
  );
}

interface ComboboxEmptyProps {
  children: React.ReactNode;
}

export function ComboboxEmpty({ children }: ComboboxEmptyProps) {
  return <CommandEmpty>{children}</CommandEmpty>;
}

interface ComboboxListProps {
  children: (item: Item) => React.ReactNode;
}

export function ComboboxList({ children }: ComboboxListProps) {
  const { items } = useCombobox();

  return (
    <>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandGroup>{items.map((item) => children(item))}</CommandGroup>
      </CommandList>
    </>
  );
}

interface ComboboxItemProps {
  value: Item;
  children: React.ReactNode;
}

export function ComboboxItem({ value: item, children }: ComboboxItemProps) {
  const { value, onValueChange, setOpen, multiple } = useCombobox();
  const isSelected = value.includes(item.value);

  const handleSelect = () => {
    if (multiple) {
      if (isSelected) {
        onValueChange(value.filter((v) => v !== item.value));
      } else {
        onValueChange([...value, item.value]);
      }
    } else {
      onValueChange([item.value]);
      setOpen(false);
    }
  };

  return (
    <CommandItem value={item.value} onSelect={handleSelect}>
      <CheckIcon
        className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')}
      />
      {children}
    </CommandItem>
  );
}
