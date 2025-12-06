import React, { useState } from 'react';
import { Copy, Check, FileCode, Film, AlertTriangle, ExternalLink, Key, Sliders, Type, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const VideoStudioView: React.FC = () => {
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

# --- CINE ENGINE V7 (SAFE MODE) ---
# Correção Crítica para Shutdowns/Crashes:
# 1. "One Model Rule": Nunca mantém SDXL e SVD na memória juntos.
# 2. Decode Chunk Size = 1: Reduz pico de energia da GPU.
# 3. Garbage Collection Agressivo entre etapas.

print(f"🐍 Python: {sys.version.split()[0]}")
if torch.cuda.is_available():
    print(f"🎮 GPU Ativa: {torch.cuda.get_device_name(0)}")

# Variáveis Globais (Armazenam apenas UM modelo por vez)
current_pipe = None
current_model_type = None # 'image' ou 'video'

def aggressive_cleanup():
    """Limpa VRAM violentamente para evitar OOM/Shutdown"""
    global current_pipe
    if current_pipe is not None:
        del current_pipe
        current_pipe = None
    
    gc.collect()
    torch.cuda.empty_cache()
    torch.cuda.ipc_collect()
    print("🧹 Memória Limpa.")

def get_image_pipe():
    global current_pipe, current_model_type
    if current_model_type == 'image' and current_pipe is not None:
        return current_pipe
    
    print("🔄 Trocando para Motor de Texto (SDXL Turbo)...")
    aggressive_cleanup()
    
    try:
        pipe = AutoPipelineForText2Image.from_pretrained(
            "stabilityai/sdxl-turbo",
            torch_dtype=torch.float16,
            variant="fp16"
        )
        pipe.enable_model_cpu_offload()
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
    
    print("🔄 Trocando para Motor de Vídeo (SVD-XT)...")
    aggressive_cleanup()
    
    try:
        pipe = StableVideoDiffusionPipeline.from_pretrained(
            "stabilityai/stable-video-diffusion-img2vid-xt-1-1",
            dtype=torch.float16,
            variant="fp16"
        )
        pipe.enable_model_cpu_offload()
        pipe.enable_vae_slicing()
        pipe.enable_vae_tiling()
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
        return "✅ Autenticado com Sucesso!"
    except Exception as e:
        return f"❌ Erro Auth: {e}"

def run_text_to_image(prompt):
    if not prompt: return None, "⚠️ Digite um prompt."
    
    pipe = get_image_pipe()
    if not pipe: return None, "❌ Falha ao carregar modelo SDXL."
    
    print(f"🎨 Gerando Imagem: {prompt}")
    try:
        image = pipe(
            prompt=prompt, 
            num_inference_steps=1, 
            guidance_scale=0.0,
            width=1024, height=576
        ).images[0]
        return image, "✅ Imagem Base Criada. Agora clique em 'Animar'."
    except Exception as e:
        return None, f"Erro Geração: {e}"

def run_image_to_video(image, motion_mode, fps):
    if image is None: return None, "⚠️ Nenhuma imagem carregada."
    
    # 1. Resize Seguro
    image = image.resize((1024, 576))
    
    # 2. Carrega Motor de Vídeo (Isso mata o de imagem da memória)
    pipe = get_video_pipe()
    if not pipe: return None, "❌ Falha ao carregar SVD."

    # 3. Configura Motion
    if motion_mode == "Avatar Falando (Estável)":
        bucket_id = 40
        aug = 0.05
    elif motion_mode == "Movimento Médio":
        bucket_id = 100
        aug = 0.1
    else:
        bucket_id = 180
        aug = 0.15

    generator = torch.manual_seed(42)
    print("🎬 Iniciando Renderização Segura (Chunk=1)...")
    
    try:
        # decode_chunk_size=1 é o segredo para não desligar o PC
        frames = pipe(
            image, 
            decode_chunk_size=1, 
            generator=generator,
            motion_bucket_id=bucket_id,
            noise_aug_strength=aug,
            num_frames=25,
        ).frames[0]

        os.makedirs("outputs/videos", exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_path = f"outputs/videos/v7_{timestamp}.mp4"
        
        export_to_video(frames, output_path, fps=fps)
        return output_path, f"✅ Vídeo Salvo: {output_path}"
    except Exception as e:
        return None, f"❌ Erro Fatal: {e}"

# UI V7
with gr.Blocks() as app:
    gr.Markdown("# 🎬 CineEngine V7: Safe Mode")
    gr.Markdown("Gerenciamento de memória agressivo para prevenir desligamento do hardware.")
    
    with gr.Row():
        with gr.Column(scale=1):
            token_input = gr.Textbox(label="Token HuggingFace", type="password")
            btn_auth = gr.Button("🔑 Autenticar", variant="secondary")
            auth_status = gr.Textbox(label="Status Auth", value="Aguardando...")
            
            gr.Markdown("---")
            motion_mode = gr.Radio(
                ["Avatar Falando (Estável)", "Movimento Médio", "Ação Cinemática"],
                value="Avatar Falando (Estável)",
                label="Motion Settings"
            )
            fps = gr.Slider(6, 30, value=24, label="FPS")

        with gr.Column(scale=2):
            with gr.Tabs():
                # ABA 1: UPLOAD DIRETO
                with gr.Tab("Modo A: Upload & Animar"):
                    input_upload = gr.Image(label="Avatar Input", type="pil")
                    btn_anim_upload = gr.Button("🎬 Gerar Vídeo (Safe Mode)", variant="primary")
                
                # ABA 2: TEXTO -> IMAGEM -> VÍDEO (Separado em 2 passos)
                with gr.Tab("Modo B: Criar & Animar"):
                    prompt_input = gr.Textbox(label="Prompt do Avatar", placeholder="cinematic portrait...")
                    btn_gen_img = gr.Button("1. Gerar Imagem Base", variant="secondary")
                    out_img_gen = gr.Image(label="Imagem Gerada", type="pil", interactive=False)
                    btn_anim_gen = gr.Button("2. Animar Imagem Gerada", variant="primary")

            out_video = gr.Video(label="Resultado Final")
            status_log = gr.Textbox(label="System Log")

    # Eventos
    btn_auth.click(fn=auth_huggingface, inputs=[token_input], outputs=[auth_status])
    
    # Fluxo Upload
    btn_anim_upload.click(
        fn=run_image_to_video,
        inputs=[input_upload, motion_mode, fps],
        outputs=[out_video, status_log]
    )

    # Fluxo Texto (Passo a Passo para garantir limpeza de memória)
    btn_gen_img.click(
        fn=run_text_to_image,
        inputs=[prompt_input],
        outputs=[out_img_gen, status_log]
    )
    
    btn_anim_gen.click(
        fn=run_image_to_video,
        inputs=[out_img_gen, motion_mode, fps],
        outputs=[out_video, status_log]
    )

if __name__ == "__main__":
    app.launch(inbrowser=True)
`;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-950 to-black border-l-4 border-red-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600/20 rounded-lg text-red-500">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">CineEngine V7 (Safe Mode)</h2>
            <div className="flex items-center gap-4 mt-1">
               <span className="text-gray-300 text-sm">
                 <strong>Correção de Hardware (Shutdown):</strong>
                 <br/>
                 O desligamento do PC indica que a V6 estava exigindo muito da Fonte (PSU).
                 A <strong>V7</strong> implementa a <em>"One Model Rule"</em>: ela deleta o modelo de Imagem da memória antes de carregar o de Vídeo.
                 <br/>
                 <span className="text-red-400 font-bold">Nota:</span> A transição entre gerar imagem e vídeo levará alguns segundos a mais (para carregar/descarregar), mas é seguro.
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* Guide */}
      <div className="bg-dark-800 p-6 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <AlertTriangle size={18} className="text-yellow-500"/> Como usar sem crashar:
          </h3>
          <ul className="list-disc pl-5 text-sm text-gray-400 space-y-2">
             <li>
               <strong>Modo Texto:</strong> Agora é em 2 etapas manuais. Primeiro clique em "Gerar Imagem". Espere aparecer. Só depois clique em "Animar".
               Isso garante que o sistema tenha tempo de limpar a memória.
             </li>
             <li>
               <strong>Decode Chunk Size:</strong> Reduzi para 1. O vídeo demora um pouco mais para aparecer no final (rendering), mas evita o pico de energia.
             </li>
          </ul>
      </div>

      {/* Code Block */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/30 p-6 rounded-2xl relative overflow-hidden">
         <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <FileCode className="text-red-500" size={24} />
              <h3 className="text-xl font-bold text-white">app_video_v7.py</h3>
            </div>
            <button 
              onClick={() => copyToClipboard(videoScriptCode, 'video-code')} 
              className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
            >
              {copiedId === 'video-code' ? <Check size={16} /> : <Copy size={16} />}
              {copiedId === 'video-code' ? 'Copiado!' : 'Copiar Código'}
            </button>
         </div>
         
         <div className="bg-[#0d0d0d] p-4 rounded-xl border border-white/10 font-mono text-xs overflow-x-auto max-h-[500px] overflow-y-auto relative z-10 custom-scrollbar">
            <pre className="text-gray-300">
              {videoScriptCode}
            </pre>
         </div>
      </div>
    </div>
  );
};