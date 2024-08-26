import { memo, useState } from 'react'
import { Handle, Position, NodeToolbar } from '@xyflow/react'
import { NodeProps } from '@xyflow/react'

const labelStyle: React.CSSProperties = {
  position: 'absolute',
  color: '#555',
  bottom: -15,
  fontSize: 8,
}

const ToolbarNode: React.FC<NodeProps> = ({ data }) => {
  const [emoji, setEmoji] = useState(() => '🚀')

  return (
    <>
      <NodeToolbar isVisible>
        <button onClick={() => setEmoji('🚀')}>🚀</button>
        <button onClick={() => setEmoji('🔥')}>🔥</button>
        <button onClick={() => setEmoji('✨')}>✨</button>
      </NodeToolbar>
      <div style={{ padding: '10px 20px' }}>
        <div>{emoji}</div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <div style={labelStyle}>{data.label as React.ReactNode}</div>
    </>
  )
}

export default memo(ToolbarNode)
