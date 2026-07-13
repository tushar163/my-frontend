"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-display font-semibold text-ink">
        Welcome, {user?.name}
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total Bookings", value: "—", color: "text-info" },
          { label: "Saved Properties", value: "—", color: "text-brand-gold" },
          { label: "Notifications", value: "—", color: "text-warning" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-surface-raised p-4 shadow-card"
          >
            <p className="text-sm text-ink-secondary">{stat.label}</p>
            <p className={`mt-1 text-3xl font-display font-semibold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-surface-raised p-6 shadow-card">
        <h2 className="mb-4 text-lg font-display font-medium text-ink">Profile</h2>
        <div className="space-y-2 text-sm text-ink">
          <p>
            <span className="font-medium text-ink-secondary">Name:</span> {user?.name}
          </p>
          <p>
            <span className="font-medium text-ink-secondary">Email:</span> {user?.email}
          </p>
          <p>
            <span className="font-medium text-ink-secondary">Role:</span> {user?.role}
          </p>
        </div>
      </div>
    </div>
  );
}
