import {
  ClerkProvider,
  SignOutButton,
  useAuth,
} from '@clerk/tanstack-react-start';
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from '@tanstack/react-router';
import { convexQuery } from '@convex-dev/react-query';
import { Car, Check, EllipsisVertical, Plus } from 'lucide-react';
import { useState } from 'react';
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
import { AddVehicleDialog } from '@/modules/add-vehicle/ui/components/add-vehicle-dialog';
import { auth } from '@clerk/tanstack-react-start/server';
import { createServerFn } from '@tanstack/react-start';
import { ConvexProviderWithClerk } from 'convex/react-clerk';

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
    const auth = await fetchClerkAuth();
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
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      convexQuery(api.userVehicles.getAll, {}),
    );
  },
});

function RouteComponent() {
  const { data: vehicles } = useSuspenseQuery(
    convexQuery(api.userVehicles.getAll, {}),
  );
  const context = Route.useRouteContext();

  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const location = useLocation();

  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={context.convexClient} useAuth={useAuth}>
        <div className="bg-slate-900 min-h-svh text-foreground">
          <nav className="text-foreground border-b border-b-accent w-full sticky top-0 z-10 bg-slate-900">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-3 sm:grid-cols-2 items-center pl-2.5 pr-2.5 ">
              <Link
                to="/vehicles"
                className="col-start-2 sm:col-start-1 text-center sm:text-left"
              >
                <span className="font-bold tracking-widest uppercase">
                  Revvly
                </span>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="justify-self-end">
                  <Button variant="ghost" size="icon">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <p className="p-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Your Vehicles
                  </p>
                  {vehicles.map((vehicle) => (
                    <DropdownMenuItem key={vehicle._id}>
                      <Link
                        to={`/vehicles/$vehicleId`}
                        params={{ vehicleId: vehicle._id }}
                        className="flex items-center gap-3 cursor-pointer w-full"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                          {vehicle.imageUrl ? (
                            <img
                              src={vehicle.imageUrl}
                              alt={vehicle.name}
                              width={36}
                              height={36}
                              className="object-cover rounded-full w-full h-full"
                            />
                          ) : (
                            <Car className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <span className="text-sm font-medium text-popover-foreground">
                            {vehicle.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {vehicle.model}
                          </span>
                        </div>
                        {location.pathname === `/vehicles/${vehicle._id}` && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer text-popover-foreground font-medium"
                    onClick={() => setAddVehicleOpen(true)}
                  >
                    <div className="flex size-5 items-center justify-center rounded-full bg-primary">
                      <Plus className="size-4 text-primary-foreground" />
                    </div>
                    <span>Add Vehicle</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="w-full">
                    <SignOutButton />
                  </DropdownMenuItem>
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
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
