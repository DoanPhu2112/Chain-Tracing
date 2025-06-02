import { createSlice } from '@reduxjs/toolkit'

const initialState = '0x'

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddress: (state, action) => {
      return action.payload
    },
  },
})

export const { setAddress } = addressSlice.actions
export default addressSlice.reducer
