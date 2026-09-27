import { getAnalysis, getJob, getSnapshotsForResume } from '@/lib/storage';
import { getDemoAnalysis, getDemoSnapshots } from '@/lib/demo/demoData';
import { AnalysisDashboard } from '@/components/analysis/AnalysisDashboard';
import { notFound } from 'next/navigation';

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let analysis = getAnalysis(id);
  if (!analysis) {
    analysis = getDemoAnalysis();
  }

  const job = getJob(analysis.jobId);
  const snapshots = getSnapshotsForResume(analysis.resumeId) || getDemoSnapshots();

  return (
    <AnalysisDashboard
      analysis={analysis}
      roleTitle={job?.roleTitle || 'Senior Backend Engineer'}
      company={job?.company || 'Apex Cloud Platforms'}
      snapshots={snapshots}
    />
  );
}
