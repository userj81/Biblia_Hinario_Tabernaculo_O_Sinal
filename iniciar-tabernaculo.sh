#!/bin/bash
# ==========================================================
# SCRIPT DE INICIALIZACAO ROBUSTA - BIBLIA E HINARIO v2.1
# Para macOS e Linux
# ==========================================================

set -e  # Para em caso de erro

VERSION="2.1.0"
LOG_FILE="/tmp/BibliaHinario-$(date +%Y%m%d-%H%M%S).log"
BACKEND_PORT=3000
FRONTEND_PORT=5173
TIMEOUT_SEC=90
MAX_RETRIES=3

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# ==========================================================
# FUNCOES AUXILIARES
# ==========================================================

write_log() {
    local message="$1"
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] $message" >> "$LOG_FILE"
}

show_header() {
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
    echo -e "${YELLOW}                       \"--.    l   I/ \\_    __{--->._(==.${NC}"
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
    echo -e "${WHITE}            ║     T A B E R N Á C U L O   O   S I N A L    ║${NC}"
    echo -e "${CYAN}            ║                                               ║${NC}"
    echo -e "${WHITE}            ║              A M A Z O N A S                  ║${NC}"
    echo -e "${CYAN}            ║                                               ║${NC}"
    echo -e "${CYAN}            ╚═══════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GRAY}                       Bíblia e Hinário v$VERSION${NC}"
    echo ""
    write_log "Iniciando sistema - Versao $VERSION"
}

test_prerequisites() {
    echo -e "${CYAN}[1/6] Verificando pre-requisitos...${NC}"
    write_log "[1/6] Verificando pre-requisitos..."

    local issues=0

    # Verificar Node.js
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        echo -e "   ${GREEN}Node.js: $node_version${NC}"
        write_log "   Node.js encontrado: $node_version"
    else
        echo -e "   ${RED}Node.js: NAO ENCONTRADO${NC}"
        write_log "   PROBLEMA: Node.js nao encontrado"
        issues=$((issues + 1))
    fi

    # Verificar npm
    if command -v npm &> /dev/null; then
        local npm_version=$(npm --version)
        echo -e "   ${GREEN}npm: v$npm_version${NC}"
        write_log "   npm encontrado: v$npm_version"
    else
        echo -e "   ${RED}npm: NAO ENCONTRADO${NC}"
        write_log "   PROBLEMA: npm nao encontrado"
        issues=$((issues + 1))
    fi

    # Verificar Git (opcional)
    if command -v git &> /dev/null; then
        local git_version=$(git --version)
        echo -e "   ${GREEN}Git: $git_version${NC}"
        write_log "   Git encontrado: $git_version"
    else
        echo -e "   ${YELLOW}Git: NAO ENCONTRADO (opcional)${NC}"
        write_log "   Git nao encontrado (opcional)"
    fi

    # Verificar package.json
    if [ -f "package.json" ]; then
        echo -e "   ${GREEN}package.json: OK${NC}"
        write_log "   package.json encontrado"
    else
        echo -e "   ${RED}package.json: NAO ENCONTRADO${NC}"
        write_log "   PROBLEMA: package.json nao encontrado"
        issues=$((issues + 1))
    fi

    if [ $issues -gt 0 ]; then
        echo ""
        echo -e "${RED}PROBLEMAS ENCONTRADOS:${NC}"
        echo -e "${CYAN}SOLUCOES:${NC}"
        echo -e "${WHITE}   1. Instale Node.js de: https://nodejs.org/${NC}"
        echo -e "${WHITE}   2. Execute este script na pasta correta do projeto${NC}"
        write_log "Pre-requisitos nao atendidos - $issues problemas"
        exit 1
    fi

    echo ""
}

clear_old_processes() {
    echo -e "${CYAN}[2/6] Limpando processos anteriores...${NC}"
    write_log "[2/6] Limpando processos anteriores..."

    local node_pids=$(pgrep -f "node.*dev" || true)

    if [ -n "$node_pids" ]; then
        echo "$node_pids" | xargs kill -9 2>/dev/null || true
        local count=$(echo "$node_pids" | wc -l | tr -d ' ')
        echo -e "   ${GREEN}$count processo(s) Node.js encerrado(s)${NC}"
        write_log "   $count processo(s) encerrado(s)"
    else
        echo -e "   ${GRAY}Nenhum processo anterior encontrado${NC}"
        write_log "   Nenhum processo anterior"
    fi

    sleep 1
    echo ""
}

sync_with_github() {
    echo -e "${CYAN}[3/6] Sincronizando com GitHub...${NC}"
    write_log "[3/6] Tentando sincronizar com GitHub..."

    if ! command -v git &> /dev/null; then
        echo -e "   ${YELLOW}Git nao instalado - pulando sincronizacao${NC}"
        write_log "   Git nao encontrado - pulando"
        echo ""
        return
    fi

    if ! git rev-parse --is-inside-work-tree &> /dev/null; then
        echo -e "   ${YELLOW}Nao e um repositorio Git - pulando${NC}"
        write_log "   Nao e repositorio Git"
        echo ""
        return
    fi

    # Salvar mudancas locais
    git stash --quiet 2>&1 >> "$LOG_FILE" || true

    # Tentar fetch de origin ou upstream
    local remote="origin"
    if git remote | grep -q "upstream"; then
        remote="upstream"
    fi

    if git fetch "$remote" --quiet 2>&1 >> "$LOG_FILE"; then
        if git merge "$remote/main" --no-edit --quiet 2>&1 >> "$LOG_FILE"; then
            echo -e "   ${GREEN}Sincronizado com $remote/main${NC}"
            write_log "   Sincronizado com $remote/main com sucesso"
        else
            echo -e "   ${YELLOW}Erro ao fazer merge - continuando sem atualizar${NC}"
            write_log "   Erro no merge"
        fi
    else
        echo -e "   ${YELLOW}Sem conexao com GitHub - continuando offline${NC}"
        write_log "   Sem conexao com GitHub"
    fi

    echo ""
}

install_dependencies() {
    echo -e "${CYAN}[4/6] Verificando dependencias...${NC}"
    write_log "[4/6] Verificando dependencias..."

    if [ ! -d "node_modules" ]; then
        echo -e "   ${YELLOW}node_modules nao encontrado - instalando...${NC}"
        write_log "   Instalando dependencias..."

        npm install >> "$LOG_FILE" 2>&1

        if [ $? -eq 0 ]; then
            echo -e "   ${GREEN}Dependencias instaladas com sucesso${NC}"
            write_log "   Dependencias instaladas"
        else
            echo -e "   ${RED}Erro ao instalar dependencias${NC}"
            write_log "   ERRO ao instalar dependencias"
            exit 1
        fi
    else
        echo -e "   ${GREEN}Dependencias ja instaladas${NC}"
        write_log "   Dependencias OK"
    fi

    echo ""
}

check_port() {
    local port=$1
    if command -v lsof &> /dev/null; then
        lsof -i :$port &> /dev/null
    elif command -v nc &> /dev/null; then
        nc -z localhost $port &> /dev/null
    else
        # Fallback usando /dev/tcp (bash built-in)
        (echo > /dev/tcp/localhost/$port) &> /dev/null
    fi
    return $?
}

start_server_with_retry() {
    echo -e "${CYAN}[5/6] Iniciando servidores...${NC}"
    write_log "[5/6] Iniciando servidores (Backend:$BACKEND_PORT, Frontend:$FRONTEND_PORT)..."

    for attempt in $(seq 1 $MAX_RETRIES); do
        if [ $attempt -gt 1 ]; then
            echo -e "   ${YELLOW}Tentativa $attempt de $MAX_RETRIES...${NC}"
            write_log "   Tentativa $attempt de $MAX_RETRIES"
            sleep 3
        fi

        # Iniciar servidor em background
        npm run dev >> "$LOG_FILE" 2>&1 &
        local server_pid=$!

        # Aguardar inicializacao
        local start_time=$(date +%s)
        local backend_ready=false
        local frontend_ready=false

        while [ $(($(date +%s) - start_time)) -lt $TIMEOUT_SEC ]; do
            if check_port $BACKEND_PORT; then
                backend_ready=true
            fi

            if check_port $FRONTEND_PORT; then
                frontend_ready=true
            fi

            if [ "$backend_ready" = true ] && [ "$frontend_ready" = true ]; then
                echo ""
                echo "$server_pid"
                return 0
            fi

            local elapsed=$(($(date +%s) - start_time))
            local percent=$((elapsed * 100 / TIMEOUT_SEC))
            if [ $percent -gt 100 ]; then percent=100; fi

            local bar_size=30
            local filled_size=$((percent * bar_size / 100))
            local bar=$(printf "=%.0s" $(seq 1 $filled_size))$(printf -- "-%.0s" $(seq 1 $((bar_size - filled_size))))

            local status=""
            if [ "$backend_ready" = true ]; then
                status="${status}Backend:OK "
            else
                status="${status}Backend:... "
            fi

            if [ "$frontend_ready" = true ]; then
                status="${status}Frontend:OK"
            else
                status="${status}Frontend:..."
            fi

            printf "\r   ${YELLOW}[%s] %d%% | %s | %ds${NC} " "$bar" "$percent" "$status" "$elapsed"

            sleep 2
        done

        # Timeout - tentar novamente
        echo ""
        echo -e "   ${RED}Timeout - servidor nao respondeu${NC}"
        write_log "   Timeout na tentativa $attempt"

        kill -9 $server_pid 2>/dev/null || true

        if [ $attempt -eq $MAX_RETRIES ]; then
            echo ""
            echo -e "   ${YELLOW}DIAGNOSTICO:${NC}"

            if [ "$backend_ready" = true ]; then
                echo -e "   ${GREEN}- Backend (porta $BACKEND_PORT): OK${NC}"
            else
                echo -e "   ${RED}- Backend (porta $BACKEND_PORT): FALHOU${NC}"
            fi

            if [ "$frontend_ready" = true ]; then
                echo -e "   ${GREEN}- Frontend (porta $FRONTEND_PORT): OK${NC}"
            else
                echo -e "   ${RED}- Frontend (porta $FRONTEND_PORT): FALHOU${NC}"
            fi

            echo ""
            echo -e "   ${CYAN}Verifique o log para mais detalhes: $LOG_FILE${NC}"
            write_log "   Falha total apos $MAX_RETRIES tentativas"
            exit 1
        fi
    done
}

get_network_ip() {
    # Tentar diferentes metodos dependendo do OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "N/A"
    else
        # Linux
        hostname -I 2>/dev/null | awk '{print $1}' || echo "N/A"
    fi
}

show_success_message() {
    local server_pid=$1

    show_header

    echo -e "${GREEN}   ███████╗██╗   ██╗ ██████╗███████╗███████╗███████╗ ██████╗ ${NC}"
    echo -e "${GREEN}   ██╔════╝██║   ██║██╔════╝██╔════╝██╔════╝██╔════╝██╔═══██╗${NC}"
    echo -e "${GREEN}   ███████╗██║   ██║██║     █████╗  ███████╗███████╗██║   ██║${NC}"
    echo -e "${GREEN}   ╚════██║██║   ██║██║     ██╔══╝  ╚════██║╚════██║██║   ██║${NC}"
    echo -e "${GREEN}   ███████║╚██████╔╝╚██████╗███████╗███████║███████║╚██████╔╝${NC}"
    echo -e "${GREEN}   ╚══════╝ ╚═════╝  ╚═════╝╚══════╝╚══════╝╚══════╝ ╚═════╝ ${NC}"
    echo ""

    local network_ip=$(get_network_ip)

    echo -e "${CYAN} LINKS DE ACESSO LOCAL:${NC}"
    echo -e "${WHITE}   Controle:  http://localhost:$FRONTEND_PORT/admin${NC}"
    echo -e "${WHITE}   Projecao:  http://localhost:$FRONTEND_PORT/projetor${NC}"
    echo ""

    if [ "$network_ip" != "N/A" ]; then
        echo -e "${CYAN} ACESSO DA REDE (outros dispositivos):${NC}"
        echo -e "${YELLOW}   Controle:  http://$network_ip:$FRONTEND_PORT/admin${NC}"
        echo -e "${YELLOW}   Projecao:  http://$network_ip:$FRONTEND_PORT/projetor${NC}"
        echo ""
    fi

    echo -e "${CYAN} STATUS:${NC}"
    echo -e "${GREEN}   Backend:  http://localhost:$BACKEND_PORT [OK]${NC}"
    echo -e "${GREEN}   Frontend: http://localhost:$FRONTEND_PORT [OK]${NC}"
    echo -e "${GRAY}   Log:      $LOG_FILE${NC}"
    echo -e "${GRAY}   PID:      $server_pid${NC}"
    echo ""

    echo -e "${YELLOW} MANTENHA ESTA JANELA ABERTA ENQUANTO USA O SISTEMA.${NC}"
    echo -e "${RED} Para encerrar: Pressione Ctrl+C.${NC}"
    echo ""

    write_log "Sistema iniciado com sucesso"
    write_log "Network IP: $network_ip"
    write_log "Server PID: $server_pid"

    # Abrir navegador automaticamente
    sleep 2
    if command -v open &> /dev/null; then
        # macOS
        open "http://localhost:$FRONTEND_PORT/admin" 2>/dev/null
        echo -e "${GREEN} Navegador aberto automaticamente!${NC}"
        write_log "Navegador aberto automaticamente (macOS)"
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "http://localhost:$FRONTEND_PORT/admin" 2>/dev/null
        echo -e "${GREEN} Navegador aberto automaticamente!${NC}"
        write_log "Navegador aberto automaticamente (Linux)"
    else
        echo -e "${GRAY} (Abra o navegador manualmente)${NC}"
        write_log "Navegador nao pode ser aberto automaticamente"
    fi

    echo ""

    # Aguardar servidor
    wait $server_pid
}

cleanup() {
    echo ""
    echo -e "${YELLOW}Encerrando sistema...${NC}"
    write_log "Sistema encerrado pelo usuario"

    # Matar processos Node.js
    pkill -f "node.*dev" 2>/dev/null || true

    echo -e "${GREEN}Sistema encerrado com sucesso!${NC}"
    exit 0
}

# ==========================================================
# EXECUCAO PRINCIPAL
# ==========================================================

# Trap para Ctrl+C
trap cleanup SIGINT SIGTERM

# Mudar para diretorio do script
cd "$(dirname "$0")"

show_header
echo -e "${GRAY} Arquivo de log: $LOG_FILE${NC}"
echo ""

test_prerequisites
clear_old_processes
sync_with_github
install_dependencies
server_pid=$(start_server_with_retry)

echo -e "${GREEN}[6/6] Sistema pronto!${NC}"
write_log "[6/6] Sistema pronto"
echo ""

show_success_message "$server_pid"
