import { useAppForm } from '@/hooks/use-form';

import {
  ShareVehicleFormFields,
  shareVehicleFormSchema,
} from '../../schemas/form';
import { Button } from '@/components/ui/button';
import { useServerFn } from '@tanstack/react-start';
import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';

import { createShareVehicleServerFn } from '../../server/server-fns';
import { toast } from 'sonner';

interface Props {
  onCancel: () => void;
  onSubmitted: () => void;
}

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

export function ShareVehicleForm({ onCancel, onSubmitted }: Props) {
  const { vehicleId } = routeApi.useParams();
  const shareForm = useAppForm({
    defaultValues: { email: '' },
    validators: { onSubmit: shareVehicleFormSchema },
    onSubmit: ({ value }) => onSubmit(value),
  });

  const createShareVehicle = useServerFn(createShareVehicleServerFn);
  const shareVehicleMutation = useMutation({
    mutationFn: createShareVehicle,
    onSuccess: (result) => {
      toast.success(result.message);
      onSubmitted();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: ShareVehicleFormFields) => {
    shareVehicleMutation.mutate({
      data: {
        vehicleId,
        recipientEmail: data.email,
      },
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        shareForm.handleSubmit();
      }}
      className="space-y-5"
    >
      <shareForm.AppForm>
        <shareForm.AppField name="email">
          {(field) => (
            <field.FormInput
              label="Email"
              type="email"
              placeholder="user@example.com"
            />
          )}
        </shareForm.AppField>
      </shareForm.AppForm>
      <div className="flex justify-end gap-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={shareVehicleMutation.isPending}>
          Send Invite
        </Button>
      </div>
    </form>
  );
}
