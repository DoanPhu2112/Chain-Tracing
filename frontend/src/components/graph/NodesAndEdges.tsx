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
import {
  AccountType,
  TokenAmount,
  Transaction,
  TransactionType,
} from '@/types/transaction.interface'
import { shortenValue } from '@/util/address'

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
  // style: { stroke: 'black' },
  type: 'smart',
}

export function mapNodeType(nodeType: AccountType[] | undefined): string {
  if (nodeType?.includes(AccountType.TARGET)) {
    return 'redAddress'
  } else if (nodeType?.includes(AccountType.CONTRACT_TOKEN)) {
    return 'circle'
  } else if (nodeType?.includes(AccountType.CONTRACT_EXCHANGE)) {
    return 'circle'
  } else if (nodeType?.includes(AccountType.EOA_ACTIVE)) {
    return 'normalAddress'
  } else if (nodeType?.includes(AccountType.EOA_INACTIVE)) {
    return 'grayAddress'
  } else return 'normalAddress'
}

export function mapTransactionToNodeData(
  transactions: Transaction[],
  onAddressClick: (node: NodeData) => void
): NodeData[] {
  const nodesMap: Record<string, NodeData> = {}
  const levelMap: Record<string, number> = {}
  const levelPositions: Record<number, number> = {} // Tracks the y position for each level
  let initialX = 50
  let initialY = 50
  const horizontalSpacing = 250 // Adjust the spacing between levels horizontally
  const verticalSpacing = 100 // Adjust the spacing between nodes vertically
  transactions.forEach((transaction) => {
    const fromNodeId = transaction.from.address || '0x0'
    const fromNodeClassify = mapNodeType(transaction.from.type || 'eoa')
    const toNodeId = transaction.to.address || '0x0'
    const toNodeClassify = mapNodeType(transaction.to.type || 'eoa')

    const isToTarget = transaction.to.type?.includes(AccountType.TARGET) || false
    const isFromTarget = transaction.from.type?.includes(AccountType.TARGET) || false
    // Determine levels
    if (isToTarget && levelMap[toNodeId] === undefined) levelMap[toNodeId] = 0
    if (isFromTarget && levelMap[fromNodeId] === undefined) levelMap[fromNodeId] = 0

    if (transaction.type === TransactionType.Receive) {
      if (isFromTarget) {
        if (levelMap[toNodeId] === undefined) {
          levelMap[toNodeId] = levelMap[fromNodeId] - 1
        }
      } else if (isToTarget) {
        if (levelMap[fromNodeId] === undefined) {
          levelMap[fromNodeId] = levelMap[toNodeId] - 1
        }
      } else {
        throw new Error('Non is Target Address')
      }
    } else {
      if (levelMap[toNodeId] === undefined) {
        levelMap[toNodeId] = levelMap[fromNodeId] + 1
      }
    }

    // Calculate positions based on level
    if (!levelPositions[levelMap[fromNodeId]]) {
      levelPositions[levelMap[fromNodeId]] = initialY
    }

    if (!nodesMap[fromNodeId]) {
      nodesMap[fromNodeId] = {
        id: fromNodeId,
        data: {
          addressHash: fromNodeId,
          label: transaction.from.address_entity_label || transaction.from.address_entity,
          type: transaction.from.type,
          callBack: onAddressClick,
        },
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
        data: {
          addressHash: toNodeId,
          label: transaction.to.address_entity_label || transaction.to.address_entity,
          type: transaction.to.type,
          callBack: onAddressClick,

        },
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

// export function mapTransactionFields(transactions: Transaction[]): EdgeData[] {

//   return transactions.map((transaction) => {

//     const { from, to, txnHash, type, tokenAmount, ...otherDetails } = transaction
//     const edgeType = type === TransactionType.Swap ? 'smartBidirectional' : 'multiDirectional';
//     return {
//       ...edgeDefaults,
//       id: txnHash || '0x0',
//       source: from.address,
//       target: to.address,
//       label: "ACD",
//       details: {
//         ...otherDetails,
//       },
//       type: edgeType,

//     } as EdgeData
//   })
// }

export function mapTransactionFields(
  transactions: Record<string, Transaction[]>
): EdgeData[] {
  const edges: EdgeData[] = []
  for (const [key, transactionList] of Object.entries(transactions)) {
    const [fromAddress, toAddress] = key.split('-') // Split the key to get source and target addresses

    for (const transaction of transactionList) {
      const { txnHash, type, value: tokenAmount, from, to, ...otherDetails } = transaction

      const edgeType = 'multiDirectional'

      let srcNode, targetNode
      let srcHandle, targetHandle
      // ;[srcHandle, targetHandle] = ['right', 'left']
      let tokenAmounts
      if (type === TransactionType.Receive) {
        ;[srcHandle, targetHandle] = ['right-source', 'left-target']
        ;[srcNode, targetNode] = from.type.includes(AccountType.TARGET)
          ? [to.address, from.address]
          : [from.address, to.address]

        tokenAmounts = tokenAmount.receive
          .map((token) => {
            if (`name` in token) {
              return `${shortenValue(token.value)} ${token.name}`
            } else {
              return `${shortenValue(token.value)} ${token.symbol}`
            }
          })
          .join('\n ')
      } else {
        ;[srcHandle, targetHandle] = from.type.includes(AccountType.TARGET)
          ? ['right-source', 'left-target']
          : ['left-source', 'right-target']
        ;[srcNode, targetNode] = [from.address, to.address]

        if (tokenAmount.sent.length > 0) {
          tokenAmounts = tokenAmount.sent
            .map((token) => {
              if (`name` in token) {
                return `${shortenValue(token.value)} ${token.name}`
              } else {
                return `${shortenValue(token.value)} ${token.symbol}`
              }
            })
            .join('\n ')
        } else {
          tokenAmounts = tokenAmount.receive
            .map((token) => {
              if (`name` in token) {
                console.log('token with name: ', token)
                return `${token.value} ${token.name}`
              } else {
                console.log('token with symbol: ', token)

                return `${token.value} ${token.symbol}`
              }
            })
            .join('\n ')
        }
      }
      console.log('Token Amount: ', tokenAmounts)
      console.log('Node: ', srcNode)
      console.log('Type: ', type)
      edges.push({
        ...edgeDefaults,
        id: txnHash || '0x0',
        source: srcNode,
        sourceHandle: srcHandle,
        animated: true,
        targetHandle: targetHandle,
        target: targetNode,
        label: tokenAmounts,
        details: {
          ...otherDetails,
        },

        type: edgeType,
      } as EdgeData)
    }
  }

  return edges
}
