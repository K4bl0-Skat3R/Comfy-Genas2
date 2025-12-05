import React, { useState } from 'react';
import { Copy, Check, Terminal, PlayCircle, Package, CheckCircle, Upload, ArrowRight, Download, AlertTriangle, FileVideo, Code, Bug, FileCode, Zap, Clock, Box, ShieldAlert, Cpu } from 'lucide-react';
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
import sys

# --- DIAGNÓSTICO INICIAL ---
print("="*50)
print(f"🐍 Python Executável: {sys.executable}")
print(f"🔥 Torch Versão: {torch.__version__}")
print(f"🎮 CUDA Disponível: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"🖥️  GPU Detectada: {torch.cuda.get_device_name(0)}")
else:
    print("❌ ERRO CRÍTICO: CUDA NÃO DETECTADO. O sistema está usando CPU (Lento).")
print("="*50)

try:
    import peft
    PEFT_AVAILABLE = True
    print("✅ Biblioteca PEFT detectada.")
except ImportError:
    PEFT_AVAILABLE = False
    print("⚠️ AVISO: 'peft' não encontrado. LoRAs serão ignorados.")

def load_models():
    print("🚀 Carregando SDXL...")
    
    # Se não tiver GPU, lançamos erro para evitar travamento do PC
    if not torch.cuda.is_available():
        print("⚠️ ALERTA: Tentando rodar em CPU. Isso vai demorar muito.")
        device = "cpu"
        dtype = torch.float32
    else:
        device = "cuda"
        dtype = torch.float16

    try:
        vae = AutoencoderKL.from_pretrained(
            "madebyollin/sdxl-vae-fp16-fix", 
            torch_dtype=dtype
        )
    except Exception as e:
        print(f"⚠️ Erro VAE (usando padrão): {e}")
        vae = None

    pipe_base = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0",
        vae=vae,
        torch_dtype=dtype,
        variant="fp16" if device == "cuda" else None,
        use_safetensors=True
    ).to(device)

    pipe_refiner = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-refiner-1.0",
        text_encoder_2=pipe_base.text_encoder_2,
        vae=pipe_base.vae,
        torch_dtype=dtype,
        variant="fp16" if device == "cuda" else None,
        use_safetensors=True,
    ).to(device)

    if device == "cuda":
        try:
            pipe_base.enable_xformers_memory_efficient_attention()
            pipe_refiner.enable_xformers_memory_efficient_attention()
            print("✅ xFormers ativado!")
        except:
            pass

    return pipe_base, pipe_refiner

def generate_image(pipe_base, pipe_refiner, prompt, negative, steps, cfg, sampler, lora_path=None):
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
        generator = torch.Generator("cuda").manual_seed(42)
    else:
        generator = torch.Generator("cpu").manual_seed(42)

    # CORREÇÃO DE PATH DO LORA
    lora_loaded = False
    if lora_path:
        # Verifica se o arquivo existe direto ou dentro da pasta loras
        if not os.path.exists(lora_path):
            potential_path = os.path.join("loras", lora_path)
            if os.path.exists(potential_path):
                lora_path = potential_path
            else:
                print(f"⚠️ Arquivo LoRA não encontrado em lugar nenhum: {lora_path}")
                lora_path = None

        if lora_path and PEFT_AVAILABLE:
            try:
                print(f"📦 Carregando LoRA: {lora_path}")
                pipe_base.load_lora_weights(lora_path)
                pipe_base.fuse_lora(lora_scale=0.7)
                lora_loaded = True
            except Exception as e:
                print(f"❌ Erro ao carregar LoRA: {e}")

    high_noise_steps = int(steps * 0.8)
    print(f"⚡ Gerando: {steps} steps (Device: {pipe_base.device})")

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
        print(f"❌ ERRO FATAL: {e}")
        raise e

    if lora_loaded:
        pipe_base.unfuse_lora()
        pipe_base.unload_lora_weights()

    return image`;

  return (
    <div className="space-y-6 pb-20">
      {/* Analysis Header */}
      <div className="bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-lg text-red-500 shadow-[0_0_15px_rgba(255,0,0,0.2)]">
            <Cpu size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Diagnóstico: Rodando em CPU?</h2>
            <div className="flex items-center gap-4 mt-1">
               <span className="text-gray-400 text-sm">A lentidão (12s/it) indica falta de Drivers CUDA.</span>
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
          Solução Definitiva
          {activeTab === 'maintenance' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></div>}
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
                <p className="text-gray-400">Vá para a aba "Solução Definitiva" para consertar a velocidade.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* FORCE CUDA INSTALL */}
            <div className="bg-dark-800 p-6 rounded-2xl border border-red-500/30">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Terminal className="text-red-400" size={24} />
                    <h3 className="text-xl font-bold text-white">1. Reinstalar PyTorch (Versão CUDA)</h3>
                  </div>
                  <button 
                    onClick={() => copyToClipboard('pip uninstall torch -y && pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121', 'cuda-install')} 
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
                  >
                    {copiedId === 'cuda-install' ? <Check size={16} /> : <Copy size={16} />}
                    {copiedId === 'cuda-install' ? 'Copiado!' : 'Copiar Comando'}
                  </button>
               </div>
               
               <p className="text-gray-300 text-sm mb-4">
                 Provavelmente você tem a versão "CPU-only" do Torch instalada. Rode este comando para forçar a versão NVIDIA:
               </p>
               
               <div className="bg-black p-4 rounded-xl border border-white/10 font-mono text-sm text-green-400 break-all">
                  pip uninstall torch -y && pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
               </div>
            </div>

            {/* DIAGNOSTIC BACKEND CODE */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/40 p-6 rounded-2xl">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Zap className="text-blue-400" size={24} />
                    <h3 className="text-xl font-bold text-white">2. Backend com Diagnóstico</h3>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(optimizedBackendCode, 'backend-diag')} 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-colors"
                  >
                    {copiedId === 'backend-diag' ? <Check size={16} /> : <Copy size={16} />}
                    {copiedId === 'backend-diag' ? 'Copiado!' : 'Copiar Código'}
                  </button>
               </div>
               
               <p className="text-gray-300 text-sm mb-4">
                 Substitua o arquivo <code>backend/image_generation.py</code>. Este novo código vai imprimir no terminal exatamente se a GPU foi detectada e corrigir o caminho do LoRA.
               </p>
               
               <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/10 font-mono text-xs overflow-x-auto max-h-[300px] overflow-y-auto">
                  <pre className="text-gray-300">
                    {optimizedBackendCode}
                  </pre>
               </div>
            </div>

            {/* RUN COMMAND */}
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
               <div className="flex items-center gap-3 mb-4">
                  <PlayCircle size={24} className="text-white" />
                  <h3 className="text-xl font-bold text-white">3. Como Rodar Corretamente</h3>
               </div>
               <p className="text-gray-400 text-sm mb-2">
                 Ao invés de usar <code>py app.py</code>, use o python direto do ambiente virtual para garantir que ele ache as bibliotecas instaladas:
               </p>
               <div className="bg-black p-3 rounded-lg border border-white/5 font-mono text-sm text-yellow-400">
                  python app.py
               </div>
               <p className="text-xs text-gray-500 mt-2">
                  (Certifique-se que o <code>(venv)</code> está aparecendo no começo da linha do terminal)
               </p>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
};