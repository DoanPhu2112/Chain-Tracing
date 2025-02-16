import React from 'react'
import {
  getBezierPath,
  useStore,
  BaseEdge,
  type EdgeProps,
  type ReactFlowState,
  EdgeLabelRenderer,
  useNodes,
} from '@xyflow/react'

import { getSmartEdge } from '@tisoap/react-flow-smart-edge'
import { Badge } from '@/components/ui/badge'

const foreignObjectSize = 200
const labelStyle: React.CSSProperties = {
  position: 'absolute',
  color: '#555',
  bottom: -35,
  fontSize: 8,
  alignContent: 'center',
  alignSelf: 'center',
}
export default function SmartBidirectionalEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label
}: EdgeProps) {
  const edgePathParams = {
    id,
    source,
    target,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  }
  const nodes = useNodes()
  const getSmartEdgeResponse = getSmartEdge({
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
    nodes,
  })

  let [path, labelX, labelY] = getBezierPath(edgePathParams)

  const marker = `url(#marker-end-${source}-${target})`

  if (getSmartEdgeResponse === null) {
    return (
      <>
        <svg style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <marker
              className="react-flow__arrowhead"
              id={`marker-end-${source}-${target}`}
              markerWidth="20"
              markerHeight="20"
              viewBox="-10 -10 20 20"
              markerUnits="strokeWidth"
              orient="auto-start-reverse"
              refX="0"
              refY="0"
            >
              <polyline
                style={{
                  stroke: 'black',
                  fill: 'black',
                  strokeWidth: 1,
                }}
                strokeLinecap="round"
                strokeLinejoin="round"
                points="-5,-4 0,0 -5,4 -5,-4"
              />
            </marker>
          </defs>
        </svg>
        <BaseEdge
          id={`e${source}-${target}`}
          path={path}
          markerEnd={marker}
          markerStart={marker}
        />
        <EdgeLabelRenderer>
          <div
            className="button-edge__label nodrag nopan "
            style={{
              position: `absolute`,
              // transformOrigin: `center`,
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            <Badge variant='outline' >{label}</Badge>
          </div>
        </EdgeLabelRenderer>
      </>
    )
  }
  const { edgeCenterX, edgeCenterY, svgPathString } = getSmartEdgeResponse

  return (
    <>
      {' '}
      <path
        // style={style}
        className="react-flow__edge-path"
        d={svgPathString}
        markerEnd={marker}
        markerStart={marker}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <Badge variant="gray">{label}</Badge>

      </foreignObject>
    </>
  )
}
