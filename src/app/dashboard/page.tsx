import { getAllAnalyses } from '@/lib/storage';
import { UserDashboard } from '@/components/dashboard/UserDashboard';

export default function DashboardPage() {
  const analyses = getAllAnalyses();

  return (
    <main className="min-h-screen bg-zinc-950">
      <UserDashboard analyses={analyses} />
    </main>
  );
}
