'use client'

import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

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

import '../chartStyle.css'
import { TornadoStat } from '@/types/transaction.interface'

export const description = 'An interactive bar chart showing transaction types per month'

const chartTornado = [
  { date: '2024-04-01', deposit: 122, withdraw: 70, linked_address: 30 },
  { date: '2024-04-02', deposit: 60, withdraw: 20, linked_address: 17 },
  { date: '2024-04-03', deposit: 90, withdraw: 50, linked_address: 27 },
  { date: '2024-04-04', deposit: 120, withdraw: 70, linked_address: 52 },
  { date: '2024-04-05', deposit: 180, withdraw: 90, linked_address: 103 },
]
const chartConfig = {
  deposit: {
    label: 'Deposit',
    color: 'hsl(var(--chart-3))',
  },
  withdraw: {
    label: 'Withdraw',
    color: 'hsl(var(--chart-4))',
  },
  linked_address: {
    label: 'Linked Address',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig

function groupTransactionByDate(tornadoStat: TornadoStat) {
  const dateMap = new Map<
    string,
    { deposit: number; withdraw: number }
  >()
  for (const txn of tornadoStat.deposit) {
    const date = new Date(Number(txn.timestamp)).toISOString().split('T')[0]
    if (!dateMap.has(date)) {
      dateMap.set(date, { deposit: 0, withdraw: 0 })
    }
    dateMap.get(date)!.deposit++
  }
  for (const txn of tornadoStat.withdraw) {
    const date = new Date(Number(txn.timestamp)).toISOString().split('T')[0]
    if (!dateMap.has(date)) {
      dateMap.set(date, { deposit: 0, withdraw: 0 })
    }
    dateMap.get(date)!.withdraw++
  }
  const result = Array.from(dateMap.entries()).map(([date, counts]) => ({
    date: date,
    deposit: counts.deposit,
    withdraw: counts.withdraw,
  }))
  return result
}

export function BarChartTx({ tornadoStat }: { tornadoStat: TornadoStat }) {
  const chartData = React.useMemo(() => {
    return groupTransactionByDate(tornadoStat)
  }, [tornadoStat])
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('deposit')

  const totals = React.useMemo(
    () => ({
      deposit: tornadoStat.deposit.length,
      withdraw: tornadoStat.withdraw.length,
      // linked_address: tornadoStat.linkedAddress.length,
    }),
    []
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Transactions</CardTitle>
          <CardDescription>
            Showing Tornado Cash transactions
          </CardDescription>
        </div>
        <div className="flex">
          {['deposit', 'withdraw'].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {totals[chart as keyof typeof totals].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
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
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  // nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                />
              }
            />
            {Object.keys(chartConfig).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={chartConfig[key as keyof typeof chartConfig].color}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
