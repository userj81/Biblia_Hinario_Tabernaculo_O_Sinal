import { useProjectionStore } from '../../stores/projectionStore';
import { socketHelpers } from '../../services/socket';
import { useEffect } from 'react';

export default function ControlBar({ mobile = false }) {
  const { currentSlide, prevSlide, nextSlide } = useProjectionStore();
  const totalSlides = currentSlide.totalSlides || 0;
  const currentIndex = currentSlide.currentSlideIndex || 0;

  // Feedback haptic (vibração)
  const vibrate = (duration = 10) => {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      vibrate(10);
      const newIndex = currentIndex - 1;
      prevSlide();
      socketHelpers.changeSlide('prev', newIndex, totalSlides);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalSlides - 1) {
      vibrate(10);
      const newIndex = currentIndex + 1;
      nextSlide();
      socketHelpers.changeSlide('next', newIndex, totalSlides);
    }
  };

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignorar se estiver digitando em input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        handlePrev();
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, totalSlides]);

  // Versão Mobile - NOVA: Botões maiores e touch-friendly
  if (mobile) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-300 rounded-3xl shadow-xl px-4 py-3">
        <div className="flex items-center justify-center gap-3">
          {/* Botão Anterior - MAIOR com gradiente azul */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="
              flex items-center justify-center
              w-[70px] h-[60px]
              sm:w-[90px] sm:h-[80px]
              bg-gradient-to-br from-blue-500 to-blue-600
              hover:from-blue-600 hover:to-blue-700
              active:scale-95
              disabled:from-gray-300 disabled:to-gray-400
              disabled:cursor-not-allowed
              rounded-2xl
              text-white
              transition-all duration-200
              shadow-lg
              touch-manipulation
            "
            aria-label="Slide anterior"
          >
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Indicador - MAIOR */}
          <div className="
            flex items-center justify-center
            px-5 py-3
            sm:px-6 sm:py-4
            min-w-[100px]
            sm:min-w-[120px]
            bg-gradient-to-br from-gray-50 to-gray-100
            border-2 border-gray-200
            rounded-2xl
            shadow-inner
          ">
            <span className="text-xl sm:text-2xl font-bold text-gray-800">
              {totalSlides > 0 ? `${currentIndex + 1}/${totalSlides}` : '—'}
            </span>
          </div>

          {/* Botão Próximo - MAIOR com gradiente verde */}
          <button
            onClick={handleNext}
            disabled={currentIndex >= totalSlides - 1}
            className="
              flex items-center justify-center
              w-[70px] h-[60px]
              sm:w-[90px] sm:h-[80px]
              bg-gradient-to-br from-green-500 to-green-600
              hover:from-green-600 hover:to-green-700
              active:scale-95
              disabled:from-gray-300 disabled:to-gray-400
              disabled:cursor-not-allowed
              rounded-2xl
              text-white
              transition-all duration-200
              shadow-lg
              touch-manipulation
            "
            aria-label="Próximo slide"
          >
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Versão Desktop - Completa
  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-center gap-3">
        {/* Botão Anterior */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed rounded-lg text-gray-700 text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>

        {/* Indicador de Slide */}
        <div className="px-4 py-2 bg-gray-100 rounded-lg min-w-[80px] text-center">
          <span className="text-sm font-medium text-gray-700">
            {totalSlides > 0 ? `${currentIndex + 1} / ${totalSlides}` : '—'}
          </span>
        </div>

        {/* Botão Próximo */}
        <button
          onClick={handleNext}
          disabled={currentIndex >= totalSlides - 1}
          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
        >
          Próximo
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
