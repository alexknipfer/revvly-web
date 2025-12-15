import { createFileRoute } from '@tanstack/react-router';
import { Authenticated, AuthLoading } from 'convex/react';

export const Route = createFileRoute('/_auth/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Authenticated>Hello "/_auth/dashboard/"!</Authenticated>;
      <AuthLoading>Loading....</AuthLoading>
    </>
  );
}
