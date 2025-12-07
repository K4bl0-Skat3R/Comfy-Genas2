import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Settings, Monitor, Move, AlertCircle, Zap, LayoutGrid, Wind, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES FOR SPEECH RECOGNITION ---
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

// --- AVATAR COMPONENT (THE PUPPET) ---
const AvatarPuppet = ({ 
  mouthState, 
  eyeState, 
  gesture, 
  emotion, 
  isFlying, 
  position 
}: { 
  mouthState: string, 
  eyeState: string, 
  gesture: string,
  emotion: 'neutral' | 'happy' | 'concerned' | 'surprised',
  isFlying: boolean,
  position: 'tl' | 'tr' | 'bl' | 'br'
}) => {
  
  // Dynamic Positioning
  const posClasses = {
    tl: 'top-8 left-8',
    tr: 'top-8 right-8',
    bl: 'bottom-8 left-8',
    br: 'bottom-8 right-8'
  };

  return (
    <motion.div 
      layout
      className={`absolute ${posClasses[position]} transition-all duration-500 z-20`}
      animate={gesture}
      variants={{
        idle: { 
          y: isFlying ? [0, -20, 0] : [0, -5, 0], 
          rotate: isFlying ? [0, 2, -2, 0] : 0,
          transition: { repeat: Infinity, duration: isFlying ? 2 : 4, ease: "easeInOut" } 
        },
        nod: { y: [0, 15, 0, 15, 0], transition: { duration: 0.5 } },
        shake: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } },
        bounce: { y: [0, -30, 0], scale: [1, 1.1, 1], transition: { duration: 0.4 } }
      }}
    >
      <div className={`relative w-48 h-48 md:w-64 md:h-64 transition-transform duration-300 ${isFlying ? 'scale-110' : 'scale-100'}`}>
        
        {/* CAPE / LAB COAT (Wind Effect) */}
        {isFlying && (
          <motion.div 
            animate={{ skewX: [-5, 5, -5], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute -z-10 bottom-0 left-[-10%] w-[120%] h-[60%] bg-white/10 blur-sm rounded-b-3xl"
          >
             <div className="w-full h-full bg-gradient-to-t from-gray-200 to-transparent opacity-30 rounded-b-3xl"></div>
          </motion.div>
        )}

        {/* BODY CONTAINER */}
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          
          {/* AURA (When Speaking) */}
          {mouthState !== 'closed' && (
             <div className="absolute inset-0 bg-neon-blue/20 blur-xl rounded-full animate-pulse"></div>
          )}

          {/* HEAD */}
          <div className="w-32 h-40 bg-[#ffdbac] rounded-[2.5rem] relative shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1)] z-10">
             
             {/* EYES */}
             <div className="absolute top-12 left-0 w-full flex justify-center gap-6 px-4">
                {/* Left Eye */}
                <div className={`relative w-8 h-3 bg-dark-900 rounded-full transition-all duration-100 ${eyeState === 'closed' ? 'scale-y-[0.1]' : 'scale-y-100'}`}>
                  {emotion === 'concerned' && <div className="absolute -top-3 -left-1 w-10 h-1 bg-dark-900 rotate-12"></div>}
                  <div className="w-2 h-2 bg-white rounded-full ml-1 mt-0.5"></div>
                </div>
                {/* Right Eye */}
                <div className={`relative w-8 h-3 bg-dark-900 rounded-full transition-all duration-100 ${eyeState === 'closed' ? 'scale-y-[0.1]' : 'scale-y-100'}`}>
                  {emotion === 'concerned' && <div className="absolute -top-3 -right-1 w-10 h-1 bg-dark-900 -rotate-12"></div>}
                  <div className="w-2 h-2 bg-white rounded-full ml-1 mt-0.5"></div>
                </div>
             </div>

             {/* MOUTH (LipSync) */}
             <div className="absolute bottom-8 left-0 w-full flex justify-center">
                <div className={`transition-all duration-75 border-2 border-dark-900 bg-red-900/80 ${
                  mouthState === 'closed' ? 'w-6 h-1 rounded-full' : 
                  mouthState === 'open_small' ? 'w-6 h-3 rounded-xl' : 
                  'w-8 h-6 rounded-[1rem]' // open_big
                }`}>
                   {mouthState === 'open_big' && <div className="w-4 h-2 bg-pink-400 rounded-t-full mx-auto mt-3"></div>}
                </div>
             </div>

             {/* ACCESSORIES (Tech Glasses + Headset) */}
             <div className="absolute top-10 left-3 w-26 h-8 border-2 border-dark-900 rounded-lg opacity-90 pointer-events-none"></div>
             <div className="absolute top-11 left-[63px] w-2 h-1 bg-dark-900"></div>
             
             {/* Mic Boom */}
             <div className="absolute top-16 -left-4 w-12 h-1 bg-gray-800 rotate-45"></div>
             <div className="absolute top-[75px] left-[35px] w-3 h-3 bg-gray-900 rounded-full"></div>

             {/* EMOTION PARTICLES */}
             <AnimatePresence>
                {emotion === 'happy' && (
                  <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -20 }} exit={{ opacity: 0 }} className="absolute -top-8 right-0 text-2xl">✨</motion.div>
                )}
                {emotion === 'concerned' && (
                  <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -20 }} exit={{ opacity: 0 }} className="absolute -top-8 right-0 text-2xl">⚠️</motion.div>
                )}
                {emotion === 'surprised' && (
                  <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -20 }} exit={{ opacity: 0 }} className="absolute -top-8 right-0 text-2xl">❗</motion.div>
                )}
             </AnimatePresence>
          </div>
          
          {/* LAB COAT / CLOTHES */}
          <div className="absolute bottom-[-20px] w-48 h-20 bg-gray-100 rounded-t-[3rem] flex justify-center pt-4 shadow-lg overflow-hidden">
              {/* Tie */}
              <div className="w-8 h-20 bg-neon-blue/80 clip-path-polygon absolute top-0"></div>
              {/* Lapels */}
              <div className="w-full h-full border-t-[20px] border-l-[20px] border-r-[20px] border-transparent border-t-white/20"></div>
              <div className="absolute bottom-2 text-[10px] font-bold text-gray-400 tracking-widest">PROFESSOR.AI</div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};


export const LiveAvatarView: React.FC = () => {
  // State
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [mouthState, setMouthState] = useState('closed');
  const [eyeState, setEyeState] = useState('open');
  const [gesture, setGesture] = useState('idle');
  const [emotion, setEmotion] = useState<'neutral'|'happy'|'concerned'|'surprised'>('neutral');
  const [position, setPosition] = useState<'tl'|'tr'|'bl'|'br'>('br');
  const [isFlying, setIsFlying] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recognitionRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const watchdogRef = useRef<any>(null);

  // --- 1. AUDIO ENGINE (LipSync) ---
  const startAudioEngine = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8; 
      analyserRef.current = analyser;
      
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      
      setIsListening(true);
      setErrorMsg(null);
      startWatchdog(); // Start connection monitoring
      startSpeechRecognition(); // Start STT

    } catch (err: any) {
      handleMicError(err);
    }
  };

  const stopAudioEngine = () => {
    setIsListening(false);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    if (recognitionRef.current) recognitionRef.current.stop();
    if (watchdogRef.current) clearInterval(watchdogRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    streamRef.current = null;
    audioContextRef.current = null;
    recognitionRef.current = null;
  };

  // Watchdog: Keeps the mic alive
  const startWatchdog = () => {
    watchdogRef.current = setInterval(() => {
      if (audioContextRef.current?.state === 'suspended') {
        console.log("🔊 Watchdog: Resuming AudioContext...");
        audioContextRef.current.resume();
      }
    }, 2000);
  };

  const handleMicError = (err: any) => {
    console.error("Mic Error:", err);
    let msg = "Erro desconhecido.";
    if (err.name === 'NotAllowedError') msg = "Permissão de microfone negada.";
    else if (err.name === 'NotFoundError') msg = "Nenhum microfone encontrado.";
    else if (err.name === 'NotReadableError') msg = "Microfone em uso por outro app.";
    setErrorMsg(msg);
  };

  // Audio Processing Loop
  useEffect(() => {
    if (!isListening) return;
    const loop = () => {
      if (analyserRef.current) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b) / data.length;
        setVolume(avg);
        
        // LipSync Logic
        if (avg < 5) setMouthState('closed');
        else if (avg < 20) setMouthState('open_small');
        else setMouthState('open_big');
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isListening]);

  // --- 2. INTELLIGENCE ENGINE (Speech-to-Text) ---
  const startSpeechRecognition = () => {
    const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
    const SR = SpeechRecognition || webkitSpeechRecognition;
    
    if (!SR) return; // Browser not supported

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR'; // Detect Portuguese

    recognition.onresult = (event: any) => {
      const results = event.results;
      const transcript = results[results.length - 1][0].transcript.toLowerCase();
      setLastTranscript(transcript);
      analyzeSentiment(transcript);
    };

    recognition.onerror = (event: any) => {
      // Auto-restart on some errors if we are supposed to be listening
      if (isListening && event.error === 'no-speech') return; 
      console.log("Speech Recog Error:", event.error);
    };
    
    // Auto-restart logic
    recognition.onend = () => {
       if (isListening) recognition.start();
    };

    try { recognition.start(); } catch(e) {}
    recognitionRef.current = recognition;
  };

  // The "LLM" Logic (Keyword Spotting)
  const analyzeSentiment = (text: string) => {
    // Negative / Warning
    if (text.includes('erro') || text.includes('bug') || text.includes('falha') || text.includes('atenção') || text.includes('errado')) {
      triggerEmotion('concerned');
    }
    // Positive
    else if (text.includes('ótimo') || text.includes('excelente') || text.includes('legal') || text.includes('funcionou')) {
      triggerEmotion('happy');
      triggerGesture('bounce');
    }
    // Surprise / Highlight
    else if (text.includes('olha') || text.includes('veja') || text.includes('incrível') || text.includes('nossa')) {
      triggerEmotion('surprised');
    }
    else {
      // Revert to neutral after 2s if no keywords
      const t = setTimeout(() => setEmotion('neutral'), 2000);
      return () => clearTimeout(t);
    }
  };

  const triggerEmotion = (e: any) => {
    setEmotion(e);
    setTimeout(() => setEmotion('neutral'), 2500);
  };
  
  const triggerGesture = (g: string) => {
    setGesture(g);
    setTimeout(() => setGesture('idle'), 1000);
  };

  // --- 3. AUTO-BLINK ---
  useEffect(() => {
    const i = setInterval(() => {
      setEyeState('closed');
      setTimeout(() => setEyeState('open'), 150);
    }, 4000 + Math.random() * 2000); 
    return () => clearInterval(i);
  }, []);


  return (
    <div className="space-y-6 pb-20">
       <div className="bg-gradient-to-r from-blue-950 to-black border-l-4 border-blue-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/20 rounded-lg text-blue-400">
            <Brain size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">V16: Live Director Engine</h2>
            <div className="flex items-center gap-4 mt-1">
               <span className="text-gray-300 text-sm">
                 <strong>Smart Triggers:</strong> O sistema escuta palavras-chave ("Bug", "Legal", "Atenção") e reage automaticamente.
                 <br/>
                 <strong>Modo Voo:</strong> Simula física de flutuação e tecido (Jaleco) reagindo ao movimento.
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === MAIN PREVIEW STAGE === */}
        <div className="lg:col-span-2 relative min-h-[500px] bg-dark-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
           
           {/* Background Grid */}
           <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           
           {/* Simulate Screen Content */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <div className="w-3/4 h-3/4 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center">
                 <span className="text-4xl font-bold text-gray-700 uppercase rotate-[-15deg]">Área da Tela (OBS)</span>
              </div>
           </div>

           {/* THE AVATAR */}
           <AvatarPuppet 
              mouthState={mouthState} 
              eyeState={eyeState} 
              gesture={gesture} 
              emotion={emotion}
              isFlying={isFlying}
              position={position}
           />

           {/* HUD: Transcript */}
           {isListening && (
             <div className="absolute top-4 left-4 right-4 flex justify-center pointer-events-none">
                <div className="bg-black/70 backdrop-blur px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-xs font-mono text-green-400 opacity-80 uppercase">AI_LISTENING:</span>
                   <span className="text-xs text-white italic truncate max-w-[200px] md:max-w-[400px]">"{lastTranscript || '...'}"</span>
                </div>
             </div>
           )}

           {/* HUD: Position Controls (Overlay) */}
           <div className="absolute inset-4 pointer-events-none flex flex-col justify-between z-30">
              <div className="flex justify-between">
                 <button onClick={() => setPosition('tl')} className={`w-10 h-10 rounded-lg border flex items-center justify-center pointer-events-auto transition-all ${position === 'tl' ? 'bg-neon-blue text-black border-neon-blue' : 'bg-black/50 border-white/20 text-white hover:bg-white/20'}`}>TL</button>
                 <button onClick={() => setPosition('tr')} className={`w-10 h-10 rounded-lg border flex items-center justify-center pointer-events-auto transition-all ${position === 'tr' ? 'bg-neon-blue text-black border-neon-blue' : 'bg-black/50 border-white/20 text-white hover:bg-white/20'}`}>TR</button>
              </div>
              <div className="flex justify-between">
                 <button onClick={() => setPosition('bl')} className={`w-10 h-10 rounded-lg border flex items-center justify-center pointer-events-auto transition-all ${position === 'bl' ? 'bg-neon-blue text-black border-neon-blue' : 'bg-black/50 border-white/20 text-white hover:bg-white/20'}`}>BL</button>
                 <button onClick={() => setPosition('br')} className={`w-10 h-10 rounded-lg border flex items-center justify-center pointer-events-auto transition-all ${position === 'br' ? 'bg-neon-blue text-black border-neon-blue' : 'bg-black/50 border-white/20 text-white hover:bg-white/20'}`}>BR</button>
              </div>
           </div>

        </div>

        {/* === CONTROLS PANEL === */}
        <div className="space-y-6">
           
           {/* Main Switch */}
           <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-white flex items-center gap-2"><Zap size={18} className="text-yellow-400" /> Director Core</h3>
                 <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 shadow-[0_0_8px_#0aff60]' : 'bg-red-500'}`}></div>
              </div>
              
              {errorMsg && <div className="mb-4 p-2 bg-red-900/50 text-red-200 text-xs rounded border border-red-500/30">{errorMsg}</div>}

              <button 
                onClick={isListening ? stopAudioEngine : startAudioEngine}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-500 text-white' 
                    : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
              >
                {isListening ? <><MicOff /> Encerrar Sessão</> : <><Mic /> Iniciar Live</>}
              </button>
           </div>

           {/* Physics & State */}
           <div className="bg-dark-800 p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Wind size={18} /> Physics</h3>
              <div className="flex gap-2">
                 <button 
                   onClick={() => setIsFlying(!isFlying)}
                   className={`flex-1 py-3 px-4 rounded-xl border font-medium text-sm transition-all flex flex-col items-center gap-2 ${
                     isFlying ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400'
                   }`}
                 >
                   <Wind size={20} className={isFlying ? 'animate-pulse' : ''} />
                   {isFlying ? 'Modo Voo ON' : 'Modo Voo OFF'}
                 </button>
                 
                 <div className="flex-1 bg-black/30 rounded-xl p-2 border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase font-bold text-center mb-1">Emotion State</div>
                    <div className="flex justify-center text-2xl">
                       {emotion === 'neutral' && '😐'}
                       {emotion === 'happy' && '😄'}
                       {emotion === 'concerned' && '😟'}
                       {emotion === 'surprised' && '😮'}
                    </div>
                 </div>
              </div>
           </div>

           {/* Triggers Guide */}
           <div className="bg-dark-800 p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Brain size={18} /> Keyword Triggers</h3>
              <div className="space-y-2 text-xs text-gray-400 font-mono">
                 <div className="flex justify-between p-2 bg-white/5 rounded">
                    <span>"Erro", "Bug"</span>
                    <span className="text-yellow-400">😟 Concerned</span>
                 </div>
                 <div className="flex justify-between p-2 bg-white/5 rounded">
                    <span>"Legal", "Ótimo"</span>
                    <span className="text-green-400">😄 Happy + Bounce</span>
                 </div>
                 <div className="flex justify-between p-2 bg-white/5 rounded">
                    <span>"Olha", "Veja"</span>
                    <span className="text-blue-400">😮 Surprised</span>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};