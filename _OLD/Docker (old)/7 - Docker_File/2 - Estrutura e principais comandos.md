### Estrutura de um Dockerfile Completo

Um Dockerfile completo geralmente segue uma estrutura lógica que inclui os seguintes componentes:

1. **Escolha da Imagem Base**: A imagem de base define o sistema operacional e o ambiente inicial.
2. **Instalação de Dependências**: Instala pacotes e bibliotecas necessários.
3. **Cópia de Arquivos**: Copia os arquivos do código-fonte e outros recursos necessários.
4. **Compilação e Construção**: Realiza etapas de compilação e construção do aplicativo.
5. **Configuração de Variáveis de Ambiente**: Define variáveis de ambiente necessárias.
6. **Configuração de Porta e Exposição**: Especifica quais portas serão expostas.
7. **Definição do Comando de Entrada**: Define o comando que será executado quando o contêiner iniciar.

### Exemplo de Estrutura de Dockerfile

```Dockerfile
# Escolha da imagem base
FROM openjdk:17-jdk-slim

# Definição do autor/maintainer
LABEL maintainer="seuemail@example.com"

# Definição do diretório de trabalho
WORKDIR /app

# Instalação de dependências (se necessário) ou execução de processos
RUN apt-get update && apt-get install -y \
    maven \
    && rm -rf /var/lib/apt/lists/*

# Copia do arquivo POM e código fonte
COPY pom.xml .
COPY src ./src

# Compilação do aplicativo
RUN mvn clean package -DskipTests

# Definição de variáveis de ambiente
ENV JAVA_OPTS=""

# Cópia do arquivo JAR gerado para o diretório de trabalho
COPY target/meuapp.jar meuapp.jar

# Exposição da porta
EXPOSE 8080

# Comando de entrada
ENTRYPOINT ["java","-jar","meuapp.jar"]
```

### Lista de 30 Comandos Dockerfile

#### Comandos Básicos

1. **FROM**
   - **Sintaxe**: `FROM <imagem_base>:<tag>`
   - **Descrição**: Define a imagem base para a construção da nova imagem.
   - **Quando Utilizar**: Sempre no início do Dockerfile.
   - **Exemplo**: `FROM ubuntu:20.04`

2. **LABEL**
   - **Sintaxe**: `LABEL chave=valor`
   - **Descrição**: Adiciona metadados à imagem.
   - **Quando Utilizar**: Para documentar informações como o mantenedor da imagem.
   - **Exemplo**: `LABEL maintainer="seuemail@example.com"`

3. **RUN**
   - **Sintaxe**: `RUN <comando>`
   - **Descrição**: Executar comandos durante a construção da imagem (em uma nova camada da imagem).
   - **Quando Utilizar:** É usado para instalar pacotes, configurar o ambiente e fazer qualquer coisa que altere a imagem antes dela ser finalizada.
   - **Exemplo**: `RUN apt-get update && apt-get install -y curl`

4. **COPY**
   - **Sintaxe**: `COPY <origem> <destino>`
   - **Descrição**: Copia arquivos ou diretórios do sistema host para o sistema de arquivos do contêiner.
   - **Quando Utilizar**: Para copiar código-fonte, arquivos de configuração, etc.
   - **Exemplo**: `COPY . /app`

5. **ADD**
   - **Sintaxe**: `ADD <origem> <destino>`
   - **Descrição**: Copia arquivos ou diretórios do sistema host para o sistema de arquivos do contêiner e pode extrair arquivos tar.
   - **Quando Utilizar**: Quando precisar descompactar arquivos durante a cópia.
   - **Exemplo**: `ADD arquivo.tar.gz /app`

#### Configuração de Ambiente

6. **ENV**
   - **Sintaxe**: `ENV <chave>=<valor>`
   - **Descrição**: Define variáveis de ambiente.
   - **Quando Utilizar**: Para definir configurações do ambiente do contêiner.
   - **Exemplo**: `ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64`

7. **ARG**
   - **Sintaxe**: `ARG <nome>[=<valor>]`
   - **Descrição**: Define variáveis de construção que podem ser passadas durante o build.
   - **Quando Utilizar**: Para passar argumentos dinâmicos durante a construção da imagem.
   - **Exemplo**: `ARG APP_VERSION=1.0.0`

#### Definição de Diretório de Trabalho

8. **WORKDIR**
   - **Sintaxe**: `WORKDIR <caminho>`
   - **Descrição**: Define o diretório de trabalho para comandos subsequentes.
   - **Quando Utilizar**: Para definir o diretório em que os comandos `RUN`, `CMD`, `ENTRYPOINT`, `COPY` e `ADD` serão executados.
   - **Exemplo**: `WORKDIR /app`

#### Exposição de Portas

9. **EXPOSE**
   - **Sintaxe**: `EXPOSE <porta>`
   - **Descrição**: Documenta a porta que o contêiner escuta em tempo de execução.
   - **Quando Utilizar**: Para expor portas necessárias para a aplicação.
   - **Exemplo**: `EXPOSE 8080`

#### Definição de Volumes

10. **VOLUME**
    - **Sintaxe**: `VOLUME [<caminho>]`
    - **Descrição**: Cria um ponto de montagem para armazenar dados persistentes.
    - **Quando Utilizar**: Para definir volumes que armazenarão dados persistentes.
    - **Exemplo**: `VOLUME /data`

#### Execução de Comandos

11. **CMD**
    - **Sintaxe**: `CMD ["executável", "param1", "param2"]`
    - **Descrição**: Definir o comando padrão que será executado quando um contêiner da imagem for iniciado ( pode ser sobrescrito se passado comandos na execução do container).
    - **Quando Utilizar**: Para definir o comando principal da aplicação.
    - **Exemplo**: `CMD ["java", "-jar", "app.jar"]`

12. **ENTRYPOINT**
    - **Sintaxe**: `ENTRYPOINT ["executável", "param1", "param2"]`
    - **Descrição**: Define um comando que será sempre executado quando o contêiner é iniciado.
    - **Quando Utilizar**: Para definir o comando que deve ser executado obrigatoriamente.
    - **Exemplo**: `ENTRYPOINT ["java", "-jar", "app.jar"]`

13. **SHELL**
    - **Sintaxe**: `SHELL ["executable", "parameters"]`
    - **Descrição**: Define o shell a ser usado para os comandos subsequentes.
    - **Quando Utilizar**: Para alterar o shell padrão de `/bin/sh`.
    - **Exemplo**: `SHELL ["powershell", "-Command"]`

#### Outros Comandos

14. **USER**
    - **Sintaxe**: `USER <usuário>`
    - **Descrição**: Define o usuário que executará os comandos subsequentes.
    - **Quando Utilizar**: Para rodar o contêiner com um usuário não root.
    - **Exemplo**: `USER appuser`

15. **ONBUILD**
    - **Sintaxe**: `ONBUILD <instrução>`
    - **Descrição**: Adiciona uma instrução que será executada quando a imagem for usada como base para outra imagem.
    - **Quando Utilizar**: Para definir instruções que devem ser executadas em builds subsequentes.
    - **Exemplo**: `ONBUILD COPY . /app`

16. **STOPSIGNAL**
    - **Sintaxe**: `STOPSIGNAL <sinal>`
    - **Descrição**: Define o sinal que será enviado ao contêiner para pará-lo.
    - **Quando Utilizar**: Para definir um sinal de parada personalizado.
    - **Exemplo**: `STOPSIGNAL SIGTERM`

17. **HEALTHCHECK**
    - **Sintaxe**: `HEALTHCHECK [opções] CMD <comando>`
    - **Descrição**: Verifica a saúde do contêiner.
    - **Quando Utilizar**: Para monitorar a saúde da aplicação dentro do contêiner.
    - **Exemplo**: `HEALTHCHECK --interval=30s CMD curl -f http://localhost/health || exit 1`

18. **COPY --chown**
    - **Sintaxe**: `COPY --chown=<usuário>:<grupo> <origem> <destino>`
    - **Descrição**: Copia arquivos ou diretórios com um dono especificado.
    - **Quando Utilizar**: Para copiar arquivos com permissões específicas.
    - **Exemplo**: `COPY --chown=appuser:appgroup . /app`

19. **ADD --chown**
    - **Sintaxe**: `ADD --chown=<usuário>:<grupo> <origem> <destino>`
    - **Descrição**: Adiciona arquivos ou diret

órios com um dono especificado.
    - **Quando Utilizar**: Para adicionar arquivos com permissões específicas.
    - **Exemplo**: `ADD --chown=appuser:appgroup arquivo.tar.gz /app`

20. **ARG --default**
    - **Sintaxe**: `ARG <nome>[=<valor padrão>]`
    - **Descrição**: Define variáveis de build com valor padrão.
    - **Quando Utilizar**: Para definir argumentos com valores padrão durante o build.
    - **Exemplo**: `ARG VERSION=1.0.0`

21. **COPY --from**
    - **Sintaxe**: `COPY --from=<estágio> <origem> <destino>`
    - **Descrição**: Copia arquivos de um estágio específico em um build multi-stage.
    - **Quando Utilizar**: Para copiar artefatos de um estágio anterior.
    - **Exemplo**: `COPY --from=build /app/target/app.jar /app/app.jar`

#### Build Multi-stage

22. **FROM --platform**
    - **Sintaxe**: `FROM --platform=<plataforma> <imagem_base>:<tag>`
    - **Descrição**: Define a plataforma da imagem base.
    - **Quando Utilizar**: Para construir imagens para plataformas específicas.
    - **Exemplo**: `FROM --platform=linux/amd64 ubuntu:20.04`

23. **COPY --link**
    - **Sintaxe**: `COPY --link <origem> <destino>`
    - **Descrição**: Cria links simbólicos em vez de copiar arquivos.
    - **Quando Utilizar**: Para criar links simbólicos durante a cópia de arquivos.
    - **Exemplo**: `COPY --link ./src /app/src`

#### Otimização de Build

24. **RUN --mount**
    - **Sintaxe**: `RUN --mount=type=<tipo>,<opções> <comando>`
    - **Descrição**: Usa mounts durante a execução de comandos para melhorar o desempenho.
    - **Quando Utilizar**: Para montar caches ou volumes temporários durante o build.
    - **Exemplo**: `RUN --mount=type=cache,target=/root/.m2 mvn install`

25. **COPY --link**
    - **Sintaxe**: `COPY --link <origem> <destino>`
    - **Descrição**: Cria links simbólicos em vez de copiar arquivos.
    - **Quando Utilizar**: Para criar links simbólicos durante a cópia de arquivos.
    - **Exemplo**: `COPY --link ./src /app/src`

26. **RUN --network**
    - **Sintaxe**: `RUN --network=<rede> <comando>`
    - **Descrição**: Define a rede a ser usada durante a execução de um comando.
    - **Quando Utilizar**: Para controlar a conectividade de rede durante o build.
    - **Exemplo**: `RUN --network=host apt-get update`

#### Segurança

27. **USER**
    - **Sintaxe**: `USER <usuário>`
    - **Descrição**: Define o usuário que executará os comandos subsequentes.
    - **Quando Utilizar**: Para rodar o contêiner com um usuário não root.
    - **Exemplo**: `USER appuser`

#### Manutenção

28. **ONBUILD**
    - **Sintaxe**: `ONBUILD <instrução>`
    - **Descrição**: Adiciona uma instrução que será executada quando a imagem for usada como base para outra imagem.
    - **Quando Utilizar**: Para definir instruções que devem ser executadas em builds subsequentes.
    - **Exemplo**: `ONBUILD COPY . /app`

#### Debugging

29. **HEALTHCHECK**
    - **Sintaxe**: `HEALTHCHECK [opções] CMD <comando>`
    - **Descrição**: Verifica a saúde do contêiner.
    - **Quando Utilizar**: Para monitorar a saúde da aplicação dentro do contêiner.
    - **Exemplo**: `HEALTHCHECK --interval=30s CMD curl -f http://localhost/health || exit 1`

#### Métodos Avançados

30. **STOPSIGNAL**
    - **Sintaxe**: `STOPSIGNAL <sinal>`
    - **Descrição**: Define o sinal que será enviado ao contêiner para pará-lo.
    - **Quando Utilizar**: Para definir um sinal de parada personalizado.
    - **Exemplo**: `STOPSIGNAL SIGTERM`

### Exemplo Completo de Dockerfile para uma Aplicação Java Spring Boot 3 com Maven

A seguir, um exemplo completo de um Dockerfile para uma aplicação Java Spring Boot 3 usando Maven:

```Dockerfile
# Estágio de construção
FROM maven:3.8.6-openjdk-17-slim AS build
LABEL maintainer="seuemail@example.com"

# Define o diretório de trabalho
WORKDIR /app

# Copia o arquivo POM e baixa as dependências
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia o código-fonte
COPY src ./src

# Compila e constrói o aplicativo
RUN mvn clean package -DskipTests

# Estágio de execução
FROM openjdk:17-jdk-slim
LABEL maintainer="seuemail@example.com"

# Define o diretório de trabalho
WORKDIR /app

# Copia o JAR do estágio de construção
COPY --from=build /app/target/meuapp.jar meuapp.jar

# Define variáveis de ambiente
ENV JAVA_OPTS=""

# Exposição da porta
EXPOSE 8080

# Define o comando de entrada
ENTRYPOINT ["java", "-jar", "meuapp.jar"]
```

### Considerações Finais

Este guia forneceu uma visão abrangente sobre a criação de Dockerfiles, abordando desde a estrutura básica até comandos avançados e um exemplo prático para uma aplicação Java Spring Boot. Lembre-se de que a escolha de comandos e a estrutura do Dockerfile podem variar dependendo das necessidades específicas da sua aplicação e do ambiente de execução.

Se precisar de mais detalhes ou exemplos específicos, não hesite em perguntar!