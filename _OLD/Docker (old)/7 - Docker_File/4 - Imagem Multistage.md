## O que é uma imagem Multistage?

Em Docker, a construção de uma imagem multistage é uma técnica que permite definir múltiplos estágios de construção dentro de um único Dockerfile. Cada estágio pode usar uma base diferente e criar uma camada sobre a qual o próximo estágio pode construir. A ideia principal é que cada estágio pode conter ferramentas e dependências que são necessárias apenas para compilar ou preparar o aplicativo, mas que não são necessárias no ambiente de execução final. Isso permite que a imagem final seja mais leve, contendo apenas os binários e as bibliotecas necessárias para executar o aplicativo.

### Exemplo de Dockerfile Multistage

Abaixo está um exemplo simples de um Dockerfile multistage para uma aplicação Node.js:

```dockerfile
# Primeiro estágio: Construção
FROM node:14 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Segundo estágio: Imagem final
FROM node:14-slim
WORKDIR /app
COPY --from=builder /app/build /app
CMD ["node", "app.js"]
```

No exemplo acima:
1. O primeiro estágio usa a imagem `node:14` para compilar o aplicativo.
2. O segundo estágio usa a versão mais leve `node:14-slim` para executar o aplicativo, copiando apenas os artefatos necessários do primeiro estágio.

## Para que serve e quando usar o Multistage?

### Finalidade

O uso de imagens multistage serve principalmente para:
- **Reduzir o tamanho da imagem final**: Ao separar as dependências de construção das de execução, reduz-se significativamente o tamanho da imagem final.
- **Segurança**: Reduzir a superfície de ataque do container, pois ele contém apenas o necessário para a execução.
- **Otimização de cache**: Cada estágio pode ser cacheado separadamente, tornando as builds subsequentes mais rápidas se as dependências não mudarem.

### Quando usar

Você deve considerar usar imagens multistage:
- **Quando a eficiência é crítica**: Em ambientes de produção onde recursos como armazenamento e tempo de download são críticos.
- **Ambientes de CI/CD**: Onde cada segundo na construção de imagens conta.
- **Aplicações com muitas dependências de compilação**: Como aplicações C++ ou Java, onde as ferramentas de compilação não são necessárias em tempo de execução.

## Considerações Adicionais

- **Documentação e Manutenção**: Um Dockerfile multistage bem documentado é mais fácil de manter e atualizar.
- **Teste de Imagens**: Sempre teste as imagens resultantes para garantir que todas as dependências necessárias estão presentes e que a aplicação funciona como esperado.

Utilizando a técnica de multistage no Dockerfile, você pode criar imagens mais limpas, seguras e eficientes para seus aplicativos, tornando-os mais adequados para a produção em ambientes de nuvem e reduzindo os custos gerais de infraestrutura.

## Tutorial: Criando uma Imagem Multistage para um Sistema Python

Docker é uma plataforma aberta que permite desenvolver, enviar e executar aplicações dentro de contêineres. O Dockerfile é um arquivo de texto que contém todos os comandos, em ordem, necessários para construir uma imagem Docker. Neste tutorial, vamos criar uma imagem multistage de um sistema Python, construir essa imagem com um nome específico e executar um container usando esta imagem.

### Vantagens das Imagens Multistage

As imagens Docker multistage permitem que você divida a construção da imagem em várias etapas, cada uma com sua própria base. Isso pode reduzir o tamanho da imagem final, pois permite separar as dependências de construção das dependências de execução. É particularmente útil para linguagens compiladas como C, C++ ou Go, mas também pode ser vantajoso para interpretados como Python, ao separar as dependências de build e runtime.

### 1. Criando uma Imagem Multistage com Dockerfile

#### Estrutura de Diretórios

Vamos assumir que você tenha o seguinte layout de diretórios:

```
/your-app
│
├── app.py
└── requirements.txt
```

`app.py` é o seu script Python principal, e `requirements.txt` contém todas as dependências do Python necessárias para o seu projeto.

#### O Dockerfile

Aqui está um exemplo de um Dockerfile multistage para uma aplicação Python:

```Dockerfile
# Estágio 1: Ambiente de Build
FROM python:3.9-slim as builder
WORKDIR /usr/src/app

# Copia os arquivos de dependências e instala as dependências
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Estágio 2: Ambiente de Runtime
FROM python:3.9-slim
WORKDIR /usr/src/app

# Copia apenas os pacotes necessários do builder
COPY --from=builder /root/.local /root/.local
COPY app.py .

# Garante que o Python utilize os pacotes instalados no usuário
ENV PATH=/root/.local/bin:$PATH

# Comando para executar o aplicativo
CMD ["python", "./app.py"]
```

#### Explicação do Dockerfile

- **FROM python:3.9-slim as builder**: Este é o primeiro estágio de nossa imagem multistage. Usamos uma imagem base Python slim para reduzir o tamanho. A palavra-chave `as builder` nomeia este estágio para que possamos referenciá-lo mais tarde.
- **WORKDIR /usr/src/app**: Define o diretório de trabalho dentro do container.
- **COPY requirements.txt .**: Copia o arquivo `requirements.txt` para o diretório de trabalho do container.
- **RUN pip install --user -r requirements.txt**: Instala as dependências Python no diretório home do usuário no container.
- **FROM python:3.9-slim**: Inicia o segundo estágio da construção, usando a mesma imagem base Python para compatibilidade.
- **COPY --from=builder /root/.local /root/.local**: Copia as dependências Python instaladas no primeiro estágio para o segundo estágio.
- **COPY app.py .**: Copia o script Python principal para o diretório de trabalho do container.
- **ENV PATH=/root/.local/bin:$PATH**: Atualiza a variável de ambiente PATH para incluir os binários Python instalados no primeiro estágio.
- **CMD ["python", "./app.py"]**: Define o comando padrão para executar o aplicativo Python.

### 2. Buildando a Imagem com Nome Específico

Para construir a imagem e nomeá-la, você pode usar o seguinte comando no terminal:

```bash
docker build -t nome_da_imagem:tag . 
```

- **-t nome_da_imagem:tag**: Especifica o nome e a tag da imagem. Por exemplo, `meu_app_python:v1`.
- **.**: Indica que o Docker deve procurar o Dockerfile no diretório atual.

### 3. Criando um Container a Partir da Imagem

Depois de construir a imagem, você pode criar e executar um container usando:

```bash
docker run --name meu_container nome_da_imagem:tag
```

- **--name meu_container**: Nomeia o container.
- **nome_da_imagem:tag**: Especifica qual imagem usar, deve corresponder ao nome dado na construção.

### Considerações Finais

Este tutorial cobriu o básico sobre como criar uma imagem Docker multistage para uma aplicação Python,

