@echo off
echo ============================================
echo 🔄 Sincronizando com GitHub...
echo ============================================

REM Buscar atualizações do repositório principal
echo 📥 Buscando atualizações do upstream...
git fetch upstream

REM Verificar se há mudanças no upstream/main
for /f %%i in ('git rev-parse HEAD') do set local_commit=%%i
for /f %%i in ('git rev-parse upstream/main') do set remote_commit=%%i

if "%local_commit%" neq "%remote_commit%" (
    echo 📋 Há atualizações disponíveis!

    REM Fazer merge das mudanças
    echo 🔀 Fazendo merge das mudanças...
    git merge upstream/main --no-edit

    REM Verificar se package.json foi modificado
    git diff HEAD~1 --name-only | findstr "package.json" >nul
    if %errorlevel% equ 0 (
        echo 📦 Atualizando dependências...
        npm install
    )

    echo ✅ Sincronização concluída!
) else (
    echo ✅ Seu repositório já está atualizado!
)

echo.
echo 📊 Status atual:
git status --short

echo.
echo 💡 Dica: Execute este script sempre antes de trabalhar!
echo ============================================
pause