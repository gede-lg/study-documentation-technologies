## Configuração de Consumidor Básico e Avançado por Classe Java

### Configuração Básica

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.util.Collections;
import java.util.Properties;

public class SimpleConsumer {
    public static void main(String[] args) {
        // Configurações básicas do consumidor
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "grupo-exemplo"); //Definindo o grupo ao qual pertence
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest"); // Configura para consumir desde o início

        // Criando o consumidor
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);

        // Subscrevendo ao tópico
        consumer.subscribe(Collections.singletonList("meu_topico")); 

        // Processando mensagens
        try {
            while (true) {
                consumer.poll(Duration.ofMillis(100)).forEach(record -> {
                    System.out.printf("Offset = %d, Key = %s, Value = %s%n", record.offset(), record.key(), record.value());
                });
            }
        } finally {
            consumer.close(); // Fechando o consumidor
        }
    }
}
```

**Explicação:**
- As propriedades de configuração são definidas como um objeto `Properties`.
- `ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG`: Define a lista de brokers.
- `ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG` e `ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG`: Especificam as classes usadas para deserializar chaves e valores das mensagens, respectivamente.
- `ConsumerConfig.GROUP_ID_CONFIG`: Define o grupo de consumo.
- `ConsumerConfig.AUTO_OFFSET_RESET_CONFIG`: Determina o comportamento do consumidor quando não há offsets válidos.
- O método `subscribe` é usado para subscrever a

 um ou mais tópicos.
- `poll`: Solicita dados ao broker e os processa dentro de um loop infinito.

### Configuração Avançada

Para um consumidor avançado, você pode adicionar configurações adicionais como `enable.auto.commit` para controlar manualmente os commits de offsets e utilizar interceptadores para lógica personalizada antes ou após o processamento das mensagens.

```java
props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");  // Desabilita o auto-commit de offsets
props.put(ConsumerConfig.INTERCEPTOR_CLASSES_CONFIG, "com.example.MyConsumerInterceptor");  // Adiciona interceptador
```

**Explicação:**
- `ENABLE_AUTO_COMMIT_CONFIG`: Controla se os commits de offset são automáticos.
- `INTERCEPTOR_CLASSES_CONFIG`: Lista de interceptadores que permitem customizar ou monitorar as operações de consumo.

Este exemplo ilustra como você pode ajustar e ampliar as configurações para um consumo mais eficaz e robusto em um ambiente Kafka.