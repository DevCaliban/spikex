"use client";

import AdminLayout from "@/components/AdminLayout";
import AreaChart from "@/components/charts/AreaChart";
import DonutChart from "@/components/charts/DonutChart";
import BarChart from "@/components/charts/BarChart";
import api from "@/lib/api";
import { AnalyticsData } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

const RANGE_OPTIONS = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<AnalyticsData>(
        `/shipments/analytics/?days=${days}`
      );
      setAnalytics(res.data);
    } catch {
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const monthDelta =
    analytics && analytics.last_month_count > 0
      ? Math.round(
          ((analytics.this_month_count - analytics.last_month_count) /
            analytics.last_month_count) *
            100
        )
      : 0;

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">
              Shipment performance and insights
            </p>
          </div>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDays(opt.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  days === opt.value
                    ? "bg-red-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-24 border border-gray-100" />
              ))}
            </div>
            <div className="bg-white rounded-xl h-80 border border-gray-100" />
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Avg Delivery Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.avg_delivery_hours < 24
                    ? `${analytics.avg_delivery_hours}h`
                    : `${(analytics.avg_delivery_hours / 24).toFixed(1)}d`}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  pending to delivered
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {analytics.success_rate}%
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  delivered / total
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.this_month_count}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {monthDelta !== 0 && (
                    <span
                      className={`text-xs font-medium ${
                        monthDelta > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {monthDelta > 0 ? "+" : ""}
                      {monthDelta}%
                    </span>
                  )}
                  <span className="text-xs text-gray-400">vs last month</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Last Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.last_month_count}
                </p>
                <p className="text-xs text-gray-400 mt-1">shipments total</p>
              </div>
            </div>

            {/* Volume Trend */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Shipment Volume Trend
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Last {days} days
              </p>
              <AreaChart data={analytics.daily_counts} height={280} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Status Breakdown
                </h3>
                <DonutChart data={analytics.status_distribution} size={220} />
              </div>

              {/* Top Routes */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Top Routes
                </h3>
                {analytics.top_routes.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.top_routes.map((route, i) => {
                      const maxRouteCount = analytics.top_routes[0].count;
                      const widthPercent = (route.count / maxRouteCount) * 100;
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-700 truncate">
                              {route.origin}{" "}
                              <span className="text-gray-400">&rarr;</span>{" "}
                              {route.destination}
                            </span>
                            <span className="font-semibold text-gray-900 ml-2 shrink-0">
                              {route.count}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500 rounded-full transition-all duration-500"
                              style={{ width: `${widthPercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-8">
                    No route data yet
                  </p>
                )}
              </div>
            </div>

            {/* Daily Volume Bar Chart */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Daily Breakdown
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Shipments per day
              </p>
              <BarChart data={analytics.daily_counts} height={200} />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-2">
                {analytics.recent_activity.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        a.status === "delivered"
                          ? "bg-green-500"
                          : a.status === "failed"
                          ? "bg-red-500"
                          : a.status === "in_transit"
                          ? "bg-indigo-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span className="font-mono text-xs text-gray-900">
                      {a.tracking_code}
                    </span>
                    <span className="text-gray-500">{a.status_display}</span>
                    {a.location && (
                      <span className="text-gray-400 truncate hidden sm:inline">
                        &middot; {a.location}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto shrink-0">
                      {new Date(a.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
                {analytics.recent_activity.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">
                    No activity recorded yet
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AdminLayout>
  );
}
