import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bell,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Users,
  LogOut,
  ChevronDown,
  UserCheck,
  Layers,
  FileText,
  Compass,
  Sun,
  Moon
} from 'lucide-react';
import { User, UserRole, AppNotification } from '../../types';
import { getCurrentUser, setCurrentUser, getNotifications } from '../../services/apiService';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: (initialMode?: 'login' | 'register', defaultRole?: UserRole) => void;
  onOpenNotifications: () => void;
  onOpenFairness: () => void;
  onOpenLanding: () => void;
  onOpenChatbot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuth,
  onOpenNotifications,
  onOpenFairness,
  onOpenLanding,
  onOpenChatbot
}) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [currentUser, setUser] = useState<User | null>(getCurrentUser());
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  const refreshState = () => {
    const u = getCurrentUser();
    setUser(u);
    if (u) {
      const notifs = getNotifications(u.id);
      setUnreadCount(notifs.filter(n => !n.read).length);
    } else {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    refreshState();
    window.addEventListener('nextgen_auth_changed', refreshState);
    window.addEventListener('nextgen_notifs_updated', refreshState);
    return () => {
      window.removeEventListener('nextgen_auth_changed', refreshState);
      window.removeEventListener('nextgen_notifs_updated', refreshState);
    };
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setShowUserDropdown(false);
    onOpenLanding();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onOpenLanding}>
          <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-sm shadow-sm transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white">
                NextGen
              </span>
              <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                Hiring AI
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal hidden sm:block">
              Intelligent Recruitment & Skill Analysis
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Theme Toggle (White Theme / Dark Theme) */}
          <button
            id="nav-theme-toggle-btn"
            onClick={toggleTheme}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium transition-colors"
            title={isDark ? "Switch to White Theme" : "Switch to Dark Theme"}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-neutral-200" />
                <span className="hidden sm:inline">White Theme</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-neutral-700" />
                <span className="hidden sm:inline">Dark Theme</span>
              </>
            )}
          </button>

          {/* AI Assistant Shortcut */}
          {onOpenChatbot && (
            <button
              id="nav-ai-concierge-btn"
              onClick={onOpenChatbot}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white text-xs font-medium transition-colors"
              title="Open AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Help</span>
            </button>
          )}

          {/* AI Fairness & Ethics */}
          <button
            id="nav-fairness-btn"
            onClick={onOpenFairness}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white text-xs font-medium transition-colors"
            title="NextGen AI Ethics & Fairness Standard"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Fairness</span>
          </button>

          {currentUser ? (
            <>
              {/* Notification Bell */}
              <button
                id="nav-notifications-btn"
                onClick={onOpenNotifications}
                className="relative p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Profile Pill */}
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 transition-colors"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover border border-neutral-300 dark:border-neutral-700"
                  />
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-white leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 capitalize">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <p className="text-xs font-bold text-neutral-900 dark:text-white">{currentUser.name}</p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                        {currentUser.role} Portal
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentTab('dashboard');
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                      >
                        <Layers className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Go to Dashboard</span>
                      </button>

                      {currentUser.role === 'recruiter' && (
                        <button
                          onClick={() => {
                            setCurrentTab('screening');
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                        >
                          <FileText className="w-3.5 h-3.5 text-neutral-500" />
                          <span>AI Resume Screening</span>
                        </button>
                      )}

                      {currentUser.role === 'candidate' && (
                        <button
                          onClick={() => {
                            setCurrentTab('skill-gap');
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                        >
                          <Compass className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Skill Gap & Roadmap</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-neutral-100 dark:border-neutral-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                id="nav-login-btn"
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors"
              >
                Sign In
              </button>
              <button
                id="nav-get-started-btn"
                onClick={() => onOpenAuth('register')}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 shadow-sm transition-colors"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

