import React, { useState } from 'react';
import { VOICE_TIPS } from '../data';
import { motion } from 'framer-motion';
import { Play, Mic, AlertCircle, Wand2 } from 'lucide-react';

export const VoiceView: React.FC = () => {
  const [demoScript, setDemoScript] = useState("A inteligência artificial não vai substituir programadores, mas programadores que usam IA vão substituir os que não usam.");
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    setAnalyzed(true);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Simulator Section */}
        <div className="space-y-6">
          <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Mic className="text-neon-green" /> Prompt Lab de Voz
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Digite seu script abaixo para ver como otimizar para TTS natural (Simulação Visual).
            </p>
            
            <textarea
              className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-neon-green/50 font-mono text-sm resize-none"
              value={demoScript}
              onChange={(e) => {
                setDemoScript(e.target.value);
                setAnalyzed(false);
              }}
            />

            <div className="flex gap-3 mt-4">
              <button 
                onClick={handleAnalyze}
                className="flex-1 bg-neon-green/10 text-neon-green border border-neon-green/20 py-2 rounded-lg font-medium hover:bg-neon-green/20 transition-colors flex items-center justify-center gap-2"
              >
                <Wand2 size={16} /> Otimizar Script
              </button>
            </div>

            {analyzed && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 bg-black/60 p-4 rounded-xl border border-green-900/50"
              >
                <h4 className="text-xs font-bold text-green-400 mb-2 uppercase">Versão Otimizada (SSML Style):</h4>
                <p className="font-mono text-xs text-gray-300 leading-relaxed">
                  "A inteligência artificial... <span className="text-yellow-400">&lt;break time="0.3s" /&gt;</span> <span className="text-blue-400 font-bold">NÃO</span> vai substituir programadores. <br/><br/> Mas... <span className="text-yellow-400">&lt;break time="0.5s" /&gt;</span> programadores que usam I.A. <span className="text-yellow-400">&lt;break time="0.2s" /&gt;</span> vão substituir os que não usam."
                </p>
                <div className="mt-3 flex items-start gap-2 text-xs text-gray-500">
                  <AlertCircle size={12} className="mt-0.5" />
                  <span>Dica: Use ênfase em maiúsculas e quebras de linha para ditar o ritmo.</span>
                </div>
              </motion.div>
            )}
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 rounded-2xl border border-white/5">
             <h3 className="font-bold text-white mb-2">Speech-to-Speech (S2S)</h3>
             <p className="text-sm text-gray-400 mb-4">
               A ferramenta secreta dos profissionais. Em vez de escrever, você fala, e a IA imita sua entonação com a voz do avatar.
             </p>
             <div className="flex gap-2">
                <div className="h-10 w-1 bg-neon-purple animate-[pulse_1s_ease-in-out_infinite]"></div>
                <div className="h-10 w-1 bg-neon-purple animate-[pulse_1.2s_ease-in-out_infinite]"></div>
                <div className="h-10 w-1 bg-neon-purple animate-[pulse_0.8s_ease-in-out_infinite]"></div>
                <div className="h-10 w-1 bg-neon-blue animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                <div className="h-10 w-1 bg-neon-blue animate-[pulse_0.9s_ease-in-out_infinite]"></div>
             </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="space-y-6">
          {VOICE_TIPS.map((tip, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-dark-800 p-6 rounded-xl border border-white/5 hover:border-gray-600 transition-colors"
            >
              <h3 className="text-lg font-bold text-white mb-2">{tip.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{tip.content}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
