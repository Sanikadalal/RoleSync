'use client';

import { useState } from 'react';
import { MatchAnalysis, ResumeVersionSnapshot } from '@/lib/types';
import { OverviewTab } from './OverviewTab';
import { SkillsTab } from './SkillsTab';
import { KeywordsTab } from './KeywordsTab';
import { QualityTab } from './QualityTab';
import { RecommendationsTab } from './RecommendationsTab';
import { VersionsTab } from './VersionsTab';
import { ExportMenu } from '../export/ExportMenu';
import {
  FileCheck,
  Briefcase,
  Building,
  Edit3,
  GitBranch,
  Sparkles,
  Layers,
  KeyRound,
  FileText,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import Link from 'next/link';

interface AnalysisDashboardProps {
  analysis: MatchAnalysis;
  roleTitle?: string;
  company?: string;
  snapshots?: ResumeVersionSnapshot[];
}

export function AnalysisDashboard({
  analysis,
  roleTitle = 'Senior Backend Engineer',
  company = 'Enterprise Tech Corp',
  snapshots = [],
}: AnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileCheck },
    { id: 'skills', label: 'Skills Matrix', icon: Layers, count: analysis.skills.length },
    { id: 'keywords', label: 'Keywords', icon: KeyRound },
    { id: 'quality', label: 'Resume Quality', icon: FileText },
    {
      id: 'recommendations',
      label: 'Suggestions',
      icon: Sparkles,
      count: analysis.recommendations.length,
    },
    { id: 'versions', label: 'Versions', icon: GitBranch, count: snapshots.length || 1 },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pb-16">
      {/* Header Banner */}
      <div className="border-b border-zinc-800 bg-zinc-900/60 pt-8 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                <Briefcase className="h-4 w-4" />
                <span>{roleTitle}</span>
                <span className="text-zinc-600">•</span>
                <Building className="h-4 w-4 text-zinc-400" />
                <span className="text-zinc-300">{company}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight flex items-center gap-3">
                Resume–Job Match Analysis
                <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300">
                  Version #{analysis.versionNumber}
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <ExportMenu analysis={analysis} />

              <Link
                href={`/editor/${analysis.resumeId}?analysisId=${analysis.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-950/40"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Resume</span>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="mt-8 flex items-center gap-2 border-b border-zinc-800/80 overflow-x-auto no-scrollbar">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === t.id
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <t.icon className="h-4 w-4" />
                <span>{t.label}</span>
                {t.count !== undefined && (
                  <span className="ml-1 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-300">
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tab Body */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'overview' && (
          <OverviewTab analysis={analysis} onSelectTab={setActiveTab} />
        )}
        {activeTab === 'skills' && <SkillsTab skills={analysis.skills} />}
        {activeTab === 'keywords' && <KeywordsTab keywords={analysis.keywords} />}
        {activeTab === 'quality' && <QualityTab quality={analysis.resumeQuality} />}
        {activeTab === 'recommendations' && (
          <RecommendationsTab
            recommendations={analysis.recommendations}
            resumeId={analysis.resumeId}
            analysisId={analysis.id}
          />
        )}
        {activeTab === 'versions' && (
          <VersionsTab snapshots={snapshots} resumeId={analysis.resumeId} />
        )}
      </main>
    </div>
  );
}
