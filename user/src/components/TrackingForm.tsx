"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function TrackingForm({ large = false }: { large?: boolean }) {
  const [trackingCode, setTrackingCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (large && inputRef.current) {
      inputRef.current.focus();
    }
  }, [large]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = trackingCode.trim().toUpperCase();
    if (code) {
      router.push(`/track/${code}`);
    }
  };

  const isValidFormat = trackingCode.trim().length === 0 || trackingCode.trim().length >= 3;

  if (large) {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto animate-fade-in-up delay-300">
        <div
          className={`flex flex-col sm:flex-row gap-3 p-2 rounded-2xl transition-all duration-300 ${
            isFocused
              ? "bg-white/15 backdrop-blur-md shadow-lg shadow-red-900/20 ring-1 ring-white/20"
              : "bg-white/10 backdrop-blur-sm"
          }`}
        >
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className={`w-5 h-5 transition-colors duration-200 ${
                  isFocused ? "text-red-400" : "text-gray-400"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter tracking code (e.g. SPX-A3X7K9M2P1)"
              className="w-full pl-12 pr-4 py-4 text-base sm:text-lg bg-transparent text-white rounded-xl border-0 focus:outline-none placeholder:text-gray-400/80"
              required
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button
            type="submit"
            className="group px-8 py-4 bg-red-600 text-white text-base sm:text-lg font-semibold rounded-xl hover:bg-red-700 active:scale-[0.97] transition-all duration-200 shrink-0 flex items-center justify-center gap-2"
          >
            Track
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
        {!isValidFormat && (
          <p className="text-red-300/80 text-xs mt-2 ml-2 animate-fade-in">
            Tracking codes are at least 3 characters long
          </p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={trackingCode}
        onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
        placeholder="Enter tracking code"
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
        required
        autoComplete="off"
        spellCheck={false}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 active:scale-95 transition-all"
      >
        Track
      </button>
    </form>
  );
}
