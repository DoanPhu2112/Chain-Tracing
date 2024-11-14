import React from 'react'
import { Table, Tag } from 'antd'
import data from '@/mocks/storyTransactions.json'
import { Transaction } from '@/types/transaction.interface'
import { Event } from '@/types/story.interface'

interface Asset {
  asset: string
  type: 'debit' | 'credit'
}

const transformTransaction = (txn: Transaction): Event => {
  const shortenFromAddress =
    txn.from.address!.substring(0, 12) +
    '...' +
    txn.from.address!.substring(txn.txnHash.length - 4)
  const shortenToAddress =
    txn.to.address!.substring(0, 12) +
    '...' +
    txn.to.address!.substring(txn.txnHash.length - 4)
  const date = txn.date
  let fromAddressName =
    txn.from && txn.from.address_entity_label
      ? txn.from.address_entity_label
      : txn.from && txn.from.address_entity
        ? txn.from.address_entity
        : txn.from && txn.from.address
          ? shortenFromAddress
          : 'Unknown Address' // Fallback value if all are undefined
  const toAddressName =
    txn.to && txn.to.address_entity_label
      ? txn.to.address_entity_label
      : txn.to && txn.to.address_entity
        ? txn.to.address_entity
        : txn.to && txn.to.address
          ? shortenToAddress
          : 'Unknown Address' // Fallback value if all are undefined

  // Assuming we want to process multiple ERC20 transfers
  const fromWallet = [
    {
      asset: txn.amount,
      type: 'debit',
    },
  ]

  const toWallet = [
    {
      asset: txn.amount,
      type: 'credit',
    },
  ]
  // Constructing the event object
  const event: Event = {
    time: date,
    description: txn.summary,
  }

  // Dynamically adding the custom keys
  event[fromAddressName!] = fromWallet
  event[toAddressName!] = toWallet
  return event
}

const StoriesTable = ({ txnList }: { txnList: Transaction[] }) => {
  console.log('Txn List', txnList)
  const eventListData: Event[] = txnList.map((txn) => transformTransaction(txn))
  console.log('Event List', eventListData)
  const generateColumns = (fields: string[]) => {
    return fields.map((field: string) => ({
      title: field.charAt(0).toUpperCase() + field.slice(1),
      dataIndex: field,
      key: field,
      render: (assets: Asset[]) =>
        Array.isArray(assets) ? (
          <>
            {assets.map((asset, idx) => (
              <div key={idx} className={idx === 0 ? 'mb-2' : ''}>
                <Tag color={asset.type === 'debit' ? 'volcano' : 'green'} key={idx}>
                  {asset.type === 'debit' ? '-' : '+'} {asset.asset}
                </Tag>
              </div>
            ))}
          </>
        ) : (
          assets
        ),
    }))
  }
  const eventFields = eventListData.reduce<string[]>((fields, event) => {
    Object.keys(event).forEach((field) => {
      if (!fields.includes(field) && field !== 'time' && field !== 'description') {
        fields.push(field)
      }
    })
    return fields
  }, [])

  const columns = [
    {
      title: 'Event',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    ...generateColumns(eventFields),
  ]
  const tableData = eventListData.map((event, index) => ({
    key: index,
    ...event, // Spread the remaining fields dynamically
    time: event.time,
    description: event.description,
  }))
  return (
    <div className="p-4">
      {/* <h2 className="text-xl font-bold mb-4">{MockStoryTransactions.date}</h2> */}
      <Table columns={columns} dataSource={tableData} pagination={false} />{' '}
    </div>
  )
}

export default StoriesTable
