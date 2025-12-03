import React from 'react';
import { DollarSign, Github, Download } from 'lucide-react';

export const FreeModeView: React.FC = () => {
  return (
    <div className="space-y-8">
       <div className="bg-green-900/20 border border-green-500/20 p-8 rounded-3xl">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <DollarSign className="text-green-500" size={32} /> O Caminho "Zero Custo"
          </h2>
          <p className="text-gray-300 text-lg">
            É possível ter resultado profissional de graça em 2025? <span className="text-white font-bold">Sim</span>, mas você paga com tempo de configuração e requer um PC com placa de vídeo NVIDIA (mínimo 8GB VRAM).
          </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-dark-800 p-6 rounded-2xl border border-white/5">
             <div className="flex items-center gap-3 mb-4">
                <Github size={24} className="text-white" />
                <h3 className="text-xl font-bold text-white">1. LivePortrait (Open Source)</h3>
             </div>
             <p className="text-gray-400 mb-6 text-sm h-20">
               A melhor ferramenta gratuita atual. Pega uma única foto e "dirige" ela usando um vídeo seu da webcam. Não gera o lipsync por áudio, mas copia seus movimentos faciais.
             </p>
             <div className="space-y-2 text-sm text-gray-300 mb-6">
                <p>• <span className="text-green-400">Pró:</span> Grátis e ilimitado.</p>
                <p>• <span className="text-red-400">Contra:</span> Você precisa gravar o vídeo base.</p>
             </div>
             <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors">
               Acessar GitHub
             </button>
          </div>

          <div className="bg-dark-800 p-6 rounded-2xl border border-white/5">
             <div className="flex items-center gap-3 mb-4">
                <Download size={24} className="text-white" />
                <h3 className="text-xl font-bold text-white">2. CapCut Desktop (Magic)</h3>
             </div>
             <p className="text-gray-400 mb-6 text-sm h-20">
               O CapCut lançou "AI Characters" na versão gratuita. São avatares pré-prontos (não pode usar o seu), mas a qualidade é decente para iniciantes.
             </p>
             <div className="space-y-2 text-sm text-gray-300 mb-6">
                <p>• <span className="text-green-400">Pró:</span> Super fácil de usar.</p>
                <p>• <span className="text-red-400">Contra:</span> Avatares genéricos.</p>
             </div>
             <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors">
               Baixar CapCut
             </button>
          </div>
       </div>

       <div className="bg-dark-800 p-8 rounded-2xl border border-white/5 mt-8">
          <h3 className="text-xl font-bold text-white mb-4">O Truque do "Hybrid Workflow" Barato</h3>
          <ol className="space-y-4 text-gray-400 list-decimal pl-5">
             <li>Crie o Avatar no <strong>Bing Image Creator</strong> (DALL-E 3 Grátis).</li>
             <li>Gere o áudio no <strong>ElevenLabs</strong> (Plano Grátis dá 10min/mês).</li>
             <li>Use o <strong>Hedra (Free Tier)</strong> para animar o áudio (permite vídeos curtos).</li>
             <li>Junte os clipes em um editor de vídeo gratuito como <strong>DaVinci Resolve</strong>.</li>
             <li>Use <strong>Upscayl</strong> (Open Source) para melhorar a qualidade da imagem final.</li>
          </ol>
       </div>
    </div>
  );
};
