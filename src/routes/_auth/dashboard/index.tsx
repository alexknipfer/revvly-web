import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Link to="/dashboard/manage-vehicles">Manage Vehicles</Link>
      Hello "/_auth/dashboard/"!
    </div>
  );
}
