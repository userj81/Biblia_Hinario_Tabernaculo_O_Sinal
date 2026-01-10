import { useEffect, useState } from 'react';
import { useProjectionStore } from '../../stores/projectionStore';
import { getSocket, socketHelpers } from '../../services/socket';
import { useAuthStore } from '../../stores/authStore';
import '../Projector/styles.css';

/**
 * Versão ADMIN do projetor - Protegida com autenticação
 * Permite controle completo (setas, blackout, etc.)
 */
export default function ProjectorAdmin() {
  const { currentSlide, isBlackout, setSlide, setBlackout, nextSlide, prevSlide } = useProjectionStore();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [showHelp, setShowHelp] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Verificar autenticação
  useEffect(() => {
    checkAuth().then((authenticated) => {
      setAuthChecked(true);
      if (!authenticated) {
        window.location.href = '/login';
      }
    });
  }, [checkAuth]);

  // Navegação por teclado (setas) - SÓ FUNCIONA SE AUTENTICADO
  useEffect(() => {
    if (!isAuthenticated || !authChecked) return;

    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          if (currentSlide.totalSlides > 0 && currentSlide.currentSlideIndex < currentSlide.totalSlides - 1) {
            const newIndex = currentSlide.currentSlideIndex + 1;
            nextSlide();
            socketHelpers.changeSlide('next', newIndex, currentSlide.totalSlides);
          }
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          if (currentSlide.currentSlideIndex > 0) {
            const newIndex = currentSlide.currentSlideIndex - 1;
            prevSlide();
            socketHelpers.changeSlide('prev', newIndex, currentSlide.totalSlides);
          }
          break;

        case 'Escape':
          event.preventDefault();
          if (isBlackout) {
            socketHelpers.clearBlackout();
            setBlackout(false);
          } else {
            socketHelpers.blackout();
            setBlackout(true);
          }
          break;

        case 'f':
        case 'F':
          event.preventDefault();
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen();
          }
          break;

        case 'h':
        case 'H':
          event.preventDefault();
          setShowHelp(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isBlackout, nextSlide, prevSlide, setBlackout, isAuthenticated, authChecked]);

  // Esconder ajuda após alguns segundos
  useEffect(() => {
    if (currentSlide.text || (currentSlide.slides && currentSlide.slides.length > 0)) {
      const timer = setTimeout(() => setShowHelp(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  // Entrar em fullscreen automaticamente quando receber conteúdo
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const hasContent = currentSlide.text || (currentSlide.slides && currentSlide.slides.length > 0);
    
    if (hasContent && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        const handleUserInteraction = () => {
          document.documentElement.requestFullscreen().catch(() => {});
          document.removeEventListener('click', handleUserInteraction);
          document.removeEventListener('keydown', handleUserInteraction);
        };
        document.addEventListener('click', handleUserInteraction, { once: true });
        document.addEventListener('keydown', handleUserInteraction, { once: true });
      });
    }
  }, [currentSlide, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socketInstance = getSocket();

    socketInstance.on('render_slide', (data) => {
      setSlide(data);
      setBlackout(false);
      
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
          const handleInteraction = () => {
            document.documentElement.requestFullscreen().catch(() => {});
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
          };
          document.addEventListener('click', handleInteraction, { once: true });
          document.addEventListener('keydown', handleInteraction, { once: true });
        });
      }
    });

    socketInstance.on('render_blackout', () => setBlackout(true));
    socketInstance.on('clear_blackout', () => setBlackout(false));

    socketInstance.on('render_background', (data) => {
      useProjectionStore.getState().updateSettings({
        backgroundImage: data.url,
        backgroundColor: data.color,
      });
    });

    socketInstance.on('render_settings', (newSettings) => {
      useProjectionStore.getState().updateSettings(newSettings);
    });

    socketInstance.on('navigate_slide', (data) => {
      if (typeof data.currentSlide === 'number') {
        useProjectionStore.getState().setSlideIndex(data.currentSlide);
      }
    });

    return () => {
      socketInstance.off('render_slide');
      socketInstance.off('render_blackout');
      socketInstance.off('clear_blackout');
      socketInstance.off('render_background');
      socketInstance.off('render_settings');
      socketInstance.off('navigate_slide');
    };
  }, [setSlide, setBlackout, isAuthenticated]);

  // Obter texto do slide atual
  const getCurrentSlideText = () => {
    if (isBlackout) return '';
    
    if (currentSlide.slides && currentSlide.slides.length > 0) {
      const slideIndex = currentSlide.currentSlideIndex || 0;
      const slide = currentSlide.slides[slideIndex] || currentSlide.slides[0];
      
      if (slide && typeof slide === 'object' && !Array.isArray(slide)) {
        if ('text' in slide) return String(slide.text || '');
        if ('id' in slide && 'hinario_id' in slide) return '';
        return String(slide);
      }
      
      if (typeof slide === 'string') return slide;
      return '';
    }
    
    const text = currentSlide.text;
    if (typeof text === 'string') return text;
    if (text && typeof text === 'object' && 'text' in text) return String(text.text || '');
    return '';
  };

  if (!authChecked) {
    return (
      <div className="projector-container projector-default" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div>Verificando autenticação...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const slideText = getCurrentSlideText();
  const slideData = currentSlide.slides?.[currentSlide.currentSlideIndex || 0];
  const isRefrain = slideData?.isRefrain || false;

  // Determinar o tipo de conteúdo
  const slideType = currentSlide.type || 'default';
  const isHino = slideType === 'hino';
  const isVerse = slideType === 'verse';
  
  // CSS class baseada no tipo
  const containerClass = `projector-container ${
    isHino ? 'projector-hino' : 
    isVerse ? 'projector-verse' : 
    'projector-default'
  }`;

  // Nome do hino para a barra musical
  const hinoNome = currentSlide.metadata?.hino || '';
  const hinoNumero = currentSlide.metadata?.numero || '';

  return (
    <div className={containerClass}>
      {isBlackout ? (
        <div className="blackout-screen" />
      ) : (
        <>
          <div className="slide-content">
            {slideText && typeof slideText === 'string' ? (
              <>
                {slideText.split('\n').map((line, index) => {
                  const isRefrainLine = line.trim().startsWith('*');
                  const displayLine = isRefrainLine ? line.replace(/^\*+/, '').trim() : line.trim();
                  
                  if (!displayLine) return null;
                  
                  return (
                    <div
                      key={index}
                      className={`slide-line ${isRefrainLine || isRefrain ? 'refrain' : ''}`}
                    >
                      {displayLine}
                    </div>
                  );
                })}
                
                {/* Referência do versículo (apenas para Bíblia) */}
                {isVerse && currentSlide.metadata?.referencia && (
                  <div className="verse-reference">
                    {String(currentSlide.metadata.referencia)}
                  </div>
                )}
              </>
            ) : (
              <div className="empty-slide">
                <div className="empty-message">Aguardando conteúdo...</div>
                {showHelp && (
                  <div className="help-message">
                    <div>Use as setas ← → para navegar</div>
                    <div>ESC para apagar/ligar tela</div>
                    <div>F para fullscreen</div>
                    <div style={{ marginTop: '1rem', color: '#FBBF24' }}>🔒 Modo Administrador - Controle Ativo</div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Barra Musical (apenas para Hinos) */}
          {isHino && hinoNome && (
            <div className="music-bar">
              <div className="music-bar-content">
                <span className="music-notes">🎵 ♪ 🎶</span>
                <span className="music-bar-text">
                  {hinoNumero && `${String(hinoNumero)}. `}
                  {String(hinoNome)}
                </span>
                <span className="music-notes">🎶 ♪ 🎵</span>
                <span className="music-bar-text">
                  {hinoNumero && `${String(hinoNumero)}. `}
                  {String(hinoNome)}
                </span>
                <span className="music-notes">🎵 ♪ 🎶</span>
              </div>
            </div>
          )}
          
          {/* Indicador de slide atual */}
          {currentSlide.totalSlides > 1 && (
            <div className="slide-indicator">
              {(currentSlide.currentSlideIndex || 0) + 1} / {currentSlide.totalSlides}
            </div>
          )}
        </>
      )}
    </div>
  );
}
