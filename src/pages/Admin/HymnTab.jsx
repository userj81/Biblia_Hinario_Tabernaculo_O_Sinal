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
  const { setHino } = useProjectionStore();
  
  // Estados para modais de gestão
  const [showHymnEditor, setShowHymnEditor] = useState(false);
  const [showHymnalEditor, setShowHymnalEditor] = useState(false);
  const [editingHymn, setEditingHymn] = useState(null);
  const [editingHymnal, setEditingHymnal] = useState(null);

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
    e.stopPropagation();
    setEditingHymn(hino);
    setShowHymnEditor(true);
  };

  // Excluir hino
  const handleDeleteHymn = async (e, hino) => {
    e.stopPropagation();
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
    e.stopPropagation();
    setEditingHymnal(hinario);
    setShowHymnalEditor(true);
  };

  // Excluir hinário
  const handleDeleteHymnal = async (e, hinario) => {
    e.stopPropagation();
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

  const displayHinos = searchQuery.trim() ? searchResults : hinos;

  return (
    <div className="flex flex-col h-full p-4">
      {/* Search + Botão Novo Hino */}
      <div className="mb-4 flex gap-3">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Buscar hino por nome ou número..."
          />
        </div>
        <button
          onClick={handleNewHymn}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Hino
        </button>
      </div>

      <div className="flex gap-4 flex-1 overflow-hidden">
        {/* Lista de Hinários */}
        <div className="w-56 border-r border-gray-100 pr-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hinários</h3>
            <button
              onClick={handleNewHymnal}
              className="p-1 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Novo Hinário"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          {/* Opção "Todos" */}
          <button
            onClick={() => setSelectedHinario('all')}
            className={`w-full text-left px-3 py-2.5 mb-1 rounded-lg text-sm transition-all ${
              selectedHinario === 'all'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Todos
            </span>
          </button>
          
          {hinarios.filter(h => h.id !== 0).map((hinario) => (
            <div
              key={hinario.id}
              className={`group flex items-center gap-1 mb-1 rounded-lg transition-all ${
                selectedHinario?.id === hinario.id
                  ? 'bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <button
                onClick={() => setSelectedHinario(hinario)}
                className={`flex-1 text-left px-3 py-2.5 text-sm ${
                  selectedHinario?.id === hinario.id
                    ? 'text-blue-700 font-medium'
                    : 'text-gray-700'
                }`}
              >
                {hinario.nome}
              </button>
              <div className="hidden group-hover:flex items-center pr-1">
                <button
                  onClick={(e) => handleEditHymnal(e, hinario)}
                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Editar"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => handleDeleteHymnal(e, hinario)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Excluir"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Lista de Hinos */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            {searchQuery.trim() 
              ? `Resultados (${displayHinos.length})` 
              : selectedHinario === 'all' 
                ? `Todos os Hinos (${displayHinos.length})` 
                : `${selectedHinario?.nome || 'Selecione um hinário'}`}
          </h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : displayHinos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <p className="text-sm">
                {searchQuery.trim() ? 'Nenhum resultado encontrado' : 'Selecione um hinário'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {displayHinos.map((hino) => (
                <div
                  key={hino.id}
                  className="group flex items-center bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <button
                    onClick={() => handleHinoClick(hino)}
                    className="flex-1 text-left px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                        {hino.numero}
                      </span>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                        {hino.nome}
                      </span>
                    </div>
                  </button>
                  <div className="hidden group-hover:flex items-center pr-3 gap-1">
                    <button
                      onClick={(e) => handleEditHymn(e, hino)}
                      className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDeleteHymn(e, hino)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="Excluir"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
