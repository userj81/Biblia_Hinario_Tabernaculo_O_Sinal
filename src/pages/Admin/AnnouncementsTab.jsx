import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { socketHelpers } from '../../services/socket';
import { useProjectionStore } from '../../stores/projectionStore';
import AnnouncementEditor from '../../components/AnnouncementEditor';

/**
 * Aba de Anúncios
 * Permite criar e gerenciar anúncios de leitura bíblica
 * Com nome da pessoa, título (Pastor, Evangelista, etc.) e múltiplos versículos
 */
export default function AnnouncementsTab() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingAnuncio, setEditingAnuncio] = useState(null);
  const { setSlide } = useProjectionStore();

  // Carregar anúncios
  const loadAnuncios = async () => {
    setLoading(true);
    try {
      const response = await api.getAnuncios();
      if (response.success) {
        setAnuncios(response.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar anúncios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnuncios();
  }, []);

  // Projetar anúncio
  const handleProjetar = async (anuncio) => {
    try {
      const response = await api.projetarAnuncio(anuncio.id);
      if (response.success) {
        const slideData = {
          type: 'anuncio',
          text: response.data.slide.text,
          slides: [{
            text: response.data.slide.text,
            isRefrain: false,
          }],
          currentSlideIndex: 0,
          totalSlides: 1,
          metadata: response.data.slide.metadata,
        };
        
        setSlide(slideData);
        socketHelpers.showSlide(slideData);
      }
    } catch (error) {
      console.error('Erro ao projetar anúncio:', error);
    }
  };

  // Novo anúncio
  const handleNew = () => {
    setEditingAnuncio(null);
    setShowEditor(true);
  };

  // Editar anúncio
  const handleEdit = (anuncio) => {
    setEditingAnuncio(anuncio);
    setShowEditor(true);
  };

  // Excluir anúncio
  const handleDelete = async (id) => {
    if (!confirm('Deseja excluir este anúncio?')) return;
    try {
      await api.deleteAnuncio(id);
      loadAnuncios();
    } catch (error) {
      console.error('Erro ao excluir anúncio:', error);
    }
  };

  // Fechar editor
  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingAnuncio(null);
    loadAnuncios();
  };

  // Formatação das referências
  const formatReferences = (versiculos) => {
    if (!versiculos || versiculos.length === 0) return '';
    return versiculos.map(v => {
      if (v.versiculo_inicio === v.versiculo_fim) {
        return `${v.livro_nome} ${v.capitulo}:${v.versiculo_inicio}`;
      }
      return `${v.livro_nome} ${v.capitulo}:${v.versiculo_inicio}-${v.versiculo_fim}`;
    }).join(' • ');
  };

  // Formatar nome com título
  const formatNome = (anuncio) => {
    if (anuncio.titulo) {
      return `${anuncio.titulo} ${anuncio.nome}`;
    }
    return anuncio.nome;
  };

  return (
    <div className="flex flex-col h-full p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            📢 Anúncios de Leitura
          </h2>
          <button
            onClick={handleNew}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Anúncio
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Crie anúncios de leitura com o nome do pregador, título e os versículos que serão lidos.
        </p>
      </div>

      {/* Lista de Anúncios */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : anuncios.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">Nenhum anúncio cadastrado</p>
            <p className="text-sm text-gray-400">Clique em "Novo Anúncio" para criar o primeiro</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {anuncios.map((anuncio) => (
              <div
                key={anuncio.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Nome e Título */}
                    <div className="flex items-center gap-2 mb-2">
                      {anuncio.titulo && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {anuncio.titulo}
                        </span>
                      )}
                      <h3 className="font-semibold text-gray-800">
                        {anuncio.nome}
                      </h3>
                    </div>
                    
                    {/* Referências */}
                    <div className="flex flex-wrap gap-2">
                      {anuncio.versiculos?.map((v, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                        >
                          {v.versiculo_inicio === v.versiculo_fim
                            ? `${v.livro_nome} ${v.capitulo}:${v.versiculo_inicio}`
                            : `${v.livro_nome} ${v.capitulo}:${v.versiculo_inicio}-${v.versiculo_fim}`
                          }
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleProjetar(anuncio)}
                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      title="Projetar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEdit(anuncio)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(anuncio.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Editor */}
      {showEditor && (
        <AnnouncementEditor
          announcement={editingAnuncio}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
}

