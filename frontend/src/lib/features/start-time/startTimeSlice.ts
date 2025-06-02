import { createSlice } from '@reduxjs/toolkit'

const initialState = 0

const startTimeSlice = createSlice({
  name: 'starttime',
  initialState,
  reducers: {
    setStartTime: (state, action) => {
      return action.payload
    },
  },
})

export const { setStartTime } = startTimeSlice.actions
export default startTimeSlice.reducer
