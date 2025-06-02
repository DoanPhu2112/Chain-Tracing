import { format } from 'date-fns/format'
const gmtRegex = /GMT../

// Hack: convert to UTC date but timezone is still in local
export const toMagicUtcDate = (date: Date) => {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60_000)
}

export const formatDate = (
  date: Date | string | number,
  localTz = true,
  pattern = 'dd-MM-yyyy HH:mm O'
) => {
  let _date = date
  if (!(_date instanceof Date)) {
    _date = new Date(date)
  }
  if (!_date) {
    return date.toString()
  }
  if (!localTz) {
    const utcDate = toMagicUtcDate(_date)
    let formattedDate = format(utcDate, pattern)
    if (pattern.includes('O')) {
      // include Timezone
      formattedDate = formattedDate.replace(gmtRegex, 'UTC')
    } else {
      formattedDate += ' UTC'
    }
    return formattedDate
  }
  return format(_date, pattern)
}
