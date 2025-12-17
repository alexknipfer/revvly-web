import { GenericMutationCtx } from 'convex/server';
import { MutationCtx, QueryCtx } from './_generated/server';

export async function requireAuth(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (identity === null) {
    throw new Error(
      'Unauthorized: User identity is required to access this data.',
    );
  }

  return identity;
}
