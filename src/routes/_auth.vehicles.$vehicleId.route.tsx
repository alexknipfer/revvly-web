import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/vehicles/$vehicleId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
