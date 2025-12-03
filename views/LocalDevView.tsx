import React, { useState } from 'react';
import { Copy, Check, Terminal, AlertTriangle, PlayCircle, CheckCircle, XCircle, Package } from 'lucide-react';
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

  const batContent = `@echo off
echo --- RODANDO COMFYUI COM PYTHON 3.12 DO SISTEMA ---
echo (Ignorando Python Embutido bugado)
echo.
py -3.12 main.py --force-fp16 --cuda-device 0
pause`;

  const megaFixCommand = `py -3.12 -m pip install torchsde einops transformers scipy psutil kornia torch==2.5.1 torchvision==0.20.1 torchaudio==2.5.1 --index-url https://download.pytorch.org/whl/cu124`;

  return (
    <div className="space-y-6 pb-20">
      {/* Header Warning */}
      <div className="bg-dark-800 border-l-4 border-yellow-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500 animate-pulse">
            <Package size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Faltam Bibliotecas no Python 3.12</h2>
            <p className="text-gray-400 text-sm">
              O Python carregou (Ótimo!), mas precisamos instalar o "kit básico" do ComfyUI (torchsde, einops) e ajustar a versão do Torch.
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
          {activeTab === 'status' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500"></div>}
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
            
            {/* Step 1: O Comando Combo */}
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Terminal className="text-yellow-500" size={20} />
                Passo 1: Instalação Geral (Obrigatória)
              </h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Este comando faz duas coisas vitais:<br/>
                1. Instala <code>torchsde</code>, <code>einops</code> e outras libs que causaram o erro atual.<br/>
                2. Faz o downgrade do PyTorch para <strong>2.5.1</strong> (pois o seu log mostrou 2.6.0, que vai travar o LivePortrait depois).
              </p>
              
              <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex flex-col gap-2 group relative">
                <code className="text-yellow-400 font-mono text-xs break-all pr-10">{megaFixCommand}</code>
                <button
                  onClick={() => copyToClipboard(megaFixCommand, 'megafix')}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Copiar Comando"
                >
                  {copiedId === 'megafix' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* Step 2: Re-teste */}
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <PlayCircle className="text-neon-blue" size={20} />
                 Passo 2: Iniciar Novamente
               </h3>
               <p className="text-gray-400 text-sm mb-4">
                 Após o comando acima terminar, clique novamente no seu arquivo <strong>run_system_python.bat</strong>.
               </p>
               <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-xl">
                 <p className="text-xs text-gray-400">
                   Se faltar mais alguma lib (ex: <code>scipy</code> ou <code>pandas</code>), o processo é o mesmo: 
                   <code>py -3.12 -m pip install [nome_da_lib]</code>.
                 </p>
               </div>
            </div>

            {/* Backup do Bat Code */}
            <div className="opacity-50 hover:opacity-100 transition-opacity">
               <p className="text-xs text-gray-600 mb-2">Código do .bat (caso tenha perdido):</p>
               <div className="bg-black/30 p-2 rounded-lg border border-white/5 font-mono text-[10px] text-gray-500">
                  <pre>{batContent}</pre>
               </div>
            </div>

          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
             {/* Workflow Library Content */}
             <div className="grid grid-cols-1 gap-4">
                {COMFY_WORKFLOWS.map((wf, idx) => (
                  <div key={idx} className="bg-dark-800 border border-white/5 p-6 rounded-xl hover:border-neon-purple/40 transition-colors group">
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
