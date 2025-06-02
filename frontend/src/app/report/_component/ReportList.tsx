'use client'

import React from 'react'
import Link from 'next/link'

import { ReportCard } from './ReportCard'
import { Button } from '@/components/button'
import { useReports } from '@/api/hooks/use-reports'

const ReportList = () => {
  const { data: reports } = useReports()
  return (
    <div className="grid flex-1 items-start gap-4 py-4 sm:px-96 md:gap-8">
      <div className="w-full">
        <h1 className="text-4xl-bold font-sans">Scam Report</h1>
      </div>
      <div className="flex justify-end">
        <Link href="/report/create-report">
          <Button variant="danger" className="text-label-lg-pri">
            Create your report
          </Button>
        </Link>
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        {/* <InputCard setIsLoading={setIsLoading}/> */}
        {reports.map((r) => (
          <ReportCard
            key={r.reportId}
            reportId={r.reportId}
            category={r.category}
            description={r.description}
            reporter={r.reporter}
            reportedAddresses={r.reportedAddresses}
            reportedDomain={r.reportedDomain}
            timestamp={r.timestamp}
          />
        ))}
      </div>
    </div>
  )
}

export default ReportList
