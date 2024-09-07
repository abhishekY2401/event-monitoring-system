"use client";

import PropTypes from "prop-types"; 

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const columns = [

  {
    accessorKey: "request_id",
    header: "Request ID",
    cell: ({ row }) => <div>{row.getValue("request_id")}</div>,
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("author")}</div>
    ),
  },
  {
    accessorKey: "action-type",
    header: () => <div>Action</div>,
    cell: ({ row }) => {
      const actions = row.getValue("action-type");

      return <div className="font-medium">{actions}</div>;
    },
  },
  {
    accessorKey: "from_branch",
    header: () => <div>Source Branch</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("from_branch")}</div>;
    },
  },
  {
    accessorKey: "to_branch",
    header: () => <div>Destination Branch</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("to_branch") ? row.getValue("to_branch") : "null"}</div>;
    },
  },
  {
    accessorKey: "timestamp",
    header: () => <div>Timestamp</div>,
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp");
      const utcDate = new Date(timestamp).toUTCString(); // Convert to UTC format
      return <div className="font-medium">{utcDate}</div>;
    },
  },
];

export const EventTable = ({ events }) => {
  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="rounded-md border bg-gray-800 text-white dark:bg-gray-900 dark:border-gray-700">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="bg-gray-700 text-white dark:bg-gray-800">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-700 dark:hover:bg-gray-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="bg-gray-900 text-white dark:bg-gray-800">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-400 dark:text-gray-600"
                  
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground dark:text-gray-400">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

// Add propTypes validation
EventTable.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      request_id: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      "action-types": PropTypes.string.isRequired,
      from_branch: PropTypes.string.isRequired,
      to_branch: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
};