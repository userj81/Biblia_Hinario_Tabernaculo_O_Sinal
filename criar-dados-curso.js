// Script para criar dados de exemplo do curso
import Database from 'better-sqlite3';

const db = new Database('data/bh.db');

// Criar tabelas do curso se não existirem
db.exec(`
  CREATE TABLE IF NOT EXISTS curso_livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS curso_slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    livro_id INTEGER NOT NULL,
    numero INTEGER NOT NULL,
    texto TEXT NOT NULL,
    FOREIGN KEY (livro_id) REFERENCES curso_livros(id)
  );
`);

// Limpar dados existentes
db.prepare('DELETE FROM curso_slides').run();
db.prepare('DELETE FROM curso_livros').run();

// Criar livros do curso
const livros = [
  'Introdução à Teologia',
  'História da Igreja',
  'Doutrina Cristã Básica',
  'Vida de Oração',
  'Evangelismo e Missões'
];

const insertLivro = db.prepare('INSERT INTO curso_livros (nome) VALUES (?)');
const insertSlide = db.prepare('INSERT INTO curso_slides (livro_id, numero, texto) VALUES (?, ?, ?)');

livros.forEach((nomeLivro, index) => {
  const result = insertLivro.run(nomeLivro);
  const livroId = result.lastInsertRowid;

  // Criar slides de exemplo para cada livro
  const slidesExemplo = [
    `BEM-VINDO AO CURSO: ${nomeLivro.toUpperCase()}`,
    'OBJETIVOS DO MÓDULO',
    'CONTEÚDO PROGRAMÁTICO',
    'METODOLOGIA DE ESTUDO',
    'AVALIAÇÃO E APROVEITAMENTO',
    'CONCLUSÃO E PRÓXIMOS PASSOS'
  ];

  slidesExemplo.forEach((texto, slideIndex) => {
    insertSlide.run(livroId, slideIndex + 1, texto);
  });
});

console.log('✅ Dados do curso criados com sucesso!');
console.log('📚 Livros criados:', livros.length);
console.log('📄 Slides criados por livro:', 6);

db.close();