# 🎼 Bíblia e Hinário v2.0 - Guia para Iniciantes

## 👋 Olá! Bem-vindo ao Bíblia e Hinário!

Este guia é para **pessoas que não entendem muito de computador**. Vamos configurar tudo de forma simples e automática.

---

## 🚀 Configuração Automática (FAÇA ISSO PRIMEIRO)

### **Opção 1: Comando Único (Mais Fácil!)** ⭐

1. **Abra o PowerShell como administrador:**
   - Pressione `Win + X`
   - Selecione "Windows PowerShell (Administrador)"

2. **Cole este comando completo e pressione Enter:**
```powershell
git clone https://github.com/userj81/Biblia_Hinario_Tabernaculo_O_Sinal.git BibliaHinario; cd BibliaHinario; .\setup-completo.ps1
```

3. **Aguarde** a instalação automática
4. **Reinicie** o computador
5. **Pronto!** Sistema funcionando!

### **Opção 2: Script Automático (Se o comando acima não funcionar)**

1. **Baixe** o projeto completo
2. **Clique com botão direito** no arquivo `setup-completo.ps1`
3. **Selecione** "Executar como administrador"
4. **Aguarde** a configuração automática
5. **Pronto!** Tudo configurado

**O que qualquer uma das opções faz:**
- ✅ Baixa o sistema completo
- ✅ Configura atualização automática
- ✅ Configura inicialização automática
- ✅ Testa se tudo funciona
- ✅ Mostra mensagens claras em português

### **Passo 2: Reinicie o Computador**

Após configurar, **reinicie o computador**. Quando ligar novamente, o sistema já estará funcionando!

---

## 💻 Como Usar o Sistema

### **Para Usar Agora Mesmo:**

**Opção Simples (Recomendada):**
```batch
# Clique duas vezes no arquivo:
iniciar-sistema.bat
```

**Opção Avançada:**
```powershell
# Abra o PowerShell e execute:
.\Start-BibliaHinario.ps1
```

### **Acesso ao Sistema:**

Após executar o comando acima, abra seu navegador e acesse:

- **🎛️ Painel de Controle:** http://localhost:5173/admin
- **🖥️ Tela de Projeção:** http://localhost:5173/projetor
- **🔑 Senha:** `admin123`

---

## 🌐 Como Usar na Rede Wi-Fi

### **Passo 1: Descubra seu IP**

Execute este comando no PowerShell:
```powershell
ipconfig | findstr "Endereço IPv4"
```

**Exemplo de resultado:**
```
Endereço IPv4. . . . . . . . . : 192.168.1.100
```

### **Passo 2: Use o IP Encontrado**

Substitua `192.168.1.X` pelo seu IP:

- **Controle:** http://192.168.1.100:5173/admin
- **Projeção:** http://192.168.1.100:5173/projetor

**Importante:** Todos os dispositivos devem estar na mesma rede Wi-Fi!

---

## 🔧 Manutenção (Coisas Simples)

### **Verificar se Está Funcionando:**

1. Abra o **Agendador de Tarefas** (pesquise no menu iniciar)
2. Procure por tarefas com "Biblia Hinario"
3. Deve ter duas tarefas ativas

### **Executar Manualmente:**

Se precisar executar manualmente:
```batch
# Execute este arquivo:
iniciar-sistema.bat
```

### **Reiniciar Tudo:**

Se algo não funcionar:
1. Feche todas as janelas do PowerShell
2. Execute novamente: `iniciar-sistema.bat`

---

## ❓ Problemas Comuns e Soluções

### **"Não consigo acessar pela rede"**
- ✅ Verifique se todos estão na mesma Wi-Fi
- ✅ Execute `ipconfig` para ver o IP correto
- ✅ Desative firewall temporariamente para testar

### **"Erro ao executar script"**
- ✅ Clique com botão direito → "Executar como administrador"
- ✅ Certifique-se de estar na pasta correta do projeto

### **"Sistema não inicia automaticamente"**
- ✅ Verifique se o computador reiniciou após configuração
- ✅ Confirme que as tarefas estão ativas no Agendador
- ✅ Execute manualmente primeiro para testar

### **"Git não encontrado"**
- ✅ Baixe em: https://git-scm.com/
- ✅ Marque "Add to PATH" durante instalação
- ✅ Reinicie o computador após instalar

---

## 🎯 Cenários de Uso

### **Para Igrejas Pequenas:**
- Configure em um computador dedicado
- Sempre pronto para cultos
- Família inteira pode usar

### **Para Pastores:**
- Configure no notebook pessoal
- Leve para qualquer lugar
- Funciona offline

### **Para Técnicos:**
- Configure em servidores
- Monitore remotamente
- Atualizações automáticas

---

## 📞 Precisa de Ajuda?

### **Passos para Pedir Ajuda:**

1. **Execute este comando:**
   ```batch
   .\Start-BibliaHinario.ps1
   ```
   (Não use modo silencioso para ver mensagens)

2. **Copie as mensagens de erro**

3. **Envie para o suporte:**
   - Abra uma Issue no GitHub
   - Descreva o problema
   - Cole as mensagens de erro

### **Documentação Completa:**

- 📚 **Instalação Detalhada:** [INSTALACAO.md](INSTALACAO.md)
- 🔄 **Sincronização:** [SINCRONIZACAO.md](SINCRONIZACAO.md)
- 🚀 **Inicialização Automática:** [INICIALIZACAO_AUTOMATICA.md](INICIALIZACAO_AUTOMATICA.md)

---

## 🙏 Agradecimentos

Este sistema foi criado com muito carinho para ajudar igrejas a modernizarem sua projeção de hinos e versículos bíblicos.

**Que Deus abençoe abundantemente sua igreja!** 🙏

---

## 📋 Checklist de Configuração

### **Método Comando Único (Recomendado):**
- [ ] Abriu PowerShell como administrador (Win + X → PowerShell Admin)
- [ ] Colou o comando: `git clone https://github.com/userj81/Biblia_Hinario_Tabernaculo_O_Sinal.git BibliaHinario; cd BibliaHinario; .\setup-completo.ps1`
- [ ] Aguardou a instalação automática
- [ ] Reiniciou o computador
- [ ] Testou o acesso local (http://localhost:5173)
- [ ] Descobriu o IP da rede (`ipconfig` no CMD)
- [ ] Testou o acesso pela rede Wi-Fi

### **Método Arquivo (Alternativo):**
- [ ] Baixou os arquivos do projeto
- [ ] Executou `setup-completo.ps1` como administrador
- [ ] Reiniciou o computador
- [ ] Testou o acesso local (http://localhost:5173)
- [ ] Descobriu o IP da rede
- [ ] Testou o acesso pela rede Wi-Fi

**✅ Tudo funcionando? Parabéns! Sua igreja está modernizada!** 🎉

**💡 Dica:** O comando único é o método mais rápido e fácil!

---

**Versão:** 2.0.1
**Última atualização:** Janeiro 2026
**Compatível:** Windows 10/11