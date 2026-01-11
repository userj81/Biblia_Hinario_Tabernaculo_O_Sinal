import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import hinariosRoutes from './routes/hinarios.js';
import hinosRoutes from './routes/hinos.js';
import bibliaRoutes from './routes/biblia.js';
import cursoRoutes from './routes/curso.js';
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import leiturasRoutes from './routes/leituras.js';
import anunciosRoutes from './routes/anuncios.js';
import { setupSocketHandlers } from './socket-handlers.js';
import fastifyCookie from '@fastify/cookie';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true,
});

// Iniciar servidor
const start = async () => {
  try {
    // Registrar CORS para permitir requisições do frontend
    await fastify.register(fastifyCors, {
      origin: true, // Permite todas as origens em desenvolvimento
      credentials: true, // Permite cookies
    });

    // Registrar cookie parser
    await fastify.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET || 'biblia-hinario-secret-key-change-in-production',
    });

    // Registrar plugin de arquivos estáticos (para servir o frontend em produção)
    await fastify.register(fastifyStatic, {
      root: path.join(__dirname, '../dist'),
      prefix: '/',
    });

    // Registrar rotas da API
    await fastify.register(authRoutes, { prefix: '/api/auth' });
    await fastify.register(hinariosRoutes, { prefix: '/api/hinarios' });
    await fastify.register(hinosRoutes, { prefix: '/api/hinos' });
    await fastify.register(bibliaRoutes, { prefix: '/api/biblia' });
    await fastify.register(cursoRoutes, { prefix: '/api/curso' });
    await fastify.register(settingsRoutes, { prefix: '/api/settings' });
    await fastify.register(leiturasRoutes, { prefix: '/api/leituras' });
    await fastify.register(anunciosRoutes, { prefix: '/api/anuncios' });

    // Rota de health check
    fastify.get('/health', async (request, reply) => {
      return { status: 'ok', message: 'Bíblia e Hinário v2 API' };
    });

    const port = process.env.PORT || 3000;
    
    // Aguardar o Fastify estar pronto
    await fastify.ready();

    // Obter o servidor HTTP do Fastify
    const httpServer = fastify.server;

    // Configurar Socket.io usando o servidor HTTP do Fastify
    const io = new Server(httpServer, {
      cors: {
        origin: true,
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
    });

    // Configurar handlers de eventos Socket.io
    setupSocketHandlers(io);

    // Iniciar o servidor
    await fastify.listen({ port, host: '0.0.0.0' });

    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
    console.log(`📚 API disponível em http://localhost:${port}/api`);
    console.log(`🔌 Socket.io disponível em http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
