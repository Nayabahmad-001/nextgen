import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  Compass,
  Code2,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  Layers,
  CheckSquare,
  BrainCircuit,
  Play
} from 'lucide-react';
import { getCurrentUser, getApplications, getRoadmaps, getJobs } from '../../services/apiService';
import { JobPosting, CandidateApplication, LearningRoadmap } from '../../types';

interface CandidateDashboardProps {
  setCurrentTab: (tab: string) => void;
  onApplyJob: (job: JobPosting) => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  setCurrentTab,
  onApplyJob
}) => {
  const [user, setUser] = useState(getCurrentUser());
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [roadmaps, setRoadmaps] = useState<LearningRoadmap[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);

  const loadData = () => {
    const u = getCurrentUser();
    setUser(u);
    setApplications(getApplications());
    setRoadmaps(getRoadmaps());
    setJobs(getJobs());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('nextgen_auth_changed', loadData);
    window.addEventListener('nextgen_apps_updated', loadData);
    window.addEventListener('nextgen_roadmaps_updated', loadData);
    return () => {
      window.removeEventListener('nextgen_auth_changed', loadData);
      window.removeEventListener('nextgen_apps_updated', loadData);
      window.removeEventListener('nextgen_roadmaps_updated', loadData);
    };
  }, []);

  const targetRole = user?.targetRole || 'Data Analyst';
  const activeRoadmap = roadmaps.find(r => r.targetRole.toLowerCase().includes(targetRole.toLowerCase())) || roadmaps[0];

  const totalMilestones = activeRoadmap?.stages.reduce((acc, s) => acc + s.milestones.length, 0) || 12;
  const completedMilestones = activeRoadmap?.stages.reduce((acc, s) => acc + s.milestones.filter(m => m.completed).length, 0) || 7;
  const roadmapProgress = Math.round((completedMilestones / Math.max(1, totalMilestones)) * 100);

  const candidateApps = applications.filter(a => a.candidateEmail === user?.email || a.candidateName === user?.name || user?.role === 'candidate');
  const scheduledInterviews = candidateApps.filter(a => a.status === 'Interview');

  const resumeScore = 88;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium mb-2 border border-neutral-200 dark:border-neutral-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Candidate Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'Candidate'}
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Targeting <span className="text-neutral-900 dark:text-neutral-200 font-medium">{targetRole}</span> • Match Readiness: <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{resumeScore}%</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('mock-interview')}
            className="px-4 py-2 rounded-lg font-medium text-xs bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Mock Interview</span>
          </button>

          <button
            onClick={() => setCurrentTab('resume-score')}
            className="px-4 py-2 rounded-lg font-medium text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 flex items-center space-x-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Resume</span>
          </button>

          <button
            onClick={() => setCurrentTab('skill-gap')}
            className="px-4 py-2 rounded-lg font-medium text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 flex items-center space-x-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Learning Roadmap</span>
          </button>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Resume Score</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium border border-neutral-200 dark:border-neutral-700">Top 10%</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{resumeScore}/100</p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">High Recruiter Appeal</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Roadmap Progress</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono border border-neutral-200 dark:border-neutral-700">{completedMilestones}/{totalMilestones}</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{roadmapProgress}%</p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Stage 3 of 5 active</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Acquired Skills</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium border border-neutral-200 dark:border-neutral-700">Verified</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{user?.skills?.length || 8}</p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">Python, SQL, Power BI</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Skill Gaps</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium border border-neutral-200 dark:border-neutral-700">To Upskill</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">2 Skills</p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">Tableau, Snowflake</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Applications</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">1 Interview</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{candidateApps.length || 3}</p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">Active in pipeline</p>
          </div>
        </div>
      </div>

      {/* Row 2: Resume Score Breakdown & 5-Stage Roadmap Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Resume Score Card */}
        <div className="lg:col-span-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                  <span>Resume Health & Recruiter Score</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Evaluated against {targetRole} job market standards</p>
              </div>

              <span className="text-2xl font-bold text-neutral-900 dark:text-white">{resumeScore}%</span>
            </div>

            {/* Breakdown Bars */}
            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-neutral-700 dark:text-neutral-300">Technical Skills & Depth</span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-semibold">92%</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-neutral-900 dark:bg-neutral-100 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-neutral-700 dark:text-neutral-300">Impact & Quantified Outcomes</span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-semibold">85%</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-neutral-900 dark:bg-neutral-100 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-neutral-700 dark:text-neutral-300">ATS Parsing & Structure</span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-semibold">88%</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-neutral-900 dark:bg-neutral-100 h-2 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-neutral-700 dark:text-neutral-300">Target Role Keyword Density</span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-semibold">84%</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-neutral-900 dark:bg-neutral-100 h-2 rounded-full" style={{ width: '84%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Last scanned: Today</span>
            <button
              onClick={() => setCurrentTab('resume-score')}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100 font-medium text-xs flex items-center space-x-1.5 transition-colors border border-neutral-200 dark:border-neutral-700"
            >
              <span>View Full Feedback & Suggestions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5-Stage Roadmap Snapshot */}
        <div className="lg:col-span-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                  <span>Personalized 5-Stage Roadmap</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Your step-by-step master plan for {targetRole}</p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                Stage 3 / 5
              </span>
            </div>

            <div className="space-y-2.5">
              {activeRoadmap?.stages.map((stg) => (
                <div
                  key={stg.stageNumber}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    stg.stageNumber <= 2
                      ? 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200'
                      : stg.stageNumber === 3
                      ? 'bg-neutral-100 dark:bg-neutral-800/80 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 shadow-sm'
                      : 'bg-neutral-50/50 dark:bg-neutral-950/60 border-neutral-200/60 dark:border-neutral-800/80 text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      stg.stageNumber <= 2
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                        : stg.stageNumber === 3
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                        : 'bg-neutral-200/50 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-600'
                    }`}>
                      {stg.stageNumber}
                    </span>
                    <div>
                      <p className="font-semibold">{stg.title}</p>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{stg.duration} • {stg.milestones.length} milestones</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700">
                    {stg.stageNumber <= 2 ? 'COMPLETED' : stg.stageNumber === 3 ? 'IN PROGRESS' : 'UPCOMING'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
            <button
              onClick={() => setCurrentTab('skill-gap')}
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white flex items-center space-x-1"
            >
              <span>Open Interactive Skill Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Matched Jobs for You */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm transition-colors">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <BrainCircuit className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              <span>Interactive Mock Interview & Coding Readiness</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Practice timed quantitative aptitude, logical deduction, live coding, and AI architecture analysis</p>
          </div>
          <button
            onClick={() => setCurrentTab('mock-interview')}
            className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white flex items-center space-x-1"
          >
            <span>View All Assessments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Data Analyst Full Diagnostic</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                  45 mins
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                Quantitative aptitude, SQL window functions, statistical inference, and metric analysis.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('mock-interview')}
              className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Start Assessment</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Software Engineer Live Coding</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                  60 mins
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                Data structures, algorithmic two-pointer / hashing, async concurrency, and system resilience.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('mock-interview')}
              className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Start Assessment</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Speed Quantitative & Logic</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                  25 mins
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                High-speed mental math, permutation & combination, logical deduction, and time/work puzzles.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('mock-interview')}
              className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Start Assessment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: Matched Jobs for You */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm transition-colors">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              <span>Recommended Jobs Matching Your Profile</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Curated opportunities matching your verified skills & target role</p>
          </div>
          <button
            onClick={() => setCurrentTab('jobs')}
            className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white flex items-center space-x-1"
          >
            <span>Explore All Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobs.slice(0, 3).map((job) => (
            <div key={job.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{job.title}</h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{job.company}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                    92% Match
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2">{job.location} • {job.jobType}</p>
              </div>

              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{job.salaryRange}</span>
                <button
                  onClick={() => onApplyJob(job)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-medium text-xs transition-colors shadow-sm"
                >
                  Apply with 1-Click
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
