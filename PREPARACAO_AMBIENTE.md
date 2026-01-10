# 🛠️ Preparação do Ambiente - Bíblia e Hinário v2.0

## ✅ Checklist de Preparação

### 1. Instalar Node.js (OBRIGATÓRIO)

**Download:**
- Site oficial: https://nodejs.org/
- **Recomendado:** Baixar a versão **LTS (Long Term Support)**
- Versão mínima necessária: **Node.js 18.0.0 ou superior**

**Passos:**
1. Acesse https://nodejs.org/
2. Baixe a versão LTS (botão verde)
3. Execute o instalador
4. **IMPORTANTE:** Durante a instalação, certifique-se de marcar a opção:
   - ✅ "Add to PATH" (adicionar ao PATH)
   - ✅ "npm package manager" (gerenciador de pacotes npm)

**Verificar instalação:**
```powershell
node --version
# Deve mostrar: v18.x.x ou superior

npm --version
# Deve mostrar: 9.x.x ou superior
```

---

### 2. Após instalar Node.js

Execute os seguintes comandos na pasta do projeto:

```powershell
# 1. Verificar se Node.js e npm estão funcionando
node --version
npm --version

# 2. Instalar todas as dependências do projeto
npm install

# Isso pode demorar alguns minutos (2-5 minutos)
# Você verá: "added X packages in Xm"
```

---

### 3. Verificar Banco de Dados

O banco de dados já deve estar presente:
```powershell
Test-Path data/bh.db
# Deve retornar: True
```

✅ **Banco de dados encontrado!**

---

### 4. Verificar Portas Livres

Antes de rodar, verifique se as portas estão livres:

```powershell
# Verificar porta 3000 (backend)
netstat -ano | findstr ":3000"

# Verificar porta 5173 (frontend)
netstat -ano | findstr ":5173"
```

✅ **Portas verificadas e livres!**

---

## 🚀 Próximos Passos

Após instalar o Node.js e executar `npm install`:

1. **Iniciar o sistema:**
   ```powershell
   npm run dev
   ```

2. **Acessar o sistema:**
   - Painel de Controle: http://localhost:5173/admin
   - Tela de Projeção: http://localhost:5173/projetor
   - Senha padrão: `admin123`

3. **Acesso via rede:**
   - O Vite mostrará o IP da rede automaticamente
   - Exemplo: `http://192.168.1.X:5173/admin`

---

## ⚠️ Problemas Comuns

### Node.js não encontrado após instalação
- **Solução:** Reinicie o terminal/PowerShell
- Se ainda não funcionar, reinicie o computador
- Verifique se marcou "Add to PATH" durante a instalação

### Erro ao instalar dependências
```powershell
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Porta já em uso
```powershell
# Finalizar processos Node.js
taskkill /F /IM node.exe
```

---

## 📋 Resumo do Ambiente

| Item | Status | Observação |
|------|--------|------------|
| Node.js | ❌ Não instalado | **Precisa instalar** |
| npm | ❌ Não encontrado | Vem com Node.js |
| Banco de dados | ✅ Presente | `data/bh.db` existe |
| Dependências | ❌ Não instaladas | Executar `npm install` |
| Porta 3000 | ✅ Livre | Pronta para uso |
| Porta 5173 | ✅ Livre | Pronta para uso |

---

**Próximo passo:** Instalar Node.js e depois executar `npm install`






















