// lib/apiHandler.ts
import transactions_json from '@/mocks/transactions.json'

// Function to fetch transactions
export const fetchTransactions = async () => {
  const transactions = transactions_json
  return transactions
}
