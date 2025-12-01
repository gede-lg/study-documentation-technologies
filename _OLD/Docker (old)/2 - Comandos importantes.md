## Gerenciamento de Container

#### 1. docker run
- **Sintaxe**: `docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`
- **Finalidade**: Cria e inicia um container a partir de uma imagem.
- **Exemplo**: Para executar um container usando a imagem do Ubuntu e iniciar um Bash shell, você usaria:
  ```bash
  docker run -it ubuntu /bin/bash
  ```

##### Tabela de Opções do Comando `docker run`

| Abreviação | Flag Extensa          | Descrição                                                                                       | Exemplo de Uso                                    | Quando Utilizar                                 |
|------------|-----------------------|-------------------------------------------------------------------------------------------------|---------------------------------------------------|-------------------------------------------------|
| `-d`       | `--detach`            | Executa o contêiner em background.                                                              | `docker run -d nginx`                             | Quando você não quer manter o terminal ocupado. |
| `-e`       | `--env`               | Define uma variável de ambiente.                                                                | `docker run -e VAR=valor ubuntu`                  | Para configurar variáveis de ambiente.          |
| `-i`       | `--interactive`       | Mantém o STDIN aberto mesmo que não esteja anexado.                                             | `docker run -it ubuntu bash`                      | Para executar comandos interativos.             |
| `-t`       | `--tty`               | Aloca um pseudo-TTY.                                                                            | `docker run -it ubuntu bash`                      | Para simular um terminal (como SSH).            |
| `-p`       | `--publish`           | Publica uma porta do contêiner para o host.                                                     | `docker run -p 80:80 nginx`                       | Para acessar o contêiner através de uma porta.  |
| `-v`       | `--volume`            | Monta um volume.                                                                                | `docker run -v /host:/contêiner ubuntu`           | Para persistência de dados ou compartilhamento. |
| `--rm`     | `--rm`                | Automaticamente remove o contêiner quando ele é parado.                                         | `docker run --rm ubuntu bash`                     | Para limpeza automática após testes.            |
| `-m`       | `--memory`            | Limita a quantidade de memória que o contêiner pode usar.                                       | `docker run -m 512m ubuntu`                       | Para controlar o uso de recursos.               |
| `--name`   | `--name`              | Atribui um nome ao contêiner.                                                                   | `docker run --name meu_nginx nginx`               | Para identificar facilmente o contêiner.        |
| `--network`| `--network`           | Conecta um contêiner a uma rede específica.                                                     | `docker run --network my-net nginx`               | Para definir em qual rede o contêiner operará.  |
| `-w`       | `--workdir`           | Define o diretório de trabalho dentro do contêiner.                                             | `docker run -w /app ubuntu`                       | Para definir um diretório inicial.              |
| `--restart`| `--restart`           | Define a política de reinício do contêiner.                                                     | `docker run --restart=always nginx`               | Para controlar o reinício automático.           |

#### 2. docker ps
- **Sintaxe**: `docker ps [OPTIONS]`
- **Finalidade**: Lista todos os containers em execução.
- **Exemplo**: Para listar todos os containers ativos:
  ```bash
  docker ps
  ```

#### 3. docker ps -a
- **Sintaxe**: `docker ps -a`
- **Finalidade**: Lista todos os containers, incluindo os inativos.
- **Exemplo**: Para ver todos os containers, ativos e inativos:
  ```bash
  docker ps -a
  ```

#### 4. docker stop
- **Sintaxe**: `docker stop [OPTIONS] CONTAINER [CONTAINER...]`
- **Finalidade**: Para um ou mais containers em execução.
- **Exemplo**: Para parar um container chamado fervent_heisenberg:
  ```bash
  docker stop fervent_heisenberg
  ```

#### 5. docker start
- **Sintaxe**: `docker start [OPTIONS] CONTAINER [CONTAINER...]`
- **Finalidade**: Inicia um ou mais containers parados.
- **Exemplo**: Para iniciar um container parado chamado loving_lamarr:
  ```bash
  docker start loving_lamarr
  ```

#### 6. docker restart
- **Sintaxe**: `docker restart [OPTIONS] CONTAINER [CONTAINER...]`
- **Finalidade**: Reinicia um ou mais containers.
- **Exemplo**: Para reiniciar um container chamado hopeful_curie:
  ```bash
  docker restart hopeful_curie
  ```

#### 7. docker remove
- **Sintaxe**: `docker rm [OPTIONS] CONTAINER [CONTAINER...]`
- **Finalidade**: Remove um ou mais containers.
- **Exemplo**: Para remover um container chamado angry_hawking:
  ```bash
  docker rm angry_hawking
  ```

#### 8. docker kill
- **Sintaxe**: `docker kill [OPTIONS] CONTAINER [CONTAINER...]`
- **Finalidade**: Envia um sinal SIGKILL para um ou mais containers.
- **Exemplo**: Para forçar a parada do container named blissful_darwin:
  ```bash
  docker kill blissful_darwin
  ```

#### 9. docker attach
- **Sintaxe**: `docker attach [OPTIONS] CONTAINER`
- **Finalidade**: Conecta ao stdout, stderr e stdin de um container em execução.
- **Exemplo**: Para se conectar ao container em execução chamado nostalgic_morse:
  ```bash
  docker attach nostalgic_morse
  ```

#### 10. docker exec
- **Sintaxe**: `docker exec [OPTIONS] CONTAINER COMMAND [ARG...]`
- **Finalidade**: Executa um comando em um container em execução.
- **Exemplo**: Para executar um comando `ls` no container em execução chamado fervent_golick:
  ```bash
  docker exec fervent_golick ls
  ```

#### 11. docker logs
- **Sintaxe**: `docker logs [OPTIONS] CONTAINER`
- **Finalidade**: Busca os logs de um container.
- **Exemplo**: Para obter os logs do container chamado quirky_knuth:
  ```bash
  docker logs quirky_knuth
  ```

#### 12. docker inspect
- **Sintaxe**: `docker inspect [OPTIONS] NAME|ID [NAME|ID...]`
- **Finalidade**: Retorna informações detalhadas sobre um ou mais containers.
- **Exemplo**: Para inspecionar um container chamado stupefied_torvalds:
  ```bash
  docker inspect stupefied_torvalds
  ```

#### 13. docker diff
- **Sintaxe**: `docker diff CONTAINER`
- **Finalidade**: Ex

ibe as alterações em arquivos ou diretórios no filesystem de um container.
- **Exemplo**: Para ver as alterações no container chamado mad_hopper:
  ```bash
  docker diff mad_hopper
  ```

#### 14. docker commit
- **Sintaxe**: `docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]`
- **Finalidade**: Cria uma nova imagem a partir das alterações de um container.
- **Exemplo**: Para criar uma imagem do container em execução chamado amazing_cray, com o nome de nova_imagem:
  ```bash
  docker commit amazing_cray nova_imagem
  ```

#### 15. docker cp
- **Sintaxe**: `docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-`
- **Finalidade**: Copia arquivos/folders entre um container e o sistema local.
- **Exemplo**: Para copiar o diretório /app do container chamado focused_newton para o diretório local chamado backup_app:
  ```bash
  docker cp focused_newton:/app ./backup_app
  ```

#### 16. docker update
- **Sintaxe**: `docker update [OPTIONS] CONTAINER [CONTAINER...]`
- **Finalidade**: Atualiza a configuração de um ou mais containers.
- **Exemplo**: Para atualizar a configuração de memória máxima para 500m no container chamado thirsty_albattani:
  ```bash
  docker update --memory 500m thirsty_albattani
  ```

#### 17. docker pause
- **Sintaxe**: `docker pause CONTAINER [CONTAINER...]`
- **Finalidade**: Pausa todos os processos em um ou mais containers.
- **Exemplo**: Para pausar o container chamado vibrant_gates:
  ```bash
  docker pause vibrant_gates
  ```

#### 18. docker unpause
- **Sintaxe**: `docker unpause CONTAINER [CONTAINER...]`
- **Finalidade**: Despausa todos os processos em um ou mais containers.
- **Exemplo**: Para despausar o container chamado vibrant_gates:
  ```bash
  docker unpause vibrant_gates
  ```

#### 19. docker port
- **Sintaxe**: `docker port CONTAINER [PRIVATE_PORT[/PROTO]]`
- **Finalidade**: Lista as portas mapeadas ou uma porta específica de um container.
- **Exemplo**: Para listar as portas mapeadas para o container chamado silly_sammet:
  ```bash
  docker port silly_sammet
  ```

#### 20. docker stats
- **Sintaxe**: `docker stats [OPTIONS] [CONTAINER...]`
- **Finalidade**: Exibe uma transmissão ao vivo do uso de recursos dos containers.
- **Exemplo**: Para visualizar estatísticas de uso dos containers em execução:
  ```bash
  docker stats
  ```

Estes comandos constituem a espinha dorsal do gerenciamento de containers no Docker, fornecendo as ferramentas necessárias para criar, gerenciar, inspecionar e manipular containers em diversos contextos. Praticar com esses comandos ajudará a desenvolver fluência no Docker e a aproveitar o poder dos containers para desenvolver, testar e implantar aplicações.

## Gerenciamento de Imagens

#### 1. **docker pull**
- **Sintaxe**: `docker pull [OPTIONS] NAME[:TAG|@DIGEST]`
- **Propósito**: Baixa uma imagem ou um repositório do Docker Hub.
- **Exemplo**: `docker pull ubuntu:18.04`

#### 2. **docker push**
- **Sintaxe**: `docker push [OPTIONS] NAME[:TAG]`
- **Propósito**: Envia uma imagem ou repositório para o Docker Hub ou outro registro.
- **Exemplo**: `docker push meu_usuario/minha_imagem`

#### 3. **docker build**
- **Sintaxe**: `docker build [OPTIONS] PATH | URL | -`
- **Propósito**: Constrói uma imagem Docker a partir de um Dockerfile.
- **Exemplo**: `docker build -t minha_imagem .`

#### 4. **docker images**
- **Sintaxe**: `docker images [OPTIONS] [REPOSITORY[:TAG]]`
- **Propósito**: Lista as imagens Docker disponíveis localmente.
- **Exemplo**: `docker images`

#### 5. **docker rmi**
- **Sintaxe**: `docker rmi [OPTIONS] IMAGE [IMAGE...]`
- **Propósito**: Remove uma ou mais imagens Docker.
- **Exemplo**: `docker rmi minha_imagem`

#### 6. **docker history**
- **Sintaxe**: `docker history [OPTIONS] IMAGE`
- **Propósito**: Mostra o histórico de uma imagem Docker, incluindo as camadas que a compõem.
- **Exemplo**: `docker history ubuntu:18.04`

#### 7. **docker save**
- **Sintaxe**: `docker save [OPTIONS] IMAGE [IMAGE...]`
- **Propósito**: Salva uma ou mais imagens em um arquivo tar.
- **Exemplo**: `docker save minha_imagem > minha_imagem.tar`

#### 8. **docker load**
- **Sintaxe**: `docker load [OPTIONS]`
- **Propósito**: Carrega uma imagem de um arquivo tar.
- **Exemplo**: `docker load < minha_imagem.tar`

#### 9. **docker tag**
- **Sintaxe**: `docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]`
- **Propósito**: Atribui uma nova tag a uma imagem, efetivamente criando uma cópia da imagem com um novo nome.
- **Exemplo**: `docker tag minha_imagem minha_imagem:nova_tag`

#### 10. **docker import**
- **Sintaxe**: `docker import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]`
- **Propósito**: Cria uma imagem Docker a partir de um arquivo tar.
- **Exemplo**: `docker import minha_imagem.tar minha_nova_imagem`

#### 11. **docker export**
- **Sintaxe**: `docker export [OPTIONS] CONTAINER`
- **Propósito**: Exporta o sistema de arquivos de um contêiner para um arquivo tar.
- **Exemplo**: `docker export meu_contêiner > meu_contêiner.tar`

#### 12. **docker inspect**
- **Sintaxe**: `docker inspect [OPTIONS] NAME|ID [NAME|ID...]`
- **Propósito**: Retorna informações detalhadas sobre objetos Docker, incluindo imagens.
- **Exemplo**: `docker inspect ubuntu:18.04`

#### 13. **docker search**
- **Sintaxe**: `docker search [OPTIONS] TERM`
- **Propósito**: Busca no Docker Hub imagens que correspondam ao termo especificado.
- **Exemplo**: `docker search ubuntu`

#### 14. **docker login**
- **Sintaxe**: `docker login [OPTIONS] [SERVER]`
- **Propósito**: Autentica-se em um registro Docker.
- **Exemplo**: `docker login`

#### 15. **docker logout**
- **Sintaxe**: `docker logout [SERVER]`
- **Propósito**: Desconecta de um registro Docker.
- **Exemplo**: `docker logout`

#### 16. **docker commit**
- **Sintaxe**: `docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]`
- **Propósito**: Cria uma nova imagem a partir das alterações feitas em um contêiner.
- **Exemplo**: `docker commit meu_contêiner minha_nova_imagem`

#### 17. **docker diff**
- **Sintaxe**: `docker diff CONTAINER`
- **Propósito**: Mostra as alterações feitas no sistema de arquivos de um contêiner.
- **Exemplo**: `docker diff meu_contêiner`

#### 18. **docker cp**
- **Sintaxe**: `docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-`
- **Propósito**: Copia arquivos/folderes entre um contêiner e o sistema de arquivos local.
- **Exemplo**: `docker cp meu_contêiner:/meu_arquivo.txt ./meu_arquivo_local.txt`

#### 19. **docker create**
- **Sintaxe**: `docker create [OPTIONS] IMAGE [COMMAND] [ARG...]`
- **Propósito**: Cria um novo contêiner a partir de uma imagem, sem iniciá-lo.
- **Exemplo**: `docker create ubuntu:18.04`

#### 20. **docker rm**
- **Sintaxe**: `docker rm [OPTIONS] CONTAINER [CONTAINER...]`
- **Propósito**: Remove um ou mais contêineres.
- **Exemplo**: `docker rm meu_contêiner`

Este conjunto de comandos proporciona uma base sólida para o gerenciamento de imagens no Docker, desde a obtenção de imagens até a sua modificação e armazenamento. Ao familiarizar-se com estes comandos, o usuário estará bem equipado para gerenciar eficientemente as imagens Docker em diversos cenários de desenvolvimento e produção.
## Gerenciamento de Redes

#### 1. `docker network create`
- **Sintaxe de Uso:** `docker network create [OPTIONS] NETWORK`
- **Para que serve:** Cria uma nova rede no Docker, permitindo que os containers se comuniquem entre si e/ou com a internet.
- **Exemplo de Uso:** `docker network create --driver bridge minha_rede`

#### 2. `docker network ls`
- **Sintaxe de Uso:** `docker network ls [OPTIONS]`
- **Para que serve:** Lista todas as redes disponíveis no Docker.
- **Exemplo de Uso:** `docker network ls`

#### 3. `docker network rm`
- **Sintaxe de Uso:** `docker network rm NETWORK [NETWORK...]`
- **Para que serve:** Remove uma ou mais redes do Docker.
- **Exemplo de Uso:** `docker network rm minha_rede`

#### 4. `docker network connect`
- **Sintaxe de Uso:** `docker network connect [OPTIONS] NETWORK CONTAINER`
- **Para que serve:** Conecta um container a uma rede existente.
- **Exemplo de Uso:** `docker network connect minha_rede meu_container`

#### 5. `docker network disconnect`
- **Sintaxe de Uso:** `docker network disconnect [OPTIONS] NETWORK CONTAINER`
- **Para que serve:** Desconecta um container de uma rede.
- **Exemplo de Uso:** `docker network disconnect minha_rede meu_container`

#### 6. `docker network inspect`
- **Sintaxe de Uso:** `docker network inspect [OPTIONS] NETWORK [NETWORK...]`
- **Para que serve:** Exibe informações detalhadas sobre uma ou mais redes.
- **Exemplo de Uso:** `docker network inspect minha_rede`

#### 7. `docker network prune`
- **Sintaxe de Uso:** `docker network prune [OPTIONS]`
- **Para que serve:** Remove todas as redes não utilizadas.
- **Exemplo de Uso:** `docker network prune`

#### 8. `docker network create --subnet`
- **Sintaxe de Uso:** `docker network create --driver bridge --subnet=CIDR NETWORK`
- **Para que serve:** Cria uma rede com uma sub-rede específica.
- **Exemplo de Uso:** `docker network create --driver bridge --subnet=192.168.1.0/24 minha_rede_customizada`

#### 9. `docker network create --gateway`
- **Sintaxe de Uso:** `docker network create --driver bridge --gateway=GATEWAY_IP --subnet=CIDR NETWORK`
- **Para que serve:** Cria uma rede com um gateway específico e uma sub-rede.
- **Exemplo de Uso:** `docker network create --driver bridge --gateway=192.168.1.1 --subnet=192.168.1.0/24 minha_rede_com_gateway`

#### 10. `docker network create --ip-range`
- **Sintaxe de Uso:** `docker network create --driver bridge --subnet=CIDR --ip-range=RANGE NETWORK`
- **Para que serve:** Cria uma rede com uma faixa de IPs específica dentro de uma sub-rede.
- **Exemplo de Uso:** `docker network create --driver bridge --subnet=192.168.1.0/24 --ip-range=192.168.1.128/25 minha_rede_com_faixa_ip`

#### 11. `docker network create --aux-address`
- **Sintaxe de Uso:** `docker network create --driver bridge --aux-address="ip_alias=IP" NETWORK`
- **Para que serve:** Cria uma rede com um endereço IP auxiliar.
- **Exemplo de Uso:** `docker network create --driver bridge --aux-address="my_router=192.168.1.5" minha_rede_com_aux_address`
#### 12. `docker network create --internal`
- **Sintaxe de Uso:** `docker network create --driver bridge --internal NETWORK`
- **Para que serve:** Cria uma rede interna que não tem acesso à internet.
- **Exemplo de Uso:** `docker network create --driver bridge --internal minha_rede_interna`

#### 13. `docker network create --attachable`
- **Sintaxe de Uso:** `docker network create --driver bridge --attachable NETWORK`
- **Para que serve:** Cria uma rede à qual containers

 standalone podem se conectar.
- **Exemplo de Uso:** `docker network create --driver bridge --attachable minha_rede_attachable`

#### 14. `docker network create --driver`
- **Sintaxe de Uso:** `docker network create --driver DRIVER NETWORK`
- **Para que serve:** Cria uma rede especificando um driver de rede, como `bridge`, `overlay`, `macvlan`.
- **Exemplo de Uso:** `docker network create --driver overlay minha_rede_overlay`

#### 15. `docker network create --opt`
- **Sintaxe de Uso:** `docker network create --driver bridge --opt OPT=VALUE NETWORK`
- **Para que serve:** Cria uma rede com opções específicas de driver.
- **Exemplo de Uso:** `docker network create --driver bridge --opt com.docker.network.bridge.name=minha_bridge minha_rede_com_opt`

#### 16. `docker network create --label`
- **Sintaxe de Uso:** `docker network create --label LABEL=VALUE NETWORK`
- **Para que serve:** Cria uma rede com uma ou mais etiquetas.
- **Exemplo de Uso:** `docker network create --label ambiente=desenvolvimento minha_rede`

#### 17. `docker network create --config-only`
- **Sintaxe de Uso:** `docker network create --config-only --subnet=CIDR --ip-range=RANGE --gateway=GATEWAY_IP CONFIG`
- **Para que serve:** Cria uma configuração de rede que pode ser usada por redes overlay.
- **Exemplo de Uso:** `docker network create --config-only --subnet=10.0.0.0/24 minha_config_de_rede`

#### 18. `docker network create --scope`
- **Sintaxe de Uso:** `docker network create --scope SCOPE NETWORK`
- **Para que serve:** Define o escopo da rede, podendo ser `local` ou `global` para redes overlay.
- **Exemplo de Uso:** `docker network create --scope local minha_rede_local`

#### 19. `docker network create --ingress`
- **Sintaxe de Uso:** `docker network create --driver overlay --ingress NETWORK`
- **Para que serve:** Cria uma rede overlay usada para o roteamento de ingresso.
- **Exemplo de Uso:** `docker network create --driver overlay --ingress minha_rede_ingress`

#### 20. `docker network create --ipv6`
- **Sintaxe de Uso:** `docker network create --driver bridge --ipv6 NETWORK`
- **Para que serve:** Cria uma rede que suporta IPv6.
- **Exemplo de Uso:** `docker network create --driver bridge --ipv6 minha_rede_ipv6`

Estes comandos oferecem uma ampla gama de opções para gerenciar redes no Docker, desde a criação de redes simples até a configuração de redes complexas com sub-redes, faixas de IP, e muito mais. Compreender e utilizar esses comandos é essencial para gerenciar efetivamente a comunicação e o isolamento entre containers em diversos cenários de implantação.
## Gerenciamento de Volumes

#### 1. `docker volume create`
**Sintaxe:** `docker volume create [OPTIONS] [VOLUME]`

**Para que serve:** Cria um novo volume que pode ser montado em contêineres.

**Exemplo de uso:** 
```sh
docker volume create meu_volume
```

#### 2. `docker volume ls`
**Sintaxe:** `docker volume ls [OPTIONS]`

**Para que serve:** Lista todos os volumes existentes no host Docker.

**Exemplo de uso:** 
```sh
docker volume ls
```

#### 3. `docker volume inspect`
**Sintaxe:** `docker volume inspect [OPTIONS] VOLUME [VOLUME...]`

**Para que serve:** Mostra informações detalhadas sobre um ou mais volumes.

**Exemplo de uso:** 
```sh
docker volume inspect meu_volume
```

#### 4. `docker volume rm`
**Sintaxe:** `docker volume rm [OPTIONS] VOLUME [VOLUME...]`

**Para que serve:** Remove um ou mais volumes. Os volumes não podem ser removidos se estiverem em uso por um contêiner.

**Exemplo de uso:** 
```sh
docker volume rm meu_volume
```

#### 5. `docker volume prune`
**Sintaxe:** `docker volume prune [OPTIONS]`

**Para que serve:** Remove todos os volumes não usados.

**Exemplo de uso:** 
```sh
docker volume prune
```

#### 6. `docker run -v`
**Sintaxe:** `docker run -v [HOST_DIR]:[CONTAINER_DIR] [IMAGE] [COMMAND]`

**Para que serve:** Monta um volume durante a execução de um contêiner. Se o volume não existir, o Docker o criará automaticamente.

**Exemplo de uso:** 
```sh
docker run -v /meu/diretorio/host:/diretorio/contêiner minha_imagem
```

#### 7. `docker run --mount`
**Sintaxe:** `docker run --mount type=bind,source=[HOST_DIR],target=[CONTAINER_DIR] [IMAGE] [COMMAND]`

**Para que serve:** Monta um volume ou diretório do host em um contêiner. Oferece mais opções do que `-v`.

**Exemplo de uso:** 
```sh
docker run --mount type=volume,source=meu_volume,target=/app minha_imagem
```

#### 8. `docker volume create --opt`
**Sintaxe:** `docker volume create --opt o=[OPTION] --opt device=[DEVICE] [VOLUME]`

**Para que serve:** Cria um volume com opções específicas, como um dispositivo de armazenamento.

**Exemplo de uso:** 
```sh
docker volume create --opt o=size=100m meu_volume
```

#### 9. `docker volume create --label`
**Sintaxe:** `docker volume create --label [KEY]=[VALUE] [VOLUME]`

**Para que serve:** Cria um volume com uma etiqueta (label) para ajudar na organização e filtragem.

**Exemplo de uso:** 
```sh
docker volume create --label projeto=meuprojeto meu_volume
```

#### 10. `docker run --volume-driver`
**Sintaxe:** `docker run --volume-driver=[DRIVER] -v [VOLUME]:[CONTAINER_DIR] [IMAGE] [COMMAND]`

**Para que serve:** Especifica o driver de volume a ser usado ao montar um volume.

**Exemplo de uso:** 
```sh
docker run --volume-driver=local -v meu_volume:/data minha_imagem
```

#### 11. `docker volume ls --filter`
**Sintaxe:** `docker volume ls --filter [FILTER_KEY]=[FILTER_VALUE]`

**Para que serve:** Lista volumes que correspondem a um filtro específico.

**Exemplo de uso:** 
```sh
docker volume ls --filter dangling=true
```

#### 12. `docker volume ls --format`
**Sintaxe:** `docker volume ls --format "{{.Mountpoint}}"`

**Para que serve:** Formata a saída da lista de volumes usando um template Go.

**Exemplo de uso:** 
```sh
docker volume ls --format "{{.Name}}: {{.Mountpoint}}"
```

#### 13. `docker run --read-only`
**Sintaxe:** `docker run --read-only -v [VOLUME]:[CONTAINER_DIR]:ro [IMAGE] [COMMAND]`

**Para que serve:** Monta um volume como somente leitura dentro do contêiner.

**Exemplo de uso:** 
```sh
docker run --read-only -v meu_volume:/data:ro minha_imagem
```

#### 14. `docker volume create --driver`
**Sintaxe:** `docker volume create --driver [DRIVER] [VOLUME]`

**Para que serve:** Cria um volume utilizando um driver de volume específico.

**Exemplo de uso:** 
```sh
docker volume create --driver rexray meu_volume
```

#### 15. `docker run -v --read-only`
**Sintaxe:** `docker run -v [HOST_DIR]:[CONTAINER_DIR]:ro [IMAGE] [COMMAND]`

**Para que serve:** Monta um diretório do host como somente leitura dentro do contêiner.

**Exemplo de uso:** 
```sh
docker run -v /meu/diretorio/host:/diretorio/contêiner:ro minha_imagem
```

#### 16. `docker volume inspect --format`
**Sintaxe:** `docker volume inspect --format "{{.Option}}" [VOLUME]`

**Para que serve:** Inspecciona um volume e formata a saída usando um template Go.

**Exemplo de uso:** 
```sh
docker volume inspect --format "{{.Mountpoint}}" meu_volume
```

#### 17. `docker run --mount type=tmpfs`
**Sintaxe:** `docker run --mount type=tmpfs,tmpfs-size=[SIZE],destination=[CONTAINER_DIR] [IMAGE] [COMMAND]`

**Para que serve:** Monta um sistema de arquivos temporário (tmpfs) dentro do contêiner, útil para dados que não precisam ser persistidos.

**Exemplo de uso:** 
```sh
docker run --mount type=tmpfs,tmpfs-size=100m,destination=/app minha_imagem
```

#### 18. `docker volume create --name`
**Sintaxe:** `docker volume create --name [NAME]`

**Para que serve:** Cria um volume com um nome específico.

**Exemplo de uso:** 
```sh
docker volume create --name meu_volume_personalizado
```

#### 19. `docker volume ls --quiet`
**Sintaxe:** `docker volume ls --quiet`

**Para que serve:** Lista apenas os IDs dos volumes, sem informações adicionais.

**Exemplo de uso:** 
```sh
docker volume ls --quiet
```

#### 20. `docker run --mount type=volume,source=,target=,volume-opt=type=`
**Sintaxe:** `docker run --mount type=volume,source=[SOURCE],target=[TARGET],volume-opt=[OPTION]=[VALUE] [IMAGE] [COMMAND]`

**Para que serve:** Monta um volume com opções específicas, como tipo de volume, no contêiner.

**Exemplo de uso:** 
```sh
docker run --mount type=volume,source=meu_volume,target=/data,volume-opt=o=size=100m minha_imagem
```

Estes comandos cobrem a maioria das necessidades básicas e avançadas de gerenciamento de volumes no Docker. Usá-los corretamente permite aproveitar ao máximo os recursos de persistência de dados e compartilhamento de arquivos entre contêineres e o sistema host, facilitando o desenvolvimento, teste e produção de aplicações em contêineres.
## Dockerfile

1. **FROM**
   - **Sintaxe**: `FROM <imagem>:<tag>`
   - **Propósito**: Especifica a imagem base a ser usada na construção da imagem Docker.
   - **Exemplo**: 
     ```Dockerfile
     FROM ubuntu:18.04
     ```

2. **LABEL**
   - **Sintaxe**: `LABEL <chave>=<valor>`
   - **Propósito**: Adiciona metadados à imagem, como descrição, versão, autor.
   - **Exemplo**: 
     ```Dockerfile
     LABEL maintainer="developer@example.com"
     ```

3. **RUN**
   - **Sintaxe**: `RUN <comando>`
   - **Propósito**: Executa comandos no shell da imagem durante o processo de construção.
   - **Exemplo**: 
     ```Dockerfile
     RUN apt-get update && apt-get install -y git
     ```

4. **CMD**
   - **Sintaxe**: `CMD ["executável","param1","param2"]`
   - **Propósito**: Fornece os comandos padrão que serão executados ao iniciar o container.
   - **Exemplo**: 
     ```Dockerfile
     CMD ["echo", "Hello World!"]
     ```

5. **EXPOSE**
   - **Sintaxe**: `EXPOSE <porta>`
   - **Propósito**: Informa ao Docker que o container irá escutar as solicitações na porta especificada.
   - **Exemplo**: 
     ```Dockerfile
     EXPOSE 8080
     ```

6. **ENV**
   - **Sintaxe**: `ENV <chave>=<valor>`
   - **Propósito**: Define variáveis de ambiente no container.
   - **Exemplo**: 
     ```Dockerfile
     ENV NODE_ENV=production
     ```

7. **ADD**
   - **Sintaxe**: `ADD <src> <dest>`
   - **Propósito**: Copia arquivos e diretórios do host para o filesystem da imagem.
   - **Exemplo**: 
     ```Dockerfile
     ADD . /app
     ```

8. **COPY**
   - **Sintaxe**: `COPY <src> <dest>`
   - **Propósito**: Similar ao ADD, mas sem a capacidade de adicionar URLs ou descompactar arquivos automaticamente.
   - **Exemplo**: 
     ```Dockerfile
     COPY . /app
     ```

9. **ENTRYPOINT**
   - **Sintaxe**: `ENTRYPOINT ["executável", "param1", "param2"]`
   - **Propósito**: Configura o container para ser executado como um executável.
   - **Exemplo**: 
     ```Dockerfile
     ENTRYPOINT ["node", "app.js"]
     ```

10. **VOLUME**
    - **Sintaxe**: `VOLUME ["/data"]`
    - **Propósito**: Cria um ponto de montagem para trabalhar com dados persistentes.
    - **Exemplo**: 
      ```Dockerfile
      VOLUME ["/data"]
      ```

11. **USER**
    - **Sintaxe**: `USER <nome|UID>`
    - **Propósito**: Define o usuário (ou UID) que o container irá executar.
    - **Exemplo**: 
      ```Dockerfile
      USER node
      ```

12. **WORKDIR**
    - **Sintaxe**: `WORKDIR /path/to/workdir`
    - **Propósito**: Define o diretório de trabalho para as instruções

 `RUN`, `CMD`, `ENTRYPOINT`, `COPY` e `ADD`.
    - **Exemplo**: 
      ```Dockerfile
      WORKDIR /app
      ```

13. **ARG**
    - **Sintaxe**: `ARG <nome>[=<valor padrão>]`
    - **Propósito**: Define variáveis que podem ser passadas ao Docker no momento da construção da imagem.
    - **Exemplo**: 
      ```Dockerfile
      ARG VERSION=latest
      ```

14. **ONBUILD**
    - **Sintaxe**: `ONBUILD <instrução>`
    - **Propósito**: Adiciona uma instrução a ser executada mais tarde, quando a imagem for usada como base para outra construção.
    - **Exemplo**: 
      ```Dockerfile
      ONBUILD ADD . /app
      ```

15. **STOPSIGNAL**
    - **Sintaxe**: `STOPSIGNAL signal`
    - **Propósito**: Define o sinal que será enviado ao container para solicitar sua parada.
    - **Exemplo**: 
      ```Dockerfile
      STOPSIGNAL SIGTERM
      ```

16. **HEALTHCHECK**
    - **Sintaxe**: `HEALTHCHECK [OPTIONS] CMD command`
    - **Propósito**: Informa ao Docker como testar a saúde do container para verificar se está funcionando corretamente.
    - **Exemplo**: 
      ```Dockerfile
      HEALTHCHECK CMD curl --fail http://localhost:8080/ || exit 1
      ```

17. **SHELL**
    - **Sintaxe**: `SHELL ["executable", "parameters"]`
    - **Propósito**: Permite a definição do shell padrão para as instruções subsequentes `RUN`, `CMD`, `ENTRYPOINT`.
    - **Exemplo**: 
      ```Dockerfile
      SHELL ["/bin/bash", "-c"]
      ```

18. **MAINTAINER** (Obsoleto)
    - **Sintaxe**: `MAINTAINER <nome>`
    - **Propósito**: Define o autor da imagem. Obsoleto em favor de `LABEL`.
    - **Exemplo**: 
      ```Dockerfile
      MAINTAINER developer@example.com
      ```

19. **LABEL**
    - **Sintaxe**: `LABEL <chave>=<valor>`
    - **Propósito**: Adiciona metadados à imagem, como a versão do software, descrição e autor.
    - **Exemplo**: 
      ```Dockerfile
      LABEL version="1.0"
      ```

20. **# Comentários**
    - **Sintaxe**: `# <comentário>`
    - **Propósito**: Adiciona comentários ao Dockerfile, ignorados pelo Docker.
    - **Exemplo**: 
      ```Dockerfile
      # Este é um comentário
      ```

O entendimento e a aplicação correta destes comandos no Dockerfile são essenciais para a construção de imagens Docker eficazes, que por sua vez são fundamentais para o desenvolvimento, teste e implantação de aplicações em ambientes de containers. A prática constante e a experimentação com estas instruções facilitarão o desenvolvimento de soluções Docker mais robustas e adaptáveis às necessidades específicas de cada projeto. Além disso, a atualização constante sobre as novas versões do Docker e as melhores práticas da comunidade são cruciais para manter a eficiência e segurança das aplicações desenvolvidas.

Exemplo prático:

```Dockerfile
# Definindo a imagem base
FROM node:14

# Metadados da imagem
LABEL maintainer="developer@example.com" \
      version="1.0" \
      description="Aplicação Node.js de exemplo"

# Definindo variáveis de ambiente
ENV NODE_ENV=production \
    PORT=8080

# Expondo a porta 8080 para acesso ao aplicativo
EXPOSE 8080

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando arquivos de dependência primeiro para aproveitar o cache de camadas
COPY package*.json ./

# Instalando dependências
RUN npm install

# Copiando o restante dos arquivos da aplicação
COPY . .

# Definindo variáveis que podem ser passadas no momento da construção
ARG LOG_LEVEL=info

# Adicionando metadados via ARG (demonstração, não utilizado de fato aqui)
LABEL log_level=${LOG_LEVEL}

# Comandos para verificar a saúde do aplicativo
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Comando padrão para executar a aplicação
CMD [ "node", "app.js" ]

# Instrução para ser executada como um executável
ENTRYPOINT [ "node" ]

# Usuário para executar os comandos (executaremos como root para fins de demonstração, embora não seja o recomendado para ambientes de produção)
USER root

# Adicionando um volume para persistência de dados
VOLUME [ "/app/data" ]

# Sinal de parada para uma parada graciosa
STOPSIGNAL SIGTERM

# Definindo o shell padrão para as instruções subsequentes RUN, CMD, ENTRYPOINT (usando shell form para demonstração)
SHELL ["/bin/bash", "-c"]

# Exemplo de instrução ONBUILD para ser executada em imagens derivadas (demonstração, não será executada neste Dockerfile)
ONBUILD RUN echo "Executado de uma imagem derivada!"

# Adicionando um comentário para explicação
# Este Dockerfile é um exemplo didático e inclui todos os comandos discutidos.
```

## Docker Compose

O Docker Compose permite aos usuários definir e executar aplicações Docker multi-contêineres utilizando um arquivo YAML para configurar os serviços da aplicação. Essa ferramenta simplifica o processo de configuração, facilitando a execução de comandos complexos através de simples instruções.

1. **docker-compose up**
   - **Sintaxe**: `docker-compose up [options] [SERVICE...]`
   - **Uso**: Constrói, (re)cria, inicia e anexa a contêineres para um serviço.
   - **Exemplo**: Para iniciar todos os serviços definidos no arquivo `docker-compose.yml`, execute:
     ```bash
     docker-compose up
     ```

2. **docker-compose down**
   - **Sintaxe**: `docker-compose down [options]`
   - **Uso**: Para e remove os contêineres, redes, volumes e imagens criados pelo `up`.
   - **Exemplo**: Para parar e remover todos os recursos:
     ```bash
     docker-compose down
     ```

3. **docker-compose build**
   - **Sintaxe**: `docker-compose build [options] [SERVICE...]`
   - **Uso**: Constrói ou reconstrói serviços.
   - **Exemplo**: Para construir todos os serviços especificados, use:
     ```bash
     docker-compose build
     ```

4. **docker-compose logs**
   - **Sintaxe**: `docker-compose logs [options] [SERVICE...]`
   - **Uso**: Exibe os logs de um ou mais serviços.
   - **Exemplo**: Para ver os logs de todos os serviços, execute:
     ```bash
     docker-compose logs
     ```

5. **docker-compose restart**
   - **Sintaxe**: `docker-compose restart [options] [SERVICE...]`
   - **Uso**: Reinicia um ou mais serviços.
   - **Exemplo**: Para reiniciar todos os serviços, utilize:
     ```bash
     docker-compose restart
     ```

6. **docker-compose stop**
   - **Sintaxe**: `docker-compose stop [options] [SERVICE...]`
   - **Uso**: Para um ou mais serviços em execução.
   - **Exemplo**: Para parar todos os serviços, digite:
     ```bash
     docker-compose stop
     ```

7. **docker-compose start**
   - **Sintaxe**: `docker-compose start [SERVICE...]`
   - **Uso**: Inicia um ou mais serviços parados.
   - **Exemplo**: Para iniciar todos os serviços, use:
     ```bash
     docker-compose start
     ```

8. **docker-compose pause**
   - **Sintaxe**: `docker-compose pause [SERVICE...]`
   - **Uso**: Pausa os serviços em execução.
   - **Exemplo**: Para pausar todos os serviços, execute:
     ```bash
     docker-compose pause
     ```

9. **docker-compose unpause**
   - **Sintaxe**: `docker-compose unpause [SERVICE...]`
   - **Uso**: Despausa os serviços pausados.
   - **Exemplo**: Para despausar todos os serviços, digite:
     ```bash
     docker-compose unpause
     ```

10. **docker-compose ps**
    - **Sintaxe**: `docker-compose ps [options] [SERVICE...]`
    - **Uso**: Lista os contêineres.
    - **Exemplo**: Para listar todos os contêineres, use:
      ```bash
      docker-compose ps
      ```

11. **docker-compose scale**
    - **Sintaxe**: `docker-compose scale SERVICE=NUM`
    - **Uso**: Define o número de contêineres para um serviço.
    - **Exemplo**: Para escalar o serviço web para 3 instâncias, execute:
      ```bash
      docker-compose scale web=3
      ```

12. **docker-compose rm**
    - **Sintaxe**: `docker-compose rm [options] [SERVICE...]`
    - **Uso**: Remove os contêineres parados de um serviço.
    - **Exemplo**: Para remover todos os contêineres parados, digite:
      ```bash
      docker-compose rm
      ```

13. **docker-compose config**
    - **Sintaxe**:

 `docker-compose config [options]`
    - **Uso**: Valida e exibe a configuração.
    - **Exemplo**: Para visualizar a configuração, utilize:
      ```bash
      docker-compose config
      ```

14. **docker-compose pull**
    - **Sintaxe**: `docker-compose pull [options] [SERVICE...]`
    - **Uso**: Puxa imagens para os serviços definidos.
    - **Exemplo**: Para puxar todas as imagens necessárias, execute:
      ```bash
      docker-compose pull
      ```

15. **docker-compose push**
    - **Sintaxe**: `docker-compose push [options] [SERVICE...]`
    - **Uso**: Empurra imagens para um registro.
    - **Exemplo**: Para empurrar imagens dos seus serviços, use:
      ```bash
      docker-compose push
      ```

16. **docker-compose run**
    - **Sintaxe**: `docker-compose run [options] SERVICE [COMMAND] [ARGS...]`
    - **Uso**: Executa um comando em um serviço.
    - **Exemplo**: Para executar um comando `bash` no serviço web, digite:
      ```bash
      docker-compose run web bash
      ```

17. **docker-compose exec**
    - **Sintaxe**: `docker-compose exec [options] SERVICE COMMAND [ARGS...]`
    - **Uso**: Executa um comando em um contêiner em execução.
    - **Exemplo**: Para executar `bash` no contêiner do serviço web já em execução, use:
      ```bash
      docker-compose exec web bash
      ```

18. **docker-compose kill**
    - **Sintaxe**: `docker-compose kill [options] [SERVICE...]`
    - **Uso**: Mata contêineres.
    - **Exemplo**: Para matar todos os serviços, execute:
      ```bash
      docker-compose kill
      ```

19. **docker-compose port**
    - **Sintaxe**: `docker-compose port [options] SERVICE PRIVATE_PORT`
    - **Uso**: Exibe a porta pública mapeada para a porta privada de um serviço.
    - **Exemplo**: Para ver o mapeamento da porta 80 do serviço web, digite:
      ```bash
      docker-compose port web 80
      ```

20. **docker-compose version**
    - **Sintaxe**: `docker-compose version [options]`
    - **Uso**: Mostra a versão do Docker Compose.
    - **Exemplo**: Para verificar a versão do Docker Compose, utilize:
      ```bash
      docker-compose version
      ```

Cada um desses comandos desempenha um papel crucial na gestão de aplicações multi-contêineres, simplificando o processo de desenvolvimento, teste e produção. A familiaridade com esses comandos permite aos desenvolvedores e administradores de sistemas gerenciar eficientemente suas aplicações Dockerizadas.
## Comandos Úteis Adicionais

46. **docker info**
    - **Uso:** `docker info`
    - **Descrição:** Exibe informações do sistema sobre o Docker.
    - **Exemplo:** `docker info`

47. **docker login**
    - **Uso:** `docker login [OPTIONS] [SERVER]`
    - **Descrição:** Loga no Docker Hub ou outro registry.
    - **Exemplo:** `docker login`

48. **docker logout**
    - **Uso:** `docker logout [SERVER]`
    - **Descrição:** Desloga do Docker Hub ou outro registry.
    - **Exemplo:** `docker logout`

49. **docker search**
    - **Uso:** `docker search [OPTIONS] TERM`
    - **Descrição:** Busca imagens no Docker Hub.
    - **Exemplo:** `docker search nginx`

50. **docker system prune**
    - **Uso:** `docker system prune [OPTIONS]`
    - **Descrição:** Remove todos os containers, redes e imagens não utilizados.
    - **Exemplo:** `docker system prune`

Estes comandos representam uma base sólida para trabalhar com Docker, abrangendo a criação e gerenciamento de containers, imagens, redes e volumes, bem como a construção e manutenção de Dockerfiles.