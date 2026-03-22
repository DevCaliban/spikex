export interface StatusUpdate {
  id: number;
  status: string;
  status_display: string;
  location: string;
  notes: string;
  created_at: string;
}

export interface TrackingResult {
  tracking_code: string;
  sender_name: string;
  receiver_name: string;
  origin: string;
  destination: string;
  weight: string;
  current_status: string;
  status_display: string;
  status_updates: StatusUpdate[];
  created_at: string;
  updated_at: string;
}

export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "picked_up", label: "Picked Up", color: "bg-blue-100 text-blue-800" },
  { value: "in_transit", label: "In Transit", color: "bg-indigo-100 text-indigo-800" },
  { value: "out_for_delivery", label: "Out for Delivery", color: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "failed", label: "Failed", color: "bg-red-100 text-red-800" },
  { value: "returned", label: "Returned", color: "bg-gray-100 text-gray-800" },
] as const;

export function getStatusColor(status: string): string {
  return STATUS_OPTIONS.find((s) => s.value === status)?.color ?? "bg-gray-100 text-gray-800";
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface ShipmentCreateData {
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  receiver_name: string;
  receiver_email: string;
  receiver_phone: string;
  origin: string;
  destination: string;
  weight: string;
  description: string;
}

export interface ShipmentListItem {
  id: number;
  tracking_code: string;
  sender_name: string;
  receiver_name: string;
  origin: string;
  destination: string;
  current_status: string;
  status_display: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
