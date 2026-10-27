import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

interface FairnessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FairnessModal: React.FC<FairnessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">NextGen AI Fairness & Ethics Standard</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">100% Competency-Based Objective Scoring Guarantee</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs text-neutral-700 dark:text-neutral-300">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
              Guaranteed Job-Relevant Evaluation Only
            </p>
            <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
              NextGen Hiring AI evaluates candidates strictly on verified skills, academic credentials, verified engineering experience, certifications, and documented portfolio project artifacts.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="flex items-center space-x-2 text-neutral-900 dark:text-white font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Included in AI Scoring</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-neutral-600 dark:text-neutral-400">
                <li>• Technical skills taxonomy match</li>
                <li>• Years of verified relevant experience</li>
                <li>• Documented software & analytics projects</li>
                <li>• Degrees, GPAs, and accredited certifications</li>
                <li>• Practical problem solving & code artifacts</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="flex items-center space-x-2 text-neutral-900 dark:text-white font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Strictly Excluded (Zero Weight)</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-neutral-600 dark:text-neutral-400">
                <li>✕ Age, Date of Birth, or Graduation Year biases</li>
                <li>✕ Gender, Pronouns, or Marital Status</li>
                <li>✕ Race, Ethnicity, or Nationality</li>
                <li>✕ Physical location/postal zip code biases</li>
                <li>✕ Non-professional personal social footprints</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Explainable AI Recruiter Transparency</span>
            </h4>
            <p className="leading-relaxed text-neutral-600 dark:text-neutral-400 text-[11px]">
              Every resume screened outputs a transparent <span className="text-neutral-900 dark:text-white font-semibold">Fairness Explanation</span>. Recruiters can audit exactly which required skills were matched, which criteria were missed, and how the overall percentage was derived.
            </p>
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-bold text-xs shadow-sm transition-all"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
