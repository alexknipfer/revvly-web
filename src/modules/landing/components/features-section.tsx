import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { LandingSection } from './landing-section';
import { SectionHeader } from './section-header';
import {
  BarChart3,
  Calendar,
  DollarSign,
  Fuel,
  Gauge,
  TrendingUp,
} from 'lucide-react';

const FeatureCardAccentColors = {
  INDIGO: 'indigo',
  VIOLET: 'violet',
  BLUE: 'blue',
};

const featureCardAccentClasses = {
  [FeatureCardAccentColors.INDIGO]:
    'border-indigo-400/30 dark:border-indigo-400/30 bg-indigo-400/5 dark:bg-indigo-400/5 hover:border-indigo-600/60 dark:hover:border-indigo-400/60 hover:bg-indigo-400/10 dark:hover:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400',
  [FeatureCardAccentColors.VIOLET]:
    'border-violet-400/30 dark:border-violet-400/30 bg-violet-400/5 dark:bg-violet-400/5 hover:border-violet-600/60 dark:hover:border-violet-400/60 hover:bg-violet-400/10 dark:hover:bg-violet-400/10 text-violet-600 dark:text-violet-400',
  [FeatureCardAccentColors.BLUE]:
    'border-blue-400/30 dark:border-blue-400/30 bg-blue-400/5 dark:bg-blue-400/5 hover:border-blue-600/60 dark:hover:border-blue-400/60 hover:bg-blue-400/10 dark:hover:bg-blue-400/10 text-blue-600 dark:text-blue-400',
};

export const features = [
  {
    icon: Fuel,
    title: 'FUEL_LOGGING',
    description:
      'Log every fill-up with precision. Track gallons, cost, odometer, and location.',
    color: FeatureCardAccentColors.INDIGO,
    number: '01',
  },
  {
    icon: BarChart3,
    title: 'EFFICIENCY_ANALYTICS',
    description:
      'Monitor MPG trends and identify patterns to optimize your driving habits.',
    color: FeatureCardAccentColors.VIOLET,
    number: '02',
  },
  {
    icon: DollarSign,
    title: 'EXPENSE_TRACKING',
    description:
      'Track total fuel costs, average price per gallon, and spending patterns.',
    color: FeatureCardAccentColors.BLUE,
    number: '03',
  },
  {
    icon: Calendar,
    title: 'SERVICE_SCHEDULING',
    description:
      'Log maintenance records and get reminders for upcoming service intervals.',
    color: FeatureCardAccentColors.INDIGO,
    number: '04',
  },
  {
    icon: TrendingUp,
    title: 'SMART_INSIGHTS',
    description:
      'Get intelligent recommendations to improve fuel efficiency and reduce costs.',
    color: FeatureCardAccentColors.VIOLET,
    number: '05',
  },
  {
    icon: Gauge,
    title: 'REAL_TIME_DASHBOARD',
    description:
      'View all your vehicle metrics at a glance with an intuitive dashboard.',
    color: FeatureCardAccentColors.BLUE,
    number: '06',
  },
];

export function FeaturesSection() {
  return (
    <LandingSection id="features">
      <SectionHeader kicker="001" title="FEATURES" />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon;

          return (
            <Card
              key={idx}
              className={`group border rounded-none bg-card/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${featureCardAccentClasses[feature.color]}`}
            >
              <CardHeader className="p-5 relative">
                {/* Background number */}
                <div className="absolute top-3 right-3 text-5xl font-bold text-foreground/5 dark:text-white/3 group-hover:text-foreground/10 dark:group-hover:text-white/8 transition-colors">
                  {feature.number}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 border mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-5 w-5" />
                </div>

                <CardTitle className="text-sm mb-2 uppercase tracking-wider font-mono">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground leading-relaxed font-sans">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </LandingSection>
  );
}
