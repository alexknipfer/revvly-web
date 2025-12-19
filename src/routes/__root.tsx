/// <reference types="vite/client" />
import type { ReactNode } from 'react';
import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { ClerkProvider, useAuth } from '@clerk/tanstack-react-start';

import appCss from '@/styles/app.css?url';
import { auth } from '@clerk/tanstack-react-start/server';
import { createServerFn } from '@tanstack/react-start';
import { ConvexReactClient } from 'convex/react';
import { ConvexQueryClient } from '@convex-dev/react-query';
import { ConvexProviderWithClerk } from 'convex/react-clerk';

const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const authResponse = await auth();
  const token = await authResponse.getToken({ template: 'convex' });

  return {
    userId: authResponse.userId,
    token,
  };
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexClient: ConvexReactClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'theme-color',
        content: '#020618',
      },
      {
        title: 'Revly',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  beforeLoad: async (ctx) => {
    const auth = await fetchClerkAuth();
    const { userId, token } = auth;
    // During SSR only (the only time serverHttpClient exists),
    // set the Clerk auth token to make HTTP queries with.
    if (token && ctx.context.convexQueryClient.serverHttpClient?.setAuth) {
      ctx.context.convexQueryClient.serverHttpClient.setAuth(token);
    }

    return {
      userId,
      token,
    };
  },
  component: RootComponent,
});

function RootComponent() {
  const context = useRouteContext({ from: Route.id });

  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={context.convexClient} useAuth={useAuth}>
        <RootDocument>
          <Outlet />
        </RootDocument>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="dark">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
