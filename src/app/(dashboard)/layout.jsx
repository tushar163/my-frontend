"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getActiveModule } from "@/lib/cookies";
import { ROUTE_ACCESS } from "@/config/routeAccess";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import DashboardHeader from "@/components/organisms/DashboardHeader";

/* Layer 2 (this layout): client-side safety net for stale role state.
   Layer 1 (proxy.js): route access, the real security boundary.
   Layer 3 (<Can>): UI visibility within shared pages. */

export default function DashboardLayout({ children }) {
  const { user, isAuthenticated, status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeModule, setActiveModuleState] = useState(() => getActiveModule());

  useEffect(() => {
    if (status === "succeeded" && user) {
      const entry = ROUTE_ACCESS.find((r) => pathname.startsWith(r.prefix));
      if (entry && !entry.roles.includes(user.role)) {
        router.replace("/unauthorized");
      }
    }
  }, [status, user, pathname, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-ink-secondary">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-ink-secondary">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar
        activeModule={activeModule}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader
          activeModule={activeModule}
          onModuleChange={setActiveModuleState}
          onMenuToggle={() => setMobileOpen((o) => !o)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
