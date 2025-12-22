import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/tanstack-react-start';
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
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Enhanced animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/[0.02] via-background to-accent/[0.02] -z-10" />
      <div
        className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.08),transparent_60%)] -z-10 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99,102,241,0.08), transparent 60%)`,
        }}
      />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.06),transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.04),transparent_70%)] -z-10" />

      {/* Animated gradient orbs - subtle and harmonious */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-500/3 rounded-full blur-3xl -z-10 animate-pulse-slow" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-violet-500/3 rounded-full blur-3xl -z-10 animate-pulse-slow delay-1000" />
      <div className="fixed top-1/2 right-0 w-80 h-80 bg-blue-500/3 rounded-full blur-3xl -z-10 animate-pulse-slow delay-2000" />

      <header className="sticky top-0 z-50 pt-6 pb-2 px-6 bg-background/5 backdrop-blur-sm transition-all duration-300">
        <div className="mx-auto max-w-6xl">
          <nav className="bg-card/70 backdrop-blur-2xl border border-border/50 rounded-2xl px-6 py-4 shadow-xl shadow-black/20 ring-1 ring-primary/20 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 group">
                <div className="relative">
                  <Fuel className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
                  <Sparkles className="h-3 w-3 text-primary absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                </div>
                <span className="text-xl font-bold tracking-widest uppercase bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Revvly
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
                  <a
                    href="#features"
                    className="hover:text-foreground transition-all duration-200 relative group"
                  >
                    Features
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-200 group-hover:w-full" />
                  </a>
                  <a
                    href="#pricing"
                    className="hover:text-foreground transition-all duration-200 relative group"
                  >
                    Pricing
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-200 group-hover:w-full" />
                  </a>
                  <a
                    href="#about"
                    className="hover:text-foreground transition-all duration-200 relative group"
                  >
                    About
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-200 group-hover:w-full" />
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton forceRedirectUrl="/dashboard/manage-vehicles">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                  </SignedOut>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6">
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mb-8 flex justify-center">
            <Badge
              variant="secondary"
              className="px-4 py-1.5 text-sm border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Zap className="mr-2 h-3.5 w-3.5 fill-current text-primary animate-pulse" />
              New: Smart fuel efficiency insights
            </Badge>
          </div>
          <h1 className="mb-8 text-6xl font-bold tracking-tight lg:text-7xl xl:text-8xl">
            <span className="block mb-2 bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
              Track your fuel.
            </span>
            <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              Master your efficiency.
            </span>
          </h1>
          <p className="mb-10 text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Never lose track of your fuel consumption again. Monitor efficiency,
            track expenses, and optimize your driving with{' '}
            <span className="text-indigo-400 font-semibold">
              intelligent insights
            </span>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <SignedOut>
              <SignInButton>
                <Button
                  size="lg"
                  className="text-lg px-10 py-6 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 hover:from-indigo-600 hover:via-violet-600 hover:to-indigo-500 shadow-lg hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
                >
                  Get Started Free
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button
                size="lg"
                className="text-lg px-10 py-6 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 hover:from-indigo-600 hover:via-violet-600 hover:to-indigo-500 shadow-lg hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
              >
                Go to Dashboard
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </SignedIn>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-6 rounded-full border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-indigo-500/40 transition-all duration-300 hover:scale-105">
              <Users className="h-4 w-4 text-indigo-400" />
              <span className="font-medium">1,000+ drivers</span>
            </div>
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-emerald-500/40 transition-all duration-300 hover:scale-105">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span className="font-medium">Free to start</span>
            </div>
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-amber-500/40 transition-all duration-300 hover:scale-105">
              <Star className="h-4 w-4 text-amber-400 fill-current" />
              <span className="font-medium">4.8/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-card/[0.02]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1.5 border-primary/30 bg-primary/5"
            >
              Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Everything you need to track fuel
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive fuel tracking with powerful insights and analytics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <Card className="group hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 hover:border-indigo-500/50 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-2">
              <CardHeader className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/25 via-indigo-500/15 to-indigo-500/8 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Fuel className="h-7 w-7 text-indigo-400" />
                </div>
                <CardTitle className="text-xl mb-3 group-hover:text-indigo-400 transition-colors duration-300">
                  Fuel Logging
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Quickly log every fill-up with gallons, cost, odometer
                  reading, and location data.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="group hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-300 hover:border-violet-500/50 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-2">
              <CardHeader className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500/25 via-violet-500/15 to-violet-500/8 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <BarChart3 className="h-7 w-7 text-violet-400" />
                </div>
                <CardTitle className="text-xl mb-3 group-hover:text-violet-400 transition-colors duration-300">
                  Efficiency Analytics
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Track MPG trends, identify patterns, and optimize your driving
                  for better fuel economy.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:border-blue-500/50 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-2">
              <CardHeader className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/25 via-blue-500/15 to-blue-500/8 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <DollarSign className="h-7 w-7 text-blue-400" />
                </div>
                <CardTitle className="text-xl mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  Expense Tracking
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Monitor total fuel costs, average price per gallon, and
                  monthly spending patterns.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="group hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 hover:border-indigo-500/50 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-2">
              <CardHeader className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/25 via-indigo-500/15 to-indigo-500/8 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Calendar className="h-7 w-7 text-indigo-400" />
                </div>
                <CardTitle className="text-xl mb-3 group-hover:text-indigo-400 transition-colors duration-300">
                  Service Scheduling
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Log maintenance records and get reminders for upcoming service
                  intervals.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="group hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-300 hover:border-violet-500/50 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-2">
              <CardHeader className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500/25 via-violet-500/15 to-violet-500/8 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <TrendingUp className="h-7 w-7 text-violet-400" />
                </div>
                <CardTitle className="text-xl mb-3 group-hover:text-violet-400 transition-colors duration-300">
                  Smart Insights
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Get intelligent recommendations to improve fuel efficiency and
                  reduce costs.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:border-blue-500/50 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-2">
              <CardHeader className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/25 via-blue-500/15 to-blue-500/8 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Gauge className="h-7 w-7 text-blue-400" />
                </div>
                <CardTitle className="text-xl mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  Real-time Dashboard
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  View all your vehicle metrics at a glance with an intuitive,
                  real-time dashboard.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6 relative">
        <div className="mx-auto max-w-6xl text-center">
          <Badge
            variant="outline"
            className="mb-6 px-4 py-1.5 border-primary/30 bg-primary/5"
          >
            Analytics
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Track what matters
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-16 max-w-2xl mx-auto">
            Get detailed insights into your vehicle&apos;s performance and costs
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <Card className="text-center hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-indigo-500/50 group">
              <CardContent className="pt-8 pb-8">
                <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-indigo-400 to-indigo-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  Miles
                </div>
                <p className="text-sm lg:text-base text-muted-foreground font-medium">
                  Total distance driven
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-violet-500/50 group">
              <CardContent className="pt-8 pb-8">
                <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-violet-400 to-violet-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  Gallons
                </div>
                <p className="text-sm lg:text-base text-muted-foreground font-medium">
                  Total fuel consumed
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-blue-500/50 group">
              <CardContent className="pt-8 pb-8">
                <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-blue-400 to-blue-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  MPG
                </div>
                <p className="text-sm lg:text-base text-muted-foreground font-medium">
                  Fuel efficiency tracking
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-indigo-500/50 group">
              <CardContent className="pt-8 pb-8">
                <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-indigo-400 to-indigo-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  Costs
                </div>
                <p className="text-sm lg:text-base text-muted-foreground font-medium">
                  Total fuel expenses
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/8 via-violet-500/6 to-indigo-500/8" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(139,92,246,0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-block mb-6">
            <Badge
              variant="secondary"
              className="px-4 py-1.5 text-sm border-indigo-500/30 bg-indigo-500/10"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5 text-indigo-400" />
              Join the community
            </Badge>
          </div>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Ready to optimize your fuel efficiency?
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of drivers who are saving money and improving their
            fuel economy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <SignInButton>
                <Button
                  size="lg"
                  className="text-lg px-10 py-6 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 hover:from-indigo-600 hover:via-violet-600 hover:to-indigo-500 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
                >
                  Start Tracking Today
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button
                size="lg"
                className="text-lg px-10 py-6 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 hover:from-indigo-600 hover:via-violet-600 hover:to-indigo-500 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
              >
                Go to Dashboard
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 px-6 relative bg-card/30 backdrop-blur-sm">
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 group">
              <Fuel className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-semibold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Revvly
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Revvly. Track smarter, drive better.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
