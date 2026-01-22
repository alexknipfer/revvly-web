import { createFormHookContexts, createFormHook } from '@tanstack/react-form';

import { FormMultiselect } from '@/components/ui/multiselect';
import { FormCheckbox } from '@/components/ui/checkbox';
import { FormCombobox } from '@/components/ui/combobox';
import { FormDateTimePicker } from '@/components/ui/date-time-picker';
import { FormInput } from '@/components/ui/input';
import { FormTextarea } from '@/components/ui/textarea';
import { FormNumberInput } from '@/components/ui/number-input';
import { FormNativeSelect } from '@/components/ui/native-select';

// Export form contexts for use in custom components
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

// Create the form hook with field and form components
export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormDateTimePicker,
    FormNumberInput,
    FormInput,
    FormCheckbox,
    FormCombobox,
    FormTextarea,
    FormMultiselect,
    FormNativeSelect,
  },
  formComponents: {},
});
