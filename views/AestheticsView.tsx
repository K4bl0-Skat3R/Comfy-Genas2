import React from 'react';
import { AESTHETICS_GUIDE } from '../data';
import { Camera, Sun, User, Palette } from 'lucide-react';

export const AestheticsView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 p-6 rounded-2xl">
           <Sun className="text-orange-400 mb-4" size={32} />
           <h3 className="text-xl font-bold text-white mb-2">Iluminação</h3>
           <p className="text-sm text-gray-400">Use "Rembrandt Lighting". A sombra suave de um lado do rosto cria profundidade e realismo, evitando o "look IA chapado".</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-6 rounded-2xl">
           <User className="text-blue-400 mb-4" size={32} />
           <h3 className="text-xl font-bold text-white mb-2">Estilo Tech</h3>
           <p className="text-sm text-gray-400">Smart Casual. Camisetas pretas de alta qualidade, óculos de armação fina. Evite estampas complexas.</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-6 rounded-2xl">
           <Palette className="text-purple-400 mb-4" size={32} />
           <h3 className="text-xl font-bold text-white mb-2">Cenário (BG)</h3>
           <p className="text-sm text-gray-400">Profundidade de campo (f/1.8). Elementos de fundo desfocados: luzes neon sutis, plantas, hardware.</p>
        </div>
      </div>

      <div className="bg-dark-800 rounded-3xl overflow-hidden border border-white/10">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Prompt de Criação de Avatar (Midjourney v7)</h2>
          <div className="bg-black/50 p-6 rounded-xl border border-dashed border-gray-600 font-mono text-sm text-green-400 break-words">
            <span className="text-purple-400">/imagine prompt:</span> medium shot of a handsome 30-year-old tech educator, brazilian features, wearing a high-quality black t-shirt, modern thin glasses, friendly and intelligent expression, soft rim lighting, background is a blurred modern home office with subtle blue led strip, shot on Sony A7R V, 85mm lens, f/1.8, hyperrealistic, 8k, detailed skin texture --ar 16:9 --style raw --v 6.1
          </div>
          <p className="mt-4 text-gray-400 text-sm">
            Copie este prompt. A chave é "--style raw" para evitar que a imagem fique "artística demais" e perca o realismo fotográfico necessário para o lipsync funcionar bem.
          </p>
        </div>
      </div>
    </div>
  );
};
