# AGENTS.md

This file provides guidance to AI coding agents operating in this repository.

## Project Overview

Revvly is a React application built with TanStack Router/Start for vehicle management. It uses Convex as the backend database and Clerk for authentication.

**Tech Stack:**

- **Frontend:** React 19, TanStack Router/Start, TanStack Query
- **Backend:** Convex (real-time database with server functions)
- **Authentication:** Clerk with Convex integration
- **Styling:** Tailwind CSS v4 with PostCSS
- **Build Tool:** Vite with TypeScript

## Development Commands

```bash
# Development server (starts Vite + Convex dev)
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type check
pnpm type-check

# Preview production build
pnpm preview
```

**Note:** No test suite is configured. The test script exits with error.

## Code Style Guidelines

### Formatting

- Use Prettier with the following config:
  - `singleQuote: true`
  - `trailingComma: 'all'`
  - `semi: true`
  - `endOfLine: 'auto'`

### TypeScript

- **Strict mode enabled** with additional flags:
  - `strictNullChecks: true`
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `noFallthroughCasesInSwitch: true`
  - `noUncheckedSideEffectImports: true`
- Target: ES2022, Module: ESNext
- Use path alias `@/*` for imports from `src/`

### Naming Conventions

- **Components:** PascalCase (e.g., `VehicleStatCard`, `Button`)
- **Hooks:** camelCase starting with `use` (e.g., `useForm`, `useMediaQuery`)
- **Utility functions:** camelCase (e.g., `cn`, `tryCatch`)
- **Files:**
  - Components: kebab-case (e.g., `vehicle-stat-card.tsx`)
  - Hooks: camelCase (e.g., `useForm.ts`)
  - Server functions: camelCase (e.g., `server-fns.ts`)
  - Schemas: camelCase (e.g., `schema.ts`)
- **Props interfaces:** `{ComponentName}Props` (e.g., `VehicleStatCardProps`)
- **Type variants:** Use `cva` (class-variance-authority) for component variants

### Imports

- Group imports: external libraries first, then internal modules
- Use `@/*` path alias for src imports
- Example order:
  1. React/Node built-ins
  2. Third-party libraries
  3. Internal components/utilities
  4. Types/schemas
  5. CSS imports

### Component Patterns

- Use functional components with explicit Props interfaces
- Destructure props in function parameters
- Use `cn()` utility for conditional class merging
- Support `className` prop for styling overrides
- Components should be exported as named exports
- Use `class-variance-authority` for variant-based components

### Error Handling

- Use `tryCatch` utility from `@/lib/utils` for async operations
- Returns `[Error, null]` on failure, `[null, T]` on success
- Convex server functions should use `ConvexError` for typed errors
- Always handle authentication with `requireAuth()` helper

### Convex Backend Patterns

- Define tables in `convex/{entity}/schema.ts`
- Use validators from `convex/{entity}/validators.ts`
- Use `zQuery` and `zMutation` wrappers from `convex/utils/zod.ts`
- Authentication: Use `requireAuth()` and `verifyVerhicleOwnership()` helpers
- Database queries use indexes for performance
- Table names use snake_case (e.g., `fuel_entries`, `vehicles`)

### Styling

- Tailwind CSS v4 with `@theme inline` for CSS variables
- Use CSS variables for theming (e.g., `--color-primary`)
- Dark mode support via `data-theme='dark'` attribute
- Component styling via `class-variance-authority` (cva)
- Border and focus states: `border-transparent bg-clip-padding`
- Font: System sans-serif with mono for buttons

### File Structure

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

### Route Conventions

- File-based routing with TanStack Router
- Route files use underscore prefixes for layouts (e.g., `_auth.tsx`)
- Dynamic segments use `$param` syntax (e.g., `$vehicleId`)
- Generated route tree in `src/routeTree.gen.ts`

### ESLint Rules

- Enable `react-hooks/exhaustive-deps` as warning
- Disable `no-undef` (TypeScript handles this)
- Disable `no-unused-vars` in favor of `@typescript-eslint/no-unused-vars`
- Unused vars must start with `_` to be ignored
- React 17+ JSX transform (no need to import React)

## Environment

Required environment variables:

- `VITE_CONVEX_URL` - Convex deployment URL

Clerk domain: `https://divine-beetle-47.clerk.accounts.dev`

## Notes

- React 19 is used (JSX transform, no React import needed)
- No emojis unless explicitly requested by user
- Convex real-time subscriptions for data fetching
- Use `zod` for runtime validation on both client and server
