# cpu_rt_period

De acordo, Gedê\! A.R.I.A. vai te ajudar a entender tudo sobre o `cpu_rt_period` no Docker Compose. Como você pediu, serei bem detalhista e extenso.

---

## Gerenciamento de Recursos em Tempo Real: Entendendo `cpu_rt_period` no Docker Compose

---

### Introdução

No mundo dos contêineres e da orquestração com **Docker** e **Docker Compose**, o controle de recursos é fundamental para garantir a estabilidade e o desempenho das aplicações. Quando falamos de cargas de trabalho que exigem previsibilidade e baixa latência, como sistemas de áudio/vídeo em tempo real, controle industrial ou aplicações financeiras de alta frequência, o gerenciamento do acesso à CPU se torna crítico. É nesse contexto que o atributo **`cpu_rt_period`**, juntamente com **`cpu_rt_runtime`**, ganha destaque no Docker Compose. Ele permite que você configure cotas de CPU para cargas de trabalho de tempo real, garantindo que um contêiner receba uma fatia garantida do tempo de processamento, mesmo sob alta carga.

### Sumário

Nesta explicação detalhada, abordaremos os seguintes pontos para que você compreenda completamente o `cpu_rt_period` e seu impacto no Docker:

- **Conceitos Fundamentais:** Entenderemos o que são tarefas de tempo real, como o kernel Linux gerencia o agendamento de CPU e a importância de `cpu_rt_period` e `cpu_rt_runtime` para garantir o desempenho de aplicações sensíveis ao tempo.
- **Sintaxe Detalhada e Uso Prático:** Veremos a sintaxe correta no arquivo `docker-compose.yml`, com exemplos práticos e comentados.
- **Cenários de Restrição ou Não Aplicação:** Discutiremos quando e por que essa configuração pode não ser a melhor escolha, e as limitações que podem surgir.
- **Componentes Chave Associados:** Aprofundaremos nos conceitos de CFS (Completely Fair Scheduler) e RT (Real-Time) scheduling no Linux, e como o Docker interage com eles.
- **Melhores Práticas e Padrões de Uso:** Ofereceremos recomendações para otimizar o uso dessas configurações.
- **Exemplo Prático Completo:** Demonstraremos um cenário de ponta a ponta para ilustrar a aplicação.

---

### Conceitos Fundamentais

Para entender `cpu_rt_period`, precisamos primeiro abordar alguns conceitos essenciais sobre agendamento de CPU no Linux e o que significa "tempo real" no contexto de sistemas operacionais.

### O que é "Tempo Real" no Contexto de Software?

Quando falamos de sistemas "em tempo real" (real-time systems), estamos nos referindo a sistemas onde a **correção da operação** não depende apenas do resultado lógico, mas também do **tempo em que esse resultado é produzido**. Uma operação que é correta logicamente, mas que é entregue fora de um prazo estipulado, pode ser considerada um erro.

Existem diferentes tipos de sistemas em tempo real:

- **Hard Real-Time (Tempo Real Rígido):** Falhar em cumprir um prazo é um desastre completo. Exemplos: sistemas de controle de voo, implantação de airbags, controle de reatores nucleares. A previsibilidade é absoluta.
- **Soft Real-Time (Tempo Real Flexível):** Falhar em cumprir um prazo degrada a qualidade, mas não causa um desastre. Exemplos: streaming de vídeo, jogos online. Pequenos atrasos podem causar *buffers* ou *lags*, mas o sistema continua funcionando.

O `cpu_rt_period` e `cpu_rt_runtime` são projetados para ajudar a garantir o comportamento de *soft real-time* ou até mesmo *hard real-time* (se o sistema operacional subjacente estiver configurado para tal) para contêineres, fornecendo garantias de agendamento de CPU.

### Agendamento de CPU no Kernel Linux

O kernel Linux possui diferentes algoritmos de agendamento (schedulers) para gerenciar como os processos compartilham o tempo de CPU. Os dois principais são:

1. **CFS (Completely Fair Scheduler):** Este é o agendador padrão para processos de uso geral no Linux. Ele visa distribuir o tempo de CPU de forma "justa" entre todos os processos em execução, tentando garantir que nenhum processo seja "privado" de CPU por muito tempo. É otimizado para *throughput* e *interatividade*, mas não oferece garantias estritas de tempo.
2. **RT (Real-Time) Scheduler:** Este agendador é usado para processos que têm requisitos de tempo real. Ele opera com base em prioridades, garantindo que processos com maior prioridade RT recebam tempo de CPU antes de processos com menor prioridade ou processos agendados pelo CFS. Dentro do agendamento RT, existem duas políticas principais:
    - **SCHED\_FIFO (First-In, First-Out):** Processos com a mesma prioridade são executados até que bloqueiem ou sejam explicitamente cedidos.
    - **SCHED\_RR (Round-Robin):** Processos com a mesma prioridade são executados por um *timeslice* (fatia de tempo) e, em seguida, são rotacionados.

### Cgroups e o Controle de Recursos

O **Docker** utiliza **cgroups (control groups)** do Linux para gerenciar e isolar recursos entre os contêineres. Cgroups permitem que você aloque recursos como CPU, memória, I/O de disco e largura de banda de rede para grupos de processos. Para o controle de CPU, os cgroups fornecem o subsistema `cpuacct` e `cpu`. É através do subsistema `cpu` que `cpu_rt_period` e `cpu_rt_runtime` são configurados.

### O Propósito de `cpu_rt_period` e `cpu_rt_runtime`

Esses dois parâmetros trabalham em conjunto para definir uma "cota" de tempo de CPU em tempo real para um contêiner dentro de um determinado período.

- **`cpu_rt_period` (Período em tempo real da CPU):** Define o período de tempo (em microssegundos) durante o qual a cota de tempo de CPU em tempo real é medida. É o "ciclo" de medição. O valor padrão é **100.000 microssegundos (100 ms)**.
- **`cpu_rt_runtime` (Tempo de execução em tempo real da CPU):** Define a quantidade máxima de tempo (em microssegundos) que um contêiner pode gastar em tarefas de tempo real dentro de cada `cpu_rt_period`.

**Exemplo:** Se você configurar `cpu_rt_period: 100000` e `cpu_rt_runtime: 80000`, isso significa que o contêiner pode usar até 80.000 microssegundos de tempo de CPU em tempo real a cada 100.000 microssegundos (100 ms). Ou seja, ele pode usar 80% do tempo de CPU disponível para tarefas de tempo real dentro de cada período.

**Importância e Propósito:**

O principal propósito de `cpu_rt_period` e `cpu_rt_runtime` é:

- **Garantir o desempenho de aplicações em tempo real:** Para aplicações críticas que precisam de uma resposta rápida e consistente, esses parâmetros garantem que elas não sejam starved (privadas de CPU) por outras aplicações menos críticas.
- **Isolamento:** Ajuda a isolar contêineres uns dos outros, impedindo que um contêiner que consome muitos recursos em tempo real afete negativamente o desempenho de outros contêineres ou do próprio host.
- **Previsibilidade:** Oferece um nível de previsibilidade sobre o comportamento da CPU, o que é vital para cargas de trabalho de tempo real.

É crucial entender que `cpu_rt_period` e `cpu_rt_runtime` são uma forma de **limitar o *uso máximo*** de CPU de tempo real. Eles não garantem que um contêiner terá **sempre** essa quantidade de CPU se o sistema não estiver sob carga. Eles definem uma **cota superior** para o agendador de tempo real.

---

### Sintaxe Detalhada e Uso Prático

No Docker Compose, `cpu_rt_period` é configurado sob a chave `services` para um serviço específico.

### Sintaxe

A sintaxe é simples e direta no seu arquivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  my-realtime-app:
    image: my-realtime-image:latest
    cpu_rt_period: <VALUE_IN_MICROSECONDS> # Período de agendamento em microssegundos
    cpu_rt_runtime: <VALUE_IN_MICROSECONDS> # Tempo máximo de execução em microssegundos
    # Outras configurações do serviço...

```

**Parâmetros:**

- **`cpu_rt_period`**: Um número inteiro positivo que representa o período em microssegundos. O valor mínimo é 1.000 (1ms). O valor padrão é 100.000 (100ms).
- **`cpu_rt_runtime`**: Um número inteiro que representa o tempo de execução em microssegundos. Este valor deve ser menor ou igual a `cpu_rt_period`. Um valor de `1` (ou qualquer valor negativo) significa ilimitado (sem cota de tempo real), mas **não é recomendado** pois pode levar a um esgotamento da CPU em tempo real por um único contêiner, afetando todo o sistema.

### Exemplos de Código Comentados

Vamos ver alguns exemplos práticos para ilustrar o uso.

**Exemplo 1: Alocando 50% da CPU para tarefas de tempo real**

```yaml
version: '3.8'

services:
  audio-processor:
    image: my-audio-processor:latest
    cpu_rt_period: 100000 # Período de 100ms
    cpu_rt_runtime: 50000 # 50ms de tempo de execução em cada período de 100ms
    # Isso significa que o contêiner pode usar até 50% do tempo de CPU para tarefas RT.
    # Se o contêiner tentar usar mais, ele será estrangulado (throttled).
    ports:
      - "8080:8080"
    command: ["./start-audio-process.sh"]

```

Neste exemplo, o contêiner `audio-processor` é configurado para ter uma cota de 50% da CPU para processos de tempo real. Isso é útil para aplicações de áudio que exigem baixa latência e não podem ter interrupções significativas.

**Exemplo 2: Alocando 80% da CPU para um sistema de controle industrial**

```yaml
version: '3.8'

services:
  plc-controller:
    image: industrial-plc-firmware:v2.1
    cpu_rt_period: 200000 # Período de 200ms
    cpu_rt_runtime: 160000 # 160ms de tempo de execução em cada período de 200ms
    # Equivalente a 80% da CPU dedicada a tarefas RT para este contêiner.
    # Note que o período foi alterado para 200ms, o que pode ser mais adequado para certas cargas de trabalho.
    volumes:
      - /data/plc:/app/data
    environment:
      - PLC_ID=001

```

Aqui, um contêiner que simula um controlador lógico programável (PLC) recebe uma cota de CPU de tempo real de 80%. Isso é fundamental em ambientes industriais onde a precisão e o tempo de resposta são cruciais para a segurança e a operação.

**Exemplo 3: Combinando com outras configurações de CPU**

É importante notar que `cpu_rt_period` e `cpu_rt_runtime` são *adicionais* e *complementares* a outras configurações de gerenciamento de CPU, como `cpus`, `cpu_shares` e `cpu_quota`.

- **`cpus`**: Define o número de CPUs que um contêiner pode usar. (Ex: `cpus: 1.5` para 1 CPU e meia).
- **`cpu_shares`**: Define as proporções relativas de tempo de CPU para cada contêiner quando a CPU está sob contenção. (Ex: `cpu_shares: 1024` é o padrão, `2048` daria o dobro de tempo se houver contenção).
- **`cpu_quota`**: Define o tempo máximo de CPU (em microssegundos) que um contêiner pode usar em um determinado período (definido por `cpu_period`, que também é 100.000 por padrão). É a cota de CPU *geral*, enquanto `cpu_rt_runtime` é para a cota de CPU *em tempo real*.

<!-- end list -->

```yaml
version: '3.8'

services:
  critical-analytics:
    image: analytics-engine:latest
    cpus: 2             # Contêiner pode usar até 2 núcleos de CPU
    cpu_shares: 2048    # Prioridade de CPU maior em relação a outros contêineres
    cpu_rt_period: 100000 # Período de 100ms
    cpu_rt_runtime: 70000 # 70ms de tempo de execução em cada período de 100ms para tarefas RT
    # Este serviço terá 2 CPUs, o dobro de prioridade relativa em comparação com o padrão,
    # e uma garantia de 70% de tempo de CPU em tempo real.
    environment:
      - DATA_SOURCE_URL=jdbc:mysql://db:3306/analytics

```

Neste exemplo, o serviço `critical-analytics` recebe uma configuração robusta de CPU, combinando o número de CPUs, a prioridade relativa e uma cota de tempo real. Isso é útil para aplicações de análise de dados que exigem tanto alta capacidade de processamento quanto baixa latência para eventos críticos.

---

### Cenários de Restrição ou Não Aplicação

Embora `cpu_rt_period` e `cpu_rt_runtime` sejam poderosos, eles não são uma solução mágica para todos os problemas de desempenho e não devem ser usados indiscriminadamente.

### Quando o `cpu_rt_period` pode não ser a melhor escolha ou pode ter restrições:

1. **Requisitos do Kernel:** Para que as configurações de tempo real da CPU funcionem, o kernel Linux do host Docker precisa ter o **agendador de tempo real habilitado**. Isso geralmente significa que o kernel foi compilado com suporte para `CONFIG_RT_GROUP_SCHED` (que geralmente é habilitado por padrão em kernels recentes, mas vale a pena verificar se você estiver usando um kernel personalizado ou mais antigo).
2. **Não Resolve Problemas de "Starvation" de I/O ou Memória:** Essas configurações se aplicam *apenas* à CPU. Se sua aplicação está sofrendo de lentidão devido a gargalos de I/O de disco, latência de rede ou falta de memória, `cpu_rt_period` não ajudará. É crucial diagnosticar o verdadeiro gargalo.
3. **Complexidade Adicional:** Configurar e monitorar o comportamento de tempo real da CPU adiciona uma camada de complexidade à sua infraestrutura. É preciso entender como o agendador do Linux funciona e como monitorar o uso de CPU em tempo real para garantir que as configurações estão tendo o efeito desejado.
4. **Sobrecarga Potencial do Host:** Se você atribuir cotas de tempo real excessivas a muitos contêineres, poderá exaurir os recursos de CPU disponíveis para agendamento de tempo real, levando a problemas de desempenho para todo o host e para outras aplicações, incluindo o próprio Docker.
5. **Não Substitui um Kernel de Tempo Real Dedicado:** Para aplicações de *hard real-time* (por exemplo, sistemas de controle críticos), as configurações de cgroup de tempo real do Docker podem não ser suficientes. Nesses casos, um kernel Linux **PREEMPT\_RT** (um kernel com patches de tempo real que minimizam a latência e aumentam a previsibilidade) e hardware dedicado são geralmente necessários. O Docker, por si só, não transforma um sistema de uso geral em um sistema de *hard real-time*.
6. **Configuração Incorreta:** Valores de `cpu_rt_runtime` muito altos em relação a `cpu_rt_period` podem efetivamente "monopolizar" a CPU para um único contêiner, impedindo que outras tarefas (incluindo as do sistema operacional) recebam tempo de CPU suficiente. Isso pode levar a um sistema instável ou não responsivo.
7. **Não Aplicação a Aplicações não RT:** Para a maioria das aplicações web, bancos de dados ou microsserviços típicos que não têm requisitos estritos de tempo real, usar `cpu_rt_period` é um exagero e pode até ser contraproducente. `cpu_shares`, `cpus` ou `cpu_quota` são geralmente mais apropriados para gerenciamento de CPU de uso geral.

### Quando usar (e quando não usar):

- **Use quando:** Você tem uma aplicação que tem requisitos de latência muito rigorosos e previsíveis, como processamento de áudio/vídeo em tempo real, sistemas de controle, ou certas aplicações financeiras de alta frequência.
- **Não use quando:** Sua aplicação é uma aplicação web padrão, um serviço de banco de dados, ou qualquer coisa que não seja sensível a pequenas variações de latência. O uso excessivo pode piorar o desempenho geral do sistema.

---

### Componentes Chave Associados

Vamos aprofundar um pouco mais nos mecanismos do kernel Linux que suportam o `cpu_rt_period`.

### Agendadores de Tempo Real do Linux (SCHED\_FIFO e SCHED\_RR)

Como mencionado, o kernel Linux oferece políticas de agendamento de tempo real: `SCHED_FIFO` e `SCHED_RR`. Processos que são agendados sob essas políticas recebem prioridade sobre os processos agendados pelo CFS.

Quando você configura `cpu_rt_period` e `cpu_rt_runtime` para um contêiner Docker, você está essencialmente instruindo o subsistema `cpu` do cgroup a aplicar essas cotas aos processos *que se qualificam para agendamento RT* dentro daquele contêiner.

### Cgroups v1 vs. Cgroups v2

O Docker pode usar cgroups v1 ou cgroups v2, dependendo da configuração do seu sistema operacional.

- **Cgroups v1:** O subsistema `cpu` em cgroups v1 gerencia o compartilhamento de CPU e as cotas de tempo real através de arquivos como `cpu.rt_period_us` e `cpu.rt_runtime_us` dentro do diretório do cgroup do contêiner.
- **Cgroups v2:** Cgroups v2 (também conhecidos como unified cgroup hierarchy) oferecem uma interface mais limpa e unificada para gerenciamento de recursos. A funcionalidade de tempo real é mapeada de forma análoga, embora os arquivos de controle possam ter nomes ligeiramente diferentes ou a forma de interação seja um pouco mais abstrata para o usuário final do Docker.

O Docker abstrai a maioria dessas diferenças para você, mas é útil saber que esses mecanismos de kernel são a base para as configurações do Docker Compose.

### Como o Docker Interage com o Kernel

Quando o Docker Compose processa o seu `docker-compose.yml` e inicia um contêiner com `cpu_rt_period` e `cpu_rt_runtime`, ele faz o seguinte:

1. **Criação do Cgroup:** O Docker cria um novo cgroup para o contêiner no subsistema `cpu`.
2. **Configuração dos Arquivos:** Dentro do diretório desse cgroup, o Docker escreve os valores que você especificou em `cpu_rt_period` e `cpu_rt_runtime` nos arquivos de controle apropriados (por exemplo, `/sys/fs/cgroup/cpu/docker/<container_id>/cpu.rt_period_us` e `cpu.rt_runtime_us` para cgroups v1).
3. **Movendo Processos:** Todos os processos que são iniciados dentro daquele contêiner são automaticamente movidos para esse cgroup, herdando as políticas de agendamento de CPU definidas.

Dessa forma, o kernel Linux aplica as restrições de tempo real diretamente aos processos do contêiner, garantindo que eles recebam sua cota garantida de tempo de CPU para tarefas de tempo real.

---

### Melhores Práticas e Padrões de Uso

Para usar `cpu_rt_period` e `cpu_rt_runtime` de forma eficaz, considere as seguintes melhores práticas:

1. **Identifique a Real Necessidade:** Use essas configurações apenas para serviços que *realmente* exigem garantias de tempo real. Não as aplique a todos os contêineres.
2. **Comece com Valores Conservadores:** Não comece com `cpu_rt_runtime` muito alto. Comece com valores menores e aumente gradualmente se o desempenho da sua aplicação em tempo real exigir. Monitorize o sistema cuidadosamente durante esse processo.
3. **Monitore o Desempenho:**
    - **Docker Stats:** Use `docker stats <container_id>` para ver o uso de CPU, mas isso geralmente não mostra o uso de CPU em tempo real especificamente.
    - **Ferramentas de Sistema:** Use ferramentas como `htop`, `top`, `perf` no host para monitorar o uso de CPU e ver se os processos de tempo real estão se comportando como esperado.
    - **Cgroups Files:** Você pode inspecionar os arquivos `cpu.rt_period_us`, `cpu.rt_runtime_us` e `cpu.stat` (especificamente `throttled_time` e `throttled_periods`) nos diretórios do cgroup do contêiner (por exemplo, em `/sys/fs/cgroup/cpu/docker/<container_id>/`) para entender se o contêiner está sendo estrangulado (throttled) ou não. Se `throttled_periods` estiver aumentando, significa que o contêiner está tentando usar mais CPU RT do que a cota permitida.
4. **Entenda o Impacto no Host:** Tenha em mente que as cotas de tempo real podem ter um impacto significativo no agendamento de todo o sistema. Evite configurar um total de `cpu_rt_runtime` para todos os contêineres que exceda o `cpu_rt_period` total disponível no sistema. A soma de `cpu_rt_runtime / cpu_rt_period` para todos os contêineres não deve ser maior que o número de CPUs no host.
5. **Considere `cpus` e `cpu_quota`:** Para controle geral de CPU, considere também usar `cpus` (para alocar CPUs inteiras ou frações) ou `cpu_quota` (para definir o limite máximo de tempo de CPU para tarefas não-RT). `cpu_rt_period` e `cpu_rt_runtime` lidam *especificamente* com o agendamento de tempo real, enquanto os outros lidam com o agendamento geral ou CFS.
6. **Teste em Ambientes de Produção Similares:** Teste exaustivamente as configurações de tempo real em um ambiente que espelhe a produção o mais próximo possível, para garantir que as expectativas de desempenho sejam atendidas e que não haja efeitos colaterais indesejados.

---

### Exemplo Prático Completo: Aplicação de Streaming de Áudio

Imagine que Gedê está desenvolvendo uma aplicação de streaming de áudio com um módulo de processamento de efeitos em tempo real. Este módulo é sensível a latência e precisa de uma cota de CPU garantida para evitar interrupções no áudio.

**Cenário:**

Temos dois serviços:

- **`audio-processor`**: O serviço crítico que lida com o processamento de áudio em tempo real.
- **`web-interface`**: Uma interface web para o usuário, menos crítica em termos de tempo real, mas que precisa estar responsiva.

Vamos configurar o `docker-compose.yml` para priorizar o `audio-processor` com `cpu_rt_period` e `cpu_rt_runtime`.

```yaml
# docker-compose.yml
version: '3.8'

services:
  audio-processor:
    image: gedes-audio-engine:1.0
    container_name: gedes-audio-processor
    # Configurações de CPU em tempo real para garantir o desempenho
    cpu_rt_period: 100000 # Período de 100 mil microssegundos (100ms)
    cpu_rt_runtime: 40000 # Cota de 40 mil microssegundos (40ms) de tempo de CPU em tempo real a cada 100ms
    # Isso significa que 40% do tempo de CPU é reservado para tarefas RT deste contêiner
    # (se o kernel tiver o agendador RT habilitado e a aplicação usar chamadas RT).

    # Limita o uso total de CPU a 1 CPU virtual (100% de um núcleo, ou equivalência).
    # Isso é complementar ao cpu_rt_runtime, que lida especificamente com a cota RT.
    cpus: 1

    ports:
      - "5000:5000"
    environment:
      - AUDIO_BUFFER_SIZE=1024
      - AUDIO_SAMPLE_RATE=44100
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD-SHELL", "curl -f <http://localhost:5000/health> || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  web-interface:
    image: gedes-web-app:1.0
    container_name: gedes-web-interface
    # Para a interface web, não precisamos de tempo real,
    # apenas uma prioridade relativa e limite de uso geral.
    cpu_shares: 512 # Metade da prioridade padrão (1024), se houver contenção
    cpus: 0.5       # Limita o uso a meio núcleo de CPU para não competir excessivamente com o processador de áudio
    ports:
      - "80:80"
    depends_on:
      - audio-processor
    environment:
      - API_URL=http://audio-processor:5000
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "5m"
        max-file: "2"

```

**Explicação Detalhada do Exemplo:**

- **`audio-processor`:**
    - `cpu_rt_period: 100000` e `cpu_rt_runtime: 40000`: Garante que, dentro de cada ciclo de 100 mil microssegundos (100ms), o contêiner `audio-processor` terá no máximo 40 mil microssegundos (40ms) de tempo de CPU de tempo real. Isso é crucial para que os algoritmos de processamento de áudio não sejam interrompidos. Se a aplicação dentro do contêiner fizer uso de chamadas de agendamento de tempo real (como `sched_setscheduler` com `SCHED_FIFO` ou `SCHED_RR`), essa cota será aplicada.
    - `cpus: 1`: Complementarmente, limita o uso total de CPU (incluindo tarefas não-RT) a um núcleo de CPU. Mesmo com a cota de tempo real, o contêiner não poderá consumir mais de uma CPU no total.
- **`web-interface`:**
    - `cpu_shares: 512`: Define uma prioridade de CPU menor para a interface web em comparação com o padrão (1024). Em situações de contenção, o `audio-processor` e outros serviços com `cpu_shares` mais altos receberão mais tempo de CPU.
    - `cpus: 0.5`: Restringe a interface web a usar no máximo meio núcleo de CPU, evitando que ela monopolize os recursos e prejudique o serviço de áudio.

**Para Executar este Exemplo:**

1. **Imagens Docker:** Você precisaria criar as imagens `gedes-audio-engine:1.0` e `gedes-web-app:1.0` com suas respectivas aplicações. A imagem do `gedes-audio-engine` conteria o código C/C++ ou Python/Rust que usa chamadas de sistema para agendamento de tempo real, se aplicável.
2. **Construção e Execução:**
    
    ```bash
    docker compose build
    docker compose up -d
    
    ```
    
3. **Monitoramento:**
Para monitorar, você poderia usar:
No arquivo `cpu.stat`, você procuraria por `nr_throttled` (número de vezes que o contêiner foi estrangulado) e `throttled_time` (tempo total em microssegundos que o contêiner foi estrangulado). Se esses valores estiverem aumentando, pode indicar que o `cpu_rt_runtime` está muito baixo para a carga de trabalho de tempo real da sua aplicação, ou que a aplicação não está utilizando as chamadas de agendamento de tempo real corretamente.
    
    ```bash
    docker stats gedes-audio-processor
    # E para uma visão mais aprofundada do cgroup de CPU
    sudo cat /sys/fs/cgroup/cpu/docker/$(docker inspect -f '{{.Id}}' gedes-audio-processor)/cpu.stat
    
    ```
    

---

### Sugestões para Aprofundamento

Gedê, se quiser se aprofundar ainda mais, sugiro explorar os seguintes tópicos:

- **Agendamento de Tempo Real no Kernel Linux:** Pesquise sobre as políticas `SCHED_FIFO` e `SCHED_RR`, e como as aplicações usam `sched_setscheduler()` para solicitar agendamento de tempo real.
- **Cgroups Internos:** Estude a hierarquia de arquivos dos cgroups no diretório `/sys/fs/cgroup/` para entender como o Docker manipula esses arquivos para configurar recursos.
- **Kernel PREEMPT\_RT:** Investigue os patches PREEMPT\_RT para o kernel Linux, que transformam um kernel de uso geral em um kernel de *hard real-time*, essencial para aplicações com latência extremamente crítica.
- **Ferramentas de Monitoramento de Cgroups:** Explore ferramentas como `cgroup-tools` (em algumas distribuições Linux) ou scripts personalizados para monitorar o uso de recursos dos cgroups de forma mais detalhada.
- **Docker Desktop vs. Linux Host:** Lembre-se que se estiver rodando Docker Desktop (no Windows ou macOS), a camada de virtualização pode introduzir sua própria latência e tornar as garantias de tempo real menos eficazes do que em um host Linux bare-metal.

Com essa explicação detalhada, espero que você, Gedê, tenha uma compreensão sólida do `cpu_rt_period` e de como ele pode ser usado para otimizar suas aplicações em contêineres que exigem garantias de tempo real. Se tiver mais alguma dúvida, é só perguntar\!