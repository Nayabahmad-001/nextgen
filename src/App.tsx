import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './components/common/LandingPage';
import { AuthModal } from './components/common/AuthModal';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { FairnessModal } from './components/common/FairnessModal';
import { Chatbot } from './components/common/Chatbot';

// Recruiter Components
import { RecruiterSidebar } from './components/recruiter/RecruiterSidebar';
import { RecruiterDashboard } from './components/recruiter/RecruiterDashboard';
import { PostJob } from './components/recruiter/PostJob';
import { ManageJobs } from './components/recruiter/ManageJobs';
import { ResumeScreening } from './components/recruiter/ResumeScreening';
import { CandidateRanking } from './components/recruiter/CandidateRanking';
import { InterviewsList } from './components/recruiter/InterviewsList';
import { RecruiterAnalytics } from './components/recruiter/RecruiterAnalytics';
import { CandidateProfileView } from './components/recruiter/CandidateProfileView';
import { ScheduleInterviewModal } from './components/recruiter/ScheduleInterviewModal';

// Candidate Components
import { CandidateSidebar } from './components/candidate/CandidateSidebar';
import { CandidateDashboard } from './components/candidate/CandidateDashboard';
import { ResumeScoreAnalyzer } from './components/candidate/ResumeScoreAnalyzer';
import { SkillGapRoadmap } from './components/candidate/SkillGapRoadmap';
import { ProjectRecommendations } from './components/candidate/ProjectRecommendations';
import { JobRecommendations } from './components/candidate/JobRecommendations';
import { CandidateApplications } from './components/candidate/CandidateApplications';
import { CandidateProfileSkills } from './components/candidate/CandidateProfileSkills';
import { MockInterviewHub } from './components/candidate/MockInterviewHub';

import { getCurrentUser, setCurrentUser, getCandidateById } from './services/apiService';
import { CandidateApplication, JobPosting, User, UserRole } from './types';
import { MOCK_USERS } from './data/mockData';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [currentUser, setUser] = useState<User | null>(getCurrentUser());
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>('recruiter');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isFairnessOpen, setIsFairnessOpen] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);

  // Modals for Recruiter candidate interaction
  const [selectedCandidateApp, setSelectedCandidateApp] = useState<CandidateApplication | null>(null);
  const [schedulingCandidateApp, setSchedulingCandidateApp] = useState<CandidateApplication | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleAuth = () => {
      const u = getCurrentUser();
      setUser(u);
    };
    window.addEventListener('nextgen_auth_changed', handleAuth);
    return () => window.removeEventListener('nextgen_auth_changed', handleAuth);
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login', role: UserRole = 'recruiter') => {
    setAuthMode(mode);
    setAuthDefaultRole(role);
    setIsAuthOpen(true);
  };

  const handleExplorePortal = (role: UserRole) => {
    const target = role === 'recruiter' ? MOCK_USERS[0] : MOCK_USERS[1];
    setCurrentUser(target);
    setUser(target);
    setCurrentTab('dashboard');
  };

  const handleScheduleInterviewForCandidate = (app: CandidateApplication) => {
    setSchedulingCandidateApp(app);
    setIsScheduleModalOpen(true);
  };

  const handleApplyJobFromCandidate = (job: JobPosting) => {
    setCurrentTab('applications');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans antialiased transition-colors duration-150">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={(mode, role) => handleOpenAuth(mode, role)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenFairness={() => setIsFairnessOpen(true)}
        onOpenLanding={() => setUser(null)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />

      {/* Main Content Area */}
      {!currentUser ? (
        <LandingPage
          onOpenAuth={(mode, role) => handleOpenAuth(mode, role)}
          onExploreDirect={handleExplorePortal}
          onOpenFairness={() => setIsFairnessOpen(true)}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Role-Specific Sidebar */}
          {currentUser.role === 'recruiter' ? (
            <RecruiterSidebar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenLanding={() => setUser(null)}
              onOpenChatbot={() => setIsChatbotOpen(true)}
            />
          ) : (
            <CandidateSidebar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenLanding={() => setUser(null)}
              onOpenChatbot={() => setIsChatbotOpen(true)}
            />
          )}

          {/* Primary View Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24">
            {/* Recruiter Views */}
            {currentUser.role === 'recruiter' && (
              <>
                {currentTab === 'dashboard' && (
                  <RecruiterDashboard
                    setCurrentTab={setCurrentTab}
                    onSelectCandidate={(app) => setSelectedCandidateApp(app)}
                    onScheduleInterview={handleScheduleInterviewForCandidate}
                  />
                )}
                {currentTab === 'post-job' && (
                  <PostJob onJobCreated={() => setCurrentTab('manage-jobs')} />
                )}
                {currentTab === 'manage-jobs' && (
                  <ManageJobs
                    onSelectJobForScreening={(job) => setCurrentTab('screening')}
                    onNavigatePostJob={() => setCurrentTab('post-job')}
                  />
                )}
                {currentTab === 'screening' && (
                  <ResumeScreening
                    onViewCandidateProfile={(app) => setSelectedCandidateApp(app)}
                    onScheduleInterview={handleScheduleInterviewForCandidate}
                  />
                )}
                {currentTab === 'ranking' && (
                  <CandidateRanking
                    onSelectCandidate={(app) => setSelectedCandidateApp(app)}
                    onScheduleInterview={handleScheduleInterviewForCandidate}
                  />
                )}
                {currentTab === 'candidates' && (
                  <CandidateRanking
                    onSelectCandidate={(app) => setSelectedCandidateApp(app)}
                    onScheduleInterview={handleScheduleInterviewForCandidate}
                  />
                )}
                {currentTab === 'interviews' && (
                  <InterviewsList
                    onOpenSchedule={() => {
                      const apps = JSON.parse(localStorage.getItem('nextgen_applications') || '[]');
                      if (apps.length > 0) {
                        setSchedulingCandidateApp(apps[0]);
                        setIsScheduleModalOpen(true);
                      }
                    }}
                  />
                )}
                {currentTab === 'analytics' && <RecruiterAnalytics />}
              </>
            )}

            {/* Candidate Views */}
            {currentUser.role === 'candidate' && (
              <>
                {currentTab === 'dashboard' && (
                  <CandidateDashboard
                    setCurrentTab={setCurrentTab}
                    onApplyJob={handleApplyJobFromCandidate}
                  />
                )}
                {currentTab === 'mock-interview' && <MockInterviewHub setCurrentTab={setCurrentTab} />}
                {currentTab === 'resume-score' && <ResumeScoreAnalyzer />}
                {currentTab === 'skill-gap' && <SkillGapRoadmap />}
                {currentTab === 'projects' && <ProjectRecommendations />}
                {currentTab === 'jobs' && (
                  <JobRecommendations onAppliedSuccess={handleApplyJobFromCandidate} />
                )}
                {currentTab === 'applications' && <CandidateApplications />}
                {currentTab === 'profile' && <CandidateProfileSkills />}
              </>
            )}
          </main>
        </div>
      )}

      {/* Global AI Concierge Chatbot & Human Escalation Hub */}
      <Chatbot
        currentUser={currentUser}
        onNavigateTab={(tab) => setCurrentTab(tab)}
        isOpenExternal={isChatbotOpen}
        onCloseExternal={() => setIsChatbotOpen(false)}
      />

      {/* Global Modals & Drawers */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        defaultRole={authDefaultRole}
        onSuccess={(role) => {
          setIsAuthOpen(false);
          setUser(getCurrentUser());
        }}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <FairnessModal
        isOpen={isFairnessOpen}
        onClose={() => setIsFairnessOpen(false)}
      />

      <CandidateProfileView
        application={selectedCandidateApp}
        onClose={() => setSelectedCandidateApp(null)}
        onScheduleInterview={handleScheduleInterviewForCandidate}
      />

      <ScheduleInterviewModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSchedulingCandidateApp(null);
        }}
        application={schedulingCandidateApp}
        onScheduledSuccess={() => {
          setIsScheduleModalOpen(false);
          setSchedulingCandidateApp(null);
        }}
      />
    </div>
  );
}

