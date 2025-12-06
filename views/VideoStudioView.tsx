import React, { useState } from 'react';
import { Copy, Check, FileCode, Film, AlertTriangle, ExternalLink, Key, Sliders, Mic } from 'lucide-react';
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
from diffusers import StableVideoDiffusionPipeline
from diffusers.utils import load_image, export_to_video
from huggingface_hub import login
import os
import gc
import sys
from datetime import datetime

# --- CINE ENGINE V5 (Avatar Stability Edition) ---
# Foco: Evitar "derretimento" de rostos.
# 1. Configurações otimizadas para "Talking Heads" (Baixo movimento).
# 2. Correção de VAE Tiling (Evita erro de memória na renderização).
# 3. Fix de warnings (dtype).

print(f"🐍 Python: {sys.version.split()[0]}")
if torch.cuda.is_available():
    print(f"🎮 GPU Ativa: {torch.cuda.get_device_name(0)}")

pipe = None
MODEL_ID = "stabilityai/stable-video-diffusion-img2vid-xt-1-1"

def load_model(token=None):
    global pipe
    if pipe: return "✅ Engine V5 Pronta!"
    
    if token and token.strip():
        print(f"🔑 Verificando token...")
        try:
            login(token=token)
        except Exception as e:
            return f"❌ Erro Auth: {e}"

    gc.collect()
    torch.cuda.empty_cache()
    print("⏳ Carregando SVD-XT V5...")
    
    try:
        pipe = StableVideoDiffusionPipeline.from_pretrained(
            MODEL_ID,
            dtype=torch.float16, # V5 Fix: dtype correto
            variant="fp16"
        )
        # OTIMIZAÇÕES CRÍTICAS V5
        pipe.enable_model_cpu_offload()
        pipe.enable_vae_slicing()
        pipe.enable_vae_tiling() # V5 Fix: Resolve o crash na renderização final
        
        print("✅ CineEngine V5 Carregada com Sucesso!")
        return "✅ Pronto para gerar."
    except Exception as e:
        if "401" in str(e): return "⚠️ Token Necessário (Erro 401)"
        return f"❌ Erro: {str(e)}"

def generate_video(image, mode, fps):
    global pipe
    if pipe is None: return None, "⚠️ Carregue o modelo primeiro."
    if image is None: return None, "⚠️ Envie uma imagem."

    # PRESETS V5 - O SEGREDO DA ESTABILIDADE
    # Rostos deformam se o Motion Bucket for > 50.
    # Para "Ensinar", queremos apenas respiração leve (Idle).
    if mode == "Avatar Falando (Estável)":
        motion_bucket_id = 40  # Baixo movimento = Rosto Perfeito
        noise_aug_strength = 0.05
    elif mode == "Movimento Médio":
        motion_bucket_id = 100
        noise_aug_strength = 0.1
    else: # Ação / Cinematic
        motion_bucket_id = 180 # Muito movimento = Deformação aceitável em paisagens
        noise_aug_strength = 0.15

    # Resize Inteligente (1024x576 é o nativo do SVD-XT)
    w, h = image.size
    aspect = w / h
    if aspect > 1: # Paisagem
        image = image.resize((1024, 576))
    else: # Retrato (Força crop para 576x1024 vertical se necessário, mas SVD prefere landscape)
        # Vamos manter 1024x576 e adicionar barras ou crop para evitar erro
        image = image.resize((1024, 576)) 

    generator = torch.manual_seed(42)
    
    print(f"🎬 Renderizando: {mode} (Bucket: {motion_bucket_id})...")
    
    try:
        frames = pipe(
            image, 
            decode_chunk_size=2, # Menor uso de VRAM
            generator=generator,
            motion_bucket_id=motion_bucket_id,
            noise_aug_strength=noise_aug_strength,
            num_frames=25,
        ).frames[0]

        os.makedirs("outputs/videos", exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_path = f"outputs/videos/video_{timestamp}.mp4"
        
        export_to_video(frames, output_path, fps=fps)
        return output_path, f"✅ Gerado: {output_path}"
    except Exception as e:
        print(f"❌ Erro: {e}")
        return None, f"Erro: {str(e)}"

# UI V5
with gr.Blocks() as app:
    gr.Markdown("# 🎬 CineEngine V5: Avatar Stability")
    
    with gr.Row():
        with gr.Column(scale=1):
            token_input = gr.Textbox(label="Token HuggingFace (Write)", type="password")
            btn_auth = gr.Button("1. Iniciar Engine", variant="primary")
            auth_status = gr.Textbox(label="Status", value="Parado")
            
            gr.Markdown("### ℹ️ Guia V5")
            gr.Markdown("**Por que sem Prompt?** O SVD cria movimento a partir de pixels, não texto. Use o 'Modo' ao lado para controlar a intensidade.")
            gr.Markdown("**Como fazer ele Falar?** Este vídeo cria o *corpo* (Idle). Para falar, leve este vídeo para uma ferramenta de LipSync (Wav2Lip/LivePortrait).")

        with gr.Column(scale=2):
            input_image = gr.Image(label="Avatar (Use imagem nítida da V20)", type="pil")
            
            with gr.Row():
                mode = gr.Radio(
                    ["Avatar Falando (Estável)", "Movimento Médio", "Ação Cinemática"],
                    value="Avatar Falando (Estável)",
                    label="Tipo de Movimento (Motion Bucket)"
                )
                fps = gr.Slider(6, 30, value=24, label="FPS do Vídeo")
            
            btn_gen = gr.Button("2. GERAR VÍDEO BASE", variant="secondary")
            output_video = gr.Video(label="Resultado (Loop de 2-4s)")
            gen_status = gr.Textbox(label="Log de Renderização")

    btn_auth.click(fn=load_model, inputs=[token_input], outputs=[auth_status])
    btn_gen.click(fn=generate_video, inputs=[input_image, mode, fps], outputs=[output_video, gen_status])

if __name__ == "__main__":
    try:
        load_model()
    except:
        pass
    app.launch(inbrowser=True)
`;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 to-black border-l-4 border-purple-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600/20 rounded-lg text-purple-400">
            <Film size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">CineEngine V5 (Avatar Stability)</h2>
            <div className="flex items-center gap-4 mt-1">
               <span className="text-gray-300 text-sm">
                 <strong>Solução para Deformação:</strong>
                 <br/>
                 O SVD padrão "derrete" rostos porque tenta criar muito movimento.
                 A <strong>V5</strong> adiciona o modo <strong>"Avatar Falando (Estável)"</strong> que trava o movimento (Motion Bucket = 40).
                 <br/>
                 <span className="text-purple-400 text-xs">Isso cria o vídeo "Idle" (respirando/piscando). O LipSync (fala) deve ser aplicado SOBRE este vídeo.</span>
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* Concept Explanation */}
      <div className="bg-dark-800 p-6 rounded-xl border border-white/10 flex flex-col md:flex-row gap-6 items-center">
         <div className="flex-1">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <Sliders size={18} className="text-yellow-500"/> O "Segredo" do Vídeo com Fala
            </h3>
            <p className="text-sm text-gray-400 mb-2">
                Você não gera um vídeo "falando" direto no SVD. O fluxo profissional é:
            </p>
            <ol className="list-decimal pl-5 text-sm text-gray-300 space-y-1">
                <li>Gere a Imagem (App V20).</li>
                <li>Gere um <strong>Vídeo Idle</strong> (App V5 - Avatar Mode). O personagem apenas pisca e respira.</li>
                <li>Leve esse vídeo + Áudio para o <strong>LivePortrait</strong> ou <strong>SadTalker</strong>.</li>
            </ol>
            <p className="text-xs text-gray-500 mt-2 italic">
                *O SVD não aceita prompts de texto ("make him talk") porque é um modelo puramente visual.
            </p>
         </div>
         
         <div className="bg-black/40 p-4 rounded-lg border border-white/5 w-full md:w-64 shrink-0">
             <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="text-yellow-500" size={20} />
                <span className="text-xs font-bold text-gray-200">Correções V5 Aplicadas</span>
             </div>
             <ul className="text-xs text-gray-400 space-y-1">
                <li>✅ <code>vae_tiling</code> ativado (Fix Crash)</li>
                <li>✅ <code>dtype</code> atualizado (Fix Warning)</li>
                <li>✅ Motion Bucket 40 (Fix Face Melt)</li>
             </ul>
         </div>
      </div>

      {/* Code Block */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 p-6 rounded-2xl relative overflow-hidden">
         <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <FileCode className="text-purple-500" size={24} />
              <h3 className="text-xl font-bold text-white">app_video_v5.py</h3>
            </div>
            <button 
              onClick={() => copyToClipboard(videoScriptCode, 'video-code')} 
              className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors"
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