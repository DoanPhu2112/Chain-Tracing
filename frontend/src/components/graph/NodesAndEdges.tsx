import { Position } from '@xyflow/react'
import { Node, Edge, MarkerType } from '@xyflow/react'
import { NodeData, EdgeData } from '@/types/graph.interface'
import transactions from '@/mocks/transactions.json'

// REDUX
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/lib/store'
import {
  addTransaction,
  removeTransaction,
} from '@/lib/features/transactions/transactionsSlice'
import { Transaction } from '@/types/transaction.interface'

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  style: {
    borderRadius: '3rem',
    backgroundColor: '#fff',
    width: 200,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '6px',
  },
  animated: true,
}

const edgeDefaults = {
  animated: true,
  style: { stroke: 'black' },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: 'black',
  },
}

export function mapNodeType(nodeType: string | undefined): string {
  if (nodeType === 'contract') {
    return 'redAddress'
  } else if (nodeType === 'contract_exchange') {
    return 'circle'
  } else if (nodeType === 'miner') {
    return 'yellowAddress'
  } else return 'normalAddress'
}

export function mapTransactionToNodeData(transactions: Transaction[]): NodeData[] {
  const nodesMap: Record<string, NodeData> = {}
  const levelMap: Record<string, number> = {}
  const levelPositions: Record<number, number> = {} // Tracks the y position for each level
  let initialX = 50
  let initialY = 50
  const horizontalSpacing = 250 // Adjust the spacing between levels horizontally
  const verticalSpacing = 100 // Adjust the spacing between nodes vertically

  transactions.forEach((transaction) => {
    const fromNodeId = transaction.from.address
    const fromNodeClassify = mapNodeType(transaction.from.type || "eoa")
    const toNodeId = transaction.to.address
    const toNodeClassify = mapNodeType(transaction.to.type || "eoa")

    // Determine levels
    if (levelMap[fromNodeId] === undefined) {
      levelMap[fromNodeId] = 0 // Assign root level
    }
    if (levelMap[toNodeId] === undefined) {
      levelMap[toNodeId] = levelMap[fromNodeId] + 1 // Target node is one level further to the right from source node
    }

    // Calculate positions based on level
    if (!levelPositions[levelMap[fromNodeId]]) {
      levelPositions[levelMap[fromNodeId]] = initialY
    }

    if (!nodesMap[fromNodeId]) {
      nodesMap[fromNodeId] = {
        id: fromNodeId,
        data: { label: fromNodeId },
        type: fromNodeClassify,
        details: {
          address: fromNodeId,
          type: fromNodeClassify,
        },
        position: {
          x: initialX + levelMap[fromNodeId] * horizontalSpacing, // Horizontal position based on level
          y: levelPositions[levelMap[fromNodeId]], // Vertical position based on level
        },
      }
      levelPositions[levelMap[fromNodeId]] += verticalSpacing
    }

    if (!nodesMap[toNodeId]) {
      if (!levelPositions[levelMap[toNodeId]]) {
        levelPositions[levelMap[toNodeId]] = initialY
      }

      nodesMap[toNodeId] = {
        id: toNodeId,
        data: { label: toNodeId },
        type: toNodeClassify,
        details: {
          address: toNodeId,
          type: toNodeClassify,
        },
        position: {
          x: initialX + levelMap[toNodeId] * horizontalSpacing, // Horizontal position based on level
          y: levelPositions[levelMap[toNodeId]], // Vertical position based on level
        },
      }
      levelPositions[levelMap[toNodeId]] += verticalSpacing
    }
  })

  return Object.values(nodesMap)
}

export function mapTransactionFields(transactions: Transaction[]): EdgeData[] {
  return transactions.map((transaction) => {
    const { from, to, txnHash, ...otherDetails } = transaction
    return {
      id: txnHash,
      source: from.address,
      target: to.address,
      details: {
        ...otherDetails,
      },
      ...edgeDefaults,
    } as EdgeData
  })
}

const initialNodes = mapTransactionToNodeData(transactions)
const initialEdges = mapTransactionFields(transactions)
console.log('initialEdges', initialEdges)
console.log('initialNodes', initialNodes)

export { initialEdges, initialNodes }

export const useTransactionData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const transactions2 = useSelector((state: RootState) => state.transactions.transactions)

  const initialNodes = mapTransactionToNodeData(transactions2)
  const initialEdges = mapTransactionFields(transactions2)

  console.log('initialEdges', initialEdges)
  console.log('initialNodes', initialNodes)

  return { initialEdges, initialNodes }
}
