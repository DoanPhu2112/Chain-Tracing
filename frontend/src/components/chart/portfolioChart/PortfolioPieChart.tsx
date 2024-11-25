'use client'

import * as React from 'react'
import { TrendingUp } from 'lucide-react'
import { Label, Pie, PieChart } from 'recharts'
import { PortfolioBalance } from '@/types/TODO: remove wallet.interface'

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

export const description = 'A donut chart with text'
interface chartAsset {
  asset: string,
  amount: number,
  fill: string,
}
const colorList = [
  'var(--color-solana)',
  'var(--color-ethereum)',

  'var(--color-polygon)',
  'var(--color-bitcoin)',
  'var(--color-other)'
]
const chartDataMock = [
  {
    asset: 'ABC',
    amount: Math.random() * 1000,
    fill: 'var(--color-ethereum)',
  },
  {
    asset: 'Bitcoin',
    amount: Math.random() * 100,
    fill: 'var(--color-bitcoin)',
  },
  {
    asset: 'Polygon',
    amount: Math.random() * 100,
    fill: 'var(--color-polygon)',
  },
  {
    asset: 'Solana',
    amount: Math.random() * 100,
    fill: 'var(--color-solana)',
  },
  {
    asset: 'Other',
    amount: Math.random() * 100,
    fill: 'var(--color-other)',
  },
]

const chartConfig = {
  amount: {
    label: 'Value $',
  },
  ethereum: {
    label: 'Ethereum',
    color: 'hsl(var(--chart-5))',
  },
  bitcoin: {
    label: 'Bitcoin',
    color: 'hsl(var(--chart-4))',
  },
  polygon: {
    label: 'Polygon',
    color: 'hsl(var(--chart-3))',
  },
  solana: {
    label: 'Solana',
    color: 'hsl(var(--chart-2))',
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function PortfolioPieChart({chartData}: { chartData: PortfolioBalance[]}) {
  chartData = chartData.slice(0,5);
  const chartDataWithColor = chartData.map((data, index) => {
    return {
      fill: colorList[index],
      ...data,
      value: Number(data.value),
    }
  })
  const totalAmount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + Number(curr.value), 0)
  }, [])
  console.log("chartData", chartDataWithColor)
  return (
    <Card className="h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>Asset Allocation info</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartDataWithColor}
              dataKey="value"
              nameKey="token"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          {totalAmount.toLocaleString()}$
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Assets
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          TODO: Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Assets</div>
      </CardFooter>
    </Card>
  )
}
