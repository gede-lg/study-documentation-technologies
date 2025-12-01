# endpoint_mode

## Entendendo o Atributo `endpoint_mode` na Chave `deploy` do Docker Compose/Docker

### Introdução

Ao trabalhar com Docker Compose e, principalmente, com o Docker Swarm para orquestração de contêineres, o atributo `endpoint_mode` na chave `deploy` desempenha um papel crucial na forma como os serviços são expostos e descobertos por clientes externos. Ele define a estratégia de roteamento de rede e balanceamento de carga para as tarefas de um serviço, impactando diretamente a conectividade e a resiliência de suas aplicações distribuídas.

### Sumário

Esta explicação detalhada abordará os seguintes tópicos para fornecer uma compreensão completa do `endpoint_mode`:

- **Conceitos Fundamentais:** Propósito e importância do `endpoint_mode` no contexto de serviços Docker.
- **Sintaxe Detalhada e Uso Prático:** Explanação dos dois modos principais (`vip` e `dnsrr`) com exemplos de código e cenários de uso.
- **Cenários de Restrição ou Não Aplicação:** Situações em que um modo pode ser preferível ou inadequado.
- **Componentes Chave Associados:** Relação com o `routing mesh` e DNS interno do Docker.
- **Melhores Práticas e Padrões de Uso:** Recomendações para a escolha e implementação do `endpoint_mode`.
- **Exemplo Prático Completo:** Um exemplo simplificado para ilustrar o uso em um `docker-compose.yml`.

### Conceitos Fundamentais

O atributo `endpoint_mode` é uma configuração sob a chave `deploy` em um arquivo Docker Compose, que é utilizada especificamente quando você está implantando serviços em um cluster Docker Swarm (usando `docker stack deploy`). Ele controla como os pontos de extremidade (endpoints) de um serviço são expostos e como o tráfego é direcionado a eles.

A importância do `endpoint_mode` reside em sua capacidade de influenciar:

1. **Descoberta de Serviço:** Como os clientes (outros serviços dentro do Swarm ou aplicações externas) encontram e se conectam às instâncias de um serviço.
2. **Balanceamento de Carga:** A estratégia utilizada para distribuir as requisições entre as múltiplas tarefas (réplicas) de um serviço.
3. **Resiliência:** Como o sistema lida com falhas de tarefas ou nós, garantindo a continuidade do serviço.

### Sintaxe Detalhada e Uso Prático

O `endpoint_mode` possui dois valores canônicos: `vip` (Virtual IP) e `dnsrr` (DNS Round-Robin).

### 1\. `endpoint_mode: vip` (Virtual IP) - Padrão

- **Conceito:** Este é o modo padrão. Quando `vip` é configurado, o Docker Swarm atribui um IP virtual (VIP) ao serviço. Esse VIP atua como um frontend para os clientes. O nome do serviço é registrado no DNS interno do Swarm para resolver para este VIP. Quando um cliente se conecta ao VIP, o `routing mesh` do Docker (também conhecido como "ingress network") encaminha as requisições para uma das tarefas ativas do serviço de forma transparente. O `routing mesh` é um componente de balanceamento de carga de camada 4 (TCP/UDP) que opera em todos os nós do Swarm.
- **Sintaxe:**
    
    ```yaml
    version: '3.9'
    services:
      meu_servico:
        image: minha_imagem:latest
        ports:
          - "80:80" # Exemplo: Publica a porta 80 do contêiner na porta 80 do host
        deploy:
          mode: replicated
          replicas: 3
          endpoint_mode: vip # Explicitamente definido (é o padrão)
        networks:
          - minha_rede
    
    networks:
      minha_rede:
        external: true # ou driver: overlay
    
    ```
    
- **Uso Prático:**
    - Ideal para a maioria dos casos de uso, onde você deseja que o Swarm lide com o balanceamento de carga de forma transparente.
    - Simplifica a configuração do cliente, pois ele sempre se conecta a um único VIP, independentemente do número de réplicas ou de onde elas estão sendo executadas.
    - Fornece um balanceamento de carga integrado, distribuindo conexões em um modelo round-robin para as tarefas do serviço.
    - **Importante:** Conexões de longa duração podem ser encerradas após 900 segundos (15 minutos) devido ao `routing mesh` (`ingress`) padrão do Docker Swarm.

### 2\. `endpoint_mode: dnsrr` (DNS Round-Robin)

- **Conceito:** Neste modo, em vez de um VIP, o Docker Swarm cria entradas DNS para o nome do serviço que retornam uma lista de endereços IP de todas as tarefas ativas do serviço. O cliente, ao resolver o nome do serviço, recebe essa lista de IPs e é responsável por escolher para qual IP se conectar. O balanceamento de carga é então realizado pelo cliente ou por um balanceador de carga externo que consome essa lista de IPs.
- **Sintaxe:**
    
    ```yaml
    version: '3.9'
    services:
      meu_servico_dnsrr:
        image: minha_imagem:latest
        # Note: 'ports' com 'mode: ingress' (padrão) não é compatível com dnsrr.
        # Para expor portas, é comum usar 'mode: host' ou um balanceador de carga externo.
        ports:
          - target: 80
            published: 8080
            protocol: tcp
            mode: host # Necessário para compatibilidade com dnsrr se quiser expor portas diretamente
        deploy:
          mode: replicated
          replicas: 3
          endpoint_mode: dnsrr
        networks:
          - minha_rede
    
    networks:
      minha_rede:
        external: true # ou driver: overlay
    
    ```
    
- **Uso Prático:**
    - Recomendado para aplicações que exigem conexões de longa duração (ex: bancos de dados, filas de mensagens) ou que precisam de controle mais granular sobre o balanceamento de carga.
    - O cliente ou um balanceador de carga externo obtém a lista de IPs e pode implementar algoritmos de balanceamento mais sofisticados (ex: afinidade de sessão, least connections).
    - Não utiliza o `routing mesh` para o serviço, o que significa que as conexões podem não ser automaticamente roteadas para um nó diferente se a tarefa no nó conectado falhar.
    - **Restrição Importante:** Você não pode usar `endpoint_mode: dnsrr` juntamente com a publicação de portas no modo `ingress` (que é o padrão para `ports:` sem `mode`). Se precisar expor portas, você deve usar `mode: host` para as portas ou ter um balanceador de carga externo que se conecte diretamente aos IPs retornados pelo DNS.

### Cenários de Restrição ou Não Aplicação

- **`endpoint_mode: vip`:**
    - **Restrição:** Pode não ser ideal para serviços que mantêm conexões de longa duração e são sensíveis a timeouts de inatividade do `routing mesh` (900 segundos).
    - **Não Aplicação:** Não é necessário ou aplicável se o serviço não for acessado por clientes externos ou se o balanceamento de carga for tratado por outra camada (ex: um proxy reverso customizado).
- **`endpoint_mode: dnsrr`:**
    - **Restrição:** Requer que o cliente (ou um balanceador de carga externo) seja capaz de resolver múltiplas entradas DNS e escolher uma para se conectar. Clientes que cacheiam resultados DNS podem se conectar persistentemente a uma única instância.
    - **Restrição de Portas:** Conforme mencionado, não pode ser usado com `ports` no modo `ingress`. Se você precisa publicar portas para acesso externo, a opção `mode: host` nas portas (`ports: - target: 80 published: 80 mode: host`) é uma alternativa, mas exige que a porta esteja livre em todos os hosts onde as tarefas podem ser executadas.
    - **Complexidade Adicional:** Introduce a necessidade de gerenciamento de balanceamento de carga no lado do cliente ou com uma ferramenta externa, adicionando complexidade à arquitetura.

### Componentes Chave Associados

- **Docker Swarm:** O `endpoint_mode` é uma funcionalidade intrínseca ao Docker Swarm, que é o orquestrador de contêineres embutido no Docker Engine. Ele não tem efeito quando você usa apenas `docker-compose up` sem um Swarm ativo.
- **`Routing Mesh` (Ingress Network):** Este é o principal componente de rede do Swarm que opera com `endpoint_mode: vip`. Ele cria um serviço de balanceamento de carga distribuído em todos os nós do Swarm, encaminhando o tráfego para as tarefas ativas do serviço, mesmo que a requisição chegue a um nó que não está executando uma réplica do serviço.
- **DNS Interno do Docker:** Tanto para `vip` quanto para `dnsrr`, o sistema DNS interno do Docker no Swarm é fundamental. Ele é responsável por registrar os nomes de serviço e resolver para o VIP ou para a lista de IPs das tarefas.
- **Tarefas (Tasks):** São as instâncias individuais de um serviço que são executadas em nós do Swarm. O `endpoint_mode` define como o tráfego chega a essas tarefas.

### Melhores Práticas e Padrões de Uso

1. **Padrão `vip` para a Maioria dos Casos:** Para a maioria dos serviços web, APIs e microserviços, o `endpoint_mode: vip` é a escolha mais simples e eficaz. Ele lida automaticamente com o balanceamento de carga e a descoberta de serviço, simplificando a arquitetura.
2. **`dnsrr` para Casos Específicos:** Use `dnsrr` para:
    - Serviços com **conexões de longa duração** (ex: bancos de dados, caches como Redis, sistemas de mensageria) onde a terminação de conexão do `routing mesh` (`vip`) pode ser problemática.
    - Quando você tem um **balanceador de carga externo** (ex: Nginx, HAProxy) que precisa se conectar diretamente às instâncias do serviço e pode aproveitar a lista de IPs fornecida pelo DNS.
    - Aplicações que implementam **balanceamento de carga no cliente** e precisam da lista de IPs das instâncias.
3. **Monitoramento:** Independentemente do modo escolhido, monitore o desempenho e a conectividade de seus serviços para garantir que o `endpoint_mode` esteja atendendo às suas necessidades.
4. **Considerar `mode: host` para Portas com `dnsrr`:** Se você usar `dnsrr` e precisar expor portas para acesso externo, lembre-se de definir `mode: host` nas configurações de `ports` para cada porta, pois o modo `ingress` é incompatível.
5. **Entendimento do Cliente:** Certifique-se de que o cliente que tenta se conectar ao serviço entende a implicação do `endpoint_mode` escolhido. Um cliente que espera um único VIP pode ter problemas com `dnsrr` se não for projetado para lidar com múltiplas entradas DNS.

### Exemplo Prático Completo

Considere uma aplicação simples com um frontend web e um backend de API. O frontend se conectará ao backend.

```yaml
# docker-compose.yml
version: '3.9'

services:
  frontend:
    image: meu_frontend:latest
    ports:
      - "80:80" # Acessível via VIP padrão do routing mesh
    deploy:
      mode: replicated
      replicas: 2
      endpoint_mode: vip # Opcional, pois é o padrão
    networks:
      - app_network

  backend_api:
    image: meu_backend_api:latest
    deploy:
      mode: replicated
      replicas: 3
      endpoint_mode: vip # Usando VIP para balanceamento de carga transparente
    environment:
      # O frontend se conecta ao backend usando o nome do serviço,
      # que resolve para o VIP do serviço backend_api
      BACKEND_URL: http://backend_api
    networks:
      - app_network

  database:
    image: postgres:13
    ports:
      - target: 5432
        published: 5432 # Publica a porta para acesso direto, se necessário
        protocol: tcp
        mode: host # Importante para dnsrr se precisar de acesso externo direto
    deploy:
      mode: replicated
      replicas: 1 # Um único pod de DB para simplificação, mas poderia ser mais
      endpoint_mode: dnsrr # Ideal para conexões de longa duração de DB
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    networks:
      - app_network

networks:
  app_network:
    driver: overlay # Necessário para Docker Swarm

```

**Explicação do Exemplo:**

- **`frontend` e `backend_api`:** Ambos os serviços utilizam `endpoint_mode: vip` (explicitamente para `frontend` e implicitamente para `backend_api`). Isso significa que quando o `frontend` tenta se conectar a `http://backend_api`, ele usa o VIP do serviço `backend_api`, e o Docker Swarm roteia o tráfego para uma das três réplicas do `backend_api` usando o `routing mesh`.
- **`database`:** O serviço `database` utiliza `endpoint_mode: dnsrr`. Isso é benéfico para conexões de banco de dados de longa duração, pois evita o timeout do `routing mesh`. Se o `backend_api` precisar se conectar ao banco de dados, ele resolverá `database` para o IP direto da instância do PostgreSQL.
- **Publicação de Portas:**
    - Para o `frontend`, a porta 80 é publicada no modo `ingress` (padrão), o que significa que o `routing mesh` lida com o acesso externo ao serviço em qualquer nó do Swarm.
    - Para o `database`, a porta 5432 é publicada com `mode: host`. Isso é necessário para `dnsrr` se você quiser que clientes externos (ou até mesmo clientes dentro do Swarm, se eles não usarem o nome do serviço para resolução) se conectem diretamente a um nó específico onde a tarefa do banco de dados está rodando.

### Sugestões para Aprofundamento

Para aprofundar seu conhecimento sobre o `endpoint_mode` e o ecossistema Docker Swarm, sugiro explorar os seguintes recursos:

- **Documentação Oficial do Docker:**
    - [Docker Compose Deploy Specification](https://docs.docker.com/reference/compose-file/deploy/)
    - [Use Swarm mode routing mesh](https://docs.docker.com/engine/swarm/ingress/)
- **Artigos e Tutoriais sobre Docker Swarm Networking:** Muitos blogs e tutoriais abordam a arquitetura de rede do Docker Swarm em detalhes, incluindo o funcionamento do `routing mesh` e as diferenças entre `vip` e `dnsrr`.
- **Prática com `docker stack deploy`:** A melhor maneira de entender o `endpoint_mode` é implantar serviços com diferentes configurações em um ambiente Docker Swarm e observar o comportamento da rede e do balanceamento de carga.

Espero que esta explicação detalhada, A.R.I.A, seja útil para você, Gedê\!