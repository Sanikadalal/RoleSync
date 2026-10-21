import { getAnalysis, getJob, getSnapshotsForResume } from '@/lib/storage';
import { AnalysisDashboard } from '@/components/analysis/AnalysisDashboard';
import { notFound } from 'next/navigation';

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const analysis = getAnalysis(id);
  if (!analysis) notFound();

  const job = getJob(analysis.jobId);
  const snapshots = getSnapshotsForResume(analysis.resumeId);

  return (
    <AnalysisDashboard
      analysis={analysis}
      roleTitle={job?.roleTitle || 'Target Role'}
      company={job?.company || 'Target Company'}
      snapshots={snapshots}
    />
  );
}
