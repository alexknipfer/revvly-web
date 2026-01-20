import z from 'zod';
import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { getRouteApi } from '@tanstack/react-router';

import { serviceByIdQueryOptions } from '@/api/query-options';
import { Button } from '@/components/ui/button';
import { useAppForm } from '@/hooks/use-form';
import { ServiceFieldGroup } from '@/modules/service/components/service-field-group';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';

const formSchema = z.object({
  serviceFields: z.object({
    date: z.date(),
    odometer: z.number().min(1, { message: 'Odometer is required' }),
    cost: z.string().min(1, { message: 'Cost is required' }),
    type: z.string().min(1, { message: 'Service type is required' }),
    location: z.string(),
    notes: z.string(),
  }),
});

interface Props {
  serviceId: Id<'services'>;
  onSuccess?: () => void;
  fetchServiceEnabled?: boolean;
}

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

export function EditServiceForm({
  serviceId,
  fetchServiceEnabled,
  onSuccess,
}: Props) {
  const { vehicleId } = routeApi.useParams();
  const {
    data: service,
    error,
    isPending,
  } = useQuery(
    serviceByIdQueryOptions({
      id: serviceId,
      enabled: fetchServiceEnabled,
    }),
  );

  const form = useAppForm({
    defaultValues: {
      serviceFields: {
        date: new Date(service?.date ?? ''),
        odometer: service?.odometer ?? 0,
        cost: service?.cost.toString() ?? '',
        type: service?.type ?? '',
        location: service?.location ?? '',
        notes: service?.notes ?? '',
      },
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
  });

  const updateServiceMutation = useMutation({
    mutationFn: useConvexMutation(api.services.update),
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    updateServiceMutation.mutate({
      id: serviceId,
      odometer: data.serviceFields.odometer,
      cost: parseFloat(data.serviceFields.cost),
      type: data.serviceFields.type,
      location: data.serviceFields.location || undefined,
      notes: data.serviceFields.notes || undefined,
      date: data.serviceFields.date.toISOString(),
      vehicleId,
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="size-4 animate-spin" />
      </div>
    );
  }

  if (error) {
    throw new Error('Failed to fetch service');
  }

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
        <form.Subscribe
          selector={(state) => state.isDirty}
          children={(isDirty) => (
            <Button
              type="submit"
              className="col-span-2"
              disabled={updateServiceMutation.isPending || !isDirty}
            >
              {updateServiceMutation.isPending
                ? 'Updating...'
                : 'Update Service'}
            </Button>
          )}
        />
      </form.AppForm>
    </form>
  );
}
