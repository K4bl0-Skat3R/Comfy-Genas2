import React, { useState } from 'react';
import { Copy, Check, FileCode, Film, AlertTriangle, ExternalLink, Key, Sliders, Type, Image as ImageIcon, ShieldCheck, Sparkles, Wrench, Mic, Music, Layers, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const VideoStudioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visual' | 'audio'>('visual');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const videoScriptCode = `import gradio as gr
import torch
from diffusers import StableVideoDiffusionPipeline, AutoPipelineForText2Image
from diffusers.utils import load_image, export_to_video
from huggingface_hub import login
import os
import gc
import sys
from datetime import datetime

# --- CINE ENGINE V12 (ROBUST FIX) ---
# Correção do Crash de Tensor Rank 4 e Performance

print(f"🐍 Python: {sys.version.split()[0]}")
if torch.cuda.is_available():
    print(f"🎮 GPU Ativa: {torch.cuda.get_device_name(0)}")
    # Mantemos TF32 pois ajuda na série 40xx
    torch.backends.cuda.matmul.allow_tf32 = True
    torch.backends.cudnn.allow_tf32 = True

current_pipe = None
current_model_type = None 

def aggressive_cleanup():
    global current_pipe
    if current_pipe is not None:
        del current_pipe
        current_pipe = None
    
    gc.collect()
    torch.cuda.empty_cache()
    torch.cuda.ipc_collect()
    print("🧹 VRAM Limpa.")

def get_image_pipe():
    global current_pipe, current_model_type
    if current_model_type == 'image' and current_pipe is not None:
        return current_pipe
    
    print("🔄 Carregando SDXL Base 1.0 (Alta Qualidade)...")
    aggressive_cleanup()
    
    try:
        pipe = AutoPipelineForText2Image.from_pretrained(
            "stabilityai/stable-diffusion-xl-base-1.0",
            torch_dtype=torch.float16,
            variant="fp16",
            use_safetensors=True
        )
        # V12: Voltamos para offload. O pipe.to("cuda") da V11 estava estourando
        # a VRAM e usando RAM de sistema (lento). Offload é mais seguro e rápido aqui.
        pipe.enable_model_cpu_offload()
        
        # Otimização de memória apenas para IMAGEM (4D Tensor)
        try:
            pipe.unet.to(memory_format=torch.channels_last)
        except:
            pass

        current_pipe = pipe
        current_model_type = 'image'
        return pipe
    except Exception as e:
        print(f"Erro Load Image: {e}")
        return None

def get_video_pipe():
    global current_pipe, current_model_type
    if current_model_type == 'video' and current_pipe is not None:
        return current_pipe
    
    print("🔄 Carregando SVD-XT (Vídeo)...")
    aggressive_cleanup()
    
    try:
        pipe = StableVideoDiffusionPipeline.from_pretrained(
            "stabilityai/stable-video-diffusion-img2vid-xt-1-1",
            torch_dtype=torch.float16, 
            variant="fp16"
        )
        pipe.enable_model_cpu_offload()
        
        # V12 CRITICAL FIX: Removemos 'memory_format=torch.channels_last'
        # Vídeo usa tensores 5D, channels_last só suporta 4D. Isso causava o crash.
        
        try:
            pipe.enable_vae_slicing()
        except:
            pass

        current_pipe = pipe
        current_model_type = 'video'
        return pipe
    except Exception as e:
        print(f"Erro Load Video: {e}")
        return None

def auth_huggingface(token):
    if not token: return "⚠️ Token vazio"
    try:
        login(token=token)
        return "✅ Autenticado!"
    except Exception as e:
        return f"❌ Erro Auth: {e}"

def run_text_to_image(prompt):
    if not prompt: return None, "⚠️ Digite um prompt."
    pipe = get_image_pipe()
    if not pipe: return None, "❌ Falha ao carregar modelo."
    
    print(f"🎨 Gerando Imagem HQ (30 steps)...")
    negative_prompt = "deformed, distorted, disfigured, doll, bad anatomy, low quality, pixelated, blurry, text, watermark, bad hands, extra limbs, fusion, artifacts, ugly"
    
    try:
        # Inference Mode economiza VRAM
        with torch.inference_mode():
            image = pipe(
                prompt=prompt, 
                negative_prompt=negative_prompt, 
                num_inference_steps=30, 
                guidance_scale=7.5, 
                width=1024, height=576
            ).images[0]
        return image, "✅ Imagem Base Pronta!"
    except Exception as e:
        return None, f"Erro Geração: {e}"

def run_image_to_video(image, motion_mode, duration_mode):
    if image is None: return None, "⚠️ Nenhuma imagem carregada."
    image = image.resize((1024, 576))
    pipe = get_video_pipe()
    if not pipe: return None, "❌ Falha ao carregar SVD."

    if motion_mode == "Estável (Loop Perfeito)": 
        bucket_id, aug = 40, 0.02
    elif motion_mode == "Movimento Natural": 
        bucket_id, aug = 80, 0.05
    else: 
        bucket_id, aug = 120, 0.1

    # Controle de FPS para duração
    if duration_mode == "Curto (1s - Fluido)":
        export_fps = 24
    elif duration_mode == "Médio (2s - Cinematic)":
        export_fps = 12
    else: # Longo
        export_fps = 8

    generator = torch.manual_seed(42)
    print("🎬 Renderizando Vídeo (SVD)...")
    
    try:
        with torch.inference_mode():
            frames = pipe(
                image, 
                decode_chunk_size=2, 
                generator=generator, 
                motion_bucket_id=bucket_id, 
                noise_aug_strength=aug, 
                num_frames=25
            ).frames[0]

        os.makedirs("outputs/videos", exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_path = f"outputs/videos/v12_{timestamp}.mp4"
        
        export_to_video(frames, output_path, fps=export_fps)
        return output_path, f"✅ Vídeo Salvo: {output_path} ({export_fps} FPS)"
    except Exception as e:
        return None, f"❌ Erro Fatal: {e}"

with gr.Blocks() as app:
    gr.Markdown("# 🎬 CineEngine V12: Robust Fix")
    gr.Markdown("Correção de compatibilidade de tensores e gerenciamento de VRAM.")
    
    with gr.Row():
        with gr.Column(scale=1):
            token_input = gr.Textbox(label="Token HuggingFace", type="password")
            btn_auth = gr.Button("🔑 Autenticar", variant="secondary")
            
            gr.Markdown("### Configuração de Movimento")
            motion_mode = gr.Radio(
                ["Estável (Loop Perfeito)", "Movimento Natural", "Ação"], 
                value="Estável (Loop Perfeito)", 
                label="Intensidade"
            )
            duration_mode = gr.Radio(
                ["Curto (1s - Fluido)", "Médio (2s - Cinematic)", "Longo (3s - Slow Motion)"],
                value="Médio (2s - Cinematic)",
                label="Duração (Controla FPS)"
            )
        with gr.Column(scale=2):
            prompt_input = gr.Textbox(label="Prompt Detalhado")
            btn_gen_img = gr.Button("1. Gerar Imagem", variant="secondary")
            out_img_gen = gr.Image(label="Imagem Base", type="pil", interactive=False)
            btn_anim_gen = gr.Button("2. Animar Imagem", variant="primary")
            out_video = gr.Video(label="Resultado Final")
            status_log = gr.Textbox(label="Log")

    btn_auth.click(fn=auth_huggingface, inputs=[token_input], outputs=[status_log])
    btn_gen_img.click(fn=run_text_to_image, inputs=[prompt_input], outputs=[out_img_gen, status_log])
    btn_anim_gen.click(fn=run_image_to_video, inputs=[out_img_gen, motion_mode, duration_mode], outputs=[out_video, status_log])

if __name__ == "__main__":
    app.launch(inbrowser=True)
`;

  const audioScriptCode = `import gradio as gr
import edge_tts
import asyncio
import os
from datetime import datetime

# --- CINE ENGINE V10 (VOICE STUDIO) ---
# Foco: ÁUDIO (Geração de Fala Neural)
# Requisito: pip install edge-tts
# Este script gera o arquivo de áudio que você usará com a imagem da V9/V11 para fazer o lipsync.

VOICES = {
    "PT-BR Mulher (Francisca)": "pt-BR-FranciscaNeural",
    "PT-BR Homem (Antonio)": "pt-BR-AntonioNeural",
    "US English (Jenny)": "en-US-JennyNeural",
    "US English (Guy)": "en-US-GuyNeural"
}

async def generate_speech(text, voice_friendly_name, rate, pitch):
    if not text: return None, "⚠️ Digite um texto."
    
    voice = VOICES[voice_friendly_name]
    
    # Formatação de parâmetros
    rate_str = f"{rate:+d}%"
    pitch_str = f"{pitch:+d}Hz"
    
    print(f"🎙️ Gerando Áudio: {voice} | Rate: {rate_str}")
    
    os.makedirs("outputs/audio", exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    output_file = f"outputs/audio/speech_{timestamp}.mp3"
    
    try:
        communicate = edge_tts.Communicate(text, voice, rate=rate_str, pitch=pitch_str)
        await communicate.save(output_file)
        return output_file, f"✅ Áudio Salvo: {output_file}"
    except Exception as e:
        return None, f"❌ Erro: {e}"

# Wrapper para rodar função async no Gradio
def process(text, voice, rate, pitch):
    return asyncio.run(generate_speech(text, voice, rate, pitch))

with gr.Blocks() as app:
    gr.Markdown("# 🎙️ CineEngine V10: Voice Studio")
    gr.Markdown("Gere a voz do seu avatar antes de fazer o LipSync.")
    
    with gr.Row():
        with gr.Column():
            text_input = gr.TextArea(label="Script do Avatar", placeholder="Olá, eu sou um avatar criado com Inteligência Artificial...", lines=5)
            voice_sel = gr.Dropdown(choices=list(VOICES.keys()), value="PT-BR Mulher (Francisca)", label="Voz Neural")
            
            with gr.Row():
                rate = gr.Slider(-50, 50, value=0, step=1, label="Velocidade (%)")
                pitch = gr.Slider(-20, 20, value=0, step=1, label="Tom (Hz)")
                
            btn_gen = gr.Button("🎙️ Gerar Áudio (.mp3)", variant="primary")
            
        with gr.Column():
            out_audio = gr.Audio(label="Resultado", type="filepath")
            status = gr.Textbox(label="Log")
            
            gr.Markdown("""
            ### 🚀 Próximo Passo (LipSync):
            Agora você tem os dois ingredientes:
            1. **Imagem** (do script V9)
            2. **Áudio** (deste script V10)
            
            Para juntar os dois (boca mexendo), você precisa de uma ferramenta de **LipSync**.
            Recomendo instalar o **SadTalker** separadamente ou usar o **LivePortrait**.
            """)

    btn_gen.click(fn=process, inputs=[text_input, voice_sel, rate, pitch], outputs=[out_audio, status])

if __name__ == "__main__":
    app.launch(inbrowser=True)
`;

  return (
    <div className="space-y-6 pb-20">
      {/* Explanation Header */}
      <div className="bg-gradient-to-r from-red-950 to-black border-l-4 border-red-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600/20 rounded-lg text-red-400">
            <Wrench size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">V12: Robust Fix (Critical Update)</h2>
            <div className="flex items-center gap-4 mt-1">
               <span className="text-gray-300 text-sm">
                 <strong>O Crash (Rank 4 Tensor):</strong> Ocorreu porque tentei otimizar o vídeo como se fosse imagem. Vídeos têm 5 dimensões, o otimizador só aceita 4. <strong>V12 remove isso.</strong>
                 <br/>
                 <strong>A Lentidão:</strong> Voltei a usar o modo "CPU Offload" em vez de forçar a GPU. Isso evita que seu PC use a memória RAM (lenta) quando a VRAM da RTX 4070 (rápida) enche.
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button 
          onClick={() => setActiveTab('visual')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
            activeTab === 'visual' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Film size={16} />
          Passo 1: Visual (V12)
          {activeTab === 'visual' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('audio')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
            activeTab === 'audio' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Mic size={16} />
          Passo 2: Áudio (V10)
          {activeTab === 'audio' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500"></div>}
        </button>
      </div>

      {/* Content */}
      <div className="pt-4">
        {activeTab === 'visual' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
             <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20 text-sm text-gray-300 flex gap-3">
                <AlertTriangle className="text-blue-400 shrink-0" />
                <div>
                   <strong>Estratégia do Loop:</strong>
                   <p>Use a configuração "Estável" + "Médio (2s)". O vídeo ficará com movimento sutil e lento. No software de edição, coloque esse vídeo em <strong>Loop</strong> infinito. Assim você terá um avatar que respira para sempre enquanto o LipSync mexe a boca.</p>
                </div>
             </div>

             <div className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                   <div className="flex items-center gap-3">
                     <FileCode className="text-blue-500" size={24} />
                     <h3 className="text-xl font-bold text-white">app_video_v12.py (Fix)</h3>
                   </div>
                   <button 
                     onClick={() => copyToClipboard(videoScriptCode, 'video-code')} 
                     className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                   >
                     {copiedId === 'video-code' ? <Check size={16} /> : <Copy size={16} />}
                     {copiedId === 'video-code' ? 'Copiado!' : 'Copiar Código'}
                   </button>
                </div>
                <div className="bg-[#0d0d0d] p-4 rounded-xl border border-white/10 font-mono text-xs overflow-x-auto max-h-[400px] overflow-y-auto relative z-10 custom-scrollbar">
                   <pre className="text-gray-300">{videoScriptCode}</pre>
                </div>
             </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
             <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/20 text-sm text-gray-300 flex gap-3">
                <Music className="text-purple-400 shrink-0" />
                <div>
                   <strong>Novo Script: Voice Studio</strong>
                   <p>Instale a biblioteca necessária: <code>pip install edge-tts</code></p>
                   <p className="mt-2">Este script cria o arquivo de áudio (.mp3) que dará voz ao seu avatar. Depois, você usará um software externo (como <strong>SadTalker</strong> ou <strong>LivePortrait</strong>) para juntar a IMAGEM da V9/V11 com o ÁUDIO da V10.</p>
                </div>
             </div>

             <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 p-6 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                   <div className="flex items-center gap-3">
                     <FileCode className="text-purple-500" size={24} />
                     <h3 className="text-xl font-bold text-white">app_voice_v10.py (Audio Engine)</h3>
                   </div>
                   <button 
                     onClick={() => copyToClipboard(audioScriptCode, 'audio-code')} 
                     className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors"
                   >
                     {copiedId === 'audio-code' ? <Check size={16} /> : <Copy size={16} />}
                     {copiedId === 'audio-code' ? 'Copiado!' : 'Copiar Código'}
                   </button>
                </div>
                <div className="bg-[#0d0d0d] p-4 rounded-xl border border-white/10 font-mono text-xs overflow-x-auto max-h-[400px] overflow-y-auto relative z-10 custom-scrollbar">
                   <pre className="text-gray-300">{audioScriptCode}</pre>
                </div>
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};