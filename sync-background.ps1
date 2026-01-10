# Script de sincronização em background para Agendador de Tarefas
# Este script roda silenciosamente no background

param(
    [switch]$Silent = $false
)

# Função para log
function Write-Log {
    param([string]$Message)
    $logPath = "$env:USERPROFILE\Documents\sync-github-log.txt"
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $Message" | Out-File -FilePath $logPath -Append
}

# Obter o diretório do script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

if (-not $Silent) {
    Write-Host "🔄 Iniciando sincronização automática..." -ForegroundColor Cyan
}

Write-Log "Iniciando sincronização automática"

try {
    # Verificar se git está disponível
    $gitVersion = git --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Log "ERRO: Git não encontrado"
        if (-not $Silent) { Write-Host "❌ Git não encontrado" -ForegroundColor Red }
        exit 1
    }

    # Buscar atualizações do upstream
    Write-Log "Buscando atualizações do upstream"
    if (-not $Silent) { Write-Host "📥 Buscando atualizações..." -ForegroundColor Yellow }

    $fetchResult = git fetch upstream 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Log "ERRO no fetch: $fetchResult"
        if (-not $Silent) { Write-Host "❌ Erro ao buscar atualizações" -ForegroundColor Red }
        exit 1
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
        } else {
            Write-Log "ERRO no merge: $mergeResult"
            if (-not $Silent) { Write-Host "❌ Erro no merge automático" -ForegroundColor Red }
        }
    } else {
        Write-Log "Repositório já está atualizado"
        if (-not $Silent) { Write-Host "✅ Repositório já está atualizado" -ForegroundColor Green }
    }

} catch {
    Write-Log "ERRO GERAL: $($_.Exception.Message)"
    if (-not $Silent) { Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red }
}

Write-Log "Finalizando sincronização automática"