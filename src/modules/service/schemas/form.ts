import { defaultTo } from '@/lib/utils';
import { Doc } from 'convex/_generated/dataModel';
import { z } from 'zod';

export const serviceFormSchema = z.object({
  date: z.date(),
  odometer: z.number().min(1, { message: 'Odometer is required' }),
  cost: z.string().min(1, { message: 'Cost is required' }),
  types: z.array(z.string()),
  location: z.string(),
  notes: z.string(),
});

export type ServiceFormFields = z.infer<typeof serviceFormSchema>;

export function getServiceFormDefaultValues({
  service,
}: {
  service?: Doc<'services'>;
} = {}): ServiceFormFields {
  return {
    date: service ? new Date(service.date) : new Date(),
    odometer: service ? service.odometer : 0,
    cost: service ? service.cost.toString() : '',
    types: service ? service.types : [],
    location: defaultTo(service?.location, ''),
    notes: defaultTo(service?.notes, ''),
  };
}
