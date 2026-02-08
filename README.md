# 📖 Bíblia e Hinário v2.0

Sistema de projeção de hinos e versículos bíblicos para igrejas, com controle remoto via Wi-Fi.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Características

- 🎵 **Projeção de Hinos** - Múltiplos hinários suportados
- 📖 **Projeção de Bíblia** - Todos os livros da Bíblia Sagrada
- 📢 **Anúncios de Leitura** - Anuncie versículos e leitores
- 📱 **Controle Remoto** - Controle via tablet, celular ou notebook
- 🖥️ **Projeção Profissional** - Compatível com datashow, Smart TV, vMix e Profimix
- 🎨 **Visual Moderno** - Interface limpa e responsiva
- 🔐 **Sistema de Login** - Protege o painel de controle
- ⚡ **Tempo Real** - Mudanças instantâneas via Socket.io
- 💾 **100% Offline** - Funciona sem internet após instalação
- 🌐 **Acesso pela Rede** - Scripts automáticos para links de acesso
- 📋 **Documentação Completa** - Guias detalhados de instalação e uso
- 🔧 **Ferramentas de Diagnóstico** - Scripts para verificar funcionamento
- 🔠 **TODO TEXTO EM MAIÚSCULAS** - Versículos, hinos e anúncios sempre em CAIXA ALTA

---

## 🚀 Instalação (3 Opções)

## ⚡ INSTALAÇÃO ULTRA SIMPLES (1 Comando!)

**Para instalar COMPLETAMENTE o Bíblia e Hinário, copie e cole este comando no PowerShell (como administrador):**

```powershell
git clone https://github.com/userj81/Biblia_Hinario_Tabernaculo_O_Sinal.git BibliaHinario; cd BibliaHinario; .\setup-completo.ps1
```

**O que isso faz automaticamente:**
- ✅ Baixa o repositório completo
- ✅ Configura sincronização automática com GitHub
- ✅ Configura inicialização automática ao ligar PC
- ✅ Instala todas as dependências
- ✅ Testa tudo automaticamente
- ✅ Sistema sempre na versão mais recente!

### **Como executar:**
1. **Abra PowerShell como administrador** (Win + X → "Windows PowerShell (Administrador)")
2. **Cole o comando acima** e pressione Enter
3. **Aguarde** a instalação automática
4. **Reinicie** o computador
5. **Pronto!** Sistema funcionando automaticamente

### **❓ Problemas comuns:**

**"Executar como administrador" não aparece:**
- Clique direito na barra de tarefas do Windows
- Procure "Windows PowerShell"
- Clique direito → "Executar como administrador"

**"Git não é reconhecido":**
- Baixe Git: https://git-scm.com/
- Marque "Add to PATH" durante instalação
- Reinicie PowerShell e tente novamente

**"Execution Policy":**
- No PowerShell, execute: `Set-ExecutionPolicy RemoteSigned`
- Confirme com "S" ou "Y"

**Para usuários leigos:** Leia [PARA_USUARIOS_LEIGOS.md](PARA_USUARIOS_LEIGOS.md)

---

---

### **Opção 2: Instalação Manual**

```bash
# 1. Clone o repositório
git clone https://github.com/userj81/Biblia_Hinario_Tabernaculo_O_Sinal.git

# 2. Entre na pasta do projeto
cd Biblia_Hinario_Tabernaculo_O_Sinal

# 3. Instale as dependências
npm install

# 4. Inicie o sistema
npm run dev
```

---

### **Opção 3: Scripts de Inicialização**

```batch
# Inicialização com Feedback Visual (Recomendado)
.\iniciar-sistema.bat

# Inicialização avançada (PowerShell)
.\Start-BibliaHinario.ps1
```

> [!TIP]
> **Novo Recurso:** O sistema agora conta com um script de feedback visual (`Start-WithFeedback.ps1`) que exibe uma barra de progresso e confirmação verde quando o sistema está online e pronto para uso.

---

### **🚀 Atalho na Área de Trabalho**
Para facilitar o uso diário, o sistema agora permite a criação de um atalho diretamente na Área de Trabalho. Basta clicar duas vezes no ícone **"Bíblia e Hinário"** para iniciar o servidor e ver o progresso de carregamento.
**Para inicialização automática ao ligar PC:**
```powershell
# Execute como administrador (uma vez só)
.\setup-inicializacao-automatica.ps1
```

---

## 📚 Documentação Completa

### **[👶 GUIA PARA USUÁRIOS LEIGOS](PARA_USUARIOS_LEIGOS.md)**

**Comece por aqui se:**
- Não entende muito de computador
- Quer configuração automática completa
- É pastor/técnico de igreja
- Quer solução "aponte e clique"

### **[➡️ GUIA DE INSTALAÇÃO DETALHADO](INSTALACAO.md)**

**Leia este guia se:**
- É sua primeira vez instalando
- Está tendo problemas com a instalação
- Precisa acessar pela rede Wi-Fi
- Quer entender como funciona

### **[📋 GUIA DE DESENVOLVIMENTO](docs/)**

**Para desenvolvedores:**
- Documentação técnica completa
- Arquitetura do sistema
- Metodologia de desenvolvimento
- Cronograma e fases do projeto

### **[⚙️ SCRIPTS DE CONFIGURAÇÃO]**

**Scripts inteligentes incluídos:**
- `setup-completo.ps1` - **Configuração completa automática (recomendado para todos)**
- `setup-auto-sync.ps1` - Sincronização automática com GitHub
- `setup-inicializacao-automatica.ps1` - Inicialização automática ao ligar PC
- Scripts de inicialização e diagnóstico para uso diário

---

## 🌐 Acesso ao Sistema

Após iniciar com `npm run dev`:

### **Acesso Local (mesmo computador):**

- **🎛️ Painel de Controle:** http://localhost:5173/admin
- **🖥️ Tela de Projeção:** http://localhost:5173/projetor
- **🔑 Senha padrão:** `admin123`

### **Acesso pela Rede Wi-Fi:**

Substitua `192.168.1.X` pelo IP do seu computador:

- **Controle:** http://192.168.1.X:5173/admin
- **Projeção:** http://192.168.1.X:5173/projetor

> 💡 **Dica:** Veja como descobrir seu IP no [Guia de Instalação](INSTALACAO.md#2-acesso-pela-rede-local-wi-fi)

---

## 🎯 Uso Típico

### **Cenário Recomendado:**

1. **PC Principal (conectado ao datashow/TV):**
   - Abra: `http://localhost:5173/projetor`
   - Pressione **F11** para tela cheia
   - Deixe esta tela apenas **exibindo**

2. **Tablet/Celular (para controlar):**
   - Abra: `http://IP-DO-PC:5173/admin`
   - Faça login com a senha
   - Selecione hinos e versículos
   - Navegue com os botões ou setas

3. **Ambos na mesma rede Wi-Fi** ✅

---

## ⚡ Inicialização Automática

### **Para Igrejas (Computador Dedicado):**

Configure o sistema para iniciar automaticamente **sempre na versão mais recente**:

```powershell
# Execute uma vez como administrador
.\setup-inicializacao-automatica.ps1
```

**O que acontece:**
1. 🔄 **Sincroniza** automaticamente com GitHub
2. ⚙️ **Verifica** sistema e dependências
3. 🚀 **Inicia** o sistema mais atualizado

**Resultado:** Sempre que o computador liga, o sistema inicia com a versão mais recente!

### **Para Uso Manual:**

```batch
# Script simples
.\iniciar-sistema.bat

# Script avançado (com logs)
.\Start-BibliaHinario.ps1
```

### **[📖 Guia Completo de Inicialização](INICIALIZACAO_AUTOMATICA.md)**

Saiba mais sobre todas as opções de inicialização automática.

---

## 🛠️ Tecnologias

### **Backend:**
- Node.js - Runtime JavaScript
- Fastify - Framework web de alta performance
- Socket.io - Comunicação em tempo real
- better-sqlite3 - Banco de dados SQLite

### **Frontend:**
- React - Biblioteca UI
- Vite - Build tool moderna e rápida
- Tailwind CSS - Framework CSS utilitário
- Zustand - Gerenciamento de estado leve

---

## 📱 Funcionalidades Detalhadas

### **Aba Hinário:**
- ✅ Busca por nome ou número
- ✅ Múltiplos hinários (Harpa, CCB, Adventista, etc.)
- ✅ Criação e edição de hinários
- ✅ Criação e edição de hinos
- ✅ Refrões destacados em dourado
- ✅ Barra musical animada

### **Aba Bíblia:**
- ✅ Todos os 66 livros da Bíblia
- ✅ Busca por livro e capítulo
- ✅ Busca por texto/palavra
- ✅ Cada versículo é um slide separado
- ✅ Leituras salvas (sequências personalizadas)
- ✅ Quebra automática de versículos longos
- ✅ Referência visível em cada slide

### **Aba Anúncios:**
- ✅ Anúncio de leituras bíblicas
- ✅ Múltiplos versículos por anúncio
- ✅ Nome do leitor e título (Pastor, Evangelista, Missionário, etc.)
- ✅ Gerenciamento completo (criar, editar, excluir)

### **Configurações:**
- ✅ Ajuste de tamanho da tela (polegadas)
- ✅ Cálculo automático de tamanhos de fonte
- ✅ Configuração de caracteres por slide
- ✅ Responsivo para todos os dispositivos

---

## 🎨 Interface

### **Design Clean & Moderno:**
- Fundo branco puro
- Tipografia clara (Inter, SF Pro)
- Cores neutras e pastéis
- Espaçamento generoso
- Sombras sutis
- Feedback visual suave

### **Responsividade:**
- 📱 **Mobile** (< 768px) - Bottom navigation
- 💻 **Tablet** (768px - 1024px) - Tabs superiores
- 🖥️ **Desktop** (≥ 1024px) - Layout completo com sidebar

---

## 📊 Estrutura do Projeto

```
biblia-hinario_2.0/
├── server/                      # Backend (Node.js + Fastify)
│   ├── index.js                # Servidor principal
│   ├── db.js                   # Configuração do banco de dados
│   ├── auth.js                 # Sistema de autenticação
│   ├── socket-handlers.js      # Eventos Socket.io
│   └── routes/                 # Rotas da API REST
│       ├── hinarios.js
│       ├── hinos.js
│       ├── biblia.js
│       ├── leituras.js
│       ├── anuncios.js
│       ├── settings.js
│       └── auth.js
│
├── src/                        # Frontend (React)
│   ├── pages/                  # Páginas principais
│   │   ├── Admin/             # Painel de controle
│   │   ├── Projector/         # Tela de projeção pública
│   │   ├── ProjectorAdmin/    # Tela de projeção com controle
│   │   └── Login/             # Tela de login
│   ├── components/            # Componentes reutilizáveis
│   ├── stores/                # Gerenciamento de estado (Zustand)
│   │   ├── authStore.js
│   │   ├── projectionStore.js
│   │   └── settingsStore.js
│   └── services/              # Serviços de API e Socket
│       ├── api.js
│       └── socket.js
│
├── data/                       # Banco de dados
│   └── bh.db                  # SQLite com hinos e Bíblia
│
├── public/                     # Assets estáticos
│   ├── fonts/                 # Fontes personalizadas
│   └── images/                # Imagens de fundo
│
├── docs/                       # Documentação
│
├── package.json               # Dependências do projeto
├── vite.config.js            # Configuração Vite
├── tailwind.config.js        # Configuração Tailwind
├── INSTALACAO.md             # 📚 GUIA DE INSTALAÇÃO COMPLETO
└── README.md                 # Este arquivo
```

---

## 🔌 API REST

### **Hinários:**
```
GET    /api/hinarios          - Lista todos os hinários
GET    /api/hinarios/:id      - Busca hinário específico
POST   /api/hinarios          - Cria novo hinário
PUT    /api/hinarios/:id      - Atualiza hinário
DELETE /api/hinarios/:id      - Exclui hinário
```

### **Hinos:**
```
GET    /api/hinos                    - Lista todos os hinos
GET    /api/hinos?hinario_id=X       - Lista hinos de um hinário
GET    /api/hinos/:id                - Busca hino específico
GET    /api/hinos/:id/slides         - Obtém slides do hino
GET    /api/hinos/search?q=termo     - Busca hinos
POST   /api/hinos                    - Cria novo hino
PUT    /api/hinos/:id                - Atualiza hino
DELETE /api/hinos/:id                - Exclui hino
```

### **Bíblia:**
```
GET /api/biblia/livros                     - Lista livros da Bíblia
GET /api/biblia/livros/:id                 - Busca livro específico
GET /api/biblia/livros/:id/capitulos       - Lista capítulos do livro
GET /api/biblia/versiculos?livro=X&capitulo=Y - Obtém versículos
GET /api/biblia/search?q=termo             - Busca na Bíblia
```

### **Leituras Salvas:**
```
GET    /api/leituras              - Lista leituras salvas
GET    /api/leituras/:id          - Busca leitura específica
POST   /api/leituras              - Cria nova leitura
PUT    /api/leituras/:id          - Atualiza leitura
DELETE /api/leituras/:id          - Exclui leitura
GET    /api/leituras/:id/projetar - Projeta leitura
```

### **Anúncios:**
```
GET    /api/anuncios              - Lista anúncios
GET    /api/anuncios/:id          - Busca anúncio específico
GET    /api/anuncios/titulos      - Lista títulos predefinidos
POST   /api/anuncios              - Cria anúncio
PUT    /api/anuncios/:id          - Atualiza anúncio
DELETE /api/anuncios/:id          - Exclui anúncio
GET    /api/anuncios/:id/projetar - Projeta anúncio
```

### **Configurações:**
```
GET  /api/settings                - Todas as configurações
GET  /api/settings/:chave         - Configuração específica
POST /api/settings                - Salva configuração
GET  /api/settings/calculate/:tam - Calcula fontes e chars
```

### **Autenticação:**
```
POST /api/auth/login   - Login
POST /api/auth/logout  - Logout
GET  /api/auth/check   - Verifica autenticação
```

---

## ⚡ Socket.io (Eventos em Tempo Real)

### **Eventos do Servidor → Cliente:**
- `render_slide` - Renderiza slide no projetor
- `render_blackout` - Apaga tela (tela preta)
- `clear_blackout` - Mostra tela novamente
- `render_background` - Muda imagem de fundo
- `navigate_slide` - Navega entre slides

### **Eventos do Cliente → Servidor:**
- `show_slide` - Envia slide para projeção
- `blackout` - Solicita apagar tela
- `clear_blackout` - Solicita mostrar tela
- `change_slide` - Solicita mudança de slide

---

## 🐛 Resolução de Problemas

**Veja soluções detalhadas no:** **[Guia de Instalação](INSTALACAO.md#resolução-de-problemas)**

### **Problemas Comuns:**

**1. Porta já em uso:**
```bash
# Mac/Linux
pkill -f node
pkill -f vite

# Windows
taskkill /F /IM node.exe
```

**2. Dependências com erro:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**3. Não consigo acessar pela rede:**
- Verifique se está na mesma rede Wi-Fi
- Desative firewall temporariamente para testar
- Confirme o IP do servidor

---

## 📖 Documentação Adicional

- **[INSTALACAO.md](INSTALACAO.md)** - Guia completo de instalação e configuração
- **[docs/](docs/)** - Documentação técnica e desenvolvimento

---

## 🎓 Comandos Úteis

```bash
# Desenvolvimento (inicia backend + frontend)
npm run dev

# Apenas backend
npm run dev:server

# Apenas frontend
npm run dev:client

# Parar servidor
# Pressione Ctrl+C no terminal

# Scripts de inicialização automática
.\iniciar-sistema.bat              # Script simples
.\Start-BibliaHinario.ps1          # Script avançado
.\setup-inicializacao-automatica.ps1  # Configurar automático

# Verificar se tudo está funcionando
npm list
```

---

## 🌍 Compatibilidade

### **Navegadores Suportados:**
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ❌ Internet Explorer

### **Sistemas Operacionais:**
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu 20.04+)

### **Dispositivos:**
- ✅ Desktop/Laptop
- ✅ Tablet (iPad, Android)
- ✅ Smartphone (iOS, Android)
- ✅ Smart TV com navegador

---

## 📞 Suporte

**Precisa de ajuda?**

1. 📖 Leia o [Guia de Instalação](INSTALACAO.md)
2. 🔍 Verifique [Resolução de Problemas](INSTALACAO.md#resolução-de-problemas)
3. 🐛 Abra uma **Issue** no GitHub
4. 💬 Entre em contato com o desenvolvedor

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Este projeto é mantido pela comunidade para igrejas.

### **Como contribuir:**
1. **Relate bugs** - Abra uma [Issue](https://github.com/userj81/Biblia_Hinario_Tabernaculo_O_Sinal/issues) descrevendo o problema
2. **Sugira melhorias** - Compartilhe suas ideias para novos recursos
3. **Ajude na documentação** - Melhore guias e tutoriais

### **Para desenvolvedores:**
- Consulte a [documentação técnica](docs/) antes de contribuir
- Siga os padrões de código estabelecidos
- Teste suas mudanças antes de enviar

---

## 🔒 Privacidade e Segurança

- ✅ **100% Offline** - Não coleta dados pessoais
- ✅ **Código Aberto** - Transparente e auditável
- ✅ **Local** - Dados ficam no seu computador
- ✅ **Seguro** - Sem telemetria ou rastreamento

## 📄 Licença

Este projeto é distribuído sob a licença MIT.  
Uso livre para igrejas e comunidades religiosas.

---

## 🙏 Créditos

**Desenvolvido com ❤️ para igrejas**

- Sistema original: Desktop Java/JavaFX
- Nova versão: Web App Localhost
- Tecnologias: Node.js, React, Socket.io

---

## 📝 Changelog

### **v2.0.0** (Dezembro 2024)
- ✨ Reconstrução completa do sistema em Node.js e React
- ✨ Interface moderna e responsiva
- ✨ Controle remoto via Wi-Fi
- ✨ Sistema de autenticação
- ✨ Gerenciamento de hinários e hinos
- ✨ Leituras salvas
- ✨ Anúncios de leitura
- ✨ Configurações dinâmicas de tela
- ✨ Compatibilidade com vMix/Profimix

---

**🔗 Links Importantes:**

- 🌐 **Repositório GitHub:** https://github.com/userj81/Biblia_Hinario_Tabernaculo_O_Sinal
- 📚 **Guia de Instalação:** [INSTALACAO.md](INSTALACAO.md)
- 📖 **Documentação Técnica:** [docs/](docs/)

---

**Última atualização:** Dezembro 2024
