"use client";

import { ShipmentCreateData } from "@/lib/types";
import { useState } from "react";

interface ShipmentFormProps {
  onSubmit: (data: ShipmentCreateData) => Promise<void>;
  loading?: boolean;
}

export default function ShipmentForm({ onSubmit, loading }: ShipmentFormProps) {
  const [formData, setFormData] = useState<ShipmentCreateData>({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sender Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          Sender Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="sender_name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="sender_name"
              name="sender_name"
              type="text"
              value={formData.sender_name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="sender_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="sender_email"
              name="sender_email"
              type="email"
              value={formData.sender_email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="sender_phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="sender_phone"
              name="sender_phone"
              type="tel"
              value={formData.sender_phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* Receiver Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          Receiver Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="receiver_name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="receiver_name"
              name="receiver_name"
              type="text"
              value={formData.receiver_name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="receiver_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="receiver_email"
              name="receiver_email"
              type="email"
              value={formData.receiver_email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="receiver_phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="receiver_phone"
              name="receiver_phone"
              type="tel"
              value={formData.receiver_phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* Package Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          Package Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
              Origin (City/Address)
            </label>
            <input
              id="origin"
              name="origin"
              type="text"
              value={formData.origin}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="e.g. Lagos, Nigeria"
              required
            />
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              Destination (City/Address)
            </label>
            <input
              id="destination"
              name="destination"
              type="text"
              value={formData.destination}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="e.g. Abuja, Nigeria"
              required
            />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              id="weight"
              name="weight"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="e.g. 2.5"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={1}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm resize-none"
              placeholder="Brief description of the package contents"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating Shipment...
            </span>
          ) : (
            "Create Shipment"
          )}
        </button>
      </div>
    </form>
  );
}
