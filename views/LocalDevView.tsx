import React, { useState } from 'react';
import { Cpu, Copy, Check, Zap, Layers, AlertTriangle, Download, ExternalLink, Box, GitBranch, AlertCircle, FolderOpen, Terminal, PlayCircle, Package, RefreshCw, FileCode, CheckCircle, Save } from 'lucide-react';
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

  const downloadScript = `$dest = "C:\\Users\\Genas-AI\\Documents\\COMFyUI\\ComfyUI_windows_portable\\ComfyUI\\models\\liveportrait"
$url = "https://huggingface.co/Kijai/LivePortrait_safetensors/resolve/main/stitching_retargeting_module.safetensors"
$filename = "stitching_retargeting_module.safetensors"
$output = Join-Path $dest $filename

Write-Host "Baixando a peça final: $filename..." -NoNewline
Invoke-WebRequest -Uri $url -OutFile $output
Write-Host " SUCESSO!" -ForegroundColor Green
Write-Host "Agora sim: Reinicie o ComfyUI e gere seu avatar." -ForegroundColor Yellow`;

  return (
    <div className="space-y-6 pb-20">
      {/* Header Hardware Spec */}
      <div className="bg-dark-800 border-l-4 border-yellow-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500 animate-pulse">
            <Download size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Falta 1 Arquivo Final (Retargeting)</h2>
            <p className="text-gray-400 font-mono text-sm">Erro: <span className="text-yellow-400">stitching_retargeting_module.safetensors</span></p>
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
          Correção Final
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
            
            <div className="bg-yellow-900/10 border border-yellow-500/20 p-6 rounded-2xl">
               <h3 className="text-xl font-bold text-white mb-2">Quase lá! (99%)</h3>
               <p className="text-gray-300 mb-4">
                 O sistema avançou, carregou os 4 arquivos anteriores, mas agora o workflow pediu o módulo de <strong>Stitching (Costura)</strong>.
                 Esse módulo é usado para colar o rosto animado de volta no fundo sem deixar marcas.
               </p>
            </div>

            <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal size={18} className="text-neon-blue" />
                  Script de Download (Último Arquivo)
                </h3>
                <button
                  onClick={() => copyToClipboard(downloadScript, 'dl-script')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 transition-colors text-sm font-medium"
                >
                  {copiedId === 'dl-script' ? <Check size={16} /> : <Copy size={16} />}
                  {copiedId === 'dl-script' ? 'Copiado!' : 'Copiar Script'}
                </button>
              </div>

              <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-xs text-gray-300 overflow-x-auto relative">
                <pre>{downloadScript}</pre>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                <AlertCircle size={14} />
                <span>Cole e rode no PowerShell. É um arquivo pequeno (~140MB).</span>
              </div>
            </div>

            <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
               <h3 className="text-lg font-bold text-white mb-4">Ou baixe manualmente:</h3>
               <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-sm text-gray-300 border border-white/5">
                  <div className="flex flex-col">
                    <span className="font-bold text-white">stitching_retargeting_module.safetensors</span>
                    <span className="text-xs text-gray-500">Salvar em: ComfyUI/models/liveportrait/</span>
                  </div>
                  <a href="https://huggingface.co/Kijai/LivePortrait_safetensors/resolve/main/stitching_retargeting_module.safetensors" target="_blank" rel="noreferrer" className="p-2 bg-neon-blue/10 text-neon-blue rounded-lg">
                    <Download size={20} />
                  </a>
               </div>
            </div>

          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
             {/* Workflow Library Content */}
             <div className="bg-blue-900/20 border border-blue-500/20 p-6 rounded-2xl mb-6">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><GitBranch className="text-blue-400"/> Hub de Workflows (.json)</h3>
                <p className="text-sm text-gray-300">
                  Estes são os workflows de elite. Baixe o JSON e arraste para o ComfyUI.
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