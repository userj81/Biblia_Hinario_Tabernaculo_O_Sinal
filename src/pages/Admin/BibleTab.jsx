import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
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

  // Estados para bottom sheets
  const [showLivroSheet, setShowLivroSheet] = useState(false);
  const [showCapituloSheet, setShowCapituloSheet] = useState(false);
  const [livroSheetFilter, setLivroSheetFilter] = useState('');

  const { setSlide, setVersiculos: setStoreVersiculos, currentSlide } = useProjectionStore();

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

  // Helper para detectar versículo sendo projetado
  const isProjetando = (versiculo) => {
    return currentSlide.metadata?.versiculo === versiculo.versiculo &&
           currentSlide.metadata?.capitulo === selectedCapitulo &&
           currentSlide.metadata?.livro === selectedLivro?.livros;
  };

  // Handlers de swipe para trocar capítulos
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (selectedCapitulo && selectedCapitulo < capitulos.length) {
        setSelectedCapitulo(selectedCapitulo + 1);
      }
    },
    onSwipedRight: () => {
      if (selectedCapitulo && selectedCapitulo > 1) {
        setSelectedCapitulo(selectedCapitulo - 1);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: false,
  });

  return (
    <div className="flex flex-col h-full">
      {/* Painel de Leituras Salvas */}
      <div className="p-4 pb-0">
        <ReadingsPanel />
      </div>

      {/* SearchInput Sticky */}
      <div className="sticky top-0 z-30 bg-white px-4 py-3 border-b border-gray-100">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar livro ou versículo..."
        />
        {isSearching && (
          <button
            onClick={clearSearch}
            className="mt-2 text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para navegação
          </button>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-4">
        {isSearching ? (
          /* Resultados de Busca */
          <>
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
                    <div className="grid grid-cols-2 gap-2">
                      {searchResults.livros.map((livro) => (
                        <button
                          key={livro.id}
                          onClick={() => {
                            setSelectedLivro(livro);
                            clearSearch();
                          }}
                          className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-700 font-medium transition-colors active:scale-98"
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
                          className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-100 transition-all group active:scale-98"
                        >
                          <div className="text-xs text-blue-600 font-medium mb-1">
                            {result.livro_nome} {result.capitulo}:{result.versiculo}
                          </div>
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 leading-relaxed">
                            {result.texto}
                          </span>
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
          </>
        ) : (
          /* Navegação normal - Mobile Layout */
          <>
            {/* Header Seletor */}
            <div className="flex gap-2 mb-4">
              {/* Botão Livro */}
              <button
                onClick={() => setShowLivroSheet(true)}
                className="flex-1 h-14 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center justify-between px-4 active:scale-98 transition-transform"
              >
                <span className="text-base font-semibold text-blue-900 truncate">
                  {selectedLivro?.livros || 'Selecionar Livro'}
                </span>
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Botão Capítulo */}
              <button
                onClick={() => setShowCapituloSheet(true)}
                disabled={!selectedLivro}
                className="flex-1 h-14 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center justify-between px-4 disabled:opacity-40 disabled:cursor-not-allowed active:scale-98 transition-transform"
              >
                <span className="text-base font-semibold text-blue-900">
                  {selectedCapitulo ? `Capítulo ${selectedCapitulo}` : 'Cap.'}
                </span>
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Lista de Versículos com Swipe */}
            {selectedLivro && selectedCapitulo ? (
              <div {...swipeHandlers}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-500">
                    {selectedLivro.livros} {selectedCapitulo}
                  </h3>
                  <button
                    onClick={handleEnviarCapitulo}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-colors active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Projetar Capítulo
                  </button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {versiculos.map((versiculo, index) => (
                      <button
                        key={versiculo.codigo}
                        onClick={() => handleVersiculoClick(versiculo, index)}
                        className={`
                          w-full text-left p-4 rounded-lg border-2 transition-all relative
                          ${isProjetando(versiculo)
                            ? 'bg-blue-50 border-blue-400 border-l-4'
                            : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200'}
                        `}
                      >
                        {/* Indicador "No Ar" */}
                        {isProjetando(versiculo) && (
                          <div className="absolute left-1 top-1/2 -translate-y-1/2">
                            <span className="flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                            </span>
                          </div>
                        )}

                        <div className="flex items-start gap-3">
                          {/* Número do versículo */}
                          <span className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                            {versiculo.versiculo}
                          </span>

                          {/* Texto completo */}
                          <span className="flex-1 text-base text-gray-800 leading-relaxed">
                            {versiculo.texto}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-sm">Selecione um livro e capítulo</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Sheet - Seleção de Livros */}
      {showLivroSheet && (
        <div className="fixed inset-0 z-[60] flex items-end md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in-overlay"
            onClick={() => {
              setShowLivroSheet(false);
              setLivroSheetFilter(''); // Limpa filtro ao fechar
            }}
          />

          {/* Sheet */}
          <div className="relative w-full bg-white rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up-sheet">
            {/* Header com Busca - Sticky */}
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-3xl z-10 flex-shrink-0">
              <div className="p-4 pb-2 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Selecionar Livro</h3>
                <button
                  onClick={() => {
                    setShowLivroSheet(false);
                    setLivroSheetFilter(''); // Limpa filtro ao fechar
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Campo de Busca */}
              <div className="px-4 pb-3">
                <div className="relative">
                  <input
                    type="text"
                    value={livroSheetFilter}
                    onChange={(e) => setLivroSheetFilter(e.target.value)}
                    placeholder="Buscar livro..."
                    className="w-full h-11 pl-10 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder:text-gray-400 transition-all"
                    autoFocus
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {livroSheetFilter && (
                    <button
                      onClick={() => setLivroSheetFilter('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                {livroSheetFilter && (
                  <p className="text-xs text-gray-500 mt-1.5">
                    {livros.filter(l => l.livros.toLowerCase().includes(livroSheetFilter.toLowerCase())).length} resultado(s)
                  </p>
                )}
              </div>
            </div>

            {/* Grid de Livros - Scrollável */}
            <div className="flex-1 overflow-y-auto p-4 pb-20">
              <div className="grid grid-cols-2 gap-3">
                {livros
                  .filter(livro =>
                    livroSheetFilter.trim() === '' ||
                    livro.livros.toLowerCase().includes(livroSheetFilter.toLowerCase())
                  )
                  .map((livro) => (
                    <button
                      key={livro.id}
                      onClick={() => {
                        setSelectedLivro(livro);
                        setShowLivroSheet(false);
                        setLivroSheetFilter(''); // Limpa filtro ao selecionar
                        setShowCapituloSheet(true); // Auto-abre capítulos
                      }}
                      className="h-24 bg-blue-50 hover:bg-blue-100 active:scale-95 rounded-xl flex flex-col items-center justify-center border-2 border-blue-200 transition-all"
                    >
                      <span className="text-lg font-bold text-blue-900 text-center px-2">
                        {livro.livros}
                      </span>
                    </button>
                  ))}
              </div>
              {livros.filter(l => l.livros.toLowerCase().includes(livroSheetFilter.toLowerCase())).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-sm">Nenhum livro encontrado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sheet - Seleção de Capítulos */}
      {showCapituloSheet && selectedLivro && (
        <div className="fixed inset-0 z-[60] flex items-end md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in-overlay"
            onClick={() => setShowCapituloSheet(false)}
          />

          {/* Sheet */}
          <div className="relative w-full bg-white rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up-sheet">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-3xl">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedLivro.livros} - Capítulos
              </h3>
              <button
                onClick={() => setShowCapituloSheet(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Grid de Capítulos */}
            <div className="p-4 pb-20 overflow-y-auto">
              <div className="grid grid-cols-6 gap-2">
                {capitulos.map((capitulo) => (
                  <button
                    key={capitulo}
                    onClick={() => {
                      setSelectedCapitulo(capitulo);
                      setShowCapituloSheet(false);
                    }}
                    className={`
                      aspect-square rounded-xl flex items-center justify-center
                      text-white font-bold text-lg active:scale-95 transition-all
                      ${selectedCapitulo === capitulo
                        ? 'bg-blue-600'
                        : 'bg-blue-500 hover:bg-blue-600'}
                    `}
                  >
                    {capitulo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
