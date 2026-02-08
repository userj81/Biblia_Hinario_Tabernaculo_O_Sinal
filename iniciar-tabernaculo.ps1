# ==========================================================
# SCRIPT DE INICIALIZACAO ROBUSTA - BIBLIA E HINARIO v2.1
# ==========================================================
$ErrorActionPreference = "Stop"
$Version = "2.1.0"
$LogFile = Join-Path $env:TEMP "BibliaHinario-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

# Configuracoes
$GitExe = "C:\Program Files\Git\bin\git.exe"
$NodeExe = "C:\Program Files\nodejs\node.exe"
$NpmExe = "C:\Program Files\nodejs\npm.cmd"
$BackendPort = 3000
$FrontendPort = 5173
$TimeoutSec = 90
$MaxRetries = 3

# ==========================================================
# FUNCOES AUXILIARES
# ==========================================================

function Write-Log {
    param([string]$Message, [string]$Color = "White", [switch]$NoConsole)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] $Message"
    Add-Content -Path $LogFile -Value $logMessage
    if (-not $NoConsole) {
        Write-Host $Message -ForegroundColor $Color
    }
}

function Show-Header {
    Clear-Host
    Write-Host ""
    Write-Host "                                 /T /I" -ForegroundColor Yellow
    Write-Host "                                / |/ | .-~/" -ForegroundColor Yellow
    Write-Host "                            T\ Y  I  |/  /  _" -ForegroundColor Yellow
    Write-Host "           /T               | \I  |  I  Y.-~/" -ForegroundColor Yellow
    Write-Host "          I l   /I       T\ |  |  l  |  T  /" -ForegroundColor Yellow
    Write-Host "   __  | \l   \l  \I l __l  l   \   ``  _. |" -ForegroundColor Yellow
    Write-Host "   \ ~-l  ``\   ``\  \  \\ ~\  \   ``. .-~   |" -ForegroundColor Yellow
    Write-Host "    \   ~-. ""--.  ``  \  ^._ ^. ""--.  /  \   |" -ForegroundColor Yellow
    Write-Host " .--~-._  ~-  ``  _  ~-_.-""-."" ._ /._ ."" ./" -ForegroundColor Yellow
    Write-Host "  >--.  ~-.   ._  ~>-""    ""\\   7   7   ]" -ForegroundColor Yellow
    Write-Host " ^.___~""--._    ~-{  .-~ .  ``\ Y . /    |" -ForegroundColor Yellow
    Write-Host "  <__ ~""--.  ~       /_/   \   \I  Y   : |" -ForegroundColor Yellow
    Write-Host "    ^-.__           ~(_/   \   >._:   | l______" -ForegroundColor Yellow
    Write-Host "        ^--.,___.-~""  /_/   !  ``-.~""--l_ /     ~""-." -ForegroundColor Yellow
    Write-Host "               (_/ .  ~(   /'     ""~""--,Y   -=b-. _)" -ForegroundColor Yellow
    Write-Host "                (_/ .  \  :           / l      c""~o \" -ForegroundColor Yellow
    Write-Host "                 \ /    ``.    .     .^   \_.-~""~--.  )" -ForegroundColor Yellow
    Write-Host "                  (_/ .   ``  /     /       !       )/" -ForegroundColor Yellow
    Write-Host "                   / / _.   '.   .':      /        '" -ForegroundColor Yellow
    Write-Host "                   ~(_/ .   /    _  ``  .-<_" -ForegroundColor Yellow
    Write-Host "                     /_/ . ' .-~"" ``.  / \  \          ,z=." -ForegroundColor Yellow
    Write-Host "                     ~( /   '  :   | K   ""--.~-.______//" -ForegroundColor Yellow
    Write-Host "                       ""--.    l   I/ \_    __{--->._(==." -ForegroundColor Yellow
    Write-Host "                        //(     \  <    ~""~""     //" -ForegroundColor Yellow
    Write-Host "                       /' /\     \  \     ,v=.  ((" -ForegroundColor Yellow
    Write-Host "                     .^. / /\     ""  }__ //===-  ``" -ForegroundColor Yellow
    Write-Host "                    / / ' '  ""--..,__ {---(==-" -ForegroundColor Yellow
    Write-Host "                  .^ '       :  T  ~""   ll" -ForegroundColor Yellow
    Write-Host "                 / .  .  . : | :!        \\" -ForegroundColor Yellow
    Write-Host "                (_/  /   | | j-""          ~^" -ForegroundColor Yellow
    Write-Host "                  ~-<_(_.^-~""" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "            ╔═══════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "            ║                                               ║" -ForegroundColor Cyan
    Write-Host "            ║     T A B E R N Á C U L O   O   S I N A L    ║" -ForegroundColor White
    Write-Host "            ║                                               ║" -ForegroundColor Cyan
    Write-Host "            ║              A M A Z O N A S                  ║" -ForegroundColor White
    Write-Host "            ║                                               ║" -ForegroundColor Cyan
    Write-Host "            ╚═══════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "                       Bíblia e Hinário v$Version" -ForegroundColor Gray
    Write-Host ""
    Write-Log "Iniciando sistema - Versao $Version" -NoConsole
}

function Test-Prerequisites {
    Write-Host "[1/6] Verificando pre-requisitos..." -ForegroundColor Cyan
    Write-Log "[1/6] Verificando pre-requisitos..."

    $issues = @()

    # Verificar Node.js
    if (Test-Path $NodeExe) {
        $nodeVersion = & $NodeExe --version 2>&1
        Write-Host "   Node.js: $nodeVersion" -ForegroundColor Green
        Write-Log "   Node.js encontrado: $nodeVersion"
    } else {
        $issues += "Node.js nao encontrado em: $NodeExe"
        Write-Host "   Node.js: NAO ENCONTRADO" -ForegroundColor Red
    }

    # Verificar npm
    if (Test-Path $NpmExe) {
        $npmVersion = & $NpmExe --version 2>&1
        Write-Host "   npm: v$npmVersion" -ForegroundColor Green
        Write-Log "   npm encontrado: v$npmVersion"
    } else {
        $issues += "npm nao encontrado em: $NpmExe"
        Write-Host "   npm: NAO ENCONTRADO" -ForegroundColor Red
    }

    # Verificar Git (opcional)
    if (Test-Path $GitExe) {
        $gitVersion = & $GitExe --version 2>&1
        Write-Host "   Git: $gitVersion" -ForegroundColor Green
        Write-Log "   Git encontrado: $gitVersion"
    } else {
        Write-Host "   Git: NAO ENCONTRADO (opcional)" -ForegroundColor Yellow
        Write-Log "   Git nao encontrado (opcional)"
    }

    # Verificar package.json
    if (Test-Path "package.json") {
        Write-Host "   package.json: OK" -ForegroundColor Green
        Write-Log "   package.json encontrado"
    } else {
        $issues += "package.json nao encontrado nesta pasta"
        Write-Host "   package.json: NAO ENCONTRADO" -ForegroundColor Red
    }

    if ($issues.Count -gt 0) {
        Write-Host ""
        Write-Host "PROBLEMAS ENCONTRADOS:" -ForegroundColor Red
        foreach ($issue in $issues) {
            Write-Host "   - $issue" -ForegroundColor Yellow
            Write-Log "   PROBLEMA: $issue"
        }
        Write-Host ""
        Write-Host "SOLUCOES:" -ForegroundColor Cyan
        Write-Host "   1. Instale Node.js de: https://nodejs.org/" -ForegroundColor White
        Write-Host "   2. Execute este script na pasta correta do projeto" -ForegroundColor White
        throw "Pre-requisitos nao atendidos"
    }

    Write-Host ""
}

function Clear-OldProcesses {
    Write-Host "[2/6] Limpando processos anteriores..." -ForegroundColor Cyan
    Write-Log "[2/6] Limpando processos anteriores..."

    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        $nodeProcesses | Stop-Process -Force
        Write-Host "   $($nodeProcesses.Count) processo(s) Node.js encerrado(s)" -ForegroundColor Green
        Write-Log "   $($nodeProcesses.Count) processo(s) encerrado(s)"
    } else {
        Write-Host "   Nenhum processo anterior encontrado" -ForegroundColor Gray
        Write-Log "   Nenhum processo anterior"
    }
    Start-Sleep -Seconds 1
    Write-Host ""
}

function Sync-WithGitHub {
    Write-Host "[3/6] Sincronizando com GitHub..." -ForegroundColor Cyan
    Write-Log "[3/6] Tentando sincronizar com GitHub..."

    if (-not (Test-Path $GitExe)) {
        Write-Host "   Git nao instalado - pulando sincronizacao" -ForegroundColor Yellow
        Write-Log "   Git nao encontrado - pulando"
        Write-Host ""
        return
    }

    try {
        Set-Location $PSScriptRoot

        # Verificar se e repositorio git
        $isRepo = & $GitExe rev-parse --is-inside-work-tree 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "   Nao e um repositorio Git - pulando" -ForegroundColor Yellow
            Write-Log "   Nao e repositorio Git"
            Write-Host ""
            return
        }

        # Salvar mudancas locais
        & $GitExe stash --quiet 2>&1 | Out-Null

        # Tentar fetch de origin ou upstream
        $remote = "origin"
        $remotes = & $GitExe remote 2>&1
        if ($remotes -match "upstream") {
            $remote = "upstream"
        }

        & $GitExe fetch $remote --quiet 2>&1
        if ($LASTEXITCODE -eq 0) {
            & $GitExe merge "$remote/main" --no-edit --quiet 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "   Sincronizado com $remote/main" -ForegroundColor Green
                Write-Log "   Sincronizado com $remote/main com sucesso"
            } else {
                Write-Host "   Erro ao fazer merge - continuando sem atualizar" -ForegroundColor Yellow
                Write-Log "   Erro no merge"
            }
        } else {
            Write-Host "   Sem conexao com GitHub - continuando offline" -ForegroundColor Yellow
            Write-Log "   Sem conexao com GitHub"
        }

    } catch {
        Write-Host "   Erro na sincronizacao: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Log "   Erro: $($_.Exception.Message)"
    }
    Write-Host ""
}

function Install-Dependencies {
    Write-Host "[4/6] Verificando dependencias..." -ForegroundColor Cyan
    Write-Log "[4/6] Verificando dependencias..."

    if (-not (Test-Path "node_modules")) {
        Write-Host "   node_modules nao encontrado - instalando..." -ForegroundColor Yellow
        Write-Log "   Instalando dependencias..."

        & $NpmExe install 2>&1 | Out-File -Append $LogFile

        if ($LASTEXITCODE -eq 0) {
            Write-Host "   Dependencias instaladas com sucesso" -ForegroundColor Green
            Write-Log "   Dependencias instaladas"
        } else {
            throw "Erro ao instalar dependencias. Verifique o log: $LogFile"
        }
    } else {
        Write-Host "   Dependencias ja instaladas" -ForegroundColor Green
        Write-Log "   Dependencias OK"
    }
    Write-Host ""
}

function Start-ServerWithRetry {
    Write-Host "[5/6] Iniciando servidores..." -ForegroundColor Cyan
    Write-Log "[5/6] Iniciando servidores (Backend:$BackendPort, Frontend:$FrontendPort)..."

    for ($attempt = 1; $attempt -le $MaxRetries; $attempt++) {
        if ($attempt -gt 1) {
            Write-Host "   Tentativa $attempt de $MaxRetries..." -ForegroundColor Yellow
            Write-Log "   Tentativa $attempt de $MaxRetries"
            Start-Sleep -Seconds 3
        }

        # Iniciar servidor
        $Job = Start-Job -ScriptBlock {
            param($path, $npm, $logFile)
            Set-Location $path
            & $npm run dev 2>&1 | Tee-Object -Append -FilePath $logFile
        } -ArgumentList $PSScriptRoot, $NpmExe, $LogFile

        # Aguardar inicializacao
        $start = Get-Date
        $backendReady = $false
        $frontendReady = $false

        while (((Get-Date) - $start).TotalSeconds -lt $TimeoutSec) {
            $backendReady = Test-NetConnection -ComputerName localhost -Port $BackendPort -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded
            $frontendReady = Test-NetConnection -ComputerName localhost -Port $FrontendPort -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded

            if ($backendReady -and $frontendReady) {
                Write-Host ""
                return $Job
            }

            $elapsed = [math]::Round(((Get-Date) - $start).TotalSeconds)
            $percent = [math]::Min(100, [math]::Round(($elapsed / $TimeoutSec) * 100))
            $barSize = 30
            $filledSize = [math]::Round(($percent / 100) * $barSize)
            $bar = "=" * $filledSize + "-" * ($barSize - $filledSize)

            $status = ""
            if ($backendReady) { $status += "Backend:OK " } else { $status += "Backend:... " }
            if ($frontendReady) { $status += "Frontend:OK" } else { $status += "Frontend:..." }

            Write-Host "`r   [$bar] $percent% | $status | ${elapsed}s " -NoNewline -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        }

        # Timeout - tentar novamente
        Write-Host ""
        Write-Host "   Timeout - servidor nao respondeu" -ForegroundColor Red
        Write-Log "   Timeout na tentativa $attempt"

        Stop-Job $Job -ErrorAction SilentlyContinue
        Remove-Job $Job -ErrorAction SilentlyContinue

        if ($attempt -eq $MaxRetries) {
            Write-Host ""
            Write-Host "   DIAGNOSTICO:" -ForegroundColor Yellow
            Write-Host "   - Backend (porta $BackendPort): $(if($backendReady){'OK'}else{'FALHOU'})" -ForegroundColor $(if($backendReady){'Green'}else{'Red'})
            Write-Host "   - Frontend (porta $FrontendPort): $(if($frontendReady){'OK'}else{'FALHOU'})" -ForegroundColor $(if($frontendReady){'Green'}else{'Red'})
            Write-Host ""
            Write-Host "   Verifique o log para mais detalhes: $LogFile" -ForegroundColor Cyan
            Write-Log "   Falha total apos $MaxRetries tentativas"
            throw "Servidor nao iniciou apos $MaxRetries tentativas"
        }
    }
}

function Get-NetworkIP {
    try {
        $ip = Get-NetIPAddress -AddressFamily IPv4 |
              Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.PrefixOrigin -eq "Dhcp" } |
              Select-Object -First 1 -ExpandProperty IPAddress
        return $ip
    } catch {
        return "N/A"
    }
}

function Show-SuccessMessage {
    param($Job)

    Show-Header

    Write-Host "   ███████╗██╗   ██╗ ██████╗███████╗███████╗███████╗ ██████╗ " -ForegroundColor Green
    Write-Host "   ██╔════╝██║   ██║██╔════╝██╔════╝██╔════╝██╔════╝██╔═══██╗" -ForegroundColor Green
    Write-Host "   ███████╗██║   ██║██║     █████╗  ███████╗███████╗██║   ██║" -ForegroundColor Green
    Write-Host "   ╚════██║██║   ██║██║     ██╔══╝  ╚════██║╚════██║██║   ██║" -ForegroundColor Green
    Write-Host "   ███████║╚██████╔╝╚██████╗███████╗███████║███████║╚██████╔╝" -ForegroundColor Green
    Write-Host "   ╚══════╝ ╚═════╝  ╚═════╝╚══════╝╚══════╝╚══════╝ ╚═════╝ " -ForegroundColor Green
    Write-Host ""

    $networkIP = Get-NetworkIP

    Write-Host " LINKS DE ACESSO LOCAL:" -ForegroundColor Cyan
    Write-Host "   Controle:  http://localhost:$FrontendPort/admin" -ForegroundColor White
    Write-Host "   Projecao:  http://localhost:$FrontendPort/projetor" -ForegroundColor White
    Write-Host ""

    if ($networkIP -ne "N/A") {
        Write-Host " ACESSO DA REDE (outros dispositivos):" -ForegroundColor Cyan
        Write-Host "   Controle:  http://${networkIP}:$FrontendPort/admin" -ForegroundColor Yellow
        Write-Host "   Projecao:  http://${networkIP}:$FrontendPort/projetor" -ForegroundColor Yellow
        Write-Host ""
    }

    Write-Host " STATUS:" -ForegroundColor Cyan
    Write-Host "   Backend:  http://localhost:$BackendPort [OK]" -ForegroundColor Green
    Write-Host "   Frontend: http://localhost:$FrontendPort [OK]" -ForegroundColor Green
    Write-Host "   Log:      $LogFile" -ForegroundColor Gray
    Write-Host ""

    Write-Host " MANTENHA ESTA JANELA ABERTA ENQUANTO USA O SISTEMA." -ForegroundColor Yellow
    Write-Host " Para encerrar: Feche esta janela ou pressione Ctrl+C." -ForegroundColor Red
    Write-Host ""

    Write-Log "Sistema iniciado com sucesso"
    Write-Log "Network IP: $networkIP"

    # Abrir navegador automaticamente
    Start-Sleep -Seconds 2
    try {
        Start-Process "http://localhost:$FrontendPort/admin"
        Write-Host " Navegador aberto automaticamente!" -ForegroundColor Green
        Write-Log "Navegador aberto automaticamente"
    } catch {
        Write-Host " (Abra o navegador manualmente)" -ForegroundColor Gray
        Write-Log "Erro ao abrir navegador: $($_.Exception.Message)"
    }

    Write-Host ""
    Wait-Job $Job
}

# ==========================================================
# EXECUCAO PRINCIPAL
# ==========================================================

try {
    Show-Header
    Write-Host " Arquivo de log: $LogFile" -ForegroundColor Gray
    Write-Host ""

    Set-Location $PSScriptRoot

    Test-Prerequisites
    Clear-OldProcesses
    Sync-WithGitHub
    Install-Dependencies
    $Job = Start-ServerWithRetry

    Write-Host "[6/6] Sistema pronto!" -ForegroundColor Green
    Write-Log "[6/6] Sistema pronto"
    Write-Host ""

    Show-SuccessMessage -Job $Job

} catch {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║          ERRO NA INICIALIZACAO             ║" -ForegroundColor Red
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Red
    Write-Host ""
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""

    Write-Log "ERRO FATAL: $($_.Exception.Message)"
    Write-Log "StackTrace: $($_.ScriptStackTrace)"

    # Mostrar logs do Job se disponivel
    if ($Job) {
        Write-Host "LOGS DO SERVIDOR:" -ForegroundColor Cyan
        $jobOutput = Receive-Job $Job -ErrorAction SilentlyContinue
        if ($jobOutput) {
            $jobOutput | Select-Object -Last 20 | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
        }
        Stop-Job $Job -ErrorAction SilentlyContinue
        Remove-Job $Job -ErrorAction SilentlyContinue
    }

    Write-Host ""
    Write-Host "ARQUIVO DE LOG COMPLETO:" -ForegroundColor Cyan
    Write-Host "   $LogFile" -ForegroundColor White
    Write-Host ""
    Write-Host "SUPORTE:" -ForegroundColor Cyan
    Write-Host "   Consulte: docs/INSTALACAO.md" -ForegroundColor White
    Write-Host "   Ou abra uma issue no GitHub" -ForegroundColor White
    Write-Host ""
    Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor Gray
    $null = [Console]::ReadKey($true)
    exit 1
}
