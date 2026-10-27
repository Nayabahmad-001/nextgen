import {
  User,
  JobPosting,
  CandidateApplication,
  InterviewSchedule,
  RecommendedSkill,
  SkillProgressItem,
  RoadmapStep,
  RecommendedProject,
  CareerMatchRecommendation,
  TrendingSkillItem,
  AppNotification,
  LearningRoadmap
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-rec-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@nexusai.com',
    role: 'recruiter',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    companyName: 'Nexus AI Labs',
    organization: 'Nexus Global Ventures',
    department: 'Talent Acquisition & Technical Recruiting',
    phone: '+1 (555) 839-2041',
    createdAt: '2025-11-01T10:00:00.000Z'
  },
  {
    id: 'user-cand-1',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@example.com',
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    education: 'B.Tech in Computer Science, IIT Delhi (CGPA 8.9/10)',
    skills: ['Python', 'SQL', 'Excel', 'Pandas', 'NumPy', 'Data Cleaning', 'Power BI', 'Git'],
    experienceLevel: 'Entry-Level / 1.5 Years Experience',
    targetRole: 'Data Analyst',
    createdAt: '2026-01-10T08:00:00.000Z'
  },
  {
    id: 'user-cand-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98111 22334',
    education: 'B.E in Information Technology, Anna University',
    skills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Docker'],
    experienceLevel: 'Mid-Level / 3 Years Experience',
    targetRole: 'Full Stack Developer',
    createdAt: '2026-01-12T09:30:00.000Z'
  },
  {
    id: 'user-cand-3',
    name: 'Arun Kumar',
    email: 'arun.kumar@example.com',
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 97234 56789',
    education: 'M.Tech in Artificial Intelligence, BITS Pilani',
    skills: ['Python', 'PyTorch', 'Scikit-Learn', 'TensorFlow', 'NLP', 'Computer Vision', 'FastAPI'],
    experienceLevel: '2 Years AI Research / ML Engineer',
    targetRole: 'AI/ML Engineer',
    createdAt: '2026-01-14T11:00:00.000Z'
  },
  {
    id: 'user-cand-4',
    name: 'Karthik Raja',
    email: 'karthik.raja@example.com',
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 94444 88776',
    education: 'B.Sc in Computer Science, Madras University',
    skills: ['HTML', 'CSS', 'JavaScript', 'Basic SQL', 'Python'],
    experienceLevel: 'Fresher / 2025 Graduate',
    targetRole: 'Software Developer',
    createdAt: '2026-01-18T14:00:00.000Z'
  },
  {
    id: 'user-rec-2',
    name: 'David Chen',
    email: 'david.chen@quantum.io',
    role: 'recruiter',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    companyName: 'Quantum Innovations',
    organization: 'Quantum Group',
    department: 'Engineering Hiring Team',
    phone: '+1 (555) 492-1188',
    createdAt: '2025-11-15T09:00:00.000Z'
  }
];

export const MOCK_USERS = INITIAL_USERS;

export const INITIAL_JOBS: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Senior Data Analyst (BI & Growth)',
    company: 'Nexus AI Labs',
    department: 'Data & Growth Analytics',
    location: 'San Francisco, CA (Hybrid / Remote Option)',
    jobType: 'Full-time',
    experienceRequired: '1-3 Years',
    salaryRange: '$95,000 - $130,000 / year',
    requiredSkills: ['SQL', 'Python', 'Power BI', 'Data Visualization', 'Pandas', 'Applied Statistics'],
    preferredSkills: ['Tableau', 'dbt', 'Snowflake', 'A/B Testing'],
    education: "Bachelor's or Master's in Computer Science, Data Science, Math or STEM",
    description: 'We are looking for a high-impact Data Analyst to drive product analytics, build executive Power BI KPI dashboards, and write advanced analytical SQL queries across multi-million row datasets.',
    openings: 3,
    status: 'active',
    postedDate: '2026-02-01T10:00:00.000Z',
    recruiterId: 'user-rec-1',
    applicationsCount: 18
  },
  {
    id: 'job-2',
    title: 'Full Stack Software Engineer',
    company: 'Quantum Innovations',
    department: 'Core Product Engineering',
    location: 'New York, NY (Hybrid)',
    jobType: 'Full-time',
    experienceRequired: '2-4 Years',
    salaryRange: '$120,000 - $155,000 / year',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs'],
    preferredSkills: ['GraphQL', 'Kubernetes', 'AWS', 'Tailwind CSS'],
    education: "Bachelor's in Computer Science or Equivalent Practical Experience",
    description: 'Build fast, responsive full-stack applications using React, TypeScript, Node.js, and PostgreSQL. Design clean API contracts and scale production microservices.',
    openings: 2,
    status: 'active',
    postedDate: '2026-02-05T12:30:00.000Z',
    recruiterId: 'user-rec-2',
    applicationsCount: 24
  },
  {
    id: 'job-3',
    title: 'AI / Machine Learning Engineer',
    company: 'Nexus AI Labs',
    department: 'Applied AI & LLM Systems',
    location: 'Remote (Worldwide)',
    jobType: 'Full-time',
    experienceRequired: '2-5 Years',
    salaryRange: '$140,000 - $185,000 / year',
    requiredSkills: ['Python', 'PyTorch', 'LLM Fine-Tuning', 'MLOps', 'FastAPI', 'Vector Databases'],
    preferredSkills: ['LangChain', 'TensorRT', 'CUDA', 'Docker'],
    education: "Master's or Ph.D. in Computer Science, AI, or equivalent engineering background",
    description: 'Lead the development of custom generative AI models, semantic search retrieval pipelines, and low-latency inference services.',
    openings: 1,
    status: 'active',
    postedDate: '2026-02-10T15:00:00.000Z',
    recruiterId: 'user-rec-1',
    applicationsCount: 12
  },
  {
    id: 'job-4',
    title: 'Cloud & DevOps Automation Engineer',
    company: 'CloudPulse Networks',
    department: 'Infrastructure & Site Reliability',
    location: 'Austin, TX (Remote)',
    jobType: 'Full-time',
    experienceRequired: '3+ Years',
    salaryRange: '$130,000 - $160,000 / year',
    requiredSkills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD Pipelines', 'Linux'],
    preferredSkills: ['Prometheus', 'Grafana', 'Go', 'Python Scripting'],
    education: "Bachelor's in Engineering or equivalent industry certifications",
    description: 'Architect resilient multi-region cloud infrastructures, automate zero-downtime CI/CD deployments, and monitor high-availability microservices.',
    openings: 2,
    status: 'active',
    postedDate: '2026-02-14T09:00:00.000Z',
    recruiterId: 'user-rec-2',
    applicationsCount: 9
  }
];

export const INITIAL_APPLICATIONS: CandidateApplication[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    candidateId: 'user-cand-1',
    candidateName: 'Rahul Kumar',
    candidateEmail: 'rahul.kumar@example.com',
    candidatePhone: '+91 98765 43210',
    appliedDate: '2026-02-08T14:30:00.000Z',
    status: 'Shortlisted',
    matchScore: 92,
    matchBreakdown: {
      skillsMatch: 95,
      experienceMatch: 90,
      educationMatch: 88,
      keywordMatch: 94,
      overallMatch: 92
    },
    extractedSkills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Excel', 'Data Cleaning', 'Power BI'],
    missingSkills: ['Tableau', 'dbt'],
    strengths: [
      'Exceptional SQL query optimization & data wrangling capabilities',
      'Strong academic pedigree with practical hands-on analytics projects',
      'High alignment with target BI & growth metrics objectives'
    ],
    recommendation: 'Highly Recommended',
    education: 'B.Tech in Computer Science, IIT Delhi (CGPA 8.9/10)',
    experience: '1.5 Years as Junior Analytics Associate at Fintech Startup',
    experienceYears: '1.5 Years',
    notes: 'Exceeded screening benchmark. Candidate demonstrated excellent grasp of window functions and automated ETL pipelines.'
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    candidateId: 'user-cand-2',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma@example.com',
    candidatePhone: '+91 98111 22334',
    appliedDate: '2026-02-09T10:15:00.000Z',
    status: 'Shortlisted',
    matchScore: 91,
    matchBreakdown: {
      skillsMatch: 93,
      experienceMatch: 92,
      educationMatch: 86,
      keywordMatch: 90,
      overallMatch: 91
    },
    extractedSkills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Docker', 'Tailwind CSS'],
    missingSkills: ['GraphQL', 'Kubernetes'],
    strengths: [
      'Strong React 19 / TypeScript architecture design patterns',
      'Proven experience building production full-stack REST microservices',
      'Clean documentation and active open-source contributions'
    ],
    recommendation: 'Highly Recommended',
    education: 'B.E in Information Technology, Anna University',
    experience: '3 Years Full Stack Developer at SaaS Venture',
    experienceYears: '3 Years',
    notes: 'Strong candidate for lead frontend/full-stack responsibilities.'
  },
  {
    id: 'app-3',
    jobId: 'job-3',
    candidateId: 'user-cand-3',
    candidateName: 'Arun Kumar',
    candidateEmail: 'arun.kumar@example.com',
    candidatePhone: '+91 97234 56789',
    appliedDate: '2026-02-12T16:00:00.000Z',
    status: 'Under Review',
    matchScore: 84,
    matchBreakdown: {
      skillsMatch: 88,
      experienceMatch: 80,
      educationMatch: 92,
      keywordMatch: 78,
      overallMatch: 84
    },
    extractedSkills: ['Python', 'PyTorch', 'Scikit-Learn', 'FastAPI', 'NLP', 'Computer Vision'],
    missingSkills: ['LLM Fine-Tuning', 'Vector Databases', 'TensorRT'],
    strengths: [
      'Deep theoretical grounding in machine learning algorithms & neural networks',
      'Solid PyTorch model training and evaluation experience'
    ],
    recommendation: 'Recommended',
    education: 'M.Tech in Artificial Intelligence, BITS Pilani',
    experience: '2 Years AI Research Fellow',
    experienceYears: '2 Years'
  },
  {
    id: 'app-4',
    jobId: 'job-1',
    candidateId: 'user-cand-4',
    candidateName: 'Karthik Raja',
    candidateEmail: 'karthik.raja@example.com',
    candidatePhone: '+91 94444 88776',
    appliedDate: '2026-02-15T09:45:00.000Z',
    status: 'Under Review',
    matchScore: 72,
    matchBreakdown: {
      skillsMatch: 70,
      experienceMatch: 65,
      educationMatch: 80,
      keywordMatch: 74,
      overallMatch: 72
    },
    extractedSkills: ['HTML', 'CSS', 'JavaScript', 'Basic SQL', 'Python'],
    missingSkills: ['Power BI', 'Applied Statistics', 'Pandas', 'Advanced SQL'],
    strengths: [
      'Enthusiastic entry-level graduate with solid programming fundamentals',
      'Fast learner with eagerness for BI dashboard upskilling'
    ],
    recommendation: 'Consider with Upskilling',
    education: 'B.Sc in Computer Science, Madras University',
    experience: 'Fresher / 2025 Graduate',
    experienceYears: 'Fresher'
  }
];

export const INITIAL_INTERVIEWS: InterviewSchedule[] = [
  {
    id: 'int-1',
    applicationId: 'app-1',
    candidateId: 'user-cand-1',
    candidateName: 'Rahul Kumar',
    candidateEmail: 'rahul.kumar@example.com',
    jobId: 'job-1',
    jobTitle: 'Senior Data Analyst (BI & Growth)',
    recruiterId: 'user-rec-1',
    recruiterName: 'Sarah Jenkins',
    date: '2026-02-26',
    time: '14:30 EST',
    durationMinutes: 45,
    duration: '45 min',
    interviewType: 'Technical',
    type: 'Technical',
    meetingLink: 'https://meet.google.com/nxt-hire-ai-1',
    status: 'Scheduled',
    notes: 'Focus on complex analytical SQL queries, Power BI DAX expressions, and data storytelling.',
    suggestedQuestions: [
      'Walk us through how you write a window function with rolling averages.',
      'How do you design a star schema data model in Power BI for multi-region sales reporting?',
      'Describe a scenario where you identified a subtle data anomaly that saved business cost.'
    ],
    questionsSuggested: [
      'Walk us through how you write a window function with rolling averages.',
      'How do you design a star schema data model in Power BI for multi-region sales reporting?',
      'Describe a scenario where you identified a subtle data anomaly that saved business cost.'
    ]
  },
  {
    id: 'int-2',
    applicationId: 'app-2',
    candidateId: 'user-cand-2',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma@example.com',
    jobId: 'job-2',
    jobTitle: 'Full Stack Software Engineer',
    recruiterId: 'user-rec-2',
    recruiterName: 'David Chen',
    date: '2026-02-27',
    time: '11:00 EST',
    durationMinutes: 60,
    duration: '60 min',
    interviewType: 'Live Coding',
    type: 'Live Coding',
    meetingLink: 'https://meet.google.com/nxt-hire-ai-2',
    status: 'Scheduled',
    notes: 'Live coding session assessing React state patterns and backend REST API concurrency handling.'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-rec-1',
    title: 'New High Match Application',
    message: 'Rahul Kumar applied for Senior Data Analyst with a 92% AI Match Score.',
    type: 'application',
    timestamp: '10 minutes ago',
    read: false
  },
  {
    id: 'notif-2',
    userId: 'user-cand-1',
    title: 'Interview Scheduled',
    message: 'Nexus AI Labs scheduled your Technical Interview for Feb 26 at 14:30 EST.',
    type: 'interview',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'notif-3',
    userId: 'user-cand-1',
    title: 'Learning Milestone Unlocked',
    message: 'You completed Stage 2: Data Modeling in your Data Analyst Roadmap! 🚀',
    type: 'learning',
    timestamp: '1 day ago',
    read: true
  }
];

export const DEFAULT_ROADMAPS: LearningRoadmap[] = [
  {
    id: 'roadmap-data-analyst',
    userId: 'user-cand-1',
    targetRole: 'Data Analyst',
    matchScore: 88,
    requiredSkills: ['Python', 'SQL', 'Power BI', 'Pandas', 'Tableau', 'Data Cleaning', 'Statistics', 'A/B Testing', 'Snowflake'],
    acquiredSkills: ['Python', 'SQL', 'Excel', 'Pandas', 'NumPy', 'Data Cleaning', 'Power BI', 'Git'],
    missingSkills: ['Tableau', 'Snowflake', 'dbt', 'A/B Testing'],
    stages: [
      {
        stageNumber: 1,
        title: 'Stage 1: Core Fundamentals & Prerequisite Tooling',
        description: 'Master analytical SQL querying, exploratory Python scripting, and relational data hygiene.',
        duration: '2-3 Weeks',
        milestones: [
          { title: 'Advanced SQL Querying & CTEs', description: 'Window functions (ROW_NUMBER, RANK, NTILE) and recursive Common Table Expressions.', skill: 'SQL', completed: true, resourceLink: 'https://sqlzoo.net' },
          { title: 'Python Data Manipulation with Pandas', description: 'Vectorized data cleaning, grouping, merges, and outlier detection routines.', skill: 'Pandas', completed: true, resourceLink: 'https://pandas.pydata.org/docs/' }
        ]
      },
      {
        stageNumber: 2,
        title: 'Stage 2: Intermediate Data Modeling & KPI Workflows',
        description: 'Design star schemas, build automated ETL workflows, and create interactive dashboards.',
        duration: '3-4 Weeks',
        milestones: [
          { title: 'Power BI & DAX Data Modeling', description: 'Star schema architecture, calculated measures, time intelligence DAX functions.', skill: 'Power BI', completed: true, resourceLink: 'https://learn.microsoft.com/en-us/power-bi/' },
          { title: 'Data Pipeline Automation with Python', description: 'Automate weekly spreadsheet ingestion into structured PostgreSQL databases.', skill: 'ETL Pipelines', completed: true, resourceLink: 'https://realpython.com' }
        ]
      },
      {
        stageNumber: 3,
        title: 'Stage 3: Cloud Warehousing & Modern Data Stack',
        description: 'Scale analytics workloads with modern cloud data warehouses like Snowflake and dbt modeling.',
        duration: '3 Weeks',
        milestones: [
          { title: 'Snowflake Data Warehouse Fundamentals', description: 'Virtual warehouses, zero-copy cloning, time travel queries, and micro-partitions.', skill: 'Snowflake', completed: false, resourceLink: 'https://docs.snowflake.com' },
          { title: 'Data Transformation with dbt (data build tool)', description: 'Write modular SQL transformation models with automated testing and documentation.', skill: 'dbt', completed: false, resourceLink: 'https://docs.getdbt.com' }
        ]
      },
      {
        stageNumber: 4,
        title: 'Stage 4: Applied Statistics & Experimentation',
        description: 'Implement rigorous statistical hypothesis testing, A/B experiment evaluation, and cohort retention modeling.',
        duration: '2 Weeks',
        milestones: [
          { title: 'A/B Testing & Hypothesis Testing', description: 'P-values, confidence intervals, sample size determination, and statistical power.', skill: 'A/B Testing', completed: false, resourceLink: 'https://online.stat.psu.edu' },
          { title: 'Cohort & Customer Lifetime Value (LTV) Analysis', description: 'Survival analysis modeling to uncover churn indicators across subscription cohorts.', skill: 'Cohort Analysis', completed: false, resourceLink: 'https://towardsdatascience.com' }
        ]
      },
      {
        stageNumber: 5,
        title: 'Stage 5: Capstone Portfolio Projects & Mock Technical Interviews',
        description: 'Polish real-world industry capstones, build interactive live demos, and practice recruiter technical deep dives.',
        duration: '2 Weeks',
        milestones: [
          { title: 'End-to-End E-Commerce Growth Analytics Capstone', description: 'Complete GitHub portfolio project with automated pipeline and executive dashboard.', skill: 'Portfolio', completed: false, resourceLink: 'https://github.com' },
          { title: 'Technical Screen Practice with NextGen AI Questions', description: 'Practice behavioral and technical live SQL questions with our AI prober.', skill: 'Interview Prep', completed: false, resourceLink: '#' }
        ]
      }
    ],
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_PROJECTS: RecommendedProject[] = [
  {
    id: 'proj-1',
    title: 'E-Commerce KPI & Cohort Intelligence Engine',
    difficulty: 'Intermediate',
    techStack: ['Python', 'SQL', 'Power BI', 'Pandas', 'PostgreSQL'],
    estimatedTime: '2-3 Weeks',
    description: 'Build an end-to-end business intelligence pipeline analyzing 1M+ retail transactions. Identify retention drop-offs and build an interactive executive dashboard.',
    deliverables: [
      'Automated ETL script cleaning messy transaction receipts',
      'Star-schema dimensional data model in PostgreSQL',
      'Interactive Power BI report with dynamic DAX metrics (CAC, LTV, Margin)',
      'Documented GitHub repository with architecture diagram'
    ],
    githubTemplateUrl: 'https://github.com'
  },
  {
    id: 'proj-2',
    title: 'Real-Time Financial Fraud & Anomaly Detector',
    difficulty: 'Advanced',
    techStack: ['Python', 'Snowflake', 'Scikit-Learn', 'FastAPI', 'Streamlit'],
    estimatedTime: '3-4 Weeks',
    description: 'Process streaming payment events, train an Isolation Forest anomaly classifier, and display flagged transactions on a live monitoring dashboard.',
    deliverables: [
      'Cloud warehouse ingestion schema in Snowflake',
      'Trained anomaly detection model with evaluation ROC curve',
      'FastAPI endpoint with sub-50ms inference latency',
      'Live interactive analyst dashboard'
    ],
    githubTemplateUrl: 'https://github.com'
  },
  {
    id: 'proj-3',
    title: 'SaaS Churn Prediction & Retention Playbook',
    difficulty: 'Intermediate',
    techStack: ['Python', 'Pandas', 'XGBoost', 'Tableau', 'Jupyter'],
    estimatedTime: '2 Weeks',
    description: 'Analyze subscription usage signals to predict which enterprise accounts are at risk of churning 60 days before contract renewal.',
    deliverables: [
      'Feature engineering pipeline extracting customer activity velocity',
      'XGBoost classification model with 89% precision',
      'Tableau customer health scorecard with alert triggers'
    ],
    githubTemplateUrl: 'https://github.com'
  }
];

export const SAMPLE_RESUMES_TEXT = {
  rahulKumar: `RAHUL KUMAR
Email: rahul.kumar@example.com | Phone: +91 98765 43210 | New Delhi, India
LinkedIn: linkedin.com/in/rahulkumar-data | GitHub: github.com/rahulkumar-dev

PROFESSIONAL SUMMARY
Analytical and detail-oriented Data Analyst with 1.5+ years of experience transforming complex datasets into actionable business intelligence. Proven track record in writing performant SQL queries, building automated Python data pipelines with Pandas, and designing interactive Power BI dashboards.

EDUCATION
Bachelor of Technology (B.Tech) in Computer Science & Engineering
Indian Institute of Technology (IIT) Delhi | CGPA: 8.9 / 10.0 (First Class with Distinction)
Relevant Coursework: Database Systems, Statistics & Probability, Data Structures, Applied Machine Learning

TECHNICAL SKILLS
- Languages & Querying: SQL (PostgreSQL, MySQL), Python (Pandas, NumPy, Matplotlib, Seaborn), Advanced Excel
- Business Intelligence: Power BI (DAX, Power Query, Data Modeling), Interactive KPI Dashboards
- Tools & Frameworks: Git, GitHub, Jupyter Notebook, REST APIs, Linux CLI, ETL Automation
- Analytical Techniques: Cohort Analysis, A/B Testing Analysis, Customer Segmentation, Data Cleaning

EXPERIENCE
Junior Analytics Associate | FinTech Dynamics (July 2024 – Present)
- Designed and automated weekly executive financial performance dashboards in Power BI, reducing manual reporting overhead by 14 hours per week.
- Authored complex SQL queries utilizing window functions, recursive CTEs, and indexed partition filters on 15M+ customer transaction records.
- Collaborated with growth marketing leads to measure customer acquisition cost (CAC) and lifetime value (LTV).

PROJECTS
1. Multi-Store Retail Sales & Inventory Forecasting Engine
- Engineered an end-to-end analytics pipeline in Python and SQL parsing 500k+ retail receipts.
- Visualized gross margins and supply chain bottlenecks with interactive drill-down filters in Power BI.
2. Customer Churn & Cohort Retention Analyzer
- Conducted survival cohort analysis on 40,000 SaaS subscribers using Python Pandas and Seaborn.
- Identified primary friction points during the 30-day onboarding window.

CERTIFICATIONS
- Google Data Analytics Professional Certificate
- Microsoft Certified: Power BI Data Analyst Associate (PL-300)`,

  priyaSharma: `PRIYA SHARMA
Email: priya.sharma@example.com | Phone: +91 98111 22334 | Bengaluru, India
Portfolio: priyasharma.dev | GitHub: github.com/priyasharma

PROFESSIONAL SUMMARY
Full Stack Software Engineer with 3 years of hands-on experience building scalable web applications, responsive user interfaces, and robust backend APIs. Proficient in React, TypeScript, Node.js, Express, Docker, and PostgreSQL.

EDUCATION
B.E. in Information Technology | Anna University, Chennai | GPA: 8.7/10

TECHNICAL SKILLS
- Frontend: React, TypeScript, Next.js, Redux Toolkit, Tailwind CSS, HTML5/CSS3, Webpack/Vite
- Backend: Node.js, Express, REST APIs, GraphQL, PostgreSQL, MongoDB, Prisma ORM
- DevOps & Cloud: Docker, Git/GitHub, CI/CD Actions, AWS (S3, EC2), Jest, Playwright

PROFESSIONAL EXPERIENCE
Full Stack Developer | CloudScale Solutions (2023 - Present)
- Developed enterprise client-facing portals in React and TypeScript serving 120,000 monthly active users.
- Designed high-throughput RESTful microservices in Node.js with connection pooling in PostgreSQL.
- Reduced frontend bundle payload by 42% through lazy loading, code-splitting, and memoization.`,

  arunKumar: `ARUN KUMAR
Email: arun.kumar@example.com | Phone: +91 97234 56789 | Hyderabad, India
Google Scholar: scholar.google.com/citations?user=arunkumar | GitHub: github.com/arunkumar-ai

PROFESSIONAL SUMMARY
AI/ML Engineer and researcher with deep specialization in deep learning, natural language processing, and neural model fine-tuning. Experienced in training PyTorch models, deploying low-latency FastAPI inference servers, and optimizing embeddings.

EDUCATION
Master of Technology (M.Tech) in Artificial Intelligence | BITS Pilani | CGPA: 9.1/10
B.Tech in Computer Science | Osmania University

TECHNICAL SKILLS
- AI / ML: Python, PyTorch, TensorFlow, Scikit-Learn, HuggingFace Transformers, OpenCV, NumPy
- Backend & Deployment: FastAPI, Docker, ONNX Runtime, CUDA, Git, Linux
- Data & Architecture: Vector Databases, Data Preprocessing, Metric Learning, Transfer Learning`
};

export const INITIAL_SUPPORT_TICKETS = [
  {
    id: 'TICK-10824',
    userId: 'user-cand-1',
    userName: 'Rahul Kumar',
    userEmail: 'rahul.kumar@example.com',
    userRole: 'candidate' as const,
    category: 'Interview Scheduling' as const,
    priority: 'High' as const,
    subject: 'Google Meet link verification for Technical Round',
    description: 'Received interview invite for Senior Data Analyst role on Oct 24th at 2:00 PM. Wanted to confirm if screen-sharing code environment will be provided in Meet or should I prepare local VS Code.',
    status: 'In Review' as const,
    createdAt: '2025-10-21T14:30:00Z',
    updatedAt: '2025-10-21T15:15:00Z',
    conversationSnippet: [
      'Rahul: Inquiring about IDE requirements for interview.',
      'Support Agent (Sarah M.): Noted! Both browser coderpad and local VS Code are permitted. Recruiter Sarah Jenkins has been notified.'
    ],
    agentNotes: 'Escalated via NextGen AI Concierge and verified by Talent Operations.'
  },
  {
    id: 'TICK-10819',
    userId: 'user-cand-1',
    userName: 'Rahul Kumar',
    userEmail: 'rahul.kumar@example.com',
    userRole: 'candidate' as const,
    category: 'Resume Screening' as const,
    priority: 'Medium' as const,
    subject: 'Inquiry regarding Snowflake skill weight in Senior Data Analyst screening',
    description: 'My resume contains extensive BigQuery experience. I wanted to ask how the AI weights alternative cloud data warehouses against Snowflake in the match score calculation.',
    status: 'Resolved' as const,
    createdAt: '2025-10-18T10:00:00Z',
    updatedAt: '2025-10-18T11:45:00Z',
    conversationSnippet: [
      'Rahul: Snowflake vs BigQuery transferability question.',
      'Support Agent (David K.): Our semantic matching maps BigQuery and Snowflake with high semantic transferability (92%), giving partial credit in Stage 3 data stack evaluation.'
    ],
    agentNotes: 'Resolved with algorithmic clarification.'
  }
];

