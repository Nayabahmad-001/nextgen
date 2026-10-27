import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  User,
  Mail,
  Phone,
  Save
} from 'lucide-react';
import { getCurrentUser, setCurrentUser } from '../../services/apiService';

export const CandidateProfileSkills: React.FC = () => {
  const [currentUser, setUser] = useState(getCurrentUser());
  const [name, setName] = useState(currentUser?.name || 'Rahul Kumar');
  const [email, setEmail] = useState(currentUser?.email || 'rahul.kumar@example.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [targetRole, setTargetRole] = useState(currentUser?.targetRole || 'Data Analyst');
  const [education, setEducation] = useState(currentUser?.education || 'B.Tech Computer Science, IIT Delhi');
  const [experienceLevel, setExperienceLevel] = useState(currentUser?.experienceLevel || 'Entry-Level / 1-2 Years');
  const [skills, setSkills] = useState<string[]>(currentUser?.skills || ['Python', 'SQL', 'Power BI', 'Pandas', 'Excel', 'Data Visualization']);
  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      name,
      email,
      phone,
      targetRole,
      education,
      experienceLevel,
      skills
    };

    setCurrentUser(updatedUser);
    setUser(updatedUser);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>CANDIDATE PORTFOLIO</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Profile & Skill Taxonomy</h1>
          <p className="text-xs text-slate-400">
            Manage your verified skills inventory, academic background, and target career goals.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-600/30 flex items-center space-x-2 self-start sm:self-auto transition-all"
        >
          <Save className="w-4 h-4 text-slate-950" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Profile & Skill Taxonomy updated successfully!</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Career & Academics */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Target Role & Education</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Target Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Data Analyst">Data Analyst</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Cloud Engineer">Cloud Engineer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Fresher / 2025-2026 Grad">Fresher / 2025-2026 Grad</option>
                <option value="Entry-Level / 1-2 Years">Entry-Level / 1-2 Years</option>
                <option value="Mid-Level / 3-5 Years">Mid-Level / 3-5 Years</option>
                <option value="Senior / 5+ Years">Senior / 5+ Years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Academic Degree & Institution</label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Skills Inventory */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Verified Skills Inventory ({skills.length})</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {skills.map((sk, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-cyan-300 group hover:border-rose-800 transition-colors"
              >
                <span>{sk}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(sk)}
                  className="text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add skill input */}
          <div className="pt-2 flex items-center space-x-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a new skill (e.g. Snowflake, Docker, PyTorch)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
