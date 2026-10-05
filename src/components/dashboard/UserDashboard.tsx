'use client';

import { MatchAnalysis } from '@/lib/types';
import {
  FileText,
  Briefcase,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  BarChart3,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

interface UserDashboardProps {
  analyses: MatchAnalysis[];
}

export function UserDashboard({ analyses }: UserDashboardProps) {
  const totalAnalyses = analyses.length;
  const avgMatch =
    totalAnalyses > 0
      ? Math.round(
          analyses.reduce((acc, curr) => acc + curr.overallScore, 0) / totalAnalyses
        )
      : 0;

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-black pb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">ResumeMatch Dashboard</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Track your job description match scores, resume versions, and skill optimization progression.
            </p>
          </div>

          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-300 px-5 py-2.5 text-xs font-semibold text-black hover:bg-violet-400 transition-all shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>New Resume Analysis</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Total Analyses</span>
              <FileText className="h-4 w-4 text-violet-700" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-zinc-100 font-mono">
              {totalAnalyses}
            </div>
          </div>

          <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Average Match Score</span>
              <BarChart3 className="h-4 w-4 text-violet-700" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-violet-700 font-mono">
              {avgMatch}%
            </div>
          </div>

          <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Average Score Delta</span>
              <TrendingUp className="h-4 w-4 text-violet-700" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-teal-400 font-mono">
              +14%
            </div>
          </div>

          <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Active Resumes</span>
              <Layers className="h-4 w-4 text-violet-700" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-zinc-100 font-mono">
              1
            </div>
          </div>
        </div>

        {/* Recent Analyses List */}
        <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-100">Recent Job Analyses</h2>

          <div className="space-y-3">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="rounded-lg border-2 border-black bg-zinc-950 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-black transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-100">
                      Backend Engineer — Enterprise Tech Corp
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      Version #{analysis.versionNumber}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Analyzed {new Date(analysis.createdAt).toLocaleDateString('en-GB', { timeZone: 'UTC' })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-violet-700">
                      {analysis.overallScore}%
                    </div>
                    <div className="text-[10px] text-zinc-400">Match Score</div>
                  </div>

                  <Link
                    href={`/analysis/${analysis.id}`}
                    className="rounded-lg bg-violet-200 border-2 border-black px-3.5 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-200 transition-all flex items-center gap-1"
                  >
                    <span>View Report</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
