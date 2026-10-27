import React, { useState } from 'react';
import {
  PlusCircle,
  Briefcase,
  Sparkles,
  Building,
  MapPin,
  DollarSign,
  Layers,
  GraduationCap,
  FileText,
  CheckCircle2,
  ListPlus
} from 'lucide-react';
import { JobPosting } from '../../types';
import { createJob, getCurrentUser } from '../../services/apiService';

interface PostJobProps {
  onJobCreated: () => void;
}

export const PostJob: React.FC<PostJobProps> = ({ onJobCreated }) => {
  const currentUser = getCurrentUser();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering & Data');
  const [company, setCompany] = useState(currentUser?.companyName || 'Nexus AI Labs');
  const [location, setLocation] = useState('San Francisco, CA (Hybrid / Remote Option)');
  const [jobType, setJobType] = useState<JobPosting['jobType']>('Full-time');
  const [experienceRequired, setExperienceRequired] = useState('2-4 Years');
  const [salaryRange, setSalaryRange] = useState('$110,000 - $145,000 / year');
  const [requiredSkillsInput, setRequiredSkillsInput] = useState('Python, SQL, Power BI, Pandas, Applied Statistics');
  const [preferredSkillsInput, setPreferredSkillsInput] = useState('Tableau, Snowflake, dbt, Docker');
  const [education, setEducation] = useState("Bachelor's or Master's in Computer Science, Data Science, Math or related STEM field");
  const [description, setDescription] = useState('We are looking for an exceptional engineer/analyst to build robust data pipelines, interactive executive dashboards, and drive business decision-making with high-impact insights.');
  const [openings, setOpenings] = useState(2);
  const [successMsg, setSuccessMsg] = useState(false);

  const applyTemplate = (tpl: string) => {
    if (tpl === 'data-analyst') {
      setTitle('Senior Data Analyst (BI & Growth)');
      setDepartment('Data Analytics & Growth');
      setRequiredSkillsInput('Python, SQL, Power BI, Pandas, Data Visualization, Applied Statistics');
      setPreferredSkillsInput('Tableau, Snowflake, dbt, A/B Testing');
      setSalaryRange('$95,000 - $130,000 / year');
      setExperienceRequired('1-3 Years');
      setDescription('Transform enterprise transactional data into actionable growth strategies, build executive Power BI KPI dashboards, and write complex analytical queries.');
    } else if (tpl === 'full-stack') {
      setTitle('Full Stack Software Engineer');
      setDepartment('Core Product Engineering');
      setRequiredSkillsInput('React, TypeScript, Node.js, PostgreSQL, Docker, REST APIs');
      setPreferredSkillsInput('Tailwind CSS, GraphQL, Kubernetes, AWS');
      setSalaryRange('$120,000 - $155,000 / year');
      setExperienceRequired('2-4 Years');
      setDescription('Design scalable full-stack web applications with React 19, TypeScript, and Node.js microservices. Build high-concurrency database schemas with PostgreSQL.');
    } else if (tpl === 'aiml') {
      setTitle('AI / Machine Learning Systems Engineer');
      setDepartment('Applied AI & Foundation Models');
      setRequiredSkillsInput('Python, PyTorch, LLM Fine-Tuning, MLOps, FastAPI, Vector Databases');
      setPreferredSkillsInput('LangChain, CUDA, Docker, HuggingFace');
      setSalaryRange('$140,000 - $185,000 / year');
      setExperienceRequired('2-5 Years');
      setDescription('Lead development of domain-specific generative AI agents, vector retrieval search systems, and low-latency production inference pipelines.');
    } else if (tpl === 'devops') {
      setTitle('Cloud & DevOps Automation Architect');
      setDepartment('Platform Reliability');
      setRequiredSkillsInput('Kubernetes, Docker, Terraform, AWS, CI/CD Pipelines, Linux');
      setPreferredSkillsInput('Prometheus, Grafana, Go, Python Scripting');
      setSalaryRange('$130,000 - $165,000 / year');
      setExperienceRequired('3+ Years');
      setDescription('Architect multi-region Kubernetes clusters, automate continuous integration pipelines, and ensure 99.99% system reliability.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reqSkills = requiredSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const prefSkills = preferredSkillsInput.split(',').map(s => s.trim()).filter(Boolean);

    createJob({
      title,
      company,
      department,
      location,
      jobType,
      experienceRequired,
      salaryRange,
      requiredSkills: reqSkills,
      preferredSkills: prefSkills,
      education,
      description,
      openings: Number(openings),
      status: 'active',
      recruiterId: currentUser?.id || 'user-rec-1'
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onJobCreated();
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-1">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>CREATE JOB REQUISITION</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Post a New Job Opening</h1>
          <p className="text-xs text-slate-400">
            Define required competencies, salary ranges, and automatic AI screening criteria.
          </p>
        </div>

        {/* 1-Click Templates */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium">Quick Templates:</span>
          <button
            type="button"
            onClick={() => applyTemplate('data-analyst')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700"
          >
            Data Analyst
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('full-stack')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700"
          >
            Full Stack
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('aiml')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
          >
            AI / ML
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('devops')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700"
          >
            DevOps
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Job published successfully! AI resume screening taxonomy is active.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Job Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Data Analyst"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Growth & Analytics"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA (Hybrid)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Job Type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Experience Required</label>
            <input
              type="text"
              value={experienceRequired}
              onChange={(e) => setExperienceRequired(e.target.value)}
              placeholder="e.g. 1-3 Years"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Salary Range</label>
            <input
              type="text"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              placeholder="e.g. $95,000 - $130,000 / year"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Number of Openings</label>
            <input
              type="number"
              min="1"
              max="50"
              value={openings}
              onChange={(e) => setOpenings(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between mb-1">
            <span>Required Skills (Mandatory for AI Screening Score) *</span>
            <span className="text-[11px] text-indigo-400 font-normal">Comma-separated</span>
          </label>
          <input
            type="text"
            value={requiredSkillsInput}
            onChange={(e) => setRequiredSkillsInput(e.target.value)}
            placeholder="e.g. Python, SQL, Power BI, Pandas, Applied Statistics"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-indigo-300 focus:outline-none focus:border-indigo-500 font-mono"
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            Preferred / Bonus Skills
          </label>
          <input
            type="text"
            value={preferredSkillsInput}
            onChange={(e) => setPreferredSkillsInput(e.target.value)}
            placeholder="e.g. Tableau, Snowflake, dbt, Docker"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            Education / Academic Criteria
          </label>
          <input
            type="text"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            Job Description & Responsibilities
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Publish Job & Initialize AI Screening</span>
        </button>
      </form>
    </div>
  );
};
