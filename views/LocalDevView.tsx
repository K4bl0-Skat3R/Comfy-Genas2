import React, { useState } from 'react';
import { Cpu, Copy, Check, Zap, Layers, AlertTriangle, Download, ExternalLink, Box, GitBranch, AlertCircle, FolderOpen, Terminal, PlayCircle, Package } from 'lucide-react';
import { COMFY_WORKFLOWS } from '../data';
import { motion } from 'framer-motion';

export const LocalDevView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'setup' | 'workflows'>('setup');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const CodeBlock = ({ id, code, label }: { id: string, code: string, label: string }) => (
    <div className="bg-black/50 rounded-lg border border-white/10 overflow-hidden font-mono text-xs my-3">
      <div className="flex justify-between items-center px-4 py-2 bg-white/5 border-b border-white/5">
        <span className="text-gray-400">{label}</span>
        <button 
          onClick={() => copyToClipboard(code, id)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {copiedId === id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-4 text-green-400 overflow-x-auto whitespace-pre">
        {code}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Header Hardware Spec */}
      <div className="bg-dark-800 border-l-4 border-neon-blue p-6 rounded-r-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-neon-blue/10 rounded-lg text-neon-blue">
            <Cpu size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Setup: RTX 4070 Ti Super + ComfyUI</h2>
            <p className="text-gray-400 font-mono text-sm">VRAM: 16GB | RAM: 64GB | Path: ...\ComfyUI_windows_portable</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button 
          onClick={() => setActiveTab('setup')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'setup' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Diagnóstico & Fix
          {activeTab === 'setup' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-blue"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('workflows')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'workflows' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Workflow Library (.json)
          {activeTab === 'workflows' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-purple"></div>}
        </button>
      </div>

      {/* Content */}
      <div className="pt-4">
        {activeTab === 'setup' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-3">
               <div className="p-2 bg-green-500/20 rounded-full text-green-500">
                 <Check size={20} />
               </div>
               <div>
                 <h4 className="font-bold text-white">Landmark Model Carregado!</h4>
                 <p className="text-xs text-gray-400">O erro anterior foi corrigido (warmup time: 0.040s). O modelo está funcional.</p>
               </div>
            </div>

            {/* MISSING DEPENDENCY - MEDIAPIPE */}
            <div className="bg-orange-900/10 border border-orange-500/50 p-6 rounded-2xl animate-pulse-slow relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Package size={100} className="text-orange-500" />
               </div>
               <h3 className="text-xl font-bold text-orange-400 flex items-center gap-2 mb-4 relative z-10">
                 <AlertTriangle size={24} /> 
                 Falta Instalar: MediaPipe
               </h3>
               
               <p className="text-gray-300 text-sm mb-4 relative z-10 leading-relaxed">
                 O erro <code>ModuleNotFoundError: No module named 'mediapipe'</code> indica que esta biblioteca específica (usada para detectar o rosto) não foi instalada automaticamente. Vamos instalá-la manualmente.
               </p>

               <div className="bg-black/40 p-4 rounded-xl border border-orange-500/20 relative z-10">
                  <h4 className="text-sm font-bold text-white mb-2">Comando de Correção (PowerShell)</h4>
                  <p className="text-xs text-gray-400 mb-2">
                    Execute este comando na raiz da sua pasta ComfyUI (onde está o run_nvidia_gpu.bat).
                  </p>
                  <CodeBlock 
                    id="pip-mediapipe"
                    label="Instalar MediaPipe"
                    code={`C:\\Users\\Genas-AI\\Documents\\COMFyUI\\ComfyUI_windows_portable\\python_embeded\\python.exe -m pip install mediapipe`}
                  />
               </div>
            </div>

            {/* VERIFICATION */}
            <div className="bg-gradient-to-r from-blue-900/10 to-purple-900/10 border border-white/10 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <PlayCircle size={24} className="text-neon-blue" /> Próximo Passo
              </h3>
              
              <div className="space-y-4">
                 <p className="text-sm text-gray-300">
                   1. Rode o comando acima e espere terminar (deve ser rápido).<br/>
                   2. <strong>Feche</strong> a janela preta do ComfyUI se estiver aberta.<br/>
                   3. Inicie novamente pelo <code>run_nvidia_gpu.bat</code>.
                 </p>
                 <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                   <h4 className="text-xs uppercase font-bold text-gray-500 mb-2">Nota Técnica:</h4>
                   <p className="text-sm text-gray-400">
                     Se o erro persistir pedindo <code>protobuf</code>, o pip deve resolver sozinho. Se não, avise aqui!
                   </p>
                 </div>
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
             <div className="bg-blue-900/20 border border-blue-500/20 p-6 rounded-2xl mb-6">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><GitBranch className="text-blue-400"/> Hub de Workflows (.json)</h3>
                <p className="text-sm text-gray-300">
                  Abaixo estão os fluxos de trabalho exatos que você mencionou. Baixe o JSON da fonte e arraste para o ComfyUI. O Comfy Manager deve detectar nodes faltantes.
                </p>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {COMFY_WORKFLOWS.map((wf, idx) => (
                  <div key={idx} className="bg-dark-800 border border-white/5 p-6 rounded-xl hover:border-neon-purple/40 transition-colors group">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-white group-hover:text-neon-purple transition-colors">{wf.title}</h4>
                          <span className="text-xs font-mono text-gray-500 bg-black/30 px-2 py-1 rounded border border-white/5 mt-2 inline-block">
                            Min VRAM: {wf.vram}
                          </span>
                        </div>
                        <a 
                          href={wf.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                          title="Ir para Fonte"
                        >
                          <ExternalLink size={20} />
                        </a>
                     </div>
                     
                     <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                       {wf.description}
                     </p>

                     <div className="bg-black/40 p-3 rounded-lg border border-white/5 mb-4">
                        <span className="text-xs text-gray-500 uppercase font-bold block mb-2">Nodes Obrigatórios</span>
                        <div className="flex flex-wrap gap-2">
                          {wf.nodes.map((node, nIdx) => (
                            <span key={nIdx} className="text-xs text-neon-blue bg-neon-blue/10 px-2 py-1 rounded">
                              {node}
                            </span>
                          ))}
                        </div>
                     </div>

                     <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          wf.difficulty === 'Medium' ? 'text-yellow-400 bg-yellow-400/10' :
                          wf.difficulty === 'Hard' ? 'text-orange-400 bg-orange-400/10' :
                          'text-red-500 bg-red-500/10'
                        }`}>
                          Nível: {wf.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          Fonte: {wf.linkType}
                        </span>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};