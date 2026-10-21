import { AIProvider } from './AIProvider';
import { NormalizedResume, JobAnalysis, MatchAnalysis } from '../types';
import { extractResume, extractJob } from '../parser/textExtractor';
import { calculateDeterministicScore } from '../scoring/deterministicScorer';

export class MockAIProvider implements AIProvider {
  async analyzeResume(
    rawText: string,
    _filename: string = 'Resume.pdf'
  ): Promise<NormalizedResume> {
    return { id: `res-${Date.now()}`, ...extractResume(rawText) };
  }

  async analyzeJobDescription(
    rawText: string,
    roleTitle?: string,
    company?: string
  ): Promise<JobAnalysis> {
    return { id: `jd-${Date.now()}`, ...extractJob(rawText, roleTitle, company) };
  }

  async compareResumeToJob(
    resume: NormalizedResume,
    job: JobAnalysis
  ): Promise<MatchAnalysis> {
    return calculateDeterministicScore(resume, job);
  }

  async suggestResumeChanges(
    bulletText: string,
    contextRole: string,
    jobKeywords: string[]
  ): Promise<string[]> {
    const cleanBullet = bulletText.trim();
    if (!cleanBullet) return [];

    const suggestions = [
      `Developed and optimized ${cleanBullet.replace(/^worked on|^built|^created/i, '')} using ${jobKeywords.slice(0, 2).join(' and ')}, increasing system throughput and reducing query latency.`,
      `Engineered ${cleanBullet.replace(/^worked on|^built/i, '')} adhering to industry best practices, improving service availability across high-concurrency workloads.`,
      `Architected RESTful endpoints for ${cleanBullet} with robust error handling, automated testing, and comprehensive API documentation.`,
    ];

    return suggestions;
  }

  async explainScore(
    oldAnalysis: MatchAnalysis,
    newAnalysis: MatchAnalysis,
    changes: string[]
  ): Promise<string> {
    const diff = newAnalysis.overallScore - oldAnalysis.overallScore;
    const sign = diff >= 0 ? '+' : '';

    return `Score updated from ${oldAnalysis.overallScore}% to ${newAnalysis.overallScore}% (${sign}${diff} points). Key factor: ${
      changes.length > 0
        ? changes.join('; ')
        : 'Updated resume bullet details provided stronger evidence for target technical requirements.'
    }`;
  }
}
