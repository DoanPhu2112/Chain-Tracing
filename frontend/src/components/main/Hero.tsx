'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { HeroCards } from './HeroCards'
import { Input } from '@/components/ui/input'

export const Hero = () => {
  const [inputValue, setInputValue] = useState('')
  const router = useRouter()

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      router.push(`/address/${inputValue.trim()}`)
    }
  }

  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl-bold md:text-8xl-bold">
          <h1 className="inline">
            Chain{' '}
            <span className="inline bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
              Tracing
            </span>
          </h1>
        </main>

        <p className="text-3xl-medium text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          For a better blockchain environment
        </p>

        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}

          className="w-full min-h-16 rounded-full px-6 placeholder:text-xl-regular text-xl-medium"
          placeholder="Address / Contract / Report / URL"
        />
      </div>

      {/* Hero cards section */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  )
}
