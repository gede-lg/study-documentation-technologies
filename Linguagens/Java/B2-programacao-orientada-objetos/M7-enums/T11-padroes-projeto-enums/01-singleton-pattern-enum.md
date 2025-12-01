# 🏛️ Singleton Pattern com Enum

## 🎯 Introdução e Definição

O **Singleton Pattern** implementado com enum é considerado a **forma mais eficaz, segura e concisa** de criar singletons em Java, conforme recomendado por Joshua Bloch no livro "Effective Java". Diferentemente de implementações tradicionais com classes que exigem tratamento de serialização, sincronização de threads e proteção contra reflection, um enum singleton oferece **garantias automáticas** de instância única, thread-safety e proteção contra ataques de reflection/serialização, tudo isso com apenas uma linha de código.

### Contexto Histórico

**Problema Clássico do Singleton:**

Antes de enums (pré-Java 5), implementar Singleton era complexo e sujeito a falhas:

```java
// ❌ Singleton tradicional - MUITOS problemas
public class Singleton {
    private static Singleton instance;

    private Singleton() {}  // Construtor privado

    // Problema #1: não é thread-safe
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}

// Problema #2: Reflection pode quebrar o singleton
Constructor<Singleton> constructor = Singleton.class.getDeclaredConstructor();
constructor.setAccessible(true);
Singleton instance2 = constructor.newInstance();  // Segunda instância!

// Problema #3: Serialização cria nova instância
ObjectInputStream ois = new ObjectInputStream(fileInputStream);
Singleton instance3 = (Singleton) ois.readObject();  // Terceira instância!
```

**Problemas da Implementação Tradicional:**
1. **Thread-safety**: Requer sincronização complexa (double-checked locking)
2. **Reflection**: Pode criar múltiplas instâncias via `setAccessible(true)`
3. **Serialização**: Desserialização cria nova instância
4. **Lazy initialization**: Complexidade adicional para inicialização tardia
5. **Verbosidade**: Código boilerplate extenso

**Solução com Enum (Java 5+):**

```java
// ✅ Singleton perfeito com enum
public enum Singleton {
    INSTANCE;

    public void metodo() {
        System.out.println("Método do singleton");
    }
}

// Uso
Singleton.INSTANCE.metodo();
```

**Garantias Automáticas:**
- ✅ Thread-safe por padrão (JVM garante)
- ✅ Proteção contra reflection
- ✅ Serialização segura (singleton mantido)
- ✅ Inicialização lazy automática (class loading)
- ✅ Código conciso (1 linha vs 20+ linhas)

## 📋 Fundamentos Teóricos

### Por Que Enum É Perfeito para Singleton?

**1. Instância Única Garantida pela JVM**

A JVM garante que cada constante enum é instanciada **exatamente uma vez** durante o class loading, independentemente de threads concorrentes.

```java
public enum Database {
    INSTANCE;

    private Connection connection;

    // Construtor executado APENAS UMA VEZ pela JVM
    Database() {
        connection = DriverManager.getConnection("jdbc:...");
        System.out.println("Database inicializado");
    }

    public Connection getConnection() {
        return connection;
    }
}

// Mesmo com múltiplas threads, construtor executa apenas 1x
Thread t1 = new Thread(() -> Database.INSTANCE.getConnection());
Thread t2 = new Thread(() -> Database.INSTANCE.getConnection());
// Saída: "Database inicializado" apenas UMA vez
```

**2. Proteção Contra Reflection**

Enums são especialmente protegidos pela JVM contra ataques de reflection.

```java
public enum Singleton { INSTANCE; }

// ❌ Tentativa de reflection FALHA
try {
    Constructor<Singleton> constructor = Singleton.class.getDeclaredConstructor();
    constructor.setAccessible(true);
    Singleton instance = constructor.newInstance();
} catch (IllegalArgumentException e) {
    // Lança exceção: "Cannot reflectively create enum objects"
}
```

A JVM **proíbe explicitamente** a criação de enums via reflection, ao contrário de classes normais.

**3. Serialização Segura**

Enums possuem **serialização especial** que garante singleton mesmo após desserialização.

```java
public enum Config implements Serializable {
    INSTANCE;

    private String valor = "config";
}

// Serializar
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("config.ser"));
oos.writeObject(Config.INSTANCE);

// Desserializar
ObjectInputStream ois = new ObjectInputStream(new FileInputStream("config.ser"));
Config desserializado = (Config) ois.readObject();

// ✅ MESMA INSTÂNCIA!
System.out.println(Config.INSTANCE == desserializado);  // true
```

A JVM trata desserialização de enums de forma especial, retornando a instância existente ao invés de criar nova.

## 🔍 Sintaxe e Uso

### Singleton Simples

```java
public enum Logger {
    INSTANCE;

    public void log(String message) {
        System.out.println("[LOG] " + message);
    }
}

// Uso
Logger.INSTANCE.log("Aplicação iniciada");
```

### Singleton com Estado

```java
public enum ApplicationContext {
    INSTANCE;

    private Map<String, Object> beans = new HashMap<>();

    public void registerBean(String name, Object bean) {
        beans.put(name, bean);
    }

    public Object getBean(String name) {
        return beans.get(name);
    }
}

// Uso
ApplicationContext.INSTANCE.registerBean("userService", new UserService());
UserService service = (UserService) ApplicationContext.INSTANCE.getBean("userService");
```

### Singleton com Inicialização Complexa

```java
public enum DatabasePool {
    INSTANCE;

    private final HikariDataSource dataSource;

    // Construtor para inicialização complexa
    DatabasePool() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:postgresql://localhost/mydb");
        config.setUsername("user");
        config.setPassword("pass");
        config.setMaximumPoolSize(10);

        this.dataSource = new HikariDataSource(config);
        System.out.println("Pool de conexões inicializado");
    }

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    public void close() {
        dataSource.close();
    }
}

// Uso
try (Connection conn = DatabasePool.INSTANCE.getConnection()) {
    // Usar conexão
}
```

## 🎯 Casos de Uso Práticos

### 1. Configuration Manager

```java
public enum ConfigManager {
    INSTANCE;

    private Properties properties = new Properties();

    ConfigManager() {
        try (InputStream input = getClass().getResourceAsStream("/config.properties")) {
            properties.load(input);
        } catch (IOException e) {
            throw new RuntimeException("Falha ao carregar configurações", e);
        }
    }

    public String get(String key) {
        return properties.getProperty(key);
    }

    public int getInt(String key) {
        return Integer.parseInt(properties.getProperty(key));
    }
}

// Uso
String dbUrl = ConfigManager.INSTANCE.get("database.url");
int poolSize = ConfigManager.INSTANCE.getInt("pool.size");
```

### 2. Cache Global

```java
public enum CacheManager {
    INSTANCE;

    private Map<String, Object> cache = new ConcurrentHashMap<>();

    public void put(String key, Object value) {
        cache.put(key, value);
    }

    public Object get(String key) {
        return cache.get(key);
    }

    public void clear() {
        cache.clear();
    }

    public int size() {
        return cache.size();
    }
}

// Uso
CacheManager.INSTANCE.put("user:123", user);
User cached = (User) CacheManager.INSTANCE.get("user:123");
```

### 3. Event Bus

```java
public enum EventBus {
    INSTANCE;

    private Map<Class<?>, List<Consumer<?>>> listeners = new ConcurrentHashMap<>();

    public <T> void subscribe(Class<T> eventType, Consumer<T> listener) {
        listeners.computeIfAbsent(eventType, k -> new CopyOnWriteArrayList<>()).add(listener);
    }

    public <T> void publish(T event) {
        List<Consumer<?>> eventListeners = listeners.get(event.getClass());
        if (eventListeners != null) {
            for (Consumer<?> listener : eventListeners) {
                ((Consumer<T>) listener).accept(event);
            }
        }
    }
}

// Uso
EventBus.INSTANCE.subscribe(UserCreatedEvent.class, event -> {
    System.out.println("Usuário criado: " + event.getUserName());
});

EventBus.INSTANCE.publish(new UserCreatedEvent("Alice"));
```

## ⚡ Comparação com Implementações Tradicionais

### Singleton Tradicional (Eager Initialization)

```java
public class SingletonEager {
    private static final SingletonEager INSTANCE = new SingletonEager();

    private SingletonEager() {
        if (INSTANCE != null) {
            throw new IllegalStateException("Singleton já inicializado");
        }
    }

    public static SingletonEager getInstance() {
        return INSTANCE;
    }
}

// Problemas:
// - Vulnerável a reflection (precisa de proteção manual)
// - Serialização requer readResolve()
// - Boilerplate verboso
```

### Singleton com Double-Checked Locking

```java
public class SingletonLazy {
    private static volatile SingletonLazy instance;

    private SingletonLazy() {}

    public static SingletonLazy getInstance() {
        if (instance == null) {
            synchronized (SingletonLazy.class) {
                if (instance == null) {
                    instance = new SingletonLazy();
                }
            }
        }
        return instance;
    }
}

// Problemas:
// - Complexo e difícil de entender
// - Erro sutil: esqueceu volatile = bug de concorrência
// - Ainda vulnerável a reflection e serialização
```

### Enum Singleton (Recomendado)

```java
public enum SingletonEnum {
    INSTANCE;

    public void metodo() {
        // ...
    }
}

// Vantagens:
// ✅ Thread-safe automático
// ✅ Proteção contra reflection
// ✅ Serialização segura
// ✅ Conciso e legível
```

## 💡 Melhores Práticas

**1. Use Enum para Singletons Stateless ou com Estado Fixo**

```java
// ✅ Bom: stateless utility
public enum MathUtils {
    INSTANCE;

    public double calcular(double a, double b, String op) {
        // Lógica sem estado mutável
    }
}
```

**2. Adicione Métodos de Conveniência**

```java
public enum Logger {
    INSTANCE;

    // Método de instância
    public void log(String msg) {
        System.out.println(msg);
    }

    // Método estático de conveniência
    public static void info(String msg) {
        INSTANCE.log("[INFO] " + msg);
    }
}

// Uso mais conciso
Logger.info("Mensagem");  // ao invés de Logger.INSTANCE.log(...)
```

**3. Documente Que É Singleton**

```java
/**
 * Singleton global para gerenciar configurações da aplicação.
 * Thread-safe e protegido contra reflection/serialização.
 */
public enum ConfigManager {
    INSTANCE;
    // ...
}
```

## ⚠️ Limitações

**1. Dificulta Testes Unitários**

```java
// ❌ Singleton global dificulta mock em testes
public class UserService {
    public void criarUsuario(User user) {
        DatabasePool.INSTANCE.getConnection();  // Acoplamento direto
    }
}

// ✅ Preferir injeção de dependência para testabilidade
public class UserService {
    private final DataSource dataSource;

    public UserService(DataSource dataSource) {
        this.dataSource = dataSource;
    }
}
```

**2. Estado Global Pode Causar Acoplamento**

Singletons introduzem estado global, dificultando isolamento em testes.

**3. Não Pode Ser Estendido**

```java
// ❌ Enum não pode ser estendido
public enum Logger { INSTANCE; }
// Não é possível: class CustomLogger extends Logger
```

## 🔗 Interconexões Conceituais

**Relação com Thread-Safety**: JVM garante thread-safety de enums

**Relação com Serialização**: Enum possui serialização especial

**Relação com Reflection**: JVM proíbe criação de enums via reflection

**Relação com Design Patterns**: Singleton é padrão GoF implementado com enum
