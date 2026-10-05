'use client';

import { ResumeVersionSnapshot } from '@/lib/types';
import { GitBranch, Clock, ArrowRight, GitCompare, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface VersionsTabProps {
  snapshots: ResumeVersionSnapshot[];
  resumeId: string;
}

export function VersionsTab({ snapshots, resumeId }: VersionsTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitBranch className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Resume Version History</h3>
          </div>
          <p className="text-xs text-zinc-400">
            Every re-analysis creates an immutable snapshot so you can track score progression over time.
          </p>
        </div>

        {snapshots.length >= 2 && (
          <Link
            href={`/compare/${resumeId}?v1=1&v2=${snapshots.length}`}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-200 border-2 border-black px-4 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-200 transition-all"
          >
            <GitCompare className="h-4 w-4" />
            <span>Compare v1 vs v{snapshots.length}</span>
          </Link>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-zinc-800">
        {snapshots.map((snap) => (
          <div key={snap.id} className="relative pl-10">
            <div className="absolute left-2.5 top-5 h-3 w-3 rounded-full border-2 border-black bg-zinc-950 -translate-x-1/2" />

            <div className="rounded-xl border-2 border-black bg-zinc-900/80 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-zinc-100">
                    Version #{snap.versionNumber}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border-2 border-black">
                    Match: {snap.analysis.overallScore}%
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(snap.createdAt).toLocaleDateString('en-GB', { timeZone: 'UTC' })}
                  </span>
                </div>

                <div className="text-xs text-zinc-300">
                  {snap.changesSummary.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 mt-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <Link
                  href={`/compare/${resumeId}?v1=${snap.versionNumber}&v2=${snapshots.length}`}
                  className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
                >
                  Compare
                </Link>

                <Link
                  href={`/editor/${resumeId}?analysisId=${snap.analysis.id}`}
                  className="rounded-lg bg-emerald-200 border-2 border-black px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-200 transition-colors"
                >
                  Open in Editor
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
