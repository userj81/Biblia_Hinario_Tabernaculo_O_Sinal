import { queries } from '../db.js';

/**
 * Rotas para Anúncios de Leitura
 * 
 * Títulos disponíveis: Pastor, Evangelista, Missionário, Diácono, Irmão, ou personalizado
 */
async function anunciosRoutes(fastify, options) {
  // GET /api/anuncios - Listar todos os anúncios
  fastify.get('/', async (request, reply) => {
    try {
      const anuncios = queries.getAllAnuncios.all();
      
      // Buscar versículos de cada anúncio
      const anunciosComVersiculos = anuncios.map(anuncio => {
        const versiculos = queries.getAnuncioVersiculos.all(anuncio.id);
        return {
          ...anuncio,
          versiculos,
        };
      });
      
      return {
        success: true,
        data: anunciosComVersiculos,
        count: anunciosComVersiculos.length,
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar anúncios',
      };
    }
  });

  // GET /api/anuncios/titulos - Listar títulos disponíveis
  fastify.get('/titulos', async (request, reply) => {
    return {
      success: true,
      data: [
        'Pastor',
        'Evangelista',
        'Missionário',
        'Diácono',
        'Irmão',
      ],
    };
  });

  // GET /api/anuncios/:id - Buscar um anúncio específico
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const anuncio = queries.getAnuncioById.get(parseInt(id));
      
      if (!anuncio) {
        reply.code(404);
        return {
          success: false,
          error: 'Anúncio não encontrado',
        };
      }
      
      const versiculos = queries.getAnuncioVersiculos.all(parseInt(id));
      
      return {
        success: true,
        data: {
          ...anuncio,
          versiculos,
        },
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar anúncio',
      };
    }
  });

  // POST /api/anuncios - Criar novo anúncio
  fastify.post('/', async (request, reply) => {
    try {
      const { nome, titulo, versiculos } = request.body;
      
      if (!nome) {
        reply.code(400);
        return {
          success: false,
          error: 'Nome é obrigatório',
        };
      }
      
      if (!versiculos || !Array.isArray(versiculos) || versiculos.length === 0) {
        reply.code(400);
        return {
          success: false,
          error: 'Pelo menos um versículo é obrigatório',
        };
      }
      
      // Criar anúncio
      const result = queries.createAnuncio.run(nome, titulo || null);
      const anuncioId = result.lastInsertRowid;
      
      // Adicionar versículos
      versiculos.forEach((v, index) => {
        queries.addAnuncioVersiculo.run(
          anuncioId,
          v.livro_id,
          v.livro_nome,
          v.capitulo,
          v.versiculo_inicio,
          v.versiculo_fim,
          index + 1
        );
      });
      
      return {
        success: true,
        data: {
          id: anuncioId,
          nome,
          titulo,
        },
        message: 'Anúncio criado com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao criar anúncio',
      };
    }
  });

  // PUT /api/anuncios/:id - Atualizar anúncio
  fastify.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { nome, titulo, versiculos } = request.body;
      
      const anuncio = queries.getAnuncioById.get(parseInt(id));
      if (!anuncio) {
        reply.code(404);
        return {
          success: false,
          error: 'Anúncio não encontrado',
        };
      }
      
      // Atualizar dados
      queries.updateAnuncio.run(
        nome || anuncio.nome,
        titulo !== undefined ? titulo : anuncio.titulo,
        parseInt(id)
      );
      
      // Atualizar versículos (deletar e recriar)
      if (versiculos && Array.isArray(versiculos)) {
        queries.deleteAnuncioVersiculos.run(parseInt(id));
        versiculos.forEach((v, index) => {
          queries.addAnuncioVersiculo.run(
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
        message: 'Anúncio atualizado com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao atualizar anúncio',
      };
    }
  });

  // DELETE /api/anuncios/:id - Excluir anúncio
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      
      const anuncio = queries.getAnuncioById.get(parseInt(id));
      if (!anuncio) {
        reply.code(404);
        return {
          success: false,
          error: 'Anúncio não encontrado',
        };
      }
      
      // Deletar versículos primeiro
      queries.deleteAnuncioVersiculos.run(parseInt(id));
      queries.deleteAnuncio.run(parseInt(id));
      
      return {
        success: true,
        message: 'Anúncio excluído com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao excluir anúncio',
      };
    }
  });

  // GET /api/anuncios/:id/projetar - Gerar slide de anúncio para projeção
  fastify.get('/:id/projetar', async (request, reply) => {
    try {
      const { id } = request.params;
      
      const anuncio = queries.getAnuncioById.get(parseInt(id));
      if (!anuncio) {
        reply.code(404);
        return {
          success: false,
          error: 'Anúncio não encontrado',
        };
      }
      
      const versiculosRef = queries.getAnuncioVersiculos.all(parseInt(id));
      
      // Formatar referências para exibição
      const referencias = versiculosRef.map(v => {
        if (v.versiculo_inicio === v.versiculo_fim) {
          return `${v.livro_nome} ${v.capitulo}:${v.versiculo_inicio}`;
        }
        return `${v.livro_nome} ${v.capitulo}:${v.versiculo_inicio}-${v.versiculo_fim}`;
      });
      
      // Formatar nome com título
      let nomeCompleto = anuncio.nome;
      if (anuncio.titulo) {
        nomeCompleto = `${anuncio.titulo} ${anuncio.nome}`;
      }
      
      return {
        success: true,
        data: {
          type: 'anuncio',
          nome: nomeCompleto,
          titulo: anuncio.titulo,
          referencias,
          slide: {
            type: 'anuncio',
            text: referencias.join('\n'),
            metadata: {
              nome: nomeCompleto,
              titulo: anuncio.titulo,
              referencias,
            },
          },
        },
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao gerar anúncio para projeção',
      };
    }
  });
}

export default anunciosRoutes;

