import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4">
      <h1 className="text-6xl font-display font-bold text-danger">403</h1>
      <p className="mt-4 text-lg text-ink-secondary">You do not have access to this area.</p>
      <Link href="/" className="mt-6 rounded-md bg-brand-navy px-6 py-2 text-sm font-medium text-ink-inverse hover:opacity-90 transition-opacity">
        Go Home
      </Link>
    </div>
  );
}
