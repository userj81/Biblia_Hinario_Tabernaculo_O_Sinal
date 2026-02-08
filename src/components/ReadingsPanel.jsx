import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { socketHelpers } from '../services/socket';
import { useProjectionStore } from '../stores/projectionStore';
import ReadingEditor from './ReadingEditor';

/**
 * Painel de Leituras Salvas - Formato Carrossel Horizontal
 * Exibido acima da lista de livros na aba Bíblia
 */
export default function ReadingsPanel() {
  const [leituras, setLeituras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingReading, setEditingReading] = useState(null);
  const { setSlide } = useProjectionStore();

  // Carregar leituras
  const loadLeituras = async () => {
    setLoading(true);
    try {
      const response = await api.getLeituras();
      if (response.success) {
        setLeituras(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar leituras:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeituras();
  }, []);

  // Projetar leitura
  const handleProjetar = async (leitura) => {
    try {
      const response = await api.projetarLeitura(leitura.id);
      if (response.success) {
        const slideData = {
          type: 'verse',
          text: response.data.slides[0]?.text || '',
          slides: response.data.slides.map(s => ({
            text: s.text,
            versiculo: s.versiculo,
            isRefrain: false,
          })),
          currentSlideIndex: 0,
          totalSlides: response.data.totalSlides,
          metadata: {
            livro: response.data.slides[0]?.livro,
            capitulo: response.data.slides[0]?.capitulo,
            versiculo: response.data.slides[0]?.versiculo,
            referencia: response.data.slides[0]?.referencia,
            leitura: response.data.leitura,
          },
        };
        setSlide(slideData);
        socketHelpers.showSlide(slideData);
      }
    } catch (error) {
      console.error('Erro ao projetar leitura:', error);
    }
  };

  // Deletar leitura
  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir esta leitura?')) return;
    try {
      await api.deleteLeitura(id);
      loadLeituras();
    } catch (error) {
      console.error('Erro ao excluir leitura:', error);
    }
  };

  // Editar leitura
  const handleEdit = (leitura) => {
    setEditingReading(leitura);
    setShowEditor(true);
  };

  // Fechar editor
  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingReading(null);
    loadLeituras();
  };

  // Formatação das referências (versão compacta)
  const formatReferences = (versiculos) => {
    if (!versiculos || versiculos.length === 0) return '';
    return versiculos.map(v => {
      if (v.versiculo_inicio === v.versiculo_fim) {
        return `${v.livro_nome} ${v.capitulo}:${v.versiculo_inicio}`;
      }
      return `${v.livro_nome} ${v.capitulo}:${v.versiculo_inicio}-${v.versiculo_fim}`;
    }).join(' • ');
  };

  if (loading) {
    return (
      <div className="mb-3">
        <div className="p-4 text-center text-gray-400 text-sm">
          Carregando leituras...
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-amber-700 uppercase tracking-wide">
          📌 Leituras Salvas ({leituras.length})
        </h3>
        <button
          onClick={() => setShowEditor(true)}
          className="p-1.5 bg-amber-500 hover:bg-amber-600 rounded-lg text-white transition-colors active:scale-95"
          title="Nova Leitura"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Carrossel Horizontal */}
      <div className="relative">
        {leituras.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
            {leituras.map((leitura) => (
              <div
                key={leitura.id}
                className="flex-shrink-0 w-[280px] bg-amber-50 border-2 border-amber-200 rounded-xl p-3 snap-center transition-all hover:shadow-md"
              >
                {/* Nome da leitura */}
                <h4 className="text-sm font-bold text-amber-900 mb-2 line-clamp-1">
                  {leitura.nome}
                </h4>

                {/* Referências compactas */}
                <div className="text-xs text-amber-700 mb-3 line-clamp-2">
                  {formatReferences(leitura.versiculos)}
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleProjetar(leitura)}
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-white text-xs font-medium flex items-center justify-center gap-1 transition-colors active:scale-95"
                    title="Projetar"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Projetar
                  </button>
                  <button
                    onClick={() => handleEdit(leitura)}
                    className="p-2 bg-white border border-amber-300 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors active:scale-95"
                    title="Editar"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(leitura.id)}
                    className="p-2 bg-white border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors active:scale-95"
                    title="Excluir"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Card "Adicionar" no final */}
            <button
              onClick={() => setShowEditor(true)}
              className="flex-shrink-0 w-[280px] h-full min-h-[120px] bg-amber-100 border-2 border-dashed border-amber-300 rounded-xl flex flex-col items-center justify-center text-amber-600 hover:bg-amber-200 transition-colors active:scale-98"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">Nova Leitura</span>
            </button>
          </div>
        ) : (
          // Empty state - Compacto
          <div className="text-center py-3 bg-amber-50/50 border border-dashed border-amber-200 rounded-lg">
            <p className="text-amber-600 text-xs mb-2">
              <span className="mr-1">📖</span>
              Nenhuma leitura salva
            </p>
            <button
              onClick={() => setShowEditor(true)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-medium transition-colors active:scale-95"
            >
              + Criar Leitura
            </button>
          </div>
        )}
      </div>

      {/* Modal Editor - SEM ALTERAÇÃO */}
      {showEditor && (
        <ReadingEditor
          reading={editingReading}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
}
