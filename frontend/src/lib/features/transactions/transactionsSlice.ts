import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mock_transactions from '@/mocks/transactions_new.json'
import { Transaction } from '@/types/transaction.interface'

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
        removeTransaction(state, action: PayloadAction<string>) {
            state.transactions = state.transactions.filter(tx => tx.txnHash !== action.payload);
        },
    }
});

export const { setTransactions, addTransaction, removeTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
