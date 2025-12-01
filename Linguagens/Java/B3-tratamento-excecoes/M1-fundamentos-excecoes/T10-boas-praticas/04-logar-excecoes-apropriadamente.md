# T10.04 - Logar Exceções Apropriadamente

## Introdução

**Logging**: registrar exceções com **contexto** e **nível** adequado.

```java
import java.util.logging.*;

/*
 * LOGGING DE EXCEÇÕES
 * 
 * ❌ NÃO FAZER:
 * - printStackTrace() em produção
 * - Logar e re-lançar sem motivo
 * - Mensagem genérica sem contexto
 * 
 * ✅ FAZER:
 * - Usar Logger (java.util.logging, SLF4J, Log4j)
 * - Nível apropriado (SEVERE, WARNING, INFO)
 * - Incluir contexto e causa
 */

// ❌ printStackTrace: evitar em produção
public class ExemploRuim {
    public static void processar(String arquivo) {
        try {
            FileReader fr = new FileReader(arquivo);
        } catch (FileNotFoundException e) {
            e.printStackTrace();  // ❌ Console em produção
        }
    }
}

// ✅ Logger: apropriado para produção
public class ExemploBom {
    private static final Logger logger = Logger.getLogger(ExemploBom.class.getName());
    
    public static void processar(String arquivo) {
        try {
            FileReader fr = new FileReader(arquivo);
        } catch (FileNotFoundException e) {
            logger.log(Level.SEVERE, "Erro ao ler arquivo: " + arquivo, e);
            // ✅ Logger com contexto e causa
        }
    }
}
```

**Regra**: usar **Logger** com **contexto** e **nível** adequado, não printStackTrace().

---

## Fundamentos

### 1. Por Que Logar

```java
// ✅ Logging: para que serve
public class PorQueLogar {
    private static final Logger logger = Logger.getLogger(PorQueLogar.class.getName());
    
    public static void processar(int id, String dados) {
        try {
            validar(dados);
            salvar(id, dados);
        } catch (ValidationException e) {
            logger.log(Level.WARNING, 
                "Validação falhou para ID: " + id + ", dados: " + dados, e);
            // ✅ Log ajuda:
            // - Diagnosticar problemas
            // - Auditar operações
            // - Rastrear erros produção
        } catch (SQLException e) {
            logger.log(Level.SEVERE, 
                "Erro ao salvar ID: " + id, e);
            // ✅ Contexto ajuda debug
            throw new RuntimeException("Erro ao salvar", e);
        }
    }
    
    static void validar(String dados) throws ValidationException {
        if (dados == null || dados.isEmpty()) {
            throw new ValidationException("Dados vazios");
        }
    }
    
    static void salvar(int id, String dados) throws SQLException { }
}

class ValidationException extends Exception {
    public ValidationException(String msg) { super(msg); }
}

/*
 * POR QUE LOGAR:
 * 
 * 1. DIAGNÓSTICO:
 *    - Identificar erros produção
 *    - Rastrear causa raiz
 * 
 * 2. AUDITORIA:
 *    - Registrar operações
 *    - Rastrear ações
 * 
 * 3. MONITORAMENTO:
 *    - Alertas automáticos
 *    - Análise tendências
 */
```

**Logging**: diagnóstico, **auditoria**, **monitoramento**.

### 2. printStackTrace vs Logger

```java
// ❌ printStackTrace: problemas
public class PrintStackTraceProblemas {
    
    public static void exemploRuim() {
        try {
            int resultado = 10 / 0;
        } catch (ArithmeticException e) {
            e.printStackTrace();  // ❌ Problemas:
        }
    }
}

/*
 * PROBLEMAS printStackTrace():
 * 
 * 1. SAÍDA:
 *    - Vai para System.err (console)
 *    - Não pode redirecionar
 *    - Não pode filtrar
 * 
 * 2. PRODUÇÃO:
 *    - Logs não centralizados
 *    - Difícil analisar
 *    - Sem controle nível
 * 
 * 3. INFORMAÇÃO:
 *    - Sem contexto adicional
 *    - Sem timestamp automático
 *    - Sem nível (SEVERE, WARNING)
 * 
 * 4. PERFORMANCE:
 *    - Pode bloquear se System.err bloqueado
 */

// ✅ Logger: vantagens
public class LoggerVantagens {
    private static final Logger logger = Logger.getLogger(LoggerVantagens.class.getName());
    
    public static void exemploBom() {
        try {
            int resultado = 10 / 0;
        } catch (ArithmeticException e) {
            logger.log(Level.SEVERE, "Erro divisão por zero", e);
            // ✅ Vantagens Logger
        }
    }
}

/*
 * VANTAGENS LOGGER:
 * 
 * 1. CONFIGURÁVEL:
 *    - Nível (SEVERE, WARNING, INFO)
 *    - Saída (arquivo, console, rede)
 *    - Formato (texto, JSON, XML)
 * 
 * 2. CENTRALIZADO:
 *    - Todos logs em um lugar
 *    - Fácil analisar
 *    - Integração ferramentas (ELK, Splunk)
 * 
 * 3. CONTEXTO:
 *    - Timestamp automático
 *    - Nome classe/método
 *    - Thread
 *    - Mensagem personalizada
 * 
 * 4. FILTRO:
 *    - Por nível
 *    - Por pacote
 *    - Por categoria
 */
```

**Logger**: configurável, **centralizado**, com **contexto**.

### 3. Níveis de Log

```java
import java.util.logging.*;

// ✅ Níveis de log: quando usar
public class NiveisLog {
    private static final Logger logger = Logger.getLogger(NiveisLog.class.getName());
    
    public static void processar(String arquivo) {
        // ✅ SEVERE: erro grave, funcionalidade falha
        try {
            FileReader fr = new FileReader(arquivo);
        } catch (FileNotFoundException e) {
            logger.log(Level.SEVERE, "Arquivo não encontrado: " + arquivo, e);
            // Sistema não pode continuar operação
        }
        
        // ✅ WARNING: problema, mas sistema continua
        try {
            int valor = Integer.parseInt("abc");
        } catch (NumberFormatException e) {
            logger.log(Level.WARNING, "Formato número inválido, usando padrão", e);
            // Sistema pode continuar com valor padrão
        }
        
        // ✅ INFO: informação relevante (não erro)
        logger.log(Level.INFO, "Processamento iniciado para: " + arquivo);
        
        // ✅ CONFIG: configuração do sistema
        logger.log(Level.CONFIG, "Timeout configurado: 30s");
        
        // ✅ FINE, FINER, FINEST: debug detalhado
        logger.log(Level.FINE, "Entrando método processar");
        logger.log(Level.FINER, "Valor variável x: 10");
        logger.log(Level.FINEST, "Estado completo objeto: {...}");
    }
}

/*
 * NÍVEIS DE LOG (java.util.logging):
 * 
 * SEVERE (1000):
 * - Erro GRAVE
 * - Funcionalidade FALHOU
 * - Sistema NÃO pode continuar
 * - Ex: FileNotFoundException, SQLException
 * 
 * WARNING (900):
 * - Problema, mas sistema CONTINUA
 * - Funcionalidade DEGRADADA
 * - Usar valor PADRÃO
 * - Ex: NumberFormatException (usar padrão)
 * 
 * INFO (800):
 * - Informação RELEVANTE
 * - NÃO é erro
 * - Operações importantes
 * - Ex: "Aplicação iniciada"
 * 
 * CONFIG (700):
 * - Configuração sistema
 * - Ex: "Porta: 8080"
 * 
 * FINE (500):
 * - Debug básico
 * - Entrada/saída métodos
 * 
 * FINER (400):
 * - Debug detalhado
 * - Valores variáveis
 * 
 * FINEST (300):
 * - Debug MUITO detalhado
 * - Estado completo
 */

/*
 * EQUIVALÊNCIA SLF4J/LOG4J:
 * 
 * java.util.logging  |  SLF4J/Log4j
 * -------------------|-------------
 * SEVERE             |  ERROR
 * WARNING            |  WARN
 * INFO               |  INFO
 * CONFIG             |  INFO
 * FINE               |  DEBUG
 * FINER              |  DEBUG
 * FINEST             |  TRACE
 */
```

**Níveis**: SEVERE (grave), WARNING (problema mas continua), INFO (relevante).

### 4. Mensagens com Contexto

```java
// ❌ Mensagem genérica: sem contexto
public class MensagemGenerica {
    private static final Logger logger = Logger.getLogger(MensagemGenerica.class.getName());
    
    public static void processar(int id, String arquivo) {
        try {
            FileReader fr = new FileReader(arquivo);
        } catch (FileNotFoundException e) {
            logger.log(Level.SEVERE, "Erro", e);  // ❌ Genérico
            // Qual arquivo? Qual operação? Qual usuário?
        }
    }
}

// ✅ Mensagem com contexto: específica
public class MensagemContexto {
    private static final Logger logger = Logger.getLogger(MensagemContexto.class.getName());
    
    public static void processar(int id, String arquivo, String usuario) {
        try {
            FileReader fr = new FileReader(arquivo);
        } catch (FileNotFoundException e) {
            logger.log(Level.SEVERE, 
                String.format("Erro ao ler arquivo '%s' para usuário '%s' (ID: %d)", 
                    arquivo, usuario, id), e);
            // ✅ Contexto completo facilita debug
        }
    }
}

/*
 * MENSAGEM COM CONTEXTO:
 * 
 * ✅ INCLUIR:
 * - Operação que falhou
 * - Parâmetros relevantes
 * - Usuário (se aplicável)
 * - ID transação/request
 * - Estado antes do erro
 * 
 * ❌ NÃO INCLUIR:
 * - Senhas
 * - Dados sensíveis (CPF, cartão)
 * - Informação pessoal (LGPD/GDPR)
 */

// ✅ Contexto com MDC (SLF4J)
public class ContextoMDC {
    // MDC = Mapped Diagnostic Context
    // Disponível em SLF4J, Log4j
    
    public static void processar(int requestId, String usuario) {
        // ✅ Adicionar contexto global
        MDC.put("requestId", String.valueOf(requestId));
        MDC.put("usuario", usuario);
        
        try {
            operacao();
        } finally {
            // ✅ Limpar MDC
            MDC.clear();
        }
    }
    
    static void operacao() {
        // Logger automaticamente inclui contexto MDC
        // Log: "requestId=123 usuario=João | Executando operação"
    }
}

class MDC {
    private static ThreadLocal<Map<String, String>> context = new ThreadLocal<>();
    public static void put(String key, String value) { }
    public static void clear() { }
}
```

**Contexto**: incluir **operação**, **parâmetros**, **usuário**, **ID** transação.

### 5. Incluir Causa (Throwable)

```java
// ❌ Sem causa: perde stack trace
public class SemCausa {
    private static final Logger logger = Logger.getLogger(SemCausa.class.getName());
    
    public static void processar(String arquivo) {
        try {
            FileReader fr = new FileReader(arquivo);
        } catch (FileNotFoundException e) {
            logger.log(Level.SEVERE, "Erro ao ler arquivo");  // ❌ Sem causa
            // Perde stack trace! Dificulta debug
        }
    }
}

// ✅ Com causa: preserva stack trace
public class ComCausa {
    private static final Logger logger = Logger.getLogger(ComCausa.class.getName());
    
    public static void processar(String arquivo) {
        try {
            FileReader fr = new FileReader(arquivo);
        } catch (FileNotFoundException e) {
            logger.log(Level.SEVERE, "Erro ao ler arquivo: " + arquivo, e);
            // ✅ Causa preserva stack trace completo
        }
    }
}

/*
 * INCLUIR CAUSA (Throwable):
 * 
 * ✅ SEMPRE passar exceção:
 * logger.log(Level.SEVERE, "Mensagem", exceção);
 * 
 * BENEFÍCIOS:
 * - Stack trace COMPLETO
 * - Linha exata do erro
 * - Cadeia de exceções (caused by)
 * 
 * ❌ NÃO FAZER:
 * logger.log(Level.SEVERE, e.getMessage());
 * // Perde stack trace!
 */

// ✅ Encadeamento de exceções
public class EncadeamentoExcecoes {
    private static final Logger logger = Logger.getLogger(EncadeamentoExcecoes.class.getName());
    
    public static void processar(int id) {
        try {
            salvarBanco(id);
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Erro ao processar ID: " + id, e);
            // ✅ Log mostra cadeia completa:
            // ProcessamentoException: Erro ao processar
            //   caused by: SQLException: Constraint violated
            throw new ProcessamentoException("Erro ao processar", e);
        }
    }
    
    static void salvarBanco(int id) throws SQLException {
        throw new SQLException("Constraint violated");
    }
}

class ProcessamentoException extends RuntimeException {
    public ProcessamentoException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
```

**Causa**: sempre passar **exceção** para logger.log(), preserva stack trace.

### 6. Logar e Re-lançar

```java
// ❌ Logar e re-lançar sem motivo: duplica logs
public class LogarReLancarRuim {
    private static final Logger logger = Logger.getLogger(LogarReLancarRuim.class.getName());
    
    public static void metodo1() {
        try {
            metodo2();
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Erro método 1", e);  // ❌ Log 1
            throw new RuntimeException(e);
        }
    }
    
    public static void metodo2() {
        try {
            metodo3();
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Erro método 2", e);  // ❌ Log 2
            throw e;
        }
    }
    
    public static void metodo3() throws IOException {
        logger.log(Level.SEVERE, "Erro método 3");  // ❌ Log 3
        throw new IOException("Falha");
    }
    
    // Resultado: 3 logs para MESMA exceção!
}

// ✅ Logar OU re-lançar (não ambos)
public class LogarReLancarBom {
    private static final Logger logger = Logger.getLogger(LogarReLancarBom.class.getName());
    
    public static void metodo1() {
        try {
            metodo2();
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Erro na camada apresentação", e);  // ✅ Log aqui
            // NÃO re-lançar (trata aqui)
        }
    }
    
    public static void metodo2() throws IOException {
        try {
            metodo3();
        } catch (IOException e) {
            // ✅ Re-lançar SEM logar (delega para camada superior)
            throw new RuntimeException("Erro processamento", e);
        }
    }
    
    public static void metodo3() throws IOException {
        throw new IOException("Falha");  // ✅ Lançar sem logar
    }
}

/*
 * LOGAR E RE-LANÇAR:
 * 
 * ❌ NÃO FAZER (ambos):
 * catch (Exception e) {
 *     logger.log(..., e);  // Log
 *     throw e;             // Re-lança
 * }
 * // DUPLICA logs!
 * 
 * ✅ FAZER (um ou outro):
 * 
 * OPÇÃO 1: Logar e TRATAR
 * catch (Exception e) {
 *     logger.log(..., e);  // Log
 *     // Tratar aqui (não re-lançar)
 * }
 * 
 * OPÇÃO 2: Re-lançar SEM logar
 * catch (Exception e) {
 *     throw new MinhaException("...", e);  // Re-lança
 *     // NÃO logar (camada superior loga)
 * }
 * 
 * EXCEÇÃO: Logar + re-lançar se adicionar CONTEXTO
 * catch (Exception e) {
 *     logger.log(Level.WARNING, "Contexto adicional: X");
 *     throw e;
 * }
 */
```

**Logar e re-lançar**: logar **OU** re-lançar (não **ambos**), evita duplicação.

### 7. Frameworks de Logging

```java
/*
 * FRAMEWORKS DE LOGGING
 * 
 * 1. JAVA.UTIL.LOGGING (JUL):
 * - Nativo Java
 * - Sem dependência
 * - Menos features
 * 
 * import java.util.logging.*;
 * Logger logger = Logger.getLogger(Classe.class.getName());
 * logger.log(Level.SEVERE, "Mensagem", exceção);
 * 
 * 
 * 2. SLF4J (Simple Logging Facade for Java):
 * - FACADE (interface)
 * - Abstração sobre implementações
 * - Mais popular
 * 
 * import org.slf4j.*;
 * Logger logger = LoggerFactory.getLogger(Classe.class);
 * logger.error("Mensagem", exceção);
 * 
 * 
 * 3. LOGBACK (implementação SLF4J):
 * - Implementação moderna SLF4J
 * - Alto desempenho
 * - Configuração XML/Groovy
 * 
 * 
 * 4. LOG4J 2:
 * - Popular
 * - Alto desempenho
 * - Async logging
 * 
 * import org.apache.logging.log4j.*;
 * Logger logger = LogManager.getLogger(Classe.class);
 * logger.error("Mensagem", exceção);
 * 
 * 
 * RECOMENDAÇÃO:
 * - USAR: SLF4J (facade) + Logback (implementação)
 * - Flexibilidade trocar implementação
 * - Bibliotecas usam SLF4J
 */

// ✅ SLF4J: uso básico
public class ExemploSLF4J {
    private static final org.slf4j.Logger logger = 
        org.slf4j.LoggerFactory.getLogger(ExemploSLF4J.class);
    
    public static void processar(String arquivo, int id) {
        try {
            FileReader fr = new FileReader(arquivo);
        } catch (FileNotFoundException e) {
            // ✅ SLF4J: placeholders {}
            logger.error("Erro ao ler arquivo '{}' para ID {}", arquivo, id, e);
            // Mais eficiente que concatenação String
        }
    }
}

// ✅ java.util.logging: uso básico
public class ExemploJUL {
    private static final Logger logger = Logger.getLogger(ExemploJUL.class.getName());
    
    public static void processar(String arquivo, int id) {
        try {
            FileReader fr = new FileReader(arquivo);
        } catch (FileNotFoundException e) {
            logger.log(Level.SEVERE, 
                String.format("Erro ao ler arquivo '%s' para ID %d", arquivo, id), e);
        }
    }
}
```

**Frameworks**: SLF4J (facade) + **Logback** (implementação) recomendado.

### 8. Configuração de Logging

```java
/*
 * CONFIGURAÇÃO LOGGING
 * 
 * 1. JAVA.UTIL.LOGGING:
 * - Arquivo: logging.properties
 * - Localização: JAVA_HOME/jre/lib/logging.properties
 * - Ou via: -Djava.util.logging.config.file=logging.properties
 * 
 * # logging.properties
 * handlers=java.util.logging.FileHandler, java.util.logging.ConsoleHandler
 * 
 * # Nível global
 * .level=INFO
 * 
 * # Nível por pacote
 * com.exemplo.nivel=FINE
 * 
 * # Console handler
 * java.util.logging.ConsoleHandler.level=WARNING
 * java.util.logging.ConsoleHandler.formatter=java.util.logging.SimpleFormatter
 * 
 * # File handler
 * java.util.logging.FileHandler.pattern=logs/app-%u.log
 * java.util.logging.FileHandler.limit=50000000
 * java.util.logging.FileHandler.count=10
 * java.util.logging.FileHandler.formatter=java.util.logging.XMLFormatter
 * 
 * 
 * 2. LOGBACK (SLF4J):
 * - Arquivo: logback.xml
 * - Localização: src/main/resources/logback.xml
 * 
 * <configuration>
 *   <appender name="FILE" class="ch.qos.logback.core.FileAppender">
 *     <file>logs/app.log</file>
 *     <encoder>
 *       <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
 *     </encoder>
 *   </appender>
 *   
 *   <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
 *     <encoder>
 *       <pattern>%d{HH:mm:ss.SSS} %-5level %logger{36} - %msg%n</pattern>
 *     </encoder>
 *   </appender>
 *   
 *   <logger name="com.exemplo" level="DEBUG"/>
 *   
 *   <root level="INFO">
 *     <appender-ref ref="FILE"/>
 *     <appender-ref ref="CONSOLE"/>
 *   </root>
 * </configuration>
 * 
 * 
 * 3. AMBIENTES:
 * 
 * DESENVOLVIMENTO:
 * - Nível: DEBUG/FINE
 * - Saída: Console
 * - Formato: Simples
 * 
 * PRODUÇÃO:
 * - Nível: WARNING/SEVERE
 * - Saída: Arquivo + Centralizado (ELK, Splunk)
 * - Formato: JSON (estruturado)
 */

// ✅ Configuração programática (java.util.logging)
public class ConfiguracaoLogging {
    public static void configurar() throws IOException {
        Logger rootLogger = Logger.getLogger("");
        
        // ✅ Remover handlers padrão
        Handler[] handlers = rootLogger.getHandlers();
        for (Handler handler : handlers) {
            rootLogger.removeHandler(handler);
        }
        
        // ✅ Console handler
        ConsoleHandler consoleHandler = new ConsoleHandler();
        consoleHandler.setLevel(Level.WARNING);
        consoleHandler.setFormatter(new SimpleFormatter());
        rootLogger.addHandler(consoleHandler);
        
        // ✅ File handler
        FileHandler fileHandler = new FileHandler("logs/app-%u.log", 50_000_000, 10, true);
        fileHandler.setLevel(Level.INFO);
        fileHandler.setFormatter(new SimpleFormatter());
        rootLogger.addHandler(fileHandler);
        
        // ✅ Nível global
        rootLogger.setLevel(Level.INFO);
        
        // ✅ Nível específico por pacote
        Logger logger = Logger.getLogger("com.exemplo");
        logger.setLevel(Level.FINE);
    }
}
```

**Configuração**: arquivo (logging.properties, logback.xml) ou **programática**.

### 9. Resumo Visual

```java
/*
 * LOGAR EXCEÇÕES APROPRIADAMENTE
 * 
 * ❌ NÃO FAZER:
 * 
 * 1. printStackTrace() EM PRODUÇÃO:
 * catch (Exception e) {
 *     e.printStackTrace();  // ❌ Console, sem controle
 * }
 * 
 * 2. MENSAGEM SEM CONTEXTO:
 * logger.log(Level.SEVERE, "Erro");  // ❌ Genérico
 * 
 * 3. SEM CAUSA:
 * logger.log(Level.SEVERE, "Erro");  // ❌ Sem exceção
 * // Perde stack trace!
 * 
 * 4. LOGAR E RE-LANÇAR:
 * catch (Exception e) {
 *     logger.log(..., e);  // ❌ Log
 *     throw e;             // ❌ Re-lança (duplica)
 * }
 * 
 * 5. NÍVEL ERRADO:
 * logger.log(Level.INFO, "Erro grave", e);  // ❌ INFO para erro
 * 
 * 
 * ✅ FAZER:
 * 
 * 1. USAR LOGGER:
 * private static final Logger logger = Logger.getLogger(Classe.class.getName());
 * 
 * catch (Exception e) {
 *     logger.log(Level.SEVERE, "Mensagem", e);  // ✅ Logger
 * }
 * 
 * 2. MENSAGEM COM CONTEXTO:
 * logger.log(Level.SEVERE, 
 *     String.format("Erro ao ler arquivo '%s' para ID %d", arquivo, id), e);
 * // ✅ Contexto completo
 * 
 * 3. INCLUIR CAUSA:
 * logger.log(Level.SEVERE, "Mensagem", exceção);  // ✅ Exceção preserva stack trace
 * 
 * 4. LOGAR OU RE-LANÇAR (não ambos):
 * catch (Exception e) {
 *     logger.log(..., e);  // ✅ Log e trata
 *     // NÃO re-lançar
 * }
 * 
 * OU
 * 
 * catch (Exception e) {
 *     throw new MinhaException("...", e);  // ✅ Re-lança
 *     // NÃO logar (camada superior loga)
 * }
 * 
 * 5. NÍVEL APROPRIADO:
 * logger.log(Level.SEVERE, "Erro grave", e);     // ✅ SEVERE para erro grave
 * logger.log(Level.WARNING, "Problema", e);      // ✅ WARNING se continua
 * logger.log(Level.INFO, "Operação concluída");  // ✅ INFO para informação
 * 
 * 
 * NÍVEIS:
 * 
 * SEVERE:
 * - Erro GRAVE
 * - Funcionalidade FALHOU
 * - Ex: FileNotFoundException, SQLException
 * 
 * WARNING:
 * - Problema, sistema CONTINUA
 * - Ex: NumberFormatException (usa padrão)
 * 
 * INFO:
 * - Informação RELEVANTE
 * - NÃO erro
 * - Ex: "Aplicação iniciada"
 * 
 * FINE/DEBUG:
 * - Debug básico
 * 
 * 
 * FRAMEWORKS:
 * 
 * 1. JAVA.UTIL.LOGGING (JUL):
 * Logger logger = Logger.getLogger(Classe.class.getName());
 * logger.log(Level.SEVERE, "Mensagem", exceção);
 * 
 * 2. SLF4J + LOGBACK (recomendado):
 * Logger logger = LoggerFactory.getLogger(Classe.class);
 * logger.error("Mensagem", exceção);
 * logger.error("Arquivo '{}' ID {}", arquivo, id, exceção);  // Placeholders
 * 
 * 3. LOG4J 2:
 * Logger logger = LogManager.getLogger(Classe.class);
 * logger.error("Mensagem", exceção);
 * 
 * 
 * CONTEXTO:
 * 
 * ✅ INCLUIR:
 * - Operação
 * - Parâmetros
 * - Usuário
 * - ID transação/request
 * - Estado relevante
 * 
 * ❌ NÃO INCLUIR:
 * - Senhas
 * - Dados sensíveis (CPF, cartão)
 * - Info pessoal (LGPD/GDPR)
 * 
 * 
 * CONFIGURAÇÃO:
 * 
 * DESENVOLVIMENTO:
 * - Nível: DEBUG/FINE
 * - Saída: Console
 * 
 * PRODUÇÃO:
 * - Nível: WARNING/SEVERE
 * - Saída: Arquivo + Centralizado
 * - Formato: JSON
 */

public class ExemploLogging {
    private static final Logger logger = Logger.getLogger(ExemploLogging.class.getName());
    
    // ✅ CORRETO: Logger com contexto
    public static void processar(int id, String arquivo, String usuario) {
        try {
            FileReader fr = new FileReader(arquivo);
            // processar...
        } catch (FileNotFoundException e) {
            logger.log(Level.SEVERE, 
                String.format(
                    "Erro ao ler arquivo '%s' para usuário '%s' (ID: %d)", 
                    arquivo, usuario, id
                ), e);
            // ✅ Logger + contexto + causa
        } catch (IOException e) {
            logger.log(Level.WARNING, 
                "Erro leitura, tentando arquivo backup", e);
            // ✅ WARNING: sistema pode continuar
            tentarBackup(arquivo);
        }
    }
    
    static void tentarBackup(String arquivo) { }
}
```

---

## Aplicabilidade

**Sempre logar**:
- **Exceções** capturadas
- Operações **críticas**
- **Auditoria**

**Usar Logger**:
- Não **printStackTrace()** em produção
- Framework (SLF4J, Log4j, JUL)

---

## Armadilhas

### 1. printStackTrace em Produção

```java
// ❌ Console em produção
e.printStackTrace();

// ✅ Logger
logger.log(Level.SEVERE, "Mensagem", e);
```

### 2. Sem Contexto

```java
// ❌ Genérico
logger.log(Level.SEVERE, "Erro");

// ✅ Contexto
logger.log(Level.SEVERE, "Erro arquivo: " + arquivo, e);
```

### 3. Logar e Re-lançar

```java
// ❌ Duplica logs
logger.log(..., e);
throw e;

// ✅ Logar OU re-lançar
logger.log(..., e);  // Trata aqui
```

---

## Boas Práticas

### 1. Logger Privado Estático Final

```java
// ✅ Por classe
private static final Logger logger = 
    Logger.getLogger(Classe.class.getName());
```

### 2. Nível Apropriado

```java
// ✅ SEVERE para erro grave
logger.log(Level.SEVERE, "Falha crítica", e);

// ✅ WARNING se continua
logger.log(Level.WARNING, "Problema, usando padrão", e);
```

### 3. Incluir Causa

```java
// ✅ Sempre passar exceção
logger.log(Level.SEVERE, "Mensagem", exceção);
```

---

## Resumo

**Logging**: registrar exceções com **Logger**, não printStackTrace().

**Logger vantagens**:
1. **Configurável**: nível, saída, formato
2. **Centralizado**: todos logs um lugar
3. **Contexto**: timestamp, classe, thread
4. **Filtro**: por nível, pacote

**Níveis** (java.util.logging):
- **SEVERE**: erro **grave**, funcionalidade falhou
- **WARNING**: problema, mas sistema **continua**
- **INFO**: informação **relevante** (não erro)
- **FINE/DEBUG**: debug básico

**Equivalência** SLF4J/Log4j:
- SEVERE = **ERROR**
- WARNING = **WARN**
- INFO = **INFO**
- FINE = **DEBUG**
- FINEST = **TRACE**

**Mensagem com contexto**:
- Incluir: **operação**, **parâmetros**, **usuário**, **ID** transação
- Não incluir: **senhas**, dados **sensíveis**, info pessoal (LGPD)

**Incluir causa**:
- Sempre passar **exceção**: `logger.log(Level.SEVERE, "Msg", e)`
- Preserva **stack trace** completo

**Logar e re-lançar**:
- Logar **OU** re-lançar (não **ambos**)
- Evita **duplicação** logs
- Exceção: adicionar **contexto** diferente

**Frameworks**:
1. **java.util.logging** (JUL): nativo, sem dependência
2. **SLF4J** + Logback: recomendado, facade, flexível
3. **Log4j 2**: popular, alto desempenho

**Configuração**:
- **Desenvolvimento**: DEBUG/FINE, console, simples
- **Produção**: WARNING/SEVERE, arquivo + centralizado (ELK), JSON

**Não fazer**:
- ❌ **printStackTrace()** em produção (console, sem controle)
- ❌ Mensagem **genérica** sem contexto ("Erro")
- ❌ Não incluir **causa** (perde stack trace)
- ❌ Logar **e** re-lançar (duplica logs)
- ❌ Nível **errado** (INFO para erro grave)

**Fazer**:
- ✅ Usar **Logger** (JUL, SLF4J, Log4j)
- ✅ Mensagem com **contexto** completo
- ✅ Incluir **causa** (exceção) sempre
- ✅ Logar **OU** re-lançar (escolher um)
- ✅ Nível **apropriado** (SEVERE erro grave, WARNING problema, INFO info)

**Regra de Ouro**: Sempre usar **Logger** com **contexto** e **causa**. printStackTrace() apenas desenvolvimento. Produção: Logger configurável centralizado. Nível SEVERE erro grave, WARNING problema mas continua. Logar OU re-lançar, não ambos (duplica). Mensagem específica operação parâmetros usuário. Frameworks: SLF4J+Logback recomendado (flexível). Configuração arquivo (logging.properties, logback.xml). Incluir exceção sempre preserva stack trace.

