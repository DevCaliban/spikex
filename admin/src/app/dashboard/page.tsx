"use client";

import AdminLayout from "@/components/AdminLayout";
import StatsCards from "@/components/StatsCards";
import BarChart from "@/components/charts/BarChart";
import DonutChart from "@/components/charts/DonutChart";
import api from "@/lib/api";
import {
  AnalyticsData,
  ShipmentListItem,
  ShipmentStats,
  PaginatedResponse,
  getStatusColor,
} from "@/lib/types";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 h-28 border border-gray-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl h-80 border border-gray-100" />
        <div className="bg-white rounded-xl h-80 border border-gray-100" />
      </div>
    </div>
  );
}

function getRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<ShipmentStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentShipments, setRecentShipments] = useState<ShipmentListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, analyticsRes, shipmentsRes] = await Promise.all([
        api.get<ShipmentStats>("/shipments/stats/"),
        api.get<AnalyticsData>("/shipments/analytics/?days=30"),
        api.get<PaginatedResponse<ShipmentListItem>>("/shipments/?page=1"),
      ]);
      setStats(statsRes.data);
      setAnalytics(analyticsRes.data);
      setRecentShipments(shipmentsRes.data.results.slice(0, 5));
    } catch {
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-350 mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, Admin
            </h1>
            <p className="text-sm text-gray-500 mt-1">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/analytics"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" />
              </svg>
              Analytics
            </Link>
            <Link
              href="/shipments/new"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Shipment
            </Link>
          </div>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            {stats && <StatsCards stats={stats} />}

            {/* Highlight cards */}
            {stats && analytics && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Today</p>
                  <p className="text-xl font-bold text-gray-900">{stats.today_count}</p>
                  <p className="text-xs text-gray-400">shipments created</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">This Week</p>
                  <p className="text-xl font-bold text-gray-900">{stats.this_week_count}</p>
                  <p className="text-xs text-gray-400">shipments created</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Success Rate</p>
                  <p className="text-xl font-bold text-green-600">{analytics.success_rate}%</p>
                  <p className="text-xs text-gray-400">delivered successfully</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Avg Delivery</p>
                  <p className="text-xl font-bold text-gray-900">
                    {analytics.avg_delivery_hours < 24
                      ? `${analytics.avg_delivery_hours}h`
                      : `${(analytics.avg_delivery_hours / 24).toFixed(1)}d`}
                  </p>
                  <p className="text-xs text-gray-400">average time</p>
                </div>
              </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bar Chart */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Shipment Volume
                    </h3>
                    <p className="text-xs text-gray-500">Last 30 days</p>
                  </div>
                  {analytics && (
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {analytics.this_month_count}
                      </p>
                      <p className="text-xs text-gray-500">this month</p>
                    </div>
                  )}
                </div>
                {analytics && <BarChart data={analytics.daily_counts} />}
              </div>

              {/* Donut Chart */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Status Distribution
                </h3>
                {analytics && (
                  <DonutChart data={analytics.status_distribution} />
                )}
              </div>
            </div>

            {/* Bottom Row: Recent Activity + Recent Shipments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Recent Activity
                  </h3>
                  <Link
                    href="/analytics"
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {analytics?.recent_activity.slice(0, 10).map((activity) => (
                    <Link
                      key={activity.id}
                      href={`/shipments/${activity.shipment_id}`}
                      className="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                          activity.status === "delivered"
                            ? "bg-green-500"
                            : activity.status === "failed"
                            ? "bg-red-500"
                            : activity.status === "in_transit"
                            ? "bg-indigo-500"
                            : "bg-gray-400"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-mono font-medium text-xs">
                            {activity.tracking_code}
                          </span>{" "}
                          <span className="text-gray-500">
                            &rarr; {activity.status_display}
                          </span>
                        </p>
                        {activity.location && (
                          <p className="text-xs text-gray-400 truncate">
                            {activity.location}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                        {getRelativeTime(activity.created_at)}
                      </span>
                    </Link>
                  ))}
                  {(!analytics || analytics.recent_activity.length === 0) && (
                    <p className="text-sm text-gray-400 text-center py-8">
                      No recent activity
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Shipments */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Latest Shipments
                  </h3>
                  <Link
                    href="/shipments"
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentShipments.map((s) => (
                    <Link
                      key={s.id}
                      href={`/shipments/${s.id}`}
                      className="flex items-center gap-3 p-2.5 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-mono font-medium text-gray-900">
                          {s.tracking_code}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {s.sender_name} &rarr; {s.receiver_name}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          s.current_status
                        )}`}
                      >
                        {s.status_display}
                      </span>
                    </Link>
                  ))}
                  {recentShipments.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">
                      No shipments yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
