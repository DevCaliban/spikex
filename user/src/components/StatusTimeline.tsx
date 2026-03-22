"use client";

import { StatusUpdate } from "@/lib/types";

const statusIcons: Record<string, string> = {
  pending: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  picked_up: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
  in_transit: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
  out_for_delivery: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  delivered: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  failed: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  returned: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6",
};

const statusColors: Record<string, { icon: string; line: string; bg: string; dot: string }> = {
  pending: { icon: "text-amber-600", line: "bg-amber-200", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  picked_up: { icon: "text-blue-600", line: "bg-blue-200", bg: "bg-blue-50 border-blue-200", dot: "bg-blue-500" },
  in_transit: { icon: "text-indigo-600", line: "bg-indigo-200", bg: "bg-indigo-50 border-indigo-200", dot: "bg-indigo-500" },
  out_for_delivery: { icon: "text-purple-600", line: "bg-purple-200", bg: "bg-purple-50 border-purple-200", dot: "bg-purple-500" },
  delivered: { icon: "text-green-600", line: "bg-green-200", bg: "bg-green-50 border-green-200", dot: "bg-green-500" },
  failed: { icon: "text-red-600", line: "bg-red-200", bg: "bg-red-50 border-red-200", dot: "bg-red-500" },
  returned: { icon: "text-gray-600", line: "bg-gray-200", bg: "bg-gray-50 border-gray-200", dot: "bg-gray-500" },
};

const defaultColors = { icon: "text-gray-600", line: "bg-gray-200", bg: "bg-gray-50 border-gray-200", dot: "bg-gray-500" };

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function StatusTimeline({ updates }: { updates: StatusUpdate[] }) {
  if (!updates || updates.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 animate-fade-in">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm font-medium">No status updates yet</p>
        <p className="text-gray-400 text-xs mt-1">Updates will appear here as your shipment progresses</p>
      </div>
    );
  }

  const sorted = [...updates].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sorted.map((update, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === sorted.length - 1;
          const colors = statusColors[update.status] || defaultColors;
          const iconPath = statusIcons[update.status] || statusIcons.pending;
          const date = new Date(update.created_at);
          const delayClass = `delay-${Math.min(idx * 100, 800)}`;

          return (
            <li key={update.id} className={`animate-fade-in-up ${delayClass}`}>
              <div className="relative pb-8">
                {/* Connecting line */}
                {!isLast && (
                  <span
                    className={`absolute left-[19px] top-12 -ml-px h-[calc(100%-32px)] w-0.5 ${
                      isFirst ? colors.line : "bg-gray-200"
                    }`}
                    aria-hidden="true"
                  />
                )}

                <div className={`relative flex items-start gap-4 group`}>
                  {/* Icon node */}
                  <div className="relative shrink-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${colors.bg} ${colors.icon} transition-transform duration-200 group-hover:scale-110 ${
                        isFirst ? "ring-4 ring-opacity-20 ring-current" : ""
                      }`}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                      </svg>
                    </div>
                    {/* Live pulse dot for latest update */}
                    {isFirst && (
                      <span className={`absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.dot} opacity-75`} />
                        <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${colors.dot} ring-2 ring-white`} />
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`min-w-0 flex-1 p-4 rounded-xl border transition-all duration-200 ${
                    isFirst
                      ? "bg-white border-gray-200 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-100"
                  }`}>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-semibold ${isFirst ? "text-gray-900" : "text-gray-700"}`}>
                          {update.status_display}
                        </p>
                        {isFirst && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                            Latest
                          </span>
                        )}
                      </div>
                      <span className={`text-xs ${isFirst ? "text-gray-500" : "text-gray-400"} whitespace-nowrap`}>
                        {getRelativeTime(update.created_at)}
                      </span>
                    </div>

                    {update.location && (
                      <p className="mt-1.5 text-sm text-gray-600 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {update.location}
                      </p>
                    )}

                    {update.notes && (
                      <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{update.notes}</p>
                    )}

                    <p className="mt-2 text-xs text-gray-400">
                      {date.toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at{" "}
                      {date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
