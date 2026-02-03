import dayjs from 'dayjs';
import { zid } from 'convex-helpers/server/zod4';
import { z } from 'zod';

import { zMutation } from './utils/zod';
import { requireAuth, verifyVerhicleOwnership } from './utils/auth';
import { ConvexError } from 'convex/values';

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
