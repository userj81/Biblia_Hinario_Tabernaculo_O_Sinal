@echo off
echo ============================================
echo 🔄 Sincronizando com GitHub
echo ============================================

REM Verificar se git está disponível
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git não encontrado - pulando sincronização
    goto :continue
)

echo 📥 Buscando atualizações do upstream...
git fetch upstream
if errorlevel 1 (
    echo ❌ Erro ao buscar atualizações
    goto :continue
)

REM Verificar se há mudanças
for /f %%i in ('git rev-parse HEAD') do set local_commit=%%i
for /f %%i in ('git rev-parse upstream/main') do set remote_commit=%%i

if "%local_commit%" neq "%remote_commit%" (
    echo 📋 Atualizações encontradas! Fazendo merge...
    git merge upstream/main --no-edit
    if errorlevel 1 (
        echo ❌ Erro no merge automático
        goto :continue
    )

    REM Verificar se package.json foi modificado
    git diff HEAD~1 --name-only | findstr "package.json" >nul
    if not errorlevel 1 (
        echo 📦 Atualizando dependências...
        npm install >nul 2>&1
    )

    echo ✅ Sincronização concluída!
) else (
    echo ✅ Repositório já está atualizado
)

:continue
echo ============================================