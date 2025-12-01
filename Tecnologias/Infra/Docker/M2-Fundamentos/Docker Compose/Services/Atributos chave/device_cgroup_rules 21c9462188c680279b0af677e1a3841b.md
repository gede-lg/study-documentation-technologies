# device_cgroup_rules

## Entendendo o atributo `device_cgroup_rules` no Docker Compose

### Introdução

O Docker Compose permite configurar containers de forma declarativa através de um arquivo YAML. Dentre as várias opções de configuração de serviços, o atributo `device_cgroup_rules` oferece controle granular sobre as regras de acesso a dispositivos no nível de cgroup do kernel Linux, mapeando diretamente a opção de linha de comando `--device-cgroup-rule` do Docker Engine. ([stackoverflow.com](https://stackoverflow.com/questions/48498827/how-to-pass-device-cgroup-rule-by-docker-compose?utm_source=chatgpt.com), [docs.docker.com](https://docs.docker.com/reference/api/engine/version-history/?utm_source=chatgpt.com))

### Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/g/g-p-68596a64c76c819185e08bdb9bacec85-infra/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/g/g-p-68596a64c76c819185e08bdb9bacec85-infra/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#sintaxe-detalhada-e-uso-pr%C3%A1tico)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/g/g-p-68596a64c76c819185e08bdb9bacec85-infra/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/g/g-p-68596a64c76c819185e08bdb9bacec85-infra/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/g/g-p-68596a64c76c819185e08bdb9bacec85-infra/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/g/g-p-68596a64c76c819185e08bdb9bacec85-infra/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/g/g-p-68596a64c76c819185e08bdb9bacec85-infra/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#sugest%C3%B5es-para-aprofundamento)

---

### Conceitos Fundamentais

- **Cgroups (Control Groups):** subsistema do kernel Linux que isola e limita recursos de processos, incluindo CPU, memória, rede e dispositivos. ([docs.docker.com](https://docs.docker.com/reference/api/engine/version-history/?utm_source=chatgpt.com))
- **Device Controller:** parte do cgroup que gerencia o acesso a dispositivos de bloco e caractere, permitindo definir regras sobre quais dispositivos um container pode usar e com quais permissões.
- **Mapeamento via Compose:** o `device_cgroup_rules` corresponde ao campo `HostConfig.DeviceCgroupRules` na API de criação de containers do Docker Engine, fornecendo um array de strings no formato `<tipo> <major>:<minor> <permissões>`. ([docs.docker.com](https://docs.docker.com/reference/api/engine/version-history/?utm_source=chatgpt.com))

---

### Sintaxe Detalhada e Uso Prático

```yaml
version: '2.4'     # Deve ser 2.3 ou 2.4 para suportar device_cgroup_rules
services:
  meu-servico:
    image: minha-imagem:latest
    devices:
      - /dev/ttyUSB0:/dev/ttyUSB0           # Mapeia o dispositivo físico
    device_cgroup_rules:
      - 'c 188:* rmw'                       # Regra: char device, major 188, qualquer minor, permissões read/write/mknod
      - 'b 8:0 r'                           # Regra: block device, major 8, minor 0, permissão read

```

- **Tipos válidos:**
    - `c` para *character devices*
    - `b` para *block devices*
- **Major:Minor:** identificadores do dispositivo no sistema host.
- **Permissões:** combinação de `r` (read), `w` (write), `m` (mknod).
- **Requisitos de versão:** disponível a partir do Compose file version **2.3** ([docs.docker.com](https://docs.docker.com/compose/releases/release-notes/?utm_source=chatgpt.com))

---

### Cenários de Restrição ou Não Aplicação

- **Compose v3.x:** o suporte a `device_cgroup_rules` foi removido nas versões 3.x do Compose file; só funciona em versões 2.3 e 2.4. ([github.com](https://github.com/docker/compose/issues/8251?utm_source=chatgpt.com))
- **Cgroup v2:** em sistemas configurados exclusivamente com cgroup v2, a controladora de dispositivos pode não estar habilitada ou suportada via Compose.
- **Ambientes Windows/macOS:** não aplicável fora de sistemas Linux, pois depende diretamente das cgroups do kernel Linux.

---

### Componentes Chave Associados

- **`devices`**: monta o arquivo de dispositivo do host no container. Deve ser usado em conjunto para expor `/dev/...`.
- **`cap_add` / `cap_drop`**: define capacidades Linux necessárias (ex.: `CAP_MKNOD`) quando se usa `m` em `device_cgroup_rules`.
- **`privileged`**: concede todas as permissões de cgroup e dispositivos, podendo tornar `device_cgroup_rules` desnecessário, porém menos seguro.
- **HostConfig.DeviceCgroupRules**: campo na API do Docker que recebe o array de strings configurado em Compose ([docs.docker.com](https://docs.docker.com/reference/api/engine/version-history/?utm_source=chatgpt.com))

---

### Melhores Práticas e Padrões de Uso

- **Princípio do menor privilégio:** defina apenas as regras estritamente necessárias (evite usar `:*` quando possível).
- **Combinação com `devices`:** sempre monte explicitamente o dispositivo em `devices` antes de definir as regras de cgroup.
- **Validação:** use ferramentas de inspeção como o plugin da JetBrains para detectar erros de sintaxe ou valores inválidos em `device_cgroup_rules`. ([jetbrains.com](https://www.jetbrains.com/guide/go/tips/containers-device_cgroup_rules-values-inspection/?utm_source=chatgpt.com))
- **Segurança:** cuidado ao usar `m` (mknod), pois permite criação de nós de dispositivo dentro do container.

---

### Exemplo Prático Completo

Um projeto simplificado para leitura de sensor USB:

```yaml
version: '2.4'
services:
  sensor-reader:
    image: sensor-app:latest          # Container que lê dados do sensor
    restart: unless-stopped
    devices:
      - /dev/ttyUSB0:/dev/ttyUSB0     # Exposição do dispositivo físico
    device_cgroup_rules:
      - 'c 188:* rmw'                 # Permite leitura, escrita e criação de nós para major 188
      - 'c 189:* rwm'                 # Permite todas as ops em major 189
    cap_add:
      - MKNOD                          # Necessário para usar permissão m
    environment:
      - SENSOR_BAUD=9600
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

```

1. **`version: '2.4'`**: habilita `device_cgroup_rules`.
2. **`devices`**: monta `/dev/ttyUSB0`.
3. **`device_cgroup_rules`**: define permissões finas de cgroup.
4. **`cap_add: MKNOD`**: permite criação de nós de dispositivo.

---

### Sugestões para Aprofundamento

- **Documentação oficial do Docker Compose:** seção de [Release Notes](https://docs.docker.com/compose/releases/release-notes/) ([docs.docker.com](https://docs.docker.com/compose/releases/release-notes/?utm_source=chatgpt.com))
- **API Engine do Docker:** campo `HostConfig.DeviceCgroupRules` na criação de containers ([docs.docker.com](https://docs.docker.com/reference/api/engine/version-history/?utm_source=chatgpt.com))
- **Linux Kernel Cgroup v2:** estudo sobre differences entre cgroup v1 e v2 para dispositivos

---

Com este guia, você dispõe de uma explicação completa sobre o atributo `device_cgroup_rules` no Docker Compose, cobrindo desde o conceito até um exemplo prático de ponta a ponta.