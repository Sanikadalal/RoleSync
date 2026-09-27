'use client';

import { MatchAnalysis } from '@/lib/types';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Layers,
  FileCheck,
} from 'lucide-react';
import Link from 'next/link';

interface OverviewTabProps {
  analysis: MatchAnalysis;
  onSelectTab: (tabId: string) => void;
}

export function OverviewTab({ analysis, onSelectTab }: OverviewTabProps) {
  const { overallScore, scoreBreakdown, skills, gaps, recommendations, explainableSummary } =
    analysis;

  const criticalGaps = gaps.filter((g) => g.severity === 'critical');
  const matchedSkills = skills.filter((s) => s.status === 'matched');

  return (
    <div className="space-y-8">
      {/* Hero Score Box */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 backdrop-blur">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Resume–Job Match Score
              </span>
              <span className="text-xs text-zinc-400">• Multi-Signal Calculated</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed font-medium">
              {explainableSummary}
            </p>
            <div className="text-xs text-zinc-400">
              Note: This score reflects factual keyword and project evidence alignment, not an automated hiring outcome.
            </div>
          </div>

          <div className="flex items-center gap-6 self-center lg:self-auto">
            <div className="relative flex items-center justify-center">
              <div className="h-28 w-28 rounded-full border-4 border-zinc-800 flex items-center justify-center bg-zinc-950">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-emerald-400">{overallScore}%</div>
                  <div className="text-[10px] text-zinc-400 font-medium">Overall Match</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href={`/editor/${analysis.resumeId}?analysisId=${analysis.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-950/40"
              >
                <span>Edit Resume & Improve</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <button
                onClick={() => onSelectTab('recommendations')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                View Recommendations
              </button>
            </div>
          </div>
        </div>

        {/* Score Breakdown Progress Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-zinc-800/80 pt-6">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-zinc-400">Required Skills (30%)</span>
              <span className="text-emerald-400 font-bold">{scoreBreakdown.requiredSkills}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${scoreBreakdown.requiredSkills}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-zinc-400">Preferred Skills (10%)</span>
              <span className="text-teal-400 font-bold">{scoreBreakdown.preferredSkills}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all"
                style={{ width: `${scoreBreakdown.preferredSkills}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-zinc-400">Experience Alignment (20%)</span>
              <span className="text-emerald-400 font-bold">{scoreBreakdown.experienceAlignment}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${scoreBreakdown.experienceAlignment}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-zinc-400">Keyword Coverage (10%)</span>
              <span className="text-emerald-400 font-bold">{scoreBreakdown.keywordCoverage}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${scoreBreakdown.keywordCoverage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Strengths & Critical Gaps Dual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Demonstrated Strengths */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Demonstrated Skill Strengths</h3>
          </div>

          <div className="space-y-3">
            {matchedSkills.slice(0, 4).map((s, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-100">{s.normalizedSkill}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {s.importance}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-1">{s.evidence}</p>
                </div>
                <span className="text-xs font-bold text-emerald-400">{s.matchPercentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Gaps */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Critical Skill Gaps</h3>
          </div>

          {criticalGaps.length > 0 ? (
            <div className="space-y-3">
              {criticalGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-300">{gap.skill}</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      {gap.severity}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-zinc-300">{gap.recommendation}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 text-center text-xs text-zinc-400">
              No critical required skill gaps detected! All required technologies have evidence.
            </div>
          )}
        </div>
      </div>

      {/* Highest Impact Recommendations Preview */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Highest Impact Recommendations</h3>
          </div>

          <button
            onClick={() => onSelectTab('recommendations')}
            className="text-xs text-emerald-400 hover:underline"
          >
            View all ({recommendations.length})
          </button>
        </div>

        <div className="space-y-3">
          {recommendations.slice(0, 2).map((rec) => (
            <div
              key={rec.id}
              className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <h4 className="text-xs font-semibold text-zinc-200">{rec.title}</h4>
                <p className="mt-1 text-xs text-zinc-400">{rec.problem}</p>
              </div>

              <Link
                href={`/editor/${analysis.resumeId}?analysisId=${analysis.id}`}
                className="shrink-0 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all"
              >
                Apply Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
