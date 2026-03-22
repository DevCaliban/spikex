"use client";

import AdminGuard from "./AdminGuard";
import AdminSidebar from "./AdminSidebar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function AdminContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div
        className={`transition-all duration-300 ${
          collapsed ? "lg:pl-18" : "lg:pl-60"
        }`}
      >
        <div className="lg:hidden h-14" />
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <SidebarProvider>
        <AdminContent>{children}</AdminContent>
      </SidebarProvider>
    </AdminGuard>
  );
}
