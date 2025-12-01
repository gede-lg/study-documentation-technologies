# 8. Segurança e Capacidades

---

Os parâmetros de segurança permitem controlar quais privilégios o contêiner possui, definindo namespaces de isolamento e ajustando capacidades do kernel para reforçar ou relaxar restrições.

---

### 8.1 `-cap-add list`

- **Sintaxe**
    
    ```bash
    --cap-add=NET_ADMIN
    --cap-add=SYS_TIME --cap-add=CHOWN
    
    ```
    
- **Descrição**
    
    Adiciona Linux capabilities (habilidades de baixo nível) ao contêiner, por exemplo `NET_ADMIN`, `SYS_TIME`, `MKNOD`.
    
- **Conceito de Uso**
    
    Permite conceder apenas as mínimas permissões necessárias para funções específicas, evitando o uso do modo `--privileged`.
    
    Ex.: dar permissão para manipular interfaces de rede (`NET_ADMIN`) sem liberar outras áreas sensíveis.
    
- **Propriedades Internas**
    - Modifica a lista `CapAdd` em `HostConfig`, que o runtime traduz para `capabilities` no spec OCI.
    - Kernel permite que o processo dentro do contêiner execute syscalls associadas à capability adicionada.
- **Exemplo**
    
    ```bash
    # Permitir configuração de rede sem ser privileged
    docker run --cap-add=NET_ADMIN my-network-tool
    
    ```
    

---

### 8.2 `-cap-drop list`

- **Sintaxe**
    
    ```bash
    --cap-drop=SETUID
    --cap-drop=ALL
    
    ```
    
- **Descrição**
    
    Remove Linux capabilities do contêiner. `ALL` remove tudo, tornando-o o mais restrito possível.
    
- **Conceito de Uso**
    
    Reduz superfície de ataque removendo privilégios desnecessários mesmo de imagens que venham com defaults mais amplos.
    
- **Propriedades Internas**
    - Ajusta `CapDrop` em `HostConfig`.
    - Kernel bloqueia syscalls referentes às capabilities removidas.
- **Exemplo**
    
    ```bash
    # Bloquear criação de setuid binaries dentro do container
    docker run --cap-drop=SETUID my-secure-app
    
    ```
    

---

### 8.3 `-security-opt list`

- **Sintaxe**
    
    ```bash
    --security-opt=no-new-privileges
    --security-opt=apparmor:docker-default
    --security-opt=label:type:container_runtime_t
    --security-opt=seccomp=/path/to/seccomp.json
    
    ```
    
- **Descrição**
    
    Define opções de segurança avançadas:
    
    - **AppArmor**: perfis (`apparmor:profile_name`).
    - **SELinux**: labels (`label=level:s0:c123,c456`) ou type enforcement.
    - **Seccomp**: filtros de syscalls via JSON.
    - **no-new-privileges**: impede escalonamento de privs, território CIFS, PTRACE, etc.
- **Conceito de Uso**
    
    Impor políticas de segurança do host ou do cluster no runtime do contêiner, restringindo chamadas de sistema e acesso a recursos.
    
- **Propriedades Internas**
    - Popula `HostConfig.SecurityOpt`.
    - O runtime aplica o AppArmor/SELinux label e carrega o filtro seccomp antes de iniciar o init do contêiner.
- **Exemplo**
    
    ```bash
    # Impede qualquer elevação de privilégios no container
    docker run --security-opt=no-new-privileges my-app
    
    ```
    

---

### 8.4 `-privileged`

- **Sintaxe**
    
    ```bash
    --privileged
    
    ```
    
- **Descrição**
    
    Concede ao contêiner acesso quase irrestrito a todos os dispositivos do host e inclui todas as capabilities do kernel.
    
- **Conceito de Uso**
    
    Usado para casos de depuração de baixo nível, execução de Docker dentro de Docker, ferramentas que necessitam acesso direto a dispositivos (por exemplo, montagem de sistemas de arquivos).
    
- **Propriedades Internas**
    - Deflag `HostConfig.Privileged=true`.
    - Mapeia `/dev/*` do host dentro do contêiner e remove praticamente todos os limites de cgroup de dispositivos.
- **Exemplo**
    
    ```bash
    # Ferramenta que grava blocos diretos no disco
    docker run --privileged ubuntu dd if=/dev/sda of=/backup/disk.img
    
    ```
    

---

### 8.5 `-read-only`

- **Sintaxe**
    
    ```bash
    --read-only
    
    ```
    
- **Descrição**
    
    Monta o filesystem raiz do contêiner em modo somente-leitura. Diretórios mutáveis (como `/tmp`, `/run`) podem ser sobrescritos via tmpfs ou volumes adicionais.
    
- **Conceito de Uso**
    
    Impede alterações acidentais ou maliciosas no sistema de arquivos raiz, aumentando segurança em serviços estáticos ou imutáveis.
    
- **Propriedades Internas**
    - Define `HostConfig.ReadonlyRootfs=true`.
    - Remonta o rootfs com `ro` no mount namespace do contêiner.
- **Exemplo**
    
    ```bash
    docker run --read-only \
      --tmpfs /tmp \
      --tmpfs /run \
      my-static-site
    
    ```
    

---

### 8.6 `u`, `-user string`

- **Sintaxe**
    
    ```bash
    -u www-data
    -u 1000:1000
    -u user:group
    
    ```
    
- **Descrição**
    
    Executa o processo principal do contêiner como o usuário e/ou grupo especificado, em vez de root.
    
- **Conceito de Uso**
    
    Seguir o princípio de menor privilégio, rodando aplicações com contas específicas, evitando vulnerabilidades de escalonamento.
    
- **Propriedades Internas**
    - Ajusta `Config.User` no JSON de criação.
    - O runtime faz `setuid/setgid` no processo init do contêiner antes de executar o entrypoint.
- **Exemplo**
    
    ```bash
    docker run -u node:node my-node-app node server.js
    
    ```
    

---

### 8.7 `-userns string`

- **Sintaxe**
    
    ```bash
    --userns=host
    --userns=private
    --userns=container:<name|id>
    
    ```
    
- **Descrição**
    
    Configura o namespace de usuário:
    
    - **host**: usa os mesmos UIDs/GIDs do host (sem mapeamento).
    - **private**: isola, mapeando root do contêiner para um UID não-root no host.
    - **container:**: compartilha namespace de usuário com outro contêiner.
- **Conceito de Uso**
    
    Evitar que processos root dentro do contêiner possam afetar arquivos do host, fornecendo isolamento de UID/GID.
    
- **Propriedades Internas**
    - Define `HostConfig.UsernsMode`.
    - O runtime configura `UID/GID mappings` via `subuid`/`subgid` ao criar o namespace.
- **Exemplo**
    
    ```bash
    docker run --userns=private my-app
    
    ```
    

---

### 8.8 `-uts string`

- **Sintaxe**
    
    ```bash
    --uts=host
    --uts=private
    --uts=container:<name|id>
    
    ```
    
- **Descrição**
    
    Define o namespace UTS (Unix Timesharing System), que controla `hostname` e `domainname` visíveis dentro do contêiner.
    
- **Conceito de Uso**
    
    Compartilhar hostname com o host ou outro contêiner (`host`/`container:`), ou isolar (`private`) para testes de DNS, aplicações que dependem de identificação de host.
    
- **Propriedades Internas**
    - Define `HostConfig.UTSMode`.
    - Mount de `utsname` namespace no kernel.
- **Exemplo**
    
    ```bash
    docker run --uts=host my-app
    
    ```
    

---

### 8.9 `-pid string`

- **Sintaxe**
    
    ```bash
    --pid=host
    --pid=private
    --pid=container:<name|id>
    
    ```
    
- **Descrição**
    
    Configura o namespace PID do contêiner:
    
    - **host**: processos do contêiner aparecem no namespace PID do host.
    - **private**: namespace PID isolado padrão.
    - **container:**: compartilha PID com outro contêiner.
- **Conceito de Uso**
    
    Permite depuração cruzada de processos, monitoramento do host ou isolamento completo de PID.
    
- **Propriedades Internas**
    - Ajusta `HostConfig.PidMode`.
    - Kernel monta o `pid_namespace` conforme especificado.
- **Exemplo**
    
    ```bash
    docker run --pid=host alpine ps aux
    
    ```
    

---

### 8.10 `-ipc string`

- **Sintaxe**
    
    ```bash
    --ipc=host
    --ipc=private
    --ipc=container:<name|id>
    
    ```
    
- **Descrição**
    
    Define o namespace IPC (inter-process communication): semáforos, memórias compartilhadas e filas de mensagem.
    
- **Conceito de Uso**
    
    Compartilhar memoria POSIX (`shm`) entre contêineres (`container:`) ou isolar (`private`), ou usar IPC do host para performance.
    
- **Propriedades Internas**
    - Define `HostConfig.IpcMode`.
    - Kernel cria ou compartilha `ipc_namespace`.
- **Exemplo**
    
    ```bash
    docker run --ipc=host my-app
    
    ```
    

---

### 8.11 `-oom-kill-disable`

- **Sintaxe**
    
    ```bash
    --oom-kill-disable
    
    ```
    
- **Descrição**
    
    Desabilita o **OOM Killer** do cgroup para este contêiner; mesmo se exceder limite de memória, não será morto automaticamente.
    
- **Conceito de Uso**
    
    Em casos onde você prefere lidar manualmente com OOM (por exemplo, dumps de memória antes de matar), mas cuidado: pode congelar o host.
    
- **Propriedades Internas**
    - Ajusta `HostConfig.OomKillDisable=true`.
    - Kernel mantém parâmetro `oom_kill_disable` em `memory.oom_control`.
- **Exemplo**
    
    ```bash
    docker run -m 500m --oom-kill-disable my-app
    
    ```
    

---

### 8.12 `-oom-score-adj int`

- **Sintaxe**
    
    ```bash
    --oom-score-adj=-500
    --oom-score-adj=1000
    
    ```
    
- **Descrição**
    
    Ajusta a pontuação OOM do contêiner no host entre `-1000` (nunca matar) e `+1000` (primeiro a matar).
    
- **Conceito de Uso**
    
    Priorizar quais processos são alvos do OOM Killer em situações de escassez de memória no host.
    
- **Propriedades Internas**
    - Escreve em `/proc/<pid>/oom_score_adj` no processo init do contêiner.
- **Exemplo**
    
    ```bash
    docker run --oom-score-adj=500 my-app
    
    ```
    

---

## Observações Finais

1. **Princípio de Menor Privilégio**
    - Prefira adicionar/remover capabilities (`-cap-add`/`-cap-drop`) em vez de usar `-privileged`.
2. **Isolamento em Níveis**
    - Combine `-userns`, `-uts`, `-pid` e `-ipc` para criar contêineres com isolamento reforçado conforme necessidade.
3. **OOM e Estabilidade**
    - Ajuste `-oom-score-adj` em serviços críticos para evitar que sejam mortos antes de processos menos, críticos para o host.

Com este guia, você tem controle granular sobre segurança, capacidades e namespaces dos seus contêineres Docker. Qualquer cenário específico ou dúvidas, estou à disposição!