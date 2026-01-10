import { verifyPassword, createSession, removeSession, verifyToken } from '../auth.js';

async function authRoutes(fastify, options) {
  // POST /api/auth/login - Fazer login
  fastify.post('/login', async (request, reply) => {
    try {
      const { password } = request.body;

      if (!password) {
        reply.code(400);
        return {
          success: false,
          error: 'Senha é obrigatória',
        };
      }

      if (!verifyPassword(password)) {
        reply.code(401);
        return {
          success: false,
          error: 'Senha incorreta',
        };
      }

      const token = createSession();

      // Definir cookie também
      reply.setCookie('authToken', token, {
        path: '/',
        httpOnly: true,
        maxAge: 24 * 60 * 60, // 24 horas
        sameSite: 'lax',
      });

      return {
        success: true,
        token,
        message: 'Login realizado com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao fazer login',
      };
    }
  });

  // POST /api/auth/logout - Fazer logout
  fastify.post('/logout', async (request, reply) => {
    try {
      const token = request.headers['x-auth-token'] || 
                    request.cookies?.authToken;

      if (token) {
        removeSession(token);
      }

      reply.clearCookie('authToken');

      return {
        success: true,
        message: 'Logout realizado com sucesso',
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        error: 'Erro ao fazer logout',
      };
    }
  });

  // GET /api/auth/check - Verificar se está autenticado
  fastify.get('/check', async (request, reply) => {
    try {
      const token = request.headers['x-auth-token'] || 
                    request.cookies?.authToken;

      if (!token) {
        reply.code(401);
        return {
          success: false,
          authenticated: false,
        };
      }

      const isValid = verifyToken(token);

      return {
        success: true,
        authenticated: isValid,
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return {
        success: false,
        authenticated: false,
      };
    }
  });
}

export default authRoutes;

