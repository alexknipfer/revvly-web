import { createFormHookContexts, createFormHook } from '@tanstack/react-form';

import { MultiselectField } from '@/components/forms/multi-select-field';
import { CheckboxField } from '@/components/forms/checkbox-field';
import { ComboboxField } from '@/components/forms/combobox-field';
import { DateField } from '@/components/forms/date-field';
import { TextField } from '@/components/forms/text-field';
import { TextareaField } from '@/components/forms/textarea-field';
import { NumberField } from '@/components/forms/number-field';
import { NativeSelectField } from '@/components/forms/native-select-field';

// Export form contexts for use in custom components
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

// Create the form hook with field and form components
export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    DateField,
    NumberField,
    TextField,
    CheckboxField,
    ComboboxField,
    TextareaField,
    MultiselectField,
    NativeSelectField,
  },
  formComponents: {},
});
