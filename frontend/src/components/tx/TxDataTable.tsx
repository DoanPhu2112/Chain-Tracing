'use client'

import * as React from 'react'
import useDebounce from '@/lib/useDebounce'
import { useEffect, useState, useMemo } from 'react'
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Check, X } from 'lucide-react'
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
import { DataTablePagination } from './DataTablePagination'
import transactions_json from '@/mocks/transactions.json'
import { Transaction, TransactionsList } from '@/types/transaction.interface'
import { getAddressTransactions } from '@/services/address'

// Define a custom TableMeta type
interface CustomTableMeta extends TableMeta<Transaction> {
  toggleAdd: (transaction: Transaction) => void
}

const initialTransactions = transactions_json.map((txn) => ({
  ...txn,
  added: false,
}))

interface TxDataTableProps {
  onUpdate: (txList: TransactionsList) => void
}

const TxDataTable: React.FC<TxDataTableProps> = ({ onUpdate }) => {
  const [searchTransaction, setSearchTransaction] =
    useState<Transaction[]>(initialTransactions)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isClient, setIsClient] = useState(false)

  const [data, setData] = useState<TransactionsList>([])
  const [isLoading, setIsLoading] = useState(false) //TODO: skeleton loading
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500) // Debounce the search
  const [totalCount, setTotalCount] = useState(0)
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [addedTransactions, setAddedTransactions] = useState<TransactionsList>([])
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
                <p>{isAdded ? 'Remove from story' : 'Add to story'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },

    {
      accessorKey: 'chainId',
      header: 'Chain ID',
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue('chainId') as string}</Badge>
      ),
    },
    {
      accessorKey: 'txnHash',
      header: 'Transaction Hash',
      cell: ({ row }) => (
        <div className="truncate max-w-xs">{row.getValue('txnHash')}</div>
      ),
    },
    {
      accessorKey: 'tokenName',
      header: 'Token Name',
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue('tokenName') as string}</Badge>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue('type') as string}</Badge>
      ),
    },

    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">{row.getValue('amount')}</div>
      ),
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(transaction.txnHash)}
              >
                Copy transaction hash
              </DropdownMenuItem>
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
  useEffect(() => {
    console.log(addedTransactions.length)
    onUpdate(addedTransactions)
  }, [addedTransactions])
  useEffect(() => {
    const params = new URLSearchParams({
      search: debouncedSearch,
      pageNumber: (pageIndex + 1).toString(),
      pageSize: pageSize.toString(),
      ...(sorting.length > 0 && {
        sortBy: sorting[0].id,
        sortOrder: sorting[0].desc ? 'desc' : 'asc',
      }),
    })

    console.log('🚩🚩' + params.toString())
    setIsLoading(true)
    const filteredData = searchTransaction
    const sortedData = filteredData

    // Paginate the data
    const paginatedData = sortedData.slice(
      pageIndex * pageSize,
      (pageIndex + 1) * pageSize
    )

    setTimeout(() => {
      setData(paginatedData)
      setTotalCount(filteredData.length)
      setIsLoading(false)
    }, 500) // Simulate network delay
  }, [searchTransaction, debouncedSearch, sorting, pageIndex, pageSize])

  async function handleFilterTransaction() {
    const transactionList = await getAddressTransactions(search)
    console.log('transactionList ', transactionList)
    setSearchTransaction(transactionList)
  }
  useEffect(() => {
    if (!search) {
      return
    }
    console.log('SEARCH: ' + search)
    //TODO: Check search is transaction or account address
    handleFilterTransaction()
  }, [search])

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
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
      {isClient && (
        <div>
          <h2>Added Transactions</h2>
          <ul>
            {addedTransactions.map((txn) => (
              <li key={txn.txnHash}>
                {txn.txnHash} - {txn.type} - {txn.status} - {txn.date} - {txn.amount}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default TxDataTable
// TODO: fix lỗi filter
