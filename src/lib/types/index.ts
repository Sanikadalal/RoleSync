export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location?: string;
  description: string[];
  technologies: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string[];
  technologies: string[];
  links?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  url?: string;
}

export interface NormalizedResume {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: string[];
  links: string[];
}

export interface JobAnalysis {
  id: string;
  roleTitle: string;
  company: string;
  jobUrl?: string;
  rawText: string;
  requiredSkills: string[];
  preferredSkills: string[];
  technicalRequirements: string[];
  softSkills: string[];
  responsibilities: string[];
  experienceRequirements: string[];
  educationRequirements: string[];
  tools: string[];
  technologies: string[];
  keywords: string[];
  domainTerms: string[];
}

export type SkillImportance = 'required' | 'preferred';
export type SkillMatchStatus = 'matched' | 'partial' | 'missing';
export type SkillConfidence = 'high' | 'medium' | 'low';

export interface SkillMatch {
  skill: string;
  normalizedSkill: string;
  importance: SkillImportance;
  matchPercentage: number;
  status: SkillMatchStatus;
  evidence: string;
  sourceSection?: string;
  confidence: SkillConfidence;
  recommendation: string;
  category: string;
}

export interface SkillGap {
  skill: string;
  importance: SkillImportance;
  severity: 'critical' | 'important' | 'nice-to-have';
  jdContext: string;
  resumeContext: string;
  recommendation: string;
}

export interface ResponsibilityMatch {
  jdResponsibility: string;
  resumeEvidence: string;
  matchScore: number;
  status: 'strong' | 'moderate' | 'gap';
}

export interface KeywordAnalysis {
  present: string[];
  missing: string[];
  overused: string[];
  importantPhrases: string[];
}

export interface ResumeQualityMetrics {
  overallScore: number;
  readability: number;
  structure: number;
  relevance: number;
  impact: number;
  technicalEvidence: number;
  formatting: number;
  actionVerbsScore: number;
  bulletQualitySuggestions: Array<{
    original: string;
    section: string;
    suggestion: string;
    reason: string;
  }>;
}

export interface ActionableRecommendation {
  id: string;
  title: string;
  problem: string;
  whyItMatters: string;
  suggestedChange: string;
  relevantSection: string;
  expectedCategory: keyof ScoreBreakdown;
  priority: 'high' | 'medium' | 'low';
}

export interface ScoreBreakdown {
  requiredSkills: number;
  preferredSkills: number;
  experienceAlignment: number;
  responsibilityAlignment: number;
  keywordCoverage: number;
  projectEvidence: number;
  educationAlignment: number;
}

export interface MatchAnalysis {
  id: string;
  resumeId: string;
  jobId: string;
  versionNumber: number;
  overallScore: number;
  explainableSummary: string;
  scoreBreakdown: ScoreBreakdown;
  skills: SkillMatch[];
  gaps: SkillGap[];
  responsibilityMatches: ResponsibilityMatch[];
  keywords: KeywordAnalysis;
  resumeQuality: ResumeQualityMetrics;
  recommendations: ActionableRecommendation[];
  createdAt: string;
}

export interface ResumeVersionSnapshot {
  id: string;
  versionNumber: number;
  resumeData: NormalizedResume;
  analysis: MatchAnalysis;
  changesSummary: string[];
  createdAt: string;
}
