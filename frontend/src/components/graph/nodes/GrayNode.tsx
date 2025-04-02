'use client'
import React, { memo } from 'react'
import { Handle, useStore, Position, NodeProps, NodeToolbar } from '@xyflow/react'
import { SquareMenu, User, User2, UserSearch } from 'lucide-react'
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
  bottom: -15,
  fontSize: 8,
  alignContent: 'center',
  alignSelf: 'center',
}

const GrayNode: React.FC<NodeProps> = ({ data }) => {
  let [over, setOver] = React.useState(false)

  const addressTypeIcon =
    (data.type as AccountType[]).includes(AccountType.CONTRACT_EXCHANGE) ||
    (data.type as AccountType[]).includes(AccountType.CONTRACT_NORMAL) ||
    (data.type as AccountType[]).includes(AccountType.CONTRACT_TOKEN) ? (
      <SquareMenu color="white" />
    ) : (
      <User2 color="white" />
    )
  console.log('addressTypeIcon', addressTypeIcon)
  return (
    <>
      <Handle type="target" position={Position.Left} id="left-target" />
      <Handle type="source" position={Position.Left} id="left-source" />{' '}
      <div
        className="wrapper gradient gradient-yellow shadow-md"
        onClick={() => setOver((current) => !current)}
      >
        <div className="inner">{addressTypeIcon}</div>
      </div>
      <div style={addressStyle}>{shortenAddress(data.addressHash as string)}</div>
      <div className="text-gray-600" style={labelStyle}>
        {data.label as React.ReactNode}
      </div>
      <NodeToolbar isVisible={over} position={Position.Top}>
        <Badge variant="gray" style={labelStyle}>
          {data.label as string}
        </Badge>
        <Button>Find Following Transactions</Button>
      </NodeToolbar>
      <Handle type="target" position={Position.Right} id="right-target" />
      <Handle type="source" position={Position.Right} id="right-source" />{' '}
    </>
  )
}

export default memo(GrayNode)
