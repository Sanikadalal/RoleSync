// Rule-based extraction of structured resume / job data from raw text.
// Everything returned here comes from the input text; nothing is invented.

import {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  JobAnalysis,
  NormalizedResume,
  ProjectItem,
} from '../types';
import { findSkillsInText, getSkillCategory, normalizeSkill } from '../scoring/skillDictionary';

const BULLET = /^\s*[-•*▪◦●·–>]\s*/;
const MONTH =
  '(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';
const DATE = `(?:${MONTH}\\.?\\s+\\d{4}|\\d{1,2}\\/\\d{4}|\\d{4})`;
const DATE_RANGE = new RegExp(`(${DATE})\\s*(?:-|–|—|to)\\s*(${DATE}|present|current|now|ongoing)`, 'i');
const TITLE_WORDS =
  /\b(engineer|developer|manager|analyst|intern|designer|lead|architect|consultant|scientist|specialist|director|administrator|associate|officer|head|programmer|technician|coordinator|researcher|assistant|founder)\b/i;
const EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE = /(?:\+\d{1,3}[\s.-]?)?\(?\d{3,5}\)?[\s.-]?\d{3,5}(?:[\s.-]?\d{3,5})?/;
const URL_RE = /(?:https?:\/\/|www\.)[^\s,;)]+|(?:linkedin\.com|github\.com)\/[^\s,;)]+/gi;

type ResumeSection =
  | 'summary'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'certifications'
  | 'achievements';

const RESUME_HEADINGS: Record<ResumeSection, RegExp> = {
  summary: /^(professional |career )?(summary|profile|objective|about( me)?)$/i,
  skills: /^(technical |key |core )?(skills|competencies|technologies|tech stack|skills (&|and) tools)$/i,
  experience: /^(work |professional |relevant |industry )?(experience|employment( history)?|work history|internships?)$/i,
  projects: /^(personal |academic |key |selected |side )?projects$/i,
  education: /^(education|academic background|academics|education (&|and) training)$/i,
  certifications: /^(certifications?|licenses( (&|and) certifications?)?|courses|training)$/i,
  achievements: /^(achievements|awards|honou?rs|accomplishments|awards (&|and) honou?rs)$/i,
};

function headingKey(line: string): string {
  return line.replace(/[:：]+$/, '').replace(/[^A-Za-z&/ ]/g, '').trim();
}

function splitLines(text: string): string[] {
  return text
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function cleanBullet(line: string): string {
  return line.replace(BULLET, '').trim();
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function yearsOf(text: string): string[] {
  return text.match(/\b(?:19|20)\d{2}\b/g) ?? [];
}

// ---------------------------------------------------------------------------
// Resume
// ---------------------------------------------------------------------------

function splitResumeSections(lines: string[]): { header: string[]; sections: Partial<Record<ResumeSection, string[]>> } {
  const header: string[] = [];
  const sections: Partial<Record<ResumeSection, string[]>> = {};
  let current: ResumeSection | null = null;

  for (const line of lines) {
    const key = headingKey(line);
    const matched =
      line.length <= 40 && !BULLET.test(line)
        ? (Object.keys(RESUME_HEADINGS) as ResumeSection[]).find((s) => RESUME_HEADINGS[s].test(key))
        : undefined;
    if (matched) {
      current = matched;
      sections[matched] ??= [];
      continue;
    }
    if (current) sections[current]!.push(line);
    else header.push(line);
  }
  return { header, sections };
}

function parseSkillTokens(lines: string[]): string[] {
  const tokens: string[] = [];
  for (const raw of lines) {
    // Drop a "Languages:" style category label, then split the list.
    const body = cleanBullet(raw).replace(/^[A-Za-z &/]{2,30}:\s*/, '');
    for (const part of body.split(/[,;|•·]|\s{2,}/)) {
      const token = part.replace(/\(.*?\)/g, '').trim();
      if (token.length >= 2 && token.length <= 40 && token.split(/\s+/).length <= 4) {
        tokens.push(normalizeSkill(token));
      }
    }
  }
  return tokens;
}

function parseExperience(lines: string[]): ExperienceItem[] {
  const entries: { headers: string[]; start: string; end: string; description: string[] }[] = [];
  let cur: (typeof entries)[number] | null = null;
  let pending: string[] = [];

  for (const line of lines) {
    if (BULLET.test(line)) {
      pending = [];
      cur?.description.push(cleanBullet(line));
      continue;
    }
    const range = DATE_RANGE.exec(line);
    if (range) {
      const rest = line.replace(range[0], '').replace(/[()|,–—-]+\s*$/, '').replace(/^[\s|,–—-]+/, '').trim();
      cur = {
        headers: [...pending, ...(rest ? [rest] : [])],
        start: range[1],
        end: range[2],
        description: [],
      };
      entries.push(cur);
      pending = [];
      continue;
    }
    const isShort = line.length < 70 && !/[.!?]$/.test(line);
    if (cur && cur.description.length === 0 && isShort) {
      cur.headers.push(line); // company / location line right after the date line
    } else if (isShort) {
      pending.push(line); // header of the next entry, date comes on the following line
    } else if (cur) {
      cur.description.push(line);
    }
  }

  return entries.map((e, i) => {
    let role = '';
    let company = '';
    let location: string | undefined;
    const pieces = e.headers.flatMap((h) =>
      h.split(/\s+(?:at|@)\s+|\s+[|—–-]\s+|\s*\|\s*/i).map((p) => p.trim()).filter(Boolean)
    );
    for (const piece of pieces) {
      if (!role && TITLE_WORDS.test(piece)) role = piece;
      else if (!location && /^[A-Z][A-Za-z .]+,\s*[A-Z][A-Za-z .]+$/.test(piece) && company) location = piece;
      else if (!company) company = piece;
    }
    if (!role && pieces[0]) role = pieces[0] === company ? '' : pieces[0];
    const text = [...e.headers, ...e.description].join(' ');
    return {
      id: `exp-${i + 1}`,
      company,
      role,
      startDate: e.start,
      endDate: e.end,
      ...(location ? { location } : {}),
      description: e.description,
      technologies: findSkillsInText(text),
    };
  });
}

function parseProjects(lines: string[]): ProjectItem[] {
  const projects: { name: string; description: string[] }[] = [];
  let cur: (typeof projects)[number] | null = null;

  for (const line of lines) {
    const bullet = BULLET.test(line);
    const looksLikeName = !bullet && line.length < 80 && !/[.!?]$/.test(line) && !/^(tech|stack|built with|technologies)\b/i.test(line);
    if (looksLikeName && (!cur || cur.description.length > 0)) {
      cur = { name: line.replace(/\s*[|–—-]\s*.*$/, '').trim() || line, description: [] };
      projects.push(cur);
      const tail = line.slice(cur.name.length).replace(/^[\s|–—-]+/, '').trim();
      if (tail) cur.description.push(tail);
    } else if (cur) {
      cur.description.push(cleanBullet(line));
    }
  }

  return projects.map((p, i) => {
    const text = [p.name, ...p.description].join(' ');
    const links = text.match(URL_RE) ?? [];
    return {
      id: `proj-${i + 1}`,
      name: p.name,
      description: p.description,
      technologies: findSkillsInText(text),
      ...(links.length ? { links } : {}),
    };
  });
}

const INSTITUTION = /\b(university|college|institute|school|academy|polytechnic)\b/i;
const DEGREE =
  /\b(bachelors?|masters?|b\.?\s?tech|m\.?\s?tech|b\.?\s?sc?\.?|m\.?\s?sc?\.?|b\.?\s?e\.?|m\.?\s?e\.?|b\.?\s?a\.?|m\.?\s?a\.?|mba|ph\.?\s?d|doctorate|associate|diploma)\b[^,\n(|]*/i;

function parseEducation(lines: string[]): EducationItem[] {
  const items: EducationItem[] = [];
  let cur: EducationItem | null = null;

  for (const line of lines) {
    const hasInstitution = INSTITUTION.test(line);
    const degreeMatch = DEGREE.exec(line);

    if (hasInstitution && (!cur || cur.institution)) {
      cur = { id: `edu-${items.length + 1}`, institution: '', degree: '', fieldOfStudy: '' };
      items.push(cur);
    } else if (degreeMatch && (!cur || cur.degree)) {
      cur = { id: `edu-${items.length + 1}`, institution: '', degree: '', fieldOfStudy: '' };
      items.push(cur);
    }
    if (!cur) continue;

    if (hasInstitution && !cur.institution) {
      cur.institution = line.replace(DATE_RANGE, '').split(/\s*[|,–—]\s*(?=[A-Z]{2}\b|\d)/)[0].replace(/[|,–—-]\s*$/, '').trim();
    }
    if (degreeMatch && !cur.degree) {
      const degreeText = degreeMatch[0].trim();
      const inField = /\b(?:in|of)\s+(.+)$/i.exec(degreeText);
      cur.degree = degreeText.replace(/\s+(?:in|of)\s+.+$/i, '').trim();
      if (inField) cur.fieldOfStudy = inField[1].trim();
    }
    const gpa = /\b(?:gpa|cgpa)\s*[:\-]?\s*(\d(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)?)/i.exec(line);
    if (gpa) cur.gpa = gpa[1].replace(/\s+/g, '');
    const years = yearsOf(line);
    if (years.length && !cur.endDate) {
      if (years.length > 1) cur.startDate = years[0];
      cur.endDate = years[years.length - 1];
    }
  }
  return items;
}

function parseCertifications(lines: string[]): CertificationItem[] {
  return lines
    .map(cleanBullet)
    .filter((l) => l.length > 3)
    .map((line, i) => {
      const date = yearsOf(line)[0];
      const body = line.replace(/\(?\b(?:19|20)\d{2}\b\)?/g, '').replace(/[\s,–—|-]+$/, '').trim();
      const [name, issuer] = body.split(/\s+[–—|-]\s+|,\s+|\s+by\s+|\s+from\s+/i);
      return {
        id: `cert-${i + 1}`,
        name: (name || body).trim(),
        issuer: (issuer || '').trim(),
        ...(date ? { date } : {}),
      };
    });
}

export function extractResume(rawText: string): Omit<NormalizedResume, 'id'> {
  const lines = splitLines(rawText);
  const { header, sections } = splitResumeSections(lines);

  const contactLine = (l: string) => EMAIL.test(l) || PHONE.test(l) || /https?:|www\.|linkedin|github/i.test(l);
  const name =
    header.find((l) => !contactLine(l) && l.split(/\s+/).length <= 5 && !/\d/.test(l) && !TITLE_WORDS.test(l)) ?? '';
  const location =
    header.flatMap((l) => l.split(/[|•·]/)).map((p) => p.trim()).find((p) => /^[A-Z][A-Za-z .'-]+,\s*[A-Za-z .'-]{2,}$/.test(p)) ??
    '';

  const headerText = header.join(' ');
  const listedSkills = parseSkillTokens(sections.skills ?? []);
  const skills = unique([...listedSkills, ...findSkillsInText(rawText)]);

  const summary =
    (sections.summary ?? []).join(' ') ||
    header.filter((l) => !contactLine(l) && l !== name && l.length > 60).join(' ');

  return {
    name,
    email: EMAIL.exec(rawText)?.[0] ?? '',
    phone: PHONE.exec(headerText)?.[0] ?? '',
    location,
    summary,
    skills,
    experience: parseExperience(sections.experience ?? []),
    education: parseEducation(sections.education ?? []),
    projects: parseProjects(sections.projects ?? []),
    certifications: parseCertifications(sections.certifications ?? []),
    achievements: (sections.achievements ?? []).map(cleanBullet).filter(Boolean),
    links: unique(rawText.match(URL_RE) ?? []),
  };
}

// ---------------------------------------------------------------------------
// Job description
// ---------------------------------------------------------------------------

type JobSection = 'responsibilities' | 'requirements' | 'preferred' | 'ignore' | 'other';

const JOB_HEADINGS: [JobSection, RegExp][] = [
  ['preferred', /(preferred|nice to have|bonus|good to have|desirable|a plus|extra credit|pluses)/i],
  ['responsibilities', /(responsibilit|what you.?ll do|what you will do|duties|the role|your role|day to day|in this role|you will)/i],
  ['requirements', /(requirement|qualification|what you.?ll need|what we.?re looking for|must have|who you are|you have|skills|minimum|about you|experience)/i],
  ['ignore', /(benefit|perks|about (us|the company|the team)|who we are|our (mission|culture|story)|compensation|salary|equal opportunity|why join|what we offer)/i],
];

const PREFERRED_INLINE = /\b(nice to have|preferred|bonus|a plus|is a plus|good to have|desirable|familiarity with|exposure to)\b/i;

const SOFT_SKILLS: [string, RegExp][] = [
  ['Communication', /\bcommunicat/i],
  ['Collaboration', /\b(collaborat|cross-functional|teamwork|team player)/i],
  ['Problem Solving', /\bproblem[- ]solving|troubleshoot/i],
  ['Leadership', /\bleadership|\blead(ing)? (a )?team/i],
  ['Mentoring', /\bmentor/i],
  ['Ownership', /\bownership|self-starter|take initiative/i],
  ['Adaptability', /\badaptab|fast-paced|ambiguity/i],
  ['Time Management', /\btime management|prioriti[sz]/i],
  ['Critical Thinking', /\bcritical thinking|analytical/i],
  ['Stakeholder Management', /\bstakeholder/i],
];

const DOMAIN_TERMS: [string, RegExp][] = [
  ['Distributed Systems', /distributed (systems|computing)/i],
  ['Event-Driven Architecture', /event[- ]driven/i],
  ['Scalable Architecture', /\bscalab(le|ility)/i],
  ['High Availability', /high[- ]availability|fault[- ]toleran/i],
  ['Microservices', /microservice/i],
  ['Data Pipelines', /data pipeline|\betl\b|\belt\b/i],
  ['Real-Time Processing', /real[- ]time|low[- ]latency/i],
  ['System Design', /system design|architecture review/i],
  ['Observability', /observability|monitoring|alerting/i],
  ['Security', /\bsecurity|authentication|authorization/i],
  ['Payments / Fintech', /\bpayments?\b|fintech|financial/i],
  ['Healthcare', /healthcare|clinical|\bhipaa\b/i],
  ['E-commerce', /e-?commerce|marketplace/i],
  ['Performance Optimization', /performance (optimi[sz]ation|tuning)|optimi[sz]e/i],
  ['Accessibility', /accessib/i],
];

function classifyJobHeading(line: string): JobSection | null {
  if (BULLET.test(line) || line.length > 60 || /[.!?]$/.test(line)) return null;
  const key = line.replace(/[:：]+$/, '').trim();
  if (!/:$/.test(line) && key.split(/\s+/).length > 6) return null;
  return JOB_HEADINGS.find(([, re]) => re.test(key))?.[0] ?? null;
}

function inferRoleTitle(lines: string[]): string {
  const candidate = lines.slice(0, 6).find((l) => l.length < 80 && TITLE_WORDS.test(l) && !/[.!?]$/.test(l));
  return candidate ? candidate.replace(/^(job title|position|role)\s*[:\-]\s*/i, '').trim() : '';
}

export function extractJob(
  rawText: string,
  roleTitle?: string,
  company?: string
): Omit<JobAnalysis, 'id'> {
  const lines = splitLines(rawText);

  const required: string[] = [];
  const preferred: string[] = [];
  const responsibilities: string[] = [];
  const requirementLines: string[] = [];
  const experienceRequirements: string[] = [];
  const educationRequirements: string[] = [];

  let section: JobSection = 'other';
  for (const line of lines) {
    const heading = classifyJobHeading(line);
    if (heading) {
      section = heading;
      continue;
    }
    if (section === 'ignore') continue;

    const text = cleanBullet(line);
    const isPreferred = section === 'preferred' || PREFERRED_INLINE.test(text);
    const skills = findSkillsInText(text);
    (isPreferred ? preferred : required).push(...skills);

    if (section === 'responsibilities' && BULLET.test(line)) responsibilities.push(text);
    if (section === 'requirements' || section === 'preferred') {
      if (BULLET.test(line) || text.length > 25) requirementLines.push(text);
    }
    if (/\b\d+\s*\+?\s*(?:-\s*\d+\s*)?(?:years?|yrs)\b/i.test(text)) experienceRequirements.push(text);
    if (/\b(bachelor|master|ph\.?d|b\.?s\.?|m\.?s\.?|degree)\b/i.test(text) && !isPreferred) {
      educationRequirements.push(text);
    }
  }

  const requiredSkills = unique(required);
  const preferredSkills = unique(preferred).filter((s) => !requiredSkills.includes(s));
  const technologies = unique([...requiredSkills, ...preferredSkills]);
  const tools = technologies.filter((s) => ['Tools', 'Cloud & DevOps', 'Testing'].includes(getSkillCategory(s)));

  const domainTerms = DOMAIN_TERMS.filter(([, re]) => re.test(rawText)).map(([label]) => label);
  const softSkills = SOFT_SKILLS.filter(([, re]) => re.test(rawText)).map(([label]) => label);

  return {
    roleTitle: roleTitle?.trim() || inferRoleTitle(lines) || 'Target Role',
    company: company?.trim() || 'Target Company',
    rawText,
    requiredSkills,
    preferredSkills,
    technicalRequirements: unique(requirementLines).slice(0, 8),
    softSkills,
    responsibilities: unique(responsibilities).slice(0, 10),
    experienceRequirements: unique(experienceRequirements).slice(0, 4),
    educationRequirements: unique(educationRequirements).slice(0, 3),
    tools,
    technologies,
    keywords: unique([...technologies, ...domainTerms]),
    domainTerms,
  };
}
