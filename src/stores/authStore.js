/**
 * Store Zustand para gerenciar autenticação
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Usar URL relativa para funcionar com o proxy do Vite
// Isso permite acesso tanto por localhost quanto pela rede
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      loading: false,
      error: null,

      login: async (password) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Incluir cookies
            body: JSON.stringify({ password }),
          });

          // Verificar se a resposta é JSON válida
          let data;
          try {
            data = await response.json();
          } catch (jsonError) {
            throw new Error('Servidor não está respondendo. Verifique se o backend está rodando na porta 3000.');
          }

          if (!response.ok) {
            throw new Error(data.error || 'Erro ao fazer login');
          }

          set({
            isAuthenticated: true,
            token: data.token,
            loading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          let errorMessage = error.message;
          
          // Melhorar mensagens de erro de rede
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 3000.';
          }
          
          set({
            isAuthenticated: false,
            token: null,
            loading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          const token = get().token;
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token || '',
            },
            credentials: 'include',
          });
        } catch (error) {
          console.error('Erro ao fazer logout:', error);
        } finally {
          set({
            isAuthenticated: false,
            token: null,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        try {
          const token = get().token;
          const response = await fetch(`${API_BASE_URL}/auth/check`, {
            headers: {
              'x-auth-token': token || '',
            },
            credentials: 'include',
          });

          const data = await response.json();
          set({ isAuthenticated: data.authenticated || false });
          return data.authenticated || false;
        } catch (error) {
          set({ isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

