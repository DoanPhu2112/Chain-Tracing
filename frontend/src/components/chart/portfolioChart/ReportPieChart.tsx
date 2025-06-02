'use client'

import * as React from 'react'
import { Label, Pie, PieChart, Legend, Sector } from 'recharts'

import {
  Card,
  CardContent,
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
import { PieSectorDataItem } from 'recharts/types/polar/Pie'
import { cn } from '@/lib/utils'

export const description = 'A donut chart with text'

const colorList = [
  '#89AAFF',
  '#B2B0E6',
  '#ADD7D8',
  '#C4E1BC',
  '#F5C398',
  '#FFEB69',
  '#FFD7EF',
  '#B1C5FF',
  '#86C3C4',
  '#DE5F51',
  '#D2D2D2',
]

function SectorItem({ outerRadius = 0, ...props }: PieSectorDataItem) {
  return <Sector {...props} outerRadius={outerRadius + 5} />
}

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

export function ReportPortfolioPieChart({
  chartData,
  showLegend = true,
}: {
  chartData: PortfolioBalance[]
  showLegend?: boolean
}) {
  chartData = chartData.slice(0, 5).map((data) => ({
    ...data,
    value: data.value === 0 ? 0.1 : data.value,
  }))

  const [activeIndex, setActiveIndex] = React.useState<number>(-1)

  const chartDataWithColor = chartData.length
    ? chartData.map((data, index) => {
      return {
        fill: colorList[index],
        ...data,
        value: Number(data.value),
      }
    })
    : [
      {
        value: 1,
        token: 'ETH',
        chain: '0x1',
        price: 0,
        amount: 0,
        fill: '#D2D2D2',
        logo: null,
        portfolioPercentage: 99,
      },
      {
        value: 0,
        token: 'Other',
        chain: 'N/A',
        price: 0,
        amount: 0,
        fill: '#B2B0E6',
        logo: null,
        portfolioPercentage: 1,
      },
    ]

  const totalAmount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0)
  }, [])
  const topAsset = chartDataWithColor.reduce((prev, curr) =>
    curr.value > prev.value ? curr : prev
  )

  function handleMouseOut() {
    setActiveIndex(-1)
  }

  function handleMouseOver(event: { payload: { token: string } }) {
    const newActiveIndex = chartDataWithColor.findIndex(
      (item) => item.token === event.payload.token
    )
    setActiveIndex(newActiveIndex)
  }

  return (
    <ChartContainer config={chartConfig} className="mx-auto h-[300px] w-full">
      <PieChart className={cn("aspect-square", showLegend && 'h-full')}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent className="bg-white" hideLabel />}
        />
        <Pie
          data={chartDataWithColor}
          activeShape={SectorItem}
          activeIndex={activeIndex}
          dataKey="value"
          nameKey="token"
          cornerRadius={15}
          innerRadius={80}
          strokeWidth={1}
          onMouseOut={handleMouseOut}
          onMouseOver={handleMouseOver}
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
            className="bg-white"
          />
        </Pie>
        {showLegend && (
          <Legend
            content={<CustomLegend />}
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        )}
      </PieChart>
    </ChartContainer>
  )
}
