import {
  NormalizedResume,
  JobAnalysis,
  MatchAnalysis,
  ResumeVersionSnapshot,
} from '../types';
import { calculateDeterministicScore } from '../scoring/deterministicScorer';

export const DEMO_RESUME: NormalizedResume = {
  id: 'demo-resume-1',
  name: 'Sanika Dalal',
  email: 'sanika.dalal@example.com',
  phone: '+1 (415) 890-1234',
  location: 'San Francisco, CA',
  summary:
    'Backend Engineer with 4+ years of experience engineering scalable microservices, RESTful APIs, and cloud services using Java, Spring Boot, and PostgreSQL.',
  skills: [
    'Java',
    'Spring Boot',
    'PostgreSQL',
    'REST APIs',
    'Docker',
    'Git',
    'Maven',
    'Microservices',
    'JUnit',
    'CI/CD',
    'SQL',
  ],
  experience: [
    {
      id: 'demo-exp-1',
      company: 'DataScale Systems',
      role: 'Backend Software Engineer',
      startDate: '2022-04',
      endDate: 'Present',
      location: 'San Francisco, CA',
      description: [
        'Architected and implemented high-throughput RESTful microservices in Java and Spring Boot processing over 450,000 requests daily.',
        'Engineered PostgreSQL database schemas and optimized index execution plans, achieving a 38% reduction in query response times.',
        'Built Dockerized container workflows and integrated automated JUnit integration test suites into GitHub Actions CI/CD pipelines.',
      ],
      technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'REST APIs', 'GitHub Actions'],
    },
    {
      id: 'demo-exp-2',
      company: 'TechFlow Labs',
      role: 'Associate Software Developer',
      startDate: '2020-08',
      endDate: '2022-03',
      location: 'San Jose, CA',
      description: [
        'Developed internal data management tools using Java 11, Spring Data JPA, and RESTful web services.',
        'Collaborated with senior engineers to implement unit testing, code reviews, and Agile Scrum methodologies.',
      ],
      technologies: ['Java', 'Spring Data JPA', 'REST APIs', 'SQL', 'Git'],
    },
  ],
  education: [
    {
      id: 'demo-edu-1',
      institution: 'University of California, Davis',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2016-09',
      endDate: '2020-06',
    },
  ],
  projects: [
    {
      id: 'demo-proj-1',
      name: 'E-Commerce Order Processing Pipeline',
      description: [
        'Built an event-ready order processing service in Spring Boot with PostgreSQL storage and Docker containerization.',
      ],
      technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
      links: ['https://github.com/sanikadalal/order-pipeline'],
    },
  ],
  certifications: [
    {
      id: 'demo-cert-1',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2023-01',
    },
  ],
  achievements: ['UC Davis High Honors Graduate', 'Engineered top-rated hackathon backend API'],
  links: ['https://linkedin.com/in/sanikadalal', 'https://github.com/sanikadalal'],
};

export const DEMO_JOB: JobAnalysis = {
  id: 'demo-job-1',
  roleTitle: 'Senior Backend Engineer',
  company: 'Apex Cloud Platforms',
  rawText: `Apex Cloud Platforms is seeking a Senior Backend Engineer to join our core architecture team.
  
Key Requirements:
- Deep expertise in Java and Spring Boot framework.
- Proven experience building distributed REST APIs and microservices.
- Strong proficiency in PostgreSQL database optimization and schema design.
- Hands-on experience with Redis caching and distributed data structures.
- Familiarity with Cloud infrastructure (AWS), Docker, and Apache Kafka for asynchronous event messaging.
- Excellent communication and Agile collaboration skills.`,
  requiredSkills: ['Java', 'Spring Boot', 'REST APIs', 'PostgreSQL'],
  preferredSkills: ['Redis', 'AWS', 'Apache Kafka', 'Docker', 'Microservices Architecture'],
  technicalRequirements: [
    'Deep expertise in Java & Spring Boot',
    'RESTful microservice architecture',
    'PostgreSQL query optimization & relational schema design',
  ],
  softSkills: ['Agile Collaboration', 'Technical Communication', 'Problem Solving'],
  responsibilities: [
    'Design, implement, and maintain scalable REST APIs using Spring Boot.',
    'Optimize PostgreSQL database schemas, indexing, and connection pooling.',
    'Implement Redis caching strategies to reduce database load.',
    'Integrate event-driven messaging pipelines using Apache Kafka.',
  ],
  experienceRequirements: ['3+ years in backend engineering role'],
  educationRequirements: ['Bachelor degree in Computer Science or related field'],
  tools: ['Docker', 'Git', 'Maven', 'Postman'],
  technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'AWS', 'Apache Kafka', 'Docker'],
  keywords: ['Java', 'Spring Boot', 'REST APIs', 'PostgreSQL', 'Redis', 'AWS', 'Kafka', 'Docker'],
  domainTerms: ['Microservices', 'Distributed Caching', 'Event-Driven Architecture'],
};

export function getDemoAnalysis(): MatchAnalysis {
  return calculateDeterministicScore(DEMO_RESUME, DEMO_JOB);
}

export function getDemoSnapshots(): ResumeVersionSnapshot[] {
  const initialAnalysis = getDemoAnalysis();

  // Updated resume with Redis and Kafka experience added
  const updatedResume: NormalizedResume = JSON.parse(JSON.stringify(DEMO_RESUME));
  updatedResume.skills.push('Redis', 'Apache Kafka');
  updatedResume.experience[0].description.push(
    'Integrated Redis caching mechanisms to handle high-frequency session data, cutting database read load by 40%.'
  );
  updatedResume.experience[0].technologies.push('Redis');
  updatedResume.projects[0].description.push(
    'Implemented event streaming topics using Apache Kafka for real-time order status notifications.'
  );
  updatedResume.projects[0].technologies.push('Apache Kafka', 'Redis');

  const updatedAnalysis = calculateDeterministicScore(updatedResume, DEMO_JOB);
  updatedAnalysis.versionNumber = 2;

  return [
    {
      id: 'v1',
      versionNumber: 1,
      resumeData: DEMO_RESUME,
      analysis: initialAnalysis,
      changesSummary: ['Initial upload and baseline analysis.'],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'v2',
      versionNumber: 2,
      resumeData: updatedResume,
      analysis: updatedAnalysis,
      changesSummary: [
        'Added explicit project evidence for Redis caching in work experience bullet.',
        'Added Apache Kafka event streaming to project description.',
        'Updated skills matrix with Redis and Apache Kafka.',
      ],
      createdAt: new Date().toISOString(),
    },
  ];
}
