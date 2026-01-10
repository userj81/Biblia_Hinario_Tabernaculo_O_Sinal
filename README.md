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

---

## 🚀 Instalação Rápida

```bash
# 1. Clone o repositório
git clone https://github.com/userj81/Biblia_Hinario_Tabernaculo_O_Sinal.git

# 2. Entre na pasta
cd Biblia_Hin-rio_2.0

# 3. Instale as dependências
npm install

# 4. Inicie o sistema
npm run dev
```

---

## 📚 Documentação Completa

### **[➡️ GUIA DE INSTALAÇÃO DETALHADO](INSTALACAO.md)**

**Leia este guia se:**
- É sua primeira vez instalando
- Está tendo problemas com a instalação
- Precisa acessar pela rede Wi-Fi
- Quer entender como funciona

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

- **[INSTALACAO.md](INSTALACAO.md)** - Guia completo de instalação
- **[docs/DOCUMENTACAO_LEGADO.md](docs/DOCUMENTACAO_LEGADO.md)** - Sistema original Java
- **[docs/PLAN_NOVA_VERSAO.md](docs/PLAN_NOVA_VERSAO.md)** - Arquitetura da nova versão
- **[docs/metodologia/](docs/metodologia/)** - Metodologia de desenvolvimento
- **[docs/cronograma/](docs/cronograma/)** - Cronograma e fases

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

# Atualizar projeto do GitHub
git pull origin main
npm install

# Verificar status do Git
git status
```

---

## 🔐 Segurança

### **Senha Padrão:**
- **Login:** `admin123`

### **Alterar Senha:**

Edite `server/auth.js`:
```javascript
const DEFAULT_PASSWORD = 'SUA_SENHA_AQUI';
```

Ou crie `.env`:
```env
ADMIN_PASSWORD=sua-senha-segura
```

⚠️ **Sempre altere a senha padrão em produção!**

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

Contribuições são bem-vindas!

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

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

- 🌐 **Repositório GitHub:** https://github.com/userj81/Biblia_Hin-rio_2.0
- 📚 **Guia de Instalação:** [INSTALACAO.md](INSTALACAO.md)
- 📖 **Documentação:** [docs/](docs/)

---

**Última atualização:** Dezembro 2024
