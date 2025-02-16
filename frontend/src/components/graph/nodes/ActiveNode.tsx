'use client'
import React, { memo } from 'react'
import { Handle, useStore, Position, NodeProps } from '@xyflow/react'
import { User } from 'lucide-react'

const labelStyle: React.CSSProperties = {
  position: 'absolute',
  color: 'rgb(50, 110, 250)',
  bottom: -15,
  fontSize: 8,
  alignContent: 'center',
  alignSelf: 'center',
}

const ActiveNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} id="left-target" />
      <Handle type="source" position={Position.Left} id="left-source" />
      <div className="wrapper gradient gradient-active">
        <div className="inner">
          <User className="text-white" />
        </div>
      </div>
      {/* <div style={labelStyle}>{data.label as React.ReactNode}</div> */}
      <div style={labelStyle}>ABCW</div>
      <Handle type="target" position={Position.Right} id="right-target" />
      <Handle type="source" position={Position.Right} id="right-source" />{' '}
    </>
  )
}

export default ActiveNode
