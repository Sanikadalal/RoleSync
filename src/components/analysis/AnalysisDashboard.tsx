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
    { id: 'overview', label: 'Score', icon: FileCheck },
    {
      id: 'recommendations',
      label: 'What to fix',
      icon: Sparkles,
      count: analysis.recommendations.length,
    },
    { id: 'skills', label: 'Skills', icon: Layers, count: analysis.skills.length },
    { id: 'keywords', label: 'Keywords', icon: KeyRound },
    { id: 'quality', label: 'Resume quality', icon: FileText },
    { id: 'versions', label: 'Versions', icon: GitBranch, count: snapshots.length || 1 },
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* Header Banner */}
      <div className="border-b-4 border-black bg-violet-300 pt-8 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-black">
                <Briefcase className="h-4 w-4" />
                <span>{roleTitle}</span>
                <span className="text-zinc-600">•</span>
                <Building className="h-4 w-4 text-zinc-400" />
                <span className="text-zinc-300">{company}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight flex items-center gap-3">
                Resume–Job Match Analysis
                <span className="text-xs font-mono font-bold px-2.5 py-1 border-2 border-black bg-white text-black">
                  Version #{analysis.versionNumber}
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <ExportMenu analysis={analysis} />

              <Link
                href={`/editor/${analysis.resumeId}?analysisId=${analysis.id}`}
                className="inline-flex items-center gap-2 bg-yellow-300 px-5 py-2.5 text-sm text-black border-2 border-black shadow-[4px_4px_0_0_#000] font-bold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Resume</span>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="mt-8 flex items-end gap-2 overflow-x-auto pb-1 no-scrollbar">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                aria-current={activeTab === t.id ? 'page' : undefined}
                className={`flex items-center gap-2 border-2 border-black px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === t.id
                    ? 'bg-black text-white shadow-[4px_4px_0_0_#7c3aed]'
                    : 'bg-white text-black hover:-translate-y-0.5 hover:bg-yellow-200'
                }`}
              >
                <t.icon className="h-4 w-4" />
                <span>{t.label}</span>
                {t.count !== undefined && (
                  <span className="ml-1 border border-black bg-yellow-300 px-1.5 text-[11px] font-mono text-black">
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
