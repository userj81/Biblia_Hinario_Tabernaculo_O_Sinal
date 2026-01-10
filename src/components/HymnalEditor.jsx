import { useState, useEffect } from 'react';
import { api } from '../services/api';

/**
 * Editor de Hinários
 * Permite criar/editar hinários
 */
export default function HymnalEditor({ hymnal, onClose, onSave }) {
  const [nome, setNome] = useState(hymnal?.nome || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hymnal) {
      setNome(hymnal.nome);
    }
  }, [hymnal]);

  // Salvar hinário
  const handleSave = async () => {
    if (!nome.trim()) {
      setError('Digite o nome do hinário');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      const data = {
        nome: nome.trim(),
        type: 1,
      };

      if (hymnal?.id) {
        await api.updateHinario(hymnal.id, data);
      } else {
        await api.createHinario(data);
      }
      
      onSave?.();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar hinário:', error);
      setError('Erro ao salvar hinário');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              📚 {hymnal ? 'Editar Hinário' : 'Novo Hinário'}
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
        <div className="p-6 space-y-4">
          {/* Erro */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Hinário *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Harpa Cristã, Cantor Cristão..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Info */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
            <p className="text-xs">
              💡 Após criar o hinário, você poderá adicionar hinos a ele.
            </p>
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
            disabled={saving || !nome.trim()}
            className="px-6 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : 'Salvar Hinário'}
          </button>
        </div>
      </div>
    </div>
  );
}

