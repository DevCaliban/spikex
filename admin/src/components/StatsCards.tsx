"use client";

import { ShipmentStats } from "@/lib/types";
import { useEffect, useState } from "react";

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) {
      setDisplay(0);
      return;
    }
    const duration = 600;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <>{display}</>;
}

export default function StatsCards({ stats }: { stats: ShipmentStats }) {
  const cards = [
    {
      label: "Total Shipments",
      value: stats.total,
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      accent: "border-l-gray-400",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      accent: "border-l-amber-400",
    },
    {
      label: "Picked Up",
      value: stats.picked_up,
      icon: "M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338A2.25 2.25 0 0017.088 3.75H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      accent: "border-l-blue-400",
    },
    {
      label: "In Transit",
      value: stats.in_transit,
      icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      accent: "border-l-indigo-400",
    },
    {
      label: "Out for Delivery",
      value: stats.out_for_delivery,
      icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      accent: "border-l-purple-400",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      accent: "border-l-green-400",
    },
    {
      label: "Failed",
      value: stats.failed,
      icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      accent: "border-l-red-400",
    },
    {
      label: "Returned",
      value: stats.returned,
      icon: "M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3",
      iconBg: "bg-gray-50",
      iconColor: "text-gray-500",
      accent: "border-l-gray-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-xl p-4 border border-gray-100 border-l-4 ${card.accent} hover:shadow-md transition-shadow`}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`${card.iconBg} w-9 h-9 rounded-lg flex items-center justify-center`}
            >
              <svg
                className={`w-4 h-4 ${card.iconColor}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={card.icon}
                />
              </svg>
            </div>
            {card.value > 0 && (
              <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                {Math.round((card.value / Math.max(stats.total, 1)) * 100)}%
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">
            <AnimatedNumber value={card.value} />
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
