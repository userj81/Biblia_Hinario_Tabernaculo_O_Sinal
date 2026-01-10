import { useState, useEffect } from 'react';
import { api } from '../services/api';

/**
 * Editor de Leituras Salvas
 * Permite criar/editar sequências de versículos de diferentes livros
 */
export default function ReadingEditor({ reading, onClose }) {
  const [nome, setNome] = useState('');
  const [versiculos, setVersiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estado para adicionar novo versículo
  const [livros, setLivros] = useState([]);
  const [selectedLivro, setSelectedLivro] = useState(null);
  const [capitulos, setCapitulos] = useState([]);
  const [selectedCapitulo, setSelectedCapitulo] = useState(null);
  const [versiculoInicio, setVersiculoInicio] = useState(1);
  const [versiculoFim, setVersiculoFim] = useState(1);
  const [maxVersiculo, setMaxVersiculo] = useState(1);

  // Carregar dados ao editar
  useEffect(() => {
    if (reading) {
      setNome(reading.nome);
      setVersiculos(reading.versiculos || []);
    }
  }, [reading]);

  // Carregar livros
  useEffect(() => {
    const loadLivros = async () => {
      try {
        const response = await api.getLivros();
        if (response.success) {
          setLivros(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
      }
    };
    loadLivros();
  }, []);

  // Carregar capítulos quando selecionar livro
  useEffect(() => {
    if (!selectedLivro) {
      setCapitulos([]);
      setSelectedCapitulo(null);
      return;
    }
    
    const loadCapitulos = async () => {
      try {
        const response = await api.getCapitulos(selectedLivro.id);
        if (response.success) {
          setCapitulos(response.data.map(c => c.capitulo));
          setSelectedCapitulo(null);
        }
      } catch (error) {
        console.error('Erro ao carregar capítulos:', error);
      }
    };
    loadCapitulos();
  }, [selectedLivro]);

  // Carregar quantidade de versículos quando selecionar capítulo
  useEffect(() => {
    if (!selectedLivro || !selectedCapitulo) {
      setMaxVersiculo(1);
      return;
    }
    
    const loadVersiculos = async () => {
      try {
        const response = await api.getVersiculos(selectedLivro.id, selectedCapitulo);
        if (response.success && response.data.length > 0) {
          const max = Math.max(...response.data.map(v => v.versiculo));
          setMaxVersiculo(max);
          setVersiculoInicio(1);
          setVersiculoFim(1);
        }
      } catch (error) {
        console.error('Erro ao carregar versículos:', error);
      }
    };
    loadVersiculos();
  }, [selectedLivro, selectedCapitulo]);

  // Adicionar versículo à lista
  const handleAddVersiculo = () => {
    if (!selectedLivro || !selectedCapitulo) return;
    
    const novoVersiculo = {
      livro_id: selectedLivro.id,
      livro_nome: selectedLivro.livros,
      capitulo: selectedCapitulo,
      versiculo_inicio: versiculoInicio,
      versiculo_fim: versiculoFim,
    };
    
    setVersiculos([...versiculos, novoVersiculo]);
    
    // Limpar seleção
    setSelectedLivro(null);
    setSelectedCapitulo(null);
    setVersiculoInicio(1);
    setVersiculoFim(1);
  };

  // Remover versículo da lista
  const handleRemoveVersiculo = (index) => {
    setVersiculos(versiculos.filter((_, i) => i !== index));
  };

  // Mover versículo para cima
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newList = [...versiculos];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setVersiculos(newList);
  };

  // Mover versículo para baixo
  const handleMoveDown = (index) => {
    if (index === versiculos.length - 1) return;
    const newList = [...versiculos];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setVersiculos(newList);
  };

  // Salvar leitura
  const handleSave = async () => {
    if (!nome.trim()) {
      alert('Digite um nome para a leitura');
      return;
    }
    if (versiculos.length === 0) {
      alert('Adicione pelo menos um versículo');
      return;
    }

    setSaving(true);
    try {
      const data = { nome: nome.trim(), versiculos };
      
      if (reading?.id) {
        await api.updateLeitura(reading.id, data);
      } else {
        await api.createLeitura(data);
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar leitura:', error);
      alert('Erro ao salvar leitura');
    } finally {
      setSaving(false);
    }
  };

  // Formatação de referência
  const formatRef = (v) => {
    if (v.versiculo_inicio === v.versiculo_fim) {
      return `${v.livro_nome} ${v.capitulo}:${v.versiculo_inicio}`;
    }
    return `${v.livro_nome} ${v.capitulo}:${v.versiculo_inicio}-${v.versiculo_fim}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              📌 {reading ? 'Editar Leitura' : 'Nova Leitura'}
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Nome da leitura */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Leitura
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Leitura Dominical, Culto de Quarta..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Lista de versículos adicionados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Versículos Selecionados ({versiculos.length})
            </label>
            
            {versiculos.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-400 text-sm">
                Nenhum versículo adicionado ainda
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl overflow-hidden divide-y divide-gray-200">
                {versiculos.map((v, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 font-medium">
                        {formatRef(v)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === versiculos.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleRemoveVersiculo(index)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Adicionar versículo */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Versículo
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Livro */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Livro</label>
                <select
                  value={selectedLivro?.id || ''}
                  onChange={(e) => {
                    const livro = livros.find(l => l.id === parseInt(e.target.value));
                    setSelectedLivro(livro || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  {livros.map(livro => (
                    <option key={livro.id} value={livro.id}>
                      {livro.livros}
                    </option>
                  ))}
                </select>
              </div>

              {/* Capítulo */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Capítulo</label>
                <select
                  value={selectedCapitulo || ''}
                  onChange={(e) => setSelectedCapitulo(parseInt(e.target.value) || null)}
                  disabled={!selectedLivro}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Selecione...</option>
                  {capitulos.map(cap => (
                    <option key={cap} value={cap}>{cap}</option>
                  ))}
                </select>
              </div>

              {/* Versículo início */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">De (versículo)</label>
                <input
                  type="number"
                  min="1"
                  max={maxVersiculo}
                  value={versiculoInicio}
                  onChange={(e) => {
                    const v = Math.max(1, Math.min(maxVersiculo, parseInt(e.target.value) || 1));
                    setVersiculoInicio(v);
                    if (v > versiculoFim) setVersiculoFim(v);
                  }}
                  disabled={!selectedCapitulo}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              {/* Versículo fim */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Até (versículo)</label>
                <input
                  type="number"
                  min={versiculoInicio}
                  max={maxVersiculo}
                  value={versiculoFim}
                  onChange={(e) => {
                    const v = Math.max(versiculoInicio, Math.min(maxVersiculo, parseInt(e.target.value) || versiculoInicio));
                    setVersiculoFim(v);
                  }}
                  disabled={!selectedCapitulo}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <button
              onClick={handleAddVersiculo}
              disabled={!selectedLivro || !selectedCapitulo}
              className="mt-3 w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
              Adicionar à Lista
            </button>
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
            disabled={saving || !nome.trim() || versiculos.length === 0}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : 'Salvar Leitura'}
          </button>
        </div>
      </div>
    </div>
  );
}

