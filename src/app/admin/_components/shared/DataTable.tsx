"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationProperties } from "@/components/shared/Pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { useQueryState } from "nuqs";
import { isFeaturedParams } from "@/hooks/use-featured-params";
import { toUpperCase } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const [isFeatured, setIsFeatured] = useQueryState(
    "isFeatured",
    isFeaturedParams.isFeatured.withOptions({
      shallow: false,
      scroll: false,
    })
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="featuredOnly"
          checked={isFeatured}
          onCheckedChange={checked => setIsFeatured(checked ? true : false)}
        />
        <label htmlFor="featuredOnly" className="text-white">
          {toUpperCase("მხოლოდ რჩეულები")}
        </label>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pageCount > 1 && (
        <PaginationProperties pageCount={pageCount} className="my-10" />
      )}
    </div>
  );
}
