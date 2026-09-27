import { getSnapshotsForResume } from '@/lib/storage';
import { getDemoSnapshots } from '@/lib/demo/demoData';
import { VersionComparisonView } from '@/components/version/VersionComparisonView';

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ v1?: string; v2?: string }>;
}) {
  const { id } = await params;
  const { v1 = '1', v2 = '2' } = await searchParams;

  const snapshots = getSnapshotsForResume(id);
  const snapList = snapshots.length >= 2 ? snapshots : getDemoSnapshots();

  const v1Num = parseInt(v1, 10);
  const v2Num = parseInt(v2, 10);

  const v1Snap = snapList.find((s) => s.versionNumber === v1Num) || snapList[0];
  const v2Snap = snapList.find((s) => s.versionNumber === v2Num) || snapList[snapList.length - 1];

  return <VersionComparisonView v1Snapshot={v1Snap} v2Snapshot={v2Snap} resumeId={id} />;
}
