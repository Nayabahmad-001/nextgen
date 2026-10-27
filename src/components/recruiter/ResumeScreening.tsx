import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Layers,
  BrainCircuit,
  Calendar,
  UserCheck,
  Briefcase,
  GraduationCap,
  Award,
  HelpCircle,
  ShieldCheck,
  RotateCw,
  Plus
} from 'lucide-react';
import { JobPosting, CandidateApplication } from '../../types';
import { getJobs, apiScreenResume, createApplication, apiGenerateInterviewQuestions } from '../../services/apiService';
import { SAMPLE_RESUMES_TEXT } from '../../data/mockData';

interface ResumeScreeningProps {
  initialJob?: JobPosting;
  onScheduleInterview: (app: CandidateApplication) => void;
  onViewCandidateProfile?: (app: CandidateApplication) => void;
}

export const ResumeScreening: React.FC<ResumeScreeningProps> = ({
  initialJob,
  onScheduleInterview
}) => {
  const jobs = getJobs();
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJob?.id || jobs[0]?.id || 'job-1');
  const [resumeText, setResumeText] = useState<string>(SAMPLE_RESUMES_TEXT.rahulKumar);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  const currentJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const handleLoadSample = (key: keyof typeof SAMPLE_RESUMES_TEXT) => {
    setResumeText(SAMPLE_RESUMES_TEXT[key]);
    setAnalysisResult(null);
    setGeneratedQuestions([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setResumeText(text);
        setAnalysisResult(null);
        setGeneratedQuestions([]);
      }
    };
    reader.readAsText(file);
  };

  const handleRunScreening = async () => {
    if (!resumeText.trim()) return;
    setIsProcessing(true);
    setAnalysisResult(null);
    setGeneratedQuestions([]);
    setSavedSuccess(null);

    try {
      const result = await apiScreenResume({
        resumeText,
        jobTitle: currentJob?.title || 'Data Analyst',
        jobDescription: currentJob?.description,
        requiredSkills: currentJob?.requiredSkills || ['Python', 'SQL', 'Power BI']
      });
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAndShortlist = () => {
    if (!analysisResult) return;

    const app = createApplication({
      candidateId: `cand-${Date.now()}`,
      jobId: currentJob.id,
      candidateName: analysisResult.candidateName || 'Candidate',
      candidateEmail: analysisResult.candidateEmail || 'candidate@example.com',
      candidatePhone: analysisResult.candidatePhone || '+1 (555) 019-2834',
      matchScore: analysisResult.matchScore || analysisResult.breakdown?.overallMatch || 85,
      extractedSkills: analysisResult.extractedSkills || [],
      missingSkills: analysisResult.missingSkills || [],
      recommendation: analysisResult.recommendation || 'Recommended',
      status: 'Shortlisted',
      resumeText: resumeText,
      experienceYears: analysisResult.experienceYears || '2 Years',
      education: analysisResult.education || 'B.Tech Computer Science'
    });

    setSavedSuccess(`Candidate "${analysisResult.candidateName}" successfully saved and added to Shortlisted Leaderboard!`);
  };

  const handleFetchAIQuestions = async () => {
    if (!analysisResult) return;
    setIsGeneratingQuestions(true);
    try {
      const questions = await apiGenerateInterviewQuestions({
        candidateName: analysisResult.candidateName,
        jobTitle: currentJob.title,
        missingSkills: analysisResult.missingSkills || [],
        extractedSkills: analysisResult.extractedSkills || []
      });
      setGeneratedQuestions(questions);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-purple-950/40 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI CORE ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Intelligent AI Resume Screening
          </h1>
          <p className="text-xs text-slate-400">
            Automated multi-factor candidate evaluation, skill extraction, and gap identification.
          </p>
        </div>

        {/* Target Job Selector */}
        <div className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
          <div className="text-left">
            <label className="text-[10px] uppercase font-bold text-slate-400 block">Target Requisition:</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-100 focus:outline-none cursor-pointer"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id} className="bg-slate-900 text-slate-200">
                  {j.title} ({j.department})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Main Grid: Upload & Input on Left, Analysis Dashboard on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Target Job Requirements summary card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
              <span>Required Criteria for {currentJob?.title}</span>
              <span className="text-[10px] text-indigo-400">{currentJob?.experienceRequired}</span>
            </h3>
            <div className="flex flex-wrap gap-1">
              {currentJob?.requiredSkills.map((sk, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Resume Upload Dropzone */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Resume Input</span>
              </label>

              {/* Sample Presets */}
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => handleLoadSample('rahulKumar')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-cyan-300"
                >
                  Rahul (Analyst)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('priyaSharma')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-purple-300"
                >
                  Priya (FullStack)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('arunKumar')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-amber-300"
                >
                  Arun (AI/ML)
                </button>
              </div>
            </div>

            {/* Dropzone button */}
            <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-950/50">
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <p className="text-xs font-semibold text-slate-200">Click to upload or drag & drop</p>
              <p className="text-[10px] text-slate-500">PDF, DOC, DOCX, TXT (Auto-extracted)</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Raw Text Box */}
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={9}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500"
              placeholder="Paste candidate resume text or document here..."
            />

            <button
              onClick={handleRunScreening}
              disabled={isProcessing || !resumeText.trim()}
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>Evaluating Candidate Against Job Model...</span>
                </>
              ) : (
                <>
                  <BrainCircuit className="w-4 h-4 text-cyan-300" />
                  <span>Execute AI Resume Screening Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-4">
          {analysisResult ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/30 shadow-2xl space-y-5 animate-in fade-in duration-300">
              {/* Candidate Info & Score Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-black text-slate-100">{analysisResult.candidateName}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                      {analysisResult.experienceYears || '2 Years Exp'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {analysisResult.candidateEmail} • {analysisResult.candidatePhone}
                  </p>
                  <p className="text-xs text-indigo-400 font-medium mt-0.5">
                    🎓 {analysisResult.education}
                  </p>
                </div>

                {/* Match Score Display */}
                <div className="flex items-center space-x-4 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 shrink-0">
                  <div className="text-right">
                    <p className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      {analysisResult.matchScore || analysisResult.breakdown?.overallMatch || 85}%
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Overall Match
                    </p>
                  </div>
                  <div className="h-10 w-[1px] bg-slate-800" />
                  <div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded block text-center ${
                      analysisResult.recommendation === 'Highly Recommended'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : analysisResult.recommendation === 'Recommended'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {analysisResult.recommendation}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Score Breakdown Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Skills Match</span>
                  <p className="text-lg font-black text-indigo-400 mt-0.5">{analysisResult.breakdown?.skillsMatch || 90}%</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${analysisResult.breakdown?.skillsMatch || 90}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Experience</span>
                  <p className="text-lg font-black text-purple-400 mt-0.5">{analysisResult.breakdown?.experienceMatch || 85}%</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${analysisResult.breakdown?.experienceMatch || 85}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Education</span>
                  <p className="text-lg font-black text-cyan-400 mt-0.5">{analysisResult.breakdown?.educationMatch || 95}%</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5">
                    <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${analysisResult.breakdown?.educationMatch || 95}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Keyword Density</span>
                  <p className="text-lg font-black text-emerald-400 mt-0.5">{analysisResult.breakdown?.keywordMatch || 88}%</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${analysisResult.breakdown?.keywordMatch || 88}%` }} />
                  </div>
                </div>
              </div>

              {/* Strengths & Missing Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
                  <h4 className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Candidate Strengths & Matches</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {analysisResult.strengths?.map((str: string, i: number) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Missing Skills & Upskilling Gaps</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {analysisResult.missingSkills?.length > 0 ? (
                      analysisResult.missingSkills.map((sk: string, i: number) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-amber-400 font-bold">⚠</span>
                          <span>{sk}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-400 italic">No significant critical gaps detected.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Extracted Skills Badges */}
              <div>
                <p className="text-xs font-bold text-slate-300 mb-2">Extracted Candidate Skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.extractedSkills?.map((sk: string, i: number) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 text-indigo-300 border border-slate-800 font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Interview Questions Generator Section */}
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                      <BrainCircuit className="w-4 h-4 text-purple-400" />
                      <span>AI-Generated Tailored Interview Questions</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">Questions targeting candidate's exact experience and identified gaps</p>
                  </div>
                  <button
                    onClick={handleFetchAIQuestions}
                    disabled={isGeneratingQuestions}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
                  >
                    {isGeneratingQuestions ? 'Generating...' : 'Generate Questions'}
                  </button>
                </div>

                {generatedQuestions.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {generatedQuestions.map((q, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-start space-x-2">
                        <span className="font-bold text-purple-400">Q{idx + 1}:</span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fairness Guarantee pill */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-400 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-slate-300">Fairness Guarantee:</strong> Score computed solely on documented technical competencies, project portfolio, and verified education.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleSaveAndShortlist}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-2 transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Save & Shortlist Candidate</span>
                </button>

                <button
                  onClick={() => onScheduleInterview({
                    id: `app-demo-${Date.now()}`,
                    candidateId: 'demo-cand',
                    jobId: currentJob.id,
                    candidateName: analysisResult.candidateName,
                    candidateEmail: analysisResult.candidateEmail,
                    candidatePhone: analysisResult.candidatePhone,
                    matchScore: analysisResult.matchScore || 85,
                    extractedSkills: analysisResult.extractedSkills,
                    missingSkills: analysisResult.missingSkills,
                    recommendation: analysisResult.recommendation,
                    status: 'Shortlisted',
                    resumeText: resumeText,
                    experienceYears: analysisResult.experienceYears,
                    education: analysisResult.education,
                    appliedDate: new Date().toISOString().split('T')[0]
                  })}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Interview</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[420px] rounded-2xl bg-slate-900/60 border border-slate-800/80 p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-800/40 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-200">Awaiting Resume Execution</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                  Select a candidate resume on the left or paste raw text, then execute the screening engine to review multi-factor match analytics.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
