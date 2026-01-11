import { useEffect, useState, useCallback } from 'react';
import { useProjectionStore } from '../stores/projectionStore';
import { useSettingsStore } from '../stores/settingsStore';
import { getSocket, socketHelpers } from '../services/socket';
import '../pages/Projector/styles.css';

/**
 * Componente de Modo Apresentação
 * 
 * HINOS: Fundo preto, texto ESTÁTICO na barra musical (cada linha = 1 slide)
 * BÍBLIA: Cada versículo = 1 slide, fundo azul
 */
export default function PresentationMode({ onExit }) {
  const { currentSlide, isBlackout, setSlide, setBlackout, nextSlide, prevSlide } = useProjectionStore();
  const { fonteVersiculo, fonteHino } = useSettingsStore();
  const [showHelp, setShowHelp] = useState(true);
  const [touchCount, setTouchCount] = useState(0);
  const [touchTimer, setTouchTimer] = useState(null);

  const handleExit = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onExit();
  }, [onExit]);

  // Navegação por teclado (setas)
  useEffect(() => {
    const handleKeyDown = (event) => {
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
          handleExit();
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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, nextSlide, prevSlide, handleExit]);

  // Detecção de 3 toques (mobile)
  useEffect(() => {
    const handleTouch = () => {
      setTouchCount(prev => {
        const newCount = prev + 1;
        if (touchTimer) clearTimeout(touchTimer);
        const timer = setTimeout(() => setTouchCount(0), 1000);
        setTouchTimer(timer);
        if (newCount >= 3) {
          clearTimeout(timer);
          setTouchCount(0);
          handleExit();
          return 0;
        }
        return newCount;
      });
    };
    window.addEventListener('touchstart', handleTouch);
    return () => {
      window.removeEventListener('touchstart', handleTouch);
      if (touchTimer) clearTimeout(touchTimer);
    };
  }, [touchTimer, handleExit]);

  useEffect(() => {
    if (currentSlide.text || (currentSlide.slides && currentSlide.slides.length > 0)) {
      const timer = setTimeout(() => setShowHelp(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  useEffect(() => {
    const socketInstance = getSocket();
    socketInstance.on('render_slide', (data) => {
      setSlide(data);
      setBlackout(false);
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    });
    socketInstance.on('render_blackout', () => setBlackout(true));
    socketInstance.on('clear_blackout', () => setBlackout(false));
    socketInstance.on('navigate_slide', (data) => {
      if (typeof data.currentSlide === 'number') {
        useProjectionStore.getState().setSlideIndex(data.currentSlide);
      }
    });
    return () => {
      socketInstance.off('render_slide');
      socketInstance.off('render_blackout');
      socketInstance.off('clear_blackout');
      socketInstance.off('navigate_slide');
    };
  }, [setSlide, setBlackout]);

  useEffect(() => {
    const hasContent = currentSlide.text || (currentSlide.slides && currentSlide.slides.length > 0);
    if (hasContent && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, [currentSlide]);

  // Obter dados do slide atual
  const getCurrentSlideData = () => {
    if (isBlackout) return { text: '', isRefrain: false, versiculo: null, parte: null };
    
    if (currentSlide.slides && currentSlide.slides.length > 0) {
      const slideIndex = currentSlide.currentSlideIndex || 0;
      const slide = currentSlide.slides[slideIndex] || currentSlide.slides[0];
      
      if (slide && typeof slide === 'object' && !Array.isArray(slide)) {
        if ('text' in slide) {
          return { 
            text: String(slide.text || ''), 
            isRefrain: slide.isRefrain || false,
            versiculo: slide.versiculo || null,
            parte: slide.parte || null,
          };
        }
      }
      if (typeof slide === 'string') {
        return { text: slide, isRefrain: false, versiculo: null, parte: null };
      }
    }
    
    const text = currentSlide.text;
    if (typeof text === 'string') {
      return { text, isRefrain: false, versiculo: null, parte: null };
    }
    
    return { text: '', isRefrain: false, versiculo: null, parte: null };
  };

  const { text: slideText, isRefrain, versiculo, parte: slideParte } = getCurrentSlideData();
  
  const slideType = currentSlide.type || 'default';
  const isHino = slideType === 'hino';
  const isVerse = slideType === 'verse';
  const isAnuncio = slideType === 'anuncio';
  
  const containerClass = `projector-container ${
    isHino ? 'projector-hino' : 
    isVerse ? 'projector-verse' : 
    isAnuncio ? 'projector-anuncio' :
    'projector-default'
  }`;

  const hinoNumero = currentSlide.metadata?.numero || '';
  const hinoNome = currentSlide.metadata?.hino || '';
  const hasHinoContent = isHino && slideText;

  // Número do versículo para Bíblia
  const verseNumber = versiculo || currentSlide.metadata?.versiculo || (currentSlide.currentSlideIndex || 0) + 1;
  
  // Metadados do anúncio
  const anuncioNome = currentSlide.metadata?.nome || '';
  const anuncioReferencias = currentSlide.metadata?.referencias || [];

  // Aplicar configurações dinâmicas de fonte
  const dynamicStyles = {
    '--fonte-versiculo': `${fonteVersiculo}px`,
    '--fonte-hino': `${fonteHino}px`,
  };

  return (
    <div className={containerClass} style={dynamicStyles}>
      {isBlackout ? (
        <div className="blackout-screen" />
      ) : (
        <>
          {/* Conteúdo ANÚNCIO */}
          {isAnuncio ? (
            <div className="anuncio-content">
              <div className="anuncio-header">📖 LEITURA BÍBLICA</div>
              <div className="anuncio-referencias">
                {anuncioReferencias.map((ref, i) => (
                  <div key={i} className="anuncio-ref">{ref}</div>
                ))}
              </div>
              <div className="anuncio-nome">{anuncioNome}</div>
            </div>
          ) : (
            <>
              <div className="slide-content">
                {slideText && !isHino ? (
                  <>
                    {isVerse ? (
                      <div className="slide-line">
                        <span className="verse-number">{versiculo || verseNumber}</span>
                        {slideText}
                      </div>
                    ) : (
                      slideText.split('\n').map((line, index) => {
                        const isRefrainLine = line.trim().startsWith('*');
                        const displayLine = isRefrainLine ? line.replace(/^\*+/, '').trim() : line.trim();
                        if (!displayLine) return null;
                        return (
                          <div key={index} className={`slide-line ${isRefrainLine || isRefrain ? 'refrain' : ''}`}>
                            {displayLine}
                          </div>
                        );
                      })
                    )}
                    
                    {isVerse && currentSlide.metadata?.livro && (
                      <div className="verse-reference">
                        📖 {currentSlide.metadata.livro} {currentSlide.metadata.capitulo}:{versiculo || verseNumber}
                        {slideParte && <span className="verse-part"> ({slideParte})</span>}
                      </div>
                    )}
                  </>
                ) : !isHino && (
                  <div className="empty-slide">
                    <div className="empty-message">Aguardando conteúdo...</div>
                    {showHelp && (
                      <div className="help-message">
                        <div>← → para navegar | ESC para sair</div>
                        <div style={{ color: '#FBBF24', marginTop: '0.5rem' }}>📱 3 toques para sair</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {hasHinoContent && (
                <div className="music-bar">
                  <span className="music-notes">🎵 ♪ 🎶</span>
                  <div className="music-bar-content">
                    <span className={`music-bar-text ${isRefrain ? 'refrain' : ''}`}>
                      {slideText}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
          
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
