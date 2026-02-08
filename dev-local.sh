#!/bin/bash
# ==========================================================
# SCRIPT RÁPIDO DE DESENVOLVIMENTO LOCAL - BIBLIA E HINARIO
# SEM SINCRONIZAÇÃO COM GIT - DIRETO AO PONTO
# ==========================================================

cd "$(dirname "$0")"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m'

clear
echo ""
echo -e "${YELLOW}                                 /T /I${NC}"
echo -e "${YELLOW}                                / |/ | .-~/${NC}"
echo -e "${YELLOW}                            T\\ Y  I  |/  /  _${NC}"
echo -e "${YELLOW}           /T               | \\I  |  I  Y.-~/${NC}"
echo -e "${YELLOW}          I l   /I       T\\ |  |  l  |  T  /${NC}"
echo -e "${YELLOW}   __  | \\l   \\l  \\I l __l  l   \\   \`  _. |${NC}"
echo -e "${YELLOW}   \\ ~-l  \`\\   \`\\  \\  \\\\ ~\\  \\   \`. .-~   |${NC}"
echo -e "${YELLOW}    \\   ~-. \"--.  \`  \\  ^._ ^. \"--.  /  \\   |${NC}"
echo -e "${YELLOW} .--~-._  ~-  \`  _  ~-_.-\"-.\"\$  ._ /._ .\" ./${NC}"
echo -e "${YELLOW}  >--.  ~-.   ._  ~>-\"    \"\\\\   7   7   ]${NC}"
echo -e "${YELLOW} ^.___~\"--._    ~-{  .-~ .  \`\\ Y . /    |${NC}"
echo -e "${YELLOW}  <__ ~\"--.  ~       /_/   \\   \\I  Y   : |${NC}"
echo -e "${YELLOW}    ^-.__           ~(_/   \\   >._:   | l______${NC}"
echo -e "${YELLOW}        ^--.,___.-~\"  /_/   !  \`-.~\"--l_ /     ~\"-.${NC}"
echo -e "${YELLOW}               (_/ .  ~(   /'     \"~\"--,Y   -=b-. _)${NC}"
echo -e "${YELLOW}                (_/ .  \\  :           / l      c\"~o \\${NC}"
echo -e "${YELLOW}                 \\ /    \`.    .     .^   \\_.-~\"~--.  )${NC}"
echo -e "${YELLOW}                  (_/ .   \`  /     /       !       )/${NC}"
echo -e "${YELLOW}                   / / _.   '.   .':      /        '${NC}"
echo -e "${YELLOW}                   ~(_/ .   /    _  \`  .-<_${NC}"
echo -e "${YELLOW}                     /_/ . ' .-~\" \`.  / \\  \\          ,z=.${NC}"
echo -e "${YELLOW}                     ~( /   '  :   | K   \"--.~-.______//${NC}"
echo -e "${YELLOW}                       \"--.    l   I/ \\_    __{--->._(\${NC}"
echo -e "${YELLOW}                        //(     \\  <    ~\"~\"     //${NC}"
echo -e "${YELLOW}                       /' /\\     \\  \\     ,v=.  ((${NC}"
echo -e "${YELLOW}                     .^. / /\\     \"  }__ //===-  \`${NC}"
echo -e "${YELLOW}                    / / ' '  \"--..,__ {---(==-${NC}"
echo -e "${YELLOW}                  .^ '       :  T  ~\"   ll${NC}"
echo -e "${YELLOW}                 / .  .  . : | :!        \\\\${NC}"
echo -e "${YELLOW}                (_/  /   | | j-\"          ~^${NC}"
echo -e "${YELLOW}                  ~-<_(_.^-~\"${NC}"
echo ""
echo -e "${CYAN}            ╔═══════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}            ║                                               ║${NC}"
echo -e "${RED}            ║       🔧 MODO DESENVOLVIMENTO LOCAL 🔧       ║${NC}"
echo -e "${CYAN}            ║                                               ║${NC}"
echo -e "${WHITE}            ║     T A B E R N Á C U L O   O   S I N A L    ║${NC}"
echo -e "${CYAN}            ║                                               ║${NC}"
echo -e "${WHITE}            ║              A M A Z O N A S                  ║${NC}"
echo -e "${CYAN}            ║                                               ║${NC}"
echo -e "${CYAN}            ╚═══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GRAY}                       Bíblia e Hinário v2.1.0-dev${NC}"
echo -e "${RED}              ⚠️  SEM SINCRONIZAÇÃO COM GIT ⚠️${NC}"
echo ""

# Limpar processos anteriores (silencioso)
echo -e "${CYAN}Limpando processos anteriores...${NC}"
pkill -f "node.*dev" 2>/dev/null || true
sleep 1

# Iniciar servidor
echo -e "${YELLOW}Iniciando servidores...${NC}"
echo ""

npm run dev &
SERVER_PID=$!

# Aguardar frontend ficar pronto
sleep 5

# Pegar IP da rede
NETWORK_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "N/A")

echo ""
echo -e "${GREEN}   ███████╗██╗   ██╗ ██████╗███████╗███████╗███████╗ ██████╗ ${NC}"
echo -e "${GREEN}   ██╔════╝██║   ██║██╔════╝██╔════╝██╔════╝██╔════╝██╔═══██╗${NC}"
echo -e "${GREEN}   ███████╗██║   ██║██║     █████╗  ███████╗███████╗██║   ██║${NC}"
echo -e "${GREEN}   ╚════██║██║   ██║██║     ██╔══╝  ╚════██║╚════██║██║   ██║${NC}"
echo -e "${GREEN}   ███████║╚██████╔╝╚██████╗███████╗███████║███████║╚██████╔╝${NC}"
echo -e "${GREEN}   ╚══════╝ ╚═════╝  ╚═════╝╚══════╝╚══════╝╚══════╝ ╚═════╝ ${NC}"
echo ""
echo -e "${CYAN}ACESSO LOCAL:${NC}"
echo "   Controle:  http://localhost:5173/admin"
echo "   Projeção:  http://localhost:5173/projetor"
echo ""
if [ "$NETWORK_IP" != "N/A" ]; then
    echo -e "${CYAN}ACESSO NA REDE:${NC}"
    echo "   Controle:  http://$NETWORK_IP:5173/admin"
    echo "   Projeção:  http://$NETWORK_IP:5173/projetor"
    echo ""
fi
echo -e "${RED}⚠️  MODO DEV - ALTERAÇÕES LOCAIS PRESERVADAS${NC}"
echo ""
echo -e "${YELLOW}Pressione Ctrl+C para encerrar.${NC}"
echo ""

# Abrir navegador
open "http://localhost:5173/admin" 2>/dev/null || true

# Aguardar
wait $SERVER_PID
