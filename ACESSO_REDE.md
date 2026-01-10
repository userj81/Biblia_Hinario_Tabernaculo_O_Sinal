# 🌐 Acesso pela Rede Local

## 📍 Seu IP Local: **192.168.1.72**

## 🔗 Links de Acesso

### **Painel de Controle (Admin)**
```
http://192.168.1.72:5173/admin
```
- Use este link para controlar a projeção
- Senha padrão: `admin123`
- Acesse de qualquer dispositivo na mesma rede Wi-Fi

### **Tela de Projeção**
```
http://192.168.1.72:5173/projetor
```
- Use este link para exibir os slides
- Não requer senha
- Ideal para conectar ao datashow/TV

---

## 📱 Como Usar

### **Cenário Recomendado:**

1. **PC Principal (conectado ao datashow):**
   - Abra: `http://192.168.1.72:5173/projetor`
   - Pressione **F11** para tela cheia
   - Deixe esta tela apenas **exibindo**

2. **Tablet/Celular (para controlar):**
   - Abra: `http://192.168.1.72:5173/admin`
   - Faça login com a senha: `admin123`
   - Selecione hinos e versículos
   - Navegue com os botões ou setas

3. **Ambos na mesma rede Wi-Fi** ✅

---

## 🛠️ Scripts Úteis

### **Mostrar Links (PowerShell):**
```powershell
.\mostrar-links.ps1
```

### **Mostrar Links (CMD):**
```cmd
mostrar-links.bat
```

### **Abrir Página HTML:**
Abra o arquivo `LINKS_DE_ACESSO.html` no navegador

---

## ⚠️ Requisitos

- ✅ Servidor rodando (`npm run dev`)
- ✅ Todos os dispositivos na mesma rede Wi-Fi
- ✅ Firewall permitindo conexões nas portas 3000 e 5173

---

## 🔧 Resolução de Problemas

### **Não consigo acessar pela rede:**

1. **Verifique se o servidor está rodando:**
   ```powershell
   netstat -ano | findstr ":3000 :5173"
   ```

2. **Verifique o firewall:**
   - Windows: Adicione exceção para Node.js nas portas 3000 e 5173

3. **Verifique se está na mesma rede:**
   - Todos os dispositivos devem estar conectados ao mesmo Wi-Fi

4. **Verifique o IP:**
   ```powershell
   ipconfig
   ```
   - Procure por "Endereço IPv4"
   - Se o IP mudou, atualize os links

---

## 📝 Notas

- O IP pode mudar se você desconectar/reconectar na rede
- Use o script `mostrar-links.ps1` para obter o IP atual
- O sistema funciona **100% offline** após a instalação

---

**Última atualização:** IP detectado automaticamente ao executar os scripts




















