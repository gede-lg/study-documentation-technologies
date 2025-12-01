# network_mode

**Título da Explicação:** Atributo `network_mode` no Docker Compose: configuração e uso

## Introdução

O atributo `network_mode` do Docker Compose permite controlar o modo de rede dos contêineres de um serviço, definindo se eles usarão a rede padrão criada pelo Compose, a rede do host ou até mesmo a rede de outro contêiner ou serviço. Essa configuração é fundamental para cenários em que você precisa de máxima performance de rede, isolamento completo ou compartilhamento de interfaces entre múltiplos contêineres ([docs.docker.com](https://docs.docker.com/engine/network/?utm_source=chatgpt.com)) ([docs.docker.com](https://docs.docker.com/reference/compose-file/services/)).

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#sintaxe-detalhada-e-uso-pr%C3%A1tico)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **Namespaces de Rede:** Cada contêiner Docker roda em seu próprio *network namespace*, isolando interfaces e tabelas de roteamento. A opção `network_mode` altera esse namespace, permitindo compartilhar com o host ou outro contêiner ([docs.docker.com](https://docs.docker.com/engine/network/?utm_source=chatgpt.com)).
- **Modos Disponíveis:**
    - `bridge` (padrão): contêiner em rede isolada criada pelo Compose.
    - `host`: contêiner compartilha diretamente a pilha de rede do host, sem isolamento ([docs.docker.com](https://docs.docker.com/reference/compose-file/services/)).
    - `none`: sem conectividade de rede.
    - `service:<nome>`: ingressa no namespace de rede de outro serviço.
    - `container:<id|nome>`: ingressa no namespace de rede de contêiner existente ([docs.docker.com](https://docs.docker.com/reference/compose-file/services/)).

---

## Sintaxe Detalhada e Uso Prático

```yaml
version: "3.8"
services:
  web:
    image: nginx:latest
    network_mode: "host"       # Usa a rede do host
  cache:
    image: redis:alpine
    network_mode: "service:web" # Compartilha a rede do serviço "web"
  aux:
    image: busybox
    network_mode: "none"        # Sem rede

```

- **Efeito:**
    - Ao usar `host`, não faz sentido mapear portas em `ports`, pois o contêiner já expõe suas portas diretamente na interface do host ([docs.docker.com](https://docs.docker.com/reference/compose-file/services/)).
    - Se `network_mode` estiver definido, o atributo `networks` **não** pode ser usado em conjunto; o Compose rejeita o arquivo se ambos estiverem presentes ([docs.docker.com](https://docs.docker.com/reference/compose-file/services/)).

---

## Cenários de Restrição ou Não Aplicação

- **Suporte de Plataforma:**
    - `network_mode: host` só funciona em hosts Linux; em Docker Desktop para Mac ou Windows, esse modo não é suportado ([stackoverflow.com](https://stackoverflow.com/questions/56582446/how-to-use-host-network-for-docker-compose)).
- **Docker Swarm:**
    - Em modo Swarm (`docker stack deploy`), `network_mode` não é suportado da mesma forma; recomenda-se usar redes definidas no top-level `networks` para orquestração ([stackoverflow.com](https://stackoverflow.com/questions/56582446/how-to-use-host-network-for-docker-compose)).
- **Casos de Performance vs. Segurança:**
    - `host` oferece performance máxima, mas elimina isolamento, aumentando o risco de interferência entre serviços ([docs.docker.com](https://docs.docker.com/reference/compose-file/services/)).

---

## Componentes Chave Associados

- **`networks` (top-level):** Define redes customizadas para segmentar serviços quando **não** se utiliza `network_mode` ([docs.docker.com](https://docs.docker.com/reference/compose-file/services/)).
- **Aliases e IPs Estáticos:** Com `networks`, você pode atribuir `aliases`, `ipv4_address` e `ipv6_address` para containers; não aplicável a `network_mode` ([docs.docker.com](https://docs.docker.com/reference/compose-file/services/)).
- **Interação com `ports`:** Em modos como `bridge` ou redes customizadas, `ports` mapeia portas do host. Em `host`, mapeamento é ignorado ([docs.docker.com](https://docs.docker.com/reference/compose-file/services/)).

---

## Melhores Práticas e Padrões de Uso

- **Evitar `host` quando possível:** Use `bridge` ou redes customizadas para manter isolamento e segurança, a menos que precise de latência mínima ou acesso direto a interfaces ([docs.docker.com](https://docs.docker.com/reference/compose-file/services/)).
- **Compartilhamento entre serviços:** Para debug ou comunicação direta, `service:<nome>` é útil para unir contêineres sem expor portas externamente ([docs.docker.com](https://docs.docker.com/reference/compose-file/services/)).
- **Manter clareza no Compose:** Nunca combine `network_mode` e `networks`; isso evita erros de rejeição do arquivo ([docs.docker.com](https://docs.docker.com/reference/compose-file/services/)).

---

## Exemplo Prático Completo

Imagine uma aplicação com três serviços:

- **app**: servidor web que conversa diretamente com o host (ex.: API local).
- **worker**: processo em background que precisa se comunicar com o app por sockets.
- **db**: banco de dados isolado em rede customizada.

```yaml
version: "3.8"

services:
  app:
    image: my-app:latest
    network_mode: "host"

  worker:
    image: my-worker:latest
    network_mode: "service:app"

  db:
    image: postgres:13
    networks:
      - back_net
    environment:
      POSTGRES_DB: exemplo

networks:
  back_net:
    driver: bridge

```

- **Resultado:**
    - `app` expõe suas portas e acessa recursos de rede locais sem mapeamentos extras.
    - `worker` usa diretamente a rede do `app`, permitindo comunicação via `localhost`.
    - `db` fica isolado em `back_net`, acessível apenas a serviços que o referenciem.

---

## Sugestões para Aprofundamento

- **Documentação Docker Engine (Redes):** consulte o guia oficial sobre modos de rede de contêineres no Docker Engine ([docs.docker.com](https://docs.docker.com/reference/compose-file/services/)).
- **Compose Builds e Deploys:** explore as seções de [Compose Build Specification](https://docs.docker.com/compose/compose-file#build) e [Compose Deploy Specification](https://docs.docker.com/compose/compose-file#deploy) para entender limites de recursos e orquestração.
- **Artigos Sobre Redes Avançadas:** procure artigos que abordem `macvlan`, `ipvlan` e redes overlay no Swarm para cenários de multihost.

---

Com essa explicação, você tem um panorama completo sobre quando e como usar o atributo `network_mode` no Docker Compose, suas opções, restrições e padrões de uso recomendados.