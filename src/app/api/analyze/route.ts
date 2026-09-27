import { NextRequest, NextResponse } from 'next/server';
import { parseResumeFile } from '@/lib/parser';
import { getAIProvider } from '@/lib/ai';
import { saveResume, saveJob, saveAnalysis } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get('resumeFile') as File | null;
    const resumeTextRaw = formData.get('resumeText') as string | null;
    const jdText = formData.get('jobDescription') as string | null;
    const targetRole = (formData.get('targetRole') as string) || 'Target Role';
    const company = (formData.get('company') as string) || 'Target Company';

    // 1. Validations
    if (!jdText || jdText.trim().length < 15) {
      return NextResponse.json(
        { error: 'Please provide a valid job description (at least 15 characters).' },
        { status: 400 }
      );
    }

    let extractedResumeText = '';
    let fileName = 'Uploaded_Resume.txt';

    if (resumeFile && resumeFile.size > 0) {
      fileName = resumeFile.name;
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      const parseResult = await parseResumeFile(buffer, fileName);

      if (parseResult.error) {
        return NextResponse.json({ error: parseResult.error }, { status: 400 });
      }
      extractedResumeText = parseResult.text;
    } else if (resumeTextRaw && resumeTextRaw.trim().length >= 10) {
      extractedResumeText = resumeTextRaw.trim();
    } else {
      return NextResponse.json(
        { error: 'Please upload a resume file (PDF, DOCX, TXT) or paste your resume text.' },
        { status: 400 }
      );
    }

    // 2. AI Processing & Parsing
    const aiProvider = getAIProvider();

    const normalizedResume = await aiProvider.analyzeResume(extractedResumeText, fileName);
    const parsedJob = await aiProvider.analyzeJobDescription(jdText, targetRole, company);

    // Persist
    saveResume(normalizedResume);
    saveJob(parsedJob);

    // 3. Compute Deterministic Multi-Signal Match Analysis
    const analysis = await aiProvider.compareResumeToJob(normalizedResume, parsedJob);
    saveAnalysis(analysis);

    return NextResponse.json({
      success: true,
      analysisId: analysis.id,
      resumeId: normalizedResume.id,
      jobId: parsedJob.id,
      analysis,
    });
  } catch (err: any) {
    console.error('Analysis error:', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred during resume analysis.' },
      { status: 500 }
    );
  }
}
