import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Zap, Wind, Keyboard, PenTool, Gamepad2, Bot, Sword, Headphones, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

type SkinId = 'professor' | 'ninja' | 'robot' | 'gamer';

interface SkinConfig {
  id: SkinId;
  name: string;
  icon: any;
  colors: { skin: string; primary: string; secondary: string };
  faceShape: 'square' | 'round' | 'wide';
  eyeType: 'dot' | 'anime' | 'line' | 'robo';
  specialAbility: {
    name: string;
    key: string;
    triggerId: string;
    icon: string;
  };
}

const SKINS: SkinConfig[] = [
  {
    id: 'professor',
    name: 'The Architect',
    icon: Zap,
    colors: { skin: '#ffdbac', primary: '#333333', secondary: '#00f3ff' },
    faceShape: 'wide',
    eyeType: 'dot',
    specialAbility: { name: 'Focus', key: 'Z', triggerId: 'nod', icon: '💡' }
  },
  {
    id: 'ninja',
    name: 'Cyber Ninja',
    icon: Sword,
    colors: { skin: '#e0ac69', primary: '#1a1a1a', secondary: '#ff0055' },
    faceShape: 'round',
    eyeType: 'anime',
    specialAbility: { name: 'Shadow Dash', key: 'C', triggerId: 'ninja_attack', icon: '⚔️' }
  },
  {
    id: 'robot',
    name: 'B0T-9000',
    icon: Bot,
    colors: { skin: '#b0b0b0', primary: '#505050', secondary: '#0aff60' },
    faceShape: 'square',
    eyeType: 'robo',
    specialAbility: { name: 'Sys Scan', key: 'X', triggerId: 'robo_scan', icon: '📡' }
  },
  {
    id: 'gamer',
    name: 'Streamer Pro',
    icon: Headphones,
    colors: { skin: '#8d5524', primary: '#2d0a31', secondary: '#bc13fe' },
    faceShape: 'wide',
    eyeType: 'dot',
    specialAbility: { name: 'Rage Mode', key: 'R', triggerId: 'gamer_rage', icon: '🤬' }
  }
];

// --- ASSETS COMPONENTS (CSS ART) ---

const NinjaMask = ({ color }: { color: string }) => (
  <div className="absolute top-10 left-0 w-full h-8 bg-black z-30 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full bg-black border-2 border-white/20 -mt-8 flex items-center justify-center">
         <div className="text-[8px] text-white">忍</div>
      </div>
      <motion.div 
         animate={{ x: [0, 50, 0] }} 
         transition={{ duration: 2, repeat: Infinity }}
         className="absolute right-0 w-12 h-2 bg-red-600 top-2 rotate-12 -z-10 opacity-80"
      />
  </div>
);

const RoboAntenna = ({ color }: { color: string }) => (
  <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-0">
     <motion.div 
       animate={{ opacity: [0.2, 1, 0.2] }} 
       transition={{ duration: 1, repeat: Infinity }}
       className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" 
       style={{ backgroundColor: color }} 
     />
     <div className="w-1 h-6 bg-gray-400"></div>
  </div>
);

const GamerHeadset = ({ color }: { color: string }) => (
  <>
    <div className="absolute top-8 -left-4 w-6 h-16 bg-black rounded-xl border-2 border-gray-700 z-30">
       <motion.div animate={{ backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ff0000'] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 opacity-50 rounded-xl blur-sm" />
    </div>
    <div className="absolute top-8 -right-4 w-6 h-16 bg-black rounded-xl border-2 border-gray-700 z-30">
       <motion.div animate={{ backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ff0000'] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 opacity-50 rounded-xl blur-sm" />
    </div>
    <div className="absolute -top-2 left-0 w-full h-8 border-t-8 border-black rounded-t-full z-20"></div>
  </>
);

const PencilProp = () => (
  <motion.div 
    initial={{ scale: 0, rotate: 180 }}
    animate={{ scale: 1, rotate: 45 }}
    exit={{ scale: 0 }}
    className="absolute -right-6 -top-10 w-4 h-24 bg-yellow-400 border-2 border-black rounded-sm shadow-lg origin-bottom z-50"
  >
    <div className="absolute top-0 w-full h-4 bg-pink-400 border-b border-black"></div>
    <div className="absolute bottom-0 w-full h-0 border-l-[7px] border-r-[7px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400 translate-y-full"></div>
    <div className="absolute bottom-[-14px] left-[5px] w-[4px] h-[4px] bg-black rounded-full"></div>
  </motion.div>
);

// --- AVATAR COMPONENT (THE PUPPET) ---
const AvatarPuppet = ({ 
  mouthState, 
  eyeState, 
  gesture, 
  emotion, 
  isFlying, 
  position,
  activeProp,
  skin,
  hasCap
}: { 
  mouthState: string, 
  eyeState: string, 
  gesture: string, 
  emotion: 'neutral' | 'happy' | 'concerned' | 'surprised',
  isFlying: boolean, 
  position: 'tl' | 'tr' | 'bl' | 'br',
  activeProp: 'none' | 'pencil',
  skin: SkinConfig,
  hasCap?: boolean
}) => {
  
  const posClasses = {
    tl: 'top-12 left-12',
    tr: 'top-12 right-12',
    bl: 'bottom-8 left-12',
    br: 'bottom-8 right-12'
  };

  const getBorderRadius = () => {
    switch(skin.faceShape) {
      case 'round': return '50%';
      case 'square': return '0.5rem';
      case 'wide': return '2rem';
      default: return '2.5rem';
    }
  };

  return (
    <motion.div 
      layout
      className={`absolute ${posClasses[position]} transition-all duration-500 z-20`}
      animate={gesture}
      initial="reset"
      variants={{
        reset: { x: 0, y: 0, rotate: 0, scale: 1 },
        idle: { 
          y: isFlying ? [0, -20, 0] : [0, -5, 0], 
          rotate: isFlying ? [0, 2, -2, 0] : 0,
          x: 0, scale: 1,
          transition: { repeat: Infinity, duration: isFlying ? 2 : 4, ease: "easeInOut" } 
        },
        nod: { y: [0, 15, 0, 15, 0], x: 0, rotate: 0, transition: { duration: 0.5 } },
        bounce: { y: [0, -30, 0], scale: [1, 1.1, 1], rotate: 0, transition: { duration: 0.4 } },
        celebrate: { 
          y: [0, -100, 0], 
          rotate: [0, 360, 720], 
          scale: [1, 1.2, 1],
          transition: { duration: 1.2, ease: "easeInOut" } 
        },
        // --- SKIN ABILITIES ---
        ninja_attack: {
          x: [0, -50, 200, 0],
          rotate: [0, -20, 10, 0],
          transition: { duration: 0.4, ease: "circOut" }
        },
        robo_scan: {
          rotate: [0, 10, -10, 5, -5, 0],
          scale: 1.05,
          transition: { duration: 1.5, ease: "linear" }
        },
        gamer_rage: {
          x: [-5, 5, -5, 5, -5, 5],
          y: [-5, 5, -5, 5],
          scale: 1.1,
          transition: { duration: 0.3, repeat: 2 }
        }
      }}
    >
      <div className={`relative w-48 h-48 md:w-64 md:h-64 transition-transform duration-300 ${isFlying ? 'scale-110' : 'scale-100'}`}>
        
        {/* === BACK LAYER (Cape/Effects) === */}
        {isFlying && (
          <motion.div 
            animate={{ skewX: [-5, 5, -5], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute -z-20 bottom-0 left-[-10%] w-[120%] h-[80%] bg-gradient-to-t from-gray-200/20 to-transparent blur-md rounded-b-3xl"
          />
        )}
        
        {/* Ninja Shadow Trail */}
        {gesture === 'ninja_attack' && (
           <div className="absolute inset-0 bg-red-500/30 blur-xl rounded-full animate-ping"></div>
        )}

        {/* === BODY CONTAINER === */}
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          
          {/* HEAD GROUP */}
          <div className="relative z-20 w-32 h-40">
             
             {/* ACCESSORIES */}
             {skin.id === 'robot' && <RoboAntenna color={skin.colors.secondary} />}
             {skin.id === 'gamer' && <GamerHeadset color={skin.colors.secondary} />}

             {/* The Face */}
             <div 
               className="w-full h-full relative shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1)] border-2 border-black/5 overflow-hidden transition-all duration-300"
               style={{ 
                 backgroundColor: skin.colors.skin,
                 borderRadius: getBorderRadius(),
                 borderColor: skin.id === 'robot' ? '#555' : 'rgba(0,0,0,0.05)'
               }}
             >
                {/* Ninja Mask */}
                {skin.id === 'ninja' && <NinjaMask color={skin.colors.primary} />}
                
                {/* EYES */}
                <div className="absolute top-12 left-0 w-full flex justify-center gap-6 px-4 z-40">
                    {/* Left Eye */}
                    <div className={`relative bg-dark-900 transition-all duration-100 
                      ${skin.eyeType === 'anime' ? 'w-10 h-10 rounded-full border-4 border-black bg-white overflow-hidden' : 
                        skin.eyeType === 'robo' ? 'w-10 h-4 rounded-none bg-black border border-green-500' : 'w-8 h-3 rounded-full'}
                      ${eyeState === 'closed' ? 'scale-y-[0.1]' : 'scale-y-100'}
                    `}>
                      {skin.eyeType === 'anime' && (
                         <div className="absolute right-1 bottom-1 w-6 h-6 bg-black rounded-full"><div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div></div>
                      )}
                      {skin.eyeType === 'robo' && (
                         <div className={`w-full h-full opacity-50 ${gesture === 'robo_scan' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                      )}
                      {skin.eyeType === 'dot' && <div className="w-2 h-2 bg-white rounded-full ml-1 mt-0.5"></div>}
                    </div>

                    {/* Right Eye */}
                    <div className={`relative bg-dark-900 transition-all duration-100 
                      ${skin.eyeType === 'anime' ? 'w-10 h-10 rounded-full border-4 border-black bg-white overflow-hidden' : 
                        skin.eyeType === 'robo' ? 'w-10 h-4 rounded-none bg-black border border-green-500' : 'w-8 h-3 rounded-full'}
                      ${eyeState === 'closed' ? 'scale-y-[0.1]' : 'scale-y-100'}
                    `}>
                      {skin.eyeType === 'anime' && (
                         <div className="absolute right-1 bottom-1 w-6 h-6 bg-black rounded-full"><div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div></div>
                      )}
                       {skin.eyeType === 'robo' && (
                         <div className={`w-full h-full opacity-50 ${gesture === 'robo_scan' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                      )}
                      {skin.eyeType === 'dot' && <div className="w-2 h-2 bg-white rounded-full ml-1 mt-0.5"></div>}
                    </div>
                </div>
                
                {/* Robo Scan Laser */}
                {gesture === 'robo_scan' && (
                  <div className="absolute top-14 left-0 w-full h-1 bg-red-500 opacity-50 animate-pulse blur-sm z-50"></div>
                )}

                {/* MOUTH */}
                <div className="absolute bottom-8 left-0 w-full flex justify-center z-40">
                    <div className={`transition-all duration-75 border-2 border-dark-900 bg-red-900/80 ${
                      mouthState === 'closed' ? 'w-6 h-1 rounded-full' : 
                      mouthState === 'open_small' ? 'w-6 h-3 rounded-xl' : 
                      'w-8 h-6 rounded-[1rem]'
                    }`}>
                       {mouthState === 'open_big' && <div className="w-4 h-2 bg-pink-400 rounded-t-full mx-auto mt-3"></div>}
                    </div>
                </div>

                {/* Mic */}
                <div className="absolute top-16 -left-4 w-12 h-1 bg-gray-800 rotate-45 z-40"></div>
                <div className="absolute top-[75px] left-[35px] w-3 h-3 bg-gray-900 rounded-full z-40"></div>
             </div>
          </div>
          
          {/* BODY GROUP */}
          <div className="relative z-10 -mt-4">
             {/* ARMS */}
             <div className="absolute top-4 -left-8 w-8 h-20 bg-gray-800 rounded-full origin-top transform -rotate-12 border-2 border-black z-0"></div>
             
             <motion.div 
               animate={{ 
                 rotate: activeProp !== 'none' || gesture === 'ninja_attack' ? -140 : 12, 
                 x: activeProp !== 'none' ? 10 : 0 
               }}
               className="absolute top-4 -right-8 w-8 h-20 bg-gray-800 rounded-full origin-top border-2 border-black z-20 flex justify-center items-end pb-2"
             >
                <div className="w-6 h-6 rounded-full border border-black relative" style={{ backgroundColor: skin.colors.skin }}>
                   <AnimatePresence>
                     {activeProp === 'pencil' && <PencilProp />}
                   </AnimatePresence>
                </div>
             </motion.div>

             {/* TORSO / COAT */}
             <div className="w-40 h-24 bg-gray-100 rounded-t-[3rem] rounded-b-xl flex justify-center pt-6 shadow-lg border-2 border-black/10 relative z-10">
                  <div className="w-6 h-20 clip-path-polygon absolute top-0" style={{ backgroundColor: skin.colors.primary }}></div>
                  <div className="w-full h-full border-t-[20px] border-l-[20px] border-r-[20px] border-transparent border-t-white/50"></div>
                  {/* Logo Badge */}
                  <div 
                    className="absolute bottom-2 text-[8px] font-bold text-gray-800 tracking-widest border border-gray-400/30 px-1 rounded bg-white/50"
                  >
                    {skin.id === 'robot' ? 'CPU' : skin.id === 'ninja' ? 'DOJO' : 'DEV'}
                  </div>
             </div>

             {/* LEGS */}
             <div className="absolute top-20 w-full flex justify-center gap-4 z-0">
                <motion.div 
                  animate={isFlying ? { rotate: [5, -5, 5], skewX: [2, -2, 2] } : { height: 20 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-8 h-12 bg-dark-800 rounded-b-full border-2 border-black/20"
                ></motion.div>
                <motion.div 
                  animate={isFlying ? { rotate: [-5, 5, -5], skewX: [-2, 2, -2] } : { height: 20 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-8 h-12 bg-dark-800 rounded-b-full border-2 border-black/20"
                ></motion.div>
             </div>
          </div>
          
          {/* Confetti Explosion */}
          <AnimatePresence>
            {gesture === 'celebrate' && (
              <>
                 <motion.div initial={{ opacity: 1, scale: 0 }} animate={{ opacity: 0, scale: 3, x: -50, y: -50 }} transition={{ duration: 1 }} className="absolute z-50 text-4xl">🎉</motion.div>
                 <motion.div initial={{ opacity: 1, scale: 0 }} animate={{ opacity: 0, scale: 3, x: 50, y: -50 }} transition={{ duration: 1 }} className="absolute z-50 text-4xl">🎊</motion.div>
              </>
            )}
            {gesture === 'gamer_rage' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute -top-10 text-4xl font-black text-red-500">🤬#@!</motion.div>
            )}
          </AnimatePresence>

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
  
  // V21 Skin System
  const [activeSkinId, setActiveSkinId] = useState<SkinId>('professor');
  const [activeProp, setActiveProp] = useState<'none' | 'pencil'>('none');
  const [hasCap, setHasCap] = useState(false);

  const activeSkin = SKINS.find(s => s.id === activeSkinId) || SKINS[0];

  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recognitionRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const watchdogRef = useRef<any>(null);
  const animationTimerRef = useRef<any>(null);

  // --- SAFE ANIMATION TRIGGER ---
  const safeTriggerGesture = (newGesture: string, duration: number = 1000) => {
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    setGesture('reset');
    setTimeout(() => {
       setGesture(newGesture);
       animationTimerRef.current = setTimeout(() => {
         setGesture('idle');
       }, duration);
    }, 20);
  };

  // --- KEYBOARD LISTENER (WASD + ABILITIES) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      const key = e.key.toUpperCase();
      
      // Position Logic (WASD)
      setPosition((prev) => {
        const currentY = prev[0]; 
        const currentX = prev[1];
        switch(key) {
          case 'W': return `t${currentX}` as any;
          case 'S': return `b${currentX}` as any;
          case 'A': return `${currentY}l` as any;
          case 'D': return `${currentY}r` as any;
          default: return prev;
        }
      });

      // Global Actions
      if (key === ' ') { 
        e.preventDefault();
        setEmotion('happy');
        safeTriggerGesture('celebrate', 1500);
      }
      if (key === 'F') setIsFlying(prev => !prev);

      // --- SKIN SPECIAL ABILITIES ---
      // Dynamically check if the pressed key matches the current skin's ability
      const currentSkin = SKINS.find(s => s.id === activeSkinId);
      if (currentSkin && key === currentSkin.specialAbility.key) {
        safeTriggerGesture(currentSkin.specialAbility.triggerId, 1200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSkinId]); // Re-bind listener when skin changes to ensure correct logic if needed

  // --- AUDIO ENGINE ---
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
      startWatchdog();
      startSpeechRecognition();
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

  const startWatchdog = () => {
    watchdogRef.current = setInterval(() => {
      if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
    }, 2000);
  };

  const handleMicError = (err: any) => {
    let msg = "Erro desconhecido.";
    if (err.name === 'NotAllowedError') msg = "Permissão de microfone negada.";
    else if (err.name === 'NotFoundError') msg = "Nenhum microfone encontrado.";
    setErrorMsg(msg);
  };

  useEffect(() => {
    if (!isListening) return;
    const loop = () => {
      if (analyserRef.current) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b) / data.length;
        setVolume(avg);
        if (avg < 5) setMouthState('closed');
        else if (avg < 20) setMouthState('open_small');
        else setMouthState('open_big');
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isListening]);

  const startSpeechRecognition = () => {
    const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
    const SR = SpeechRecognition || webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';
    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      setLastTranscript(transcript);
      analyzeSentiment(transcript);
    };
    recognition.onend = () => { if (isListening) recognition.start(); };
    try { recognition.start(); } catch(e) {}
    recognitionRef.current = recognition;
  };

  const analyzeSentiment = (text: string) => {
    if (text.includes('escrever') || text.includes('anotar')) {
      setActiveProp('pencil');
      safeTriggerGesture('nod');
    }
    if (text.includes('limpar') || text.includes('guardar')) {
      setActiveProp('none');
      setHasCap(false);
    }
    // Simple logic: Trigger the current skin ability if keyword mentioned
    if (text.includes('ataque') && activeSkin.id === 'ninja') safeTriggerGesture('ninja_attack');
    if (text.includes('scan') && activeSkin.id === 'robot') safeTriggerGesture('robo_scan');
    
    if (text.includes('erro') || text.includes('bug')) triggerEmotion('concerned');
    else if (text.includes('ótimo') || text.includes('legal')) { triggerEmotion('happy'); safeTriggerGesture('bounce'); }
    else if (text.includes('olha') || text.includes('veja')) triggerEmotion('surprised');
    else {
      const t = setTimeout(() => setEmotion('neutral'), 2000);
      return () => clearTimeout(t);
    }
  };

  const triggerEmotion = (e: any) => {
    setEmotion(e);
    setTimeout(() => setEmotion('neutral'), 2500);
  };
  
  // Auto Blink
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
            <Zap size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">V21: Skin & Ability System</h2>
            <div className="flex items-center gap-4 mt-1">
               <span className="text-gray-300 text-sm">
                 <strong>Character Class:</strong> Escolha sua Skin. Cada uma tem uma habilidade única.
                 <br/>
                 <strong>Special Ability:</strong> Pressione a tecla de ação indicada (<span className="text-white font-bold bg-white/10 px-1 rounded">C</span>, <span className="text-white font-bold bg-white/10 px-1 rounded">X</span>, <span className="text-white font-bold bg-white/10 px-1 rounded">R</span>) para ativar o movimento especial.
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === MAIN PREVIEW STAGE === */}
        <div className="lg:col-span-2 relative min-h-[500px] bg-dark-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
           <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <div className="w-3/4 h-3/4 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center">
                 <span className="text-4xl font-bold text-gray-700 uppercase rotate-[-15deg]">Área da Tela (OBS)</span>
              </div>
           </div>

           <AvatarPuppet 
              mouthState={mouthState} 
              eyeState={eyeState} 
              gesture={gesture} 
              emotion={emotion}
              isFlying={isFlying}
              position={position}
              activeProp={activeProp}
              skin={activeSkin}
              hasCap={hasCap} // Legacy support
           />

           {isListening && (
             <div className="absolute top-4 left-4 right-4 flex justify-center pointer-events-none">
                <div className="bg-black/70 backdrop-blur px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-xs font-mono text-green-400 opacity-80 uppercase">LISTENING:</span>
                   <span className="text-xs text-white italic truncate max-w-[200px] md:max-w-[400px]">"{lastTranscript || '...'}"</span>
                </div>
             </div>
           )}

           {/* Ability Hint Overlay */}
           <div className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-lg border border-white/5 backdrop-blur-sm pointer-events-none opacity-80">
              <div className="flex flex-col items-center gap-1">
                 <span className="text-[10px] text-gray-400 uppercase font-bold">Special Move</span>
                 <div className="flex items-center gap-2 text-neon-blue">
                    <span className="text-xl">{activeSkin.specialAbility.icon}</span>
                    <span className="font-bold border border-neon-blue/50 px-2 rounded bg-neon-blue/10">{activeSkin.specialAbility.key}</span>
                 </div>
                 <span className="text-[9px] text-gray-300">{activeSkin.specialAbility.name}</span>
              </div>
           </div>
        </div>

        {/* === CONTROLS PANEL === */}
        <div className="space-y-6">
           
           <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-white flex items-center gap-2"><Zap size={18} className="text-yellow-400" /> Director Core</h3>
                 <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 shadow-[0_0_8px_#0aff60]' : 'bg-red-500'}`}></div>
              </div>
              
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

           {/* SKIN SELECTOR (NEW) */}
           <div className="bg-dark-800 p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Gamepad2 size={18} /> Seleção de Skin</h3>
              <div className="grid grid-cols-2 gap-3">
                 {SKINS.map((skin) => (
                    <button
                      key={skin.id}
                      onClick={() => setActiveSkinId(skin.id)}
                      className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 relative overflow-hidden ${
                         activeSkinId === skin.id 
                           ? 'bg-white/10 border-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.2)]' 
                           : 'bg-black/20 border-white/5 hover:bg-white/5'
                      }`}
                    >
                       <skin.icon size={24} className={activeSkinId === skin.id ? 'text-neon-blue' : 'text-gray-500'} />
                       <span className={`text-xs font-bold ${activeSkinId === skin.id ? 'text-white' : 'text-gray-400'}`}>{skin.name}</span>
                       {activeSkinId === skin.id && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-neon-blue rounded-full"></div>
                       )}
                    </button>
                 ))}
              </div>
           </div>

           {/* Physics & Props */}
           <div className="bg-dark-800 p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Wind size={18} /> Physics & Props</h3>
              <div className="flex gap-2 mb-3">
                 <button 
                   onClick={() => setIsFlying(!isFlying)}
                   className={`flex-1 py-3 px-4 rounded-xl border font-medium text-sm transition-all flex flex-col items-center gap-2 ${
                     isFlying ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400'
                   }`}
                 >
                   <Wind size={20} className={isFlying ? 'animate-pulse' : ''} />
                   {isFlying ? 'Voo ON' : 'Voo OFF'}
                 </button>
                 
                 <button 
                   onClick={() => setActiveProp(activeProp === 'none' ? 'pencil' : 'none')}
                   className={`flex-1 py-3 px-4 rounded-xl border font-medium text-sm transition-all flex flex-col items-center gap-2 ${
                     activeProp === 'pencil' ? 'bg-yellow-600/20 border-yellow-500 text-yellow-400' : 'bg-white/5 border-white/10 text-gray-400'
                   }`}
                 >
                   <PenTool size={20} />
                   {activeProp === 'pencil' ? 'Lápis' : 'Sem Item'}
                 </button>
              </div>
           </div>
           
           {/* Keyboard Guide */}
           <div className="bg-dark-800 p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Keyboard size={18} /> Atalhos Gamer</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                 <div className="bg-white/5 p-2 rounded flex justify-between items-center">
                    <span>Mover</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-white font-bold">WASD</span>
                 </div>
                 <div className="bg-white/5 p-2 rounded flex justify-between items-center">
                    <span>Celebrar</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-white font-bold">SPACE</span>
                 </div>
                 <div className="bg-neon-blue/10 p-2 rounded flex justify-between items-center col-span-2 border border-neon-blue/30 text-neon-blue">
                    <span className="flex items-center gap-1">Habilidade</span>
                    <span className="bg-neon-blue/20 px-2 py-0.5 rounded text-white font-bold">{activeSkin.specialAbility.key}</span>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};