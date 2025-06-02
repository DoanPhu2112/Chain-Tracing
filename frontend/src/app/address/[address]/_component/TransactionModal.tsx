import { Button } from '@/components/button'
import Modal from '@/components/modal/Modal'
import { ScamCategory } from '@/constants/ScamCategory'
import {
  HeuristicRule,
  ShortenTransaction,
  Transaction,
} from '@/types/transaction.interface'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from '../../../../components/ui/table'
import { shortenAddress, toTornadoCashPoolName } from '@/util/address'
import { cn } from '@/lib/utils'
type Props = {
  address: string
  isOpen: boolean
  onClose: () => void
  transactions: ShortenTransaction[]
  type: HeuristicRule | null
}

export function TransactionModal({
  address,
  isOpen,
  onClose,
  transactions,
  type,
}: Props) {
  if (type === HeuristicRule.MultiDenom) {
  }
  return (
    <Modal
      cls={{
        wrapper: 'h-[calc(100%)] md:h-auto max-w-[900px]',
        content: 'flex flex-col overflow-y-hidden space-y-6 px-10',
      }}
      isOpen={isOpen}
      title="Exposed transactions"
      onClose={onClose}
    >
      {type === HeuristicRule.MultiDenom ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Txn</TableHead>
              <TableHead>Deposit</TableHead>
              <TableHead>↔ Pool</TableHead>
              <TableHead>Withdraw</TableHead>
              <TableHead className="text-right">Time (UTC)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => {
              const isFromTarget = tx.from === address
              const isToTarget = tx.to === address
              return (
                <TableRow
                  key={tx.hash}
                  className={cn(
                    isFromTarget || isToTarget ? 'bg-slate-100 border-gray-300' : ''
                  )}
                >
                  <TableCell title={tx.hash} className="font-mono text-xs">
                    {shortenAddress(tx.hash)}
                  </TableCell>
                  <TableCell>
                    {isFromTarget ? <span className="font-semibold">🎯 Target</span> : ''}
                  </TableCell>
                  <TableCell>
                    {toTornadoCashPoolName(tx.to) ??
                      (isToTarget ? (
                        <span className="text-indigo-600 font-semibold">🎯 Target</span>
                      ) : (
                        shortenAddress(tx.to)
                      ))}
                  </TableCell>
                  <TableCell>
                    {toTornadoCashPoolName(tx.from) ??
                      (!isFromTarget ? <div>🧩 {shortenAddress(tx.from)}</div> : '')}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 text-right">
                    {new Date(tx.timestamp).toLocaleString('en-GB', {
                      timeZone: 'UTC',
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hash</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.hash}>
                <TableCell>{shortenAddress(transaction.hash)}</TableCell>
                <TableCell>
                  {address === transaction.from
                    ? '🎯 Target'
                    : shortenAddress(transaction.from)}
                </TableCell>
                <TableCell>
                  {toTornadoCashPoolName(transaction.to) ??
                    (address === transaction.to
                      ? '🎯 Target'
                      : shortenAddress(transaction.to))}
                </TableCell>
                <TableCell>
                  {new Date(transaction.timestamp).toLocaleString('en-GB', {
                    timeZone: 'UTC',
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Modal>
  )
}
