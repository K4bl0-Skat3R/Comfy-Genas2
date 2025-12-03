import React, { useState } from 'react';
import { Copy, Check, Terminal, PlayCircle, Package, CheckCircle, Upload, ArrowRight, Download, AlertTriangle, FileVideo } from 'lucide-react';
import { COMFY_WORKFLOWS } from '../data';
import { motion } from 'framer-motion';

export const LocalDevView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workflows' | 'maintenance'>('maintenance');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const batContent = `@echo off
echo --- RODANDO COMFYUI COM PYTHON 3.12 DO SISTEMA ---
py -3.12 main.py --force-fp16 --cuda-device 0
pause`;

  return (
    <div className="space-y-6 pb-20">
      {/* Success Header */}
      <div className="bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg text-green-500 shadow-[0_0_15px_rgba(0,255,0,0.2)]">
            <CheckCircle size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Sistema Operacional</h2>
            <p className="text-gray-400 text-sm">
              Python 3.12 • PyTorch 2.5.1 • CUDA • RTX 4070 Ti Super Detectada
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button 
          onClick={() => setActiveTab('workflows')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'workflows' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Biblioteca de Workflows
          {activeTab === 'workflows' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-purple"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('maintenance')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'maintenance' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Manutenção & Fixes
          {activeTab === 'maintenance' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500"></div>}
        </button>
      </div>

      {/* Content */}
      <div className="pt-4">
        {activeTab === 'workflows' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* Quick Start Guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-dark-800 p-4 rounded-xl border border-white/5">
                 <div className="flex items-center gap-2 mb-2 text-neon-blue">
                    <Download size={18} /> <span className="font-bold">1. Baixe o JSON</span>
                 </div>
                 <p className="text-xs text-gray-400">Escolha um workflow abaixo, baixe a imagem ou arquivo .json.</p>
              </div>
              <div className="bg-dark-800 p-4 rounded-xl border border-white/5">
                 <div className="flex items-center gap-2 mb-2 text-neon-purple">
                    <Upload size={18} /> <span className="font-bold">2. Arraste</span>
                 </div>
                 <p className="text-xs text-gray-400">Arraste o arquivo JSON diretamente para a janela do ComfyUI.</p>
              </div>
              <div className="bg-dark-800 p-4 rounded-xl border border-white/5">
                 <div className="flex items-center gap-2 mb-2 text-green-400">
                    <PlayCircle size={18} /> <span className="font-bold">3. Queue Prompt</span>
                 </div>
                 <p className="text-xs text-gray-400">Carregue sua foto no node "Load Image" e clique em Queue.</p>
              </div>
            </div>

             {/* Workflows List */}
             <div className="grid grid-cols-1 gap-4">
                {COMFY_WORKFLOWS.map((wf, idx) => (
                  <div key={idx} className="bg-dark-800 border border-white/5 p-6 rounded-xl hover:border-neon-purple/40 transition-colors group relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-gray-700 pointer-events-none">
                       {idx + 1}
                     </div>
                     
                     <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2 relative z-10">
                        <div>
                          <h4 className="text-xl font-bold text-white group-hover:text-neon-purple transition-colors">{wf.title}</h4>
                          <div className="flex gap-2 mt-2">
                             <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] uppercase text-gray-400 border border-white/5">VRAM: {wf.vram}</span>
                             <span className={`px-2 py-0.5 rounded text-[10px] uppercase border bg-opacity-10 ${
                               wf.difficulty === 'Hard' ? 'bg-red-500 text-red-400 border-red-500/20' : 
                               wf.difficulty === 'Medium' ? 'bg-yellow-500 text-yellow-400 border-yellow-500/20' : 
                               'bg-purple-500 text-purple-400 border-purple-500/20'
                             }`}>
                               {wf.difficulty}
                             </span>
                          </div>
                        </div>
                        <a 
                          href={wf.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                        >
                          Baixar Workflow <ArrowRight size={16} />
                        </a>
                     </div>
                     
                     <p className="text-gray-400 text-sm mb-4 border-l-2 border-gray-700 pl-3">
                       {wf.description}
                     </p>

                     <div className="bg-black/30 p-3 rounded-lg">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Nodes Necessários:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {wf.nodes.map((node, i) => (
                            <span key={i} className="text-xs text-gray-300 font-mono bg-white/5 px-2 py-1 rounded">
                              {node}
                            </span>
                          ))}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* FFmpeg FIX */}
            <div className="bg-red-900/20 border border-red-500 p-6 rounded-2xl animate-pulse">
               <div className="flex items-center gap-3 mb-4">
                  <FileVideo className="text-red-500" size={24} />
                  <h3 className="text-xl font-bold text-white">Erro Detectado: FFmpeg Missing</h3>
               </div>
               <p className="text-gray-300 text-sm mb-4">
                 O ComfyUI não encontrou o codificador de vídeo. Instale o pacote Python wrapper para corrigir isso instantaneamente.
               </p>
               <div className="bg-black/50 p-4 rounded-xl border border-red-500/30 flex items-center justify-between">
                  <code className="text-red-400 font-mono text-sm">
                    py -3.12 -m pip install imageio-ffmpeg
                  </code>
                  <button
                    onClick={() => copyToClipboard('py -3.12 -m pip install imageio-ffmpeg', 'ffmpeg')}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                  >
                    {copiedId === 'ffmpeg' ? <Check size={18} /> : <Copy size={18} />}
                  </button>
               </div>
            </div>

            <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
               <h3 className="text-lg font-bold text-white mb-4">Código do Launcher (.bat)</h3>
               <p className="text-gray-400 text-sm mb-4">
                 Caso precise recriar o arquivo <code>run_system_python.bat</code> no futuro.
               </p>
               <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex flex-col gap-2 group relative">
                  <pre className="text-gray-300 font-mono text-xs">{batContent}</pre>
                  <button
                    onClick={() => copyToClipboard(batContent, 'bat')}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    {copiedId === 'bat' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
               </div>
            </div>
            
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
               <h3 className="text-lg font-bold text-white mb-4">Comando de Instalação Completa (Backup)</h3>
               <p className="text-gray-400 text-sm mb-4">
                 Se formatar o PC, use este comando para restaurar todas as libs no Python 3.12.
               </p>
               <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                  <code className="text-yellow-500 font-mono text-xs break-all">
                    py -3.12 -m pip install torchsde einops transformers scipy psutil kornia imageio-ffmpeg torch==2.5.1 torchvision==0.20.1 torchaudio==2.5.1 --index-url https://download.pytorch.org/whl/cu124
                  </code>
               </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};