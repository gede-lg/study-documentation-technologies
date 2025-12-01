# 6. Ambiente e Metadados

---

Os parâmetros de ambiente e metadados permitem injetar variáveis de configuração no contêiner e anotar seu manifesto com informações adicionais, úteis para configuração dinâmica, roteamento e orquestração.

---

### 6.1 `e`, `-env list`

- **Sintaxe**
    
    ```bash
    -e VAR1=valor1
    --env=VAR2=valor2
    
    ```
    
    Pode ser repetido várias vezes, ou fornecido como lista:
    
    ```bash
    docker run -e ENV=prod -e DEBUG=false ...
    
    ```
    
- **Descrição**
    
    Define variáveis de ambiente que serão disponibilizadas ao processo dentro do contêiner.
    
- **Conceito de Uso**
    
    – Parametrizar comportamento de aplicações sem reempacotar a imagem;
    
    – Diferenciar ambientes (dev, test, prod);
    
    – Injetar credenciais, URLs de serviços e flags de configuração.
    
- **Propriedades Internas**
    
    – Cada `VAR=valor` é adicionado em `Config.Env` no JSON de criação;
    
    – No ponto de inicialização, o runtime traduz essas entradas para o ambiente POSIX do processo.
    
- **Exemplo**
    
    ```bash
    docker run -d \
      -e NODE_ENV=production \
      -e DATABASE_URL="postgres://user:pass@db:5432/app" \
      my-node-app
    
    ```
    

---

### 6.2 `-env-file list`

- **Sintaxe**
    
    ```bash
    --env-file /caminho/para/arquivo.env
    
    ```
    
    Onde o arquivo segue o formato:
    
    ```
    VAR1=valor1
    VAR2="valor com espaços"
    # linhas começando com # são comentários
    
    ```
    
    Pode passar múltiplos arquivos repetindo a flag.
    
- **Descrição**
    
    Carrega variáveis de ambiente de um (ou mais) arquivo(s), evitando expor valores sensíveis na linha de comando.
    
- **Conceito de Uso**
    
    – Organizar configurações por ambiente em arquivos versionados ou mantidos fora do repositório;
    
    – Facilitar CI/CD, passando credenciais via arquivo seguro;
    
    – Reduzir comprimento de comando e risco de vazamento em histórico de shell.
    
- **Propriedades Internas**
    
    – Docker lê cada linha válida, faz *parse* de `KEY=VALUE` e mescla em `Config.Env`;
    
    – Linhas vazias ou comentadas são ignoradas; duplicatas são sobrescritas pela última ocorrência.
    
- **Exemplo**
    
    ```bash
    # arquivo .env:
    # ENV=staging
    # API_KEY=abcdef12345
    
    docker run --env-file .env my-service
    
    ```
    

---

### 6.3 `l`, `-label list`

- **Sintaxe**
    
    ```bash
    -l projeto=backend
    --label="tier=frontend"
    
    ```
    
    Pode ser repetido ou especificado como lista separada por vírgulas.
    
- **Descrição**
    
    Anexa metadados no formato chave=valor ao objeto contêiner no Docker Engine.
    
- **Conceito de Uso**
    
    – Identificar, filtrar e organizar contêineres;
    
    – Armazenar informações de owner, versão, commit SHA;
    
    – Facilitar integrações com sistemas de monitoramento e orquestração (Swarm, Kubernetes).
    
- **Propriedades Internas**
    
    – Popula `Config.Labels` no JSON de criação;
    
    – Permite consulta via `docker ps --filter label=projeto=backend`;
    
    – Labels são persistidos no metadado do contêiner e expostos em `docker inspect`.
    
- **Exemplo**
    
    ```bash
    docker run -d \
      --label="com.example.version=1.2.3" \
      --label="maintainer=joao.souza" \
      nginx
    
    ```
    

---

### 6.4 `-label-file list`

- **Sintaxe**
    
    ```bash
    --label-file /caminho/para/labels.txt
    
    ```
    
    Onde `labels.txt` contém:
    
    ```
    app=payments
    env=production
    
    ```
    
- **Descrição**
    
    Carrega múltiplos labels de um arquivo, evitando repetição no comando.
    
- **Conceito de Uso**
    
    – Gerenciar metadados complexos em um único arquivo;
    
    – Integrar com pipelines que geram labels dinamicamente.
    
- **Propriedades Internas**
    
    – Docker faz *parse* igual ao `--env-file`, mas preenche `Config.Labels`;
    
    – Duplicatas no arquivo são resolvidas pela última linha lida.
    
- **Exemplo**
    
    ```bash
    # labels.txt:
    # component=auth
    # release=2025-06-01
    
    docker run --label-file labels.txt my-auth-service
    
    ```
    

---

### 6.5 `-annotation map`

- **Sintaxe**
    
    ```bash
    --annotation io.kubernetes.pod.name=my-pod
    --annotation user.metadata.owner=ti-team
    
    ```
    
- **Descrição**
    
    (OCI runtime) Adiciona anotações arbitrárias ao contêiner, repassadas ao runtime OCI subjacente (containerd, runc).
    
- **Conceito de Uso**
    
    – Transmitir instruções ou metadados específicos para runtimes ou sistemas de orquestração;
    
    – Exemplos: marcações de segurança, flags de profiling, identificadores de tracing.
    
- **Propriedades Internas**
    
    – Mapeado para o campo `annotations` no *spec* do OCI JSON;
    
    – Preservado no metadado interno do runtime e visível em `docker inspect --format '{{ .Annotations }}'`.
    
- **Exemplo**
    
    ```bash
    docker run \
      --annotation io.containerd.snapshotter.v1=true \
      --annotation tracing.span_id=abcdef123456 \
      alpine echo "Hello"
    
    ```
    

---

## Boas Práticas

1. **Segurança**
    - Prefira `-env-file` a expor variáveis sensíveis em linhas de comando que ficam em histórico.
2. **Organização**
    - Utilize labels para agrupar contêineres por projeto, versão e owner.
3. **Orquestração**
    - Annotations são poderosas em ambientes Kubernetes ou containerd para passar informações de nível de runtime sem alterar a imagem.

Com estas definições, você domina como configurar variáveis de ambiente e metadados no Docker, promovendo contêineres configuráveis, auditáveis e integráveis a sistemas de orquestração.