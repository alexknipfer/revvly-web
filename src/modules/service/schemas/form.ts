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

export const serviceFormDefaultValues: ServiceFormFields = {
  date: new Date(),
  odometer: 0,
  cost: '',
  types: [],
  location: '',
  notes: '',
};
