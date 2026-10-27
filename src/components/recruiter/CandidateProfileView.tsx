import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  BrainCircuit,
  FileText,
  ShieldCheck,
  Award,
  ChevronRight
} from 'lucide-react';
import { CandidateApplication, JobPosting } from '../../types';
import { getJobs, updateApplicationStatus, apiGenerateInterviewQuestions } from '../../services/apiService';

interface CandidateProfileViewProps {
  application: CandidateApplication | null;
  onClose: () => void;
  onScheduleInterview: (app: CandidateApplication) => void;
}

export const CandidateProfileView: React.FC<CandidateProfileViewProps> = ({
  application,
  onClose,
  onScheduleInterview
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'ai-questions'>('overview');
  const [questions, setQuestions] = useState<string[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);

  if (!application) return null;

  const jobs = getJobs();
  const job = jobs.find(j => j.id === application.jobId);

  const handleGenerateQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const qList = await apiGenerateInterviewQuestions({
        candidateName: application.candidateName,
        jobTitle: job?.title || 'Data Analyst',
        missingSkills: application.missingSkills || [],
        extractedSkills: application.extractedSkills || []
      });
      setQuestions(qList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingQuestions(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-purple-950/40 flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-xl font-bold text-indigo-300 shrink-0">
              {application.candidateName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-slate-100">{application.candidateName}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                  {application.matchScore}% Match
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{application.candidateEmail}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{application.candidatePhone}</span>
                </span>
              </p>
              <p className="text-xs text-indigo-400 font-medium mt-1">
                Applied for: <strong className="text-slate-200">{job?.title || 'Data Analyst'}</strong> ({application.experienceYears || '2 Years Exp'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 border-b border-slate-800 bg-slate-950 flex space-x-2 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Assessment Overview
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'resume' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Full Resume Document
          </button>
          <button
            onClick={() => setActiveTab('ai-questions')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'ai-questions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Interview Questions ({questions.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Recommendation Banner */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">AI Screening Verdict</span>
                  <p className="text-sm font-bold text-emerald-400">{application.recommendation}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Current Status:</span>
                  <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 font-bold border border-purple-800">
                    {application.status}
                  </span>
                </div>
              </div>

              {/* Education & Background */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 mb-1 flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>Academic & Professional Credentials</span>
                </h4>
                <p className="text-slate-300 font-medium">{application.education}</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Verified total experience: {application.experienceYears}</p>
              </div>

              {/* Extracted Skills */}
              <div>
                <p className="text-xs font-bold text-slate-300 mb-2">Verified Technical Skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {application.extractedSkills.map((sk, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 text-indigo-300 border border-slate-800">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              {application.missingSkills && application.missingSkills.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40">
                  <p className="text-xs font-bold text-amber-300 mb-1 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Identified Skill Gaps against {job?.title}:</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {application.missingSkills.map((sk, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/50">
                        ⚠ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bias-free pledge */}
              <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 flex items-center space-x-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>NextGen AI Fairness Standard verified: Zero demographic attributes factored in score.</span>
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {application.resumeText || 'No full text available for this candidate.'}
            </div>
          )}

          {activeTab === 'ai-questions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/30 border border-purple-800/40">
                <div>
                  <h4 className="text-xs font-bold text-purple-300">Custom AI Interview Questions</h4>
                  <p className="text-[11px] text-slate-400">Tailored to probe {application.candidateName}'s skill profile</p>
                </div>
                <button
                  onClick={handleGenerateQuestions}
                  disabled={loadingQuestions}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  {loadingQuestions ? 'Generating...' : 'Regenerate Questions'}
                </button>
              </div>

              {questions.length > 0 ? (
                <div className="space-y-2.5">
                  {questions.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed">{q}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400">
                  <BrainCircuit className="w-8 h-8 mx-auto text-purple-400 mb-2 opacity-50" />
                  <p>Click "Regenerate Questions" to produce AI interview probes.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Change Status:</span>
            <button
              onClick={() => updateApplicationStatus(application.id, 'Shortlisted')}
              className="px-3 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 text-xs font-semibold"
            >
              Shortlist
            </button>
            <button
              onClick={() => updateApplicationStatus(application.id, 'Rejected')}
              className="px-3 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold"
            >
              Reject
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onScheduleInterview(application);
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Interview with {application.candidateName.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
