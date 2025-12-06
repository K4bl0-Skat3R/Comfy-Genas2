import React, { useState } from 'react';
import { Copy, Check, FileCode, Film, AlertTriangle, ExternalLink, Key, Sliders, Type, Image as ImageIcon } from 'lucide-react';
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

# --- CINE ENGINE V6 (HYBRID STUDIO) ---
# Funcionalidade Dupla:
# 1. Image-to-Video (Upload de Avatar pronto).
# 2. Text-to-Video (Gera imagem via SDXL Turbo -> Anima via SVD).

print(f"🐍 Python: {sys.version.split()[0]}")
if torch.cuda.is_available():
    print(f"🎮 GPU Ativa: {torch.cuda.get_device_name(0)}")

pipe_video = None
pipe_image = None

MODEL_VIDEO = "stabilityai/stable-video-diffusion-img2vid-xt-1-1"
MODEL_IMAGE = "stabilityai/sdxl-turbo" # Rápido e leve para gerar a base

def load_models(token=None):
    global pipe_video, pipe_image
    
    if pipe_video and pipe_image: return "✅ Sistema Híbrido Pronto!"
    
    if token and token.strip():
        try:
            login(token=token)
        except Exception as e:
            return f"❌ Erro Auth: {e}"

    gc.collect()
    torch.cuda.empty_cache()
    print("⏳ Carregando Motores Híbridos (Isso usa CPU Offload para economizar VRAM)...")
    
    try:
        # 1. Carrega Gerador de Imagem (SDXL Turbo)
        pipe_image = AutoPipelineForText2Image.from_pretrained(
            MODEL_IMAGE,
            torch_dtype=torch.float16,
            variant="fp16"
        )
        pipe_image.enable_model_cpu_offload() # Essencial para rodar junto com SVD
        
        # 2. Carrega Gerador de Vídeo (SVD)
        pipe_video = StableVideoDiffusionPipeline.from_pretrained(
            MODEL_VIDEO,
            dtype=torch.float16,
            variant="fp16"
        )
        pipe_video.enable_model_cpu_offload()
        pipe_video.enable_vae_slicing()
        pipe_video.enable_vae_tiling() # Fix V4/V5
        
        print("✅ CineEngine V6 (Hybrid) Carregada!")
        return "✅ Pronto! Modos Texto e Imagem ativos."
    except Exception as e:
        return f"❌ Erro: {str(e)}"

def process_pipeline(image_input, prompt_input, mode_source, motion_mode, fps):
    global pipe_video, pipe_image
    
    if pipe_video is None: return None, None, "⚠️ Carregue os modelos primeiro."

    # FASE 1: Obter a Imagem Base
    target_image = None
    
    if mode_source == "Usar Imagem Pronta (Upload)":
        if image_input is None: return None, None, "⚠️ Faça upload da imagem."
        target_image = image_input
        status_step1 = "✅ Imagem carregada."
    else:
        # Modo Texto: Gerar Imagem na hora
        if not prompt_input: return None, None, "⚠️ Digite um prompt."
        print(f"🎨 Criando Avatar: '{prompt_input}'...")
        target_image = pipe_image(
            prompt=prompt_input, 
            num_inference_steps=1, # Turbo precisa só de 1 step
            guidance_scale=0.0,
            width=1024,
            height=576 # Formato Cinematic SVD
        ).images[0]
        status_step1 = "✅ Avatar criado via SDXL Turbo."

    # Resize de segurança
    target_image = target_image.resize((1024, 576))

    # FASE 2: Configurar Movimento
    if motion_mode == "Avatar Falando (Estável)":
        bucket_id = 40
        aug = 0.05
    elif motion_mode == "Movimento Médio":
        bucket_id = 100
        aug = 0.1
    else:
        bucket_id = 180
        aug = 0.15

    # FASE 3: Gerar Vídeo
    generator = torch.manual_seed(42)
    print(f"🎬 Animando (Bucket: {bucket_id})...")
    
    try:
        frames = pipe_video(
            target_image, 
            decode_chunk_size=2,
            generator=generator,
            motion_bucket_id=bucket_id,
            noise_aug_strength=aug,
            num_frames=25,
        ).frames[0]

        os.makedirs("outputs/videos", exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_path = f"outputs/videos/v6_{timestamp}.mp4"
        
        export_to_video(frames, output_path, fps=fps)
        
        return target_image, output_path, f"{status_step1} -> Vídeo Gerado com Sucesso!"
    except Exception as e:
        return target_image, None, f"Erro na renderização: {e}"

# UI V6
with gr.Blocks() as app:
    gr.Markdown("# 🎬 CineEngine V6: Hybrid Studio")
    gr.Markdown("Crie vídeos a partir de Uploads OU Prompts de Texto.")
    
    with gr.Row():
        with gr.Column(scale=1):
            token_input = gr.Textbox(label="Token HuggingFace (Write)", type="password")
            btn_auth = gr.Button("1. Iniciar Motor Híbrido", variant="primary")
            auth_status = gr.Textbox(label="Status", value="Parado")
            
            gr.Markdown("### Configurações")
            motion_mode = gr.Radio(
                ["Avatar Falando (Estável)", "Movimento Médio", "Ação Cinemática"],
                value="Avatar Falando (Estável)",
                label="Tipo de Movimento"
            )
            fps = gr.Slider(6, 30, value=24, label="FPS")

        with gr.Column(scale=2):
            with gr.Tabs():
                with gr.Tab("Opção A: Upload de Imagem"):
                    input_image_upload = gr.Image(label="Arraste seu Avatar aqui", type="pil")
                    btn_gen_upload = gr.Button("🎬 Animar Upload", variant="secondary")
                
                with gr.Tab("Opção B: Criar por Texto"):
                    prompt_input = gr.Textbox(label="Descreva o Avatar", placeholder="Ex: cinematic shot of a cyberpunk hacker, neon lights, 8k, realistic...")
                    btn_gen_text = gr.Button("🎨 Criar & Animar", variant="secondary")

            gr.Markdown("### Resultado")
            with gr.Row():
                out_image = gr.Image(label="Imagem Base (Gerada ou Upload)", type="pil", interactive=False)
                out_video = gr.Video(label="Vídeo Final")
            
            status_final = gr.Textbox(label="Log de Processamento")

    # Logica de Eventos
    # Wrapper para passar o modo correto
    def run_upload(img, mode, f):
        return process_pipeline(img, None, "Usar Imagem Pronta (Upload)", mode, f)

    def run_text(prompt, mode, f):
        return process_pipeline(None, prompt, "Criar via Texto", mode, f)

    btn_auth.click(fn=load_models, inputs=[token_input], outputs=[auth_status])
    
    btn_gen_upload.click(
        fn=run_upload, 
        inputs=[input_image_upload, motion_mode, fps], 
        outputs=[out_image, out_video, status_final]
    )
    
    btn_gen_text.click(
        fn=run_text, 
        inputs=[prompt_input, motion_mode, fps], 
        outputs=[out_image, out_video, status_final]
    )

if __name__ == "__main__":
    try:
        load_models()
    except:
        pass
    app.launch(inbrowser=True)
`;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 to-black border-l-4 border-indigo-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600/20 rounded-lg text-indigo-400">
            <Film size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">CineEngine V6 (Hybrid Studio)</h2>
            <div className="flex items-center gap-4 mt-1">
               <span className="text-gray-300 text-sm">
                 <strong>O Melhor dos Dois Mundos:</strong>
                 <br/>
                 Agora o app carrega dois modelos simultaneamente (SDXL Turbo + SVD).
                 Você pode fazer upload de um avatar existente OU criar um novo via prompt na aba "Opção B".
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* Concept Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-dark-800 p-6 rounded-xl border border-white/10">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <ImageIcon size={18} className="text-blue-500"/> Opção A: Upload (Recomendado)
            </h3>
            <p className="text-sm text-gray-400">
               Use a <strong>V20 (App Imagem)</strong> para criar seu avatar com calma, refinar detalhes e depois suba aqui.
               <br/><br/>
               <span className="text-green-400">Vantagem:</span> Controle total da aparência.
            </p>
         </div>
         
         <div className="bg-dark-800 p-6 rounded-xl border border-white/10">
             <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <Type size={18} className="text-pink-500"/> Opção B: Prompt de Texto
             </h3>
             <p className="text-sm text-gray-400">
                O script cria a imagem na hora usando <strong>SDXL Turbo</strong> e já manda para animação automaticamente.
                <br/><br/>
                <span className="text-green-400">Vantagem:</span> Velocidade (Testes rápidos de ideias).
             </p>
         </div>
      </div>

      {/* Code Block */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-indigo-500/30 p-6 rounded-2xl relative overflow-hidden">
         <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <FileCode className="text-indigo-500" size={24} />
              <h3 className="text-xl font-bold text-white">app_video_v6.py</h3>
            </div>
            <button 
              onClick={() => copyToClipboard(videoScriptCode, 'video-code')} 
              className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white font-bold rounded-lg hover:bg-indigo-600 transition-colors"
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