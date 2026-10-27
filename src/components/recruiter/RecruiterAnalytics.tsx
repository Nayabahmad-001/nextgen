import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  Trophy,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { getJobs, getApplications, getInterviews } from '../../services/apiService';

export const RecruiterAnalytics: React.FC = () => {
  const jobs = getJobs();
  const applications = getApplications();
  const interviews = getInterviews();

  // 1. Applications per job data
  const appPerJobData = jobs.map(j => ({
    name: j.title.split(' ')[0] + ' ' + (j.title.split(' ')[1] || ''),
    applicants: j.applicationsCount || 15,
    shortlisted: Math.round((j.applicationsCount || 15) * 0.35)
  }));

  // 2. Score distribution
  const scoreDistributionData = [
    { name: '90-100% (Exceptional)', value: 18, color: '#10b981' },
    { name: '80-89% (High Fit)', value: 34, color: '#6366f1' },
    { name: '70-79% (Moderate Fit)', value: 26, color: '#a855f7' },
    { name: '50-69% (Upskilling Required)', value: 16, color: '#f59e0b' },
    { name: '<50% (Low Match)', value: 6, color: '#ef4444' }
  ];

  // 3. Hiring Funnel
  const funnelData = [
    { stage: 'Applied', count: 100, drop: '100%' },
    { stage: 'AI Screened', count: 96, drop: '96%' },
    { stage: 'Shortlisted', count: 32, drop: '32%' },
    { stage: 'Interviewed', count: 18, drop: '18%' },
    { stage: 'Offers / Hired', count: 8, drop: '8%' }
  ];

  // 4. Monthly applicant trend
  const monthlyTrendData = [
    { month: 'Oct', applicants: 32, screened: 30, hired: 2 },
    { month: 'Nov', applicants: 48, screened: 45, hired: 4 },
    { month: 'Dec', applicants: 42, screened: 40, hired: 3 },
    { month: 'Jan', applicants: 65, screened: 62, hired: 5 },
    { month: 'Feb', applicants: 85, screened: 83, hired: 7 },
    { month: 'Mar', applicants: 110, screened: 108, hired: 9 }
  ];

  // 5. In-Demand Skills Frequency
  const skillsDemandData = [
    { skill: 'Python', count: 48, demand: '96%' },
    { skill: 'SQL', count: 42, demand: '84%' },
    { skill: 'React / TypeScript', count: 38, demand: '76%' },
    { skill: 'Power BI', count: 35, demand: '70%' },
    { skill: 'PyTorch / ML', count: 28, demand: '56%' },
    { skill: 'Docker & AWS', count: 26, demand: '52%' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>EXECUTIVE TALENT INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Recruitment Analytics & Insights</h1>
          <p className="text-xs text-slate-400">
            Real-time pipeline metrics, conversion rates, score distributions, and skill demand.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-emerald-400 font-bold">
          <TrendingUp className="w-4 h-4" />
          <span>+24.5% Screening Velocity vs Manual ATS</span>
        </div>
      </div>

      {/* Chart Row 1: Applications by Job & Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Applications per job */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Applications vs Shortlists by Requisition</h3>
              <p className="text-[11px] text-slate-400">Candidate volume distribution across open roles</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appPerJobData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="applicants" fill="#6366f1" radius={[4, 4, 0, 0]} name="Total Applicants" />
                <Bar dataKey="shortlisted" fill="#a855f7" radius={[4, 4, 0, 0]} name="Shortlisted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Distribution */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">AI Match Score Breakdown</h3>
            <p className="text-[11px] text-slate-400">Candidate competency tiers across all screened resumes</p>
          </div>

          <div className="h-52 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {scoreDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px] border-t border-slate-800 pt-2">
            {scoreDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}: <strong>{item.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Row 2: Hiring Funnel & Monthly Growth Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Funnel */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-100">Recruitment Funnel Conversion</h3>
            <p className="text-[11px] text-slate-400">Stage conversion velocity from application to final offer</p>
          </div>

          <div className="space-y-3">
            {funnelData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{item.stage}</span>
                  <span className="text-indigo-400 font-bold">{item.count} Candidates ({item.drop})</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
                    style={{ width: `${item.count}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-100">Monthly Sourcing & Hiring Velocity</h3>
            <p className="text-[11px] text-slate-400">Growth trajectory over the past 6 months</p>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="applicants" stroke="#6366f1" fillOpacity={1} fill="url(#colorApplicants)" name="Applicants" />
                <Area type="monotone" dataKey="hired" stroke="#10b981" fillOpacity={1} fill="url(#colorHired)" name="Hired Offers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Most In-Demand Skills */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-slate-100">Most Demanded Skills in Active Job Requisitions</h3>
          <p className="text-[11px] text-slate-400">Technical competency frequency indexed by AI requisition parser</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {skillsDemandData.map((item, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs font-bold text-indigo-300 truncate">{item.skill}</span>
              <div className="mt-2">
                <p className="text-xl font-black text-slate-100">{item.demand}</p>
                <p className="text-[10px] text-slate-400">Appears in {item.count} jobs</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
