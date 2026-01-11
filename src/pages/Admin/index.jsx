import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HymnTab from './HymnTab';
import BibleTab from './BibleTab';
import CourseTab from './CourseTab';
import AnnouncementsTab from './AnnouncementsTab';
import ControlBar from './ControlBar';
import SlidePreview from '../../components/SlidePreview';
import PresentationMode from '../../components/PresentationMode';
import SettingsModal from '../../components/SettingsModal';
import MobileNav from '../../components/MobileNav';
import { useAuthStore } from '../../stores/authStore';
import { useProjectionStore } from '../../stores/projectionStore';
import { useSettingsStore } from '../../stores/settingsStore';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('hinos');
  const [presentationMode, setPresentationMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { currentSlide } = useProjectionStore();
  const { loadSettings } = useSettingsStore();
  
  // Carregar configurações ao montar
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleEnterPresentation = () => {
    setPresentationMode(true);
  };

  const handleExitPresentation = () => {
    setPresentationMode(false);
  };

  // Se estiver em modo apresentação, mostrar só o slide
  if (presentationMode) {
    return <PresentationMode onExit={handleExitPresentation} />;
  }

  const hasContent = currentSlide.text || (currentSlide.slides && currentSlide.slides.length > 0);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header - Responsivo */}
      <header className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm md:text-lg">B</span>
          </div>
          <div>
            <h1 className="text-sm md:text-lg font-semibold text-gray-900">Bíblia e Hinário</h1>
            <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Painel de Controle</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          {/* Botão Preview Mobile */}
          <button
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="md:hidden p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
            title="Preview"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          
          {hasContent && (
            <button
              onClick={handleEnterPresentation}
              className="p-2 md:px-4 md:py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="hidden md:inline">Apresentar</span>
            </button>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
            title="Configurações"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            onClick={handleLogout}
            className="p-2 md:px-4 md:py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-700 text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden md:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Preview Mobile - Colapsável */}
      {showMobilePreview && (
        <div className="md:hidden bg-gray-50 border-b border-gray-200 p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-500">Preview</span>
            <button 
              onClick={() => setShowMobilePreview(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="h-32">
            <SlidePreview compact />
          </div>
        </div>
      )}

      {/* Tabs Desktop - Escondido no Mobile (< 768px) */}
      <div className="desktop-tabs bg-white border-b border-gray-200 px-6">
        <nav className="flex gap-1">
          <button
            onClick={() => setActiveTab('hinos')}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'hinos'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              Hinário
            </span>
            {activeTab === 'hinos' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('biblia')}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'biblia'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Bíblia
            </span>
            {activeTab === 'biblia' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('curso')}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'curso'
                ? 'text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253M9 8h6m-6 4h6m-6 4h6" />
              </svg>
              Curso
            </span>
            {activeTab === 'curso' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('anuncios')}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'anuncios'
                ? 'text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Anúncios
            </span>
            {activeTab === 'anuncios' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {/* Content - Responsivo */}
      <div className="flex-1 overflow-hidden flex bg-gray-50">
        {/* Main Content */}
        <div className="flex-1 p-3 md:p-6 overflow-hidden mobile-content-padding">
          <div className="bg-white rounded-xl border border-gray-200 h-full overflow-hidden shadow-sm">
            {activeTab === 'hinos' && <HymnTab />}
            {activeTab === 'biblia' && <BibleTab />}
            {activeTab === 'curso' && <CourseTab />}
            {activeTab === 'anuncios' && <AnnouncementsTab />}
          </div>
        </div>

        {/* Sidebar - Preview (Desktop apenas - >= 1024px) */}
        <div className="desktop-sidebar w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Preview do Slide</h2>
          <SlidePreview />
        </div>
      </div>

      {/* Control Bar - Desktop */}
      <div className="desktop-control-bar">
        <ControlBar />
      </div>

      {/* Control Bar Mobile - Flutuante */}
      <div className="mobile-control-bar fixed bottom-16 left-0 right-0 px-4 pb-2 z-40">
        <ControlBar mobile />
      </div>
      
      {/* Mobile Nav */}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
}
