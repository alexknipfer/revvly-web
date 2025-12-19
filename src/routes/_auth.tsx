import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddVehicleDialog } from '@/components/add-vehicle-dialog';
import { SignOutButton } from '@clerk/tanstack-react-start';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Car, EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';

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
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      throw redirect({
        to: '/',
      });
    }
  },
});

function RouteComponent() {
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);

  return (
    <div className="bg-slate-900 min-h-svh text-foreground">
      <nav className="text-foreground border-b border-b-accent pl-2 pr-1 w-full">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <span className="font-bold tracking-widest uppercase">Revly</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" alignOffset={5}>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setAddVehicleOpen(true)}>
                  <Car className="size-4" />
                  <span>Add Vehicle</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="w-full">
                  <SignOutButton />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <main className="p-2.5 max-w-7xl mx-auto">
        <Toaster />
        <Outlet />
      </main>
      <AddVehicleDialog
        open={addVehicleOpen}
        onOpenChange={setAddVehicleOpen}
        onVehicleCreated={() => setAddVehicleOpen(false)}
      />
    </div>
  );
}
