import { SignOutButton } from '@clerk/tanstack-react-start';
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from '@tanstack/react-router';
import * as Sentry from '@sentry/tanstackstart-react';
import { convexQuery } from '@convex-dev/react-query';
import { Car, Check, CirclePlus, EllipsisVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth } from '@clerk/tanstack-react-start/server';
import { createServerFn } from '@tanstack/react-start';
import { useSuspenseQuery } from '@tanstack/react-query';

import { Toaster } from '@/components/ui/sonner';
import { api } from 'convex/_generated/api';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddVehicleDialog } from '@/modules/add-vehicle/components/add-vehicle-dialog';
import { ThemeToggle } from '@/components/theme-toggle';

const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const authResponse = await auth();
  const token = await authResponse.getToken({ template: 'convex' });

  return {
    userId: authResponse.userId,
    token,
  };
});

export const Route = createFileRoute('/_auth')({
  head: () => ({
    meta: [
      {
        name: 'theme-color',
        content: '#0f172a',
      },
    ],
  }),
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    // Cache to prevent slow client side navigations. See: https://github.com/TanStack/router/issues/3997
    const auth = await context.queryClient.ensureQueryData({
      queryKey: ['auth'],
      queryFn: fetchClerkAuth,
    });
    const { userId, token } = auth;

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
    context.queryClient.prefetchQuery(convexQuery(api.vehicles.getAll, {}));
  },
});

function RouteComponent() {
  const { userId } = Route.useRouteContext();
  const { data: vehicles } = useSuspenseQuery(
    convexQuery(api.vehicles.getAll, {}),
  );

  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    Sentry.setUser({
      id: userId,
    });
  }, [userId]);

  return (
    <div className="bg-background min-h-svh text-foreground">
      <nav className="text-foreground border-b border-border/50 w-full sticky top-0 z-10 bg-background">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-3 sm:grid-cols-2 items-center pl-2.5 pr-2.5">
          <Link
            to="/vehicles"
            className="col-start-2 sm:col-start-1 text-center sm:text-left"
          >
            <span className="font-semibold tracking-widest uppercase">
              Revvly
            </span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon">
                  <EllipsisVertical />
                </Button>
              }
              className="justify-self-end"
            />
            <DropdownMenuContent align="end" className="w-64">
              {vehicles.length > 0 && (
                <p className="p-2 text-xs text-muted-foreground tracking-wider">
                  Your Vehicles
                </p>
              )}
              {vehicles.map((vehicle) => (
                <DropdownMenuItem
                  key={vehicle._id}
                  nativeButton={false}
                  render={
                    <Link
                      to={`/vehicles/$vehicleId`}
                      params={{ vehicleId: vehicle._id }}
                      className="flex items-center gap-3 cursor-pointer w-full"
                    >
                      <div className="flex size-9 items-center justify-center rounded-full bg-mute">
                        {vehicle.imageUrl ? (
                          <img
                            src={vehicle.imageUrl}
                            alt={vehicle.name}
                            width={36}
                            height={36}
                            className="object-cover rounded-full w-full h-full"
                          />
                        ) : (
                          <div className="flex size-9 items-center justify-center rounded-full bg-mute">
                            <Car className="size-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-xs text-popover-foreground">
                          {vehicle.model}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {vehicle.name}
                        </span>
                      </div>
                      {location.pathname === `/vehicles/${vehicle._id}` && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </Link>
                  }
                />
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center justify-between gap-3 text-xs cursor-pointer text-muted-foreground"
                onClick={() => setAddVehicleOpen(true)}
              >
                <span>Add Vehicle</span>
                <CirclePlus />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-1.5 py-1 h-10 flex items-center justify-between">
                <span className="text-xs tracking-wider text-muted-foreground">
                  Theme
                </span>
                <ThemeToggle />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                nativeButton
                render={<SignOutButton />}
                className="w-full text-muted-foreground"
              />
            </DropdownMenuContent>
          </DropdownMenu>
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
