import React, { useState } from 'react';
import { Copy, Check, Terminal, PlayCircle, Package, CheckCircle, Upload, ArrowRight, Download, AlertTriangle, FileVideo, Code, Bug, FileCode, Zap, Clock, Box, ShieldAlert } from 'lucide-react';
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
import os

# Tenta importar peft para garantir que o python o enxerga
try:
    import peft
    PEFT_AVAILABLE = True
except ImportError:
    PEFT_AVAILABLE = False
    print("⚠️ AVISO: 'peft' não encontrado. LoRAs serão ignorados.")

def load_models():
    print("🚀 Carregando SDXL com Otimização CUDA + FP16...")
    
    # 1. Carregar VAE em fp16 (Essencial para não estourar memória na 4070)
    # Se der erro de conexão, tente baixar manualmente ou usar cache
    try:
        vae = AutoencoderKL.from_pretrained(
            "madebyollin/sdxl-vae-fp16-fix", 
            torch_dtype=torch.float16
        )
    except Exception as e:
        print(f"⚠️ Erro ao carregar VAE otimizado (usando padrão): {e}")
        vae = None

    # 2. Carregar Base Model
    pipe_base = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0",
        vae=vae,
        torch_dtype=torch.float16,
        variant="fp16",
        use_safetensors=True
    ).to("cuda")

    # 3. Carregar Refiner
    pipe_refiner = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-refiner-1.0",
        text_encoder_2=pipe_base.text_encoder_2,
        vae=pipe_base.vae,
        torch_dtype=torch.float16,
        variant="fp16",
        use_safetensors=True,
    ).to("cuda")

    try:
        pipe_base.enable_xformers_memory_efficient_attention()
        pipe_refiner.enable_xformers_memory_efficient_attention()
        print("✅ xFormers ativado!")
    except:
        print("⚠️ xFormers não encontrado.")

    return pipe_base, pipe_refiner

def generate_image(pipe_base, pipe_refiner, prompt, negative, steps, cfg, sampler, lora_path=None):
    gc.collect()
    torch.cuda.empty_cache()
    generator = torch.Generator("cuda").manual_seed(42)

    # Tratamento de erro robusto para LoRA
    lora_loaded = False
    if lora_path and os.path.exists(lora_path):
        if PEFT_AVAILABLE:
            try:
                print(f"📦 Carregando LoRA: {lora_path}")
                pipe_base.load_lora_weights(lora_path)
                pipe_base.fuse_lora(lora_scale=0.7)
                lora_loaded = True
            except Exception as e:
                print(f"❌ ERRO ao carregar LoRA (Ignorando): {e}")
        else:
            print("❌ ERRO: Instale 'peft' e 'accelerate' para usar LoRAs.")
    elif lora_path:
        print(f"⚠️ Arquivo LoRA não encontrado: {lora_path}")

    high_noise_steps = int(steps * 0.8)
    print(f"⚡ Gerando: {steps} steps (GPU Actived)")

    try:
        latent_image = pipe_base(
            prompt=prompt,
            negative_prompt=negative,
            num_inference_steps=steps,
            denoising_end=0.8,
            guidance_scale=cfg,
            output_type="latent",
            generator=generator
        ).images

        image = pipe_refiner(
            prompt=prompt,
            negative_prompt=negative,
            num_inference_steps=steps,
            denoising_start=0.8,
            image=latent_image,
            guidance_scale=cfg,
            generator=generator
        ).images[0]
    except Exception as e:
        print(f"❌ ERRO FATAL na geração: {e}")
        raise e

    # Limpeza do LoRA
    if lora_loaded:
        try:
            pipe_base.unfuse_lora()
            pipe_base.unload_lora_weights()
        except:
            pass

    return image`;

  return (
    <div className="space-y-6 pb-20">
      {/* Analysis Header */}
      <div className="bg-orange-900/20 border-l-4 border-orange-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500 shadow-[0_0_15px_rgba(255,165,0,0.2)]">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Correção Final de Dependências</h2>
            <div className="flex items-center gap-4 mt-1">
               <span className="text-gray-400 text-sm">O Diffusers exige <code>accelerate</code> junto com <code>peft</code> para funcionar corretamente.</span>
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
          Correção Robustez
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
            <div className="bg-dark-800 p-8 rounded-xl border border-white/5 text-center">
                <p className="text-gray-400">Vá para a aba "Correção Robustez" para finalizar a instalação.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* INSTALL CARD */}
            <div className="bg-dark-800 p-6 rounded-2xl border border-orange-500/30">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Terminal className="text-orange-400" size={24} />
                    <h3 className="text-xl font-bold text-white">1. Atualizar Bibliotecas</h3>
                  </div>
                  <button 
                    onClick={() => copyToClipboard('py -3.12 -m pip install peft accelerate transformers --upgrade', 'deps-install')} 
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    {copiedId === 'deps-install' ? <Check size={16} /> : <Copy size={16} />}
                    {copiedId === 'deps-install' ? 'Copiado!' : 'Copiar Comando'}
                  </button>
               </div>
               
               <p className="text-gray-300 text-sm mb-4">
                 Pare o servidor e rode este comando exato para instalar o par <code>peft</code> + <code>accelerate</code>:
               </p>
               
               <div className="bg-black p-4 rounded-xl border border-white/10 font-mono text-sm text-green-400">
                  py -3.12 -m pip install peft accelerate transformers --upgrade
               </div>
            </div>

            {/* SAFE BACKEND CODE */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/40 p-6 rounded-2xl">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Zap className="text-blue-400" size={24} />
                    <h3 className="text-xl font-bold text-white">2. Backend à Prova de Falhas</h3>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(optimizedBackendCode, 'backend-safe')} 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-colors"
                  >
                    {copiedId === 'backend-safe' ? <Check size={16} /> : <Copy size={16} />}
                    {copiedId === 'backend-safe' ? 'Copiado!' : 'Copiar Código Seguro'}
                  </button>
               </div>
               
               <p className="text-gray-300 text-sm mb-4">
                 Atualize o arquivo <code>backend/image_generation.py</code> com este código. Ele usa <code>try/except</code> para não travar o servidor se o LoRA falhar.
               </p>
               
               <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/10 font-mono text-xs overflow-x-auto max-h-[300px] overflow-y-auto">
                  <pre className="text-gray-300">
                    {optimizedBackendCode}
                  </pre>
               </div>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
};