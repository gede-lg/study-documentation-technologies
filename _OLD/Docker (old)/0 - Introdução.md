## O que é Docker e para que serve?

Docker é uma plataforma de código aberto para desenvolver, enviar e rodar aplicações. Docker permite que você separe suas aplicações da sua infraestrutura para que você possa entregar software rapidamente. Com Docker, você pode gerenciar sua infraestrutura da mesma forma que você gerencia suas aplicações. Aproveitando as metodologias do Docker para o envio rápido, teste, e implantação de códigos, você pode significativamente reduzir o atraso entre escrever código e rodá-lo em produção.

### Principais características:

- **Portabilidade:** Uma vez que uma aplicação é dockerizada, ela pode ser executada em qualquer ambiente que tenha Docker instalado, independentemente do sistema operacional ou da configuração subjacente do hardware.
- **Isolamento:** Docker garante que cada contêiner tenha seu próprio conjunto de recursos (CPU, memória, sistema de arquivos, etc.) isolado dos outros contêineres e do sistema host.
- **Eficiência:** Containers Docker utilizam os recursos do sistema operacional host de forma mais eficiente do que as máquinas virtuais tradicionais, permitindo uma maior densidade de aplicações e um melhor aproveitamento dos recursos de hardware.

## Diferenças entre Containers e VMs

A diferença entre containers Docker e máquinas virtuais (VMs) reside principalmente na maneira como eles gerenciam a alocação de recursos do sistema operacional e como isolam os processos de aplicativos. Aqui estão as principais diferenças:

1. **Isolamento de Sistema Operacional**:
   - **Containers Docker**: Eles compartilham o mesmo sistema operacional do host, incluindo o kernel e as bibliotecas. Isso significa que todos os containers rodando em um único host operam usando o mesmo sistema operacional base, mas cada container pode ter diferentes bibliotecas e aplicações instaladas.
   - **Máquinas Virtuais (VMs)**: Cada VM roda seu próprio sistema operacional completo, incluindo uma cópia do kernel e das bibliotecas necessárias. Isto permite que VMs rodem sistemas operacionais completamente diferentes uns dos outros e do host.

2. **Uso de Recursos**:
   - **Containers Docker**: São mais leves em termos de uso de recursos porque compartilham o sistema operacional do host. Eles iniciam quase instantaneamente e requerem menos memória e processamento do que as VMs.
   - **VMs**: Como cada VM roda um sistema operacional completo, elas requerem mais recursos de hardware, como CPU, memória e armazenamento. Isso também resulta em tempos de inicialização mais longos comparados aos containers.

3. **Gerenciamento**:
   - **Containers Docker**: São gerenciados por uma única engine de container, como o Docker, que permite fácil escalabilidade, eficiência e gerenciamento. O Docker também simplifica o processo de empacotamento de aplicações e suas dependências em uma imagem de container.
   - **VMs**: Requerem soluções de gerenciamento de virtualização, como VMware, VirtualBox ou Hyper-V. Essas ferramentas proporcionam funcionalidades mais robustas para configurações complexas e segurança reforçada, mas são geralmente mais complexas de gerenciar.

4. **Segurança**:
   - **Containers Docker**: Embora sejam isolados, compartilham o mesmo kernel do sistema operacional do host, o que pode representar um risco maior de vulnerabilidades se comparado com VMs. Contudo, existem técnicas e ferramentas para reforçar a segurança dos containers.
   - **VMs**: Oferecem um isolamento mais forte porque cada VM é separada completamente das outras e do host. Isso faz com que as VMs sejam frequentemente consideradas mais seguras em termos de isolamento de falhas e ataques.

5. **Caso de Uso**:
   - **Containers Docker**: São ideais para aplicações que necessitam de rápida escala, microserviços, e ambientes de desenvolvimento uniformes.
   - **VMs**: São mais adequadas para aplicações que exigem isolamento completo, compatibilidade com diferentes sistemas operacionais, ou para situações que demandam um controle granular sobre o ambiente de hardware.

Essas características fazem com que cada tecnologia seja melhor adequada para diferentes tipos de carga de trabalho e requisitos de infraestrutura.
## Containers

Containers são unidades padrão de software que empacotam o código e todas as suas dependências para que a aplicação rode de forma rápida e confiável de um ambiente computacional para outro. Um container Docker, por exemplo, encapsula uma aplicação específica ou serviço e suas dependências em um container que pode ser executado em qualquer sistema Docker.

### Exemplo básico de um comando Docker para rodar um container:

```bash
docker run hello-world
```

Este comando baixa a imagem `hello-world` do Docker Hub (se não estiver localmente disponível), cria um container a partir dessa imagem e o executa.

## Imagens

Imagens Docker são templates read-only usados para criar containers. Elas incluem o código da aplicação, bibliotecas, ferramentas, dependências, e outras instruções necessárias para rodar a aplicação. Imagens são construídas a partir de arquivos Dockerfile, que fornecem um conjunto de instruções sobre como montar a imagem.

### Exemplo de um Dockerfile básico:

```Dockerfile
# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "app.py"]
```

## Volumes

Volumes são utilizados em Docker para persistir dados gerados e usados por containers Docker. Ao contrário das camadas de uma imagem Docker, que são read-only, volumes permitem leitura e escrita e existem de forma independente dos containers que os utilizam. Isso significa que os volumes permitem armazenar dados de forma persistente ou compartilhar dados entre containers.

### Exemplo de como criar um volume e utilizá-lo com um container:

```bash
# Cria um volume
docker volume create my-vol

# Roda um container com o volume montado
docker run -d --name devtest -v my-vol:/app nginx:latest
```

Este comando cria um volume chamado `my-vol` e monta esse volume no container `devtest` sob o caminho `/app`. Qualquer dado escrito no caminho `/app` dentro do container será armazenado no volume `my-vol`.

## Docker Compose

**Docker Compose** é uma ferramenta projetada para definir e gerenciar aplicações multi-contêineres com o Docker. Com o uso de um arquivo YAML para configurar os serviços da aplicação, o Docker Compose permite que os usuários orquestrem, com simplicidade, o ciclo de vida completo de uma aplicação contêinerizada, desde a construção e início até a parada e remoção dos contêineres. Isso facilita consideravelmente a execução de aplicações compostas por múltiplos contêineres de forma coesa.

**Exemplo de um arquivo `docker-compose.yml`:**

```yaml
version: '3'
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
  api:
    build: ./api
    ports:
      - "5000:5000"
```

Neste exemplo, temos uma aplicação web simples com um serviço `web` que utiliza a imagem do Nginx para servir conteúdo estático e um serviço `api` cuja construção é especificada em um diretório local. O Compose gerencia a rede entre eles, permitindo que se comuniquem.

## Dockerfile

O **Dockerfile** é um arquivo de texto que contém todas as instruções necessárias para construir uma imagem Docker. Através do Dockerfile, o usuário pode definir o ambiente base, adicionar arquivos, executar comandos e configurar variáveis de ambiente para criar imagens personalizadas. Esta é uma maneira poderosa de automatizar o processo de criação de imagens Docker, assegurando consistência e reprodutibilidade.

**Exemplo de Dockerfile:**

```Dockerfile
FROM python:3.8-slim
WORKDIR /app
COPY requirements.txt /app
RUN pip install -r requirements.txt
COPY . /app
CMD ["python", "app.py"]
```

Este Dockerfile cria uma imagem baseada no Python 3.8, instala dependências definidas no `requirements.txt` e executa `app.py` como o comando padrão.

## Redes Docker

**Redes Docker** fornecem uma maneira de interligar contêineres Docker, permitindo que eles comuniquem entre si de maneira isolada e segura. O Docker suporta diferentes tipos de redes (como bridge, overlay, host e none), cada uma adequada a diferentes casos de uso. As redes tipo bridge são utilizadas por padrão para comunicação entre contêineres em uma única máquina, enquanto redes overlay facilitam a comunicação entre contêineres distribuídos em múltiplos hosts Docker, essencial para ambientes de produção em larga escala.

**Exemplo de criação de uma rede Docker:**

```bash
docker network create --driver bridge minha_rede
```

Este comando cria uma rede do tipo bridge chamada `minha_rede`, permitindo que contêineres conectados a ela comuniquem-se diretamente.

## Docker Swarm

**Docker Swarm** é uma ferramenta de orquestração de contêineres integrada ao Docker, projetada para gerenciar clusters de contêineres. Com o Swarm, é possível agrupar múltiplos hosts Docker em um cluster, permitindo que os contêineres sejam distribuídos entre os hosts. Isso facilita a escalabilidade, a tolerância a falhas e a alta disponibilidade de aplicações contêinerizadas. O Docker Swarm oferece funcionalidades como balanceamento de carga, descoberta de serviços e atualizações de serviço de forma rolling, sem downtime.

**Exemplo de inicialização de um cluster Docker Swarm:**

```bash
docker swarm init
```

Este comando configura o host atual como um manager do Swarm, iniciando um novo cluster.