'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-slate-200/70 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <nav className="mx-auto max-w-6xl px-4 h-full">
        <div className="flex h-full items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-sm">
              <span className="text-[13px] font-bold">LL</span>
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold text-slate-900">Language Lens</div>
              <div className="hidden text-xs text-slate-500 sm:block">
                Learn any language from the world around you
              </div>
            </div>
          </Link>

          {/* Single CTA */}
          <Link
            href="/auth/signin?next=/dashboard/scan"
            className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:from-teal-600 hover:to-cyan-600"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
