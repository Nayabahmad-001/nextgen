import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Compass,
  MapPin,
  Code2,
  Briefcase,
  Layers,
  Award,
  UserCheck,
  Bell,
  Settings,
  LogOut,
  Sparkles,
  CheckSquare,
  BrainCircuit
} from 'lucide-react';
import { getCurrentUser, setCurrentUser } from '../../services/apiService';

interface CandidateSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNotifications: () => void;
  onOpenLanding: () => void;
  onOpenChatbot?: () => void;
}

export const CandidateSidebar: React.FC<CandidateSidebarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNotifications,
  onOpenLanding,
  onOpenChatbot
}) => {
  const currentUser = getCurrentUser();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mock-interview', label: 'Mock Interview & Aptitude', icon: BrainCircuit, badge: 'Live Prep' },
    { id: 'resume-score', label: 'AI Resume Score & Audit', icon: FileText, highlight: true },
    { id: 'skill-gap', label: 'Skill Gap & 5-Stage Roadmap', icon: Compass, badge: 'AI Roadmap' },
    { id: 'projects', label: 'Recommended Projects', icon: Code2 },
    { id: 'jobs', label: 'Matched Jobs', icon: Briefcase },
    { id: 'applications', label: 'My Applications', icon: CheckSquare },
    { id: 'chatbot', label: 'AI Concierge & Help', icon: Sparkles, isAction: true, isAiBadge: true },
    { id: 'notifications', label: 'Notifications', icon: Bell, isAction: true },
    { id: 'profile', label: 'My Profile & Skills', icon: Award }
  ];

  const handleLogout = () => {
    setCurrentUser(null);
    onOpenLanding();
  };

  return (
    <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden lg:flex transition-colors duration-150">
      <div className="space-y-5">
        {/* Candidate Identity Card */}
        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center space-x-3">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="Candidate"
            className="w-9 h-9 rounded-lg object-cover border border-neutral-300 dark:border-neutral-700"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">{currentUser?.name || 'Candidate'}</p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{currentUser?.targetRole || 'Data Analyst'}</p>
            <span className="inline-block text-[10px] font-medium px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 mt-0.5">
              Candidate
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isAction && item.id === 'notifications') {
                    onOpenNotifications();
                  } else if (item.isAction && item.id === 'chatbot') {
                    onOpenChatbot?.();
                  } else {
                    setCurrentTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-neutral-900 text-white font-semibold dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/70'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white dark:text-neutral-950' : 'text-neutral-500 dark:text-neutral-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'chatbot' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive
                      ? 'bg-neutral-800 text-neutral-200 dark:bg-neutral-200 dark:text-neutral-900'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}>
                    Help
                  </span>
                )}
                {item.badge && !isActive && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
