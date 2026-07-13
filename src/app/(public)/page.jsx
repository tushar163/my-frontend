"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 text-center">
      <h1 className="text-5xl font-display font-bold text-ink">
        Find Your Perfect{" "}
        <span className="text-brand-gold">Home</span>
      </h1>
      <p className="mt-4 text-lg text-ink-secondary max-w-2xl mx-auto">
        Browse properties and hotels across India. Whether you are looking to buy, rent,
        or book a stay — we have you covered.
      </p>
      <div className="mt-10 flex items-center justify-center gap-4">
        <Link href="/properties"
          className="rounded-md bg-brand-navy px-6 py-3 text-sm font-medium text-ink-inverse hover:opacity-90 transition-opacity">
          Browse Properties
        </Link>
        <Link href="/hotels"
          className="rounded-md border border-border bg-surface-raised px-6 py-3 text-sm font-medium text-ink hover:bg-surface transition-colors">
          Find Hotels
        </Link>
      </div>
    </div>
  );
}
