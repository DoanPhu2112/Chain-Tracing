'use client'
import React, { memo } from 'react'
import { Handle, useStore, Position, NodeProps } from '@xyflow/react'
import { SquareMenu, User, UserSearch } from 'lucide-react'
import { AccountType } from '@/types/transaction.interface'

const labelStyle: React.CSSProperties = {
  position: 'absolute',
  color: 'rgb(50, 110, 250)',
  bottom: -15,
  fontSize: 8,
  alignContent: 'center',
  alignSelf: 'center',
}

const ActiveNode: React.FC<NodeProps> = ({ data }) => {
  const addressTypeIcon =
    (data.type as AccountType[]).includes(AccountType.CONTRACT_EXCHANGE) ||
    (data.type as AccountType[]).includes(AccountType.CONTRACT_NORMAL) ||
    (data.type as AccountType[]).includes(AccountType.CONTRACT_TOKEN) ? (
      <SquareMenu color="white" />
    ) : (
      <UserSearch color="white" />
    )

  return (
    <>
      <Handle type="target" position={Position.Left} id="left-target" />
      <Handle type="source" position={Position.Left} id="left-source" />
      <div className="wrapper gradient gradient-active">
        <div className="inner">{addressTypeIcon}</div>
      </div>
      {/* <div style={labelStyle}>{data.label as React.ReactNode}</div> */}
      <div style={labelStyle}>ABCW</div>
      <Handle type="target" position={Position.Right} id="right-target" />
      <Handle type="source" position={Position.Right} id="right-source" />{' '}
    </>
  )
}

export default ActiveNode
