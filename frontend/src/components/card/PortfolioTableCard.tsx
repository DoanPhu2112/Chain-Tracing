import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import portfolio from '@/mocks/portfolio.json'
import transactions from '@/mocks/transactions.json'

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

const PortfolioTableCard = () => {
  return (
    <>
      <Tabs defaultValue="portfolio">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
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
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Porfolio</CardTitle>
              <CardDescription>Portfolio description</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chain</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead className="hidden sm:table-cell">Portfolio %</TableHead>
                    <TableHead className="hidden md:table-cell">Price</TableHead>
                    <TableHead className="hidden md:table-cell">Amount</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolio.map((asset, index) => (
                    <TableRow key={`${asset.chain}-${asset.token}`}>
                      <TableCell>
                        <div className="font-medium">{asset.chain}</div>
                      </TableCell>
                      <TableCell>{asset.token}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {asset.portfolioPercentage}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {asset.price}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {asset.amount}
                      </TableCell>
                      <TableCell className="text-right">{asset.value}</TableCell>
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
              <CardDescription>Rencent transactions</CardDescription>
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
                          {transaction.txnHash.substring(0, 12)}...
                          {transaction.txnHash.substring(transaction.txnHash.length - 4)}
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
                      <TableCell className="text-right">{transaction.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default PortfolioTableCard
