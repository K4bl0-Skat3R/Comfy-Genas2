import React, { useState } from 'react';
import { Copy, Check, Terminal, PlayCircle, Package, CheckCircle, Upload, ArrowRight, Download, AlertTriangle, FileVideo, Code, Bug, FileCode, Zap, Clock } from 'lucide-react';
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

  const optimizedBackendCode = `import torch
from diffusers import DiffusionPipeline, AutoencoderKL
import gc

def load_models():
    print("🚀 Carregando SDXL com Otimização CUDA + FP16...")
    
    # 1. Carregar VAE em fp16 (Essencial para não estourar memória na 4070)
    vae = AutoencoderKL.from_pretrained(
        "madebyollin/sdxl-vae-fp16-fix", 
        torch_dtype=torch.float16
    )

    # 2. Carregar Base Model diretamente na GPU
    pipe_base = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0",
        vae=vae,
        torch_dtype=torch.float16,
        variant="fp16",
        use_safetensors=True
    ).to("cuda")

    # 3. Carregar Refiner reutilizando componentes para economizar VRAM
    pipe_refiner = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-refiner-1.0",
        text_encoder_2=pipe_base.text_encoder_2,
        vae=pipe_base.vae,
        torch_dtype=torch.float16,
        variant="fp16",
        use_safetensors=True,
    ).to("cuda")

    # Habilitar xFormers se disponível (Aumenta velocidade em 20%)
    try:
        pipe_base.enable_xformers_memory_efficient_attention()
        pipe_refiner.enable_xformers_memory_efficient_attention()
        print("✅ xFormers ativado!")
    except:
        print("⚠️ xFormers não encontrado (pip install xformers), usando padrão.")

    return pipe_base, pipe_refiner

def generate_image(pipe_base, pipe_refiner, prompt, negative, steps, cfg, sampler, lora_path=None):
    
    # Limpeza de memória antes de começar
    gc.collect()
    torch.cuda.empty_cache()

    # Generator para reprodutibilidade
    generator = torch.Generator("cuda").manual_seed(42)

    # Carregar LoRA se houver
    if lora_path:
        print(f"📦 Carregando LoRA: {lora_path}")
        pipe_base.load_lora_weights(lora_path)
        pipe_base.fuse_lora(lora_scale=0.7)

    # Definir divisão de steps (80% Base / 20% Refiner)
    high_noise_steps = int(steps * 0.8)
    
    print(f"⚡ Gerando: {steps} steps (Base: {high_noise_steps}, Refiner: {steps - high_noise_steps})")

    # 1. GERAÇÃO BASE
    latent_image = pipe_base(
        prompt=prompt,
        negative_prompt=negative, # Agora aceitamos o negativo!
        num_inference_steps=steps,
        denoising_end=0.8,
        guidance_scale=cfg,
        output_type="latent",
        generator=generator
    ).images

    # 2. REFINER
    print("✨ Refinando...")
    image = pipe_refiner(
        prompt=prompt,
        negative_prompt=negative,
        num_inference_steps=steps,
        denoising_start=0.8,
        image=latent_image,
        guidance_scale=cfg,
        generator=generator
    ).images[0]

    # Descarregar LoRA
    if lora_path:
        pipe_base.unfuse_lora()
        pipe_base.unload_lora_weights()

    return image`;

  return (
    <div className="space-y-6 pb-20">
      {/* Analysis Header */}
      <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500 shadow-[0_0_15px_rgba(255,165,0,0.2)]">
            <Clock size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Análise de Performance</h2>
            <div className="flex items-center gap-4 mt-1">
               <span className="text-gray-400 text-sm">Atual: <span className="text-red-400 font-mono">13 min/img</span> (CPU)</span>
               <ArrowRight size={14} className="text-gray-600"/>
               <span className="text-gray-400 text-sm">Meta: <span className="text-green-400 font-mono">~15 seg/img</span> (RTX 4070 Ti)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button 
          onClick={() => setActiveTab('maintenance')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'maintenance' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Otimização (GPU)
          {activeTab === 'maintenance' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('workflows')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'workflows' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Biblioteca de Workflows
          {activeTab === 'workflows' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-purple"></div>}
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
            
            {/* BACKEND FIX CARD */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/40 p-6 rounded-2xl">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Zap className="text-blue-400" size={24} />
                    <h3 className="text-xl font-bold text-white">Passo 1: Aceleração GPU (Obrigatório)</h3>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(optimizedBackendCode, 'backend-code')} 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-colors"
                  >
                    {copiedId === 'backend-code' ? <Check size={16} /> : <Copy size={16} />}
                    {copiedId === 'backend-code' ? 'Copiado!' : 'Copiar Código'}
                  </button>
               </div>
               
               <p className="text-gray-300 text-sm mb-4">
                 Seu arquivo atual não está usando a placa de vídeo. Crie ou substitua o arquivo <code>backend/image_generation.py</code> com este código otimizado. Ele ativa <code>cuda</code> e <code>float16</code>.
               </p>
               
               <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/10 font-mono text-xs overflow-x-auto max-h-[300px] overflow-y-auto">
                  <pre className="text-gray-300">
                    {optimizedBackendCode}
                  </pre>
               </div>
            </div>

            {/* INTERFACE FIX CARD */}
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
                 <div className="flex items-center gap-3 mb-2">
                    <FileCode size={20} className="text-green-400"/>
                    <h3 className="text-md font-bold text-white">Passo 2: Reativar Negative Prompt</h3>
                 </div>
                 <p className="text-gray-400 text-xs mb-3">
                   Agora que o backend foi corrigido (acima), volte no arquivo <code>interface.py</code> e remova o comentário da linha do negative prompt:
                 </p>
                 <div className="bg-black/50 p-3 rounded-lg border border-white/5 font-mono text-xs text-gray-300">
                    <span className="text-gray-500"># Antes:</span><br/>
                    <span className="line-through text-red-400/50"># negative=negative,</span><br/><br/>
                    <span className="text-gray-500"># Agora:</span><br/>
                    <span className="text-green-400">negative=negative,</span>
                 </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};