# Script para configurar inicialização automática do Bíblia e Hinário
# Execute como administrador para configurar

#Requires -RunAsAdministrator

param(
    [switch]$Remove = $false
)

$taskName = "Biblia Hinario - Auto Start"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$scriptPath = Join-Path $scriptDir "Start-BibliaHinario.ps1"

Write-Host "🔧 Configurando Inicialização Automática" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

if ($Remove) {
    Write-Host "🗑️ Removendo tarefa de inicialização automática..." -ForegroundColor Yellow
    try {
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction Stop
        Write-Host "✅ Tarefa removida com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro ao remover tarefa: $($_.Exception.Message)" -ForegroundColor Red
    }
    exit
}

# Verificar se o script existe
if (-not (Test-Path $scriptPath)) {
    Write-Host "❌ Script de inicialização não encontrado: $scriptPath" -ForegroundColor Red
    exit 1
}

Write-Host "📍 Localização do script: $scriptDir" -ForegroundColor Gray
Write-Host "📄 Script: Start-BibliaHinario.ps1" -ForegroundColor Gray
Write-Host ""

# Criar a tarefa agendada
Write-Host "⏳ Criando tarefa no Agendador..." -ForegroundColor Yellow

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -File `"$scriptPath`" -Silent"
$trigger = New-ScheduledTaskTrigger -AtLogOn

# Configurações especiais para inicialização automática
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType InteractiveToken
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -DontStopOnIdleEnd `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 1)

try {
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description "Inicia automaticamente o sistema Bíblia e Hinário ao fazer logon no Windows" -Force

    Write-Host "✅ Tarefa criada com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Detalhes da configuração:" -ForegroundColor Cyan
    Write-Host "   Nome da tarefa: $taskName" -ForegroundColor White
    Write-Host "   Gatilho: Ao fazer logon no Windows" -ForegroundColor White
    Write-Host "   Ação: Executar Start-BibliaHinario.ps1" -ForegroundColor White
    Write-Host "   Modo: Silencioso (sem janelas)" -ForegroundColor White
    Write-Host "   Recuperação: Reinicia automaticamente se falhar" -ForegroundColor White
    Write-Host ""

    # Testar a tarefa imediatamente
    Write-Host "🧪 Testando execução da tarefa..." -ForegroundColor Yellow
    Start-ScheduledTask -TaskName $taskName

    Start-Sleep -Seconds 3

    # Verificar se está rodando
    $task = Get-ScheduledTask -TaskName $taskName
    if ($task.State -eq "Running") {
        Write-Host "✅ Tarefa está executando!" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ Tarefa foi executada (pode ter terminado rapidamente)" -ForegroundColor Blue
    }

} catch {
    Write-Host "❌ Erro ao criar tarefa: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔍 Soluções alternativas:" -ForegroundColor Yellow
    Write-Host "   1. Execute este script como administrador" -ForegroundColor White
    Write-Host "   2. Configure manualmente no Agendador de Tarefas" -ForegroundColor White
    Write-Host "   3. Crie um atalho na pasta de inicialização" -ForegroundColor White
    Write-Host "   4. Use o script iniciar-sistema.bat" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "🎉 Configuração concluída!" -ForegroundColor Green
Write-Host "   Agora o Bíblia e Hinário será iniciado automaticamente" -ForegroundColor White
Write-Host "   sempre que você fizer logon no Windows!" -ForegroundColor White
Write-Host ""
Write-Host "💡 Para remover a inicialização automática:" -ForegroundColor Cyan
Write-Host "   .\setup-inicializacao-automatica.ps1 -Remove" -ForegroundColor White
Write-Host ""
Write-Host "📊 Para verificar logs de inicialização:" -ForegroundColor Cyan
Write-Host "   notepad.exe `"`$env:TEMP\BibliaHinario-Startup.log`"" -ForegroundColor White