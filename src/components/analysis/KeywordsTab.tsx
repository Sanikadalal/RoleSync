'use client';

import { KeywordAnalysis } from '@/lib/types';
import { CheckCircle2, XCircle, AlertTriangle, KeyRound, ShieldAlert } from 'lucide-react';

interface KeywordsTabProps {
  keywords: KeywordAnalysis;
}

export function KeywordsTab({ keywords }: KeywordsTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="flex items-center gap-2 mb-2">
          <KeyRound className="h-5 w-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Keyword & Vocabulary Analysis</h3>
        </div>
        <p className="text-xs text-zinc-400">
          Evaluates explicit technical vocabulary present in the job description versus your resume text.
        </p>

        <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-300 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>
            Anti-Keyword Stuffing Guard: Only add missing terms to your resume if they truthfully reflect your actual project and work experience.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Present Keywords */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <h4 className="text-sm font-semibold text-zinc-100">
              Present Keywords ({keywords.present.length})
            </h4>
          </div>

          <div className="flex flex-wrap gap-2">
            {keywords.present.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-red-400" />
            <h4 className="text-sm font-semibold text-zinc-100">
              Missing Keywords ({keywords.missing.length})
            </h4>
          </div>

          {keywords.missing.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {keywords.missing.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400">All target job description keywords detected in resume!</p>
          )}
        </div>
      </div>

      {/* Important Domain Phrases */}
      {keywords.importantPhrases.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h4 className="text-sm font-semibold text-zinc-100 mb-3">Target Industry Domain Phrases</h4>
          <div className="flex flex-wrap gap-2">
            {keywords.importantPhrases.map((phrase, i) => (
              <span
                key={i}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-mono text-zinc-300"
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
