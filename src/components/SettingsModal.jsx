import { useState, useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';

/**
 * Modal de Configurações do Sistema
 * Permite ajustar o tamanho da tela para cálculo automático de fontes
 * OU ajustar manualmente os tamanhos de fonte
 */
export default function SettingsModal({ isOpen, onClose }) {
  const {
    tamanhoTela,
    fonteVersiculo,
    fonteHino,
    charsPorSlide,
    modoFonteManual,
    setTamanhoTela,
    setModoFonteManual,
    setFonteHino,
    setFonteVersiculo,
    calculateValues
  } = useSettingsStore();

  const [inputValue, setInputValue] = useState(tamanhoTela);
  const [preview, setPreview] = useState({ fonteVersiculo, fonteHino, charsPorSlide });
  const [fonteHinoLocal, setFonteHinoLocal] = useState(fonteHino);
  const [fonteVersiculoLocal, setFonteVersiculoLocal] = useState(fonteVersiculo);

  useEffect(() => {
    setInputValue(tamanhoTela);
    setPreview({ fonteVersiculo, fonteHino, charsPorSlide });
    setFonteHinoLocal(fonteHino);
    setFonteVersiculoLocal(fonteVersiculo);
  }, [tamanhoTela, fonteVersiculo, fonteHino, charsPorSlide]);

  // Atualizar preview em tempo real (modo automático)
  const handleInputChange = (value) => {
    const num = parseInt(value) || 0;
    setInputValue(num);
    if (num >= 10 && num <= 300 && !modoFonteManual) {
      setPreview(calculateValues(num));
    }
  };

  // Salvar configuração
  const handleSave = async () => {
    if (modoFonteManual) {
      // Modo manual: salvar fontes personalizadas
      await setFonteHino(fonteHinoLocal);
      await setFonteVersiculo(fonteVersiculoLocal);
    } else {
      // Modo automático: salvar tamanho da tela
      if (inputValue >= 10 && inputValue <= 300) {
        await setTamanhoTela(inputValue);
      }
    }
    onClose();
  };

  // Toggle modo manual
  const handleModoToggle = async (manual) => {
    await setModoFonteManual(manual);
    if (!manual) {
      // Recalcular preview quando voltar para automático
      setPreview(calculateValues(inputValue));
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 sticky top-0">
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
            Ajuste o tamanho da tela ou personalize as fontes manualmente
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Toggle Modo Automático/Manual */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Modo de Configuração</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {modoFonteManual ? 'Ajuste manual das fontes' : 'Calculado pelo tamanho da tela'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleModoToggle(false)}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${!modoFonteManual
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  🔄 Auto
                </button>
                <button
                  onClick={() => handleModoToggle(true)}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${modoFonteManual
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  ✏️ Manual
                </button>
              </div>
            </div>
          </div>

          {/* Seção: Tamanho da Tela (visível apenas em modo automático) */}
          {!modoFonteManual && (
            <>
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
                      className={`px-3 py-2 text-sm rounded-lg transition-all ${inputValue === preset.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Seção: Ajuste Manual de Fontes */}
          {modoFonteManual && (
            <div className="space-y-5">
              {/* Slider: Fonte do Hino */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    🎵 Fonte do Hino
                  </label>
                  <span className="text-lg font-bold text-purple-600">{fonteHinoLocal}px</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="150"
                  value={fonteHinoLocal}
                  onChange={(e) => setFonteHinoLocal(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>30px (pequeno)</span>
                  <span>150px (grande)</span>
                </div>
              </div>

              {/* Slider: Fonte do Versículo */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    📖 Fonte do Versículo
                  </label>
                  <span className="text-lg font-bold text-blue-600">{fonteVersiculoLocal}px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={fonteVersiculoLocal}
                  onChange={(e) => setFonteVersiculoLocal(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>40px (pequeno)</span>
                  <span>200px (grande)</span>
                </div>
              </div>

              {/* Preview Visual */}
              <div className="bg-gray-900 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-xs mb-3">Preview</p>
                <p
                  className="text-white mb-2 transition-all"
                  style={{ fontSize: `${fonteHinoLocal * 0.3}px` }}
                >
                  🎵 Texto do Hino
                </p>
                <p
                  className="text-blue-300 transition-all"
                  style={{ fontSize: `${fonteVersiculoLocal * 0.3}px` }}
                >
                  📖 Texto do Versículo
                </p>
              </div>
            </div>
          )}

          {/* Preview dos valores calculados (modo automático) */}
          {!modoFonteManual && (
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
          )}

          {/* Fórmula explicativa (modo automático) */}
          {!modoFonteManual && (
            <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
              <strong>Fórmula:</strong><br />
              • Fonte Versículo = (tamanho × 1.2) + 20<br />
              • Fonte Hino = (tamanho × 0.9) + 15<br />
              • Chars/Slide = 250 - (tamanho × 1.5)
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!modoFonteManual && (inputValue < 10 || inputValue > 300)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

