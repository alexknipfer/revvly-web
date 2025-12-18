import { UserIdentity } from 'convex/server';
import { Id } from '../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../_generated/server';

export async function requireAuth(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (identity === null) {
    throw new Error(
      'Unauthorized: User identity is required to access this data.',
    );
  }

  return identity;
}

export async function verifyVerhicleOwnership({
  ctx,
  vehicleId,
  identity,
}: {
  ctx: MutationCtx | QueryCtx;
  vehicleId: Id<'vehicles'>;
  identity: UserIdentity;
}) {
  const vehicle = await ctx.db.get(vehicleId);

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  if (vehicle.userId !== identity.subject) {
    throw new Error('You can only add fuel entries to your own vehicles.');
  }

  return vehicle;
}
