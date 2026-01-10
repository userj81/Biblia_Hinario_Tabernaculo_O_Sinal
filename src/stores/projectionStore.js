/**
 * Store Zustand para gerenciar estado global da projeção
 */

import { create } from 'zustand';

/**
 * Divide um texto longo em partes menores
 * @param {string} text - Texto a ser dividido
 * @param {number} maxChars - Limite máximo de caracteres por slide (padrão: 150)
 * @returns {string[]} Array de partes do texto
 */
function splitLongText(text, maxChars = 150) {
  if (!text || text.length <= maxChars) {
    return [text];
  }

  const parts = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      parts.push(remaining.trim());
      break;
    }

    // Encontrar o melhor ponto de quebra (pontuação ou espaço)
    let breakPoint = maxChars;
    
    // Prioridade: ponto final, ponto e vírgula, vírgula, espaço
    const punctuation = ['. ', '; ', ', ', ' '];
    
    for (const punct of punctuation) {
      const lastIndex = remaining.lastIndexOf(punct, maxChars);
      if (lastIndex > maxChars * 0.5) { // Pelo menos 50% do limite
        breakPoint = lastIndex + punct.length;
        break;
      }
    }

    // Se não encontrou pontuação, quebrar no último espaço
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
}

export const useProjectionStore = create((set, get) => ({
  // Estado atual do slide
  currentSlide: {
    type: null, // 'text', 'hino', 'verse', 'announcement'
    text: '',
    slides: [],
    currentSlideIndex: 0,
    totalSlides: 0,
    metadata: {},
  },

  // Estado de blackout
  isBlackout: false,

  // Configurações de exibição - baseado no sistema antigo
  settings: {
    fontSize: 52, // Tamanho grande para projeção
    fontFamily: "'VAG Rundschrift', 'Segoe UI', Arial, sans-serif", // Fonte do sistema antigo
    textColor: '#FFFFFF',
    backgroundColor: '#001529',
    lineHeight: 1.5,
    backgroundImage: '/images/fundo.jpg', // Imagem do sistema antigo
  },

  // Hino atual (para navegação)
  currentHino: null,
  hinoSlides: [],

  // Versículos atuais (para navegação)
  currentVersiculos: [],
  currentVersiculoIndex: 0,

  // Ações
  setSlide: (slideData) => {
    // Garantir que slides sejam objetos { text, isRefrain } ou strings
    let processedSlides = slideData.slides || [];
    if (processedSlides.length === 0 && slideData.text) {
      processedSlides = [{ text: slideData.text, isRefrain: false }];
    } else if (processedSlides.length > 0) {
      // Converter strings para objetos se necessário
      processedSlides = processedSlides.map(slide => {
        if (typeof slide === 'string') {
          return { text: slide, isRefrain: false };
        }
        return slide; // Já é objeto { text, isRefrain }
      });
    }
    
    // Processar metadata para garantir que seja apenas strings/primitivos
    let processedMetadata = {};
    if (slideData.metadata) {
      Object.keys(slideData.metadata).forEach(key => {
        const value = slideData.metadata[key];
        // Se for objeto, tentar extrair propriedade útil ou converter para string
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          if ('nome' in value) {
            processedMetadata[key] = String(value.nome);
          } else if ('text' in value) {
            processedMetadata[key] = String(value.text);
          } else {
            processedMetadata[key] = String(value);
          }
        } else {
          processedMetadata[key] = value;
        }
      });
    }
    
    set({
      currentSlide: {
        type: slideData.type || 'text',
        text: slideData.text || '',
        slides: processedSlides,
        currentSlideIndex: slideData.currentSlide || 0,
        totalSlides: slideData.totalSlides || processedSlides.length || 1,
        metadata: processedMetadata,
      },
      isBlackout: false,
    });
  },

  setBlackout: (isBlackout) => {
    set({ isBlackout });
  },

  setHino: (hino, slides) => {
    set({
      currentHino: hino,
      hinoSlides: slides || [],
      currentSlide: {
        type: 'hino',
        slides: slides || [],
        currentSlideIndex: 0,
        totalSlides: slides?.length || 0,
        metadata: { 
          hino: typeof hino === 'object' ? hino.nome : hino,
          numero: typeof hino === 'object' ? hino.numero : null,
        },
      },
    });
  },

  // Configura versículos onde CADA VERSÍCULO = 1 SLIDE (ou mais se for longo)
  setVersiculos: (versiculos, livro, capitulo) => {
    // Criar slides - dividir versículos longos em múltiplas partes
    const slides = [];
    
    for (const v of versiculos) {
      const textParts = splitLongText(v.texto, 150); // 150 caracteres por slide
      
      for (let i = 0; i < textParts.length; i++) {
        slides.push({
          text: textParts[i],
          versiculo: v.versiculo,
          parte: textParts.length > 1 ? `${i + 1}/${textParts.length}` : null,
          isRefrain: false,
        });
      }
    }
    
    set({
      currentVersiculos: versiculos,
      currentVersiculoIndex: 0,
      currentSlide: {
        type: 'verse',
        text: slides[0]?.text || '',
        slides: slides,
        currentSlideIndex: 0,
        totalSlides: slides.length,
        metadata: { 
          livro: livro?.livros || livro, 
          capitulo, 
          versiculo: slides[0]?.versiculo || 1,
        },
      },
    });
  },

  nextSlide: () => {
    const state = get();
    if (state.currentSlide.currentSlideIndex < state.currentSlide.totalSlides - 1) {
      const newIndex = state.currentSlide.currentSlideIndex + 1;
      const newSlide = state.currentSlide.slides[newIndex];
      
      // Atualizar metadata do versículo se for tipo 'verse'
      let updatedMetadata = { ...state.currentSlide.metadata };
      if (state.currentSlide.type === 'verse' && newSlide?.versiculo) {
        updatedMetadata.versiculo = newSlide.versiculo;
      }
      
      set({
        currentSlide: {
          ...state.currentSlide,
          currentSlideIndex: newIndex,
          metadata: updatedMetadata,
        },
      });
    }
  },

  prevSlide: () => {
    const state = get();
    if (state.currentSlide.currentSlideIndex > 0) {
      const newIndex = state.currentSlide.currentSlideIndex - 1;
      const newSlide = state.currentSlide.slides[newIndex];
      
      // Atualizar metadata do versículo se for tipo 'verse'
      let updatedMetadata = { ...state.currentSlide.metadata };
      if (state.currentSlide.type === 'verse' && newSlide?.versiculo) {
        updatedMetadata.versiculo = newSlide.versiculo;
      }
      
      set({
        currentSlide: {
          ...state.currentSlide,
          currentSlideIndex: newIndex,
          metadata: updatedMetadata,
        },
      });
    }
  },

  // Define o índice do slide diretamente (usado pelo socket)
  setSlideIndex: (index) => {
    const state = get();
    if (index >= 0 && index < state.currentSlide.totalSlides) {
      const newSlide = state.currentSlide.slides[index];
      
      // Atualizar metadata do versículo se for tipo 'verse'
      let updatedMetadata = { ...state.currentSlide.metadata };
      if (state.currentSlide.type === 'verse' && newSlide?.versiculo) {
        updatedMetadata.versiculo = newSlide.versiculo;
      }
      
      set({
        currentSlide: {
          ...state.currentSlide,
          currentSlideIndex: index,
          metadata: updatedMetadata,
        },
      });
    }
  },

  updateSettings: (newSettings) => {
    set({
      settings: {
        ...get().settings,
        ...newSettings,
      },
    });
  },

  reset: () => {
    set({
      currentSlide: {
        type: null,
        text: '',
        slides: [],
        currentSlideIndex: 0,
        totalSlides: 0,
        metadata: {},
      },
      isBlackout: false,
      currentHino: null,
      hinoSlides: [],
      currentVersiculos: [],
      currentVersiculoIndex: 0,
    });
  },
}));

