# Tópicos em Kafka

Apache Kafka é uma plataforma de streaming distribuído que permite publicar, assinar, armazenar e processar streams de registros em tempo real. É amplamente utilizado em sistemas de processamento de dados e aplicativos que exigem processamento em alta velocidade e em larga escala.

## O que é um Tópico?

Em Kafka, um **tópico** é uma categoria ou nome de alimentação para a qual os registros são publicados. Os tópicos em Kafka são multi-assinantes; ou seja, um tópico pode ter zero, um ou muitos consumidores que se inscrevem nos dados escritos nele.

### Para que serve?

Os tópicos são fundamentais no Kafka porque são o meio pelo qual os dados são categorizados e armazenados. Diferentes consumidores podem assinar diferentes tópicos e consumir apenas os dados de interesse, o que permite que as aplicações sejam modulares e escaláveis.

## Propriedades de um Tópico

Cada tópico em Kafka pode ser configurado com várias propriedades que podem influenciar seu comportamento em termos de desempenho, durabilidade e escalabilidade. Abaixo estão algumas das propriedades mais importantes que podem ser configuradas:
#### Propriedades Comuns

1. **`partitions`**: Define o número de partições no tópico.
2. **`replication.factor`**: Número de réplicas de cada partição.
3. **`retention.ms`**: Tempo em milissegundos que os dados serão retidos antes de serem excluídos.
4. **`retention.bytes`**: Tamanho máximo em bytes que o log pode crescer antes de começar a excluir os dados mais antigos.
5. **`cleanup.policy`**: Política de limpeza do log, que pode ser `delete` (excluir dados antigos) ou `compact` (manter apenas a última versão de cada chave).

#### Propriedades Avançadas

6. **`min.insync.replicas`**: Número mínimo de réplicas que devem confirmar a gravação para que ela seja considerada bem-sucedida.
7. **`segment.bytes`**: O tamanho do segmento de log após o qual um novo segmento será criado.
8. **`segment.ms`**: Tempo após o qual o segmento atual será fechado e um novo será aberto.
9. **`max.message.bytes`**: Tamanho máximo de uma mensagem que pode ser enviada para o tópico.
10. **`delete.retention.ms`**: O tempo em milissegundos que os registros deletados são mantidos antes de serem permanentemente removidos.

#### Propriedades Menos Comuns

11. **`segment.index.bytes`**: Tamanho do índice que mapeia os offsets para as posições dos arquivos de segmento.
12. **`file.delete.delay.ms`**: Atraso em milissegundos antes de deletar um arquivo de log.
13. **`preallocate`**: Habilita a pré-alocação de arquivos de segmento.
14. **`min.compaction.lag.ms`**: Tempo mínimo em milissegundos que uma mensagem permanecerá inalterada antes de ser elegível para compactação.
15. **`max.compaction.lag.ms`**: Tempo máximo em milissegundos para reter uma mensagem não deletada antes de ela ser elegível para compactação.
16. **`message.format.version`**: Versão do formato de mensagem.
17. **`compression.type`**: Tipo de compressão (por exemplo, `none`, `gzip`, `lz4`, `snappy`).
18. **`unclean.leader.election.enable`**: Permite ou proíbe a eleição de um líder não sincronizado.
19. **`message.timestamp.type`**: Define se os timestamps das mensagens são criados pelo produtor ou quando o broker recebe a mensagem.
20. **`message.timestamp.difference.max.ms`**: Diferença máxima permitida entre o timestamp da mensagem e o tempo do sistema quando a mensagem é anexada ao log.

#### Propriedades Específicas

21. **`follower.replication.throttled.replicas`**: Define quais réplicas são limitadas na replicação.
22. **`leader.replication.throttled.replicas`**: Define quais réplicas são limitadas na replicação a partir do líder.
23. **`index.interval.bytes`**: Intervalo entre entradas de índice forçadas para acelerar o acesso ao log.

Essas propriedades podem ser configuradas durante a criação de um tópico ou alteradas posteriormente usando comandos de alteração de tópico no Kafka. Ajustar essas configurações pode ajudar a otimizar o desempenho do tópico, garantir a durabilidade dos dados e ajustar o comportamento do sistema às necessidades específicas de cada aplicação.
### Exemplo de Criação de um Tópico com Propriedades Específicas

Aqui está um exemplo de como você pode criar um tópico com algumas dessas propriedades usando a linha de comando do Kafka:

```bash
kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 3 --partitions 6 --topic meu-topico --config retention.ms=172800000 --config cleanup.policy=compact
```

Este comando cria um tópico chamado `meu-topico` com um fator de replicação de 3, 6 partições, uma política de limpeza compacta, e uma política de retenção que mantém os registros por até 2 dias.

## Informações Adicionais

### Considerações de Desempenho

- **Número de Partições**: Um número maior de partições pode aumentar a paralelização e o throughput, mas também pode aumentar a latência e o uso de recursos.
- **Fator de Replicação**: Um fator de replicação maior aumenta a durabilidade e a disponibilidade, mas também o custo de armazenamento e a latência de replicação.

### Monitoramento e Manutenção

Kafka oferece várias métricas e ferramentas para monitorar e gerenciar tópicos e clusters. É crucial monitorar o desempenho, o uso de espaço em disco e a latência para manter a saúde do sistema Kafka.

### Conclusão

Tópicos são a espinha dorsal do Kafka, fornecendo a estrutura através da qual os dados fluem entre produtores e consumidores. A compreensão e configuração correta dos tópicos são essenciais para aproveitar ao máximo as capacidades do Kafka.