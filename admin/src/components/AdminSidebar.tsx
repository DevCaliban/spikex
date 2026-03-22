"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { logout } from "@/lib/api";
import { useState } from "react";
import { useSidebar } from "@/context/SidebarContext";

const mainNav = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
    exact: true,
  },
  {
    href: "/shipments",
    label: "Shipments",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    exact: false,
  },
  {
    href: "/shipments/new",
    label: "New Shipment",
    icon: "M12 4.5v15m7.5-7.5h-15",
    exact: true,
  },
  {
    href: "/invoices",
    label: "Invoices",
    icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
    exact: false,
  },
];

const insightsNav = [
  {
    href: "/analytics",
    label: "Analytics",
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
    exact: true,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact === false) {
      if (href === "/shipments") {
        return (
          pathname === "/shipments" ||
          (pathname.startsWith("/shipments/") && !pathname.endsWith("/new"))
        );
      }
      if (href === "/invoices") {
        return (
          pathname === "/invoices" ||
          (pathname.startsWith("/invoices/") && !pathname.endsWith("/new"))
        );
      }
      return pathname.startsWith(href);
    }
    return pathname === href;
  };

  const NavLink = ({
    href,
    label,
    icon,
    exact,
  }: {
    href: string;
    label: string;
    icon: string;
    exact?: boolean;
  }) => {
    const active = isActive(href, exact);
    return (
      <Link
        href={href}
        onClick={() => setMobileOpen(false)}
        className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
          active
            ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
            : "text-gray-400 hover:text-white hover:bg-gray-800/70"
        } ${collapsed ? "justify-center px-2" : ""}`}
        title={collapsed ? label : undefined}
      >
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  const SectionLabel = ({ text }: { text: string }) =>
    !collapsed ? (
      <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-600">
        {text}
      </p>
    ) : (
      <div className="my-2 mx-3 border-t border-gray-800" />
    );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-gray-800 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo className={`h-7 brightness-0 invert ${collapsed ? "hidden" : ""}`} />
          {collapsed && <span className="text-white font-bold text-lg">SpikeX</span>}
        </Link>
        <button
          onClick={toggle}
          className="hidden lg:flex w-7 h-7 items-center justify-center rounded-md text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <SectionLabel text="Main" />
        <div className="space-y-1">
          {mainNav.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>

        <SectionLabel text="Insights" />
        <div className="space-y-1">
          {insightsNav.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-800 mx-3" />

      {/* Bottom section */}
      <div className="px-3 py-3 space-y-1">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all ${collapsed ? "justify-center px-2" : ""}`}
          title={collapsed ? "View Site" : undefined}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          {!collapsed && "View Site"}
        </Link>
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-600/10 transition-all ${collapsed ? "justify-center px-2" : ""}`}
          title={collapsed ? "Logout" : undefined}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          {!collapsed && "Logout"}
        </button>
      </div>

      {/* User */}
      <div className="border-t border-gray-800 px-3 py-3">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin</p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 h-14 flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <Logo className="h-6 brightness-0 invert" />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-gray-900">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-gray-900 border-r border-gray-800 z-40 transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-60"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
