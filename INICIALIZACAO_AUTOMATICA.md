# 🔄 Inicialização Automática

## 📋 Opções para Iniciar Automaticamente

### **Opção 1: Configuração Automática (Recomendada)**

Execute o script de configuração (como administrador):

```powershell
# Execute como administrador
.\setup-inicializacao-automatica.ps1
```

**O que isso faz:**
- ✅ Cria tarefa no Agendador de Tarefas
- ✅ Inicia automaticamente ao fazer logon
- ✅ Modo silencioso (sem janelas)
- ✅ Recuperação automática se falhar

### **Opção 2: Atalho na Pasta de Inicialização**

1. **Criar atalho do PowerShell:**
   - Clique com botão direito em `Start-BibliaHinario.ps1`
   - Selecionar "Criar atalho"

2. **Mover para pasta de inicialização:**
   - Pressione `Win + R`
   - Digite: `shell:startup`
   - Cole o atalho na pasta

3. **Configurar atalho:**
   - Clique com botão direito no atalho
   - Propriedades → Atalho
   - Destino: `powershell.exe -ExecutionPolicy Bypass -File "C:\caminho\completo\Start-BibliaHinario.ps1" -Silent`

### **Opção 3: Inicialização Manual**

Execute sempre que precisar:

```batch
# Script Batch (mais simples)
.\iniciar-sistema.bat

# PowerShell (mais avançado)
.\Start-BibliaHinario.ps1
```

---

## 🔧 Gerenciamento

### **Ver Status:**
```powershell
Get-ScheduledTask -TaskName "Biblia Hinario - Auto Start"
```

### **Iniciar Manualmente:**
```powershell
Start-ScheduledTask -TaskName "Biblia Hinario - Auto Start"
```

### **Parar Execução:**
```powershell
Stop-ScheduledTask -TaskName "Biblia Hinario - Auto Start"
```

### **Remover Inicialização:**
```powershell
.\setup-inicializacao-automatica.ps1 -Remove
```

---

## 📊 Scripts Disponíveis

### **`iniciar-sistema.bat`**
- ✅ Mais simples e direto
- ✅ Interface visual
- ✅ Verificações básicas
- ✅ Ideal para uso manual

### **`Start-BibliaHinario.ps1`**
- ✅ Verificações avançadas
- ✅ Logs detalhados
- ✅ Modo silencioso
- ✅ Tratamento de erros
- ✅ Liberação automática de portas

### **`setup-inicializacao-automatica.ps1`**
- ✅ Configura Agendador de Tarefas
- ✅ Inicialização automática
- ✅ Recuperação automática
- ✅ Execute uma vez só

---

## 📋 Cenários de Uso

### **Para Igrejas:**
1. **Computador dedicado para projeção**
   - Configure inicialização automática
   - Sistema inicia com o Windows
   - Sempre pronto para cultos

### **Para Pastores/Técnicos:**
1. **Computador pessoal**
   - Atalho na área de trabalho
   - Inicie quando precisar
   - Fácil de usar

### **Para Desenvolvimento:**
1. **Ambiente de teste**
   - Scripts separados para cada ambiente
   - Configurações específicas por projeto

---

## ⚠️ Dicas Importantes

### **Para Inicialização Automática:**
- ✅ Configure apenas em computadores dedicados
- ✅ Certifique-se de que Node.js está instalado
- ✅ Teste a configuração antes de depender dela
- ✅ Monitore logs em caso de problemas

### **Para Uso Manual:**
- ✅ Crie atalhos na área de trabalho
- ✅ Use o script PowerShell para mais recursos
- ✅ Verifique logs se algo não funcionar

---

## 🔍 Solução de Problemas

### **Sistema não inicia automaticamente:**
```powershell
# Verificar status da tarefa
Get-ScheduledTask -TaskName "Biblia Hinario - Auto Start" | Select State, LastRunTime, LastTaskResult

# Ver logs
notepad.exe "$env:TEMP\BibliaHinario-Startup.log"
```

### **Erro de permissões:**
- Execute scripts como administrador
- Verifique permissões do PowerShell
- Configure política de execução

### **Portas já em uso:**
- Scripts liberam portas automaticamente
- Reinicie o computador se necessário

---

## 📊 Benefícios

- ✅ **Economia de tempo** - Não precisa iniciar manualmente
- ✅ **Confiabilidade** - Sistema sempre pronto
- ✅ **Automação** - Perfeito para ambientes de produção
- ✅ **Monitoramento** - Logs de todas as inicializações
- ✅ **Flexibilidade** - Múltiplas opções de configuração

**Configure uma vez e esqueça - o sistema cuida de tudo!** 🎯