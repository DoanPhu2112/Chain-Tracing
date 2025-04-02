'use client'

import * as React from 'react'
import { TrendingUp } from 'lucide-react'
import { Label, Pie, PieChart, Legend } from 'recharts'

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
import { PortfolioBalance } from '@/types/wallet.interface'
import { CustomLegend } from './CustomLegend'

export const description = 'A donut chart with text'
interface chartAsset {
  asset: string
  amount: number
  fill: string
}
const colorList = [
  "#89AAFF",
  "#B2B0E6",
  "#ADD7D8",
  "#C4E1BC",
  "#F5C398",
  "#FFEB69",
  "#FFD7EF",
  "#B1C5FF",
  "#86C3C4",
  "#DE5F51",
  "#D2D2D2",
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

export function PortfolioPieChart({ chartData }: { chartData: PortfolioBalance[] }) {
  chartData = chartData.slice(0, 5)
  const chartDataWithColor = chartData.map((data, index) => {
    return {
      fill: colorList[index],
      ...data,
      value: Number(data.value),
    }
  })
  const totalAmount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0)
  }, [])
  const topAsset = chartDataWithColor.reduce((prev, curr) =>
    curr.value > prev.value ? curr : prev
  )

  return (
    <Card className="h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Asset Allocation</CardTitle>
        {/* <CardDescription>Asset Allocation info</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto"
        >
          <PieChart className='aspect-square max-h-[250px]'>
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
            <Legend
            content={<CustomLegend/>}
              layout="vertical" 
              align="right" 
              verticalAlign="middle"
              // formatter={(value) => (
              //   <span className="text-sm text-muted-foreground">{value}</span>
              // )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Top Asset: <span className="text-primary">{topAsset.token}</span>{' '}
        </div>
        <div className="leading-none text-muted-foreground">
          Leading in portfolio weight
        </div>
      </CardFooter>
    </Card>
  )
}
