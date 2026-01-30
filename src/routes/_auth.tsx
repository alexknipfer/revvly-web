import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import * as Sentry from '@sentry/tanstackstart-react';
import { useEffect, useState } from 'react';
import { auth } from '@clerk/tanstack-react-start/server';
import { createServerFn } from '@tanstack/react-start';

import { Toaster } from '@/components/ui/sonner';
import { AddVehicleDialog } from '@/modules/add-vehicle/components/add-vehicle-dialog';
import { getAllVehiclesQueryOptions } from '@/api/query-options';
import { UserDropdown } from '@/components/user-dropdown';

const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: 'convex' });

  return {
    userId,
    token,
  };
});

export const Route = createFileRoute('/_auth')({
  head: () => ({
    meta: [
      {
        name: 'theme-color',
        content: '#090d16',
      },
    ],
  }),
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    // Cache to prevent slow client side navigations. See: https://github.com/TanStack/router/issues/3997
    const { userId, token } = await context.queryClient.ensureQueryData({
      queryKey: ['auth'],
      queryFn: fetchClerkAuth,
    });

    if (token && context.convexQueryClient.serverHttpClient?.setAuth) {
      context.convexQueryClient.serverHttpClient.setAuth(token);
    }

    if (!userId) {
      throw redirect({
        to: '/',
      });
    }

    return {
      userId,
      token,
    };
  },
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(getAllVehiclesQueryOptions());
  },
});

function RouteComponent() {
  const { userId } = Route.useRouteContext();

  const [addVehicleOpen, setAddVehicleOpen] = useState(false);

  useEffect(() => {
    Sentry.setUser({
      id: userId,
    });
  }, [userId]);

  return (
    <div className="bg-background min-h-svh text-foreground">
      <nav className="text-foreground border-b border-border/50 w-full sticky top-0 z-10 bg-background py-0.5">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-3 sm:grid-cols-2 items-center pl-2.5 pr-2.5">
          <Link
            to="/vehicles"
            className="col-start-2 sm:col-start-1 text-center sm:text-left"
          >
            <span className="font-semibold tracking-widest uppercase">
              Revvly
            </span>
          </Link>
          <UserDropdown onAddVehicle={() => setAddVehicleOpen(true)} />
        </div>
        <AddVehicleDialog
          open={addVehicleOpen}
          onOpenChange={setAddVehicleOpen}
          onVehicleCreated={() => setAddVehicleOpen(false)}
        />
      </nav>
      <main className="px-2.5 py-4 max-w-7xl mx-auto">
        <Toaster />
        <Outlet />
      </main>
    </div>
  );
}
