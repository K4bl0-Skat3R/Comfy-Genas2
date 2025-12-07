import React, { useState } from 'react';
import { Copy, Check, FileCode, AlertTriangle, Zap, Archive, MonitorPlay, Image as ImageIcon, Film, Mic, Box, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const VideoStudioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stage1' | 'stage2' | 'stage3'>('stage1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stage1Code = `import gradio as gr
import torch
from diffusers import AutoPipelineForText2Image
import os
import sys
from datetime import datetime

# --- STAGE 1: THE ACTOR (SDXL) ---
# Foco: Apenas gerar a imagem perfeita.
# VRAM: Uso exclusivo para SDXL (Máxima Performance)

print(f"🐍 Python: {sys.version.split()[0]}")
if torch.cuda.is_available():
    print(f"🎮 GPU Ativa: {torch.cuda.get_device_name(0)}")
    torch.backends.cuda.matmul.allow_tf32 = True

def generate_image(prompt):
    if not prompt: return None, "⚠️ Digite um prompt."
    
    print("🔄 Carregando SDXL na VRAM...")
    # Como rodamos SOZINHOS, podemos jogar tudo para a GPU direto
    pipe = AutoPipelineForText2Image.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0",
        torch_dtype=torch.float16,
        variant="fp16",
        use_safetensors=True
    ).to("cuda")
    
    # Otimização específica para Imagens
    try: pipe.unet.to(memory_format=torch.channels_last)
    except: pass

    print("🎨 Gerando...")
    with torch.inference_mode():
        image = pipe(
            prompt=prompt, 
            negative_prompt="ugly, deformed, anime, cartoon, low quality", 
            num_inference_steps=30,
            guidance_scale=7.0,
            width=1024, height=576
        ).images[0]
        
    os.makedirs("outputs/stage1_images", exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    path = f"outputs/stage1_images/actor_{timestamp}.png"
    image.save(path)
    
    print("✅ Concluído! Pode fechar este script.")
    return image, f"Salvo em: {path}"

with gr.Blocks() as app:
    gr.Markdown("# 🎭 Stage 1: The Actor")
    with gr.Row():
        inp = gr.Textbox(label="Prompt", placeholder="Portrait of a tech educator...")
        btn = gr.Button("Gerar Imagem", variant="primary")
    with gr.Row():
        out_img = gr.Image(label="Resultado", type="pil")
        out_log = gr.Textbox(label="Log")
        
    btn.click(generate_image, inputs=[inp], outputs=[out_img, out_log])

if __name__ == "__main__":
    app.launch(inbrowser=True)
`;

  const stage2Code = `import gradio as gr
import torch
from diffusers import StableVideoDiffusionPipeline
from diffusers.utils import export_to_video, load_image
import os
import sys
from datetime import datetime
from PIL import Image

# --- STAGE 2: THE ACTION (SVD) ---
# Foco: Animar a imagem gerada no Stage 1.
# VRAM: Uso exclusivo para SVD.

print(f"🐍 Python: {sys.version.split()[0]}")
if torch.cuda.is_available():
    print(f"🎮 GPU Ativa: {torch.cuda.get_device_name(0)}")
    torch.backends.cuda.matmul.allow_tf32 = True

def generate_video(image_path, motion_mode):
    if not image_path: return None, "⚠️ Carregue a imagem do Stage 1."
    
    print("🔄 Carregando SVD na VRAM...")
    pipe = StableVideoDiffusionPipeline.from_pretrained(
        "stabilityai/stable-video-diffusion-img2vid-xt-1-1",
        torch_dtype=torch.float16, 
        variant="fp16"
    ).to("cuda")
    
    # Resize inteligente
    img = Image.open(image_path).resize((1024, 576))
    
    if motion_mode == "Estático (Respiração)":
        bucket, aug = 20, 0.01
    else:
        bucket, aug = 90, 0.05
        
    print("🎬 Renderizando B-Roll...")
    with torch.inference_mode():
        frames = pipe(
            img, 
            decode_chunk_size=2, 
            motion_bucket_id=bucket, 
            noise_aug_strength=aug, 
            num_frames=25
        ).frames[0]
        
    os.makedirs("outputs/stage2_videos", exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    path = f"outputs/stage2_videos/scene_{timestamp}.mp4"
    
    # Exporta a 8 FPS para Slow Motion (3 segundos)
    export_to_video(frames, path, fps=8)
    
    print("✅ Concluído! Pode fechar este script.")
    return path

with gr.Blocks() as app:
    gr.Markdown("# 🎬 Stage 2: The Action")
    with gr.Row():
        inp_img = gr.Image(label="Arraste a imagem do Stage 1 aqui", type="filepath")
        mode = gr.Radio(["Estático (Respiração)", "Movimento de Câmera"], label="Modo", value="Estático (Respiração)")
        btn = gr.Button("Renderizar Vídeo", variant="primary")
    
    out_vid = gr.Video(label="B-Roll Resultado")
    
    btn.click(generate_video, inputs=[inp_img, mode], outputs=[out_vid])

if __name__ == "__main__":
    app.launch(inbrowser=True)
`;

  const stage3Code = `import gradio as gr
import edge_tts
import asyncio
import os
from datetime import datetime

# --- STAGE 3: THE VOICE (Audio) ---
# Foco: Geração de roteiro.
# CPU: Roda leve, sem necessidade de GPU.

VOICES = {
    "PT-BR Mulher (Francisca)": "pt-BR-FranciscaNeural",
    "PT-BR Homem (Antonio)": "pt-BR-AntonioNeural",
    "US English (Jenny)": "en-US-JennyNeural"
}

async def gen_audio(text, voice):
    if not text: return None
    v = VOICES[voice]
    
    os.makedirs("outputs/stage3_audio", exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    path = f"outputs/stage3_audio/voice_{timestamp}.mp3"
    
    print(f"🎙️ Gravando...")
    communicate = edge_tts.Communicate(text, v)
    await communicate.save(path)
    return path

def process(text, voice):
    return asyncio.run(gen_audio(text, voice))

with gr.Blocks() as app:
    gr.Markdown("# 🎙️ Stage 3: The Voice")
    with gr.Row():
        txt = gr.TextArea(label="Script", lines=5)
        voice = gr.Dropdown(list(VOICES.keys()), value="PT-BR Mulher (Francisca)", label="Voz")
    
    btn = gr.Button("Gerar Áudio", variant="primary")
    out = gr.Audio(label="Resultado", type="filepath")
    
    btn.click(process, inputs=[txt, voice], outputs=[out])

if __name__ == "__main__":
    app.launch(inbrowser=True)
`;

  return (
    <div className="space-y-6 pb-20">
      {/* Explanation Header */}
      <div className="bg-gradient-to-r from-slate-900 to-black border-l-4 border-slate-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-lg text-slate-300">
            <Box size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">V14: Modular Toolkit (Desacoplado)</h2>
            <div className="flex items-center gap-4 mt-1">
               <span className="text-gray-300 text-sm">
                 <strong>Filosofia Unix:</strong> "Faça uma coisa e faça bem feita".
                 <br/>
                 Separei o processo em 3 scripts independentes. Isso resolve definitivamente o problema de memória, pois ao fechar um script, o Windows limpa 100% da VRAM para o próximo.
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button 
          onClick={() => setActiveTab('stage1')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
            activeTab === 'stage1' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <ImageIcon size={16} />
          Stage 1: Imagem
          {activeTab === 'stage1' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('stage2')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
            activeTab === 'stage2' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Film size={16} />
          Stage 2: Vídeo
          {activeTab === 'stage2' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('stage3')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
            activeTab === 'stage3' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Mic size={16} />
          Stage 3: Áudio
          {activeTab === 'stage3' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500"></div>}
        </button>
      </div>

      {/* Content */}
      <div className="pt-4">
        
        {/* STAGE 1 */}
        {activeTab === 'stage1' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
             <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20 text-sm text-gray-300 flex items-center gap-3">
                <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-black shrink-0">1</div>
                <p>Salve este código como <code>app_stage1_image.py</code>. Ele usa 100% da sua RTX 4070 para gerar a imagem perfeita.</p>
             </div>
             
             <div className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                   <h3 className="text-xl font-bold text-white flex items-center gap-2"><FileCode className="text-blue-500"/> app_stage1_image.py</h3>
                   <button 
                     onClick={() => copyToClipboard(stage1Code, 's1')} 
                     className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                   >
                     {copiedId === 's1' ? <Check size={16} /> : <Copy size={16} />}
                     Copiar
                   </button>
                </div>
                <div className="bg-[#0d0d0d] p-4 rounded-xl border border-white/10 font-mono text-xs overflow-x-auto max-h-[400px] custom-scrollbar relative z-10">
                   <pre className="text-gray-300">{stage1Code}</pre>
                </div>
             </div>
          </motion.div>
        )}

        {/* STAGE 2 */}
        {activeTab === 'stage2' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
             <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/20 text-sm text-gray-300 flex items-center gap-3">
                <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-black shrink-0">2</div>
                <div>
                   <p>Salve como <code>app_stage2_video.py</code>. <strong>Importante:</strong> Feche o Stage 1 antes de abrir este.</p>
                   <p className="text-xs text-red-300 mt-1">Este script lê a imagem salva na pasta <code>outputs/stage1_images</code>.</p>
                </div>
             </div>
             
             <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/30 p-6 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                   <h3 className="text-xl font-bold text-white flex items-center gap-2"><FileCode className="text-red-500"/> app_stage2_video.py</h3>
                   <button 
                     onClick={() => copyToClipboard(stage2Code, 's2')} 
                     className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
                   >
                     {copiedId === 's2' ? <Check size={16} /> : <Copy size={16} />}
                     Copiar
                   </button>
                </div>
                <div className="bg-[#0d0d0d] p-4 rounded-xl border border-white/10 font-mono text-xs overflow-x-auto max-h-[400px] custom-scrollbar relative z-10">
                   <pre className="text-gray-300">{stage2Code}</pre>
                </div>
             </div>
          </motion.div>
        )}

        {/* STAGE 3 */}
        {activeTab === 'stage3' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
             <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/20 text-sm text-gray-300 flex items-center gap-3">
                <div className="bg-purple-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-black shrink-0">3</div>
                <p>Salve como <code>app_stage3_audio.py</code>. Roda apenas na CPU, super leve e rápido.</p>
             </div>
             
             <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 p-6 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                   <h3 className="text-xl font-bold text-white flex items-center gap-2"><FileCode className="text-purple-500"/> app_stage3_audio.py</h3>
                   <button 
                     onClick={() => copyToClipboard(stage3Code, 's3')} 
                     className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors"
                   >
                     {copiedId === 's3' ? <Check size={16} /> : <Copy size={16} />}
                     Copiar
                   </button>
                </div>
                <div className="bg-[#0d0d0d] p-4 rounded-xl border border-white/10 font-mono text-xs overflow-x-auto max-h-[400px] custom-scrollbar relative z-10">
                   <pre className="text-gray-300">{stage3Code}</pre>
                </div>
             </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};