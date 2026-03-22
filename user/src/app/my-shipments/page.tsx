"use client";

import AuthGuard from "@/components/AuthGuard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import type { ShipmentListItem, PaginatedResponse } from "@/lib/types";
import { getStatusColor } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyShipmentsPage() {
  const [shipments, setShipments] = useState<ShipmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await api.get<PaginatedResponse<ShipmentListItem>>(
          "/my-shipments/"
        );
        setShipments(response.data.results);
      } catch {
        setError("Failed to load your shipments.");
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 bg-gray-50">
          {/* Hero banner */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-10">
            <div className="max-w-5xl mx-auto px-4">
              <h1 className="text-3xl font-bold mb-2">My Shipments</h1>
              <p className="text-red-100">
                View and track all parcels you&apos;ve sent.
              </p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 py-8">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Retry
                </button>
              </div>
            ) : shipments.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No shipments yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven&apos;t sent any parcels yet. Get started now!
                </p>
                <Link
                  href="/send"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Send a Parcel
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <Link
                    key={shipment.id}
                    href={`/track/${shipment.tracking_code}`}
                    className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono font-bold text-red-600">
                            {shipment.tracking_code}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.current_status)}`}
                          >
                            {shipment.status_display}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          To: <span className="font-medium text-gray-900">{shipment.receiver_name}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          {shipment.origin} → {shipment.destination}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500 sm:text-right">
                        <p>
                          {new Date(shipment.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <span className="text-red-600 text-xs font-medium">
                          Track →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}

                <div className="text-center pt-4">
                  <Link
                    href="/send"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    Send Another Parcel
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
