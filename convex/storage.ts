import { mutation } from './_generated/server';

export const generateUploadUrl = mutation({
  handler: (ctx) => {
    return ctx.storage.generateUploadUrl();
  },
});
