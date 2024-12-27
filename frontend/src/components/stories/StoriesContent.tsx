'use client'
import React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import TxDataTableCard from '../card/TxDataTableCard'
import TxDataVisualizeCard from '../card/TxDataVisualizeCard'
import { TransactionsList } from '@/types/transaction.interface'

const StoriesContent = () => {
  const [txList, setTxList] = useState<TransactionsList>([])

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 max-w-[1280px]">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
        <TxDataTableCard onUpdate={setTxList} />
        <TxDataVisualizeCard txList={txList} />
      </div>
    </main>
  )
}

export default StoriesContent
