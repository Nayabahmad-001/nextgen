import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Search,
  Building
} from 'lucide-react';
import { JobPosting } from '../../types';
import { getJobs, getCurrentUser, createApplication } from '../../services/apiService';

interface JobRecommendationsProps {
  onAppliedSuccess: (job: JobPosting) => void;
}

export const JobRecommendations: React.FC<JobRecommendationsProps> = ({ onAppliedSuccess }) => {
  const user = getCurrentUser();
  const jobs = getJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(['job-1']);
  const [justAppliedSuccess, setJustAppliedSuccess] = useState<string | null>(null);

  const handleApply = (job: JobPosting) => {
    if (appliedJobIds.includes(job.id)) return;

    createApplication({
      candidateId: user?.id || 'cand-1',
      jobId: job.id,
      candidateName: user?.name || 'Rahul Kumar',
      candidateEmail: user?.email || 'rahul.kumar@example.com',
      candidatePhone: user?.phone || '+91 98765 43210',
      matchScore: 92,
      extractedSkills: user?.skills || ['Python', 'SQL', 'Power BI'],
      missingSkills: ['Snowflake'],
      recommendation: 'Highly Recommended',
      status: 'Under Review',
      resumeText: 'Verified profile application',
      experienceYears: user?.experienceLevel || 'Entry-Level / 2 Years',
      education: user?.education || 'B.Tech Computer Science'
    });

    setAppliedJobIds([...appliedJobIds, job.id]);
    setJustAppliedSuccess(`Application submitted to ${job.company} for "${job.title}"! NextGen AI screening initialized.`);
    setTimeout(() => setJustAppliedSuccess(null), 3000);
    onAppliedSuccess(job);
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>AI MATCHED CAREER OPPORTUNITIES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Recommended Job Openings
          </h1>
          <p className="text-xs text-slate-400">
            Live jobs ranked according to your verified technical skills and roadmap progress.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-cyan-300 font-bold">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{jobs.length} Active Positions Match Your Profile</span>
        </div>
      </div>

      {justAppliedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{justAppliedSuccess}</span>
        </div>
      )}

      {/* Search Filter */}
      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title, company name, or technology..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => {
          const isApplied = appliedJobIds.includes(job.id);
          const matchPercentage = job.title.toLowerCase().includes('data') ? 94 : job.title.toLowerCase().includes('full') ? 86 : 89;

          return (
            <div
              key={job.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 uppercase">
                      {job.department}
                    </span>
                    <h3 className="text-base font-bold text-slate-100 mt-1">{job.title}</h3>
                    <p className="text-xs text-cyan-400 font-semibold">{job.company}</p>
                  </div>

                  <div className="text-right">
                    <span className="inline-block text-xs font-black px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-sm">
                      {matchPercentage}% Match
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="space-y-1.5 text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{job.experienceRequired} Exp • {job.jobType}</span>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="pt-2 border-t border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Key Match Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills.map((sk, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-400">{job.salaryRange}</span>

                <button
                  onClick={() => handleApply(job)}
                  disabled={isApplied}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md ${
                    isApplied
                      ? 'bg-slate-800 text-slate-400 cursor-default border border-slate-700'
                      : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-600/25'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Apply with 1-Click</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
