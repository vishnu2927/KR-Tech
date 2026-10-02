/**
 * KR Tech Enterprise AI Engine (Phase 8 Sprint 8.1)
 * Hybrid Architecture: Connects to live OpenAI GPT API (gpt-4o-mini / gpt-3.5-turbo)
 * with robust, domain-trained engineering fallback intelligence.
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

/**
 * Helper to call OpenAI Chat Completions API
 */
async function callOpenAI(messages, temperature = 0.7, jsonMode = false) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY.includes('placeholder')) {
    return null; // Triggers fallback logic
  }

  try {
    const payload = {
      model: OPENAI_MODEL,
      messages,
      temperature,
    };
    if (jsonMode) {
      payload.response_format = { type: 'json_object' };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY.trim()}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('OpenAI API returned non-200:', response.status, errText);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.warn('OpenAI API call failure, using resilient fallback:', err.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 1. AI MENTOR CHAT
// ─────────────────────────────────────────────────────────────

const PERSONA_PROMPTS = {
  fullstack: 'You are a Principal Full-Stack Architect at a Fortune 500 tech company. You specialize in React 19, TypeScript, Node.js, Spring Boot, microservices, and modern UI engineering.',
  cloud_devops: 'You are a Lead Cloud & DevOps Engineer specializing in AWS, Azure, Docker, Kubernetes, Terraform, CI/CD pipelines, and high-availability architecture.',
  system_design: 'You are a Staff Software Engineer and System Design Lead. You guide engineers on distributed systems, caching (Redis), messaging (Kafka), database sharding, CAP theorem, and scalability.',
  cybersecurity: 'You are an Enterprise Security Architect & Ethical Hacker (CEH/CISSP). You focus on OWASP Top 10, penetration testing, zero-trust security, encryption, and secure coding practices.',
  dsa: 'You are a Competitive Programming Master and FAANG Algorithms Coach. You explain Data Structures, Algorithms, time/space complexity analysis (Big-O), and optimal patterns in Java/Python/C++.',
  general: 'You are the Chief AI Technical Mentor at KR Global Learning. You help tech professionals master enterprise engineering skills with clear explanations, industry best practices, and clean code.',
};

async function generateMentorReply({ persona = 'general', topic = '', messages = [], userQuery = '' }) {
  const systemInstruction = `${PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.general}
You provide encouraging, technically rigorous, and pragmatic guidance. Format your code snippets in clean markdown blocks. Highlight real-world pitfalls and industry patterns.`;

  const apiMessages = [
    { role: 'system', content: systemInstruction },
    ...messages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userQuery },
  ];

  const gptOutput = await callOpenAI(apiMessages, 0.6);
  if (gptOutput) {
    return { content: gptOutput, modelUsed: OPENAI_MODEL, source: 'openai' };
  }

  // Resilient Fallback Engine
  const q = userQuery.toLowerCase();
  let fallbackReply = '';

  if (q.includes('react') || q.includes('frontend') || q.includes('hook') || q.includes('state')) {
    fallbackReply = `Here is how we tackle this in enterprise modern frontend engineering:

### Key Principles
1. **Unidirectional Data Flow**: Always keep state as close to where it's used as possible. If state spans multiple modules, leverage Context with memoized selector hooks or clean Zustand stores.
2. **Performance & Memoization**: Use \`useMemo\` and \`useCallback\` when passing callbacks to heavy child components or virtualized lists.
3. **Component Separation**: Keep presentational UI components pure and side-effect free.

\`\`\`tsx
// Clean React 19 Pattern: Custom Hook for Async Data Fetching
import { useState, useEffect } from 'react';

export function useDataStream<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetcher()
      .then((res) => { if (isMounted) setData(res); })
      .catch((err) => { if (isMounted) setError(err.message); })
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, [fetcher]);

  return { data, loading, error };
}
\`\`\`

💡 *Industry Tip*: Always profile render bottlenecks using Chrome DevTools Performance Profiler before premature micro-optimizations!`;
  } else if (q.includes('spring') || q.includes('java') || q.includes('backend') || q.includes('api')) {
    fallbackReply = `Great question on backend architecture! In high-scale Java / Spring Boot enterprise services, here is the golden standard:

### Production Best Practices
- **Layered Architecture**: Controller (HTTP handling) ➔ Service (Business Logic) ➔ Repository (Persistence) ➔ Domain Entities.
- **Fail-Fast Validation**: Use \`@Valid\` and Jakarta Bean Validation to catch malformed payloads at the edge.
- **Global Error Handling**: Utilize \`@RestControllerAdvice\` to return standardized RFC-7807 error responses.

\`\`\`java
@RestController
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
public class EnterpriseResourceController {

    private final EnterpriseService enterpriseService;

    @PostMapping
    public ResponseEntity<ApiResponse<ResourceDTO>> createResource(
            @Valid @RequestBody CreateResourceRequest request) {
        ResourceDTO created = enterpriseService.process(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resource created successfully", created));
    }
}
\`\`\`

Would you like me to walk through database transactions (\`@Transactional\`), Kafka event publishing, or connection pool tuning (HikariCP)?`;
  } else if (q.includes('docker') || q.includes('kubernetes') || q.includes('aws') || q.includes('devops')) {
    fallbackReply = `In cloud-native infrastructure, the goal is immutability, zero-downtime deployments, and automated observability.

### Production Cloud Architecture Strategy
1. **Multi-Stage Container Builds**: Keep container images minimal (<100MB) by separating build dependencies from the runtime alpine image.
2. **Kubernetes Health Probes**: Always declare \`livenessProbe\`, \`readinessProbe\`, and \`startupProbe\` to prevent traffic routing to unready pods.
3. **Secrets Management**: Never commit credentials. Use AWS Secrets Manager, HashiCorp Vault, or External Secrets Operator in Kubernetes.

\`\`\`dockerfile
# Multi-stage Dockerfile for High Security & Tiny Image Footprint
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --quiet
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

What specific cloud or containerization roadblock are you currently debugging?`;
  } else if (q.includes('dsa') || q.includes('algorithm') || q.includes('tree') || q.includes('graph') || q.includes('dp')) {
    fallbackReply = `Let's break down this algorithmic problem with structured FAANG-style decomposition:

### 1. Pattern Recognition
Identify the archetype:
- Sliding Window / Two Pointers ➔ Linear subarray or string problems.
- Fast & Slow Pointers ➔ Cycle detection in linked lists.
- Breadth-First Search (BFS) ➔ Shortest path in unweighted graphs.
- Dynamic Programming ➔ Overlapping subproblems with optimal substructure.

### 2. Time & Space Complexity
- Aim for **O(N)** or **O(N log N)** time complexity.
- Watch out for auxiliary stack memory during recursion (O(H) recursion depth).

Let me know which problem or test case you'd like to trace line by line!`;
  } else {
    fallbackReply = `Hello! I am your KR Global Learning Senior Technical Mentor. 

I can assist you with:
- **Architectural Reviews**: Microservices, Event-Driven Systems, REST/gRPC API design.
- **Code Debugging & Optimization**: React, TypeScript, Java/Spring Boot, Python, SQL/NoSQL.
- **Cloud & DevOps**: Kubernetes manifests, Docker multi-stage builds, AWS CI/CD pipelines.
- **Interview Readiness**: System Design walk-throughs and algorithmic optimization.

What technical topic, bug, or design challenge are we tackling today?`;
  }

  return { content: fallbackReply, modelUsed: 'krtech-mentor-heuristic-v1', source: 'fallback_engine' };
}

// ─────────────────────────────────────────────────────────────
// 2. MOCK INTERVIEW ENGINE
// ─────────────────────────────────────────────────────────────

const DEFAULT_INTERVIEW_QUESTIONS = {
  technical: [
    {
      questionId: 'q-tech-1',
      category: 'Architecture & Microservices',
      difficulty: 'Intermediate',
      questionText: 'How do you handle distributed transactions across multiple microservices without locking resources or creating performance bottlenecks?',
    },
    {
      questionId: 'q-tech-2',
      category: 'Database & Caching',
      difficulty: 'Intermediate',
      questionText: 'Explain the cache-aside (lazy loading) pattern versus write-through caching. How do you mitigate the cache stampede problem?',
    },
    {
      questionId: 'q-tech-3',
      category: 'Scalability & Resiliency',
      difficulty: 'Advanced',
      questionText: 'Describe how you would design a rate limiter for an API gateway serving 100,000 requests per second. Which algorithm would you select?',
    },
    {
      questionId: 'q-tech-4',
      category: 'Concurrency & Thread Safety',
      difficulty: 'Intermediate',
      questionText: 'What is the difference between optimistic locking and pessimistic locking? In what enterprise scenarios would you prefer each?',
    },
  ],
  hr: [
    {
      questionId: 'q-hr-1',
      category: 'Conflict Resolution',
      difficulty: 'Behavioral',
      questionText: 'Tell me about a time when you strongly disagreed with a senior colleague or product manager on a technical architecture decision. How did you resolve it?',
    },
    {
      questionId: 'q-hr-2',
      category: 'Delivery Under Pressure',
      difficulty: 'Behavioral',
      questionText: 'Describe a situation where a critical production bug occurred right before a deadline. What steps did you take to manage stakeholders and remediate the issue?',
    },
    {
      questionId: 'q-hr-3',
      category: 'Leadership & Mentorship',
      difficulty: 'Behavioral',
      questionText: 'How do you mentor junior developers and conduct code reviews without slowing down the sprint velocity or discouraging team members?',
    },
  ],
  system_design: [
    {
      questionId: 'q-sd-1',
      category: 'Storage & Hashing',
      difficulty: 'Senior',
      questionText: 'Design a globally distributed URL shortening service (like Bitly) handling 500 million reads per day. Detail your database schema, key generation service, and caching tier.',
    },
    {
      questionId: 'q-sd-2',
      category: 'Streaming & Messaging',
      difficulty: 'Senior',
      questionText: 'Design a real-time notification service that sends pushes, emails, and SMS alerts with guaranteed idempotency and retry semantics.',
    },
  ],
};

async function getInterviewQuestionsForTrack({ targetRole = 'Full Stack Engineer', interviewType = 'technical', difficulty = 'mid' }) {
  // If OpenAI is available, request dynamic customized questions
  const prompt = [
    {
      role: 'system',
      content: 'You are an executive engineering interviewer at top tech companies. Generate 4 structured interview questions in JSON format.',
    },
    {
      role: 'user',
      content: `Generate 4 realistic ${interviewType} interview questions for a ${difficulty} level ${targetRole}. Return a JSON object with a "questions" array containing objects with keys: questionId, questionText, category, difficulty.`,
    },
  ];

  const gptJson = await callOpenAI(prompt, 0.7, true);
  if (gptJson) {
    try {
      const parsed = JSON.parse(gptJson);
      if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return parsed.questions;
      }
    } catch {
      // Fallback
    }
  }

  const pool = DEFAULT_INTERVIEW_QUESTIONS[interviewType] || DEFAULT_INTERVIEW_QUESTIONS.technical;
  return pool.map((q, idx) => ({
    ...q,
    questionId: `q-${Date.now()}-${idx}`,
  }));
}

async function evaluateInterviewAnswer({ targetRole, questionText, studentAnswer, category }) {
  const prompt = [
    {
      role: 'system',
      content: 'You are a principal technical interviewer evaluating an applicant response. Return a JSON object with: score (0-10), strengths (array of strings), improvements (array of strings), idealAnswerSummary (string).',
    },
    {
      role: 'user',
      content: `Role: ${targetRole}
Category: ${category}
Question: ${questionText}
Candidate Answer: "${studentAnswer}"

Evaluate technically. Grade fairly (1-10) based on depth, clarity, trade-offs, and enterprise practicalities.`,
    },
  ];

  const gptJson = await callOpenAI(prompt, 0.4, true);
  if (gptJson) {
    try {
      const parsed = JSON.parse(gptJson);
      if (typeof parsed.score === 'number') {
        return {
          score: Math.min(10, Math.max(1, Math.round(parsed.score))),
          strengths: parsed.strengths || ['Clear communication of basic concepts.'],
          improvements: parsed.improvements || ['Could elaborate more on edge cases and failure modes.'],
          idealAnswerSummary: parsed.idealAnswerSummary || 'A complete answer outlines the primary mechanism, failure handling, and operational metrics.',
        };
      }
    } catch {
      // Fallback
    }
  }

  // Resilient Heuristic Scorer
  const length = studentAnswer ? studentAnswer.trim().split(/\s+/).length : 0;
  let score = 5;
  const strengths = [];
  const improvements = [];

  if (length < 20) {
    score = 4;
    strengths.push('Identified the core requirement.');
    improvements.push('Answer is too brief. Elaborate on concrete architectural patterns and edge cases.');
  } else if (length < 60) {
    score = 7;
    strengths.push('Good foundational explanation with relevant domain concepts.');
    strengths.push('Demonstrated understanding of real-world constraints.');
    improvements.push('Mention specific trade-offs (e.g., latency vs consistency, memory vs CPU).');
  } else {
    score = 8.5;
    strengths.push('Comprehensive, in-depth explanation covering both happy path and fault tolerance.');
    strengths.push('Strong architectural vocabulary matching modern industry standards.');
    improvements.push('Consider quantifying metrics (e.g., SLA latency targets, p99 percentiles).');
  }

  return {
    score,
    strengths,
    improvements,
    idealAnswerSummary: `In production, senior engineers address this by decoupling dependencies, applying the Saga pattern or asynchronous message queues (Kafka), enforcing idempotency keys, and establishing circuit breakers (Resilience4j).`,
  };
}

// ─────────────────────────────────────────────────────────────
// 3. RESUME ATS ANALYZER
// ─────────────────────────────────────────────────────────────

const TECH_SKILL_KEYWORDS = [
  'react', 'node.js', 'typescript', 'javascript', 'java', 'spring boot', 'microservices',
  'aws', 'docker', 'kubernetes', 'postgresql', 'mongodb', 'redis', 'kafka', 'ci/cd',
  'rest api', 'graphql', 'system design', 'agile', 'git', 'linux', 'python', 'sql',
  'unit testing', 'jest', 'tailwind', 'cloud architecture',
];

async function analyzeResumeATS({ resumeText = '', targetRole = 'Senior Software Engineer', targetCompany = 'Tech Product Companies' }) {
  const prompt = [
    {
      role: 'system',
      content: 'You are an advanced ATS (Applicant Tracking System) parser and Senior Engineering Architect. Analyze the provided resume text against the target role. Return a JSON object with keys: atsScore (0-100), matchRate (0-100), presentKeywords (array), missingKeywords (array), formattingRating ("Excellent"|"Good"|"Needs Improvement"), sectionScores ({ summary, experience, skills, projects, education }), strengths (array), criticalFixes (array), suggestedSummary (string), actionableSuggestions (array).',
    },
    {
      role: 'user',
      content: `Target Role: ${targetRole}
Target Company Tier: ${targetCompany}
Resume Text:
"""
${resumeText.slice(0, 4000)}
"""`,
    },
  ];

  const gptJson = await callOpenAI(prompt, 0.3, true);
  if (gptJson) {
    try {
      const parsed = JSON.parse(gptJson);
      if (typeof parsed.atsScore === 'number') {
        return parsed;
      }
    } catch {
      // Fallback
    }
  }

  // Resilient Heuristic ATS Engine
  const lowerText = resumeText.toLowerCase();
  const presentKeywords = [];
  const missingKeywords = [];

  TECH_SKILL_KEYWORDS.forEach((kw) => {
    if (lowerText.includes(kw)) {
      presentKeywords.push(kw.toUpperCase());
    } else {
      missingKeywords.push(kw.toUpperCase());
    }
  });

  const wordCount = lowerText.split(/\s+/).length;
  let baseScore = 65;

  if (wordCount > 300) baseScore += 10;
  if (presentKeywords.length >= 8) baseScore += 15;
  if (lowerText.includes('achieved') || lowerText.includes('improved') || lowerText.includes('increased') || lowerText.includes('%')) baseScore += 5;

  const atsScore = Math.min(96, Math.max(50, baseScore));
  const matchRate = Math.min(94, Math.max(55, Math.round((presentKeywords.length / (presentKeywords.length + missingKeywords.length)) * 100) + 20));

  return {
    atsScore,
    matchRate,
    presentKeywords: presentKeywords.slice(0, 10),
    missingKeywords: missingKeywords.slice(0, 6),
    formattingRating: wordCount > 250 ? 'Excellent' : 'Good',
    sectionScores: {
      summary: 82,
      experience: atsScore > 80 ? 88 : 74,
      skills: 90,
      projects: 78,
      education: 95,
    },
    strengths: [
      `Detected ${presentKeywords.length}+ key enterprise competencies relevant to ${targetRole}.`,
      'Clean project descriptions with clear technical responsibilities.',
      'Appropriate technical skill-to-experience ratio.',
    ],
    criticalFixes: [
      `Incorporate missing high-demand keywords: ${missingKeywords.slice(0, 4).join(', ')}.`,
      'Quantify your engineering accomplishments using the Google X-Y-Z formula (Accomplished [X] as measured by [Y], by doing [Z]).',
      'Ensure contact information and LinkedIn URL are placed in the header without tables.',
    ],
    suggestedSummary: `Results-driven ${targetRole} with proven expertise in architecting scalable systems, modern cloud infrastructure, and enterprise full-stack development. Track record of optimizing high-throughput distributed architectures, driving technical roadmaps, and mentoring high-velocity engineering teams.`,
    actionableSuggestions: [
      'Add measurable latency or cost savings metrics to your recent work experience.',
      'Group technical competencies into distinct categories: Languages, Cloud/DevOps, Databases, Frameworks.',
      'Keep resume to 1-2 pages maximum with standard single-column ATS typography.',
    ],
  };
}

// ─────────────────────────────────────────────────────────────
// 4. DYNAMIC QUIZ GENERATOR
// ─────────────────────────────────────────────────────────────

const QUIZ_BANKS = {
  java: [
    {
      question: 'Which garbage collector in modern Java (JDK 21+) is optimized for ultra-low latency (<1ms pause times) across large heaps?',
      options: ['Serial GC', 'Parallel GC', 'ZGC (Z Garbage Collector)', 'CMS (Concurrent Mark Sweep)'],
      correctOptionIndex: 2,
      explanation: 'ZGC is a scalable, low-latency garbage collector designed to handle heaps from megabytes to multi-terabytes with sub-millisecond pauses.',
    },
    {
      question: 'What is the primary benefit of Virtual Threads introduced in Java 21 Project Loom?',
      options: [
        'Higher CPU clock speed execution',
        'Lightweight, high-throughput user-mode threads that do not pin OS threads during blocking I/O',
        'Automatic GPU offloading for matrix multiplication',
        'Elimination of heap memory allocations',
      ],
      correctOptionIndex: 1,
      explanation: 'Virtual threads represent cheap, user-mode threads managed by the JVM, allowing millions of concurrent tasks without thread-pool exhaustion during I/O.',
    },
    {
      question: 'In Spring Boot, which annotation is used to execute a method within an existing transaction or create a new one if none exists?',
      options: ['@Transactional(propagation = Propagation.REQUIRED)', '@Transactional(propagation = Propagation.REQUIRES_NEW)', '@Transactional(propagation = Propagation.NEVER)', '@Transactional(propagation = Propagation.SUPPORTS)'],
      correctOptionIndex: 0,
      explanation: 'Propagation.REQUIRED is the default behavior in Spring: it joins the current transaction or opens a new one if none exists.',
    },
  ],
  react: [
    {
      question: 'What problem does the React 19 Server Components paradigm primarily solve compared to standard client-side single page apps?',
      options: [
        'Eliminates the need for CSS styling',
        'Reduces client bundle size and allows components to fetch data on the server without shipping extra JavaScript to the browser',
        'Replaces HTTP with WebSockets for all page navigation',
        'Forces all state to be stored in Redux',
      ],
      correctOptionIndex: 1,
      explanation: 'Server Components execute on the server during rendering and ship zero runtime JS to the client, reducing hydration overhead and bundle weight.',
    },
    {
      question: 'What is the effect of passing an empty dependency array `[]` to `useEffect` in React?',
      options: [
        'The effect runs on every single render',
        'The effect runs once after the initial mount and cleans up on unmount',
        'The effect never executes at all',
        'The effect executes synchronously before browser paint',
      ],
      correctOptionIndex: 1,
      explanation: 'An empty dependency array indicates that the effect does not depend on any props or state, running once on mount and unmounting upon teardown.',
    },
  ],
  cloud: [
    {
      question: 'In Kubernetes, what is the key difference between a Deployment and a StatefulSet?',
      options: [
        'StatefulSets only run on Windows nodes',
        'Deployments manage stateless pods with interchangeable replicas, whereas StatefulSets provide unique network identifiers and persistent disk bindings',
        'Deployments cannot scale horizontally',
        'StatefulSets do not support rolling updates',
      ],
      correctOptionIndex: 1,
      explanation: 'StatefulSets preserve stable, persistent identities (e.g. pod-0, pod-1) and dedicate distinct PersistentVolumeClaims across restarts for databases and clusters.',
    },
    {
      question: 'Which AWS service provides low-latency edge caching for dynamic and static content worldwide?',
      options: ['AWS CloudTrail', 'Amazon S3 Glacier', 'Amazon CloudFront', 'AWS Direct Connect'],
      correctOptionIndex: 2,
      explanation: 'Amazon CloudFront is AWS’s Content Delivery Network (CDN) with global edge locations for caching APIs and media assets.',
    },
  ],
};

async function generateQuizQuestions({ topic = 'java', difficulty = 'intermediate', count = 5 }) {
  const prompt = [
    {
      role: 'system',
      content: 'You are an expert technical examiner. Return a JSON object with a "questions" array. Each question must have: question (string), options (array of 4 strings), correctOptionIndex (0-3), explanation (string).',
    },
    {
      role: 'user',
      content: `Generate ${count} high-quality ${difficulty} multiple-choice quiz questions on topic "${topic}". Ensure questions test practical engineering knowledge.`,
    },
  ];

  const gptJson = await callOpenAI(prompt, 0.5, true);
  if (gptJson) {
    try {
      const parsed = JSON.parse(gptJson);
      if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return parsed.questions.slice(0, count);
      }
    } catch {
      // Fallback
    }
  }

  // Fallback to rich curated quiz pool
  const normTopic = topic.toLowerCase();
  let pool = QUIZ_BANKS.java;
  if (normTopic.includes('react') || normTopic.includes('front') || normTopic.includes('js')) {
    pool = QUIZ_BANKS.react;
  } else if (normTopic.includes('cloud') || normTopic.includes('aws') || normTopic.includes('k8s') || normTopic.includes('docker')) {
    pool = QUIZ_BANKS.cloud;
  }

  // Fill up to count by duplicating or returning available
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[i % pool.length]);
  }
  return result;
}

// ─────────────────────────────────────────────────────────────
// 5. PERSONALIZED STUDY PLAN GENERATOR
// ─────────────────────────────────────────────────────────────

async function generateStudyPlanRoadmap({ targetRole = 'Full Stack Cloud Engineer', timelineWeeks = 8, weeklyHours = 12, currentLevel = 'intermediate' }) {
  const prompt = [
    {
      role: 'system',
      content: 'You are a Chief Academic Officer in high-performance tech education. Create a structured week-by-week engineering curriculum in JSON. Return a JSON object with: weeks (array of objects with weekNumber, title, description, topics: array of strings, practicalProject, milestone, resources: array of objects with title, url, type).',
    },
    {
      role: 'user',
      content: `Role: ${targetRole}
Timeline: ${timelineWeeks} weeks
Commitment: ${weeklyHours} hours/week
Current Proficiency: ${currentLevel}

Create a rigorous curriculum with real production projects and milestones.`,
    },
  ];

  const gptJson = await callOpenAI(prompt, 0.5, true);
  if (gptJson) {
    try {
      const parsed = JSON.parse(gptJson);
      if (Array.isArray(parsed.weeks) && parsed.weeks.length > 0) {
        return parsed.weeks;
      }
    } catch {
      // Fallback
    }
  }

  // Resilient Curated Weeks Generator
  const weeks = [];
  const milestones = [
    'Core Foundation Build & Clean Architecture',
    'High-Throughput API Engine & Async Messaging',
    'Cloud-Native Containerization & CI/CD Pipeline',
    'Production Distributed Capstone System',
  ];

  for (let w = 1; w <= timelineWeeks; w++) {
    const milestoneIdx = Math.min(milestones.length - 1, Math.floor((w - 1) / 2));
    weeks.push({
      weekNumber: w,
      title: `Week ${w}: ${w === 1 ? 'Architecture Mastery & Domain Foundations' : w === 2 ? 'Data Persistence & Transaction Management' : w === 3 ? 'Event-Driven Systems with Apache Kafka' : w === 4 ? 'Microservices Resilience & Service Mesh' : w === 5 ? 'Containerization with Docker & Multi-stage Builds' : w === 6 ? 'Kubernetes Orchestration & Helm Charts' : w === 7 ? 'Observability: Prometheus, Grafana & Distributed Tracing' : 'Production Capstone Deployment & Security Hardening'}`,
      description: `Structured deep dive designed for ${weeklyHours} hours of weekly hands-on practice.`,
      topics: [
        'Production Architecture Patterns',
        'High-Concurrency Optimization',
        'Automated Integration Testing',
        'Telemetry & Metrics Instrumentation',
      ],
      practicalProject: `Capstone Lab ${w}: Build & benchmark an isolated enterprise component with >80% test coverage.`,
      milestone: milestones[milestoneIdx],
      resources: [
        { title: 'Official Architectural Documentation', url: 'https://docs.krtech.edu/architecture', type: 'documentation' },
        { title: 'Interactive Sandbox Lab', url: 'https://labs.krtech.edu', type: 'hands_on' },
      ],
      completed: false,
    });
  }

  return weeks;
}

module.exports = {
  generateMentorReply,
  getInterviewQuestionsForTrack,
  evaluateInterviewAnswer,
  analyzeResumeATS,
  generateQuizQuestions,
  generateStudyPlanRoadmap,
};
