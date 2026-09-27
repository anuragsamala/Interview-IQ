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
  Radio,
  AlertCircle
} from 'lucide-react';

interface InterviewSessionProps {
  onNavigate: (page: string, params?: any) => void;
  interviewId: string;
  initialQuestion: any;
}

export default function InterviewSession({ onNavigate, interviewId, initialQuestion }: InterviewSessionProps) {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: initialQuestion.questionText }
  ]);
  const [currentQuestionId, setCurrentQuestionId] = useState(initialQuestion.id);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);

  // Voice Co-Pilot States
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [fillerCount, setFillerCount] = useState(0);
  const [speakingSeconds, setSpeakingSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speak initial question on load if autoSpeak is enabled
  useEffect(() => {
    if (autoSpeak && initialQuestion?.questionText) {
      speakText(initialQuestion.questionText);
    }
  }, []);

  // Text-To-Speech function
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

  // Real-time Speech-To-Text Recognition
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
      alert('Speech recognition is not supported in this browser. Please try Google Chrome.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeakingSeconds(0);
        timerRef.current = setInterval(() => {
          setSpeakingSeconds(prev => prev + 1);
        }, 1000);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(prev => {
          const newText = prev ? `${prev} ${transcript}` : transcript;
          detectFillers(newText);
          return newText;
        });
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
      };

      recognition.onend = () => {
        setIsListening(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Detect filler words (um, uh, like, you know) in real-time
  const detectFillers = (text: string) => {
    const fillerRegex = /\b(um|uh|like|you know|err|basically)\b/gi;
    const matches = text.match(fillerRegex);
    setFillerCount(matches ? matches.length : 0);
  };

  const handleSend = async () => {
    if (!input.trim() || loading || ending) return;

    if (isListening) {
      stopListening();
    }
    stopSpeaking();

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const data = await apiFetch(`interviews/${interviewId}/answer`, {
        method: 'POST',
        body: JSON.stringify({ questionId: currentQuestionId, answerText: userText })
      });

      if (data.completed) {
        handleEndInterview();
      } else {
        const nextQ = data.nextQuestion.questionText;
        setMessages(prev => [...prev, { role: 'ai', text: nextQ }]);
        setCurrentQuestionId(data.nextQuestion.id);
        setLoading(false);

        if (autoSpeak) {
          speakText(nextQ);
        }
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Let us try to end the interview.' }]);
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
      console.error(err);
      alert('Failed to complete interview properly.');
      setEnding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans">
      {/* Top Bar with Voice Controls */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-sky-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            InterviewIQ <span className="text-violet-400">Voice Session</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Auto-Speak Toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              autoSpeak ? 'bg-violet-500/10 border-violet-500/30 text-violet-300' : 'bg-white/5 border-white/10 text-neutral-400'
            }`}
            title="Auto-read interview questions using AI Voice"
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-violet-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Auto-Voice: {autoSpeak ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleEndInterview}
            disabled={ending}
            className="flex items-center gap-1.5 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-medium px-4 py-2 rounded-lg transition-all text-rose-400 disabled:opacity-50"
          >
            {ending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
            {ending ? 'Generating Report...' : 'End Interview'}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col">
        {/* Active Speaker Status Badge */}
        {isSpeaking && (
          <div className="mb-4 bg-violet-600/10 border border-violet-500/30 text-violet-300 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold animate-pulse">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-violet-400 animate-spin" />
              <span>AI Interviewer is speaking...</span>
            </div>
            <button onClick={stopSpeaking} className="text-neutral-400 hover:text-white underline">Mute</button>
          </div>
        )}

        {/* Mic Active Listening Wave Form */}
        {isListening && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span>Listening to candidate... ({speakingSeconds}s spoken)</span>
            </div>
            <div className="flex items-center gap-3">
              {fillerCount > 0 && (
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-[11px]">
                  ⚠️ {fillerCount} filler words detected
                </span>
              )}
              <button onClick={stopListening} className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-emerald-500">
                Done Speaking
              </button>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-6 pb-6 pr-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === 'ai' ? 'bg-violet-600' : 'bg-sky-600'
              }`}>
                {msg.role === 'ai' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed relative group ${
                msg.role === 'ai'
                  ? 'bg-[#18181b] border border-white/10 text-neutral-200 rounded-tl-none'
                  : 'bg-sky-500/10 border border-sky-500/20 text-sky-100 rounded-tr-none'
              }`}>
                <p>{msg.text}</p>
                {msg.role === 'ai' && (
                  <button
                    onClick={() => speakText(msg.text)}
                    className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-violet-400 transition-all"
                    title="Read this question out loud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-tl-none p-4 bg-[#18181b] border border-white/10 flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area with Voice Microphone Controls */}
        <div className="mt-4 glass-panel p-3 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                detectFillers(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your answer or click the microphone to speak..."
              className="flex-1 bg-transparent text-neutral-200 text-sm p-3 focus:outline-none resize-none max-h-32 min-h-[50px]"
              rows={2}
            />

            {/* Mic Toggle Button */}
            <button
              onClick={toggleListening}
              className={`p-3 rounded-xl border transition-all flex items-center justify-center ${
                isListening
                  ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                  : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white'
              }`}
              title={isListening ? 'Stop microphone' : 'Start speaking with microphone'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-sky-400" />}
            </button>

            {/* Submit Button */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading || ending}
              className="p-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Voice Helper Bar */}
          <div className="flex justify-between items-center text-[11px] text-neutral-500 px-2 pt-1 border-t border-white/5">
            <span className="flex items-center gap-1">
              🎙️ <span className="text-neutral-400 font-medium">Mic Mode:</span> Speak into microphone for auto speech-to-text
            </span>
            {fillerCount > 0 && (
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {fillerCount} filler word(s) detected ("um", "uh", "like")
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
