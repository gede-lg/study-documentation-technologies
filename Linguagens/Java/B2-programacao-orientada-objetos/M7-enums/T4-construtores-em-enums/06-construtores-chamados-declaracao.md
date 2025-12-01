# T4.06 - Construtores Chamados na Declaração

## Introdução

**Chamada do construtor**: ocorre automaticamente na declaração da constante.

```java
public enum Status {
    ATIVO("Ativo"),  // Chama Status("Ativo")
    INATIVO("Inativo"); // Chama Status("Inativo")
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
        System.out.println("Construtor chamado: " + descricao);
    }
}

// Saída (na primeira vez que Status é carregado):
// Construtor chamado: Ativo
// Construtor chamado: Inativo
```

**Automático**: compilador chama construtor ao declarar constante.

---

## Fundamentos

### 1. Chamada Básica

```java
public enum Cor {
    VERMELHO("#FF0000"), // Chama Cor("#FF0000")
    VERDE("#00FF00");    // Chama Cor("#00FF00")
    
    private final String hex;
    
    Cor(String hex) {
        this.hex = hex;
        System.out.println("Criando cor: " + hex);
    }
}

// Saída:
// Criando cor: #FF0000
// Criando cor: #00FF00
```

### 2. Ordem de Execução

```java
public enum Prioridade {
    BAIXA(1),
    MEDIA(2),
    ALTA(3);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
        System.out.println("Prioridade criada: " + nivel);
    }
}

// Saída (ordem de declaração):
// Prioridade criada: 1
// Prioridade criada: 2
// Prioridade criada: 3
```

### 3. Argumentos Passados

```java
public enum Moeda {
    REAL("BRL", "R$"),  // Chama Moeda("BRL", "R$")
    DOLAR("USD", "$");  // Chama Moeda("USD", "$")
    
    private final String codigo;
    private final String simbolo;
    
    Moeda(String codigo, String simbolo) {
        this.codigo = codigo;
        this.simbolo = simbolo;
        System.out.println("Moeda: " + codigo + " " + simbolo);
    }
}

// Saída:
// Moeda: BRL R$
// Moeda: USD $
```

### 4. Sem Argumentos

```java
public enum Direcao {
    NORTE,  // Chama Direcao()
    SUL,    // Chama Direcao()
    LESTE,  // Chama Direcao()
    OESTE;  // Chama Direcao()
    
    Direcao() {
        System.out.println("Direção criada: " + this.name());
    }
}

// Saída:
// Direção criada: NORTE
// Direção criada: SUL
// Direção criada: LESTE
// Direção criada: OESTE
```

### 5. Múltiplos Construtores

```java
public enum Status {
    ATIVO("Ativo", 1),  // Chama Status(String, int)
    INATIVO("Inativo"), // Chama Status(String)
    PENDENTE;           // Chama Status()
    
    private final String descricao;
    private final int codigo;
    
    Status(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
        System.out.println("Construtor 1: " + descricao + ", " + codigo);
    }
    
    Status(String descricao) {
        this(descricao, 0);
        System.out.println("Construtor 2: " + descricao);
    }
    
    Status() {
        this("Pendente", -1);
        System.out.println("Construtor 3");
    }
}

// Saída:
// Construtor 1: Ativo, 1
// Construtor 1: Inativo, 0
// Construtor 2: Inativo
// Construtor 1: Pendente, -1
// Construtor 3
```

### 6. Inicialização Única

```java
public enum Singleton {
    INSTANCE;
    
    Singleton() {
        System.out.println("Singleton inicializado");
    }
}

// Primeira vez que Singleton é usado:
Singleton s1 = Singleton.INSTANCE; // Saída: Singleton inicializado
Singleton s2 = Singleton.INSTANCE; // Sem saída (já inicializado)
```

### 7. Lazy Loading

```java
public enum Config {
    INSTANCE;
    
    Config() {
        System.out.println("Config carregada");
    }
}

System.out.println("Antes de usar Config");
Config c = Config.INSTANCE; // Saída: Config carregada
System.out.println("Depois de usar Config");

// Saída:
// Antes de usar Config
// Config carregada
// Depois de usar Config
```

### 8. Validação no Construtor

```java
public enum Percentual {
    P10(10),
    P50(50),
    P100(100);
    
    private final int valor;
    
    Percentual(int valor) {
        if (valor < 0 || valor > 100) {
            throw new IllegalArgumentException("Inválido: " + valor);
        }
        this.valor = valor;
        System.out.println("Percentual válido: " + valor);
    }
}

// Saída:
// Percentual válido: 10
// Percentual válido: 50
// Percentual válido: 100
```

### 9. Inicialização de Atributo Static

```java
public enum Temperatura {
    FRIO(0),
    QUENTE(30);
    
    private static int contador = 0; // static
    
    private final int graus;
    
    Temperatura(int graus) {
        this.graus = graus;
        contador++;
        System.out.println("Temperatura " + contador + ": " + graus);
    }
    
    public static int getContador() {
        return contador;
    }
}

System.out.println(Temperatura.getContador()); // 2
// Saída:
// Temperatura 1: 0
// Temperatura 2: 30
```

### 10. Thread-Safe

```java
public enum DatabaseConnection {
    INSTANCE;
    
    private final Connection conn;
    
    DatabaseConnection() {
        System.out.println("Conectando ao banco...");
        this.conn = createConnection();
    }
    
    private Connection createConnection() {
        // Simular criação de conexão
        return null;
    }
    
    public Connection getConnection() {
        return conn;
    }
}

// Thread-safe: apenas uma instância criada
DatabaseConnection.INSTANCE.getConnection();
```

---

## Aplicabilidade

**Construtor chamado na declaração** para:
- Inicializar automaticamente constantes
- Lazy loading (primeira vez que enum é usado)
- Singleton thread-safe
- Validar argumentos na criação

---

## Armadilhas

### 1. Exceção no Construtor

```java
// ⚠️ Exceção ao carregar enum
public enum Status {
    ATIVO("Ativo"),
    INVALIDO("X"); // ❌ Lança exceção
    
    private final String descricao;
    
    Status(String descricao) {
        if (descricao.length() > 10) {
            throw new IllegalArgumentException("Muito longo");
        }
        this.descricao = descricao;
    }
}

// ExceptionInInitializerError ao carregar enum
```

### 2. Ordem de Inicialização

```java
// ⚠️ Atributo static usado antes de inicializar
public enum Cor {
    VERMELHO("#FF0000");
    
    private static final Map<String, Cor> MAP = new HashMap<>();
    
    private final String hex;
    
    Cor(String hex) {
        this.hex = hex;
        MAP.put(hex, this); // ⚠️ MAP pode não estar inicializado
    }
}
```

### 3. Construtor Pesado

```java
// ⚠️ Construtor pesado retarda carregamento
public enum Config {
    INSTANCE;
    
    Config() {
        // ⚠️ Operação pesada (carrega ao usar enum)
        carregarConfiguracao();
    }
    
    private void carregarConfiguracao() {
        // Lê arquivo, conecta BD, etc.
    }
}
```

---

## Boas Práticas

### 1. Construtor Leve

```java
// ✅ Construtor simples e rápido
public enum Status {
    ATIVO("Ativo");
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao; // ✅ Leve
    }
}
```

### 2. Singleton com Enum

```java
// ✅ Singleton thread-safe
public enum Logger {
    INSTANCE;
    
    Logger() {
        // Inicialização única
    }
    
    public void log(String msg) {
        System.out.println(msg);
    }
}

Logger.INSTANCE.log("Mensagem");
```

### 3. Validação no Construtor

```java
// ✅ Validar argumentos
Percentual(int valor) {
    if (valor < 0 || valor > 100) {
        throw new IllegalArgumentException("Inválido: " + valor);
    }
    this.valor = valor;
}
```

### 4. Lazy Initialization

```java
// ✅ Enum carregado apenas quando usado
public enum Cache {
    INSTANCE;
    
    private final Map<String, Object> data = new HashMap<>();
    
    Cache() {
        System.out.println("Cache inicializado");
    }
}

// Carregado apenas na primeira vez
Cache.INSTANCE.data.put("key", "value");
```

---

## Resumo

**Construtor chamado automaticamente**:

```java
public enum Status {
    ATIVO("Ativo"),  // Chama Status("Ativo")
    INATIVO("Inativo"); // Chama Status("Inativo")
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
        System.out.println("Criando: " + descricao);
    }
}

// Saída (primeira vez que Status é carregado):
// Criando: Ativo
// Criando: Inativo
```

**Ordem de execução**:

```java
BAIXA(1),  // 1º construtor chamado
MEDIA(2),  // 2º construtor chamado
ALTA(3);   // 3º construtor chamado
```

**Lazy loading**:

```java
public enum Config {
    INSTANCE;
    
    Config() {
        System.out.println("Config carregada");
    }
}

// Carregado apenas na primeira vez:
Config c = Config.INSTANCE; // Saída: Config carregada
Config d = Config.INSTANCE; // Sem saída
```

**Thread-safe**:

```java
// ✅ Singleton thread-safe
public enum Singleton {
    INSTANCE;
    
    Singleton() {
        // Inicialização única e thread-safe
    }
}
```

**Regra de Ouro**: Construtor **chamado automaticamente** na declaração da constante. Ordem de execução = **ordem de declaração**. **Lazy loading**: carregado na primeira vez que enum é usado. **Thread-safe**: garantido pela JVM. Construtor **leve** (evite operações pesadas). **Validar** argumentos. Ideal para **Singleton pattern**.
