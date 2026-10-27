import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Eye,
  EyeOff,
  Briefcase,
  GraduationCap,
  Mail,
  Lock,
  User as UserIcon,
  Building,
  Phone,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { registerUser, setCurrentUser, getUsers } from '../../services/apiService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  defaultRole?: UserRole;
  onSuccess: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  defaultRole = 'candidate',
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<UserRole>(defaultRole);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState('');
  const [education, setEducation] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Entry-Level / 0-2 Years');
  const [targetRole, setTargetRole] = useState('Data Analyst');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const allUsers = getUsers();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    // Check if user exists in database
    const matched = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      onSuccess(matched.role);
      onClose();
    } else {
      // Create user session on the fly for smooth testing
      const newUser = registerUser({
        name: email.split('@')[0] || 'User',
        email,
        role: role,
        targetRole: role === 'candidate' ? 'Data Analyst' : undefined,
        companyName: role === 'recruiter' ? 'Tech Talent Corp' : undefined
      });
      onSuccess(newUser.role);
      onClose();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !email || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password !== confirmPassword && confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const skillsArray = skillsInput
      ? skillsInput.split(',').map(s => s.trim()).filter(Boolean)
      : ['Python', 'SQL', 'Problem Solving'];

    const newUser = registerUser({
      name: fullName,
      email,
      role,
      phone,
      companyName: role === 'recruiter' ? companyName : undefined,
      organization: role === 'recruiter' ? organization : undefined,
      department: role === 'recruiter' ? department : undefined,
      education: role === 'candidate' ? education : undefined,
      skills: role === 'candidate' ? skillsArray : undefined,
      experienceLevel: role === 'candidate' ? experienceLevel : undefined,
      targetRole: role === 'candidate' ? targetRole : undefined
    });

    onSuccess(newUser.role);
    onClose();
  };

  const handleGoogleLogin = () => {
    const defaultGoogleUser = allUsers.find(u => u.role === role) || allUsers[0];
    setCurrentUser(defaultGoogleUser);
    onSuccess(defaultGoogleUser.role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                <span>NEXTGEN</span>
                <span className="text-neutral-500 dark:text-neutral-400">HIRING AI</span>
              </h2>
              <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                “Hire Smarter. Learn Smarter. Grow Faster.”
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-neutral-200/70 dark:bg-neutral-950 p-1 border border-neutral-300 dark:border-neutral-800 mt-4">
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-white dark:bg-neutral-900">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Role Selection Tabs */}
          <div>
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2 block">
              Select Your Role:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                  role === 'candidate'
                    ? 'border-neutral-900 bg-neutral-100 dark:border-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                    : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${role === 'candidate' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold">Candidate / Student</p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Roadmap & Job Matching</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                  role === 'recruiter'
                    ? 'border-neutral-900 bg-neutral-100 dark:border-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                    : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${role === 'recruiter' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}>
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold">Recruiter / HR</p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Screening & Ranking</p>
                </div>
              </button>
            </div>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white focus:ring-neutral-500 bg-neutral-50 dark:bg-neutral-950"
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-neutral-900 dark:text-neutral-100 hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 shadow-sm transition-all"
              >
                Sign In to NextGen AI
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800"></div>
                <span className="flex-shrink mx-3 text-[11px] text-neutral-400 font-medium">OR CONTINUE WITH</span>
                <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Kumar"
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@work.com"
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                    />
                  </div>
                </div>
              </div>

              {/* CANDIDATE SPECIFIC FIELDS */}
              {role === 'candidate' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Education & Degree
                    </label>
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science, IIT Delhi"
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Target Career Role
                      </label>
                      <select
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                      >
                        <option value="Data Analyst">Data Analyst</option>
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="Software Developer">Software Developer</option>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="AI/ML Engineer">AI/ML Engineer</option>
                        <option value="Cloud Engineer">Cloud Engineer</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                        <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                        <option value="Business Analyst">Business Analyst</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Experience Level
                      </label>
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                      >
                        <option value="Fresher / 2025-2026 Grad">Fresher / 2025-2026 Grad</option>
                        <option value="Entry-Level / 1-2 Years">Entry-Level / 1-2 Years</option>
                        <option value="Mid-Level / 3-5 Years">Mid-Level / 3-5 Years</option>
                        <option value="Senior / 5+ Years">Senior / 5+ Years</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Current Skills (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      placeholder="e.g. Python, SQL, Excel, Pandas, Git"
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                    />
                  </div>
                </>
              )}

              {/* RECRUITER SPECIFIC FIELDS */}
              {role === 'recruiter' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Nexus AI Labs"
                        className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Organization
                      </label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Global Tech Group"
                        className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Talent Acquisition & Technical Recruiting"
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 shadow-sm transition-all"
              >
                Create {role === 'recruiter' ? 'Recruiter' : 'Candidate'} Account
              </button>
            </form>
          )}
        </div>

        {/* Forgot Password Sub-Modal */}
        {forgotPasswordOpen && (
          <div className="absolute inset-0 bg-white/95 dark:bg-neutral-950/95 z-20 p-6 flex flex-col justify-center animate-in fade-in">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">Reset Password</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Enter your registered email to receive an instant secure reset link.
            </p>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-neutral-900 dark:text-neutral-100 mx-auto" />
                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Reset instructions sent!</p>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">Check your inbox ({forgotEmail}) to choose a new password.</p>
                <button
                  onClick={() => { setForgotPasswordOpen(false); setForgotSuccess(false); }}
                  className="mt-2 px-4 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                />
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (forgotEmail) setForgotSuccess(true);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold"
                  >
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
