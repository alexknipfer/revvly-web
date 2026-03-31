import z from 'zod';

import { QueryCtx } from './_generated/server';
import { zMutation, zQuery } from './utils/zod';

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
      const [vehicles, fuelEntries, services] = await Promise.all([
        ctx.db
          .query('vehicles')
          .withIndex('by_userid', (q) => q.eq('userId', user._id))
          .collect(),
        ctx.db
          .query('fuel_entries')
          .withIndex('by_userid', (q) => q.eq('userId', user._id))
          .collect(),
        ctx.db
          .query('services')
          .withIndex('by_userid', (q) => q.eq('userId', user._id))
          .collect(),
      ]);

      for (const fuelEntry of fuelEntries) {
        await ctx.db.delete('fuel_entries', fuelEntry._id);
      }

      for (const service of services) {
        await ctx.db.delete('services', service._id);
      }

      for (const vehicle of vehicles) {
        await ctx.db.delete('vehicles', vehicle._id);
      }

      await ctx.db.delete('users', user._id);
    } else {
      throw new Error(`User not found for Clerk user ID: ${clerkUserId}`);
    }
  },
});

export const getById = zQuery({
  args: { clerkUserId: z.string().min(1) },
  handler: (ctx, { clerkUserId }) => {
    return userByExternalId(ctx, clerkUserId);
  },
});

export const getByEmail = zQuery({
  args: { email: z.string().email() },
  handler: (ctx, { email }) => {
    return ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('primaryEmailAddress', email))
      .unique();
  },
});

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return ctx.db
    .query('users')
    .withIndex('by_externalid', (q) => q.eq('externalId', externalId))
    .unique();
}
