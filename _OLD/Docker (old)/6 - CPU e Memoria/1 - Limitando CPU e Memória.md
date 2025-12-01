
Docker é uma plataforma incrível para desenvolver, implantar e executar aplicações em containers. Neste guia, vamos explorar como você pode monitorar o uso de recursos de seus containers e como limitar o uso de memória e CPU, garantindo uma melhor gestão e desempenho dos seus recursos computacionais.

## Monitorando Estatísticas de Uso de um Container com `docker stats`

O comando `docker stats` permite que você visualize em tempo real uma série de estatísticas sobre seus containers. Isso inclui uso de CPU, memória, rede e disco. Essa ferramenta é extremamente útil para monitoramento em tempo real e ajuda a identificar containers que podem estar consumindo recursos excessivos.

### Como Usar

Você pode iniciar o monitoramento de todos os seus containers ativos com o comando:

```bash
docker stats
```

Isso exibirá uma tabela atualizada continuamente com as estatísticas de cada container. Para monitorar um container específico, você pode passar o ID ou nome do container como argumento:

```bash
docker stats container_id_or_name
```

### Exemplo de Saída

A saída padrão do `docker stats` inclui colunas como:

- **CONTAINER ID**: Identificador único do container.
- **NAME**: Nome do container.
- **CPU %**: Percentual de CPU utilizado.
- **MEM USAGE / LIMIT**: Memória utilizada e o limite estabelecido para o container.
- **MEM %**: Percentual da memória utilizada.
- **NET I/O**: Dados de rede enviados e recebidos.
- **BLOCK I/O**: Dados de leitura e escrita em disco.
- **PIDS**: Número de processos ou threads no container.

Essa ferramenta é dinâmica e atualiza os dados periodicamente, oferecendo uma visão clara do desempenho do container em tempo real.

#### Opções úteis

- **--no-stream**: Exibe as estatísticas uma única vez, em vez de continuamente.
- **--format**: Personaliza o formato de saída, usando a sintaxe de template Go.

#### Exemplo de uso

Para ver as estatísticas de um container específico sem atualização contínua:

```Shell
docker stats --no-stream container_id_ou_nome
```

Para personalizar a saída, por exemplo, exibir apenas o ID do container, o percentual de CPU e o uso de memória:

```Shell
docker stats --format "Table {{.ID}}\t{{.CPUPerc}}\t{{.MemUsage}}" --no-stream
```

## Limitando o Uso de Memória e CPU de um Container com `docker update`

É possível que alguns containers consumam mais recursos do que deveriam. Para evitar isso, o Docker permite que você limite o uso de memória e CPU após o container já estar em execução, utilizando o comando `docker update`.

### Limitando a Memória

Para limitar a memória de um container, você pode usar o comando `docker update` com a opção `-m` ou `--memory`. Por exemplo, para limitar um container a usar no máximo 500MB de memória, você faria:

```bash
docker update --memory 500m container_id_or_name
```

### Limitando a CPU

Para restringir o uso da CPU, você pode especificar a quantidade de "shares" de CPU que um container pode usar, através da opção `--cpu-shares`. Por padrão, cada container tem 1024 shares de CPU. Se você deseja que um container use, por exemplo, metade da CPU em relação aos outros containers, você pode ajustar isso para 512:

```bash
docker update --cpu-shares 512 container_id_or_name
```

Você também pode limitar o container a rodar em CPUs específicas usando a opção `--cpuset-cpus`. Por exemplo, para limitar o container a usar apenas o primeiro núcleo da CPU, você usaria:

```bash
docker update --cpuset-cpus 0 container_id_or_name
```

### Exemplos Práticos

Suponhamos que você quer que o container `meu_app` não ultrapasse 1GB de memória e 512 shares de CPU:

```bash
docker update --memory 1g --cpu-shares 512 meu_app
```

## Considerações Finais

Monitorar e controlar o uso de recursos dos containers é essencial para manter a saúde do seu ambiente Docker, especialmente em produção. O uso eficiente desses comandos ajuda a prevenir problemas de desempenho e garantir que cada aplicação receba os recursos de que precisa para operar de forma eficaz.

Espero que este guia ajude você a gerenciar melhor seus containers Docker! Se tiver mais dúvidas ou precisar de exemplos adicionais, sinta-se à vontade para perguntar.