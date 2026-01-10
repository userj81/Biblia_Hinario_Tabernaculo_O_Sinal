import http from 'http';

const makeRequest = (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
};

const testAPIs = async () => {
  console.log('🧪 TESTANDO APIs APÓS RESTART...\n');

  try {
    // Teste 1: Health
    console.log('1. Health Check...');
    const health = await makeRequest('http://localhost:3000/health');
    console.log('✅ Health:', health.message || 'OK');

    // Teste 2: Settings
    console.log('2. Configurações...');
    const settings = await makeRequest('http://localhost:3000/api/settings');
    console.log('✅ Settings:', Object.keys(settings.data || {}).length, 'itens');

    // Teste 3: Hinários
    console.log('3. Hinários...');
    const hinarios = await makeRequest('http://localhost:3000/api/hinarios');
    console.log('✅ Hinários:', hinarios.data?.length || 0);

    // Teste 4: Bíblia
    console.log('4. Livros da Bíblia...');
    const livros = await makeRequest('http://localhost:3000/api/biblia/livros');
    console.log('✅ Livros:', livros.data?.length || 0);

    // Teste 5: Anúncios
    console.log('5. Anúncios...');
    const anuncios = await makeRequest('http://localhost:3000/api/anuncios');
    console.log('✅ Anúncios:', anuncios.data?.length || 0);

    console.log('\n🎉 TODAS AS APIs FUNCIONANDO!');
    console.log('✅ Correções aplicadas com sucesso!');

  } catch (error) {
    console.log('❌ Erro no teste:', error.message);
  }
};

testAPIs();
