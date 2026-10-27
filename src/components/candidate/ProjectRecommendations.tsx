import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  BrainCircuit,
  Star,
  Github,
  BookOpen
} from 'lucide-react';
import { RecommendedProject } from '../../types';
import { getProjects, getCurrentUser, apiGenerateProjects } from '../../services/apiService';

export const ProjectRecommendations: React.FC = () => {
  const currentUser = getCurrentUser();
  const [projects, setProjects] = useState<RecommendedProject[]>(getProjects());
  const [filterRole, setFilterRole] = useState<string>(currentUser?.targetRole || 'Data Analyst');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [completedProjects, setCompletedProjects] = useState<string[]>(['proj-1']);

  const handleGenerateAIProjects = async () => {
    setIsGenerating(true);
    try {
      const newProjects = await apiGenerateProjects({
        targetRole: filterRole,
        missingSkills: ['Tableau', 'Snowflake', 'dbt', 'Pandas'],
        experienceLevel: currentUser?.experienceLevel || 'Entry-Level'
      });

      if (newProjects && newProjects.length > 0) {
        setProjects(newProjects);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleCompleteProject = (id: string) => {
    if (completedProjects.includes(id)) {
      setCompletedProjects(completedProjects.filter(p => p !== id));
    } else {
      setCompletedProjects([...completedProjects, id]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-bold mb-1">
            <Code2 className="w-3.5 h-3.5" />
            <span>PORTFOLIO CAPSTONES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Recommended Portfolio Projects
          </h1>
          <p className="text-xs text-slate-400">
            Real-world projects designed to eliminate your target skill gaps and build standout portfolio artifacts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-cyan-300 focus:outline-none"
          >
            <option value="Data Analyst">Data Analyst</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="AI/ML Engineer">AI/ML Engineer</option>
          </select>

          <button
            onClick={handleGenerateAIProjects}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Projects...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>AI Generate Ideas</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const isDone = completedProjects.includes(proj.id);
          return (
            <div
              key={proj.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-xl ${
                isDone
                  ? 'bg-emerald-950/10 border-emerald-800/40'
                  : 'bg-slate-900/90 border-slate-800 hover:border-purple-500/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    proj.difficulty === 'Beginner'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : proj.difficulty === 'Intermediate'
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      : 'bg-purple-950 text-purple-300 border border-purple-800'
                  }`}>
                    {proj.difficulty}
                  </span>

                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{proj.estimatedTime}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100">{proj.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

                {/* Tech Stack */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tech Stack:</p>
                  <div className="flex flex-wrap gap-1">
                    {proj.techStack.map((tech, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Deliverables */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Deliverables:</p>
                  <ul className="space-y-0.5 text-[11px] list-disc list-inside">
                    {proj.deliverables.map((del, i) => (
                      <li key={i} className="truncate">{del}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleCompleteProject(proj.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    isDone
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                </button>

                <a
                  href={proj.githubTemplateUrl || 'https://github.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center space-x-1 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Starter Repo</span>
                  <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
