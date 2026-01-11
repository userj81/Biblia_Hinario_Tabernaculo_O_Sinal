import { queries, converterParaMaiusculas } from '../db.js';

async function bibliaRoutes(fastify, options) {
  // GET /api/biblia/livros - Lista todos os livros da Bíblia
  fastify.get('/livros', async (request, reply) => {
    try {
      const livros = queries.getAllLivros.all();
      return {
        success: true,
        data: livros,
        count: livros.length,
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar livros',
      };
    }
  });

  // GET /api/biblia/livros/:id - Busca um livro específico
  fastify.get('/livros/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const livro = queries.getLivroById.get(parseInt(id));

      if (!livro) {
        reply.code(404);
        return {
          success: false,
          error: 'Livro não encontrado',
        };
      }

      return {
        success: true,
        data: livro,
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar livro',
      };
    }
  });

  // GET /api/biblia/versiculos?livro=X&capitulo=Y - Busca versículos de um capítulo
  fastify.get('/versiculos', async (request, reply) => {
    try {
      const { livro, capitulo } = request.query;

      if (!livro || !capitulo) {
        reply.code(400);
        return {
          success: false,
          error: 'Parâmetros livro e capitulo são obrigatórios',
        };
      }

      const versiculos = queries.getVersiculosByLivroCapitulo.all(
        parseInt(livro),
        parseInt(capitulo)
      );

      // CONVERTER TEXTOS DOS VERSÍCULOS PARA CAIXA ALTA (MAIÚSCULAS)
      const versiculosMaiusculos = versiculos.map(versiculo => ({
        ...versiculo,
        texto: converterParaMaiusculas(versiculo.texto)
      }));

      return {
        success: true,
        data: versiculosMaiusculos,
        count: versiculosMaiusculos.length,
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar versículos',
      };
    }
  });

  // GET /api/biblia/versiculo?livro=X&capitulo=Y&versiculo=Z - Busca um versículo específico
  fastify.get('/versiculo', async (request, reply) => {
    try {
      const { livro, capitulo, versiculo } = request.query;

      if (!livro || !capitulo || !versiculo) {
        reply.code(400);
        return {
          success: false,
          error: 'Parâmetros livro, capitulo e versiculo são obrigatórios',
        };
      }

      const versiculoData = queries.getVersiculoByLivroCapituloVersiculo.get(
        parseInt(livro),
        parseInt(capitulo),
        parseInt(versiculo)
      );

      if (!versiculoData) {
        reply.code(404);
        return {
          success: false,
          error: 'Versículo não encontrado',
        };
      }

      // CONVERTER TEXTO DO VERSÍCULO PARA CAIXA ALTA (MAIÚSCULAS)
      const versiculoMaiusculo = {
        ...versiculoData,
        texto: converterParaMaiusculas(versiculoData.texto)
      };

      return {
        success: true,
        data: versiculoMaiusculo,
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar versículo',
      };
    }
  });

  // GET /api/biblia/livros/:id/capitulos - Lista capítulos de um livro
  fastify.get('/livros/:id/capitulos', async (request, reply) => {
    try {
      const { id } = request.params;
      const livro = queries.getLivroById.get(parseInt(id));

      if (!livro) {
        reply.code(404);
        return {
          success: false,
          error: 'Livro não encontrado',
        };
      }

      const capitulos = queries.getCapitulosByLivro.all(parseInt(id));

      return {
        success: true,
        data: {
          livro: {
            id: livro.id,
            nome: livro.livros,
          },
          capitulos: capitulos.map(c => c.capitulo),
          totalCapitulos: capitulos.length,
        },
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar capítulos',
      };
    }
  });

  // GET /api/biblia/search?q=termo - Busca por texto nos versículos ou nome do livro
  fastify.get('/search', async (request, reply) => {
    try {
      const { q } = request.query;

      if (!q || q.trim().length < 2) {
        reply.code(400);
        return {
          success: false,
          error: 'Termo de busca deve ter pelo menos 2 caracteres',
        };
      }

      const termo = `%${q.trim()}%`;
      
      // Buscar nos livros
      const livros = queries.searchLivrosByName.all(termo);
      
      // Buscar nos versículos
      const versiculos = queries.searchVersiculosByText.all(termo);

      // CONVERTER TEXTOS DOS VERSÍCULOS PARA CAIXA ALTA (MAIÚSCULAS)
      const versiculosMaiusculos = versiculos.map(versiculo => ({
        ...versiculo,
        texto: converterParaMaiusculas(versiculo.texto)
      }));

      return {
        success: true,
        data: {
          livros,
          versiculos: versiculosMaiusculos,
        },
        count: {
          livros: livros.length,
          versiculos: versiculosMaiusculos.length,
        },
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar',
      };
    }
  });
}

export default bibliaRoutes;

