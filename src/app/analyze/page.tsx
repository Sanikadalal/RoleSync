import { UploadStudio } from '@/components/upload/UploadStudio';
import { Suspense } from 'react';

export default function AnalyzePage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading analysis studio...</div>}>
        <UploadStudio />
      </Suspense>
    </main>
  );
}
