import { queries } from '../db.js';

/**
 * Rotas para Hinários - CRUD Completo
 */
async function hinariosRoutes(fastify, options) {
  // GET /api/hinarios - Lista todos os hinários
  fastify.get('/', async (request, reply) => {
    try {
      const hinarios = queries.getAllHinarios.all();
      return {
        success: true,
        data: hinarios,
        count: hinarios.length,
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar hinários',
      };
    }
  });

  // GET /api/hinarios/:id - Busca um hinário específico
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const hinario = queries.getHinarioById.get(parseInt(id));
      
      if (!hinario) {
        reply.code(404);
        return {
          success: false,
          error: 'Hinário não encontrado',
        };
      }

      return {
        success: true,
        data: hinario,
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar hinário',
      };
    }
  });

  // POST /api/hinarios - Criar novo hinário
  fastify.post('/', async (request, reply) => {
    try {
      const { nome, type } = request.body;
      
      if (!nome) {
        reply.code(400);
        return {
          success: false,
          error: 'Nome é obrigatório',
        };
      }
      
      const result = queries.createHinario.run(nome, type || 1);
      
      return {
        success: true,
        data: {
          id: result.lastInsertRowid,
          nome,
          type: type || 1,
        },
        message: 'Hinário criado com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao criar hinário',
      };
    }
  });

  // PUT /api/hinarios/:id - Atualizar hinário
  fastify.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { nome, type } = request.body;
      
      const hinario = queries.getHinarioById.get(parseInt(id));
      if (!hinario) {
        reply.code(404);
        return {
          success: false,
          error: 'Hinário não encontrado',
        };
      }
      
      queries.updateHinario.run(
        nome || hinario.nome,
        type !== undefined ? type : hinario.type,
        parseInt(id)
      );
      
      return {
        success: true,
        message: 'Hinário atualizado com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao atualizar hinário',
      };
    }
  });

  // DELETE /api/hinarios/:id - Excluir hinário
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      
      const hinario = queries.getHinarioById.get(parseInt(id));
      if (!hinario) {
        reply.code(404);
        return {
          success: false,
          error: 'Hinário não encontrado',
        };
      }
      
      // Verificar se tem hinos associados
      const hinos = queries.getHinosByHinario.all(parseInt(id));
      if (hinos.length > 0) {
        reply.code(400);
        return {
          success: false,
          error: `Não é possível excluir. Este hinário possui ${hinos.length} hino(s) associado(s).`,
        };
      }
      
      queries.deleteHinario.run(parseInt(id));
      
      return {
        success: true,
        message: 'Hinário excluído com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao excluir hinário',
      };
    }
  });
}

export default hinariosRoutes;
