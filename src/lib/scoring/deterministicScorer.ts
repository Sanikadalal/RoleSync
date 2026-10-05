import {
  NormalizedResume,
  JobAnalysis,
  MatchAnalysis,
  SkillMatch,
  SkillGap,
  ResponsibilityMatch,
  KeywordAnalysis,
  ResumeQualityMetrics,
  ActionableRecommendation,
  ScoreBreakdown,
} from '../types';
import {
  normalizeSkill,
  getSkillCategory,
  areSkillsRelated,
} from './skillDictionary';

export function computeOverallScore(b: ScoreBreakdown): number {
  return Math.round(
    b.requiredSkills * 0.3 +
      b.preferredSkills * 0.1 +
      b.experienceAlignment * 0.2 +
      b.responsibilityAlignment * 0.15 +
      b.keywordCoverage * 0.1 +
      b.projectEvidence * 0.1 +
      b.educationAlignment * 0.05
  );
}

export function calculateDeterministicScore(
  resume: NormalizedResume,
  job: JobAnalysis
): MatchAnalysis {
  // Extract all text snippets from resume for evidence lookup
  const resumeFullText = [
    resume.summary,
    ...resume.skills,
    ...resume.experience.flatMap((e) => [e.role, e.company, ...e.description, ...e.technologies]),
    ...resume.projects.flatMap((p) => [p.name, ...p.description, ...p.technologies]),
    ...resume.education.flatMap((ed) => [ed.institution, ed.degree, ed.fieldOfStudy]),
    ...resume.certifications.flatMap((c) => [c.name, c.issuer]),
  ]
    .join(' ')
    .toLowerCase();

  // 1. Skill Matrix Construction & Evidence Scoring
  const skillMatches: SkillMatch[] = [];
  const skillGaps: SkillGap[] = [];

  const processSkillsList = (
    skillsList: string[],
    importance: 'required' | 'preferred'
  ) => {
    for (const rawSkill of skillsList) {
      const normSkill = normalizeSkill(rawSkill);
      if (skillMatches.some((sm) => sm.normalizedSkill === normSkill)) continue;

      const category = getSkillCategory(normSkill);

      // Look for evidence in resume
      let evidenceFound = '';
      let sourceSection = '';
      let matchScore = 0;
      let confidence: 'high' | 'medium' | 'low' = 'low';

      // Check experience items
      for (const exp of resume.experience) {
        const expText = [exp.role, ...exp.description, ...exp.technologies].join(' ');
        if (expText.toLowerCase().includes(normSkill.toLowerCase())) {
          evidenceFound = `Demonstrated as ${exp.role} at ${exp.company}: "${
            exp.description.find((d) => d.toLowerCase().includes(normSkill.toLowerCase())) || exp.description[0] || exp.role
          }"`;
          sourceSection = `Experience — ${exp.company}`;
          matchScore = 100;
          confidence = 'high';
          break;
        }
      }

      // If not in experience, check projects
      if (!evidenceFound) {
        for (const proj of resume.projects) {
          const projText = [proj.name, ...proj.description, ...proj.technologies].join(' ');
          if (projText.toLowerCase().includes(normSkill.toLowerCase())) {
            evidenceFound = `Project "${proj.name}": "${
              proj.description.find((d) => d.toLowerCase().includes(normSkill.toLowerCase())) || proj.description[0] || proj.name
            }"`;
            sourceSection = `Project — ${proj.name}`;
            matchScore = 90;
            confidence = 'high';
            break;
          }
        }
      }

      // Check explicit skills list
      if (!evidenceFound && resume.skills.some((s) => normalizeSkill(s) === normSkill)) {
        evidenceFound = `Listed in Skills section as "${normSkill}".`;
        sourceSection = 'Skills Section';
        matchScore = 65; // Listed but lacks detailed project/work bullet evidence
        confidence = 'medium';
      }

      // Check related skills fallback (e.g. Java found for Spring Boot requirement)
      if (!evidenceFound) {
        const relatedSkillInResume = resume.skills.find((s) => areSkillsRelated(s, normSkill));
        if (relatedSkillInResume) {
          evidenceFound = `Related experience found: Resume demonstrates "${relatedSkillInResume}" which provides foundational background for "${normSkill}".`;
          sourceSection = 'Related Skill Alignment';
          matchScore = 40;
          confidence = 'medium';
        }
      }

      const status = matchScore >= 75 ? 'matched' : matchScore > 0 ? 'partial' : 'missing';
      let recommendation = '';

      if (status === 'matched') {
        recommendation = `Strong alignment. Keep concrete metrics for ${normSkill} visible.`;
      } else if (status === 'partial') {
        recommendation = `You list ${normSkill} or related skills, but lack strong project bullet evidence in your work experience section.`;
      } else {
        recommendation = `If you have genuine hands-on experience with ${normSkill}, add project bullet evidence highlighting its usage. Do not invent experience if unused.`;
      }

      skillMatches.push({
        skill: rawSkill,
        normalizedSkill: normSkill,
        importance,
        matchPercentage: matchScore,
        status,
        evidence: evidenceFound || 'No explicit evidence found in uploaded resume.',
        sourceSection: sourceSection || 'None',
        confidence,
        recommendation,
        category,
      });

      if (status !== 'matched') {
        const severity =
          importance === 'required'
            ? matchScore === 0
              ? 'critical'
              : 'important'
            : 'nice-to-have';

        skillGaps.push({
          skill: normSkill,
          importance,
          severity,
          jdContext: `Job description specifies requirement: "${rawSkill}"`,
          resumeContext: evidenceFound || 'Not referenced in resume.',
          recommendation: `Add explicit bullet points detailing ${normSkill} usage if applicable to your actual technical work.`,
        });
      }
    }
  };

  processSkillsList(job.requiredSkills, 'required');
  processSkillsList(job.preferredSkills, 'preferred');

  // Calculate skill scores
  const reqMatches = skillMatches.filter((s) => s.importance === 'required');
  const prefMatches = skillMatches.filter((s) => s.importance === 'preferred');

  const requiredSkillScore =
    reqMatches.length > 0
      ? Math.round(reqMatches.reduce((acc, curr) => acc + curr.matchPercentage, 0) / reqMatches.length)
      : 80;

  const preferredSkillScore =
    prefMatches.length > 0
      ? Math.round(prefMatches.reduce((acc, curr) => acc + curr.matchPercentage, 0) / prefMatches.length)
      : 70;

  // 2. Responsibility Matching
  const responsibilityMatches: ResponsibilityMatch[] = job.responsibilities.map((resp) => {
    const respLower = resp.toLowerCase();
    const matchingExp = resume.experience.find((e) =>
      e.description.some((d) => {
        const dLower = d.toLowerCase();
        return (
          dLower.includes('api') && respLower.includes('api') ||
          dLower.includes('backend') && respLower.includes('backend') ||
          dLower.includes('data') && respLower.includes('data') ||
          dLower.includes('cloud') && respLower.includes('cloud') ||
          dLower.includes('system') && respLower.includes('system') ||
          dLower.includes('microservice') && respLower.includes('microservice')
        );
      })
    );

    if (matchingExp) {
      const bestBullet =
        matchingExp.description.find((d) => d.length > 20) || matchingExp.description[0] || matchingExp.role;
      return {
        jdResponsibility: resp,
        resumeEvidence: `Matches ${matchingExp.role} at ${matchingExp.company}: "${bestBullet}"`,
        matchScore: 85,
        status: 'strong',
      };
    } else {
      return {
        jdResponsibility: resp,
        resumeEvidence: 'Limited direct responsibility match in work history bullets.',
        matchScore: 40,
        status: 'gap',
      };
    }
  });

  const responsibilityAlignment =
    responsibilityMatches.length > 0
      ? Math.round(
          responsibilityMatches.reduce((acc, curr) => acc + curr.matchScore, 0) / responsibilityMatches.length
        )
      : 75;

  // 3. Keyword Analysis
  const allJdKeywords = [...job.keywords, ...job.technicalRequirements, ...job.tools];
  const presentKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of allJdKeywords) {
    const cleanKw = kw.trim();
    if (!cleanKw) continue;
    if (resumeFullText.includes(cleanKw.toLowerCase())) {
      if (!presentKeywords.includes(cleanKw)) presentKeywords.push(cleanKw);
    } else {
      if (!missingKeywords.includes(cleanKw)) missingKeywords.push(cleanKw);
    }
  }

  const keywordCoverage =
    allJdKeywords.length > 0
      ? Math.round((presentKeywords.length / Math.max(allJdKeywords.length, 1)) * 100)
      : 80;

  const keywords: KeywordAnalysis = {
    present: presentKeywords,
    missing: missingKeywords,
    overused: ['responsible for', 'worked on', 'helped with'],
    importantPhrases: job.domainTerms.length > 0 ? job.domainTerms : ['Scalable Architecture', 'REST APIs', 'Cloud Microservices'],
  };

  // 4. Experience & Project Alignment
  const experienceAlignment = Math.min(
    100,
    Math.round((resume.experience.length >= 2 ? 85 : 70) + (requiredSkillScore > 75 ? 10 : 0))
  );

  const projectEvidence =
    resume.projects.length > 0
      ? Math.round(
          resume.projects.reduce((acc, p) => acc + (p.technologies.length > 1 ? 90 : 70), 0) / resume.projects.length
        )
      : 60;

  const educationAlignment = resume.education.length > 0 ? 95 : 75;

  // 5. Final Score Calculation based on explicit prompt weight matrix:
  // Required Skills: 30%
  // Preferred Skills: 10%
  // Experience Alignment: 20%
  // Responsibility Alignment: 15%
  // Keyword Coverage: 10%
  // Project Evidence: 10%
  // Education: 5%
  const scoreBreakdown: ScoreBreakdown = {
    requiredSkills: Math.min(100, Math.max(0, requiredSkillScore)),
    preferredSkills: Math.min(100, Math.max(0, preferredSkillScore)),
    experienceAlignment: Math.min(100, Math.max(0, experienceAlignment)),
    responsibilityAlignment: Math.min(100, Math.max(0, responsibilityAlignment)),
    keywordCoverage: Math.min(100, Math.max(0, keywordCoverage)),
    projectEvidence: Math.min(100, Math.max(0, projectEvidence)),
    educationAlignment: Math.min(100, Math.max(0, educationAlignment)),
  };

  const overallScore = computeOverallScore(scoreBreakdown);

  // 6. Resume Quality Audit
  const totalBullets = resume.experience.flatMap((e) => e.description).length;
  const quantifiedBullets = resume.experience
    .flatMap((e) => e.description)
    .filter((d) => /\d+%|\d+x|\$\d+|\d+ms|\d+ users|\d+k/i.test(d)).length;

  const impactScore = totalBullets > 0 ? Math.round((quantifiedBullets / totalBullets) * 100) : 50;

  const resumeQuality: ResumeQualityMetrics = {
    overallScore: Math.round(82 * 0.4 + impactScore * 0.3 + (totalBullets > 3 ? 90 : 60) * 0.3),
    readability: 88,
    structure: 92,
    relevance: Math.round((requiredSkillScore + keywordCoverage) / 2),
    impact: Math.max(40, impactScore),
    technicalEvidence: Math.round(projectEvidence),
    formatting: 90,
    actionVerbsScore: 84,
    bulletQualitySuggestions: resume.experience.flatMap((e) =>
      e.description
        .filter((bullet) => !/\d+/.test(bullet) && bullet.length < 50)
        .map((bullet) => ({
          original: bullet,
          section: `${e.role} at ${e.company}`,
          suggestion: `Expand "${bullet}" with action verbs, tech stack, and measurable impact (e.g. reduced latent response time or improved throughput).`,
          reason: 'Bullet lacks concrete technical detail and quantified outcomes.',
        }))
    ),
  };

  // 7. Highest Impact Recommendations
  const recommendations: ActionableRecommendation[] = [];

  if (skillGaps.some((g) => g.severity === 'critical')) {
    const critical = skillGaps.find((g) => g.severity === 'critical')!;
    recommendations.push({
      id: 'rec-1',
      title: `Add evidence for missing critical skill: ${critical.skill}`,
      problem: `The job description heavily relies on ${critical.skill}, but no direct evidence was detected in your experience or projects.`,
      whyItMatters: `Required skills account for 30% of your total Resume-Job Match score.`,
      suggestedChange: `If you have hands-on experience with ${critical.skill}, detail it in your technical skills list and work experience bullets.`,
      relevantSection: 'Experience / Skills',
      expectedCategory: 'requiredSkills',
      priority: 'high',
    });
  }

  if (keywords.missing.length > 0) {
    recommendations.push({
      id: 'rec-2',
      title: `Incorporate key job terms: ${keywords.missing.slice(0, 3).join(', ')}`,
      problem: `Key terms mentioned in the job description (${keywords.missing.slice(0, 3).join(', ')}) are absent from your resume text.`,
      whyItMatters: `Aligning technical vocabulary ensures ATS parsing accuracy and recruiter readability.`,
      suggestedChange: `Naturally integrate these terms into your bullet points where truthfully accurate.`,
      relevantSection: 'Experience Bullets',
      expectedCategory: 'keywordCoverage',
      priority: 'medium',
    });
  }

  if (impactScore < 60) {
    recommendations.push({
      id: 'rec-3',
      title: 'Quantify achievements with metrics & impact',
      problem: `Only ${quantifiedBullets} of your ${totalBullets} experience bullets contain measurable metrics (%, $, scale, users).`,
      whyItMatters: `Impact-driven bullet points dramatically strengthen experience alignment and recruiter engagement.`,
      suggestedChange: `Include baseline metrics (e.g., "improved latency by 35%", "handled 10k+ daily API requests").`,
      relevantSection: 'Work Experience',
      expectedCategory: 'experienceAlignment',
      priority: 'high',
    });
  }

  const explainableSummary =
    overallScore >= 80
      ? `Strong alignment (${overallScore}%) across required technical stack with high evidence confidence. Minor additions in missing keywords will maximize match.`
      : overallScore >= 65
      ? `Moderate alignment (${overallScore}%). Key backend required skills are demonstrated, but critical evidence gaps remain for missing tools.`
      : `Needs optimization (${overallScore}%). Significant gaps detected between job requirements and demonstrated experience bullets.`;

  return {
    id: `analysis-${Date.now()}`,
    resumeId: resume.id,
    jobId: job.id,
    versionNumber: 1,
    overallScore,
    explainableSummary,
    scoreBreakdown,
    skills: skillMatches,
    gaps: skillGaps,
    responsibilityMatches,
    keywords,
    resumeQuality,
    recommendations,
    createdAt: new Date().toISOString(),
  };
}
