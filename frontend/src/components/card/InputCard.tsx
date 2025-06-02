'use client'

import React, { use, useEffect } from 'react'
import { DatePicker } from '@/components/datepicker/index'
import en from 'antd/es/date-picker/locale/en_US'
import enUS from 'antd/es/locale/en_US'
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'

// ICONS
import { FileSearchIcon } from 'lucide-react'
// COMPONENTS
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Separator } from '../ui/separator'
import { useDispatch, useSelector } from 'react-redux'
import { getAddressTxnsByRange } from '@/services/address/address'
import {
  addTransactions,
  setTransactions,
} from '@/lib/features/transactions/transactionsSlice'
import { TextField } from '../textfield'
import { RootState } from '@/lib/store'
import { setStartTime } from '@/lib/features/start-time/startTimeSlice'
import { toast } from '@/hooks/use-toast'
dayjs.extend(buddhistEra)

const dateFormat = 'DD/MM/YYYY'

// Component level locale
const buddhistLocale: typeof en = {
  ...en,
  lang: {
    ...en.lang,
    fieldDateFormat: 'BBBB-MM-DD',
    fieldDateTimeFormat: 'BBBB-MM-DD HH:mm:ss',
    yearFormat: 'BBBB',
    cellYearFormat: 'BBBB',
  },
}

// ConfigProvider level locale
const globalBuddhistLocale: typeof enUS = {
  ...enUS,
  DatePicker: {
    ...enUS.DatePicker!,
    lang: buddhistLocale.lang,
  },
}

const defaultToValue = dayjs().subtract(1, 'hour')

type InputCardProps = {
  setIsLoading: (arg0: boolean) => void
}
const InputCard = ({ setIsLoading }: InputCardProps) => {
  const dispatch = useDispatch()

  const targetNodeInfo = useSelector((state: RootState) => state.node)
  const localStartTime = useSelector((state: RootState) => state.startTime)

  const targetNode = targetNodeInfo.clickedNode
  const startTime = targetNodeInfo.occurredTime ?? localStartTime

  const [input, setInput] = React.useState<string>('')
  const [limit, setLimit] = React.useState('10')
  const [endDate, setEndDate] = React.useState<Date>(dayjs(defaultToValue).toDate())

  const handleTrackAddress = async () => {
    if (targetNode?.data.addressHash.length === 42) {
      setIsLoading(true)
      const transactions = await getAddressTxnsByRange(
        targetNode?.data.addressHash,
        new Date(startTime),
        endDate,
        limit
      )
      dispatch(addTransactions(transactions))
      setIsLoading(false)

      return
    }
    toast({
      title: 'Please enter a valid address',
      description: 'Address must be 42 characters long',
    })
  }

  function onStartDateChange(date: Date | undefined) {
    if (!date) {
      dispatch(setStartTime(startTime + 1))
      return
    }
    if (date.getTime() > startTime) {
      dispatch(setStartTime(date))
    } else {
      toast({
        title: 'Start tracing date must be after the incident occur',
      })
    }
  }

  function onEndDateChange(date: Date | undefined) {
    if (!date) {
      setEndDate(new Date())
      return
    }
    setEndDate(new Date(date))
  }

  useEffect(() => {
    localStorage.setItem('limit', String(limit))
  }, [limit])

  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-0">
      <CardHeader className="px-7">
        <CardTitle>Investigate by Address</CardTitle>
        <CardDescription>Enter address and start date here</CardDescription>
      </CardHeader>
      <CardContent className="gap-5 flex flex-col">
        <div className="flex gap-3">
          <TextField
            label={`Target address`}
            value={targetNode?.data.addressHash ?? input}
            isDisabled={!!targetNode?.data.addressHash}
            required={true}
            cls={{ label: 'text-label-sm-pri' }}
            placeholder="Input target address hash"
            onChange={setInput}
          />
          <TextField
            size="sm"
            label={`Limit`}
            value={limit}
            cls={{ label: 'text-label-sm-pri', wrapper: 'w-28' }}
            placeholder="Enter limit"
            onChange={setLimit}
          />
        </div>
        <div className="flex gap-3 w-full">
          <div className="space-y-1 w-1/2">
            <div className="text-label-sm-sec">
              <span>Start date</span>
              &nbsp;
              <span className="text-p-sm text-itr-dg-df">*</span>
            </div>
            <DatePicker
              cls={{
                trigger: 'px-3 py-2 hover:px-[11px] hover:py-[7px]',
                triggerOpen: 'px-[11px] py-[7px]',
                text: 'text-p-sm',
              }}
              onChange={(date) => {
                onStartDateChange(date)
              }}
              value={new Date(startTime).toISOString().split('T')[0]}
            />
          </div>
          <div className="space-y-1 w-1/2">
            <div className="text-label-sm-sec">
              <span>End date</span>
              &nbsp;
              <span className="text-p-sm text-itr-dg-df">*</span>
            </div>
            <DatePicker
              cls={{
                trigger: 'px-3 py-2 hover:px-[11px] hover:py-[7px]',
                triggerOpen: 'px-[11px] py-[7px]',
                text: 'text-p-sm',
              }}
              onChange={(date) => {
                onEndDateChange(date)
              }}
              value={endDate.toISOString().split('T')[0]}
            />
          </div>
        </div>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter className="gap-0.5 grid justify-end">
        <Button
          size="default"
          variant="outline"
          className=" col-span-1 h-12 w-48 gap-1"
          onClick={handleTrackAddress}
        >
          <FileSearchIcon className="h-3.5 w-3.5" />
          <span className="xl:whitespace-nowrap">Track</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default InputCard
