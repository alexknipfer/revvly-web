import z from 'zod';
import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';

import { serviceByIdQueryOptions } from '@/api/query-options';
import { Button } from '@/components/ui/button';
import { useAppForm } from '@/hooks/use-form';
import { ServiceFieldGroup } from '@/modules/service/components/service-field-group';
import { api } from 'convex/_generated/api';

import {
  getServiceFormDefaultValues,
  serviceFormSchema,
} from '../../schemas/form';

const formSchema = z.object({ serviceFields: serviceFormSchema });

interface Props {
  onSuccess?: () => void;
}

const routeApi = getRouteApi(
  '/_auth/vehicles/$vehicleId/services/$serviceId/edit',
);

export function EditServiceForm({ onSuccess }: Props) {
  const { vehicleId, serviceId } = routeApi.useParams();
  const { data: service } = useSuspenseQuery(
    serviceByIdQueryOptions({
      id: serviceId,
      vehicleId,
    }),
  );

  const form = useAppForm({
    defaultValues: {
      serviceFields: getServiceFormDefaultValues({ service }),
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
      types: data.serviceFields.types,
      location: data.serviceFields.location || undefined,
      notes: data.serviceFields.notes || undefined,
      date: data.serviceFields.date.toISOString(),
      vehicleId,
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
        <form.Subscribe
          selector={(state) => state.isDirty}
          children={(isDirty) => (
            <Button
              type="submit"
              className="col-span-1"
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
