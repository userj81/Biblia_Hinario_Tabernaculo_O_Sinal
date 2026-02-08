# 📖 Guia Completo de Instalação - Bíblia e Hinário v2.0

## 📋 Sumário
1. [Requisitos do Sistema](#requisitos-do-sistema)
2. [Instalação Passo a Passo](#instalação-passo-a-passo)
3. [Primeira Execução](#primeira-execução)
4. [Acesso ao Sistema](#acesso-ao-sistema)
5. [Resolução de Problemas](#resolução-de-problemas)
6. [Informações Importantes](#informações-importantes)

---

## 🖥️ Requisitos do Sistema

### Mínimo Necessário:
- **Sistema Operacional:** Windows 10/11, macOS 10.15+, ou Linux (Ubuntu 20.04+)
- **Node.js:** Versão 18.0.0 ou superior
- **RAM:** 4 GB mínimo (8 GB recomendado)
- **Espaço em Disco:** 500 MB livres
- **Conexão de Rede:** Wi-Fi para controle remoto

### Softwares Necessários:

#### 1. **Node.js** (obrigatório)
   - **Download:** https://nodejs.org/
   - **Versão recomendada:** LTS (Long Term Support)
   - **Como verificar se já está instalado:**
     ```bash
     node --version
     # Deve mostrar: v18.x.x ou superior
     
     npm --version
     # Deve mostrar: 9.x.x ou superior
     ```

#### 2. **Git** (obrigatório para baixar)
   - **Download:** https://git-scm.com/downloads
   - **Como verificar:**
     ```bash
     git --version
     # Deve mostrar: git version 2.x.x ou superior
     ```

---

## 📥 Instalação Passo a Passo

### **Passo 1: Baixar o Projeto do GitHub**

Abra o **Terminal** (macOS/Linux) ou **Prompt de Comando/PowerShell** (Windows) e execute:

```bash
# Clone o repositório
git clone https://github.com/userj81/Biblia_Hin-rio_2.0.git

# Entre na pasta do projeto
cd Biblia_Hin-rio_2.0
```

**Ou baixe o ZIP:**
1. Acesse: https://github.com/userj81/Biblia_Hin-rio_2.0
2. Clique no botão verde **"Code"**
3. Clique em **"Download ZIP"**
4. Extraia o arquivo ZIP
5. Abra o terminal na pasta extraída

---

### **Passo 2: Instalar as Dependências**

Ainda no terminal, dentro da pasta do projeto, execute:

```bash
# Instalar todas as dependências (pode demorar alguns minutos)
npm install
```

**Aguarde a instalação concluir.** Você verá algo como:
```
added 1234 packages in 2m
```

---

### **Passo 3: Verificar o Banco de Dados**

O banco de dados `bh.db` já vem incluído no projeto. Verifique se existe:

```bash
# Windows (PowerShell)
Test-Path data/bh.db

# macOS/Linux
ls -lh data/bh.db
```

Se o arquivo existir, você verá o tamanho (aproximadamente 20-30 MB). ✅

---

## 🚀 Primeira Execução

### **Iniciar o Sistema**

No terminal, execute:

```bash
npm run dev
```

**O que acontece:**
- O servidor backend inicia na porta **3000**
- O servidor frontend (Vite) inicia na porta **5173**
- Você verá mensagens como:

```
🚀 Servidor rodando em http://localhost:3000
📚 API disponível em http://localhost:3000/api
🔌 Socket.io disponível em http://localhost:3000

VITE v5.x.x  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.X:5173/
```

---

## 🌐 Acesso ao Sistema

### **1. Acesso Local (no mesmo computador)**

Abra seu navegador (Chrome, Firefox, Edge, Safari) e acesse:

- **Painel de Controle (Admin):**  
  http://localhost:5173/admin
  
- **Tela de Projeção:**  
  http://localhost:5173/projetor

### **2. Acesso pela Rede Local (Wi-Fi)**

Para acessar de outros dispositivos (tablet, celular, outro PC):

1. **Encontre o IP do computador que está rodando o servidor:**

   **Windows (PowerShell):**
   ```powershell
   ipconfig | findstr IPv4
   ```

   **macOS/Linux:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # ou
   ip addr show | grep "inet " | grep -v 127.0.0.1
   ```

   Você verá algo como: `192.168.1.10` ou `10.0.0.5`

2. **Acesse de outros dispositivos:**

   Substitua `192.168.1.10` pelo IP que você encontrou:

   - **Painel de Controle:**  
     http://192.168.1.10:5173/admin
   
   - **Tela de Projeção:**  
     http://192.168.1.10:5173/projetor

---

## 🔐 Login no Sistema

### **Credenciais Padrão:**

- **Senha:** `admin123`

⚠️ **IMPORTANTE:** Altere a senha padrão em produção!

Para alterar a senha, edite o arquivo:
```
biblia-hinario_2.0/server/auth.js
```

E modifique a linha:
```javascript
const DEFAULT_PASSWORD = 'admin123'; // Altere aqui
```

Depois, reinicie o servidor.

---

## 🎯 Uso Recomendado

### **Cenário Típico:**

1. **PC Principal (conectado ao datashow/TV):**
   - Acesse: http://localhost:5173/projetor
   - Deixe em **tela cheia** (pressione F11 ou F)
   - Esta tela apenas **exibe** os slides

2. **Tablet/Celular/Notebook (controle):**
   - Acesse: http://IP-DO-PC:5173/admin
   - Faça login com a senha
   - Use este dispositivo para **controlar** a projeção

3. **Conecte na mesma rede Wi-Fi:**
   - Todos os dispositivos devem estar na **mesma rede**

---

## 🛠️ Resolução de Problemas

### **Problema: "Porta já em uso" (EADDRINUSE)**

**Solução:**

**Windows:**
```powershell
# Finalizar processos Node.js
taskkill /F /IM node.exe

# Ou liberar portas específicas
netstat -ano | findstr :3000
netstat -ano | findstr :5173
# Anote o PID e execute:
taskkill /F /PID <numero_do_pid>
```

**macOS/Linux:**
```bash
# Finalizar processos Node.js
pkill -f node

# Ou liberar portas específicas
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

---

### **Problema: "Não consigo acessar pela rede Wi-Fi"**

**Verificações:**

1. **Firewall bloqueando?**
   - **Windows:** Adicione exceção para as portas 3000 e 5173
   - **macOS:** Sistema > Firewall > Opções > Adicionar Node.js

2. **Mesma rede Wi-Fi?**
   - Verifique se todos os dispositivos estão na mesma rede

3. **IP correto?**
   - Re-verifique o IP do servidor com `ipconfig` ou `ifconfig`

4. **Vite configurado?**
   - O arquivo `vite.config.js` já está configurado com `host: '0.0.0.0'`

---

### **Problema: "Erro ao instalar dependências"**

**Solução:**

```bash
# Limpar cache do npm
npm cache clean --force

# Remover node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

---

### **Problema: "Banco de dados não encontrado"**

**Solução:**

Verifique se o arquivo `data/bh.db` existe. Se não:

1. Baixe o projeto novamente do GitHub
2. Ou baixe apenas o arquivo do banco:
   - https://github.com/userj81/Biblia_Hin-rio_2.0/tree/main/data

---

### **Problema: "Tela preta no projetor"**

**Solução:**

1. Verifique se o servidor está rodando
2. Abra o console do navegador (F12) e veja se há erros
3. Teste selecionar um hino ou versículo no painel `/admin`
4. Verifique a conexão Socket.io no console

---

### **Problema: "Slides não mudam ao pressionar as setas"**

**Na tela `/projetor`:**
- Esta tela é **apenas visualização**
- Use a tela `/projetor-admin` para controlar com teclado
- Ou use o painel `/admin`

---

## 📱 Dispositivos Recomendados

### **Para Controle:**
- ✅ Tablet (iPad, Android) - **MELHOR OPÇÃO**
- ✅ Notebook/Laptop
- ✅ Smartphone (em modo paisagem)

### **Para Projeção:**
- ✅ PC/Mac conectado ao datashow
- ✅ Smart TV com navegador
- ✅ Notebook conectado ao projetor

---

## 🔧 Comandos Úteis

```bash
# Iniciar servidor (desenvolvimento)
npm run dev

# Iniciar apenas o backend
npm run dev:server

# Iniciar apenas o frontend
npm run dev:client

# Parar o servidor
# Pressione Ctrl+C no terminal

# Atualizar o projeto (se houver mudanças no GitHub)
git pull origin main
npm install

# Ver logs do servidor
# Os logs aparecem no terminal onde você rodou npm run dev
```

---

## 📊 Estrutura de Portas

| Serviço | Porta | URL |
|---------|-------|-----|
| Backend (API) | 3000 | http://localhost:3000 |
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Socket.io | 3000 | ws://localhost:3000 |

---

## 🎨 Compatibilidade de Navegadores

### **Recomendados:**
- ✅ Google Chrome (versão 90+)
- ✅ Microsoft Edge (versão 90+)
- ✅ Firefox (versão 88+)
- ✅ Safari (versão 14+)

### **Não Recomendados:**
- ❌ Internet Explorer (qualquer versão)
- ❌ Navegadores muito antigos

---

## 📞 Suporte

### **Problemas Comuns:**

1. **Não consigo fazer login**
   - Senha padrão: `admin123`
   - Limpe o cache do navegador (Ctrl+Shift+Del)

2. **Slides não aparecem**
   - Verifique se selecionou um hino/versículo no admin
   - Veja o console do navegador (F12)

3. **Controle não funciona**
   - Verifique se está na mesma rede Wi-Fi
   - Recarregue as páginas (Ctrl+R ou Cmd+R)

---

## ⚙️ Configurações Avançadas

### **Alterar Portas:**

Edite `server/index.js`:
```javascript
const port = process.env.PORT || 3000; // Altere 3000 para outra porta
```

Edite `vite.config.js`:
```javascript
server: {
  port: 5173, // Altere para outra porta
  // ...
}
```

### **Alterar Tamanho da Fonte:**

Acesse o painel Admin > ⚙️ Configurações

Ou edite diretamente no banco de dados usando um editor SQLite.

---

## 🎓 Primeiros Passos

Depois de instalar e iniciar:

1. **Faça login** em http://localhost:5173/admin
2. **Selecione um hinário** na aba "Hinário"
3. **Clique em um hino** para projetar
4. **Abra** http://localhost:5173/projetor **em outra janela/dispositivo**
5. **Pressione F11** para entrar em tela cheia
6. **Use as setas** ← → no painel admin para navegar

---

## 📝 Notas Finais

- ✅ O sistema funciona **totalmente offline** (após instalação)
- ✅ Não precisa de internet para usar
- ✅ Todos os dados ficam **no seu computador**
- ✅ Senha protege apenas o painel de controle
- ✅ A tela de projeção é **pública** (qualquer um pode ver)

---

## 🚀 Pronto para Usar!

Se seguiu todos os passos corretamente, o sistema deve estar funcionando.

**Qualquer dúvida, verifique a seção de [Resolução de Problemas](#resolução-de-problemas).**

---

**Desenvolvido com ❤️ para igrejas**

Sistema de Projeção de Bíblia e Hinário v2.0

