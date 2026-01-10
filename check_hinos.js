import Database from 'better-sqlite3';

const db = new Database('data/bh.db');

console.log('=== VERIFICANDO HINOS COM QUEBRAS DE LINHA ===');

const hinos = db.prepare('SELECT id, nome, texto FROM hino WHERE texto LIKE ? LIMIT 5').all('%\n%');

hinos.forEach((hino, index) => {
  console.log(`\n--- HINO ${index + 1}: ${hino.nome} ---`);
  console.log('Texto original:');
  console.log(JSON.stringify(hino.texto));
  console.log('Linhas separadas:');
  hino.texto.split('\n').forEach((linha, i) => {
    console.log(`  ${i + 1}: "${linha}"`);
  });
});

db.close();
