'use client'

import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

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

// import './chartStyle.css'

export const description = 'A bar chart showing transactions per month'

const chartData = [
  { month: 'January', transactions: 186 },
  { month: 'February', transactions: 305 },
  { month: 'March', transactions: 237 },
  { month: 'April', transactions: 73 },
  { month: 'May', transactions: 209 },
  { month: 'June', transactions: 214 },
]

const chartConfig = {
  transactions: {
    label: 'Transactions',
    color: 'hsl(var(--chart-1))',
  },
  label: {
    color: 'hsl(var(--background))',
  },
} satisfies ChartConfig

type Props = {
  deposit: number,
  withdraw:number,
  multiDenom: any[],
  linkedAddress: any[]
}
export function AddressTxByMonth({deposit, withdraw, multiDenom, linkedAddress}: Props) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Tornado Cash Statistics</CardTitle>
        <CardDescription>Show Tornado Cash transactions by your input address</CardDescription>
      </CardHeader>
      <CardContent>
      <div className="grid gap-3">
          {/* <div className="font-semibold"></div> */}

          <ul className="grid gap-3 mt-2">
            <li className="flex items-center">
              <span className="text-muted-foreground w-1/3 ">Deposit:</span>
              <span className="flex gap-1">
                <span>{deposit} txs</span>
                {/* {addressEther && <span>{addressEther.value} $</span>} */}
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-muted-foreground w-1/3 ">Withdraw:</span>
              <span className="flex gap-1">
                <span>{withdraw} txs</span>
                {/* {addressEther && <span>{addressEther.value} $</span>} */}
              </span>
            </li>
            {/* <li className="flex items-center">
              <span className="text-muted-foreground w-1/3 ">Address match reveals:</span>
              <span className="flex gap-1">
                <span>{3} addresses </span>
                {/* {addressEther && <span>{addressEther.value} $</span>} */}
              {/* </span>
            </li> */}
            <li className="flex items-center">
              <span className="text-muted-foreground w-1/3 ">Multi-denom reveals:</span>
              <span className="flex gap-1">
                <span>{multiDenom.length} address</span>
                {/* {addressEther && <span>{addressEther.value} $</span>} */}
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-muted-foreground w-1/3 ">Linked Address Reveals:</span>
              <span className="flex gap-1">
                <span>{linkedAddress.length} addresses</span>
                {/* {addressEther && <span>{addressEther.value} $</span>} */}
              </span>
            </li>
            {/* <li className="flex">
              <span className="text-muted-foreground w-1/4 ">Timestamp:</span>
              <span className="grid">
                <span className="grid">2 days ago </span>
                <span>Aug-13-2024 12:09:59 PM UTC</span>
              </span>
            </li> */}
          </ul>
        </div>
      </CardContent>
        {/* <ChartContainer config={chartConfig}> 
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="transactions" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="transactions"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="transactions"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total transactions for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}
