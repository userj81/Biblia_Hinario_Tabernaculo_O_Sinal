@echo off
echo.
echo ========================================
echo    BIBLIA E HINARIO v2.0 - LINKS DE ACESSO
echo ========================================
echo.

REM Obter IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%a
    set IP=!IP:~1!
    goto :found
)

:found
if defined IP (
    echo IP Local: %IP%
    echo.
    echo LINKS DE ACESSO:
    echo ----------------
    echo.
    echo [PAINEL DE CONTROLE (Admin)]
    echo http://%IP%:5173/admin
    echo.
    echo [TELA DE PROJECAO]
    echo http://%IP%:5173/projetor
    echo.
    echo [ACESSO LOCAL (mesmo computador)]
    echo http://localhost:5173/admin
    echo http://localhost:5173/projetor
    echo.
    echo ========================================
    echo Senha padrao: admin123
    echo ========================================
    echo.
) else (
    echo Nao foi possivel detectar o IP local.
    echo Tente executar: ipconfig
    echo.
)

pause




















