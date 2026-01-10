# 🔄 Sincronização com GitHub

## 📋 Scripts de Sincronização Automática

### **Scripts Disponíveis:**

#### **1. PowerShell (Recomendado):**
```powershell
.\sync-with-github.ps1
```

#### **2. Batch (Alternativo):**
```cmd
sync-with-github.bat
```

---

## 🚀 Como Usar

### **Sincronização Manual:**

```bash
# Buscar atualizações
git fetch upstream

# Ver se há mudanças
git status

# Fazer merge se necessário
git merge upstream/main
```

### **Sincronização Automática:**

```powershell
# Execute uma vez por dia ou antes de trabalhar
.\sync-with-github.ps1
```

---

## 🔧 Configuração dos Remotes

Seu repositório está configurado com dois remotes:

```bash
# Repositório principal (onde estão as atualizações oficiais)
upstream https://github.com/userj81/Biblia_Hinario_Tabernaculo_O_Sinal.git

# Seu fork (para fazer suas próprias mudanças)
origin https://github.com/tabernaculoosinal/Biblia_Hinario_Tabernaculo_O_Sinal.git
```

---

## 📊 O que os Scripts Fazem

### **Verificações Automáticas:**
- ✅ Busca atualizações do repositório principal
- ✅ Verifica se há mudanças disponíveis
- ✅ Faz merge automático das atualizações
- ✅ Atualiza dependências se `package.json` foi modificado
- ✅ Mostra status final do repositório

### **Quando Usar:**
- 🔄 **Sempre** antes de começar a trabalhar
- 🔄 **Diariamente** para manter atualizado
- 🔄 **Após** fazer suas próprias mudanças
- 🔄 **Antes** de testar novas funcionalidades

---

## 🛠️ Solução de Problemas

### **Conflitos de Merge:**
```bash
# Se houver conflitos durante o merge:
git status
# Edite os arquivos com conflitos
git add <arquivo-conflitante>
git commit
```

### **Problemas com Dependências:**
```bash
# Se as dependências não atualizarem:
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **Erro de Autenticação:**
```bash
# Configure suas credenciais:
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

---

## 💡 Dicas Avançadas

### **Verificar Diferenças Antes do Merge:**
```bash
git log upstream/main --oneline -5
git diff upstream/main..HEAD --stat
```

### **Criar Backup Antes de Sincronizar:**
```bash
# Criar branch de backup
git checkout -b backup-$(date +%Y%m%d)
git checkout master
```

### **Sincronização Programada:**
- **Windows:** Use o Agendador de Tarefas
- **Linux/Mac:** Use cron jobs

---

## 📞 Suporte

**Problemas com sincronização?**

1. ✅ Execute `git status` para ver o estado atual
2. ✅ Verifique se os remotes estão configurados: `git remote -v`
3. ✅ Teste conexão: `git fetch upstream`
4. ✅ Execute o script de sincronização

**Scripts criados para facilitar sua vida!** 🎉