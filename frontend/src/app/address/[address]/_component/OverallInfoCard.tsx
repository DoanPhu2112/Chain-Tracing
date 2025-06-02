'use client'
import { useState, useEffect } from 'react'
import React from 'react'

import { Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '../../../../components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { shortenValue } from '@/util/address'
import { useAddressBalance } from '@/api/hooks/use-address-balance'
import { useAddressLabel } from '@/api/hooks/use-address-label'
import { LABEL, LABEL_TO_CONTENT, mapLabelToContent, mapLabelToDisplay } from '../common'
import { useAddressTornado } from '@/api/hooks/use-address-tornado-stat'
import { cn } from '@/lib/utils'

const blacklistKeywords = [
  'phish',
  'exploit',
  'hack',
  'attack',
  'rug pull',
  'scam',
  'blocked',
]

const OverallInfoCard = ({ address }: { address: string }) => {
  const { data: portfolio } = useAddressBalance({ address })
  const { data: labels } = useAddressLabel({ address })
  const { data: tornadoStat } = useAddressTornado({
    address,
  })
  const ensLabels = labels?.label
  const researchLabel = labels?.researchLabel && mapLabelToDisplay(labels.researchLabel)
  const text = labels?.researchLabel && mapLabelToContent(labels?.researchLabel)
  const interacted = labels?.tornadoCashInteracted
  const [addressEther, setAddressEther] = useState<{
    amount: number
    value: number
    price: number
  }>()

  const totalValueInUSD = portfolio.reduce((acc, item) => {
    const value = item.value || item.amount * item.price
    return acc + value
  }, 0)

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
    const etherscanUrl = `https://etherscan.io/address/${address}`
    window.open(etherscanUrl, '_blank')
  }

  useEffect(() => {
    setAddressEther(portfolio.find((item) => item.token === 'Ether'))
  }, [portfolio])

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-md mb-4" x-chunk="dashboard-05-chunk-4">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex flex-col gap-2 text-lg">
              Overall Info
            </CardTitle>
            <CardDescription className="break-all pr-6 flex flex-col gap-2">
              <div className="flex gap-x-2">
                {ensLabels?.map((label, index) => {
                  return (
                    <Badge
                      key={index}
                      variant={'gray'}
                      size="md"
                      className="text-gray-700 border-gray-700 items-center align-middle h-6 gap-1 shadow-sm hover:bg-gray-100 hover:text-gray-600 p-1 rounded cursor-pointer"
                    >
                      {label}
                    </Badge>
                  )
                })}
                {researchLabel && (
                  <Badge
                    variant={'destructive'}
                    size="md"
                    className="text-gray-700 border-gray-700 items-center align-middle h-6 gap-1 shadow-sm hover:bg-gray-100 hover:text-gray-600 p-1 rounded cursor-pointer"
                  >
                    {researchLabel}
                  </Badge>
                )}
                {interacted && (
                  <Badge
                    variant={'destructive'}
                    size="md"
                    className="text-gray-700 border-gray-700 items-center align-middle h-6 gap-1 shadow-sm hover:bg-gray-100 hover:text-gray-600 p-1 rounded cursor-pointer"
                  >
                    Tornado Cash user
                  </Badge>
                )}
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
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1"
              onClick={handleViewOnEtherscan}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            {/* <div className="font-semibold"></div> */}

            <ul className="grid gap-3 mt-2">
              <li className="flex items-center">
                <span className="text-lg-medium w-1/3 ">Reveal Score: </span>
                <Badge variant={"outline"} size={'lg'} className={cn("flex gap-1 text-lg-medium font-mono", tornadoStat?.score > 0.8 ? "text-neutral-900" : "text-neutral-800")}>
                  {tornadoStat?.score ?? 0}
                </Badge>
              </li>
              <li className="flex items-center">
                <span className="text-muted-foreground w-1/3">ETH Balance:</span>
                {addressEther && (
                  <div className="flex items-center gap-1">
                    <span>{shortenValue(addressEther.amount)}</span>
                    <Badge variant="gray" size="sm" className="text-label-xs-sec">
                      ETH
                    </Badge>
                  </div>
                )}
              </li>
              <li className="flex items-center">
                <span className="text-muted-foreground w-1/3 ">Total value in USD:</span>
                <span className="flex gap-1">
                  {addressEther && <span>{shortenValue(totalValueInUSD) + ' $'}</span>}
                </span>
              </li>

            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3 m-w-full">
          <div className="text-xs text-muted-foreground">
            Updated <time>{new Date().toDateString()}</time>
          </div>
        </CardFooter>
      </Card>
      {(text || interacted) && (
        <p className="border-2 rounded-2xl bg-gray-100 py-2 px-3 whitespace-pre-line">
          <span className="text-red-600">Warning: </span>
          {text && <>{text}</>}
          {interacted && <>{LABEL_TO_CONTENT.tornadoInteracted}</>}
        </p>
      )}
    </div>
  )
}

export default OverallInfoCard
