import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Layers,
  ArrowRight,
  Code2,
  ExternalLink,
  BrainCircuit,
  Award,
  CheckSquare,
  Square,
  Clock,
  Target
} from 'lucide-react';
import { LearningRoadmap, RoadmapStage, User } from '../../types';
import { getCurrentUser, getRoadmaps, updateRoadmapMilestone, apiGenerateRoadmap } from '../../services/apiService';
import { DEFAULT_ROADMAPS } from '../../data/mockData';

export const SkillGapRoadmap: React.FC = () => {
  const [currentUser, setUser] = useState<User | null>(getCurrentUser());
  const [roadmaps, setRoadmaps] = useState<LearningRoadmap[]>(getRoadmaps());
  const [selectedRole, setSelectedRole] = useState<string>(currentUser?.targetRole || 'Data Analyst');
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState<boolean>(false);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  const loadData = () => {
    setUser(getCurrentUser());
    setRoadmaps(getRoadmaps());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('nextgen_roadmaps_updated', loadData);
    return () => window.removeEventListener('nextgen_roadmaps_updated', loadData);
  }, []);

  const activeRoadmap = roadmaps.find(r => r.targetRole.toLowerCase().includes(selectedRole.toLowerCase())) || roadmaps[0];

  const toggleMilestone = (stageNumber: number, milestoneTitle: string) => {
    if (!activeRoadmap) return;
    const updated = updateRoadmapMilestone(activeRoadmap.id, stageNumber, milestoneTitle);
    if (updated) {
      setRoadmaps(getRoadmaps());
      setCelebrationMsg(`Milestone "${milestoneTitle}" updated! Learning progress refreshed.`);
      setTimeout(() => setCelebrationMsg(null), 2500);
    }
  };

  const handleGenerateCustomRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    try {
      const generated = await apiGenerateRoadmap({
        targetRole: selectedRole,
        currentSkills: currentUser?.skills || ['Python', 'SQL'],
        missingSkills: activeRoadmap?.missingSkills || ['Power BI', 'Tableau', 'Snowflake'],
        experienceLevel: currentUser?.experienceLevel || 'Entry-Level'
      });

      if (generated && generated.stages) {
        // Save to state and roadmaps
        const newRoadmap: LearningRoadmap = {
          id: `roadmap-${Date.now()}`,
          userId: currentUser?.id || 'cand-1',
          targetRole: selectedRole,
          matchScore: 85,
          requiredSkills: activeRoadmap?.requiredSkills || ['Python', 'SQL', 'Power BI', 'Pandas'],
          acquiredSkills: currentUser?.skills || ['Python', 'SQL', 'Pandas'],
          missingSkills: ['Tableau', 'Snowflake', 'dbt'],
          stages: generated.stages,
          updatedAt: new Date().toISOString()
        };

        const existing = getRoadmaps();
        const updatedList = [newRoadmap, ...existing.filter(r => r.targetRole !== selectedRole)];
        localStorage.setItem('nextgen_roadmaps', JSON.stringify(updatedList));
        setRoadmaps(updatedList);
        setCelebrationMsg(`Custom AI 5-Stage Roadmap generated for ${selectedRole}!`);
        setTimeout(() => setCelebrationMsg(null), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const totalMilestones = activeRoadmap?.stages.reduce((acc, s) => acc + s.milestones.length, 0) || 12;
  const completedMilestones = activeRoadmap?.stages.reduce((acc, s) => acc + s.milestones.filter(m => m.completed).length, 0) || 6;
  const progressPercent = Math.round((completedMilestones / Math.max(1, totalMilestones)) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-cyan-950/40 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>AI CAREER PATHWAY ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Skill Gap Radar & 5-Stage Roadmap
          </h1>
          <p className="text-xs text-slate-400">
            Identify exact missing competencies and follow an interactive, milestone-tracked learning roadmap.
          </p>
        </div>

        {/* Target Role Dropdown & Regenerate Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-950/90 border border-slate-800 p-2 rounded-xl">
            <label className="text-[10px] uppercase font-bold text-slate-400 block">Target Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-transparent text-xs font-bold text-cyan-300 focus:outline-none cursor-pointer"
            >
              <option value="Data Analyst">Data Analyst</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="AI/ML Engineer">AI/ML Engineer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
            </select>
          </div>

          <button
            onClick={handleGenerateCustomRoadmap}
            disabled={isGeneratingRoadmap}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 transition-all disabled:opacity-50 self-end"
          >
            {isGeneratingRoadmap ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Roadmap...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-3.5 h-3.5 text-cyan-300" />
                <span>AI Generate Custom Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {celebrationMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{celebrationMsg}</span>
        </div>
      )}

      {/* Skill Gap Matrix (Acquired vs Missing) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Acquired Skills */}
        <div className="md:col-span-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Acquired & Verified Skills</span>
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              {activeRoadmap?.acquiredSkills.length || 6} Verified
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Skills extracted and verified from your resume document:
          </p>

          <div className="flex flex-wrap gap-2">
            {activeRoadmap?.acquiredSkills.map((sk, idx) => (
              <span key={idx} className="text-xs px-3 py-1.5 rounded-xl bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 font-semibold flex items-center space-x-1.5">
                <span>✓</span>
                <span>{sk}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="md:col-span-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Target Role Skill Gaps (High Priority)</span>
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              {activeRoadmap?.missingSkills.length || 3} to Master
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Critical industry skills needed to elevate your match score to 95%+:
          </p>

          <div className="flex flex-wrap gap-2">
            {activeRoadmap?.missingSkills.map((sk, idx) => (
              <span key={idx} className="text-xs px-3 py-1.5 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-800/60 font-semibold flex items-center space-x-1.5">
                <span>⚠</span>
                <span>{sk}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px]">5-Stage Mastery Progress:</span>
            <h3 className="text-base font-bold text-slate-100">
              {completedMilestones} of {totalMilestones} Milestones Completed ({progressPercent}%)
            </h3>
          </div>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
            {progressPercent >= 100 ? '🎉 Ready for Senior Roles' : 'Stage 3 / 5 In Progress'}
          </span>
        </div>

        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 5-Stage Interactive Learning Roadmap Timeline */}
      <div className="space-y-5">
        {activeRoadmap?.stages.map((stage) => {
          const stageCompleted = stage.milestones.every(m => m.completed);
          return (
            <div
              key={stage.stageNumber}
              className={`p-6 rounded-2xl border transition-all shadow-xl ${
                stageCompleted
                  ? 'bg-slate-900/90 border-emerald-800/50'
                  : stage.stageNumber === 3
                  ? 'bg-slate-900 border-indigo-500/50 shadow-indigo-950/20'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              {/* Stage Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                    stageCompleted
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : stage.stageNumber === 3
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    0{stage.stageNumber}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                      <span>{stage.title}</span>
                      {stageCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{stage.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{stage.duration}</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    stageCompleted
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : stage.stageNumber === 3
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {stageCompleted ? 'COMPLETED' : stage.stageNumber === 3 ? 'ACTIVE STAGE' : 'PENDING'}
                  </span>
                </div>
              </div>

              {/* Milestones List with Interactive Checkbox */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Target Milestones & Interactive Skill Tracker:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stage.milestones.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      onClick={() => toggleMilestone(stage.stageNumber, m.title)}
                      className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                        m.completed
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200 hover:bg-emerald-950/30'
                          : 'bg-slate-950/70 border-slate-800 hover:border-indigo-500/40 text-slate-300'
                      }`}
                    >
                      <button type="button" className="mt-0.5 shrink-0">
                        {m.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-bold ${m.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                            {m.title}
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{m.description}</p>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900 text-[10px]">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800 font-mono">
                            {m.skill}
                          </span>
                          <a
                            href={m.resourceLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-0.5 font-semibold"
                          >
                            <span>Learn Resource</span>
                            <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
