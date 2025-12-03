import React, { useState } from 'react';
import { Cpu, Copy, Check, Zap, Layers, AlertTriangle, Download, ExternalLink, Box, GitBranch, AlertCircle, FolderOpen, Terminal, PlayCircle, Package, RefreshCw, FileCode } from 'lucide-react';
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
    <div className="bg-black/50 rounded-lg border border-white/10 overflow-hidden font-mono text-xs my-3 group">
      <div className="flex justify-between items-center px-4 py-2 bg-white/5 border-b border-white/5">
        <span className="text-gray-400 font-bold">{label}</span>
        <button 
          onClick={() => copyToClipboard(code, id)}
          className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded"
          title="Copiar código"
        >
          {copiedId === id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-4 text-green-400 overflow-x-auto whitespace-pre font-mono text-[11px] leading-relaxed select-all">
        {code}
      </div>
    </div>
  );

  const batchContent = `@echo off
echo --- INICIANDO COMFYUI COM PYTHON 3.12 (SYSTEM) ---
echo Se der erro de falta de libs, instale via pip no Python 3.12
echo ---------------------------------------------------
py -3.12 ComfyUI\\main.py --windows-standalone-build
pause`;

  const installCommand = `py -3.12 -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124
py -3.12 -m pip install safetensors aiohttp pyyaml pillow scipy tqdm psutil mediapipe numpy opencv-python gitpython requests`;

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
            
            {/* INSTALL DEPENDENCIES GUIDE */}
            <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 p-6 rounded-2xl relative overflow-hidden">
               
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                   <Package size={24} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-white">Etapa Final: Instalar Bibliotecas</h3>
                   <p className="text-sm text-gray-300">
                     O erro <code>ModuleNotFoundError: safetensors</code> confirma que o Python 3.12 está "vazio".<br/>
                     Precisamos instalar o <strong>Torch (Cuda)</strong> e o <strong>Core do ComfyUI</strong> nele.
                   </p>
                 </div>
               </div>
               
               <div className="space-y-6">
                  {/* STEP 1 */}
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                       <Terminal size={16} className="text-neon-blue"/> Comando de Instalação Mestre
                    </h4>
                    <p className="text-xs text-gray-400 mb-3">
                       Copie e cole este bloco inteiro no seu Terminal (PowerShell) e dê Enter. Vai baixar cerca de 2GB a 3GB (PyTorch).
                    </p>
                    <CodeBlock 
                      id="install-command"
                      label="PowerShell Command"
                      code={installCommand}
                    />
                  </div>

                  {/* STEP 2 */}
                  <div className="flex items-start gap-3 p-4 bg-green-900/10 border border-green-500/20 rounded-xl">
                     <PlayCircle className="text-green-500 shrink-0 mt-1" size={20} />
                     <div>
                        <h4 className="text-green-400 font-bold text-sm">Após a instalação terminar:</h4>
                        <p className="text-xs text-gray-400 mt-1">
                           Rode novamente o arquivo <strong>run_system_python.bat</strong> que você criou. O ComfyUI deve abrir normalmente.
                        </p>
                     </div>
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