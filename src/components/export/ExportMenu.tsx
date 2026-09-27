'use client';

import { useState } from 'react';
import { Download, FileText, Printer, Check } from 'lucide-react';
import { MatchAnalysis } from '@/lib/types';

interface ExportMenuProps {
  analysis: MatchAnalysis;
}

export function ExportMenu({ analysis }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exported, setExported] = useState(false);

  const handlePrintPDF = () => {
    window.print();
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-all border border-zinc-700"
      >
        <Download className="h-4 w-4 text-emerald-400" />
        <span>Export</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl z-50 space-y-1">
          <button
            onClick={() => {
              setIsOpen(false);
              handlePrintPDF();
            }}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Printer className="h-4 w-4 text-emerald-400" />
            <span>Download Analysis (PDF)</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              handlePrintPDF();
            }}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <FileText className="h-4 w-4 text-emerald-400" />
            <span>Download Optimized Resume</span>
          </button>
        </div>
      )}

      {exported && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-emerald-500 text-zinc-950 px-4 py-2 text-xs font-semibold shadow-lg flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>Export trigger sent to print driver.</span>
        </div>
      )}
    </div>
  );
}
