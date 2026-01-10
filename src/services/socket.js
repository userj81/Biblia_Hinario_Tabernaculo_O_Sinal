/**
 * Cliente Socket.io para comunicação em tempo real
 */

import { io } from 'socket.io-client';

// Detectar automaticamente o hostname/IP atual para funcionar na rede
// Se estiver em localhost, usa localhost, senão usa o IP/hostname atual
function getSocketURL() {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  
  // Se estiver em localhost, usar localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  
  // Caso contrário, usar o mesmo hostname e porta do backend
  // O backend está configurado para aceitar conexões de qualquer IP (0.0.0.0)
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
  const hostname = window.location.hostname;
  const port = '3000'; // Porta do backend
  
  return `${protocol}//${hostname}:${port}`;
}

const SOCKET_URL = getSocketURL();

let socketInstance = null;

/**
 * Conecta ao servidor Socket.io
 */
export function connectSocket() {
  if (socketInstance?.connected) {
    return socketInstance;
  }

  socketInstance = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socketInstance.on('connect', () => {
    console.log('🔌 Conectado ao Socket.io');
  });

  socketInstance.on('disconnect', () => {
    console.log('🔌 Desconectado do Socket.io');
  });

  socketInstance.on('connect_error', (error) => {
    console.error('❌ Erro de conexão Socket.io:', error);
  });

  return socketInstance;
}

/**
 * Desconecta do servidor Socket.io
 */
export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}

/**
 * Retorna a instância do socket (conecta se necessário)
 */
export function getSocket() {
  if (!socketInstance || !socketInstance.connected) {
    return connectSocket();
  }
  return socketInstance;
}

/**
 * Helpers para emitir eventos comuns
 */
export const socketHelpers = {
  showSlide(data) {
    getSocket().emit('show_slide', data);
  },

  blackout() {
    getSocket().emit('blackout');
  },

  clearBlackout() {
    getSocket().emit('clear_blackout');
  },

  changeBackground(data) {
    getSocket().emit('change_background', data);
  },

  changeSlide(direction, currentSlide = 0, totalSlides = 1) {
    getSocket().emit('change_slide', {
      direction,
      currentSlide,
      totalSlides,
    });
  },

  updateSettings(data) {
    getSocket().emit('update_settings', data);
  },
};

