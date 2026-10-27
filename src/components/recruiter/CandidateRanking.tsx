import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Filter,
  Search,
  ArrowUpDown,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  Briefcase,
  Star,
  Sparkles,
  Download
} from 'lucide-react';
import { CandidateApplication, JobPosting } from '../../types';
import { getApplications, getJobs, updateApplicationStatus } from '../../services/apiService';

interface CandidateRankingProps {
  onSelectCandidate: (app: CandidateApplication) => void;
  onScheduleInterview: (app: CandidateApplication) => void;
}

export const CandidateRanking: React.FC<CandidateRankingProps> = ({
  onSelectCandidate,
  onScheduleInterview
}) => {
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');

  const loadData = () => {
    setApplications(getApplications());
    setJobs(getJobs());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('nextgen_apps_updated', loadData);
    return () => window.removeEventListener('nextgen_apps_updated', loadData);
  }, []);

  const handleStatusChange = (appId: string, newStatus: CandidateApplication['status']) => {
    updateApplicationStatus(appId, newStatus);
    loadData();
  };

  const filteredApps = applications
    .filter(app => {
      const matchJob = selectedJobFilter === 'all' || app.jobId === selectedJobFilter;
      const matchStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.extractedSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchJob && matchStatus && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.matchScore - a.matchScore;
      return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>AI CANDIDATE LEADERBOARD</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Smart Candidate Ranking</h1>
          <p className="text-xs text-slate-400">
            Objectively ranked talent pool sorted by competency match percentage.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400">Total Applicants:</span>
          <span className="px-3 py-1 rounded-lg bg-indigo-950 text-indigo-300 font-bold border border-indigo-800 text-xs">
            {filteredApps.length}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Search Candidate / Skill</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. Python, Rahul..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Filter by Job Requisition</label>
          <select
            value={selectedJobFilter}
            onChange={(e) => setSelectedJobFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Jobs ({jobs.length})</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Under Review">Under Review</option>
            <option value="Rejected">Rejected</option>
            <option value="Selected">Selected</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Sort Leaderboard</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="score">Highest Match Score</option>
            <option value="date">Most Recent Application</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 font-semibold uppercase">
                <th className="py-3.5 pl-4 text-center w-12">Rank</th>
                <th className="py-3.5">Candidate Details</th>
                <th className="py-3.5">Job Target</th>
                <th className="py-3.5 text-center">AI Match Score</th>
                <th className="py-3.5">Extracted Skills</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredApps.map((app, index) => {
                const job = jobs.find(j => j.id === app.jobId);
                const isTop3 = index < 3;
                return (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Rank Badge */}
                    <td className="py-4 pl-4 text-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black mx-auto text-xs ${
                        index === 0
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                          : index === 1
                          ? 'bg-slate-300 text-slate-950'
                          : index === 2
                          ? 'bg-amber-700 text-amber-100'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        #{index + 1}
                      </div>
                    </td>

                    {/* Candidate Details */}
                    <td className="py-4">
                      <div>
                        <p className="font-bold text-slate-100 flex items-center space-x-1.5">
                          <span>{app.candidateName}</span>
                          {isTop3 && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        </p>
                        <p className="text-[11px] text-slate-400">{app.candidateEmail}</p>
                        <p className="text-[10px] text-indigo-400">{app.education}</p>
                      </div>
                    </td>

                    {/* Job */}
                    <td className="py-4 text-slate-300">
                      <p className="font-semibold text-slate-200">{job?.title || 'Data Analyst'}</p>
                      <p className="text-[10px] text-slate-400">{job?.department || 'Analytics'}</p>
                    </td>

                    {/* Score */}
                    <td className="py-4 text-center">
                      <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full font-black text-xs bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>{app.matchScore}%</span>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-0.5">{app.recommendation}</p>
                    </td>

                    {/* Skills */}
                    <td className="py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {app.extractedSkills.slice(0, 3).map((sk, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                            {sk}
                          </span>
                        ))}
                        {app.extractedSkills.length > 3 && (
                          <span className="text-[10px] text-slate-400">+{app.extractedSkills.length - 3}</span>
                        )}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                        className={`text-[11px] font-bold rounded-lg px-2 py-1 border cursor-pointer ${
                          app.status === 'Shortlisted'
                            ? 'bg-purple-950 text-purple-300 border-purple-800'
                            : app.status === 'Interview'
                            ? 'bg-pink-950 text-pink-300 border-pink-800'
                            : app.status === 'Selected'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : app.status === 'Rejected'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : 'bg-slate-950 text-slate-300 border-slate-800'
                        }`}
                      >
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 text-right pr-4">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onSelectCandidate(app)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="View Full Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onScheduleInterview(app)}
                          className="p-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 transition-colors"
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
    </div>
  );
};
