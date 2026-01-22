import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { AddServiceForm } from '@/modules/service/components/forms/add-service-form';
import { toast } from 'sonner';

export const Route = createFileRoute('/_auth/vehicles/$vehicleId/services/new')(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { vehicleId } = Route.useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-primary sr-only sm:not-sr-only sm:mb-4">
        New Service
      </h1>
      <AddServiceForm
        onSuccess={() => {
          toast.success('Service added successfully');

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
