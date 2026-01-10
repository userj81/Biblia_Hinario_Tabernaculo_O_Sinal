# 🔄 Sincronização Automática com GitHub

## 🚀 Configuração Automática (Executar uma vez só)

### **Método 1: Configuração Automática (Recomendado)**

Execute o script de configuração (como administrador):

```powershell
# Execute como administrador
.\setup-auto-sync.ps1
```

**O que isso faz:**
- ✅ Cria tarefa no Agendador de Tarefas
- ✅ Configura execução ao fazer logon
- ✅ Testa a configuração automaticamente

### **Método 2: Configuração Manual**

1. **Abrir Agendador de Tarefas:**
   - Pressione `Win + R`
   - Digite: `taskschd.msc`
   - Enter

2. **Criar nova tarefa:**
   - Clique em "Criar Tarefa..." (no painel direito)

3. **Configurar Geral:**
   - Nome: `Biblia Hinario - Sync GitHub`
   - Marcar: "Executar com os privilégios mais altos"
   - Configurar para: "Windows 10" (ou sua versão)

4. **Configurar Gatilhos:**
   - Novo → "No logon"
   - Qualquer usuário
   - Marcar "Habilitado"

5. **Configurar Ações:**
   - Novo → "Iniciar um programa"
   - Programa: `powershell.exe`
   - Adicionar argumentos:
   ```
   -ExecutionPolicy Bypass -File "C:\caminho\para\sync-background.ps1" -Silent
   ```
   - Iniciar em: `C:\caminho\para\a\pasta\do\projeto`

6. **Configurar Condições:**
   - Marcar "Iniciar apenas se estiver conectado à rede"
   - Marcar "Iniciar se o computador estiver com bateria ou CA"

7. **Configurar Configurações:**
   - Permitir execução sob demanda
   - Se a tarefa falhar, reiniciar a cada: 1 minuto
   - Tentativa até: 3 vezes
   - Marcar "Se a tarefa não conseguir reiniciar, não inicie uma nova instância"

---

## 📊 Como Funciona

### **Execução Automática:**
- ✅ **Ao fazer logon** no Windows
- ✅ **Em background** (sem janelas)
- ✅ **Com logs** detalhados
- ✅ **Apenas quando necessário**

### **O que é verificado:**
- 🔍 Conexão com GitHub
- 🔍 Atualizações disponíveis
- 🔍 Conflitos potenciais
- 🔍 Dependências desatualizadas

---

## 📋 Arquivos de Configuração

### **Scripts Criados:**

1. **`setup-auto-sync.ps1`** - Configura/desinstala a tarefa automática
2. **`sync-background.ps1`** - Script executado pelo agendador
3. **`agendar-sync.bat`** - Versão alternativa em batch

### **Logs:**
- Local: `%USERPROFILE%\Documents\sync-github-log.txt`
- Conteúdo: Data/hora + resultado da sincronização

---

## 🛠️ Gerenciamento da Tarefa

### **Ver Status:**
```powershell
Get-ScheduledTask -TaskName "Biblia Hinario - Sync GitHub"
```

### **Executar Manualmente:**
```powershell
Start-ScheduledTask -TaskName "Biblia Hinario - Sync GitHub"
```

### **Parar Execução:**
```powershell
Stop-ScheduledTask -TaskName "Biblia Hinario - Sync GitHub"
```

### **Remover Tarefa:**
```powershell
.\setup-auto-sync.ps1 -Uninstall
```

---

## 📊 Monitoramento

### **Ver Logs:**
```powershell
notepad.exe "$env:USERPROFILE\Documents\sync-github-log.txt"
```

### **Ver Histórico da Tarefa:**
1. Abrir Agendador de Tarefas
2. Localizar tarefa: "Biblia Hinario - Sync GitHub"
3. Ver "Histórico" na parte inferior

---

## ⚠️ Solução de Problemas

### **Tarefa não executa:**
```powershell
# Verificar status
Get-ScheduledTask -TaskName "Biblia Hinario - Sync GitHub" | Select State, LastRunTime, LastTaskResult

# Forçar execução
Start-ScheduledTask -TaskName "Biblia Hinario - Sync GitHub"
```

### **Erro de permissões:**
- Execute `setup-auto-sync.ps1` como administrador
- Verifique se PowerShell tem permissões de execução

### **Git não encontrado:**
- Adicione Git ao PATH do sistema
- Reinicie o computador após instalar Git

---

## 🎯 Benefícios da Sincronização Automática

- ✅ **Zero intervenção** - funciona automaticamente
- ✅ **Sempre atualizado** - nunca esquece de sincronizar
- ✅ **Em background** - não interrompe trabalho
- ✅ **Com logs** - pode acompanhar histórico
- ✅ **Inteligente** - só baixa quando necessário
- ✅ **Confirmação** - verifica conflitos antes

---

## 📞 Suporte

**Problemas com configuração automática?**

1. ✅ Execute PowerShell como administrador
2. ✅ Verifique logs em Documents
3. ✅ Teste execução manual primeiro
4. ✅ Configure manualmente se automático falhar

**Agora seu repositório se mantém sempre atualizado!** 🎉🚀