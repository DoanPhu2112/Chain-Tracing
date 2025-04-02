'use client'
import React, { useState, MouseEvent, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useEdgesState,
  MiniMap,
  SnapGrid,
  NodeTypes,
  Controls,
} from '@xyflow/react'
import { useNodesState } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
// import { initialEdges, initialNodes } from './NodesAndEdges'
import { EdgeData, NodeData } from '@/types/graph.interface'
import './overview.css'

//redux
import { mapTransactionToNodeData, mapTransactionFields } from './NodesAndEdges'
import { useDispatch, useSelector } from 'react-redux' // Add useSelector to listen to Redux store
import { RootState } from '@/lib/store'

const snapGrid: SnapGrid = [20, 20]
const connectionLineStyle = { stroke: '#fff' }

import CircleNode from './nodes/CircleNode'
import DefaultNode from './nodes/DefaultNode'
import RedNode from './nodes/RedNode'
import GrayNode from './nodes/GrayNode'
import SmartBidirectionalEdge from './edges/BidirectionalEdge'
import NormalDirectionalEdge from './edges/NormalDirectionalEdge'
import { Transaction } from '@/types/transaction.interface'
import MultiDirectionalEdges from './edges/MultiDirectionalEdge'
import { setClickedNode } from '@/lib/features/node/nodeSlice'
import { cn } from '@/lib/utils'

const edgeTypes = {
  smartBidirectional: SmartBidirectionalEdge,
  smartDirectional: NormalDirectionalEdge,
  multiDirectional: MultiDirectionalEdges
};

const nodeTypes: NodeTypes = {
  circle: CircleNode,
  normalAddress: DefaultNode,
  redAddress: RedNode,
  grayAddress: GrayNode,
}

const nodeClassName = (node: NodeData): string => {
  return node.type ? node.type : 'normalAddress'
}
interface FlowProps {
  onAddressClick: (node: NodeData) => void // Function that takes NodeData as argument
  onTxClick: (edge: EdgeData) => void // Function that takes EdgeData as argument
  transactionsInput?: Transaction[],
  cls?: {
    graph: string
  }
}

function transformTxn(
  transactions: Transaction[]
): Record<string, Transaction[]> {
  const txnPairRecord: Record<string, Transaction[]> = {};

  for (const transaction of transactions) {
    const addresses = [transaction.from.address, transaction.to.address].sort();
    const key = addresses.join('-')
    if (!txnPairRecord[key]) {
      txnPairRecord[key] = [];
    }
    txnPairRecord[key].push(transaction);
  }
  return  txnPairRecord
}

export default function Flow({ onAddressClick, onTxClick, transactionsInput, cls }: FlowProps) {
  // Use useSelector to listen to the Redux store
  const transactions = transactionsInput ?? useSelector((state: RootState) => state.transactions.transactions)
  const transformedTxns = transformTxn(transactions);
  // Map transactions to nodes and edges
  const initialNodes = mapTransactionToNodeData(transactions, onAddressClick)
  const initialEdges = mapTransactionFields(transformedTxns)

  // Use ReactFlow's state hooks
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const dispatch = useDispatch();

  // Use useEffect to update nodes and edges whenever transactions change
  useEffect(() => {
    const newNodes = mapTransactionToNodeData(transactions, onAddressClick)
    const newEdges = mapTransactionFields(transformedTxns)
    setNodes(newNodes)
    setEdges(newEdges)
  }, [transactions, setNodes, setEdges])

  // Wrap click handlers with necessary calls to pass node or edge info to parent component
  const handleNodeClick = (_: MouseEvent, node: NodeData) => {
    // if (onAddressClick) {
    //   onAddressClick(node)
    // }
    dispatch(setClickedNode(node)); // Store clicked node in Redux

    console.log('Node clicked', node)
  }

  const handleEdgeClick = (_: MouseEvent, edge: EdgeData) => {
    if (onTxClick) {
      onTxClick(edge)
    }
    console.log('Edge clicked', edge)
  }
  useEffect(( ) => {
    console.log("edge: ", edges)
  }, [edges])
  return (
    <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
        <div
          className={cn(" border-black rounded-lg border-dotted border-2 shadow-sm w-full h-[700px] ", cls?.graph)}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodeClick={handleNodeClick}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeClick={handleEdgeClick}
            snapToGrid={true}
            snapGrid={snapGrid}
            fitView
            connectionLineStyle={connectionLineStyle}
            attributionPosition="top-right"
          >
            <MiniMap zoomable pannable nodeClassName={nodeClassName} />
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </main>
  )
}
