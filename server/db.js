import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o banco de dados herdado
const dbPath = path.join(__dirname, '../data/bh.db');

// Criar conexão com o banco SQLite
const db = new Database(dbPath);

// Habilitar WAL mode para melhor performance em leituras concorrentes
db.pragma('journal_mode = WAL');

// Preparar queries comuns para cache
const queries = {
  // ==========================================
  // HINÁRIOS
  // ==========================================
  getAllHinarios: db.prepare('SELECT id, nome, type FROM hinario ORDER BY id'),
  getHinarioById: db.prepare('SELECT id, nome, type FROM hinario WHERE id = ?'),
  createHinario: db.prepare('INSERT INTO hinario (nome, type) VALUES (?, ?)'),
  updateHinario: db.prepare('UPDATE hinario SET nome = ?, type = ? WHERE id = ?'),
  deleteHinario: db.prepare('DELETE FROM hinario WHERE id = ?'),
  
  // ==========================================
  // HINOS
  // ==========================================
  getAllHinos: db.prepare('SELECT id, hinario_id, numero, nome, texto FROM hino ORDER BY hinario_id, numero'),
  getHinosByHinario: db.prepare('SELECT id, hinario_id, numero, nome, texto FROM hino WHERE hinario_id = ? ORDER BY numero'),
  getHinoById: db.prepare('SELECT id, hinario_id, numero, nome, texto FROM hino WHERE id = ?'),
  searchHinosByName: db.prepare('SELECT id, hinario_id, numero, nome, texto FROM hino WHERE nome LIKE ? ORDER BY hinario_id, numero'),
  searchHinosByNumber: db.prepare('SELECT id, hinario_id, numero, nome, texto FROM hino WHERE hinario_id = ? AND numero = ?'),
  createHino: db.prepare('INSERT INTO hino (hinario_id, numero, nome, texto) VALUES (?, ?, ?, ?)'),
  updateHino: db.prepare('UPDATE hino SET hinario_id = ?, numero = ?, nome = ?, texto = ? WHERE id = ?'),
  deleteHino: db.prepare('DELETE FROM hino WHERE id = ?'),
  
  // ==========================================
  // BÍBLIA
  // ==========================================
  getAllLivros: db.prepare('SELECT id, livros FROM Biblia_Livros ORDER BY id'),
  getLivroById: db.prepare('SELECT id, livros FROM Biblia_Livros WHERE id = ?'),
  searchLivrosByName: db.prepare('SELECT id, livros FROM Biblia_Livros WHERE livros LIKE ? ORDER BY id'),
  getVersiculosByLivroCapitulo: db.prepare('SELECT codigo, livroid, capitulo, versiculo, texto, cabecalho, marcado, anotacao FROM Biblia WHERE livroid = ? AND capitulo = ? ORDER BY versiculo'),
  getVersiculoByLivroCapituloVersiculo: db.prepare('SELECT codigo, livroid, capitulo, versiculo, texto, cabecalho, marcado, anotacao FROM Biblia WHERE livroid = ? AND capitulo = ? AND versiculo = ?'),
  getCapitulosByLivro: db.prepare('SELECT DISTINCT capitulo FROM Biblia WHERE livroid = ? ORDER BY capitulo'),
  searchVersiculosByText: db.prepare('SELECT b.codigo, b.livroid, b.capitulo, b.versiculo, b.texto, l.livros as livro_nome FROM Biblia b JOIN Biblia_Livros l ON b.livroid = l.id WHERE b.texto LIKE ? ORDER BY b.livroid, b.capitulo, b.versiculo LIMIT 50'),
  getVersiculosRange: db.prepare('SELECT codigo, livroid, capitulo, versiculo, texto FROM Biblia WHERE livroid = ? AND capitulo = ? AND versiculo >= ? AND versiculo <= ? ORDER BY versiculo'),
  
  // ==========================================
  // CONFIGURAÇÕES
  // ==========================================
  getSetting: db.prepare('SELECT valor FROM settings WHERE chave = ?'),
  getAllSettings: db.prepare('SELECT chave, valor FROM settings'),
  setSetting: db.prepare('INSERT OR REPLACE INTO settings (chave, valor, atualizado_em) VALUES (?, ?, ?)'),
  
  // ==========================================
  // LEITURAS SALVAS
  // ==========================================
  getAllLeituras: db.prepare('SELECT id, nome, criado_em, atualizado_em FROM leituras ORDER BY criado_em DESC'),
  getLeituraById: db.prepare('SELECT id, nome, criado_em, atualizado_em FROM leituras WHERE id = ?'),
  createLeitura: db.prepare('INSERT INTO leituras (nome) VALUES (?)'),
  updateLeitura: db.prepare('UPDATE leituras SET nome = ?, atualizado_em = ? WHERE id = ?'),
  deleteLeitura: db.prepare('DELETE FROM leituras WHERE id = ?'),
  
  // Versículos das leituras
  getLeituraVersiculos: db.prepare('SELECT id, leitura_id, livro_id, livro_nome, capitulo, versiculo_inicio, versiculo_fim, ordem FROM leitura_versiculos WHERE leitura_id = ? ORDER BY ordem'),
  addLeituraVersiculo: db.prepare('INSERT INTO leitura_versiculos (leitura_id, livro_id, livro_nome, capitulo, versiculo_inicio, versiculo_fim, ordem) VALUES (?, ?, ?, ?, ?, ?, ?)'),
  deleteLeituraVersiculos: db.prepare('DELETE FROM leitura_versiculos WHERE leitura_id = ?'),
  deleteLeituraVersiculo: db.prepare('DELETE FROM leitura_versiculos WHERE id = ?'),
  
  // ==========================================
  // ANÚNCIOS
  // ==========================================
  getAllAnuncios: db.prepare('SELECT id, nome, titulo, criado_em FROM anuncios ORDER BY criado_em DESC'),
  getAnuncioById: db.prepare('SELECT id, nome, titulo, criado_em FROM anuncios WHERE id = ?'),
  createAnuncio: db.prepare('INSERT INTO anuncios (nome, titulo) VALUES (?, ?)'),
  updateAnuncio: db.prepare('UPDATE anuncios SET nome = ?, titulo = ? WHERE id = ?'),
  deleteAnuncio: db.prepare('DELETE FROM anuncios WHERE id = ?'),
  
  // Versículos dos anúncios
  getAnuncioVersiculos: db.prepare('SELECT id, anuncio_id, livro_id, livro_nome, capitulo, versiculo_inicio, versiculo_fim, ordem FROM anuncio_versiculos WHERE anuncio_id = ? ORDER BY ordem'),
  addAnuncioVersiculo: db.prepare('INSERT INTO anuncio_versiculos (anuncio_id, livro_id, livro_nome, capitulo, versiculo_inicio, versiculo_fim, ordem) VALUES (?, ?, ?, ?, ?, ?, ?)'),
  deleteAnuncioVersiculos: db.prepare('DELETE FROM anuncio_versiculos WHERE anuncio_id = ?'),
  deleteAnuncioVersiculo: db.prepare('DELETE FROM anuncio_versiculos WHERE id = ?'),
};

/**
 * Processa o texto de um hino e divide em slides
 * Regras:
 * - CADA LINHA = 1 SLIDE
 * - Linhas que começam com * são refrão/coro (marcadas como isRefrain)
 * - Linhas vazias são ignoradas
 * - Linhas muito longas (> 60 chars) são divididas automaticamente
 * @param {string} texto - Texto completo do hino
 * @returns {Array} Array de slides, cada slide contém { text, isRefrain }
 */
export function processarHinoEmSlides(texto) {
  if (!texto) return [];

  const slides = [];

  // Dividir por linhas (cada linha = 1 slide)
  const linhas = texto.split('\n');

  for (const linha of linhas) {
    const trimmedLine = linha.trim();

    // Ignorar linhas vazias
    if (!trimmedLine) continue;

    // Verificar se é refrão (começa com *)
    const isRefrain = trimmedLine.startsWith('*');

    // Remover o asterisco do início para exibição
    const displayText = isRefrain ? trimmedLine.replace(/^\*+/, '').trim() : trimmedLine;

    if (displayText) {
      // Quebrar linhas muito longas automaticamente
      const processedSlides = dividirLinhaLonga(displayText, isRefrain);

      // Adicionar todos os slides processados
      slides.push(...processedSlides);
    }
  }

  return slides;
}

/**
 * Divide uma linha muito longa em múltiplos slides
 * @param {string} texto - Texto da linha
 * @param {boolean} isRefrain - Se é refrão
 * @returns {Array} Array de slides
 */
function dividirLinhaLonga(texto, isRefrain) {
  const MAX_CHARS_POR_LINHA = 60; // Limite para boa legibilidade

  if (texto.length <= MAX_CHARS_POR_LINHA) {
    // Linha curta, retorna como está
    return [{ text: texto, isRefrain }];
  }

  const slides = [];
  let remainingText = texto;

  while (remainingText.length > 0) {
    if (remainingText.length <= MAX_CHARS_POR_LINHA) {
      // Resto cabe em um slide
      slides.push({ text: remainingText, isRefrain });
      break;
    }

    // Encontrar ponto de quebra ideal (espaço ou pontuação)
    let breakPoint = MAX_CHARS_POR_LINHA;

    // Priorizar quebra em pontuação
    const punctuation = ['; ', ': ', ', ', '. ', ' '];
    for (const punct of punctuation) {
      const lastIndex = remainingText.lastIndexOf(punct, MAX_CHARS_POR_LINHA);
      if (lastIndex > MAX_CHARS_POR_LINHA * 0.6) { // Pelo menos 60% do limite
        breakPoint = lastIndex + (punct === ' ' ? 0 : punct.length);
        break;
      }
    }

    // Se não encontrou pontuação, quebrar no espaço
    if (breakPoint === MAX_CHARS_POR_LINHA) {
      const lastSpace = remainingText.lastIndexOf(' ', MAX_CHARS_POR_LINHA);
      if (lastSpace > MAX_CHARS_POR_LINHA * 0.6) {
        breakPoint = lastSpace;
      }
    }

    // Adicionar parte do texto como slide
    const part = remainingText.slice(0, breakPoint).trim();
    if (part) {
      slides.push({ text: part, isRefrain });
    }

    // Continuar com o resto
    remainingText = remainingText.slice(breakPoint).trim();
  }

  return slides;
}

export default db;
export { queries };

