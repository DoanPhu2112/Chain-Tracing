import React from 'react'
import { File, ListFilter } from 'lucide-react'
import { MdExpandCircleDown } from 'react-icons/md'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

const TabCardSkeleton = () => {
  const handleCopy = (txnHash: string) => {
    navigator.clipboard.writeText(txnHash).catch(console.error)
  }

  return (
    <Tabs defaultValue="tornado" className="w-full">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="tornado">Tornado Analytic</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Example 1</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Example 2</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Export</span>
          </Button>
        </div>
      </div>

      {/* Portfolio Tab */}
      <TabsContent value="portfolio">
        <div className="grid gap-4 my-4 xl:grid-cols-1 xl:w-3/5">
          {/* Portfolio Chart Placeholder */}
          <div className="h-64 bg-muted rounded" />
        </div>
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Portfolio</CardTitle>
            <CardDescription>Portfolio description placeholder</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead className="hidden sm:table-cell">Portfolio %</TableHead>
                  <TableHead className="hidden md:table-cell">Amount</TableHead>
                  <TableHead className="hidden md:table-cell text-right">
                    Value (in $)
                  </TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody></TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tornado Tab */}
      <TabsContent value="tornado" className="flex flex-col gap-4">
        {/* Placeholder for Overview Charts */}
        <div className="h-40 bg-muted rounded" />

        <Tabs defaultValue="linked" className="w-full px-2">
          <TabsList className="w-full justify-start mb-4 bg-base-empty gap-2">
            <TabsTrigger value="linked" className="rounded-full px-3 py-1 bg-muted">
              Linked Address
            </TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-full px-3 py-1 bg-muted">
              Timeline
            </TabsTrigger>
          </TabsList>

          {/* Linked Addresses Table */}
          <TabsContent value="linked">
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Addresses</CardTitle>
                <CardDescription>Clustered addresses placeholder</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead className="hidden sm:table-cell">Heuristic</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead className="hidden sm:table-cell">Tags</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">
                        Expand
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge>
                          <Skeleton />
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge>
                          <Skeleton />
                        </Badge>
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <MdExpandCircleDown />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Content */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Timeline</CardTitle>
                <CardDescription>Activity timeline placeholder</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  )
}

export default TabCardSkeleton
