import { Button } from '@/components/ui/button';

import { ArrowRight } from 'lucide-react';

import { LandingContainer } from './landing-container';
import { SignInToVehiclesButton } from './sign-in-to-vehicles-button';

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 px-6 pt-6 md:pt-9 pb-3">
      <LandingContainer>
        <nav className="flex items-center justify-between border border-border bg-background/80 backdrop-blur-md px-6 py-3">
          <div className="flex items-center space-x-3 group">
            <span className="text-lg font-bold tracking-widest uppercase text-foreground">
              REVVLY
            </span>
            <span className="hidden sm:inline-block text-[10px] text-muted-foreground border border-border px-1.5 py-0.5">
              BETA
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs text-muted-foreground">
            <a
              href="#features"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-wider"
            >
              FEATURES
            </a>
            <a
              href="#stats"
              className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors uppercase tracking-wider"
            >
              STATS
            </a>
            <a
              href="#about"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider"
            >
              ABOUT
            </a>
          </div>

          <SignInToVehiclesButton>
            <Button variant="default" size="sm">
              Log In
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </SignInToVehiclesButton>
        </nav>
      </LandingContainer>
    </header>
  );
}
