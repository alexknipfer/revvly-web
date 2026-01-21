import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { EditServiceForm } from '@/modules/service/components/forms/edit-service-form';

export const Route = createFileRoute(
  '/_auth/vehicles/$vehicleId/services/$serviceId/edit',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { vehicleId } = Route.useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-primary sr-only sm:not-sr-only sm:mb-4">
        Edit Service
      </h1>
      <EditServiceForm
        onSuccess={() => {
          toast.success('Service updated successfully');

          navigate({
            to: '/vehicles/$vehicleId',
            params: { vehicleId: vehicleId },
            search: { activeTab: 'service-logs' },
          });
        }}
      />
    </div>
  );
}
