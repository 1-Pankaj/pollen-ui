"use client";

import {
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import {
  IconChevronDown as ChevronDown,
  IconChevronUp as ChevronUp,
} from "../icons";
import { cn } from "../lib/utils";

export function Table({
  className,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full caption-bottom border-collapse text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn(className)} {...props} />;
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn(className)} {...props} />;
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("transition-colors duration-100 hover:bg-fill/60", className)}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-11 bg-fill/60 px-4 text-left align-middle text-[13px] font-medium text-faint first:rounded-tl-xl last:rounded-tr-xl",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("px-4 py-3.5 align-middle", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------
   DataTable: the opinionated layer on top of the primitives.
   Pass columns and rows, get sorting for free. Sort state lives
   here; rendering stays in the primitives so markup is identical
   to a hand-written Table.
   ------------------------------------------------------------------ */

export type SortDirection = "asc" | "desc";

export interface DataTableColumn<T> {
  /** Stable key. Also the initial sort handle. */
  key: string;
  header: string;
  /** Clicking the header sorts by this column. Requires value(). */
  sortable?: boolean;
  align?: "left" | "right";
  /** Numeric or string value read off a row; drives sorting. */
  value?: (row: T) => string | number;
  /** Custom cell rendering. Defaults to the value formatted as text. */
  cell?: (row: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Stable React key per row. */
  getRowId: (row: T) => string;
  /** Column the table starts sorted by. */
  initialSort?: { key: string; dir: SortDirection };
  /** Makes rows clickable; rows become keyboard-activatable (Enter/Space). */
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns = [],
  rows = [],
  getRowId,
  initialSort,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: SortDirection } | null>(
    initialSort ?? null,
  );

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((c) => c.key === sort.key);
    if (!column?.value) return rows;
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = column.value!(a);
      const vb = column.value!(b);
      if (typeof va === "number" && typeof vb === "number") {
        return (va - vb) * factor;
      }
      return String(va).localeCompare(String(vb)) * factor;
    });
  }, [rows, columns, sort]);

  const cycle = (key: string) => {
    setSort((current) => {
      if (current?.key !== key) return { key, dir: "asc" };
      if (current.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((column) => {
              const isSorted = sort?.key === column.key;
              const ariaSort = isSorted
                ? sort!.dir === "asc"
                  ? ("ascending" as const)
                  : ("descending" as const)
                : undefined;
              const content = (
                <span
                  className={cn(
                    "inline-flex items-center gap-1",
                    column.sortable && "transition-colors group-hover:text-foreground",
                  )}
                >
                  {column.header}
                  {column.sortable && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "transition-opacity",
                        isSorted ? "opacity-100" : "opacity-0 group-hover:opacity-50",
                      )}
                    >
                      {isSorted && sort!.dir === "asc" ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </span>
                  )}
                </span>
              );
              return (
                <th
                  key={column.key}
                  aria-sort={ariaSort}
                  className={cn(
                    "h-11 bg-fill/60 px-4 text-left align-middle text-[13px] font-medium text-faint first:rounded-tl-xl last:rounded-tr-xl",
                    column.align === "right" && "text-right",
                    column.className,
                  )}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => cycle(column.key)}
                      className="group -mx-1 inline-flex h-7 items-center rounded-md px-1 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/30"
                    >
                      {content}
                    </button>
                  ) : (
                    <span className={column.sortable ? "group" : undefined}>
                      {column.header}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={getRowId(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    }
                  : undefined
              }
              className={cn(
                "transition-colors duration-100 hover:bg-fill/60",
                onRowClick &&
                  "cursor-pointer focus-visible:outline-none focus-visible:bg-fill/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/40",
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "px-4 py-3.5 align-middle",
                    column.align === "right" && "text-right",
                    column.className,
                  )}
                >
                  {column.cell ? column.cell(row) : String(column.value?.(row) ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
