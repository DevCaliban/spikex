"use client";

import { getPaymentStatusColor, InvoiceListItem } from "@/lib/types";
import Link from "next/link";

interface InvoiceTableProps {
  invoices: InvoiceListItem[];
  loading?: boolean;
  sortField?: string;
  sortDir?: "asc" | "desc";
  onSort?: (field: string) => void;
}

function SortHeader({
  label,
  field,
  currentField,
  currentDir,
  onSort,
  className,
}: {
  label: string;
  field: string;
  currentField?: string;
  currentDir?: "asc" | "desc";
  onSort?: (field: string) => void;
  className?: string;
}) {
  if (!onSort) {
    return (
      <th className={`px-4 py-3 text-left font-semibold text-gray-600 ${className || ""}`}>
        {label}
      </th>
    );
  }

  const isActive = currentField === field || currentField === `-${field}`;
  return (
    <th
      className={`px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:text-gray-900 select-none ${className || ""}`}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <svg className={`w-3 h-3 transition-colors ${isActive ? "text-red-500" : "text-gray-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {currentDir === "asc" && isActive ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          )}
        </svg>
      </span>
    </th>
  );
}

export default function InvoiceTable({
  invoices,
  loading,
  sortField,
  sortDir,
  onSort,
}: InvoiceTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="animate-pulse p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-28" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded flex-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <p className="text-gray-500 font-medium">No invoices found</p>
        <p className="text-sm text-gray-400 mt-1">
          Create your first invoice to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <SortHeader label="Invoice #" field="invoice_number" currentField={sortField} currentDir={sortDir} onSort={onSort} />
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Tracking Code</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Sender</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Receiver</th>
              <SortHeader label="Total" field="total_amount" currentField={sortField} currentDir={sortDir} onSort={onSort} />
              <SortHeader label="Status" field="payment_status" currentField={sortField} currentDir={sortDir} onSort={onSort} />
              <SortHeader label="Issued" field="issued_date" currentField={sortField} currentDir={sortDir} onSort={onSort} className="hidden sm:table-cell" />
              <th className="px-4 py-3 text-right font-semibold text-gray-600 w-16" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-mono font-medium text-gray-900">
                    {inv.invoice_number}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-gray-600 text-xs">
                    {inv.tracking_code}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700 hidden md:table-cell">{inv.sender_name}</td>
                <td className="px-4 py-3 text-gray-700 hidden md:table-cell">{inv.receiver_name}</td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  ${parseFloat(inv.total_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(inv.payment_status)}`}>
                    {inv.payment_status_display}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">
                  {new Date(inv.issued_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/invoices/${inv.id}`}
                    className="text-red-600 hover:text-red-700 font-medium text-xs"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
