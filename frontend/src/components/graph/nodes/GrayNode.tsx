'use client'
import React, { memo } from 'react'
import { Handle, useStore, Position, NodeProps } from '@xyflow/react'
import { User } from 'lucide-react'
import { shortenAddress } from '@/util/address'
import { Badge } from '@/components/ui/badge'
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

const RedNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <>
      {' '}
      <Handle type="target" position={Position.Left} id="left-target" />
      <Handle type="source" position={Position.Left} id="left-source" />      <div className="wrapper gradient gradient-yellow shadow-md">
        <div className="inner"></div>
      </div>
      <div style={addressStyle}>{shortenAddress(data.addressHash as string)}</div>
      <div className="text-gray-600" style={labelStyle}>
        {data.label as React.ReactNode}
      </div>
      <Badge variant="gray" style={labelStyle}>
        {data.label as string}
      </Badge>
      <Handle type="target" position={Position.Right} id="right-target" />
      <Handle type="source" position={Position.Right} id="right-source" />    </>
  )
}

export default memo(RedNode)
