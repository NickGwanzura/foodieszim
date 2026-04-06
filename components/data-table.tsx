'use client';

import { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, keyExtractor, emptyMessage = 'No data available' }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-[#e0e0e0]">
        <p className="text-sm text-[#525252]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[640px] border-collapse border border-[#e0e0e0] bg-white">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="bg-[#f4f4f4] px-3 sm:px-4 py-2.5 text-left text-xs font-semibold text-[#525252] uppercase tracking-wide border-b border-[#e0e0e0] whitespace-nowrap"
                style={{ fontFamily: 'var(--font-mono)', width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="transition-colors hover:bg-[#f4f4f4]">
              {columns.map((col) => (
                <td key={col.key} className="px-3 sm:px-4 py-3 border-b border-[#e0e0e0] text-sm align-middle">
                  {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
