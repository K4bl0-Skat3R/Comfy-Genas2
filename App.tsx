import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ToolsView } from './views/ToolsView';
import { WorkflowView } from './views/WorkflowView';
import { VoiceView } from './views/VoiceView';
import { AestheticsView } from './views/AestheticsView';
import { FreeModeView } from './views/FreeModeView';
import { LocalDevView } from './views/LocalDevView';
import { VideoStudioView } from './views/VideoStudioView';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('intro');

  const renderContent = () => {
    switch (activeTab) {
      case 'tools': return <ToolsView />;
      case 'workflow': return <WorkflowView />;
      case 'voice': return <VoiceView />;
      case 'aesthetics': return <AestheticsView />;
      case 'budget': return <FreeModeView />;
      case 'local': return <LocalDevView />;
      case 'video_studio': return <VideoStudioView />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

const Dashboard = ({ setActiveTab }: { setActiveTab: (t: string) => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full blur opacity-30 animate-pulse"></div>
      <div className="relative w-32 h-32 bg-dark-800 rounded-full flex items-center justify-center border-2 border-white/10">
        <Sparkles size={48} className="text-white" />
      </div>
    </div>
    
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
        Masterclass de <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Avatares IA</span>
      </h1>
      <p className="text-xl text-gray-400">
        O guia definitivo (Dez 2025) para criar avatares hiper-realistas para educação tech, do zero ao 4K.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mt-8">
      <button 
        onClick={() => setActiveTab('workflow')}
        className="bg-white text-black font-bold py-4 px-8 rounded-xl hover:bg-gray-200 transition-transform hover:scale-105"
      >
        Começar Workflow
      </button>
      <button 
        onClick={() => setActiveTab('tools')}
        className="bg-transparent border border-white/20 text-white font-bold py-4 px-8 rounded-xl hover:bg-white/5 transition-transform hover:scale-105"
      >
        Ver Ferramentas
      </button>
    </div>
  </div>
);