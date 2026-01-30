import z from 'zod';

import { QueryCtx } from './_generated/server';
import { zMutation } from './utils/zod';

export const upsertFromClerk = zMutation({
  args: {
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    imageUrl: z.string().optional(),
    primaryEmailAddress: z.email(),
    externalId: z.string(),
    clerkWebhookSigningKey: z.string(),
  },
  async handler(
    ctx,
    {
      firstName,
      lastName,
      imageUrl,
      primaryEmailAddress,
      externalId,
      clerkWebhookSigningKey,
    },
  ) {
    if (clerkWebhookSigningKey !== process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
      throw new Error('Valid Clerk webhook signing key is required');
    }

    const userAttributes = {
      firstName,
      lastName,
      imageUrl,
      primaryEmailAddress,
      externalId,
    };

    const user = await userByExternalId(ctx, externalId);

    if (user === null) {
      await ctx.db.insert('users', userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = zMutation({
  args: { clerkUserId: z.string(), clerkWebhookSigningKey: z.string() },
  async handler(ctx, { clerkUserId, clerkWebhookSigningKey }) {
    if (clerkWebhookSigningKey !== process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
      throw new Error('Valid Clerk webhook signing key is required');
    }

    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      throw new Error(`User not found for Clerk user ID: ${clerkUserId}`);
    }
  },
});

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return ctx.db
    .query('users')
    .withIndex('by_externalid', (q) => q.eq('externalId', externalId))
    .unique();
}
