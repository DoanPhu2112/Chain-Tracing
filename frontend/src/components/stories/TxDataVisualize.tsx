import React from 'react'
import { Transaction } from '@/types/transaction.interface'
import { ScrollArea, Box } from '@mantine/core'
import { Separator } from '@/components/ui/separator'

import TxDataTimeline from './TxDataTimeLine'
import StoriesTable from './StoriesTable'

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)

interface TxDataVisualizeProps {
  txList: Transaction[]
}
const lo =
  'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
const lorem = lo + lo + lo + lo + lo + lo + lo + lo + lo + lo + lo
const TxDataVisualize: React.FC<TxDataVisualizeProps> = ({ txList }) => {
  console.log(txList)
  return (
    <div>
      <h2>Transaction Data</h2>
      {/* <table>
        <thead>
          <tr>
            <th>Txn Hash</th>
            <th>Type</th>
            <th>Status</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Added</th>
          </tr>
        </thead>
        <tbody>
          {txList &&
            txList.map((transaction) => (
              <tr key={transaction.txnHash}>
                <td>{transaction.txnHash}</td>
                <td>{transaction.type}</td>
                <td>{transaction.status}</td>
                <td>{transaction.date}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.added ? 'Yes' : 'No'}</td>
              </tr>
            ))}
        </tbody>
      </table> */}
      <Separator className="my-8" />
      <StoriesTable txnList={txList}/>
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-4 xl:grid-cols-5">
        {/* <div className="col-span-1 bg-pink-300">
          <TxDataTimeline />
        </div>
        <div className="bg-red-500 lg:col-span-3 xl:col-span-4">
        </div> */}
      </div>
    </div>
  )
}

export default TxDataVisualize
