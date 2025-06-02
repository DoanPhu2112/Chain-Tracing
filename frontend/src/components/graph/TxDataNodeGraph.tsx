'use client'
import React, { useState, MouseEvent, useEffect, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useEdgesState,
  MiniMap,
  SnapGrid,
  NodeTypes,
  Controls,
  ControlButton,
  Panel,
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
import { MagicWandIcon } from '@radix-ui/react-icons'
import { Button } from '../button'
import { useReportGraphTransactions } from '@/api/hooks/use-report-graph-transactions'

const edgeTypes = {
  smartBidirectional: SmartBidirectionalEdge,
  smartDirectional: NormalDirectionalEdge,
  multiDirectional: MultiDirectionalEdges,
}

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
  onSaveGraphAction: () => void // Function to save the graph
  onAddressClickAction: (node: NodeData) => void // Function that takes NodeData as argument
  onTxClickAction: (edge: EdgeData) => void // Function that takes EdgeData as argument
  onFindFollowingTransactionsAction: (node: NodeData) => void // Function that takes NodeData as argument
  transactionsInput?: Transaction[]
  cls?: {
    graph: string
  }
}

function transformTxn(transactions: Transaction[]): Record<string, Transaction[]> {
  const txnPairRecord: Record<string, Transaction[]> = {}

  for (const transaction of transactions) {
    const addresses = [transaction.from.address, transaction.to.address].sort()
    const key = addresses.join('-')
    if (!txnPairRecord[key]) {
      txnPairRecord[key] = []
    }
    txnPairRecord[key].push(transaction)
  }
  return txnPairRecord
}

export default function Flow({
  onSaveGraphAction,
  onAddressClickAction,
  onFindFollowingTransactionsAction,
  onTxClickAction,
  cls,
}: FlowProps) {
  const dispatch = useDispatch()

  // Use useSelector to listen to the Redux store
  const transactions = useSelector((state: RootState) => state.transactions.transactions)

  const transformedTxns = useMemo(() => transformTxn(transactions), [transactions])

  // Map transactions to nodes and edges
  const initialNodes = mapTransactionToNodeData(
    transactions,
    onFindFollowingTransactionsAction
  )
  const initialEdges = mapTransactionFields(transformedTxns)

  // Use ReactFlow's state hooks
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Use useEffect to update nodes and edges whenever transactions change
  useEffect(() => {
    const newNodes = mapTransactionToNodeData(
      transactions,
      onFindFollowingTransactionsAction
    )
    const newEdges = mapTransactionFields(transformedTxns)
    setNodes(newNodes)
    setEdges(newEdges)
  }, [
    transactions,
    setNodes,
    setEdges,
    onFindFollowingTransactionsAction,
    transformedTxns,
  ])

  // Wrap click handlers with necessary calls to pass node or edge info to parent component
  const handleNodeClick = (_: MouseEvent, node: NodeData) => {
    console.log('Handle Node Click')
    const matchingTimestamps = transactions
      .filter((txn) => txn.to.address === node.data.addressHash)
      .map((txn) => new Date(txn.date).getTime())

    const startTime = matchingTimestamps.length > 0 ? Math.max(...matchingTimestamps) : 0
    console.log('Start time:', startTime)
    if (onAddressClickAction) {
      onAddressClickAction(node)
    }
    dispatch(setClickedNode({ node, startTime })) // Store clicked node in Redux
  }

  const handleEdgeClick = (_: MouseEvent, edge: EdgeData) => {
    console.log('Handle Edge Click')

    if (onTxClickAction) {
      onTxClickAction(edge)
    }
    console.log('Edge clicked', edge)
  }

  return (
    <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
        <div
          className={cn(
            ' border-black rounded-lg border-dotted border-2 shadow-sm  h-[700px] ',
            cls?.graph
          )}
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
            <Controls>
              <ControlButton>
                <MagicWandIcon />
              </ControlButton>
            </Controls>
            <Panel position="bottom-center">
              <Button variant="secondary" onClick={onSaveGraphAction}>
                Save Graph
              </Button>
            </Panel>
            <MiniMap zoomable pannable nodeClassName={nodeClassName} />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </main>
  )
}
