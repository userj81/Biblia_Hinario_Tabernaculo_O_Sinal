# Script para sincronizar repositório local com GitHub
# Execute este script para manter seu repositório atualizado

Write-Host "🔄 Sincronizando com GitHub..." -ForegroundColor Cyan

# Buscar atualizações do repositório principal
Write-Host "📥 Buscando atualizações do upstream..." -ForegroundColor Yellow
git fetch upstream

# Verificar se há mudanças no upstream/main
$local_commit = git rev-parse HEAD
$remote_commit = git rev-parse upstream/main

if ($local_commit -ne $remote_commit) {
    Write-Host "📋 Há atualizações disponíveis!" -ForegroundColor Green

    # Fazer merge das mudanças
    Write-Host "🔀 Fazendo merge das mudanças..." -ForegroundColor Yellow
    git merge upstream/main --no-edit

    # Instalar dependências se package.json foi modificado
    if (git diff HEAD~1 --name-only | Select-String -Pattern "package.json") {
        Write-Host "📦 Atualizando dependências..." -ForegroundColor Yellow
        npm install
    }

    Write-Host "✅ Sincronização concluída!" -ForegroundColor Green
} else {
    Write-Host "✅ Seu repositório já está atualizado!" -ForegroundColor Green
}

Write-Host "`n📊 Status atual:" -ForegroundColor Cyan
git status --short

Write-Host "`n💡 Dica: Execute este script sempre antes de começar a trabalhar!" -ForegroundColor Magenta