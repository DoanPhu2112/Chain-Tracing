import {
  DatePicker as ArkDatePicker,
  type DatePickerValueChangeDetails,
  Portal,
  parseDate,
} from '@ark-ui/react'
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendar2Line,
  RiCloseCircleFill,
  RiInformationFill,
} from '@remixicon/react'

import { cn } from '@/lib/utils'
import { formatDate } from '@/util/date'

import { IconButton } from '../button'
import { Divider } from '../Divider'
import styles from './DatePicker.module.scss'

type Props = {
  value: string | undefined
  label?: string
  isError?: boolean
  errorString?: string
  cls?: {
    trigger?: string
    triggerOpen?: string
    text?: string
  }
  positioning?: ArkDatePicker.RootProps['positioning']
  name?: string
  hasError?: boolean
  onChange: (data: Date | undefined) => void
  isDateUnavailable?: ArkDatePicker.RootProps['isDateUnavailable']
}

export function DatePicker({
  label,
  name,
  value,
  errorString,
  cls,
  positioning,
  hasError,
  onChange,
  isDateUnavailable,
}: Props) {
  const handleChangeDate = ({ valueAsString }: DatePickerValueChangeDetails) => {
    if (valueAsString.length === 0) {
      onChange(undefined)
      return
    }
    onChange(new Date(valueAsString[0]))
    return
  }

  return (
    <ArkDatePicker.Root
      isDateUnavailable={isDateUnavailable}
      key={value ?? 'default-value'}
      name={name}
      positioning={{ sameWidth: true, ...(positioning ?? {}) }}
      selectionMode="single"
      value={value ? [parseDate(value)] : undefined}
      onValueChange={handleChangeDate}
    >
      <ArkDatePicker.Context>
        {(api) => {
          return (
            <div className="relative space-y-1">
              {!!label && (
                <ArkDatePicker.Label className="block text-label-sm-pri text-itr-tentPri-df">
                  {label}
                </ArkDatePicker.Label>
              )}
              <ArkDatePicker.Control>
                <ArkDatePicker.Trigger
                  className={cn(
                    'flex w-full items-center space-x-2 rounded-full outline-none',
                    api.open
                      ? 'border-2 px-[15px] py-[9px] ' +
                          (errorString || hasError
                            ? 'border-bd-dg-df'
                            : 'border-bd-pri-hv')
                      : 'border px-4 py-2.5 hover:border-2 hover:px-[15px] hover:py-[9px] ' +
                          (errorString || hasError
                            ? 'border-bd-dg-df hover:border-bd-dg-df'
                            : 'border-bd-pri-sub hover:border-bd-pri-hv'),
                    api.open ? cls?.triggerOpen : cls?.trigger
                  )}
                >
                  <span
                    className={cn(
                      'line-clamp-1 flex-1 text-left',
                      api.valueAsDate[0] ? 'text-itr-tentPri-df' : 'text-itr-tentPri-dis',
                      cls?.text
                    )}
                  >
                    {api.valueAsDate[0]
                      ? formatDate(api.valueAsDate[0], true, 'yyyy/MM/dd')
                      : 'Select date'}
                  </span>
                  <ArkDatePicker.ClearTrigger asChild>
                    <RiCloseCircleFill className="size-4 shrink-0 text-itr-tentPri-sub hover:text-itr-tentPri-df" />
                  </ArkDatePicker.ClearTrigger>
                  <RiCalendar2Line className="size-5 shrink-0" />
                </ArkDatePicker.Trigger>
              </ArkDatePicker.Control>
              {!!errorString && (
                <div className="flex items-start space-x-1">
                  <RiInformationFill className="mt-px size-4 shrink-0 text-itr-tone-dgSub" />
                  <span className="flex-1 text-p-sm text-itr-tone-dg">{errorString}</span>
                </div>
              )}
              <Portal>
                <ArkDatePicker.Positioner className="!z-[51] !-mt-1">
                  <ArkDatePicker.Content className="max-h-[360px] w-full space-y-4 overflow-y-auto rounded-xl border border-bd-pri-hv bg-base-bg p-4 shadow-md outline-none">
                    <ArkDatePicker.View className="space-y-4" view="day">
                      <ArkDatePicker.ViewControl className="flex items-center space-x-2">
                        <ArkDatePicker.PrevTrigger asChild>
                          <IconButton
                            icon={<RiArrowLeftSLine />}
                            size="sm"
                            variant="ghost"
                          />
                        </ArkDatePicker.PrevTrigger>
                        <ArkDatePicker.ViewTrigger className="flex-1 text-center text-label-sm-pri text-itr-tentPri-df">
                          <ArkDatePicker.RangeText />
                        </ArkDatePicker.ViewTrigger>
                        <ArkDatePicker.NextTrigger asChild>
                          <IconButton
                            icon={<RiArrowRightSLine />}
                            size="sm"
                            variant="ghost"
                          />
                        </ArkDatePicker.NextTrigger>
                      </ArkDatePicker.ViewControl>
                      <Divider />
                      <ArkDatePicker.Table className="w-full">
                        <ArkDatePicker.TableHead className="w-full">
                          <ArkDatePicker.TableRow>
                            {api.weekDays.map((weekDay, id) => (
                              <ArkDatePicker.TableHeader
                                className="p-1.5 text-label-sm-pri text-itr-tentPri-df"
                                key={id}
                              >
                                {weekDay.short.substring(0, 2)}
                              </ArkDatePicker.TableHeader>
                            ))}
                          </ArkDatePicker.TableRow>
                        </ArkDatePicker.TableHead>
                        <ArkDatePicker.TableBody className="w-full">
                          {api.weeks.map((week, id) => (
                            <ArkDatePicker.TableRow className="" key={id}>
                              {week.map((day, id) => (
                                <ArkDatePicker.TableCell key={id} value={day}>
                                  <ArkDatePicker.TableCellTrigger
                                    className={cn(
                                      'w-full rounded-[4px] p-1.5 text-center text-label-sm-pri text-itr-tentPri-df hover:bg-sf-pri-sub',
                                      styles['cell']
                                    )}
                                  >
                                    {day.day}
                                  </ArkDatePicker.TableCellTrigger>
                                </ArkDatePicker.TableCell>
                              ))}
                            </ArkDatePicker.TableRow>
                          ))}
                        </ArkDatePicker.TableBody>
                      </ArkDatePicker.Table>
                    </ArkDatePicker.View>
                    <ArkDatePicker.View className="space-y-4" view="month">
                      <ArkDatePicker.ViewControl className="flex items-center space-x-2">
                        <ArkDatePicker.PrevTrigger asChild>
                          <IconButton
                            icon={<RiArrowLeftSLine />}
                            size="sm"
                            variant="ghost"
                          />
                        </ArkDatePicker.PrevTrigger>
                        <ArkDatePicker.ViewTrigger className="flex-1 text-center text-label-sm-pri text-itr-tentPri-df">
                          <ArkDatePicker.RangeText />
                        </ArkDatePicker.ViewTrigger>
                        <ArkDatePicker.NextTrigger asChild>
                          <IconButton
                            icon={<RiArrowRightSLine />}
                            size="sm"
                            variant="ghost"
                          />
                        </ArkDatePicker.NextTrigger>
                      </ArkDatePicker.ViewControl>
                      <Divider />
                      <ArkDatePicker.Table className="w-full">
                        <ArkDatePicker.TableBody className="w-full">
                          {api
                            .getMonthsGrid({ columns: 4, format: 'short' })
                            .map((months, id) => (
                              <ArkDatePicker.TableRow
                                className="grid grid-cols-4 gap-2"
                                key={id}
                              >
                                {months.map((month, id) => (
                                  <ArkDatePicker.TableCell key={id} value={month.value}>
                                    <ArkDatePicker.TableCellTrigger className="w-full cursor-pointer rounded-[4px] p-2 text-center text-label-sm-pri text-itr-tentPri-df hover:bg-sf-pri-sub">
                                      {month.label}
                                    </ArkDatePicker.TableCellTrigger>
                                  </ArkDatePicker.TableCell>
                                ))}
                              </ArkDatePicker.TableRow>
                            ))}
                        </ArkDatePicker.TableBody>
                      </ArkDatePicker.Table>
                    </ArkDatePicker.View>
                    <ArkDatePicker.View className="space-y-4" view="year">
                      <ArkDatePicker.ViewControl className="flex items-center space-x-2">
                        <ArkDatePicker.PrevTrigger asChild>
                          <IconButton
                            icon={<RiArrowLeftSLine />}
                            size="sm"
                            variant="ghost"
                          />
                        </ArkDatePicker.PrevTrigger>
                        <ArkDatePicker.ViewTrigger className="flex-1 text-center text-label-sm-pri text-itr-tentPri-df">
                          <ArkDatePicker.RangeText />
                        </ArkDatePicker.ViewTrigger>
                        <ArkDatePicker.NextTrigger asChild>
                          <IconButton
                            icon={<RiArrowRightSLine />}
                            size="sm"
                            variant="ghost"
                          />
                        </ArkDatePicker.NextTrigger>
                      </ArkDatePicker.ViewControl>
                      <Divider />
                      <ArkDatePicker.Table className="w-full">
                        <ArkDatePicker.TableBody className="w-full">
                          {api.getYearsGrid({ columns: 4 }).map((years, id) => (
                            <ArkDatePicker.TableRow
                              className="grid grid-cols-4 gap-2"
                              key={id}
                            >
                              {years.map((year, id) => (
                                <ArkDatePicker.TableCell key={id} value={year.value}>
                                  <ArkDatePicker.TableCellTrigger className="w-full cursor-pointer rounded-[4px] p-2 text-center text-label-sm-pri text-itr-tentPri-df hover:bg-sf-pri-sub">
                                    {year.label}
                                  </ArkDatePicker.TableCellTrigger>
                                </ArkDatePicker.TableCell>
                              ))}
                            </ArkDatePicker.TableRow>
                          ))}
                        </ArkDatePicker.TableBody>
                      </ArkDatePicker.Table>
                    </ArkDatePicker.View>
                  </ArkDatePicker.Content>
                </ArkDatePicker.Positioner>
              </Portal>
            </div>
          )
        }}
      </ArkDatePicker.Context>
    </ArkDatePicker.Root>
  )
}
