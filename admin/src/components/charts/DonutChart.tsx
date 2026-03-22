"use client";

import { StatusDistribution } from "@/lib/types";
import { useState } from "react";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  picked_up: "#3b82f6",
  in_transit: "#6366f1",
  out_for_delivery: "#8b5cf6",
  delivered: "#22c55e",
  failed: "#ef4444",
  returned: "#6b7280",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  failed: "Failed",
  returned: "Returned",
};

interface DonutChartProps {
  data: StatusDistribution[];
  size?: number;
}

export default function DonutChart({ data, size = 200 }: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((sum, d) => sum + d.count, 0);
  if (!total) {
    return (
      <div
        className="flex items-center justify-center text-gray-400 text-sm"
        style={{ height: size }}
      >
        No data available
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const strokeWidth = size * 0.12;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const segments = data.map((d, i) => {
    const percent = d.count / total;
    const offset = cumulativePercent;
    cumulativePercent += percent;
    return {
      ...d,
      percent,
      offset,
      color: STATUS_COLORS[d.status] || "#9ca3af",
      label: STATUS_LABELS[d.status] || d.status,
      index: i,
    };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {segments.map((seg) => {
            const dashLength = circumference * seg.percent;
            const dashOffset = -circumference * seg.offset;
            const isHovered = hoveredIndex === seg.index;
            return (
              <circle
                key={seg.status}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                className="transition-all duration-300"
                style={{
                  opacity: hoveredIndex !== null && !isHovered ? 0.4 : 1,
                }}
                onMouseEnter={() => setHoveredIndex(seg.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{total}</span>
          <span className="text-xs text-gray-500">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
        {segments.map((seg) => (
          <div
            key={seg.status}
            className="flex items-center gap-2 cursor-pointer"
            onMouseEnter={() => setHoveredIndex(seg.index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-gray-600">{seg.label}</span>
            <span className="font-semibold text-gray-900 ml-auto">
              {seg.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
