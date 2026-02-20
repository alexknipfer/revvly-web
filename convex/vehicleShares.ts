import dayjs from 'dayjs';
import { zid } from 'convex-helpers/server/zod4';
import { z } from 'zod';

import { zMutation, zQuery } from './utils/zod';
import { requireAuth, verifyVerhicleOwnership } from './utils/auth';
import { ConvexError } from 'convex/values';

export const getById = zQuery({
  args: {
    id: zid('vehicle_shares'),
  },
  handler: async (ctx, { id }) => {
    const share = await ctx.db.get(id);

    if (!share) {
      throw new ConvexError({
        message: 'Invite not found',
        code: 'INVITE_NOT_FOUND',
      });
    }

    if (share.acceptedAt) {
      throw new ConvexError({
        message: 'This invite has already been accepted',
        code: 'INVITE_ALREADY_ACCEPTED',
      });
    }

    if (share.expiresAt && dayjs().isAfter(dayjs(share.expiresAt))) {
      throw new ConvexError({
        message: 'This invite has expired',
        code: 'INVITE_EXPIRED',
      });
    }

    const vehicle = await ctx.db.get(share.vehicleId);

    if (!vehicle) {
      throw new ConvexError({
        message: 'Vehicle not found',
        code: 'VEHICLE_NOT_FOUND',
      });
    }

    const inviter = await ctx.db
      .query('users')
      .withIndex('by_externalid', (q) => q.eq('externalId', share.invitedBy))
      .unique();

    const recipient = await ctx.db.get(share.userId);

    return {
      shareId: share._id,
      vehicle: {
        id: vehicle._id,
        name: vehicle.name,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
      },
      inviter: inviter
        ? {
            name: inviter.firstName
              ? `${inviter.firstName}${inviter.lastName ? ` ${inviter.lastName}` : ''}`
              : inviter.primaryEmailAddress,
          }
        : null,
      recipientEmail: recipient?.primaryEmailAddress,
    };
  },
});

export const accept = zMutation({
  args: {
    id: zid('vehicle_shares'),
  },
  handler: async (ctx, { id }) => {
    const identity = await requireAuth(ctx);

    const share = await ctx.db.get(id);
    console.log('share: ', share);

    if (!share) {
      throw new ConvexError({
        message: 'Invite not found',
        code: 'INVITE_NOT_FOUND',
      });
    }

    if (share.acceptedAt) {
      throw new ConvexError({
        message: 'This invite has already been accepted',
        code: 'INVITE_ALREADY_ACCEPTED',
      });
    }

    if (share.expiresAt && dayjs().isAfter(dayjs(share.expiresAt))) {
      throw new ConvexError({
        message: 'This invite has expired',
        code: 'INVITE_EXPIRED',
      });
    }

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_externalid', (q) => q.eq('externalId', identity.subject))
      .unique();

    if (!currentUser || currentUser._id !== share.userId) {
      throw new ConvexError({
        message: 'This invite was sent to a different email address',
        code: 'INVITE_NOT_FOR_YOU',
      });
    }

    await ctx.db.patch(id, {
      acceptedAt: dayjs().toISOString(),
    });

    return { vehicleId: share.vehicleId };
  },
});

export const create = zMutation({
  args: {
    vehicleId: zid('vehicles'),
    recipientEmail: z.email(),
  },
  handler: async (ctx, { vehicleId, recipientEmail }) => {
    const identity = await requireAuth(ctx);
    await verifyVerhicleOwnership({ ctx, vehicleId, identity });

    const recipient = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('primaryEmailAddress', recipientEmail))
      .unique();

    if (!recipient) {
      throw new ConvexError({
        message: 'Recipient user not found',
        code: 'RECIPIENT_USER_NOT_FOUND',
      });
    }

    const existingShare = await ctx.db
      .query('vehicle_shares')
      .withIndex('by_vehicleid_userid', (q) =>
        q.eq('vehicleId', vehicleId).eq('userId', recipient._id),
      )
      .unique();

    if (existingShare) {
      throw new ConvexError({
        message: 'Vehicle already shared with this user',
        code: 'VEHICLE_ALREADY_SHARED_WITH_USER',
      });
    }

    const currentTime = dayjs();

    return ctx.db.insert('vehicle_shares', {
      vehicleId,
      userId: recipient._id,
      invitedBy: identity.subject,
      invitedAt: currentTime.toISOString(),
      expiresAt: currentTime.add(30, 'minute').toISOString(),
    });
  },
});
