import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  TrendingUp,
  Award,
  Zap,
  ShieldCheck,
  Compass,
  Briefcase,
  Users,
  BarChart3,
  Calendar,
  Layers,
  ChevronRight,
  Code2,
  BrainCircuit,
  Target,
  FileCheck2,
  Search,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import { UserRole } from '../../types';
import { SAMPLE_RESUMES_TEXT } from '../../data/mockData';
import { apiScreenResume } from '../../services/apiService';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register', defaultRole?: UserRole) => void;
  onExploreDirect: (role: UserRole) => void;
  onOpenFairness: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onExploreDirect,
  onOpenFairness
}) => {
  const [demoResume, setDemoResume] = useState<string>(SAMPLE_RESUMES_TEXT.rahulKumar);
  const [selectedRole, setSelectedRole] = useState<'Data Analyst' | 'Full Stack Developer' | 'AI/ML Engineer'>('Data Analyst');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [demoResult, setDemoResult] = useState<any>(null);

  const handleTestScreening = async () => {
    setIsAnalyzing(true);
    setDemoResult(null);
    try {
      const res = await apiScreenResume({
        resumeText: demoResume,
        jobTitle: selectedRole,
        requiredSkills: selectedRole === 'Data Analyst' ? ['Python', 'SQL', 'Power BI', 'Pandas'] : selectedRole === 'Full Stack Developer' ? ['React', 'TypeScript', 'Node.js', 'PostgreSQL'] : ['Python', 'PyTorch', 'LLM Fine-Tuning']
      });
      setDemoResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-150">
      {/* Hero Section */}
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-medium mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Recruitment & Career Growth Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white max-w-3xl mx-auto leading-tight">
          Smarter hiring for recruiters, clearer growth for candidates.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Screen resumes objectively, identify skill gaps with precision, and follow personalized learning roadmaps.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            id="hero-recruiter-btn"
            onClick={() => onExploreDirect('recruiter')}
            className="px-5 py-3 rounded-lg font-semibold text-sm bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 shadow-sm flex items-center space-x-2 transition-colors"
          >
            <Briefcase className="w-4 h-4" />
            <span>Recruiter Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-candidate-btn"
            onClick={() => onExploreDirect('candidate')}
            className="px-5 py-3 rounded-lg font-semibold text-sm bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-white dark:border-neutral-700 flex items-center space-x-2 transition-colors shadow-sm"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Candidate Portal</span>
          </button>

          <button
            id="hero-login-btn"
            onClick={() => onOpenAuth('login')}
            className="px-4 py-3 rounded-lg font-medium text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            Sign In
          </button>
        </div>

        {/* Quick Metrics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center shadow-sm">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">94%</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Screening Accuracy</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center shadow-sm">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">&lt; 3s</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Parse Time</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center shadow-sm">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">100%</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Objective Standard</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center shadow-sm">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">5-Stage</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Learning Roadmaps</p>
          </div>
        </div>
      </section>

      {/* Interactive Live Resume Screening Preview Box */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-5 mb-5">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold mb-1 border border-neutral-200 dark:border-neutral-700">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Live Screening Engine</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                Intelligent Resume Analysis & Scoring
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Sample:</span>
              <button
                onClick={() => {
                  setDemoResume(SAMPLE_RESUMES_TEXT.rahulKumar);
                  setSelectedRole('Data Analyst');
                  setDemoResult(null);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                  demoResume === SAMPLE_RESUMES_TEXT.rahulKumar
                    ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950 dark:border-white'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-700'
                }`}
              >
                Rahul (Data Analyst)
              </button>
              <button
                onClick={() => {
                  setDemoResume(SAMPLE_RESUMES_TEXT.priyaSharma);
                  setSelectedRole('Full Stack Developer');
                  setDemoResult(null);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                  demoResume === SAMPLE_RESUMES_TEXT.priyaSharma
                    ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950 dark:border-white'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-700'
                }`}
              >
                Priya (Full Stack)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Input Resume text */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Resume Content</span>
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">Target:</span>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded px-2 py-1 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-neutral-400"
                  >
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="AI/ML Engineer">AI/ML Engineer</option>
                  </select>
                </div>
              </div>

              <textarea
                value={demoResume}
                onChange={(e) => setDemoResume(e.target.value)}
                rows={9}
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-xs font-mono text-neutral-800 dark:text-neutral-300 focus:border-neutral-400 dark:focus:border-neutral-600 focus:outline-none"
                placeholder="Paste resume text..."
              />

              <button
                id="run-demo-screening-btn"
                onClick={handleTestScreening}
                disabled={isAnalyzing}
                className="mt-3 w-full py-2.5 rounded-lg font-semibold text-xs bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 shadow-sm"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Analyzing Resume...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-4 h-4" />
                    <span>Run Screening Analysis</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Output Analysis Box */}
            <div className="lg:col-span-6 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 flex flex-col justify-between">
              {demoResult ? (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">{demoResult.candidateName}</h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{selectedRole}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-neutral-900 dark:text-white">
                        {demoResult.matchScore || demoResult.breakdown?.overallMatch || 92}%
                      </span>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium uppercase">Match Score</p>
                    </div>
                  </div>

                  {/* 4 Score Breakdown Bars */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white dark:bg-neutral-900 p-2 rounded border border-neutral-200 dark:border-neutral-800">
                      <div className="flex justify-between font-medium mb-1">
                        <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Skills</span>
                        <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{demoResult.breakdown?.skillsMatch}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1">
                        <div className="bg-neutral-900 dark:bg-neutral-100 h-1 rounded-full" style={{ width: `${demoResult.breakdown?.skillsMatch}%` }} />
                      </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-2 rounded border border-neutral-200 dark:border-neutral-800">
                      <div className="flex justify-between font-medium mb-1">
                        <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Experience</span>
                        <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{demoResult.breakdown?.experienceMatch}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1">
                        <div className="bg-neutral-900 dark:bg-neutral-100 h-1 rounded-full" style={{ width: `${demoResult.breakdown?.experienceMatch}%` }} />
                      </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-2 rounded border border-neutral-200 dark:border-neutral-800">
                      <div className="flex justify-between font-medium mb-1">
                        <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Education</span>
                        <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{demoResult.breakdown?.educationMatch}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1">
                        <div className="bg-neutral-900 dark:bg-neutral-100 h-1 rounded-full" style={{ width: `${demoResult.breakdown?.educationMatch}%` }} />
                      </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-2 rounded border border-neutral-200 dark:border-neutral-800">
                      <div className="flex justify-between font-medium mb-1">
                        <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Keywords</span>
                        <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{demoResult.breakdown?.keywordMatch}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1">
                        <div className="bg-neutral-900 dark:bg-neutral-100 h-1 rounded-full" style={{ width: `${demoResult.breakdown?.keywordMatch}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Recommendation badge */}
                  <div className="p-2.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">Recommendation:</span>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{demoResult.recommendation}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium border border-neutral-300 dark:border-neutral-700">
                      Top Match
                    </span>
                  </div>

                  {/* Extracted Skills */}
                  <div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">Detected Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {demoResult.extractedSkills?.slice(0, 6).map((sk: string, i: number) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <Sparkles className="w-6 h-6 text-neutral-400 dark:text-neutral-600" />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Click "Run Screening Analysis" to see instant scores.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Dual Value Proposition: For Recruiters & For Candidates */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recruiter Pillar */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium mb-3 border border-neutral-200 dark:border-neutral-700">
                <Briefcase className="w-3.5 h-3.5" />
                <span>For Recruiters</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                Find qualified candidates in seconds
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                Automate resume screening, rank applicants based on verified skills, and schedule interviews seamlessly.
              </p>

              <ul className="space-y-2 mb-6">
                {[
                  'Automated multi-factor resume parsing',
                  'Objective skill-based candidate ranking',
                  'Tailored AI interview questions generation',
                  'Hiring analytics and conversion tracking'
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-2 text-xs text-neutral-700 dark:text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onExploreDirect('recruiter')}
              className="w-full py-2.5 rounded-lg font-semibold text-xs bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <span>Explore Recruiter Tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Candidate Pillar */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium mb-3 border border-neutral-200 dark:border-neutral-700">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>For Candidates</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                Bridge skill gaps and land your target role
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                Audit your resume against market standards, identify missing skills, and follow structured 5-stage roadmaps.
              </p>

              <ul className="space-y-2 mb-6">
                {[
                  'AI resume score and actionable feedback',
                  'Detailed skill gap radar analysis',
                  '5-stage structured learning roadmap',
                  'Curated project ideas and matched jobs'
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-2 text-xs text-neutral-700 dark:text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onExploreDirect('candidate')}
              className="w-full py-2.5 rounded-lg font-semibold text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white dark:border-neutral-700 flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Explore Candidate Tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* AI Fairness & Ethics Banner */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start space-x-3.5">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Ethical & Bias-Free AI Recruitment Standard
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                Evaluation algorithms focus exclusively on objective skills, verified experience, and documented competencies.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenFairness}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 transition-colors shrink-0"
          >
            Fairness Policy
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">NextGen Hiring AI</span>
          </div>
          <div className="flex items-center space-x-5">
            <button onClick={onOpenFairness} className="hover:text-neutral-900 dark:hover:text-neutral-200">AI Ethics</button>
            <button onClick={() => onOpenAuth('login')} className="hover:text-neutral-900 dark:hover:text-neutral-200">Sign In</button>
            <button onClick={() => onOpenAuth('register')} className="hover:text-neutral-900 dark:hover:text-neutral-200">Register</button>
          </div>
          <p>© 2026 NextGen Hiring AI</p>
        </div>
      </footer>
    </div>
  );
};
