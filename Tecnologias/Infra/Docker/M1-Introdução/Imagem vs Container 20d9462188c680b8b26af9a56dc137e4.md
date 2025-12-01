# Imagem vs Container

---

## Introdução

Docker revolucionou o desenvolvimento e a entrega de software ao isolar aplicações em **containers** leves e portáveis, construídos a partir de **imagens** reutilizáveis. Apesar de frequentemente usados de forma intercambiável, “imagem” e “container” têm papéis distintos na arquitetura do Docker. Nesta explicação, vamos destrinchar cada conceito e mostrar como eles se relacionam na prática.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#conceitos-fundamentais)
2. [Sintaxe e Uso Prático](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#sintaxe-e-uso-pr%C3%A1tico)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **Imagem (Image):**
    - Um artefato **imutável** que contém tudo o que uma aplicação precisa para rodar: sistema de arquivos, bibliotecas, código e metadados (etiquetas, variáveis de ambiente, comandos padrão).
    - É construída em camadas empilhadas (layered filesystem). Cada instrução num `Dockerfile` gera uma nova camada, reaproveitável por outras imagens.
- **Container:**
    - Uma instância **rodando** (ou parada) gerada a partir de uma imagem. É um processo isolado no host, com seu próprio sistema de arquivos (baseado nas camadas da imagem), rede e recursos.
    - Containers são **efêmeros**: facilmente criados, destruídos, pausados e reiniciados sem alterar a imagem-fonte.
- **Relação entre eles:**
    1. **Build**: Você escreve um `Dockerfile` → executa `docker build` → gera uma imagem.
    2. **Run**: Você executa `docker run` sobre uma imagem → inicia um container.
    3. **Iteração**: Poder empilhar várias imagens ou utilizar imagens base para acelerar builds.

---

## Sintaxe e Uso Prático

```
# Dockerfile de exemplo para aplicação Node.js

# 1. Imagem base (camada inicial)
FROM node:18-alpine

# 2. Diretório de trabalho e cópia de código
WORKDIR /app
COPY package.json yarn.lock ./

# 3. Instalar dependências (nova camada)
RUN yarn install --frozen-lockfile

# 4. Copiar código e expor porta
COPY . .
EXPOSE 3000

# 5. Comando padrão ao iniciar o container
CMD ["yarn", "start"]

```

- **Build da imagem**
    
    ```bash
    docker build -t meu-app:1.0 .
    
    ```
    
    - `t`: tagueia a imagem (nome:versão).
    - `.`: contexto de build.
- **Rodar container**
    
    ```bash
    docker run -d \
      --name app-cont \
      -p 8080:3000 \
      -e NODE_ENV=production \
      meu-app:1.0
    
    ```
    
    - `d`: executa em segundo plano (detached).
    - `-name`: nome para facilitar gestão.
    - `p`: mapeia portas host:container.
    - `e`: define variáveis de ambiente.
- **Comandos úteis de container**
    - `docker ps -a` – lista todos containers.
    - `docker logs app-cont` – exibe logs do container.
    - `docker exec -it app-cont sh` – abre shell dentro do container.
    - `docker stop/start/restart app-cont` – gerencia ciclo de vida.

---

## Cenários de Restrição ou Não Aplicação

- **Alta performance bare-metal:** workloads que exigem I/O muito intenso ou acesso direto a hardware (GPU, dispositivos de rede especiais) podem sofrer overhead.
- **Sistemas legados sem suporte a contêiner:** aplicações monolíticas complexas ou legadas que não separam dependências podem ter dificuldades para “dockerizar”.
- **Políticas de segurança muito restritivas:** ambientes com verificação aprofundada de imagens (FIPS, SELinux rígido) podem exigir configurações avançadas ou não permitir rodar containers.

---

## Componentes Chave Associados

| Componente | Função |
| --- | --- |
| **FROM** | Define imagem base. |
| **RUN** | Executa comando na imagem durante build. |
| **CMD / ENTRYPOINT** | Especifica comando padrão na inicialização do container. |
| **COPY / ADD** | Transfere arquivos do host para a imagem. |
| **WORKDIR** | Define diretório de trabalho dentro da imagem. |
| **VOLUME** | Declara diretórios para armazenamento persistente. |
| **EXPOSE** | Documentação de portas que o container escuta. |
| **TAG** | Nomeia versões de imagem, ex.: `meu-app:1.0`. |
| **docker run** | Cria e inicializa containers a partir de uma imagem. |
| **docker build** | Constrói imagens a partir de um `Dockerfile`. |

---

## Melhores Práticas e Padrões de Uso

1. **Imagens enxutas:** escolha variantes “slim” ou “alpine” quando possível para reduzir tamanho e superfície de ataque.
2. **Multi-stage builds:** separe fases de build e runtime para evitar levar ferramentas de compilação ao container de produção.
3. **Tags imutáveis:** use `:v1.2.3` em vez de `:latest` para garantir reprodutibilidade.
4. **Varredura de vulnerabilidades:** integre scanners (Trivy, Clair) no pipeline CI/CD.
5. **Least privilege:** execute processos como usuário não-root dentro do container.
6. **Volumes e dados:** isole dados de estado em volumes ou bind mounts, garantindo portabilidade e backup.

---

## Exemplo Prático Completo

Imagine um serviço simples em Go:

1. **Estrutura de pastas**
    
    ```
    my-go-app/
    ├── main.go
    └── go.mod
    
    ```
    
2. **Dockerfile multi-stage**
    
    ```
    # Build stage
    FROM golang:1.20-alpine AS builder
    WORKDIR /src
    COPY . .
    RUN go build -o /app/my-go-app
    
    # Runtime stage
    FROM alpine:3.18
    COPY --from=builder /app/my-go-app /usr/local/bin/
    EXPOSE 8080
    ENTRYPOINT ["/usr/local/bin/my-go-app"]
    
    ```
    
3. **Build e execução**
    
    ```bash
    docker build -t my-go-app:1.0 .
    docker run -d --name go-app -p 8080:8080 my-go-app:1.0
    
    ```
    

Este fluxo gera uma imagem pequena (somente binário + libs do Alpine) e separa a etapa de compilação, reduzindo a superfície de ataque e tempo de pull.

---

## Sugestões para Aprofundamento

- **Documentação Oficial Docker:** [https://docs.docker.com](https://docs.docker.com/)
- **Multi-Stage Builds:** [https://docs.docker.com/develop/develop-images/multistage-build/](https://docs.docker.com/develop/develop-images/multistage-build/)
- **Boas práticas de segurança:** compartilhar scans automatizados e práticas de hardening.
- **Ferramentas de orquestração:** Kubernetes, Docker Swarm – entender escalonamento e serviços distribuídos.

Com estes conceitos e exemplos, você terá uma visão clara de como **imagens** formam a base imutável e **containers** são as instâncias mutáveis que rodam seu software de forma isolada e portátil.