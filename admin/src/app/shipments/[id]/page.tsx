"use client";

import AdminLayout from "@/components/AdminLayout";
import StatusTimeline from "@/components/StatusTimeline";
import StatusUpdateModal from "@/components/StatusUpdateModal";
import api from "@/lib/api";
import { getStatusColor, Shipment, StatusUpdateData } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

function RouteVisualization({ origin, destination, status }: { origin: string; destination: string; status: string }) {
  const statusProgress: Record<string, number> = {
    pending: 5,
    picked_up: 20,
    in_transit: 50,
    out_for_delivery: 80,
    delivered: 100,
    failed: 50,
    returned: 20,
  };
  const progress = statusProgress[status] || 0;

  return (
    <div className="flex items-center gap-3">
      <div className="text-right min-w-0 flex-shrink">
        <p className="text-sm font-medium text-gray-900 truncate">{origin}</p>
        <p className="text-xs text-gray-400">Origin</p>
      </div>
      <div className="flex-1 relative min-w-24">
        <div className="h-1.5 bg-gray-100 rounded-full">
          <div
            className="h-full bg-red-500 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        {status === "in_transit" && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${progress}%` }}
          >
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3.27 9H2a1 1 0 000 2h.8l.27.82a2 2 0 001.9 1.37h.04A2 2 0 007 11.82V10H5l-.29-.84A2 2 0 002.82 8h-.55zM20 8h-3v3h.99a2 2 0 001.9-1.37L20 9h.73a1 1 0 000-2H20zM17 13a3 3 0 100 6 3 3 0 000-6zm0 4a1 1 0 110-2 1 1 0 010 2zM7 13a3 3 0 100 6 3 3 0 000-6zm0 4a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-shrink">
        <p className="text-sm font-medium text-gray-900 truncate">{destination}</p>
        <p className="text-xs text-gray-400">Destination</p>
      </div>
    </div>
  );
}

export default function ShipmentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "timeline">("overview");

  const fetchShipment = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<Shipment>(`/shipments/${id}/`);
      setShipment(response.data);
    } catch {
      setError("Failed to load shipment details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchShipment();
  }, [fetchShipment]);

  const handleStatusUpdate = async (data: StatusUpdateData) => {
    setUpdating(true);
    try {
      const response = await api.post<Shipment>(`/shipments/${id}/status/`, data);
      setShipment(response.data);
      setShowStatusModal(false);
    } catch {
      setError("Failed to update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/dashboard" className="hover:text-gray-700">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/shipments" className="hover:text-gray-700">
            Shipments
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            {shipment?.tracking_code || "Loading..."}
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

        {shipment && !loading && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Tracking Code
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-bold font-mono text-gray-900">
                      {shipment.tracking_code}
                    </p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        shipment.current_status
                      )}`}
                    >
                      {shipment.status_display}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Created{" "}
                    {new Date(shipment.created_at).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CopyButton text={shipment.tracking_code} label="Copy Code" />
                  <CopyButton
                    text={`${typeof window !== "undefined" ? window.location.origin : ""}/track/${shipment.tracking_code}`}
                    label="Copy Link"
                  />
                  <button
                    onClick={() => setShowStatusModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Update Status
                  </button>
                </div>
              </div>

              {/* Route Visualization */}
              <div className="bg-gray-50 rounded-xl p-4">
                <RouteVisualization
                  origin={shipment.origin}
                  destination={shipment.destination}
                  status={shipment.current_status}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1 w-fit">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "overview"
                    ? "bg-red-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "timeline"
                    ? "bg-red-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Timeline ({shipment.status_updates.length})
              </button>
            </div>

            {activeTab === "overview" && (
              <>
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
                      <h3 className="text-sm font-semibold text-gray-900">
                        Sender Information
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400">Full Name</p>
                        <p className="text-sm font-medium text-gray-900">{shipment.sender_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-sm font-medium text-gray-900">{shipment.sender_email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{shipment.sender_phone}</p>
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
                      <h3 className="text-sm font-semibold text-gray-900">
                        Receiver Information
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400">Full Name</p>
                        <p className="text-sm font-medium text-gray-900">{shipment.receiver_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-sm font-medium text-gray-900">{shipment.receiver_email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{shipment.receiver_phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Package Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Package Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Origin</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.origin}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Destination</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.destination}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Weight</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Last Updated</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(shipment.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {shipment.description && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-400">Description</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.description}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "timeline" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <StatusTimeline updates={shipment.status_updates} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && shipment && (
        <StatusUpdateModal
          currentStatus={shipment.current_status}
          onSubmit={handleStatusUpdate}
          onClose={() => setShowStatusModal(false)}
          loading={updating}
        />
      )}
    </AdminLayout>
  );
}
