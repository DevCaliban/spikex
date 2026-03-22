"use client";

import AuthGuard from "@/components/AuthGuard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SendParcelForm from "@/components/SendParcelForm";
import api from "@/lib/api";
import type { ShipmentCreateData } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";

export default function SendParcelPage() {
  const [trackingCode, setTrackingCode] = useState<string | null>(null);
  const [shipmentId, setShipmentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: ShipmentCreateData) => {
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/send/", data);
      setTrackingCode(response.data.tracking_code);
      setShipmentId(response.data.id);
    } catch {
      setError("Failed to create shipment. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        {trackingCode ? (
          <main className="flex-1 bg-gray-50 py-16">
            <div className="max-w-lg mx-auto px-4 text-center">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Parcel Sent Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your shipment has been registered. Use the tracking code below
                  to monitor its status.
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">Tracking Code</p>
                  <p className="text-2xl font-bold text-red-600 font-mono tracking-wider">
                    {trackingCode}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/track/${trackingCode}`}
                    className="flex-1 py-2.5 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm text-center"
                  >
                    Track Shipment
                  </Link>
                  <button
                    onClick={() => {
                      setTrackingCode(null);
                      setShipmentId(null);
                    }}
                    className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Send Another
                  </button>
                  <Link
                    href="/my-shipments"
                    className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm text-center"
                  >
                    My Shipments
                  </Link>
                </div>
              </div>
            </div>
          </main>
        ) : (
          <main className="flex-1 bg-gray-50">
            {/* Hero banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
              <div className="max-w-3xl mx-auto px-4 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                  Send a Parcel
                </h1>
                <p className="text-red-100 text-lg">
                  Fill in the details below to register your shipment. You&apos;ll
                  receive a tracking code to monitor its progress.
                </p>
              </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-10">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <SendParcelForm onSubmit={handleSubmit} loading={loading} />
              </div>
            </div>
          </main>
        )}

        <Footer />
      </div>
    </AuthGuard>
  );
}
