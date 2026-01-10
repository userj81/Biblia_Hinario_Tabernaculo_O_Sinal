import { queries, processarHinoEmSlides } from '../db.js';

async function hinosRoutes(fastify, options) {
  // GET /api/hinos?hinario_id=X - Lista hinos de um hinário específico
  // GET /api/hinos - Lista todos os hinos (se hinario_id não for fornecido)
  fastify.get('/', async (request, reply) => {
    try {
      const { hinario_id } = request.query;

      let hinos;
      if (hinario_id) {
        // Buscar hinos de um hinário específico
        hinos = queries.getHinosByHinario.all(parseInt(hinario_id));
      } else {
        // Buscar todos os hinos de todos os hinários
        hinos = queries.getAllHinos.all();
      }
      
      return {
        success: true,
        data: hinos,
        count: hinos.length,
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar hinos',
      };
    }
  });

  // GET /api/hinos/:id - Busca um hino específico por ID
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const hino = queries.getHinoById.get(parseInt(id));

      if (!hino) {
        reply.code(404);
        return {
          success: false,
          error: 'Hino não encontrado',
        };
      }

      return {
        success: true,
        data: hino,
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar hino',
      };
    }
  });

  // GET /api/hinos/search?q=termo - Busca hinos por nome ou número
  fastify.get('/search', async (request, reply) => {
    try {
      const { q, hinario_id } = request.query;

      if (!q) {
        reply.code(400);
        return {
          success: false,
          error: 'Parâmetro q (termo de busca) é obrigatório',
        };
      }

      // Tentar buscar por número (se for um número)
      const numero = parseInt(q);
      if (!isNaN(numero) && hinario_id) {
        const hino = queries.searchHinosByNumber.get(parseInt(hinario_id), numero);
        if (hino) {
          return {
            success: true,
            data: [hino],
            count: 1,
          };
        }
      }

      // Buscar por nome (busca parcial)
      const termo = `%${q}%`;
      const hinos = queries.searchHinosByName.all(termo);

      return {
        success: true,
        data: hinos,
        count: hinos.length,
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar hinos',
      };
    }
  });

  // GET /api/hinos/:id/slides - Retorna slides do hino (quebrado por estrofes)
  fastify.get('/:id/slides', async (request, reply) => {
    try {
      const { id } = request.params;
      const hino = queries.getHinoById.get(parseInt(id));

      if (!hino) {
        reply.code(404);
        return {
          success: false,
          error: 'Hino não encontrado',
        };
      }

      const slides = processarHinoEmSlides(hino.texto);

      return {
        success: true,
        data: {
          hino: {
            id: hino.id,
            hinario_id: hino.hinario_id,
            numero: hino.numero,
            nome: hino.nome,
          },
          slides,
          totalSlides: slides.length,
        },
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao processar slides do hino',
      };
    }
  });

  // POST /api/hinos - Criar novo hino
  fastify.post('/', async (request, reply) => {
    try {
      const { hinario_id, numero, nome, texto } = request.body;
      
      if (!hinario_id || !nome) {
        reply.code(400);
        return {
          success: false,
          error: 'hinario_id e nome são obrigatórios',
        };
      }
      
      const result = queries.createHino.run(
        parseInt(hinario_id),
        numero || 0,
        nome,
        texto || ''
      );
      
      return {
        success: true,
        data: {
          id: result.lastInsertRowid,
          hinario_id: parseInt(hinario_id),
          numero: numero || 0,
          nome,
        },
        message: 'Hino criado com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao criar hino',
      };
    }
  });

  // PUT /api/hinos/:id - Atualizar hino
  fastify.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { hinario_id, numero, nome, texto } = request.body;
      
      const hino = queries.getHinoById.get(parseInt(id));
      if (!hino) {
        reply.code(404);
        return {
          success: false,
          error: 'Hino não encontrado',
        };
      }
      
      queries.updateHino.run(
        hinario_id !== undefined ? parseInt(hinario_id) : hino.hinario_id,
        numero !== undefined ? numero : hino.numero,
        nome || hino.nome,
        texto !== undefined ? texto : hino.texto,
        parseInt(id)
      );
      
      return {
        success: true,
        message: 'Hino atualizado com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao atualizar hino',
      };
    }
  });

  // DELETE /api/hinos/:id - Excluir hino
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      
      const hino = queries.getHinoById.get(parseInt(id));
      if (!hino) {
        reply.code(404);
        return {
          success: false,
          error: 'Hino não encontrado',
        };
      }
      
      queries.deleteHino.run(parseInt(id));
      
      return {
        success: true,
        message: 'Hino excluído com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao excluir hino',
      };
    }
  });
}

export default hinosRoutes;

