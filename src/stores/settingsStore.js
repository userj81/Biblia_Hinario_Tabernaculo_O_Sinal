import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';

/**
 * Store para gerenciar configurações do sistema
 * Inclui fórmula matemática para ajuste automático baseado no tamanho da tela
 */
export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Estado
      tamanhoTela: 55, // Tamanho padrão em polegadas
      fonteVersiculo: 86,
      fonteHino: 65,
      charsPorSlide: 168,
      loading: false,
      error: null,
      
      // Carregar configurações do servidor
      loadSettings: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.getSettings();
          if (response.success && response.data) {
            const tamanho = parseInt(response.data.tamanho_tela) || 55;
            // Recalcular valores baseado no tamanho salvo
            const calculated = get().calculateValues(tamanho);
            set({
              tamanhoTela: tamanho,
              ...calculated,
              loading: false,
            });
          }
        } catch (error) {
          console.error('Erro ao carregar configurações:', error);
          set({ error: error.message, loading: false });
        }
      },
      
      // Fórmula matemática para calcular valores
      calculateValues: (tamanho) => {
        // Fórmula baseada no tamanho da tela em polegadas
        let fonteVersiculo = Math.round((tamanho * 1.2) + 20);
        let fonteHino = Math.round((tamanho * 0.9) + 15);
        let charsPorSlide = Math.round(250 - (tamanho * 1.5));
        
        // Limites de segurança
        fonteVersiculo = Math.max(40, Math.min(200, fonteVersiculo));
        fonteHino = Math.max(30, Math.min(150, fonteHino));
        charsPorSlide = Math.max(80, Math.min(250, charsPorSlide));
        
        return { fonteVersiculo, fonteHino, charsPorSlide };
      },
      
      // Atualizar tamanho da tela e recalcular
      setTamanhoTela: async (tamanho) => {
        const calculated = get().calculateValues(tamanho);
        set({
          tamanhoTela: tamanho,
          ...calculated,
        });
        
        // Salvar no servidor
        try {
          await api.updateSetting('tamanho_tela', tamanho);
        } catch (error) {
          console.error('Erro ao salvar configuração:', error);
        }
      },
      
      // Obter CSS variables para aplicar nos estilos
      getCSSVariables: () => {
        const state = get();
        return {
          '--fonte-versiculo': `${state.fonteVersiculo}px`,
          '--fonte-hino': `${state.fonteHino}px`,
          '--chars-por-slide': state.charsPorSlide,
        };
      },
    }),
    {
      name: 'biblia-hinario-settings',
      partialize: (state) => ({
        tamanhoTela: state.tamanhoTela,
        fonteVersiculo: state.fonteVersiculo,
        fonteHino: state.fonteHino,
        charsPorSlide: state.charsPorSlide,
      }),
    }
  )
);

