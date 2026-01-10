# Comando único para instalar Bíblia e Hinário automaticamente
# Execute este comando no PowerShell como administrador

Write-Host "🎼 Bíblia e Hinário v2.0 - Instalação Automática" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está executando como administrador
$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
$adminRole = [Security.Principal.WindowsBuiltInRole]::Administrator

if (-not $principal.IsInRole($adminRole)) {
    Write-Host "❌ Execute como administrador!" -ForegroundColor Red
    Write-Host "💡 Clique direito no PowerShell → 'Executar como administrador'" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "✅ Executando como administrador" -ForegroundColor Green
Write-Host ""

# Verificar se git está instalado
try {
    $gitVersion = git --version 2>$null
    Write-Host "✅ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não encontrado!" -ForegroundColor Red
    Write-Host "📥 Baixe em: https://git-scm.com/" -ForegroundColor Yellow
    Write-Host "ℹ️ Instale e execute este comando novamente" -ForegroundColor Blue
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar se PowerShell tem permissões de execução
try {
    $testCommand = Get-ExecutionPolicy -ErrorAction Stop
    Write-Host "✅ PowerShell configurado corretamente" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Configurando permissões do PowerShell..." -ForegroundColor Yellow
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
}

Write-Host ""
Write-Host "📥 Baixando Bíblia e Hinário..." -ForegroundColor Cyan
try {
    git clone https://github.com/userj81/Biblia_Hinario_Tabernaculo_O_Sinal.git BibliaHinario 2>$null
    Write-Host "✅ Repositório baixado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao baixar repositório: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "📂 Entrando na pasta do projeto..." -ForegroundColor Cyan
Set-Location "BibliaHinario"

Write-Host ""
Write-Host "⚙️ Executando configuração completa..." -ForegroundColor Cyan
Write-Host "Isso pode levar alguns minutos..." -ForegroundColor Yellow
Write-Host ""

try {
    & ".\setup-completo.ps1"
    Write-Host ""
    Write-Host "🎉 INSTALAÇÃO COMPLETA!" -ForegroundColor Green
    Write-Host "==========================" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 O que fazer agora:" -ForegroundColor Cyan
    Write-Host "   1. ✅ Reinicie o computador" -ForegroundColor White
    Write-Host "   2. ✅ O sistema iniciará automaticamente" -ForegroundColor White
    Write-Host "   3. ✅ Acesse: http://localhost:5173/admin" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 Para ajuda: Abra PARA_USUARIOS_LEIGOS.md" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🙏 Deus abençoe sua igreja!" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Erro na configuração: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Read-Host "Pressione Enter para finalizar"