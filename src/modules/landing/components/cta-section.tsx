import { Button } from '@/components/ui/button';

import { Sparkles } from 'lucide-react';

import { BadgePill } from '../../../components/ui/badge-pill';
import { CornerAccents } from '../../../components/corner-accents';
import { LandingSection } from './landing-section';
import { SignInToVehiclesButton } from './sign-in-to-vehicles-button';

export function CtaSection() {
  return (
    <LandingSection containerClassName="max-w-4xl">
      <div className="border border-border p-8 md:p-10 bg-card/50 backdrop-blur-sm text-center relative overflow-hidden">
        <CornerAccents />

        <BadgePill className="border-indigo-400/30 bg-indigo-400/10 dark:bg-indigo-400/10 mb-4">
          <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
          <span className="text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            GET_STARTED
          </span>
        </BadgePill>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground uppercase tracking-tight">
          READY_TO_OPTIMIZE?
        </h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed font-sans">
          Join thousands of drivers who are saving money and improving their
          fuel economy.
        </p>

        <SignInToVehiclesButton>
          <Button size="lg" className="group">
            START_NOW
            <Sparkles className="ml-2 h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-500" />
          </Button>
        </SignInToVehiclesButton>
      </div>
    </LandingSection>
  );
}
