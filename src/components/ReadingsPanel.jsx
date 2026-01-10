import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { socketHelpers } from '../services/socket';
import { useProjectionStore } from '../stores/projectionStore';
import ReadingEditor from './ReadingEditor';

/**
 * Painel de Leituras Salvas
 * Exibido acima da lista de livros na aba Bíblia
 */
export default function ReadingsPanel() {
  const [leituras, setLeituras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingReading, setEditingReading] = useState(null);
  const [expanded, setExpanded] = useState(false);
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

  return (
    <div className="mb-4">
      {/* Header colapsável */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 hover:border-amber-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📌</span>
          <span className="font-medium text-gray-800">Leituras Salvas</span>
          <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full">
            {leituras.length}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Conteúdo expandido */}
      {expanded && (
        <div className="mt-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Botão Nova Leitura */}
          <div className="p-3 border-b border-gray-100">
            <button
              onClick={() => setShowEditor(true)}
              className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Leitura
            </button>
          </div>

          {/* Lista de leituras */}
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                Carregando...
              </div>
            ) : leituras.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <p className="text-sm">Nenhuma leitura salva</p>
                <p className="text-xs mt-1">Clique em "Nova Leitura" para criar</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {leituras.map((leitura) => (
                  <div
                    key={leitura.id}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 truncate">
                          {leitura.nome}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {formatReferences(leitura.versiculos)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleProjetar(leitura)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Projetar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(leitura)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(leitura.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
      )}

      {/* Modal Editor */}
      {showEditor && (
        <ReadingEditor
          reading={editingReading}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
}

