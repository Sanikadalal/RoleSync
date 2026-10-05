import {
  Upload,
  ClipboardPaste,
  BarChart3,
  FileSearch,
  Layers,
  KeyRound,
  Sparkles,
  Edit3,
  GitCompare,
  ShieldCheck,
} from 'lucide-react';

const steps = [
  { icon: Upload, title: '1. Upload your resume', text: 'PDF, Word or plain text.' },
  { icon: ClipboardPaste, title: '2. Paste the job', text: 'Copy the job description in.' },
  { icon: BarChart3, title: '3. See your results', text: 'Get a score and a to-do list.' },
];

const features = [
  {
    icon: FileSearch,
    title: 'Match score',
    description: 'One clear number built from skills, experience and keywords.',
  },
  {
    icon: Layers,
    title: 'Skills you have vs. need',
    description: 'Each skill is marked matched, partial or missing, with proof from your resume.',
  },
  {
    icon: KeyRound,
    title: 'Missing keywords',
    description: 'Find the words recruiters and ATS filters look for, without stuffing.',
  },
  {
    icon: Sparkles,
    title: 'Better bullet points',
    description: 'Get rewrites you can accept or reject. Nothing is ever made up.',
  },
  {
    icon: Edit3,
    title: 'Edit in the app',
    description: 'Fix your resume and watch the score update right away.',
  },
  {
    icon: GitCompare,
    title: 'Compare versions',
    description: 'See what changed between versions and why the score moved.',
  },
];

const tints = ['bg-violet-200', 'bg-yellow-200', 'bg-emerald-200', 'bg-red-200', 'bg-violet-200', 'bg-yellow-200'];

export function LandingFeatures() {
  return (
    <>
      <section className="border-b-4 border-black bg-violet-300 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl text-black sm:text-4xl">How it works</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.title} className="border-2 border-black bg-white p-6 shadow-[6px_6px_0_0_#000]">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-yellow-300">
                  <s.icon className="h-6 w-6 text-black" />
                </div>
                <h3 className="mt-4 text-xl text-black">{s.title}</h3>
                <p className="mt-1 text-zinc-300">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <h2 className="text-3xl text-black sm:text-4xl">Everything you need to get the interview</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="border-2 border-black bg-white p-6 shadow-[5px_5px_0_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#000]"
              >
                <div className={`flex h-11 w-11 items-center justify-center border-2 border-black ${tints[i]}`}>
                  <f.icon className="h-5 w-5 text-black" />
                </div>
                <h3 className="mt-4 text-lg text-black">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{f.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 border-2 border-black bg-yellow-200 p-4 text-center text-sm font-medium text-black">
            <ShieldCheck className="h-5 w-5" />
            <span>Your resume stays private and is only used for your analysis.</span>
          </div>
        </div>
      </section>
    </>
  );
}
