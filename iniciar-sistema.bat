@echo off
echo ============================================
echo 🚀 Iniciando Bíblia e Hinário v2.0
echo ============================================

REM Obtém o diretório do script
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo 📍 Diretório: %SCRIPT_DIR%
echo.

REM === PRIMEIRO: SINCRONIZAR COM GITHUB ===
echo 🔄 Verificando atualizações...
call "%SCRIPT_DIR%\sync-github.bat"
echo.

REM === SEGUNDO: VERIFICAR DEPENDÊNCIAS ===
echo ⚙️ Verificando sistema...
echo.

REM Verifica se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo.
    echo 📥 Baixe em: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Verifica se npm está instalado
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm não encontrado!
    echo.
    pause
    exit /b 1
)

REM Verifica se package.json existe
if not exist "package.json" (
    echo ❌ Arquivo package.json não encontrado!
    echo.
    echo 📂 Certifique-se de estar na pasta correta do projeto.
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo ✅ npm encontrado
echo ✅ package.json encontrado
echo.

echo 📦 Verificando dependências...
if not exist "node_modules" (
    echo 📥 Instalando dependências...
    npm install
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependências!
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependências já instaladas
)

echo.
echo 🚀 Iniciando o sistema...
echo.
echo 💡 O sistema estará disponível em:
echo    📱 Controle: http://localhost:5173/admin
echo    🖥️  Projeção: http://localhost:5173/projetor
echo.
echo 🔴 Para parar o sistema, feche esta janela ou pressione Ctrl+C
echo.

REM Inicia o sistema
npm run dev

echo.
echo 👋 Sistema encerrado.
pause