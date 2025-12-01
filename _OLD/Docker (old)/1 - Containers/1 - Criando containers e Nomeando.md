O Docker permite criar, executar, e gerenciar containers de maneira eficiente. Neste guia, exploraremos dois comandos cruciais: `docker run` e `docker exec`, detalhando suas opções e variações.

## Comando `docker run`

O `docker run` é utilizado para criar um novo container a partir de uma imagem. Ele combina as funcionalidades dos comandos `docker create` e `docker start`, ou seja, cria o container e o inicia em uma única etapa.

### Estrutura Básica

```sh
docker run [OPÇÕES] IMAGEM [COMANDO] [ARGUMENTO...]
```

- **[OPÇÕES]**: Configurações adicionais como portas, volumes, etc.
- **IMAGEM**: Nome da imagem a partir da qual o container será criado.
- **[COMANDO] [ARGUMENTO...]**: Comando opcional que será executado dentro do container.

### Opções Comuns

- `-d`, `--detach`: Executa o container em background.
- `--name`: Atribui um nome ao container.
- `-p`, `--publish`: Publica a porta do container para o host.
- `-v`, `--volume`: Monta um volume ou um diretório do host no container.
- `--rm`: Remove o container automaticamente após sua execução.
- `-e`, `--env`: Define variáveis de ambiente no container.

### Exemplos

1. **Executando um container em background**

```sh
docker run -d --name meu-container nginx
```

2. **Publicando uma porta**

```sh
docker run -d -p 8080:80 nginx
```

Este comando executa um container do nginx em background e mapeia a porta 80 do container para a porta 8080 do host.

3. **Montando um volume**

```sh
docker run -d -v /meu/diretorio/host:/container/diretorio nginx
```

Monta o diretório `/meu/diretorio/host` do host em `/container/diretorio` no container.

## Comando `docker exec`

O `docker exec` é utilizado para executar um novo comando em um container que já está rodando.

### Estrutura Básica

```sh
docker exec [OPÇÕES] CONTAINER COMANDO [ARGUMENTO...]
```

- **[OPÇÕES]**: Configurações adicionais, como usuário ou modo interativo.
- **CONTAINER**: Nome ou ID do container.
- **COMANDO [ARGUMENTO...]**: Comando a ser executado no container.

### Opções Comuns

- `-it`: Executa o comando em um terminal interativo.
- `--user`: Define o usuário que executa o comando.

### Exemplos

1. **Acessando o terminal do container**

```sh
docker exec -it meu-container bash
```

Abre um terminal bash dentro do container `meu-container`.

2. **Executando um comando como um usuário específico**

```sh
docker exec --user www-data meu-container whoami
```

Executa o comando `whoami` no container `meu-container` como o usuário `www-data`.

### Nomeando Containers ao Iniciar

Quando você inicia um container, o Docker automaticamente lhe atribui um nome. No entanto, você pode especificar um nome usando a flag `--name` no momento da criação.

```bash
docker run --name <nome_do_seu_container> <imagem>
```

- `<nome_do_seu_container>`: Escolha um nome para o seu container.
- `<imagem>`: Especifique a imagem Docker que será utilizada para criar o container.

Exemplo:

```bash
docker run --name meu_container ubuntu
```

## Dicas Adicionais

- **Limpeza**: Lembre-se de limpar os containers não utilizados com `docker container prune` para liberar espaço.
- **Logs**: Use `docker logs [CONTAINER]` para ver os logs de um container específico.
- **Listagem**: `docker ps` lista todos os containers em execução, enquanto `docker ps -a` lista todos os containers, incluindo os parados.

Espero que este guia tenha sido útil para você explorar as funcionalidades do Docker com os comandos `docker run` e `docker exec`. Lembre-se de praticar e experimentar com as diversas opções disponíveis para se familiarizar ainda mais com essas poderosas ferramentas.