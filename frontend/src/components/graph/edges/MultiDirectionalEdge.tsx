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

const labelStyle: React.CSSProperties = {
  position: 'absolute',
  color: '#555',
  bottom: -35,
  fontSize: 8,
  alignContent: 'center',
  alignSelf: 'center',
}

export type GetSpecialPathParams = {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
}

export const getSpecialPath = (
  { sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
  index: number,
  baseOffset: number = 10
): [string, number, number] => {
  const centerX = (sourceX + targetX) / 2
  const centerY = (sourceY + targetY) / 2

  // Adjust offset to avoid overlapping edges
  const dynamicOffset = baseOffset * ((index % 2 === 0 ? 1 : -1) * Math.ceil(index / 2))

  // Path string using quadratic Bézier curve
  const path = `M ${sourceX} ${sourceY} Q ${centerX} ${centerY + dynamicOffset} ${targetX} ${targetY}`

  // Calculate label position using quadratic Bézier formula
  const labelX = (sourceX + 2 * centerX + targetX) / 4
  const labelY = (sourceY + 2 * (centerY + dynamicOffset) + targetY) / 4

  return [path, labelX, labelY]
}

export default function MultiDirectionalEdges({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
}: EdgeProps) {
  const allEdgesBetweenNodes = useStore((s: ReactFlowState) => {
    return s.edges.filter(
      (e) =>
        (e.source === source && e.target === target) ||
        (e.source === target && e.target === source)
    )
  })
  const edgeIndex = allEdgesBetweenNodes.findIndex((e) => e.id === id) // Find this edge's index

  const numEdges = allEdgesBetweenNodes.length
  const offsetStep = 20 // Adjust spacing between edges

  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  }

  let path: string = ''
  let labelX, labelY
  const marker = `url(#marker-end-${source}-${target})`

  if (numEdges > 1) {    console.log("0---------------")
    const smallerAddress = [source, target].sort()[0]
    const isSourceToTarget = allEdgesBetweenNodes[edgeIndex].source === smallerAddress; // Check edge direction
    console.log("allEdgesBetweenNodes[edgeIndex].source", allEdgesBetweenNodes[edgeIndex].source)
    console.log("source", source)

    console.log("isSourceToTarget", isSourceToTarget)
    const offsetDirection = isSourceToTarget ? -1 : 1; // -1 for above, 1 for below
    const baseOffset = 10; // Adjust base offset
    const offsetStep = 10; // Adjust spacing between edges.
    const currentOffset = offsetDirection * (baseOffset + edgeIndex * offsetStep)


    ;[path, labelX, labelY] = getSpecialPath(edgePathParams, currentOffset);
  } else {
    ;[path, labelX, labelY] = getBezierPath(edgePathParams)
  }

  return (
    <>
      <svg style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <marker
            className="react-flow__arrowhead"
            id={`marker-end-${source}-${target}`}
            markerWidth="15"
            markerHeight="15"
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
      <BaseEdge id={`e${source}-${target}`} path={path} markerEnd={marker} />
      <EdgeLabelRenderer>
        <div
          className="button-edge__label nodrag nopan "
          style={{
            position: `absolute`,
            // transformOrigin: `center`,
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <Badge variant="outline">{label}</Badge>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
