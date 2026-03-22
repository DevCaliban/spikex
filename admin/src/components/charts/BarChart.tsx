"use client";

import { DailyCount } from "@/lib/types";
import { useState } from "react";

interface BarChartProps {
  data: DailyCount[];
  height?: number;
}

export default function BarChart({ data, height = 240 }: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-gray-400 text-sm" style={{ height }}>
        No data available
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const padding = { top: 20, right: 16, bottom: 40, left: 40 };
  const chartWidth = 600;
  const chartHeight = height;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;
  const barWidth = Math.max(4, (innerWidth / data.length) * 0.7);
  const barGap = (innerWidth / data.length) * 0.3;

  // Y-axis ticks
  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round((maxCount / tickCount) * i)
  );

  return (
    <div className="relative w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {yTicks.map((tick, index) => {
          const y = padding.top + innerHeight - (tick / maxCount) * innerHeight;
          return (
            <g key={index}>
              <line
                x1={padding.left}
                x2={chartWidth - padding.right}
                y1={y}
                y2={y}
                stroke="#f3f4f6"
                strokeWidth={1}
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-gray-400"
                fontSize={10}
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = padding.left + i * (barWidth + barGap) + barGap / 2;
          const barH = (d.count / maxCount) * innerHeight;
          const y = padding.top + innerHeight - barH;
          const isHovered = hoveredIndex === i;

          return (
            <g
              key={d.date}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={2}
                className={`transition-all duration-200 ${
                  isHovered ? "fill-red-500" : "fill-red-600"
                }`}
                opacity={isHovered ? 1 : 0.85}
              />
              {/* X-axis label (every 5th) */}
              {(i % Math.max(1, Math.floor(data.length / 6)) === 0 ||
                i === data.length - 1) && (
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - padding.bottom + 16}
                  textAnchor="middle"
                  className="fill-gray-400"
                  fontSize={9}
                >
                  {new Date(d.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </text>
              )}
            </g>
          );
        })}

        {/* Tooltip */}
        {hoveredIndex !== null && data[hoveredIndex] && (() => {
          const d = data[hoveredIndex];
          const x =
            padding.left +
            hoveredIndex * (barWidth + barGap) +
            barGap / 2 +
            barWidth / 2;
          const barH = (d.count / maxCount) * innerHeight;
          const y = padding.top + innerHeight - barH - 8;
          return (
            <g>
              <rect
                x={x - 40}
                y={y - 28}
                width={80}
                height={24}
                rx={6}
                className="fill-gray-900"
              />
              <text
                x={x}
                y={y - 12}
                textAnchor="middle"
                className="fill-white font-medium"
                fontSize={11}
              >
                {d.count} shipment{d.count !== 1 ? "s" : ""}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
