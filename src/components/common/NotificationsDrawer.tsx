import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  CheckCheck,
  Briefcase,
  FileCheck2,
  Calendar,
  Sparkles,
  GraduationCap,
  Clock
} from 'lucide-react';
import { AppNotification } from '../../types';
import { getCurrentUser, getNotifications, markAllNotificationsRead } from '../../services/apiService';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'interview' | 'application' | 'learning'>('all');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const user = getCurrentUser();

  const loadNotifications = () => {
    const list = getNotifications(user?.id);
    setNotifications(list);
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, user?.id]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    markAllNotificationsRead(user?.id);
    loadNotifications();
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'interview') return n.type === 'interview';
    if (filter === 'application') return n.type === 'application' || n.type === 'shortlist';
    if (filter === 'learning') return n.type === 'learning';
    return true;
  });

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-4 h-4 text-neutral-900 dark:text-white" />;
      case 'application':
      case 'shortlist':
        return <Briefcase className="w-4 h-4 text-neutral-900 dark:text-white" />;
      case 'screening':
        return <FileCheck2 className="w-4 h-4 text-neutral-900 dark:text-white" />;
      case 'learning':
        return <GraduationCap className="w-4 h-4 text-neutral-900 dark:text-white" />;
      default:
        return <Sparkles className="w-4 h-4 text-neutral-900 dark:text-white" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Notifications</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Activity stream & system alerts</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleMarkAllRead}
              className="p-1.5 rounded-lg text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center space-x-1 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="text-[10px] hidden sm:inline">Read All</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center space-x-1 overflow-x-auto text-xs bg-white dark:bg-neutral-900">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'interview', label: 'Interviews' },
            { id: 'application', label: 'Applications' },
            { id: 'learning', label: 'Learning' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-neutral-50 dark:bg-neutral-950">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.read
                    ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                    : 'bg-white dark:bg-neutral-900 border-neutral-900/40 dark:border-neutral-600 shadow-sm text-neutral-900 dark:text-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-neutral-900 dark:text-white">{item.title}</p>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">{item.message}</p>
                    <div className="flex items-center space-x-1 mt-2 text-[10px] text-neutral-400 dark:text-neutral-500">
                      <Clock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <Bell className="w-10 h-10 text-neutral-400 dark:text-neutral-600 mb-2" />
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">No notifications found</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">You are completely up to date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
