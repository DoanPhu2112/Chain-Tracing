import React from 'react'
import { BarChartTx } from '../../../../components/chart/activitiesChart/BarChartTx'
import { TornadoStat } from '@/types/transaction.interface'

const Timeline = ({ tornadoStat }: { tornadoStat: TornadoStat }) => {
  return (
    <div>
      <BarChartTx tornadoStat={tornadoStat}></BarChartTx>
    </div>
  )
}

export default Timeline
