import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { socketHelpers } from '../../services/socket';
import { useProjectionStore } from '../../stores/projectionStore';
import SearchInput from '../../components/SearchInput';
import ReadingsPanel from '../../components/ReadingsPanel';

export default function BibleTab() {
  const [livros, setLivros] = useState([]);
  const [selectedLivro, setSelectedLivro] = useState(null);
  const [capitulos, setCapitulos] = useState([]);
  const [selectedCapitulo, setSelectedCapitulo] = useState(null);
  const [versiculos, setVersiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ livros: [], versiculos: [] });
  const [isSearching, setIsSearching] = useState(false);
  const { setSlide, setVersiculos: setStoreVersiculos } = useProjectionStore();

  useEffect(() => {
    loadLivros();
  }, []);

  // Busca quando digita
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      handleSearch(searchQuery);
    } else {
      setSearchResults({ livros: [], versiculos: [] });
      setIsSearching(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedLivro) {
      loadCapitulos(selectedLivro.id);
    }
  }, [selectedLivro]);

  useEffect(() => {
    if (selectedLivro && selectedCapitulo) {
      loadVersiculos(selectedLivro.id, selectedCapitulo);
    }
  }, [selectedLivro, selectedCapitulo]);

  const loadLivros = async () => {
    try {
      const response = await api.getLivros();
      setLivros(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    }
  };

  const handleSearch = async (query) => {
    if (query.trim().length < 2) return;
    
    setLoading(true);
    setIsSearching(true);
    try {
      const response = await api.searchBiblia(query);
      setSearchResults(response.data || { livros: [], versiculos: [] });
    } catch (error) {
      console.error('Erro ao buscar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResultClick = (result) => {
    // Resultado é um versículo encontrado na busca
    const slides = [{
      text: result.texto,
      versiculo: result.versiculo,
      parte: null,
      isRefrain: false,
    }];

    const slideData = {
      type: 'verse',
      text: result.texto,
      slides: slides,
      currentSlide: 0,
      totalSlides: 1,
      metadata: {
        livro: result.livro_nome,
        capitulo: result.capitulo,
        versiculo: result.versiculo,
        referencia: `${result.livro_nome} ${result.capitulo}:${result.versiculo}`,
      },
    };

    setSlide(slideData);
    socketHelpers.showSlide(slideData);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults({ livros: [], versiculos: [] });
    setIsSearching(false);
  };

  const loadCapitulos = async (livroId) => {
    setLoading(true);
    try {
      const response = await api.getCapitulos(livroId);
      setCapitulos(response.data?.capitulos || []);
      setSelectedCapitulo(null);
      setVersiculos([]);
    } catch (error) {
      console.error('Erro ao carregar capítulos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVersiculos = async (livroId, capitulo) => {
    setLoading(true);
    try {
      const response = await api.getVersiculos(livroId, capitulo);
      const versiculosData = response.data || [];
      setVersiculos(versiculosData);
      
      // Configurar no store para o preview (cada versículo = 1 slide)
      if (versiculosData.length > 0) {
        setStoreVersiculos(versiculosData, selectedLivro, capitulo);
      }
    } catch (error) {
      console.error('Erro ao carregar versículos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para dividir texto longo (150 caracteres por slide)
  const splitLongText = (text, maxChars = 150) => {
    if (!text || text.length <= maxChars) return [text];
    
    const parts = [];
    let remaining = text;

    while (remaining.length > 0) {
      if (remaining.length <= maxChars) {
        parts.push(remaining.trim());
        break;
      }

      let breakPoint = maxChars;
      const punctuation = ['. ', '; ', ', ', ' '];
      
      for (const punct of punctuation) {
        const lastIndex = remaining.lastIndexOf(punct, maxChars);
        if (lastIndex > maxChars * 0.5) {
          breakPoint = lastIndex + punct.length;
          break;
        }
      }

      if (breakPoint === maxChars) {
        const lastSpace = remaining.lastIndexOf(' ', maxChars);
        if (lastSpace > maxChars * 0.5) {
          breakPoint = lastSpace + 1;
        }
      }

      parts.push(remaining.slice(0, breakPoint).trim());
      remaining = remaining.slice(breakPoint).trim();
    }

    return parts;
  };

  // Criar slides dividindo versículos longos
  const createSlides = (versiculosList) => {
    const slides = [];
    
    for (const v of versiculosList) {
      const textParts = splitLongText(v.texto, 150);
      
      for (let i = 0; i < textParts.length; i++) {
        slides.push({
          text: textParts[i],
          versiculo: v.versiculo,
          parte: textParts.length > 1 ? `${i + 1}/${textParts.length}` : null,
          isRefrain: false,
        });
      }
    }
    
    return slides;
  };

  // Projetar um versículo específico (clicando nele)
  const handleVersiculoClick = (versiculo, index) => {
    const referencia = `${selectedLivro?.livros} ${selectedCapitulo}:${versiculo.versiculo}`;
    
    // Criar slides dividindo versículos longos
    const slides = createSlides(versiculos);
    
    // Encontrar o índice correto do slide para este versículo
    let slideIndex = 0;
    for (let i = 0; i < index; i++) {
      const parts = splitLongText(versiculos[i].texto, 150);
      slideIndex += parts.length;
    }

    const slideData = {
      type: 'verse',
      text: slides[slideIndex]?.text || versiculo.texto,
      slides: slides,
      currentSlide: slideIndex,
      totalSlides: slides.length,
      metadata: {
        livro: selectedLivro?.livros,
        capitulo: selectedCapitulo,
        versiculo: versiculo.versiculo,
        referencia,
      },
    };

    setSlide(slideData);
    socketHelpers.showSlide(slideData);
  };

  // Projetar todos os versículos do capítulo
  const handleEnviarCapitulo = () => {
    if (versiculos.length === 0) return;

    const referencia = `${selectedLivro?.livros} ${selectedCapitulo}`;
    const slides = createSlides(versiculos);

    const slideData = {
      type: 'verse',
      text: slides[0]?.text || versiculos[0].texto,
      slides: slides,
      currentSlide: 0,
      totalSlides: slides.length,
      metadata: {
        livro: selectedLivro?.livros,
        capitulo: selectedCapitulo,
        versiculo: slides[0]?.versiculo || 1,
        referencia,
      },
    };

    setSlide(slideData);
    socketHelpers.showSlide(slideData);
  };

  return (
    <div className="flex flex-col h-full p-4">
      {/* Painel de Leituras Salvas */}
      <ReadingsPanel />
      
      {/* Barra de Busca */}
      <div className="mb-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar livro ou versículo..."
        />
        {isSearching && (
          <button
            onClick={clearSearch}
            className="mt-2 text-xs text-blue-500 hover:text-blue-700"
          >
            ← Voltar para navegação
          </button>
        )}
      </div>

      {/* Resultados de Busca */}
      {isSearching ? (
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Livros encontrados */}
              {searchResults.livros.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Livros ({searchResults.livros.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {searchResults.livros.map((livro) => (
                      <button
                        key={livro.id}
                        onClick={() => {
                          setSelectedLivro(livro);
                          clearSearch();
                        }}
                        className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-700 font-medium transition-colors"
                      >
                        {livro.livros}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Versículos encontrados */}
              {searchResults.versiculos.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Versículos ({searchResults.versiculos.length})
                  </h3>
                  <div className="space-y-2">
                    {searchResults.versiculos.map((result) => (
                      <button
                        key={result.codigo}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-100 transition-all group"
                      >
                        <div className="text-xs text-blue-600 font-medium mb-1">
                          {result.livro_nome} {result.capitulo}:{result.versiculo}
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">{result.texto}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.livros.length === 0 && searchResults.versiculos.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">Nenhum resultado encontrado</p>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* Navegação normal */
        <div className="flex gap-4 flex-1 overflow-hidden">
          {/* Lista de Livros */}
          <div className="w-48 border-r border-gray-100 pr-4 overflow-y-auto">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Livros</h3>
            <div className="space-y-0.5">
              {livros.map((livro) => (
                <button
                  key={livro.id}
                  onClick={() => setSelectedLivro(livro)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedLivro?.id === livro.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {livro.livros}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Capítulos */}
          {selectedLivro && (
            <div className="w-32 border-r border-gray-100 pr-4 overflow-y-auto">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Capítulo</h3>
              <div className="grid grid-cols-3 gap-1">
                {capitulos.map((capitulo) => (
                  <button
                    key={capitulo}
                    onClick={() => setSelectedCapitulo(capitulo)}
                    className={`px-2 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCapitulo === capitulo
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {capitulo}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Versículos */}
          {selectedCapitulo && (
            <div className="flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {selectedLivro?.livros} {selectedCapitulo}
                </h3>
                <button
                  onClick={handleEnviarCapitulo}
                  disabled={versiculos.length === 0}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Projetar Capítulo
                </button>
              </div>

              <p className="text-xs text-gray-400 mb-3">
                💡 Clique em um versículo para projetá-lo. Use as setas para navegar.
              </p>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : versiculos.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">Nenhum versículo encontrado</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {versiculos.map((versiculo, index) => (
                    <button
                      key={versiculo.codigo}
                      onClick={() => handleVersiculoClick(versiculo, index)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 rounded-lg border border-gray-100 transition-all group"
                    >
                      <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 group-hover:bg-blue-500 text-blue-600 group-hover:text-white rounded-full text-xs font-medium mr-2 transition-colors">
                        {versiculo.versiculo}
                      </span>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">{versiculo.texto}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!selectedLivro && !selectedCapitulo && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-sm">Selecione um livro ou pesquise</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
