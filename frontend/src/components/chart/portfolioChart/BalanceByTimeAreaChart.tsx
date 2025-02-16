'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const description =
  'An interactive area chart showing the balance of an Ethereum address over time'

const chartData = [
  { date: '2024-07-18', balance: Math.random() * 10000 - 50 },
  { date: '2024-07-19', balance: Math.random() * 10000 - 50 },
  { date: '2024-07-20', balance: Math.random() * 10000 - 50 },
  { date: '2024-07-21', balance: Math.random() * 10000 - 50 },
  { date: '2024-07-22', balance: Math.random() * 10000 - 50 },
  { date: '2024-07-23', balance: Math.random() * 10000 - 50 },
  { date: '2024-07-24', balance: Math.random() * 10000 - 50 },
  { date: '2024-07-25', balance: Math.random() * 10000 - 50 },
  { date: '2024-07-26', balance: Math.random() * 10000 - 50 },
  { date: '2024-07-27', balance: Math.random() * 10000 - 50 },
  { date: '2024-07-28', balance: Math.random() * 10000 - 50 },
  { date: '2024-07-29', balance: Math.random() * 10000 - 50 },
  { date: '2024-07-30', balance: Math.random() * 10000 - 50 },
  { date: '2024-07-31', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-01', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-02', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-03', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-04', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-05', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-06', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-07', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-08', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-09', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-10', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-11', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-12', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-13', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-14', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-15', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-16', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-17', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-18', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-19', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-20', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-21', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-22', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-23', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-24', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-25', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-26', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-27', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-28', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-29', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-30', balance: Math.random() * 10000 - 50 },
  { date: '2024-08-31', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-01', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-02', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-03', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-04', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-05', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-06', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-07', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-08', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-09', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-10', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-11', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-12', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-13', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-14', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-15', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-16', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-17', balance: Math.random() * 10000 - 50 },
  { date: '2024-09-18', balance: Math.random() * 10000 - 50 },
]

const chartConfig: ChartConfig = {
  visitors: {
    label: 'Visitors',
  },
  balance: {
    label: 'balance',
    color: 'hsl(var(--chart-5))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
  },
}

export function BalanceByTimeAreaChart() {
  const [timeRange, setTimeRange] = React.useState('90d')

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === '30d') {
      daysToSubtract = 30
    } else if (timeRange === '7d') {
      daysToSubtract = 7
    }
    now.setDate(now.getDate() - daysToSubtract)
    return date >= now
  })

  return (
    <Card>
      {/* <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Ethereum Balance Over Time</CardTitle>
          <CardDescription>
            Showing the balance of an Ethereum address for the selected time period
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-balance)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-balance)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="balance"
              type="monotone"
              fill="url(#fillBalance)"
              stroke="var(--color-balance)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent> */}
    </Card>
  )
}
