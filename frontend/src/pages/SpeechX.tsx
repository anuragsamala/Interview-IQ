import { useState, useRef } from 'react';
import { apiFetch } from '../services/api.ts';
import {
  Sparkles,
  ArrowLeft,
  Volume2,
  Mic,
  MicOff,
  Radio,
  Loader2,
  AlertCircle,
  Send
} from 'lucide-react';

interface SpeechXProps {
  onNavigate: (page: string, params?: any) => void;
}

const SPEECHX_MODULES = [
  {
    id: 1,
    title: 'Module 1: Sentence Repeat & Articulation',
    type: 'REPEAT',
    instructions: 'Listen to the AI read each sentence aloud, then click the microphone to repeat it out loud accurately.',
    items: [
      { id: 'm1-1', text: 'The cloud architecture optimizes latency across distributed database nodes.' },
      { id: 'm1-2', text: 'Agile sprint planning ensures continuous integration and timely release deliverables.' }
    ]
  },
  {
    id: 2,
    title: 'Module 2: Passage Listening & Comprehension',
    type: 'COMPREHENSION',
    instructions: 'Listen to the audio passage, then answer the spoken comprehension questions into the microphone.',
    passage: 'Our engineering team recently migrated from a monolithic architecture to microservices. By implementing containerization with Docker and Kubernetes, system uptime improved to ninety-nine point nine percent, and deployment cycle time was reduced from two weeks to under two hours.',
    items: [
      { id: 'm2-1', text: 'What were the key technologies used to improve system uptime and deployment speed?' },
      { id: 'm2-2', text: 'How much was the deployment cycle time reduced after the migration?' }
    ]
  },
  {
    id: 3,
    title: 'Module 3: Extempore Spontaneous Topic Speech',
    type: 'EXTEMPORE',
    instructions: 'You have 30 seconds to prepare your thoughts, followed by 60 seconds to speak continuously on the given topic without hesitation or filler words.',
    items: [
      {
        id: 'm3-1',
        text: 'Topic: Discuss the advantages of Artificial Intelligence co-pilots in software engineering, and why continuous learning is essential for modern engineers.'
      }
    ]
  },
  {
    id: 4,
    title: 'Module 4: Grammar & Sentence Reconstruction',
    type: 'GRAMMAR',
    instructions: 'Listen to the grammatically flawed sentence read by AI, then speak the corrected version into the microphone.',
    items: [
      { id: 'm4-1', text: 'Flawed: Neither of the two team leads have submitted their weekly code review report.' },
      { id: 'm4-2', text: 'Flawed: The senior engineer requested that every pull requests is reviewed before merging.' }
    ]
  }
];

export default function SpeechX({ onNavigate }: SpeechXProps) {
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeItemIdx, setActiveItemIdx] = useState(0);
  const [transcripts, setTranscripts] = useState<{ [key: string]: string }>({});
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingSeconds, setSpeakingSeconds] = useState(0);
  const [fillerCount, setFillerCount] = useState(0);
  const [evaluating, setEvaluating] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  const currentModule = SPEECHX_MODULES[activeModuleIdx];
  const currentItem = currentModule.items[activeItemIdx];
  const itemKey = currentItem.id;

  // Text to speech (AI Reading aloud)
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

  // Mic Speech-to-Text
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome.');
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
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscripts(prev => {
          const updated = { ...prev, [itemKey]: text };
          detectFillers(text);
          return updated;
        });
      };

      recognition.onerror = () => stopListening();
      recognition.onend = () => {
        setIsListening(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
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

  const detectFillers = (text: string) => {
    const matches = text.match(/\b(um|uh|like|you know|err|basically)\b/gi);
    setFillerCount(matches ? matches.length : 0);
  };

  // Next Item or Module Step
  const handleNext = () => {
    stopSpeaking();
    stopListening();

    if (activeItemIdx < currentModule.items.length - 1) {
      setActiveItemIdx(prev => prev + 1);
    } else if (activeModuleIdx < SPEECHX_MODULES.length - 1) {
      setActiveModuleIdx(prev => prev + 1);
      setActiveItemIdx(0);
    } else {
      // Complete SpeechX Assessment
      handleSubmitSpeechX();
    }
  };

  const handleSubmitSpeechX = async () => {
    setEvaluating(true);
    stopSpeaking();
    stopListening();

    // Prepare response array for backend AI evaluation
    const responsesPayload: Array<{ section: string; prompt: string; transcript: string }> = [];

    SPEECHX_MODULES.forEach(mod => {
      mod.items.forEach(it => {
        responsesPayload.push({
          section: mod.title,
          prompt: it.text,
          transcript: transcripts[it.id] || 'Candidate did not speak for this item.'
        });
      });
    });

    try {
      const report = await apiFetch('interviews/speechx/evaluate', {
        method: 'POST',
        body: JSON.stringify({ responses: responsesPayload })
      });

      onNavigate('speechx-report', { report });
    } catch (err: any) {
      console.error(err);
      alert('Failed to evaluate SpeechX assessment.');
      setEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-violet-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            AMCAT <span className="text-amber-400">SpeechX Assessment</span>
          </span>
        </div>

        <button
          onClick={() => onNavigate('interview-setup')}
          className="flex items-center gap-1.5 border border-white/10 hover:bg-white/5 text-xs font-medium px-3.5 py-2 rounded-lg transition-all text-neutral-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Exit
        </button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 flex flex-col gap-8">
        {/* Module Progress Stepper */}
        <div className="grid grid-cols-4 gap-3">
          {SPEECHX_MODULES.map((m, idx) => (
            <div
              key={m.id}
              className={`p-3 rounded-xl border text-center transition-all ${
                idx === activeModuleIdx
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                  : idx < activeModuleIdx
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-white/5 border-white/5 text-neutral-500'
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider">Step {idx + 1}</p>
              <p className="text-xs font-semibold truncate">{m.title.split(':')[1] || m.title}</p>
            </div>
          ))}
        </div>

        {evaluating ? (
          <div className="glass-panel p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
            <h2 className="text-xl font-bold text-white">Evaluating SpeechX Communication Performance...</h2>
            <p className="text-xs text-neutral-400 max-w-md">
              Gemini AI is analyzing your spoken fluency, pronunciation clarity, grammar accuracy, and hesitation penalties.
            </p>
          </div>
        ) : (
          /* Active SpeechX Item Card */
          <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-8 text-left">
            <div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2 inline-block">
                {currentModule.title} — Item {activeItemIdx + 1} of {currentModule.items.length}
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed mt-2">{currentModule.instructions}</p>
            </div>

            {/* Comprehension Passage if applicable */}
            {currentModule.passage && (
              <div className="bg-[#121217] p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Audio Passage</span>
                  <button
                    onClick={() => speakText(currentModule.passage!)}
                    className="flex items-center gap-1.5 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-all font-semibold"
                  >
                    <Volume2 className="w-4 h-4" /> Listen to Passage
                  </button>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed italic">{currentModule.passage}</p>
              </div>
            )}

            {/* Item Prompt */}
            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="flex justify-between items-start">
                <p className="text-base font-bold text-white leading-snug">{currentItem.text}</p>
                <button
                  onClick={() => speakText(currentItem.text)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-400 transition-colors flex-shrink-0 ml-4"
                  title="Read question out loud"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {isSpeaking && (
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold animate-pulse">
                  <Radio className="w-4 h-4 animate-spin" /> AI Interviewer is speaking prompt...
                </div>
              )}
            </div>

            {/* Live Microphone Recording Section */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#121217] p-5 rounded-2xl border border-white/10">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Mic className="w-4 h-4 text-sky-400" /> Your Spoken Response
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {isListening ? `Recording active... (${speakingSeconds}s)` : 'Click microphone to record your response'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {isListening ? (
                    <button
                      onClick={stopListening}
                      className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all animate-pulse"
                    >
                      <MicOff className="w-4 h-4" /> Stop Recording
                    </button>
                  ) : (
                    <button
                      onClick={startListening}
                      className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-violet-600 hover:from-sky-600 hover:to-violet-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-sky-500/10"
                    >
                      <Mic className="w-4 h-4" /> Start Mic Recording
                    </button>
                  )}
                </div>
              </div>

              {/* Real-time Candidate Transcript Box */}
              <div className="relative">
                <textarea
                  value={transcripts[itemKey] || ''}
                  onChange={e => {
                    const text = e.target.value;
                    setTranscripts(prev => ({ ...prev, [itemKey]: text }));
                    detectFillers(text);
                  }}
                  placeholder="Your recorded speech transcript will appear here in real-time as you speak..."
                  className="w-full bg-[#18181b] border border-white/10 rounded-2xl p-4 text-sm text-neutral-200 focus:outline-none focus:border-amber-500 transition-colors min-h-[100px]"
                />
                
                {fillerCount > 0 && (
                  <div className="mt-2 text-xs text-rose-400 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{fillerCount} filler word(s) detected ("um", "uh", "like", "you know")</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center border-t border-white/5 pt-6">
              <span className="text-xs text-neutral-500">
                Module {activeModuleIdx + 1} of 4
              </span>

              <button
                onClick={handleNext}
                disabled={!transcripts[itemKey]?.trim()}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-violet-600 hover:from-amber-600 hover:to-violet-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-amber-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>
                  {activeModuleIdx === SPEECHX_MODULES.length - 1 && activeItemIdx === currentModule.items.length - 1
                    ? 'Submit Assessment'
                    : 'Next Item'}
                </span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
