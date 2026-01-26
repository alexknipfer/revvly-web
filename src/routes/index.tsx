import { CtaSection } from '@/modules/landing/components/cta-section';
import { FeaturesSection } from '@/modules/landing/components/features-section';
import { HeroSection } from '@/modules/landing/components/hero-section';
import { LandingFooter } from '@/modules/landing/components/landing-footer';
import { LandingNav } from '@/modules/landing/components/landing-nav';
import { ScrollingBanner } from '@/modules/landing/components/scrolling-banner';
import { StatsSection } from '@/modules/landing/components/stats-section';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen relative font-mono">
      <ScrollingBanner />
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}
