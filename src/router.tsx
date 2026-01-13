import { createRouter } from '@tanstack/react-router';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { ConvexQueryClient } from '@convex-dev/react-query';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';

import { appConfig } from '@/modules/core/lib/appConfig';

import { routeTree } from './routeTree.gen';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';

export function getRouter() {
  const convex = new ConvexReactClient(appConfig.convex.url, {
    unsavedChangesWarning: false,
    expectAuth: true,
  });
  const convexQueryClient = new ConvexQueryClient(convex);

  const queryClient: QueryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error(error.message);
      },
    }),
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
      mutations: {
        onError: (error) => {
          console.error('Error:', error);

          if (error instanceof ConvexError) {
            toast.error(error.data.message);
          } else if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error('An unknown error occurred');
          }
        },
      },
    },
  });
  convexQueryClient.connect(queryClient);

  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    context: { queryClient, convexClient: convex, convexQueryClient },
    Wrap: ({ children }) => (
      <ConvexProvider client={convexQueryClient.convexClient}>
        {children}
      </ConvexProvider>
    ),
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
