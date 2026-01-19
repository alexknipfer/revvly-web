import z from 'zod';
import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';

import { useAppForm } from '@/hooks/use-form';
import { api } from 'convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Id } from 'convex/_generated/dataModel';
import { serviceTypeSchema } from '@/types/service';

import { ServiceFieldGroup } from '../service-field-group';

const formSchema = z.object({
  serviceFields: z.object({
    date: z.date(),
    odometer: z.number().min(1, { message: 'Odometer is required' }),
    cost: z.string().min(1, { message: 'Cost is required' }),
    type: serviceTypeSchema,
    location: z.string(),
    notes: z.string(),
  }),
});

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

interface Props {
  onSuccess?: () => void;
}

export function AddServiceForm({ onSuccess }: Props) {
  const { vehicleId } = routeApi.useParams();
  const form = useAppForm({
    defaultValues: {
      serviceFields: {
        date: new Date(),
        odometer: 0,
        cost: '',
        type: '' as z.infer<typeof serviceTypeSchema>,
        location: '',
        notes: '',
      },
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
  });

  const createServiceMutation = useMutation({
    mutationFn: useConvexMutation(api.services.create),
    onSuccess: () => {
      onSuccess?.();
      form.reset();
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    createServiceMutation.mutate({
      date: data.serviceFields.date.toISOString(),
      odometer: data.serviceFields.odometer,
      cost: parseFloat(data.serviceFields.cost),
      type: data.serviceFields.type,
      location: data.serviceFields.location || undefined,
      notes: data.serviceFields.notes || undefined,
      vehicleId: vehicleId as Id<'vehicles'>,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="grid grid-cols-2 gap-4 overflow-y-auto"
    >
      <form.AppForm>
        <ServiceFieldGroup form={form} fields="serviceFields" />
        <Button
          type="submit"
          className="col-span-2"
          disabled={createServiceMutation.isPending}
        >
          {createServiceMutation.isPending ? 'Adding...' : 'Add Service'}
        </Button>
      </form.AppForm>
    </form>
  );
}
