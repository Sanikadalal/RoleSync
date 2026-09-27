import { getResume, getAnalysis } from '@/lib/storage';
import { DEMO_RESUME, getDemoAnalysis } from '@/lib/demo/demoData';
import { ResumeEditor } from '@/components/editor/ResumeEditor';

export default async function EditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ analysisId?: string }>;
}) {
  const { id } = await params;
  const { analysisId } = await searchParams;

  const resume = getResume(id) || DEMO_RESUME;
  const analysis = (analysisId ? getAnalysis(analysisId) : null) || getDemoAnalysis();

  return <ResumeEditor initialResume={resume} initialAnalysis={analysis} />;
}
