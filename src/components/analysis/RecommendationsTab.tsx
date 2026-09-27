'use client';

import { ActionableRecommendation } from '@/lib/types';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface RecommendationsTabProps {
  recommendations: ActionableRecommendation[];
  resumeId: string;
  analysisId: string;
}

export function RecommendationsTab({
  recommendations,
  resumeId,
  analysisId,
}: RecommendationsTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Highest Impact Recommendations</h3>
        </div>
        <p className="text-xs text-zinc-400">
          Ranked by potential impact on your Resume-Job Match score. Click any recommendation to open the interactive editor and make edits.
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 flex flex-col md:flex-row items-start justify-between gap-6"
          >
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-semibold border ${
                    rec.priority === 'high'
                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                      : rec.priority === 'medium'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {rec.priority} Priority
                </span>
                <span className="text-xs text-zinc-400">• Relevant Section: {rec.relevantSection}</span>
              </div>

              <h4 className="text-sm font-semibold text-zinc-100">{rec.title}</h4>

              <div className="space-y-1.5 text-xs">
                <p className="text-zinc-300">
                  <span className="font-medium text-zinc-400">Problem: </span>
                  {rec.problem}
                </p>
                <p className="text-zinc-300">
                  <span className="font-medium text-zinc-400">Why it matters: </span>
                  {rec.whyItMatters}
                </p>
                <div className="mt-2 rounded-lg bg-zinc-950 p-3 border border-zinc-800 text-emerald-400">
                  <span className="font-semibold text-zinc-300">Suggested Change: </span>
                  {rec.suggestedChange}
                </div>
              </div>
            </div>

            <Link
              href={`/editor/${resumeId}?analysisId=${analysisId}`}
              className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-950/40"
            >
              <span>Edit Section</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
