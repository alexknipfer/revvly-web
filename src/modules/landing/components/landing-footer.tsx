import { Fuel } from 'lucide-react';

import { LandingContainer } from './landing-container';

export function LandingFooter() {
  return (
    <footer className="border-t border-border py-8 px-6 relative bg-card/50 backdrop-blur-sm">
      <LandingContainer>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Fuel className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-sm uppercase tracking-wider text-foreground">
              REVVLY
            </span>
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
            © 2025 REVVLY // TRACK_SMARTER_DRIVE_BETTER
          </div>
        </div>
      </LandingContainer>
    </footer>
  );
}
