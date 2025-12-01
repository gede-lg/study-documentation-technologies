# T12.08 - Evitar Lógica Complexa em Construtores

## Introdução

**Construtor de enum**: deve ser simples e rápido.

```java
// ❌ Lógica complexa no construtor
public enum Config {
    INSTANCIA;
    
    private final Map<String, String> properties;
    
    Config() {
        properties = new HashMap<>();
        // ⚠️ Lógica complexa no construtor
        try {
            FileInputStream fis = new FileInputStream("config.properties");
            Properties props = new Properties();
            props.load(fis);
            props.forEach((k, v) -> properties.put(k.toString(), v.toString()));
            fis.close();
        } catch (IOException e) {
            e.printStackTrace(); // ⚠️ Pode falhar
        }
    }
}

// ⚠️ Problema: construtor executa na carga da classe

// ✅ Lazy initialization
public enum Config {
    INSTANCIA;
    
    private volatile Map<String, String> properties;
    
    Config() {
        // ✅ Construtor vazio
    }
    
    public Map<String, String> getProperties() {
        if (properties == null) {
            synchronized (this) {
                if (properties == null) {
                    properties = carregarProperties(); // ✅ Lazy
                }
            }
        }
        return properties;
    }
    
    private Map<String, String> carregarProperties() {
        // Lógica complexa aqui
        return new HashMap<>();
    }
}
```

**Lazy initialization** para lógica pesada.

---

## Fundamentos

### 1. Construtor Pesado

```java
// ❌ Construtor pesado
public enum DatabaseConnection {
    INSTANCIA;
    
    private final Connection connection;
    
    DatabaseConnection() {
        // ⚠️ Conexão no construtor
        try {
            connection = DriverManager.getConnection(
                "jdbc:mysql://localhost/db",
                "user",
                "password"
            );
        } catch (SQLException e) {
            throw new RuntimeException(e); // ⚠️ Pode falhar
        }
    }
}

// ⚠️ Problema: conexão criada na carga da classe
// Mesmo se nunca usar INSTANCIA

// ✅ Lazy initialization
public enum DatabaseConnection {
    INSTANCIA;
    
    private volatile Connection connection;
    
    DatabaseConnection() {
        // ✅ Vazio
    }
    
    public Connection getConnection() {
        if (connection == null) {
            synchronized (this) {
                if (connection == null) {
                    connection = criarConexao(); // ✅ Lazy
                }
            }
        }
        return connection;
    }
    
    private Connection criarConexao() {
        try {
            return DriverManager.getConnection(
                "jdbc:mysql://localhost/db",
                "user",
                "password"
            );
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
```

### 2. Exceção no Construtor

```java
// ❌ Exceção no construtor
public enum FileReader {
    INSTANCIA;
    
    private final List<String> linhas;
    
    FileReader() {
        linhas = new ArrayList<>();
        try {
            Files.lines(Paths.get("arquivo.txt"))
                 .forEach(linhas::add);
        } catch (IOException e) {
            // ⚠️ Exceção no construtor (ruim)
            throw new RuntimeException(e);
        }
    }
}

// ⚠️ Problema: se arquivo não existe, enum não carrega

// ✅ Método separado
public enum FileReader {
    INSTANCIA;
    
    FileReader() {
        // ✅ Vazio
    }
    
    public List<String> lerArquivo(String path) throws IOException {
        return Files.readAllLines(Paths.get(path));
    }
}
```

### 3. Construtor com Validação

```java
// ✅ Validação simples OK
public enum Prioridade {
    BAIXA(1),
    MEDIA(3),
    ALTA(5);
    
    private final int pontos;
    
    Prioridade(int pontos) {
        if (pontos <= 0) {
            throw new IllegalArgumentException("Pontos deve ser > 0");
        }
        this.pontos = pontos; // ✅ Validação simples OK
    }
}

// ⚠️ Validação complexa (evitar)
public enum Config {
    INSTANCIA;
    
    private final int maxConnections;
    
    Config() {
        // ⚠️ Validação complexa
        String prop = System.getProperty("max.connections");
        if (prop == null) {
            this.maxConnections = 10;
        } else {
            try {
                int value = Integer.parseInt(prop);
                if (value < 1 || value > 1000) {
                    this.maxConnections = 10;
                } else {
                    this.maxConnections = value;
                }
            } catch (NumberFormatException e) {
                this.maxConnections = 10;
            }
        }
    }
}

// ✅ Extrair para método
Config() {
    this.maxConnections = parseMaxConnections(); // ✅ Método privado
}

private int parseMaxConnections() {
    String prop = System.getProperty("max.connections", "10");
    try {
        int value = Integer.parseInt(prop);
        return (value >= 1 && value <= 1000) ? value : 10;
    } catch (NumberFormatException e) {
        return 10;
    }
}
```

### 4. Inicialização de Coleção

```java
// ❌ Construtor complexo com coleção
public enum Categoria {
    ELETRONICOS,
    ROUPAS,
    ALIMENTOS;
    
    private final List<String> produtos;
    
    Categoria() {
        produtos = new ArrayList<>();
        // ⚠️ Lógica complexa
        switch (this) {
            case ELETRONICOS:
                produtos.add("TV");
                produtos.add("Celular");
                produtos.add("Notebook");
                break;
            case ROUPAS:
                produtos.add("Camisa");
                produtos.add("Calça");
                break;
            case ALIMENTOS:
                produtos.add("Arroz");
                produtos.add("Feijão");
                break;
        }
    }
}

// ✅ Constant-specific initialization
public enum Categoria {
    ELETRONICOS(Arrays.asList("TV", "Celular", "Notebook")),
    ROUPAS(Arrays.asList("Camisa", "Calça")),
    ALIMENTOS(Arrays.asList("Arroz", "Feijão"));
    
    private final List<String> produtos;
    
    Categoria(List<String> produtos) {
        this.produtos = Collections.unmodifiableList(produtos); // ✅ Simples
    }
}
```

### 5. Bloco Static vs Construtor

```java
// ⚠️ Lógica complexa no construtor
public enum Cache {
    INSTANCIA;
    
    private final Map<String, String> cache;
    
    Cache() {
        cache = new HashMap<>();
        // ⚠️ Carregar dados no construtor
        carregarDados(cache);
    }
    
    private void carregarDados(Map<String, String> map) {
        // Lógica complexa
    }
}

// ✅ Bloco de inicialização ou lazy
public enum Cache {
    INSTANCIA;
    
    private final Map<String, String> cache = new HashMap<>();
    
    Cache() {
        // ✅ Vazio
    }
    
    {
        // ✅ Bloco de inicialização (se necessário)
        cache.put("key1", "value1");
        cache.put("key2", "value2");
    }
    
    // Ou lazy
    private volatile boolean carregado = false;
    
    public void carregar() {
        if (!carregado) {
            synchronized (this) {
                if (!carregado) {
                    carregarDados();
                    carregado = true;
                }
            }
        }
    }
}
```

### 6. Construtor com Dependências

```java
// ❌ Dependências no construtor
public enum ServiceLocator {
    INSTANCIA;
    
    private final UserService userService;
    private final OrderService orderService;
    
    ServiceLocator() {
        // ⚠️ Criar serviços no construtor
        this.userService = new UserService();
        this.orderService = new OrderService();
    }
}

// ✅ Lazy initialization
public enum ServiceLocator {
    INSTANCIA;
    
    private volatile UserService userService;
    private volatile OrderService orderService;
    
    ServiceLocator() {
        // ✅ Vazio
    }
    
    public UserService getUserService() {
        if (userService == null) {
            synchronized (this) {
                if (userService == null) {
                    userService = new UserService();
                }
            }
        }
        return userService;
    }
}
```

### 7. Tempo de Carga

```java
// ⚠️ Construtor lento
public enum HeavyInit {
    INSTANCIA;
    
    HeavyInit() {
        // ⚠️ Operação demorada
        for (int i = 0; i < 1_000_000; i++) {
            // processamento pesado
        }
    }
}

// ⚠️ Problema: atrasa carga da classe

// ✅ Lazy initialization
public enum HeavyInit {
    INSTANCIA;
    
    private volatile boolean initialized = false;
    
    HeavyInit() {
        // ✅ Vazio
    }
    
    public void init() {
        if (!initialized) {
            synchronized (this) {
                if (!initialized) {
                    processamentoPesado();
                    initialized = true;
                }
            }
        }
    }
    
    private void processamentoPesado() {
        // Lógica pesada aqui
    }
}
```

### 8. Construtor com I/O

```java
// ❌ I/O no construtor
public enum Logger {
    INSTANCIA;
    
    private final PrintWriter writer;
    
    Logger() {
        try {
            // ⚠️ I/O no construtor
            writer = new PrintWriter(new FileWriter("log.txt", true));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

// ✅ Lazy ou método separado
public enum Logger {
    INSTANCIA;
    
    private volatile PrintWriter writer;
    
    Logger() {
        // ✅ Vazio
    }
    
    public void log(String mensagem) {
        getWriter().println(mensagem);
    }
    
    private PrintWriter getWriter() {
        if (writer == null) {
            synchronized (this) {
                if (writer == null) {
                    try {
                        writer = new PrintWriter(new FileWriter("log.txt", true));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
        return writer;
    }
}
```

### 9. Construtor Simples

```java
// ✅ Construtor simples (OK)
public enum Status {
    ATIVO("Ativo", true),
    INATIVO("Inativo", false);
    
    private final String descricao;
    private final boolean ativo;
    
    Status(String descricao, boolean ativo) {
        // ✅ Apenas atribuições
        this.descricao = descricao;
        this.ativo = ativo;
    }
}

// ✅ Construtor com validação simples (OK)
public enum Prioridade {
    BAIXA(1),
    MEDIA(2),
    ALTA(3);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        if (nivel <= 0) {
            throw new IllegalArgumentException("Nível inválido");
        }
        this.nivel = nivel; // ✅ Validação simples OK
    }
}
```

### 10. Documentar Inicialização

```java
/**
 * Cache singleton.
 * 
 * <p><b>Inicialização:</b> Lazy. Cache é carregado apenas quando
 * {@link #getCache()} é chamado pela primeira vez.
 * 
 * <p><b>Thread-safety:</b> Double-checked locking garante thread-safety.
 */
public enum Cache {
    INSTANCIA;
    
    private volatile Map<String, String> cache;
    
    Cache() {
        // Construtor vazio: inicialização lazy
    }
    
    /**
     * Retorna o cache, inicializando se necessário.
     * 
     * @return cache (nunca null)
     */
    public Map<String, String> getCache() {
        if (cache == null) {
            synchronized (this) {
                if (cache == null) {
                    cache = new HashMap<>();
                }
            }
        }
        return cache;
    }
}
```

---

## Aplicabilidade

**Construtor simples** para:
- Atribuições de atributos
- Validações simples
- Inicialização de valores

**Lazy initialization** para:
- I/O (arquivo, rede, banco)
- Operações pesadas
- Dependências externas

---

## Armadilhas

### 1. I/O no Construtor

```java
// ❌ I/O no construtor
Config() {
    FileInputStream fis = new FileInputStream("config.properties"); // ⚠️
}

// ✅ Lazy
public Properties getProperties() {
    if (props == null) {
        props = carregar(); // ✅
    }
    return props;
}
```

### 2. Exceção no Construtor

```java
// ❌ Exceção checked
Config() throws IOException { } // ❌ Não permite

// ✅ Lazy ou RuntimeException
Config() {
    // ✅ Vazio
}
```

### 3. Lógica Pesada

```java
// ❌ Lógica pesada
Config() {
    for (int i = 0; i < 1_000_000; i++) { } // ⚠️
}

// ✅ Lazy
public void init() {
    // Lógica pesada
}
```

---

## Boas Práticas

### 1. Construtor Simples

```java
Status(String descricao) {
    this.descricao = descricao; // ✅ Apenas atribuição
}
```

### 2. Lazy Initialization

```java
public Object get() {
    if (obj == null) {
        synchronized (this) {
            if (obj == null) {
                obj = criar(); // ✅ Lazy
            }
        }
    }
    return obj;
}
```

### 3. Extrair Métodos

```java
Config() {
    this.value = parseValue(); // ✅ Método privado
}

private int parseValue() {
    // Lógica complexa
}
```

### 4. Documentar

```java
/**
 * @param valor valor inicial (deve ser > 0)
 * @throws IllegalArgumentException se valor <= 0
 */
Enum(int valor) { }
```

---

## Resumo

**Construtor de enum**:

```java
// ❌ Complexo
Config() {
    try {
        FileInputStream fis = new FileInputStream("config.properties");
        // ... lógica complexa
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
}

// ✅ Simples
Config() {
    // Apenas atribuições
}

// ✅ Lazy para lógica complexa
public Properties getProperties() {
    if (props == null) {
        synchronized (this) {
            if (props == null) {
                props = carregar();
            }
        }
    }
    return props;
}
```

**Regra de Ouro**: Construtor **simples** e **rápido**. **Lazy initialization** para I/O, rede, lógica pesada. **Extrair** lógica complexa para métodos privados. **Documentar** inicialização.
