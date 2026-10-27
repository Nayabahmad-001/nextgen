import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Video,
  User,
  CheckCircle,
  XCircle,
  ExternalLink,
  PlusCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { InterviewSchedule } from '../../types';
import { getInterviews, updateInterviewStatus } from '../../services/apiService';

interface InterviewsListProps {
  onOpenSchedule: () => void;
}

export const InterviewsList: React.FC<InterviewsListProps> = ({ onOpenSchedule }) => {
  const [interviews, setInterviews] = useState<InterviewSchedule[]>([]);

  const loadData = () => {
    setInterviews(getInterviews());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('nextgen_interviews_updated', loadData);
    return () => window.removeEventListener('nextgen_interviews_updated', loadData);
  }, []);

  const handleStatus = (id: string, status: InterviewSchedule['status']) => {
    updateInterviewStatus(id, status);
    loadData();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-pink-500/20 text-pink-300 text-xs font-bold mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>INTERVIEW CALENDAR</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Scheduled Interviews</h1>
          <p className="text-xs text-slate-400">
            Track active interview sessions, video conference rooms, and AI suggested question guides.
          </p>
        </div>

        <button
          onClick={onOpenSchedule}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 flex items-center space-x-2 self-start sm:self-auto transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Schedule New Session</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interviews.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg hover:border-purple-500/40 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 uppercase">
                  {item.type} Round
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-1">{item.candidateName}</h3>
                <p className="text-xs text-indigo-400 font-medium">{item.jobTitle}</p>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                item.status === 'scheduled'
                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                  : item.status === 'completed'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                {item.status.toUpperCase()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{item.time} ({item.duration})</span>
              </div>
            </div>

            {item.notes && (
              <p className="text-xs text-slate-400 italic">
                “{item.notes}”
              </p>
            )}

            {/* AI Suggested Questions Guide */}
            {item.questionsSuggested && item.questionsSuggested.length > 0 && (
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs">
                <p className="font-bold text-purple-300 flex items-center space-x-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>AI Recommended Questions:</span>
                </p>
                <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                  {item.questionsSuggested.slice(0, 2).map((q, idx) => (
                    <li key={idx} className="truncate">{q}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <a
                href={item.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Video className="w-3.5 h-3.5 text-indigo-400" />
                <span>Join Google Meet</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>

              <div className="flex items-center space-x-1.5">
                {item.status === 'scheduled' && (
                  <>
                    <button
                      onClick={() => handleStatus(item.id, 'completed')}
                      className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs"
                      title="Mark Completed"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStatus(item.id, 'cancelled')}
                      className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs"
                      title="Cancel Interview"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
