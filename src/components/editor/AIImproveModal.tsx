'use client';

import { useState } from 'react';
import { Sparkles, X, Check, Edit2, AlertCircle } from 'lucide-react';

interface AIImproveModalProps {
  originalBullet: string;
  contextRole: string;
  jobKeywords: string[];
  isOpen: boolean;
  onClose: () => void;
  onApply: (newBulletText: string) => void;
}

export function AIImproveModal({
  originalBullet,
  contextRole,
  jobKeywords,
  isOpen,
  onClose,
  onApply,
}: AIImproveModalProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [editedText, setEditedText] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulletText: originalBullet, contextRole, jobKeywords }),
      });
      const data = await res.json();
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
        setEditedText(data.suggestions[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-zinc-100">Improve Bullet with AI</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Original Text Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">Current Experience Bullet:</label>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300 font-mono">
            &quot;{originalBullet}&quot;
          </div>
        </div>

        {/* Anti-Hallucination Disclaimer */}
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Truthful AI Enforcement: AI suggestions optimize wording and structure based strictly on your existing work. Never accept suggestions containing technologies or metrics you did not use.
          </span>
        </div>

        {/* Generate / Action Area */}
        {suggestions.length === 0 ? (
          <div className="text-center py-6">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-950/40 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                  <span>Generating Enhancements...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Impactful Suggestions</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="text-xs font-medium text-zinc-400">AI Rewritten Suggestions:</label>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {suggestions.map((sugg, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedIdx(i);
                    setEditedText(sugg);
                    setIsEditing(false);
                  }}
                  className={`cursor-pointer rounded-lg border p-3 text-xs transition-all ${
                    selectedIdx === i
                      ? 'border-emerald-500 bg-emerald-500/10 text-zinc-100'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {sugg}
                </div>
              ))}
            </div>

            {isEditing && (
              <textarea
                rows={3}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none"
              />
            )}

            <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>{isEditing ? 'Done Editing' : 'Fine-tune Text'}</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700"
                >
                  Reject
                </button>

                <button
                  type="button"
                  onClick={() => onApply(editedText || suggestions[selectedIdx])}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-emerald-400"
                >
                  <Check className="h-4 w-4" />
                  <span>Apply Bullet</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
