"use client";

import AdminLayout from "@/components/AdminLayout";
import api from "@/lib/api";
import { Invoice, getPaymentStatusColor, PAYMENT_STATUS_OPTIONS } from "@/lib/types";
import { generateInvoicePDF } from "@/lib/generateInvoicePDF";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchInvoice = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<Invoice>(`/invoices/${id}/`);
      setInvoice(response.data);
    } catch {
      setError("Failed to load invoice details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!invoice) return;
    setUpdating(true);
    try {
      const response = await api.patch<Invoice>(`/invoices/${id}/`, {
        payment_status: newStatus,
      });
      setInvoice(response.data);
    } catch {
      setError("Failed to update payment status.");
    } finally {
      setUpdating(false);
    }
  };

  const fmt = (val: string | number) =>
    parseFloat(String(val)).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/dashboard" className="hover:text-gray-700">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/invoices" className="hover:text-gray-700">
            Invoices
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            {invoice?.invoice_number || "Loading..."}
          </span>
        </nav>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
          </div>
        )}

        {error && !loading && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg mb-6">
            {error}
          </div>
        )}

        {invoice && !loading && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Invoice Number
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-bold font-mono text-gray-900">
                      {invoice.invoice_number}
                    </p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(
                        invoice.payment_status
                      )}`}
                    >
                      {invoice.payment_status_display}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Issued {new Date(invoice.issued_date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })} &middot; Due {new Date(invoice.due_date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => generateInvoicePDF(invoice)}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download PDF
                  </button>
                  {invoice.payment_status !== "paid" && (
                    <button
                      onClick={() => handleUpdateStatus("paid")}
                      disabled={updating}
                      className="inline-flex items-center px-4 py-2 border border-green-300 text-green-700 text-sm font-medium rounded-lg hover:bg-green-50 transition-colors gap-1.5 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Mark as Paid
                    </button>
                  )}
                  {invoice.payment_status === "unpaid" && (
                    <button
                      onClick={() => handleUpdateStatus("overdue")}
                      disabled={updating}
                      className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors gap-1.5 disabled:opacity-50"
                    >
                      Mark Overdue
                    </button>
                  )}
                  <Link
                    href={`/shipments/${invoice.shipment.id}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    View Shipment
                  </Link>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sender */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Sender Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{invoice.shipment.sender_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900">{invoice.shipment.sender_email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{invoice.shipment.sender_phone}</p>
                  </div>
                </div>
              </div>

              {/* Receiver */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Receiver Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{invoice.shipment.receiver_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900">{invoice.shipment.receiver_email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{invoice.shipment.receiver_phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipment Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Shipment Details</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Tracking Code</p>
                  <p className="text-sm font-medium font-mono text-red-600">{invoice.shipment.tracking_code}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Origin</p>
                  <p className="text-sm font-medium text-gray-900">{invoice.shipment.origin}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Destination</p>
                  <p className="text-sm font-medium text-gray-900">{invoice.shipment.destination}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Weight</p>
                  <p className="text-sm font-medium text-gray-900">{invoice.shipment.weight} kg</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <p className="text-sm font-medium text-gray-900">{invoice.shipment.status_display}</p>
                </div>
              </div>
              {invoice.shipment.description && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">Description</p>
                  <p className="text-sm font-medium text-gray-900">{invoice.shipment.description}</p>
                </div>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Pricing Breakdown</h3>
              </div>
              <div className="max-w-sm ml-auto space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className="font-medium text-gray-900">${fmt(invoice.shipping_fee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax ({fmt(invoice.tax_rate)}%)</span>
                  <span className="font-medium text-gray-900">${fmt(invoice.tax_amount)}</span>
                </div>
                {parseFloat(invoice.discount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-red-600">-${fmt(invoice.discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">${fmt(invoice.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Notes</h3>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
