import React from 'react';
import { SignOutButton, useUser } from '@clerk/tanstack-react-start';
import { Car, Check, CirclePlus } from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useLocation } from '@tanstack/react-router';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getAllVehiclesQueryOptions } from '@/api/query-options';

interface Props {
  onAddVehicle: () => void;
}

export function UserDropdown({ onAddVehicle }: Props) {
  const { data: vehicles } = useSuspenseQuery(getAllVehiclesQueryOptions());
  const { user } = useUser();
  const location = useLocation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full justify-self-end"
          >
            <Avatar size="sm">
              <AvatarImage
                src={user?.imageUrl}
                alt={user?.fullName ?? 'User Avatar'}
              />
              <AvatarFallback>
                {user
                  ? (user.firstName?.charAt(0) ?? '') +
                    (user.lastName?.charAt(0) ?? '')
                  : ''}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-64">
        {vehicles.length > 0 && (
          <React.Fragment>
            <p className="p-2 text-xs text-muted-foreground tracking-wider">
              Your Vehicles
            </p>
            {vehicles.map((vehicle) => (
              <DropdownMenuItem
                key={vehicle._id}
                nativeButton={false}
                render={
                  <Link
                    to="/vehicles/$vehicleId"
                    params={{ vehicleId: vehicle._id }}
                    className="flex items-center gap-3"
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
          </React.Fragment>
        )}
        <DropdownMenuItem
          className="text-muted-foreground"
          render={<Link to="/account">Account</Link>}
        />
        <DropdownMenuItem
          className="text-muted-foreground"
          render={<Link to="/settings">Settings</Link>}
        />
        <DropdownMenuItem
          className="flex items-center justify-between gap-3 text-xs text-muted-foreground"
          onClick={onAddVehicle}
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
  );
}
