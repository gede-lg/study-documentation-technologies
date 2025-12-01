# mem_reservation

**Configuração do Atributo `mem_reservation` em Docker Compose**

---

## Introdução

O atributo `mem_reservation` define um **soft limit** (reserva) de memória para contêineres, garantindo que o Docker tente manter pelo menos essa quantidade de RAM disponível para o serviço, mas permitindo picos além dela caso haja recursos livres no host ([docs.docker.com](https://docs.docker.com/engine/containers/resource_constraints/)).

---

## Sumário

1. Conceitos Fundamentais
2. Sintaxe Detalhada e Uso Prático
    - 2.1 Versão 2.x: `mem_reservation`
    - 2.2 Versão 3.x: `deploy.resources.reservations.memory`
3. Cenários de Restrição ou Não Aplicação
4. Componentes Chave Associados
5. Melhores Práticas e Padrões de Uso
6. Exemplo Prático Completo
7. Sugestões para Aprofundamento

---

## 1. Conceitos Fundamentais

- **Soft Limit (Res–erva de Memória):** valor no qual o kernel prioriza a liberação de memória desse contêiner em situações de contenção ou baixa memória no host. Não impede que o contêiner ultrapasse esse valor, mas sinaliza ao sistema que, sob estresse, ele deve ser um dos primeiros a liberar RAM ([docs.docker.com](https://docs.docker.com/engine/containers/resource_constraints/)).
- **Hard Limit vs Soft Limit:**
    - *Hard Limit* (`mem_limit`): teto rígido, provoca OOM kill se ultrapassado.
    - *Soft Limit* (`mem_reservation`): reserva mínima garantida, mas sem bloqueio de uso adicional quando sobra memória ([docs.docker.com](https://docs.docker.com/engine/containers/resource_constraints/)).

---

## 2. Sintaxe Detalhada e Uso Prático

### 2.1 Versão 2.x: `mem_reservation`

Em Compose `version: '2.x'`, declare diretamente no serviço:

```yaml
version: '2.4'

services:
  app:
    image: my-app:latest
    mem_reservation: 100m   # Soft limit de 100 MiB
    mem_limit:      200m    # Hard limit de 200 MiB (opcional)

```

- **Equivalência Interna:** mapeia para `docker run --memory-reservation 100m ...` ([docs.docker.com](https://docs.docker.com/reference/cli/docker/container/run/?utm_source=chatgpt.com), [docs.docker.com](https://docs.docker.com/compose/releases/release-notes/?utm_source=chatgpt.com)).
- **Unidades Aceitas:** `b`, `k`, `m`, `g` (case-insensitive).
- **Validação:** `mem_reservation` deve ser menor que `mem_limit` para ter efeito ([docs.docker.com](https://docs.docker.com/engine/containers/resource_constraints/)).

### 2.2 Versão 3.x: `deploy.resources.reservations.memory`

Em Compose `version: '3.x'` (modo Swarm):

```yaml
version: '3.8'

services:
  app:
    image: my-app:latest
    deploy:
      resources:
        reservations:
          memory: 100M   # Soft limit de 100 MiB
        limits:
          memory: 200M   # Hard limit de 200 MiB

```

- **Modo Swarm Obrigatório:** fora do Swarm, bloco `deploy` é ignorado ([docs.docker.com](https://docs.docker.com/reference/compose-file/deploy/)).
- **Hard vs Soft em Swarm:**
    - `limits.memory`: teto rígido.
    - `reservations.memory`: reserva mínima garantida ([docs.docker.com](https://docs.docker.com/reference/compose-file/deploy/)).

---

## 3. Cenários de Restrição ou Não Aplicação

- **Sem `mem_limit`:** `mem_reservation` não impõe teto, só reserva.
- **Compose v3 sem Swarm:** `deploy.resources.reservations` é ignorado.
- **Kernel sem suporte a cgroup-memory/swap:** reservas podem não ser aplicadas, dependendo da configuração do Linux ([docs.docker.com](https://docs.docker.com/engine/containers/resource_constraints/)).

---

## 4. Componentes Chave Associados

- **`mem_limit` / `-memory`:** hard limit de memória.
- **`memswap_limit`:** total de RAM + swap permitido.
- **`mem_swappiness`:** afinidade de swap do contêiner.
- **`deploy.resources.limits.memory`:** hard limit em Swarm.
- **`docker stats`:** monitora uso versus limites e reservas em tempo real.

---

## 5. Melhores Práticas e Padrões de Uso

- **Combinar Hard e Soft:** defina sempre `mem_limit` e `mem_reservation` para equilíbrio entre performance e estabilidade.
- **Monitoramento Contínuo:** valide as reservas e limites com `docker stats` e ajuste conforme padrão de consumo.
- **Testes em Staging:** faça testes de carga para calibrar valores seguros de reserva.
- **Não Reservar Demais:** evite reservar memória além do uso médio; geralmente 50–70% do consumo previsto é suficiente.

---

## 6. Exemplo Prático Completo

**Compose v2.4** para Nginx e Redis:

```yaml
version: '2.4'

services:
  nginx:
    image: nginx:alpine
    mem_reservation: 150m   # Reserva suave de 150 MiB
    mem_limit:       300m   # Hard limit de 300 MiB
    ports:
      - "8080:80"

  redis:
    image: redis:6
    mem_reservation: 100m   # Reserva suave de 100 MiB
    mem_limit:       200m   # Hard limit de 200 MiB

```

- Garante reserva mínima sem bloquear picos caso haja RAM disponível.

---

## 7. Sugestões para Aprofundamento

- **Flags do `docker run`:** estude `-memory-reservation`, `-memory`, `-memory-swap` em
    
    [https://docs.docker.com/engine/containers/resource_constraints/](https://docs.docker.com/engine/containers/resource_constraints/) ([docs.docker.com](https://docs.docker.com/engine/containers/resource_constraints/))
    
- **Compose Deploy Spec:** leia `deploy.resources` em
    
    [https://docs.docker.com/reference/compose-file/deploy/](https://docs.docker.com/reference/compose-file/deploy/) ([docs.docker.com](https://docs.docker.com/reference/compose-file/deploy/))
    
- **Compose Spec no GitHub:** compare versões e recursos em
    
    [https://github.com/compose-spec/compose-spec](https://github.com/compose-spec/compose-spec)
    

---

Com isso, você dispõe de uma visão completa sobre o atributo `mem_reservation` no Docker Compose, desde conceitos até exemplos práticos e boas práticas de uso.