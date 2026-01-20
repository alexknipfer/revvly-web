import { useState } from 'react';
import { toast } from 'sonner';
import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import { Pencil, Trash } from 'lucide-react';

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

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

export function ManageVehicleMenu() {
  const { vehicleId } = routeApi.useParams();
  const router = useRouter();
  const [activeDialog, setActiveDialog] = useState<'edit' | 'delete' | null>(
    null,
  );

  const convexDeleteVehicleMutation = useConvexMutation(
    api.vehicles.deleteById,
  );
  const deleteVehicleMutation = useMutation({
    mutationFn: convexDeleteVehicleMutation,
    onSuccess: () => {
      setActiveDialog(null);
      toast.success('Vehicle deleted successfully');
      router.navigate({ to: '/vehicles' });
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="shrink-0">
              <Pencil className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="start" className="min-w-fit">
          <DropdownMenuItem onClick={() => setActiveDialog('edit')}>
            <Pencil className="size-4" />
            Edit Vehicle
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setActiveDialog('delete')}
          >
            <Trash className="size-4" />
            Delete Vehicle
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditVehicleDialog
        open={activeDialog === 'edit'}
        onOpenChange={(open) => setActiveDialog(open ? 'edit' : null)}
        onSuccess={() => {
          setActiveDialog(null);
          toast.success('Vehicle updated successfully');
        }}
      />

      <AlertDialog
        open={activeDialog === 'delete'}
        onOpenChange={(open) => setActiveDialog(open ? 'delete' : null)}
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
            <AlertDialogAction
              render={
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
              }
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
