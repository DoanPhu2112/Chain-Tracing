'use client'

import React, { useEffect } from 'react'
import { ConfigProvider, DatePicker, TimePicker, Typography } from 'antd'
import type { DatePickerProps } from 'antd'
import en from 'antd/es/date-picker/locale/en_US'
import enUS from 'antd/es/locale/en_US'
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'

// ICONS
import { FileSearchIcon, ArrowRight } from 'lucide-react'
import { CalendarIcon } from '@radix-ui/react-icons'
import {
  EthereumCircleColorful,
  BnbCircleColorful,
  PolygonCircleColorful,
} from '@ant-design/web3-icons'
// COMPONENTS
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '../ui/separator'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import {
  getAddressBalance,
  getAddressTransactions,
  getAddressTxnsByRange,
} from '@/services/address'
import { setTransactions } from '@/lib/features/transactions/transactionsSlice'
import heu_4 from '@/mocks/heu_4.json'
dayjs.extend(buddhistEra)

const { RangePicker } = DatePicker
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY']
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

const defaultFromValue = dayjs().startOf('day').subtract(1, 'month')
const defaultToValue = dayjs().subtract(1, 'hour')

type InputCardProps = {
  setIsLoading: (arg0: boolean) => void
}
const InputCard = ({ setIsLoading }: InputCardProps) => {
  const dispatch = useDispatch()

  const [input, setInput] = React.useState<string>('')
  const [limit, setLimit] = React.useState<string>('10')
  const [chain, setChain] = React.useState<string>('')
  const [startDate, setStartDate] = React.useState<Date>(dayjs(defaultFromValue).toDate())
  const [endDate, setEndDate] = React.useState<Date>(dayjs(defaultToValue).toDate())

  const handleTrackAddress = async () => {
    if (input.length === 42) {
      setIsLoading(true)
      const transactions = await getAddressTxnsByRange(input, startDate, endDate, limit)
      console.log('Input Card Transactions', transactions)
      dispatch(setTransactions(transactions))
      setIsLoading(false)

      return
    }
    alert('Input length must equal 42')
  }

  function onOpenChange(open) {
    console.log('onOpenChange', open)
  }

  function onCalendarChange(dates) {
    setStartDate(new Date(dates[0].$d))
    setEndDate(new Date(dates[1].$d))
  }

  useEffect(() => {
    localStorage.setItem('limit', String(limit))
    localStorage.setItem('startDate', String(startDate.getTime()))
    localStorage.setItem('endDate', String(endDate.getTime()))
  }, [startDate, endDate, limit])

  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-0">
      <CardHeader className="px-7">
        <CardTitle>Investigate by TxHash / Address</CardTitle>
        <CardDescription>Recent orders from your store.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="gap-2 flex">
          <Input
            type="text"
            placeholder="Input target address hash"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="flex mt-2 justify-end">
          <div className="flex gap-2 items-center">
          Limit: <Input
            className='max-w-16'
              type="number"
              placeholder={limit}
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />

            <Select onValueChange={(value) => setChain(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ethereum" defaultValue="ethereum" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Chain</SelectLabel>
                  <SelectItem value="ethereum">
                    <EthereumCircleColorful className="mr-2" />
                    Ethereum
                  </SelectItem>
                  <SelectItem value="bnb-smartchain">
                    <BnbCircleColorful className="mr-2" />
                    BNB Smartchain
                  </SelectItem>
                  <SelectItem value="polygon">
                    <PolygonCircleColorful className="mr-2" />
                    Polygon
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* START DATE */}
            <RangePicker
              defaultValue={[defaultFromValue, defaultToValue]}
              format={dateFormat}
              onOpenChange={onOpenChange}
              onCalendarChange={onCalendarChange}
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
