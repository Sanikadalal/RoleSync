'use client';

import { ResumeVersionSnapshot } from '@/lib/types';
import { GitCompare, TrendingUp, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface VersionComparisonViewProps {
  v1Snapshot: ResumeVersionSnapshot;
  v2Snapshot: ResumeVersionSnapshot;
  resumeId: string;
}

export function VersionComparisonView({
  v1Snapshot,
  v2Snapshot,
  resumeId,
}: VersionComparisonViewProps) {
  const scoreDiff = v2Snapshot.analysis.overallScore - v1Snapshot.analysis.overallScore;
  const reqDiff =
    v2Snapshot.analysis.scoreBreakdown.requiredSkills -
    v1Snapshot.analysis.scoreBreakdown.requiredSkills;
  const kwDiff =
    v2Snapshot.analysis.scoreBreakdown.keywordCoverage -
    v1Snapshot.analysis.scoreBreakdown.keywordCoverage;
  const expDiff =
    v2Snapshot.analysis.scoreBreakdown.experienceAlignment -
    v1Snapshot.analysis.scoreBreakdown.experienceAlignment;

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-black pb-6">
          <div className="space-y-1">
            <Link
              href={`/analysis/${v2Snapshot.analysis.id}`}
              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-emerald-400 transition-colors mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Analysis Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <GitCompare className="h-6 w-6 text-emerald-400" />
              Version Comparison: v{v1Snapshot.versionNumber} vs v{v2Snapshot.versionNumber}
            </h1>
          </div>

          <Link
            href={`/editor/${resumeId}?analysisId=${v2Snapshot.analysis.id}`}
            className="rounded-xl bg-violet-300 px-5 py-2 text-xs font-semibold text-black hover:bg-violet-400 transition-all shadow-md"
          >
            Continue Editing
          </Link>
        </div>

        {/* Score Delta Summary Box */}
        <div className="rounded-xl border-2 border-black bg-zinc-900/80 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                Score Delta Progression
              </span>
              <div className="mt-1 flex items-center gap-4 text-3xl font-extrabold text-zinc-100">
                <span>{v1Snapshot.analysis.overallScore}%</span>
                <ArrowRight className="h-6 w-6 text-zinc-500" />
                <span className="text-emerald-400">{v2Snapshot.analysis.overallScore}%</span>
                <span
                  className={`text-sm font-bold px-2.5 py-1 rounded ${
                    scoreDiff >= 0
                      ? 'bg-emerald-200 text-emerald-400 border-2 border-black'
                      : 'bg-red-200 text-red-400 border-2 border-black'
                  }`}
                >
                  {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff} points
                </span>
              </div>
            </div>

            {/* Category Deltas */}
            <div className="grid grid-cols-3 gap-4 border-l-2 border-black pl-6 text-xs">
              <div>
                <div className="text-zinc-400">Required Skills</div>
                <div className="font-bold text-emerald-400">
                  {v1Snapshot.analysis.scoreBreakdown.requiredSkills}% →{' '}
                  {v2Snapshot.analysis.scoreBreakdown.requiredSkills}%
                </div>
              </div>
              <div>
                <div className="text-zinc-400">Keywords</div>
                <div className="font-bold text-emerald-400">
                  {v1Snapshot.analysis.scoreBreakdown.keywordCoverage}% →{' '}
                  {v2Snapshot.analysis.scoreBreakdown.keywordCoverage}%
                </div>
              </div>
              <div>
                <div className="text-zinc-400">Experience</div>
                <div className="font-bold text-emerald-400">
                  {v1Snapshot.analysis.scoreBreakdown.experienceAlignment}% →{' '}
                  {v2Snapshot.analysis.scoreBreakdown.experienceAlignment}%
                </div>
              </div>
            </div>
          </div>

          {/* Why did score change? Callout */}
          <div className="mt-6 rounded-lg border-2 border-black bg-emerald-200 p-4 text-xs text-emerald-300">
            <span className="font-bold text-zinc-100">Why did the score change? </span>
            {v2Snapshot.changesSummary.join('; ')}
          </div>
        </div>

        {/* Side-by-Side Resume View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: Previous Version */}
          <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <span className="text-xs font-semibold text-zinc-400">
                Version #{v1Snapshot.versionNumber} ({new Date(v1Snapshot.createdAt).toLocaleDateString('en-GB', { timeZone: 'UTC' })})
              </span>
              <span className="text-xs font-bold text-zinc-400">
                Score: {v1Snapshot.analysis.overallScore}%
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs text-zinc-400">
              <div>
                <span className="text-zinc-300 font-semibold block mb-1">Skills List:</span>
                <p className="bg-zinc-950 p-3 rounded border-2 border-black">
                  {v1Snapshot.resumeData.skills.join(', ')}
                </p>
              </div>

              <div>
                <span className="text-zinc-300 font-semibold block mb-1">Work Experience:</span>
                <div className="space-y-2">
                  {v1Snapshot.resumeData.experience.map((exp) => (
                    <div key={exp.id} className="bg-zinc-950 p-3 rounded border-2 border-black space-y-1">
                      <div className="text-zinc-200 font-bold">
                        {exp.role} — {exp.company}
                      </div>
                      {exp.description.map((bullet, i) => (
                        <div key={i} className="text-zinc-400">
                          • {bullet}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Current Version (With Additions Highlighted) */}
          <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <span className="text-xs font-semibold text-emerald-400">
                Version #{v2Snapshot.versionNumber} (Current)
              </span>
              <span className="text-xs font-bold text-emerald-400">
                Score: {v2Snapshot.analysis.overallScore}%
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs text-zinc-300">
              <div>
                <span className="text-zinc-100 font-semibold block mb-1">Skills List:</span>
                <p className="bg-zinc-950 p-3 rounded border-2 border-black text-emerald-300">
                  {v2Snapshot.resumeData.skills.join(', ')}
                </p>
              </div>

              <div>
                <span className="text-zinc-100 font-semibold block mb-1">Work Experience:</span>
                <div className="space-y-2">
                  {v2Snapshot.resumeData.experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-zinc-950 p-3 rounded border-2 border-black space-y-1"
                    >
                      <div className="text-emerald-400 font-bold">
                        {exp.role} — {exp.company}
                      </div>
                      {exp.description.map((bullet, i) => (
                        <div key={i} className="text-emerald-300 font-medium">
                          • {bullet}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
