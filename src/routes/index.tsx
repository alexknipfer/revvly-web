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
// import { getAuth } from '@clerk/tanstack-react-start/server';
import { createFileRoute } from '@tanstack/react-router';
// import { createServerFn } from '@tanstack/react-start';
// import { getWebRequest } from '@tanstack/react-start/server';
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
} from 'lucide-react';

// const getCount = createServerFn({
//   method: 'GET',
// }).handler(async () => {
//   const request = getWebRequest();
//   const auth = await getAuth(request);
//   return Promise.resolve(2);
// });

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/[0.02] via-background to-accent/[0.02] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.08),transparent_60%)] -z-10" />

      <header className="sticky top-0 z-50 pt-6 pb-2 px-6 bg-background/5 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl">
          <nav className="bg-card/60 backdrop-blur-2xl border border-border/40 rounded-2xl px-6 py-4 shadow-xl shadow-black/20 ring-1 ring-primary/15">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-widest uppercase">
                  Revly
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
                  <a
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                  <a
                    href="#about"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
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
      <section className="relative pt-16 pb-16 px-6">
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mb-6 flex justify-center">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              <Star className="mr-1 h-3 w-3 fill-current" />
              New: Smart fuel efficiency insights
            </Badge>
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-6xl">
            Track your fuel.
            <br />
            <span className="text-primary">Master your efficiency.</span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
            Never lose track of your fuel consumption again. Monitor efficiency,
            track expenses, and optimize your driving with intelligent insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <SignedOut>
              <SignInButton>
                <Button size="lg" className="text-lg px-8">
                  Get Started Free
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="text-lg px-8">
                Go to Dashboard
              </Button>
            </SignedIn>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Learn More
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>1,000+ drivers</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Free to start</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span>4.8/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-card/[0.02]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Everything you need to track fuel
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive fuel tracking with powerful insights and analytics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Fuel className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Fuel Logging</CardTitle>
                <CardDescription>
                  Quickly log every fill-up with gallons, cost, odometer
                  reading, and location data.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Efficiency Analytics</CardTitle>
                <CardDescription>
                  Track MPG trends, identify patterns, and optimize your driving
                  for better fuel economy.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Expense Tracking</CardTitle>
                <CardDescription>
                  Monitor total fuel costs, average price per gallon, and
                  monthly spending patterns.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Service Scheduling</CardTitle>
                <CardDescription>
                  Log maintenance records and get reminders for upcoming service
                  intervals.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Smart Insights</CardTitle>
                <CardDescription>
                  Get intelligent recommendations to improve fuel efficiency and
                  reduce costs.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Gauge className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Real-time Dashboard</CardTitle>
                <CardDescription>
                  View all your vehicle metrics at a glance with an intuitive,
                  real-time dashboard.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 relative">
        <div className="mx-auto max-w-6xl text-center">
          <Badge variant="outline" className="mb-4">
            Analytics
          </Badge>
          <h2 className="text-3xl font-bold mb-4">Track what matters</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Get detailed insights into your vehicle's performance and costs
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-all duration-200">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">
                  Miles
                </div>
                <p className="text-sm text-muted-foreground">
                  Total distance driven
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-all duration-200">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">
                  Gallons
                </div>
                <p className="text-sm text-muted-foreground">
                  Total fuel consumed
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-all duration-200">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">MPG</div>
                <p className="text-sm text-muted-foreground">
                  Fuel efficiency tracking
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-all duration-200">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">
                  Costs
                </div>
                <p className="text-sm text-muted-foreground">
                  Total fuel expenses
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-linear-to-r from-primary/6 via-primary/3 to-primary/6" />
        <div className="relative mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to optimize your fuel efficiency?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of drivers who are saving money and improving their
            fuel economy.
          </p>
          <SignedOut>
            <SignInButton>
              <Button size="lg" className="text-lg px-8">
                Start Tracking Today
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Button size="lg" className="text-lg px-8">
              Go to Dashboard
            </Button>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12 px-6 relative">
        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Fuel className="h-6 w-6 text-primary" />
              <span className="font-semibold">FuelMe</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 FuelMe. Track smarter, drive better.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
