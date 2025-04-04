'use client'
import { useState, useEffect } from 'react'
import React from 'react'
import { NodeData } from '@/types/graph.interface'

import { Copy, MoreVertical, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { longSlice, shortSlice } from '@/helpers/hashSlice'
import { useToast } from '@/hooks/use-toast'
import { PortfolioBalance } from '@/types/wallet.interface'
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'
import { Skeleton } from 'antd'
import { shortenValue } from '@/util/address'
import { TornadoStatResponse } from '@/types/transaction.interface'

const blacklistKeywords = [
  'phish',
  'exploit',
  'hack',
  'attack',
  'rug pull',
  'scam',
  'blocked',
]
function scoreReveal(tornadoStat: TornadoStatResponse) {
  const numberClusteredMultiDenom = tornadoStat.multiDenom.length
  const numberClusteredLinkedAddress = tornadoStat.linkedTxns.length
  const totalTCTxn = tornadoStat.deposit.length + tornadoStat.withdraw.length
  return (numberClusteredLinkedAddress + numberClusteredMultiDenom) / totalTCTxn
}
const OverallInfoCard = ({
  labels,
  portfolio,
  address,
  loading,
  tornadoStat,
}: {
  labels: string[] | undefined
  portfolio: PortfolioBalance[]
  address: string
  loading: boolean
  tornadoStat: TornadoStatResponse
}) => {
  console.log(labels)
  const [addressEther, setAddressEther] = useState<{
    amount: number
    value: number
    price: number
  }>()
  const { toast } = useToast()
  const handleCopyAddress = () => {
    // Copy the address to the clipboard
    navigator.clipboard
      .writeText(address)
      .then(() => {
        toast({
          title: 'Address copied',
          description: 'The address has been successfully copied to the clipboard.',
          duration: 2000,
        })
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
  }
  const handleViewOnEtherscan = () => {
    // Construct the Etherscan URL for the address
    const etherscanUrl = `https://etherscan.io/address/${address}`

    // Open the Etherscan URL in a new tab
    window.open(etherscanUrl, '_blank')
  }

  useEffect(() => {
    setAddressEther(portfolio.find((item) => item.token === 'Ether'))
  }, [portfolio])

  return (
    <Card className="overflow-hidden shadow-md mb-4" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex flex-col gap-2 text-lg">
            Overall Info
            <div className="flex gap-2"></div>
          </CardTitle>
          <CardDescription className="break-all pr-6 flex flex-col gap-2">
            {/* <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Badge
                    variant="outline"
                    size="md"
                    className="text-gray-700 border-gray-700 items-center align-middle h-6 gap-1 shadow-sm hover:bg-gray-100 hover:text-gray-600 p-1 rounded cursor-pointer"
                  >
                    {shortSlice(address)}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="ml-24 bg-gray-600">
                <p>{address}</p>
              </TooltipContent>
            </Tooltip> */}
            <div className="flex gap-x-2">
              {labels?.map((label, index) => {
                const isBlacklisted = blacklistKeywords.some((keyword) =>
                  label.toLowerCase().includes(keyword)
                )
                return (
                  <Badge
                    key={index}
                    variant={isBlacklisted ? 'destructive' : 'gray'}
                    size="md"
                    className="text-gray-700 border-gray-700 items-center align-middle h-6 gap-1 shadow-sm hover:bg-gray-100 hover:text-gray-600 p-1 rounded cursor-pointer"
                  >
                    {label}
                  </Badge>
                )
              })}
            </div>
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1"
            onClick={handleCopyAddress}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewOnEtherscan()}>
                View on Etherscan
              </DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Trash</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          {/* <div className="font-semibold"></div> */}

          <ul className="grid gap-3 mt-2">
            <li className="flex items-center">
              <span className="text-muted-foreground w-1/3 ">ETH Balance:</span>
              {addressEther && (
                <span>
                  {shortenValue(String(addressEther.value || addressEther.amount))} ETH
                </span>
              )}
            </li>
            <li className="flex items-center">
              <span className="text-muted-foreground w-1/3 ">ETH Value:</span>
              <span className="flex gap-1">
                {addressEther && (
                  <span>
                    {shortenValue(String(addressEther.price * addressEther.value)) + '$'}
                  </span>
                )}
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-muted-foreground w-1/3 ">Reveal Score: </span>
              <span className="flex gap-1">
                {tornadoStat && <span>{100 * scoreReveal(tornadoStat)}%</span>}
              </span>
            </li>
          </ul>
        </div>
        {/* <Separator className="my-4" />
        <div className="grid gap-3">
          <ul className="grid gap-3">
            <li className="flex items-center">
              <span className="text-muted-foreground w-1/4">Value:</span>
              <span className="flex gap-1">
                <span> 123</span>
                <span>ETH</span>
              </span>
            </li>
            <li className="flex">
              <span className="text-muted-foreground w-1/4">Transaction Fee:</span>
              <span className="grid">
                <span>0.000028440984222 ETH $0.07</span>
              </span>
            </li>
            <li className="flex">
              <span className="text-muted-foreground w-1/4">Gas Price:</span>
              <span className="grid">
                <span className="grid">1.354332582 Gwei</span>
                <span className="opacity-50">(0.000000001354332582 ETH)</span>
              </span>
            </li>
          </ul>
        </div> */}
      </CardContent>

      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3 m-w-full">
        <div className="text-xs text-muted-foreground">
          {/* {JSON.stringify(nodeData, null, 2)} */}
          Updated <time dateTime="2023-11-23">{new Date().toDateString()}</time>
        </div>
      </CardFooter>
    </Card>
  )
}

export default OverallInfoCard
