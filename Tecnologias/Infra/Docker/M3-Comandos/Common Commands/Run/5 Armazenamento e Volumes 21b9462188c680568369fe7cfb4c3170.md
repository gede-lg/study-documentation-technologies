# 5. Armazenamento e Volumes

---

Os parâmetros de armazenamento permitem montar diretórios do host, volumes gerenciados pelo Docker ou sistemas de arquivos em memória (tmpfs) dentro de contêineres, bem como controlar drivers e opções de cada montagem.

---

### 5.1 `v`, `-volume list`

- **Sintaxe**
    
    ```bash
    -v <host_path>:<container_path>
    -v <host_path>:<container_path>:ro
    --volume=<host_path>:<container_path>[:<options>]
    
    ```
    
- **Descrição**
    
    Monta um diretório ou arquivo do host no contêiner (`bind-mount`) ou um **volume nomeado** gerenciado pelo Docker (quando `host_path` omito ou uso apenas `<volume_name>:<container_path>`).
    
- **Conceito de Uso**
    - **Bind-mount**: para compartilhar código, dados de configuração ou diretórios específicos do host.
    - **Volume nomeado**: gerenciado pelo Docker, ideal para persistência de dados (bancos, logs) sem se preocupar com caminhos do host.
- **Formato & Sub-opções**
    - `ro` (read-only): impede escrita no contêiner.
    - `z` / `Z` (SELinux): ajusta contextos de segurança.
    - Ex.: `v /opt/data:/data:rw,z`
- **Propriedades Internas**
    - Atualiza `HostConfig.Binds` na API do Docker.
    - Cria volumes nomeados em `/var/lib/docker/volumes/<nome>/_data`.
- **Exemplo**
    
    ```bash
    # Bind-mount de um diretório do host
    docker run -v /home/user/app:/usr/src/app myapp
    
    # Volume nomeado para persistência
    docker run -v meus-dados:/var/lib/mysql mysql
    
    # Somente leitura com SELinux
    docker run -v /opt/config:/etc/config:ro,Z myapp
    
    ```
    

---

### 5.2 `-mount mount`

- **Sintaxe**
    
    ```bash
    --mount type=<tipo>,source=<origem>,target=<destino>[,readonly][,consistency=<modo>][,tmpfs-size=<bytes>][,volume-driver=<driver>][,bind-propagation=<prop>]
    
    ```
    
- **Descrição**
    
    Sintaxe unificada e expressiva para definir **bind-mounts**, **volumes** ou **tmpfs** com opções avançadas.
    
- **Conceito de Uso**
    
    Preferível a `-v` quando há múltiplas opções ou necessidade de clareza.
    
- **Sub-propriedades por `type`**
    1. **`type=bind`**
        - `source` = caminho no host
        - `bind-propagation` = `rprivate`, `rshared`, `rslave`
    2. **`type=volume`**
        - `source` = nome do volume
        - `volume-driver` = driver a usar
        - `consistency` = `consistent`|`cached`|`delegated` (macOS)
    3. **`type=tmpfs`**
        - `tmpfs-size` = tamanho em bytes
        - `tmpfs-mode` = permissão em octal (ex.: `1777`)
- **Propriedades Internas**
    - Popula estruturas `HostConfig.Mounts` com objetos tipados para cada montagem.
    - Permite melhor validação de schema na API.
- **Exemplo**
    
    ```bash
    # Volume nomeado com driver e consistência
    docker run \
      --mount type=volume,source=cache-data,target=/cache,volume-driver=local,consistency=delegated \
      myapp
    
    # Bind-mount propagável
    docker run \
      --mount type=bind,source=/opt/logs,target=/var/log/myapp,bind-propagation=rshared \
      myapp
    
    # tmpfs de 64 MB
    docker run \
      --mount type=tmpfs,target=/run,tmpfs-size=67108864 \
      busybox
    
    ```
    

---

### 5.3 `-tmpfs list`

- **Sintaxe**
    
    ```bash
    --tmpfs <container_path>
    --tmpfs <container_path>:<options>
    
    ```
    
- **Descrição**
    
    Monta um sistema de arquivos em memória (RAM) no contêiner, sem persistência no disco.
    
- **Conceito de Uso**
    
    Ideal para dados temporários sensíveis (arquivos de socket, caches transitórios) que devem sumir ao parar o contêiner e não gerar I/O de disco.
    
- **Opções**
    - `size=<bytes>`: tamanho máximo do tmpfs.
    - `mode=<permissões>`: modo de acesso (ex.: `1777`).
- **Propriedades Internas**
    - Equivalente a `-mount type=tmpfs` mas com sintaxe curta.
    - Docker configura `HostConfig.Tmpfs` no ponto de montagem.
- **Exemplo**
    
    ```bash
    # tmpfs padrão
    docker run --tmpfs /tmp busybox
    
    # tmpfs com tamanho e modo
    docker run --tmpfs /cache:size=100m,mode=1777 myapp
    
    ```
    

---

### 5.4 `-volume-driver string`

- **Sintaxe**
    
    ```bash
    --volume-driver=<driver_name>
    
    ```
    
- **Descrição**
    
    Especifica o **driver** a ser usado para volumes nomeados criados implicitamente por `-v <volume>:/path`.
    
- **Conceito de Uso**
    
    Permite usar plugins de armazenamento (NFS, Amazon EFS, Azure File, REX-Ray etc.) para volumes persistentes e compartilhados.
    
- **Propriedades Internas**
    - Define `HostConfig.VolumeDriver`.
    - Docker invoca o driver via API de volumes para criar/montar o volume.
- **Exemplo**
    
    ```bash
    docker run \
      -v meus-dados:/data \
      --volume-driver=rexray/efs \
      myapp
    
    ```
    

---

### 5.5 `-volumes-from list`

- **Sintaxe**
    
    ```bash
    --volumes-from=<container_or_id>[:ro|rw]
    
    ```
    
- **Descrição**
    
    Monta **todos** os volumes (bind-mounts e volumes nomeados) de outro contêiner dentro deste, preservando caminhos e modos de acesso.
    
- **Conceito de Uso**
    
    Compartilhar dados entre contêineres sem rede ou sem criar explicitamente os volumes em cada `run`.
    
- **Propriedades Internas**
    - Para cada montagem em `container_or_id`, adiciona o mesmo bind/volume em `HostConfig.Binds` do contêiner atual.
- **Exemplo**
    
    ```bash
    # Contêiner "db" tem volume em /var/lib/mysql
    docker run --volumes-from db --name backup busybox tar czf /backup/mysql.tar.gz /var/lib/mysql
    
    ```
    

---

### 5.6 `-storage-opt list`

- **Sintaxe**
    
    ```bash
    --storage-opt <opt1>=<value1>
    --storage-opt <opt1>=<value1>,<opt2>=<value2>
    
    ```
    
- **Descrição**
    
    Define **opções específicas de driver de armazenamento** (storage driver) para este contêiner, como tamanho máximo de thin pool em devicemapper ou tamanho de log em overlay2.
    
- **Conceito de Uso**
    
    Ajustar limites e comportamentos do backend de armazenamento por contêiner, sem afetar toda a instalação Docker.
    
- **Exemplos de Opções**
    - `dm.basesize=<bytes>` (devicemapper): define o tamanho base do container (padrão 10 GB).
    - `size=<bytes>` (overlay2 em alguns sistemas): limita tamanho do sistema de arquivos.
- **Propriedades Internas**
    - Adiciona chaves em `HostConfig.StorageOpt` na API.
    - Docker passa essas opções ao driver de armazenamento durante `CreateContainer`.
- **Exemplo**
    
    ```bash
    # devicemapper com base size de 20 GB
    docker run -d \
      --storage-opt dm.basesize=20G \
      centos
    
    # overlay2 limitando FS a 5 GB
    docker run -d \
      --storage-opt size=5G \
      ubuntu
    
    ```
    

---

## Considerações Finais

- **Persistência vs. Performance**
    - **Volumes nomeados** garantem persistência e isolamento de dados.
    - **Bind-mounts** expõem caminhos do host, mas podem criar dependências de plataforma.
    - **tmpfs** oferece alta performance para dados efêmeros em RAM.
- **Orquestração**
    - Em Kubernetes ou Swarm, especificar montagens ocorre via manifestos (Volumes e VolumeMounts), mas a lógica subjacente é a mesma.
- **Boa Prática**
    - Prefira `-mount` para clareza em scripts e infra como código.
    - Use `-storage-opt` apenas quando realmente precisar de customizações no armazenamento.

Com isso, você dispõe de um guia completo para controlar como e onde seus contêineres armazenam e acessam dados. Estou à disposição para exemplos adicionais ou dúvidas específicas!