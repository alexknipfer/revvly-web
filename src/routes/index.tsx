import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignInButton } from '@clerk/tanstack-react-start';
import { createFileRoute } from '@tanstack/react-router';
import {
  Fuel,
  BarChart3,
  DollarSign,
  Calendar,
  TrendingUp,
  Gauge,
  CheckCircle,
  Star,
  Users,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Cloud,
  Terminal,
} from 'lucide-react';

export const Route = createFileRoute('/')({
  component: Home,
});

const scrollTextTop = [
  { text: 'FUEL_TRACKING', highlight: true },
  { text: '•', highlight: false },
  { text: 'MPG_ANALYTICS', highlight: false },
  { text: '•', highlight: false },
  { text: 'EXPENSE_MONITORING', highlight: true },
  { text: '•', highlight: false },
  { text: 'REAL_TIME_SYNC', highlight: false },
  { text: '•', highlight: false },
  { text: 'SMART_INSIGHTS', highlight: true },
  { text: '•', highlight: false },
  { text: 'SERVICE_REMINDERS', highlight: false },
  { text: '•', highlight: false },
  { text: 'MULTI_VEHICLE', highlight: true },
  { text: '•', highlight: false },
  { text: 'COST_PER_MILE', highlight: false },
  { text: '•', highlight: false },
];

const scrollTextBottom = [
  { text: 'BUILD_2025.01', highlight: true },
  { text: '///', highlight: false },
  { text: 'UPTIME_99.9%', highlight: false },
  { text: '///', highlight: false },
  { text: 'API_READY', highlight: true },
  { text: '///', highlight: false },
  { text: 'ENCRYPTED', highlight: false },
  { text: '///', highlight: false },
  { text: 'CLOUD_SYNC', highlight: true },
  { text: '///', highlight: false },
  { text: 'ZERO_CONFIG', highlight: false },
  { text: '///', highlight: false },
  { text: 'INSTANT_DEPLOY', highlight: true },
  { text: '///', highlight: false },
];

const features = [
  {
    icon: Fuel,
    title: 'FUEL_LOGGING',
    description:
      'Log every fill-up with precision. Track gallons, cost, odometer, and location.',
    color: 'indigo',
    number: '01',
  },
  {
    icon: BarChart3,
    title: 'EFFICIENCY_ANALYTICS',
    description:
      'Monitor MPG trends and identify patterns to optimize your driving habits.',
    color: 'violet',
    number: '02',
  },
  {
    icon: DollarSign,
    title: 'EXPENSE_TRACKING',
    description:
      'Track total fuel costs, average price per gallon, and spending patterns.',
    color: 'blue',
    number: '03',
  },
  {
    icon: Calendar,
    title: 'SERVICE_SCHEDULING',
    description:
      'Log maintenance records and get reminders for upcoming service intervals.',
    color: 'indigo',
    number: '04',
  },
  {
    icon: TrendingUp,
    title: 'SMART_INSIGHTS',
    description:
      'Get intelligent recommendations to improve fuel efficiency and reduce costs.',
    color: 'violet',
    number: '05',
  },
  {
    icon: Gauge,
    title: 'REAL_TIME_DASHBOARD',
    description:
      'View all your vehicle metrics at a glance with an intuitive dashboard.',
    color: 'blue',
    number: '06',
  },
];

const stats = [
  { label: 'TOTAL_MILES', value: 'Miles', color: 'indigo' },
  { label: 'GALLONS_USED', value: 'Gallons', color: 'violet' },
  { label: 'AVG_MPG', value: 'MPG', color: 'blue' },
  { label: 'TOTAL_COST', value: 'Costs', color: 'indigo' },
];

const techBadges = [
  { icon: Zap, label: 'FAST' },
  { icon: Shield, label: 'SECURE' },
  { icon: Cloud, label: 'SYNCED' },
  { icon: Terminal, label: 'POWERFUL' },
];

function Home() {
  return (
    <div className="min-h-screen relative font-mono">
      {/* Grid background pattern */}
      {/* <div className="fixed inset-0 opacity-[0.03] animate-grid-pulse pointer-events-none -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div> */}

      {/* Enhanced Scrolling Banner - Two rows */}
      <div className="bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center h-8 overflow-hidden border-b border-border/50">
          <div className="flex items-center gap-6 animate-scroll whitespace-nowrap">
            {[...scrollTextTop, ...scrollTextTop, ...scrollTextTop].map(
              (item, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] uppercase tracking-widest ${
                    item.highlight
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : item.text === '•'
                        ? 'text-foreground/20'
                        : 'text-muted-foreground'
                  }`}
                >
                  {item.text}
                </span>
              ),
            )}
          </div>
        </div>
        <div className="flex items-center h-8 overflow-hidden">
          <div className="flex items-center gap-6 animate-scroll-reverse whitespace-nowrap">
            {[
              ...scrollTextBottom,
              ...scrollTextBottom,
              ...scrollTextBottom,
            ].map((item, idx) => (
              <span
                key={idx}
                className={`text-[10px] uppercase tracking-widest ${
                  item.highlight
                    ? 'text-violet-600 dark:text-violet-400'
                    : item.text === '///'
                      ? 'text-foreground/20'
                      : 'text-muted-foreground'
                }`}
              >
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 px-6 pt-6 md:pt-9 pb-3">
        <div className="mx-auto max-w-7xl">
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
            <SignInButton forceRedirectUrl="/vehicles">
              <Button variant="default" size="sm">
                Log In
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </SignInButton>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-10 pb-16 px-6">
        <div className="relative mx-auto max-w-7xl">
          {/* Terminal-style border with animated glow */}
          <div className="border border-border p-8 md:p-10 bg-card/50 backdrop-blur-sm relative overflow-hidden">
            {/* Animated border glow */}
            <div className="absolute inset-0 opacity-50">
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-600 dark:via-indigo-400 to-transparent animate-pulse" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-violet-600 dark:via-violet-400 to-transparent animate-pulse delay-1000" />
              <div className="absolute top-0 bottom-0 left-0 w-px bg-linear-to-b from-transparent via-blue-600 dark:via-blue-400 to-transparent animate-pulse delay-2000" />
              <div className="absolute top-0 bottom-0 right-0 w-px bg-linear-to-b from-transparent via-indigo-600 dark:via-indigo-400 to-transparent animate-pulse" />
            </div>

            {/* Corner brackets - larger and more prominent */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-indigo-600 dark:border-indigo-400" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-violet-600 dark:border-violet-400" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-600 dark:border-blue-400" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-indigo-600 dark:border-indigo-400" />

            <div className="text-center relative z-10">
              {/* Status badges row */}
              <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-indigo-400/30 bg-indigo-400/10 dark:bg-indigo-400/10">
                  <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground dark:text-indigo-400">
                    ONLINE
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-violet-400/30 bg-violet-400/10 dark:bg-violet-400/10">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground dark:text-violet-400">
                    1,247 ACTIVE_USERS
                  </span>
                </div>
              </div>

              {/* Main title with glitch effect on hover */}
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
                Monitor efficiency, track expenses, and optimize your driving
                with{' '}
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
                <SignInButton forceRedirectUrl="/vehicles">
                  <Button size="lg" className="group">
                    <span className="flex items-center">
                      Start Tracking
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </SignInButton>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Users className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="uppercase tracking-wider">
                    1,000+ DRIVERS
                  </span>
                </div>
                <div className="w-px h-3 bg-border" />
                <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <CheckCircle className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                  <span className="uppercase tracking-wider">
                    FREE_TO_START
                  </span>
                </div>
                <div className="w-px h-3 bg-border" />
                <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Star className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 fill-current" />
                  <span className="uppercase tracking-wider">4.8/5 RATING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-10 px-6 relative">
        <div className="relative mx-auto max-w-7xl">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                001
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
                FEATURES
              </h2>
            </div>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const colorClasses = {
                indigo:
                  'border-indigo-400/30 dark:border-indigo-400/30 bg-indigo-400/5 dark:bg-indigo-400/5 hover:border-indigo-600/60 dark:hover:border-indigo-400/60 hover:bg-indigo-400/10 dark:hover:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400',
                violet:
                  'border-violet-400/30 dark:border-violet-400/30 bg-violet-400/5 dark:bg-violet-400/5 hover:border-violet-600/60 dark:hover:border-violet-400/60 hover:bg-violet-400/10 dark:hover:bg-violet-400/10 text-violet-600 dark:text-violet-400',
                blue: 'border-blue-400/30 dark:border-blue-400/30 bg-blue-400/5 dark:bg-blue-400/5 hover:border-blue-600/60 dark:hover:border-blue-400/60 hover:bg-blue-400/10 dark:hover:bg-blue-400/10 text-blue-600 dark:text-blue-400',
              };

              return (
                <Card
                  key={idx}
                  className={`group border rounded-none bg-card/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${colorClasses[feature.color as keyof typeof colorClasses]}`}
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
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-10 px-6 relative">
        <div className="relative mx-auto max-w-7xl">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                002
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
                METRICS
              </h2>
            </div>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const colorClasses = {
                indigo:
                  'border-indigo-400/30 dark:border-indigo-400/30 bg-indigo-400/5 dark:bg-indigo-400/5 hover:border-indigo-600/60 dark:hover:border-indigo-400/60 text-indigo-600 dark:text-indigo-400',
                violet:
                  'border-violet-400/30 dark:border-violet-400/30 bg-violet-400/5 dark:bg-violet-400/5 hover:border-violet-600/60 dark:hover:border-violet-400/60 text-violet-600 dark:text-violet-400',
                blue: 'border-blue-400/30 dark:border-blue-400/30 bg-blue-400/5 dark:bg-blue-400/5 hover:border-blue-600/60 dark:hover:border-blue-400/60 text-blue-600 dark:text-blue-400',
              };

              return (
                <Card
                  key={idx}
                  className={`text-center border rounded-none bg-card/70 backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 ${colorClasses[stat.color as keyof typeof colorClasses]}`}
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
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 px-6 relative">
        <div className="relative mx-auto max-w-4xl">
          <div className="border border-border p-8 md:p-10 bg-card/50 backdrop-blur-sm text-center relative overflow-hidden">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-indigo-600/50 dark:border-indigo-400/50" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-violet-600/50 dark:border-violet-400/50" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-blue-600/50 dark:border-blue-400/50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-indigo-600/50 dark:border-indigo-400/50" />

            <div className="inline-flex items-center gap-2 px-3 py-1 border border-indigo-400/30 bg-indigo-400/10 dark:bg-indigo-400/10 mb-4">
              <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                GET_STARTED
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground uppercase tracking-tight">
              READY_TO_OPTIMIZE?
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed font-sans">
              Join thousands of drivers who are saving money and improving their
              fuel economy.
            </p>
            <SignInButton forceRedirectUrl="/vehicles">
              <Button size="lg" className="group">
                START_NOW
                <Sparkles className="ml-2 h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-500" />
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 relative bg-card/50 backdrop-blur-sm">
        <div className="relative mx-auto max-w-7xl">
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
        </div>
      </footer>
    </div>
  );
}
