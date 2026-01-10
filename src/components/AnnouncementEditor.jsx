import { useState, useEffect } from 'react';
import { api } from '../services/api';

/**
 * Editor de Anúncios de Leitura
 * Permite criar anúncios com:
 * - Nome da pessoa
 * - Título (Pastor, Evangelista, Missionário, Diácono, Irmão, ou personalizado)
 * - Múltiplos versículos de diferentes livros
 */

// Títulos predefinidos
const TITULOS_PREDEFINIDOS = [
  'Pastor',
  'Evangelista',
  'Missionário',
  'Diácono',
  'Irmão',
];

export default function AnnouncementEditor({ announcement, onClose }) {
  const [nome, setNome] = useState('');
  const [titulo, setTitulo] = useState('');
  const [tituloPersonalizado, setTituloPersonalizado] = useState(false);
  const [versiculos, setVersiculos] = useState([]);
  const [saving, setSaving] = useState(false);

  // Estados de loading
  const [loadingLivros, setLoadingLivros] = useState(false);
  const [loadingCapitulos, setLoadingCapitulos] = useState(false);
  const [loadingVersiculos, setLoadingVersiculos] = useState(false);

  // Estado de erro
  const [error, setError] = useState('');
  
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
    if (announcement) {
      setNome(announcement.nome);
      setTitulo(announcement.titulo || '');
      setVersiculos(announcement.versiculos || []);
      
      // Verificar se é título personalizado
      if (announcement.titulo && !TITULOS_PREDEFINIDOS.includes(announcement.titulo)) {
        setTituloPersonalizado(true);
      } else {
        setTituloPersonalizado(false);
      }
    } else {
      // Limpar campos ao criar novo anúncio
      setNome('');
      setTitulo('');
      setTituloPersonalizado(false);
      setVersiculos([]);
      setSelectedLivro(null);
      setSelectedCapitulo(null);
      setVersiculoInicio(1);
      setVersiculoFim(1);
    }
  }, [announcement]);

  // Carregar livros
  useEffect(() => {
    const loadLivros = async () => {
      setLoadingLivros(true);
      try {
        const response = await api.getLivros();
        if (response.success) {
          setLivros(response.data || []);
        }
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
        setLivros([]); // Fallback para array vazio
      } finally {
        setLoadingLivros(false);
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
      setLoadingCapitulos(true);
      try {
        const response = await api.getCapitulos(selectedLivro.id);
        if (response.success && response.data) {
          // A API retorna { data: { capitulos: [...], livro: {...}, totalCapitulos: ... } }
          const capitulosArray = response.data.capitulos || [];
          setCapitulos(capitulosArray);
          setSelectedCapitulo(null);
        }
      } catch (error) {
        console.error('Erro ao carregar capítulos:', error);
        setCapitulos([]); // Fallback para array vazio
      } finally {
        setLoadingCapitulos(false);
      }
    };
    loadCapitulos();
  }, [selectedLivro?.id]);

  // Carregar quantidade de versículos quando selecionar capítulo
  useEffect(() => {
    if (!selectedLivro || !selectedCapitulo) {
      setMaxVersiculo(1);
      return;
    }

    const loadVersiculos = async () => {
      setLoadingVersiculos(true);
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
        setMaxVersiculo(1); // Fallback para valor padrão
      } finally {
        setLoadingVersiculos(false);
      }
    };
    loadVersiculos();
  }, [selectedLivro, selectedCapitulo]);

  // Adicionar versículo à lista
  const handleAddVersiculo = () => {
    if (!selectedLivro || !selectedCapitulo) return;
    
    // Verificar se o livro tem a propriedade livros (fallback para robustez)
    if (!selectedLivro.livros && !selectedLivro.nome) {
      console.error('Livro selecionado não tem propriedades válidas:', selectedLivro);
      setError('Livro selecionado inválido. Selecione novamente.');
      return;
    }
    
    const novoVersiculo = {
      livro_id: selectedLivro.id,
      livro_nome: selectedLivro.livros || selectedLivro.nome || `Livro ${selectedLivro.id}`,
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

  // Salvar anúncio
  const handleSave = async () => {
    // Limpar erro anterior
    setError('');

    // Validações mais específicas
    if (!nome.trim()) {
      setError('Nome da pessoa é obrigatório');
      return;
    }

    if (versiculos.length === 0) {
      setError('Adicione pelo menos um versículo');
      return;
    }

    // Verificar se versículos têm dados completos
    const versiculoInvalido = versiculos.find(v => !v.livro_id || !v.capitulo);
    if (versiculoInvalido) {
      setError('Um ou mais versículos estão incompletos');
      return;
    }

    setSaving(true);
    try {
      const data = {
        nome: nome.trim(),
        titulo: titulo.trim() || null,
        versiculos,
      };

      if (announcement?.id) {
        await api.updateAnuncio(announcement.id, data);
      } else {
        await api.createAnuncio(data);
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar anúncio:', error);
      setError('Erro ao salvar anúncio. Tente novamente.');
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
        <div className="bg-green-50 px-6 py-4 border-b border-green-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              📢 {announcement ? 'Editar Anúncio' : 'Novo Anúncio'}
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
          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Nome e Título */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Pessoa *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              {tituloPersonalizado ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Digite o título..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => {
                      setTituloPersonalizado(false);
                      setTitulo('');
                    }}
                    className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                    title="Usar lista"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Sem título</option>
                    {TITULOS_PREDEFINIDOS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setTituloPersonalizado(true)}
                    className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                    title="Digitar outro"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Lista de versículos adicionados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Versículos a serem lidos ({versiculos.length})
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
                      <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 font-medium">
                        {formatRef(v)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveVersiculo(index)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
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
                    const livroId = parseInt(e.target.value);
                    const livro = livros.find(l => l.id === livroId);
                    setSelectedLivro(livro || null);
                  }}
                  disabled={loadingLivros}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">
                    {loadingLivros ? 'Carregando livros...' : 'Selecione...'}
                  </option>
                  {livros.map(livro => (
                    <option key={livro.id} value={livro.id}>
                      {livro.livros || livro.nome || `Livro ${livro.id}`}
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
                  disabled={!selectedLivro || loadingCapitulos}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">
                    {!selectedLivro
                      ? 'Selecione um livro primeiro'
                      : loadingCapitulos
                        ? 'Carregando capítulos...'
                        : 'Selecione...'
                    }
                  </option>
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

          {/* Preview */}
          {(nome || versiculos.length > 0) && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Preview do Anúncio</h4>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  📖 LEITURA BÍBLICA
                </p>
                <div className="space-y-1 mb-3">
                  {versiculos.map((v, i) => (
                    <p key={i} className="text-gray-700 font-medium">
                      {formatRef(v)}
                    </p>
                  ))}
                </div>
                <p className="text-gray-600 font-medium">
                  {titulo ? `${titulo} ` : ''}{nome || 'Nome da pessoa'}
                </p>
              </div>
            </div>
          )}
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
            className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : 'Salvar Anúncio'}
          </button>
        </div>
      </div>
    </div>
  );
}

