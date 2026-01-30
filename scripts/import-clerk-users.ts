import { createClerkClient } from '@clerk/backend';
import { api } from 'convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Load env: ENV_FILE=.env.prod or default .env.local (e.g. pnpm run import-clerk-users:prod)
const envFile = process.env.ENV_FILE ?? '.env.local';
const envPath = path.join(projectRoot, envFile);
const result = dotenv.config({ path: envPath });
if (result.error && envFile !== '.env') {
  console.warn(`Warning: could not load ${envFile} (${result.error.message})`);
}

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
});

const convexClient = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);

const clerkUsers = await clerkClient.users.getUserList({
  limit: 100,
});

for (const clerkUser of clerkUsers.data) {
  await convexClient.mutation(api.users.upsertFromClerk, {
    firstName: clerkUser.firstName,
    imageUrl: clerkUser.imageUrl,
    lastName: clerkUser.lastName,
    externalId: clerkUser.id,
    clerkWebhookSigningKey: process.env.CLERK_WEBHOOK_SIGNING_SECRET!,
  });
}
