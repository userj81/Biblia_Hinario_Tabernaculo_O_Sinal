/**
 * Handlers de eventos Socket.io para comunicação em tempo real
 * entre o painel de controle (/admin) e a tela de projeção (/projetor)
 */

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    // Evento: show_slide - Exibe um slide na projeção
    socket.on('show_slide', (data) => {
      console.log('📺 show_slide:', data);
      
      // Validar dados
      if (!data || (!data.text && !data.slides)) {
        socket.emit('error', { message: 'Dados inválidos para show_slide' });
        return;
      }

      // Broadcast para todos os clientes (incluindo o próprio)
      // Garantir que slides sejam objetos { text, isRefrain } ou strings
      let processedSlides = data.slides || [];
      if (processedSlides.length === 0 && data.text) {
        processedSlides = [data.text];
      }
      
      io.emit('render_slide', {
        type: data.type || 'text', // 'text', 'hino', 'verse', 'announcement'
        text: data.text || '',
        slides: processedSlides, // Manter estrutura original
        currentSlide: data.currentSlide || 0,
        totalSlides: data.totalSlides || processedSlides.length || 1,
        metadata: data.metadata || {},
      });
    });

    // Evento: blackout - Apaga a tela de projeção
    socket.on('blackout', () => {
      console.log('⚫ blackout');
      io.emit('render_blackout');
    });

    // Evento: clear_blackout - Remove o blackout
    socket.on('clear_blackout', () => {
      console.log('⚪ clear_blackout');
      io.emit('clear_blackout');
    });

    // Evento: change_background - Altera a imagem de fundo
    socket.on('change_background', (data) => {
      console.log('🖼️ change_background:', data);
      
      if (!data || (!data.url && !data.color)) {
        socket.emit('error', { message: 'Dados inválidos para change_background' });
        return;
      }

      io.emit('render_background', {
        url: data.url || null,
        color: data.color || '#000000',
      });
    });

    // Evento: change_slide - Navega entre slides (anterior/próximo)
    socket.on('change_slide', (data) => {
      console.log('➡️ change_slide:', data);
      
      const direction = data.direction; // 'next' ou 'prev'
      
      if (direction !== 'next' && direction !== 'prev') {
        socket.emit('error', { message: 'Direção inválida. Use "next" ou "prev"' });
        return;
      }

      io.emit('navigate_slide', {
        direction,
        currentSlide: data.currentSlide || 0,
        totalSlides: data.totalSlides || 1,
      });
    });

    // Evento: update_settings - Atualiza configurações de exibição
    socket.on('update_settings', (data) => {
      console.log('⚙️ update_settings:', data);
      
      io.emit('render_settings', {
        fontSize: data.fontSize,
        fontFamily: data.fontFamily,
        textColor: data.textColor,
        backgroundColor: data.backgroundColor,
        lineHeight: data.lineHeight,
      });
    });

    // Evento: disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Cliente desconectado: ${socket.id}`);
    });

    // Evento de erro
    socket.on('error', (error) => {
      console.error('❌ Erro no socket:', error);
    });
  });
}

