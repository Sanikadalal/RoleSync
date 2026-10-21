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

  // More languages & web
  kotlin: 'Kotlin',
  swift: 'Swift',
  scala: 'Scala',
  sql: 'SQL',
  html: 'HTML',
  html5: 'HTML',
  css: 'CSS',
  css3: 'CSS',
  sass: 'Sass',
  tailwind: 'Tailwind CSS',
  'tailwind css': 'Tailwind CSS',
  redux: 'Redux',
  svelte: 'Svelte',
  nuxt: 'Nuxt',
  jquery: 'jQuery',
  bash: 'Bash',
  'shell scripting': 'Bash',
  'asp.net': 'ASP.NET',
  '.net': '.NET',
  dotnet: '.NET',
  laravel: 'Laravel',
  rails: 'Ruby on Rails',
  'ruby on rails': 'Ruby on Rails',
  hibernate: 'Hibernate',
  prisma: 'Prisma',
  webpack: 'Webpack',
  vite: 'Vite',

  // Data & ML
  'sql server': 'SQL Server',
  cassandra: 'Cassandra',
  snowflake: 'Snowflake',
  bigquery: 'BigQuery',
  spark: 'Apache Spark',
  'apache spark': 'Apache Spark',
  hadoop: 'Hadoop',
  airflow: 'Airflow',
  pandas: 'Pandas',
  numpy: 'NumPy',
  tensorflow: 'TensorFlow',
  pytorch: 'PyTorch',
  'scikit-learn': 'Scikit-learn',
  sklearn: 'Scikit-learn',
  'machine learning': 'Machine Learning',
  'deep learning': 'Deep Learning',
  nlp: 'NLP',
  llm: 'LLMs',
  llms: 'LLMs',
  langchain: 'LangChain',
  tableau: 'Tableau',
  'power bi': 'Power BI',

  // Cloud, DevOps & tooling
  linux: 'Linux',
  nginx: 'Nginx',
  ansible: 'Ansible',
  prometheus: 'Prometheus',
  grafana: 'Grafana',
  datadog: 'Datadog',
  vercel: 'Vercel',
  firebase: 'Firebase',
  supabase: 'Supabase',
  serverless: 'Serverless',
  'aws lambda': 'AWS Lambda',
  git: 'Git',
  github: 'GitHub',
  gitlab: 'GitLab',
  jira: 'Jira',
  postman: 'Postman',
  maven: 'Maven',
  gradle: 'Gradle',
  figma: 'Figma',
  selenium: 'Selenium',
  playwright: 'Playwright',
  mockito: 'Mockito',
  oauth: 'OAuth',
  jwt: 'JWT',
  websockets: 'WebSockets',
  agile: 'Agile',
  scrum: 'Scrum',
};

// Short aliases that are also ordinary English words / fragments. They stay valid for
// normalizing an explicit skill token ("Go") but are never matched inside free text.
const AMBIGUOUS_ALIASES = new Set(['go', 'cs', 'ci', 'cd', 'next', 'rest', 'express', 'rb']);

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

  SQL: 'Databases',
  'SQL Server': 'Databases',
  Cassandra: 'Databases',
  Snowflake: 'Databases',
  BigQuery: 'Databases',
  Kotlin: 'Languages',
  Swift: 'Languages',
  Scala: 'Languages',
  Bash: 'Languages',
  HTML: 'Frontend',
  CSS: 'Frontend',
  Sass: 'Frontend',
  'Tailwind CSS': 'Frontend',
  Redux: 'Frontend',
  Svelte: 'Frameworks',
  Nuxt: 'Frameworks',
  jQuery: 'Frontend',
  'ASP.NET': 'Frameworks',
  '.NET': 'Frameworks',
  Laravel: 'Frameworks',
  'Ruby on Rails': 'Frameworks',
  Hibernate: 'Frameworks',
  Prisma: 'Frameworks',
  'Apache Spark': 'Data & ML',
  Hadoop: 'Data & ML',
  Airflow: 'Data & ML',
  Pandas: 'Data & ML',
  NumPy: 'Data & ML',
  TensorFlow: 'Data & ML',
  PyTorch: 'Data & ML',
  'Scikit-learn': 'Data & ML',
  'Machine Learning': 'Data & ML',
  'Deep Learning': 'Data & ML',
  NLP: 'Data & ML',
  LLMs: 'Data & ML',
  LangChain: 'Data & ML',
  Tableau: 'Data & ML',
  'Power BI': 'Data & ML',
  Linux: 'Cloud & DevOps',
  Nginx: 'Cloud & DevOps',
  Ansible: 'Cloud & DevOps',
  Prometheus: 'Cloud & DevOps',
  Grafana: 'Cloud & DevOps',
  Datadog: 'Cloud & DevOps',
  Vercel: 'Cloud & DevOps',
  Firebase: 'Cloud & DevOps',
  Supabase: 'Cloud & DevOps',
  Serverless: 'Cloud & DevOps',
  'AWS Lambda': 'Cloud & DevOps',
  Jenkins: 'Cloud & DevOps',
  'GitHub Actions': 'Cloud & DevOps',
  Git: 'Tools',
  GitHub: 'Tools',
  GitLab: 'Tools',
  Jira: 'Tools',
  Postman: 'Tools',
  Maven: 'Tools',
  Gradle: 'Tools',
  Figma: 'Tools',
  Webpack: 'Tools',
  Vite: 'Tools',
  JUnit: 'Testing',
  Jest: 'Testing',
  Cypress: 'Testing',
  PyTest: 'Testing',
  Selenium: 'Testing',
  Playwright: 'Testing',
  Mockito: 'Testing',
  OAuth: 'Security',
  JWT: 'Security',
  WebSockets: 'Architecture',
  Agile: 'Methodology',
  Scrum: 'Methodology',
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

// ---- Free-text skill detection -------------------------------------------------

const escapeRegex = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// One compiled matcher per alias; canonical names are aliases of themselves.
const SKILL_MATCHERS: { canonical: string; re: RegExp }[] = (() => {
  const aliases = new Map<string, string>();
  for (const [alias, canonical] of Object.entries(SYNONYM_MAP)) {
    aliases.set(alias, canonical);
    aliases.set(canonical.toLowerCase(), canonical);
  }
  const out: { canonical: string; re: RegExp }[] = [];
  for (const [alias, canonical] of aliases) {
    if (AMBIGUOUS_ALIASES.has(alias)) continue;
    out.push({
      canonical,
      re: new RegExp(`(?<![A-Za-z0-9_])${escapeRegex(alias)}(?![A-Za-z0-9_])`, 'i'),
    });
  }
  return out;
})();

/** Canonical skills mentioned in free text, in order of first appearance. */
export function findSkillsInText(text: string): string[] {
  if (!text) return [];
  const found = new Map<string, { start: number; end: number }>();
  for (const { canonical, re } of SKILL_MATCHERS) {
    const m = re.exec(text);
    if (!m) continue;
    const prev = found.get(canonical);
    if (!prev || m.index < prev.start) found.set(canonical, { start: m.index, end: m.index + m[0].length });
  }
  const spans = [...found.entries()];
  return spans
    // "GitHub" inside "GitHub Actions" is the same mention, keep only the longer skill
    .filter(([skill, a]) =>
      !spans.some(([other, b]) => other !== skill && b.start <= a.start && b.end >= a.end && b.end - b.start > a.end - a.start)
    )
    .sort((x, y) => x[1].start - y[1].start)
    .map(([skill]) => skill);
}

/** True when the text mentions the skill, including via an alias (RESTful -> REST APIs). */
export function textMentionsSkill(text: string, skill: string): boolean {
  const norm = normalizeSkill(skill);
  if (text.toLowerCase().includes(norm.toLowerCase())) return true;
  return findSkillsInText(text).includes(norm);
}
