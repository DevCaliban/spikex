"use client";

import { useAuth } from "@/context/AuthContext";
import type { ShipmentCreateData } from "@/lib/types";
import { useEffect, useState } from "react";

interface SendParcelFormProps {
  onSubmit: (data: ShipmentCreateData) => Promise<void>;
  loading?: boolean;
}

export default function SendParcelForm({
  onSubmit,
  loading,
}: SendParcelFormProps) {
  const { user } = useAuth();
  const [form, setForm] = useState<ShipmentCreateData>({
    sender_name: "",
    sender_email: "",
    sender_phone: "",
    receiver_name: "",
    receiver_email: "",
    receiver_phone: "",
    origin: "",
    destination: "",
    weight: "",
    description: "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        sender_name:
          prev.sender_name ||
          `${user.first_name} ${user.last_name}`.trim(),
        sender_email: prev.sender_email || user.email,
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sender Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          Sender Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label
              htmlFor="sender_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name *
            </label>
            <input
              id="sender_name"
              name="sender_name"
              type="text"
              required
              value={form.sender_name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="sender_email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
            </label>
            <input
              id="sender_email"
              name="sender_email"
              type="email"
              required
              value={form.sender_email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="sender_phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone *
            </label>
            <input
              id="sender_phone"
              name="sender_phone"
              type="tel"
              required
              value={form.sender_phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. +1 234 567 8900"
            />
          </div>
        </div>
      </div>

      {/* Receiver Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
          Receiver Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label
              htmlFor="receiver_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name *
            </label>
            <input
              id="receiver_name"
              name="receiver_name"
              type="text"
              required
              value={form.receiver_name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="receiver_email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
            </label>
            <input
              id="receiver_email"
              name="receiver_email"
              type="email"
              required
              value={form.receiver_email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="receiver_phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone *
            </label>
            <input
              id="receiver_phone"
              name="receiver_phone"
              type="tel"
              required
              value={form.receiver_phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. +1 234 567 8900"
            />
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
            />
          </svg>
          Package Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="origin"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Origin *
            </label>
            <input
              id="origin"
              name="origin"
              type="text"
              required
              value={form.origin}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Lagos, Nigeria"
            />
          </div>
          <div>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Destination *
            </label>
            <input
              id="destination"
              name="destination"
              type="text"
              required
              value={form.destination}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. London, UK"
            />
          </div>
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Weight (kg) *
            </label>
            <input
              id="weight"
              name="weight"
              type="number"
              required
              step="0.01"
              min="0.01"
              value={form.weight}
              onChange={handleChange}
              className={inputClass}
              placeholder="0.00"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              className={inputClass}
              placeholder="Brief description of package contents"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Sending Parcel...
          </span>
        ) : (
          "Send Parcel"
        )}
      </button>
    </form>
  );
}
