import { useEffect, useState } from 'react';
import { useProjectionStore } from '../../stores/projectionStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { getSocket } from '../../services/socket';
import './styles.css';

/**
 * Versão PÚBLICA do projetor - Somente visualização
 * 
 * HINOS: 
 * - Fundo preto vazio na parte superior
 * - Cada LINHA = 1 slide
 * - Texto ESTÁTICO na barra musical inferior (muda ao pressionar seta)
 * - Refrões (linhas com *) aparecem em dourado
 * 
 * BÍBLIA: 
 * - Cada versículo é um slide separado
 * - Fundo azul com fonte grande
 */
export default function Projector() {
  const { currentSlide, isBlackout, setSlide, setBlackout } = useProjectionStore();
  const { fonteVersiculo, fonteHino, loadSettings } = useSettingsStore();
  const [showHelp, setShowHelp] = useState(true);
  
  // Carregar configurações ao montar
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Esconder ajuda após alguns segundos ou quando houver conteúdo
  useEffect(() => {
    if (currentSlide.text || (currentSlide.slides && currentSlide.slides.length > 0)) {
      const timer = setTimeout(() => setShowHelp(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  // Entrar em fullscreen automaticamente quando receber conteúdo
  useEffect(() => {
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
  }, [currentSlide]);

  useEffect(() => {
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
  }, [setSlide, setBlackout]);

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
        if ('id' in slide && 'hinario_id' in slide) {
          return { text: '', isRefrain: false, versiculo: null, parte: null };
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
    if (text && typeof text === 'object' && 'text' in text) {
      return { text: String(text.text || ''), isRefrain: text.isRefrain || false, versiculo: null, parte: null };
    }
    
    return { text: '', isRefrain: false, versiculo: null, parte: null };
  };

  const { text: slideText, isRefrain, versiculo: slideVersiculo, parte: slideParte } = getCurrentSlideData();
  
  // Determinar o tipo de conteúdo
  const slideType = currentSlide.type || 'default';
  const isHino = slideType === 'hino';
  const isVerse = slideType === 'verse';
  const isAnuncio = slideType === 'anuncio';
  
  // CSS class baseada no tipo
  const containerClass = `projector-container ${
    isHino ? 'projector-hino' : 
    isVerse ? 'projector-verse' : 
    isAnuncio ? 'projector-anuncio' :
    'projector-default'
  }`;

  // Metadados do hino
  const hinoNumero = currentSlide.metadata?.numero || '';
  const hinoNome = currentSlide.metadata?.hino || '';
  const hasHinoContent = isHino && slideText;
  
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
              {/* Conteúdo central - NÃO aparece para hinos (CSS esconde) */}
              <div className="slide-content">
                {slideText && !isHino ? (
                  <>
                    {/* Para Bíblia: mostrar número do versículo + texto */}
                    {isVerse ? (
                      <div className="slide-line">
                        <span className="verse-number">
                          {slideVersiculo || currentSlide.metadata?.versiculo || 1}
                        </span>
                        {slideText}
                      </div>
                    ) : (
                      slideText.split('\n').map((line, index) => {
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
                      })
                    )}
                    
                    {/* Referência do versículo (apenas para Bíblia) */}
                    {isVerse && currentSlide.metadata?.livro && (
                      <div className="verse-reference">
                        📖 {currentSlide.metadata.livro} {currentSlide.metadata.capitulo}:{slideVersiculo || currentSlide.metadata?.versiculo || 1}
                        {/* Indicador de parte se versículo dividido */}
                        {slideParte && <span className="verse-part"> ({slideParte})</span>}
                      </div>
                    )}
                  </>
                ) : !isHino && (
                  <div className="empty-slide">
                    <div className="empty-message">Aguardando conteúdo...</div>
                    {showHelp && (
                      <div className="help-message">
                        🔒 Modo Visualização
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Barra Musical com TEXTO DO HINO ESTÁTICO (apenas para Hinos) */}
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
