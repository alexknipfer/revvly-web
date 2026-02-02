import {
  ArrowRight,
  CheckCircle,
  Cloud,
  Shield,
  Star,
  Terminal,
  Users,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { BadgePill } from '../../../components/ui/badge-pill';
import { CornerAccents } from '../../../components/corner-accents';
import { LandingContainer } from './landing-container';
import { SignInToVehiclesButton } from './sign-in-to-vehicles-button';

const techBadges = [
  { icon: Zap, label: 'FAST' },
  { icon: Shield, label: 'SECURE' },
  { icon: Cloud, label: 'SYNCED' },
  { icon: Terminal, label: 'POWERFUL' },
];

export function HeroSection() {
  return (
    <section className="relative pt-10 pb-16 px-6">
      <LandingContainer>
        <div className="border border-border p-8 md:p-10 bg-card/50 backdrop-blur-sm relative overflow-hidden">
          <CornerAccents />
          <div className="text-center relative z-10">
            {/* Status badges row */}
            <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
              <BadgePill className="border-indigo-400/30 bg-indigo-400/10 dark:bg-indigo-400/10">
                <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground dark:text-indigo-400">
                  ONLINE
                </span>
              </BadgePill>
              <BadgePill className="border-violet-400/30 bg-violet-400/10 dark:bg-violet-400/10">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground dark:text-violet-400">
                  1,247 ACTIVE_USERS
                </span>
              </BadgePill>
            </div>

            {/* Main title */}
            <h1 className="mb-4 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight group cursor-default">
              <span className="block mb-1 text-foreground group-hover:animate-glitch">
                TRACK
              </span>
              <span className="block bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 dark:from-indigo-400 dark:via-violet-400 dark:to-blue-400 bg-clip-text text-transparent">
                FUEL
              </span>
              <span className="block text-foreground group-hover:animate-glitch">
                EFFICIENCY
              </span>
            </h1>

            {/* Description */}
            <p className="mb-8 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans">
              Monitor efficiency, track expenses, and optimize your driving with{' '}
              <span className="text-indigo-600 dark:text-indigo-400 font-mono font-medium">
                intelligent insights
              </span>
              . Built for drivers who care about performance.
            </p>

            {/* Tech badges */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {techBadges.map((badge, idx) => {
                const Icon = badge.icon;

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="text-[10px] uppercase tracking-wider">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <SignInToVehiclesButton>
                <Button size="lg" className="group">
                  <span className="flex items-center">
                    Start Tracking
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </SignInToVehiclesButton>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Users className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="uppercase tracking-wider">1,000+ DRIVERS</span>
              </div>
              <div className="w-px h-3 bg-border" />
              <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                <CheckCircle className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                <span className="uppercase tracking-wider">FREE_TO_START</span>
              </div>
              <div className="w-px h-3 bg-border" />
              <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Star className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 fill-current" />
                <span className="uppercase tracking-wider">4.8/5 RATING</span>
              </div>
            </div>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
