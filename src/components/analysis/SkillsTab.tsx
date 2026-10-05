'use client';

import { useState } from 'react';
import { SkillMatch } from '@/lib/types';
import { Search, Filter, CheckCircle, AlertCircle, HelpCircle, ArrowUpDown } from 'lucide-react';

interface SkillsTabProps {
  skills: SkillMatch[];
}

export function SkillsTab({ skills }: SkillsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [importanceFilter, setImportanceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'importance' | 'skill'>('importance');

  // Filter skills
  const filteredSkills = skills.filter((s) => {
    const matchesSearch =
      s.normalizedSkill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesImportance =
      importanceFilter === 'all' || s.importance === importanceFilter;
    return matchesSearch && matchesStatus && matchesImportance;
  });

  // Sort skills
  const sortedSkills = [...filteredSkills].sort((a, b) => {
    if (sortBy === 'match') {
      return b.matchPercentage - a.matchPercentage;
    }
    if (sortBy === 'importance') {
      if (a.importance === 'required' && b.importance !== 'required') return -1;
      if (a.importance !== 'required' && b.importance === 'required') return 1;
      return b.matchPercentage - a.matchPercentage;
    }
    return a.normalizedSkill.localeCompare(b.normalizedSkill);
  });

  // Group by categories
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="space-y-6">
      {/* Category Progress Bars */}
      <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-6">
        <h3 className="text-sm font-semibold text-zinc-100 mb-4">Category Coverage Matrix</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            const avgMatch =
              catSkills.length > 0
                ? Math.round(
                    catSkills.reduce((acc, curr) => acc + curr.matchPercentage, 0) /
                      catSkills.length
                  )
                : 0;

            return (
              <div key={cat} className="rounded-lg border-2 border-black bg-zinc-950 p-3.5">
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-zinc-300">{cat}</span>
                  <span className="text-emerald-400 font-bold">{avgMatch}%</span>
                </div>
                <div className="h-3 w-full bg-white border-2 border-black overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${avgMatch}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls: Search, Filters, Sort */}
      <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search skills or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border-2 border-black bg-zinc-950 pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-400 focus:border-black focus:outline-none"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border-2 border-black bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 focus:outline-none"
          >
            <option value="all">Status: All</option>
            <option value="matched">Matched (75%+)</option>
            <option value="partial">Partial Evidence</option>
            <option value="missing">Missing (0%)</option>
          </select>

          <select
            value={importanceFilter}
            onChange={(e) => setImportanceFilter(e.target.value)}
            className="rounded-lg border-2 border-black bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 focus:outline-none"
          >
            <option value="all">Importance: All</option>
            <option value="required">Required</option>
            <option value="preferred">Preferred</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border-2 border-black bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 focus:outline-none"
          >
            <option value="importance">Sort: Importance</option>
            <option value="match">Sort: Match %</option>
            <option value="skill">Sort: Name</option>
          </select>
        </div>
      </div>

      {/* Main Skill Matrix Table */}
      <div className="overflow-x-auto rounded-xl border-2 border-black bg-zinc-900/60">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black bg-white text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <th className="py-3 px-4">Skill</th>
              <th className="py-3 px-4">Importance</th>
              <th className="py-3 px-4">Match %</th>
              <th className="py-3 px-4">Resume Evidence</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black text-xs text-zinc-300">
            {sortedSkills.map((s, idx) => (
              <tr key={idx} className="hover:bg-zinc-850/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-zinc-100">
                  {s.normalizedSkill}
                  <div className="text-[10px] text-zinc-400 font-normal">{s.category}</div>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-mono border ${
                      s.importance === 'required'
                        ? 'bg-red-200 text-red-400 border-black'
                        : 'bg-teal-200 text-teal-400 border-black'
                    }`}
                  >
                    {s.importance}
                  </span>
                </td>

                <td className="py-3.5 px-4 font-bold">
                  <span
                    className={
                      s.matchPercentage >= 75
                        ? 'text-emerald-400'
                        : s.matchPercentage > 0
                        ? 'text-amber-400'
                        : 'text-zinc-400'
                    }
                  >
                    {s.matchPercentage}%
                  </span>
                </td>

                <td className="py-3.5 px-4 max-w-xs">
                  <p className="line-clamp-2 text-zinc-300">{s.evidence}</p>
                  {s.sourceSection && (
                    <span className="mt-1 inline-block text-[10px] text-zinc-400 font-mono">
                      Source: {s.sourceSection}
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${
                      s.confidence === 'high'
                        ? 'bg-emerald-200 text-emerald-400 border-black'
                        : s.confidence === 'medium'
                        ? 'bg-amber-200 text-amber-400 border-black'
                        : 'bg-zinc-800 text-zinc-400 border-black'
                    }`}
                  >
                    {s.confidence.toUpperCase()}
                  </span>
                </td>

                <td className="py-3.5 px-4 max-w-xs text-zinc-400">{s.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
