'use client'

import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A mixed bar chart'

const chartData = [
  { currency: 'ETH', volume: 500, fill: 'var(--color-eth)' },
  { currency: 'BTC', volume: 350, fill: 'var(--color-btc)' },
  { currency: 'USDT', volume: 275, fill: 'var(--color-usdt)' },
  { currency: 'BNB', volume: 220, fill: 'var(--color-bnb)' },
  { currency: 'SOL', volume: 180, fill: 'var(--color-sol)' },
]

const chartConfig = {
  volume: {
    label: 'Volume',
  },
  eth: {
    label: 'Ethereum (ETH)',
    color: 'hsl(var(--chart-1))',
  },
  btc: {
    label: 'Bitcoin (BTC)',
    color: 'hsl(var(--chart-2))',
  },
  usdt: {
    label: 'Tether (USDT)',
    color: 'hsl(var(--chart-3))',
  },
  bnb: {
    label: 'Binance Coin (BNB)',
    color: 'hsl(var(--chart-4))',
  },
  sol: {
    label: 'Solana (SOL)',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig

export function FreqBarChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Bar Chart - Most Sent & Received Currencies</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="currency"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value.toLowerCase() as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="volume" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="volume" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total transaction volumes for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
