import http from 'http';

const testServer = () => {
  const req = http.get('http://localhost:3000/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('✅ SERVIDOR FUNCIONANDO!');
      console.log('📊 Resposta:', data);
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.log('❌ Servidor ainda não respondeu');
    console.log('⏳ Aguardando mais...');
    setTimeout(testServer, 3000);
  });

  req.setTimeout(5000, () => {
    console.log('⏰ Timeout - tentando novamente...');
    req.destroy();
    setTimeout(testServer, 2000);
  });
};

console.log('🔍 Testando servidor...');
testServer();
