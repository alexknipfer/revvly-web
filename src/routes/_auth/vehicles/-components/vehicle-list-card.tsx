import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Doc } from 'convex/_generated/dataModel';
import { EllipsisVertical, Fuel, Milestone } from 'lucide-react';
import { AddFuelEntryDialog } from '../../../../components/add-fuel-entry-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { VehicleImage } from '@/components/vehicle-image';
interface Props {
  vehicle: Doc<'vehicles'> & { imageUrl: string | null };
}

export function VehicleListCard({ vehicle }: Props) {
  const [fuelDialogOpen, setFuelDialogOpen] = useState(false);

  return (
    <>
      <Card key={vehicle._id}>
        <CardHeader>
          <VehicleImage vehicle={vehicle} />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{vehicle.name || vehicle.model}</CardTitle>
              <CardDescription>
                {vehicle.make} {vehicle.model} {vehicle.year}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setFuelDialogOpen(true)}>
                  <Fuel className="size-4" />
                  Add Fuel Up
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
        <CardFooter className="gap-x-2">
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary" className="bg-blue-500">
                <Milestone />
                {vehicle.totalMilesTracked
                  ? vehicle.totalMilesTracked.toLocaleString()
                  : '--'}{' '}
                Miles
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Total miles tracked</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary" className="bg-green-700">
                <Fuel />{' '}
                {vehicle.averageMpg ? vehicle.averageMpg.toFixed(1) : '--'} MPG
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Average MPG</TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
      <AddFuelEntryDialog
        open={fuelDialogOpen}
        onOpenChange={setFuelDialogOpen}
        vehicleId={vehicle._id}
      />
    </>
  );
}
