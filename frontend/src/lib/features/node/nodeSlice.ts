import { NodeData } from "@/types/graph.interface";
import { AccountType } from "@/types/transaction.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// // Define the node structure
// interface NodeData {
//   id: string;
//   addressHash?: string;
//   label?: string;
//   type?: AccountType[];
// }

interface NodeState {
  clickedNode: NodeData | null;
}

const initialState: NodeState = {
  clickedNode: null,
};

const nodeSlice = createSlice({
  name: "node",
  initialState,
  reducers: {
    setClickedNode: (state, action: PayloadAction<NodeData>) => {
      state.clickedNode = action.payload;
    },
    clearClickedNode: (state) => {
      state.clickedNode = null;
    },
  },
});

export const { setClickedNode, clearClickedNode } = nodeSlice.actions;
export default nodeSlice.reducer;
