import fromExponential from 'from-exponential'

export function formatNumberWithGroupedZeroes(
  value_: `${number}` | number | string,
  options: Omit<Intl.NumberFormatOptions, 'roundingMode' | 'minimumFractionDigits'> = {}
) {
  const value = value_ as `${number}`
  const defaultIntl = new Intl.NumberFormat('en-US', {
    roundingMode: 'floor',
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
    ...options,
  })
  let parts = defaultIntl.formatToParts(value)

  if (
    parseInt(parts.find((it) => it.type === 'integer')?.value ?? '0') !== 0 ||
    parseInt(parts.find((it) => it.type === 'fraction')?.value ?? '0') !== 0
  ) {
    return defaultIntl.format(value)
  }

  const stringifiedNumber = fromExponential(value) as `${number}`
  const groupedZeroesIntl = new Intl.NumberFormat('en-US', {
    ...options,
    maximumFractionDigits: stringifiedNumber.length,
    minimumFractionDigits: 0,
    roundingMode: 'floor',
  })

  parts = groupedZeroesIntl.formatToParts(stringifiedNumber)
  const fractionPart = parts.find((part) => part.type === 'fraction')?.value
  const decimalPart = parts.find((part) => part.type === 'decimal')?.value

  if (!fractionPart?.startsWith('000') || !decimalPart) {
    const newIntl = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 6,
      minimumFractionDigits: 0,
      roundingMode: 'floor',
      ...options,
    })
    return newIntl.format(stringifiedNumber)
  }

  let zeroesCount = 0
  let index = 0
  while (index < fractionPart.length) {
    const c = fractionPart[index]
    if (c !== '0') {
      break
    }

    index++
    zeroesCount++
  }

  return parts
    .map((part) => {
      if (part.type === 'fraction') {
        return `0${replaceWithSubscript(zeroesCount)}${removeTrailingZeroes(part.value.slice(index, index + (options.maximumFractionDigits ?? 3)))}`
      }

      return part.value
    })
    .join('')
}

function replaceWithSubscript(num: number) {
  const subscripts = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
  }
  return num
    .toString()
    .split('')
    .map((c) => subscripts[c as keyof typeof subscripts])
    .join('')
}

function removeTrailingZeroes(value: string) {
  let lastNonZeroIndex = value.length - 1
  while (lastNonZeroIndex >= 0 && value[lastNonZeroIndex] === '0') {
    lastNonZeroIndex--
  }

  if (lastNonZeroIndex < 0) {
    return '0'
  }

  return value.substring(0, lastNonZeroIndex + 1)
}

export function simpleFormatNumber(
  value: `${number}` | number | string,
  options: Omit<Intl.NumberFormatOptions, 'roundingMode'> = {}
): string {
  const num = typeof value === 'string' ? Number(value.replace(/,/g, '')) : Number(value)

  if (!isFinite(num)) return '∞'
  if (num > 9e12) return '∞' // 9 trillion = 9 * 10^12

  const intl = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
    roundingMode: 'floor',
    ...options,
  })

  return intl.format(num)
}
