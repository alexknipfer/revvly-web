import { useState } from 'react';
import { toast } from 'sonner';
import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import { Ellipsis, Pencil, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EditVehicleDialog } from './edit-vehicle.dialog';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId/');

export function VehicleActionsMenu() {
  const { vehicleId } = routeApi.useParams();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const convexDeleteVehicleMutation = useConvexMutation(
    api.vehicles.deleteById,
  );
  const deleteVehicleMutation = useMutation({
    mutationFn: convexDeleteVehicleMutation,
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      toast.success('Vehicle deleted successfully');
      router.navigate({ to: '/vehicles' });
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="size-4" />
            Edit Vehicle
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="size-4" />
            Delete Vehicle
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditVehicleDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={() => {
          setIsEditDialogOpen(false);
          toast.success('Vehicle updated successfully');
        }}
      />
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vehicle?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                loading={deleteVehicleMutation.isPending}
                onClick={() =>
                  deleteVehicleMutation.mutate({
                    id: vehicleId as Id<'vehicles'>,
                  })
                }
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
