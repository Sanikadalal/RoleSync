'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileCheck, Sparkles, LayoutDashboard, FileText, ArrowRight } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
            <FileCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-100 tracking-tight text-lg">
              Resume<span className="text-emerald-400">Match</span>
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4 text-sm font-medium">
          <Link
            href="/analyze"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              pathname === '/analyze'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Analyze</span>
          </Link>

          <Link
            href="/dashboard"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              pathname === '/dashboard'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <LayoutDashboard className="h-4 w-4 text-zinc-400" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/analysis/demo-analysis"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
          >
            <FileText className="h-4 w-4 text-emerald-400" />
            <span>Live Demo</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/analyze?demo=true"
            className="hidden md:inline-flex items-center justify-center rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 transition-all"
          >
            Try Demo
          </Link>

          <Link
            href="/analyze"
            className="inline-flex items-center gap-1.5 justify-center rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-all shadow-sm shadow-emerald-950/20"
          >
            <span>Start Matching</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
