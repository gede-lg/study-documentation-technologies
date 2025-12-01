### Ferramentas de Administração e Manutenção

1. **kafka-topics.sh**
   - **Finalidade:** Criar, deletar, listar ou alterar tópicos.
   - **Quando usar:** Gerenciar tópicos no seu cluster Kafka.

2. **kafka-configs.sh**
   - **Finalidade:** Visualizar ou alterar configurações de tópicos, brokers, usuários, entre outros.
   - **Quando usar:** Alterar configurações dinamicamente.

3. **kafka-console-consumer.sh**
   - **Finalidade:** Iniciar um consumidor Kafka que lê mensagens de um tópico específico.
   - **Quando usar:** Para depuração e monitoramento de fluxos de mensagens.

4. **kafka-console-producer.sh**
   - **Finalidade:** Publicar mensagens em um tópico através do terminal.
   - **Quando usar:** Enviar mensagens de forma ad hoc ou para teste.

5. **kafka-consumer-groups.sh**
   - **Finalidade:** Listar, descrever, deletar, ou reiniciar grupos de consumidores.
   - **Quando usar:** Gerenciar e investigar o status de grupos de consumidores.

6. **kafka-server-start.sh / kafka-server-stop.sh**
   - **Finalidade:** Iniciar e parar o servidor Kafka.
   - **Quando usar:** Controlar o ciclo de vida do servidor Kafka em seu ambiente.

7. **kafka-replica-verification.sh**
   - **Finalidade:** Checar integridade das réplicas de partições entre brokers.
   - **Quando usar:** Assegurar a consistência e integridade dos dados replicados.

8. **kafka-reassign-partitions.sh**
   - **Finalidade:** Rebalancear partições entre brokers ou alterar a replicação.
   - **Quando usar:** Balanceamento de carga ou aumento de replicação para maior durabilidade.

9. **kafka-delete-records.sh**
   - **Finalidade:** Deletar registros de um tópico com base no offset.
   - **Quando usar:** Quando é necessário remover dados específicos de um tópico.

10. **kafka-acls.sh**
    - **Finalidade:** Gerenciar ACLs para autorização em um cluster Kafka.
    - **Quando usar:** Para configurar e gerenciar permissões de acesso.

### Ferramentas de Performance e Monitoramento

1. **kafka-producer-perf-test.sh**
   - **Finalidade:** Testar a performance do produtor enviando um grande volume de mensagens.
   - **Quando usar:** Validar ou testar a capacidade de throughput de produtores.

2. **kafka-consumer-perf-test.sh**
   - **Finalidade:** Testar a performance do consumidor.
   - **Quando usar:** Validar ou testar a capacidade de throughput de consumidores.

3. **kafka-broker-api-versions.sh**
   - **Finalidade:** Listar versões de API suportadas pelos brokers.
   - **Quando usar:** Compatibilidade de versão ou diagnóstico de problemas de API.

### Ferramentas de Conectividade e Integração

1. **connect-distributed.sh / connect-standalone.sh**
   - **Finalidade:** Iniciar o Kafka Connect em modo distribuído ou standalone.
   - **Quando usar:** Integrar Kafka com outros sistemas de forma escalável ou isolada.

2. **kafka-mirror-maker.sh**
   - **Finalidade:** Réplica de dados entre dois clusters Kafka.
   - **Quando usar:** Disaster recovery ou agregação de dados em data centers.

### Ferramentas Específicas e Avançadas

1. **kafka-leader-election.sh**
   - **Finalidade:** Forçar a eleição de um novo líder para partições sem líder.
   - **Quando usar:** Recuperar de falhas que deixaram partições sem líderes.

2. **kafka-metadata-shell.sh**
   - **Finalidade:** Interagir com o novo sistema de metadados em Kafka.
   - **Quando usar:** Explorar e modificar metadados diretamente.

3. **zookeeper-shell.sh**
   - **Finalidade:** Interagir diretamente com o Zookeeper.
   - **Quando usar:** Para operações de baixo nível no Zookeeper.

Cada uma dessas ferramentas é utilizada para operações específicas dentro de um ambiente Kafka, desde a manutenção

 básica até testes de desempenho e configurações avançadas.