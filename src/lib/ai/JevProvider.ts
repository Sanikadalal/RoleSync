import { MockAIProvider } from './MockAIProvider';
import { askJev, JevAnswer, JevQuestion } from './jevClient';
import {
  calculateDeterministicScore,
  computeOverallScore,
} from '../scoring/deterministicScorer';
import {
  ActionableRecommendation,
  JobAnalysis,
  MatchAnalysis,
  NormalizedResume,
  SkillGap,
  SkillMatch,
} from '../types';

const MAX_SKILLS = 40;
const MAX_RESPONSIBILITIES = 10;
const MAX_BULLETS = 20;
const MIN_CONFIDENCE = 0.6;
const LEVELS = ['intern', 'junior', 'mid', 'senior', 'lead'];

const LEVEL_CRITERIA: Record<string, string> = {
  intern: 'Internship or student, no professional experience expected',
  junior: 'Entry level, 0-2 years',
  mid: 'Mid level, 2-5 years, works independently',
  senior: 'Senior, 5+ years, owns design and mentors others',
  lead: 'Lead, staff, principal or manager level',
};

/**
 * Uses Jev (TypeSafe System One) for the judgment calls: semantic skill matching,
 * responsibility fit, seniority fit and bullet quality. Parsing and text generation
 * are inherited from the mock provider. Any Jev failure falls back to the
 * deterministic score, so analysis never breaks.
 */
export class JevProvider extends MockAIProvider {
  constructor(private readonly apiKey: string) {
    super();
  }

  async compareResumeToJob(
    resume: NormalizedResume,
    job: JobAnalysis
  ): Promise<MatchAnalysis> {
    const base = calculateDeterministicScore(resume, job);
    try {
      return await this.refine(base, resume, job);
    } catch (err) {
      console.warn('Jev unavailable, using deterministic score:', err);
      return base;
    }
  }

  private async refine(
    base: MatchAnalysis,
    resume: NormalizedResume,
    job: JobAnalysis
  ): Promise<MatchAnalysis> {
    const skills = base.skills.slice(0, MAX_SKILLS);
    const responsibilities = job.responsibilities.slice(0, MAX_RESPONSIBILITIES);
    const bullets = resume.experience
      .flatMap((e) => e.description.map((text) => ({ text, section: `${e.role} at ${e.company}` })))
      .slice(0, MAX_BULLETS);

    const questions: Record<string, JevQuestion> = {
      resume_level: {
        type: 'choice',
        instructions: 'What seniority level does the candidate in the resume demonstrate?',
        criteria: LEVEL_CRITERIA,
      },
      job_level: {
        type: 'choice',
        instructions: 'What seniority level is the job posting hiring for?',
        criteria: LEVEL_CRITERIA,
      },
      action_verbs: {
        type: 'noul',
        instructions:
          'Do the resume bullets generally start with strong action verbs (built, led, reduced) rather than passive phrases like "responsible for"?',
      },
    };

    skills.forEach((s, i) => {
      questions[`s${i}`] = {
        type: 'choice',
        instructions: `Does the resume show hands-on experience with "${s.skill}"? Count equivalent or closely related technologies (for example Postgres for SQL).`,
        criteria: {
          matched: 'Clear hands-on use in work experience or projects',
          partial: 'Only listed, or only a related technology, with no concrete usage',
          missing: 'No evidence at all',
        },
      };
    });

    responsibilities.forEach((r, i) => {
      questions[`r${i}`] = {
        type: 'score',
        instructions: `How well does the candidate's experience cover this job responsibility: "${r}"?`,
        criteria: [
          'No related experience',
          'Some related experience',
          'Direct, strong experience',
        ],
      };
    });

    bullets.forEach((b, i) => {
      questions[`b${i}`] = {
        type: 'choice',
        instructions: `Rate the quality of this resume bullet: "${b.text}"`,
        criteria: {
          strong: 'Specific action, technology and measurable result',
          adequate: 'Clear but missing a metric or technical detail',
          weak: 'Vague, passive or duties-only',
        },
      };
    });

    // Personal details (name, email, phone, location) are deliberately not sent.
    const state = {
      resume: {
        summary: resume.summary,
        skills: resume.skills,
        experience: resume.experience.map((e) => ({
          role: e.role,
          company: e.company,
          start: e.startDate,
          end: e.endDate,
          bullets: e.description,
          technologies: e.technologies,
        })),
        projects: resume.projects.map((p) => ({
          name: p.name,
          bullets: p.description,
          technologies: p.technologies,
        })),
        education: resume.education.map((e) => ({
          degree: e.degree,
          field: e.fieldOfStudy,
        })),
        certifications: resume.certifications.map((c) => c.name),
      },
      job: {
        title: job.roleTitle,
        requiredSkills: job.requiredSkills,
        preferredSkills: job.preferredSkills,
        responsibilities: job.responsibilities,
        experienceRequirements: job.experienceRequirements,
      },
    };

    const answers = await askJev(this.apiKey, state, questions);

    // 1. Skills: trust Jev when it is confident, otherwise keep the keyword result.
    const updatedSkills: SkillMatch[] = base.skills.map((s, i) => {
      const a = i < MAX_SKILLS ? answers[`s${i}`] : undefined;
      if (!a?.choice || (a.confidence ?? 0) < MIN_CONFIDENCE) return s;

      const p = a.probabilities ?? {};
      const pct = Math.round(100 * (p.matched ?? 0) + 55 * (p.partial ?? 0));
      const status = a.choice as SkillMatch['status'];
      const jevOnly = s.status !== status;
      return {
        ...s,
        status,
        matchPercentage: pct,
        confidence: (a.confidence ?? 0) >= 0.85 ? 'high' : 'medium',
        evidence:
          jevOnly && status !== 'missing' && s.status === 'missing'
            ? `Equivalent or related experience found for "${s.skill}" (semantic match).`
            : s.evidence,
        recommendation:
          status === 'matched'
            ? `Strong alignment. Keep concrete metrics for ${s.normalizedSkill} visible.`
            : status === 'partial'
            ? `You list ${s.normalizedSkill} or related skills, but lack strong project bullet evidence in your work experience section.`
            : s.recommendation,
      };
    });

    const gaps: SkillGap[] = updatedSkills
      .filter((s) => s.status !== 'matched')
      .map((s) => ({
        skill: s.normalizedSkill,
        importance: s.importance,
        severity:
          s.importance === 'required'
            ? s.status === 'missing'
              ? 'critical'
              : 'important'
            : 'nice-to-have',
        jdContext: `Job description specifies requirement: "${s.skill}"`,
        resumeContext: s.evidence,
        recommendation: `Add explicit bullet points detailing ${s.normalizedSkill} usage if applicable to your actual technical work.`,
      }));

    const avg = (list: SkillMatch[], fallback: number) =>
      list.length ? Math.round(list.reduce((a, c) => a + c.matchPercentage, 0) / list.length) : fallback;
    const requiredSkills = avg(updatedSkills.filter((s) => s.importance === 'required'), 80);
    const preferredSkills = avg(updatedSkills.filter((s) => s.importance === 'preferred'), 70);

    // 2. Responsibilities
    const responsibilityMatches = base.responsibilityMatches.map((r, i) => {
      const a = i < MAX_RESPONSIBILITIES ? answers[`r${i}`] : undefined;
      if (a?.score === undefined) return r;
      const matchScore = Math.round((a.score / 2) * 100);
      return {
        ...r,
        matchScore,
        status: (matchScore >= 70 ? 'strong' : matchScore >= 40 ? 'moderate' : 'gap') as 'strong' | 'moderate' | 'gap',
      };
    });
    const responsibilityAlignment = responsibilityMatches.length
      ? Math.round(responsibilityMatches.reduce((a, c) => a + c.matchScore, 0) / responsibilityMatches.length)
      : base.scoreBreakdown.responsibilityAlignment;

    // 3. Seniority fit adjusts experience alignment (overqualified is a small penalty).
    const levelIdx = (a?: JevAnswer) => (a?.choice ? LEVELS.indexOf(a.choice) : -1);
    const rl = levelIdx(answers.resume_level);
    const jl = levelIdx(answers.job_level);
    let experienceAlignment = base.scoreBreakdown.experienceAlignment;
    let seniorityNote = '';
    if (rl >= 0 && jl >= 0) {
      const underBy = Math.max(0, jl - rl);
      const overBy = Math.max(0, rl - jl);
      experienceAlignment = Math.max(30, Math.min(100, experienceAlignment - underBy * 18 - overBy * 6));
      if (underBy > 0) {
        seniorityNote = `The role targets ${LEVELS[jl]} level, but your resume reads as ${LEVELS[rl]} level.`;
      }
    }

    // 4. Bullet quality and ATS checks.
    const weakBullets = bullets.filter((_, i) => answers[`b${i}`]?.choice === 'weak');
    const strongCount = bullets.filter((_, i) => answers[`b${i}`]?.choice === 'strong').length;
    const impact = bullets.length
      ? Math.round(
          bullets.reduce((acc, _, i) => {
            const c = answers[`b${i}`]?.choice;
            return acc + (c === 'strong' ? 100 : c === 'adequate' ? 65 : c === 'weak' ? 25 : 60);
          }, 0) / bullets.length
        )
      : base.resumeQuality.impact;
    const actionVerbsScore =
      answers.action_verbs?.noul !== undefined
        ? Math.round(answers.action_verbs.noul * 100)
        : base.resumeQuality.actionVerbsScore;

    const ats = this.atsChecks(resume);

    const scoreBreakdown = { ...base.scoreBreakdown, requiredSkills, preferredSkills, experienceAlignment, responsibilityAlignment };
    const overallScore = computeOverallScore(scoreBreakdown);

    const bulletQualitySuggestions = weakBullets.map((b) => {
      const src = bullets.find((x) => x.text === b.text)!;
      return {
        original: src.text,
        section: src.section,
        suggestion: `Rewrite "${src.text}" with a strong action verb, the technology used, and a measurable result.`,
        reason: 'Rated weak: vague, passive or duties-only.',
      };
    });

    // 5. Recommendations: rebuild the skill one, add seniority and ATS ones.
    const recommendations: ActionableRecommendation[] = base.recommendations.filter((r) => r.id !== 'rec-1');
    const critical = gaps.find((g) => g.severity === 'critical');
    if (critical) {
      recommendations.unshift({
        id: 'rec-1',
        title: `Add evidence for missing critical skill: ${critical.skill}`,
        problem: `The job description requires ${critical.skill}, but no direct or equivalent evidence was found in your experience or projects.`,
        whyItMatters: `Required skills account for 30% of your total Resume-Job Match score.`,
        suggestedChange: `If you have hands-on experience with ${critical.skill}, detail it in your skills list and work experience bullets.`,
        relevantSection: 'Experience / Skills',
        expectedCategory: 'requiredSkills',
        priority: 'high',
      });
    }
    if (seniorityNote) {
      recommendations.push({
        id: 'rec-seniority',
        title: 'Show scope and ownership for the target level',
        problem: seniorityNote,
        whyItMatters: 'Experience alignment is 20% of your match score.',
        suggestedChange: 'Highlight leadership, design decisions, mentoring and the scale of systems you owned, where truthful.',
        relevantSection: 'Work Experience',
        expectedCategory: 'experienceAlignment',
        priority: 'medium',
      });
    }
    if (ats.issues.length > 0) {
      recommendations.push({
        id: 'rec-ats',
        title: 'Fix ATS parsing issues',
        problem: ats.issues.join(' '),
        whyItMatters: 'Applicant tracking systems may drop or mis-file resumes with missing basics.',
        suggestedChange: 'Add the missing sections or fields using standard headings.',
        relevantSection: 'Resume structure',
        expectedCategory: 'keywordCoverage',
        priority: 'high',
      });
    }

    return {
      ...base,
      overallScore,
      scoreBreakdown,
      skills: updatedSkills,
      gaps,
      responsibilityMatches,
      recommendations,
      explainableSummary:
        overallScore >= 80
          ? `Strong alignment (${overallScore}%) across the required stack. ${strongCount} of ${bullets.length} bullets are rated strong.`
          : overallScore >= 65
          ? `Moderate alignment (${overallScore}%). Core skills are demonstrated, but evidence gaps remain for some requirements.`
          : `Needs optimization (${overallScore}%). Significant gaps between job requirements and demonstrated experience.`,
      resumeQuality: {
        ...base.resumeQuality,
        impact,
        actionVerbsScore,
        structure: ats.score,
        formatting: ats.score,
        bulletQualitySuggestions: bulletQualitySuggestions.length
          ? bulletQualitySuggestions
          : base.resumeQuality.bulletQualitySuggestions,
      },
    };
  }

  /** Deterministic ATS basics, run locally so contact details never leave the server. */
  private atsChecks(resume: NormalizedResume): { score: number; issues: string[] } {
    const issues: string[] = [];
    if (!resume.email) issues.push('No email address was detected.');
    if (!resume.phone) issues.push('No phone number was detected.');
    if (resume.skills.length === 0) issues.push('No clear Skills section was detected.');
    if (resume.experience.length === 0) issues.push('No Work Experience section was detected.');
    if (resume.education.length === 0) issues.push('No Education section was detected.');
    if (resume.experience.some((e) => !e.startDate)) issues.push('Some roles are missing dates.');
    return { score: Math.max(40, 100 - issues.length * 12), issues };
  }
}
