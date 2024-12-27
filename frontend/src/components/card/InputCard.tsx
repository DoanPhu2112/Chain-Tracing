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
import { getAddressBalance, getAddressTransactions } from '@/services/address'
import { setTransactions } from '@/lib/features/transactions/transactionsSlice'

dayjs.extend(buddhistEra)

const { Title } = Typography

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

const defaultValue = dayjs('2024-01-01')

const InputCard = () => {
  const dispatch = useDispatch();

  const [input, setInput] = React.useState<string>('')
  const [chain, setChain] = React.useState<string>('')
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()

  const onChange: DatePickerProps['onChange'] = (_, dateStr) => {
    console.log('onChange:', dateStr)
  }

  const handleTrackAddress = async () => {
    if (input.length === 42) {
      const transactions = await getAddressTransactions(input);
      console.log("Input Card Transactions", transactions)
      dispatch(setTransactions(transactions));
      return;
    }
    alert("Input length must equal 42")
  }

  useEffect(() => {
    console.log('Input:', input)
    console.log('Chain:', chain)
    console.log('Start Date:', startDate)
    console.log('End Date:', endDate)
  }, [input, chain, startDate, endDate])

  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-0">
      <CardHeader className="px-7">
        <CardTitle>Investigate by TxHash / Address</CardTitle>
        <CardDescription>Recent orders from your store.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="gap-2 flex">
          <Select onValueChange={(value) => setChain(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a chain" />
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
          <Input
            type="text"
            placeholder="Input an address hash"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="flex mt-2 justify-end">
          <div className="flex gap-2 items-center">
            {/* START DATE */}
            <DatePicker
              variant="outlined"
              defaultValue={defaultValue}
              showTime
              locale={buddhistLocale}
              onChange={onChange}
            />
            <ArrowRight className="h-3.5 w-3.5" />
            {/* END DATE */}
            <DatePicker
              className="border-slate-300 shadow-sm bg-red-200"
              variant="outlined"
              defaultValue={defaultValue}
              showTime
              locale={buddhistLocale}
              onChange={onChange}
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
