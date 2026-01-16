import { createFormHookContexts, createFormHook } from '@tanstack/react-form';
import {
  DateField,
  NumberField,
  TextField,
  CheckboxField,
  ComboboxField,
  TextareaField,
} from '../components/forms';

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
  },
  formComponents: {},
});
