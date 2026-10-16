import { useState, useRef, useEffect } from 'react';
import { apiFetch } from '../services/api.ts';
import {
  Sparkles,
  Send,
  User,
  Bot,
  CheckCircle,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageSquare,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface InterviewSessionProps {
  onNavigate: (page: string, params?: any) => void;
  interviewId: string;
  initialQuestion: any;
  role?: string;
  company?: string;
  interviewType?: string;
}

export default function InterviewSession({
  onNavigate,
  interviewId,
  initialQuestion,
  role = 'Software Engineer',
  company = 'Tech Company',
  interviewType = 'TECHNICAL'
}: InterviewSessionProps) {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: initialQuestion?.questionText || 'Welcome! Could you please introduce yourself and tell me about your background?' }
  ]);
  const [currentQuestionId, setCurrentQuestionId] = useState(initialQuestion?.id);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);

  // Optional Voice Features (disabled by default for text interview)
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean text-to-speech for optional voice reading
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Optional Speech-To-Text helper (dictate into textarea)
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your answer directly.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = () => stopListening();
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading || ending) return;

    if (isListening) stopListening();
    stopSpeaking();

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const data = await apiFetch(`interviews/${interviewId}/answer`, {
        method: 'POST',
        body: JSON.stringify({ questionId: currentQuestionId, answerText: userText })
      });

      if (data.completed) {
        handleEndInterview();
      } else if (data.nextQuestion) {
        const nextQ = data.nextQuestion.questionText;
        setMessages((prev) => [...prev, { role: 'ai', text: nextQ }]);
        setCurrentQuestionId(data.nextQuestion.id);
        setLoading(false);

        if (audioEnabled) {
          speakText(nextQ);
        }
      } else {
        handleEndInterview();
      }
    } catch (err: any) {
      console.error('Interview answer submission error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Thank you for your detailed response. You may continue or click "Finish Interview" to generate your comprehensive performance evaluation.' }
      ]);
      setLoading(false);
    }
  };

  const handleEndInterview = async () => {
    stopSpeaking();
    stopListening();
    setEnding(true);
    try {
      await apiFetch(`interviews/${interviewId}/complete`, { method: 'POST' });
      onNavigate('interview-report', { interviewId });
    } catch (err) {
      console.error('Error completing interview:', err);
      // Even if complete endpoint throws, navigate to report
      onNavigate('interview-report', { interviewId });
    }
  };

  const questionCount = messages.filter((m) => m.role === 'ai').length;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-sky-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">
                InterviewIQ AI
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300">
                Text Interview Mode
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Role: <span className="text-neutral-200 font-medium">{role}</span> · Target: <span className="text-neutral-200 font-medium">{company}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Optional Audio Reader Toggle */}
          <button
            onClick={() => {
              if (audioEnabled) stopSpeaking();
              setAudioEnabled(!audioEnabled);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              audioEnabled ? 'bg-violet-500/10 border-violet-500/30 text-violet-300' : 'bg-white/5 border-white/10 text-neutral-400'
            }`}
            title="Toggle read-aloud voice for AI questions"
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-violet-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Voice Readout: {audioEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleEndInterview}
            disabled={ending}
            className="flex items-center gap-1.5 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold px-4 py-2 rounded-lg transition-all text-rose-300 disabled:opacity-50"
          >
            {ending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
            {ending ? 'Generating Evaluation...' : 'Finish Interview'}
          </button>
        </div>
      </header>

      {/* Main Chat Interface */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col min-h-0">
        {/* Info Banner */}
        <div className="mb-4 bg-white/[0.02] border border-white/5 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-violet-400" />
            <span>Interactive technical & behavioral text interview. Answer naturally in your own words.</span>
          </div>
          <span className="font-semibold text-neutral-300">Question #{questionCount}</span>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto space-y-6 pb-6 pr-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md ${
                  msg.role === 'ai' ? 'bg-gradient-to-tr from-violet-600 to-indigo-600' : 'bg-gradient-to-tr from-sky-600 to-blue-600'
                }`}
              >
                {msg.role === 'ai' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-5 text-sm leading-relaxed relative group ${
                  msg.role === 'ai'
                    ? 'bg-[#18181b] border border-white/10 text-neutral-100 rounded-tl-none shadow-sm'
                    : 'bg-sky-500/10 border border-sky-500/25 text-sky-50 rounded-tr-none'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/5">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${msg.role === 'ai' ? 'text-violet-400' : 'text-sky-400'}`}>
                    {msg.role === 'ai' ? 'AI Interviewer' : 'Candidate (You)'}
                  </span>
                  {msg.role === 'ai' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="text-neutral-500 hover:text-violet-400 transition-colors p-1"
                      title="Read question aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-tl-none p-5 bg-[#18181b] border border-white/10 flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                <span className="text-xs text-neutral-400">Interviewer is analyzing your response and preparing the next question...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Text Input Console */}
        <div className="mt-4 glass-panel p-3.5 rounded-2xl border border-white/10 shadow-lg space-y-2.5">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your answer here... Explain your thought process, approach, or experience (Press Enter to send, Shift+Enter for new line)"
              className="flex-1 bg-transparent text-neutral-100 text-sm p-3 focus:outline-none resize-none max-h-40 min-h-[64px] placeholder:text-neutral-500"
              rows={3}
            />

            {/* Optional dictation mic button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl border transition-all flex items-center justify-center ${
                isListening
                  ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
              }`}
              title={isListening ? 'Stop listening' : 'Optional speech-to-text dictation'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Send Answer Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || loading || ending}
              className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-violet-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Send Answer</span>
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-between items-center text-[11px] text-neutral-500 px-2 pt-1 border-t border-white/5">
            <span>💬 Text-based interview session. Responses are evaluated by Gemini AI.</span>
            <span>Tip: Structured answers (e.g. STAR method) score higher.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
