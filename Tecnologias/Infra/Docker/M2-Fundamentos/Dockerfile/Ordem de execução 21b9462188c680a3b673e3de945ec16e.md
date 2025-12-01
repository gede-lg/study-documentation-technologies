# Ordem de execução

---

## 1. Introdução

Ter clareza sobre como o Docker processa cada instrução de um Dockerfile é essencial para:

- **Maximizar a performance de build**, aproveitando ao máximo o cache de camadas;
- **Garantir reprodutibilidade**, de modo que qualquer pessoa executando o mesmo Dockerfile obtenha resultados idênticos;
- **Reduzir o tamanho** final da imagem, evitando camadas desnecessárias ou artefatos esquecidos.

Este guia aprofunda os mecanismos internos que governam a ordem de execução, a criação de camadas e as sutilezas que influenciam seu fluxo de trabalho.

---

## 2. Sumário

1. Conceitos Fundamentais
2. Mecanismos de Cache e Identificação de Camadas
3. União de Camadas: Union File System
4. Fluxo de Execução por Tipo de Instrução
5. Multi-Stage Builds
6. Cenários de Aplicação e Limitações
7. Melhores Práticas e Padrões de Uso
8. Sugestões para Aprofundamento

---

## 3. Conceitos Fundamentais

### 3.1 Camadas (Layers)

Cada instrução válida do Dockerfile (`RUN`, `COPY`, `ADD`, etc.) gera uma **camada** imutável. Essas camadas são organizadas em sequência: o resultado de uma camada “acima” serve de base para a próxima.

### 3.2 Imagem vs. Container

- **Imagem**: conjunto estático de camadas, não mutável.
- **Container**: instância em execução que monta essas camadas em um sistema de arquivos “mergeado” e adiciona uma camada superior de leitura-escrita.

### 3.3 Contexto de Build

O “contexto” é o diretório (e subdiretórios) enviado ao daemon Docker no início do build. Tudo que for referenciado em `COPY`/`ADD` deve estar nesse contexto.

### 3.4 Variáveis de Construção

- **`ARG`**: disponível apenas durante o build; influencia instruções posteriores, mas não persiste na imagem final.
- **`ENV`**: define variáveis de ambiente que permanecem no container final e podem ser usadas em tempo de execução.

---

## 4. Mecanismos de Cache e Identificação de Camadas

1. **Hash da Instrução**
    - Docker calcula um hash de cada instrução **e** dos seus inputs (arquivos copiados, valores de ARG, etc.).
2. **Validação de Cache**
    - Se o hash bater com uma camada já existente localmente, o Docker **reusa** essa camada, pulando reexecução.
    - Caso contrário, executa a instrução e cria nova camada.
3. **Invalidando Cache**
    - Qualquer mudança em uma instrução ou no contexto afeta essa camada e invalida **todas** as subsequentes.
    - Exemplo: alterar um único arquivo copiado por `COPY . /app` forçará reboot de todas as etapas posteriores.

---

## 5. União de Camadas: Union File System

O Docker utiliza UFS (overlay2 ou similar) para “empilhar” camadas:

- **Camadas inferiores**: contêm binários do sistema base, bibliotecas e dependências instaladas cedo no build.
- **Camadas intermediárias**: representam alterações incrementais – instalações, cópia de fontes, builds.
- **Camada superior de container**: onde o runtime grava logs, dados temporários e volumes.

Esse modelo traz:

- **Desduplicação de armazenamento**: blocos idênticos nas camadas compartilham o mesmo espaço físico.
- **Invariância**: camadas não podem ser alteradas após criadas; qualquer modificação gera uma nova camada.

---

## 6. Fluxo de Execução por Tipo de Instrução

1. **`FROM`**
    - Ponto de partida. Você pode ter múltiplos estágios (multi-stage), cada `FROM` inicia um novo builder.
2. **`ARG`**
    - Declara variáveis de build. Disponíveis somente a partir da linha em que são definidas até o fim do estágio.
3. **`ENV`**
    - Define variáveis que ficarão persistentes no container final, podendo ser sobrepostas em tempo de execução.
4. **`RUN`**
    - Executa comandos no shell (default `/bin/sh -c`). Cada `RUN` cria uma camada nova com o resultado da execução.
    - **Best practice**: agrupe vários comandos em um só `RUN` (utilizando `&&`) para reduzir número de camadas.
5. **`COPY` / `ADD`**
    - Transfere arquivos do contexto de build para a imagem.
    - `ADD` também aceita URLs e arquivos compactados, mas é menos previsível; prefira `COPY` sempre que possível.
6. **`WORKDIR`**
    - Define o diretório de trabalho para instruções subsequentes, evitando `cd` repetido em `RUN`.
7. **`EXPOSE`**
    - Declara portas que serão acessíveis em tempo de execução. Não abre efetivamente portas, mas documenta intenções.
8. **`VOLUME`**
    - Marca diretórios para volumes anônimos — evita que dados sejam empacotados na imagem e salva persistência externa.
9. **`USER`**
    - Muda o usuário efetivo para instruções seguintes, reforçando segurança e menor privilégio.
10. **`ENTRYPOINT` / `CMD`**
    - Definem o processo que será executado quando o container iniciar. `ENTRYPOINT` fixa o executável; `CMD` fornece argumentos padrão, podendo ser sobrescritos.

---

## 7. Multi-Stage Builds

- **Objetivo:** separar etapas de compilação (que geram artefatos) das etapas de runtime, resultando em imagens menores e sem ferramentas de build.
- **Funcionamento:** cada estágio usa `FROM` e pode referenciar artefatos de estágios anteriores via `COPY --from=stage`.
- **Benefícios conceitos:**
    - **Isolamento de dependências**: build dependencies não vão para a imagem final.
    - **Segurança**: reduz superfície de ataque.
    - **Performance**: imagens finais são menores e carregam mais rápido.

---

## 8. Cenários de Aplicação e Limitações

### Quando Adotar

- **CICD com Builds Frequentes:** aproveitamento robusto de cache em pipelines.
- **Microserviços:** images enxutas e reprodutíveis para escala horizontal.
- **Ambientes de Produção Sensíveis:** necessidades de segurança e compliance.

### Onde Evitar

- **Conteúdo Altamente Dinâmico:** projetos onde quase tudo muda a cada build (cache pouco efetivo).
- **Prototipação Rápida:** durante fases de sandboxing, pode-se priorizar velocidade de iteração sobre otimização de camadas.

---

## 9. Melhores Práticas e Padrões de Uso

1. **ORDEM LÓGICA**
    - Separe instruções “imutáveis” (instalação de dependências) das “variáveis” (cópia de código).
2. **MINIMIZE CAMADAS**
    - Prefira combinar comandos relacionados em um único `RUN`.
3. **USE `.dockerignore`**
    - Exclua arquivos inúteis (logs locais, dependências de IDE) do contexto, reduzindo overhead.
4. **VARIÁVEIS DE BUILD**
    - Utilize `ARG` para parâmetros como versões de dependências, permitindo customizações sem alterar Dockerfile.
5. **IMAGENS BASE PEQUENAS**
    - Comece de imagens “slim” ou “alpine” quando possível; balanceie tamanho x compatibilidade.

---

## 10. Sugestões para Aprofundamento

- **Documentação Oficial Docker:**
    - *Dockerfile reference*
    - *BuildKit docs*
- **Artigos Técnicos:**
    - “Deep Dive into BuildKit”
    - “Layer Caching Strategies”
- **Tópicos de Pesquisa:**
    - *Content trust no Docker*, *docker-slim*, *security scanning*

---

> Caso deseje todo este conteúdo formatado em um único arquivo Markdown para referência ou compartilhamento, posso gerá-lo e disponibilizá-lo para download.
>