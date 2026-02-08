import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';

/**
 * Store para gerenciar configurações do sistema
 * Inclui fórmula matemática para ajuste automático baseado no tamanho da tela
 * E suporte para ajuste MANUAL de fontes
 */
export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Estado
      tamanhoTela: 55, // Tamanho padrão em polegadas
      fonteVersiculo: 86,
      fonteHino: 65,
      charsPorSlide: 168,
      modoFonteManual: false, // NOVO: toggle entre automático e manual
      loading: false,
      error: null,
      
      // Carregar configurações do servidor
      loadSettings: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.getSettings();
          if (response.success && response.data) {
            const tamanho = parseInt(response.data.tamanho_tela) || 55;
            const modoManual = response.data.modo_fonte_manual === 'true';
            
            // Se modo manual, usar valores salvos; se não, recalcular
            if (modoManual && response.data.fonte_hino && response.data.fonte_versiculo) {
              set({
                tamanhoTela: tamanho,
                fonteHino: parseInt(response.data.fonte_hino) || 65,
                fonteVersiculo: parseInt(response.data.fonte_versiculo) || 86,
                charsPorSlide: parseInt(response.data.chars_por_slide) || 168,
                modoFonteManual: true,
                loading: false,
              });
            } else {
              const calculated = get().calculateValues(tamanho);
              set({
                tamanhoTela: tamanho,
                ...calculated,
                modoFonteManual: false,
                loading: false,
              });
            }
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
      
      // Atualizar tamanho da tela e recalcular (apenas se modo automático)
      setTamanhoTela: async (tamanho) => {
        const state = get();
        const calculated = state.modoFonteManual ? {} : state.calculateValues(tamanho);
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
      
      // NOVO: Alternar entre modo automático e manual
      setModoFonteManual: async (manual) => {
        const state = get();
        
        if (!manual) {
          // Voltando para modo automático: recalcular valores
          const calculated = state.calculateValues(state.tamanhoTela);
          set({
            modoFonteManual: false,
            ...calculated,
          });
        } else {
          // Entrando em modo manual: manter valores atuais
          set({ modoFonteManual: true });
        }
        
        // Salvar preferência no servidor
        try {
          await api.updateSetting('modo_fonte_manual', manual ? 'true' : 'false');
        } catch (error) {
          console.error('Erro ao salvar modo de fonte:', error);
        }
      },
      
      // NOVO: Definir fonte do hino manualmente
      setFonteHino: async (size) => {
        const clampedSize = Math.max(30, Math.min(150, size));
        set({ fonteHino: clampedSize });
        
        try {
          await api.updateSetting('fonte_hino', clampedSize);
        } catch (error) {
          console.error('Erro ao salvar fonte do hino:', error);
        }
      },
      
      // NOVO: Definir fonte do versículo manualmente
      setFonteVersiculo: async (size) => {
        const clampedSize = Math.max(40, Math.min(200, size));
        set({ fonteVersiculo: clampedSize });
        
        try {
          await api.updateSetting('fonte_versiculo', clampedSize);
        } catch (error) {
          console.error('Erro ao salvar fonte do versículo:', error);
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
        modoFonteManual: state.modoFonteManual,
      }),
    }
  )
);

