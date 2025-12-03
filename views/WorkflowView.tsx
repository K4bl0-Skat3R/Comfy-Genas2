import React from 'react';
import { WORKFLOW_STEPS } from '../data';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const WorkflowView: React.FC = () => {
  return (
    <div className="space-y-8 pb-20">
      <div className="bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/20 blur-[100px] rounded-full pointer-events-none"></div>
        <h2 className="text-3xl font-bold text-white mb-4 relative z-10">O "Golden Workflow" 2025</h2>
        <p className="text-lg text-gray-300 max-w-2xl relative z-10">
          Este é o fluxo exato usado por canais de tecnologia premium para criar avatares indistinguíveis da realidade. 
          O segredo não é uma única ferramenta, é a <span className="text-neon-blue font-bold">combinação</span> delas.
        </p>
      </div>

      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-neon-blue via-neon-purple to-transparent hidden md:block"></div>

        <div className="space-y-12">
          {WORKFLOW_STEPS.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative md:pl-16 group"
            >
              {/* Node Point */}
              <div className="absolute left-0 top-0 w-14 h-14 bg-dark-800 rounded-full border-2 border-neon-blue flex items-center justify-center text-neon-blue font-bold text-xl shadow-[0_0_20px_rgba(0,243,255,0.3)] z-10 hidden md:flex">
                {step.id}
              </div>

              <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 hover:border-neon-blue/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <div className="px-3 py-1 bg-neon-purple/10 text-neon-purple text-xs rounded-full font-mono border border-neon-purple/20">
                    {step.tools}
                  </div>
                </div>
                
                <p className="text-gray-400 mb-4 text-lg italic border-l-2 border-gray-700 pl-4">
                  "{step.desc}"
                </p>

                <div className="bg-black/30 p-4 rounded-xl">
                  <h4 className="text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Como executar:</h4>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {step.details}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center pt-8">
        <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
          Ver Configurações de Exportação <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
