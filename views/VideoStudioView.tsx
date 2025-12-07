import React, { useState } from 'react';
import { Copy, Check, FileCode, Film, AlertTriangle, ExternalLink, Key, Sliders, Type, Image as ImageIcon, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
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

# --- CINE ENGINE V9 (STABLE CORE) ---
# Correções Críticas:
# 1. Fix: 'dtype' -> 'torch_dtype' (Erro que quebrava o SVD).
# 2. Fix: Try/Except no 'enable_vae_slicing' para evitar AttributeError.
# 3. Mantém SDXL Base 1.0 para qualidade máxima (sem deformações).

print(f"🐍 Python: {sys.version.split()[0]}")
if torch.cuda.is_available():
    print(f"🎮 GPU Ativa: {torch.cuda.get_device_name(0)}")

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
    
    print("🔄 Carregando SVD-XT (Vídeo)...")
    aggressive_cleanup()
    
    try:
        # CORREÇÃO V9: torch_dtype em vez de dtype
        pipe = StableVideoDiffusionPipeline.from_pretrained(
            "stabilityai/stable-video-diffusion-img2vid-xt-1-1",
            torch_dtype=torch.float16, 
            variant="fp16"
        )
        
        # Gerenciamento de Memória Crucial
        pipe.enable_model_cpu_offload()
        
        # Otimizações Opcionais (Try/Catch para não crashar)
        try:
            pipe.enable_vae_slicing()
            print("✅ VAE Slicing Ativado")
        except AttributeError:
            print("⚠️ Aviso: VAE Slicing não suportado/necessário nesta versão.")

        try:
            pipe.enable_vae_tiling()
            print("✅ VAE Tiling Ativado")
        except AttributeError:
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
        image = pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=30, 
            guidance_scale=7.5,
            width=1024, height=576
        ).images[0]
        return image, "✅ Imagem Base Pronta! Clique em '2. Animar'."
    except Exception as e:
        return None, f"Erro Geração: {e}"

def run_image_to_video(image, motion_mode, fps):
    if image is None: return None, "⚠️ Nenhuma imagem carregada."
    
    # Resize Seguro
    image = image.resize((1024, 576))
    
    pipe = get_video_pipe()
    if not pipe: return None, "❌ Falha ao carregar SVD."

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
    print("🎬 Renderizando Vídeo (Pode levar 1-2 minutos)...")
    
    try:
        frames = pipe(
            image, 
            decode_chunk_size=2, # Valor padrão seguro para 4070 Ti
            generator=generator,
            motion_bucket_id=bucket_id,
            noise_aug_strength=aug,
            num_frames=25,
        ).frames[0]

        os.makedirs("outputs/videos", exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_path = f"outputs/videos/v9_{timestamp}.mp4"
        
        export_to_video(frames, output_path, fps=fps)
        return output_path, f"✅ SUCESSO: {output_path}"
    except Exception as e:
        return None, f"❌ Erro Fatal: {e}"

# UI V9
with gr.Blocks() as app:
    gr.Markdown("# 🎬 CineEngine V9: Stable Core")
    gr.Markdown("Pipeline corrigido para máxima estabilidade e qualidade.")
    
    with gr.Row():
        with gr.Column(scale=1):
            token_input = gr.Textbox(label="Token HuggingFace", type="password")
            btn_auth = gr.Button("🔑 Autenticar", variant="secondary")
            auth_status = gr.Textbox(label="Status", value="...")
            
            gr.Markdown("---")
            motion_mode = gr.Radio(
                ["Avatar Falando (Estável)", "Movimento Médio", "Ação Cinemática"],
                value="Avatar Falando (Estável)",
                label="Motion Settings"
            )
            fps = gr.Slider(6, 30, value=24, label="FPS")

        with gr.Column(scale=2):
            with gr.Tabs():
                with gr.Tab("Modo A: Upload & Animar"):
                    input_upload = gr.Image(label="Avatar Input", type="pil")
                    btn_anim_upload = gr.Button("🎬 Gerar Vídeo", variant="primary")
                
                with gr.Tab("Modo B: Criar HQ & Animar"):
                    prompt_input = gr.Textbox(label="Prompt Detalhado", placeholder="cyberpunk avatar...")
                    btn_gen_img = gr.Button("1. Gerar Imagem (Alta Qualidade)", variant="secondary")
                    out_img_gen = gr.Image(label="Imagem Base", type="pil", interactive=False)
                    btn_anim_gen = gr.Button("2. Animar Resultado", variant="primary")

            out_video = gr.Video(label="Resultado Final")
            status_log = gr.Textbox(label="Log Sistema")

    btn_auth.click(fn=auth_huggingface, inputs=[token_input], outputs=[auth_status])
    
    btn_anim_upload.click(
        fn=run_image_to_video,
        inputs=[input_upload, motion_mode, fps],
        outputs=[out_video, status_log]
    )

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
      <div className="bg-gradient-to-r from-blue-950 to-black border-l-4 border-blue-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/20 rounded-lg text-blue-400">
            <Wrench size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">CineEngine V9 (Stable Core)</h2>
            <div className="flex items-center gap-4 mt-1">
               <span className="text-gray-300 text-sm">
                 <strong>Correção Definitiva (AttributeError):</strong>
                 <br/>
                 O erro <code>enable_vae_slicing</code> ocorria porque o parâmetro <code>dtype</code> estava errado, impedindo o modelo de carregar suas funções auxiliares.
                 <br/>
                 A <strong>V9</strong> corrige para <code>torch_dtype</code> e blinda o código contra falhas de otimização. Agora deve rodar liso.
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* Guide */}
      <div className="bg-dark-800 p-6 rounded-xl border border-white/10">
          <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-500"/> O que esperar:
          </h3>
          <ul className="list-disc pl-5 text-sm text-gray-400 space-y-2">
             <li>
               <strong>Qualidade da Imagem:</strong> Voltei a usar o SDXL Base (V8). Vai demorar ~30s para gerar a imagem, mas ela não ficará deformada como no V7.
             </li>
             <li>
               <strong>Vídeo:</strong> Se o "VAE Slicing" falhar, o script agora apenas ignora e continua renderizando (pode usar um pouco mais de VRAM, mas não vai travar).
             </li>
          </ul>
      </div>

      {/* Code Block */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden">
         <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <FileCode className="text-blue-500" size={24} />
              <h3 className="text-xl font-bold text-white">app_video_v9.py</h3>
            </div>
            <button 
              onClick={() => copyToClipboard(videoScriptCode, 'video-code')} 
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
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