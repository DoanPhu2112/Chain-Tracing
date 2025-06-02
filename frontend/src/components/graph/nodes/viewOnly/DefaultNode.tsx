'use client'
import React, { memo } from 'react'
import { Handle, Position, NodeProps, NodeToolbar } from '@xyflow/react'
import { SquareMenu, User2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { shortenAddress } from '@/util/address'
import { AccountType } from '@/types/transaction.interface'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { Button } from '@/components/ui/button'

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

const DefaultViewOnlyNode: React.FC<NodeProps> = ({ data }) => {
  const clickedNode = useSelector((state: RootState) => state.node.clickedNode)
  let [over, setOver] = React.useState(false)

  const addressTypeIcon =
    (data.type as AccountType[]).includes(AccountType.CONTRACT_EXCHANGE) ||
    (data.type as AccountType[]).includes(AccountType.CONTRACT_NORMAL) ||
    (data.type as AccountType[]).includes(AccountType.CONTRACT_TOKEN) ? (
      <SquareMenu color="white" />
    ) : (
      <User2 color="white" />
    )

  return (
    <>
      <Handle type="target" position={Position.Left} id="left-target" />
      <Handle type="source" position={Position.Left} id="left-source" />
      <div
        className="wrapper gradient gradient-normal shadow-md "
        onClick={() => setOver((current) => !current)}
      >
        <div className="inner">{addressTypeIcon}</div>
      </div>
      <div style={addressStyle}>{shortenAddress(data.addressHash as string)}</div>
      <Badge variant="gray" style={labelStyle}>
        {data.label as string}
      </Badge>{' '}
      {/* <NodeToolbar isVisible={over} position={Position.Top}>
        <Button
          variant="outline"
          onClick={() => {
            clickedNode && (data.callBack as any)(clickedNode)
          }}
        >
          Find Following Transactions
        </Button>
      </NodeToolbar> */}
      <Handle type="target" position={Position.Right} id="right-target" />
      <Handle type="source" position={Position.Right} id="right-source" />{' '}
    </>
  )
}

export default memo(DefaultViewOnlyNode)
