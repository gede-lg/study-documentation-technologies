# Consumidores em Kafka

O Apache Kafka é uma plataforma de streaming distribuído que permite a leitura, escrita e processamento de streams de registros em tempo real. Um dos componentes principais do Kafka é o consumidor, que lê dados de um ou mais tópicos no cluster Kafka. Vamos explorar como configurar e usar consumidores Kafka tanto via linha de comando quanto por meio de uma classe Java.
## Opções de comandos

Aqui está a tabela com todas as opções de comando para consumidores Kafka, junto com suas descrições em português e quando devem ser utilizadas:

| Opção                     | Descrição                                                                                                                                                                   | Quando Utilizar                                                                                  |             |                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------- | ----------------------------------------------------------------------- |
| `--bootstrap-server`      | SERVIDOR_REQUERIDO: O(s) servidor(es) ao qual conectar.                                                                                                                     | **Sempre necessário.** Indica os servidores Kafka aos quais o consumidor se conectará.           |             |                                                                         |
| `--consumer-property`     | Propriedades definidas pelo usuário para passar ao consumidor no formato chave=valor.                                                                                       | Quando é necessário passar propriedades personalizadas para o consumidor.                        |             |                                                                         |
| `--consumer.config`       | Arquivo de propriedades de configuração do consumidor.                                                                                                                      | Quando deseja-se carregar configurações do consumidor a partir de um arquivo.                    |             |                                                                         |
| `--enable-systest-events` | Registrar eventos do ciclo de vida do consumidor, além de mensagens consumidas. (Específico para testes do sistema.)                                                        | Para registrar eventos do ciclo de vida do consumidor, útil para testes de sistema.              |             |                                                                         |
| `--formatter`             | O nome de uma classe para formatação das mensagens Kafka para exibição. (padrão: kafka.tools.DefaultMessageFormatter)                                                       | Para especificar uma classe de formatação de mensagens personalizada.                            |             |                                                                         |
| `--formatter-config`      | Arquivo de propriedades de configuração para inicializar o formatador de mensagens.                                                                                         | Quando deseja-se configurar o formatador de mensagens a partir de um arquivo de configuração.    |             |                                                                         |
| `--from-beginning`        | Se o consumidor não tem um offset estabelecido para consumir, comece com a mensagem mais antiga no log em vez da mais recente.                                              | Ao iniciar o consumo desde o início do tópico, ignorando offsets existentes.                     |             |                                                                         |
| `--group`                 | O ID do grupo de consumidores do consumidor.                                                                                                                                | Ao especificar o ID do grupo de consumidores ao qual o consumidor pertence.                      |             |                                                                         |
| `--include`               | Expressão regular Java especificando a lista de tópicos para inclusão no consumo.                                                                                           | Ao desejar incluir apenas tópicos específicos para consumo, definidos por uma expressão regular. |             |                                                                         |
| `--isolation-level`       | Definir como 'read_committed' para filtrar mensagens transacionais não confirmadas. Definir como 'read_uncommitted' para ler todas as mensagens. (padrão: read_uncommitted) | Para definir o nível de isolamento para leitura de mensagens transacionais.                      |             |                                                                         |
| `--key-deserializer`      | O deserializador para chaves.                                                                                                                                               | Ao definir um deserializador específico para as chaves das mensagens.                            |             |                                                                         |
| `--max-messages`          | O número máximo de mensagens a serem consumidas antes de sair. Se não definido, o consumo é contínuo.                                                                       | Quando deseja-se consumir um número limitado de mensagens e, em seguida, sair.                   |             |                                                                         |
| `--offset`                | O offset a partir do qual consumir (um número não negativo), 'earliest' para desde o início, ou 'latest' para a partir do fim (padrão: latest).                             | Ao especificar o offset inicial de onde o consumidor deve começar a consumir.                    |             |                                                                         |
| `--partition`             | A partição a partir da qual consumir. O consumo começa do fim da partição, a menos que '--offset' seja especificado.                                                        | Ao desejar consumir de uma partição específica de um tópico.                                     |             |                                                                         |
| `--property`              | As propriedades para inicializar o formatador de mensagens. As propriedades padrão incluem: print.timestamp=true                                                            | false, print.key=true                                                                            | false, etc. | Para passar propriedades personalizadas para o formatador de mensagens. |
| `--skip-message-on-error` | Se houver um erro ao processar uma mensagem, pule-a em vez de interromper.                                                                                                  | Ao desejar que o consumidor ignore mensagens com erro ao invés de parar completamente.           |             |                                                                         |
| `--timeout-ms`            | Se especificado, saia se nenhuma mensagem estiver disponível para consumo durante o intervalo especificado.                                                                 | Ao definir um limite de tempo para esperar por mensagens antes de sair.                          |             |                                                                         |
| `--topic`                 | O tópico para consumir.                                                                                                                                                     | Ao especificar o tópico do qual o consumidor irá consumir mensagens.                             |             |                                                                         |
| `--value-deserializer`    | O deserializador para valores.                                                                                                                                              | Ao definir um deserializador específico para os valores das mensagens.                           |             |                                                                         |
| `--version`               | Exibir a versão do Kafka.                                                                                                                                                   | Ao desejar verificar a versão do Kafka.                                                          |             |                                                                         |

Essas são as opções de comando disponíveis para consumidores Kafka e suas descrições em português. Elas podem ser utilizadas conforme a necessidade de configuração e comportamento desejado do consumidor Kafka.
## Configuração de Consumidor Básico e Avançado por Linha de Comando

### Configuração Básica
Para iniciar um consumidor básico pelo terminal, você precisa do `kafka-console-consumer`, que é uma ferramenta que vem com o Kafka. Este comando consome mensagens de um tópico específico.

```bash
kafka-console-consumer --bootstrap-server localhost:9092 --topic meu_topico --from-beginning
```

**Explicação:**
- `--bootstrap-server localhost:9092`: Especifica a lista de brokers Kafka. Neste exemplo, estamos conectando a um broker que está rodando na máquina local na porta 9092.
- `--topic meu_topico`: Define o tópico do qual as mensagens serão consumidas.
- `--from-beginning`: Indica ao consumidor para começar a ler as mensagens desde o início do tópico.

### Configuração Avançada
Para uma configuração mais avançada, você pode incluir controle de grupos e gerenciamento manual de offsets.

```bash
kafka-console-consumer --bootstrap-server localhost:9092 --topic meu_topico --group meu_grupo_consumo --enable-auto-commit false --formatter kafka.tools.DefaultMessageFormatter --property print.key=true --property key.separator=, --property print.value=true
```

**Explicação:**
- `--group meu_grupo_consumo`: Associa o consumidor a um grupo específico. Isso é útil para balanceamento de carga e recuperação de falhas entre consumidores no mesmo grupo.
- `--enable-auto-commit false`: Desabilita o commit automático de offsets, permitindo um controle mais fino sobre quando as mensagens são consideradas 'consumidas'.
- `--formatter kafka.tools.DefaultMessageFormatter`: Especifica como as mensagens devem ser formatadas na saída.
- `--property print.key=true`: Configura o consumidor para imprimir a chave das mensagens.
- `--property key.separator=,`: Define o separador entre chave e valor.
- `--property print.value=true`: Assegura que o valor das mensagens seja impresso.