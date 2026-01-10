# Script PowerShell para iniciar Bíblia e Hinário v2.0
# Uso: .\Start-BibliaHinario.ps1

param(
    [switch]$Silent = $false
)

# Configura o diretório de trabalho
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptPath

# Função para escrever log
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "$timestamp [$Level] $Message"

    if (-not $Silent) {
        switch ($Level) {
            "ERROR" { Write-Host $logMessage -ForegroundColor Red }
            "WARN"  { Write-Host $logMessage -ForegroundColor Yellow }
            "SUCCESS" { Write-Host $logMessage -ForegroundColor Green }
            default { Write-Host $logMessage -ForegroundColor Cyan }
        }
    }

    # Salva log em arquivo
    $logPath = "$env:TEMP\BibliaHinario-Startup.log"
    $logMessage | Out-File -FilePath $logPath -Append
}

# Função para sincronizar com GitHub
function Sync-WithGitHub {
    Write-Log "=== INICIANDO SINCRONIZAÇÃO COM GITHUB ==="
    if (-not $Silent) { Write-Host "🔄 Sincronizando com GitHub..." -ForegroundColor Cyan }

    try {
        # Verificar se git está disponível
        $gitVersion = git --version 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Git não encontrado - pulando sincronização" "WARN"
            if (-not $Silent) { Write-Host "⚠️  Git não encontrado - pulando sincronização" -ForegroundColor Yellow }
            return $false
        }

        # Buscar atualizações do upstream
        Write-Log "Buscando atualizações do upstream"
        if (-not $Silent) { Write-Host "📥 Buscando atualizações..." -ForegroundColor Yellow }

        $fetchResult = git fetch upstream 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Log "ERRO no fetch: $fetchResult" "ERROR"
            if (-not $Silent) { Write-Host "❌ Erro ao buscar atualizações" -ForegroundColor Red }
            return $false
        }

        # Verificar se há mudanças
        $localCommit = git rev-parse HEAD 2>$null
        $remoteCommit = git rev-parse upstream/main 2>$null

        if ($localCommit -ne $remoteCommit) {
            Write-Log "Atualizações encontradas. Fazendo merge..."
            if (-not $Silent) { Write-Host "📋 Atualizações encontradas! Fazendo merge..." -ForegroundColor Green }

            # Fazer merge
            $mergeResult = git merge upstream/main --no-edit 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Merge realizado com sucesso"

                # Verificar se package.json foi modificado
                $changedFiles = git diff HEAD~1 --name-only 2>$null
                if ($changedFiles -match "package.json") {
                    Write-Log "Atualizando dependências npm"
                    if (-not $Silent) { Write-Host "📦 Atualizando dependências..." -ForegroundColor Yellow }
                    npm install 2>$null | Out-Null
                }

                if (-not $Silent) { Write-Host "✅ Sincronização concluída!" -ForegroundColor Green }
                Write-Log "Sincronização concluída com sucesso"
                return $true
            } else {
                Write-Log "ERRO no merge: $mergeResult" "ERROR"
                if (-not $Silent) { Write-Host "❌ Erro no merge automático" -ForegroundColor Red }
                return $false
            }
        } else {
            Write-Log "Repositório já está atualizado"
            if (-not $Silent) { Write-Host "✅ Repositório já está atualizado" -ForegroundColor Green }
            return $true
        }

    } catch {
        Write-Log "ERRO na sincronização: $($_.Exception.Message)" "ERROR"
        if (-not $Silent) { Write-Host "❌ Erro na sincronização: $($_.Exception.Message)" -ForegroundColor Red }
        return $false
    }
}

if (-not $Silent) {
    Write-Host "🚀 Iniciando Bíblia e Hinário v2.0" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "📍 Diretório: $ScriptPath" -ForegroundColor Gray
    Write-Host ""
}

Write-Log "Iniciando script de inicialização"

# === PRIMEIRO: SINCRONIZAR COM GITHUB ===
$syncResult = Sync-WithGitHub
Write-Log "Resultado da sincronização: $syncResult"

# === SEGUNDO: VERIFICAR DEPENDÊNCIAS ===
Write-Log "=== VERIFICANDO DEPENDÊNCIAS ==="

# Verifica se Node.js está instalado
try {
    $nodeVersion = node --version 2>$null
    Write-Log "Node.js encontrado: $nodeVersion"
    if (-not $Silent) { Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green }
} catch {
    Write-Log "Node.js não encontrado" "ERROR"
    if (-not $Silent) {
        Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
        Write-Host "📥 Baixe em: https://nodejs.org/" -ForegroundColor Yellow
        Read-Host "Pressione Enter para sair"
    }
    exit 1
}

# Verifica se npm está instalado
try {
    $npmVersion = npm --version 2>$null
    Write-Log "npm encontrado: v$npmVersion"
    if (-not $Silent) { Write-Host "✅ npm encontrado: v$npmVersion" -ForegroundColor Green }
} catch {
    Write-Log "npm não encontrado" "ERROR"
    if (-not $Silent) {
        Write-Host "❌ npm não encontrado!" -ForegroundColor Red
        Read-Host "Pressione Enter para sair"
    }
    exit 1
}

# Verifica se package.json existe
if (-not (Test-Path "package.json")) {
    Write-Log "package.json não encontrado" "ERROR"
    if (-not $Silent) {
        Write-Host "❌ Arquivo package.json não encontrado!" -ForegroundColor Red
        Write-Host "📂 Certifique-se de estar na pasta correta do projeto." -ForegroundColor Yellow
        Read-Host "Pressione Enter para sair"
    }
    exit 1
}

if (-not $Silent) { Write-Host "✅ package.json encontrado" -ForegroundColor Green }

# Verifica e instala dependências
if (-not (Test-Path "node_modules")) {
    Write-Log "Instalando dependências npm"
    if (-not $Silent) {
        Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    }

    try {
        npm install 2>$null
        Write-Log "Dependências instaladas com sucesso"
        if (-not $Silent) { Write-Host "✅ Dependências instaladas!" -ForegroundColor Green }
    } catch {
        Write-Log "Erro ao instalar dependências: $($_.Exception.Message)" "ERROR"
        if (-not $Silent) {
            Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
            Read-Host "Pressione Enter para sair"
        }
        exit 1
    }
} else {
    Write-Log "Dependências já instaladas"
    if (-not $Silent) { Write-Host "✅ Dependências já instaladas" -ForegroundColor Green }
}

# Verifica se há processos Node rodando na porta 3000
$nodeProcesses = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue |
    Where-Object { $_.State -eq "Listen" }

if ($nodeProcesses) {
    Write-Log "Porta 3000 já em uso, tentando liberar"
    if (-not $Silent) {
        Write-Host "⚠️  Porta 3000 já em uso. Tentando liberar..." -ForegroundColor Yellow
    }

    # Mata processos Node.js
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2
}

if (-not $Silent) {
    Write-Host ""
    Write-Host "🚀 Iniciando o sistema..." -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 O sistema estará disponível em:" -ForegroundColor Cyan
    Write-Host "   📱 Controle: http://localhost:5173/admin" -ForegroundColor White
    Write-Host "   🖥️  Projeção: http://localhost:5173/projetor" -ForegroundColor White
    Write-Host ""
    Write-Host "🔴 Para parar o sistema: feche esta janela ou pressione Ctrl+C" -ForegroundColor Red
    Write-Host ""
}

Write-Log "Iniciando npm run dev"

# Inicia o sistema
try {
    npm run dev
    Write-Log "Sistema encerrado normalmente"
} catch {
    Write-Log "Erro ao executar npm run dev: $($_.Exception.Message)" "ERROR"
    if (-not $Silent) {
        Write-Host "❌ Erro ao iniciar o sistema!" -ForegroundColor Red
    }
} finally {
    if (-not $Silent) {
        Write-Host ""
        Write-Host "👋 Sistema encerrado." -ForegroundColor Blue
        Read-Host "Pressione Enter para sair"
    }
}