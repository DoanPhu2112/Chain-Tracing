'use client'
import React, { memo, useEffect } from 'react'
import {
  Handle,
  useStore,
  Position,
  Node,
  NodeProps,
  NodeToolbar,
  NodeToolbarProps,
} from '@xyflow/react'
import { SquareMenu, User, UserSearch } from 'lucide-react'
import { shortenAddress } from '@/util/address'
import { Badge } from '@/components/ui/badge'
import { AccountType } from '@/types/transaction.interface'
import { Button } from 'antd'

const addressStyle: React.CSSProperties = {
  position: 'absolute',
  color: '#555',
  bottom: -16,
  fontSize: 8,
  fontWeight: 'bolder',
  alignContent: 'center',
  alignSelf: 'center',
}
const labelStyle: React.CSSProperties = {
  position: 'absolute',
  color: '#555',
  bottom: -35,
  fontSize: 8,
  alignContent: 'center',
  alignSelf: 'center',
}

export type TooltipNodeType = Node<{
  label: string
  tooltip?: {
    label: string
    position?: NodeToolbarProps['position']
  }
}>

const RedNode: React.FC<NodeProps> = ({ data }) => {
  let [over, setOver] = React.useState(false)
  const addressTypeIcon =
    (data.type as AccountType[]).includes(AccountType.CONTRACT_EXCHANGE) ||
    (data.type as AccountType[]).includes(AccountType.CONTRACT_NORMAL) ||
    (data.type as AccountType[]).includes(AccountType.CONTRACT_TOKEN) ? (
      <SquareMenu color="white" />
    ) : (
      <UserSearch color="white" />
    )
  useEffect(() => {
    console.log(over)
  }, [over])
  console.log("Red Node clicked")
  return (
    <>
      <Handle type="target" position={Position.Left} id="left-target" />
      <Handle type="source" position={Position.Left} id="left-source" />
      <div
        className="wrapper gradient gradient-red"
        onClick={() => setOver((current) => !current)}
      >
        <div className="inner">{addressTypeIcon}</div>
      </div>

      <div style={addressStyle}>{shortenAddress(data.addressHash as string)}</div>
      <NodeToolbar isVisible={over} position={Position.Top}>
        <Badge variant="gray" style={labelStyle}>
          {data.addressHash === AccountType.TARGET ? 'TARGET' : (data.label as string)}
        </Badge>
      </NodeToolbar>
      <Handle type="target" position={Position.Right} id="right-target" />
      <Handle type="source" position={Position.Right} id="right-source" />
    </>
  )
}

export default memo(RedNode)
