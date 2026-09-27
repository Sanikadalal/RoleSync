import { NextRequest, NextResponse } from 'next/server';
import { NormalizedResume } from '@/lib/types';
import { getAIProvider } from '@/lib/ai';
import { getJob, getAnalysis, saveResume, saveAnalysis, getSnapshotsForResume } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { updatedResume, analysisId, jobId } = body as {
      updatedResume: NormalizedResume;
      analysisId: string;
      jobId: string;
    };

    if (!updatedResume || !jobId) {
      return NextResponse.json(
        { error: 'Missing updated resume data or target job ID.' },
        { status: 400 }
      );
    }

    const job = getJob(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Target job description not found.' }, { status: 404 });
    }

    const previousAnalysis = getAnalysis(analysisId);
    const existingSnapshots = getSnapshotsForResume(updatedResume.id);
    const nextVersionNumber = existingSnapshots.length + 1;

    // Save modified resume version
    saveResume(updatedResume);

    // Re-run deterministic matching engine
    const aiProvider = getAIProvider();
    const newAnalysis = await aiProvider.compareResumeToJob(updatedResume, job);
    newAnalysis.versionNumber = nextVersionNumber;

    // Save new analysis & snapshot
    saveAnalysis(newAnalysis);

    let explanation = '';
    if (previousAnalysis) {
      explanation = await aiProvider.explainScore(previousAnalysis, newAnalysis, [
        `Re-analyzed updated version #${nextVersionNumber}. Score changed from ${previousAnalysis.overallScore}% to ${newAnalysis.overallScore}%.`,
      ]);
    }

    return NextResponse.json({
      success: true,
      newAnalysis,
      explanation,
      versionNumber: nextVersionNumber,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to re-analyze resume.' },
      { status: 500 }
    );
  }
}
