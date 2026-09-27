import {
  FileSearch,
  Layers,
  KeyRound,
  Sparkles,
  Edit3,
  GitCompare,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

export function LandingFeatures() {
  const features = [
    {
      icon: FileSearch,
      title: 'Resume–JD Matching',
      description:
        'Multi-signal matching engine evaluating required skills, preferred tools, experience alignment, and project evidence.',
    },
    {
      icon: Layers,
      title: 'Skill Gap Analysis',
      description:
        'Categorizes skills into Critical, Important, and Nice-to-Have gaps with evidence flags from your actual resume text.',
    },
    {
      icon: KeyRound,
      title: 'Keyword Frequency & Terms',
      description:
        'Identifies missing technical terms and industry vocabulary while guarding strictly against misleading keyword stuffing.',
    },
    {
      icon: Sparkles,
      title: 'AI Bullet Suggestions',
      description:
        'Generates non-hallucinatory bullet rewrites with Apply/Edit/Reject workflow that never invents fake metrics or jobs.',
    },
    {
      icon: Edit3,
      title: 'Built-in Resume Editor',
      description:
        'Structured Notion-style resume editor allowing instant section editing, reordering, and instant score updates.',
    },
    {
      icon: GitCompare,
      title: 'Version Comparison',
      description:
        'Compare version snapshots side-by-side with highlighted text diffs and granular category score change explanations.',
    },
  ];

  return (
    <section className="py-20 bg-zinc-950 border-b border-zinc-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Professional Engineering Tool
          </h2>
          <p className="text-3xl font-bold text-zinc-100 tracking-tight">
            Built for developers and professionals who want true resume-job alignment.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 hover:border-zinc-700 hover:bg-zinc-900 transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-100">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Privacy Note */}
        <div className="mt-12 rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Your resume is private and used strictly for your analysis.</span>
        </div>
      </div>
    </section>
  );
}
