'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, ShieldCheck, FileSearch, Edit3 } from 'lucide-react';

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-zinc-800/80 bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0,transparent_70%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Explainable AI Resume Optimization Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-100 tracking-tight">
            Turn Your Resume Into a{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
              Job-Matched Resume.
            </span>
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Upload your resume and a job description. See exactly where you match, what you&apos;re missing, and improve your resume without leaving the app.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-950/40"
            >
              <span>Analyze My Resume</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/analysis/demo-analysis"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 transition-all"
            >
              <span>See Demo</span>
            </Link>
          </div>

          <div className="pt-6 flex items-center justify-center gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Multi-signal scoring engine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Evidence-based skill matrix</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Built-in live editor & version diff</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-14 max-w-5xl mx-auto rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-2xl p-4 sm:p-6 backdrop-blur">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-zinc-400">resumematch.app/analysis/demo</span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Score: 78% Match
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg bg-zinc-950 p-4 border border-zinc-800/60">
              <div className="text-xs text-zinc-400 font-medium">Required Skill Coverage</div>
              <div className="mt-2 text-2xl font-bold text-emerald-400">82%</div>
              <div className="mt-2 h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[82%]" />
              </div>
            </div>

            <div className="rounded-lg bg-zinc-950 p-4 border border-zinc-800/60">
              <div className="text-xs text-zinc-400 font-medium">Critical Skill Gaps</div>
              <div className="mt-2 text-2xl font-bold text-amber-400">1 Skill</div>
              <div className="mt-1 text-xs text-zinc-400">Missing evidence: Redis caching</div>
            </div>

            <div className="rounded-lg bg-zinc-950 p-4 border border-zinc-800/60">
              <div className="text-xs text-zinc-400 font-medium">Version Score Delta</div>
              <div className="mt-2 text-2xl font-bold text-emerald-400">+14%</div>
              <div className="mt-1 text-xs text-zinc-400">v1 (64%) → v2 (78%)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
