import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Headphones,
  FileText,
  Briefcase,
  Compass,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  Minimize2,
  Maximize2,
  Trash2,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  LifeBuoy,
  PlusCircle,
  RefreshCw,
  Ticket
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
  User,
  ChatMessage,
  SupportTicket,
  SupportTicketCategory,
  SupportTicketPriority,
  ChatQuickAction
} from '../../types';
import {
  apiSendChatMessage,
  getSupportTickets,
  createSupportTicket,
  updateSupportTicketStatus
} from '../../services/apiService';

interface ChatbotProps {
  currentUser: User | null;
  onNavigateTab: (tab: string) => void;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

const FAQ_CATEGORIES = [
  {
    id: 'resume',
    label: 'Resume Screening',
    icon: FileText,
    badgeColor: 'text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700',
    questions: [
      'How does the AI match score calculate on my resume?',
      'Why is my resume marked Consider with Upskilling?',
      'How does NextGen prevent demographic bias during screening?',
      'What resume file formats and ATS keywords are supported?'
    ]
  },
  {
    id: 'applications',
    label: 'Job Applications',
    icon: Briefcase,
    badgeColor: 'text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700',
    questions: [
      'What do the different application status stages mean?',
      'How do I access my scheduled Google Meet interviews?',
      'How can recruiters post a job with AI skill tagging?',
      'How do candidate ranking leaderboards work?'
    ]
  },
  {
    id: 'roadmap',
    label: 'Learning Roadmaps',
    icon: Compass,
    badgeColor: 'text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700',
    questions: [
      'How does the 5-Stage personalized learning roadmap work?',
      'How do I check off milestones to increase my match score?',
      'Where can I find portfolio project starter GitHub templates?',
      'How does NextGen recommend relevant upskilling courses?'
    ]
  },
  {
    id: 'escalation',
    label: 'Human Support',
    icon: Headphones,
    badgeColor: 'text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700',
    questions: [
      'I want to speak with a human recruiter or talent manager.',
      'How can I dispute or appeal my AI resume screening score?',
      'My interview Google Meet link is not working.',
      'How do I report a technical issue or request human support?'
    ]
  }
];

const INITIAL_GREETING_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  sender: 'bot',
  text: `### 👋 Welcome to NextGen AI Concierge!

I'm your intelligent virtual assistant, specialized in **AI Resume Screening**, **Job Application Tracking**, and **5-Stage Learning Roadmaps**.

Feel free to ask any question below, or select a common FAQ topic to get started! If you ever need manual assistance from our hiring team or technical staff, you can request **Human Support Escalation** at any time.`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  quickActions: [
    { label: "📊 How does Resume Screening work?", actionType: "ask", payload: "How does the AI calculate my resume match score and breakdown?" },
    { label: "🗺️ Explore 5-Stage Roadmap", actionType: "navigate", targetTab: "skill-gap" },
    { label: "💼 Track Job Applications", actionType: "navigate", targetTab: "applications" },
    { label: "🤝 Speak to Human Support", actionType: "escalate", payload: "I would like to speak with human support." }
  ]
};

export const Chatbot: React.FC<ChatbotProps> = ({
  currentUser,
  onNavigateTab,
  isOpenExternal,
  onCloseExternal
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'chat' | 'tickets' | 'new_ticket'>('chat');
  
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING_MESSAGE]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('resume');

  // Support Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicketCategory>('Resume Screening');
  const [ticketPriority, setTicketPriority] = useState<SupportTicketPriority>('High');
  const [ticketDescription, setTicketDescription] = useState<string>('');
  const [ticketSuccessId, setTicketSuccessId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external open state if provided
  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  // Load tickets on mount & auth changes
  const refreshTickets = () => {
    if (currentUser) {
      setTickets(getSupportTickets(currentUser.id));
    } else {
      setTickets(getSupportTickets());
    }
  };

  useEffect(() => {
    refreshTickets();
  }, [currentUser]);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeView === 'chat') {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, activeView]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await apiSendChatMessage({
        messages: newHistory.map(m => ({ sender: m.sender, text: m.text })),
        userRole: currentUser?.role || 'candidate',
        userName: currentUser?.name || 'Guest User',
        context: {
          skills: currentUser?.skills || [],
          targetRole: currentUser?.targetRole || 'Data Analyst'
        }
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEscalationSuggestion: response.isEscalationSuggested,
        escalationData: {
          reason: response.escalationReason,
          suggestedCategory: response.suggestedCategory || 'Technical Issue',
          topic: text
        },
        quickActions: response.quickActions
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "I'm having a brief connection delay, but our **Human Support Team** is standing by! You can click below to escalate your request directly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEscalationSuggestion: true,
        escalationData: {
          reason: "Connection retry — Human escalation fallback available.",
          suggestedCategory: 'Technical Issue',
          topic: text
        }
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: ChatQuickAction) => {
    if (action.actionType === 'navigate' && action.targetTab) {
      onNavigateTab(action.targetTab);
    } else if (action.actionType === 'ask' && action.payload) {
      handleSendMessage(action.payload);
    } else if (action.actionType === 'escalate') {
      openEscalationForm(action.payload);
    }
  };

  const openEscalationForm = (prefillQuery?: string) => {
    setActiveView('new_ticket');
    setTicketSubject(prefillQuery ? `Support Request: ${prefillQuery.slice(0, 50)}...` : 'Human Support Escalation Request');
    setTicketDescription(
      prefillQuery
        ? `I require direct assistance regarding:\n"${prefillQuery}"\n\nPlease have a talent operations specialist or technical agent review my account.`
        : 'Please assist with my inquiry. I would like a human support specialist to review my request.'
    );
    setTicketPriority('High');
    setTicketCategory(
      prefillQuery && /interview|meet/i.test(prefillQuery)
        ? 'Interview Scheduling'
        : prefillQuery && /resume|score|screening/i.test(prefillQuery)
        ? 'Resume Screening'
        : 'Job Application'
    );
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) return;

    // Gather last 4 messages as context
    const snippet = messages.slice(-4).map(m => `${m.sender.toUpperCase()}: ${m.text.slice(0, 100)}`);

    const newTicket = createSupportTicket({
      userId: currentUser?.id || 'guest-user',
      userName: currentUser?.name || 'Guest User',
      userEmail: currentUser?.email || 'guest@example.com',
      userRole: currentUser?.role || 'candidate',
      category: ticketCategory,
      priority: ticketPriority,
      subject: ticketSubject,
      description: ticketDescription,
      conversationSnippet: snippet
    });

    refreshTickets();
    setTicketSuccessId(newTicket.id);

    // Add a confirmation message to chat stream
    const confirmationMsg: ChatMessage = {
      id: `sys-${Date.now()}`,
      sender: 'system',
      text: `### 🎫 Support Ticket Successfully Created!\n\n**Ticket ID:** \`${newTicket.id}\`  \n**Category:** ${newTicket.category} | **Priority:** ${newTicket.priority}  \n**Status:** 🟡 Open / In Talent Operations Queue  \n\nOur human talent & technical support team has received your ticket and conversation history. You can track status updates in the **Support Tickets** tab above.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: [
        { label: "📋 View My Support Tickets", actionType: "ask", payload: "How do I check my support ticket status?" }
      ]
    };

    setMessages(prev => [...prev, confirmationMsg]);

    setTimeout(() => {
      setTicketSuccessId(null);
      setActiveView('tickets');
    }, 1500);
  };

  const handleClearChat = () => {
    setMessages([INITIAL_GREETING_MESSAGE]);
  };

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (!nextState && onCloseExternal) {
      onCloseExternal();
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {!isOpen && (
          <button
            id="nextgen-chatbot-launcher"
            onClick={toggleOpen}
            className="flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 shadow-lg active:scale-95 transition-all border border-neutral-700 dark:border-neutral-300"
          >
            <Bot className="w-4 h-4" />
            <span className="text-xs font-semibold">AI Assistant</span>
          </button>
        )}
      </div>

      {/* Main Chatbot Window */}
      {isOpen && (
        <div
          id="nextgen-chatbot-window"
          className={`fixed z-50 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl flex flex-col transition-all duration-200 overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-8 w-auto h-auto'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[92vw] sm:w-[440px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-xs text-neutral-900 dark:text-white">NextGen AI Assistant</h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Instant answers & human support</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={toggleOpen}
                className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                title="Close Assistant"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Bar: Chat vs Support Tickets vs FAQ */}
          <div className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveView('chat')}
                className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors flex items-center space-x-1.5 ${
                  activeView === 'chat'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => setActiveView('tickets')}
                className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors flex items-center space-x-1.5 ${
                  activeView === 'tickets' || activeView === 'new_ticket'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                <Ticket className="w-3 h-3" />
                <span>Support Tickets</span>
                {tickets.length > 0 && (
                  <span className="text-[10px] bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 font-mono px-1 rounded-full border border-neutral-300 dark:border-neutral-700">
                    {tickets.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center space-x-1">
              {activeView === 'chat' && (
                <button
                  onClick={handleClearChat}
                  className="p-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded transition-colors text-[11px] flex items-center space-x-1"
                  title="Clear chat history"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
              {activeView === 'tickets' && (
                <button
                  onClick={() => openEscalationForm()}
                  className="px-2 py-0.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-medium rounded text-[11px] flex items-center space-x-1 transition-colors"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>New Ticket</span>
                </button>
              )}
            </div>
          </div>

          {/* VIEW 1: AI CHAT VIEW */}
          {activeView === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-neutral-50/50 dark:bg-neutral-900">
              {/* FAQ Chips Bar */}
              <div className="px-3 py-2 bg-white dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800/50 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center space-x-1 flex-shrink-0 mr-1">
                  <HelpCircle className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />
                  <span>FAQs:</span>
                </span>
                {FAQ_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = selectedFaqCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedFaqCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1 border ${
                        isSelected
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-sm'
                          : 'bg-neutral-100 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700/50 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-200'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick FAQ Question Pills for the active category */}
              <div className="px-3 py-2 bg-neutral-100/70 dark:bg-neutral-950/30 border-b border-neutral-200 dark:border-neutral-800/40 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                {FAQ_CATEGORIES.find(c => c.id === selectedFaqCategory)?.questions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/60 whitespace-nowrap transition-all flex items-center space-x-1 flex-shrink-0"
                  >
                    <span>{q}</span>
                    <ChevronRight className="w-3 h-3 opacity-50" />
                  </button>
                ))}
              </div>

              {/* Chat Message Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  const isSystem = msg.sender === 'system';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                    >
                      {/* Sender Info Badge */}
                      <div className="flex items-center space-x-1.5 text-[10px] text-neutral-500 dark:text-neutral-400 px-1">
                        {isUser ? (
                          <>
                            <span>{msg.timestamp}</span>
                            <span className="font-bold text-neutral-700 dark:text-neutral-300">You</span>
                            <div className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                              <UserIcon className="w-2.5 h-2.5 text-neutral-700 dark:text-neutral-200" />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-4 h-4 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center">
                              <Sparkles className="w-2.5 h-2.5" />
                            </div>
                            <span className="font-bold text-neutral-800 dark:text-neutral-200">{isSystem ? 'NextGen System' : 'NextGen AI Concierge'}</span>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                          </>
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                          isUser
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-tr-none shadow-sm'
                            : isSystem
                            ? 'bg-neutral-100 dark:bg-neutral-950/90 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-200 rounded-tl-none shadow-sm'
                            : 'bg-white dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700/70 text-neutral-900 dark:text-neutral-100 rounded-tl-none shadow-sm'
                        }`}
                      >
                        <div className="prose prose-sm max-w-none break-words leading-relaxed dark:prose-invert">
                          <ReactMarkdown
                            components={{
                              h3: ({ node, ...props }) => (
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2 mt-1 border-b border-neutral-200 dark:border-neutral-700/50 pb-1" {...props} />
                              ),
                              p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                              ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                              ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                              li: ({ node, ...props }) => <li className="text-xs sm:text-sm" {...props} />,
                              strong: ({ node, ...props }) => <strong className="font-bold text-neutral-900 dark:text-white" {...props} />,
                              code: ({ node, ...props }) => (
                                <code className="bg-neutral-100 dark:bg-neutral-900 px-1 py-0.5 rounded text-neutral-900 dark:text-neutral-200 font-mono text-xs border border-neutral-200 dark:border-neutral-700" {...props} />
                              )
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        </div>

                        {/* Inline Escalation Card if triggered */}
                        {msg.isEscalationSuggestion && (
                          <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/60 -mx-4 -mb-3 p-3 rounded-b-2xl">
                            <div className="flex items-start space-x-2.5">
                              <div className="p-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg text-neutral-800 dark:text-neutral-200 mt-0.5">
                                <Headphones className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Human Assistance Available</h4>
                                  <span className="text-[9px] bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-1.5 py-0.2 rounded font-semibold uppercase">
                                    Priority Queue
                                  </span>
                                </div>
                                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                                  {msg.escalationData?.reason || 'Our talent operations team can manually review your request.'}
                                </p>
                                <button
                                  onClick={() => openEscalationForm(msg.escalationData?.topic)}
                                  className="mt-2 w-full py-1.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all active:scale-98"
                                >
                                  <LifeBuoy className="w-3.5 h-3.5" />
                                  <span>Escalate to Human Support Ticket</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick Action Chips under Bot Message */}
                      {msg.quickActions && msg.quickActions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1 max-w-[90%]">
                          {msg.quickActions.map((qa, qidx) => (
                            <button
                              key={qidx}
                              onClick={() => handleQuickAction(qa)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 border bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 shadow-sm"
                            >
                              {qa.actionType === 'navigate' && <ExternalLink className="w-3 h-3" />}
                              {qa.actionType === 'escalate' && <Headphones className="w-3 h-3" />}
                              {qa.actionType === 'ask' && <Sparkles className="w-3 h-3" />}
                              <span>{qa.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start space-x-2 text-neutral-500 dark:text-neutral-400">
                    <div className="w-7 h-7 rounded-lg bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300 animate-spin" />
                    </div>
                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs text-neutral-700 dark:text-neutral-300 flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"></span>
                      </div>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">NextGen AI is formulating response...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white dark:bg-neutral-950/80 border-t border-neutral-200 dark:border-neutral-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center space-x-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about resume scores, roadmaps, jobs, or type 'human'..."
                    className="flex-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-white focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
                    className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-neutral-500 dark:text-neutral-400">
                  <span>Powered by Gemini 3.7 Flash & NextGen Semantic Engine</span>
                  <button
                    onClick={() => openEscalationForm()}
                    className="text-neutral-800 dark:text-neutral-200 hover:underline font-semibold flex items-center space-x-1"
                  >
                    <Headphones className="w-2.5 h-2.5" />
                    <span>Need Human Agent?</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: SUPPORT TICKETS LIST */}
          {activeView === 'tickets' && (
            <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4 bg-neutral-50/50 dark:bg-neutral-900">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center space-x-1.5">
                    <Ticket className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    <span>Human Support & Escalations</span>
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Track status of inquiries escalated from AI to our Talent Operations team.
                  </p>
                </div>
                <button
                  onClick={() => openEscalationForm()}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-medium rounded-lg text-xs flex items-center space-x-1 transition-all shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create Ticket</span>
                </button>
              </div>

              {tickets.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-neutral-950/40 rounded-xl border border-neutral-200 dark:border-neutral-800/80">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 mb-3">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-sm text-neutral-900 dark:text-neutral-200">No Escalated Tickets Yet</h5>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">
                    If the AI is unable to answer a complex inquiry or you need a manual score appeal, you can open a support ticket.
                  </p>
                  <button
                    onClick={() => openEscalationForm()}
                    className="mt-4 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-medium rounded-lg text-xs flex items-center space-x-1.5 shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Your First Ticket</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map(ticket => (
                    <div
                      key={ticket.id}
                      className="p-3.5 bg-white dark:bg-neutral-950/60 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all space-y-2.5 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">{ticket.id}</span>
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700"
                            >
                              {ticket.status}
                            </span>
                            <span
                              className="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                            >
                              {ticket.priority} Priority
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-neutral-900 dark:text-white mt-1">{ticket.subject}</h5>
                        </div>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800/80">
                        {ticket.description}
                      </p>

                      {ticket.agentNotes && (
                        <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs">
                          <div className="flex items-center space-x-1 text-neutral-900 dark:text-neutral-100 font-bold text-[11px] mb-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Talent Ops / Agent Update:</span>
                          </div>
                          <p className="text-neutral-700 dark:text-neutral-300 text-[11px]">{ticket.agentNotes}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                        <span>Category: <strong className="text-neutral-700 dark:text-neutral-300">{ticket.category}</strong></span>
                        {ticket.status !== 'Resolved' && (
                          <button
                            onClick={() => {
                              updateSupportTicketStatus(ticket.id, 'Resolved', 'Marked resolved by user confirmation in AI Concierge.');
                              refreshTickets();
                            }}
                            className="text-neutral-800 dark:text-neutral-200 hover:underline font-semibold flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Mark as Resolved</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: NEW ESCALATION TICKET FORM */}
          {activeView === 'new_ticket' && (
            <div className="flex-1 flex flex-col overflow-y-auto p-4 bg-neutral-50/50 dark:bg-neutral-900">
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-4">
                <div className="flex items-center space-x-2 text-neutral-800 dark:text-neutral-200 mb-1">
                  <Headphones className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Human Support Escalation</span>
                </div>
                <h4 className="font-bold text-base text-neutral-900 dark:text-white">Create Official Support Ticket</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Our talent operations team & senior recruiters review escalated inquiries within 2-4 hours.
                </p>
              </div>

              {ticketSuccessId ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-neutral-100 dark:bg-neutral-800/50 rounded-xl border border-neutral-300 dark:border-neutral-700">
                  <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h5 className="font-bold text-base text-neutral-900 dark:text-white">Ticket #{ticketSuccessId} Created!</h5>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 max-w-sm">
                    Your request and AI chat snippet have been assigned to our human support queue. You will receive real-time updates.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1">Ticket Subject *</label>
                      <input
                        type="text"
                        required
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        placeholder="e.g., Resume Score Review / Interview Link Troubleshooting"
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1">Category *</label>
                        <select
                          value={ticketCategory}
                          onChange={(e) => setTicketCategory(e.target.value as SupportTicketCategory)}
                          className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                        >
                          <option value="Resume Screening">Resume Screening Appeal</option>
                          <option value="Job Application">Job Application Status</option>
                          <option value="Interview Scheduling">Interview / Google Meet</option>
                          <option value="Learning Roadmap">Learning Roadmap & Skills</option>
                          <option value="Technical Issue">Technical Bug / Issue</option>
                          <option value="Other">Other Inquiry</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1">Priority Level</label>
                        <select
                          value={ticketPriority}
                          onChange={(e) => setTicketPriority(e.target.value as SupportTicketPriority)}
                          className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                        >
                          <option value="Low">Low (General question)</option>
                          <option value="Medium">Medium (Application inquiry)</option>
                          <option value="High">High (Upcoming interview / score)</option>
                          <option value="Urgent">Urgent (Interview today / blocker)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1">Detailed Description *</label>
                      <textarea
                        required
                        rows={4}
                        value={ticketDescription}
                        onChange={(e) => setTicketDescription(e.target.value)}
                        placeholder="Describe the issue or reason for escalation in detail..."
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-white leading-relaxed"
                      />
                    </div>

                    <div className="p-3 bg-white dark:bg-neutral-950/60 rounded-xl border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 space-y-1">
                      <div className="flex items-center space-x-1.5 text-neutral-800 dark:text-neutral-200 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Automatic Context Sharing Enabled</span>
                      </div>
                      <p>
                        Your last {Math.min(messages.length, 4)} AI conversation messages and role profile ({currentUser?.name || 'Guest'}) will be attached for rapid resolution.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setActiveView('chat')}
                      className="flex-1 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300 font-bold text-xs transition-colors border border-neutral-200 dark:border-neutral-700"
                    >
                      Cancel & Return to Chat
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-1"
                    >
                      <LifeBuoy className="w-3.5 h-3.5" />
                      <span>Submit Priority Ticket</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
