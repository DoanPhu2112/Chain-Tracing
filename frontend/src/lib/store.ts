import { configureStore } from '@reduxjs/toolkit'
import transactionsReducer from '@/lib/features/transactions/transactionsSlice'
import nodeReducer from '@/lib/features/node/nodeSlice' // Import the slice
import reportReducer from '@/lib/features/report/reportSlice' // Import the slice
import addressReducer from '@/lib/features/address/addressSlice' // Import the slice
import startTimeReducer from '@/lib/features/start-time/startTimeSlice' // Import the slice

export const makeStore = () => {
  return configureStore({
    reducer: {
      transactions: transactionsReducer,
      node: nodeReducer,
      report: reportReducer,
      address: addressReducer,
      startTime: startTimeReducer,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
