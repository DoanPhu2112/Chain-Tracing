'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

// type HeadBreadcrumbProps = {};

const HeadBreadcrumb = () => {
  const paths = usePathname()
  const pathNames = paths?.split('/').filter((path) => path)
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/home">
              <Home />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathNames &&
          pathNames.length > 0 &&
          pathNames.map((name: string, index: number) => {
            const isLast = index === pathNames.length - 1
            const href = `/${pathNames.slice(0, index + 1).join('/')}`
            name = name[0].toUpperCase() + name.substring(1)
            if (name === 'Home') return null

            return (
              <React.Fragment key={name}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{name}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default HeadBreadcrumb
