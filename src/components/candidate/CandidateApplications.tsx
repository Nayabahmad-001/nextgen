import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Briefcase,
  Calendar,
  Video,
  Clock,
  ExternalLink,
  Sparkles,
  Building,
  ArrowRight
} from 'lucide-react';
import { CandidateApplication, JobPosting, InterviewSchedule } from '../../types';
import { getApplications, getJobs, getInterviews, getCurrentUser } from '../../services/apiService';

export const CandidateApplications: React.FC = () => {
  const user = getCurrentUser();
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [interviews, setInterviews] = useState<InterviewSchedule[]>([]);

  const loadData = () => {
    setApplications(getApplications());
    setJobs(getJobs());
    setInterviews(getInterviews());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('nextgen_apps_updated', loadData);
    window.addEventListener('nextgen_interviews_updated', loadData);
    return () => {
      window.removeEventListener('nextgen_apps_updated', loadData);
      window.removeEventListener('nextgen_interviews_updated', loadData);
    };
  }, []);

  const candidateApps = applications.filter(a =>
    a.candidateEmail === user?.email || a.candidateName === user?.name || user?.role === 'candidate'
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-1">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>APPLICATION TRACKER</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">My Job Applications</h1>
          <p className="text-xs text-slate-400">
            Real-time status updates, recruiter screening reviews, and scheduled interviews.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400">Active Applications:</span>
          <span className="px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 font-bold border border-cyan-800 text-xs">
            {candidateApps.length}
          </span>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {candidateApps.map((app) => {
          const job = jobs.find(j => j.id === app.jobId);
          const appInterview = interviews.find(i => i.candidateName === app.candidateName || i.jobTitle === job?.title);

          return (
            <div
              key={app.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-100">{job?.title || 'Data Analyst'}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                      {app.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-xs text-cyan-400 font-semibold mt-0.5">
                    {job?.company || 'Nexus AI Labs'} • {job?.department || 'Analytics'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                    app.status === 'Interview'
                      ? 'bg-pink-950 text-pink-300 border-pink-800 animate-pulse'
                      : app.status === 'Shortlisted'
                      ? 'bg-purple-950 text-purple-300 border-purple-800'
                      : app.status === 'Selected'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}>
                    {app.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Applied On</span>
                  <p className="font-bold text-slate-200 mt-0.5">{app.appliedDate}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">AI Recommendation</span>
                  <p className="font-bold text-emerald-400 mt-0.5">{app.recommendation}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Compensation</span>
                  <p className="font-bold text-slate-200 mt-0.5">{job?.salaryRange || '$110k - $140k'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Location</span>
                  <p className="font-bold text-slate-200 mt-0.5 truncate">{job?.location || 'Remote'}</p>
                </div>
              </div>

              {/* If interview scheduled, show calendar room banner */}
              {app.status === 'Interview' && appInterview && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-pink-950/40 to-purple-950/40 border border-pink-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-950 border border-pink-800 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <p className="font-bold text-pink-300">
                        Interview Confirmed: {appInterview.type} Round ({appInterview.duration})
                      </p>
                      <p className="text-slate-300 text-[11px] mt-0.5">
                        🗓️ {appInterview.date} at {appInterview.time} • Google Meet
                      </p>
                    </div>
                  </div>

                  <a
                    href={appInterview.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-pink-600/30 self-start sm:self-auto transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Video Meeting Room</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
