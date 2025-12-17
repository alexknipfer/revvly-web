import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SignOutButton } from '@clerk/tanstack-react-start';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Car, EllipsisVertical, Fuel, Wrench } from 'lucide-react';

export const Route = createFileRoute('/_auth')({
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
  return (
    <div className="bg-slate-900 min-h-svh text-foreground">
      <nav className="text-foreground border border-b-accent pl-2 pr-1 w-full">
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
                <DropdownMenuItem>
                  <Fuel className="size-4" />
                  <span>Add Fuel Log</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Wrench className="size-4" />
                  <span>Add Service Log</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Car className="size-4" />
                  <span>Manage Vehicles</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <SignOutButton />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <main className="p-2.5 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
