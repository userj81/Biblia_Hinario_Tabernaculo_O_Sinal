import { useProjectionStore } from '../../stores/projectionStore';
import { socketHelpers } from '../../services/socket';

export default function ControlBar({ mobile = false }) {
  const { currentSlide, prevSlide, nextSlide } = useProjectionStore();
  const totalSlides = currentSlide.totalSlides || 0;
  const currentIndex = currentSlide.currentSlideIndex || 0;

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      prevSlide();
      socketHelpers.changeSlide('prev', newIndex, totalSlides);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalSlides - 1) {
      const newIndex = currentIndex + 1;
      nextSlide();
      socketHelpers.changeSlide('next', newIndex, totalSlides);
    }
  };

  // Versão Mobile - Compacta e flutuante
  if (mobile) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg px-3 py-2">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-3 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="px-4 py-2 bg-gray-100 rounded-xl min-w-[70px] text-center">
            <span className="text-sm font-bold text-gray-700">
              {totalSlides > 0 ? `${currentIndex + 1}/${totalSlides}` : '—'}
            </span>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex >= totalSlides - 1}
            className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-xl text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
