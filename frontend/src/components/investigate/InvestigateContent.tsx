'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import InputCard from '../card/InputCard'
import InfoCard from '../card/InfoCard'
// import TxInfoCard from '../card/TxInfoCard'
import TableCard from '../card/TableCard'
import { ReportCard } from '../card/ReportCard'
import report from "../../mocks/CategoryData.json"
import { Category } from '@/types/common.interface'
const InvestigateContent = () => {

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <h1 className='text-4xl-bold font-serif'>Scam Report</h1>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        {/* <InputCard setIsLoading={setIsLoading}/> */}
        {report.map(r => (
          <ReportCard category={r.category } description={r.description} reporter={r.reporter} reportedAddresses={r.reportedAddresses} reportedDomain={r.reportedDomain}/>
        ))}
      </div>
    </div>
  )
}

export default InvestigateContent
