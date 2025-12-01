# Consumidores em Kafka

Apache Kafka é uma plataforma de streaming distribuído que é utilizada para construir aplicações de streaming de dados em tempo real. Ele permite que dados sejam transmitidos entre sistemas de forma eficiente e em grande escala. Nesse contexto, os **consumidores** são componentes essenciais do ecossistema Kafka.

## O que são consumidores e para que servem?

Um **consumidor Kafka** é uma aplicação que lê mensagens de um ou mais tópicos do Kafka. Os consumidores são responsáveis por receber dados de tópicos específicos aos quais estão inscritos. Eles podem ler dados em qualquer ponto do tópico, o que permite um grande grau de flexibilidade no processamento de fluxos de dados.

Os consumidores são geralmente usados em cenários como:

- Processamento de dados em tempo real;
- Migração de dados entre sistemas;
- Monitoramento e alerta baseados em fluxos de eventos;
- Análise em tempo real e processamento de eventos.

## Propriedades dos Consumidores Kafka

As propriedades de configuração dos consumidores Kafka definem seu comportamento dentro do cluster. Aqui está uma lista de todas as principais propriedades dos consumidores e suas finalidades:

### Propriedades Básicas

- `bootstrap.servers`: Lista de hosts e portas dos brokers do Kafka. Exemplo: `kafka1:9092,kafka2:9092`.
- `group.id`: Identificador do grupo de consumidores ao qual este consumidor pertence. É essencial para o Kafka gerenciar o progresso de leitura.
- `key.deserializer`: Classe para deserializar a chave de uma mensagem. Exemplo: `org.apache.kafka.common.serialization.StringDeserializer`.
- `value.deserializer`: Classe para deserializar o valor de uma mensagem. Exemplo: `org.apache.kafka.common.serialization.StringDeserializer`.

### Propriedades de Performance

- `fetch.min.bytes`: Define o tamanho mínimo de dados que o servidor deve retornar para uma requisição de fetch. Isso ajuda a reduzir o número de requisições, mas pode aumentar a latência.
- `fetch.max.wait.ms`: Máximo de tempo que o servidor aguardará para que o `fetch.min.bytes` seja alcançado antes de enviar uma resposta.
- `max.partition.fetch.bytes`: O tamanho máximo de bytes que o servidor retorna por partição. Se uma mensagem for maior que esse limite, ela não será enviada até que o limite seja aumentado.

### Propriedades de Confiabilidade

- `enable.auto.commit`: Se `true`, o consumidor enviará periodicamente offsets para serem commitados no Kafka.
- `auto.commit.interval.ms`: A frequência, em milissegundos, com que o consumidor comitará offsets se `enable.auto.commit` for `true`.
- `auto.offset.reset`: Política para resetar offsets caso eles não estejam mais disponíveis no servidor. Valores comuns são `earliest` e `latest`.

### Propriedades Avançadas

- `client.id`: Identificador arbitrário para rastrear a fonte de solicitações.
- `max.poll.records`: O número máximo de registros que um consumidor pode buscar em uma única chamada ao `poll()`.

## Considerações Finais

Ao desenvolver aplicações que utilizam consumidores Kafka, é importante considerar aspectos como escalabilidade,

 balanceamento de carga entre consumidores no mesmo grupo, e o gerenciamento de estados. Cada uma dessas propriedades permite ajustes finos que podem ser cruciais dependendo do cenário de aplicação.

Espero que esta explicação tenha fornecido uma visão clara e detalhada sobre os consumidores Kafka, suas configurações e seu papel dentro de um ecossistema de streaming de dados.