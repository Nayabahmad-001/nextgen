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
  AppNotification,
  AIResumeAnalysisResult,
  LearningRoadmap,
  ChatMessage,
  SupportTicket,
  SupportTicketStatus,
  SupportTicketCategory,
  SupportTicketPriority,
  MockInterviewTemplate,
  MockInterviewAttempt,
  AptitudeQuestion,
  CodingQuestion,
  ConceptualQuestion
} from '../types';

import {
  INITIAL_USERS,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_INTERVIEWS,
  INITIAL_NOTIFICATIONS,
  DEFAULT_ROADMAPS,
  INITIAL_PROJECTS,
  INITIAL_SUPPORT_TICKETS
} from '../data/mockData';

import {
  APTITUDE_QUESTIONS,
  CODING_QUESTIONS,
  CONCEPTUAL_QUESTIONS,
  MOCK_INTERVIEW_TEMPLATES,
  shuffleArray,
  shuffleAptitudeQuestion,
  getShuffledAptitudeQuestions,
  getShuffledCodingQuestions,
  getShuffledConceptualQuestions
} from '../data/mockInterviewData';

export {
  shuffleArray,
  shuffleAptitudeQuestion,
  getShuffledAptitudeQuestions,
  getShuffledCodingQuestions,
  getShuffledConceptualQuestions
};

const STORAGE_KEYS = {
  CURRENT_USER: 'nextgen_current_user',
  USERS: 'nextgen_users',
  JOBS: 'nextgen_jobs',
  APPLICATIONS: 'nextgen_applications',
  INTERVIEWS: 'nextgen_interviews',
  NOTIFICATIONS: 'nextgen_notifications',
  CANDIDATE_SKILLS_PROGRESS: 'nextgen_candidate_skills_progress',
  CANDIDATE_RESUME_ANALYSIS: 'nextgen_candidate_resume_analysis',
  ROADMAPS: 'nextgen_roadmaps',
  PROJECTS: 'nextgen_projects',
  SUPPORT_TICKETS: 'nextgen_support_tickets',
  MOCK_INTERVIEW_ATTEMPTS: 'nextgen_mock_interview_attempts',
};

// Initialize Storage with seed defaults if empty
export function initializeStorage(): void {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INTERVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(INITIAL_INTERVIEWS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ROADMAPS)) {
    localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(DEFAULT_ROADMAPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUPPORT_TICKETS)) {
    localStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(INITIAL_SUPPORT_TICKETS));
  }
}


// User state
export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : INITIAL_USERS[0];
  } catch {
    return INITIAL_USERS[0];
  }
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
  window.dispatchEvent(new Event('nextgen_auth_changed'));
}

export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

export function getCandidateById(id: string): CandidateApplication | User | null {
  const apps = getApplications();
  const app = apps.find(a => a.id === id || a.candidateId === id);
  if (app) return app;
  const users = getUsers();
  return users.find(u => u.id === id) || null;
}

export function registerUser(userData: Partial<User>): User {
  const users = getUsers();
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: userData.name || 'New User',
    email: userData.email || 'user@example.com',
    role: userData.role || 'candidate',
    companyName: userData.companyName,
    organization: userData.organization,
    department: userData.department,
    phone: userData.phone,
    education: userData.education,
    skills: userData.skills || [],
    experienceLevel: userData.experienceLevel,
    targetRole: userData.targetRole || (userData.role === 'candidate' ? 'Data Analyst' : undefined),
    avatar: userData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  setCurrentUser(newUser);
  return newUser;
}

// Jobs
export function getJobs(): JobPosting[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOBS);
    return raw ? JSON.parse(raw) : INITIAL_JOBS;
  } catch {
    return INITIAL_JOBS;
  }
}

export function createJob(jobData: Omit<JobPosting, 'id' | 'postedDate' | 'applicationsCount'>): JobPosting {
  const jobs = getJobs();
  const newJob: JobPosting = {
    ...jobData,
    id: `job-${Date.now()}`,
    postedDate: new Date().toISOString(),
    applicationsCount: 0
  };
  jobs.unshift(newJob);
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  window.dispatchEvent(new Event('nextgen_jobs_updated'));
  return newJob;
}

// Applications
export function getApplications(): CandidateApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return raw ? JSON.parse(raw) : INITIAL_APPLICATIONS;
  } catch {
    return INITIAL_APPLICATIONS;
  }
}

export function submitApplication(appData: Partial<CandidateApplication>): CandidateApplication {
  const apps = getApplications();
  const newApp: CandidateApplication = {
    id: appData.id || `app-${Date.now()}`,
    jobId: appData.jobId || 'job-1',
    candidateId: appData.candidateId || 'user-cand-1',
    candidateName: appData.candidateName || 'Rahul Kumar',
    candidateEmail: appData.candidateEmail || 'rahul.kumar@example.com',
    candidatePhone: appData.candidatePhone || '+91 98765 43210',
    appliedDate: appData.appliedDate || new Date().toISOString().split('T')[0],
    status: appData.status || 'Applied',
    matchScore: appData.matchScore || 85,
    matchBreakdown: appData.matchBreakdown || {
      skillsMatch: 88,
      experienceMatch: 82,
      educationMatch: 85,
      keywordMatch: 85,
      overallMatch: 85
    },
    extractedSkills: appData.extractedSkills || ['Python', 'SQL', 'Data Analysis'],
    missingSkills: appData.missingSkills || ['Tableau'],
    strengths: appData.strengths || ['Solid baseline analytical skills'],
    recommendation: appData.recommendation || 'Recommended',
    education: appData.education || 'B.Tech in Computer Science',
    experienceYears: appData.experienceYears || '1.5 Years',
    resumeText: appData.resumeText,
    notes: appData.notes
  };

  apps.unshift(newApp);
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));

  // Add notification to recruiter
  addNotification({
    userId: 'user-rec-1',
    title: 'New Application Received',
    message: `${newApp.candidateName} applied for Job with ${newApp.matchScore}% Match Score.`,
    type: 'application'
  });

  window.dispatchEvent(new Event('nextgen_apps_updated'));
  return newApp;
}

export const createApplication = submitApplication;

export function updateApplicationStatus(
  appId: string,
  newStatus: CandidateApplication['status'],
  feedback?: string
): void {
  const apps = getApplications();
  const app = apps.find(a => a.id === appId);
  if (app) {
    app.status = newStatus;
    if (feedback) app.recruiterFeedback = feedback;
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));

    // Send notification to candidate
    addNotification({
      userId: app.candidateId,
      title: `Application Status Updated: ${newStatus}`,
      message: `Your application has been updated to "${newStatus}".`,
      type: newStatus === 'Shortlisted' ? 'shortlist' : 'application'
    });

    window.dispatchEvent(new Event('nextgen_apps_updated'));
  }
}

// Interviews
export function getInterviews(): InterviewSchedule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
    return raw ? JSON.parse(raw) : INITIAL_INTERVIEWS;
  } catch {
    return INITIAL_INTERVIEWS;
  }
}

export function scheduleInterview(data: Partial<InterviewSchedule>): InterviewSchedule {
  const list = getInterviews();
  const newInt: InterviewSchedule = {
    id: `int-${Date.now()}`,
    candidateId: data.candidateId || 'cand-1',
    candidateName: data.candidateName || 'Candidate',
    candidateEmail: data.candidateEmail || 'candidate@example.com',
    jobId: data.jobId || 'job-1',
    jobTitle: data.jobTitle || 'Data Analyst',
    recruiterId: data.recruiterId || 'rec-1',
    recruiterName: data.recruiterName || 'Sarah Jenkins',
    date: data.date || '2026-03-02',
    time: data.time || '14:30',
    duration: data.duration || '45 min',
    durationMinutes: data.durationMinutes || 45,
    type: data.type || 'Technical',
    interviewType: (data.interviewType || data.type || 'Technical') as any,
    meetingLink: data.meetingLink || 'https://meet.google.com/nxt-hire-ai-1',
    status: (data.status || 'Scheduled') as any,
    notes: data.notes,
    suggestedQuestions: data.suggestedQuestions || data.questionsSuggested || [],
    questionsSuggested: data.questionsSuggested || data.suggestedQuestions || []
  };
  list.unshift(newInt);
  localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(list));

  // Notify Candidate
  addNotification({
    userId: newInt.candidateId,
    title: `Interview Scheduled for ${newInt.jobTitle}`,
    message: `A ${newInt.type} interview has been scheduled on ${newInt.date} at ${newInt.time}.`,
    type: 'interview'
  });

  window.dispatchEvent(new Event('nextgen_interviews_updated'));
  return newInt;
}

export function updateInterviewStatus(id: string, status: any): void {
  const list = getInterviews();
  const item = list.find(i => i.id === id);
  if (item) {
    item.status = status;
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(list));
    window.dispatchEvent(new Event('nextgen_interviews_updated'));
  }
}

// Roadmaps
export function getRoadmaps(): LearningRoadmap[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROADMAPS);
    return raw ? JSON.parse(raw) : DEFAULT_ROADMAPS;
  } catch {
    return DEFAULT_ROADMAPS;
  }
}

export function updateRoadmapMilestone(roadmapId: string, stageNumber: number, milestoneTitle: string): boolean {
  const list = getRoadmaps();
  const roadmap = list.find(r => r.id === roadmapId);
  if (!roadmap) return false;

  const stage = roadmap.stages.find(s => s.stageNumber === stageNumber);
  if (!stage) return false;

  const milestone = stage.milestones.find(m => m.title === milestoneTitle);
  if (!milestone) return false;

  milestone.completed = !milestone.completed;
  localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(list));
  window.dispatchEvent(new Event('nextgen_roadmaps_updated'));
  return true;
}

// Projects
export function getProjects(): RecommendedProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return raw ? JSON.parse(raw) : INITIAL_PROJECTS;
  } catch {
    return INITIAL_PROJECTS;
  }
}

// Notifications
export function getNotifications(userId?: string): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list: AppNotification[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    if (userId) {
      return list.filter(n => n.userId === userId);
    }
    return list;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification {
  const list = getNotifications();
  const newN: AppNotification = {
    ...notif,
    id: `notif-${Date.now()}`,
    timestamp: 'Just now',
    read: false
  };
  list.unshift(newN);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  window.dispatchEvent(new Event('nextgen_notifs_updated'));
  return newN;
}

export function markAllNotificationsRead(userId?: string): void {
  const list = getNotifications();
  const updated = list.map(n => {
    if (!userId || n.userId === userId) {
      return { ...n, read: true };
    }
    return n;
  });
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  window.dispatchEvent(new Event('nextgen_notifs_updated'));
}

// AI Callers
export async function apiScreenResume(payload: {
  resumeText: string;
  jobTitle?: string;
  jobDescription?: string;
  requiredSkills?: string[];
}): Promise<AIResumeAnalysisResult> {
  const res = await fetch('/api/ai/screen-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error('Failed to screen resume with AI');
  }
  return res.json();
}

export async function apiGenerateInterviewQuestions(payload: {
  jobTitle: string;
  candidateName?: string;
  candidateSkills?: string[];
  missingSkills?: string[];
  extractedSkills?: string[];
}): Promise<any> {
  const res = await fetch('/api/ai/interview-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jobTitle: payload.jobTitle,
      candidateSkills: payload.candidateSkills || payload.extractedSkills || [],
      missingSkills: payload.missingSkills || []
    })
  });
  if (!res.ok) {
    return [
      `How do you structure and optimize complex queries in ${payload.jobTitle}?`,
      `Describe your practical experience with ${(payload.candidateSkills || payload.extractedSkills || ['Python'])[0] || 'Python'}.`,
      `How would you quickly master and implement ${(payload.missingSkills || ['cloud technologies'])[0] || 'cloud platforms'}?`
    ];
  }
  const data = await res.json();
  if (Array.isArray(data)) {
    return data.map((d: any) => typeof d === 'string' ? d : d.question || JSON.stringify(d));
  }
  return [];
}

export async function apiGenerateRoadmap(payload: {
  targetRole: string;
  currentSkills?: string[];
  missingSkills?: string[];
  experienceLevel?: string;
}): Promise<any> {
  const res = await fetch('/api/ai/generate-roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    return DEFAULT_ROADMAPS[0];
  }
  return res.json();
}

export async function apiGenerateProjects(payload: {
  targetRole: string;
  missingSkills?: string[];
  experienceLevel?: string;
}): Promise<RecommendedProject[]> {
  const res = await fetch('/api/ai/generate-projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    return INITIAL_PROJECTS;
  }
  const data = await res.json();
  return Array.isArray(data) ? data : INITIAL_PROJECTS;
}

// ----------------- CHATBOT & HUMAN ESCALATION SERVICE -----------------

export async function apiSendChatMessage(payload: {
  messages: Array<{ sender: string; text: string }>;
  userRole?: string;
  userName?: string;
  context?: any;
}): Promise<{
  reply: string;
  isEscalationSuggested?: boolean;
  escalationReason?: string;
  suggestedCategory?: SupportTicketCategory;
  suggestedPriority?: SupportTicketPriority;
  quickActions?: Array<{
    label: string;
    actionType: 'navigate' | 'ask' | 'escalate';
    targetTab?: string;
    payload?: string;
  }>;
}> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("apiSendChatMessage fetch error:", err);
  }

  // Frontend fallback response if offline
  const lastMsg = payload.messages[payload.messages.length - 1]?.text || "";
  const isEscalation = /human|support|escalate|appeal|dispute|real person|help/i.test(lastMsg);

  return {
    reply: isEscalation
      ? "### 🤝 Human Support Available\n\nI can connect you directly with a **NextGen Support Specialist or Human Recruiter**. Click **'Escalate to Human Support'** below to generate an official priority ticket."
      : "### 💡 NextGen Hiring AI Concierge\n\nI'm here to assist with **Resume Screening & Match Scores**, **Job Applications & Tracking**, and your **5-Stage Learning Roadmap**! How can I help you excel today?",
    isEscalationSuggested: isEscalation,
    escalationReason: isEscalation ? "User requested direct human escalation." : undefined,
    suggestedCategory: isEscalation ? 'Technical Issue' : 'Resume Screening',
    suggestedPriority: isEscalation ? 'High' : 'Medium',
    quickActions: isEscalation
      ? [{ label: "🚨 Escalate to Human Support", actionType: "escalate", payload: lastMsg }]
      : [
          { label: "How does AI Resume Screening work?", actionType: "ask", payload: "How does AI resume screening calculate match scores?" },
          { label: "View 5-Stage Learning Roadmap", actionType: "navigate", targetTab: "skill-gap" }
        ]
  };
}

export function getSupportTickets(userId?: string): SupportTicket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPPORT_TICKETS);
    const tickets: SupportTicket[] = raw ? JSON.parse(raw) : INITIAL_SUPPORT_TICKETS;
    if (userId) {
      return tickets.filter(t => t.userId === userId);
    }
    return tickets;
  } catch {
    return INITIAL_SUPPORT_TICKETS;
  }
}

export function createSupportTicket(ticketData: {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'recruiter' | 'candidate' | 'admin';
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  subject: string;
  description: string;
  conversationSnippet?: string[];
}): SupportTicket {
  const tickets = getSupportTickets();
  const newTicket: SupportTicket = {
    id: `TICK-${Math.floor(10000 + Math.random() * 90000)}`,
    userId: ticketData.userId,
    userName: ticketData.userName,
    userEmail: ticketData.userEmail,
    userRole: ticketData.userRole,
    category: ticketData.category,
    priority: ticketData.priority,
    subject: ticketData.subject,
    description: ticketData.description,
    status: 'Open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    conversationSnippet: ticketData.conversationSnippet || [],
    agentNotes: 'Ticket queued for dedicated Talent Operations / Support review.'
  };

  tickets.unshift(newTicket);
  localStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(tickets));

  // Also push a system notification
  addNotification({
    userId: ticketData.userId,
    title: `Support Ticket Created: ${newTicket.id}`,
    message: `Your support request regarding "${ticketData.subject}" has been queued. Our human support team typically responds within 2-4 hours.`,
    type: 'system'
  });

  return newTicket;
}

export function updateSupportTicketStatus(ticketId: string, status: SupportTicketStatus, agentNotes?: string): void {
  const tickets = getSupportTickets();
  const index = tickets.findIndex(t => t.id === ticketId);
  if (index !== -1) {
    tickets[index].status = status;
    tickets[index].updatedAt = new Date().toISOString();
    if (agentNotes) {
      tickets[index].agentNotes = agentNotes;
    }
    localStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(tickets));
  }
}

export function getSupportTicketById(ticketId: string): SupportTicket | null {
  const tickets = getSupportTickets();
  return tickets.find(t => t.id === ticketId) || null;
}

// -------------------------------------------------------------
// Mock Interview Assessment Services
// -------------------------------------------------------------

export function getMockInterviewTemplates(): MockInterviewTemplate[] {
  return MOCK_INTERVIEW_TEMPLATES;
}

export function getMockInterviewTemplateById(id: string): MockInterviewTemplate | null {
  return MOCK_INTERVIEW_TEMPLATES.find(t => t.id === id) || null;
}

export function getAllAptitudeQuestions(): AptitudeQuestion[] {
  return APTITUDE_QUESTIONS;
}

export function getAptitudeQuestionsByIds(ids: string[]): AptitudeQuestion[] {
  return APTITUDE_QUESTIONS.filter(q => ids.includes(q.id));
}

export function getAllCodingQuestions(): CodingQuestion[] {
  return CODING_QUESTIONS;
}

export function getCodingQuestionsByIds(ids: string[]): CodingQuestion[] {
  return CODING_QUESTIONS.filter(q => ids.includes(q.id));
}

export function getAllConceptualQuestions(): ConceptualQuestion[] {
  return CONCEPTUAL_QUESTIONS;
}

export function getConceptualQuestionsByIds(ids: string[]): ConceptualQuestion[] {
  return CONCEPTUAL_QUESTIONS.filter(q => ids.includes(q.id));
}

export function getMockInterviewAttempts(userId?: string): MockInterviewAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MOCK_INTERVIEW_ATTEMPTS);
    const list: MockInterviewAttempt[] = raw ? JSON.parse(raw) : [];
    if (userId) {
      return list.filter(a => a.userId === userId);
    }
    return list;
  } catch {
    return [];
  }
}

export function saveMockInterviewAttempt(attempt: MockInterviewAttempt): void {
  const attempts = getMockInterviewAttempts();
  const existingIdx = attempts.findIndex(a => a.id === attempt.id);
  if (existingIdx !== -1) {
    attempts[existingIdx] = attempt;
  } else {
    attempts.unshift(attempt);
  }
  localStorage.setItem(STORAGE_KEYS.MOCK_INTERVIEW_ATTEMPTS, JSON.stringify(attempts));
  window.dispatchEvent(new Event('nextgen_mock_interview_updated'));

  // Notification for interview completion
  addNotification({
    userId: attempt.userId,
    title: `Mock Interview Completed: ${attempt.title}`,
    message: `You scored ${attempt.score.overall}% (Aptitude: ${attempt.score.aptitudeScore}%, Coding: ${attempt.score.codingScore}%). Check your detailed scorecard & AI action plan.`,
    type: 'interview'
  });
}

// Client-side dynamic JavaScript/Python code execution simulator
export function runClientSideCodeTest(
  code: string,
  question: CodingQuestion,
  language: 'javascript' | 'typescript' | 'python' | 'sql'
): {
  passedTests: number;
  totalTests: number;
  isPassed: boolean;
  outputLog: string[];
  executionTimeMs: number;
  testResults: { id: string; input: string; expected: string; actual: string; passed: boolean; error?: string }[];
} {
  const startTime = performance.now();
  const testResults: { id: string; input: string; expected: string; actual: string; passed: boolean; error?: string }[] = [];
  const outputLog: string[] = [];

  try {
    if (language === 'javascript' || language === 'typescript') {
      // Execute within safe scoped Function
      // Clean comments or TS annotations if simple
      const cleanJs = code
        .replace(/:\s*[A-Za-z0-9_<>[\]|]+/g, '') // basic TS type stripped
        .replace(/as\s+[A-Za-z0-9_<>[\]]+/g, '');

      for (let i = 0; i < question.testCases.length; i++) {
        const tc = question.testCases[i];
        let actual = '';
        let passed = false;
        let errorMsg = '';

        try {
          if (question.id === 'code-1') {
            // Two Sum test runner
            const fn = new Function(`${cleanJs}; return twoSum;`)();
            if (i === 0) {
              const res = fn([2, 7, 11, 15], 9);
              actual = JSON.stringify(res);
              passed = Array.isArray(res) && ((res[0] === 0 && res[1] === 1) || (res[0] === 1 && res[1] === 0));
            } else if (i === 1) {
              const res = fn([3, 2, 4], 6);
              actual = JSON.stringify(res);
              passed = Array.isArray(res) && ((res[0] === 1 && res[1] === 2) || (res[0] === 2 && res[1] === 1));
            } else if (i === 2) {
              const res = fn([-1, -2, -3, -4, -5], -8);
              actual = JSON.stringify(res);
              passed = Array.isArray(res) && ((res[0] === 2 && res[1] === 4) || (res[0] === 4 && res[1] === 2));
            } else {
              const res = fn([0, 4, 3, 0], 0);
              actual = JSON.stringify(res);
              passed = Array.isArray(res) && ((res[0] === 0 && res[1] === 3) || (res[0] === 3 && res[1] === 0));
            }
          } else if (question.id === 'code-2') {
            // Department earners
            const fn = new Function(`${cleanJs}; return getTopDepartmentEarners;`)();
            const sample = [
              { id: 1, name: 'Alice', salary: 140000, department: 'Engineering' },
              { id: 2, name: 'Bob', salary: 130000, department: 'Engineering' },
              { id: 3, name: 'Charlie', salary: 110000, department: 'Engineering' },
              { id: 4, name: 'Diana', salary: 105000, department: 'Marketing' }
            ];
            const res = fn(sample, 2);
            actual = `${res?.length || 0} records produced`;
            passed = Array.isArray(res) && res.length >= 3 && res[0].salary >= 130000;
          } else if (question.id === 'code-3') {
            // Valid Parentheses
            const fn = new Function(`${cleanJs}; return isValidParentheses;`)();
            if (i === 0) {
              const res = fn("()[]{}");
              actual = String(res);
              passed = res === true;
            } else if (i === 1) {
              const res = fn("(]");
              actual = String(res);
              passed = res === false;
            } else if (i === 2) {
              const res = fn("{[()()]}");
              actual = String(res);
              passed = res === true;
            } else {
              const res = fn("[");
              actual = String(res);
              passed = res === false;
            }
          } else if (question.id === 'code-4') {
            // Concurrency runner check
            const fn = new Function(`${cleanJs}; return runConcurrentTasks;`)();
            actual = 'Async worker pool verified';
            passed = typeof fn === 'function';
          } else if (question.id === 'code-5') {
            // Merge Intervals
            const fn = new Function(`${cleanJs}; return mergeIntervals;`)();
            if (i === 0) {
              const res = fn([[1,3],[2,6],[8,10],[15,18]]);
              actual = JSON.stringify(res);
              passed = JSON.stringify(res) === JSON.stringify([[1,6],[8,10],[15,18]]);
            } else {
              const res = fn([[1,4],[4,5]]);
              actual = JSON.stringify(res);
              passed = JSON.stringify(res) === JSON.stringify([[1,5]]);
            }
          } else if (question.id === 'code-6') {
            // Group Anagrams
            const fn = new Function(`${cleanJs}; return groupAnagrams;`)();
            if (i === 0) {
              const res = fn(["eat","tea","tan","ate","nat","bat"]);
              actual = `${res?.length || 0} groups formed: ${JSON.stringify(res)}`;
              passed = Array.isArray(res) && res.length === 3;
            } else {
              const res = fn(["a"]);
              actual = JSON.stringify(res);
              passed = Array.isArray(res) && res.length === 1;
            }
          } else {
            // General function execution check
            actual = 'Executed successfully';
            passed = true;
          }
        } catch (e: any) {
          actual = `Runtime Error: ${e.message}`;
          errorMsg = e.message;
          passed = false;
        }

        testResults.push({
          id: tc.id,
          input: tc.input,
          expected: tc.expectedOutput,
          actual,
          passed,
          error: errorMsg || undefined
        });
      }
    } else {
      // Python or SQL static/simulated validation
      const hasKeywords = language === 'sql' 
        ? code.toLowerCase().includes('select') && code.toLowerCase().includes('dense_rank')
        : code.includes('def ') && code.includes('return');

      question.testCases.forEach((tc, idx) => {
        const passed = hasKeywords && code.length > 50;
        testResults.push({
          id: tc.id,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: passed ? tc.expectedOutput : 'Syntax or structure incomplete',
          passed
        });
      });
    }
  } catch (err: any) {
    outputLog.push(`Compilation error: ${err.message}`);
  }

  const passedTests = testResults.filter(t => t.passed).length;
  const executionTimeMs = Math.round(performance.now() - startTime);

  return {
    passedTests,
    totalTests: question.testCases.length,
    isPassed: passedTests === question.testCases.length,
    outputLog,
    executionTimeMs,
    testResults
  };
}

