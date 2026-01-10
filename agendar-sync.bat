@echo off
echo ============================================
echo 📅 Configurando Sincronização Automática
echo ============================================

REM Verificar se está executando como administrador
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Executando como administrador
) else (
    echo ❌ Execute como administrador para configurar agendamento
    echo.
    echo 💡 Clique com botão direito no arquivo e selecione "Executar como administrador"
    pause
    exit /b 1
)

echo.
echo 🔧 Configurando tarefa no Agendador...
echo.

REM Criar a tarefa agendada
schtasks /create /tn "Biblia Hinario - Sincronizacao GitHub" /tr "%~dp0sync-with-github.bat" /sc onlogon /rl highest /f

if %errorLevel% equ 0 (
    echo ✅ Tarefa criada com sucesso!
    echo.
    echo 📋 Detalhes da tarefa:
    echo    Nome: Biblia Hinario - Sincronizacao GitHub
    echo    Gatilho: Ao fazer logon
    echo    Ação: Executar sync-with-github.bat
    echo.
    echo 🎯 Agora toda vez que você fizer logon no Windows,
    echo    o script será executado automaticamente!
) else (
    echo ❌ Erro ao criar tarefa
    echo.
    echo 🔍 Possíveis soluções:
    echo    1. Execute este arquivo como administrador
    echo    2. Verifique se o PowerShell tem permissões
    echo    3. Configure manualmente no Agendador de Tarefas
)

echo.
echo ============================================
echo 📖 Para configurar manualmente:
echo    1. Pesquise por "Agendador de Tarefas"
echo    2. Clique em "Criar Tarefa"
echo    3. Configure como mostrado acima
echo ============================================
pause