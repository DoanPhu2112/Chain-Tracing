import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { useToast } from '@/hooks/use-toast'
import portfolioMock from '@/mocks/portfolio.json'
// import transactions from '@/mocks/transactions.json'

import { File, ListFilter } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

import Activities from './Activities'

import { FreqBarChart } from '../chart/portfolioChart/FreqBarChart'
import { PortfolioPieChart } from '../chart/portfolioChart/PortfolioPieChart'
import { BalanceByTimeAreaChart } from '../chart/portfolioChart/BalanceByTimeAreaChart'
import { Transaction } from '@/types/transaction.interface'
import { PortfolioBalance } from '@/types/wallet.interface'

import { cropNumber } from '@/helpers/numberSlice'
import { AddressTxByMonth } from '../chart/AddressTxByMonth'

const TabCard = ({
  portfolio,
  transactions,
  loading,
}: {
  portfolio: PortfolioBalance[]
  transactions: Transaction[]
  loading: boolean
}) => {
  const { toast } = useToast()
  const handleCopy = (txnHash: string) => {
    navigator.clipboard
      .writeText(txnHash)
      .then(() => {
        toast({
          title: 'Transaction hash copied ',
          description: 'Transaction hash copied to clipboard!',
          duration: 2000,
        })
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
  }
  return (
    <>
      <Tabs defaultValue="portfolio">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Fulfilled</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
          </div>
        </div>
        <TabsContent value="portfolio">
          <div className="grid flex-1 items-start gap-1 my-4 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            <div className="flex flex-col h-full">
              <PortfolioPieChart chartData={portfolio} />
            </div>
            {/* <div className="flex flex-col h-full">
              <FreqBarChart chartData={portfolio} />
            </div> */}
            <div className="flex flex-col col-span-2 h-full xl:col-span-3">
              {/* <BalanceByTimeAreaChart /> */}
              <AddressTxByMonth/>
            </div>
          </div>
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Porfolio</CardTitle>
              <CardDescription>Portfolio description for each asset</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* <TableHead>Chain</TableHead> */}

                    <TableHead className="pl-8">Token</TableHead>
                    <TableHead className="hidden sm:table-cell">Portfolio %</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Price (Per Token)
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Amount</TableHead>
                    <TableHead className="text-right">Value (in $)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolio
                    .sort(function (a, b) {
                      return b.value - a.value
                    })
                    .map((asset, index) => (
                      <TableRow key={`${asset.chain}-${asset.token}`}>
                        {/* <TableCell>
                        <div className="font-medium">{asset.chain}</div>
                      </TableCell> */}
                        <TableCell className="flex gap-1 font-medium">
                          {asset.logo ? (
                            <Image
                              alt={asset.token}
                              src={asset.logo}
                              width={20}
                              height={20}
                            ></Image>
                          ) : (
                            <span className="ml-5" />
                          )}
                          {asset.token}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {cropNumber(asset.portfolioPercentage, 2)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {cropNumber(asset.price, 10)} $
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {cropNumber(asset.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {cropNumber(asset.value)} $
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Txn Hash</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={transaction.txnHash}>
                      <TableCell>
                        <div className="font-medium">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className="hover:bg-gray-200 p-1 rounded cursor-pointer"
                                onClick={() => handleCopy(transaction.txnHash)}
                              >
                                {transaction.txnHash.substring(0, 12)}...
                                {transaction.txnHash.substring(
                                  transaction.txnHash.length - 4
                                )}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="bg-gray-600">
                              <p>Copy tx hash</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {transaction.type}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          className="text-xs"
                          variant={
                            transaction.status === 'Pending' ? 'outline' : 'secondary'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {transaction.date}
                      </TableCell>
                      <TableCell className="text-right">
                        {transaction.amount}
                        {/* {cropNumber(parseInt(transaction.amount), 9)} */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Activities</CardTitle>
              <CardDescription>Portfolio description</CardDescription>
            </CardHeader>
            <CardContent>
              <Activities />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default TabCard
