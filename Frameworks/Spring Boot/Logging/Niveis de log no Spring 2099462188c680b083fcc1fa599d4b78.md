# Niveis de log no Spring

---

## Sumário

1. [Introdução](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#introdu%C3%A7%C3%A3o)
2. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
    1. O que é Logging
    2. Importância do Logging em Aplicações Spring Boot
    3. Como o Spring Boot Gerencia Logs (SLF4J + Logback)
3. [Níveis de Log: Definições e Propósitos](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#n%C3%ADveis-de-log-defini%C3%A7%C3%B5es-e-prop%C3%B3sitos)
    1. TRACE
    2. DEBUG
    3. INFO
    4. WARN
    5. ERROR
4. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Configuração de Logging no Spring Boot
        - `application.properties`
        - `application.yml`
        - `logback-spring.xml`
    2. Criando e Obtendo um Logger no Código
        - Usando SLF4J diretamente
        - Usando a anotação Lombok `@Slf4j`
    3. Exemplos de Código Comentados (Trace → Error)
    4. Variações de Sintaxe (Classes de Logger, Loggers por Pacote, etc.)
5. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
    1. Performance e Verbosidade Excessiva
    2. Ambientes de Produção vs. Desenvolvimento
    3. Outras Alternativas (APM, Monitoramento Externo)
6. [Componentes-Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. **SLF4J** (Simple Logging Facade for Java)
    2. **Logback** (Implementação Padrão no Spring Boot)
    3. **Anotações do Lombok para Logging** (`@Slf4j`, `@Log4j2`, etc.)
    4. **Classes e Interfaces Principais**
        - `org.slf4j.Logger`
        - `org.slf4j.LoggerFactory`
    5. **Arquivos de Configuração**
        - `application.properties` / `application.yml`
        - `logback-spring.xml`
        - `logback.xml`
7. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
    1. Escolha Adequada de Níveis para Cada Mensagem
    2. Uso de Mensagens Parametrizadas em vez de Concatenação
    3. Evitar Lógica Pesada Dentro de Chamadas de Log
    4. Agrupar Configurações por Pacote/Classe
    5. Rolar Arquivos de Log (Rolling Policies)
8. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
    1. Cenário Proposto
    2. Estrutura de Projeto (Breve Visão Geral)
    3. Configuração de Logging (`application.yml` + `logback-spring.xml`)
    4. Classe de Serviço com Uso dos 5 Níveis de Log
    5. Classe de Controller Expondo Endpoints e Logs Correspondentes
    6. Saída Esperada (Fragmentos de Logs em Tempo de Execução)
9. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 1. Introdução

Em aplicações Java, especialmente em projetos Spring Boot, o **logging** (registro de eventos em arquivos ou consoles) é uma prática indispensável para monitorar o comportamento da aplicação em diferentes ambientes (desenvolvimento, homologação e produção). Registrar informações de execução, erros e avisos ajuda a diagnosticar problemas, entender fluxos de execução e manter rastreabilidade de falhas.

O Spring Boot, por padrão, já traz uma configuração de logging integrada (baseada em SLF4J e Logback). Entender **os diferentes níveis de log** – *Trace*, *Debug*, *Info*, *Warn* e *Error* – e saber quando e como utilizá-los de forma adequada é fundamental para manter a aplicação legível, evitar poluição de logs e facilitar a manutenção no dia a dia.

---

## 2. Conceitos Fundamentais

### 2.1 O que é Logging

- **Logging** é o processo de registrar informações sobre a execução de uma aplicação: erros, advertências, informações operacionais e detalhes de debug.
- Em Java, utiliza-se normalmente uma **API de logging** (como SLF4J) desacoplada de uma **implementação concreta** (como Logback, Log4j2, etc.).

### 2.2 Importância do Logging em Aplicações Spring Boot

1. **Diagnóstico de Problemas**: Permite traçar a origem de exceções e comportamentos inesperados.
2. **Monitoramento em Produção**: Coleta de métricas de uso, tempo de resposta e taxas de erro. Logs podem alimentar sistemas de monitoramento (ELK, Grafana, etc.).
3. **Auditoria**: Em contextos onde é necessário rastrear ações do usuário ou mudanças de estado.
4. **Desenvolvimento e Depuração**: Facilita o trabalho diário de engenharia, com informações detalhadas sobre fluxos e variáveis no runtime.

### 2.3 Como o Spring Boot Gerencia Logs (SLF4J + Logback)

- **SLF4J (Simple Logging Facade for Java)**: API de abstração/mapeamento. Seu código refere-se às classes do pacote `org.slf4j.*`.
- **Logback**: Implementação padrão que o Spring Boot configura automaticamente quando não há outra implementação explícita.
- O Spring Boot fornece uma configuração padrão de log no console e gera arquivos de log rotativos se `logback-spring.xml` for fornecido.
- **Níveis de Log**: Cada framework ou biblioteca (Spring, Hibernate, Apache, etc.) possui seu próprio logger. A configuração de nível pode ser feita globalmente ou por pacote específico.

---

## 3. Níveis de Log: Definições e Propósitos

O modelo de níveis de log segue a hierarquia abaixo (da maior quantidade de detalhes para a menor). Um nível mais alto “inclui” todos os inferiores (por exemplo, se o nível for **DEBUG**, serão exibidas mensagens com nível **DEBUG**, **INFO**, **WARN** e **ERROR**, mas NÃO **TRACE**).

```
TRACE < DEBUG < INFO < WARN < ERROR

```

### 3.1 TRACE

- **Definição**: O nível mais granular. Registra detalhes extremamente verbosos da aplicação.
- **Uso Típico**:
    - Acompanhar passo a passo do fluxo de execução de métodos/chamadas internas.
    - Informações sobre valores de variáveis, tempo de execução de pequenas seções, iterações em loops, etc.
- **Quando Empregar**:
    - Em ambiente de desenvolvimento, apenas quando necessário monitorar cada detalhe do fluxo.
    - Diagnóstico de bugs muito sutis.
- **Exemplos de Conteúdo**:
    - Entradas e saídas de métodos, inclusão de valores de parâmetros, mapeamentos internos de frameworks (ex.: SQL gerado, binding de objetos).

### 3.2 DEBUG

- **Definição**: Menos detalhado que TRACE, mas ainda bem verboso. Ajuda a entender logicamente como a aplicação está fluindo.
- **Uso Típico**:
    - Registrar:
        - Pontos de início e fim de métodos de negócio.
        - Valores de configuração carregados.
        - SQL executado (sem precisar registro extremamente detalhado de cada coluna).
    - Em ambiente de desenvolvimento para acompanhar:
        - Fluxos de serviço, controle de transações, chamadas a repositórios, etc.
- **Quando Empregar**:
    - Para entender problema de lógica ou fluxo em ambiente de testes/desenvolvimento.
    - Quando é necessário mais do que INFO, mas não tanto quanto TRACE.

### 3.3 INFO

- **Definição**: Nível de log “normal” para informações gerais de execução.
- **Uso Típico**:
    - Registrar eventos de início de aplicação, carregamento de contexto do Spring, acesso a endpoints principais, configurações iniciais.
    - Ações de negócio relevantes (e.g., usuário X iniciou sessão, pedido Y foi criado).
- **Quando Empregar**:
    - Em produção, para monitorar operações normais sem poluir demais.
    - Indicar marcos de execução (startup, shutdown, carga de dados, etc.).
- **Exemplos de Conteúdo**:
    - Logs de inicialização: “Application started on port 8080”.
    - Ações de interesse comercial: “Usuário 123 realizou compra do pedido 456”.

### 3.4 WARN

- **Definição**: Indica situações anormais que não impediram o funcionamento da aplicação, mas podem evoluir para problemas.
- **Uso Típico**:
    - Configurações padrão não recomendadas, uso deprecated de funcionalidades, tempo de resposta acima de certo limiar que ainda não quebrou algo.
    - Aviso de potencial problema: “Não foi possível carregar propriedade X, usando valor padrão Y”.
- **Quando Empregar**:
    - Situações que merecem atenção, mas não justificam erro (e.g., dados inconsistentes, mas que foram “corrigidos” automaticamente).

### 3.5 ERROR

- **Definição**: Registra falhas que impediram operação normal, exceções não tratadas, erros críticos.
- **Uso Típico**:
    - Exceções não capturadas (stacktraces), falhas em conexões a bancos, falhas graves de negócio (e.g., pagamento não processado).
- **Quando Empregar**:
    - Qualquer exceção que finalize uma transação ou impeça a continuação de um fluxo essencial.
- **Exemplos de Conteúdo**:
    - Mensagens de exceção acompanhadas de stacktrace.
    - Configuração crítica ausente (“Env var X não encontrada, aplicação não pôde iniciar”).

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1 Configuração de Logging no Spring Boot

### 4.1.1 `application.properties`

O Spring Boot, por padrão, define o nível de log global em **`INFO`**. Para ajustar, basta indicar propriedades:

```
# Define nível global (todos os pacotes) como DEBUG
logging.level.root=DEBUG

# Define nível específico para um pacote ou classe
logging.level.com.meuprojeto.servico=TRACE

# Ajusta saída (console, arquivo, etc.)
logging.file.name=app.log
logging.file.path=/var/logs/minha-aplicacao

# Formato de padrão de mensagem (opcional)
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level %logger{36} - %msg%n

```

### 4.1.2 `application.yml`

A mesma configuração em YAML:

```yaml
logging:
  level:
    root: DEBUG
    com:
      meuprojeto:
        servico: TRACE
  file:
    name: app.log
    path: /var/logs/minha-aplicacao
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level %logger{36} - %msg%n"

```

### 4.1.3 `logback-spring.xml`

Quando se quer maior controle (rolagem de logs, formatos avançados), utiliza-se um arquivo XML:

```xml
<!-- src/main/resources/logback-spring.xml -->
<configuration>

  <!-- Definição de padrão de conversão -->
  <property name="CONSOLE_PATTERN"
            value="%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"/>

  <!-- Appender de Console -->
  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>${CONSOLE_PATTERN}</pattern>
    </encoder>
  </appender>

  <!-- Appender de Arquivo com Rollover Diário -->
  <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>logs/app.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <!-- Arquivos de backup: app.log.2025-06-05.gz, etc. -->
      <fileNamePattern>logs/app.%d{yyyy-MM-dd}.log.gz</fileNamePattern>
      <maxHistory>30</maxHistory>
    </rollingPolicy>
    <encoder>
      <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level %logger{36} - %msg%n</pattern>
    </encoder>
  </appender>

  <!-- Níveis de Logging -->
  <!-- Nível padrão para toda a aplicação: INFO -->
  <root level="INFO">
    <appender-ref ref="STDOUT"/>
    <appender-ref ref="FILE"/>
  </root>

  <!-- Nível específico para pacotes -->
  <logger name="com.meuprojeto.servico" level="DEBUG"/>
  <logger name="org.springframework.web" level="WARN"/>

</configuration>

```

> Observação: Usar logback-spring.xml permite que o Spring Boot injete variáveis de ambiente diretamente, se necessário. Basta usar ${} em propriedades.
> 

---

### 4.2 Criando e Obtendo um Logger no Código

### 4.2.1 Usando SLF4J Diretamente

```java
package com.meuprojeto.servico;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MeuServico {

    // Obtendo instância de Logger pelo nome da classe
    private static final Logger logger = LoggerFactory.getLogger(MeuServico.class);

    public void executarTarefa() {
        logger.trace("Começando método executarTarefa com parâmetros X={}, Y={}", 10, "teste");
        logger.debug("Processando dados internos...");

        try {
            // Lógica de negócio
            logger.info("Tarefa iniciada com sucesso.");
            // ...
        } catch (Exception e) {
            logger.error("Falha ao executar tarefa: {}", e.getMessage(), e);
        }
    }
}

```

- **`LoggerFactory.getLogger(...)`**: instancia de logger; internamente, o SLF4J delega para Logback (ou outra implementação configurada).
- As chamadas `logger.trace(...)`, `logger.debug(...)`, etc., verificam se o nível está habilitado antes de efetuar a formatação.

### 4.2.2 Usando Anotação Lombok `@Slf4j`

Se estiver usando Lombok, basta adicionar a anotação na classe:

```java
package com.meuprojeto.servico;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class MeuServicoComLombok {

    public void executarTarefa() {
        log.trace("Iniciando execução detalhada - TRACE");
        log.debug("Dados internos: {} e {}", 42, "valor");

        log.info("Tarefa principal começou.");
        try {
            // ...
        } catch(Exception e) {
            log.error("Erro crítico no serviço: {}", e.getMessage(), e);
        }
    }
}

```

- O Lombok gera, em tempo de compilação, o atributo `private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(NomeDaClasse.class);`.

---

### 4.3 Exemplos de Código Comentados

A seguir, exemplos de uso para cada nível de log dentro de uma mesma classe:

```java
package com.exemplo.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ExemploLogger {

    private static final Logger logger = LoggerFactory.getLogger(ExemploLogger.class);

    public void demonstrarNiveis() {
        // TRACE: registra cada passo minucioso do método.
        if (logger.isTraceEnabled()) {
            logger.trace("TRACE: Iniciando método demonstrarNiveis() - detalhes internos.");
        }

        // DEBUG: dados de debug, variáveis importantes
        logger.debug("DEBUG: Valor de configuração X = {}", pegaConfiguracaoX());

        // INFO: evento de alto nível, marco no fluxo
        logger.info("INFO: Iniciando processamento de negócios no demonstrarNiveis.");

        try {
            // Simulação de lógica
            int resultado = processarAlgo(5, 3);
            logger.info("INFO: Resultado do processamento = {}", resultado);
        } catch (IllegalArgumentException e) {
            // WARN: situação inesperada, mas contornável
            logger.warn("WARN: Parâmetro inválido passado para processarAlgo: {}", e.getMessage());
        } catch (Exception e) {
            // ERROR: falha grave
            logger.error("ERROR: Exceção não tratada em demonstrarNiveis: {}", e.getMessage(), e);
        }
    }

    private int processarAlgo(int a, int b) {
        if (b == 0) {
            throw new IllegalArgumentException("Divisão por zero não permitida.");
        }
        return a / b;
    }

    private String pegaConfiguracaoX() {
        // Simula leitura de alguma configuração
        return "valorExemplo";
    }
}

```

### Explicação dos Chamados:

1. **`logger.isTraceEnabled()`**
    - Verifica se o nível TRACE está ativo antes de construir a mensagem. Útil se a montagem da mensagem for custosa (concatenar strings, chamar métodos etc.).
2. **`logger.debug("DEBUG: Valor de configuração X = {}", pegaConfiguracaoX());`**
    - Mesmo que o nível DEBUG esteja desabilitado, a montagem do texto só ocorre se DEBUG estiver habilitado, pois SLF4J já faz o “lazy evaluation” da mensagem parametrizada.
3. **`logger.info(...)`**
    - Marca eventos que sempre se deseja ver em produção (desde que nível INFO esteja habilitado).
4. **`logger.warn(...)`**
    - Alerta sobre parâmetros ou condições inesperadas, mas não críticas.
5. **`logger.error(...)`**
    - Exceções graves; a chamada captura a `Exception e` para exibir o stack trace completo.

---

### 4.4 Variações de Sintaxe

- **Logger por Classe**: Em geral, obtém-se `LoggerFactory.getLogger(NomeDaClasse.class)`. Pode-se também usar `getLogger("nome.personalizado")`, mas isso é menos comum.
- **Configurar Nível por Pacote**: Nos arquivos de configuração, é possível ajustar níveis para grupos de classes. Exemplo:
    
    ```
    logging.level.org.springframework.web=ERROR
    logging.level.com.meuprojeto.controller=DEBUG
    
    ```
    
- **Desabilitar Logging de Bibliotecas Específicas**: Um caso comum é silenciar logs muito verbosos de frameworks. Por exemplo, para Hibernate:
    
    ```yaml
    logging:
      level:
        org:
          hibernate:
            SQL: WARN
            type:
              descriptor:
                sql: TRACE
    
    ```
    

---

## 5. Cenários de Restrição ou Não Aplicação

### 5.1 Performance e Verbosidade Excessiva

- **TRACE/DEBUG em Produção**:
    - Custo adicional: formatação de strings, chamadas de sistema de arquivo ou rede.
    - Pode gerar volumes gigantescos de logs, dificultando análise e consumindo disco.
    - **Recomendação**: utilizar somente em desenvolvimento ou em cenários específicos de troubleshooting.

### 5.2 Ambientes de Produção vs. Desenvolvimento

- **Desenvolvimento**: Normalmente nível global em DEBUG (ou até TRACE temporariamente) para entender fluxos de controle e dados.
- **Produção**: Recomenda-se nível global em INFO, com ajustes pontuais em WARN ou ERROR para componentes específicos.
- Exemplo:
    
    ```
    # Desenvolvimento
    spring.profiles.active=dev
    logging.level.root=DEBUG
    
    # Produção
    spring.profiles.active=prod
    logging.level.root=INFO
    logging.level.com.meuprojeto.servico=DEBUG
    
    ```
    

### 5.3 Outras Alternativas

- **Soluções de APM (Application Performance Monitoring)**: New Relic, Datadog, Elastic APM, que coletam métricas em vez de logs brutos.
- **Monitoramento Complementar**: Métricas via Micrometer + Prometheus + Grafana, para reduzir dependência exclusiva de logs.

---

## 6. Componentes-Chave Associados

### 6.1 SLF4J (Simple Logging Facade for Java)

- **Responsabilidade**: Prover interface padronizada para múltiplas implementações de logging. Permite trocar o provedor em tempo de execução sem mudar o código.
- **Principais Classes/Interfaces**:
    - `org.slf4j.Logger`
    - `org.slf4j.LoggerFactory`

### 6.2 Logback

- **Responsabilidade**: Implementação padrão de logging do Spring Boot.
- **Módulos**:
    - `logback-core`
    - `logback-classic`
- **Configuração**: via `logback-spring.xml` ou `logback.xml`. Permite definir appenders (console, arquivo, socket, etc.) e rolling policies.

### 6.3 Anotações do Lombok para Logging

- **`@Slf4j`**: Gera `private static final org.slf4j.Logger log`.
- **Outras Anotações**: `@Log4j2`, `@Log` (commons-logging), etc. Escolher conforme implementação desejada.

### 6.4 Classes e Interfaces Principais

- **`org.slf4j.Logger`**
    - Métodos: `trace(...)`, `debug(...)`, `info(...)`, `warn(...)`, `error(...)`
    - Checar níveis: `isTraceEnabled()`, `isDebugEnabled()`, etc.
- **`org.slf4j.LoggerFactory`**
    - Método: `getLogger(Class<?>)` ou `getLogger(String name)`.

### 6.5 Arquivos de Configuração

- **`application.properties` / `application.yml`**: Opções simplificadas de configuração de nível global ou de pacotes.
- **`logback-spring.xml` / `logback.xml`**: Configurações avançadas: appenders, padrões de conversão, rolagem de arquivos e níveis por logger.

---

## 7. Melhores Práticas e Padrões de Uso

### 7.1 Escolha Adequada de Níveis para Cada Mensagem

- **TRACE**: Somente para revisão de minutiae, métricas muito granulares.
- **DEBUG**: Informações de debug de rotina, valores de variáveis, detalhes de fluxos internos.
- **INFO**: Eventos regulares de negócio ou iniciação de módulos (e.g., “Serviço X inicializado”).
- **WARN**: Situações anormais que podem evoluir para erro (e.g., “Timeout em tentativa de conexão, mas será refeito”).
- **ERROR**: Exceções críticas, falhas imprevistas, dados corrompidos.

### 7.2 Uso de Mensagens Parametrizadas em vez de Concatenação

- **Correto**:
    
    ```java
    logger.debug("Usuário {} realizou operação {} em {}", usuarioId, operacao, data);
    
    ```
    
    - A formatação ocorre somente se DEBUG estiver habilitado.
- **Incorreto**:
    
    ```java
    logger.debug("Usuário " + usuarioId + " realizou operação " + operacao);
    
    ```
    
    - A concatenação é executada independentemente do nível estar habilitado, desperdiçando recursos.

### 7.3 Evitar Lógica Pesada Dentro de Chamadas de Log

- Quando a mensagem requer chamadas caras (por exemplo, serializar objetos grandes), envolver em `if (logger.isDebugEnabled()) { ... }`.
    
    ```java
    if (logger.isDebugEnabled()) {
        String jsonDetalhado = objetoGrande.toJson(); // operação custosa
        logger.debug("Detalhes: {}", jsonDetalhado);
    }
    
    ```
    

### 7.4 Agrupar Configurações por Pacote/Classe

- Facilita alterar o nível de log de módulos específicos sem impactar toda a aplicação.
- Exemplos:
    
    ```
    logging.level.com.meuprojeto.controller=INFO
    logging.level.com.meuprojeto.servico=DEBUG
    logging.level.org.hibernate.SQL=TRACE
    
    ```
    

### 7.5 Rolar Arquivos de Log (Rolling Policies)

- **Por tamanho** (SizeBasedTriggeringPolicy): gera novo arquivo quando atinge X MB.
- **Por data** (TimeBasedRollingPolicy): gera novo arquivo diariamente/horariamente.
- Configurar no `logback-spring.xml` para não perder históricos e evitar disco cheio.

---

## 8. Exemplo Prático Completo

### 8.1 Cenário Proposto

Vamos imaginar uma aplicação Spring Boot que gerencia **pedidos de compra**. Teremos:

- Um **Controller** que expõe endpoints REST para criar e consultar pedidos.
- Um **Serviço** que encapsula lógica de negócio, onde registraremos logs nos 5 níveis.
- Configuração de logging diferenciada para o pacote `com.exemplo.pedido` (em nível DEBUG) e para `org.springframework.web` em WARN.

### 8.2 Estrutura de Projeto (Breve Visão)

```
meu-projeto-logging/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── exemplo/
│   │   │           └── pedido/
│   │   │               ├── controller/
│   │   │               │   └── PedidoController.java
│   │   │               ├── service/
│   │   │               │   └── PedidoService.java
│   │   │               └── model/
│   │   │                   └── Pedido.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── logback-spring.xml
│   └── test/
│       └── java/... (tests omitidos para foco em logging)
├── pom.xml
└── README.md

```

### 8.3 Configuração de Logging

### 8.3.1 `application.yml`

```yaml
spring:
  profiles:
    active: dev

logging:
  level:
    root: INFO
    com:
      exemplo:
        pedido: DEBUG
    org:
      springframework:
        web: WARN
  file:
    name: logs/pedidos-app.log

```

- **root: INFO** → Mensagens a partir de INFO globalmente.
- **com.exemplo.pedido: DEBUG** → Pacote principal em nível DEBUG para ter mais detalhes de serviço e controller.
- **org.springframework.web: WARN** → Silencia logs de spring mvc abaixo de WARN (menos poluição).
- **Saída em arquivo**: `logs/pedidos-app.log`.

### 8.3.2 `logback-spring.xml`

```xml
<!-- src/main/resources/logback-spring.xml -->
<configuration>
    <property name="LOG_PATH" value="logs"/>

    <!-- Padrão de layout -->
    <property name="PATTERN"
              value="%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level [%thread] %logger{36} - %msg%n"/>

    <!-- Appender para Console -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- Appender para Arquivo Rotativo Diário -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_PATH}/pedidos-app.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- Arquivos de backup com data -->
            <fileNamePattern>${LOG_PATH}/pedidos-app.%d{yyyy-MM-dd}.log.gz</fileNamePattern>
            <maxHistory>7</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>${PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- Root Logger -->
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>

    <!-- Logger específico do pacote com.exemplo.pedido -->
    <logger name="com.exemplo.pedido" level="DEBUG"/>

    <!-- Silenciar logs de Spring Web abaixo de WARN -->
    <logger name="org.springframework.web" level="WARN"/>
</configuration>

```

- **Observe**: as configurações em `application.yml` definem níveis iniciais, mas `logback-spring.xml` complementa definindo appenders e reforça níveis específicos.

---

### 8.4 Classe de Serviço com Uso dos 5 Níveis de Log (`PedidoService.java`)

```java
package com.exemplo.pedido.service;

import com.exemplo.pedido.model.Pedido;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PedidoService {

    private static final Logger logger = LoggerFactory.getLogger(PedidoService.class);
    private final Map<UUID, Pedido> pedidosArmazenados = new HashMap<>();

    public UUID criarPedido(String cliente, Double valor) {
        logger.trace("TRACE: Iniciando método criarPedido - cliente={}, valor={}", cliente, valor);
        logger.debug("DEBUG: Verificando parâmetros do pedido");

        if (cliente == null || cliente.isBlank()) {
            logger.error("ERROR: Nome do cliente inválido (nulo ou vazio)");
            throw new IllegalArgumentException("Cliente inválido.");
        }

        if (valor == null || valor <= 0) {
            logger.warn("WARN: Valor de pedido ≤ 0 (valor={}); definindo para 1.0 por padrão", valor);
            valor = 1.0;
        }

        Pedido pedido = new Pedido(UUID.randomUUID(), cliente, valor, LocalDateTime.now());
        pedidosArmazenados.put(pedido.getId(), pedido);
        logger.info("INFO: Pedido criado com sucesso. ID={}", pedido.getId());

        logger.trace("TRACE: Pedido armazenado em memória - {}", pedido);
        return pedido.getId();
    }

    public Optional<Pedido> buscarPedido(UUID id) {
        logger.trace("TRACE: Início do método buscarPedido - id={}", id);

        if (id == null) {
            logger.error("ERROR: ID de pedido nulo na requisição");
            return Optional.empty();
        }

        Pedido pedido = pedidosArmazenados.get(id);
        if (pedido == null) {
            logger.warn("WARN: Pedido não encontrado para id={}", id);
            return Optional.empty();
        }

        logger.info("INFO: Pedido encontrado: ID={}, cliente={}", pedido.getId(), pedido.getCliente());
        logger.debug("DEBUG: Detalhes do pedido: {}", pedido);
        return Optional.of(pedido);
    }
}

```

- **Explicação**:
    1. **`trace`**: Antes de qualquer verificação, registra detalhes extremos.
    2. **`debug`**: Verifica parâmetros, útil para desenvolvedor entender condições.
    3. **`error`**: Parâmetro fundamental faltando; lança exceção.
    4. **`warn`**: Quando valor de pedido indevido, aplica correção padrão – não interrompe mas alerta.
    5. **`info`**: Confirma criação com sucesso.
    6. **`debug` adicional**: Mostra objeto `Pedido` completo.

---

### 8.5 Classe de Controller Expondo Endpoints com Logs (`PedidoController.java`)

```java
package com.exemplo.pedido.controller;

import com.exemplo.pedido.model.Pedido;
import com.exemplo.pedido.service.PedidoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private static final Logger logger = LoggerFactory.getLogger(PedidoController.class);
    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<String> criar(@RequestParam String cliente,
                                        @RequestParam Double valor) {
        logger.info("INFO: Recebida requisição POST /api/pedidos?cliente={}&valor={}", cliente, valor);
        try {
            UUID id = pedidoService.criarPedido(cliente, valor);
            logger.debug("DEBUG: Retornando ID do novo pedido: {}", id);
            return ResponseEntity.ok(id.toString());
        } catch (IllegalArgumentException e) {
            logger.warn("WARN: Falha ao criar pedido: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("ERROR: Erro inesperado ao criar pedido: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Erro interno");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscar(@PathVariable String id) {
        logger.info("INFO: Recebida requisição GET /api/pedidos/{}", id);
        try {
            Optional<Pedido> opt = pedidoService.buscarPedido(UUID.fromString(id));
            if (opt.isPresent()) {
                logger.debug("DEBUG: Pedido encontrado, retornando 200 OK");
                return ResponseEntity.ok(opt.get());
            } else {
                logger.warn("WARN: Pedido não encontrado para ID={}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            logger.error("ERROR: ID inválido no formato UUID: {}", id);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("ERROR: Erro interno ao buscar pedido: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
}

```

- **Fluxo de Logs no Controller**:
    1. **`info`**: Marca a entrada no endpoint.
    2. Delegação ao serviço e logs de retorno.
    3. **`debug`**: Valor do ID do pedido retornado (detalhe útil em dev).
    4. **`warn`** e **`error`** conforme casos de exceção.

---

### 8.6 Saída Esperada (Fragmentos de Logs em Tempo de Execução)

Supondo que iniciamos o Spring Boot e fazemos uma chamada para criar pedido e depois buscar:

```
2025-06-05 10:15:23.123 INFO  [main] com.exemplo.pedido.controller.PedidoController - INFO: Recebida requisição POST /api/pedidos?cliente=João&valor=150.0
2025-06-05 10:15:23.124 DEBUG [main] com.exemplo.pedido.service.PedidoService - DEBUG: Verificando parâmetros do pedido
2025-06-05 10:15:23.125 INFO  [main] com.exemplo.pedido.service.PedidoService - INFO: Pedido criado com sucesso. ID=3fa85f64-5717-4562-b3fc-2c963f66afa6
2025-06-05 10:15:23.126 DEBUG [main] com.exemplo.pedido.controller.PedidoController - DEBUG: Retornando ID do novo pedido: 3fa85f64-5717-4562-b3fc-2c963f66afa6

2025-06-05 10:16:10.456 INFO  [http-nio-8080-exec-1] com.exemplo.pedido.controller.PedidoController - INFO: Recebida requisição GET /api/pedidos/3fa85f64-5717-4562-b3fc-2c963f66afa6
2025-06-05 10:16:10.457 TRACE [http-nio-8080-exec-1] com.exemplo.pedido.service.PedidoService - TRACE: Início do método buscarPedido - id=3fa85f64-5717-4562-b3fc-2c963f66afa6
2025-06-05 10:16:10.458 INFO  [http-nio-8080-exec-1] com.exemplo.pedido.service.PedidoService - INFO: Pedido encontrado: ID=3fa85f64-5717-4562-b3fc-2c963f66afa6, cliente=João
2025-06-05 10:16:10.459 DEBUG [http-nio-8080-exec-1] com.exemplo.pedido.service.PedidoService - DEBUG: Detalhes do pedido: Pedido{id=3fa85f64-5717-4562-b3fc-2c963f66afa6, cliente='João', valor=150.0, data=2025-06-05T10:15:23.125}
2025-06-05 10:16:10.460 DEBUG [http-nio-8080-exec-1] com.exemplo.pedido.controller.PedidoController - DEBUG: Pedido encontrado, retornando 200 OK

```

- Note que **os logs de nível TRACE só aparecem se `logging.level.com.exemplo.pedido=TRACE` estivesse configurado**. Como no nosso `application.yml` colocamos DEBUG, a linha TRACE não teria sido exibida a menos que alterássemos para TRACE.

---

## 9. Sugestões para Aprofundamento

1. **Comparar Logback vs. Log4j2**
    - Quais as diferenças de performance e configuração.
    - Utilizar dependências diferentes no `pom.xml`.
2. **Integração com Sistemas de Coleta de Logs**
    - ELK Stack (Elasticsearch, Logstash, Kibana)
    - Graylog ou Grafana Loki como agregadores e visualizadores.
3. **Uso de MDC (Mapped Diagnostic Context)**
    - Inserir informações contextuais (ex.: `userId`) que acompanham todas as linhas de log de um mesmo fluxo de requisição.
    - Exemplo:
        
        ```java
        MDC.put("userId", usuarioId);
        logger.info("Operação sensível iniciada");
        // ...
        MDC.clear();
        
        ```
        
4. **Logs Estruturados (JSON)**
    - Configurar Logback para saída em JSON (para fácil ingestão por sistemas).
    - Exemplo de `logback-spring.xml`: usar `JacksonJsonFormatter`.
5. **Teste de Carga e Impacto de Logging**
    - Avaliar quanto cada nível de log consome de I/O sob cenários de produção.
    - Ferramentas: JMeter, Artillery, Gatling.

---

**Conclusão**:

Compreender os níveis de log (*Trace*, *Debug*, *Info*, *Warn* e *Error*) e saber configurá-los corretamente em aplicações Spring Boot é vital para manter uma base de código observável, permitir diagnóstico rápido de falhas e oferecer visibilidade adequada em produção. O uso consciente dos níveis evita volumes desnecessários de logs e garante que as informações mais relevantes sejam registradas.

Espero que este guia detalhado atenda às suas necessidades. Se desejar aprofundar em algum tópico específico (como configuração avançada de Logback, MDC, logs estruturados em JSON ou comparação entre frameworks), fique à vontade para solicitar!