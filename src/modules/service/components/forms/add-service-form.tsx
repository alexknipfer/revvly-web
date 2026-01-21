import z from 'zod';
import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';

import { useAppForm } from '@/hooks/use-form';
import { api } from 'convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Id } from 'convex/_generated/dataModel';

import { ServiceFieldGroup } from '../service-field-group';
import {
  serviceFormDefaultValues,
  serviceFormSchema,
} from '../../schemas/form';

const formSchema = z.object({
  serviceFields: serviceFormSchema,
});

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

interface Props {
  onSuccess?: () => void;
}

export function AddServiceForm({ onSuccess }: Props) {
  const { vehicleId } = routeApi.useParams();
  const form = useAppForm({
    defaultValues: {
      serviceFields: serviceFormDefaultValues,
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
      types: data.serviceFields.types,
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
          variant="secondary"
          onClick={() => window.history.back()}
          className="col-span-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="col-span-1"
          disabled={createServiceMutation.isPending}
        >
          {createServiceMutation.isPending ? 'Adding...' : 'Add Service'}
        </Button>
      </form.AppForm>
    </form>
  );
}
