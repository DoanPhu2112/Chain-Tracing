import React from 'react'
import Image from 'next/image'

import { useToast } from '@/hooks/use-toast'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import Timeline from './Timeline'

import { PortfolioPieChart } from '../../../../components/chart/portfolioChart/PortfolioPieChart'
import { HeuristicRule } from '@/types/transaction.interface'

import { cropNumber } from '@/helpers/numberSlice'
import { TornadoCashOverview } from './TornadoCashOverview'
import { MdExpandCircleDown } from 'react-icons/md'
import { TransactionModal } from './TransactionModal'
import { shortenAddress } from '@/util/address'
import { useAddressBalance } from '@/api/hooks/use-address-balance'
import { useAddressTornado } from '@/api/hooks/use-address-tornado-stat'
import empty from '@/app/images/nft-empty-light.svg'

const TabCard = ({ address, setCurrentTab }: { address: string; setCurrentTab: any }) => {
  const { toast } = useToast()

  const { data: balance } = useAddressBalance({ address })
  const { data: tornadoStat } = useAddressTornado({
    address,
  })

  const [expandedAddress, setExpandedAddress] = React.useState<string | null>(null)
  const [expandedType, setExpandedType] = React.useState<HeuristicRule | null>(null)

  const expandedAddressTransactions =
    tornadoStat.linkedAddress
      .filter((address) => address.address === expandedAddress)
      .map((txn) => txn.transactions)[0] || []

  const linkedAddresses = tornadoStat.linkedAddress.sort(function (a, b) {
    return Number(b.interaction_count) - Number(a.interaction_count)
  })

  const handleCloseSelectModal = () => {
    setExpandedAddress(null)
    setExpandedType(null)
  }

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
      <Tabs defaultValue="tornado" onValueChange={setCurrentTab}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="tornado">Tornado Analytic</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="portfolio">
          {balance.length && (
            <div className="grid flex-1 items-start gap-1 my-4 md:gap-4 xl:grid-cols-1 xl:w-3/5">
              <PortfolioPieChart chartData={balance} />
            </div>
          )}
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Porfolio</CardTitle>
              <CardDescription>Portfolio description for each asset</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-8">Token</TableHead>
                    <TableHead className="hidden sm:table-cell">Portfolio %</TableHead>
                    <TableHead className="hidden md:table-cell">Amount</TableHead>
                    <TableHead className="hidden md:table-cell text-right">
                      Value (in $)
                    </TableHead>
                    <TableHead className="text-right w-40">Price (Per Token)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balance &&
                    balance
                      .sort(function (a, b) {
                        return b.value - a.value
                      })
                      .map((asset) => (
                        <TableRow key={`${asset.chain}-${asset.token}`}>
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
                              <Image
                                className="rounded-full object-fill border-2"
                                alt={asset.token}
                                src={empty}
                                width={25}
                                height={25}
                              />
                            )}
                            {asset.token}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {cropNumber(asset.portfolioPercentage, 2, '%')}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {cropNumber(asset.amount, 2)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-right">
                            {cropNumber(asset.value, 2, '$')}
                          </TableCell>
                          <TableCell className="text-right">
                            {cropNumber(asset.price, 3, '$')}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tornado" className="flex flex-col gap-4">
          {tornadoStat && (
            <TornadoCashOverview
              withdraw={tornadoStat.withdraw.length}
              deposit={tornadoStat.deposit.length}
              linkedAddress={tornadoStat.linkedAddress}
            />
          )}
          <Tabs defaultValue="linked" className="w-full px-2">
            <TabsList className="w-full justify-start mb-4 bg-base-empty gap-2">
              <TabsTrigger
                value="linked"
                className="rounded-full border px-3 py-1 text-sm-semibold font-medium transition-colors bg-muted hover:bg-muted/80 data-[state=active]:bg-base-tent data-[state=active]:text-white"
              >
                Linked Address
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="rounded-full border px-3 py-1 text-sm-semibold font-medium transition-colors bg-muted hover:bg-muted/80 data-[state=active]:bg-base-tent data-[state=active]:text-white"
              >
                Transaction Timeline
              </TabsTrigger>
            </TabsList>

            {/* Linked Address Tab Content */}
            <TabsContent value="linked">
              <Card>
                <CardHeader className="px-7">
                  <CardTitle> Addresses</CardTitle>
                  <CardDescription>
                    {' '}
                    Showing list of clustered address to your target address
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-72 overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 z-10 ">
                        <TableRow>
                          <TableHead>Address</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Heuristic used
                          </TableHead>
                          <TableHead className="">Interaction Count</TableHead>
                          <TableHead className="hidden sm:table-cell">Tags</TableHead>
                          <TableHead className="text-right hidden sm:table-cell">
                            Expand
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="overflow-y-auto">
                        {linkedAddresses.length &&
                          linkedAddresses.map((transaction) => (
                            <TableRow key={transaction.address}>
                              <TableCell>
                                <div className="">
                                  {shortenAddress(transaction.address)}
                                  {/* <Tooltip>
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
                                </Tooltip> */}
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge
                                  size="md"
                                  variant={
                                    transaction.heuristic_used === HeuristicRule.LinkedETH
                                      ? 'outline'
                                      : 'gray'
                                  }
                                >
                                  {transaction.heuristic_used}
                                </Badge>
                              </TableCell>
                              <TableCell className="">
                                {transaction.transactions.length}
                              </TableCell>
                              <TableCell className=" hidden sm:table-cell">
                                <Badge
                                  variant={
                                    transaction.tag === HeuristicRule.LinkedETH
                                      ? 'secondary'
                                      : 'gray'
                                  }
                                >
                                  {transaction.tag}
                                </Badge>
                              </TableCell>
                              <TableCell className="flex items-center justify-end cursor-pointer">
                                <MdExpandCircleDown
                                  onClick={() => {
                                    setExpandedAddress(transaction.address)
                                    setExpandedType(transaction.heuristic_used)
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Activities</CardTitle>
                  <CardDescription>Portfolio description</CardDescription>
                </CardHeader>
                <CardContent>
                  <Timeline tornadoStat={tornadoStat} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {/* <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7"></CardHeader>
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
          </Card> */}
        </TabsContent>
        <TransactionModal
          address={address}
          isOpen={!!expandedAddress}
          onClose={handleCloseSelectModal}
          transactions={expandedAddressTransactions}
          type={expandedType}
        />
      </Tabs>
    </>
  )
}

export default TabCard
