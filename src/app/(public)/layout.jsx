import Link from "next/link";

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-40 border-b border-border bg-surface-raised">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-display font-bold text-brand-navy">
            MyFrontend
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-ink">
            <Link href="/properties" className="hover:text-brand-gold transition-colors">Properties</Link>
            <Link href="/hotels" className="hover:text-brand-gold transition-colors">Hotels</Link>
            <Link href="/about" className="hover:text-brand-gold transition-colors">About</Link>
            <Link href="/login" className="ml-4 rounded-md bg-brand-navy px-4 py-2 text-ink-inverse hover:opacity-90 transition-opacity">Sign In</Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-surface-raised py-8 text-center text-sm text-ink-secondary">
        &copy; {new Date().getFullYear()} MyFrontend. All rights reserved.
      </footer>
    </div>
  );
}
