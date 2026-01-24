import { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useFieldContext } from '@/hooks/use-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  defaultValue?: Date;
  id?: string;
  'aria-invalid'?: boolean;
  showLabels?: boolean;
  className?: string;
}

function DateTimePicker({
  value,
  onChange,
  defaultValue,
  id,
  'aria-invalid': ariaInvalid,
  showLabels = true,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  const defaultDate = defaultValue || new Date();
  const [internalDate, setInternalDate] = useState<Date>(defaultDate);

  const date = value !== undefined ? value : internalDate;

  const formatTimeForInput = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours || 0, minutes || 0, 0);

    if (onChange) {
      onChange(newDate);
    } else {
      setInternalDate(newDate);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      return;
    }

    const newDate = new Date(selectedDate);
    newDate.setHours(date.getHours(), date.getMinutes(), 0);

    if (onChange) {
      onChange(newDate);
    } else {
      setInternalDate(newDate);
    }
    setOpen(false);
  };

  return (
    <div className={cn('flex gap-4', className)}>
      <div className={cn('flex flex-col gap-3 flex-1', showLabels && 'gap-3')}>
        {showLabels && (
          <Label htmlFor={`${id || 'date'}-picker`} className="px-1">
            Date
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id={`${id || 'date'}-picker`}
                className="w-full justify-between font-normal"
                aria-invalid={ariaInvalid}
              >
                {date ? date.toLocaleDateString() : 'Select date'}
                <ChevronDownIcon />
              </Button>
            }
          >
            <Button
              variant="outline"
              id={`${id || 'date'}-picker`}
              className="w-full justify-between font-normal"
              aria-invalid={ariaInvalid}
            >
              {date ? date.toLocaleDateString() : 'Select date'}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className={`flex flex-col ${showLabels ? 'gap-3' : ''} flex-1`}>
        {showLabels && (
          <Label htmlFor={`${id || 'time'}-picker`} className="px-1">
            Time
          </Label>
        )}
        <Input
          type="time"
          id={`${id || 'time'}-picker`}
          step="60"
          value={formatTimeForInput(date)}
          onChange={(e) => handleTimeChange(e.target.value)}
          aria-invalid={ariaInvalid}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}

interface DateFieldProps {
  label?: string;
  className?: string;
  showLabels?: boolean;
  defaultValue?: Date;
}

function FormDateTimePicker({
  label,
  className,
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

export { DateTimePicker, FormDateTimePicker };
