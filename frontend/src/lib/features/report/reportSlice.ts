import { createSlice } from '@reduxjs/toolkit'

const initialState = 1

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setReportId: (state, action) => {
      return action.payload
    },
  },
})

export const { setReportId } = reportSlice.actions
export default reportSlice.reducer
