# stop_grace_period

**Entendendo o atributo `stop_grace_period` no Docker Compose**

---

### Introdução

No Docker Compose, o atributo `stop_grace_period` define o tempo que o Compose deve aguardar após enviar o sinal de parada (por padrão, `SIGTERM`) antes de forçar o encerramento do contêiner com `SIGKILL`. Esse mecanismo é fundamental para garantir que aplicações tenham tempo suficiente para realizar limpeza de recursos (flush de buffers, fechamento de conexões, etc.) antes de serem abruptamente finalizadas ([okteto.com](https://www.okteto.com/docs/reference/docker-compose/?utm_source=chatgpt.com), [stackoverflow.com](https://stackoverflow.com/questions/50534605/speed-up-docker-compose-shutdown?utm_source=chatgpt.com)).

---

### Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#sintaxe-detalhada-e-uso-pr%C3%A1tico)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#sugest%C3%B5es-para-aprofundamento)

---

### Conceitos Fundamentais

- **Objetivo:** Permitir um encerramento **gracioso** de contêineres, dando à aplicação interna tempo para tratar sinais de término e liberar recursos corretamente, evitando corrupção de dados ou inconsistências no estado ([okteto.com](https://www.okteto.com/docs/reference/docker-compose/?utm_source=chatgpt.com)).
- **Comportamento padrão do Docker:** Ao chamar `docker stop` ou `docker-compose down`, o Docker envia primeiro `SIGTERM`. Caso o processo não termine dentro de 10 segundos (padrão), em seguida envia `SIGKILL` para forçar a parada ([docs.docker.com](https://docs.docker.com/reference/cli/docker/container/stop/?utm_source=chatgpt.com)).
- **Papel do `stop_grace_period`:** Substitui o timeout padrão de 10 segundos, aceitando valores no formato de duração (`Xs`, `XmYs`) ou inteiros (interpretados em segundos) ([okteto.com](https://www.okteto.com/docs/reference/docker-compose/?utm_source=chatgpt.com)).

---

### Sintaxe Detalhada e Uso Prático

```yaml
version: "3.8"
services:
  minha-api:
    image: exemplo/api:latest
    stop_signal: SIGTERM        # (opcional) sinal a enviar antes do kill
    stop_grace_period: 30s      # aguarda 30 segundos antes de SIGKILL

```

- **Tipo:** `duration` | `int` (inteiro sem unidade → segundos) ([okteto.com](https://www.okteto.com/docs/reference/docker-compose/?utm_source=chatgpt.com)).
- **Escopo:** Configurado por serviço, dentro da chave `services` no `docker-compose.yml` ([docs.docker.com](https://docs.docker.com/reference/compose-file/services/?utm_source=chatgpt.com)).
- **Tradução Kubernetes:** Em ambientes que convertem Compose para k8s, esse valor corresponde a `pod.spec.terminationGracePeriodSeconds` ([okteto.com](https://www.okteto.com/docs/reference/docker-compose/?utm_source=chatgpt.com)).

---

### Cenários de Restrição ou Não Aplicação

- **Compose em modo Swarm (`docker stack deploy`):** Há relatos de que `stop_grace_period` **não é respeitado** durante manutenções de nó no Swarm, continuando a usar o timeout padrão ([github.com](https://github.com/moby/moby/issues/36955?utm_source=chatgpt.com)).
- **Processos que não escutam sinais:** Se o contêiner não fecha `stdin` ou não estiver rodando com `stdin_open: true`, o processo pode **ignorar** o tempo de graça definido e terminar imediatamente após `SIGTERM` ([forums.docker.com](https://forums.docker.com/t/automatic-gracefull-docker-container-shutdown-on-system-restart-shutdown-system-os/140228?utm_source=chatgpt.com)).
- **Contêineres efêmeros:** Em tarefas *batch* ou aplicações que não requerem limpeza de estado, o atributo pode ser desnecessário e até retardar ciclos de shutdown/replicação.

---

### Componentes Chave Associados

- **`stop_signal`:** Define qual sinal POSIX será enviado antes do `SIGKILL` (ex.: `SIGINT`, `SIGQUIT`) – configurado no Compose ou via `STOPSIGNAL` no Dockerfile ([docs.docker.com](https://docs.docker.com/compose/support-and-feedback/faq/?utm_source=chatgpt.com), [docs.docker.com](https://docs.docker.com/reference/cli/docker/container/stop/?utm_source=chatgpt.com)).
- **Instrução `STOPSIGNAL` no Dockerfile:** Alternativa para ajustar o sinal preferencialmente tratado pelo processo interno, garantindo melhor integração com `stop_grace_period` ([docs.docker.com](https://docs.docker.com/reference/dockerfile/?utm_source=chatgpt.com)).
- **Hook `pre_stop`:** Disponível em algumas extensões de Compose, permite executar comandos de cleanup **antes** de iniciar o período de graça ([docs.docker.com](https://docs.docker.com/compose/how-tos/lifecycle/?utm_source=chatgpt.com)).
- **Flag CLI `-timeout` (`t`):** Ao usar `docker-compose stop -t N`, substitui temporariamente o `stop_grace_period` para aquela invocação ([alibabacloud.com](https://www.alibabacloud.com/blog/practical-exercises-for-docker-compose-part-2_594414?utm_source=chatgpt.com)).

---

### Melhores Práticas e Padrões de Uso

- **Sincronizar `stop_grace_period` com o tempo real de teardown** da sua aplicação (ex.: flushing de logs, sincronização em banco).
- **Implementar *handlers* de sinal** na aplicação (usando frameworks que capturem `SIGTERM`) ou usar *wrappers* como `tini`/`dumb-init` para repassar sinais corretamente ([docs.docker.com](https://docs.docker.com/compose/support-and-feedback/faq/?utm_source=chatgpt.com)).
- **Não exagerar no tempo de graça** (evitar valores extremos como horas), para não atrasar unnecessarily rollbacks ou deploys canary.
- **Testar regularmente** com `docker-compose up/down` e `docker-compose stop -t X` para validar se o comportamento está conforme esperado.

---

### Exemplo Prático Completo

```yaml
version: "3.8"
services:
  web:
    image: nginx:latest
    stop_signal: SIGQUIT           # Nginx usa SIGQUIT para shutdown gracioso
    stop_grace_period: 1m          # 1 minuto para concluir conexões
    pre_stop:
      - command: /usr/local/bin/cache_flush.sh  # limpezas antes do término
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      retries: 3

```

- **Fluxo de parada:**
    1. Pre-stop hook roda `cache_flush.sh` ([docs.docker.com](https://docs.docker.com/compose/how-tos/lifecycle/?utm_source=chatgpt.com)).
    2. Envia `SIGQUIT`, aguardando até 60 segundos para que o Nginx encerre conexões ativas.
    3. Caso o processo persista após 1 min, envia `SIGKILL`.

---

### Sugestões para Aprofundamento

- **Compose Specification:** Repositório oficial com schema completo e evolução de features: [https://github.com/compose-spec/compose-spec](https://github.com/compose-spec/compose-spec) ([github.com](https://github.com/compose-spec/compose-spec/blob/master/schema/compose-spec.json?utm_source=chatgpt.com))
- **Guia de *Lifecycle Hooks* no Compose:** [https://docs.docker.com/compose/how-tos/lifecycle/](https://docs.docker.com/compose/how-tos/lifecycle/) ([docs.docker.com](https://docs.docker.com/compose/how-tos/lifecycle/?utm_source=chatgpt.com))
- **Referência CLI e Dockerfile:**
    - `docker compose stop/down`: [https://docs.docker.com/compose/reference/stop/](https://docs.docker.com/compose/reference/stop/) ([docs.docker.com](https://docs.docker.com/reference/cli/docker/compose/stop/?utm_source=chatgpt.com))
    - `STOPSIGNAL` no Dockerfile: [https://docs.docker.com/engine/reference/builder/#stopsignal](https://docs.docker.com/engine/reference/builder/#stopsignal) ([docs.docker.com](https://docs.docker.com/reference/dockerfile/?utm_source=chatgpt.com))

---

Com essas informações, você terá um entendimento completo de como configurar e usar o `stop_grace_period` no Docker Compose, garantindo encerramentos mais seguros e previsíveis de seus serviços.