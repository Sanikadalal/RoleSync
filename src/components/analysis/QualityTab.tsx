'use client';

import { ResumeQualityMetrics } from '@/lib/types';
import { FileText, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';

interface QualityTabProps {
  quality: ResumeQualityMetrics;
}

export function QualityTab({ quality }: QualityTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-zinc-100">
            Independent Resume Quality Audit
          </h3>
        </div>
        <p className="text-xs text-zinc-400">
          This report analyzes your resume writing independently from any specific job description. High quality scores ensure recruiter readability and strong impact.
        </p>
      </div>

      {/* Quality Score Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border-2 border-black bg-zinc-950 p-5">
          <div className="text-xs text-zinc-400 font-medium">Readability & Tone</div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-400">
            {quality.readability}%
          </div>
          <div className="mt-2 h-3 w-full bg-white border-2 border-black overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${quality.readability}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border-2 border-black bg-zinc-950 p-5">
          <div className="text-xs text-zinc-400 font-medium">Structure & Headers</div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-400 font-mono">
            {quality.structure}%
          </div>
          <div className="mt-2 h-3 w-full bg-white border-2 border-black overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${quality.structure}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border-2 border-black bg-zinc-950 p-5">
          <div className="text-xs text-zinc-400 font-medium">Quantified Impact</div>
          <div
            className={`mt-2 text-3xl font-extrabold font-mono ${
              quality.impact >= 70
                ? 'text-emerald-400'
                : quality.impact >= 50
                ? 'text-amber-400'
                : 'text-red-400'
            }`}
          >
            {quality.impact}%
          </div>
          <div className="mt-2 h-3 w-full bg-white border-2 border-black overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${quality.impact}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border-2 border-black bg-zinc-950 p-5">
          <div className="text-xs text-zinc-400 font-medium">Technical Evidence</div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-400 font-mono">
            {quality.technicalEvidence}%
          </div>
          <div className="mt-2 h-3 w-full bg-white border-2 border-black overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${quality.technicalEvidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bullet Quality Suggestions */}
      <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          <h4 className="text-sm font-semibold text-zinc-100">
            Bullet Rewriting Opportunities ({quality.bulletQualitySuggestions.length})
          </h4>
        </div>

        {quality.bulletQualitySuggestions.length > 0 ? (
          <div className="space-y-4">
            {quality.bulletQualitySuggestions.map((s, idx) => (
              <div
                key={idx}
                className="rounded-lg border-2 border-black bg-zinc-950 p-4 space-y-2"
              >
                <div className="text-[10px] font-mono text-zinc-400 uppercase">{s.section}</div>
                <div className="text-xs text-red-300 bg-red-200 p-2.5 rounded border-2 border-black">
                  <span className="font-semibold">Original: </span> &quot;{s.original}&quot;
                </div>
                <div className="text-xs text-emerald-300 bg-emerald-200 p-2.5 rounded border-2 border-black">
                  <span className="font-semibold">Suggestion: </span> &quot;{s.suggestion}&quot;
                </div>
                <p className="text-[11px] text-zinc-400 italic">Reason: {s.reason}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-400">
            Great work! All your experience bullets contain strong action verbs and technical details.
          </p>
        )}
      </div>
    </div>
  );
}
