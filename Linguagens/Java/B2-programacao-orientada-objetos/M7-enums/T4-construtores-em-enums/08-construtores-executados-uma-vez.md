# T4.08 - Construtores Executados Apenas Uma Vez

## Introdução

**Execução única**: construtor de cada constante executado apenas uma vez.

```java
public enum Status {
    ATIVO("Ativo"),
    INATIVO("Inativo");
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
        System.out.println("Construtor chamado: " + descricao);
    }
}

// Primeira vez que Status é usado:
Status s1 = Status.ATIVO; // Saída: Construtor chamado: Ativo
Status s2 = Status.ATIVO; // Sem saída (já criado)
Status s3 = Status.INATIVO; // Saída: Construtor chamado: Inativo
```

**Singleton**: cada constante é única (singleton).

---

## Fundamentos

### 1. Uma Vez por Constante

```java
public enum Cor {
    VERMELHO("#FF0000"),
    VERDE("#00FF00");
    
    private final String hex;
    
    Cor(String hex) {
        this.hex = hex;
        System.out.println("Criando cor: " + hex);
    }
}

// Primeira vez que Cor é carregada:
Cor c1 = Cor.VERMELHO; // Saída: Criando cor: #FF0000
                       //         Criando cor: #00FF00
Cor c2 = Cor.VERDE;    // Sem saída (já criado)
Cor c3 = Cor.VERMELHO; // Sem saída (já criado)
```

### 2. Lazy Loading

```java
public enum Config {
    INSTANCE;
    
    Config() {
        System.out.println("Config inicializada");
    }
}

System.out.println("Antes");
Config c1 = Config.INSTANCE; // Saída: Config inicializada
System.out.println("Depois");
Config c2 = Config.INSTANCE; // Sem saída

// Saída:
// Antes
// Config inicializada
// Depois
```

### 3. Todas as Constantes Criadas

```java
public enum Prioridade {
    BAIXA(1),
    MEDIA(2),
    ALTA(3);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
        System.out.println("Criando prioridade: " + nivel);
    }
}

// Ao usar qualquer constante, TODAS são criadas:
Prioridade p = Prioridade.ALTA;
// Saída:
// Criando prioridade: 1
// Criando prioridade: 2
// Criando prioridade: 3
```

### 4. Singleton Pattern

```java
public enum Logger {
    INSTANCE;
    
    private final List<String> logs = new ArrayList<>();
    
    Logger() {
        System.out.println("Logger criado");
    }
    
    public void log(String msg) {
        logs.add(msg);
    }
    
    public List<String> getLogs() {
        return new ArrayList<>(logs);
    }
}

Logger.INSTANCE.log("Mensagem 1"); // Saída: Logger criado
Logger.INSTANCE.log("Mensagem 2"); // Sem saída
```

### 5. Thread-Safe

```java
public enum Cache {
    INSTANCE;
    
    private final Map<String, Object> data = new HashMap<>();
    
    Cache() {
        System.out.println("Cache inicializado");
    }
    
    public void put(String key, Object value) {
        data.put(key, value);
    }
}

// Thread-safe: apenas uma instância criada
// Mesmo com múltiplas threads
new Thread(() -> Cache.INSTANCE.put("key1", "value1")).start();
new Thread(() -> Cache.INSTANCE.put("key2", "value2")).start();
// Saída: Cache inicializado (apenas uma vez)
```

### 6. Atributo Static Incrementado

```java
public enum Temperatura {
    FRIO(0),
    MODERADO(20),
    QUENTE(30);
    
    private static int contador = 0;
    
    private final int graus;
    
    Temperatura(int graus) {
        this.graus = graus;
        contador++;
        System.out.println("Constante " + contador + ": " + graus + "°C");
    }
    
    public static int getContador() {
        return contador;
    }
}

System.out.println(Temperatura.getContador()); // 3
// Saída:
// Constante 1: 0°C
// Constante 2: 20°C
// Constante 3: 30°C
```

### 7. Inicialização de Recursos

```java
public enum DatabaseConnection {
    INSTANCE;
    
    private final Connection conn;
    
    DatabaseConnection() {
        System.out.println("Conectando ao banco...");
        this.conn = createConnection();
        System.out.println("Conexão estabelecida");
    }
    
    private Connection createConnection() {
        // Simular conexão
        return null;
    }
    
    public Connection getConnection() {
        return conn;
    }
}

// Conexão criada apenas uma vez
DatabaseConnection.INSTANCE.getConnection();
// Saída:
// Conectando ao banco...
// Conexão estabelecida
```

### 8. Comparação de Instâncias

```java
public enum Status {
    ATIVO("Ativo");
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
    }
}

Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

System.out.println(s1 == s2); // true (mesma instância)
```

### 9. Serialização

```java
public enum Config {
    INSTANCE;
    
    private int valor = 0;
    
    Config() {
        System.out.println("Config criada");
    }
    
    public void setValor(int v) {
        this.valor = v;
    }
    
    public int getValor() {
        return valor;
    }
}

// Serializar e desserializar mantém singleton
Config c1 = Config.INSTANCE;
c1.setValor(100);

// Serializar...
// Desserializar...
Config c2 = Config.INSTANCE; // mesma instância

System.out.println(c1 == c2); // true
```

### 10. values() Não Cria Novas Instâncias

```java
public enum Cor {
    VERMELHO, VERDE, AZUL;
    
    Cor() {
        System.out.println("Criando: " + this.name());
    }
}

// Primeira vez:
Cor[] cores1 = Cor.values();
// Saída:
// Criando: VERMELHO
// Criando: VERDE
// Criando: AZUL

// Segunda vez:
Cor[] cores2 = Cor.values(); // Sem saída (retorna clone)
```

---

## Aplicabilidade

**Execução única** para:
- Singleton pattern (thread-safe)
- Lazy loading de recursos
- Garantir imutabilidade
- Inicialização única de conexões/cache

---

## Armadilhas

### 1. Exceção no Construtor

```java
// ❌ Exceção ao carregar enum
public enum Status {
    ATIVO("Ativo"),
    INVALIDO("X");
    
    private final String descricao;
    
    Status(String descricao) {
        if (descricao.equals("X")) {
            throw new IllegalArgumentException("Inválido");
        }
        this.descricao = descricao;
    }
}

// ExceptionInInitializerError ao carregar Status
```

### 2. Construtor Pesado

```java
// ⚠️ Construtor pesado retarda carregamento
public enum Cache {
    INSTANCE;
    
    Cache() {
        // ⚠️ Operação pesada
        carregarDadosDoBanco(); // Carrega ao usar enum
    }
    
    private void carregarDadosDoBanco() {
        // Lê milhares de registros...
    }
}
```

### 3. Todas as Constantes Criadas

```java
// ⚠️ Ao usar UMA constante, TODAS são criadas
public enum Recurso {
    ARQUIVO(carregarArquivo()),
    REDE(conectarRede()),
    BANCO(conectarBanco());
    
    private final Object recurso;
    
    Recurso(Object recurso) {
        this.recurso = recurso;
    }
}

// Usar Recurso.ARQUIVO cria TODAS (arquivo, rede, banco)
```

---

## Boas Práticas

### 1. Singleton com Enum

```java
// ✅ Singleton thread-safe
public enum Singleton {
    INSTANCE;
    
    Singleton() {
        // Inicialização única
    }
    
    public void metodo() {
        System.out.println("Executando...");
    }
}

Singleton.INSTANCE.metodo();
```

### 2. Lazy Initialization

```java
// ✅ Lazy: carregado apenas ao usar
public enum Cache {
    INSTANCE;
    
    private final Map<String, Object> data = new HashMap<>();
    
    Cache() {
        System.out.println("Cache inicializado");
    }
}

// Carregado apenas quando Cache.INSTANCE é acessado
```

### 3. Thread-Safe

```java
// ✅ Thread-safe por padrão
public enum Counter {
    INSTANCE;
    
    private int count = 0;
    
    public synchronized void increment() {
        count++;
    }
    
    public int getCount() {
        return count;
    }
}
```

### 4. Construtor Leve

```java
// ✅ Construtor simples e rápido
Status(String descricao) {
    this.descricao = descricao; // ✅ Leve
}

// ❌ Evitar operações pesadas
Status(String descricao) {
    this.descricao = descricao;
    conectarBanco(); // ❌ Pesado
}
```

---

## Resumo

**Execução única**:

```java
public enum Status {
    ATIVO("Ativo");
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
        System.out.println("Criando: " + descricao);
    }
}

Status s1 = Status.ATIVO; // Saída: Criando: Ativo
Status s2 = Status.ATIVO; // Sem saída (já criado)

System.out.println(s1 == s2); // true (mesma instância)
```

**Lazy loading**:

```java
public enum Config {
    INSTANCE;
    
    Config() {
        System.out.println("Config carregada");
    }
}

System.out.println("Antes");
Config c = Config.INSTANCE; // Saída: Config carregada
System.out.println("Depois");
```

**Todas as constantes criadas**:

```java
// Ao usar qualquer constante, TODAS são criadas
Prioridade p = Prioridade.ALTA;
// Cria BAIXA, MEDIA e ALTA
```

**Singleton pattern**:

```java
// ✅ Singleton thread-safe
public enum Logger {
    INSTANCE;
    
    Logger() {
        // Inicialização única e thread-safe
    }
    
    public void log(String msg) { }
}

Logger.INSTANCE.log("Mensagem");
```

**Regra de Ouro**: Construtor executado **apenas uma vez** por constante. **Lazy loading**: carregado ao usar enum pela primeira vez. **Todas as constantes criadas** juntas (não individual). **Singleton** garantido (mesma instância). **Thread-safe** por padrão. Construtor **leve** (evite operações pesadas). Ideal para **Singleton pattern**.
