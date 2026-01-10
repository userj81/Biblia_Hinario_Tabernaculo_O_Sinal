import { useState, useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';

/**
 * Modal de Configurações do Sistema
 * Permite ajustar o tamanho da tela para cálculo automático de fontes
 */
export default function SettingsModal({ isOpen, onClose }) {
  const { 
    tamanhoTela, 
    fonteVersiculo, 
    fonteHino, 
    charsPorSlide,
    setTamanhoTela,
    calculateValues 
  } = useSettingsStore();
  
  const [inputValue, setInputValue] = useState(tamanhoTela);
  const [preview, setPreview] = useState({ fonteVersiculo, fonteHino, charsPorSlide });
  
  useEffect(() => {
    setInputValue(tamanhoTela);
    setPreview({ fonteVersiculo, fonteHino, charsPorSlide });
  }, [tamanhoTela, fonteVersiculo, fonteHino, charsPorSlide]);
  
  // Atualizar preview em tempo real
  const handleInputChange = (value) => {
    const num = parseInt(value) || 0;
    setInputValue(num);
    if (num >= 10 && num <= 300) {
      setPreview(calculateValues(num));
    }
  };
  
  // Salvar configuração
  const handleSave = async () => {
    if (inputValue >= 10 && inputValue <= 300) {
      await setTamanhoTela(inputValue);
      onClose();
    }
  };
  
  // Presets rápidos
  const presets = [
    { label: 'Monitor 24"', value: 24 },
    { label: 'Monitor 32"', value: 32 },
    { label: 'TV 43"', value: 43 },
    { label: 'TV 55"', value: 55 },
    { label: 'TV 65"', value: 65 },
    { label: 'TV 75"', value: 75 },
    { label: 'TV 85"', value: 85 },
  ];
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              ⚙️ Configurações de Tela
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Ajuste o tamanho da tela de projeção para otimizar a legibilidade
          </p>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Input de tamanho */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho da Tela (polegadas)
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                min="10"
                max="300"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium text-center"
              />
              <span className="flex items-center text-gray-500 text-lg">pol.</span>
            </div>
            {(inputValue < 10 || inputValue > 300) && (
              <p className="text-red-500 text-sm mt-1">
                O valor deve estar entre 10 e 300 polegadas
              </p>
            )}
          </div>
          
          {/* Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Presets Rápidos
            </label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleInputChange(preset.value)}
                  className={`px-3 py-2 text-sm rounded-lg transition-all ${
                    inputValue === preset.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Preview dos valores calculados */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              📊 Valores Calculados
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {preview.fonteVersiculo}px
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Fonte Versículo
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {preview.fonteHino}px
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Fonte Hino
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {preview.charsPorSlide}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Chars/Slide
                </div>
              </div>
            </div>
          </div>
          
          {/* Fórmula explicativa */}
          <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
            <strong>Fórmula:</strong><br />
            • Fonte Versículo = (tamanho × 1.2) + 20<br />
            • Fonte Hino = (tamanho × 0.9) + 15<br />
            • Chars/Slide = 250 - (tamanho × 1.5)
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={inputValue < 10 || inputValue > 300}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

