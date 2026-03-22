export interface StatusUpdate {
  id: number;
  status: string;
  status_display: string;
  location: string;
  notes: string;
  created_at: string;
}

export interface Shipment {
  id: number;
  tracking_code: string;
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
  current_status: string;
  status_display: string;
  status_updates: StatusUpdate[];
  created_at: string;
  updated_at: string;
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

export interface ShipmentStats {
  total: number;
  pending: number;
  picked_up: number;
  in_transit: number;
  out_for_delivery: number;
  delivered: number;
  failed: number;
  returned: number;
  today_count: number;
  this_week_count: number;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface RouteData {
  origin: string;
  destination: string;
  count: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface RecentActivity {
  id: number;
  tracking_code: string;
  shipment_id: number;
  status: string;
  status_display: string;
  location: string;
  notes: string;
  created_at: string;
}

export interface AnalyticsData {
  daily_counts: DailyCount[];
  status_distribution: StatusDistribution[];
  top_routes: RouteData[];
  avg_delivery_hours: number;
  success_rate: number;
  this_month_count: number;
  last_month_count: number;
  recent_activity: RecentActivity[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
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

export interface StatusUpdateData {
  status: string;
  location: string;
  notes: string;
}

// Invoice types
export interface InvoiceListItem {
  id: number;
  invoice_number: string;
  tracking_code: string;
  sender_name: string;
  receiver_name: string;
  total_amount: string;
  payment_status: string;
  payment_status_display: string;
  issued_date: string;
  due_date: string;
  created_at: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  shipment: Shipment;
  shipping_fee: string;
  tax_rate: string;
  tax_amount: string;
  discount: string;
  total_amount: string;
  notes: string;
  payment_status: string;
  payment_status_display: string;
  issued_date: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceCreateData {
  shipment: number;
  shipping_fee: string;
  tax_rate: string;
  discount: string;
  notes: string;
  payment_status: string;
  issued_date: string;
  due_date: string;
}

export const PAYMENT_STATUS_OPTIONS = [
  { value: "unpaid", label: "Unpaid", color: "bg-yellow-100 text-yellow-800" },
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
  { value: "overdue", label: "Overdue", color: "bg-red-100 text-red-800" },
] as const;

export function getPaymentStatusColor(status: string): string {
  return PAYMENT_STATUS_OPTIONS.find((s) => s.value === status)?.color ?? "bg-gray-100 text-gray-800";
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
