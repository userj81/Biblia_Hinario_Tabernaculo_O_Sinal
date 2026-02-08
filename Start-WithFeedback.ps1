# Script de Inicializacao com Feedback Visual - Biblia e Hinario v2.0
$ErrorActionPreference = "SilentlyContinue"

# Configuracao
$BackendPort = 3000
$FrontendPort = 5173
$TimeoutSec = 60
$IntervalSec = 2

Clear-Host
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  BIBLIA E HINARIO v2.0 - CARREGAMENTO" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Limpar processos antigos
Write-Host " [1/3] Limpando sessoes anteriores..." -ForegroundColor Gray
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

# 2. Iniciar o sistema em segundo plano
Write-Host " [2/3] Iniciando servidores (Backend e Frontend)..." -ForegroundColor Magenta
$NpmPath = "C:\Program Files\nodejs\npm.cmd"
$Job = Start-Job -ScriptBlock {
    param($path, $npm)
    Set-Location $path
    & $npm run dev
} -ArgumentList $PSScriptRoot, $NpmPath

# 3. Aguardar inicializacao com progresso
Write-Host " [3/3] Aguardando o sistema ficar pronto..." -ForegroundColor Yellow
$start = Get-Date

$backendReady = $false
$frontendReady = $false

while (((Get-Date) - $start).TotalSeconds -lt $TimeoutSec) {
    $backendReady = Test-NetConnection -ComputerName localhost -Port $BackendPort -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded
    $frontendReady = Test-NetConnection -ComputerName localhost -Port $FrontendPort -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded

    if ($backendReady -and $frontendReady) {
        break
    }

    $elapsed = [math]::Round(((Get-Date) - $start).TotalSeconds)
    $percent = [math]::Min(100, [math]::Round(($elapsed / $TimeoutSec) * 100))
    
    # Barra de progresso visual simples
    $barSize = 20
    $filledSize = [math]::Round(($percent / 100) * $barSize)
    $bar = "#" * $filledSize + "-" * ($barSize - $filledSize)
    
    Write-Host "`r[$bar] $percent% Carregando... ($elapsed s)  " -NoNewline -ForegroundColor Yellow
    
    Start-Sleep -Seconds $IntervalSec
}

Write-Host ""
Write-Host ""

if ($backendReady -and $frontendReady) {
    Clear-Host
    Write-Host "==============================================" -ForegroundColor Green
    Write-Host "     SISTEMA CARREGADO COM SUCESSO!           " -ForegroundColor Green
    Write-Host "==============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host " O sistema ja esta pronto e funcionando." -ForegroundColor White
    Write-Host ""
    Write-Host " LINKS DE ACESSO:" -ForegroundColor Cyan
    Write-Host "    Painel Admin: http://localhost:5173/admin" -ForegroundColor White
    Write-Host "    Projecao:     http://localhost:5173/projetor" -ForegroundColor White
    Write-Host ""
    Write-Host " TODOS OS DISPOSITIVOS NA REDE PODEM CONTROLAR AGORA." -ForegroundColor Yellow
    Write-Host ""
    Write-Host " MANTENHA ESTA JANELA ABERTA ENQUANTO USA O SISTEMA." -ForegroundColor Cyan
    Write-Host " Para fechar: Pressione Ctrl+C ou feche esta janela." -ForegroundColor Red
    Write-Host ""
} else {
    Write-Host " ERRO: O sistema demorou muito para iniciar." -ForegroundColor Red
    Write-Host " Verifique os logs se o problema persistir." -ForegroundColor Red
    Receive-Job -Job $Job
}

# Manter o job rodando e mostrar a saida
Wait-Job $Job
