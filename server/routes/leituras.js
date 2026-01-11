import { queries, converterParaMaiusculas } from '../db.js';

/**
 * Rotas para Leituras Salvas
 */
async function leiturasRoutes(fastify, options) {
  // GET /api/leituras - Listar todas as leituras
  fastify.get('/', async (request, reply) => {
    try {
      const leituras = queries.getAllLeituras.all();
      
      // Buscar versículos de cada leitura
      const leiturasComVersiculos = leituras.map(leitura => {
        const versiculos = queries.getLeituraVersiculos.all(leitura.id);
        return {
          ...leitura,
          versiculos,
        };
      });
      
      return {
        success: true,
        data: leiturasComVersiculos,
        count: leiturasComVersiculos.length,
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar leituras',
      };
    }
  });

  // GET /api/leituras/:id - Buscar uma leitura específica
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const leitura = queries.getLeituraById.get(parseInt(id));
      
      if (!leitura) {
        reply.code(404);
        return {
          success: false,
          error: 'Leitura não encontrada',
        };
      }
      
      const versiculos = queries.getLeituraVersiculos.all(parseInt(id));
      
      return {
        success: true,
        data: {
          ...leitura,
          versiculos,
        },
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar leitura',
      };
    }
  });

  // POST /api/leituras - Criar nova leitura
  fastify.post('/', async (request, reply) => {
    try {
      const { nome, versiculos } = request.body;
      
      if (!nome) {
        reply.code(400);
        return {
          success: false,
          error: 'Nome é obrigatório',
        };
      }
      
      // Criar leitura
      const result = queries.createLeitura.run(nome);
      const leituraId = result.lastInsertRowid;
      
      // Adicionar versículos
      if (versiculos && Array.isArray(versiculos)) {
        versiculos.forEach((v, index) => {
          queries.addLeituraVersiculo.run(
            leituraId,
            v.livro_id,
            v.livro_nome,
            v.capitulo,
            v.versiculo_inicio,
            v.versiculo_fim,
            index + 1
          );
        });
      }
      
      return {
        success: true,
        data: {
          id: leituraId,
          nome,
        },
        message: 'Leitura criada com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao criar leitura',
      };
    }
  });

  // PUT /api/leituras/:id - Atualizar leitura
  fastify.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { nome, versiculos } = request.body;
      
      const leitura = queries.getLeituraById.get(parseInt(id));
      if (!leitura) {
        reply.code(404);
        return {
          success: false,
          error: 'Leitura não encontrada',
        };
      }
      
      // Atualizar nome
      if (nome) {
        const now = new Date().toISOString();
        queries.updateLeitura.run(nome, now, parseInt(id));
      }
      
      // Atualizar versículos (deletar e recriar)
      if (versiculos && Array.isArray(versiculos)) {
        queries.deleteLeituraVersiculos.run(parseInt(id));
        versiculos.forEach((v, index) => {
          queries.addLeituraVersiculo.run(
            parseInt(id),
            v.livro_id,
            v.livro_nome,
            v.capitulo,
            v.versiculo_inicio,
            v.versiculo_fim,
            index + 1
          );
        });
      }
      
      return {
        success: true,
        message: 'Leitura atualizada com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao atualizar leitura',
      };
    }
  });

  // DELETE /api/leituras/:id - Excluir leitura
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      
      const leitura = queries.getLeituraById.get(parseInt(id));
      if (!leitura) {
        reply.code(404);
        return {
          success: false,
          error: 'Leitura não encontrada',
        };
      }
      
      // Deletar versículos primeiro (CASCADE não funciona automaticamente no SQLite)
      queries.deleteLeituraVersiculos.run(parseInt(id));
      queries.deleteLeitura.run(parseInt(id));
      
      return {
        success: true,
        message: 'Leitura excluída com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao excluir leitura',
      };
    }
  });

  // GET /api/leituras/:id/projetar - Buscar versículos para projeção
  fastify.get('/:id/projetar', async (request, reply) => {
    try {
      const { id } = request.params;
      
      const leitura = queries.getLeituraById.get(parseInt(id));
      if (!leitura) {
        reply.code(404);
        return {
          success: false,
          error: 'Leitura não encontrada',
        };
      }
      
      const versiculosRef = queries.getLeituraVersiculos.all(parseInt(id));
      
      // Buscar texto completo de cada versículo
      const slides = [];
      for (const ref of versiculosRef) {
        const textos = queries.getVersiculosRange.all(
          ref.livro_id,
          ref.capitulo,
          ref.versiculo_inicio,
          ref.versiculo_fim
        );
        
        textos.forEach(t => {
          slides.push({
            text: converterParaMaiusculas(t.texto),
            versiculo: t.versiculo,
            livro: ref.livro_nome,
            capitulo: ref.capitulo,
            referencia: `${ref.livro_nome} ${ref.capitulo}:${t.versiculo}`,
          });
        });
      }
      
      return {
        success: true,
        data: {
          leitura: leitura.nome,
          slides,
          totalSlides: slides.length,
        },
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar versículos para projeção',
      };
    }
  });
}

export default leiturasRoutes;

