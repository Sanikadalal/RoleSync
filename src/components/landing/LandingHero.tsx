'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export function LandingHero() {
  return (
    <section className="relative border-b-4 border-black pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 border-2 border-black bg-yellow-300 px-3.5 py-1 font-mono text-xs font-bold uppercase text-black shadow-[3px_3px_0_0_#000]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Free resume checker</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.05] text-black sm:text-5xl lg:text-7xl">
            Does your resume{' '}
            <span className="inline-block -rotate-1 border-2 border-black bg-violet-300 px-3 shadow-[5px_5px_0_0_#000]">
              fit the job?
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-zinc-300">
            Upload your resume, paste a job, and get a clear match score. See what you have, what&apos;s missing, and
            fix it right here.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link
              href="/analyze"
              className="inline-flex w-full items-center justify-center gap-2 bg-violet-300 px-7 py-4 text-base text-black sm:w-auto"
            >
              <span>Check my resume</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/analysis/demo-analysis"
              className="inline-flex w-full items-center justify-center gap-2 border-2 border-black bg-white px-7 py-4 text-base font-bold text-black shadow-[4px_4px_0_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none sm:w-auto"
            >
              <span>See an example</span>
            </Link>
          </div>

          <ul className="flex flex-col items-center justify-center gap-2 pt-4 text-sm font-medium text-zinc-300 sm:flex-row sm:gap-6">
            {['No sign-up needed', 'Takes about a minute', 'Shows the proof, not just a number'].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-violet-700" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Result preview */}
        <div className="mx-auto mt-16 max-w-5xl border-4 border-black bg-white p-4 shadow-[10px_10px_0_0_#000] sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b-4 border-black pb-4">
            <span className="font-mono text-xs font-bold uppercase text-black">Example result</span>
            <span className="border-2 border-black bg-violet-300 px-3 py-1 text-sm font-extrabold text-black">
              78% match
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="border-2 border-black bg-violet-100 p-4">
              <div className="text-xs font-bold uppercase text-zinc-300">Must-have skills</div>
              <div className="mt-2 font-display text-4xl font-extrabold text-black">82%</div>
              <div className="mt-3 h-4 w-full border-2 border-black bg-white">
                <div className="h-full w-[82%] bg-violet-400" />
              </div>
            </div>

            <div className="border-2 border-black bg-yellow-200 p-4">
              <div className="text-xs font-bold uppercase text-zinc-300">Missing</div>
              <div className="mt-2 font-display text-4xl font-extrabold text-black">1 skill</div>
              <div className="mt-2 text-sm text-zinc-300">No proof of Redis caching</div>
            </div>

            <div className="border-2 border-black bg-emerald-500 p-4">
              <div className="text-xs font-bold uppercase text-zinc-300">After your edits</div>
              <div className="mt-2 font-display text-4xl font-extrabold text-black">+14%</div>
              <div className="mt-2 text-sm text-zinc-300">Version 1 (64%) to Version 2 (78%)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
