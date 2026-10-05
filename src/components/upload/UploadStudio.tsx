'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Briefcase,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { DEMO_JOB } from '@/lib/demo/demoData';

export function UploadStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [useTextMode, setUseTextMode] = useState<boolean>(false);

  const [jobDescription, setJobDescription] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('Backend Software Engineer');
  const [company, setCompany] = useState<string>('Enterprise Tech Inc');

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'doc', 'txt'].includes(ext || '')) {
      setErrorMessage(
        `Unsupported file type .${ext}. Please upload a PDF, DOCX, or TXT resume file.`
      );
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds maximum 10MB limit.');
      return;
    }
    setResumeFile(file);
    setUploadProgress(100);
    setErrorMessage(null);
  };

  const handleLoadDemoData = () => {
    setJobDescription(DEMO_JOB.rawText);
    setTargetRole(DEMO_JOB.roleTitle);
    setCompany(DEMO_JOB.company);
    router.push('/analysis/demo-analysis');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validations
    if (!resumeFile && (!resumeText || resumeText.trim().length < 20)) {
      setErrorMessage('Please upload a resume file (PDF/DOCX/TXT) or paste your resume text.');
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      setErrorMessage(
        'Please paste or upload a meaningful job description (at least 20 characters).'
      );
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      if (resumeFile) {
        formData.append('resumeFile', resumeFile);
      } else {
        formData.append('resumeText', resumeText);
      }
      formData.append('jobDescription', jobDescription);
      formData.append('targetRole', targetRole);
      formData.append('company', company);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze resume. Please check your inputs.');
      }

      router.push(`/analysis/${data.analysisId}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis request failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Flow Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-4xl sm:text-5xl text-black">
          Check your resume
        </h1>
        <p className="text-base text-zinc-300">
          Two quick steps: add your resume, then paste the job you want. We&apos;ll show how well you match.
        </p>

        <div className="pt-3 flex justify-center">
          <button
            type="button"
            onClick={handleLoadDemoData}
            className="inline-flex items-center gap-1.5 border-2 border-black bg-yellow-300 px-3.5 py-1.5 text-xs font-bold text-black shadow-[3px_3px_0_0_#000] hover:bg-violet-200 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Load Demo Data (Backend Developer)</span>
          </button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="mb-6 rounded-lg border-2 border-black bg-red-200 p-4 text-xs text-red-400 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
          <button type="button" onClick={() => setErrorMessage(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Dual Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Resume Upload */}
          <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-200 text-violet-700 font-semibold text-xs border-2 border-black">
                    1
                  </div>
                  <h2 className="text-base font-semibold text-zinc-100">Your Resume</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setUseTextMode(!useTextMode)}
                  className="text-xs text-zinc-400 hover:text-violet-700 transition-colors"
                >
                  {useTextMode ? 'Switch to File Upload' : 'Paste Raw Text'}
                </button>
              </div>

              {!useTextMode ? (
                <div>
                  {!resumeFile ? (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-black hover:border-black rounded-xl p-8 text-center cursor-pointer bg-zinc-950/40 hover:bg-white transition-all group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,.doc,.txt"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            validateAndSetFile(e.target.files[0]);
                          }
                        }}
                      />
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 group-hover:bg-violet-200 border-2 border-black text-zinc-400 group-hover:text-violet-700 transition-all">
                        <Upload className="h-6 w-6" />
                      </div>
                      <p className="mt-4 text-sm font-medium text-zinc-200">
                        Drag & drop your resume file
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">PDF, DOCX, or TXT up to 10MB</p>
                    </div>
                  ) : (
                    <div className="rounded-lg border-2 border-black bg-violet-200 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-200 text-violet-700 border-2 border-black">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-100 truncate max-w-[200px]">
                            {resumeFile.name}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {(resumeFile.size / 1024).toFixed(1)} KB • Ready for extraction
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setResumeFile(null)}
                        className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  rows={8}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your raw resume text here (Summary, Work Experience, Skills, Education)..."
                  className="w-full rounded-lg border-2 border-black bg-zinc-950 p-3 text-xs text-zinc-200 placeholder-zinc-400 focus:border-black focus:outline-none font-mono"
                />
              )}
            </div>
            <p className="mt-4 text-xs text-zinc-400">
              Preserves headings, experience bullets, education, and technical skill lists.
            </p>
          </div>

          {/* RIGHT: Job Description */}
          <div className="rounded-xl border-2 border-black bg-zinc-900/60 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-200 text-violet-700 font-semibold text-xs border-2 border-black">
                  2
                </div>
                <h2 className="text-base font-semibold text-zinc-100">Job Description (JD)</h2>
              </div>

              <textarea
                rows={8}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description text here (Key requirements, required skills, responsibilities, tools)..."
                className="w-full rounded-lg border-2 border-black bg-zinc-950 p-3 text-xs text-zinc-200 placeholder-zinc-400 focus:border-black focus:outline-none font-mono leading-relaxed"
              />
            </div>

            <p className="mt-4 text-xs text-zinc-400">
              Parses required vs preferred skills, technical requirements, and responsibilities.
            </p>
          </div>
        </div>

        {/* Optional Context Metadata */}
        <div className="rounded-xl border-2 border-black bg-zinc-900/40 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
              Target Role (Optional)
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Backend Developer"
              className="w-full rounded-lg border-2 border-black bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-400 focus:border-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-zinc-400" />
              Company (Optional)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full rounded-lg border-2 border-black bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-400 focus:border-black focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center gap-2 rounded-xl bg-violet-300 px-8 py-3.5 text-sm font-semibold text-black hover:bg-violet-400 transition-all disabled:opacity-50 shadow-lg"
          >
            {isAnalyzing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                <span>Extracting & Analyzing...</span>
              </>
            ) : (
              <>
                <span>Analyze Resume Match</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
