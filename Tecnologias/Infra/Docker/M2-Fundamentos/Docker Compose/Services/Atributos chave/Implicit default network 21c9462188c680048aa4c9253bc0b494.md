# Implicit default network

**Título da Explicação:** Rede Padrão Implícita do Docker Compose

## Introdução

O Docker Compose facilita a definição e execução de aplicações multicontêiner por meio de um arquivo YAML. Uma parte fundamental desse funcionamento é a forma como ele gerencia redes:

- **Rede padrão implícita:** quando não há nenhuma rede explicitamente declarada no `docker-compose.yml`, o Compose cria automaticamente uma rede chamada `default` para todo o projeto, garantindo que todos os contêineres possam se comunicar entre si sem configurações adicionais ([docs.docker.com](https://docs.docker.com/reference/compose-file/networks/)).
- **Alcance e descoberta de serviços:** cada contêiner de um serviço ingere automaticamente nessa rede padrão e pode ser descoberto por outros contêineres usando o nome do serviço como hostname ([docs.docker.com](https://docs.docker.com/compose/how-tos/networking/)).

## Sumário

1. Conceitos Fundamentais
2. Sintaxe Detalhada e Uso Prático
3. Cenários de Restrição ou Não Aplicação
4. Componentes Chave Associados
5. Melhores Práticas e Padrões de Uso
6. Exemplo Prático Completo
7. Sugestões para Aprofundamento

## 1. Conceitos Fundamentais

- **Rede implícita `default`:** por padrão, se o bloco `networks` não existir ou não contiver nenhuma rede, o Compose assume uma rede chamada `default` e conecta todos os serviços a ela ([docs.docker.com](https://docs.docker.com/reference/compose-file/networks/)).
- **Nome da rede baseada no projeto:** o nome real criado no Docker é `<nome_do_diretório>_default`, onde `<nome_do_diretório>` pode ser sobrescrito pelas flags `-project-name` ou pela variável `COMPOSE_PROJECT_NAME` ([docs.docker.com](https://docs.docker.com/compose/how-tos/networking/)).
- **Driver padrão:** essa rede utiliza o driver `bridge`, o qual isola os contêineres em uma sub-rede privada, mas permite comunicação interna sem expor portas ao host ([docs.docker.com](https://docs.docker.com/reference/compose-file/networks/)).

## 2. Sintaxe Detalhada e Uso Prático

### 2.1 Exemplo sem declaração de redes

```yaml
version: '3.8'
services:
  app:
    image: minha-app
  db:
    image: postgres

```

Esse arquivo é **equivalente** a:

```yaml
version: '3.8'
services:
  app:
    image: minha-app
    networks:
      default: {}
  db:
    image: postgres
    networks:
      default: {}
networks:
  default: {}

```

([docs.docker.com](https://docs.docker.com/reference/compose-file/networks/))

### 2.2 Customizando a rede padrão

Para ajustar opções da rede implícita, basta declará-la no nível superior:

```yaml
networks:
  default:
    name: rede_personalizada
    driver_opts:
      com.docker.network.bridge.host_binding_ipv4: "127.0.0.1"

```

Agora a rede usada passará a ser `rede_personalizada` em vez de `<projeto>_default` ([docs.docker.com](https://docs.docker.com/reference/compose-file/networks/)).

## 3. Cenários de Restrição ou Não Aplicação

- **`network_mode`:** ao definir `network_mode: host` ou `network_mode: none` em um serviço, o Compose não permite a combinação com a chave `networks`, interrompendo o uso da rede padrão implícita para esse serviço ([stackoverflow.com](https://stackoverflow.com/questions/71637192/docker-compose-up-error-network-mode-and-networks-cannot-be-combined?utm_source=chatgpt.com)).
- **Necessidade de isolamento ou múltiplas redes:** se o projeto exige ligação a várias redes (por exemplo, uma rede interna e outra externa), o uso da rede implícita pode não ser suficiente; recomenda-se declarar explicitamente cada rede desejada.
- **Configurações avançadas de IPAM ou drivers personalizados:** para controlar sub-redes, gateways ou drivers não-bridge, deve-se usar redes nomeadas e configurar `ipam`, `driver` e `driver_opts` de forma explícita ([docs.docker.com](https://docs.docker.com/reference/compose-file/networks/)).

## 4. Componentes Chave Associados

- **`networks` (serviço):** lista de redes que um serviço deverá acessar; cada nome deve referenciar uma entrada em `networks` no nível superior ([docs.docker.com](https://docs.docker.com/reference/compose-file/networks/)).
- **`driver`:** define o driver de rede (`bridge`, `overlay`, etc.). Se omitido, o default `bridge` é usado.
- **`driver_opts`:** opções específicas do driver, como configurações de host binding.
- **`external`:** quando `true`, sinaliza que a rede já existe fora do ciclo de vida do Compose — o Compose não tentará criá-la.
- **`ipam`:** configurações de gerenciamento de IP (subnet, range, gateway, endereços auxiliares).
- **`internal`:** isola a rede, impedindo acesso externo a ela.

## 5. Melhores Práticas e Padrões de Uso

- **Declare redes explicitamente** em ambientes de produção para garantir previsibilidade e facilitar manutenção.
- **Não confie exclusivamente na rede implícita** em cenários que exigem restrições de segurança, múltiplas sub-redes ou configurações de gateway customizadas.
- **Use `COMPOSE_PROJECT_NAME`** para padronizar nomes de rede entre diferentes ambientes (desenvolvimento, teste, produção).
- **Versione o esquema** (por exemplo, `'3.8'`) para garantir compatibilidade de recursos de rede desejados.

## 6. Exemplo Prático Completo

```yaml
version: '3.8'

services:
  web:
    build: ./web
    ports:
      - "8080:80"
    networks:
      - front-tier
      - default

  api:
    image: minha-api
    networks:
      - back-tier
      - default

  db:
    image: postgres
    networks:
      - back-tier

networks:
  front-tier:
    driver: bridge
  back-tier:
    driver: bridge
  default:
    name: app_default_personalizado
    driver_opts:
      com.docker.network.bridge.enable_icc: "true"

```

Neste cenário:

- `web` comunica-se tanto com `default` quanto com `front-tier`.
- `api` fala com `default` e `back-tier`.
- `db` só está em `back-tier`.
- A rede padrão foi renomeada para `app_default_personalizado` e ativou comunicação interna entre contêineres ([docs.docker.com](https://docs.docker.com/reference/compose-file/networks/)).

## 7. Sugestões para Aprofundamento

- [Networking in Compose (Guia de como-tos)](https://docs.docker.com/compose/how-tos/networking/) ([docs.docker.com](https://docs.docker.com/compose/how-tos/networking/))
- [Referência Compose file – Service-level `networks` attribute](https://docs.docker.com/compose/compose-file/compose-file-v3/#networks)
- [Referência Compose file – Networks top-level elements](https://docs.docker.com/compose/compose-file/compose-file-v3/#networks-1)