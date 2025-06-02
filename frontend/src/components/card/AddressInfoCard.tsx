import React from 'react'
import { NodeData } from '@/types/graph.interface'
import * as lucideReact from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as card from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { PortfolioBalance } from '@/types/wallet.interface'
import { PortfolioPieChart } from '../chart/portfolioChart/PortfolioPieChart'
import { ReportPortfolioPieChart } from '../chart/portfolioChart/ReportPieChart'
import { toast } from '@/hooks/use-toast'

const AddressInfoCard = ({
  nodeData,
  balances,
  label,
  loading,
  inReport = false,
}: {
  nodeData: NodeData
  balances: PortfolioBalance[] | undefined
  label?: string[]
  loading: boolean // Add loading state as a prop
  inReport?: boolean
}) => {
  const AddressData = nodeData.details
  const handleCopyAddress = () => {
    // Copy the address to the clipboard
    navigator.clipboard
      .writeText(AddressData.address)
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
    const etherscanUrl = `https://etherscan.io/address/${AddressData.address}`
    window.open(etherscanUrl, '_blank')
  }

  return (
    <card.Card
      className="overflow-hidden shadow-md w-full"
      x-chunk="dashboard-05-chunk-4"
    >
      <card.CardHeader className="flex flex-col items-start bg-muted/50">
        <div className="grid gap-0.5">
          <card.CardTitle className="group flex items-center gap-2 text-lg">
            {'Address ' + AddressData.address + ' Info'}
          </card.CardTitle>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => handleCopyAddress()}>
            <lucideReact.Copy className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" className="h-8 gap-1" onClick={handleViewOnEtherscan}>
            <lucideReact.ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </card.CardHeader>

      <card.CardContent className=" text-sm">
        <div className="flex  gap-2 items-center justify-center">
          {label && label.length > 0 ? (
            label.map((lbl, idx) => (
              <Badge key={idx} variant="outline" size="lg">
                {lbl}
              </Badge>
            ))
          ) : undefined}
        </div>

        {balances ? (
          <div className="flex flex-col items-start min-h-[300px]">
            <ReportPortfolioPieChart chartData={balances} showLegend={!inReport} />
            {/* <div className="flex flex-col gap-2 items-start w-3/4">
                {balances !== undefined &&
                  balances.map((balance, idx) => {
                    const value = balance.value
                    const symbol = balance.token
                    return (
                      <Badge key={idx} variant="outline" size="lg" className="flex gap-1">
                        {loading ? (
                          <Skeleton.Input
                            active
                            size="small"
                            style={{ height: 12, width: 60 }}
                          />
                        ) : (
                          <>
                            <span>{value}</span>
                            <span>{symbol}</span>
                          </>
                        )}
                      </Badge>
                    )
                  })}
              </div> */}
          </div>
        ) : null}
      </card.CardContent>

      <card.CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3 m-w-full">
        <div className="text-xs text-muted-foreground">
          Updated <time dateTime="2023-11-23">{new Date().toString()}</time>
        </div>
      </card.CardFooter>
    </card.Card>
  )
}

export default AddressInfoCard
