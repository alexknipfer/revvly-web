import { UserIdentity } from 'convex/server';
import { Id, Doc } from '../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../_generated/server';
import { ConvexError } from 'convex/values';

export async function requireAuth(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (identity === null) {
    throw new ConvexError({
      message: 'Unauthorized: User identity is required to access this data.',
    });
  }

  return identity;
}

export async function getCurrentUser(
  ctx: MutationCtx | QueryCtx,
  identity: UserIdentity,
) {
  return ctx.db
    .query('users')
    .withIndex('by_externalid', (q) => q.eq('externalId', identity.subject))
    .unique();
}

export async function hasVehicleAccess(
  ctx: MutationCtx | QueryCtx,
  vehicleId: Id<'vehicles'>,
  identity: UserIdentity,
): Promise<{
  hasAccess: boolean;
  vehicle: Doc<'vehicles'> | null;
  isOwner: boolean;
}> {
  const vehicle = await ctx.db.get(vehicleId);

  if (!vehicle) {
    return { hasAccess: false, vehicle: null, isOwner: false };
  }

  if (vehicle.userId === identity.subject) {
    return { hasAccess: true, vehicle, isOwner: true };
  }

  const user = await getCurrentUser(ctx, identity);

  if (!user) {
    return { hasAccess: false, vehicle, isOwner: false };
  }

  const share = await ctx.db
    .query('vehicle_shares')
    .withIndex('by_vehicleid_userid', (q) =>
      q.eq('vehicleId', vehicleId).eq('userId', user._id),
    )
    .filter((q) => q.neq(q.field('acceptedAt'), undefined))
    .unique();

  return { hasAccess: !!share, vehicle, isOwner: false };
}

export async function getSharedVehicleIds(
  ctx: MutationCtx | QueryCtx,
  identity: UserIdentity,
): Promise<Id<'vehicles'>[]> {
  const user = await getCurrentUser(ctx, identity);

  if (!user) {
    return [];
  }

  const shares = await ctx.db
    .query('vehicle_shares')
    .withIndex('by_userid_acceptedat', (q) => q.eq('userId', user._id))
    .filter((q) => q.neq(q.field('acceptedAt'), undefined))
    .collect();

  return shares.map((share) => share.vehicleId);
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
    throw new ConvexError({ message: 'Vehicle not found' });
  }

  if (vehicle.userId !== identity.subject) {
    throw new ConvexError({
      message: 'You can only perform this action on your own vehicles.',
    });
  }

  return vehicle;
}

export async function verifyVehicleAccess({
  ctx,
  vehicleId,
  identity,
}: {
  ctx: MutationCtx | QueryCtx;
  vehicleId: Id<'vehicles'>;
  identity: UserIdentity;
}): Promise<{ vehicle: Doc<'vehicles'>; isOwner: boolean }> {
  const { hasAccess, vehicle, isOwner } = await hasVehicleAccess(
    ctx,
    vehicleId,
    identity,
  );

  if (!hasAccess || !vehicle) {
    throw new ConvexError({
      message: 'You do not have access to this vehicle.',
    });
  }

  return { vehicle, isOwner };
}
