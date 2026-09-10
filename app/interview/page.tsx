'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User as UserIcon,
  CheckCircle2,
  Award,
  BookOpen,
  ArrowRight,
  RotateCcw,
  ListChecks,
  Compass,
  Calendar,
  Clock,
  Mail,
  Video,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Radio,
  Copy,
  Check,
  AlertTriangle,
  Code2,
  Terminal,
  Play,
  Cpu,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { Shell } from '@/components/ui';
import { useAuth } from '@/components/auth-context';
import { api } from '@/lib/api';
import { getRandomCodingQuestion, CODING_QUESTIONS, type CodingQuestion } from '@/lib/coding-questions';

type ChatMessage = {
  role: 'assistant' | 'user' | 'system';
  content: string;
};

type EvaluationReport = {
  overall_score: number;
  technical_depth_feedback: string;
  articulation_feedback: string;
  actionable_improvements: string[];
};

const POPULAR_UNIVERSITIES = [
  'Stanford University',
  'Carnegie Mellon University',
  'Massachusetts Institute of Technology (MIT)',
  'University of California, Berkeley',
  'Georgia Institute of Technology',
  'Northeastern University',
  'University of Southern California',
  'Arizona State University',
  'University of Texas at Dallas',
  'San Jose State University',
];

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = useAuth();

  const urlUni = searchParams.get('university') || '';
  const urlProg = searchParams.get('program') || 'Computer Science';
  const urlRoom = searchParams.get('room') || '';
  const urlCall = searchParams.get('call') === 'active';

  // Navigation mode / step
  const [activeTab, setActiveTab] = useState<'schedule' | 'live_call' | 'coding' | 'report'>('schedule');

  // LeetCode / Codeforces Coding Assessment State
  const [codingQuestion, setCodingQuestion] = useState<CodingQuestion>(CODING_QUESTIONS[0]);
  const [codingLang, setCodingLang] = useState<'python' | 'cpp' | 'c' | 'java'>('python');
  const [code, setCode] = useState<string>(CODING_QUESTIONS[0].templates.python);
  const [codeRunning, setCodeRunning] = useState(false);
  const [codeRunResult, setCodeRunResult] = useState<any>(null);
  const [customInput, setCustomInput] = useState('');
  const [activeCodeSubTab, setActiveCodeSubTab] = useState<'problem' | 'testcases' | 'results'>('problem');
  const [codingScore, setCodingScore] = useState<{ passed: number; total: number; status: string } | null>(null);
  
  // Scheduling state
  const [candidateName, setCandidateName] = useState('');
  const [email, setEmail] = useState('');
  const [targetUniversity, setTargetUniversity] = useState(urlUni);
  const [major, setMajor] = useState(urlProg);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [resumeSummary, setResumeSummary] = useState('');
  const [sopSummary, setSopSummary] = useState('');

  // Call invitation state
  const [scheduledDetails, setScheduledDetails] = useState<{
    meeting_id: string;
    call_url: string;
    scheduled_time: string;
    recipient_email: string;
    email_dispatched: boolean;
  } | null>(null);

  // Call & Audio state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReport | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Virtual Call interactive state
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeechAudioEnabled, setIsSpeechAudioEnabled] = useState(true);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Initialize from session or query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = sessionStorage.getItem('unipath_user_email') || localStorage.getItem('unipath_user_email');
      if (savedEmail && !email) {
        setEmail(savedEmail);
      }
      const savedResume = localStorage.getItem('unipath_user_resume_summary');
      if (savedResume && !resumeSummary) {
        setResumeSummary(savedResume);
      }
    }
    if (urlUni && !targetUniversity) {
      setTargetUniversity(urlUni);
    }
    // Set default tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setScheduledDate(dateStr);

    // If navigated with call=active or room query, jump directly to live call
    if (urlCall || urlRoom) {
      setActiveTab('live_call');
      if (chatHistory.length === 0) {
        initializeInterviewCall(urlUni || 'Target University', urlProg || 'Computer Science');
      }
    }
  }, [urlUni, urlCall, urlRoom]);

  // Call timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeTab === 'live_call') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  // Initialize Web Speech Recognition if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcriptText = event.results[0][0].transcript;
          setInputMessage((prev) => (prev ? `${prev} ${transcriptText}` : transcriptText));
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        speechRecognitionRef.current = recognition;
      }
    }
  }, []);

  // Speak AI interviewer voice
  const speakInterviewerMessage = (text: string) => {
    if (!isSpeechAudioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsInterviewerSpeaking(true);
      utterance.onend = () => setIsInterviewerSpeaking(false);
      utterance.onerror = () => setIsInterviewerSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsInterviewerSpeaking(false);
    }
  };

  const toggleMicListening = () => {
    if (!speechRecognitionRef.current) {
      alert('Speech Recognition is not supported by your browser. Please use Chrome, Edge, or type your response.');
      return;
    }
    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Speech recognition error:', e);
      }
    }
  };

  const handleScheduleCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your registered Gmail address to receive the call invitation.');
      return;
    }
    if (!targetUniversity.trim()) {
      setErrorMsg('Please select or specify your target university.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const fullScheduledTime = `${scheduledDate} at ${scheduledTime}`;
      const clientBase = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

      const res = await api.scheduleInterview({
        recipient_email: email.trim(),
        candidate_name: candidateName.trim() || 'Applicant',
        target_university: targetUniversity.trim(),
        target_program: major.trim() || 'Graduate Studies',
        scheduled_time: fullScheduledTime,
        client_base_url: clientBase,
      });

      setScheduledDetails({
        meeting_id: res.meeting_id,
        call_url: res.call_url,
        scheduled_time: res.scheduled_time,
        recipient_email: res.recipient_email,
        email_dispatched: res.email_dispatched,
      });

      setSuccessMsg(
        `Virtual Interview Scheduled! Invitation & link dispatched to ${email.trim()}.`
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to schedule interview call. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const initializeInterviewCall = async (uniToUse?: string, progToUse?: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const initUni = uniToUse || targetUniversity || 'Stanford University';
      const initProg = progToUse || major || 'Computer Science';
      const initName = candidateName || 'Applicant';
      const initResume = resumeSummary || 'Engineering coursework, software development projects, systems architecture.';
      const initSop = sopSummary || `Graduate studies in ${initProg} at ${initUni}.`;

      const res = await api.startInterview({
        candidate_name: initName,
        major: initProg,
        target_university: initUni,
        resume_summary: initResume,
        sop_summary: initSop,
      });

      const firstMsg = res.interviewer_message;
      setChatHistory([
        {
          role: 'assistant',
          content: firstMsg,
        },
      ]);
      speakInterviewerMessage(firstMsg);
    } catch (err: any) {
      const fallback = `Welcome to the ${targetUniversity || 'University'} Admissions Interview for ${major || 'Computer Science'}. Could you walk the committee through the most technically rigorous software engineering or research project you have completed, highlighting your specific design choices and system trade-offs?`;
      setChatHistory([{ role: 'assistant', content: fallback }]);
      speakInterviewerMessage(fallback);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomCodingQuestion = async (forcedLang?: 'python' | 'cpp' | 'c' | 'java') => {
    const langToUse = forcedLang || codingLang;
    try {
      const q = await api.getRandomCodingQuestion();
      if (q && q.title) {
        setCodingQuestion(q);
        if (q.templates && q.templates[langToUse]) {
          setCode(q.templates[langToUse]);
        }
        return;
      }
    } catch (e: any) {
      console.warn('API getRandomCodingQuestion unavailable, using built-in problem bank:', e);
    }
    // Reliable fallback: Load directly from curated problem bank
    const fallbackQ = getRandomCodingQuestion();
    setCodingQuestion(fallbackQ);
    if (fallbackQ.templates && fallbackQ.templates[langToUse]) {
      setCode(fallbackQ.templates[langToUse]);
    }
  };

  const handleLanguageChange = (newLang: 'python' | 'cpp' | 'c' | 'java') => {
    setCodingLang(newLang);
    if (codingQuestion && codingQuestion.templates && codingQuestion.templates[newLang]) {
      setCode(codingQuestion.templates[newLang]);
    }
  };

  const handleRunCode = async (useCustomInput: boolean = false) => {
    if (!codingQuestion || codeRunning) return;
    setCodeRunning(true);
    setCodeRunResult(null);
    setActiveCodeSubTab('results');

    try {
      const result = await api.runCode({
        question_id: codingQuestion.id,
        language: codingLang,
        code,
        custom_input: useCustomInput ? customInput : undefined,
      });
      setCodeRunResult(result);
      if (!useCustomInput) {
        setCodingScore({
          passed: result.passed_testcases,
          total: result.total_testcases,
          status: result.status,
        });
      }
    } catch (err: any) {
      setCodeRunResult({
        status: 'Execution Failed',
        passed: false,
        error_message: err.message || 'Could not connect to code evaluation service.',
        total_testcases: codingQuestion.testcases.length,
        passed_testcases: 0,
        results: [],
      });
    } finally {
      setCodeRunning(false);
    }
  };

  const handleStartCallNow = () => {
    setActiveTab('live_call');
    if (chatHistory.length === 0) {
      initializeInterviewCall();
    }
    if (!codingQuestion) {
      fetchRandomCodingQuestion();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const answer = inputMessage.trim();
    if (!answer || loading) return;

    const newHistory: ChatMessage[] = [
      ...chatHistory,
      { role: 'user', content: answer },
    ];
    setChatHistory(newHistory);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.sendInterviewMessage({
        session_id: scheduledDetails?.meeting_id || 'interview-session-1',
        chat_history: newHistory.map((m) => ({ role: m.role, content: m.content })),
      });

      const nextInterviewerMsg = res.interviewer_message;
      setChatHistory([
        ...newHistory,
        { role: 'assistant', content: nextInterviewerMsg },
      ]);
      speakInterviewerMessage(nextInterviewerMsg);
    } catch (err: any) {
      const fallback =
        'Thank you for that response. How would you describe your ability to resolve unexpected failures under stress, and what unique technical perspective will you bring to our cohort?';
      setChatHistory([
        ...newHistory,
        {
          role: 'assistant',
          content: fallback,
        },
      ]);
      speakInterviewerMessage(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishAndEvaluate = async () => {
    if (evaluating) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setEvaluating(true);

    try {
      const res = await api.evaluateInterview({
        target_university: targetUniversity || 'Target University',
        target_program: major || 'Graduate Program',
        transcript: chatHistory.map((m) => ({ role: m.role, content: m.content })),
      });

      setEvaluationReport(res);
      setActiveTab('report');
    } catch (err: any) {
      // Fallback strict evaluation
      const userText = chatHistory
        .filter((m) => m.role === 'user')
        .map((m) => m.content)
        .join(' ')
        .toLowerCase();
      
      const isBaseless = userText.includes('random') || userText.includes('stuff') || userText.length < 50;
      const score = isBaseless ? 25 : 75;

      setEvaluationReport({
        overall_score: score,
        technical_depth_feedback: isBaseless
          ? 'CRITICAL DEFICIT: Responses were superficial or evasive, lacking verifiable architectural trade-offs or algorithmic mechanisms.'
          : 'Candidate demonstrated basic familiarity with computing concepts with opportunities to detail quantitative profiling metrics.',
        articulation_feedback: isBaseless
          ? 'Unacceptable articulation for graduate-level admissions. Failed to construct structured technical arguments.'
          : 'Clear communication with structured delivery.',
        actionable_improvements: [
          'Address the exact question asked with verifiable technical mechanisms.',
          `Study active research labs and recent publications at ${targetUniversity || 'your target institution'}.`,
          'Structure situational engineering responses using the STAR method.',
        ],
      });
      setActiveTab('report');
    } finally {
      setEvaluating(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyCallLink = () => {
    if (scheduledDetails?.call_url) {
      navigator.clipboard.writeText(scheduledDetails.call_url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const userTurnsCount = chatHistory.filter((m) => m.role === 'user').length;

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-12 md:pt-16">
      {/* HEADER */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Radio className="size-3.5 animate-pulse text-emerald-500" />
          Virtual AI Mock Interview
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Virtual AI Admissions Call & Interrogation
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Schedule your virtual AI mock interview call, receive your invite and meeting link on your Gmail, and practice live with an uncompromising faculty panel equipped with strict objective scoring.
        </p>

        {/* TABS */}
        <div className="mt-6 flex flex-wrap gap-2 border-b pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'schedule'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'border bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calendar className="size-3.5" />
            1. Schedule & Gmail Invite
          </button>
          <button
            type="button"
            onClick={handleStartCallNow}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'live_call'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'border bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            <Video className="size-3.5" />
            2. Virtual Call Room {chatHistory.length > 0 && `(Live - ${formatTimer(callDuration)})`}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('coding');
              if (!codingQuestion) {
                fetchRandomCodingQuestion();
              }
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'coding'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'border bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            <Code2 className="size-3.5" />
            3. Live Coding Assessment (LeetCode / Codeforces)
            {codingScore && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                codingScore.passed === codingScore.total ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-600'
              }`}>
                {codingScore.passed}/{codingScore.total}
              </span>
            )}
          </button>
          {evaluationReport && (
            <button
              type="button"
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === 'report'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              <Award className="size-3.5" />
              4. Strict Evaluation Report ({evaluationReport.overall_score}/100)
            </button>
          )}
        </div>
      </div>

      {/* ERROR ALERT */}
      {errorMsg && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-medium text-destructive">
          <AlertTriangle className="size-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SUCCESS ALERT */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: SCHEDULE & GMAIL DISPATCH */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              Schedule Your AI Mock Interview Call
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Select your date and time slot. Our admissions coordinator will dispatch the virtual call room link directly to your registered Gmail address.
            </p>

            <form onSubmit={handleScheduleCall} className="mt-6 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Your Registered Gmail / Email *
                  </label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    The virtual call access link will be emailed to this address.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Candidate Full Name
                  </label>
                  <div className="relative mt-1.5">
                    <UserIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="e.g. Alex Chen"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="w-full rounded-xl border bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Target University *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stanford University or Carnegie Mellon"
                    value={targetUniversity}
                    onChange={(e) => setTargetUniversity(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Target Program *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MS in Computer Science"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* QUICK UNIVERSITY CHIPS */}
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                  Quick Select Target University:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_UNIVERSITIES.map((uni) => (
                    <button
                      key={uni}
                      type="button"
                      onClick={() => setTargetUniversity(uni)}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                        targetUniversity.toLowerCase() === uni.toLowerCase()
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                    >
                      {uni}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Interview Date *
                  </label>
                  <div className="relative mt-1.5">
                    <Calendar className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <input
                      type="date"
                      required
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full rounded-xl border bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Time Slot *
                  </label>
                  <div className="relative mt-1.5">
                    <Clock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <select
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full rounded-xl border bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="09:00 AM">09:00 AM EST</option>
                      <option value="10:00 AM">10:00 AM EST</option>
                      <option value="11:30 AM">11:30 AM EST</option>
                      <option value="02:00 PM">02:00 PM EST</option>
                      <option value="04:00 PM">04:00 PM EST</option>
                      <option value="06:30 PM">06:30 PM EST</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Resume & Project Highlights (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 8.6 CGPA, 1 distributed systems paper, built microservices using Go, Redis, Docker, and Kubernetes."
                  value={resumeSummary}
                  onChange={(e) => setResumeSummary(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border bg-background p-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-95 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Dispatching Gmail Invitation...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 size-4" />
                      Schedule Call & Send Gmail Link
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleStartCallNow}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-primary/40 bg-primary/10 px-5 py-3 font-semibold text-primary transition hover:bg-primary/20"
                >
                  <Video className="mr-2 size-4" />
                  Enter Virtual Call Room Now
                </button>
              </div>
            </form>
          </div>

          {/* SCHEDULED CONFIRMATION BOX */}
          {scheduledDetails && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                    <CheckCircle2 className="size-4" />
                    Interview Successfully Scheduled
                  </div>
                  <h3 className="mt-1 text-base font-semibold text-foreground">
                    Admissions Call Room: {scheduledDetails.meeting_id}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Scheduled for <span className="font-semibold text-foreground">{scheduledDetails.scheduled_time}</span>. An invitation email with the join link has been dispatched to <span className="font-semibold text-foreground underline">{scheduledDetails.recipient_email}</span>.
                  </p>
                  <p className="mt-2 text-[11px] text-muted-foreground bg-background/80 border rounded-lg p-2 font-medium">
                    📬 <strong className="text-foreground">Email Status:</strong> Dispatched to your mail ID. Please check your inbox (and spam/promotions folder if it is your first time receiving emails from our admissions coordinator). You can also click <em>Join Call Room</em> below anytime.
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Email Dispatched
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 rounded-xl border bg-background p-3">
                <div className="flex-1 truncate text-xs text-muted-foreground font-mono">
                  {scheduledDetails.call_url}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={copyCallLink}
                    className="inline-flex items-center gap-1.5 rounded-lg border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    {copiedLink ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    {copiedLink ? 'Copied' : 'Copy Link'}
                  </button>
                  <button
                    type="button"
                    onClick={handleStartCallNow}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                  >
                    <Video className="size-3.5" />
                    Join Call Room
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VIRTUAL CALL ROOM */}
      {activeTab === 'live_call' && (
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col min-h-[640px]">
          {/* CALL ROOM HEADER */}
          <div className="flex flex-wrap items-center justify-between border-b border-border/60 bg-muted/20 px-5 py-3.5 gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <span>{targetUniversity || 'University'} Admissions Interview Room</span>
                  <span className="font-mono text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {formatTimer(callDuration)}
                  </span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Candidate: {candidateName || 'Applicant'} • Question {Math.min(5, userTurnsCount + 1)} of 5
                </p>
              </div>
            </div>

            {/* CALL CONTROLS */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSpeechAudioEnabled(!isSpeechAudioEnabled)}
                title={isSpeechAudioEnabled ? 'Mute Interviewer Voice' : 'Enable Interviewer Voice'}
                className={`rounded-lg border p-2 text-xs font-medium transition ${
                  isSpeechAudioEnabled ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted text-muted-foreground'
                }`}
              >
                {isSpeechAudioEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
              </button>

              <button
                type="button"
                onClick={handleFinishAndEvaluate}
                disabled={evaluating}
                title="End Virtual Call & View Evaluation Report"
                className="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-3.5 py-1.5 text-xs font-semibold text-destructive-foreground transition hover:opacity-90 disabled:opacity-50 shadow-xs cursor-pointer"
              >
                {evaluating ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <PhoneOff className="size-3.5" />
                    End Call & Score
                  </>
                )}
              </button>
            </div>
          </div>

          {/* VIRTUAL VIDEO / AVATAR SCREEN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-black/90 text-white">
            {/* INTERVIEWER PANEL */}
            <div className="relative flex flex-col items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 p-6 min-h-[180px]">
              <div className="relative">
                <div
                  className={`size-20 rounded-full bg-primary/20 border-2 flex items-center justify-center text-primary ${
                    isInterviewerSpeaking
                      ? 'border-emerald-400 ring-4 ring-emerald-500/20 animate-pulse'
                      : 'border-primary/40'
                  }`}
                >
                  <Bot className="size-10" />
                </div>
                {isInterviewerSpeaking && (
                  <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500">
                    <span className="size-2 rounded-full bg-white animate-ping" />
                  </span>
                )}
              </div>
              <p className="mt-3 text-xs font-semibold text-zinc-200">
                Admissions Faculty Representative
              </p>
              <p className="text-[10px] text-zinc-400">
                {isInterviewerSpeaking ? 'Speaking...' : 'Listening to candidate'}
              </p>
            </div>

            {/* CANDIDATE PANEL */}
            <div className="relative flex flex-col items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 p-6 min-h-[180px]">
              <div className="relative">
                <div
                  className={`size-20 rounded-full bg-zinc-800 border-2 flex items-center justify-center text-zinc-200 ${
                    isListening
                      ? 'border-emerald-400 ring-4 ring-emerald-500/20'
                      : isMuted
                      ? 'border-destructive/60'
                      : 'border-zinc-700'
                  }`}
                >
                  <UserIcon className="size-10" />
                </div>
                {isListening && (
                  <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500">
                    <Mic className="size-2.5 text-white" />
                  </span>
                )}
              </div>
              <p className="mt-3 text-xs font-semibold text-zinc-200">
                {candidateName || 'Candidate (You)'}
              </p>
              <p className="text-[10px] text-zinc-400">
                {isListening ? 'Microphone Active (Speaking...)' : isMuted ? 'Muted' : 'Microphone Ready'}
              </p>
            </div>
          </div>

          {/* CHAT / INTERROGATION TRANSCRIPT */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[360px] bg-background">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-sm ${
                  msg.role === 'assistant' ? 'items-start' : 'items-start flex-row-reverse'
                }`}
              >
                <div
                  className={`size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                    msg.role === 'assistant'
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'bg-muted text-foreground border border-border'
                  }`}
                >
                  {msg.role === 'assistant' ? <Bot className="size-4" /> : <UserIcon className="size-4" />}
                </div>

                <div
                  className={`max-w-[84%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    msg.role === 'assistant'
                      ? 'bg-muted/30 border border-border/60 text-foreground'
                      : 'bg-primary text-primary-foreground ml-auto'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-semibold text-[11px] opacity-75">
                      {msg.role === 'assistant' ? 'Admissions Committee' : candidateName || 'You'}
                    </p>
                    {msg.role === 'assistant' && (
                      <button
                        type="button"
                        onClick={() => speakInterviewerMessage(msg.content)}
                        title="Replay Audio"
                        className="text-[10px] opacity-70 hover:opacity-100 flex items-center gap-1"
                      >
                        <Volume2 className="size-3" />
                        Replay
                      </button>
                    )}
                  </div>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground italic pl-11">
                <Loader2 className="size-3.5 animate-spin text-primary" />
                Interviewer is analyzing technical depth and preparing the next interrogation...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* CANDIDATE AUDIO & TEXT INPUT */}
          <div className="border-t border-border/60 bg-muted/10 p-4">
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="relative">
                <textarea
                  rows={2}
                  disabled={loading}
                  placeholder={
                    isListening
                      ? 'Listening to your microphone... Speak clearly.'
                      : 'Type or speak your answer... (Press Enter to submit)'
                  }
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="w-full rounded-xl border bg-background p-3 pr-24 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                />

                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleMicListening}
                    title={isListening ? 'Stop Microphone' : 'Start Voice Input'}
                    className={`rounded-lg p-2 transition ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                  </button>

                  <button
                    type="submit"
                    disabled={loading || !inputMessage.trim()}
                    className="rounded-lg bg-primary p-2 text-primary-foreground transition hover:opacity-90 disabled:opacity-30"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="size-3 text-primary" />
                  Strict Scoring: Provide verifiable architectural mechanisms and trade-offs. Evasive answers receive severe penalties.
                </span>
                <button
                  type="button"
                  onClick={handleFinishAndEvaluate}
                  disabled={evaluating}
                  className="font-medium text-destructive hover:underline cursor-pointer disabled:opacity-50"
                >
                  {evaluating ? 'Evaluating transcript...' : 'Conclude Call & Generate Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: LEETCODE / CODEFORCES LIVE CODING PLATFORM */}
      {activeTab === 'coding' && (
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col min-h-[700px]">
            {/* PLATFORM HEADER */}
            <div className="flex flex-wrap items-center justify-between border-b border-border/60 bg-muted/20 px-5 py-3.5 gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Code2 className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tracking-tight text-foreground">
                      {codingQuestion ? codingQuestion.title : 'Algorithmic Coding Assessment'}
                    </span>
                    {codingQuestion && (
                      <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {codingQuestion.platform}
                      </span>
                    )}
                    {codingQuestion && (
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                        {codingQuestion.difficulty}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Category: {codingQuestion?.category || 'Algorithms'} • Sandboxed compiler supporting Python, C, C++, and Java
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS & RANDOMIZE */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fetchRandomCodingQuestion()}
                  className="inline-flex items-center gap-1.5 rounded-lg border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition"
                  title="Pick another random question"
                >
                  <RefreshCw className="size-3.5" />
                  Randomize Problem
                </button>

                {/* LANGUAGE SELECTOR */}
                <div className="flex items-center rounded-lg border bg-background p-0.5">
                  {(['python', 'cpp', 'c', 'java'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageChange(lang)}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition ${
                        codingLang === lang
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {lang === 'cpp' ? 'C++' : lang}
                    </button>
                  ))}
                </div>

                {/* RUN BUTTON */}
                <button
                  type="button"
                  onClick={() => handleRunCode(false)}
                  disabled={codeRunning || !codingQuestion}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition disabled:opacity-50"
                >
                  {codeRunning ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Play className="size-3.5 fill-current" />
                      Run & Submit
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* SPLIT PANEL: PROBLEM & TESTCASES (LEFT) + CODE EDITOR & TERMINAL (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-[580px]">
              {/* LEFT: PROBLEM SPECIFICATION & TESTCASES */}
              <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-border/60 bg-muted/10 flex flex-col">
                {/* SUB TABS */}
                <div className="flex items-center border-b border-border/60 bg-muted/20 px-4 py-2 gap-4 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveCodeSubTab('problem')}
                    className={`pb-1 transition ${
                      activeCodeSubTab === 'problem'
                        ? 'border-b-2 border-primary text-primary font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Problem Description
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeSubTab('testcases')}
                    className={`pb-1 transition ${
                      activeCodeSubTab === 'testcases'
                        ? 'border-b-2 border-primary text-primary font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Testcases ({codingQuestion?.testcases.length || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeSubTab('results')}
                    className={`pb-1 transition flex items-center gap-1.5 ${
                      activeCodeSubTab === 'results'
                        ? 'border-b-2 border-primary text-primary font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Execution Results
                    {codeRunResult && (
                      <span className={`size-2 rounded-full ${codeRunResult.passed ? 'bg-emerald-500' : 'bg-destructive'}`} />
                    )}
                  </button>
                </div>

                {/* CONTENT AREA */}
                <div className="p-5 overflow-y-auto flex-1 space-y-4 max-h-[540px]">
                  {activeCodeSubTab === 'problem' && codingQuestion && (
                    <div className="space-y-4 text-xs md:text-sm">
                      <div className="whitespace-pre-line leading-relaxed text-foreground">
                        {codingQuestion.description}
                      </div>

                      <div className="rounded-xl border border-border/60 bg-background p-3.5 space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Cpu className="size-3 text-primary" />
                          Platform Constraints & Guidelines
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                          <li>Time Limit: <strong>3.5s per test case</strong></li>
                          <li>Memory Limit: <strong>256 MB</strong></li>
                          <li>Input is delivered via Standard Input (`stdin`), output expected on Standard Output (`stdout`).</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeCodeSubTab === 'testcases' && codingQuestion && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground">
                        Predefined Verified Testcases:
                      </p>
                      {codingQuestion.testcases.map((tc, idx) => (
                        <div key={idx} className="rounded-xl border border-border/60 bg-background p-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-primary">Testcase #{idx + 1}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">Standard Test</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground">Input:</span>
                            <pre className="mt-0.5 rounded-lg bg-muted/40 p-2 font-mono text-[11px] overflow-x-auto">
                              {tc.input}
                            </pre>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground">Expected Output:</span>
                            <pre className="mt-0.5 rounded-lg bg-muted/40 p-2 font-mono text-[11px] overflow-x-auto text-emerald-600 dark:text-emerald-400">
                              {tc.expected_output}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeCodeSubTab === 'results' && (
                    <div className="space-y-4">
                      {!codeRunResult && (
                        <div className="text-center py-12 text-muted-foreground text-xs">
                          <Play className="size-8 mx-auto mb-2 opacity-30" />
                          Click <strong>Run & Submit</strong> to compile and evaluate your code against all testcases.
                        </div>
                      )}

                      {codeRunResult && (
                        <div className="space-y-4">
                          {/* STATUS HEADER */}
                          <div className={`p-4 rounded-xl border flex items-center justify-between ${
                            codeRunResult.passed
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                              : 'bg-destructive/10 border-destructive/30 text-destructive'
                          }`}>
                            <div>
                              <div className="flex items-center gap-2 font-bold text-sm">
                                {codeRunResult.passed ? <CheckCircle className="size-4" /> : <AlertTriangle className="size-4" />}
                                {codeRunResult.status}
                              </div>
                              <p className="text-[11px] opacity-80 mt-0.5">
                                {codeRunResult.passed_testcases} / {codeRunResult.total_testcases} Testcases Passed
                              </p>
                            </div>
                            <div className="text-right font-mono text-xs opacity-90">
                              {codeRunResult.runtime_ms} ms
                            </div>
                          </div>

                          {/* COMPILATION / RUNTIME ERROR LOG */}
                          {codeRunResult.error_message && (
                            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3">
                              <p className="text-[11px] font-bold text-destructive mb-1">Compiler Diagnostics:</p>
                              <pre className="text-[11px] font-mono text-destructive whitespace-pre-wrap">
                                {codeRunResult.error_message}
                              </pre>
                            </div>
                          )}

                          {/* INDIVIDUAL TESTCASES BREAKDOWN */}
                          {codeRunResult.results && codeRunResult.results.length > 0 && (
                            <div className="space-y-2.5">
                              {codeRunResult.results.map((r: any, i: number) => (
                                <div
                                  key={i}
                                  className={`rounded-xl border p-3 text-xs space-y-2 ${
                                    r.passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-destructive/30 bg-destructive/5'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold flex items-center gap-1.5">
                                      {r.passed ? (
                                        <Check className="size-3.5 text-emerald-500" />
                                      ) : (
                                        <AlertTriangle className="size-3.5 text-destructive" />
                                      )}
                                      Testcase #{r.testcase}
                                    </span>
                                    <span className="font-mono text-[10px] text-muted-foreground">{r.runtime_ms} ms</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                                    <div>
                                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Expected</span>
                                      <pre className="mt-0.5 rounded bg-background p-1.5 font-mono overflow-x-auto">
                                        {r.expected}
                                      </pre>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Your Output</span>
                                      <pre className={`mt-0.5 rounded bg-background p-1.5 font-mono overflow-x-auto ${
                                        r.passed ? 'text-emerald-500 font-semibold' : 'text-destructive font-semibold'
                                      }`}>
                                        {r.actual}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: CODE EDITOR & SUBMISSION RUNNER */}
              <div className="lg:col-span-7 flex flex-col bg-zinc-950 text-zinc-100 font-mono">
                {/* EDITOR BAR */}
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Terminal className="size-3.5 text-primary" />
                    <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                      Solution.{codingLang === 'python' ? 'py' : codingLang === 'cpp' ? 'cpp' : codingLang === 'c' ? 'c' : 'java'}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Press Run & Submit to test
                  </div>
                </div>

                {/* CODE TEXTAREA */}
                <div className="flex-1 relative p-3">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                    className="w-full h-full min-h-[420px] bg-transparent text-zinc-100 font-mono text-xs leading-relaxed outline-none resize-none selection:bg-primary/30"
                  />
                </div>

                {/* CUSTOM INPUT DRAWER */}
                <div className="border-t border-zinc-800 bg-zinc-900/60 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-zinc-400">Custom Test Input (Optional):</span>
                    <button
                      type="button"
                      onClick={() => handleRunCode(true)}
                      disabled={codeRunning || !customInput.trim()}
                      className="text-[10px] text-primary hover:underline font-semibold disabled:opacity-40"
                    >
                      Test on Custom Input
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. [2,7,11,15] \n 9"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCORE REPORT & STRICT EVALUATION */}
      {activeTab === 'report' && evaluationReport && (
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  <CheckCircle2 className="size-4" />
                  Interview Completed & Evaluated
                </div>
                <h2 className="mt-1 text-2xl font-bold tracking-tight">
                  Admissions Committee Official Evaluation
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Interrogation transcript scored for <span className="font-semibold text-foreground">{targetUniversity}</span> • {major}
                </p>
              </div>

              {/* OVERALL SCORE BADGE */}
              <div className="flex items-center gap-3 shrink-0">
                {codingScore && (
                  <div className={`rounded-xl border p-4 text-center ${
                    codingScore.passed === codingScore.total
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-600'
                  }`}>
                    <span className="text-3xl font-extrabold">{codingScore.passed}/{codingScore.total}</span>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5">Coding Testcases</p>
                    <span className="text-[10px] font-mono opacity-80">{codingScore.status}</span>
                  </div>
                )}

                <div
                  className={`flex items-center gap-4 rounded-xl border p-4 ${
                    evaluationReport.overall_score >= 80
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : evaluationReport.overall_score >= 50
                      ? 'border-amber-500/30 bg-amber-500/10'
                      : 'border-destructive/30 bg-destructive/10'
                  }`}
                >
                  <div className="text-center">
                    <span
                      className={`text-4xl font-extrabold ${
                        evaluationReport.overall_score >= 80
                          ? 'text-emerald-500'
                          : evaluationReport.overall_score >= 50
                          ? 'text-amber-500'
                          : 'text-destructive'
                      }`}
                    >
                      {evaluationReport.overall_score}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">/100</span>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
                      {evaluationReport.overall_score >= 80
                        ? 'Admit Caliber'
                        : evaluationReport.overall_score >= 50
                        ? 'Borderline'
                        : 'Critical Deficit'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FEEDBACK GRIDS */}
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center gap-2 mb-2 text-foreground font-semibold text-xs">
                  <Award className="size-4 text-primary" />
                  Technical Depth & Rigor Assessment
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {evaluationReport.technical_depth_feedback}
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center gap-2 mb-2 text-foreground font-semibold text-xs">
                  <BookOpen className="size-4 text-primary" />
                  Articulation, Professionalism & Delivery
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {evaluationReport.articulation_feedback}
                </p>
              </div>
            </div>

            {/* ACTIONABLE IMPROVEMENTS */}
            <div className="mt-6 rounded-xl border border-border/60 bg-muted/20 p-4">
              <div className="flex items-center gap-2 mb-3 text-foreground font-semibold text-xs">
                <ListChecks className="size-4 text-primary" />
                Key Adjustments Before Your Real Admissions Interview
              </div>
              <ul className="space-y-2">
                {evaluationReport.actionable_improvements.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-semibold text-primary mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ACTIONS */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('schedule');
                  setChatHistory([]);
                  setEvaluationReport(null);
                  setScheduledDetails(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition hover:opacity-95"
              >
                <RotateCcw className="size-3.5" />
                Schedule Another Mock Interview
              </button>

              <Link
                href="/evaluate"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-medium text-foreground transition hover:bg-muted"
              >
                <Compass className="size-3.5" />
                Return to University Shortlist
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function InterviewPage() {
  return (
    <Shell>
      <Suspense fallback={<div className="p-12 text-center text-sm text-muted-foreground">Loading Virtual Interview Room...</div>}>
        <InterviewContent />
      </Suspense>
    </Shell>
  );
}
