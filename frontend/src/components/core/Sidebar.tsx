'use client'
import * as React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  ScanSearch,
  ChartPie,
  Package2,
  Settings,
  ChartNetwork,
  ScrollText,
  UserRound,
} from 'lucide-react'
// import './Sidebar.css'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const selected = ''

const Sidebar: React.FC = () => {
  const paths = usePathname()
  const pathNames = (paths ?? '').split('/').filter((path) => path)
  const isActive: any = (href: string) => '/' + pathNames[0] === href
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        {/* <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">FE-CHAIN-TRACKING</span>
        </Link> */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/home"
              className={`group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base ${
                isActive('/home')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Home</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/investigate"
              className={`group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base ${
                isActive('/investigate')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <ScanSearch className="h-5 w-5" />
              <span className="sr-only">Investigate</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Investigate</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/graph"
              className={`group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base ${
                isActive('/graph')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <ChartNetwork className="h-5 w-5" />
              <span className="sr-only">Graph</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Graph</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/stories"
              className={`group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base ${
                isActive('/stories')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <ScrollText className="h-5 w-5" />
              <span className="sr-only">Stories</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Stories</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/chart"
              className={`group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base ${
                isActive('/chart')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <ChartPie className="h-5 w-5" />
              <span className="sr-only">Chart</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Chart</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/address"
              className={`group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base ${
                isActive('/address')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <UserRound className="h-5 w-5" />
              <span className="sr-only">Address</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Address</TooltipContent>
        </Tooltip>
      </nav>

      {/* SETTING */}
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  )
}

export default Sidebar
