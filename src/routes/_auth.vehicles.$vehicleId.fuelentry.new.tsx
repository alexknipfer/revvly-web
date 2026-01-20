import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { AddFuelEntryForm } from '@/modules/fuel-entry/components/forms/add-fuel-entry-form';

export const Route = createFileRoute(
  '/_auth/vehicles/$vehicleId/fuelentry/new',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { vehicleId } = Route.useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-primary text-center md:text-left">
        New Fuel Entry
      </h1>
      <AddFuelEntryForm
        onSuccess={() => {
          toast.success('Fuel entry added successfully');
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
