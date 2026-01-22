import { Suspense } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import dayjs from 'dayjs';
import { Loader } from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { hasDefined } from '@/lib/utils';
import { fuelEntriesOptions } from '@/api/query-options';
import { getRouteApi } from '@tanstack/react-router';

const chartConfig = {
  mpg: {
    label: 'MPG',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

function formatDateForChart(dateString: string): string {
  return dayjs(dateString).format('MMM D');
}

export function MpgTrendChart() {
  return (
    <Suspense fallback={<MpgTrendChartSkeleton />}>
      <Chart />
    </Suspense>
  );
}

function Chart() {
  const { vehicleId } = routeApi.useParams();
  const { data: fuelEntries } = useSuspenseQuery(fuelEntriesOptions(vehicleId));

  // Group entries by date and average MPG for same-day entries
  const groupedByDate = fuelEntries
    .filter(hasDefined('mpg'))
    .reduce<
      Record<string, { date: string; mpg: number; count: number }>
    >((acc, entry) => {
      const dateKey = dayjs(entry.date).startOf('day').toISOString();
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: entry.date,
          mpg: 0,
          count: 0,
        };
      }
      acc[dateKey].mpg += entry.mpg;
      acc[dateKey].count += 1;

      return acc;
    }, {});

  const chartData = Object.values(groupedByDate)
    .map((entry) => ({
      date: entry.date,
      mpg: entry.mpg / entry.count,
    }))
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
    .map((entry) => ({
      ...entry,
      dateDisplay: formatDateForChart(entry.date),
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>MPG Trend</CardTitle>
        <CardDescription>Last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 0,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="dateDisplay"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                width={40}
                allowDecimals
                tickFormatter={(value) => value.toFixed(1)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    indicator="line"
                    formatter={(value) => `${Number(value).toFixed(1)} MPG`}
                  />
                }
              />
              <Area
                dataKey="mpg"
                type="natural"
                fill="var(--color-mpg)"
                fillOpacity={0.4}
                stroke="var(--color-mpg)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            No MPG data available for the last 12 months
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MpgTrendChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>MPG Trend</CardTitle>
        <CardDescription>Last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          <Loader className="size-4 animate-spin" />
        </div>
      </CardContent>
    </Card>
  );
}
