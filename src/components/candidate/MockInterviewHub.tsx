import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Code2,
  BrainCircuit,
  Calculator,
  RotateCcw,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  Award,
  CheckSquare,
  ArrowRight,
  HelpCircle,
  Zap,
  BarChart2,
  FileCode,
  Terminal,
  ExternalLink,
  Printer,
  Compass,
  Layers,
  Search,
  Filter,
  Check,
  X,
  Shuffle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getMockInterviewTemplates,
  getMockInterviewTemplateById,
  getAllAptitudeQuestions,
  getAptitudeQuestionsByIds,
  getAllCodingQuestions,
  getCodingQuestionsByIds,
  getAllConceptualQuestions,
  getConceptualQuestionsByIds,
  getShuffledAptitudeQuestions,
  getShuffledCodingQuestions,
  getShuffledConceptualQuestions,
  getMockInterviewAttempts,
  saveMockInterviewAttempt,
  runClientSideCodeTest,
  getCurrentUser
} from '../../services/apiService';
import {
  MockInterviewTemplate,
  MockInterviewAttempt,
  AptitudeQuestion,
  CodingQuestion,
  ConceptualQuestion
} from '../../types';

interface MockInterviewHubProps {
  setCurrentTab: (tab: string) => void;
}

export const MockInterviewHub: React.FC<MockInterviewHubProps> = ({ setCurrentTab }) => {
  const currentUser = getCurrentUser();
  const templates = getMockInterviewTemplates();
  const [attempts, setAttempts] = useState<MockInterviewAttempt[]>([]);

  // Active Session States
  const [activeTemplate, setActiveTemplate] = useState<MockInterviewTemplate | null>(null);
  const [isAssessmentActive, setIsAssessmentActive] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'aptitude' | 'coding' | 'conceptual'>('aptitude');
  const [currentAptitudeIdx, setCurrentAptitudeIdx] = useState<number>(0);
  const [currentCodingIdx, setCurrentCodingIdx] = useState<number>(0);
  const [currentConceptualIdx, setCurrentConceptualIdx] = useState<number>(0);

  // Candidate Answers & Codes
  const [aptitudeAnswers, setAptitudeAnswers] = useState<{ [qId: string]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<{ [qId: string]: boolean }>({});
  const [codingCodes, setCodingCodes] = useState<{ [qId: string]: { code: string; language: 'javascript' | 'typescript' | 'python' | 'sql' } }>({});
  const [codingTestOutputs, setCodingTestOutputs] = useState<{ [qId: string]: any }>({});
  const [conceptualAnswers, setConceptualAnswers] = useState<{ [qId: string]: string }>({});
  const [aiCodeReviews, setAiCodeReviews] = useState<{ [qId: string]: any }>({});
  const [isEvaluatingCode, setIsEvaluatingCode] = useState<boolean>(false);

  // Timer States
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Scratchpad / Calculator Tool
  const [showScratchpad, setShowScratchpad] = useState<boolean>(false);
  const [scratchpadText, setScratchpadText] = useState<string>('');
  const [calcInput, setCalcInput] = useState<string>('');
  const [calcResult, setCalcResult] = useState<string>('');
  const [showFormulaSheet, setShowFormulaSheet] = useState<boolean>(false);

  // Completed Scorecard State
  const [completedAttempt, setCompletedAttempt] = useState<MockInterviewAttempt | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [selectedReviewAttempt, setSelectedReviewAttempt] = useState<MockInterviewAttempt | null>(null);

  // Active questions loaded
  const [aptitudeQuestions, setAptitudeQuestions] = useState<AptitudeQuestion[]>([]);
  const [codingQuestions, setCodingQuestions] = useState<CodingQuestion[]>([]);
  const [conceptualQuestions, setConceptualQuestions] = useState<ConceptualQuestion[]>([]);

  // Filter in Hub
  const [hubFilter, setHubFilter] = useState<'all' | 'data-analyst' | 'software' | 'aptitude' | 'coding'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const refreshAttempts = () => {
    setAttempts(getMockInterviewAttempts(currentUser?.id));
  };

  useEffect(() => {
    refreshAttempts();
    window.addEventListener('nextgen_mock_interview_updated', refreshAttempts);
    return () => {
      window.removeEventListener('nextgen_mock_interview_updated', refreshAttempts);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentUser?.id]);

  // Timer countdown
  useEffect(() => {
    if (isAssessmentActive && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isAssessmentActive && timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAssessmentActive]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartTemplate = (tmpl: MockInterviewTemplate) => {
    setActiveTemplate(tmpl);
    // Shuffle questions and multiple choice options every time an assessment starts
    const apt = tmpl.aptitudeQuestionIds.length > 0 ? getShuffledAptitudeQuestions(tmpl.aptitudeQuestionIds) : [];
    const code = tmpl.codingQuestionIds.length > 0 ? getShuffledCodingQuestions(tmpl.codingQuestionIds) : [];
    const conc = tmpl.conceptualQuestionIds.length > 0 ? getShuffledConceptualQuestions(tmpl.conceptualQuestionIds) : [];

    setAptitudeQuestions(apt);
    setCodingQuestions(code);
    setConceptualQuestions(conc);

    // Initialize answers
    setAptitudeAnswers({});
    setFlaggedQuestions({});

    // Initialize coding starter code
    const initialCodes: { [qId: string]: { code: string; language: 'javascript' | 'typescript' | 'python' | 'sql' } } = {};
    code.forEach((q) => {
      const defaultLang = q.category.includes('SQL') ? 'sql' : 'javascript';
      initialCodes[q.id] = {
        code: defaultLang === 'sql' && q.starterCode.sql ? q.starterCode.sql : q.starterCode.javascript,
        language: defaultLang
      };
    });
    setCodingCodes(initialCodes);
    setCodingTestOutputs({});
    setConceptualAnswers({});
    setAiCodeReviews({});

    // Determine initial section
    if (apt.length > 0) {
      setActiveSection('aptitude');
    } else if (code.length > 0) {
      setActiveSection('coding');
    } else {
      setActiveSection('conceptual');
    }

    setCurrentAptitudeIdx(0);
    setCurrentCodingIdx(0);
    setCurrentConceptualIdx(0);

    const totalSec = tmpl.durationMinutes * 60;
    setTotalDurationSeconds(totalSec);
    setSecondsRemaining(totalSec);
    setCompletedAttempt(null);
    setSelectedReviewAttempt(null);
    setIsAssessmentActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Re-shuffle questions and multiple choice options dynamically
  const handleReshuffleQuestions = () => {
    if (!activeTemplate) return;
    const apt = activeTemplate.aptitudeQuestionIds.length > 0 ? getShuffledAptitudeQuestions(activeTemplate.aptitudeQuestionIds) : [];
    const code = activeTemplate.codingQuestionIds.length > 0 ? getShuffledCodingQuestions(activeTemplate.codingQuestionIds) : [];
    const conc = activeTemplate.conceptualQuestionIds.length > 0 ? getShuffledConceptualQuestions(activeTemplate.conceptualQuestionIds) : [];

    setAptitudeQuestions(apt);
    setCodingQuestions(code);
    setConceptualQuestions(conc);

    // Reset in-progress session state for fresh shuffled test
    setAptitudeAnswers({});
    setFlaggedQuestions({});

    const initialCodes: { [qId: string]: { code: string; language: 'javascript' | 'typescript' | 'python' | 'sql' } } = {};
    code.forEach((q) => {
      const defaultLang = q.category.includes('SQL') ? 'sql' : 'javascript';
      initialCodes[q.id] = {
        code: defaultLang === 'sql' && q.starterCode.sql ? q.starterCode.sql : q.starterCode.javascript,
        language: defaultLang
      };
    });
    setCodingCodes(initialCodes);
    setCodingTestOutputs({});
    setConceptualAnswers({});
    setAiCodeReviews({});

    setCurrentAptitudeIdx(0);
    setCurrentCodingIdx(0);
    setCurrentConceptualIdx(0);
  };

  // Run code test cases
  const handleRunCodeTests = (q: CodingQuestion) => {
    const codeObj = codingCodes[q.id] || { code: q.starterCode.javascript, language: 'javascript' };
    const results = runClientSideCodeTest(codeObj.code, q, codeObj.language);
    setCodingTestOutputs((prev) => ({
      ...prev,
      [q.id]: results
    }));
  };

  // Request AI Code Review
  const handleRequestAiCodeReview = async (q: CodingQuestion) => {
    const codeObj = codingCodes[q.id] || { code: q.starterCode.javascript, language: 'javascript' };
    const testResult = codingTestOutputs[q.id] || runClientSideCodeTest(codeObj.code, q, codeObj.language);
    setIsEvaluatingCode(true);

    try {
      const res = await fetch('/api/ai/evaluate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: q.title,
          problemDescription: q.description,
          code: codeObj.code,
          language: codeObj.language,
          testCaseResults: testResult.testResults || []
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiCodeReviews((prev) => ({
          ...prev,
          [q.id]: data
        }));
      }
    } catch (e) {
      console.warn('AI Code evaluation error, fallback local review:', e);
    } finally {
      setIsEvaluatingCode(false);
    }
  };

  // Auto submit when time expires
  const handleAutoSubmit = () => {
    handleSubmitAssessment();
  };

  // Calculate final score and submit
  const handleSubmitAssessment = () => {
    if (!activeTemplate) return;

    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate Aptitude Score
    let aptitudeCorrect = 0;
    aptitudeQuestions.forEach((q) => {
      if (aptitudeAnswers[q.id] === q.correctAnswerIndex) {
        aptitudeCorrect++;
      }
    });
    const aptitudeScorePct = aptitudeQuestions.length > 0
      ? Math.round((aptitudeCorrect / aptitudeQuestions.length) * 100)
      : 100;

    // Calculate Coding Score
    let codingPassCount = 0;
    const codingSubmissions: MockInterviewAttempt['codingSubmissions'] = {};

    codingQuestions.forEach((q) => {
      const codeObj = codingCodes[q.id] || { code: q.starterCode.javascript, language: 'javascript' };
      const runRes = codingTestOutputs[q.id] || runClientSideCodeTest(codeObj.code, q, codeObj.language);
      if (runRes.isPassed || runRes.passedTests === q.testCases.length) {
        codingPassCount++;
      }
      codingSubmissions[q.id] = {
        code: codeObj.code,
        language: codeObj.language,
        passedTests: runRes.passedTests,
        totalTests: runRes.totalTests,
        executionTimeMs: runRes.executionTimeMs,
        isPassed: runRes.isPassed
      };
    });

    const codingScorePct = codingQuestions.length > 0
      ? Math.round((codingPassCount / codingQuestions.length) * 100)
      : 100;

    // Overall Score Calculation (Weighted)
    let overallScore = 0;
    if (aptitudeQuestions.length > 0 && codingQuestions.length > 0) {
      overallScore = Math.round(aptitudeScorePct * 0.45 + codingScorePct * 0.55);
    } else if (aptitudeQuestions.length > 0) {
      overallScore = aptitudeScorePct;
    } else {
      overallScore = codingScorePct;
    }

    const timeSpent = totalDurationSeconds - secondsRemaining;
    const percentile = Math.min(99, Math.max(40, Math.round(overallScore * 0.95 + 4)));

    // Generate personalized AI feedback & action plan
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (aptitudeScorePct >= 75) {
      strengths.push('High quantitative agility & structured deductive problem solving');
    } else {
      weaknesses.push('Pacing and formula accuracy in time-critical quantitative reasoning');
    }

    if (codingScorePct >= 75) {
      strengths.push('Clean algorithmic implementation and verified edge-case validation');
    } else {
      weaknesses.push('Data structure selection and boundary test case coverage');
    }

    const attempt: MockInterviewAttempt = {
      id: `ATT-${Date.now().toString().slice(-6)}`,
      userId: currentUser?.id || 'usr-candidate-1',
      candidateName: currentUser?.name || 'Candidate',
      templateId: activeTemplate.id,
      title: activeTemplate.title,
      role: activeTemplate.role,
      startedAt: new Date(Date.now() - timeSpent * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpent,
      totalQuestions: aptitudeQuestions.length + codingQuestions.length + conceptualQuestions.length,
      aptitudeAnswers,
      codingSubmissions,
      conceptualAnswers,
      score: {
        overall: overallScore,
        aptitudeScore: aptitudeScorePct,
        codingScore: codingScorePct,
        percentileRanking: percentile,
        aptitudeCorrectCount: aptitudeCorrect,
        aptitudeTotalCount: aptitudeQuestions.length,
        codingPassedCount: codingPassCount,
        codingTotalCount: codingQuestions.length
      },
      aiEvaluation: {
        strengths,
        weaknesses,
        recommendedRoadmapStage: overallScore < 70 ? 2 : 4,
        recommendedProjectIds: ['proj-1', 'proj-2'],
        actionableFeedback: overallScore >= 80
          ? 'Exceptional performance across analytical reasoning and technical execution. Recommended for direct scheduling with hiring managers.'
          : 'Good foundational grasp. Focus on strengthening SQL window functions and algorithmic edge cases in Stage 3 of your learning roadmap.',
        codeQualityReview: 'Code exhibits consistent indenting and semantic variable naming. Algorithmic efficiency meets standard complexity bounds.'
      }
    };

    saveMockInterviewAttempt(attempt);
    setCompletedAttempt(attempt);
    setIsAssessmentActive(false);
    setIsSubmitModalOpen(false);

    if (overallScore >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // silent
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculator evaluation
  const handleCalcClick = (val: string) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else if (val === '=') {
      try {
        // Safe evaluation of simple math
        const sanitized = calcInput.replace(/[^0-9+\-*/().]/g, '');
        const res = new Function(`return (${sanitized})`)();
        setCalcResult(String(res));
      } catch {
        setCalcResult('Error');
      }
    } else {
      setCalcInput((prev) => prev + val);
    }
  };

  // Filter templates
  const filteredTemplates = templates.filter((t) => {
    if (hubFilter === 'data-analyst' && !t.role.toLowerCase().includes('data')) return false;
    if (hubFilter === 'software' && !t.role.toLowerCase().includes('software') && !t.role.toLowerCase().includes('full-stack')) return false;
    if (hubFilter === 'aptitude' && t.aptitudeQuestionIds.length === 0) return false;
    if (hubFilter === 'coding' && t.codingQuestionIds.length === 0) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.role.toLowerCase().includes(q);
    }
    return true;
  });

  // Calculate overall metrics
  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((acc, a) => acc + a.score.overall, 0) / attempts.length)
    : 84;
  const avgAptitude = attempts.length > 0
    ? Math.round(attempts.reduce((acc, a) => acc + a.score.aptitudeScore, 0) / attempts.length)
    : 88;
  const avgCoding = attempts.length > 0
    ? Math.round(attempts.reduce((acc, a) => acc + a.score.codingScore, 0) / attempts.length)
    : 80;

  // Active question getters
  const currentAptQuestion = aptitudeQuestions[currentAptitudeIdx];
  const currentCodingQuestion = codingQuestions[currentCodingIdx];
  const currentConcQuestion = conceptualQuestions[currentConceptualIdx];

  // -------------------------------------------------------------
  // VIEW 1: ACTIVE LIVE ASSESSMENT TEST HUD
  // -------------------------------------------------------------
  if (isAssessmentActive && activeTemplate) {
    const isWarningTime = secondsRemaining < 300; // < 5 mins
    const totalAnswered =
      Object.keys(aptitudeAnswers).length +
      Object.keys(codingTestOutputs).filter((k) => codingTestOutputs[k]?.passedTests > 0).length +
      Object.keys(conceptualAnswers).filter((k) => conceptualAnswers[k]?.trim().length > 10).length;
    const totalQCount = aptitudeQuestions.length + codingQuestions.length + conceptualQuestions.length;
    const progressPct = Math.round((totalAnswered / Math.max(1, totalQCount)) * 100);

    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Top Assessment HUD Bar */}
        <div className="sticky top-16 z-30 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold text-xs shrink-0">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white truncate max-w-xs sm:max-w-md">
                  {activeTemplate.title}
                </h2>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                  {activeTemplate.role}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Answered: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{totalAnswered}/{totalQCount}</span> ({progressPct}%)
              </p>
            </div>
          </div>

          {/* Center: Section Selector */}
          <div className="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs">
            {aptitudeQuestions.length > 0 && (
              <button
                onClick={() => setActiveSection('aptitude')}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1.5 transition-colors ${
                  activeSection === 'aptitude'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Aptitude ({aptitudeQuestions.length})</span>
              </button>
            )}

            {codingQuestions.length > 0 && (
              <button
                onClick={() => setActiveSection('coding')}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1.5 transition-colors ${
                  activeSection === 'coding'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Coding Arena ({codingQuestions.length})</span>
              </button>
            )}

            {conceptualQuestions.length > 0 && (
              <button
                onClick={() => setActiveSection('conceptual')}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1.5 transition-colors ${
                  activeSection === 'conceptual'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Q&A ({conceptualQuestions.length})</span>
              </button>
            )}
          </div>

          {/* Right: Timer & Submit Action */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setShowScratchpad(!showScratchpad)}
              className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs flex items-center space-x-1 transition-colors border border-neutral-200 dark:border-neutral-700"
              title="Toggle Calculator & Scratchpad"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Scratchpad</span>
            </button>

            {/* Countdown Timer */}
            <div
              className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 font-mono text-xs font-bold transition-colors ${
                isWarningTime
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-700 animate-pulse'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Submit Assessment</span>
            </button>
          </div>
        </div>

        {/* Scratchpad & Calculator Drawer Modal */}
        {showScratchpad && (
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
            {/* Calculator Column */}
            <div className="space-y-2 border-r border-neutral-100 dark:border-neutral-800 pr-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>On-Screen Calculator</span>
                </span>
                <span className="text-[10px] text-neutral-500">Arithmetic Sandbox</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono text-right">
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 min-h-[16px]">{calcInput || '0'}</div>
                <div className="text-base font-bold text-neutral-900 dark:text-white min-h-[24px]">{calcResult || '0'}</div>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCalcClick(btn)}
                    className="p-2 rounded bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-semibold transition-colors border border-neutral-200 dark:border-neutral-700"
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>

            {/* Scratchpad Column */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 dark:text-white">Rough Working Notes</span>
                <button
                  onClick={() => setScratchpadText('')}
                  className="text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline"
                >
                  Clear Notes
                </button>
              </div>
              <textarea
                value={scratchpadText}
                onChange={(e) => setScratchpadText(e.target.value)}
                placeholder="Jot down rough calculations, variable trackers, or logic deductions..."
                className="w-full h-32 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-800 dark:text-neutral-200 focus:outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* SECTION 1: APTITUDE QUESTIONS VIEW */}
        {activeSection === 'aptitude' && currentAptQuestion && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Main Question Area */}
            <div className="lg:col-span-9 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm space-y-6 transition-colors">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold font-mono">
                    Q{currentAptitudeIdx + 1} of {aptitudeQuestions.length}
                  </span>
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {currentAptQuestion.category}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                    {currentAptQuestion.topic}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setFlaggedQuestions((prev) => ({
                        ...prev,
                        [currentAptQuestion.id]: !prev[currentAptQuestion.id]
                      }));
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 border transition-colors ${
                      flaggedQuestions[currentAptQuestion.id]
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-3 h-3" />
                    <span>{flaggedQuestions[currentAptQuestion.id] ? 'Flagged' : 'Flag for Review'}</span>
                  </button>

                  {currentAptQuestion.formulaOrHint && (
                    <button
                      onClick={() => setShowFormulaSheet(!showFormulaSheet)}
                      className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium border border-neutral-200 dark:border-neutral-700 flex items-center space-x-1"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Formula Hint</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Hint Drawer */}
              {showFormulaSheet && currentAptQuestion.formulaOrHint && (
                <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 flex items-start space-x-2 animate-in fade-in">
                  <Zap className="w-4 h-4 text-neutral-900 dark:text-white shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-neutral-900 dark:text-white">Relevant Formula / Approach:</span>
                    <p className="mt-0.5">{currentAptQuestion.formulaOrHint}</p>
                  </div>
                </div>
              )}

              {/* Problem Statement */}
              <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 leading-relaxed whitespace-pre-line p-3 rounded-lg bg-neutral-50/50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-800/80">
                {currentAptQuestion.question}
              </div>

              {/* Options Radio List */}
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Select Correct Option:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentAptQuestion.options.map((option, optIdx) => {
                    const isSelected = aptitudeAnswers[currentAptQuestion.id] === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);
                    return (
                      <button
                        key={optIdx}
                        onClick={() => {
                          setAptitudeAnswers((prev) => ({
                            ...prev,
                            [currentAptQuestion.id]: optIdx
                          }));
                        }}
                        className={`p-3.5 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                          isSelected
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-sm'
                            : 'bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 border ${
                            isSelected
                              ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-950 border-transparent'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="text-xs font-medium flex-1">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <button
                  disabled={currentAptitudeIdx === 0}
                  onClick={() => {
                    setShowFormulaSheet(false);
                    setCurrentAptitudeIdx((prev) => Math.max(0, prev - 1));
                  }}
                  className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium flex items-center space-x-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-neutral-200 dark:border-neutral-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => {
                    setAptitudeAnswers((prev) => {
                      const copy = { ...prev };
                      delete copy[currentAptQuestion.id];
                      return copy;
                    });
                  }}
                  className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline"
                >
                  Clear Choice
                </button>

                {currentAptitudeIdx < aptitudeQuestions.length - 1 ? (
                  <button
                    onClick={() => {
                      setShowFormulaSheet(false);
                      setCurrentAptitudeIdx((prev) => Math.min(aptitudeQuestions.length - 1, prev + 1));
                    }}
                    className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : codingQuestions.length > 0 ? (
                  <button
                    onClick={() => setActiveSection('coding')}
                    className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <span>Proceed to Coding Arena</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold"
                  >
                    Review & Submit
                  </button>
                )}
              </div>
            </div>

            {/* Right Question Palette */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm transition-colors">
                <p className="text-xs font-bold text-neutral-900 dark:text-white mb-3">
                  Aptitude Question Palette
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {aptitudeQuestions.map((q, idx) => {
                    const isAnswered = aptitudeAnswers[q.id] !== undefined;
                    const isFlagged = flaggedQuestions[q.id];
                    const isCurrent = currentAptitudeIdx === idx;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentAptitudeIdx(idx)}
                        className={`h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all relative border ${
                          isCurrent
                            ? 'ring-2 ring-neutral-900 dark:ring-white border-transparent'
                            : ''
                        } ${
                          isAnswered
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        <span>{idx + 1}</span>
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-neutral-500 border border-white dark:border-neutral-900" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-neutral-900 dark:bg-white inline-block" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 inline-block" />
                    <span>Unanswered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-500 inline-block" />
                    <span>Flagged for review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: CODING QUESTIONS VIEW */}
        {activeSection === 'coding' && currentCodingQuestion && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Problem Description & Specs */}
            <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-5 overflow-y-auto max-h-[750px] transition-colors">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold border border-neutral-200 dark:border-neutral-700">
                    Challenge {currentCodingIdx + 1} of {codingQuestions.length}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1">
                    {currentCodingQuestion.title}
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                  {currentCodingQuestion.difficulty}
                </span>
              </div>

              {/* Description */}
              <div className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                {currentCodingQuestion.description}
              </div>

              {/* Examples */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-neutral-900 dark:text-white">Examples:</p>
                {currentCodingQuestion.examples.map((ex, i) => (
                  <div key={i} className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono space-y-1">
                    <p><strong className="text-neutral-900 dark:text-white font-sans">Input:</strong> {ex.input}</p>
                    <p><strong className="text-neutral-900 dark:text-white font-sans">Output:</strong> {ex.output}</p>
                    {ex.explanation && (
                      <p className="text-neutral-500 dark:text-neutral-400 font-sans text-[11px] pt-1">
                        Explanation: {ex.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-neutral-900 dark:text-white">Constraints:</p>
                <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1 font-mono">
                  {currentCodingQuestion.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Hints Accordion */}
              {currentCodingQuestion.hints.length > 0 && (
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <p className="text-xs font-bold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Algorithmic Hints</span>
                  </p>
                  <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                    {currentCodingQuestion.hints.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Live Editor & Test Runner */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden flex flex-col transition-colors">
                {/* Editor Header Bar */}
                <div className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">Code Editor</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Language Selector */}
                    <select
                      value={codingCodes[currentCodingQuestion.id]?.language || 'javascript'}
                      onChange={(e) => {
                        const newLang = e.target.value as any;
                        const starter =
                          newLang === 'python'
                            ? currentCodingQuestion.starterCode.python
                            : newLang === 'typescript'
                            ? currentCodingQuestion.starterCode.typescript
                            : newLang === 'sql' && currentCodingQuestion.starterCode.sql
                            ? currentCodingQuestion.starterCode.sql
                            : currentCodingQuestion.starterCode.javascript;

                        setCodingCodes((prev) => ({
                          ...prev,
                          [currentCodingQuestion.id]: {
                            code: starter,
                            language: newLang
                          }
                        }));
                      }}
                      className="px-2.5 py-1 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none"
                    >
                      <option value="javascript">JavaScript (Node 20)</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python 3</option>
                      {currentCodingQuestion.starterCode.sql && <option value="sql">PostgreSQL / SQL</option>}
                    </select>

                    <button
                      onClick={() => {
                        const lang = codingCodes[currentCodingQuestion.id]?.language || 'javascript';
                        const starter =
                          lang === 'python'
                            ? currentCodingQuestion.starterCode.python
                            : lang === 'typescript'
                            ? currentCodingQuestion.starterCode.typescript
                            : lang === 'sql' && currentCodingQuestion.starterCode.sql
                            ? currentCodingQuestion.starterCode.sql
                            : currentCodingQuestion.starterCode.javascript;

                        setCodingCodes((prev) => ({
                          ...prev,
                          [currentCodingQuestion.id]: { code: starter, language: lang }
                        }));
                      }}
                      className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                      title="Reset starter boilerplate"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Code Textarea */}
                <textarea
                  value={codingCodes[currentCodingQuestion.id]?.code || currentCodingQuestion.starterCode.javascript}
                  onChange={(e) => {
                    const val = e.target.value;
                    const lang = codingCodes[currentCodingQuestion.id]?.language || 'javascript';
                    setCodingCodes((prev) => ({
                      ...prev,
                      [currentCodingQuestion.id]: { code: val, language: lang }
                    }));
                  }}
                  spellCheck={false}
                  className="w-full h-80 p-4 font-mono text-xs bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none resize-none leading-relaxed border-none"
                />

                {/* Action Bar */}
                <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRunCodeTests(currentCodingQuestion)}
                      className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Run Test Suite</span>
                    </button>

                    <button
                      disabled={isEvaluatingCode}
                      onClick={() => handleRequestAiCodeReview(currentCodingQuestion)}
                      className="px-3.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium flex items-center space-x-1.5 transition-colors border border-neutral-200 dark:border-neutral-700 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isEvaluatingCode ? 'Evaluating...' : 'AI Code Review'}</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {currentCodingIdx > 0 && (
                      <button
                        onClick={() => setCurrentCodingIdx((p) => p - 1)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      >
                        Prev Coding
                      </button>
                    )}
                    {currentCodingIdx < codingQuestions.length - 1 ? (
                      <button
                        onClick={() => setCurrentCodingIdx((p) => p + 1)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold hover:bg-neutral-800"
                      >
                        Next Coding
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsSubmitModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold"
                      >
                        Submit All
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Test Case Execution Output Panel */}
              {codingTestOutputs[currentCodingQuestion.id] && (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <div className="flex items-center space-x-2">
                      {codingTestOutputs[currentCodingQuestion.id].isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white" />
                      ) : (
                        <XCircle className="w-4 h-4 text-neutral-900 dark:text-white" />
                      )}
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        Test Results: {codingTestOutputs[currentCodingQuestion.id].passedTests} / {codingTestOutputs[currentCodingQuestion.id].totalTests} Passed
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500">
                      Runtime: {codingTestOutputs[currentCodingQuestion.id].executionTimeMs}ms
                    </span>
                  </div>

                  <div className="space-y-2">
                    {codingTestOutputs[currentCodingQuestion.id].testResults?.map((tr: any, i: number) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-lg border text-xs font-mono flex items-start justify-between ${
                          tr.passed
                            ? 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200'
                            : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-400 dark:border-neutral-600 text-neutral-900 dark:text-white'
                        }`}
                      >
                        <div>
                          <p className="font-sans font-semibold text-[11px]">Case {i + 1}: {tr.passed ? 'Passed ✓' : 'Failed ✗'}</p>
                          <p className="text-[11px] text-neutral-500">Input: {tr.input}</p>
                          <p className="text-[11px]">Expected: {tr.expected}</p>
                          <p className="text-[11px] font-bold">Actual: {tr.actual}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${tr.passed ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'}`}>
                          {tr.passed ? 'Pass' : 'Fail'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Code Review Feedback Box */}
              {aiCodeReviews[currentCodingQuestion.id] && (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Code Architecture Evaluation</span>
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700">
                      Quality: {aiCodeReviews[currentCodingQuestion.id].codeQualityScore}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                      <span className="text-[10px] text-neutral-500 block">Time Complexity</span>
                      <span className="font-mono font-bold">{aiCodeReviews[currentCodingQuestion.id].timeComplexity}</span>
                    </div>
                    <div className="p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                      <span className="text-[10px] text-neutral-500 block">Space Complexity</span>
                      <span className="font-mono font-bold">{aiCodeReviews[currentCodingQuestion.id].spaceComplexity}</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {aiCodeReviews[currentCodingQuestion.id].overallVerdict}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 3: CONCEPTUAL QUESTIONS VIEW */}
        {activeSection === 'conceptual' && currentConcQuestion && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm space-y-5 transition-colors">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                  Question {currentConceptualIdx + 1} of {conceptualQuestions.length}
                </span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1">
                  {currentConcQuestion.topic}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {currentConcQuestion.difficulty}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm font-medium text-neutral-900 dark:text-white">
              {currentConcQuestion.question}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">
                Your Technical Response (Include architectural trade-offs, scalability, and recovery):
              </label>
              <textarea
                value={conceptualAnswers[currentConcQuestion.id] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setConceptualAnswers((p) => ({ ...p, [currentConcQuestion.id]: val }));
                }}
                rows={7}
                placeholder="Structure your answer clearly with bullet points and concrete examples..."
                className="w-full p-3.5 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button
                disabled={currentConceptualIdx === 0}
                onClick={() => setCurrentConceptualIdx((p) => p - 1)}
                className="px-4 py-2 rounded-lg bg-neutral-100 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 disabled:opacity-40"
              >
                Previous
              </button>

              {currentConceptualIdx < conceptualQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentConceptualIdx((p) => p + 1)}
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold"
                >
                  Next Concept
                </button>
              ) : (
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold"
                >
                  Review & Finalize Assessment
                </button>
              )}
            </div>
          </div>
        )}

        {/* Confirmation Submit Modal */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center space-x-3 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">Submit Assessment?</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Review your completion status</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Aptitude Questions Answered:</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {Object.keys(aptitudeAnswers).length} / {aptitudeQuestions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Coding Tests Executed:</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {Object.keys(codingTestOutputs).length} / {codingQuestions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Flagged Questions:</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {Object.values(flaggedQuestions).filter(Boolean).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Time Remaining:</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white">
                    {formatTime(secondsRemaining)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Once submitted, your answers will be audited and an instant Readiness Scorecard will be generated.
              </p>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="w-1/2 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Return to Test
                </button>
                <button
                  onClick={handleSubmitAssessment}
                  className="w-1/2 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold shadow-sm"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: COMPLETED ASSESSMENT SCORECARD & REPORT
  // -------------------------------------------------------------
  const displayScorecard = completedAttempt || selectedReviewAttempt;
  if (displayScorecard) {
    const tmpl = getMockInterviewTemplateById(displayScorecard.templateId) || templates[0];
    const aptQList = getAptitudeQuestionsByIds(tmpl.aptitudeQuestionIds);
    const codeQList = getCodingQuestionsByIds(tmpl.codingQuestionIds);

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top Report Header */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold mb-2 border border-neutral-200 dark:border-neutral-700">
              <Award className="w-3.5 h-3.5" />
              <span>Assessment Completed & Verified</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {displayScorecard.title}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Role: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{displayScorecard.role}</span> • Time Taken: <span className="font-mono font-medium">{Math.round(displayScorecard.timeSpentSeconds / 60)} mins</span>
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium flex items-center space-x-1.5 border border-neutral-200 dark:border-neutral-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Scorecard</span>
            </button>

            <button
              onClick={() => {
                setCompletedAttempt(null);
                setSelectedReviewAttempt(null);
              }}
              className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold transition-colors shadow-sm"
            >
              Back to Interview Hub
            </button>
          </div>
        </div>

        {/* 4 Score Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Overall Readiness Index</span>
            <div className="my-2">
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{displayScorecard.score.overall}%</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {displayScorecard.score.overall >= 75 ? '🟢 Ready for Recruiter Rounds' : '🟡 Recommended for Upskilling'}
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono w-fit border border-neutral-200 dark:border-neutral-700">
              Percentile: {displayScorecard.score.percentileRanking}th
            </span>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Aptitude & Logic</span>
            <div className="my-2">
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{displayScorecard.score.aptitudeScore}%</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {displayScorecard.score.aptitudeCorrectCount} of {displayScorecard.score.aptitudeTotalCount} questions correct
              </p>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-neutral-900 dark:bg-white h-1.5 rounded-full" style={{ width: `${displayScorecard.score.aptitudeScore}%` }} />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Technical Coding Score</span>
            <div className="my-2">
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{displayScorecard.score.codingScore}%</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {displayScorecard.score.codingPassedCount} of {displayScorecard.score.codingTotalCount} challenges passed
              </p>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-neutral-900 dark:bg-white h-1.5 rounded-full" style={{ width: `${displayScorecard.score.codingScore}%` }} />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Next Action Plan</span>
            <div className="my-2">
              <p className="text-sm font-bold text-neutral-900 dark:text-white">Roadmap Stage {displayScorecard.aiEvaluation?.recommendedRoadmapStage || 3}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Automated skill gap alignment</p>
            </div>
            <button
              onClick={() => setCurrentTab('skill-gap')}
              className="text-[11px] text-neutral-900 dark:text-white font-semibold flex items-center space-x-1 hover:underline"
            >
              <span>Jump to 5-Stage Roadmap</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* AI Action Plan Banner */}
        <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-neutral-900 dark:text-white" />
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              AI Talent Evaluator Verdict
            </h3>
          </div>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {displayScorecard.aiEvaluation?.actionableFeedback}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
              <p className="font-bold text-neutral-900 dark:text-white mb-1">Key Strengths Demonstrated:</p>
              <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-400 space-y-1">
                {displayScorecard.aiEvaluation?.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
              <p className="font-bold text-neutral-900 dark:text-white mb-1">Priority Focus Areas:</p>
              <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-400 space-y-1">
                {displayScorecard.aiEvaluation?.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Solutions & Explanations Walkthrough */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Question-by-Question Solution Walkthrough
          </h2>

          {/* Aptitude Solutions */}
          {aptQList.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Section 1: Aptitude & Analytical Reasoning Solutions
              </p>
              {aptQList.map((q, idx) => {
                const userAns = displayScorecard.aptitudeAnswers[q.id];
                const isCorrect = userAns === q.correctAnswerIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                          Q{idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                          {q.topic}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                          isCorrect
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {isCorrect ? 'Correct (+10 pts)' : 'Incorrect (0 pts)'}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-neutral-900 dark:text-white whitespace-pre-line">
                      {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                            oIdx === q.correctAnswerIndex
                              ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-900 dark:border-white font-bold text-neutral-900 dark:text-white'
                              : oIdx === userAns && !isCorrect
                              ? 'bg-neutral-100 dark:bg-neutral-950 border-neutral-400 line-through text-neutral-500'
                              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                          }`}
                        >
                          <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                          {oIdx === q.correctAnswerIndex && <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />}
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
                      <p className="font-bold text-neutral-900 dark:text-white">Mathematical Step-by-Step Derivation:</p>
                      <p className="whitespace-pre-line leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Coding Solutions */}
          {codeQList.length > 0 && (
            <div className="space-y-3 pt-4">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Section 2: Technical Coding Challenges & Optimal Implementations
              </p>
              {codeQList.map((q, idx) => {
                const sub = displayScorecard.codingSubmissions[q.id];
                const isPassed = sub?.isPassed;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <div>
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                          Challenge {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white inline ml-2">
                          {q.title}
                        </h4>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                          isPassed
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {isPassed ? 'All Test Cases Cleared' : `${sub?.passedTests || 0}/${sub?.totalTests || q.testCases.length} Passed`}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 dark:text-white">Optimal Solution & Complexity Analysis</span>
                        <div className="flex items-center space-x-2 text-[11px] font-mono">
                          <span className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">Time: {q.optimalTimeComplexity}</span>
                          <span className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">Space: {q.optimalSpaceComplexity}</span>
                        </div>
                      </div>
                      <p className="whitespace-pre-line leading-relaxed">{q.solutionExplanation}</p>
                    </div>

                    {/* Candidate vs Optimal Code */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-bold text-neutral-500 mb-1.5">Your Submitted Code:</p>
                        <pre className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-mono text-[11px] overflow-x-auto max-h-48 border border-neutral-200 dark:border-neutral-800">
                          {sub?.code || q.starterCode.javascript}
                        </pre>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-neutral-500 mb-1.5">Optimal Solution Implementation:</p>
                        <pre className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-mono text-[11px] overflow-x-auto max-h-48 border border-neutral-200 dark:border-neutral-800">
                          {q.referenceSolution?.javascript || q.referenceSolution?.sql || q.starterCode.javascript}
                        </pre>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: MAIN MOCK INTERVIEW CATALOG & DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold mb-2 border border-neutral-200 dark:border-neutral-700">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Interactive Interview Simulator</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Mock Interview & Coding Assessment Hub
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Real-world timed technical evaluations featuring quantitative aptitude, logical deduction, live coding test runners, and instant AI scorecards.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => handleStartTemplate(templates[0])}
            className="px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-bold flex items-center space-x-2 transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Quick Diagnostic (30m)</span>
          </button>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Interview Readiness</span>
          <div className="my-1.5">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{avgScore}%</p>
            <p className="text-[11px] text-neutral-500">Benchmark: Top 15%</p>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
            <div className="bg-neutral-900 dark:bg-white h-1 rounded-full" style={{ width: `${avgScore}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Avg Aptitude Score</span>
          <div className="my-1.5">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{avgAptitude}%</p>
            <p className="text-[11px] text-neutral-500">Speed & Accuracy</p>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
            <div className="bg-neutral-900 dark:bg-white h-1 rounded-full" style={{ width: `${avgAptitude}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Avg Coding Score</span>
          <div className="my-1.5">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{avgCoding}%</p>
            <p className="text-[11px] text-neutral-500">Test pass rate</p>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
            <div className="bg-neutral-900 dark:bg-white h-1 rounded-full" style={{ width: `${avgCoding}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Assessments Completed</span>
          <div className="my-1.5">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{attempts.length || 2}</p>
            <p className="text-[11px] text-neutral-500">Verified attempts</p>
          </div>
          <span className="text-[10px] text-neutral-500">Progress tracked</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Rounds' },
            { id: 'data-analyst', label: 'Data Analyst' },
            { id: 'software', label: 'Software Engineer' },
            { id: 'aptitude', label: 'Aptitude & Logic Only' },
            { id: 'coding', label: 'Coding Arena Only' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setHubFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                hubFilter === tab.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-sm'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search interview templates..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTemplates.map((tmpl) => {
          const aptCount = tmpl.aptitudeQuestionIds.length;
          const codeCount = tmpl.codingQuestionIds.length;
          const concCount = tmpl.conceptualQuestionIds.length;

          return (
            <div
              key={tmpl.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    {tmpl.role}
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs text-neutral-500 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{tmpl.durationMinutes} mins</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:underline">
                  {tmpl.title}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {tmpl.description}
                </p>

                {/* Question Structure Breakdown */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  {aptCount > 0 && (
                    <span className="px-2 py-0.5 rounded bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 flex items-center space-x-1">
                      <Calculator className="w-3 h-3" />
                      <span>{aptCount} Aptitude & Logic</span>
                    </span>
                  )}
                  {codeCount > 0 && (
                    <span className="px-2 py-0.5 rounded bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 flex items-center space-x-1">
                      <Code2 className="w-3 h-3" />
                      <span>{codeCount} Coding Challenges</span>
                    </span>
                  )}
                  {concCount > 0 && (
                    <span className="px-2 py-0.5 rounded bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 flex items-center space-x-1">
                      <FileCode className="w-3 h-3" />
                      <span>{concCount} System / Concept</span>
                    </span>
                  )}
                </div>

                {/* Skills Evaluated */}
                <div className="pt-2">
                  <p className="text-[11px] text-neutral-500 mb-1 font-medium">Evaluates:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tmpl.skillsEvaluated.map((sk, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 capitalize">
                  Difficulty: {tmpl.difficulty}
                </span>

                <button
                  onClick={() => handleStartTemplate(tmpl)}
                  className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Interview</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Attempts Table */}
      {attempts.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              <span>Assessment History & Scorecards</span>
            </h3>
            <span className="text-xs text-neutral-500">{attempts.length} attempts recorded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] text-neutral-500 uppercase bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="p-3">Assessment Title</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Aptitude / Coding</th>
                  <th className="p-3">Completed Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="p-3 font-semibold text-neutral-900 dark:text-white">{att.title}</td>
                    <td className="p-3 text-neutral-600 dark:text-neutral-400">{att.role}</td>
                    <td className="p-3">
                      <span className="font-bold text-neutral-900 dark:text-white">{att.score.overall}%</span>
                      <span className="text-[10px] text-neutral-500 ml-1">({att.score.percentileRanking}th %ile)</span>
                    </td>
                    <td className="p-3 text-neutral-600 dark:text-neutral-400 font-mono">
                      Apt: {att.score.aptitudeScore}% • Code: {att.score.codingScore}%
                    </td>
                    <td className="p-3 text-neutral-500">{new Date(att.completedAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedReviewAttempt(att)}
                        className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-medium text-xs border border-neutral-200 dark:border-neutral-700 transition-colors"
                      >
                        View Scorecard
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
