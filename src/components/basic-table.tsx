/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface BasicTableProps<T> {
  data: T[]
  columns: ColumnDef<T, any>[]
  initialSorting?: SortingState
  initialColumnFilters?: ColumnFiltersState
  initialColumnVisibility?: VisibilityState
}

export function BasicTable<T>({
  data,
  columns,
  initialSorting = [],
  initialColumnFilters = [],
  initialColumnVisibility = {},
}: BasicTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    initialColumnFilters
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility)

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-lg border">
        <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                    {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
                ))}
            </TableRow>
            ))}
        </TableHeader>
        <TableBody>
            {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))}
                </TableRow>
            ))
            ) : (
            <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-4">
                No data available.
                </TableCell>
            </TableRow>
            )}
        </TableBody>
        </Table>
    </div>
  )
}
