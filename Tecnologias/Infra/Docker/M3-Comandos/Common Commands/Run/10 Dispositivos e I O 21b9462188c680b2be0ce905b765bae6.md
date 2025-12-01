# 10. Dispositivos e I/O

---

Os parâmetros de dispositivos e I/O permitem expor hardware do host ao contêiner e controlar limites e prioridades de leitura e gravação em blocos.

---

### 10.1 `-device list`

- **Sintaxe**
    
    ```bash
    --device /dev/snd
    --device=/dev/snd:/dev/snd:rw
    --device=/dev/ttyUSB0:/dev/ttyUSB0:rw,c  # c para caractere
    
    ```
    
- **Descrição**
    
    Expõe dispositivos do host dentro do contêiner, criando nós de dispositivo correspondentes com permissões especificadas.
    
- **Conceito de Uso**
    
    Necessário para contêineres que precisam acessar hardware diretamente, como som (`/dev/snd`), portas seriais, dispositivos USB e GPUs.
    
- **Propriedades Internas**
    - Popula `HostConfig.Devices` com objetos `{PathOnHost, PathInContainer, CgroupPermissions}`.
    - Docker faz cgroup de dispositivos (`devices.allow`) e cria nós via mount do devtmpfs.
- **Exemplo**
    
    ```bash
    # Acessar placa de som do host
    docker run --device /dev/snd my-audio-app
    
    ```
    

---

### 10.2 `-device-cgroup-rule list`

- **Sintaxe**
    
    ```bash
    --device-cgroup-rule="c 7:128 rwm"
    --device-cgroup-rule="b 8:* rm"
    
    ```
    
- **Descrição**
    
    Define regras de cgroup para permitir acesso a classes de dispositivos:
    
    - **`c`**: caractere
    - **`b`**: bloco
    - **`r`**, **`w`**, **`m`**: read, write, mknod
    - **`major:minor`**: número do dispositivo ou  para coringas.
- **Conceito de Uso**
    
    Quando você precisa liberar acesso granular a dispositivos sem mapear cada nó explicitamente via `--device`.
    
- **Propriedades Internas**
    - Acrescenta entradas em `/sys/fs/cgroup/devices/<cgroup>/devices.allow` ou `devices.deny`.
    - Aplicado antes do start do contêiner.
- **Exemplo**
    
    ```bash
    # Liberar todos os dispositivos de bloco do major 8 (discos SCSI)
    docker run --device-cgroup-rule="b 8:* rm" my-storage-tool
    
    ```
    

---

### 10.3 `-device-read-bps list`

- **Sintaxe**
    
    ```bash
    --device-read-bps=/dev/sda:1mb
    --device-read-bps=/dev/sda:1048576
    
    ```
    
- **Descrição**
    
    Limita a taxa de leitura de dados (bytes por segundo) de um dispositivo de bloco do host.
    
- **Conceito de Uso**
    
    Evita que contêineres monopolizem I/O de disco, protegendo outros serviços de lentidão.
    
- **Propriedades Internas**
    - Em cgroup v1: escreve em `blkio.throttle.read_bps_device`.
    - Em cgroup v2: ajusta `io.max` para `"major:minor rbps=valor"`.
- **Exemplo**
    
    ```bash
    docker run --device /dev/sda --device-read-bps=/dev/sda:10mb my-backup-job
    
    ```
    

---

### 10.4 `-device-read-iops list`

- **Sintaxe**
    
    ```bash
    --device-read-iops=/dev/sda:1000
    
    ```
    
- **Descrição**
    
    Limita o número de operações de leitura de I/O por segundo (IOPS) em um dispositivo de bloco.
    
- **Conceito de Uso**
    
    Controla workloads de alta intensidade de leitura, como bancos de dados, para manter qualidade de serviço.
    
- **Propriedades Internas**
    - Em cgroup v1: `blkio.throttle.read_iops_device`.
    - Em cgroup v2: `io.max` com `"major:minor riops=valor"`.
- **Exemplo**
    
    ```bash
    docker run --device /dev/sdb --device-read-iops=/dev/sdb:500 db-container
    
    ```
    

---

### 10.5 `-device-write-bps list`

- **Sintaxe**
    
    ```bash
    --device-write-bps=/dev/sda:5mb
    
    ```
    
- **Descrição**
    
    Limita a taxa de gravação de dados (bytes por segundo) para um dispositivo de bloco.
    
- **Conceito de Uso**
    
    Evita picos de gravação que podem causar latência em outras aplicações do host.
    
- **Propriedades Internas**
    - Em cgroup v1: `blkio.throttle.write_bps_device`.
    - Em cgroup v2: `io.max` com `"major:minor wbps=valor"`.
- **Exemplo**
    
    ```bash
    docker run --device /dev/sda --device-write-bps=/dev/sda:20mb log-writer
    
    ```
    

---

### 10.6 `-device-write-iops list`

- **Sintaxe**
    
    ```bash
    --device-write-iops=/dev/sda:200
    
    ```
    
- **Descrição**
    
    Limita o número de operações de escrita por segundo (IOPS) em um dispositivo de bloco.
    
- **Conceito de Uso**
    
    Controla workloads que fazem muitas escritas pequenas, garantindo performance estável do disco.
    
- **Propriedades Internas**
    - Em cgroup v1: `blkio.throttle.write_iops_device`.
    - Em cgroup v2: `io.max` com `"major:minor wiops=valor"`.
- **Exemplo**
    
    ```bash
    docker run --device /dev/sda --device-write-iops=/dev/sda:100 log-collector
    
    ```
    

---

### 10.7 `-blkio-weight uint16`

- **Sintaxe**
    
    ```bash
    --blkio-weight=500
    
    ```
    
- **Descrição**
    
    Configura peso relativo de I/O em blocos (escala de 10 a 1000, padrão 500).
    
- **Conceito de Uso**
    
    Define prioridade de I/O: contêineres com weight maior têm preferência em disputas por banda de disco.
    
- **Propriedades Internas**
    - Em cgroup v1: mapeado para `blkio.weight`.
    - Em cgroup v2: mapeado para `io.bfq.weight` ou `io.weight` conforme scheduler.
- **Exemplo**
    
    ```bash
    docker run --blkio-weight=800 storage-service
    
    ```
    

---

### 10.8 `-blkio-weight-device list`

- **Sintaxe**
    
    ```bash
    --blkio-weight-device=/dev/sda:300
    --blkio-weight-device=/dev/sdb:700
    
    ```
    
- **Descrição**
    
    Configura peso de I/O específico para um dispositivo de bloco.
    
- **Conceito de Uso**
    
    Ajusta prioridade entre múltiplos discos: por exemplo, dar mais prioridade a SSD e menos a HDD.
    
- **Propriedades Internas**
    - Em cgroup v1: `blkio.weight_device`.
    - Em cgroup v2: parte de `io.weight` ou `io.bfq.weight_device`.
- **Exemplo**
    
    ```bash
    docker run \
      --blkio-weight-device=/dev/sda:100 \
      --blkio-weight-device=/dev/nvme0n1:900 \
      db-container
    
    ```
    

---

## Observações e Boas Práticas

1. **Consistência de cgroup v1 vs v2**
    - Em sistemas com cgroup v2, as limitações de I/O são unificadas em `io.max` e `io.weight`.
2. **Unir Limites e Pesos**
    - Você pode combinar `-blkio-weight` com limitações de BPS/IOPS para moldar finamente o throughput e a prioridade.
3. **Monitoração**
    - Use ferramentas como `iotop`, `docker stats` ou `cgroupfs` para verificar se limites estão sendo respeitados.
4. **Segurança**
    - Evite dar acesso irrestrito a dispositivos críticos; prefira regras cgroup granulares (`-device-cgroup-rule`) em vez de `-privileged`.
5. **Desempenho**
    - Para cargas intensivas de I/O, testes de benchmark em ambiente similar ao de produção ajudam a calibrar limites e pesos.

Com este guia, você tem total controle sobre como seus contêineres interagem com hardware de bloco e dispositivos do host, garantindo performance estável e isolada.