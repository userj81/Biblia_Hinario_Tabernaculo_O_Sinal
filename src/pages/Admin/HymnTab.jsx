import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { socketHelpers } from '../../services/socket';
import { useProjectionStore } from '../../stores/projectionStore';
import SearchInput from '../../components/SearchInput';
import HymnEditor from '../../components/HymnEditor';
import HymnalEditor from '../../components/HymnalEditor';

export default function HymnTab() {
  const [hinarios, setHinarios] = useState([]);
  const [selectedHinario, setSelectedHinario] = useState(null);
  const [hinos, setHinos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setHino, currentSlide } = useProjectionStore();

  // Estados para modais de gestão
  const [showHymnEditor, setShowHymnEditor] = useState(false);
  const [showHymnalEditor, setShowHymnalEditor] = useState(false);
  const [editingHymn, setEditingHymn] = useState(null);
  const [editingHymnal, setEditingHymnal] = useState(null);

  // Novos estados para navegação em camadas
  const [showHinarioSheet, setShowHinarioSheet] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  useEffect(() => {
    loadHinarios();
  }, []);

  useEffect(() => {
    if (selectedHinario === 'all') {
      loadAllHinos();
    } else if (selectedHinario) {
      loadHinos(selectedHinario.id);
    }
  }, [selectedHinario]);

  const loadHinarios = async () => {
    try {
      const response = await api.getHinarios();
      setHinarios(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar hinários:', error);
    }
  };

  const loadHinos = async (hinarioId) => {
    setLoading(true);
    try {
      const response = await api.getHinos(hinarioId);
      setHinos(response.data || []);
      setSearchResults([]);
    } catch (error) {
      console.error('Erro ao carregar hinos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllHinos = async () => {
    setLoading(true);
    try {
      const response = await api.getHinos();
      setHinos(response.data || []);
      setSearchResults([]);
    } catch (error) {
      console.error('Erro ao carregar todos os hinos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const hinarioId = selectedHinario === 'all' ? null : selectedHinario?.id;
      const response = await api.searchHinos(query, hinarioId);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar hinos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHinoClick = async (hino) => {
    try {
      const response = await api.getHinoSlides(hino.id);
      const slides = response.data.slides || [];

      setHino(hino, slides);

      socketHelpers.showSlide({
        type: 'hino',
        slides: slides,
        currentSlide: 0,
        totalSlides: slides.length,
        metadata: {
          hino: hino.nome,
          numero: hino.numero,
        },
      });
    } catch (error) {
      console.error('Erro ao carregar slides do hino:', error);
    }
  };

  // Criar novo hino
  const handleNewHymn = () => {
    setEditingHymn(null);
    setShowHymnEditor(true);
  };

  // Editar hino
  const handleEditHymn = (e, hino) => {
    if (e) e.stopPropagation();
    setEditingHymn(hino);
    setShowHymnEditor(true);
  };

  // Excluir hino
  const handleDeleteHymn = async (e, hino) => {
    if (e) e.stopPropagation();
    if (!confirm(`Deseja excluir o hino "${hino.nome}"?`)) return;

    try {
      await api.deleteHino(hino.id);
      // Recarregar lista
      if (selectedHinario === 'all') {
        loadAllHinos();
      } else if (selectedHinario) {
        loadHinos(selectedHinario.id);
      }
    } catch (error) {
      console.error('Erro ao excluir hino:', error);
      alert('Erro ao excluir hino');
    }
  };

  // Criar novo hinário
  const handleNewHymnal = () => {
    setEditingHymnal(null);
    setShowHymnalEditor(true);
  };

  // Editar hinário
  const handleEditHymnal = (e, hinario) => {
    if (e) e.stopPropagation();
    setEditingHymnal(hinario);
    setShowHymnalEditor(true);
  };

  // Excluir hinário
  const handleDeleteHymnal = async (e, hinario) => {
    if (e) e.stopPropagation();
    if (!confirm(`Deseja excluir o hinário "${hinario.nome}"?`)) return;

    try {
      await api.deleteHinario(hinario.id);
      loadHinarios();
      if (selectedHinario?.id === hinario.id) {
        setSelectedHinario(null);
        setHinos([]);
      }
    } catch (error) {
      console.error('Erro ao excluir hinário:', error);
      alert(error.message || 'Erro ao excluir hinário');
    }
  };

  // Callback após salvar
  const handleSaved = () => {
    loadHinarios();
    if (selectedHinario === 'all') {
      loadAllHinos();
    } else if (selectedHinario) {
      loadHinos(selectedHinario.id);
    }
  };

  // Helper para detectar hino sendo projetado
  const isProjetando = (hino) => {
    return currentSlide.type === 'hino' &&
           currentSlide.metadata?.numero === hino.numero &&
           currentSlide.metadata?.hino === hino.nome;
  };

  const displayHinos = searchQuery.trim() ? searchResults : hinos;

  return (
    <div className="flex flex-col h-full">
      {/* SearchInput Sticky */}
      <div className="sticky top-0 z-30 bg-white px-4 py-3 border-b border-gray-100">
        <SearchInput
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Buscar hino por nome ou número..."
        />

        {searchQuery.trim() && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {displayHinos.length} resultado(s)
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="text-xs text-purple-500 hover:text-purple-700 flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpar busca
            </button>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Header Seletor */}
        <div className="flex gap-2 mb-4">
          {/* Botão Hinário */}
          <button
            onClick={() => setShowHinarioSheet(true)}
            className="flex-1 h-14 bg-purple-50 border-2 border-purple-200 rounded-xl
                       flex items-center justify-between px-4 active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span className="text-base font-semibold text-purple-900 truncate">
                {selectedHinario === 'all'
                  ? `Todos os Hinos (${hinos.length})`
                  : selectedHinario?.nome || 'Selecionar Hinário'
                }
              </span>
            </div>
            <svg className="w-5 h-5 text-purple-600 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Menu de Ações */}
          <div className="relative">
            <button
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              className="h-14 px-4 bg-purple-50 border-2 border-purple-200 rounded-xl
                         text-purple-900 font-semibold active:scale-98 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {/* Dropdown */}
            {showActionsMenu && (
              <>
                {/* Overlay para fechar menu */}
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowActionsMenu(false)}
                />

                <div className="absolute right-0 top-16 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-40 py-2">
                  <button
                    onClick={() => {
                      setShowActionsMenu(false);
                      handleNewHymn();
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <span className="text-sm text-gray-700">Novo Hino</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowActionsMenu(false);
                      handleNewHymnal();
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm text-gray-700">Novo Hinário</span>
                  </button>

                  {selectedHinario && selectedHinario !== 'all' && (
                    <>
                      <div className="border-t border-gray-100 my-1" />

                      <button
                        onClick={() => {
                          setShowActionsMenu(false);
                          handleEditHymnal(null, selectedHinario);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-yellow-50 flex items-center gap-3"
                      >
                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="text-sm text-gray-700">Editar Hinário</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowActionsMenu(false);
                          handleDeleteHymnal(null, selectedHinario);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="text-sm text-gray-700">Excluir Hinário</span>
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Lista de Hinos */}
        {selectedHinario ? (
          loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : displayHinos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <p className="text-sm">
                {searchQuery.trim() ? 'Nenhum resultado encontrado' : 'Nenhum hino encontrado'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayHinos.map((hino) => (
                <div
                  key={hino.id}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all relative
                    ${isProjetando(hino)
                      ? 'bg-purple-50 border-purple-400 border-l-4'
                      : 'bg-gray-50 border-gray-200 hover:bg-purple-50 hover:border-purple-200'}
                  `}
                >
                  {/* Indicador "No Ar" */}
                  {isProjetando(hino) && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2">
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full
                                        rounded-full bg-purple-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500" />
                      </span>
                    </div>
                  )}

                  {/* Header do Card */}
                  <div className="flex items-start gap-3 mb-3">
                    {/* Número do Hino */}
                    <span className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full
                                   flex items-center justify-center text-purple-700 font-bold text-base">
                      {hino.numero}
                    </span>

                    {/* Nome do Hino */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-gray-900 line-clamp-2 leading-relaxed">
                        {hino.nome}
                      </h4>
                      {hino.hinario_nome && selectedHinario === 'all' && (
                        <p className="text-xs text-gray-500 mt-1">
                          {hino.hinario_nome}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleHinoClick(hino)}
                      className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white
                                 rounded-lg font-medium text-sm flex items-center justify-center gap-2
                                 transition-colors active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Projetar
                    </button>

                    <button
                      onClick={(e) => handleEditHymn(e, hino)}
                      className="p-2.5 bg-white border-2 border-yellow-300 text-yellow-700
                                 hover:bg-yellow-50 rounded-lg transition-colors active:scale-95"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <button
                      onClick={(e) => handleDeleteHymn(e, hino)}
                      className="p-2.5 bg-white border-2 border-red-300 text-red-600
                                 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
                      title="Excluir"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <p className="text-sm">Selecione um hinário</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sheet - Seleção de Hinários */}
      {showHinarioSheet && (
        <div className="fixed inset-0 z-[60] flex items-end md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in-overlay"
            onClick={() => setShowHinarioSheet(false)}
          />

          {/* Sheet */}
          <div className="relative w-full bg-white rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up-sheet">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-3xl">
              <h3 className="text-lg font-bold text-gray-900">Selecionar Hinário</h3>
              <button
                onClick={() => setShowHinarioSheet(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Lista de Hinários */}
            <div className="flex-1 overflow-y-auto p-4 pb-20">
              <div className="space-y-2">
                {/* Opção "Todos" */}
                <button
                  onClick={() => {
                    setSelectedHinario('all');
                    setShowHinarioSheet(false);
                  }}
                  className={`
                    w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all
                    ${selectedHinario === 'all'
                      ? 'bg-purple-50 border-purple-400 border-l-4'
                      : 'bg-gray-50 border-gray-200 hover:bg-purple-50 hover:border-purple-200'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="text-base font-semibold text-purple-900">
                      Todos os Hinos
                    </span>
                  </div>
                  {selectedHinario === 'all' && (
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                {/* Hinários */}
                {hinarios.filter(h => h.id !== 0).map((hinario) => (
                  <div
                    key={hinario.id}
                    className={`
                      w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all
                      ${selectedHinario?.id === hinario.id
                        ? 'bg-purple-50 border-purple-400 border-l-4'
                        : 'bg-gray-50 border-gray-200 hover:bg-purple-50 hover:border-purple-200'}
                    `}
                  >
                    <button
                      onClick={() => {
                        setSelectedHinario(hinario);
                        setShowHinarioSheet(false);
                      }}
                      className="flex-1 text-left flex items-center gap-3"
                    >
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <span className="text-base font-semibold text-purple-900">
                        {hinario.nome}
                      </span>
                    </button>

                    {/* Ações inline (sempre visíveis em mobile) */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHinarioSheet(false);
                          handleEditHymnal(e, hinario);
                        }}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteHymnal(e, hinario);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rodapé - Novo Hinário */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={() => {
                  setShowHinarioSheet(false);
                  handleNewHymnal();
                }}
                className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl
                           font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Hinário
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editor de Hino */}
      {showHymnEditor && (
        <HymnEditor
          hymn={editingHymn}
          hinarios={hinarios}
          onClose={() => {
            setShowHymnEditor(false);
            setEditingHymn(null);
          }}
          onSave={handleSaved}
        />
      )}

      {/* Modal Editor de Hinário */}
      {showHymnalEditor && (
        <HymnalEditor
          hymnal={editingHymnal}
          onClose={() => {
            setShowHymnalEditor(false);
            setEditingHymnal(null);
          }}
          onSave={handleSaved}
        />
      )}
    </div>
  );
}
