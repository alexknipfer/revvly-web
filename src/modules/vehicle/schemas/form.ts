import { z } from 'zod';

export const shareVehicleFormSchema = z.object({
  email: z.email('Enter a valid email address'),
});

export type ShareVehicleFormFields = z.infer<typeof shareVehicleFormSchema>;

export function getShareVehicleFormDefaultValues(): ShareVehicleFormFields {
  return {
    email: '',
  };
}
