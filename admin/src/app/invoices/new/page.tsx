"use client";

import AdminLayout from "@/components/AdminLayout";
import InvoiceForm from "@/components/InvoiceForm";
import api from "@/lib/api";
import { Invoice, InvoiceCreateData } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<Invoice | null>(null);

  const handleSubmit = async (data: InvoiceCreateData) => {
    setError("");
    setLoading(true);

    try {
      const response = await api.post<Invoice>("/invoices/", data);
      setSuccess(response.data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: Record<string, string[]> } };
      if (axiosErr.response?.data) {
        const messages = Object.entries(axiosErr.response.data)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
          .join("; ");
        setError(messages);
      } else {
        setError("Failed to create invoice. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <span className="text-gray-900 font-medium">New Invoice</span>
        </nav>

        {success ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Invoice Created Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              The invoice has been saved and is ready for download.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-gray-50 rounded-xl mb-6">
              <span className="text-sm text-gray-500 mr-2">Invoice Number:</span>
              <span className="text-xl font-bold font-mono text-red-600">
                {success.invoice_number}
              </span>
            </div>
            <div className="flex justify-center gap-3">
              <Link
                href={`/invoices/${success.id}`}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                View Invoice
              </Link>
              <button
                onClick={() => {
                  setSuccess(null);
                  router.refresh();
                }}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Create Another
              </button>
              <Link
                href="/invoices"
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Back to Invoices
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Create New Invoice
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Select a shipment and add pricing details to generate an invoice.
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            <InvoiceForm onSubmit={handleSubmit} loading={loading} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
