/**
 * Cliente HTTP para comunicação com a API REST
 * Usa URLs relativas para funcionar com o proxy do Vite
 */

// Usar URL relativa para funcionar com o proxy do Vite
// Isso permite acesso tanto por localhost quanto pela rede
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Faz uma requisição HTTP
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Erro na requisição ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // ==========================================
  // HINÁRIOS
  // ==========================================
  async getHinarios() {
    return request('/hinarios');
  },

  async getHinario(id) {
    return request(`/hinarios/${id}`);
  },

  async createHinario(data) {
    return request('/hinarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateHinario(id, data) {
    return request(`/hinarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteHinario(id) {
    return request(`/hinarios/${id}`, {
      method: 'DELETE',
    });
  },

  // ==========================================
  // HINOS
  // ==========================================
  async getHinos(hinarioId = null) {
    if (hinarioId) {
      return request(`/hinos?hinario_id=${hinarioId}`);
    }
    return request('/hinos');
  },

  async getHino(id) {
    return request(`/hinos/${id}`);
  },

  async getHinoSlides(id) {
    return request(`/hinos/${id}/slides`);
  },

  async searchHinos(query, hinarioId = null) {
    const params = new URLSearchParams({ q: query });
    if (hinarioId) params.append('hinario_id', hinarioId);
    return request(`/hinos/search?${params}`);
  },

  async createHino(data) {
    return request('/hinos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateHino(id, data) {
    return request(`/hinos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteHino(id) {
    return request(`/hinos/${id}`, {
      method: 'DELETE',
    });
  },

  // ==========================================
  // BÍBLIA
  // ==========================================
  async getLivros() {
    return request('/biblia/livros');
  },

  async getLivro(id) {
    return request(`/biblia/livros/${id}`);
  },

  async getCapitulos(livroId) {
    return request(`/biblia/livros/${livroId}/capitulos`);
  },

  async getVersiculos(livroId, capitulo) {
    return request(`/biblia/versiculos?livro=${livroId}&capitulo=${capitulo}`);
  },

  async getVersiculo(livroId, capitulo, versiculo) {
    return request(`/biblia/versiculo?livro=${livroId}&capitulo=${capitulo}&versiculo=${versiculo}`);
  },

  async searchBiblia(query) {
    return request(`/biblia/search?q=${encodeURIComponent(query)}`);
  },

  // ==========================================
  // CURSO
  // ==========================================
  async getLivrosCurso() {
    return request('/curso/livros');
  },

  async getLivroCurso(id) {
    return request(`/curso/livros/${id}`);
  },

  async getSlidesCurso(livroId) {
    return request(`/curso/slides?livro_id=${livroId}`);
  },

  async getSlideCurso(livroId, slideId) {
    return request(`/curso/slide?livro_id=${livroId}&slide_id=${slideId}`);
  },

  async getSlidesLivro(livroId) {
    return request(`/curso/livros/${livroId}/slides`);
  },

  async searchCurso(query) {
    return request(`/curso/search?q=${encodeURIComponent(query)}`);
  },

  async uploadPDFCurso(livroId, pdfFile) {
    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('livro_id', livroId);

    return request('/curso/upload', {
      method: 'POST',
      headers: {}, // Não definir Content-Type para FormData
      body: formData,
    });
  },

  // ==========================================
  // CONFIGURAÇÕES
  // ==========================================
  async getSettings() {
    return request('/settings');
  },

  async getSetting(chave) {
    return request(`/settings/${chave}`);
  },

  async updateSetting(chave, valor) {
    return request(`/settings/${chave}`, {
      method: 'PUT',
      body: JSON.stringify({ valor }),
    });
  },

  async updateSettings(settings) {
    return request('/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  },

  async calculateSettings(tamanhoTela) {
    return request(`/settings/calculate/${tamanhoTela}`);
  },

  // ==========================================
  // LEITURAS SALVAS
  // ==========================================
  async getLeituras() {
    return request('/leituras');
  },

  async getLeitura(id) {
    return request(`/leituras/${id}`);
  },

  async createLeitura(data) {
    return request('/leituras', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateLeitura(id, data) {
    return request(`/leituras/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteLeitura(id) {
    return request(`/leituras/${id}`, {
      method: 'DELETE',
    });
  },

  async projetarLeitura(id) {
    return request(`/leituras/${id}/projetar`);
  },

  // ==========================================
  // ANÚNCIOS
  // ==========================================
  async getAnuncios() {
    return request('/anuncios');
  },

  async getAnuncio(id) {
    return request(`/anuncios/${id}`);
  },

  async getTitulos() {
    return request('/anuncios/titulos');
  },

  async createAnuncio(data) {
    return request('/anuncios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAnuncio(id, data) {
    return request(`/anuncios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteAnuncio(id) {
    return request(`/anuncios/${id}`, {
      method: 'DELETE',
    });
  },

  async projetarAnuncio(id) {
    return request(`/anuncios/${id}/projetar`);
  },
};
