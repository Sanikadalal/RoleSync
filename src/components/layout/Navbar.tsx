'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileCheck, Sparkles, LayoutDashboard, FileText, ArrowRight } from 'lucide-react';

const links = [
  { href: '/analyze', label: 'Check resume', icon: Sparkles },
  { href: '/dashboard', label: 'My results', icon: LayoutDashboard },
  { href: '/analysis/demo-analysis', label: 'Example', icon: FileText, hideOnMobile: true },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-violet-300 shadow-[3px_3px_0_0_#000] transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
            <FileCheck className="h-5 w-5 text-black" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight text-black">ResumeMatch</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-bold sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? 'page' : undefined}
              className={`items-center gap-1.5 border-2 px-3 py-1.5 transition-colors ${
                l.hideOnMobile ? 'hidden sm:flex' : 'flex'
              } ${
                pathname === l.href
                  ? 'border-black bg-black text-white'
                  : 'border-transparent text-black hover:border-black hover:bg-yellow-200'
              }`}
            >
              <l.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{l.label}</span>
            </Link>
          ))}
        </nav>

        <Link
          href="/analyze"
          className="inline-flex items-center justify-center gap-1.5 bg-violet-300 px-4 py-2 text-sm text-black"
        >
          <span>Get started</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
