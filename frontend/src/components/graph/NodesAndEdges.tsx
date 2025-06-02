import { Position } from '@xyflow/react'
import { NodeData, EdgeData } from '@/types/graph.interface'

// REDUX
import { AccountType, Transaction, TransactionType } from '@/types/transaction.interface'
import { simpleFormatNumber } from '@/util/value'

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
  onFindFollowingTransactions: (node: NodeData) => void
): NodeData[] {
  const nodesMap: Record<string, NodeData> = {}
  const levelMap: Record<string, number> = {}
  const levelPositions: Record<number, number> = {} // Tracks the y position for each level
  let initialX = 50
  let initialY = 50
  const horizontalSpacing = 250 // Adjust the spacing between levels horizontally
  const verticalSpacing = 150 // Adjust the spacing between nodes vertically

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

    if (levelMap[fromNodeId] === undefined && levelMap[toNodeId] === undefined) {
      levelMap[fromNodeId] = 0
    }

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
        return;
      }
    } else {
      if (levelMap[toNodeId] === undefined) {
        levelMap[toNodeId] = levelMap[fromNodeId] + 1
      }
      if (levelMap[fromNodeId] === undefined) {
        levelMap[fromNodeId] = levelMap[toNodeId] + 1
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
          label: transaction.to.address_entity_label || transaction.to.address_entity,
          type: transaction.from.type,
          callBack: onFindFollowingTransactions,
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
          callBack: onFindFollowingTransactions,
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

export function mapTransactionFields(
  transactions: Record<string, Transaction[]>
): EdgeData[] {
  const edges: EdgeData[] = []
  for (const [key, transactionList] of Object.entries(transactions)) {
    for (const transaction of transactionList) {
      const {
        txnHash,
        type,
        value: tokenAmount,
        from,
        to,
        summary,
        ...otherDetails
      } = transaction

      const edgeType = 'multiDirectional'

      let srcNode, targetNode
      let srcHandle, targetHandle
      let tokenAmounts
      if (type === TransactionType.Receive) {
        ;[srcHandle, targetHandle] = ['right-source', 'left-target']
          ;[srcNode, targetNode] = from.type.includes(AccountType.TARGET)
            ? [to.address, from.address]
            : [from.address, to.address]

        tokenAmounts = tokenAmount.receive
          .map((token) => {
            if (`name` in token) {
              return `${simpleFormatNumber(token.value, { notation: 'compact' })} ${token.name}`
            } else {
              return `${simpleFormatNumber(token.value, { notation: 'compact' })} ${token.symbol}`
            }
          })
          .join('\n ')
      } else {
        ;[srcHandle, targetHandle] = ['right-source', 'left-target']
          ;[srcNode, targetNode] = [from.address, to.address]
        if (tokenAmount.sent.length > 0 && tokenAmount.receive.length > 0) {
          tokenAmounts =
            tokenAmount.sent
              .map((token) => {
                if (`name` in token) {
                  return `${simpleFormatNumber(token.value, { notation: 'compact' })} ${token.name}`
                } else {
                  return `${simpleFormatNumber(token.value, { notation: 'compact' })} ${token.symbol}`
                }
              })
              .join('\n ') +
            '<->' +
            tokenAmount.receive.map((token) => {
              if (`name` in token) {
                return `${simpleFormatNumber(token.value, { notation: 'compact' })} ${token.name}`
              } else {
                return `${simpleFormatNumber(token.value, { notation: 'compact' })} ${token.symbol}`
              }
            })
        } else if (tokenAmount.sent.length > 0) {
          tokenAmounts = tokenAmount.sent
            .map((token) => {
              if (`name` in token) {
                return `${simpleFormatNumber(token.value, { notation: 'compact' })} ${token.name}`
              } else {
                return `${simpleFormatNumber(token.value, { notation: 'compact' })} ${token.symbol}`
              }
            })
            .join('\n ')
        } else {
          tokenAmounts = tokenAmount.receive
            .map((token) => {
              if (`name` in token) {
                return `${token.value} ${token.name}`
              } else {
                return `${token.value} ${token.symbol}`
              }
            })
            .join('\n ')
        }
      }
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
          summary: summary,
        },

        type: edgeType,
      } as EdgeData)
    }
  }
  return edges
}
