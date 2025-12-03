import React, { useState } from 'react';
import { Copy, Check, Terminal, AlertTriangle, PlayCircle, FileCode, CheckCircle, XCircle } from 'lucide-react';
import { COMFY_WORKFLOWS } from '../data';
import { motion } from 'framer-motion';

export const LocalDevView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'workflows'>('status');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const proofScript = `py -3.12 -c "import mediapipe; print('SUCESSO ABSOLUTO: MediaPipe versão', mediapipe.__version__, 'encontrado no Python 3.12')"`;
  
  const batContent = `@echo off
echo --- RODANDO COMFYUI COM PYTHON 3.12 DO SISTEMA ---
echo (Ignorando Python Embutido bugado)
echo.
py -3.12 main.py --force-fp16 --cuda-device 0
pause`;

  return (
    <div className="space-y-6 pb-20">
      {/* Header Warning */}
      <div className="bg-dark-800 border-l-4 border-red-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-lg text-red-500 animate-pulse">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Erro de "Identidade Trocada"</h2>
            <p className="text-gray-400 text-sm">
              Você instalou as libs no Python 3.12, mas está iniciando o ComfyUI pelo launcher errado (Python 3.13).
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button 
          onClick={() => setActiveTab('status')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'status' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Diagnóstico & Fix
          {activeTab === 'status' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('workflows')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'workflows' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Workflow Library
          {activeTab === 'workflows' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-purple"></div>}
        </button>
      </div>

      {/* Content */}
      <div className="pt-4">
        {activeTab === 'status' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* Step 1: Prova Real */}
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                Passo 1: A Prova Real
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Rode este comando no terminal. Se aparecer "SUCESSO", seu Python 3.12 está perfeito e o erro é apenas <strong>como você abre o programa</strong>.
              </p>
              
              <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex justify-between items-center group">
                <code className="text-green-400 font-mono text-xs break-all">{proofScript}</code>
                <button
                  onClick={() => copyToClipboard(proofScript, 'proof')}
                  className="ml-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  {copiedId === 'proof' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* Step 2: Launcher Correto */}
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none"></div>
               
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <PlayCircle className="text-neon-blue" size={20} />
                 Passo 2: O Launcher Obrigatório (.bat)
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-xl opacity-50">
                    <div className="flex items-center gap-2 text-red-400 mb-2 font-bold text-sm">
                      <XCircle size={16} /> NÃO USE ESTE
                    </div>
                    <p className="text-xs text-gray-500">run_nvidia_gpu.bat</p>
                    <p className="text-[10px] text-gray-600 mt-1">(Usa o Python 3.13 embutido que não tem MediaPipe)</p>
                  </div>

                  <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-xl ring-2 ring-green-500/20">
                    <div className="flex items-center gap-2 text-green-400 mb-2 font-bold text-sm">
                      <CheckCircle size={16} /> USE ESTE AQUI
                    </div>
                    <p className="text-xs text-white font-mono">run_system_python.bat</p>
                    <p className="text-[10px] text-gray-400 mt-1">(Usa o seu Python 3.12 configurado)</p>
                  </div>
               </div>

               <p className="text-gray-300 text-sm mb-4">
                 Se você não tem o arquivo <code>run_system_python.bat</code>, crie-o agora:
               </p>

               <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-xs text-gray-300 relative">
                  <pre>{batContent}</pre>
                  <button
                    onClick={() => copyToClipboard(batContent, 'bat-content')}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Copiar Código"
                  >
                    {copiedId === 'bat-content' ? <Check size={14} /> : <Copy size={14} />}
                  </button>
               </div>
               <p className="text-xs text-gray-500 mt-2">
                 Salve como <strong>run_system_python.bat</strong> na pasta raiz do ComfyUI e clique duas vezes nele.
               </p>
            </div>

            {/* Info sobre Versão */}
            <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl">
               <h4 className="text-sm font-bold text-blue-400 mb-1 flex items-center gap-2">
                 <AlertTriangle size={14} /> Sobre MediaPipe 0.8.1 e Python 3.10
               </h4>
               <p className="text-xs text-gray-400 leading-relaxed">
                 Não tente instalar a versão 0.8.1 antiga. Ela não funciona em Python 3.12.
                 O LivePortrait 2025 funciona perfeitamente com o MediaPipe atual (0.10.x) no Python 3.12.
                 O único problema é garantir que o ComfyUI esteja usando o Python certo (Passo 2).
               </p>
            </div>

          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
             {/* Workflow Library Content (Mesmo de antes) */}
             <div className="grid grid-cols-1 gap-4">
                {COMFY_WORKFLOWS.map((wf, idx) => (
                  <div key={idx} className="bg-dark-800 border border-white/5 p-6 rounded-xl hover:border-neon-purple/40 transition-colors group">
                     {/* Card Content ... */}
                     <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-bold text-white">{wf.title}</h4>
                        <span className="text-xs text-gray-500">{wf.vram}</span>
                     </div>
                     <p className="text-gray-400 text-sm mb-2">{wf.description}</p>
                     <a href={wf.url} target="_blank" rel="noreferrer" className="text-xs text-neon-blue hover:underline">Download Workflow</a>
                  </div>
                ))}
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};