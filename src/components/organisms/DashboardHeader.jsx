"use client";

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Label, ListBox, Select } from "@heroui/react";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import { MODULE_OPTIONS } from "@/config/sidebarConfig";
import { setActiveModule } from "@/lib/cookies";

export default function DashboardHeader({ activeModule, onModuleChange, onMenuToggle }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const role = user?.role;

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/unread-count`,
        { headers: { Authorization: `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)auth_token\s*=\s*([^;]*).*$)|^.*$/, "$1")}` } }
      )
        .then((r) => r.ok && r.json())
        .then((d) => setNotifCount(d?.data?.count ?? 0))
        .catch(() => {});
    }
  }, []);

  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  const handleModuleChange = (value) => {
    const mod = value;
    onModuleChange(mod);
    setActiveModule(mod);
    const firstItem =
      mod === "overview"
        ? "/admin"
        : `/admin/${mod}`;
    router.push(firstItem);
  };
const handleLogout = () => {
    logout();
    router.push("/login");
    setUserMenuOpen(false);
}
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface-raised px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 text-ink-secondary hover:text-ink transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="size-5" />
        </button>

        {isAdmin && (
          <Select
            className="w-52"
            placeholder="Select module"
            variant="secondary"
            value={activeModule}
            onChange={handleModuleChange}
            aria-label="Admin module"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator>
                <ChevronDown className="size-4" />
              </Select.Indicator>
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {MODULE_OPTIONS.map((mod) => (
                  <ListBox.Item key={mod.id} id={mod.id} textValue={mod.name}>
                    {mod.name}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        )}
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          className="relative p-1.5 text-ink-secondary hover:text-ink transition-colors"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          {notifCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-medium text-ink-inverse">
              {notifCount > 99 ? "99+" : notifCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-ink-secondary hover:bg-surface-sunken hover:text-ink transition-colors"
          >
            <span className="hidden sm:inline font-medium">{user?.name || "User"}</span>
            <ChevronDown className="size-4" />
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-md border border-border bg-surface-raised py-1 shadow-card">
                <button
                  onClick={() => { setUserMenuOpen(false); router.push("/dashboard"); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink-secondary hover:bg-surface-sunken hover:text-ink transition-colors"
                >
                  <User className="size-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger-bg transition-colors"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
