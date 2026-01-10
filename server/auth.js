/**
 * Sistema de autenticação simples
 * Usa uma senha única configurada via variável de ambiente
 */

// Senha padrão (deve ser alterada via variável de ambiente em produção)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Armazenar sessões ativas (em produção, usar Redis ou banco de dados)
const activeSessions = new Map();

/**
 * Gera um token de sessão simples
 */
function generateToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
}

/**
 * Verifica se a senha está correta
 */
export function verifyPassword(password) {
  return password === ADMIN_PASSWORD;
}

/**
 * Cria uma nova sessão
 */
export function createSession() {
  const token = generateToken();
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 horas
  activeSessions.set(token, { expiresAt });
  return token;
}

/**
 * Verifica se o token é válido
 */
export function verifyToken(token) {
  if (!token) return false;
  
  const session = activeSessions.get(token);
  if (!session) return false;
  
  // Verificar se expirou
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return false;
  }
  
  return true;
}

/**
 * Remove uma sessão
 */
export function removeSession(token) {
  activeSessions.delete(token);
}

/**
 * Middleware de autenticação para Fastify
 */
export async function authMiddleware(request, reply) {
  // Permitir acesso público ao /projetor e /health
  if (request.url.startsWith('/projetor') || 
      request.url.startsWith('/health') ||
      request.url.startsWith('/api/hinarios') ||
      request.url.startsWith('/api/hinos') ||
      request.url.startsWith('/api/biblia')) {
    return; // Continuar sem autenticação
  }

  // Verificar token para rotas protegidas (/admin)
  const token = request.headers['x-auth-token'] || 
                request.cookies?.authToken ||
                request.query?.token;

  if (!verifyToken(token)) {
    reply.code(401);
    return { success: false, error: 'Não autorizado. Faça login primeiro.' };
  }
}

