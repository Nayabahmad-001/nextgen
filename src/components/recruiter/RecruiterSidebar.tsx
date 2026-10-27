import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  FileCheck2,
  Trophy,
  Users,
  Calendar,
  BarChart3,
  Bell,
  Settings,
  User,
  LogOut,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../types';
import { getCurrentUser, setCurrentUser } from '../../services/apiService';

interface RecruiterSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNotifications: () => void;
  onOpenLanding: () => void;
  onOpenChatbot?: () => void;
}

export const RecruiterSidebar: React.FC<RecruiterSidebarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNotifications,
  onOpenLanding,
  onOpenChatbot
}) => {
  const currentUser = getCurrentUser();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'post-job', label: 'Post Job', icon: PlusCircle, badge: 'New' },
    { id: 'manage-jobs', label: 'Manage Jobs', icon: Briefcase },
    { id: 'screening', label: 'AI Resume Screening', icon: FileCheck2, highlight: true },
    { id: 'ranking', label: 'Candidate Ranking', icon: Trophy },
    { id: 'candidates', label: 'Candidate Profiles', icon: Users },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'chatbot', label: 'AI Concierge & Help', icon: Sparkles, isAction: true },
    { id: 'notifications', label: 'Notifications', icon: Bell, isAction: true },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Company Profile', icon: User }
  ];

  const handleLogout = () => {
    setCurrentUser(null);
    onOpenLanding();
  };

  return (
    <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden lg:flex transition-colors duration-150">
      <div className="space-y-5">
        {/* Recruiter Identity Card */}
        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center space-x-3">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'}
            alt="Recruiter"
            className="w-9 h-9 rounded-lg object-cover border border-neutral-300 dark:border-neutral-700"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">{currentUser?.name || 'Recruiter'}</p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{currentUser?.companyName || 'Nexus AI Labs'}</p>
            <span className="inline-block text-[10px] font-medium px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 mt-0.5">
              Recruiter
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
