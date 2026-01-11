// Script para testar a conversão de textos para CAIXA ALTA (maiúsculas)
// Execute este script para verificar se a implementação está funcionando

import Database from 'better-sqlite3';
import { converterParaMaiusculas } from './server/db.js';

const db = new Database('data/bh.db');

console.log('🔍 TESTANDO CONVERSÃO PARA CAIXA ALTA (MAIÚSCULAS)');
console.log('='.repeat(60));

// Testar função de conversão
console.log('\n📝 Teste da função converterParaMaiusculas():');
const textosTeste = [
    'texto normal',
    'Texto Com Maiúsculas E Minúsculas',
    'TODO EM MINÚSCULAS',
    'já está em maiúsculas',
    'Misto: MAIÚSCULAS e minúsculas'
];

textosTeste.forEach((texto, index) => {
    const convertido = converterParaMaiusculas(texto);
    console.log(`${index + 1}. "${texto}" → "${convertido}"`);
});

// Testar versículos da Bíblia
console.log('\n📖 Teste com versículos da Bíblia:');
const versiculos = db.prepare('SELECT texto FROM Biblia LIMIT 5').all();

versiculos.forEach((versiculo, index) => {
    const convertido = converterParaMaiusculas(versiculo.texto);
    console.log(`${index + 1}. Original: "${versiculo.texto.substring(0, 50)}..."`);
    console.log(`   Convertido: "${convertido.substring(0, 50)}..."`);
    console.log('');
});

// Testar hinos
console.log('🎵 Teste com hinos:');
const hinos = db.prepare('SELECT nome, texto FROM hino LIMIT 3').all();

hinos.forEach((hino, index) => {
    console.log(`${index + 1}. Hino: ${hino.nome}`);
    console.log(`   Original: "${hino.texto.substring(0, 80)}..."`);

    const convertido = converterParaMaiusculas(hino.texto);
    console.log(`   Convertido: "${convertido.substring(0, 80)}..."`);
    console.log('');
});

console.log('✅ Teste concluído!');
console.log('💡 Se tudo estiver em maiúsculas, a implementação está funcionando corretamente.');

db.close();