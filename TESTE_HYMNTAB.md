# 🧪 Guia de Testes - HymnTab Mobile Layout

**Data:** 08/02/2026
**Versão:** 2.0.0
**Objetivo:** Validar implementação completa do layout mobile em camadas no HymnTab

---

## ✅ CHECKLIST DE TESTES

### 1. INICIALIZAÇÃO E LAYOUT BÁSICO

#### 1.1 Carregamento Inicial
- [ ] Abrir http://localhost:5173/admin no navegador
- [ ] Fazer login (se necessário)
- [ ] Ir para aba "Hinário" (ícone de nota musical)
- [ ] **Esperado:**
  - SearchInput sticky no topo (campo de busca)
  - Header com botão "Selecionar Hinário" (roxo/purple)
  - Botão de ações (⋮) ao lado
  - Mensagem "Selecione um hinário" no centro

#### 1.2 Responsividade
Testar em diferentes tamanhos:
- [ ] Mobile: 375px (iPhone SE)
- [ ] Mobile: 414px (iPhone Plus)
- [ ] Tablet: 768px (iPad - deve mostrar layout desktop)
- [ ] Desktop: 1024px+

**Como testar:**
1. Abrir DevTools (F12)
2. Ativar modo responsivo (Ctrl+Shift+M / Cmd+Shift+M)
3. Testar cada breakpoint

---

### 2. BOTTOM SHEET - SELEÇÃO DE HINÁRIOS

#### 2.1 Abertura e Fechamento
- [ ] Clicar no botão "Selecionar Hinário"
- [ ] **Esperado:**
  - Overlay escuro aparece com fade-in
  - Sheet sobe da parte inferior com animação
  - Header do sheet: "Selecionar Hinário" com botão ✕
  - Lista scrollável de hinários
  - Botão "Novo Hinário" no rodapé fixo

- [ ] Clicar no overlay (fora do sheet)
- [ ] **Esperado:** Sheet fecha com animação

- [ ] Clicar no botão ✕
- [ ] **Esperado:** Sheet fecha

#### 2.2 Opção "Todos os Hinos"
- [ ] No sheet, verificar primeira opção "Todos os Hinos"
- [ ] Clicar em "Todos os Hinos"
- [ ] **Esperado:**
  - Sheet fecha
  - Botão muda para "Todos os Hinos (X)" onde X é o total
  - Lista mostra todos os hinos de todos os hinários
  - Cada card mostra o nome do hinário em texto pequeno

#### 2.3 Seleção de Hinário Específico
- [ ] Abrir sheet novamente
- [ ] Clicar em um hinário (ex: "Harpa Cristã")
- [ ] **Esperado:**
  - Sheet fecha
  - Botão muda para o nome do hinário selecionado
  - Lista mostra apenas hinos daquele hinário
  - Nome do hinário NÃO aparece nos cards

#### 2.4 Ações Inline no Sheet
- [ ] No sheet, localizar botões de editar (✏️) e excluir (🗑️) ao lado de cada hinário
- [ ] Verificar que botões são visíveis em mobile
- [ ] **Não clicar ainda** (testaremos na seção CRUD)

---

### 3. MENU DE AÇÕES DROPDOWN

#### 3.1 Abertura e Fechamento
- [ ] Clicar no botão de ações (⋮) ao lado do botão de hinário
- [ ] **Esperado:**
  - Dropdown abre abaixo do botão
  - Mostra "Novo Hino" (azul)
  - Mostra "Novo Hinário" (roxo)
  - Se um hinário está selecionado: mostra "Editar Hinário" (amarelo) e "Excluir Hinário" (vermelho)

- [ ] Clicar fora do dropdown
- [ ] **Esperado:** Dropdown fecha

#### 3.2 Opções Dinâmicas
- [ ] Selecionar "Todos os Hinos"
- [ ] Abrir menu de ações
- [ ] **Esperado:** Apenas "Novo Hino" e "Novo Hinário"

- [ ] Selecionar um hinário específico
- [ ] Abrir menu de ações
- [ ] **Esperado:** Todas as 4 opções aparecem

---

### 4. SEARCH INPUT STICKY

#### 4.1 Comportamento Sticky
- [ ] Selecionar um hinário com muitos hinos
- [ ] Fazer scroll para baixo na lista
- [ ] **Esperado:**
  - SearchInput permanece fixo no topo
  - Fundo branco (não transparente)
  - Sempre visível durante scroll

#### 4.2 Busca por Nome
- [ ] Digitar "castelo" (ou qualquer nome parcial)
- [ ] **Esperado:**
  - Lista filtra em tempo real
  - Contador aparece: "X resultado(s)"
  - Botão "Limpar busca" aparece

#### 4.3 Busca por Número
- [ ] Limpar busca anterior
- [ ] Digitar "23" (ou qualquer número)
- [ ] **Esperado:**
  - Lista filtra hinos com número 23
  - Funciona com números parciais

#### 4.4 Limpar Busca
- [ ] Clicar no botão "Limpar busca"
- [ ] **Esperado:**
  - Campo fica vazio
  - Lista volta completa
  - Contador desaparece

#### 4.5 Busca Filtrada por Hinário
- [ ] Selecionar "Harpa Cristã"
- [ ] Buscar "amor"
- [ ] **Esperado:** Busca apenas em hinos da Harpa Cristã

- [ ] Selecionar "Todos os Hinos"
- [ ] Buscar "amor"
- [ ] **Esperado:** Busca em todos os hinários

---

### 5. LISTA DE HINOS - VISUAL E INTERAÇÃO

#### 5.1 Aparência dos Cards
Para cada card de hino, verificar:
- [ ] Fundo cinza claro (gray-50) quando normal
- [ ] Badge circular roxo (purple-100) com o número do hino
- [ ] Nome do hino em 1-2 linhas (truncado se muito longo)
- [ ] Se "Todos os Hinos" selecionado: nome do hinário em cinza pequeno
- [ ] Três botões de ação:
  - [ ] "Projetar" (verde) - maior, com ícone de projetor
  - [ ] "Editar" (amarelo) - médio, ícone de lápis
  - [ ] "Excluir" (vermelho) - médio, ícone de lixeira

#### 5.2 Touch Feedback
- [ ] Tocar e segurar cada botão
- [ ] **Esperado:** Botão diminui levemente (scale-95)

#### 5.3 Empty States
- [ ] Criar um hinário novo sem hinos
- [ ] Selecionar esse hinário
- [ ] **Esperado:** Mensagem "Nenhum hino encontrado" com ícone

- [ ] Buscar algo que não existe (ex: "xyzabc123")
- [ ] **Esperado:** Mensagem "Nenhum resultado encontrado"

---

### 6. INDICADOR "NO AR" (PROJEÇÃO ATIVA)

#### 6.1 Sem Projeção Ativa
- [ ] Verificar que nenhum card tem indicador pulsante
- [ ] Todos os cards têm fundo cinza normal

#### 6.2 Com Projeção Ativa
- [ ] Clicar em "Projetar" em qualquer hino
- [ ] **Esperado:**
  - Card do hino projetado muda para fundo roxo claro (purple-50)
  - Borda esquerda grossa roxo escuro (purple-400)
  - Indicador pulsante roxo aparece no canto esquerdo do card
  - Animação ping contínua (dois círculos concêntricos)

#### 6.3 Mudança de Projeção
- [ ] Projetar outro hino
- [ ] **Esperado:**
  - Indicador "No Ar" move para o novo hino
  - Hino anterior volta ao estilo normal (cinza)

#### 6.4 Verificar Projeção Real
- [ ] Abrir http://localhost:5173/projetor em outra aba
- [ ] Projetar um hino
- [ ] **Esperado:**
  - Telão mostra slide do hino
  - Indicador "No Ar" correto no admin

---

### 7. PROJEÇÃO DE HINOS

#### 7.1 Projetar Hino Simples
- [ ] Clicar em "Projetar" em um hino
- [ ] Verificar telão (/projetor)
- [ ] **Esperado:**
  - Primeiro slide aparece com letra
  - Título do hino no topo
  - Número do hino visível
  - Navegação funciona (setas ou cliques)

#### 7.2 Projetar Hino com Refrão
- [ ] Buscar um hino que tem refrão
- [ ] Projetar
- [ ] **Esperado:**
  - Slides do refrão marcados como isRefrain: true
  - Visual diferenciado para refrão (se aplicável)

#### 7.3 Metadados da Projeção
Abrir DevTools Console e verificar:
```javascript
// No console do navegador
console.log(window.__projectionStore?.currentSlide)
```
- [ ] **Esperado:**
  - `type: 'hino'`
  - `metadata.hino: 'Nome do Hino'`
  - `metadata.numero: 123`
  - `slides: [...]` array com todos os slides

---

### 8. CRUD - HINÁRIOS

#### 8.1 Criar Novo Hinário
**Método 1: Via Menu de Ações**
- [ ] Abrir menu de ações (⋮)
- [ ] Clicar "Novo Hinário"
- [ ] **Esperado:** Modal HymnalEditor abre

**Método 2: Via Bottom Sheet**
- [ ] Abrir sheet de hinários
- [ ] Clicar "Novo Hinário" no rodapé
- [ ] **Esperado:** Sheet fecha + Modal abre

**No Modal:**
- [ ] Preencher nome: "Teste Hinário Mobile"
- [ ] Clicar "Salvar"
- [ ] **Esperado:**
  - Modal fecha
  - Novo hinário aparece na lista do sheet
  - Novo hinário está selecionado automaticamente

#### 8.2 Editar Hinário
**Método 1: Via Menu de Ações**
- [ ] Selecionar um hinário
- [ ] Abrir menu de ações (⋮)
- [ ] Clicar "Editar Hinário"
- [ ] **Esperado:** Modal abre com dados do hinário

**Método 2: Via Bottom Sheet**
- [ ] Abrir sheet de hinários
- [ ] Clicar botão editar (✏️) ao lado de um hinário
- [ ] **Esperado:**
  - Sheet fecha
  - Modal abre com dados do hinário

**No Modal:**
- [ ] Alterar nome para "Teste Editado"
- [ ] Clicar "Salvar"
- [ ] **Esperado:**
  - Modal fecha
  - Nome atualizado no botão de seleção
  - Nome atualizado no sheet

#### 8.3 Excluir Hinário
**Método 1: Via Menu de Ações**
- [ ] Selecionar um hinário de teste (NÃO use hinários importantes!)
- [ ] Abrir menu de ações (⋮)
- [ ] Clicar "Excluir Hinário"
- [ ] **Esperado:** Confirmação "Deseja realmente excluir?"

**Método 2: Via Bottom Sheet**
- [ ] Abrir sheet de hinários
- [ ] Clicar botão excluir (🗑️) ao lado de um hinário
- [ ] **Esperado:** Confirmação aparece

**Após Confirmar:**
- [ ] Clicar "OK" na confirmação
- [ ] **Esperado:**
  - Hinário removido da lista
  - Se era o selecionado: volta para estado "Selecione um hinário"

**Testar Cancelamento:**
- [ ] Tentar excluir novamente
- [ ] Clicar "Cancelar"
- [ ] **Esperado:** Hinário permanece

---

### 9. CRUD - HINOS

#### 9.1 Criar Novo Hino
- [ ] Selecionar um hinário
- [ ] Abrir menu de ações (⋮)
- [ ] Clicar "Novo Hino"
- [ ] **Esperado:** Modal HymnEditor abre

**No Modal:**
- [ ] Preencher:
  - Nome: "Teste Hino Mobile"
  - Número: 999
  - Letra: múltiplas linhas (copiar de outro hino)
- [ ] Clicar "Salvar"
- [ ] **Esperado:**
  - Modal fecha
  - Novo hino aparece na lista
  - Se busca estava ativa: busca é limpa

#### 9.2 Editar Hino
- [ ] Clicar botão editar (✏️) em um card de hino
- [ ] **Esperado:** Modal abre com dados do hino

**No Modal:**
- [ ] Alterar nome para "Teste Hino Editado"
- [ ] Clicar "Salvar"
- [ ] **Esperado:**
  - Modal fecha
  - Nome atualizado no card
  - Se hino estava projetado: projeção continua normal

#### 9.3 Excluir Hino
- [ ] Clicar botão excluir (🗑️) em um card de hino de teste
- [ ] **Esperado:** Confirmação "Deseja realmente excluir?"

**Após Confirmar:**
- [ ] Clicar "OK"
- [ ] **Esperado:**
  - Hino removido da lista
  - Se hino estava projetado: projeção limpa (slide preto?)

**Testar Cancelamento:**
- [ ] Tentar excluir outro hino
- [ ] Clicar "Cancelar"
- [ ] **Esperado:** Hino permanece

---

### 10. MODAIS - HymnEditor e HymnalEditor

#### 10.1 Verificar Integridade dos Modais
- [ ] Abrir HymnEditor
- [ ] **Esperado:**
  - Layout não mudou
  - Todos os campos presentes
  - Formatação correta
  - Botões funcionam

- [ ] Abrir HymnalEditor
- [ ] **Esperado:**
  - Layout não mudou
  - Campo de nome presente
  - Botões funcionam

#### 10.2 z-index Correto
- [ ] Abrir sheet de hinários
- [ ] Sem fechar, tentar abrir modal (não deve ser possível diretamente)
- [ ] Fechar sheet
- [ ] Abrir modal
- [ ] **Esperado:** Modal sempre aparece por cima de tudo

---

### 11. TESTES DE INTEGRAÇÃO

#### 11.1 Fluxo Completo: Criar Hinário → Criar Hino → Projetar
1. [ ] Criar novo hinário "Teste Fluxo"
2. [ ] Selecionar "Teste Fluxo" no sheet
3. [ ] Criar novo hino #1 "Primeiro Hino"
4. [ ] Verificar hino aparece na lista
5. [ ] Projetar o hino
6. [ ] Verificar indicador "No Ar"
7. [ ] Verificar telão mostra slide
8. [ ] **Status:** ✅ / ❌

#### 11.2 Fluxo: Busca → Edição → Projeção
1. [ ] Selecionar "Todos os Hinos"
2. [ ] Buscar por nome parcial
3. [ ] Editar um dos resultados
4. [ ] Salvar
5. [ ] Limpar busca
6. [ ] Localizar hino editado
7. [ ] Projetar
8. [ ] **Status:** ✅ / ❌

#### 11.3 Fluxo: Múltiplos Hinários → Projeções Alternadas
1. [ ] Criar 2 hinários
2. [ ] Criar 1 hino em cada
3. [ ] Projetar hino do hinário 1
4. [ ] Verificar indicador "No Ar"
5. [ ] Trocar para hinário 2 no sheet
6. [ ] Projetar hino do hinário 2
7. [ ] Verificar indicador mudou
8. [ ] **Status:** ✅ / ❌

---

### 12. TESTES DE EDGE CASES

#### 12.1 Hinário Vazio
- [ ] Criar hinário sem hinos
- [ ] Selecionar esse hinário
- [ ] **Esperado:** Empty state apropriado

#### 12.2 Hino com Nome Muito Longo
- [ ] Criar hino com nome: "Este é um nome de hino extremamente longo que deveria ser truncado em duas linhas no máximo para não quebrar o layout do card"
- [ ] **Esperado:** Nome truncado com "..." (line-clamp-2)

#### 12.3 Busca Sem Resultados
- [ ] Buscar "xyzabc999999"
- [ ] **Esperado:** Empty state "Nenhum resultado encontrado"

#### 12.4 Deletar Hinário com Hinos
- [ ] Criar hinário com 3 hinos
- [ ] Tentar deletar o hinário
- [ ] **Esperado:**
  - Deve dar erro? Ou deletar em cascata?
  - Verificar comportamento esperado do backend

#### 12.5 Projeção Durante Edição
- [ ] Projetar um hino
- [ ] Editar o mesmo hino (mudar nome)
- [ ] Salvar
- [ ] **Esperado:**
  - Projeção continua
  - Nome atualizado no indicador "No Ar"?
  - Ou projeção permanece com nome antigo até próxima projeção?

#### 12.6 Número de Hino Duplicado
- [ ] Criar 2 hinos com mesmo número no mesmo hinário
- [ ] **Esperado:**
  - Backend permite? Ou dá erro?
  - Se permite: ambos aparecem na lista

---

### 13. TESTES DE PERFORMANCE

#### 13.1 Lista com Muitos Hinos
- [ ] Selecionar "Todos os Hinos" (se > 100 hinos)
- [ ] Fazer scroll rápido para cima e para baixo
- [ ] **Esperado:**
  - Scroll suave (sem lag)
  - SearchInput permanece sticky

#### 13.2 Busca em Tempo Real
- [ ] Selecionar "Todos os Hinos"
- [ ] Digitar rapidamente "a", "am", "amo", "amor"
- [ ] **Esperado:**
  - Filtragem sem delay perceptível
  - Sem travamentos

#### 13.3 Abertura/Fechamento Rápido do Sheet
- [ ] Abrir e fechar sheet 5 vezes seguidas rapidamente
- [ ] **Esperado:**
  - Animações não quebram
  - Sem erros no console

---

### 14. TESTES DE CORES E TEMA

#### 14.1 Paleta Roxa (Purple)
Verificar que HymnTab usa cores DIFERENTES do BibleTab:
- [ ] Botão de hinário: purple-50 + border-purple-200
- [ ] Badge de número: purple-100
- [ ] Card projetado: purple-50 + border-purple-400
- [ ] Indicador "No Ar": purple-400/purple-500 (ping)
- [ ] Botão ações: purple-500 no sheet

#### 14.2 Contraste com BibleTab
- [ ] Ir para aba Bíblia → cores azuis
- [ ] Voltar para aba Hinos → cores roxas
- [ ] **Esperado:** Diferenciação visual clara

---

### 15. TESTES DE CONSOLE (Erros)

#### 15.1 Verificar Console do Navegador
Durante TODOS os testes acima, manter DevTools aberto:
- [ ] **Esperado:**
  - ❌ ZERO errors em vermelho
  - ⚠️ Warnings aceitáveis (baseline-browser-mapping)
  - ℹ️ Logs informativos OK

#### 15.2 Erros Específicos a Observar
- [ ] Erro de compilação React
- [ ] Erro de prop types
- [ ] Erro de hooks (useEffect, useState)
- [ ] Erro de API (401, 404, 500)
- [ ] Erro de socket.io (desconectado)

---

## 📊 RESULTADO ESPERADO

### ✅ SUCESSO TOTAL
Todos os 15 grupos de testes passaram sem erros críticos.

### ⚠️ SUCESSO PARCIAL
Alguns testes falharam, mas funcionalidade core está OK.
- Documentar falhas específicas
- Priorizar correções

### ❌ FALHA
Múltiplos testes críticos falharam.
- Sistema não está pronto para produção
- Requires immediate fixes

---

## 🐛 TEMPLATE DE REPORTE DE BUG

Se encontrar algum problema, use este formato:

```
**Seção:** [Ex: 6.2 - Indicador "No Ar"]
**Descrição:** [O que aconteceu]
**Esperado:** [O que deveria acontecer]
**Passos para reproduzir:**
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]
**Screenshot:** [Se possível]
**Console Errors:** [Copiar erros do DevTools]
**Prioridade:** [🔴 Crítico | 🟡 Médio | 🟢 Baixo]
```

---

## 📝 NOTAS FINAIS

1. **Teste em modo Mobile REAL**
   - Usar DevTools responsive mode não é suficiente
   - Testar em dispositivo real (iPhone/Android)
   - Verificar gestos touch

2. **Performance**
   - Com poucos hinos (< 50): qualquer implementação funciona
   - Com muitos hinos (> 200): performance importa
   - Se lag, considerar virtualização (react-window)

3. **Acessibilidade**
   - Todos os botões têm title/aria-label?
   - Navegação por teclado funciona?
   - Contraste de cores adequado?

4. **Cross-browser**
   - Testar no Chrome (principal)
   - Testar no Safari (iOS)
   - Testar no Firefox

---

**Boa sorte nos testes! 🚀**
