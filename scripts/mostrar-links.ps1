# Script para mostrar os links de acesso pela rede local
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BIBLIA E HINARIO v2.0 - LINKS DE ACESSO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Obter IP local
$ipAddresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.IPAddress -notlike "127.*" -and 
    $_.IPAddress -notlike "169.254.*" -and
    $_.InterfaceAlias -notlike "*Loopback*"
} | Select-Object -First 1

if ($ipAddresses) {
    $ip = $ipAddresses.IPAddress
    Write-Host "IP Local: $ip" -ForegroundColor Green
    Write-Host ""
    Write-Host "LINKS DE ACESSO:" -ForegroundColor Yellow
    Write-Host "----------------" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "PAINEL DE CONTROLE (Admin):" -ForegroundColor White
    Write-Host "   http://$ip`:5173/admin" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "TELA DE PROJECAO:" -ForegroundColor White
    Write-Host "   http://$ip`:5173/projetor" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "ACESSO LOCAL (mesmo computador):" -ForegroundColor White
    Write-Host "   http://localhost:5173/admin" -ForegroundColor Gray
    Write-Host "   http://localhost:5173/projetor" -ForegroundColor Gray
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Senha padrao: admin123" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "Nao foi possivel detectar o IP local." -ForegroundColor Red
    Write-Host "Tente executar: ipconfig" -ForegroundColor Yellow
}

