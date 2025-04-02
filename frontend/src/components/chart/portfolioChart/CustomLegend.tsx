import React from 'react'

export const CustomLegend = ({ payload }: { payload?: any[] }) => {
  return (
    <ul className="space-y-2 text-sm">
      {payload?.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.value}</span>
          </div>
          <span className="font-medium">{Number(entry.payload.portfolioPercentage).toFixed(2)}%</span>
        </li>
      ))}
    </ul>
  )
}
