import { withFieldGroup } from '@/hooks/use-form';
import { serviceTypeSchema } from '@/modules/service/schemas/service-type';

import { serviceFormDefaultValues } from '../schemas/form';

const serviceTypes = serviceTypeSchema.options.sort((a, b) =>
  a.localeCompare(b),
);

export const ServiceFieldGroup = withFieldGroup({
  defaultValues: serviceFormDefaultValues,
  render: function Render({ group }) {
    return (
      <>
        <group.AppField name="date">
          {(field) => (
            <field.FormDateTimePicker
              label="Date & Time *"
              showLabels={false}
              className="col-span-2"
            />
          )}
        </group.AppField>
        <group.AppField name="odometer">
          {(field) => <field.FormNumberInput label="Odometer *" step="0.001" />}
        </group.AppField>
        <group.AppField name="cost">
          {(field) => <field.FormInput label="Cost *" type="number" />}
        </group.AppField>
        <group.AppField name="types">
          {(field) => (
            <field.FormMultiselect
              label="Service Type *"
              items={serviceTypes}
              className="col-span-2"
            />
          )}
        </group.AppField>
        <group.AppField name="location">
          {(field) => (
            <field.FormInput
              label="Location (Optional)"
              className="col-span-2"
            />
          )}
        </group.AppField>
        <group.AppField name="notes">
          {(field) => (
            <field.FormTextarea label="Notes" className="col-span-2" />
          )}
        </group.AppField>
      </>
    );
  },
});
