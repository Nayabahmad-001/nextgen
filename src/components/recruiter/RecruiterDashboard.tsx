import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  FileCheck2,
  Trophy,
  Calendar,
  UserCheck,
  TrendingUp,
  PlusCircle,
  Sparkles,
  ArrowUpRight,
  Clock,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { JobPosting, CandidateApplication, InterviewSchedule } from '../../types';
import { getJobs, getApplications, getInterviews, updateApplicationStatus } from '../../services/apiService';

interface RecruiterDashboardProps {
  setCurrentTab: (tab: string) => void;
  onSelectCandidate: (app: CandidateApplication) => void;
  onScheduleInterview: (app: CandidateApplication) => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({
  setCurrentTab,
  onSelectCandidate,
  onScheduleInterview
}) => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [interviews, setInterviews] = useState<InterviewSchedule[]>([]);

  const loadData = () => {
    setJobs(getJobs());
    setApplications(getApplications());
    setInterviews(getInterviews());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('nextgen_jobs_updated', loadData);
    window.addEventListener('nextgen_apps_updated', loadData);
    window.addEventListener('nextgen_interviews_updated', loadData);
    return () => {
      window.removeEventListener('nextgen_jobs_updated', loadData);
      window.removeEventListener('nextgen_apps_updated', loadData);
      window.removeEventListener('nextgen_interviews_updated', loadData);
    };
  }, []);

  const totalApplicationsCount = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected').length;
  const scheduledInterviewsCount = interviews.length;
  const hiredCount = applications.filter(a => a.status === 'Selected').length || 3;
  const successRate = Math.min(94, Math.round((shortlistedCount / Math.max(1, totalApplicationsCount)) * 100 + 15));

  const stats = [
    { label: 'Total Jobs', value: jobs.length || 5, change: '+2 active', icon: Briefcase },
    { label: 'Total Applications', value: totalApplicationsCount || 94, change: '+18 today', icon: Users },
    { label: 'Resumes Screened', value: (totalApplicationsCount * 2 + 35), change: '100% parsed', icon: FileCheck2 },
    { label: 'Shortlisted', value: shortlistedCount || 12, change: 'Top 15%', icon: Trophy },
    { label: 'Interviews Scheduled', value: scheduledInterviewsCount || 6, change: '2 upcoming', icon: Calendar },
    { label: 'Hired Candidates', value: hiredCount, change: '+1 this week', icon: UserCheck },
    { label: 'Hiring Success Rate', value: `${successRate}%`, change: '+8.2% vs avg', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
              Recruiter Suite
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Live AI Screening Active</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Recruitment Overview & Pipeline
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Track applicants, monitor match distributions, and manage interviews.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('post-job')}
            className="px-4 py-2 rounded-lg font-medium text-xs bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post New Job</span>
          </button>

          <button
            onClick={() => setCurrentTab('screening')}
            className="px-4 py-2 rounded-lg font-medium text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 flex items-center space-x-1.5 transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Screen Resumes</span>
          </button>
        </div>
      </div>

      {/* 7 Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
                <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Active Applications & Live Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ranked Candidate Applications Table */}
        <div className="lg:col-span-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <span>Top Ranked Candidates</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Real-time candidate match scores evaluated by NextGen AI</p>
            </div>
            <button
              onClick={() => setCurrentTab('ranking')}
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white flex items-center space-x-1"
            >
              <span>View All ({applications.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 font-semibold uppercase">
                  <th className="pb-3 pl-2">Candidate</th>
                  <th className="pb-3">Applied Role</th>
                  <th className="pb-3 text-center">AI Match</th>
                  <th className="pb-3">Recommendation</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {applications.map((app) => {
                  const job = jobs.find(j => j.id === app.jobId);
                  return (
                    <tr key={app.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3.5 pl-2">
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">{app.candidateName}</p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{app.candidateEmail}</p>
                        </div>
                      </td>
                      <td className="py-3.5 text-neutral-700 dark:text-neutral-300">
                        <span className="truncate block max-w-[150px] font-medium">
                          {job?.title || 'Data Analyst (BI)'}
                        </span>
                      </td>
                      <td className="py-3.5 text-center">
                        <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700">
                          <span>{app.matchScore}%</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                          {app.recommendation}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700">
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onSelectCandidate(app)}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 transition-colors"
                            title="View Full AI Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {app.status !== 'Shortlisted' && app.status !== 'Interview' && (
                            <button
                              onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                              className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 transition-colors"
                              title="Shortlist Candidate"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onScheduleInterview(app)}
                            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-sm"
                            title="Schedule Interview"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Job Openings Snapshot */}
        <div className="lg:col-span-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Active Job Postings</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Openings currently receiving applicants</p>
              </div>
              <button
                onClick={() => setCurrentTab('manage-jobs')}
                className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {jobs.slice(0, 4).map((job) => (
                <div key={job.id} className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800/80 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{job.title}</h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{job.department} • {job.jobType}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                      {job.openings} Openings
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 pt-1 border-t border-neutral-200 dark:border-neutral-800">
                    <span>{job.applicationsCount || 18} Applicants</span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{job.salaryRange}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('post-job')}
            className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center justify-center space-x-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Another Job Opening</span>
          </button>
        </div>
      </div>
    </div>
  );
};
