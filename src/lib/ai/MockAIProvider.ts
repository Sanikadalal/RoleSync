import { AIProvider } from './AIProvider';
import {
  NormalizedResume,
  JobAnalysis,
  MatchAnalysis,
  ExperienceItem,
  ProjectItem,
} from '../types';
import { calculateDeterministicScore } from '../scoring/deterministicScorer';

export class MockAIProvider implements AIProvider {
  async analyzeResume(
    rawText: string,
    filename: string = 'Resume.pdf'
  ): Promise<NormalizedResume> {
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    // Heuristic parsing for text extraction fallback
    const name = lines[0] || 'Alex Morgan';
    const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = rawText.match(/\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/);
    const email = emailMatch ? emailMatch[0] : 'alex.morgan@example.com';
    const phone = phoneMatch ? phoneMatch[0] : '+1 (555) 234-5678';

    // Parse sections
    const skillsList = [
      'Java',
      'Spring Boot',
      'PostgreSQL',
      'REST APIs',
      'Docker',
      'Git',
      'Maven',
      'Microservices',
      'JUnit',
    ];

    const experience: ExperienceItem[] = [
      {
        id: 'exp-1',
        company: 'Apex Tech Solutions',
        role: 'Software Engineer',
        startDate: '2022-03',
        endDate: 'Present',
        location: 'San Francisco, CA',
        description: [
          'Developed and maintained high-throughput REST APIs using Java and Spring Boot, serving 500k+ daily transactions.',
          'Optimized PostgreSQL database queries and indexing strategies, reducing query latency by 35%.',
          'Containerized microservices with Docker and configured CI/CD pipelines for automated deployments.',
        ],
        technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'REST APIs'],
      },
      {
        id: 'exp-2',
        company: 'CloudScale Systems',
        role: 'Junior Backend Developer',
        startDate: '2020-06',
        endDate: '2022-02',
        location: 'San Jose, CA',
        description: [
          'Built internal analytics services using Java and Spring Framework.',
          'Integrated JUnit unit tests and Mockito mock suites to achieve 85% test coverage.',
          'Collaborated with cross-functional engineering teams in an Agile Scrum environment.',
        ],
        technologies: ['Java', 'Spring Framework', 'JUnit', 'Git', 'Agile'],
      },
    ];

    const projects: ProjectItem[] = [
      {
        id: 'proj-1',
        name: 'Distributed Task Queue System',
        description: [
          'Engineered an asynchronous task queuing service in Java to process background jobs with automatic retries.',
          'Integrated PostgreSQL for job state persistence and transactional reliability.',
        ],
        technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
        links: ['https://github.com/example/task-queue'],
      },
    ];

    return {
      id: `res-${Date.now()}`,
      name,
      email,
      phone,
      location: 'San Francisco, CA',
      summary:
        'Experienced Software Engineer specializing in Java, Spring Boot, REST APIs, and relational databases. Proven track record of delivering resilient backend microservices.',
      skills: skillsList,
      experience,
      education: [
        {
          id: 'edu-1',
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2016-08',
          endDate: '2020-05',
        },
      ],
      projects,
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Developer - Associate',
          issuer: 'Amazon Web Services',
          date: '2023-04',
        },
      ],
      achievements: ['Deans List UC Berkeley', 'Hackathon 1st Place Backend Track'],
      links: ['https://linkedin.com/in/example', 'https://github.com/example'],
    };
  }

  async analyzeJobDescription(
    rawText: string,
    roleTitle: string = 'Senior Backend Engineer',
    company: string = 'Enterprise Tech Corp'
  ): Promise<JobAnalysis> {
    return {
      id: `jd-${Date.now()}`,
      roleTitle,
      company,
      rawText,
      requiredSkills: ['Java', 'Spring Boot', 'REST APIs', 'PostgreSQL'],
      preferredSkills: ['Redis', 'Docker', 'AWS', 'Apache Kafka', 'Microservices'],
      technicalRequirements: [
        '5+ years of software development experience',
        'Strong expertise in Java ecosystem & Spring Framework',
        'Proficiency in relational databases (PostgreSQL/MySQL)',
        'Experience building scalable RESTful microservices',
      ],
      softSkills: ['Problem Solving', 'Team Collaboration', 'Agile Communication'],
      responsibilities: [
        'Design and build scalable REST APIs for core financial transaction workflows.',
        'Optimize database performance, queries, and connection pools.',
        'Implement distributed caching and message queue messaging.',
        'Participate in architecture reviews and mentor junior developers.',
      ],
      experienceRequirements: ['3+ years in backend engineering role'],
      educationRequirements: ['Bachelor degree in CS or equivalent field'],
      tools: ['Git', 'Maven', 'Docker', 'Postman'],
      technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'AWS', 'Kafka'],
      keywords: ['Java', 'Spring Boot', 'REST APIs', 'PostgreSQL', 'Microservices', 'Redis', 'AWS', 'Kafka'],
      domainTerms: ['Scalable Architecture', 'Distributed Caching', 'Event-Driven Microservices'],
    };
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
