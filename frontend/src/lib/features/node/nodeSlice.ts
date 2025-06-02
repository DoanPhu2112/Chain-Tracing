import { NodeData } from '@/types/graph.interface'
import { AccountType } from '@/types/transaction.interface'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// // Define the node structure
// interface NodeData {
//   id: string;
//   addressHash?: string;
//   label?: string;
//   type?: AccountType[];
// }

interface NodeState {
  clickedNode: NodeData | null
  occurredTime?: number
}

const initialState: NodeState = {
  clickedNode: null,
  occurredTime: 0,
}

const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    setClickedNode: (
      state,
      action: PayloadAction<{ node: NodeData; startTime: number }>
    ) => {
      state.clickedNode = action.payload.node
      state.occurredTime = action.payload.startTime
    },
    clearClickedNode: (state) => {
      state.clickedNode = null
    },
  },
})

export const { setClickedNode, clearClickedNode } = nodeSlice.actions
export default nodeSlice.reducer
