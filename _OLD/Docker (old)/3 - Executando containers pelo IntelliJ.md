Claro! Vamos criar dois tutoriais completos: um para executar containers Docker (start/stop) pelo IntelliJ usando `docker-compose.yml` e outro para debugar um container rodando no IntelliJ.

---

## Tutorial 1: Executando Containers Docker (Start/Stop) pelo IntelliJ usando `docker-compose.yml`

### Passo 1: Configurar o Docker no IntelliJ

1. **Pré-requisitos:**
   - Ter o arquivo dockerfile e docker-compose no projeto
   - Ter Docker Desktop instalado
   - Ter IntelliJ instalado.
   - Ter o plugin do Docker habilitado no intelliJ.

2. **Adicionar a Configuração do Docker:**
   - No intellij vá para `File` > `Settings` (ou `IntelliJ IDEA` > `Preferences` no macOS).
   - Navegue até `Build, Execution, Deployment` > `Docker`.
   - Clique no ícone `+` para adicionar uma nova configuração de Docker.
   - Selecione `Docker` e configure a conexão com o Docker. Normalmente, o IntelliJ detecta automaticamente a instalação do Docker Desktop.

### Passo 2: Criar e Configurar Docker-Compose

1. **Criar o arquivo `docker-compose.yml`:**
   - Na raiz do seu projeto, crie um arquivo chamado `docker-compose.yml` com o seguinte conteúdo:

   ```yaml
   version: '3.8'

   services:
     backend-app:
       build:
         context: ../..
         dockerfile: .docker/backend/Dockerfile
       ports:
         - "8080:8080"
         - "5005:5005"
       environment:
         ENVIROMENT_DEV_URL: http://localhost:8080
         DATABASE_HOSTNAME: db
         DATABASE_PORT: 5432
         DATABASE_NAME: SistemaIFES
         DATABASE_USER: postgres
         DATABASE_PSWD: 704980
   ```
### Passo 3: Adicionar uma Configuração de Docker-Compose no IntelliJ

1. **Adicionar Configuração de Docker-Compose:**
   - Vá para `Run` > `Edit Configurations...`.
   - Clique no ícone `+` para adicionar uma nova configuração.
   - Selecione `Docker-Compose`.
   - Configure da seguinte forma:
     - **Name:** Dê um nome para a configuração (por exemplo, `Docker-Compose Backend`).
     - **Docker Compose files:** Selecione o arquivo `docker-compose.yml` que você criou.
     - **Service:** Selecione o serviço que deseja controlar (por exemplo, `backend-app`).
     - **Commands:** Selecione `up` para iniciar os containers.

2. **Aplicar Configurações:**
   - Clique em `Apply` e depois em `OK`.

### Passo 4: Executar Containers pelo IntelliJ

1. **Iniciar Containers:**
   - Selecione a configuração `Docker-Compose Backend` no menu suspenso de configurações de execução na parte superior direita do IntelliJ IDEA.
   - Clique no ícone `Run` (ícone de seta verde) para iniciar os containers definidos no `docker-compose.yml`.

2. **Parar Containers:**
   - Clique no ícone `Stop` (ícone de quadrado vermelho) na mesma área para parar os containers.

3. **Verificar o Estado dos Containers:**
   - Vá para `View` > `Tool Windows` > `Services`.
   - No painel `Services`, você verá uma seção `Docker` onde pode monitorar os containers, visualizar logs, e realizar outras operações de gerenciamento.

---

## Tutorial 2: Debugando um Container Docker Rodando no IntelliJ

### Passo 1: Configurar o Docker para Depuração

1. **Ajustar Dockerfile:**
   - Atualize seu `Dockerfile` para expor a porta de depuração e adicionar as opções de depuração:

   ```dockerfile
   # Escolha da imagem base
   FROM maven:3.8.5-openjdk-17 AS build

   # Definição do autor/maintainer
   LABEL maintainer="seuemail@example.com"

   # Definição do diretório de trabalho
   WORKDIR /app

   # Copia o arquivo POM e as dependências do Maven
   COPY ../../pom.xml .

   # Baixa as dependências sem construir
   RUN mvn dependency:go-offline -B

   # Copia o código-fonte do projeto
   COPY ../../src ./src

   # Compilação do aplicativo
   RUN mvn clean package -DskipTests

   # Etapa 2: Imagem final
   FROM eclipse-temurin:17-jdk

   WORKDIR /app

   # Copia o JAR do estágio anterior
   COPY --from=build /app/target/*.jar app.jar

   # Porta exposta pela aplicação
   EXPOSE 8080
   EXPOSE 5005

   # Definição de variáveis de ambiente
   ENV ENVIROMENT_DEV_URL=http://localhost:8080
   ENV DATABASE_HOSTNAME=db
   ENV DATABASE_PORT=5432
   ENV DATABASE_NAME=SistemaIFES
   ENV DATABASE_USER=postgres
   ENV DATABASE_PSWD=704980

   # Comando para rodar a aplicação com opções de depuração
   ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", "-jar", "app.jar"]
   ```

2. **Atualizar docker-compose.yml:**
   - Certifique-se de que a porta de depuração está mapeada no `docker-compose.yml`:

   ```yaml
   version: '3.8'

   services:
     backend-app:
       build:
         context: ../..
         dockerfile: .docker/backend/Dockerfile
       ports:
         - "8080:8080"
         - "5005:5005"
       environment:
         ENVIROMENT_DEV_URL: http://localhost:8080
         DATABASE_HOSTNAME: db
         DATABASE_PORT: 5432
         DATABASE_NAME: SistemaIFES
         DATABASE_USER: postgres
         DATABASE_PSWD: 704980
   ```

### Passo 2: Adicionar Configuração de Depuração no IntelliJ

1. **Adicionar Configuração de Depuração Remota:**
   - Vá para `Run` > `Edit Configurations...`.
   - Clique no ícone `+` para adicionar uma nova configuração.
   - Selecione `Remote JVM Debug`.

2. **Configurar Conexão Remota:**
   - **Name:** Dê um nome para a configuração (por exemplo, `Debug Backend`).
   - **Host:** Defina como `localhost`.
   - **Port:** Defina como `5005`.

3. **Aplicar Configurações:**
   - Clique em `Apply` e depois em `OK`.

### Passo 3: Executar Containers e Iniciar Sessão de Depuração

1. **Iniciar Containers:**
   - Use a configuração `Docker-Compose Backend` para iniciar os containers.
   - Clique no ícone `Run` (ícone de seta verde).

2. **Iniciar Depuração:**
   - Após iniciar os containers, selecione a configuração `Debug Backend`.
   - Clique no ícone `Debug` (ícone de inseto) para iniciar a sessão de depuração.

3. **Parar Containers:**
   - Clique no ícone `Stop` (ícone de quadrado vermelho) na mesma área para parar os containers.

### Resumo dos Passos

1. **Adicionar e Configurar Docker no IntelliJ:**
   - Adicione uma configuração Docker.
   - Configure uma nova configuração `Docker-Compose`.

2. **Ajustar Dockerfile e docker-compose.yml para Depuração:**
   - Adicione a porta de depuração e as opções no `Dockerfile`.
   - Mapeie a porta de depuração no `docker-compose.yml`.

3. **Adicionar Configuração de Depuração Remota no IntelliJ:**
   - Adicione uma configuração `Remote JVM Debug` e configure-a.

4. **Usar IntelliJ para Controlar Containers e Depuração:**
   - Inicie os containers com `Docker-Compose Backend`.
   - Conecte-se para depurar com `Debug Backend`.
   - Pare os containers conforme necessário.

---

Seguindo esses tutoriais, você deve ser capaz de executar e depurar containers Docker diretamente pelo IntelliJ IDEA, incluindo a capacidade de iniciar, parar e depurar a aplicação.