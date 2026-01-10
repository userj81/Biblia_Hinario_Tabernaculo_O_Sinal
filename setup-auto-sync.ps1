# Script para configurar sincronização automática no Agendador de Tarefas
# Execute este script como administrador para configurar

#Requires -RunAsAdministrator

param(
    [switch]$Uninstall = $false
)

$taskName = "Biblia Hinario - Sync GitHub"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$scriptPath = Join-Path $scriptDir "sync-background.ps1"

Write-Host "🔧 Configurando Sincronização Automática do Bíblia Hinário" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

if ($Uninstall) {
    Write-Host "🗑️ Removendo tarefa agendada..." -ForegroundColor Yellow
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
    Write-Host "❌ Script de sincronização não encontrado: $scriptPath" -ForegroundColor Red
    exit 1
}

Write-Host "📍 Localização do script: $scriptDir" -ForegroundColor Gray
Write-Host "📄 Script: sync-background.ps1" -ForegroundColor Gray
Write-Host ""

# Criar a tarefa agendada
Write-Host "⏳ Criando tarefa no Agendador..." -ForegroundColor Yellow

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -File `"$scriptPath`" -Silent"
$trigger = New-ScheduledTaskTrigger -AtLogOn
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType InteractiveToken
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

try {
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description "Sincroniza automaticamente o repositório Bíblia Hinário com GitHub ao fazer logon" -Force

    Write-Host "✅ Tarefa criada com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Detalhes da configuração:" -ForegroundColor Cyan
    Write-Host "   Nome da tarefa: $taskName" -ForegroundColor White
    Write-Host "   Gatilho: Ao fazer logon no Windows" -ForegroundColor White
    Write-Host "   Ação: Executar sync-background.ps1" -ForegroundColor White
    Write-Host "   Modo: Silencioso (sem janelas)" -ForegroundColor White
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
    Write-Host "   3. Verifique permissões do PowerShell" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "🎉 Configuração concluída!" -ForegroundColor Green
Write-Host "   Agora toda vez que você fizer logon no Windows," -ForegroundColor White
Write-Host "   o repositório será sincronizado automaticamente com o GitHub!" -ForegroundColor White
Write-Host ""
Write-Host "💡 Para remover a tarefa automática:" -ForegroundColor Cyan
Write-Host "   .\setup-auto-sync.ps1 -Uninstall" -ForegroundColor White

Write-Host ""
Write-Host "📊 Para verificar logs da sincronização:" -ForegroundColor Cyan
Write-Host "   notepad.exe `"`$env:USERPROFILE\Documents\sync-github-log.txt`"" -ForegroundColor White