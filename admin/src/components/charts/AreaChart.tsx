"use client";

import { DailyCount } from "@/lib/types";
import { useState } from "react";

interface AreaChartProps {
  data: DailyCount[];
  height?: number;
  color?: string;
}

export default function AreaChart({
  data,
  height = 240,
  color = "#dc2626",
}: AreaChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data.length) {
    return (
      <div
        className="flex items-center justify-center text-gray-400 text-sm"
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  const padding = { top: 20, right: 16, bottom: 40, left: 40 };
  const chartWidth = 600;
  const chartHeight = height;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const getX = (i: number) =>
    padding.left + (i / Math.max(data.length - 1, 1)) * innerWidth;
  const getY = (count: number) =>
    padding.top + innerHeight - (count / maxCount) * innerHeight;

  // Build smooth path using quadratic bezier curves
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.count) }));
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    linePath += ` Q ${cpx} ${prev.y}, ${(cpx + curr.x) / 2} ${
      (prev.y + curr.y) / 2
    }`;
    if (i === points.length - 1) {
      linePath += ` T ${curr.x} ${curr.y}`;
    }
  }

  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${padding.top + innerHeight}` +
    ` L ${points[0].x} ${padding.top + innerHeight} Z`;

  // Y-axis ticks
  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round((maxCount / tickCount) * i)
  );

  const gradientId = `area-gradient-${color.replace("#", "")}`;

  return (
    <div className="relative w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
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

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            {/* Invisible hit area */}
            <circle
              cx={p.x}
              cy={p.y}
              r={12}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            />
            {/* Visible dot */}
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === i ? 5 : 3}
              fill={hoveredIndex === i ? color : "white"}
              stroke={color}
              strokeWidth={2}
              className="transition-all duration-150"
            />
          </g>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (
            i % Math.max(1, Math.floor(data.length / 6)) !== 0 &&
            i !== data.length - 1
          )
            return null;
          return (
            <text
              key={d.date}
              x={getX(i)}
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
          );
        })}

        {/* Tooltip */}
        {hoveredIndex !== null && data[hoveredIndex] && (() => {
          const d = data[hoveredIndex];
          const p = points[hoveredIndex];
          return (
            <g>
              {/* Vertical line */}
              <line
                x1={p.x}
                x2={p.x}
                y1={padding.top}
                y2={padding.top + innerHeight}
                stroke={color}
                strokeWidth={1}
                strokeDasharray="4 4"
                opacity={0.3}
              />
              <rect
                x={p.x - 50}
                y={p.y - 36}
                width={100}
                height={28}
                rx={6}
                className="fill-gray-900"
              />
              <text
                x={p.x}
                y={p.y - 18}
                textAnchor="middle"
                className="fill-white font-medium"
                fontSize={11}
              >
                {d.count} &bull;{" "}
                {new Date(d.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
