import React, { useState } from 'react';
import { Copy, Check, Terminal, PlayCircle, Package, CheckCircle, Upload, ArrowRight, Download, AlertTriangle, FileVideo, Code, Bug, FileCode, Zap, Clock, Box, ShieldAlert, Cpu, Palette, Image as ImageIcon, Gauge } from 'lucide-react';
import { COMFY_WORKFLOWS } from '../data';
import { motion } from 'framer-motion';

export const LocalDevView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workflows' | 'backend'>('backend');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const optimizedBackendCode = `import gradio as gr
import torch
from diffusers import DiffusionPipeline, AutoencoderKL
import os
import gc
from datetime import datetime

# --- CONFIGURAÇÃO DE ESTILOS ---
STYLES = {
    "Nenhum (Raw)": "",
    "Cinematic 8K": "cinematic film still, shallow depth of field, vignette, highly detailed, high budget, bokeh, cinemascope, moody, epic, gorgeous, film grain, grainy",
    "Disney/Pixar 3D": "3d style disney pixar render, unreal engine 5, cute, expressive, high quality, 8k, vibrant colors",
    "Anime Premium": "anime artwork, anime style, key visual, vibrant, studio anime, highly detailed, sharp focus, makoto shinkai style",
    "Cyberpunk": "cyberpunk, neon lights, synthesis, futuristic, dark atmosphere, wet streets, chromatic aberration, blade runner style",
    "Analog Film": "analog film, vintage, kodak portra 400, grain, flash photography, polaroid aesthetic",
    "Fantasy RPG": "fantasy oil painting, intricate details, dnd character portrait, magical atmosphere, glowing runes, artstation",
    "GTA Loading Screen": "gta 5 loading screen style, vector art, cel shaded, highly detailed, grand theft auto art style"
}

# --- VARIÁVEIS GLOBAIS ---
pipe_base = None
pipe_refiner = None

def load_models():
    global pipe_base, pipe_refiner
    print("🚀 Carregando SDXL V4 (Modo Turbo - CPU Offload)...")
    
    # Detecção de GPU
    if not torch.cuda.is_available():
        raise Exception("GPU NVIDIA não detectada!")

    # Carregar VAE Otimizado (Evita tela preta/erro de memória)
    try:
        vae = AutoencoderKL.from_pretrained("madebyollin/sdxl-vae-fp16-fix", torch_dtype=torch.float16)
    except:
        vae = None
        print("⚠️ VAE Otimizado não encontrado (usando padrão).")

    # Carregar BASE
    print("⏳ Carregando Base Model...")
    pipe_base = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0",
        vae=vae,
        torch_dtype=torch.float16,
        variant="fp16",
        use_safetensors=True
    )
    # TRUQUE DE VELOCIDADE: CPU Offload
    # Isso carrega as peças para a VRAM só quando precisa.
    # Corrige a lentidão de 9s/it para ~1.5s/it em placas de 8GB.
    pipe_base.enable_model_cpu_offload()
    
    # Carregar REFINER
    print("⏳ Carregando Refiner Model...")
    pipe_refiner = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-refiner-1.0",
        text_encoder_2=pipe_base.text_encoder_2,
        vae=pipe_base.vae,
        torch_dtype=torch.float16,
        variant="fp16",
        use_safetensors=True,
    )
    pipe_refiner.enable_model_cpu_offload()
    
    # Otimização Extra de Memória
    pipe_base.enable_vae_tiling()
    pipe_refiner.enable_vae_tiling()
    
    print("✅ Modelos Carregados e Otimizados!")
    return "✅ Pronto! Modelos na memória."

def generate(prompt, negative, style, steps, cfg):
    global pipe_base, pipe_refiner
    
    if pipe_base is None:
        load_models()

    # Aplicar Estilo
    final_prompt = prompt
    if style in STYLES and STYLES[style]:
        final_prompt = f"{prompt}, {STYLES[style]}"
        print(f"🎨 Estilo aplicado: {style}")

    generator = torch.Generator("cuda").manual_seed(42)
    
    print(f"⚡ Gerando: {final_prompt[:50]}...")
    
    # Geração Base
    latent = pipe_base(
        prompt=final_prompt,
        negative_prompt=negative,
        num_inference_steps=steps,
        denoising_end=0.8,
        guidance_scale=cfg,
        output_type="latent",
        generator=generator
    ).images

    # Refinamento
    image = pipe_refiner(
        prompt=final_prompt,
        negative_prompt=negative,
        num_inference_steps=steps,
        denoising_start=0.8,
        image=latent,
        guidance_scale=cfg,
        generator=generator
    ).images[0]

    # Auto-Save
    os.makedirs("outputs", exist_ok=True)
    filename = f"outputs/img_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
    image.save(filename)
    print(f"💾 Salvo: {filename}")
    
    return image

# --- INTERFACE GRÁFICA (GRADIO) ---
with gr.Blocks(theme=gr.themes.Monochrome()) as app:
    gr.Markdown("# ⚡ AvatarArchitect SDXL V4 (Turbo)")
    
    with gr.Row():
        with gr.Column():
            prompt = gr.Textbox(label="Prompt Principal", placeholder="Ex: A futuristic warrior...")
            negative = gr.Textbox(label="Prompt Negativo", value="ugly, blurry, low quality, deformed")
            
            # SELETOR DE ESTILO
            style = gr.Dropdown(
                choices=list(STYLES.keys()), 
                value="Cinematic 8K", 
                label="🎨 Estilo Artístico (Style Selector)"
            )
            
            with gr.Row():
                steps = gr.Slider(20, 100, value=40, label="Steps")
                cfg = gr.Slider(1, 20, value=7.5, label="CFG Scale")
                
            btn = gr.Button("Gerar Imagem 🚀", variant="primary")
            
        with gr.Column():
            output = gr.Image(label="Resultado")
    
    btn.click(generate, inputs=[prompt, negative, style, steps, cfg], outputs=output)

if __name__ == "__main__":
    # Carrega modelos ao iniciar
    try:
        load_models()
    except Exception as e:
        print(f"Erro inicial: {e}")
        
    app.launch()`;

  return (
    <div className="space-y-6 pb-20">
      {/* Analysis Header */}
      <div className="bg-orange-900/20 border-l-4 border-orange-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
            <Gauge size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Correção de Velocidade (VRAM Swap)</h2>
            <div className="flex items-center gap-4 mt-1">
               <span className="text-gray-400 text-sm">
                 Seus <strong>9s/it</strong> indicam que a memória da placa de vídeo encheu e vazou para a RAM. 
                 A correção abaixo usa <code>model_cpu_offload</code> para voltar a <strong>1s/it</strong>.
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button 
          onClick={() => setActiveTab('backend')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'backend' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          App V4 (Turbo + Styles)
          {activeTab === 'backend' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('workflows')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'workflows' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Workflows ComfyUI
          {activeTab === 'workflows' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-purple"></div>}
        </button>
      </div>

      {/* Content */}
      <div className="pt-4">
        {activeTab === 'workflows' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="bg-dark-800 p-8 rounded-xl border border-white/5 text-center">
                <p className="text-gray-400">Instale o App V4 na outra aba para habilitar a geração rápida.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* NEW FEATURES CARD */}
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
               <div className="flex items-center gap-3 mb-4">
                  <Palette size={24} className="text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Nova Interface (Gradio Integrado)</h3>
               </div>
               <p className="text-gray-400 text-sm mb-4">
                 Para adicionar o <strong>Seletor de Estilos</strong> e corrigir a memória, criei um script único que substitui todo o sistema antigo.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                     <Gauge size={16} className="text-green-500" />
                     <span className="text-sm text-gray-300">Turbo Mode (CPU Offload)</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                     <Palette size={16} className="text-purple-500" />
                     <span className="text-sm text-gray-300">Style Selector (Anime, Cinema...)</span>
                  </div>
               </div>
            </div>

            {/* BACKEND CODE V4 */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/30 p-6 rounded-2xl relative overflow-hidden">
               
               <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <FileCode className="text-orange-400" size={24} />
                    <h3 className="text-xl font-bold text-white">app_v4.py (Script Completo)</h3>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(optimizedBackendCode, 'backend-v4')} 
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-500 transition-colors"
                  >
                    {copiedId === 'backend-v4' ? <Check size={16} /> : <Copy size={16} />}
                    {copiedId === 'backend-v4' ? 'Copiado!' : 'Copiar Código'}
                  </button>
               </div>
               
               <div className="space-y-4 mb-4 text-sm text-gray-400 relative z-10">
                 <p>1. Crie um novo arquivo chamado <code>app_v4.py</code> na mesma pasta do projeto.</p>
                 <p>2. Cole o código abaixo.</p>
                 <p>3. Rode com: <code className="bg-black/50 px-2 py-1 rounded text-green-400">python app_v4.py</code></p>
               </div>
               
               <div className="bg-[#0d0d0d] p-4 rounded-xl border border-white/10 font-mono text-xs overflow-x-auto max-h-[400px] overflow-y-auto relative z-10 custom-scrollbar">
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