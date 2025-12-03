import React, { useState } from 'react';
import { Cpu, Copy, Check, Zap, Layers, AlertTriangle, Download, ExternalLink, Box, GitBranch, AlertCircle, FolderOpen } from 'lucide-react';
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
            <p className="text-gray-400 font-mono text-sm">VRAM: 16GB | RAM: 64GB | Env: Python + Torch (Native)</p>
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
          Ambiente & Fixes
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
            
            {/* TROUBLESHOOTING SECTION - CRITICAL FIX */}
            <div className="bg-red-900/10 border border-red-500/50 p-6 rounded-2xl animate-pulse-slow relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <AlertCircle size={100} className="text-red-500" />
               </div>
               <h3 className="text-xl font-bold text-red-400 flex items-center gap-2 mb-4 relative z-10">
                 <AlertTriangle size={24} /> 
                 Correção Crítica: landmark.onnx
               </h3>
               
               <p className="text-gray-300 text-sm mb-4 relative z-10">
                 O erro <code>NO_SUCHFILE: landmark.onnx</code> acontece porque o download automático falhou. Você precisa baixar esse arquivo manualmente e colocar na pasta correta.
               </p>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="bg-black/40 p-4 rounded-xl border border-red-500/20">
                     <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                       <Download size={16} /> Passo 1: Download
                     </h4>
                     <p className="text-xs text-gray-400 mb-3">Baixe o arquivo oficial (pesa aprox. 2MB).</p>
                     <a 
                       href="https://github.com/kijai/ComfyUI-LivePortraitKJ/releases/download/v1.0/landmark.onnx" 
                       target="_blank" 
                       rel="noreferrer"
                       className="block w-full text-center py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold transition-colors"
                     >
                       Baixar landmark.onnx
                     </a>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-red-500/20">
                     <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                       <FolderOpen size={16} /> Passo 2: Onde Colocar
                     </h4>
                     <p className="text-xs text-gray-400 mb-2">Copie o arquivo para esta pasta exata:</p>
                     <div className="font-mono text-xs text-yellow-400 break-all bg-black p-2 rounded border border-white/10">
                       ComfyUI\models\liveportrait\landmark.onnx
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-gradient-to-r from-neon-purple/10 to-blue-500/10 border border-neon-purple/20 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Layers size={24} className="text-neon-purple" /> O Caminho "ComfyUI Native"
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Como você já tem o ambiente configurado, <strong>não use Docker</strong>. É uma camada extra desnecessária que complica o acesso aos seus modelos locais. A integração nativa no ComfyUI é superior porque permite encadear Face Restoration e Upscale no mesmo fluxo.
              </p>

              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-3 mb-6">
                 <AlertTriangle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
                 <div className="text-sm text-yellow-200/80">
                   <strong>Atenção ao Python 3.14:</strong> A maioria das wheels de PyTorch/CUDA e bibliotecas como `insightface` (essencial para LivePortrait) ainda são instáveis para 3.14. Recomendo fortemente usar seu ambiente <strong>Python 3.12</strong> ou 3.10.
                 </div>
              </div>

              <h4 className="font-bold text-white mb-3">Passo a Passo (Custom Node):</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">1. Instale o Node Wrapper (Kijai):</p>
                  <CodeBlock 
                    id="comfy-node"
                    label="Terminal (Dentro da pasta custom_nodes)"
                    code={`cd ComfyUI/custom_nodes
git clone https://github.com/kijai/ComfyUI-LivePortraitKJ
cd ComfyUI-LivePortraitKJ
pip install -r requirements.txt`}
                  />
                </div>
                <div>
                   <p className="text-sm text-gray-400 mb-2">2. Verifique os Pesos (Weights):</p>
                   <p className="text-xs text-gray-500 italic mb-2">Certifique-se que sua pasta <code>models/liveportrait</code> tem estes arquivos:</p>
                   <CodeBlock 
                     id="weights-manual"
                     label="Estrutura de Pastas Esperada"
                     code={`ComfyUI/models/liveportrait/
├── appearance_feature_extractor.safetensors
├── motion_extractor.safetensors
├── spade_generator.safetensors
├── warping_module.safetensors
└── landmark.onnx  <-- O ARQUIVO QUE FALTAVA`}
                   />
                </div>
              </div>
            </div>

            <div className="bg-dark-900/50 p-6 rounded-xl border border-white/5 mt-8">
              <h3 className="text-lg font-bold text-white mb-4">Se você INSISTIR no Docker...</h3>
              <CodeBlock 
                id="docker-check"
                label="Teste de Performance Docker"
                code={`# Verifique se o container vê sua GPU corretamente
docker run --rm --gpus all nvidia/cuda:12.1.0-base-ubuntu22.04 nvidia-smi`}
              />
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