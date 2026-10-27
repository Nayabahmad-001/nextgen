export type UserRole = 'recruiter' | 'candidate' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
  organization?: string;
  department?: string;
  phone?: string;
  education?: string;
  skills?: string[];
  experienceLevel?: string;
  targetRole?: string;
  createdAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';
  experienceRequired: string;
  salaryRange: string;
  requiredSkills: string[];
  preferredSkills: string[];
  education: string;
  description: string;
  openings: number;
  status: 'active' | 'closed' | 'draft';
  postedDate: string;
  recruiterId: string;
  applicationsCount?: number;
}

export interface MatchBreakdown {
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  keywordMatch: number;
  overallMatch: number;
}

export interface AIResumeAnalysisResult {
  candidateName: string;
  email?: string;
  phone?: string;
  overallScore: number;
  matchScore: number;
  breakdown: MatchBreakdown;
  extractedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  education: string;
  experienceSummary: string;
  certifications: string[];
  projects: string[];
  recommendation: 'Highly Recommended' | 'Recommended' | 'Consider with Upskilling' | 'Not Recommended';
  fairnessExplanation: string;
  suggestedInterviewQuestions?: string[];
  resumeQualityScore?: {
    impact: number;
    keywords: number;
    structure: number;
    technicalDepth: number;
  };
  improvementSuggestions?: string[];
}

export interface CandidateApplication {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  appliedDate: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  matchScore: number;
  matchBreakdown?: MatchBreakdown;
  extractedSkills: string[];
  missingSkills: string[];
  strengths?: string[];
  recommendation: 'Highly Recommended' | 'Recommended' | 'Consider with Upskilling' | 'Not Recommended';
  resumeUrl?: string;
  resumeText?: string;
  education: string;
  experience?: string;
  experienceYears?: string;
  notes?: string;
  recruiterFeedback?: string;
}

export interface InterviewSchedule {
  id: string;
  applicationId?: string;
  candidateId: string;
  candidateName: string;
  candidateEmail?: string;
  jobId: string;
  jobTitle: string;
  recruiterId: string;
  recruiterName?: string;
  date: string;
  time: string;
  durationMinutes?: number;
  duration?: string;
  interviewType?: 'Technical' | 'HR Round' | 'Live Coding' | 'System Design' | 'Behavioral';
  type?: string;
  meetingLink: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  suggestedQuestions?: string[];
  questionsSuggested?: string[];
}

export interface RecommendedSkill {
  id: string;
  name: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  reason: string;
  marketDemand: string;
  estimatedHours: number;
}

export interface SkillProgressItem {
  id: string;
  skillName: string;
  status: 'Not Started' | 'Learning' | 'Completed';
  progressPercentage: number;
  targetRole: string;
  lastUpdated: string;
}

export interface RoadmapMilestone {
  title: string;
  description: string;
  skill: string;
  completed: boolean;
  resourceLink: string;
}

export interface RoadmapStage {
  stageNumber: number;
  title: string;
  description: string;
  duration: string;
  milestones: RoadmapMilestone[];
}

export interface LearningRoadmap {
  id: string;
  userId: string;
  targetRole: string;
  matchScore: number;
  requiredSkills: string[];
  acquiredSkills: string[];
  missingSkills: string[];
  stages: RoadmapStage[];
  updatedAt: string;
}

export interface RoadmapStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  topics: string[];
  status: 'completed' | 'in-progress' | 'upcoming';
  estimatedWeeks: string;
  learningResources: {
    title: string;
    type: 'Course' | 'Documentation' | 'Practice' | 'Video';
    link: string;
  }[];
}

export interface RecommendedProject {
  id: string;
  title: string;
  missingSkillTargeted?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tools?: string[];
  techStack: string[];
  skillsRequired?: string[];
  estimatedHours?: string;
  estimatedTime: string;
  description: string;
  deliverables: string[];
  keyDeliverables?: string[];
  githubTemplateUrl?: string;
  starterGithubTemplate?: string;
}

export interface CareerMatchRecommendation {
  roleTitle: string;
  matchPercentage: number;
  isBestMatch: boolean;
  reason: string;
  transferableSkills: string[];
  topCompaniesHiring: string[];
  averageSalary: string;
}

export interface TrendingSkillItem {
  skill: string;
  roleCategory: string;
  growthRate: string;
  jobOpeningsCount: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  tag: 'Trending' | 'High Demand' | 'Emerging' | 'Essential';
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'application' | 'screening' | 'shortlist' | 'interview' | 'learning' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface ChatQuickAction {
  label: string;
  actionType: 'navigate' | 'ask' | 'escalate';
  targetTab?: string;
  payload?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  isEscalationSuggestion?: boolean;
  escalationData?: {
    topic?: string;
    reason?: string;
    suggestedCategory?: SupportTicketCategory;
  };
  quickActions?: ChatQuickAction[];
}

export type SupportTicketCategory =
  | 'Resume Screening'
  | 'Job Application'
  | 'Learning Roadmap'
  | 'Interview Scheduling'
  | 'Technical Issue'
  | 'Other';

export type SupportTicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type SupportTicketStatus = 'Open' | 'In Review' | 'Resolved';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  subject: string;
  description: string;
  status: SupportTicketStatus;
  createdAt: string;
  updatedAt?: string;
  conversationSnippet?: string[];
  agentNotes?: string;
}

// Mock Interview & Assessment Types
export type AptitudeCategory =
  | 'Quantitative Aptitude'
  | 'Logical & Analytical Reasoning'
  | 'Data Interpretation'
  | 'Verbal & Problem Solving';

export interface AptitudeQuestion {
  id: string;
  category: AptitudeCategory;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  formulaOrHint?: string;
  timeLimitSeconds?: number;
}

export interface CodingTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface CodingQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Arrays & Strings' | 'Data Manipulation & SQL' | 'Algorithms & Dynamic Programming' | 'Objects & Async Logic';
  targetRoles: string[];
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    javascript: string;
    typescript: string;
    python: string;
    sql?: string;
  };
  referenceSolution?: {
    javascript: string;
    typescript?: string;
    python?: string;
    sql?: string;
  };
  testCases: CodingTestCase[];
  solutionExplanation: string;
  optimalTimeComplexity: string;
  optimalSpaceComplexity: string;
  hints: string[];
}

export interface ConceptualQuestion {
  id: string;
  topic: string;
  targetRole: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  keyPointsExpected: string[];
  sampleIdealAnswer: string;
}

export interface MockInterviewTemplate {
  id: string;
  title: string;
  description: string;
  role: string;
  durationMinutes: number;
  aptitudeQuestionIds: string[];
  codingQuestionIds: string[];
  conceptualQuestionIds: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  skillsEvaluated: string[];
}

export interface MockInterviewAttempt {
  id: string;
  userId: string;
  candidateName: string;
  templateId: string;
  title: string;
  role: string;
  startedAt: string;
  completedAt: string;
  timeSpentSeconds: number;
  totalQuestions: number;
  aptitudeAnswers: { [questionId: string]: number }; // questionId -> selectedOption
  codingSubmissions: {
    [questionId: string]: {
      code: string;
      language: string;
      passedTests: number;
      totalTests: number;
      executionTimeMs?: number;
      isPassed: boolean;
      syntaxValid?: boolean;
    };
  };
  conceptualAnswers?: { [questionId: string]: string };
  score: {
    overall: number; // 0-100
    aptitudeScore: number; // 0-100
    codingScore: number; // 0-100
    conceptualScore?: number; // 0-100
    percentileRanking: number;
    aptitudeCorrectCount: number;
    aptitudeTotalCount: number;
    codingPassedCount: number;
    codingTotalCount: number;
  };
  aiEvaluation?: {
    strengths: string[];
    weaknesses: string[];
    recommendedRoadmapStage?: number;
    recommendedProjectIds?: string[];
    actionableFeedback: string;
    codeQualityReview?: string;
  };
}

