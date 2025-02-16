import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import InputCard from '../card/InputCard'
import InfoCard from '../card/InfoCard'
// import TxInfoCard from '../card/TxInfoCard'
import TableCard from '../card/TableCard'

const InvestigateContent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  if (isLoading) {

  }
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <InputCard setIsLoading={setIsLoading}/>
        <TableCard />
      </div>
      <div>{/* <TxInfoCard /> */}</div>
    </main>
  )
}

export default InvestigateContent
