import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  RotateCw,
  Award,
  Layers
} from 'lucide-react';
import { SAMPLE_RESUMES_TEXT } from '../../data/mockData';
import { getCurrentUser } from '../../services/apiService';

export const ResumeScoreAnalyzer: React.FC = () => {
  const user = getCurrentUser();
  const [resumeText, setResumeText] = useState<string>(SAMPLE_RESUMES_TEXT.rahulKumar);
  const [targetRole, setTargetRole] = useState<string>(user?.targetRole || 'Data Analyst');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<any>({
    overallScore: 88,
    grade: 'A - Highly Competitive',
    breakdown: {
      technicalSkills: 92,
      impactAndMetrics: 84,
      structureAndATS: 90,
      keywordDensity: 86
    },
    strengths: [
      'Strong technical skill foundation highlighted (Python, SQL, Power BI, Pandas)',
      'Clear educational credentials with relevant STEM coursework',
      'Demonstrated project applications with measurable scope (e.g. Sales KPI dashboard, Predictive Analytics)',
      'Clean single-column ATS-friendly chronological layout'
    ],
    improvements: [
      'Quantify results more explicitly: Replace "Built dashboard" with "Built interactive dashboard delivering 25% faster executive reporting"',
      'Add cloud data warehousing tools to target senior roles (e.g., Snowflake, BigQuery, dbt)',
      'Incorporate unit testing or code versioning workflows in software/analytics projects (e.g., Git, CI/CD)'
    ],
    suggestedKeywords: [
      'dbt',
      'Snowflake',
      'A/B Testing',
      'Statistical Modeling',
      'Data Cleansing',
      'ETL Pipelines'
    ]
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setResumeText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      // Dynamic score computation based on text length and keyword density
      const text = resumeText.toLowerCase();
      const hasPython = text.includes('python');
      const hasSql = text.includes('sql');
      const hasPowerBi = text.includes('power bi') || text.includes('tableau');
      const hasStats = text.includes('statistic') || text.includes('model') || text.includes('analysis');

      let calculatedScore = 75;
      if (hasPython) calculatedScore += 6;
      if (hasSql) calculatedScore += 7;
      if (hasPowerBi) calculatedScore += 5;
      if (hasStats) calculatedScore += 4;
      calculatedScore = Math.min(96, Math.max(65, calculatedScore));

      setAuditResult({
        overallScore: calculatedScore,
        grade: calculatedScore >= 90 ? 'A+ Elite Candidate' : calculatedScore >= 80 ? 'A Highly Competitive' : 'B Needs Targeted Polish',
        breakdown: {
          technicalSkills: Math.min(98, calculatedScore + 4),
          impactAndMetrics: Math.max(70, calculatedScore - 4),
          structureAndATS: Math.min(95, calculatedScore + 2),
          keywordDensity: calculatedScore
        },
        strengths: [
          `Solid domain terminology matched for ${targetRole}`,
          'Well-structured chronological progression and clean hierarchy',
          'Good inclusion of tools, libraries, and relevant platforms'
        ],
        improvements: [
          'Add percentage/dollar impact figures to every project bullet point',
          `Add 2-3 trending ${targetRole} technologies (e.g., dbt, cloud data warehouses, vector search)`,
          'Ensure action verbs lead every single bullet statement'
        ],
        suggestedKeywords: [
          'Data Governance',
          'Cloud Architecture',
          'Agile Methodologies',
          'Performance Tuning',
          'Cross-Functional Leadership'
        ]
      });
      setIsAuditing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI RESUME AUDIT & ATS BENCHMARK</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">AI Resume Score & Detailed Audit</h1>
          <p className="text-xs text-slate-400">
            Benchmark your resume against top industry standards and ATS hiring algorithms.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Target Benchmark:</span>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="bg-transparent text-xs font-bold text-cyan-300 focus:outline-none cursor-pointer"
          >
            <option value="Data Analyst">Data Analyst</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="AI/ML Engineer">AI/ML Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Cloud Engineer">Cloud Engineer</option>
          </select>
        </div>
      </div>

      {/* Grid: Editor & Audit Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Text / Upload */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Resume Document / Text</span>
              </label>

              <label className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center space-x-1">
                <Upload className="w-3 h-3" />
                <span>Upload PDF/DOC</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={16}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
              placeholder="Paste or upload your resume text here..."
            />

            <button
              onClick={handleRunAudit}
              disabled={isAuditing || !resumeText.trim()}
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-xl shadow-cyan-600/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isAuditing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Auditing Resume Metrics...</span>
                </>
              ) : (
                <>
                  <BrainCircuit className="w-4 h-4 text-cyan-300" />
                  <span>Recalculate AI Score & Audit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Detailed Score & Audit Report */}
        <div className="lg:col-span-7 space-y-4">
          {auditResult && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              {/* Overall Score Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Overall AI Readiness Score
                  </span>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                      {auditResult.overallScore}/100
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {auditResult.grade}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Target Role Fit:</span>
                  <p className="text-sm font-bold text-cyan-300">{targetRole}</p>
                </div>
              </div>

              {/* 4 Pillars Breakdown */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-400">Technical Depth</span>
                    <span className="text-indigo-400 font-bold">{auditResult.breakdown.technicalSkills}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${auditResult.breakdown.technicalSkills}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-400">Quantified Impact</span>
                    <span className="text-purple-400 font-bold">{auditResult.breakdown.impactAndMetrics}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${auditResult.breakdown.impactAndMetrics}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-400">ATS Layout & Parsing</span>
                    <span className="text-cyan-400 font-bold">{auditResult.breakdown.structureAndATS}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full">
                    <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${auditResult.breakdown.structureAndATS}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-400">Keyword Density</span>
                    <span className="text-emerald-400 font-bold">{auditResult.breakdown.keywordDensity}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${auditResult.breakdown.keywordDensity}%` }} />
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                <h4 className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Key Resume Strengths</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {auditResult.strengths.map((str: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable Improvement Suggestions */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                <h4 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Actionable Optimization Recommendations</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {auditResult.improvements.map((imp: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">💡</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggested High-Impact Keywords */}
              <div>
                <p className="text-xs font-bold text-slate-300 mb-2">Recommended Keywords to Include:</p>
                <div className="flex flex-wrap gap-1.5">
                  {auditResult.suggestedKeywords.map((kw: string, i: number) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 text-cyan-300 border border-slate-800 font-mono">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
