import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { EditFuelEntryForm } from '@/modules/fuel-entry/components/forms/edit-fuel-entry-form';

export const Route = createFileRoute(
  '/_auth/vehicles/$vehicleId/fuelentry/$fuelEntryId/edit',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { vehicleId } = Route.useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-primary sr-only sm:not-sr-only sm:mb-4">
        Edit Fuel Entry
      </h1>
      <EditFuelEntryForm
        onSuccess={() => {
          toast.success('Fuel entry updated successfully');

          navigate({
            to: '/vehicles/$vehicleId',
            params: { vehicleId: vehicleId },
            search: { activeTab: 'fuel-logs' },
          });
        }}
      />
    </div>
  );
}
