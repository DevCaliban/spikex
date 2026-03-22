"use client";

import { InvoiceCreateData, ShipmentListItem, PaginatedResponse, PAYMENT_STATUS_OPTIONS } from "@/lib/types";
import api from "@/lib/api";
import { useState, useEffect, useRef, useCallback } from "react";

interface InvoiceFormProps {
  onSubmit: (data: InvoiceCreateData) => Promise<void>;
  loading?: boolean;
}

export default function InvoiceForm({ onSubmit, loading }: InvoiceFormProps) {
  const [selectedShipment, setSelectedShipment] = useState<ShipmentListItem | null>(null);
  const [shipmentSearch, setShipmentSearch] = useState("");
  const [shipmentResults, setShipmentResults] = useState<ShipmentListItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [formData, setFormData] = useState({
    shipping_fee: "",
    tax_rate: "0",
    discount: "0",
    notes: "",
    payment_status: "unpaid",
    issued_date: today,
    due_date: thirtyDaysLater,
  });

  // Calculate live totals
  const shippingFee = parseFloat(formData.shipping_fee) || 0;
  const taxRate = parseFloat(formData.tax_rate) || 0;
  const discount = parseFloat(formData.discount) || 0;
  const taxAmount = (shippingFee * taxRate) / 100;
  const total = shippingFee + taxAmount - discount;

  const fetchShipments = useCallback(async (query: string) => {
    setSearchLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.append("search", query);
      const res = await api.get<PaginatedResponse<ShipmentListItem>>(
        `/shipments/?${params}`
      );
      setShipmentResults(res.data.results);
    } catch {
      setShipmentResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Load shipments on mount
  useEffect(() => {
    fetchShipments("");
  }, [fetchShipments]);

  // Debounced search when typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchShipments(shipmentSearch);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [shipmentSearch, fetchShipments]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    await onSubmit({
      shipment: selectedShipment.id,
      ...formData,
    });
  };

  const fmt = (val: number) =>
    val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1: Select Shipment */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900">Select Shipment</h2>
        </div>

        {selectedShipment ? (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="font-mono font-bold text-red-600">{selectedShipment.tracking_code}</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                  <div>
                    <span className="text-gray-400">Sender: </span>
                    <span className="text-gray-700">{selectedShipment.sender_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Receiver: </span>
                    <span className="text-gray-700">{selectedShipment.receiver_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">From: </span>
                    <span className="text-gray-700">{selectedShipment.origin}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">To: </span>
                    <span className="text-gray-700">{selectedShipment.destination}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedShipment(null);
                  setShipmentSearch("");
                }}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <div ref={dropdownRef} className="relative">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={shipmentSearch}
                onChange={(e) => {
                  setShipmentSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search or select a shipment..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                </div>
              )}
            </div>

            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {shipmentResults.length === 0 && !searchLoading ? (
                  <div className="p-4 text-sm text-gray-500 text-center">
                    No shipments found
                  </div>
                ) : (
                  shipmentResults.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedShipment(s);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-medium text-red-600 text-sm">
                          {s.tracking_code}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          s.current_status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {s.status_display}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {s.sender_name} → {s.receiver_name} &middot; {s.origin} → {s.destination}
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 2: Pricing */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900">Pricing</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shipping Fee ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="shipping_fee"
              value={formData.shipping_fee}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Rate (%)
            </label>
            <input
              type="number"
              name="tax_rate"
              value={formData.tax_rate}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="100"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount ($)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
        </div>

        {/* Live calculation */}
        <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span>${fmt(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax ({fmt(taxRate)}%)</span>
              <span>${fmt(taxAmount)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount</span>
                <span>-${fmt(discount)}</span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span>${fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Invoice Details */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900">Invoice Details</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issued Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="issued_date"
              value={formData.issued_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              name="payment_status"
              value={formData.payment_status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white"
            >
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Any additional notes for this invoice..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !selectedShipment || !formData.shipping_fee}
          className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Creating Invoice...
            </>
          ) : (
            "Create Invoice"
          )}
        </button>
      </div>
    </form>
  );
}
