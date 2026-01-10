import { useState, useEffect } from 'react';
import { api } from '../services/api';

/**
 * Editor de Hinos
 * Permite criar/editar hinos em um hinário
 * 
 * Formato do texto:
 * - Cada linha = 1 slide
 * - Linhas começando com * = refrão (aparecem em dourado)
 */
export default function HymnEditor({ hymn, hinarios, onClose, onSave }) {
  const [hinarioId, setHinarioId] = useState(hymn?.hinario_id || '');
  const [numero, setNumero] = useState(hymn?.numero || '');
  const [nome, setNome] = useState(hymn?.nome || '');
  const [texto, setTexto] = useState(hymn?.texto || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hymn) {
      setHinarioId(hymn.hinario_id);
      setNumero(hymn.numero);
      setNome(hymn.nome);
      setTexto(hymn.texto || '');
    }
  }, [hymn]);

  // Salvar hino
  const handleSave = async () => {
    // Validações
    if (!hinarioId) {
      setError('Selecione um hinário');
      return;
    }
    if (!nome.trim()) {
      setError('Digite o nome do hino');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      const data = {
        hinario_id: parseInt(hinarioId),
        numero: parseInt(numero) || 0,
        nome: nome.trim(),
        texto: texto.trim(),
      };

      if (hymn?.id) {
        await api.updateHino(hymn.id, data);
      } else {
        await api.createHino(data);
      }
      
      onSave?.();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar hino:', error);
      setError('Erro ao salvar hino');
    } finally {
      setSaving(false);
    }
  };

  // Contar slides
  const slideCount = texto.split('\n').filter(line => line.trim()).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              🎵 {hymn ? 'Editar Hino' : 'Novo Hino'}
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Erro */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Hinário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hinário *
            </label>
            <select
              value={hinarioId}
              onChange={(e) => setHinarioId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um hinário...</option>
              {hinarios.filter(h => h.id !== 0).map(h => (
                <option key={h.id} value={h.id}>{h.nome}</option>
              ))}
            </select>
          </div>

          {/* Número e Nome */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número
              </label>
              <input
                type="number"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Hino *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Castelo Forte"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Letra */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Letra do Hino
              </label>
              <span className="text-xs text-gray-500">
                {slideCount} slide{slideCount !== 1 ? 's' : ''}
              </span>
            </div>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={`Digite a letra do hino...

Cada linha será um slide separado.
Linhas começando com * são refrão.

Exemplo:
Castelo forte é nosso Deus
Espada e bom escudo
*Com força nos defende Deus
*Em todo transe agudo`}
              rows={12}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
            />
          </div>

          {/* Dicas */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
            <h4 className="font-medium text-gray-700 mb-2">💡 Dicas de formatação:</h4>
            <ul className="space-y-1 text-xs">
              <li>• <strong>Cada linha</strong> = 1 slide na projeção</li>
              <li>• <strong>Linha com *</strong> = Refrão (aparece em dourado)</li>
              <li>• <strong>Linhas vazias</strong> são ignoradas</li>
            </ul>
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
            disabled={saving}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : 'Salvar Hino'}
          </button>
        </div>
      </div>
    </div>
  );
}

