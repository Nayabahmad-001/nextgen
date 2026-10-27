import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  PlusCircle,
  Users,
  MapPin,
  Clock,
  Trash2,
  Edit,
  Sparkles,
  CheckCircle,
  Eye,
  FileCheck2
} from 'lucide-react';
import { JobPosting } from '../../types';
import { getJobs } from '../../services/apiService';

interface ManageJobsProps {
  onSelectJobForScreening: (job: JobPosting) => void;
  onNavigatePostJob: () => void;
}

export const ManageJobs: React.FC<ManageJobsProps> = ({
  onSelectJobForScreening,
  onNavigatePostJob
}) => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadJobs = () => {
    setJobs(getJobs());
  };

  useEffect(() => {
    loadJobs();
    window.addEventListener('nextgen_jobs_updated', loadJobs);
    return () => window.removeEventListener('nextgen_jobs_updated', loadJobs);
  }, []);

  const filteredJobs = jobs.filter(j => {
    const matchesFilter = filter === 'all' || j.status === filter;
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          j.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          j.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>REQUISITION REPOSITORY</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Manage Job Postings</h1>
          <p className="text-xs text-slate-400">
            View active requisitions, applicant volumes, and screen applicant pools.
          </p>
        </div>

        <button
          onClick={onNavigatePostJob}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center space-x-2 self-start sm:self-auto transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Requisition</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-1.5 w-full sm:w-auto">
          {(['all', 'active', 'closed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                filter === tab
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab} ({tab === 'all' ? jobs.length : jobs.filter(j => j.status === tab).length})
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, department, or skill..."
          className="w-full sm:w-72 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                  {job.department}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  job.status === 'active'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {job.status.toUpperCase()}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-100">{job.title}</h3>
              <p className="text-xs text-indigo-400 font-medium mt-0.5">{job.company}</p>

              <div className="space-y-1.5 my-3 text-[11px] text-slate-400">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{job.experienceRequired} Exp • {job.jobType}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300 font-medium">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{job.applicationsCount || 0} Total Applicants ({job.openings} Openings)</span>
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-2.5 mt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Required Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {job.requiredSkills.slice(0, 4).map((sk, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {sk}
                    </span>
                  ))}
                  {job.requiredSkills.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      +{job.requiredSkills.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-emerald-400">{job.salaryRange}</span>

              <button
                onClick={() => onSelectJobForScreening(job)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Screen Resumes</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
