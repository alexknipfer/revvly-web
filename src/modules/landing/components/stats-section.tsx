import { Card, CardContent } from '@/components/ui/card';

import { LandingSection } from './landing-section';
import { SectionHeader } from './section-header';

const StatCardAccentColors = {
  INDIGO: 'indigo',
  VIOLET: 'violet',
  BLUE: 'blue',
};

const statCardAccentClasses = {
  [StatCardAccentColors.INDIGO]:
    'border-indigo-400/30 dark:border-indigo-400/30 bg-indigo-400/5 dark:bg-indigo-400/5 hover:border-indigo-600/60 dark:hover:border-indigo-400/60 text-indigo-600 dark:text-indigo-400',
  [StatCardAccentColors.VIOLET]:
    'border-violet-400/30 dark:border-violet-400/30 bg-violet-400/5 dark:bg-violet-400/5 hover:border-violet-600/60 dark:hover:border-violet-400/60 text-violet-600 dark:text-violet-400',
  [StatCardAccentColors.BLUE]:
    'border-blue-400/30 dark:border-blue-400/30 bg-blue-400/5 dark:bg-blue-400/5 hover:border-blue-600/60 dark:hover:border-blue-400/60 text-blue-600 dark:text-blue-400',
};

const stats = [
  { label: 'TOTAL_MILES', value: 'Miles', color: StatCardAccentColors.INDIGO },
  {
    label: 'GALLONS_USED',
    value: 'Gallons',
    color: StatCardAccentColors.VIOLET,
  },
  { label: 'AVG_MPG', value: 'MPG', color: StatCardAccentColors.BLUE },
  { label: 'TOTAL_COST', value: 'Costs', color: StatCardAccentColors.INDIGO },
];

export function StatsSection() {
  return (
    <LandingSection id="stats">
      <SectionHeader kicker="002" title="METRICS" />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`text-center border rounded-none bg-card/70 backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 ${statCardAccentClasses[stat.color]}`}
          >
            <CardContent className="pt-6 pb-6">
              <div className="text-4xl md:text-5xl font-bold mb-2 uppercase tracking-tight font-mono text-foreground">
                {stat.value}
              </div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </LandingSection>
  );
}
