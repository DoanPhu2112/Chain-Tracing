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
import {
  AccountType,
  ERC20Amount,
  TornadoStatResponse,
  Transaction,
  TransactionType,
} from '@/types/transaction.interface'
import { PortfolioBalance } from '@/types/wallet.interface'

import { cropNumber } from '@/helpers/numberSlice'
import { AddressTxByMonth } from '../chart/AddressTxByMonth'
const tornadoAddresses = [
  {
    address: '0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc',
    name: 'Tornado.Cash: 0.1 ETH',
    value: 0.1,
  },
  {
    address: '0x178169b423a011fff22b9e3f3abea13414ddd0f1',
    name: 'Tornado.Cash: 0.1 WBTC',
    value: 0.1,
  },
  {
    address: '0x47ce0c6ed5b0ce3d3a51fdb1c52dc66a7c3c2936',
    name: 'Tornado.Cash: 1 ETH',
    value: 1,
  },
  {
    address: '0x610b717796ad172b316836ac95a2ffad065ceab4',
    name: 'Tornado.Cash: 1 WBTC',
    value: 1,
  },
  {
    address: '0x4736dcf1b7a3d580672cce6e7c65cd5cc9cfba9d',
    name: 'Tornado.Cash: 1,000 USDC',
    value: 1000,
  },
  {
    address: '0xfd8610d20aa15b7b2e3be39b396a1bc3516c7144',
    name: 'Tornado.Cash: 1,000 DAI',
    value: 1000,
  },
  {
    address: '0xd96f2b1c14db8458374d9aca76e26c3d18364307',
    name: 'Tornado.Cash: 1,000 USDC',
    value: 1000,
  },
  {
    address: '0x0836222f2b2b24a3f36f98668ed8f0b38d1a872f',
    name: 'Tornado.Cash: 1,000 USDT',
    value: 1000,
  },
  {
    address: '0x910cbd523d972eb0a6f4cae4618ad62622b39dbf',
    name: 'Tornado.Cash: 10 ETH',
    value: 10,
  },
  {
    address: '0xbb93e510bbcd0b7beb5a853875f9ec60275cf498',
    name: 'Tornado.Cash: 10 WBTC',
    value: 10,
  },
  {
    address: '0xf60dd140cff0706bae9cd734ac3ae76ad9ebc32a',
    name: 'Tornado.Cash: 10,000 DAI',
    value: 10000,
  },
  {
    address: '0x07687e702b410fa43f4cb4af7fa097918ffd2730',
    name: 'Tornado.Cash: 10,000 DAI 2',
    value: 10000,
  },
  {
    address: '0xd691f27f38b395864ea86cfc7253969b409c362d',
    name: 'Tornado.Cash: 10,000 USDC',
    value: 10000,
  },
  {
    address: '0xf67721a2d8f736e75a49fdd7fad2e31d8676542a',
    name: 'Tornado.Cash: 10,000 USDT',
    value: 10000,
  },
  {
    address: '0xd4b88df4d29f5cedd6857912842cff3b20c8cfa3',
    name: 'Tornado.Cash: 100 DAI',
    value: 100,
  },
  {
    address: '0xa160cdab225685da1d56aa342ad8841c3b53f291',
    name: 'Tornado.Cash: 100 ETH',
    value: 100,
  },
  {
    address: '0x169ad27a470d064dede56a2d3ff727986b15d52b',
    name: 'Tornado.Cash: 100 USDT',
    value: 100,
  },
  {
    address: '0x23773e65ed146a459791799d01336db287f25334',
    name: 'Tornado.Cash: 100,000 DAI',
    value: 100000,
  },
  {
    address: '0x9ad122c22b14202b4490edaf288fdb3c7cb3ff5e',
    name: 'Tornado.Cash: 100,000 USDT',
    value: 100000,
  },
  {
    address: '0x22aaa7720ddd5388a3c0a3333430953c68f1849b',
    name: 'Tornado.Cash: 5,000 cDAI',
    value: 5000,
  },
  {
    address: '0xaeaac358560e11f52454d997aaff2c5731b6f8a6',
    name: 'Tornado.Cash: 5,000 cUSDC',
    value: 5000,
  },
  {
    address: '0xd21be7248e0197ee08e0c20d4a96debdac3d20af',
    name: 'Tornado.Cash: 5,000,000 cDAI',
    value: 5000000,
  },
  {
    address: '0xba214c1c1928a32bffe790263e38b4af9bfcd659',
    name: 'Tornado.Cash: 50,000 cDAI',
    value: 50000,
  },
  {
    address: '0x03893a7c7463ae47d46bc7f091665f1893656003',
    name: 'Tornado.Cash: 50,000 cDAI 2',
    value: 50000,
  },
  {
    address: '0x1356c899d8c9467c7f71c195612f8a395abf2f0a',
    name: 'Tornado.Cash: 50,000 cUSDC',
    value: 50000,
  },
  {
    address: '0xb1c8094b234dce6e03f10a5b673c1d8c69739a00',
    name: 'Tornado.Cash: 500,000 cDAI',
    value: 500000,
  },
  {
    address: '0x2717c5e28cf931547b621a5dddb772ab6a35b701',
    name: 'Tornado.Cash: 500,000 cDAI 2',
    value: 500000,
  },
  {
    address: '0xa60c772958a3ed56c1f15dd055ba37ac8e523a0d',
    name: 'Tornado.Cash: 500,000 cUSDC',
    value: 500000,
  },
  {
    address: '0x722122df12d4e14e13ac3b6895a86e84145b6967',
    name: 'Tornado.Cash: Proxy',
    value: null,
  },
  {
    address: '0x905b63fff465b9ffbf41dea908ceb12478ec7601',
    name: 'Tornado.Cash: Old Proxy',
    value: null,
  },
]

const TabCard = ({
  portfolio,
  transactions,
  loading,
  tornadoStat,
  setCurrentTab,
}: {
  portfolio: PortfolioBalance[]
  transactions: Transaction[]
  loading: boolean
  tornadoStat: TornadoStatResponse
  setCurrentTab: any
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

  const depositTxns: Transaction[] | undefined = tornadoStat
    ? tornadoStat.deposit.map((txn): Transaction => {
        const amount = tornadoAddresses.find(
          (tornadoAddress) => tornadoAddress.address === txn.to_address
        )
        return {
          chainId: '0x1',
          txnHash: txn.hash,
          from: {
            address: txn.from_address,
            type: [AccountType.EOA_ACTIVE],
          },
          to: {
            address: txn.to_address,
            address_entity_label: amount?.name,
            type: [AccountType.CONTRACT_NORMAL],
          },
          type: TransactionType.Sent,
          date: new Date(),
          summary: 'Deposit ',
          value: {
            sent: [
              {
                value: amount?.value?.toString() || '0',
                name: amount?.name || 'TC',
              } as ERC20Amount,
            ],
            receive: [],
          },
        }
      })
    : undefined

  const withdrawTxns: Transaction[] | undefined = tornadoStat
    ? tornadoStat.deposit.map((txn): Transaction => {
        const amount = tornadoAddresses.find(
          (tornadoAddress) => tornadoAddress.address === txn.to_address
        )
        return {
          chainId: '0x1',
          txnHash: txn.hash,
          from: {
            address: txn.from_address,
            type: [AccountType.EOA_ACTIVE],
          },
          to: {
            address: txn.to_address,
            address_entity_label: amount?.name,
            type: [AccountType.CONTRACT_NORMAL],
          },
          type: TransactionType.Sent,
          date: new Date(),
          summary: 'Withdraw ',
          value: {
            sent: [],
            receive: [
              {
                value: amount?.value?.toString() || '0',
                name: amount?.name || 'TC',
              } as ERC20Amount,
            ],
          },
        }
      })
    : undefined
  return (
    <>
      <Tabs defaultValue="tornado" onValueChange={setCurrentTab}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="tornado">Tornado Analytic</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
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
          <div className="grid flex-1 items-start gap-1 my-4 md:gap-4 xl:grid-cols-2">
            <div className="flex flex-col h-full">
              <PortfolioPieChart chartData={portfolio} />
            </div>
            {/* <div className="flex flex-col h-full">
              <FreqBarChart chartData={portfolio} />
            </div> */}
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
                    <TableHead className="hidden md:table-cell">Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Value (in $)</TableHead>
                    <TableHead className="text-right">
                      Price (Per Token)
                    </TableHead>
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
                            className="rounded-full object-fill"
                              alt={asset.token}
                              src={asset.logo}
                              width={25}
                              height={25}
                            ></Image>
                          ) : (
                            <span className="ml-5" />
                          )}
                          {asset.token}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {cropNumber(asset.portfolioPercentage, 2, "%")}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {cropNumber(asset.amount, 2)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {cropNumber(asset.value, 4 , "$")}
                        </TableCell>
                        <TableCell className="text-right">
                          {cropNumber(asset.price, 10, "$")}
                        </TableCell>

                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tornado">
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <div className="flex flex-col col-span-2 h-full xl:col-span-3">
                {/* <BalanceByTimeAreaChart /> */}
                {tornadoStat && (
                  <AddressTxByMonth
                    withdraw={tornadoStat.withdraw.length}
                    deposit={tornadoStat.deposit.length}
                    linkedAddress={tornadoStat.linkedTxns}
                    multiDenom={tornadoStat.multiDenom}
                  />
                )}
              </div>{' '}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Txn Hash</TableHead>
                    <TableHead className="hidden sm:table-cell">To</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="hidden sm:table-cell">Token</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depositTxns &&
                    depositTxns.map((transaction, index) => (
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
                          {transaction.to.address_entity_label}
                        </TableCell>

                        <TableCell className="text-right">
                          {transaction.value.sent[0].value}
                          {/* {cropNumber(parseInt(transaction.amount), 9)} */}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="outline">
                            ETH
                          </Badge>
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
