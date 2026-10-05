'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NormalizedResume, MatchAnalysis, ExperienceItem, ProjectItem } from '@/lib/types';
import { AIImproveModal } from './AIImproveModal';
import {
  Save,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  FileCheck,
  Building,
  Calendar,
  Code,
  CheckCircle2,
} from 'lucide-react';

interface ResumeEditorProps {
  initialResume: NormalizedResume;
  initialAnalysis: MatchAnalysis;
}

export function ResumeEditor({ initialResume, initialAnalysis }: ResumeEditorProps) {
  const router = useRouter();
  const [resume, setResume] = useState<NormalizedResume>(
    JSON.parse(JSON.stringify(initialResume))
  );

  const [currentAnalysis, setCurrentAnalysis] = useState<MatchAnalysis>(initialAnalysis);
  const [previousScore, setPreviousScore] = useState<number>(initialAnalysis.overallScore);

  const [isReanalyzing, setIsReanalyzing] = useState<boolean>(false);
  const [reanalyzeExplanation, setReanalyzeExplanation] = useState<string | null>(null);

  // AI Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [targetExpId, setTargetExpId] = useState<string | null>(null);
  const [targetBulletIdx, setTargetBulletIdx] = useState<number | null>(null);
  const [targetBulletText, setTargetBulletText] = useState('');

  // 1. Handlers for Experience Bullets
  const handleUpdateExpBullet = (expId: string, bulletIdx: number, val: string) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => {
        if (exp.id !== expId) return exp;
        const newDesc = [...exp.description];
        newDesc[bulletIdx] = val;
        return { ...exp, description: newDesc };
      }),
    }));
  };

  const handleAddExpBullet = (expId: string) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => {
        if (exp.id !== expId) return exp;
        return { ...exp, description: [...exp.description, 'New experience bullet item...'] };
      }),
    }));
  };

  const handleDeleteExpBullet = (expId: string, bulletIdx: number) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => {
        if (exp.id !== expId) return exp;
        return { ...exp, description: exp.description.filter((_, idx) => idx !== bulletIdx) };
      }),
    }));
  };

  // 2. Handlers for Skills List
  const handleSkillsChange = (val: string) => {
    const list = val.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
    setResume((prev) => ({ ...prev, skills: list }));
  };

  // 3. AI Improvement Modal Trigger
  const handleOpenAiModal = (expId: string, bulletIdx: number, text: string) => {
    setTargetExpId(expId);
    setTargetBulletIdx(bulletIdx);
    setTargetBulletText(text);
    setAiModalOpen(true);
  };

  const handleApplyAiSuggestion = (newText: string) => {
    if (targetExpId && targetBulletIdx !== null) {
      handleUpdateExpBullet(targetExpId, targetBulletIdx, newText);
    }
    setAiModalOpen(false);
  };

  // 4. Re-Analyze Trigger
  const handleReanalyze = async () => {
    setIsReanalyzing(true);
    setReanalyzeExplanation(null);

    try {
      const res = await fetch('/api/reanalyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updatedResume: resume,
          analysisId: currentAnalysis.id,
          jobId: currentAnalysis.jobId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to re-analyze resume.');
      }

      setPreviousScore(currentAnalysis.overallScore);
      setCurrentAnalysis(data.newAnalysis);
      setReanalyzeExplanation(data.explanation);
    } catch (err: any) {
      alert(err.message || 'Error re-analyzing resume');
    } finally {
      setIsReanalyzing(false);
    }
  };

  const scoreDiff = currentAnalysis.overallScore - previousScore;

  return (
    <div className="min-h-screen bg-zinc-950 pb-32">
      {/* Sticky Top Live Match Score Bar */}
      <div className="sticky top-16 z-40 w-full border-b-2 border-black bg-zinc-900/90 py-3.5 shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Live Match Score
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-extrabold text-violet-700">
                  {currentAnalysis.overallScore}%
                </span>
                {scoreDiff !== 0 && (
                  <span
                    className={`inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-xs font-bold ${
                      scoreDiff > 0
                        ? 'bg-violet-200 text-violet-700 border-2 border-black'
                        : 'bg-red-200 text-red-400 border-2 border-black'
                    }`}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff} pts
                  </span>
                )}
                <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                  (v{currentAnalysis.versionNumber})
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-4 border-l-2 border-black pl-6 text-xs text-zinc-400">
              <div>
                Req Skills: <span className="font-bold text-violet-700">{currentAnalysis.scoreBreakdown.requiredSkills}%</span>
              </div>
              <div>
                Keywords: <span className="font-bold text-violet-700">{currentAnalysis.scoreBreakdown.keywordCoverage}%</span>
              </div>
              <div>
                Experience: <span className="font-bold text-violet-700">{currentAnalysis.scoreBreakdown.experienceAlignment}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReanalyze}
              disabled={isReanalyzing}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-300 px-5 py-2 text-xs font-semibold text-black hover:bg-violet-400 transition-all shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isReanalyzing ? 'animate-spin' : ''}`} />
              <span>Re-Analyze Resume</span>
            </button>
          </div>
        </div>

        {reanalyzeExplanation && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2 text-xs text-violet-700 font-medium">
            {reanalyzeExplanation}
          </div>
        )}
      </div>

      {/* Editor Content Area */}
      <main className="mx-auto max-w-4xl px-4 pt-8 space-y-8">
        {/* Header Section */}
        <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-100 border-b-2 border-black pb-2">
            Header & Contact Info
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Full Name</label>
              <input
                type="text"
                value={resume.name}
                onChange={(e) => setResume({ ...resume, name: e.target.value })}
                className="w-full rounded-lg border-2 border-black bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Email Address</label>
              <input
                type="text"
                value={resume.email}
                onChange={(e) => setResume({ ...resume, email: e.target.value })}
                className="w-full rounded-lg border-2 border-black bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-black focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-6 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-100 border-b-2 border-black pb-2">
            Professional Summary
          </h2>
          <textarea
            rows={3}
            value={resume.summary}
            onChange={(e) => setResume({ ...resume, summary: e.target.value })}
            className="w-full rounded-lg border-2 border-black bg-zinc-950 p-3 text-xs text-zinc-200 focus:border-black focus:outline-none leading-relaxed"
          />
        </div>

        {/* Technical Skills Section */}
        <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-6 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-100 border-b-2 border-black pb-2">
            Technical Skills (Comma separated)
          </h2>
          <textarea
            rows={2}
            value={resume.skills.join(', ')}
            onChange={(e) => handleSkillsChange(e.target.value)}
            className="w-full rounded-lg border-2 border-black bg-zinc-950 p-3 text-xs text-zinc-200 focus:border-black focus:outline-none font-mono"
          />
        </div>

        {/* Experience Section */}
        <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="text-sm font-semibold text-zinc-100">Work Experience</h2>
          </div>

          {resume.experience.map((exp) => (
            <div
              key={exp.id}
              className="rounded-lg border-2 border-black bg-zinc-950 p-5 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        experience: resume.experience.map((x) =>
                          x.id === exp.id ? { ...x, company: e.target.value } : x
                        ),
                      })
                    }
                    className="w-full rounded border-2 border-black bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Role Title</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        experience: resume.experience.map((x) =>
                          x.id === exp.id ? { ...x, role: e.target.value } : x
                        ),
                      })
                    }
                    className="w-full rounded border-2 border-black bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Experience Bullets */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-medium text-zinc-400">Bullet Points & Evidence:</label>
                {exp.description.map((bullet, bulletIdx) => (
                  <div key={bulletIdx} className="flex items-start gap-2">
                    <textarea
                      rows={2}
                      value={bullet}
                      onChange={(e) =>
                        handleUpdateExpBullet(exp.id, bulletIdx, e.target.value)
                      }
                      className="w-full rounded border-2 border-black bg-zinc-900 p-2.5 text-xs text-zinc-200 focus:border-black focus:outline-none"
                    />

                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenAiModal(exp.id, bulletIdx, bullet)}
                        className="inline-flex items-center gap-1 rounded bg-violet-200 border-2 border-black px-2.5 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-200"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>AI Suggest</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteExpBullet(exp.id, bulletIdx)}
                        className="p-1 text-zinc-500 hover:text-red-400 self-center"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => handleAddExpBullet(exp.id)}
                  className="inline-flex items-center gap-1.5 text-xs text-violet-700 hover:underline pt-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Experience Bullet</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* AI Improvement Modal */}
      <AIImproveModal
        isOpen={aiModalOpen}
        originalBullet={targetBulletText}
        contextRole={resume.experience[0]?.role || 'Software Engineer'}
        jobKeywords={currentAnalysis.keywords.missing}
        onClose={() => setAiModalOpen(false)}
        onApply={handleApplyAiSuggestion}
      />
    </div>
  );
}
