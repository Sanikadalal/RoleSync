import {
  NormalizedResume,
  JobAnalysis,
  MatchAnalysis,
} from '../types';

export interface AIProvider {
  /**
   * Parse raw text extracted from uploaded resume file into normalized resume structure.
   */
  analyzeResume(rawText: string, filename?: string): Promise<NormalizedResume>;

  /**
   * Parse raw job description text into structured job requirements.
   */
  analyzeJobDescription(
    rawText: string,
    roleTitle?: string,
    company?: string
  ): Promise<JobAnalysis>;

  /**
   * Perform comprehensive analysis matching resume to job description.
   */
  compareResumeToJob(
    resume: NormalizedResume,
    job: JobAnalysis
  ): Promise<MatchAnalysis>;

  /**
   * Generates factual, non-hallucinatory AI bullet point suggestions for resume editing.
   */
  suggestResumeChanges(
    bulletText: string,
    contextRole: string,
    jobKeywords: string[]
  ): Promise<string[]>;

  /**
   * Explains score delta and specific changes between two versions of a resume.
   */
  explainScore(
    oldAnalysis: MatchAnalysis,
    newAnalysis: MatchAnalysis,
    changes: string[]
  ): Promise<string>;
}
