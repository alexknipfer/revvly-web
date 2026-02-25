import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { SignInButton } from '@clerk/tanstack-react-start';
import { Car, AlertCircle, Loader2 } from 'lucide-react';

import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ConvexError } from 'convex/values';
import { tryCatch } from '@/lib/utils';
import { vehicleShareQueryOptions } from '@/api/query-options';
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';

export const Route = createFileRoute('/invite/$shareId')({
  component: InvitePage,
  loader: async ({ context, params }) => {
    const [error, response] = await tryCatch(
      context.queryClient.ensureQueryData(
        vehicleShareQueryOptions(params.shareId),
      ),
    );

    if (error) {
      throw new Error(
        error instanceof ConvexError
          ? error.data.message
          : 'Failed to load invite',
      );
    }

    return response;
  },
  errorComponent: InviteErrorPage,
});

function InvitePage() {
  const { shareId } = Route.useParams();
  const shareInfo = Route.useLoaderData();
  const navigate = useNavigate();

  const convexAcceptMutation = useConvexMutation(api.vehicleShares.accept);
  const acceptMutation = useMutation({
    mutationFn: convexAcceptMutation,
    onSuccess: (data) => {
      navigate({
        to: '/vehicles/$vehicleId',
        params: { vehicleId: data.vehicleId },
      });
    },
  });

  const vehicleDisplay = shareInfo.vehicle.name
    ? `${shareInfo.vehicle.name} (${shareInfo.vehicle.year} ${shareInfo.vehicle.make} ${shareInfo.vehicle.model})`
    : `${shareInfo.vehicle.year} ${shareInfo.vehicle.make} ${shareInfo.vehicle.model}`;

  return (
    <div className="min-h-svh flex items-center justify-center p-4">
      <AuthLoading>
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </AuthLoading>
      <Authenticated>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Car className="size-6 text-primary" />
            </div>
            <CardTitle>Vehicle Invite</CardTitle>
            <CardDescription>
              {shareInfo.inviter?.name || 'Someone'} has invited you to access
              their vehicle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="font-semibold text-lg">
                {shareInfo.vehicle.name
                  ? `${shareInfo.vehicle.name} (${shareInfo.vehicle.year} ${shareInfo.vehicle.make} ${shareInfo.vehicle.model})`
                  : `${shareInfo.vehicle.year} ${shareInfo.vehicle.make} ${shareInfo.vehicle.model}`}
              </p>
              {shareInfo.recipientEmail && (
                <p className="text-sm text-muted-foreground mt-1">
                  Sent to: {shareInfo.recipientEmail}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SignInButton
              forceRedirectUrl={`/invite/${shareId}`}
              signUpForceRedirectUrl={`/invite/${shareId}`}
            >
              <Button className="w-full">Sign in to Accept</Button>
            </SignInButton>
          </CardFooter>
        </Card>
      </Authenticated>
      <Unauthenticated>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Car className="size-6 text-primary" />
            </div>
            <CardTitle>Vehicle Invite</CardTitle>
            <CardDescription>
              {shareInfo.inviter?.name || 'Someone'} has invited you to access
              their vehicle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="font-semibold text-lg">{vehicleDisplay}</p>
              {shareInfo.recipientEmail && (
                <p className="text-sm text-muted-foreground mt-1">
                  Sent to: {shareInfo.recipientEmail}
                </p>
              )}
            </div>
            {acceptMutation.error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="size-4" />
                <span>
                  {acceptMutation.error.message || 'Failed to accept invite'}
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate({ to: '/vehicles' })}
            >
              Decline
            </Button>
            <Button
              className="flex-1"
              loading={acceptMutation.isPending}
              onClick={() =>
                acceptMutation.mutate({ id: shareId as Id<'vehicle_shares'> })
              }
            >
              Accept
            </Button>
          </CardFooter>
        </Card>
      </Unauthenticated>
    </div>
  );
}

function InviteErrorPage({ error }: { error: Error }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-svh flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 size-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="size-6 text-destructive" />
          </div>
          <CardTitle>Unable to Accept Invite</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => navigate({ to: '/vehicles' })}
          >
            Go to Vehicles
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
