# ⚙️ Enum como Registro de Configuração

## 🎯 Introdução

Utilizar **enums como registros de configuração** oferece uma forma **type-safe, centralizada e auto-documentada** de gerenciar constantes de configuração da aplicação. Ao invés de espalhar strings mágicas ou constantes em múltiplos arquivos, enums agrupam configurações relacionadas com seus **valores padrão, validações e conversões de tipo**, permitindo acesso compilado-seguro e facilitando refatorações.

### Problema Antes de Enums

**Configurações com Strings:**

```java
// ❌ Strings mágicas espalhadas no código
public class App {
    public void conectar() {
        String host = System.getProperty("db.host");  // "db.host" repetido
        String port = System.getProperty("db.port");  // "db.port" repetido
        int portInt = Integer.parseInt(port);  // Conversão manual
        // Sem valor padrão, sem validação, propenso a erros de digitação
    }
}

// Em outro arquivo
public class OutroLugar {
    String host = System.getProperty("db.hos");  // ❌ Typo! Compila mas falha
}
```

**Problemas:**
- Strings mágicas duplicadas
- Sem type-safety
- Sem valores padrão centralizados
- Propenso a erros de digitação
- Conversões manuais repetitivas

**Solução com Enum:**

```java
// ✅ Configuração centralizada e type-safe
public enum Config {
    DB_HOST("db.host", "localhost"),
    DB_PORT("db.port", "5432"),
    DB_NAME("db.name", "mydb");

    private final String chave;
    private final String valorPadrao;

    Config(String chave, String valorPadrao) {
        this.chave = chave;
        this.valorPadrao = valorPadrao;
    }

    public String get() {
        return System.getProperty(chave, valorPadrao);
    }

    public int getInt() {
        return Integer.parseInt(get());
    }
}

// Uso
String host = Config.DB_HOST.get();  // Type-safe, sem string mágica
int port = Config.DB_PORT.getInt();  // Conversão automática
```

## 📋 Fundamentos Teóricos

### Anatomia de Config Enum

**1. Chave da Configuração**

Identificador único para buscar valor (em properties, env vars, etc.)

```java
private final String chave;
```

**2. Valor Padrão**

Valor usado quando configuração não está definida

```java
private final String valorPadrao;
```

**3. Métodos de Acesso Tipados**

Conversão automática para tipos específicos

```java
public String get() { ... }
public int getInt() { ... }
public boolean getBoolean() { ... }
```

## 🔍 Exemplos Práticos

### Configurações de Aplicação

```java
public enum AppConfig {
    // Banco de dados
    DB_HOST("database.host", "localhost"),
    DB_PORT("database.port", "5432"),
    DB_NAME("database.name", "appdb"),
    DB_USER("database.user", "admin"),
    DB_PASSWORD("database.password", ""),
    DB_POOL_SIZE("database.pool.size", "10"),

    // Servidor
    SERVER_PORT("server.port", "8080"),
    SERVER_CONTEXT_PATH("server.contextPath", "/"),
    SERVER_MAX_THREADS("server.maxThreads", "200"),

    // Cache
    CACHE_ENABLED("cache.enabled", "true"),
    CACHE_TTL("cache.ttl", "3600"),

    // Logging
    LOG_LEVEL("logging.level", "INFO"),
    LOG_FILE("logging.file", "app.log");

    private final String chave;
    private final String valorPadrao;

    AppConfig(String chave, String valorPadrao) {
        this.chave = chave;
        this.valorPadrao = valorPadrao;
    }

    public String get() {
        String valor = System.getProperty(chave);
        if (valor == null) {
            valor = System.getenv(chave.replace(".", "_").toUpperCase());
        }
        return valor != null ? valor : valorPadrao;
    }

    public int getInt() {
        return Integer.parseInt(get());
    }

    public boolean getBoolean() {
        return Boolean.parseBoolean(get());
    }

    public long getLong() {
        return Long.parseLong(get());
    }

    public String getChave() {
        return chave;
    }

    public String getValorPadrao() {
        return valorPadrao;
    }
}

// Uso
int porta = AppConfig.SERVER_PORT.getInt();
boolean cacheHabilitado = AppConfig.CACHE_ENABLED.getBoolean();
String logLevel = AppConfig.LOG_LEVEL.get();
```

### Configurações com Validação

```java
public enum ServerConfig {
    PORT("server.port", "8080") {
        @Override
        public String get() {
            String valor = super.get();
            int porta = Integer.parseInt(valor);
            if (porta < 1024 || porta > 65535) {
                throw new IllegalArgumentException("Porta inválida: " + porta);
            }
            return valor;
        }
    },
    MAX_CONNECTIONS("server.maxConnections", "100") {
        @Override
        public String get() {
            String valor = super.get();
            int max = Integer.parseInt(valor);
            if (max < 1 || max > 10000) {
                throw new IllegalArgumentException("Máximo de conexões inválido: " + max);
            }
            return valor;
        }
    },
    TIMEOUT("server.timeout", "30000") {
        @Override
        public String get() {
            String valor = super.get();
            long timeout = Long.parseLong(valor);
            if (timeout < 1000) {
                throw new IllegalArgumentException("Timeout muito baixo: " + timeout);
            }
            return valor;
        }
    };

    private final String chave;
    private final String valorPadrao;

    ServerConfig(String chave, String valorPadrao) {
        this.chave = chave;
        this.valorPadrao = valorPadrao;
    }

    public String get() {
        return System.getProperty(chave, valorPadrao);
    }

    public int getInt() {
        return Integer.parseInt(get());
    }
}
```

### Configurações com Tipos Complexos

```java
public enum DataSourceConfig {
    URL("datasource.url", "jdbc:postgresql://localhost:5432/db"),
    DRIVER("datasource.driver", "org.postgresql.Driver"),
    USERNAME("datasource.username", "user"),
    PASSWORD("datasource.password", ""),
    POOL_SIZE("datasource.poolSize", "10"),
    CONNECTION_TIMEOUT("datasource.connectionTimeout", "30000"),
    IDLE_TIMEOUT("datasource.idleTimeout", "600000"),
    MAX_LIFETIME("datasource.maxLifetime", "1800000");

    private final String chave;
    private final String valorPadrao;

    DataSourceConfig(String chave, String valorPadrao) {
        this.chave = chave;
        this.valorPadrao = valorPadrao;
    }

    public String get() {
        return System.getProperty(chave, valorPadrao);
    }

    public int getInt() {
        return Integer.parseInt(get());
    }

    public long getLong() {
        return Long.parseLong(get());
    }

    // Método para criar DataSource configurado
    public static HikariDataSource criarDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(URL.get());
        config.setDriverClassName(DRIVER.get());
        config.setUsername(USERNAME.get());
        config.setPassword(PASSWORD.get());
        config.setMaximumPoolSize(POOL_SIZE.getInt());
        config.setConnectionTimeout(CONNECTION_TIMEOUT.getLong());
        config.setIdleTimeout(IDLE_TIMEOUT.getLong());
        config.setMaxLifetime(MAX_LIFETIME.getLong());

        return new HikariDataSource(config);
    }
}

// Uso
HikariDataSource dataSource = DataSourceConfig.criarDataSource();
```

### Configurações por Ambiente

```java
public enum Ambiente {
    DESENVOLVIMENTO, HOMOLOGACAO, PRODUCAO;

    public static Ambiente atual() {
        String env = System.getProperty("app.environment", "DESENVOLVIMENTO");
        return valueOf(env.toUpperCase());
    }
}

public enum DatabaseConfig {
    HOST {
        public String get(Ambiente env) {
            return switch (env) {
                case DESENVOLVIMENTO -> "localhost";
                case HOMOLOGACAO -> "hom-db.empresa.com";
                case PRODUCAO -> "prod-db.empresa.com";
            };
        }
    },
    PORT {
        public String get(Ambiente env) {
            return switch (env) {
                case DESENVOLVIMENTO -> "5432";
                case HOMOLOGACAO -> "5433";
                case PRODUCAO -> "5432";
            };
        }
    },
    DATABASE {
        public String get(Ambiente env) {
            return switch (env) {
                case DESENVOLVIMENTO -> "dev_db";
                case HOMOLOGACAO -> "hom_db";
                case PRODUCAO -> "prod_db";
            };
        }
    };

    public abstract String get(Ambiente env);

    public String get() {
        return get(Ambiente.atual());
    }
}

// Uso
String host = DatabaseConfig.HOST.get();  // Usa ambiente atual
String port = DatabaseConfig.PORT.get(Ambiente.PRODUCAO);  // Específico
```

### Configurações com Conversões Customizadas

```java
public enum CacheConfig {
    ENABLED("cache.enabled", "true", Boolean::parseBoolean),
    TTL("cache.ttl", "3600", Integer::parseInt),
    MAX_SIZE("cache.maxSize", "1000", Integer::parseInt),
    EVICTION_POLICY("cache.evictionPolicy", "LRU", String::toUpperCase),
    STRATEGY("cache.strategy", "WRITE_THROUGH", s -> EstrategiaCache.valueOf(s));

    private final String chave;
    private final String valorPadrao;
    private final Function<String, ?> conversor;

    <T> CacheConfig(String chave, String valorPadrao, Function<String, T> conversor) {
        this.chave = chave;
        this.valorPadrao = valorPadrao;
        this.conversor = conversor;
    }

    public String getString() {
        return System.getProperty(chave, valorPadrao);
    }

    @SuppressWarnings("unchecked")
    public <T> T get() {
        return (T) conversor.apply(getString());
    }

    public <T> T getOr(T fallback) {
        try {
            return get();
        } catch (Exception e) {
            return fallback;
        }
    }
}

enum EstrategiaCache {
    WRITE_THROUGH, WRITE_BEHIND, READ_THROUGH
}

// Uso
boolean cacheHabilitado = CacheConfig.ENABLED.get();
int ttl = CacheConfig.TTL.get();
EstrategiaCache estrategia = CacheConfig.STRATEGY.get();
```

## 🎯 Padrão: Builder de Configurações

```java
public enum MailConfig {
    HOST("mail.smtp.host", "smtp.gmail.com"),
    PORT("mail.smtp.port", "587"),
    USERNAME("mail.smtp.username", ""),
    PASSWORD("mail.smtp.password", ""),
    AUTH("mail.smtp.auth", "true"),
    STARTTLS("mail.smtp.starttls.enable", "true"),
    FROM("mail.from", "noreply@empresa.com");

    private final String chave;
    private final String valorPadrao;

    MailConfig(String chave, String valorPadrao) {
        this.chave = chave;
        this.valorPadrao = valorPadrao;
    }

    public String get() {
        return System.getProperty(chave, valorPadrao);
    }

    public boolean getBoolean() {
        return Boolean.parseBoolean(get());
    }

    // Builder para configurar JavaMail
    public static Session criarSession() {
        Properties props = new Properties();
        props.put("mail.smtp.host", HOST.get());
        props.put("mail.smtp.port", PORT.get());
        props.put("mail.smtp.auth", AUTH.get());
        props.put("mail.smtp.starttls.enable", STARTTLS.get());

        return Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(
                    USERNAME.get(),
                    PASSWORD.get()
                );
            }
        });
    }
}

// Uso
Session session = MailConfig.criarSession();
```

## ⚡ Vantagens

**1. Type-Safety**
```java
// ✅ Erro de compilação se config não existe
String host = AppConfig.DB_HOS.get();  // ERRO!
```

**2. Refatoração Segura**
```java
// Renomear config atualiza todos os usos automaticamente
```

**3. Documentação Centralizada**
```java
// Todas as configs visíveis em um único lugar
```

**4. Valores Padrão Garantidos**
```java
// Nunca retorna null inesperado
```

**5. Conversões Automáticas**
```java
// Sem conversões manuais repetitivas
```

## ⚠️ Limitações

**1. Configurações Dinâmicas**
```java
// ❌ Não ideal para configurações adicionadas em runtime
// Enum é fixo em tempo de compilação
```

**2. Configurações Hierárquicas Complexas**
```java
// Para estruturas JSON/YAML complexas, pode ser verboso
```

## 🔗 Interconexões

**Relação com Properties**: Enum encapsula acesso a properties

**Relação com Environment Variables**: Pode buscar de env vars

**Relação com Builder**: Configs podem construir objetos configurados
