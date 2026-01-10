# Script COMPLETO de Configuração do Bíblia e Hinário v2.0
# Para usuários leigos - Configura TUDO automaticamente
# Execute como administrador

#Requires -RunAsAdministrator

param(
    [switch]$Uninstall = $false,
    [switch]$SkipSync = $false
)

$version = "2.0.1"
$author = "Sistema Bíblia e Hinário"
$description = "Configuração completa para igrejas - Sincronização + Inicialização Automática"

Write-Host "🎼 $author v$version" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "📋 $description" -ForegroundColor White
Write-Host ""

if ($Uninstall) {
    Write-Host "🗑️ REMOVENDO configurações..." -ForegroundColor Yellow
    Write-Host ""

    # Remover tarefa de inicialização
    try {
        $initTask = Get-ScheduledTask -TaskName "Biblia Hinario - Auto Start" -ErrorAction SilentlyContinue
        if ($initTask) {
            Unregister-ScheduledTask -TaskName "Biblia Hinario - Auto Start" -Confirm:$false
            Write-Host "✅ Tarefa de inicialização removida" -ForegroundColor Green
        } else {
            Write-Host "ℹ️ Tarefa de inicialização não encontrada" -ForegroundColor Blue
        }
    } catch {
        Write-Host "❌ Erro ao remover tarefa de inicialização: $($_.Exception.Message)" -ForegroundColor Red
    }

    # Remover tarefa de sincronização
    try {
        $syncTask = Get-ScheduledTask -TaskName "Biblia Hinario - Sync GitHub" -ErrorAction SilentlyContinue
        if ($syncTask) {
            Unregister-ScheduledTask -TaskName "Biblia Hinario - Sync GitHub" -Confirm:$false
            Write-Host "✅ Tarefa de sincronização removida" -ForegroundColor Green
        } else {
            Write-Host "ℹ️ Tarefa de sincronização não encontrada" -ForegroundColor Blue
        }
    } catch {
        Write-Host "❌ Erro ao remover tarefa de sincronização: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host ""
    Write-Host "✅ Todas as configurações removidas!" -ForegroundColor Green
    Write-Host "ℹ️ Execute novamente sem -Uninstall para reconfigurar" -ForegroundColor Blue
    exit
}

# Verificar se estamos na pasta correta
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$expectedFiles = @("package.json", "Start-BibliaHinario.ps1", "setup-auto-sync.ps1")

$missingFiles = $expectedFiles | Where-Object { -not (Test-Path (Join-Path $scriptDir $_)) }
if ($missingFiles) {
    Write-Host "❌ Arquivos necessários não encontrados:" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
    Write-Host ""
    Write-Host "📂 Certifique-se de executar este script na pasta do Bíblia e Hinário!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Arquivos verificados - Pasta correta!" -ForegroundColor Green
Write-Host ""

# === PARTE 1: CONFIGURAR SINCRONIZAÇÃO ===
if (-not $SkipSync) {
    Write-Host "🔄 PARTE 1: Configurando Sincronização Automática" -ForegroundColor Cyan
    Write-Host "--------------------------------------------------" -ForegroundColor Cyan

    try {
        # Verificar se git está instalado
        $gitVersion = git --version 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "⚠️ Git não encontrado - pulando sincronização automática" -ForegroundColor Yellow
            Write-Host "ℹ️ Você pode instalar o Git em: https://git-scm.com/" -ForegroundColor Blue
        } else {
            Write-Host "✅ Git encontrado: $gitVersion" -ForegroundColor Green

            # Executar configuração de sincronização
            $syncScript = Join-Path $scriptDir "setup-auto-sync.ps1"
            Write-Host "⏳ Configurando tarefa de sincronização..." -ForegroundColor Yellow

            $syncResult = & $syncScript
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Sincronização automática configurada!" -ForegroundColor Green
            } else {
                Write-Host "⚠️ Erro na configuração da sincronização" -ForegroundColor Yellow
                Write-Host "ℹ️ Você pode configurar manualmente depois" -ForegroundColor Blue
            }
        }
    } catch {
        Write-Host "⚠️ Erro na sincronização: $($_.Exception.Message)" -ForegroundColor Yellow
    }

    Write-Host ""
}

# === PARTE 2: CONFIGURAR INICIALIZAÇÃO ===
Write-Host "🚀 PARTE 2: Configurando Inicialização Automática" -ForegroundColor Cyan
Write-Host "--------------------------------------------------" -ForegroundColor Cyan

try {
    # Executar configuração de inicialização
    $initScript = Join-Path $scriptDir "setup-inicializacao-automatica.ps1"
    Write-Host "⏳ Configurando inicialização automática..." -ForegroundColor Yellow

    $initResult = & $initScript
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Inicialização automática configurada!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro na configuração da inicialização" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erro na inicialização: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 CONFIGURAÇÃO COMPLETA!" -ForegroundColor Green
Write-Host "==========================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ O que foi configurado:" -ForegroundColor White
Write-Host "   🔄 Sincronização automática com GitHub" -ForegroundColor Green
Write-Host "   🚀 Inicialização automática ao ligar PC" -ForegroundColor Green
Write-Host "   📊 Sistema sempre na versão mais recente" -ForegroundColor Green
Write-Host ""

Write-Host "💡 O que acontece agora:" -ForegroundColor Cyan
Write-Host "   1. Toda vez que você ligar o computador..." -ForegroundColor White
Write-Host "   2. O sistema verifica atualizações no GitHub..." -ForegroundColor White
Write-Host "   3. Baixa a versão mais recente..." -ForegroundColor White
Write-Host "   4. Inicia automaticamente o Bíblia e Hinário!" -ForegroundColor White
Write-Host ""

Write-Host "🎯 Para igrejas - configure uma vez, esqueça para sempre!" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Comandos úteis:" -ForegroundColor Cyan
Write-Host "   .\setup-completo.ps1 -Uninstall    # Remover tudo" -ForegroundColor White
Write-Host "   .\setup-completo.ps1 -SkipSync     # Pular sincronização" -ForegroundColor White
Write-Host ""

Write-Host "📞 Suporte:" -ForegroundColor Cyan
Write-Host "   Se tiver problemas, consulte INICIALIZACAO_AUTOMATICA.md" -ForegroundColor White
Write-Host ""

Write-Host "🙏 Deus abençoe sua igreja!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")