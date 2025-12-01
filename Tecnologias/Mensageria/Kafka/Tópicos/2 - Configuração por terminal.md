# Tópicos em Apache Kafka

Apache Kafka é uma plataforma de streaming distribuído que permite que você publique, assine, armazene e processe streams de registros em tempo real. Aqui, vamos explorar como configurar tópicos básicos e avançados tanto por linha de comando quanto utilizando Java.

## Opções de comandos:

Aqui está uma tabela com todas as opções de comando para tópicos no Kafka e seus significados em português, juntamente com uma breve descrição de quando utilizar cada opção:

| Opção                                 | Descrição                                                                                                                                                       | Quando Utilizar                                                                                    |
|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| --alter                               | Altera o número de partições e a atribuição de réplicas. Atualizar a configuração de um tópico existente via --alter não é mais suportado aqui.                   | Para modificar o número de partições ou a atribuição de réplicas de um tópico existente.           |
| --at-min-isr-partitions              | Se definido ao descrever tópicos, mostra apenas partições cuja contagem ISR é igual ao mínimo configurado.                                                     | Para listar apenas as partições cuja contagem ISR é igual ao mínimo configurado.                    |
| --bootstrap-server                   | O servidor Kafka ao qual se conectar (OBRIGATÓRIO).                                                                                                              | Sempre que precisar se conectar a um servidor Kafka para executar operações de tópico.               |
| --command-config                     | Arquivo de propriedades contendo configurações a serem passadas para o Cliente de Administração. Isso é usado apenas com a opção --bootstrap-server.            | Para passar configurações adicionais ao Cliente de Administração ao conectar ao servidor Kafka.     |
| --config                             | Uma substituição de configuração do tópico sendo criado.                                                                                                          | Ao criar ou alterar um tópico e desejar substituir uma configuração específica.                     |
| --create                             | Cria um novo tópico.                                                                                                                                            | Ao criar um novo tópico no cluster Kafka.                                                          |
| --delete                             | Exclui um tópico.                                                                                                                                               | Ao excluir um tópico do cluster Kafka.                                                             |
| --delete-config                      | Uma substituição de configuração do tópico existente a ser removida.                                                                                             | Para remover uma configuração específica de um tópico existente.                                    |
| --describe                           | Lista detalhes dos tópicos fornecidos.                                                                                                                          | Para obter detalhes sobre um ou mais tópicos no cluster Kafka.                                       |
| --exclude-internal                   | Exclui tópicos internos ao executar comandos de listagem ou descrição. Os tópicos internos serão listados por padrão.                                          | Para excluir tópicos internos ao listar ou descrever tópicos.                                        |
| --help                               | Exibe informações de uso.                                                                                                                                       | Sempre que precisar de ajuda com o uso de comandos relacionados a tópicos.                            |
| --if-exists                          | Se definido ao alterar, excluir ou descrever tópicos, a ação será executada apenas se o tópico existir.                                                        | Para garantir que uma ação seja executada apenas se o tópico existir.                                |
| --if-not-exists                      | Se definido ao criar tópicos, a ação será executada apenas se o tópico ainda não existir.                                                                       | Para garantir que um novo tópico seja criado apenas se ele ainda não existir.                        |
| --list                               | Lista todos os tópicos disponíveis.                                                                                                                             | Para listar todos os tópicos disponíveis no cluster Kafka.                                           |
| --partitions                         | O número de partições para o tópico sendo criado ou alterado.                                                                                                    | Ao criar ou alterar um tópico e desejar especificar o número de partições.                           |
| --replica-assignment                 | Atribuição manual de partições-para-corretores para o tópico sendo criado ou alterado.                                                                           | Ao criar ou alterar um tópico e desejar especificar a atribuição manual de réplicas.                |
| --replication-factor                 | O fator de replicação para cada partição no tópico sendo criado.                                                                                                  | Ao criar um novo tópico e desejar especificar o fator de replicação.                                  |
| --topic                              | O tópico a ser criado, alterado, descrito ou excluído.                                                                                                           | Sempre que precisar realizar uma operação em um tópico específico.                                    |
| --topic-id                           | O ID do tópico a ser descrito.                                                                                                                                  | Ao descrever um tópico por ID em vez de nome.                                                       |
| --topics-with-overrides              | Se definido ao descrever tópicos, mostra apenas tópicos que têm configurações substituídas.                                                                      | Para listar apenas tópicos com configurações substituídas ao descrever tópicos.                       |
| --unavailable-partitions            | Se definido ao descrever tópicos, mostra apenas partições cujo líder não está disponível.                                                                        | Para listar apenas as partições cujo líder não está disponível.                                      |
| --under-min-isr-partitions          | Se definido ao descrever tópicos, mostra apenas partições cuja contagem ISR é menor que o mínimo configurado.                                                    | Para listar apenas as partições cuja contagem ISR é menor que o mínimo configurado.                   |
| --under-replicated-partitions       | Se definido ao descrever tópicos, mostra apenas partições com sub-replicação.                                                                                    | Para listar apenas as partições com sub-replicação ao descrever tópicos.                              |
| --version                            | Exibe a versão do Kafka.                                                                                                                                        | Quando você precisa verificar a versão do Kafka.                                                     |

Essas opções de comando são usadas para gerenciar tópicos no Apache Kafka, permitindo a criação, alteração, exclusão e descrição de tópicos, bem como a listagem de todos os tópicos disponíveis e a exibição de detalhes específicos sobre tópicos individuais.
## Configuração de Tópicos via Linha de Comando

### Básico

Para criar um tópico básico em Kafka, você precisa usar o script `kafka-topics.sh`, que está incluído na instalação do Kafka. Aqui está um exemplo de como criar um tópico chamado `meu-topico-basico` com uma única partição e um fator de replicação de 1:

```bash
kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic meu-topico-basico
```

- `--bootstrap-server`: Especifica o endereço do broker Kafka.
- `--replication-factor`: Número de cópias do tópico.
- `--partitions`: Número de partições dentro do tópico.
- `--topic`: Nome do tópico a ser criado.

### Avançado

Para configurações mais avançadas, você pode especificar configurações adicionais ao criar o tópico, como o tempo de retenção de mensagens e o tamanho máximo do lote de mensagens. Aqui está um exemplo:

```bash
kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 2 --partitions 3 --topic meu-topico-avancado --config retention.ms=172800000 --config max.message.bytes=64000
```

- `retention.ms`: Tempo de retenção das mensagens no tópico em milissegundos.
- `max.message.bytes`: Tamanho máximo de uma mensagem no tópico.