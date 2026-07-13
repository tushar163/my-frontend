"use client";

import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { sidebarConfig } from "@/config/sidebarConfig";

export default function DashboardSidebar({ activeModule, mobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const role = user?.role;

  const navItems =
    role === "ADMIN" || role === "SUPER_ADMIN"
      ? sidebarConfig.ADMIN?.[activeModule] || []
      : sidebarConfig[role] || [];

  const isActive = (href) => {
    if (href === "/admin" || href === "/agent" || href === "/hotel-owner" || href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-surface-raised border-r border-border">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        {!collapsed && (
          <span className="font-display text-lg font-semibold text-ink">
            {role === "ADMIN" || role === "SUPER_ADMIN" ? "Admin" : role?.replace("_", " ")?.toLowerCase()}
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-navy text-ink-inverse"
                  : "text-ink-secondary hover:bg-surface-sunken hover:text-ink"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed((c) => !c)}
        className="hidden lg:flex items-center justify-center border-t border-border p-3 text-ink-secondary hover:text-ink transition-colors"
      >
        {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col transition-all duration-200 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />
          <aside className="relative h-full w-60 bg-surface-raised shadow-card">
            <button
              onClick={onMobileClose}
              className="absolute right-2 top-2 p-1 text-ink-secondary hover:text-ink"
            >
              <X className="size-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
