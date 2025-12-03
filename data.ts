import { Monitor, Cpu, Mic, Video, Award, Zap, DollarSign, Camera, Sliders } from 'lucide-react';

export const TOOLS = [
  {
    name: "HeyGen 5.0 (Enterprise)",
    icon: Monitor,
    category: "All-in-One",
    pros: ["Melhor lipsync do mercado", "Modelo 'Instant Avatar 2.0' grava em 2min", "4K Nativo"],
    cons: ["Caro ($99/mês para 4K)", "Censura rígida em scripts"],
    price: "$29 - $200 / mês",
    bestFor: "Qualidade de transmissão (Broadcast)"
  },
  {
    name: "Hedra Ultra",
    icon: Cpu,
    category: "Generative Video",
    pros: ["Expressividade emocional inigualável", "Controle total de micro-expressões", "Estilo cinematográfico"],
    cons: ["Renderização lenta em 4K", "Requer upload de áudio externo"],
    price: "Freemium / $30 mês",
    bestFor: "Storytelling e Emoção"
  },
  {
    name: "Kling AI 1.5",
    icon: Video,
    category: "Video Generation",
    pros: ["Movimento de corpo inteiro realista", "Gera cenários complexos", "Ótimo para B-Roll"],
    cons: ["Interface complexa", "Lipsync inferior ao HeyGen"],
    price: "Créditos por uso",
    bestFor: "Avatar em movimento/cenário"
  },
  {
    name: "ElevenLabs v4",
    icon: Mic,
    category: "Voice Synthesis",
    pros: ["Indistinguível de humano", "Speech-to-Speech (S2S)", "PT-BR perfeito com sotaques regionais"],
    cons: ["Fica caro em vídeos de 30min+"],
    price: "$22/mês (Creator)",
    bestFor: "Voz (Obrigatório)"
  },
  {
    name: "LivePortrait 2025 (Local)",
    icon: Sliders,
    category: "Open Source",
    pros: ["Totalmente Grátis", "Roda local (Privacidade)", "Controle frame-a-frame"],
    cons: ["Requer GPU potente (RTX 4090 rec.)", "Curva de aprendizado alta"],
    price: "Grátis (Open Source)",
    bestFor: "Usuários Avançados/Devs"
  }
];

export const WORKFLOW_STEPS = [
  {
    id: 1,
    title: "1. A Criação da Identidade (Avatar)",
    desc: "Não use fotos de banco de imagem. Crie uma persona única.",
    tools: "Midjourney v7 ou Flux.1 Pro",
    details: "Use prompts descrevendo: 'Sony A7R V photography, 85mm lens, depth of field, soft studio lighting'. Para Tech, use roupas casuais mas premium (polos escuras, óculos finos). Gere variações olhando para frente e levemente de lado."
  },
  {
    id: 2,
    title: "2. Síntese de Voz (A Alma)",
    desc: "O áudio dita a qualidade da animação. O vídeo segue o áudio.",
    tools: "ElevenLabs (Turbo v2.5 ou Multilingual v4)",
    details: "Não use apenas Text-to-Speech. Use Speech-to-Speech: grave você mesmo falando (mesmo que com voz ruim) para capturar a CADÊNCIA e PAUSAS. A IA vai substituir o timbre mas manter a sua atuação."
  },
  {
    id: 3,
    title: "3. Animação e Lipsync",
    desc: "Onde a mágica acontece.",
    tools: "HeyGen (Qualidade) ou Hedra (Expressão)",
    details: "Upload da imagem + Upload do áudio gerado. No HeyGen, ative 'Super Resolution'. No Hedra, use o slider de 'Character Consistency' em 80% e 'Motion' em 20% para palestras técnicas (evita alucinações)."
  },
  {
    id: 4,
    title: "4. Pós-Processamento e Upscale",
    desc: "O segredo do 4K nítido.",
    tools: "Topaz Video AI 5",
    details: "Exporte da ferramenta de IA em 1080p. Use o Topaz com o modelo 'Proteus' para fazer upscale para 4K 60fps. Adicione 'Grain' (grão de filme) em 2% para quebrar a 'cara de plástico' da IA."
  }
];

export const VOICE_TIPS = [
  {
    title: "A Técnica do Speech-to-Speech",
    content: "Em 2025, digitar texto é obsoleto para alta qualidade. Grave o áudio no seu celular falando com emoção, pausas respiratórias e risadas. Suba no ElevenLabs/PlayHT como referência. O resultado é 10x mais natural."
  },
  {
    title: "Prompting de Texto (SSML Simplificado)",
    content: "Se for digitar, use tags de pausa. Ex: 'A nuvem... <break time='0.5s' /> não é o que você pensa.' Use '...' para hesitação. Escreva números por extenso ('dois mil e vinte e cinco') para evitar erros."
  },
  {
    title: "Melhores Modelos PT-BR",
    content: "1. ElevenLabs: Modelo 'Alice' (Neutro) ou 'Daniel' (Assertivo). 2. Cartesia Sonic: Latência zero, ótimo para vídeos longos. 3. OpenAI TTS HD: Bom, mas menos emotivo."
  }
];

export const AESTHETICS_GUIDE = [
  {
    category: "Iluminação",
    tip: "Rembrandt Lighting. Luz principal a 45 graus, luz de recorte (Rim light) azul ou roxa atrás para separar do fundo. Evite luz frontal chapada."
  },
  {
    category: "Roupas Tech",
    tip: "Evite xadrez ou listras finas (causa moiré no vídeo). Use cores sólidas: Preto, Navy Blue, Cinza Chumbo. Hoodies premium ou camisetas básicas de alta gramatura."
  },
  {
    category: "Cenário",
    tip: "Desfoque o fundo (Bokeh). Um escritório com fitas LED sutis, plantas e estantes de livros técnicos. O foco deve ser 100% no rosto."
  }
];

export const COMFY_WORKFLOWS = [
  {
    title: "LivePortrait Advanced (KJ Nodes)",
    description: "O padrão ouro para animação facial controlada. Permite usar vídeo driving ou apenas áudio (com Audio2Exp).",
    vram: "8GB+",
    nodes: ["ComfyUI-LivePortraitKJ", "ComfyUI-VideoHelperSuite"],
    linkType: "Github",
    url: "https://github.com/kijai/ComfyUI-LivePortraitKJ/tree/master/examples",
    difficulty: "Medium"
  },
  {
    title: "LatentSync (Lipsync King)",
    description: "Superior ao Wav2Lip. Lipsync 'flicker-free' alinhando temporalmente o áudio aos latents do vídeo. Ideal para scripts longos.",
    vram: "12GB+",
    nodes: ["ComfyUI_LatentSync_Wrapper", "ComfyUI-Flux"],
    linkType: "OpenArt",
    url: "https://openart.ai/workflows/latentsync",
    difficulty: "Hard"
  },
  {
    title: "InstantID + Face Restore",
    description: "Mantenha a identidade do seu professor tech consistente em diferentes ângulos e iluminações gerados via Stable Diffusion.",
    vram: "10GB+",
    nodes: ["ComfyUI_InstantID", "ComfyUI_IPAdapter_plus"],
    linkType: "ComfyWorkflows",
    url: "https://comfyworkflows.com/workflows/instantid",
    difficulty: "Medium"
  },
  {
    title: "MimicMotion (Full Body)",
    description: "Faz o avatar se mover da cintura para cima usando um vídeo de referência. Ótimo para gesticulação de mãos.",
    vram: "16GB (Ideal)",
    nodes: ["ComfyUI-MimicMotion", "ComfyUI-AnimateDiff"],
    linkType: "Github",
    url: "https://github.com/Tencent/MimicMotion",
    difficulty: "Hard"
  },
  {
    title: "Avatar Graph (Rigging)",
    description: "Gera rigs 2D/3D interativos a partir de uma única foto. Uso avançado para games ou aplicações real-time.",
    vram: "8GB+",
    nodes: ["avatar-graph-comfyui", "ComfyUI-Manager"],
    linkType: "Github",
    url: "https://github.com/avatechai/avatar-graph-comfyui",
    difficulty: "Extreme"
  }
];