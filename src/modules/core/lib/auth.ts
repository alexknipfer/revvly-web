import { auth } from '@clerk/tanstack-react-start/server';

import { ConvexHttpClient } from 'convex/browser';
import { appConfig } from '@/modules/core/lib/appConfig';
import { tryCatch } from '@/modules/core/lib/utils';

export const getAuthConvexClient = async (): Promise<ConvexHttpClient> => {
  const { isAuthenticated, getToken } = await auth();

  if (!isAuthenticated) {
    throw new Error('User not authenticated');
  }

  const convex = new ConvexHttpClient(appConfig.convex.url);

  const [error, token] = await tryCatch(getToken({ template: 'convex' }));

  if (error) {
    console.error(error);
    throw new Error('Failed to get Clerk token');
  }

  if (token) {
    convex.setAuth(token);
  } else {
    console.error('Convex token not found');
    throw new Error('Convex token not found');
  }

  return convex;
};
