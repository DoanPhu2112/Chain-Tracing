import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mock_transactions from '@/mocks/graph_response.json'
import { Transaction } from '@/types/transaction.interface'
import { stat } from 'fs';

interface TransactionState {
    transactions: Transaction[];
}

const initialState: TransactionState = {
    // @ts-ignore
    transactions: mock_transactions
};

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setTransactions(state, action: PayloadAction<Transaction[]>) {
            state.transactions = action.payload;
        }, 
        addTransaction(state, action: PayloadAction<Transaction>) {
            state.transactions.push(action.payload);
        },
        addTransactions: (state, action: PayloadAction<Transaction[]>) => {
            const oldStateTxnHash = state.transactions.map(txn => txn.txnHash)
            const newTxns = action.payload.filter(txn => !oldStateTxnHash.includes(txn.txnHash))
            state.transactions = [...state.transactions, ...newTxns]; // Appends new transactions
          },
        removeTransaction(state, action: PayloadAction<string>) {
            state.transactions = state.transactions.filter(tx => tx.txnHash !== action.payload);
        },
    }
});

export const { setTransactions, addTransaction, removeTransaction, addTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
