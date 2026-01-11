import { queries, converterParaMaiusculas } from '../db.js';

async function cursoRoutes(fastify, options) {
  // GET /api/curso/livros - Lista todos os livros do curso
  fastify.get('/livros', async (request, reply) => {
    try {
      const livros = queries.getAllLivrosCurso.all();
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
        error: 'Erro ao buscar livros do curso',
      };
    }
  });

  // GET /api/curso/livros/:id - Busca um livro específico do curso
  fastify.get('/livros/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const livro = queries.getLivroCursoById.get(parseInt(id));

      if (!livro) {
        reply.code(404);
        return {
          success: false,
          error: 'Livro do curso não encontrado',
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
        error: 'Erro ao buscar livro do curso',
      };
    }
  });

  // GET /api/curso/slides?livro_id=X - Busca slides de um livro do curso
  fastify.get('/slides', async (request, reply) => {
    try {
      const { livro_id } = request.query;

      if (!livro_id) {
        reply.code(400);
        return {
          success: false,
          error: 'Parâmetro livro_id é obrigatório',
        };
      }

      const slides = queries.getSlidesByLivroCurso.all(parseInt(livro_id));

      // CONVERTER TEXTOS DOS SLIDES PARA CAIXA ALTA (MAIÚSCULAS)
      const slidesMaiusculos = slides.map(slide => ({
        ...slide,
        texto: converterParaMaiusculas(slide.texto)
      }));

      return {
        success: true,
        data: slidesMaiusculos,
        count: slidesMaiusculos.length,
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar slides do curso',
      };
    }
  });

  // GET /api/curso/slide?livro_id=X&slide_id=Y - Busca um slide específico
  fastify.get('/slide', async (request, reply) => {
    try {
      const { livro_id, slide_id } = request.query;

      if (!livro_id || !slide_id) {
        reply.code(400);
        return {
          success: false,
          error: 'Parâmetros livro_id e slide_id são obrigatórios',
        };
      }

      const slide = queries.getSlideByLivroSlide.get(parseInt(livro_id), parseInt(slide_id));

      if (!slide) {
        reply.code(404);
        return {
          success: false,
          error: 'Slide não encontrado',
        };
      }

      // CONVERTER TEXTO DO SLIDE PARA CAIXA ALTA (MAIÚSCULAS)
      const slideMaiusculo = {
        ...slide,
        texto: converterParaMaiusculas(slide.texto)
      };

      return {
        success: true,
        data: slideMaiusculo,
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar slide',
      };
    }
  });

  // GET /api/curso/livros/:id/slides - Lista slides de um livro do curso
  fastify.get('/livros/:id/slides', async (request, reply) => {
    try {
      const { id } = request.params;
      const livro = queries.getLivroCursoById.get(parseInt(id));

      if (!livro) {
        reply.code(404);
        return {
          success: false,
          error: 'Livro do curso não encontrado',
        };
      }

      const slides = queries.getSlidesByLivroCurso.all(parseInt(id));

      return {
        success: true,
        data: {
          livro: {
            id: livro.id,
            nome: livro.nome,
          },
          slides: slides.map(s => s.numero),
          totalSlides: slides.length,
        },
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar slides do livro',
      };
    }
  });

  // GET /api/curso/search?q=termo - Busca por texto nos slides do curso
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
      const livros = queries.searchLivrosCursoByName.all(termo);

      // Buscar nos slides
      const slides = queries.searchSlidesByText.all(termo);

      return {
        success: true,
        data: {
          livros,
          slides,
        },
        count: {
          livros: livros.length,
          slides: slides.length,
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

  // POST /api/curso/upload - Upload de PDF para processar
  fastify.post('/upload', async (request, reply) => {
    try {
      const { livro_id } = request.body;

      if (!livro_id) {
        reply.code(400);
        return {
          success: false,
          error: 'livro_id é obrigatório',
        };
      }

      // Aqui seria implementado o processamento do PDF
      // Por enquanto, apenas retorna sucesso
      return {
        success: true,
        message: 'PDF enviado para processamento',
        livro_id: parseInt(livro_id),
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao fazer upload do PDF',
      };
    }
  });
}

export default cursoRoutes;