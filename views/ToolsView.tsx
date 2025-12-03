import React from 'react';
import { TOOLS } from '../data';
import { motion } from 'framer-motion';
import { Check, X, DollarSign } from 'lucide-react';

export const ToolsView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Top 5 Ferramentas (2025)</h2>
        <p className="text-gray-400">Seleção curada para qualidade máxima de estúdio. Baseado em benchmarks de Dezembro 2025.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map((tool, index) => (
          <motion.div 
            key={tool.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-dark-800 rounded-2xl p-6 border border-white/5 hover:border-neon-purple/50 transition-colors group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <tool.icon size={64} />
            </div>

            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-xs text-neon-blue mb-4 border border-white/5">
                {tool.category}
              </span>
              <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-400 mb-6">
                <DollarSign size={14} />
                <span>{tool.price}</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">Prós</h4>
                  <ul className="space-y-1">
                    {tool.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check size={14} className="text-green-500 mt-1 shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">Contras</h4>
                  <ul className="space-y-1">
                    {tool.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <X size={14} className="text-red-500 mt-1 shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-xs text-gray-500">Ideal para:</p>
                <p className="text-sm font-medium text-neon-purple">{tool.bestFor}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
