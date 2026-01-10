import { queries } from '../db.js';

/**
 * Rotas para Configurações do Sistema
 */
async function settingsRoutes(fastify, options) {
  // GET /api/settings - Buscar todas as configurações
  fastify.get('/', async (request, reply) => {
    try {
      const settings = queries.getAllSettings.all();
      const settingsObj = {};
      settings.forEach(s => {
        settingsObj[s.chave] = s.valor;
      });
      
      return {
        success: true,
        data: settingsObj,
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar configurações',
      };
    }
  });

  // GET /api/settings/:chave - Buscar uma configuração específica
  fastify.get('/:chave', async (request, reply) => {
    try {
      const { chave } = request.params;
      const setting = queries.getSetting.get(chave);
      
      if (!setting) {
        reply.code(404);
        return {
          success: false,
          error: 'Configuração não encontrada',
        };
      }
      
      return {
        success: true,
        data: {
          chave,
          valor: setting.valor,
        },
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao buscar configuração',
      };
    }
  });

  // PUT /api/settings/:chave - Atualizar uma configuração
  fastify.put('/:chave', async (request, reply) => {
    try {
      const { chave } = request.params;
      const { valor } = request.body;
      
      if (valor === undefined) {
        reply.code(400);
        return {
          success: false,
          error: 'Valor é obrigatório',
        };
      }
      
      const now = new Date().toISOString();
      queries.setSetting.run(chave, String(valor), now);
      
      return {
        success: true,
        data: {
          chave,
          valor: String(valor),
        },
        message: 'Configuração atualizada com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao atualizar configuração',
      };
    }
  });

  // POST /api/settings - Atualizar múltiplas configurações
  fastify.post('/', async (request, reply) => {
    try {
      const settings = request.body;
      
      if (!settings || typeof settings !== 'object') {
        reply.code(400);
        return {
          success: false,
          error: 'Configurações inválidas',
        };
      }
      
      const now = new Date().toISOString();
      Object.entries(settings).forEach(([chave, valor]) => {
        queries.setSetting.run(chave, String(valor), now);
      });
      
      return {
        success: true,
        message: 'Configurações atualizadas com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao atualizar configurações',
      };
    }
  });

  // GET /api/settings/calculate/:tamanho - Calcular valores baseado no tamanho da tela
  fastify.get('/calculate/:tamanho', async (request, reply) => {
    try {
      const tamanho = parseFloat(request.params.tamanho);
      
      if (isNaN(tamanho) || tamanho < 10 || tamanho > 300) {
        reply.code(400);
        return {
          success: false,
          error: 'Tamanho da tela deve ser entre 10 e 300 polegadas',
        };
      }
      
      // Fórmula matemática para cálculo
      let fonteVersiculo = Math.round((tamanho * 1.2) + 20);
      let fonteHino = Math.round((tamanho * 0.9) + 15);
      let charsPorSlide = Math.round(250 - (tamanho * 1.5));
      
      // Limites de segurança
      fonteVersiculo = Math.max(40, Math.min(200, fonteVersiculo));
      fonteHino = Math.max(30, Math.min(150, fonteHino));
      charsPorSlide = Math.max(80, Math.min(250, charsPorSlide));
      
      return {
        success: true,
        data: {
          tamanhoTela: tamanho,
          fonteVersiculo,
          fonteHino,
          charsPorSlide,
        },
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao calcular configurações',
      };
    }
  });
}

export default settingsRoutes;

