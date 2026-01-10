import http from 'http';

const makeRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? require('https') : http;
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
};

const testAnnouncement = async () => {
  console.log('🧪 TESTANDO CONFIGURAÇÃO DE ANÚNCIOS...\n');

  try {
    // 1. Verificar configurações atuais
    console.log('1. Verificando configurações...');
    const settings = await makeRequest('http://localhost:3000/api/settings');
    console.log('✅ Tamanho tela:', settings.data?.tamanho_tela || 'Não definido');

    // 2. Calcular valores esperados
    const tamanho = settings.data?.tamanho_tela || 55;
    const fonteVersiculo = Math.round((tamanho * 1.2) + 20);
    const fonteHino = Math.round((tamanho * 0.9) + 15);

    console.log('📐 Valores calculados:');
    console.log(`   - Fonte Versículo: ${fonteVersiculo}px`);
    console.log(`   - Fonte Hino: ${fonteHino}px`);

    // 3. Verificar se anúncio existente usa as configurações
    console.log('\n2. Verificando anúncio existente...');
    const anuncios = await makeRequest('http://localhost:3000/api/anuncios');
    if (anuncios.data && anuncios.data.length > 0) {
      const anuncio = anuncios.data[0];
      console.log('✅ Anúncio encontrado:', anuncio.nome);

      // 4. Projetar anúncio para teste
      console.log('\n3. Projetando anúncio...');
      const projecao = await makeRequest(`http://localhost:3000/api/anuncios/${anuncio.id}/projetar`);
      console.log('✅ Projeção gerada');

      console.log('\n🎯 TESTE CONCLUÍDO!');
      console.log('Agora abra http://localhost:5173/projetor e veja se o anúncio usa as fontes configuradas.');
    } else {
      console.log('❌ Nenhum anúncio encontrado para teste');
    }

  } catch (error) {
    console.log('❌ Erro no teste:', error.message);
  }
};

testAnnouncement();







