# ==========================================================
# SCRIPT DE INICIALIZACAO ROBUSTA - BIBLIA E HINARIO v2.0
# ==========================================================
$ErrorActionPreference = "Stop" # Para tudo se houver erro grave
$GitExe = "C:\Program Files\Git\bin\git.exe"
$NodeExe = "C:\Program Files\nodejs\node.exe"
$NpmExe = "C:\Program Files\nodejs\npm.cmd"

function Show-Header {
    Clear-Host
    Write-Host "==============================================" -ForegroundColor Cyan
    Write-Host "       BIBLIA E HINARIO - TABERNACULO         " -ForegroundColor Cyan
    Write-Host "==============================================" -ForegroundColor Cyan
    Write-Host ""
}

try {
    Show-Header
    
    # 1. Limpeza de processos antigos
    Write-Host "[1/4] Limpando sessoes anteriores..." -ForegroundColor Gray
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 1

    # 2. Sincronizacao GitHub
    Write-Host "[2/4] Verificando atualizacoes no GitHub..." -ForegroundColor Yellow
    if (Test-Path $GitExe) {
        Set-Location $PSScriptRoot
        # Tenta atualizar com seguranca
        & $GitExe stash | Out-Null
        & $GitExe fetch upstream --quiet
        & $GitExe merge upstream/main --no-edit --quiet
        Write-Host "      Sistema sincronizado com sucesso." -ForegroundColor Green
    }
    else {
        Write-Host "      [!] Git nao encontrado. Pulando atualizacao automatica." -ForegroundColor Yellow
    }

    # 3. Verificacao de Ambiente
    Write-Host "[3/4] Verificando ambiente de execucao..." -ForegroundColor Magenta
    if (-not (Test-Path "package.json")) {
        throw "Arquivo 'package.json' nao encontrado nesta pasta: $PSScriptRoot"
    }
    
    # 4. Inicializacao do Servidor
    Write-Host "[4/4] Iniciando servidores..." -ForegroundColor Cyan
    $Job = Start-Job -ScriptBlock {
        param($path, $npm)
        Set-Location $path
        & $npm run dev
    } -ArgumentList $PSScriptRoot, $NpmExe

    # Ciclo de espera com progresso visual
    $start = Get-Date
    $TimeoutSec = 60
    while (((Get-Date) - $start).TotalSeconds -lt $TimeoutSec) {
        $backendReady = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded
        $frontendReady = Test-NetConnection -ComputerName localhost -Port 5173 -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded

        if ($backendReady -and $frontendReady) { break }

        $elapsed = [math]::Round(((Get-Date) - $start).TotalSeconds)
        $percent = [math]::Min(100, [math]::Round(($elapsed / $TimeoutSec) * 100))
        $bar = "#" * [math]::Round(($percent / 100) * 20) + "-" * (20 - [math]::Round(($percent / 100) * 20))
        Write-Host "`r      [$bar] $percent% Carregando... " -NoNewline -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }

    if ($backendReady -and $frontendReady) {
        Show-Header
        Write-Host "   >>> SISTEMA CARREGADO COM SUCESSO! <<<" -ForegroundColor Green -BackgroundColor Black
        Write-Host ""
        Write-Host " O sistema ja esta pronto para uso." -ForegroundColor White
        Write-Host ""
        Write-Host " LINKS DE ACESSO:" -ForegroundColor Cyan
        Write-Host "    Controle:  http://localhost:5173/admin" -ForegroundColor White
        Write-Host "    Projecao:  http://localhost:5173/projetor" -ForegroundColor White
        Write-Host ""
        Write-Host " MANTENHA ESTA JANELA ABERTA." -ForegroundColor Yellow
        Write-Host " Para encerrar: Feche a janela ou pressione Ctrl+C." -ForegroundColor Red
        Write-Host ""
        Wait-Job $Job
    }
    else {
        throw "O sistema demorou muito para responder. Verifique se as portas 3000/5173 estao bloqueadas."
    }

}
catch {
    Write-Host ""
    Write-Host "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" -ForegroundColor Red
    Write-Host "             OCORREU UM ERRO                  " -ForegroundColor Red
    Write-Host "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" -ForegroundColor Red
    Write-Host ""
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor White
    Write-Host ""
    Write-Host "O sistema nao pode ser iniciado corretamente." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pressione qualquer tecla para fechar esta janela..." -ForegroundColor Gray
    $null = [Console]::ReadKey($true)
}
