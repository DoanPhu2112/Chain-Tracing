import React from 'react'
import { EdgeData } from '@/types/graph.interface'
import { Copy, Check, Trash, UsbIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/lib/store'
import { removeTransaction } from '@/lib/features/transactions/transactionsSlice'
import { shortSlice } from '@/helpers/hashSlice'
import { formatDate } from '@/util/date'
import { useAddressLabel } from '@/api/hooks/use-address-label'

// Reusable Address Row
const AddressRow = ({ label, address }: { label: string; address: string }) => {
  const { data: addressLabel, isError } = useAddressLabel({ address })
  const labels: string[] | null = addressLabel
    ? [
      ...(addressLabel.label ?? []),
      ...(addressLabel.researchLabel ? [addressLabel.researchLabel] : []),
    ].filter((item) => item !== '0x')
    : null
  console.log('labels', labels)
  return (
    <li className="flex gap-2">
      <span className="font-medium">{label}:</span>
      <div className="flex-1 break-all flex  gap-2 justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-p-md line-clamp-1 ">{shortSlice(address)}</span>
          {labels?.length
            ? labels.map((item, index) => (
              <Badge
                key={index}
                variant="gray"
                className="h-6 text-xs"
                onClick={() => {
                  if (item) {
                    window.open(item, '_blank')
                  }
                }}
              >
                {item}
              </Badge>
            ))
            : null}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="p-2"
            aria-label={`Copy ${label.toLowerCase()} address`}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </li>
  )
}

const TxInfoCard = ({ edgeData }: { edgeData: EdgeData }) => {
  console.log('edgeData', edgeData)
  const dispatch = useDispatch<AppDispatch>()

  const handleRemoveTransaction = (hash: string) => {
    dispatch(removeTransaction(hash))
  }
  const handleViewOnEtherscan = (txn: string) => {
    const etherscanUrl = `https://etherscan.io/tx/${txn}`
    window.open(etherscanUrl, '_blank')
  }
  const handleCopy = (txnHash: string) => {
    navigator.clipboard.writeText(txnHash).catch(console.error)
  }
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex items-start justify-between bg-muted/50">
        <CardTitle className="text-label-lg-sec font-sans">Transaction Info</CardTitle>
        <Badge variant={'gray'} size={'lg'}>
          {edgeData.details.summary}
        </Badge>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => handleRemoveTransaction(edgeData.id)}
            aria-label="Delete transaction"
          >
            <Trash className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => handleCopy(edgeData.id)}
            aria-label="Copy transaction hash"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => handleViewOnEtherscan(edgeData.id)}
            aria-label="Copy transaction hash"
          >
            <UsbIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 text-sm">
        <div className="space-y-3">
          <CardDescription className="w-full">
            <span className="font-medium w-1/6">Date: </span>{' '}
            <Badge variant={'outline'} size={'lg'}>
              {formatDate(edgeData.details.date)}
            </Badge>
          </CardDescription>
          <CardDescription className="w-full">
            <span className="font-medium w-1/6">Hash: </span>
            <span>{edgeData.id.slice(0, 18) + '...' + edgeData.id.slice(-18, -1)}</span>
          </CardDescription>

          <Separator />

          <ul className="space-y-2">
            <AddressRow label="From" address={edgeData.source} />
            <AddressRow label="To" address={edgeData.target} />
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default TxInfoCard
