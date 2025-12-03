import React from 'react';
import { Layers, Mic, User, Video, Zap, Menu, X, Terminal } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MENU_ITEMS = [
  { id: 'intro', label: 'Dashboard', icon: Layers },
  { id: 'tools', label: 'Top 5 Tools', icon: Zap },
  { id: 'workflow', label: 'Workflow Pro', icon: Video },
  { id: 'voice', label: 'Master Voz', icon: Mic },
  { id: 'aesthetics', label: 'Avatar & Look', icon: User },
  { id: 'local', label: 'Local Ops (RTX)', icon: Terminal },
  { id: 'budget', label: 'Modo Gratuito', icon: Layers },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-dark-900 text-gray-200 flex font-sans selection:bg-neon-purple selection:text-white overflow-x-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full z-50 bg-dark-900/90 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
          AvatarArchitect
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-dark-800 border-r border-white/5 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:block
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tighter text-white mb-2 hidden lg:block">
            Avatar<span className="text-neon-blue">Architect</span>
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-8 hidden lg:block">Class of 2025</p>
          
          <nav className="space-y-2 mt-12 lg:mt-0">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-[0_0_15px_rgba(0,243,255,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-gray-500">System Online • v2025.12</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 overflow-y-auto relative">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};