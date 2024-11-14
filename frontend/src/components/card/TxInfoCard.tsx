
import React from 'react'
import Image from 'next/image'
import { EdgeData } from '@/types/graph.interface'

import { ChevronLeft, ChevronRight, Copy, MoreVertical, Check, Trash } from 'lucide-react'
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
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

import { BigNumber, ethers } from 'ethers'

// REDUX
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/lib/store'
import { removeTransaction } from '@/lib/features/transactions/transactionsSlice'
import { shortSlice, longSlice } from '@/helpers/hashSlice'

const TxInfoCard = ({ edgeData }: { edgeData: EdgeData }) => {
  console.log('🚀 ~ TxInfoCard ~ edgeData:', edgeData)
  const dispatch = useDispatch<AppDispatch>()
  const transactions = useSelector((state: RootState) => state.transactions.transactions)

  const valueInEth = ethers.utils.formatEther(BigNumber.from(edgeData.details.value)) // Convert value from wei to ETH
  const gasPriceInGwei = ethers.utils.formatUnits(
    BigNumber.from(edgeData.details.gasPrice),
    'gwei'
  ) // Convert gas price from wei to Gwei
  const gasPriceInEth = ethers.utils.formatEther(
    BigNumber.from(edgeData.details.gasPrice)
  ) // Convert gas price from wei to ETH
  const transactionFeeInEth = ethers.utils.formatEther(
    BigNumber.from(edgeData.details.gasPrice).mul(edgeData.details.gasLimit)
  ) // Transaction fee in ETH

  const handleRemoveTransaction = (hash: string) => {
    dispatch(removeTransaction(hash))
    console.log('dispatch remove transaction')
  }

  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Transaction Info
          </CardTitle>
          <CardDescription>Tx Hash:</CardDescription>
          <CardDescription className="break-all pr-6">{`${edgeData.id.slice(0, 18)}...${edgeData.id.slice(-18)}`}</CardDescription>
          {/* <CardDescription className="break-all pr-6">{edgeData.id}</CardDescription> */}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1"
            onClick={() => handleRemoveTransaction(edgeData.id)}
          >
            <Trash className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" className="h-8 gap-1">
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
              <DropdownMenuItem>View on Etherscan</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Trash</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-6 text-sm">
        {/* <div className="grid gap-3">
          <div className="font-semibold">Transaction Action</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1 text-muted-foreground">
                Transfer 0.015629749291605018 ETH ($40.67) by beaverbuild to
                0x876528533158c07C1b87291C35F84104cd64Ec01
              </dt>
            </div>
          </dl>
        </div>
        <Separator className="my-4" /> */}
        <div className="grid gap-3">
          <div className="font-semibold">Transaction Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center">
              <span className="text-muted-foreground w-1/4 ">Status:</span>
              <span>
                <Badge
                  variant="outline"
                  className="text-green-500 border-green-500 items-center align-middle h-6 gap-1 shadow-sm"
                >
                  <Check className="h-3 w-3" />
                  Success
                </Badge>
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-muted-foreground w-1/4 ">Block:</span>
              <span className="flex gap-1">
                <span>{edgeData.details.blockNumber}</span>
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-muted-foreground w-1/4 ">Blockhash:</span>
              <span className="flex gap-1">
                <span>{shortSlice(edgeData.details.blockHash)}</span>
              </span>
            </li>

            <li className="flex items-center">
              <span className="text-muted-foreground w-1/4 ">Value:</span>
              <span className="flex gap-1">
                <span>{valueInEth}</span>
                <span>ETH</span>
              </span>
            </li>

            <li className="flex items-center">
              <span className="text-muted-foreground w-1/4 ">Transaction Fee:</span>
              <span className="flex gap-1">
                <span>{transactionFeeInEth}</span>
                <span>ETH</span>
              </span>
            </li>

            <li className="flex items-center">
              <span className="text-muted-foreground w-1/4 ">Gas Price:</span>
              <span className="flex gap-1">
                <span>{gasPriceInGwei}</span>
                <span>Gwei</span>
              </span>
            </li>
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3\2">
            <li className="flex items-center font-bold">
              <span className="text-muted-foreground w-1/4">From:</span>
              <span>
                <Badge
                  variant="outline"
                  className="items-center align-middle h-6 gap-1 shadow-sm"
                >
                  unknown
                </Badge>
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-muted-foreground w-1/4"></span>
              <span className="text-muted-foreground break-all flex items-center gap-2">
                {longSlice(edgeData.source)}
                <span className="">
                  <Button variant="outline" className="p-2">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </span>
              </span>
            </li>
            <div className="my-2" />
            <li className="flex items-center font-bold">
              <span className="text-muted-foreground w-1/4">To:</span>
              <span>
                <Badge
                  variant="outline"
                  className="items-center align-middle h-6 gap-1 shadow-sm"
                >
                  unknown
                </Badge>
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-muted-foreground w-1/4"></span>
              <span className="text-muted-foreground break-all flex items-center gap-2">
                {longSlice(edgeData.target)}
                <span className="">
                  <Button variant="outline" className="p-2">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </span>
              </span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        {/* <div className="grid gap-3">
          <ul className="grid gap-3">
            <li className="flex items-center">
              <span className="font-bold">Value:</span>
              <span className="ml-2">{valueInEth} ETH</span>
            </li>

            <li className="flex items-center">
              <span className="font-bold">Transaction Fee:</span>
              <span className="ml-2">{transactionFeeInEth} ETH</span>
            </li>

            <li className="flex items-center">
              <span className="font-bold">Gas Price:</span>
              <span className="ml-2">
                {gasPriceInGwei} Gwei ({gasPriceInEth} ETH)
              </span>
            </li>
          </ul>
        </div> */}
      </CardContent>

      {/* <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
      </CardFooter> */}
    </Card>
  )
}

export default TxInfoCard
