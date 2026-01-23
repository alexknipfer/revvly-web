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
} from 'lucide-react';
export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {

  const scrollText = [
    '/// TRACK_FUEL_EFFICIENCY',
    '/// ANALYZE_PERFORMANCE',
    '/// OPTIMIZE_COSTS',
    '/// SMART_INSIGHTS',
    '/// REAL_TIME_DATA',
    '/// DRIVE_SMARTER',
  ];

  const features = [
    {
      icon: Fuel,
      title: 'FUEL_LOGGING',
      description: 'Log every fill-up with precision. Track gallons, cost, odometer, and location.',
      color: 'indigo',
      number: '01',
    },
    {
      icon: BarChart3,
      title: 'EFFICIENCY_ANALYTICS',
      description: 'Monitor MPG trends and identify patterns to optimize your driving habits.',
      color: 'violet',
      number: '02',
    },
    {
      icon: DollarSign,
      title: 'EXPENSE_TRACKING',
      description: 'Track total fuel costs, average price per gallon, and spending patterns.',
      color: 'blue',
      number: '03',
    },
    {
      icon: Calendar,
      title: 'SERVICE_SCHEDULING',
      description: 'Log maintenance records and get reminders for upcoming service intervals.',
      color: 'indigo',
      number: '04',
    },
    {
      icon: TrendingUp,
      title: 'SMART_INSIGHTS',
      description: 'Get intelligent recommendations to improve fuel efficiency and reduce costs.',
      color: 'violet',
      number: '05',
    },
    {
      icon: Gauge,
      title: 'REAL_TIME_DASHBOARD',
      description: 'View all your vehicle metrics at a glance with an intuitive dashboard.',
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

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden font-mono">
      {/* Grid background pattern */}
      <div className="fixed inset-0 opacity-[0.03] animate-grid-pulse pointer-events-none -z-10">
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
      </div>

      {/* Animated gradient orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl -z-10 animate-pulse-slow delay-1000" />
      <div className="fixed top-1/2 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -z-10 animate-pulse-slow delay-2000" />

      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.02]">
        <div className="h-full w-full bg-linear-to-b from-transparent via-white to-transparent animate-scanline" />
      </div>

      {/* Scrolling Banner */}
      <div className="sticky top-0 z-50 bg-black border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center h-10 overflow-hidden">
          <div className="flex items-center gap-8 px-6 animate-scroll whitespace-nowrap">
            {[...scrollText, ...scrollText].map((text, idx) => (
              <span
                key={idx}
                className="text-xs text-white/60 uppercase tracking-wider"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Header Navigation */}
      <header className="sticky top-10 z-40 pt-6 pb-2 px-6">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center justify-between border border-white/10 bg-black/50 backdrop-blur-md px-6 py-4">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <Fuel className="h-5 w-5 text-indigo-400 transition-transform duration-300 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-indigo-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-lg font-bold tracking-widest uppercase text-white">
                REVVLY
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm text-white/60">
              <a
                href="#features"
                className="hover:text-white transition-colors uppercase tracking-wider"
              >
                [F] FEATURES
              </a>
              <a
                href="#stats"
                className="hover:text-white transition-colors uppercase tracking-wider"
              >
                [S] STATS
              </a>
              <a
                href="#about"
                className="hover:text-white transition-colors uppercase tracking-wider"
              >
                [A] ABOUT
              </a>
            </div>
            <SignInButton forceRedirectUrl="/vehicles">
              <Button
                variant="outline"
                size="sm"
                className="rounded-none border-white/20 bg-transparent hover:bg-white/10 hover:border-indigo-400/50 text-white uppercase tracking-wider text-xs px-4 py-2"
              >
                [S] SIGN_IN
              </Button>
            </SignInButton>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6">
        <div className="relative mx-auto max-w-7xl">
          {/* Terminal-style border */}
          <div className="border border-white/20 p-8 md:p-12 bg-black/30 backdrop-blur-sm relative">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-400" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-violet-400" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-400" />

            <div className="text-center">
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-indigo-400/30 bg-indigo-400/10 mb-8">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                <span className="text-xs uppercase tracking-wider text-indigo-400">
                  SYSTEM_ACTIVE
                </span>
              </div>

              {/* Main title */}
              <h1 className="mb-6 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight opacity-100">
                <span className="block mb-2 text-white">TRACK</span>
                <span className="block bg-linear-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                  FUEL
                </span>
                <span className="block text-white">EFFICIENCY</span>
              </h1>

              {/* Terminal prompt */}
              <div className="flex items-center justify-center gap-2 mb-8 text-white/60">
                <span className="text-sm">$</span>
                <span className="text-sm animate-blink">_</span>
                <span className="text-sm ml-2">OPTIMIZE_YOUR_DRIVE</span>
              </div>

              {/* Description */}
              <p className="mb-12 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed font-sans">
                Monitor efficiency, track expenses, and optimize your driving
                with{' '}
                <span className="text-indigo-400 font-mono">
                  intelligent insights
                </span>
                .
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SignInButton forceRedirectUrl="/vehicles">
                  <Button
                    size="lg"
                    className="rounded-none border-2 border-indigo-400 bg-indigo-400/10 hover:bg-indigo-400/20 text-white uppercase tracking-wider px-8 py-6 text-sm font-mono group"
                  >
                    START_TRACKING
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </SignInButton>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-none border-2 border-white/20 bg-transparent hover:bg-white/10 hover:border-white/40 text-white uppercase tracking-wider px-8 py-6 text-sm font-mono"
                >
                  VIEW_DOCS
                </Button>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm text-white/50">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-400" />
                  <span className="uppercase tracking-wider">1,000+ DRIVERS</span>
                </div>
                <div className="w-px h-4 bg-white/20" />
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-violet-400" />
                  <span className="uppercase tracking-wider">FREE_TO_START</span>
                </div>
                <div className="w-px h-4 bg-white/20" />
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-400 fill-current" />
                  <span className="uppercase tracking-wider">4.8/5 RATING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 relative">
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-violet-400/30 bg-violet-400/10 mb-6">
              <span className="text-xs uppercase tracking-wider text-violet-400">
                / FEATURES
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white uppercase tracking-tight">
              CORE_CAPABILITIES
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto font-sans">
              Everything you need to track and optimize fuel efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const colorClasses = {
                indigo: 'border-indigo-400/30 bg-indigo-400/5 hover:border-indigo-400/60 hover:bg-indigo-400/10 text-indigo-400',
                violet:
                  'border-violet-400/30 bg-violet-400/5 hover:border-violet-400/60 hover:bg-violet-400/10 text-violet-400',
                blue: 'border-blue-400/30 bg-blue-400/5 hover:border-blue-400/60 hover:bg-blue-400/10 text-blue-400',
              };

              return (
                <Card
                  key={idx}
                  className={`group border-2 rounded-none bg-black/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${colorClasses[feature.color as keyof typeof colorClasses]}`}
                >
                  <CardHeader className="p-6 relative">
                    {/* Background number */}
                    <div className="absolute top-4 right-4 text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                      {feature.number}
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 border-2 mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6" />
                    </div>

                    <CardTitle className="text-lg mb-3 uppercase tracking-wider font-mono">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-white/60 leading-relaxed font-sans">
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
      <section id="stats" className="py-32 px-6 relative">
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-blue-400/30 bg-blue-400/10 mb-6">
              <span className="text-xs uppercase tracking-wider text-blue-400">
                / STATISTICS
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white uppercase tracking-tight">
              TRACK_WHAT_MATTERS
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto font-sans">
              Detailed insights into your vehicle&apos;s performance and costs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const colorClasses = {
                indigo: 'border-indigo-400/30 bg-indigo-400/5 hover:border-indigo-400/60 text-indigo-400',
                violet:
                  'border-violet-400/30 bg-violet-400/5 hover:border-violet-400/60 text-violet-400',
                blue: 'border-blue-400/30 bg-blue-400/5 hover:border-blue-400/60 text-blue-400',
              };

              return (
                <Card
                  key={idx}
                  className={`text-center border-2 rounded-none bg-black/50 backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 ${colorClasses[stat.color as keyof typeof colorClasses]}`}
                >
                  <CardContent className="pt-8 pb-8">
                    <div className="text-5xl md:text-6xl font-bold mb-3 uppercase tracking-tight font-mono">
                      {stat.value}
                    </div>
                    <p className="text-xs uppercase tracking-wider text-white/60 font-mono">
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
      <section className="py-32 px-6 relative">
        <div className="relative mx-auto max-w-4xl">
          <div className="border border-white/20 p-12 bg-black/30 backdrop-blur-sm text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-indigo-400/30 bg-indigo-400/10 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-xs uppercase tracking-wider text-indigo-400">
                JOIN_COMMUNITY
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white uppercase tracking-tight">
              READY_TO_OPTIMIZE?
            </h2>
            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed font-sans">
              Join thousands of drivers who are saving money and improving their
              fuel economy.
            </p>
            <SignInButton forceRedirectUrl="/vehicles">
              <Button
                size="lg"
                className="rounded-none border-2 border-indigo-400 bg-indigo-400/10 hover:bg-indigo-400/20 text-white uppercase tracking-wider px-10 py-6 text-sm font-mono group"
              >
                START_TRACKING_TODAY
                <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 relative bg-black/50 backdrop-blur-sm">
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Fuel className="h-5 w-5 text-indigo-400" />
              <span className="font-bold text-lg uppercase tracking-wider text-white">
                REVVLY
              </span>
            </div>
            <div className="text-sm text-white/50 uppercase tracking-wider font-mono">
              © 2025 REVVLY. TRACK_SMARTER_DRIVE_BETTER.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
