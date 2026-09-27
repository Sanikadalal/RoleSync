import {
  NormalizedResume,
  JobAnalysis,
  MatchAnalysis,
  ResumeVersionSnapshot,
} from '../types';
import {
  DEMO_RESUME,
  DEMO_JOB,
  getDemoAnalysis,
  getDemoSnapshots,
} from '../demo/demoData';

// Memory store for server/client runtime fallback
const memoryStore = {
  resumes: new Map<string, NormalizedResume>(),
  jobs: new Map<string, JobAnalysis>(),
  analyses: new Map<string, MatchAnalysis>(),
  snapshots: new Map<string, ResumeVersionSnapshot[]>(),
};

// Pre-seed demo data
memoryStore.resumes.set(DEMO_RESUME.id, DEMO_RESUME);
memoryStore.jobs.set(DEMO_JOB.id, DEMO_JOB);
const demoAnalysis = getDemoAnalysis();
memoryStore.analyses.set(demoAnalysis.id, demoAnalysis);
memoryStore.snapshots.set(DEMO_RESUME.id, getDemoSnapshots());

export function saveResume(resume: NormalizedResume): NormalizedResume {
  memoryStore.resumes.set(resume.id, resume);
  return resume;
}

export function getResume(id: string): NormalizedResume | null {
  return memoryStore.resumes.get(id) || (id === 'demo-resume-1' ? DEMO_RESUME : null);
}

export function saveJob(job: JobAnalysis): JobAnalysis {
  memoryStore.jobs.set(job.id, job);
  return job;
}

export function getJob(id: string): JobAnalysis | null {
  return memoryStore.jobs.get(id) || (id === 'demo-job-1' ? DEMO_JOB : null);
}

export function saveAnalysis(analysis: MatchAnalysis): MatchAnalysis {
  memoryStore.analyses.set(analysis.id, analysis);

  // Store snapshot
  const resume = getResume(analysis.resumeId) || DEMO_RESUME;
  const existingSnapshots = memoryStore.snapshots.get(analysis.resumeId) || [];

  const newSnapshot: ResumeVersionSnapshot = {
    id: `snap-${Date.now()}`,
    versionNumber: analysis.versionNumber,
    resumeData: JSON.parse(JSON.stringify(resume)),
    analysis: JSON.parse(JSON.stringify(analysis)),
    changesSummary:
      existingSnapshots.length === 0
        ? ['Initial resume upload and analysis baseline.']
        : ['Re-analyzed updated resume version.'],
    createdAt: new Date().toISOString(),
  };

  memoryStore.snapshots.set(analysis.resumeId, [...existingSnapshots, newSnapshot]);
  return analysis;
}

export function getAnalysis(id: string): MatchAnalysis | null {
  if (id === 'demo-analysis' || id === demoAnalysis.id) {
    return demoAnalysis;
  }
  return memoryStore.analyses.get(id) || null;
}

export function getSnapshotsForResume(resumeId: string): ResumeVersionSnapshot[] {
  if (resumeId === 'demo-resume-1' || resumeId === 'demo-analysis') {
    return getDemoSnapshots();
  }
  return memoryStore.snapshots.get(resumeId) || [];
}

export function getAllAnalyses(): MatchAnalysis[] {
  const list = Array.from(memoryStore.analyses.values());
  if (list.length === 0) return [demoAnalysis];
  return list;
}
