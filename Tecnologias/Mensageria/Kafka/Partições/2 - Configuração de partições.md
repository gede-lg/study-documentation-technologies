Apache Kafka é uma plataforma de streaming de dados distribuída que utiliza partições para escalonar e paralelizar o processamento de mensagens. As partições em um tópico permitem que os dados sejam distribuídos entre diferentes brokers (servidores) do cluster Kafka, o que aumenta a redundância e a escalabilidade.
## Como criar tópicos com mais de uma partição pelo terminal e na classe Java

### No terminal

Para criar um tópico com múltiplas partições usando o terminal, você pode usar o comando `kafka-topics`. Aqui está um exemplo de como criar um tópico chamado `meu_topico` com 3 partições:

```bash
kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic meu_topico
```

- `--bootstrap-server`: Especifica o servidor Kafka ao qual se conectar.
- `--replication-factor`: Número de cópias do tópico que serão mantidas para redundância.
- `--partitions`: Número de partições para o tópico.

### Na classe Java

Para criar um tópico com múltiplas partições em Java, você pode utilizar a classe `AdminClient`. Aqui está um exemplo:

```java
import org.apache.kafka.clients.admin.*;

import java.util.Collections;
import java.util.Properties;
import java.util.concurrent.ExecutionException;

public class CreateTopic {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        AdminClient admin = AdminClient.create(props);

        NewTopic newTopic = new NewTopic("meu_topico", 3, (short) 1); // Nome, número de partições, fator de replicação
        CreateTopicsResult result = admin.createTopics(Collections.singleton(newTopic));
        result.all().get();

        admin.close();
    }
}
```

## Como criar partições em tópicos existentes pelo terminal e na classe Java

### No terminal

Para adicionar partições a um tópico existente, utilize o comando `kafka-topics` com a opção `--alter`:

```bash
kafka-topics --alter --bootstrap-server localhost:9092 --partitions 6 --topic meu_topico
```

Este comando aumenta o número de partições do tópico `meu_topico` para 6.

### Na classe Java

Em Java, você pode alterar o número de partições de um tópico existente usando o `AdminClient` da seguinte forma:

```java
import org.apache.kafka.clients.admin.*;

import java.util.Collections;
import java.util.Properties;
import java.util.concurrent.ExecutionException;

public class AddPartitions {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        AdminClient admin = AdminClient.create(props);

        Map<String, NewPartitions> updates = Collections.singletonMap("meu_topico", NewPartitions.increaseTo(6));
        admin.createPartitions(updates).all().get();

        admin.close();
    }
}
```

## Como distribuir e paralelizar dados de um tópico pelo terminal e na classe Java

A distribuição e paralelização dos dados em Kafka são gerenciadas automaticamente pelas partições e pelo uso de chaves nos registros. Mensagens com a mesma chave sempre irão para a mesma partição.

### No terminal

A distribuição de dados pelo terminal é geralmente feita na produção das mensagens, especificando a chave:

```bash
kafka-console-producer --broker-list localhost:9092 --topic meu_topico --property "parse.key=true" --property "key.separator=:"
```

Você pode então enviar mensagens no formato `chave:valor`.

### Na classe Java

Para produzir mensagens paralelizadas em Java, use a classe `KafkaProducer` e especifique uma chave para cada mensagem:

```java
import org.apache.kafka.clients.producer.*;

import java.util.Properties;

public class ProducerExample {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");

        Producer<String, String> producer = new KafkaProducer<>(props

);
        for (int i = 0; i < 100; i++) {
            producer.send(new ProducerRecord<>("meu_topico", Integer.toString(i), "message " + i));
        }

        producer.close();
    }
}
```

Ao enviar mensagens com chaves, Kafka garante que mensagens com a mesma chave serão enviadas à mesma partição. Isso permite um processamento paralelo eficaz e mantém a ordem das mensagens dentro de uma mesma chave.

## Considerações finais

Trabalhar com partições no Kafka é essencial para escalar e garantir o alto desempenho das aplicações que dependem de processamento de grandes volumes de dados em tempo real. A correta configuração e manipulação das partições permitem não apenas melhor distribuição de carga, mas também resiliência e eficiência no processamento de streams de dados.