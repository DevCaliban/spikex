"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StatusTimeline from "@/components/StatusTimeline";
import TrackingForm from "@/components/TrackingForm";
import api from "@/lib/api";
import { getStatusColor, TrackingResult } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function TrackingPage() {
  const params = useParams();
  const trackingCode = params.trackingCode as string;
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTracking = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/track/${trackingCode}/`);
      setResult(response.data);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr.response?.status === 404) {
        setError("No shipment found with this tracking code. Please verify and try again.");
      } else {
        setError("Unable to retrieve tracking information. Please try again shortly.");
      }
    } finally {
      setLoading(false);
    }
  }, [trackingCode]);

  useEffect(() => {
    if (trackingCode) {
      fetchTracking();
    }
  }, [trackingCode, fetchTracking]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* ─── Hero banner with parallax bg ─── */}
      <section
        className="parallax-bg relative text-white overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-gray-900/90 to-gray-900/80" />
        {/* Subtle animated accent */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-red-600 rounded-full filter blur-[120px] opacity-15 animate-pulse-dot" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-20 text-center">
          <div className="animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-red-300 text-sm font-medium mb-4 border border-white/10">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Shipment Tracker
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 animate-fade-in-up delay-100">
            Track Your <span className="text-red-400">Shipment</span>
          </h1>
          <p className="text-gray-300 max-w-md mx-auto mb-8 animate-fade-in-up delay-200">
            Enter your tracking code for real-time delivery updates
          </p>
          <div className="max-w-xl mx-auto">
            <TrackingForm large />
          </div>
        </div>
      </section>

      {/* ─── Main content ─── */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 pb-12">

          {/* ─── Loading skeleton ─── */}
          {loading && <TrackingSkeleton trackingCode={trackingCode} />}

          {/* ─── Error state ─── */}
          {error && !loading && (
            <div className="animate-scale-in">
              <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-10 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Shipment Not Found</h2>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">{error}</p>
                <p className="text-sm text-gray-400 mb-6">
                  Tracking code: <span className="font-mono font-semibold text-gray-500">{trackingCode}</span>
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={fetchTracking}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 active:scale-95 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                    Retry
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Go Home
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ─── Success result ─── */}
          {result && !loading && (
            <div className="space-y-6">

              {/* Status summary banner */}
              <StatusBanner result={result} lastUpdated={lastUpdated} onRefresh={fetchTracking} />

              {/* Shipment info cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "From",
                    value: result.sender_name,
                    sub: result.origin,
                    icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                    delay: "delay-0",
                  },
                  {
                    label: "To",
                    value: result.receiver_name,
                    sub: result.destination,
                    icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                    delay: "delay-100",
                  },
                  {
                    label: "Weight",
                    value: `${result.weight} kg`,
                    sub: null,
                    icon: "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z",
                    delay: "delay-200",
                  },
                  {
                    label: "Shipped On",
                    value: new Date(result.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    sub: null,
                    icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
                    delay: "delay-300",
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className={`animate-fade-in-up ${card.delay} bg-white p-5 rounded-2xl border border-gray-100 shadow-sm card-hover`}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{card.label}</p>
                    </div>
                    <p className="font-semibold text-gray-900">{card.value}</p>
                    {card.sub && <p className="text-sm text-gray-500 mt-0.5">{card.sub}</p>}
                  </div>
                ))}
              </div>

              {/* Delivery progress bar */}
              <div className="animate-fade-in-up delay-400 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Delivery Progress</h3>
                  <StatusBadge status={result.current_status} display={result.status_display} />
                </div>
                <AnimatedProgressBar currentStatus={result.current_status} />
              </div>

              {/* Timeline */}
              <div className="animate-fade-in-up delay-500 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Tracking History</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                    {result.status_updates.length} update{result.status_updates.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <StatusTimeline updates={result.status_updates} />
              </div>

              {/* Route visualization */}
              <div className="animate-fade-in-up delay-600 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-5">Shipment Route</h3>
                <RouteVisualization
                  origin={result.origin}
                  destination={result.destination}
                  currentStatus={result.current_status}
                />
              </div>

              {/* Need help banner */}
              <div className="animate-fade-in-up delay-700">
                <div
                  className="parallax-bg rounded-2xl relative overflow-hidden text-white"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=2070&auto=format&fit=crop')",
                  }}
                >
                  <div className="absolute inset-0 bg-gray-900/85" />
                  <div className="relative px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center shrink-0 animate-bounce-subtle">
                        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Need help with your shipment?</h4>
                        <p className="text-sm text-gray-300">Our support team is available 24/7 to assist you.</p>
                      </div>
                    </div>
                    <a
                      href="mailto:support@spikexlogistics.com"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 active:scale-95 transition-all shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      Contact Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ─── Sub-components ─── */

function StatusBanner({
  result,
  lastUpdated,
  onRefresh,
}: {
  result: TrackingResult;
  lastUpdated: Date | null;
  onRefresh: () => void;
}) {
  const statusConfig: Record<string, { bg: string; border: string; text: string; icon: string; description: string }> = {
    pending: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", description: "Your shipment is being prepared for dispatch." },
    picked_up: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4", description: "Your package has been picked up and is heading to the sorting facility." },
    in_transit: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-800", icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0", description: "Your shipment is on its way to the destination city." },
    out_for_delivery: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", description: "Great news! Your package is out for delivery today." },
    delivered: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", description: "Your package has been delivered successfully." },
    failed: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z", description: "Delivery attempt failed. Our team will try again or contact you." },
    returned: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-800", icon: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6", description: "Your package is being returned to the sender." },
  };

  const config = statusConfig[result.current_status] || statusConfig.pending;

  return (
    <div className={`animate-scale-in rounded-2xl ${config.bg} ${config.border} border-2 overflow-hidden`}>
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.text} bg-white/60 shrink-0 ${
              result.current_status === "in_transit" ? "animate-drive" : ""
            }`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={config.icon} />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className={`text-lg font-bold ${config.text}`}>{result.status_display}</h2>
                {["in_transit", "out_for_delivery"].includes(result.current_status) && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.text.replace("text-", "bg-")}`} />
                  </span>
                )}
              </div>
              <p className={`text-sm ${config.text} opacity-80`}>{config.description}</p>
              <p className="mt-2 text-xs text-gray-500 font-mono">{result.tracking_code}</p>
            </div>
          </div>

          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all shrink-0"
            title="Refresh tracking data"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Refresh
          </button>
        </div>
        {lastUpdated && (
          <p className="text-xs text-gray-400 mt-3">
            Last checked: {lastUpdated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, display }: { status: string; display: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
      {["in_transit", "out_for_delivery"].includes(status) && (
        <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
      )}
      {display}
    </span>
  );
}

function AnimatedProgressBar({ currentStatus }: { currentStatus: string }) {
  const steps = [
    { key: "pending", label: "Pending", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { key: "picked_up", label: "Picked Up", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
    { key: "in_transit", label: "In Transit", icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" },
    { key: "out_for_delivery", label: "Out for Delivery", icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" },
    { key: "delivered", label: "Delivered", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  const specialStatuses = ["failed", "returned"];
  if (specialStatuses.includes(currentStatus)) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="animate-scale-in flex flex-col items-center gap-3">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            currentStatus === "failed" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
          }`}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={
                currentStatus === "failed"
                  ? "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  : "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              } />
            </svg>
          </div>
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(currentStatus)}`}>
            {currentStatus === "failed" ? "Delivery Failed" : "Package Returned"}
          </span>
        </div>
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.key === currentStatus);

  return (
    <div className="flex items-start w-full">
      {steps.map((step, idx) => {
        const isCompleted = idx <= currentIdx;
        const isCurrent = idx === currentIdx;

        return (
          <div key={step.key} className="flex items-start flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              {/* Step circle */}
              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                  isCompleted
                    ? "bg-red-600 text-white shadow-md shadow-red-200"
                    : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                } ${isCurrent ? "ring-4 ring-red-100 scale-110" : ""}`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                  </svg>
                )}
                {/* Current step pulse */}
                {isCurrent && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-red-600 opacity-20" />
                )}
              </div>
              {/* Label */}
              <p
                className={`mt-2.5 text-xs text-center hidden sm:block transition-colors duration-300 max-w-[80px] ${
                  isCurrent
                    ? "font-bold text-red-600"
                    : isCompleted
                      ? "font-medium text-gray-900"
                      : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
            </div>
            {/* Connecting bar */}
            {idx < steps.length - 1 && (
              <div className="flex-1 h-1 mx-1.5 mt-[18px] rounded-full overflow-hidden bg-gray-200">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    idx < currentIdx ? "bg-red-600 w-full" : "w-0"
                  }`}
                  style={{
                    transitionDelay: `${(idx + 1) * 200}ms`,
                    width: idx < currentIdx ? "100%" : "0%",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RouteVisualization({
  origin,
  destination,
  currentStatus,
}: {
  origin: string;
  destination: string;
  currentStatus: string;
}) {
  const steps = ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered"];
  const currentIdx = steps.indexOf(currentStatus);
  const progress = currentIdx >= 0 ? Math.min((currentIdx / (steps.length - 1)) * 100, 100) : 0;

  return (
    <div className="relative">
      {/* Route line */}
      <div className="flex items-center gap-4">
        {/* Origin */}
        <div className="flex flex-col items-center shrink-0 w-20">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-gray-900 text-center leading-tight">{origin}</p>
        </div>

        {/* Progress track */}
        <div className="flex-1 relative">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Truck/plane icon on the progress line */}
          {currentStatus !== "delivered" && currentStatus !== "failed" && currentStatus !== "returned" && (
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
              style={{ left: `calc(${progress}% - 12px)` }}
            >
              <div className={`w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shadow-md shadow-red-200 ${
                currentStatus === "in_transit" ? "animate-drive" : ""
              }`}>
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Destination */}
        <div className="flex flex-col items-center shrink-0 w-20">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
            currentStatus === "delivered" ? "bg-green-100" : "bg-gray-100"
          }`}>
            <svg className={`w-5 h-5 ${currentStatus === "delivered" ? "text-green-600" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {currentStatus === "delivered" ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </>
              )}
            </svg>
          </div>
          <p className="text-xs font-semibold text-gray-900 text-center leading-tight">{destination}</p>
        </div>
      </div>
    </div>
  );
}

function TrackingSkeleton({ trackingCode }: { trackingCode: string }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 skeleton shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 skeleton w-40" />
            <div className="h-4 skeleton w-72" />
            <div className="h-3 skeleton w-32" />
          </div>
        </div>
      </div>

      {/* Info cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 skeleton" />
              <div className="h-3 skeleton w-12" />
            </div>
            <div className="h-4 skeleton w-24 mb-1.5" />
            <div className="h-3 skeleton w-20" />
          </div>
        ))}
      </div>

      {/* Progress bar skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <div className="h-5 skeleton w-40 mb-6" />
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="w-10 h-10 rounded-full skeleton" />
              {i < 4 && <div className="flex-1 h-1 mx-1.5 skeleton" />}
            </div>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center gap-3 py-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-200 border-t-red-600" />
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium">Looking up shipment...</p>
          <p className="text-gray-400 text-xs">Tracking code: <span className="font-mono">{trackingCode}</span></p>
        </div>
      </div>
    </div>
  );
}
