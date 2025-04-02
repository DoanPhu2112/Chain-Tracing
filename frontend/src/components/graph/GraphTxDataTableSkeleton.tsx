import * as React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const SkeletonCell: React.FC = () => (
  <TableCell>
    <div className="h-6 bg-gray-300 rounded-md w-full animate-pulse"></div>
  </TableCell>
)

const GraphTxDataTableSkeleton: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-4">
        <div className="max-w-sm h-10 bg-gray-300 rounded-md animate-pulse"></div>
        <div className="flex gap-1">
          <div className="h-10 w-24 bg-gray-300 rounded-md animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 7 }).map((_, i) => (
                <TableHead key={i}>
                  <div className="h-6 w-24 bg-gray-300 rounded-md animate-pulse"></div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <SkeletonCell key={j} />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default GraphTxDataTableSkeleton
