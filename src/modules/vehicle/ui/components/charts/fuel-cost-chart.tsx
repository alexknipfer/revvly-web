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
  cost: {
    label: 'Cost',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

interface FuelCostChartProps {
  data: Array<{ date: string; cost: number }>;
}

function formatDateForChart(dateString: string): string {
  return dayjs(dateString).format('MMM D');
}

export function FuelCostChart({ data }: FuelCostChartProps) {
  const chartData = data
    .filter((entry) => entry.cost != null && !isNaN(entry.cost))
    .map((entry) => ({
      ...entry,
      dateDisplay: formatDateForChart(entry.date),
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fuel Cost</CardTitle>
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
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    indicator="line"
                    formatter={(value) => [
                      `$${Number(value).toFixed(2)}`,
                      'Cost',
                    ]}
                  />
                }
              />
              <Area
                dataKey="cost"
                type="natural"
                fill="var(--color-cost)"
                fillOpacity={0.4}
                stroke="var(--color-cost)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            No fuel cost data available for the last 12 months
          </div>
        )}
      </CardContent>
    </Card>
  );
}
