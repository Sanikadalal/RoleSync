// Skill Normalization Dictionary & Category Mapping Engine

const SYNONYM_MAP: Record<string, string> = {
  // Programming Languages
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  py: 'Python',
  python: 'Python',
  java: 'Java',
  cplusplus: 'C++',
  cpp: 'C++',
  csharp: 'C#',
  cs: 'C#',
  golang: 'Go',
  go: 'Go',
  rb: 'Ruby',
  ruby: 'Ruby',
  php: 'PHP',
  rust: 'Rust',

  // Frameworks & Libraries
  spring: 'Spring Boot',
  springboot: 'Spring Boot',
  'spring framework': 'Spring Boot',
  'spring boot': 'Spring Boot',
  react: 'React',
  reactjs: 'React',
  'react.js': 'React',
  next: 'Next.js',
  nextjs: 'Next.js',
  'next.js': 'Next.js',
  vue: 'Vue.js',
  vuejs: 'Vue.js',
  angular: 'Angular',
  angularjs: 'Angular',
  express: 'Express.js',
  expressjs: 'Express.js',
  node: 'Node.js',
  nodejs: 'Node.js',
  'node.js': 'Node.js',
  django: 'Django',
  flask: 'Flask',
  fastapi: 'FastAPI',

  // Databases
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  'postgres db': 'PostgreSQL',
  mongo: 'MongoDB',
  mongodb: 'MongoDB',
  mysql: 'MySQL',
  redis: 'Redis',
  dynamodb: 'DynamoDB',
  elasticsearch: 'Elasticsearch',
  oracle: 'Oracle DB',
  sqlite: 'SQLite',

  // Cloud & DevOps
  aws: 'AWS',
  'amazon web services': 'AWS',
  gcp: 'Google Cloud Platform',
  'google cloud': 'Google Cloud Platform',
  azure: 'Microsoft Azure',
  docker: 'Docker',
  k8s: 'Kubernetes',
  kubernetes: 'Kubernetes',
  terraform: 'Terraform',
  jenkins: 'Jenkins',
  githubactions: 'GitHub Actions',
  'github actions': 'GitHub Actions',
  ci: 'CI/CD',
  cd: 'CI/CD',
  'ci/cd': 'CI/CD',

  // Architecture & Testing
  microservices: 'Microservices Architecture',
  rest: 'REST APIs',
  restful: 'REST APIs',
  'rest api': 'REST APIs',
  'rest apis': 'REST APIs',
  graphql: 'GraphQL',
  grpc: 'gRPC',
  kafka: 'Apache Kafka',
  rabbitmq: 'RabbitMQ',
  junit: 'JUnit',
  jest: 'Jest',
  cypress: 'Cypress',
  pytest: 'PyTest',
};

const CATEGORY_MAP: Record<string, string> = {
  // Languages
  JavaScript: 'Languages',
  TypeScript: 'Languages',
  Python: 'Languages',
  Java: 'Languages',
  'C++': 'Languages',
  'C#': 'Languages',
  Go: 'Languages',
  Ruby: 'Languages',
  PHP: 'Languages',
  Rust: 'Languages',

  // Frameworks
  'Spring Boot': 'Frameworks',
  React: 'Frameworks',
  'Next.js': 'Frameworks',
  'Vue.js': 'Frameworks',
  Angular: 'Frameworks',
  'Express.js': 'Frameworks',
  'Node.js': 'Frameworks',
  Django: 'Frameworks',
  Flask: 'Frameworks',
  FastAPI: 'Frameworks',

  // Databases
  PostgreSQL: 'Databases',
  MongoDB: 'Databases',
  MySQL: 'Databases',
  Redis: 'Databases',
  DynamoDB: 'Databases',
  Elasticsearch: 'Databases',

  // Cloud & Infrastructure
  AWS: 'Cloud & DevOps',
  'Google Cloud Platform': 'Cloud & DevOps',
  'Microsoft Azure': 'Cloud & DevOps',
  Docker: 'Cloud & DevOps',
  Kubernetes: 'Cloud & DevOps',
  Terraform: 'Cloud & DevOps',
  'CI/CD': 'Cloud & DevOps',

  // Architecture & Tools
  'Microservices Architecture': 'Architecture',
  'REST APIs': 'Architecture',
  GraphQL: 'Architecture',
  gRPC: 'Architecture',
  'Apache Kafka': 'Messaging & Queues',
  RabbitMQ: 'Messaging & Queues',
};

export function normalizeSkill(skillName: string): string {
  if (!skillName) return '';
  const clean = skillName.trim().toLowerCase();
  if (SYNONYM_MAP[clean]) {
    return SYNONYM_MAP[clean];
  }
  // Capitalize neatly if not found in map
  return skillName
    .trim()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getSkillCategory(normalizedSkillName: string): string {
  return CATEGORY_MAP[normalizedSkillName] || 'Technical Skills';
}

export function areSkillsRelated(skillA: string, skillB: string): boolean {
  const normA = normalizeSkill(skillA).toLowerCase();
  const normB = normalizeSkill(skillB).toLowerCase();

  if (normA === normB) return true;
  if (normA.includes(normB) || normB.includes(normA)) return true;

  // Domain groupings
  if (
    (normA.includes('spring') && normB.includes('java')) ||
    (normA.includes('java') && normB.includes('spring'))
  ) {
    return true;
  }
  if (
    (normA.includes('react') && normB.includes('javascript')) ||
    (normA.includes('javascript') && normB.includes('react'))
  ) {
    return true;
  }
  return false;
}
