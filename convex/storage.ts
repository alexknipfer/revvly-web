import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const generateUploadUrl = mutation({
  handler: (ctx) => {
    return ctx.storage.generateUploadUrl();
  },
});

export const getFileUrl = mutation({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    return ctx.storage.getUrl(args.storageId);
  },
});

export const deleteFile = mutation({
  args: { storageId: v.id('_storage') },
  handler: (ctx, args) => {
    return ctx.storage.delete(args.storageId);
  },
});
