import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Video,
  Users,
  CheckCircle2,
  Sparkles,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { CandidateApplication, InterviewSchedule, JobPosting } from '../../types';
import { getJobs, scheduleInterview, getCurrentUser } from '../../services/apiService';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: CandidateApplication | null;
  onScheduledSuccess: () => void;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  application,
  onScheduledSuccess
}) => {
  const currentUser = getCurrentUser();
  const jobs = getJobs();

  const [date, setDate] = useState('2026-03-02');
  const [time, setTime] = useState('14:30');
  const [duration, setDuration] = useState('45 min');
  const [interviewType, setInterviewType] = useState<InterviewSchedule['type']>('Technical');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/nxt-hire-ai-room');
  const [notes, setNotes] = useState('Focus on SQL data modeling and Power BI portfolio dashboard walkthrough.');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !application) return null;

  const currentJob = jobs.find(j => j.id === application.jobId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    scheduleInterview({
      candidateId: application.candidateId,
      jobId: application.jobId,
      recruiterId: currentUser?.id || 'rec-1',
      candidateName: application.candidateName,
      jobTitle: currentJob?.title || 'Data Analyst',
      date,
      time,
      duration,
      type: interviewType,
      meetingLink,
      status: 'scheduled',
      notes,
      questionsSuggested: [
        `How have you applied ${application.extractedSkills[0] || 'Python'} in production projects?`,
        `Can you describe your experience handling ${application.missingSkills[0] || 'database optimization'}?`,
        'Walk us through an analytical challenge where you discovered unexpected insights.'
      ]
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onScheduledSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Schedule Candidate Interview</h3>
              <p className="text-xs text-purple-300 font-medium">
                {application.candidateName} • {currentJob?.title || 'Data Analyst'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Interview scheduled & invitation dispatched to {application.candidateEmail}!</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Interview Round</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Technical">Technical Round</option>
                <option value="HR">HR / Culture Screen</option>
                <option value="Coding">Live Coding & Architecture</option>
                <option value="System Design">System Design & Problem Solving</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="30 min">30 Minutes</option>
                <option value="45 min">45 Minutes</option>
                <option value="60 min">60 Minutes</option>
                <option value="90 min">90 Minutes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Video Meeting Room Link</label>
            <div className="relative">
              <Video className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/xyz-abc"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-indigo-300 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Recruiter Notes / Focus Areas</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Confirm & Send Invitation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
