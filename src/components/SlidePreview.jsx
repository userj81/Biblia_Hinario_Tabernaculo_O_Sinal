import { useProjectionStore } from '../stores/projectionStore';

export default function SlidePreview({ compact = false }) {
  const { currentSlide, isBlackout } = useProjectionStore();

  const getPreviewText = () => {
    if (isBlackout) return 'Tela apagada';
    
    if (currentSlide.slides && currentSlide.slides.length > 0) {
      const slideIndex = currentSlide.currentSlideIndex || 0;
      const slide = currentSlide.slides[slideIndex];
      
      if (slide && typeof slide === 'object' && !Array.isArray(slide)) {
        if ('text' in slide) {
          return String(slide.text || '');
        }
        if ('id' in slide && 'hinario_id' in slide) {
          return 'Nenhum slide selecionado';
        }
        return String(slide);
      }
      
      if (typeof slide === 'string') {
        return slide;
      }
      
      return 'Nenhum slide selecionado';
    }
    
    const text = currentSlide.text;
    if (typeof text === 'string') {
      return text;
    }
    if (text && typeof text === 'object' && 'text' in text) {
      return String(text.text || '');
    }
    
    return 'Nenhum slide selecionado';
  };

  const previewText = getPreviewText();
  const totalSlides = currentSlide.totalSlides || 0;
  const currentIndex = (currentSlide.currentSlideIndex || 0) + 1;
  const isHino = currentSlide.type === 'hino';
  const isVerse = currentSlide.type === 'verse';
  const isAnuncio = currentSlide.type === 'anuncio';

  // Modo compacto para mobile
  if (compact) {
    return (
      <div className={`rounded-lg overflow-hidden h-full flex flex-col ${
        isHino ? 'bg-gray-900' : isAnuncio ? 'bg-green-800' : 'bg-blue-900'
      }`}>
        <div className="flex-1 flex items-center justify-center p-2">
          <div className={`text-center text-xs ${isHino ? 'text-white' : 'text-white'}`}>
            {previewText && typeof previewText === 'string' ? (
              <div className="line-clamp-3">{previewText}</div>
            ) : (
              <span className="text-white/50">Sem conteúdo</span>
            )}
          </div>
        </div>
        {totalSlides > 0 && (
          <div className="bg-black/20 px-2 py-1 text-center">
            <span className="text-white/80 text-xs">{currentIndex}/{totalSlides}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      {/* Preview Header */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
        <span className="text-xs font-medium text-gray-500">
          {isHino ? '🎵 Hino' : isAnuncio ? '📢 Anúncio' : '📖 Bíblia'}
        </span>
        {totalSlides > 0 && (
          <span className="text-xs text-gray-400">
            {currentIndex} / {totalSlides}
          </span>
        )}
      </div>
      
      {/* Preview Content */}
      <div 
        className={`p-4 min-h-[180px] flex flex-col justify-center ${
          isHino ? 'bg-gray-900' : isAnuncio ? 'bg-green-900' : 'bg-blue-50'
        }`}
      >
        <div className={`text-center ${isHino || isAnuncio ? 'text-white' : 'text-gray-800'}`}>
          {previewText && typeof previewText === 'string' ? (
            previewText.split('\n').slice(0, 5).map((line, index) => {
              const isRefrainLine = line.trim().startsWith('*');
              const displayLine = isRefrainLine ? line.replace(/^\*+/, '').trim() : line.trim();
              
              if (!displayLine) return null;
              
              return (
                <div
                  key={index}
                  className={`text-xs leading-relaxed ${
                    isRefrainLine ? 'text-amber-400 font-medium italic' : ''
                  }`}
                >
                  {displayLine}
                </div>
              );
            })
          ) : (
            <span className="text-xs text-gray-400">{String(previewText || 'Selecione um conteúdo')}</span>
          )}
          {previewText && previewText.split('\n').length > 5 && (
            <div className="text-xs text-gray-400 mt-2">...</div>
          )}
        </div>
      </div>
      
      {/* Music Bar (only for hymns) */}
      {isHino && currentSlide.metadata?.hino && (
        <div className="h-8 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center">
          <div className="text-white text-xs font-medium truncate px-4">
            {currentSlide.metadata.numero && `${currentSlide.metadata.numero}. `}
            {currentSlide.metadata.hino}
          </div>
        </div>
      )}
      
      {/* Announcement info */}
      {isAnuncio && currentSlide.metadata?.nome && (
        <div className="h-8 bg-green-700 flex items-center justify-center">
          <div className="text-white text-xs font-medium truncate px-4">
            {currentSlide.metadata.titulo && `${currentSlide.metadata.titulo} `}
            {currentSlide.metadata.nome}
          </div>
        </div>
      )}
    </div>
  );
}
