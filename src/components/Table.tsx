/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  id?: string;
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
}

/**
 * Standard badge coloring function based on the status text
 */
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const norm = status.toLowerCase().replace(/[^a-z0-9]/g, '');

  let styles = 'bg-slate-100 text-slate-600 border-slate-200'; // Default gray
  
  // Green for Available, Active, Completed, Yes
  if (['available', 'active', 'completed', 'yes', 'completedtrip'].includes(norm)) {
    styles = 'bg-emerald-100/60 text-emerald-800 border-emerald-200';
  } 
  // Teal for OnTrip, Dispatched, OffDuty
  else if (['ontrip', 'dispatched', 'offduty'].includes(norm)) {
    styles = 'bg-teal-100/60 text-teal-800 border-teal-200';
  } 
  // Orange for InShop, Maintenance, Draft, Pending
  else if (['inshop', 'maintenance', 'draft', 'pending'].includes(norm)) {
    styles = 'bg-amber-100/60 text-amber-800 border-amber-200';
  } 
  // Red for Retired, Suspended, Cancelled, Inactive, No
  else if (['retired', 'suspended', 'cancelled', 'inactive', 'no'].includes(norm)) {
    styles = 'bg-rose-100/60 text-rose-800 border-rose-200';
  }

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${styles}`}>
      <span className={`w-1 h-1 rounded-full mr-1 shrink-0 ${
        ['available', 'active', 'completed', 'yes', 'completedtrip'].includes(norm) ? 'bg-emerald-500' :
        ['ontrip', 'dispatched', 'offduty'].includes(norm) ? 'bg-teal-500' :
        ['inshop', 'maintenance', 'draft', 'pending'].includes(norm) ? 'bg-amber-500' :
        'bg-rose-500'
      }`} />
      {status}
    </span>
  );
};

export function Table<T extends Record<string, any>>({
  id,
  columns,
  data,
  onRowClick,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;

    const sorted = [...data].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortKey, sortOrder]);

  return (
    <div id={id} className="w-full overflow-x-auto rounded border border-slate-200 bg-white shadow-2xs">
      <table className="w-full min-w-max border-collapse text-left text-xs text-slate-600">
        <thead className="bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable !== false && handleSort(col.key)}
                className={`py-2 px-3.5 select-none ${
                  col.sortable !== false ? 'cursor-pointer hover:bg-slate-200/50 hover:text-slate-900 transition-colors' : ''
                }`}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable !== false && (
                    <span>
                      {sortKey === col.key ? (
                        sortOrder === 'asc' ? (
                          <ChevronUp className="w-3 h-3 text-teal-600" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-teal-600" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-150">
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-6 text-center text-slate-400 font-medium">
                No matching records found.
              </td>
            </tr>
          ) : (
            sortedData.map((item, rowIndex) => (
              <tr
                key={item.id || rowIndex}
                onClick={() => onRowClick && onRowClick(item)}
                className={`group border-b border-slate-150 last:border-0 odd:bg-white even:bg-slate-50/30 hover:bg-teal-50/20 transition-all ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((col) => {
                  const cellValue = item[col.key];
                  return (
                    <td key={col.key} className="py-1.5 px-3.5 text-slate-700 font-semibold whitespace-nowrap">
                      {col.render ? (
                        col.render(item)
                      ) : col.key.toLowerCase().includes('status') ? (
                        <StatusBadge status={String(cellValue)} />
                      ) : (
                        cellValue !== undefined && cellValue !== null ? String(cellValue) : '-'
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
