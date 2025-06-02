export const LABEL = {
  blocked: 'Blocked',
  hack: 'Hacked',
  exploit: 'Exploited',
  phish: 'Phishing',
  tornadoInteracted: 'Tornado Cash interacted',
} as const

type LabelKey = keyof typeof LABEL // 'blocked' | 'hack' | ...

export function mapLabelToDisplay(label: string): string {
  return LABEL[label as LabelKey] ?? label // fallback to raw string if not matched
}

export const mapLabelToContent = (label: string) => {
  const description = LABEL_TO_CONTENT[label as keyof typeof LABEL_TO_CONTENT]
  if (description) {
    return description
  }
}

export const LABEL_TO_CONTENT = {
  blocked:
    'This address is blocked by custodial stable coin provider (such as USDT or USDC).',
  tornadoInteracted:
    'This address has interacted with Tornado Cash, you may get into trouble if interacting with it.',
  phish:
    'There are reports that this address was used in a Phishing scam. Please exercise caution when interacting with it.',
  hack: 'This address is reported to be involved in a hack',
} as const
