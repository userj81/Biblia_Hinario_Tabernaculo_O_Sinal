@echo off
echo ============================================
echo 🎼 Bíblia e Hinário v2.0 - Instalação Completa
echo ============================================

REM Verificar se está executando como administrador
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Executando como administrador
) else (
    echo ❌ Execute como administrador para instalação completa
    echo.
    echo 💡 Clique com botão direito neste arquivo e selecione "Executar como administrador"
    pause
    exit /b 1
)

echo.
echo 📥 Baixando repositório...
git clone https://github.com/userj81/Biblia_Hinario_Tabernaculo_O_Sinal.git BibliaHinario
if errorlevel 1 (
    echo ❌ Erro ao baixar repositório
    pause
    exit /b 1
)

echo.
echo 📂 Entrando na pasta do projeto...
cd BibliaHinario

echo.
echo ⚙️ Executando configuração completa...
powershell.exe -ExecutionPolicy Bypass -File "setup-completo.ps1"

echo.
echo 🎉 Instalação concluída!
echo.
echo 💡 Próximos passos:
echo    1. Reinicie o computador
echo    2. O sistema iniciará automaticamente
echo    3. Acesse: http://localhost:5173/admin
echo.
echo 📖 Para mais informações, consulte PARA_USUARIOS_LEIGOS.md
echo.
pause