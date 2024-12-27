'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/lib/store'
import {
  addTransaction,
  removeTransaction,
} from '@/lib/features/transactions/transactionsSlice'
import { Transaction } from '@/types/transaction.interface'
import TESTT from './tt/page'
// Properly typed sampleTransaction
const sampleTransaction: Transaction = {
  txnHash: '0xe238fec45d6479d3087d8bb95d7ffc68205a92d9daa0faea7d5d3fc048beb8e8',
  type: 'Transfer',
  status: 'Confirmed',
  date: '4 days ago',
  amount: '0.00000033 ETH',
  from: {
    address: '0xA1B2C3D4E5F60708090A0B0C0D0E0F0G0H0I0J0K0',
    address_entity: 'address_entity1',
    address_entity_label: 'address_entity1: Transfer',
    address_entity_logo: undefined,
    type: 'eoa',
  },
  to: {
    address: '0xD1E2F3G4H5I60708090A0B0C0D0E0F0G0H0I0J0K0',
    address_entity: 'address_entity2',
    address_entity_label: 'address_entity2: Receive',
    address_entity_logo: undefined,
    type: 'eoa',
  },
  summary: 'Airdrop from Null Address: 0x000...000',
  chainId: '0x1',
  tokenName: 'ETH',
}

const TransactionList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const transactions = useSelector((state: RootState) => state.transactions.transactions)

  // Handler to add a new transaction
  const handleAddTransaction = () => {
    dispatch(addTransaction(sampleTransaction))
  }

  // Handler to remove a transaction
  const handleRemoveTransaction = (hash: string) => {
    dispatch(removeTransaction(hash))
  }

  return (
    <div className="grid">
      <h2>Transactions:</h2>
      <button onClick={handleAddTransaction}>Add Transaction</button>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.txnHash}>
            {tx.txnHash} - {tx.amount} ETH - Type: {tx.type} - From: {tx.from.address} - To:{' '}
            {tx.to.address}
            <button onClick={() => handleRemoveTransaction(tx.txnHash)}>Remove</button>
          </li>
        ))}
      </ul>
      <div className="mt-2 bg-red-100">
        <TESTT></TESTT>
      </div>
    </div>
  )
}

export default TransactionList
