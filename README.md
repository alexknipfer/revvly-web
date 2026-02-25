# Revvly

A modern vehicle management application built with React, TanStack Router/Start, and Convex.

## Tech Stack

- **Frontend:** React 19, TanStack Router/Start, TanStack Query
- **Backend:** Convex (real-time database with server functions)
- **Authentication:** Clerk with Convex integration
- **Styling:** Tailwind CSS v4 with PostCSS
- **Build Tool:** Vite with TypeScript

## Prerequisites

- Node.js 18+ and pnpm
- Convex CLI installed globally: `npm install -g convex`

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Convex Configuration
CONVEX_DEPLOYMENT=local:your-project-name
VITE_CONVEX_URL=http://127.0.0.1:3210

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
VITE_CLERK_FRONTEND_API_URL=https://your-domain.clerk.accounts.dev

# External APIs
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
VITE_MAPBOX_BASE_URL=https://api.mapbox.com

# Monitoring
VITE_SENTRY_DSN=your_sentry_dsn
VITE_SENTRY_ENVIRONMENT=local

# Server-only (for Clerk webhooks)
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Installation

```bash
# Install dependencies
pnpm install

# Initialize Convex (if not already done)
convex dev --once
```

## Development

Start the development server with Convex running locally:

```bash
pnpm dev
```

This command:

1. Starts the Convex local development server (on port 3210)
2. Starts the Vite development server (on port 3000)

### Convex Local Development

Convex runs locally during development for faster iteration and offline capability. The local Convex server:

- Runs on `http://127.0.0.1:3210` by default
- Provides real-time data synchronization
- Hot-reloads backend functions on file changes
- Stores data in a local SQLite database

When you run `pnpm dev`, both the frontend and Convex backend start automatically. Any changes to files in the `convex/` directory will trigger hot-reloads in the backend.

### Manual Convex Commands

If you need to run Convex commands separately:

```bash
# Start Convex dev server only
pnpx convex dev

# Deploy to Convex cloud (production)
pnpx convex deploy

# Run migrations
pnpx convex run migrations:run
```

## Project Structure

```
src/
  routes/           # TanStack Router file-based routes
  components/ui/    # Base UI components (Button, Input, etc.)
  modules/          # Feature modules (vehicle, fuel-entry, etc.)
    {feature}/
      components/   # Feature-specific components
      server/       # Server functions (TanStack Start)
      schemas/      # Zod schemas for forms
  lib/              # Utilities and helpers
  hooks/            # Custom React hooks
  styles/           # Global CSS
convex/
  {entity}/         # Entity folders (vehicles, services, etc.)
    schema.ts       # Table definitions
    validators.ts   # Convex validators
  utils/            # Convex utilities (auth, zod)
```

## Build for Production

```bash
pnpm build
```

The build output will be in the `.output/` directory.

## Preview Production Build

```bash
pnpm preview
```

## Type Checking

```bash
pnpm type-check
```

## Linting

```bash
# Check for linting errors
pnpm lint

# Fix linting errors
pnpm lint:fix
```
