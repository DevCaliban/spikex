"use client";

import { getStatusColor, ShipmentListItem } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";

interface ShipmentTableProps {
  shipments: ShipmentListItem[];
  loading?: boolean;
  sortField?: string;
  sortDir?: "asc" | "desc";
  onSort?: (field: string) => void;
  selectable?: boolean;
  selectedIds?: Set<number>;
  onSelect?: (id: number) => void;
  onSelectAll?: () => void;
}

function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {});
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-1.5 text-gray-400 hover:text-gray-600 transition-colors"
      title="Copy tracking code"
    >
      {copied ? (
        <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
      )}
    </button>
  );
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

export default function ShipmentTable({
  shipments,
  loading,
  sortField,
  sortDir,
  onSort,
  selectable,
  selectedIds,
  onSelect,
  onSelectAll,
}: ShipmentTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="animate-pulse p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-4 bg-gray-200 rounded w-28" />
              <div className="h-4 bg-gray-200 rounded flex-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="text-gray-500 font-medium">No shipments found</p>
        <p className="text-sm text-gray-400 mt-1">
          Create your first shipment to get started.
        </p>
      </div>
    );
  }

  const allSelected = selectedIds && shipments.every((s) => selectedIds.has(s.id));

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {selectable && (
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onSelectAll}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                </th>
              )}
              <SortHeader label="Tracking Code" field="tracking_code" currentField={sortField} currentDir={sortDir} onSort={onSort} />
              <SortHeader label="Sender" field="sender_name" currentField={sortField} currentDir={sortDir} onSort={onSort} />
              <SortHeader label="Receiver" field="receiver_name" currentField={sortField} currentDir={sortDir} onSort={onSort} />
              <SortHeader label="Route" field="origin" currentField={sortField} currentDir={sortDir} onSort={onSort} className="hidden md:table-cell" />
              <SortHeader label="Status" field="current_status" currentField={sortField} currentDir={sortDir} onSort={onSort} />
              <SortHeader label="Date" field="created_at" currentField={sortField} currentDir={sortDir} onSort={onSort} className="hidden sm:table-cell" />
              <th className="px-4 py-3 text-right font-semibold text-gray-600 w-16" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {shipments.map((shipment) => (
              <tr
                key={shipment.id}
                className={`hover:bg-gray-50 transition-colors ${
                  selectedIds?.has(shipment.id) ? "bg-red-50/50" : ""
                }`}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds?.has(shipment.id) || false}
                      onChange={() => onSelect?.(shipment.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </td>
                )}
                <td className="px-4 py-3">
                  <span className="inline-flex items-center">
                    <span className="font-mono font-medium text-gray-900">
                      {shipment.tracking_code}
                    </span>
                    <CopyButton text={shipment.tracking_code} />
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">{shipment.sender_name}</td>
                <td className="px-4 py-3 text-gray-700">{shipment.receiver_name}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                  <span className="flex items-center gap-1">
                    {shipment.origin}
                    <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    {shipment.destination}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      shipment.current_status
                    )}`}
                  >
                    {shipment.status_display}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">
                  {new Date(shipment.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/shipments/${shipment.id}`}
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
