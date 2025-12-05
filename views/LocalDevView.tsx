import React, { useState } from 'react';
import { Copy, Check, Terminal, PlayCircle, Package, CheckCircle, Upload, ArrowRight, Download, AlertTriangle, FileVideo, Code, Bug } from 'lucide-react';
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
          Debug & Manutenção
          {activeTab === 'maintenance' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>}
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
            
            {/* PYTHON BUG FIX CARD */}
            <div className="bg-orange-900/20 border border-orange-500 p-6 rounded-2xl animate-pulse">
               <div className="flex items-center gap-3 mb-4">
                  <Bug className="text-orange-500" size={24} />
                  <h3 className="text-xl font-bold text-white">Erro de Escopo: Variável "sampler" não existe</h3>
               </div>
               <p className="text-gray-300 text-sm mb-4">
                 Exatamente! Você está tentando usar <code>sampler=sampler</code>, mas a variável não foi definida dentro da função. O Python não sabe de onde tirar esse valor.
               </p>
               
               <div className="bg-black/80 p-4 rounded-xl border border-orange-500/30 font-mono text-xs overflow-x-auto space-y-6">
                  
                  {/* STEP 1 */}
                  <div>
                    <div className="flex items-center justify-between text-gray-400 mb-2 border-b border-gray-700 pb-2">
                        <span className="font-bold text-white">PASSO 1: Receber na função (interface.py)</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-500 text-[10px]">Altere a definição da função on_generate:</p>
                        <div className="opacity-50 text-red-400 line-through">def on_generate(prompt, negative, steps, cfg):</div>
                        <div className="text-green-400 font-bold">def on_generate(prompt, negative, steps, cfg, sampler):</div>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div>
                    <div className="flex items-center justify-between text-gray-400 mb-2 border-b border-gray-700 pb-2">
                        <span className="font-bold text-white">PASSO 2: Enviar pelo Gradio (ui.py ou main.py)</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-500 text-[10px]">Procure onde o botão é clicado (btn.click) e adicione o componente do sampler na lista:</p>
                        <div className="opacity-50 text-red-400 line-through">inputs=[prompt_box, neg_box, steps_slider, cfg_slider]</div>
                        <div className="text-green-400 font-bold">inputs=[prompt_box, neg_box, steps_slider, cfg_slider, sampler_dropdown]</div>
                    </div>
                  </div>

               </div>
               
               <div className="mt-4 flex items-start gap-2 text-xs text-orange-300 bg-orange-500/10 p-3 rounded-lg">
                 <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                 <p>
                   <strong>Lógica:</strong> O Gradio pega o valor da tela → coloca na lista de inputs → passa como argumento para <code>on_generate</code> → que finalmente entrega para <code>generate_image</code>.
                 </p>
               </div>
            </div>

            {/* Previous Fixes (Collapsed/Secondary) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75 hover:opacity-100 transition-opacity">
              <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
                 <h3 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                   <FileVideo size={16} /> ComfyUI FFmpeg
                 </h3>
                 <p className="text-gray-400 text-xs mb-3">Se tiver erro de vídeo no ComfyUI:</p>
                 <div className="bg-black/50 p-2 rounded-lg border border-white/5 flex items-center justify-between">
                    <code className="text-gray-300 font-mono text-[10px]">pip install imageio-ffmpeg</code>
                    <button onClick={() => copyToClipboard('py -3.12 -m pip install imageio-ffmpeg', 'ff')} className="text-gray-400 hover:text-white"><Copy size={14}/></button>
                 </div>
              </div>

              <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
                 <h3 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                   <Terminal size={16} /> Reinstalar Libs
                 </h3>
                 <p className="text-gray-400 text-xs mb-3">Comando de emergência:</p>
                 <div className="bg-black/50 p-2 rounded-lg border border-white/5 flex items-center justify-between">
                    <code className="text-gray-300 font-mono text-[10px] truncate mr-2">pip install torchsde einops...</code>
                    <button onClick={() => copyToClipboard('py -3.12 -m pip install torchsde einops transformers scipy psutil kornia requests tqdm pyyaml pillow', 'libs')} className="text-gray-400 hover:text-white"><Copy size={14}/></button>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};