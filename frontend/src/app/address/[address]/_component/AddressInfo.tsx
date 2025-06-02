'use client'
import React, { Suspense, useState } from 'react'
import { useParams } from 'next/navigation'

import OverallInfoCard from './OverallInfoCard'
import TabCard from './TabCard'
import OverallInfoCardSkeleton from './OverallInfoCardSkeleton'
import TabCardSkeleton from './TabCardSkeleton'

const AddressInfo = () => {
  const params = useParams<{ address: string }>()
  //@ts-ignore
  const address = params.address

  const [currentTab, setCurrentTab] = useState('tornado')

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div>
        <Suspense fallback={<OverallInfoCardSkeleton />}>
          <OverallInfoCard address={address} />
        </Suspense>
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Suspense fallback={<TabCardSkeleton />}>
          <TabCard address={address} setCurrentTab={setCurrentTab} />
        </Suspense>
      </div>
    </div>
  )
}

export default AddressInfo
