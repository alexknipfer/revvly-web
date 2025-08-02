# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `pnpm dev` - Starts Vite dev server on port 3000
- **Build**: `pnpm build` - Builds the application for production
- **Code formatting**: `prettier --write .` - Formats code using Prettier config

## Architecture Overview

This is a React application built with TanStack Router and Start, using Convex as the backend database and Clerk for authentication.

### Tech Stack
- **Frontend**: React 19 with TanStack Router/Start for file-based routing and SSR
- **Backend**: Convex (real-time database with server functions)
- **Authentication**: Clerk with Convex integration
- **Styling**: Tailwind CSS v4 with PostCSS
- **Build Tool**: Vite with TypeScript

### Key Architecture Patterns

**Router Configuration** (`src/router.tsx`):
- Creates router with Convex and TanStack Query integration
- Sets up ConvexQueryClient with QueryClient for unified data fetching
- Provides Convex client and query client through router context

**Root Route** (`src/routes/__root.tsx`):
- Handles SSR authentication with Clerk
- Sets Convex auth token for server-side queries
- Wraps app with ClerkProvider and ConvexProviderWithClerk

**Database Schema** (`convex/schema.ts`):
- Currently defines `vehicles` table with fields: name, make, model, year, plate, imageUrl
- Uses Convex's type-safe schema definition

### Environment Setup
- Requires `VITE_CONVEX_URL` environment variable
- Clerk authentication configured with domain: `https://divine-beetle-47.clerk.accounts.dev`

### File Structure Conventions
- Routes in `src/routes/` using TanStack Router file-based routing
- UI components in `src/components/ui/` (shadcn/ui pattern)
- Path alias `@/*` maps to `./src/*`
- Generated route tree in `src/routeTree.gen.ts`

### Code Style
- Prettier config: single quotes, trailing commas, semicolons
- TypeScript strict mode enabled with additional safety flags
- JSX in React 19 format