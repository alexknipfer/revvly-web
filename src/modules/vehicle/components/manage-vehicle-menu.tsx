import { useState } from 'react';
import { toast } from 'sonner';
import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import { Pencil, Share2, Trash } from 'lucide-react';
import { DrawerDialog } from '@/components/ui/dialog-drawer';

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

import { ShareVehicleForm } from './forms/share-vehicle-form';

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

export function ManageVehicleMenu() {
  const { vehicleId } = routeApi.useParams();
  const router = useRouter();
  const [activeDialog, setActiveDialog] = useState<
    'edit' | 'delete' | 'share' | null
  >(null);

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
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuItem onClick={() => setActiveDialog('edit')}>
            <Pencil className="size-4" />
            Edit Vehicle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveDialog('share')}>
            <Share2 className="size-4" />
            Share Vehicle
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
      <DrawerDialog
        open={activeDialog === 'share'}
        onOpenChange={(open) => {
          setActiveDialog(open ? 'share' : null);
        }}
        title="Share Vehicle"
        description="Invite someone by email. They will be able to view this vehicle's history and add service or fuel entries."
      >
        <ShareVehicleForm
          onCancel={() => setActiveDialog(null)}
          onSubmitted={() => {
            setActiveDialog(null);
          }}
        />
      </DrawerDialog>
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
