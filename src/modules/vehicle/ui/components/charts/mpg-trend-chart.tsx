import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import dayjs from 'dayjs';

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

const chartConfig = {
  mpg: {
    label: 'MPG',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

interface MpgTrendChartProps {
  data: Array<{ date: string; mpg: number }>;
}

function formatDateForChart(dateString: string): string {
  return dayjs(dateString).format('MMM D');
}

export function MpgTrendChart({ data }: MpgTrendChartProps) {
  const chartData = data
    .filter((entry) => entry.mpg != null && !isNaN(entry.mpg))
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
                    formatter={(value) => [`${value} MPG`, 'MPG']}
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
