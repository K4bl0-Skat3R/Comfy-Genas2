import React, { useState } from 'react';
import { Copy, Check, Terminal, PlayCircle, Package, CheckCircle, Upload, ArrowRight, Download, AlertTriangle, FileVideo, Code, Bug, FileCode } from 'lucide-react';
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

  const fullInterfaceCode = `import gradio as gr
import os
from backend.image_generation import generate_image
from backend.lora_loader import list_loras, set_lora_directory

def create_interface(app_state):
    # Lista inicial de LoRAs
    lora_list = list_loras()
    
    # Samplers comuns do SDXL
    samplers = ["euler", "euler_a", "dpm++_2m", "dpm++_sde_karras", "ddim", "uni_pc"]

    with gr.Blocks(title="SDXL Studio") as demo:
        gr.Markdown("# 🎨 **SDXL Studio — Interface Avançada**")

        with gr.Row():
            with gr.Column(scale=1):
                # --- INPUTS ---
                prompt = gr.Textbox(label="Prompt", placeholder="Descreva a imagem...")
                
                # Mantemos o campo visual, mas não vamos enviar ao backend por enquanto
                negative = gr.Textbox(label="Negative Prompt (Ignorado pelo backend atual)", placeholder="O que evitar...")
                
                steps = gr.Slider(10, 60, value=35, label="Steps", step=1)
                cfg = gr.Slider(1.0, 15.0, value=7.5, step=0.1, label="CFG Scale")
                
                # O input de Sampler
                sampler = gr.Dropdown(
                    label="Sampler", 
                    choices=samplers, 
                    value="euler_a",
                    interactive=True
                )

                # --- LORA SECTION ---
                lora_folder = gr.Textbox(
                    label="Pasta de LoRAs",
                    value=os.path.abspath("loras"),
                    interactive=True
                )
                update_lora_btn = gr.Button("Atualizar pasta de LoRAs")
                
                lora_dropdown = gr.Dropdown(label="Selecione LoRA", choices=lora_list, value=None)
                lora_picker = gr.File(label="Ou arquivo LoRA (.safetensors)", file_types=[".safetensors"])

                generate_btn = gr.Button("Gerar imagem", variant="primary")

            with gr.Column(scale=1):
                output_image = gr.Image(label="Resultado", type="numpy")

        # --- LOGIC ---

        def update_loras(new_folder):
            set_lora_directory(new_folder)
            return gr.update(choices=list_loras())

        update_lora_btn.click(fn=update_loras, inputs=[lora_folder], outputs=[lora_dropdown])

        def on_generate(prompt, negative, steps, cfg, sampler, lora_choice, lora_file):
            lora_path = None
            if lora_file is not None:
                lora_path = lora_file.name
            elif lora_choice:
                lora_path = lora_choice

            # CORREÇÃO CRÍTICA: 
            # Sua função 'generate_image' no backend não aceita 'negative' nem 'negative_prompt'.
            # Removemos o argumento da chamada abaixo para o código funcionar.
            
            return generate_image(
                pipe_base=app_state.pipe_base,
                pipe_refiner=app_state.pipe_refiner,
                prompt=prompt,
                # negative=negative,  <-- REMOVIDO PARA EVITAR ERRO
                steps=steps,
                cfg=cfg,
                lora_path=lora_path,
                sampler=sampler
            )

        # Botão conectado
        generate_btn.click(
            fn=on_generate,
            inputs=[prompt, negative, steps, cfg, sampler, lora_dropdown, lora_picker],
            outputs=[output_image]
        )

    return demo`;

  return (
    <div className="space-y-6 pb-20">
      {/* Success Header */}
      <div className="bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg text-green-500 shadow-[0_0_15px_rgba(0,255,0,0.2)]">
            <CheckCircle size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Sistema Operacional</h2>
            <p className="text-gray-400 text-sm">
              Python 3.12 • PyTorch 2.5.1 • CUDA • RTX 4070 Ti Super Detectada
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button 
          onClick={() => setActiveTab('workflows')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'workflows' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Biblioteca de Workflows
          {activeTab === 'workflows' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-purple"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('maintenance')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'maintenance' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Debug & Manutenção
          {activeTab === 'maintenance' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>}
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
            
            {/* FULL FIX CARD */}
            <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border border-green-500/40 p-6 rounded-2xl">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileCode className="text-green-400" size={24} />
                    <h3 className="text-xl font-bold text-white">Correção Final: interface.py</h3>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(fullInterfaceCode, 'full-code')} 
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition-colors"
                  >
                    {copiedId === 'full-code' ? <Check size={16} /> : <Copy size={16} />}
                    {copiedId === 'full-code' ? 'Copiado!' : 'Copiar Tudo'}
                  </button>
               </div>
               
               {/* NEW BUG NOTIFICATION */}
               <div className="mb-4 bg-orange-500/10 border border-orange-500/50 p-3 rounded-lg flex items-center gap-3 text-sm text-orange-200">
                  <Bug size={16} className="shrink-0" />
                  <span>
                    <strong>Problema Detectado:</strong> Seu backend <code>generate_image</code> não possui suporte a Negative Prompt.
                    <br/>
                    <strong>Solução:</strong> Removi o parâmetro da chamada da função no código abaixo para evitar o erro e permitir a geração.
                  </span>
               </div>
               
               <p className="text-gray-300 text-sm mb-4">
                 Substitua <strong>todo</strong> o conteúdo do arquivo <code>ui/interface.py</code> pelo código abaixo.
               </p>
               
               <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/10 font-mono text-xs overflow-x-auto max-h-[400px] overflow-y-auto">
                  <pre className="text-gray-300">
                    {fullInterfaceCode}
                  </pre>
               </div>
            </div>

            {/* Previous Fixes (Collapsed/Secondary) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75 hover:opacity-100 transition-opacity">
              <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
                 <h3 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                   <FileVideo size={16} /> ComfyUI FFmpeg
                 </h3>
                 <p className="text-gray-400 text-xs mb-3">Se tiver erro de vídeo no ComfyUI:</p>
                 <div className="bg-black/50 p-2 rounded-lg border border-white/5 flex items-center justify-between">
                    <code className="text-gray-300 font-mono text-[10px]">pip install imageio-ffmpeg</code>
                    <button onClick={() => copyToClipboard('py -3.12 -m pip install imageio-ffmpeg', 'ff')} className="text-gray-400 hover:text-white"><Copy size={14}/></button>
                 </div>
              </div>

              <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
                 <h3 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                   <Terminal size={16} /> Reinstalar Libs
                 </h3>
                 <p className="text-gray-400 text-xs mb-3">Comando de emergência:</p>
                 <div className="bg-black/50 p-2 rounded-lg border border-white/5 flex items-center justify-between">
                    <code className="text-gray-300 font-mono text-[10px] truncate mr-2">pip install torchsde einops...</code>
                    <button onClick={() => copyToClipboard('py -3.12 -m pip install torchsde einops transformers scipy psutil kornia requests tqdm pyyaml pillow', 'libs')} className="text-gray-400 hover:text-white"><Copy size={14}/></button>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};