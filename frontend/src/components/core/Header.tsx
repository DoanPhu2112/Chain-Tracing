'use client'

import React from 'react'

import MobileSidebar from './header/MobileSidebar'
import HeadBreadcrumb from './header/Breadcrumb'

import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RiUserLine } from '@remixicon/react'

const Header = () => {
  const [user, setUser] = React.useState<string | null>(null)
  const [address, setAddress] = React.useState<string>('')
  const router = useRouter()

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && address.trim() !== '') {
      router.push(`/address/${address.trim()}`)
    }
  }
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const account = localStorage.getItem('chain-tracing:account')
      setUser(account)
    }
  }, [])

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:pt-3.5 sm:static sm:h-auto sm:border-0 sm:bg-transparent">
        <MobileSidebar />
        <HeadBreadcrumb />
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            onClick={() => handleSearch}
          />
          <Input
            type="search"
            placeholder="Search Address here"
            className="cursor-pointer w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[500px]"
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <RiUserLine className="h-6 w-6 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <div className=" border-2 px-3 py-1">Login</div>
          </Link>
        )}
      </header>
      <hr />
    </>
  )
}

export default Header
