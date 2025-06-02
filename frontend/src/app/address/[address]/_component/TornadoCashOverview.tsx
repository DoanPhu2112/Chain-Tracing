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
import { LinkedAddress } from '@/types/transaction.interface'

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
  deposit: number
  withdraw: number
  linkedAddress: LinkedAddress[]
}
export function TornadoCashOverview({ deposit, withdraw, linkedAddress }: Props) {
  const linkedETH = linkedAddress.filter(
    (address) => address.heuristic_used === 'Linked ETH'
  )
  const multiDenom = linkedAddress.filter(
    (address) => address.heuristic_used === 'Multi Denom'
  )
  return (
    <div className="space-y-4">
      {deposit === 0 && withdraw === 0 && (
        <p className="border-2 rounded-2xl bg-gray-100 py-2 px-3 whitespace-pre-line">
          <span className="text-gray-600">
            This address has no interacted with Tornado Cash
          </span>
        </p>
      )}
      <Card className="w-3/5 p-2">
        <CardHeader>
          <CardTitle>Tornado Cash Statistics</CardTitle>
          <CardDescription>
            Show Tornado Cash activities by your target address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <ul className="grid gap-3 mt-2">
              <li className="flex items-center">
                <span className="text-muted-foreground w-2/5 ">Deposit:</span>
                <span className="flex gap-1">
                  <span>{deposit} transactions</span>
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-muted-foreground w-2/5 ">Withdraw:</span>
                <span className="flex gap-1">
                  <span>{withdraw} transactions</span>
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-muted-foreground w-2/5 ">Multi-denom reveals:</span>
                <span className="flex gap-1">
                  <span>{multiDenom.length} addresses</span>
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-muted-foreground w-2/5 ">Linked ETH reveals:</span>
                <span className="flex gap-1">
                  <span>{linkedETH.length} addresses</span>
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
