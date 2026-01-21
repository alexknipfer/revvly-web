import { withFieldGroup } from '@/hooks/use-form';
import { serviceTypeSchema } from '@/types/service';

import { serviceFormDefaultValues } from '../schemas/service-form';

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
            <field.DateField label="Date & Time *" showLabels={false} />
          )}
        </group.AppField>
        <group.AppField name="odometer">
          {(field) => <field.NumberField label="Odometer *" step="0.001" />}
        </group.AppField>
        <group.AppField name="cost">
          {(field) => <field.TextField label="Cost *" type="number" />}
        </group.AppField>
        <group.AppField name="types">
          {(field) => (
            <field.MultiselectField
              label="Service Type *"
              items={serviceTypes}
              className="col-span-2"
            />
          )}
        </group.AppField>
        <group.AppField name="location">
          {(field) => (
            <field.TextField
              label="Location (Optional)"
              className="col-span-2"
            />
          )}
        </group.AppField>
        <group.AppField name="notes">
          {(field) => (
            <field.TextareaField label="Notes" className="col-span-2" />
          )}
        </group.AppField>
      </>
    );
  },
});
