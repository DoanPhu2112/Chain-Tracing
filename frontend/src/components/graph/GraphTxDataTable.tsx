'use client'

import * as React from 'react'
import useDebounce from '@/lib/useDebounce'
import { useEffect, useState, useMemo } from 'react'
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  TableMeta,
  PaginationState,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { File, ListFilter } from 'lucide-react'

// Import the JSON data
import { DataTablePagination } from '@/components/tx/DataTablePagination'
import transactions_json from '@/mocks/transactions.json'
import { Transaction } from '@/types/transaction.interface'

const assetColorMapping: { [key: string]: string } = {
  ETH: '#627eea', // Ethereum - Iconic Blue
  '1INCH': '#2e5aa8', // 1INCH - Dark Blue
  ANKR: '#1a66ff', // ANKR - Blue
  AXS: '#0053ff', // AXS - Bright Blue
  REEF: '#ff007a', // REEF - Hot Pink
  SUSHI: '#d7627c', // SUSHI - Pinkish Red
  LRC: '#2ab6f6', // Loopring (LRC) - Light Blue
  MANA: '#ff2d55', // Decentraland (MANA) - Bright Red
  BAT: '#ff5000', // Basic Attention Token (BAT) - Orange
  DEXE: '#ff8a00', // Dexe - Orange Shade
  FTT: '#50bbf6', // FTX Token (FTT) - Light Blue
  SNX: '#00d1ff', // Synthetix (SNX) - Cyan
  UNI: '#ff007a', // Uniswap (UNI) - Pink
  CRV: '#ff5a01', // Curve DAO Token (CRV) - Orange/Red
  NMR: '#f78f1e', // Numeraire (NMR) - Orange
  RLC: '#ffd700', // iExec RLC (RLC) - Gold
  GRT: '#6742c3', // The Graph (GRT) - Purple
  LINK: '#375bd2', // Chainlink (LINK) - Blue
  SHIB: '#fabe47', // Shiba Inu (SHIB) - Golden Yellow
  COMP: '#00d395', // Compound (COMP) - Green/Cyan
  KNC: '#31cb9e', // Kyber Network (KNC) - Green
  CHZ: '#d05b4b', // Chiliz (CHZ) - Red/Brown
  SAND: '#04c0f1', // The Sandbox (SAND) - Bright Blue
  ENJ: '#624dbf', // Enjin Coin (ENJ) - Purple
  MKR: '#1abc9c', // Maker (MKR) - Teal
  REN: '#001b3a', // REN - Dark Blue/Black
  AAVE: '#b6509e', // Aave (AAVE) - Purple/Pink
  BNT: '#0000ff', // Bancor (BNT) - Blue
  ZRX: '#1f82c4', // 0x (ZRX) - Blue
  HOT: '#00a6c6', // Holo (HOT) - Cyan
  ALPHA: '#5e5ce6', // Alpha Finance (ALPHA) - Purple/Blue
  KNCL: '#32cd32', // Kyber Network Crystal Legacy (KNCL) - Lime Green
}

const SkeletonRow: React.FC = () => (
  <TableRow>
    <TableCell>
      <div className="my-2 w-0 "></div>
    </TableCell>
    <TableCell>
      <div className="my-2 h-6 bg-gray-300 rounded-md w-full animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="my-2 h-6 bg-gray-300 rounded-md w-full animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="my-2 h-6 bg-gray-300 rounded-md w- animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="my-2 h-6 bg-gray-300 rounded-md w-full animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="my-2 h-6 bg-gray-300 rounded-md w-full animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="my-2 h-6 bg-gray-300 rounded-md w-full animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="my-2 w-0 "></div>
    </TableCell>
  </TableRow>
)

//! NEW

// Define a custom TableMeta type
interface CustomTableMeta extends TableMeta<Transaction> {
  toggleAdd: (transaction: Transaction) => void
}

const initialTransactions = transactions_json.map((txn) => ({
  ...txn,
  added: false,
}))

interface GraphTxDataTableProps {
  txs: Transaction[]
  loading: boolean
}

const GraphTxDataTable: React.FC<GraphTxDataTableProps> = ({ txs, loading }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isClient, setIsClient] = useState(false)

  const [data, setData] = useState<Transaction[]>([])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500) // Debounce the search
  const [totalCount, setTotalCount] = useState(0)
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [addedTransactions, setAddedTransactions] = useState<Transaction[]>([])
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )
  const columns: ColumnDef<Transaction>[] = [
    {
      id: 'add',
      enableHiding: false,
      cell: ({ row, table }) => {
        const transaction = row.original
        const isAdded = addedTransactions.some(
          (addedTxn: Transaction) => addedTxn.txnHash === transaction.txnHash
        )

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  {!isAdded ? (
                    <Button
                      className="w-10"
                      variant="outline"
                      onClick={() =>
                        (table.options.meta as CustomTableMeta).toggleAdd(transaction)
                      }
                    >
                      +
                    </Button>
                  ) : (
                    <Button
                      className="w-10"
                      variant="default"
                      onClick={() =>
                        (table.options.meta as CustomTableMeta).toggleAdd(transaction)
                      }
                    >
                      -
                    </Button>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isAdded ? 'Remove transaction from graph' : 'Add transaction to graph'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: 'hash',
      header: 'Transaction Hash',
      cell: ({ row }) => {
        const hash: string = row.getValue('hash') ? row.getValue('hash') :  '0xbc44d53298a03a181702194df3b768bcea05df2be01509c99de03d9f1e583fca'
        // console.log("Hash", row.getValue('hash'))
        // console.log("txnHash",row.getValue('txnHash'))
        const shortenedHash = `${hash.slice(0, 6)}...${hash.slice(-6)}`
        return <div className="truncate max-w-xs">{shortenedHash}</div>
      },
    },
    // {
    //   accessorKey: 'from',
    //   header: 'From',
    //   cell: ({ row }) => <div>{row.getValue('from')}</div>,
    // },
    {
      accessorKey: 'to',
      header: 'To',
      cell: ({ row }) => {
        const hash: string = row.getValue('to').address
        console.log("Hash: ", hash)
        const shortenedHash = `${hash.slice(0, 6)}...${hash.slice(-6)}`
        return <div className="text-blue-600 truncate max-w-xs">{shortenedHash}</div>
      },
    },
    {
      accessorKey: 'value',
      header: () => <div className="text-right">Value</div>,
      cell: ({ row }) => {
        const value: string = row.getValue('value') ? row.getValue('value') : 13;
        console.log("Value ", value)
        const formattedValue = parseFloat(value).toFixed(5) // Ensure 5 decimal places
        const valueString = value.toString() // Convert value to string for splitting
        const hasMoreDecimals =
          valueString.includes('.') && valueString.split('.')[1].length > 5

        return (
          <div className="text-right font-medium">
            {formattedValue}
            {hasMoreDecimals && '..'}
          </div>
        )
      },
    },
    {
      accessorKey: 'asset',
      header: 'Asset',
      cell: ({ row }) => {
        const asset: string = row.getValue('asset')
        const color = assetColorMapping[asset] || '#000000' // Fallback to black if asset not found

        return (
          <Badge variant="outline" style={{ borderColor: color }}>
            {asset}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('category')}</Badge>,
    },
    {
      accessorKey: 'blockNum',
      header: 'Block Number',
      cell: ({ row }) => <div>{row.getValue('blockNum')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const transaction = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {transaction.txnHash && (
                <DropdownMenuItem
                  //@ts-ignore
                  onClick={() => navigator.clipboard.writeText(transaction.hash)}
                >
                  Copy transaction hash
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable<Transaction>({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    manualSorting: true,
    onSortingChange: setSorting,

    manualPagination: true,
    onPaginationChange: setPagination,

    enableGlobalFilter: true,
    manualFiltering: true,
    onGlobalFilterChange: setSearch,

    pageCount: Math.ceil(totalCount / pageSize),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: search,
    },
    meta: {
      toggleAdd: (transaction: Transaction) => {
        setAddedTransactions((current) => {
          const exists = current.some((txn) => txn.txnHash === transaction.txnHash)
          if (exists) {
            // Remove the transaction if it exists
            return current.filter((txn) => txn.txnHash !== transaction.txnHash)
          } else {
            // Add the transaction if it doesn't exist
            return [...current, { ...transaction, added: true }]
          }
        })
      },
    } as CustomTableMeta, // Cast to CustomTableMeta
  })

  useEffect(() => {
    setIsClient(true)
    setTotalCount(table.getFilteredRowModel().rows.length)
  }, [])
  useEffect(() => {}, [addedTransactions, data])
  useEffect(() => {
    const filteredData = txs
    const sortedData = filteredData

    // Paginate the data
    const paginatedData = sortedData.slice(
      pageIndex * pageSize,
      (pageIndex + 1) * pageSize
    )

    setTimeout(() => {
      setData(paginatedData)
      setTotalCount(filteredData.length)
    }, 500) // Simulate network delay
  }, [debouncedSearch, sorting, pageIndex, pageSize])
  useEffect(() => {
    setData(txs)
    console.log(txs)
  }, [txs])

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder="Filter by ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="gap-1 text-sm items-center">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Export</span>
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              loading ? (
                table.getRowModel().rows.map((row) => <SkeletonRow key={row.id} />)
              ) : (
                txs &&
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* {JSON.stringify(txs)} */}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {addedTransactions.length} of {table.getFilteredRowModel().rows.length}{' '}
          transaction(s) selected.
        </div>
        <div className="py-4">
          <DataTablePagination table={table} totalCount={totalCount} />
        </div>
      </div>
      {/* {isClient && (
        <div>
          <h2>Added Transactions</h2>
          <ul>{JSON.stringify(addedTransactions)}</ul>
        </div>
      )} */}
    </div>
  )
}

export default GraphTxDataTable
// TODO: fix lỗi filter
