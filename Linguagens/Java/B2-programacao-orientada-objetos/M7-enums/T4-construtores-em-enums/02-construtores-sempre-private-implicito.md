# T4.02 - Construtores Sempre Private (Implícito)

## Introdução

**Construtores private**: enums só podem ter construtores private.

```java
public enum Status {
    ATIVO, INATIVO;
    
    // ✅ Construtor implicitamente private
    Status() {
        System.out.println("Criando " + this.name());
    }
}

// ❌ Não pode criar instância manualmente
// Status s = new Status(); // Erro de compilação
```

**Visibilidade**: sempre private (mesmo sem declarar).

---

## Fundamentos

### 1. Private Implícito

```java
public enum Cor {
    VERMELHO, VERDE;
    
    // Construtor sem modificador = private
    Cor() {
        System.out.println("Cor: " + this.name());
    }
}

// Equivalente a:
// private Cor() { ... }
```

### 2. Declarar Private Explícito

```java
public enum Prioridade {
    ALTA, BAIXA;
    
    private Prioridade() { // ✅ Explícito
        System.out.println("Prioridade criada");
    }
}
```

### 3. Public Não Permitido

```java
// ❌ Erro de compilação
public enum Status {
    ATIVO;
    
    public Status() { } // ❌ Construtor public não permitido
}
// Erro: Illegal modifier for the enum constructor; only private is permitted
```

### 4. Protected Não Permitido

```java
// ❌ Erro de compilação
public enum Tipo {
    A, B;
    
    protected Tipo() { } // ❌ protected não permitido
}
```

### 5. Package-Private Não Permitido

```java
// ❌ Erro de compilação
public enum Direcao {
    NORTE;
    
    Direcao() { } // ✅ Compila (implicitamente private)
}

// Tentar tornar package-private:
// ❌ Não há sintaxe para isso (sempre private)
```

### 6. Chamado Automaticamente

```java
public enum Moeda {
    REAL("BRL"), DOLAR("USD");
    
    private final String codigo;
    
    private Moeda(String codigo) {
        this.codigo = codigo;
        System.out.println("Construtor chamado: " + codigo);
    }
}

// Saída (na primeira vez que Moeda é carregada):
// Construtor chamado: BRL
// Construtor chamado: USD
```

### 7. Não Pode Instanciar

```java
public enum Status {
    ATIVO;
    
    private Status() { }
}

// ❌ Não compila
// Status s = new Status();

// ✅ Usar constantes existentes
Status s = Status.ATIVO;
```

### 8. Singleton Garantido

```java
public enum Config {
    INSTANCE;
    
    private Config() {
        System.out.println("Config inicializada");
    }
    
    public void configure() {
        System.out.println("Configurando...");
    }
}

Config.INSTANCE.configure();
```

### 9. Reflexão Não Pode Criar

```java
public enum Tipo {
    A, B;
    
    private Tipo() { }
}

// ❌ Reflexão não pode criar instância
try {
    Constructor<Tipo> ctor = Tipo.class.getDeclaredConstructor();
    ctor.setAccessible(true);
    Tipo t = ctor.newInstance(); // ❌ Lança IllegalArgumentException
} catch (Exception e) {
    System.out.println(e); // Cannot reflectively create enum objects
}
```

### 10. Compilador Controla

```java
public enum Status {
    ATIVO("Ativo");
    
    private final String descricao;
    
    // Construtor private (implícito ou explícito)
    Status(String descricao) {
        this.descricao = descricao;
    }
}

// Compilador garante:
// 1. Apenas constantes declaradas no enum
// 2. Construtor chamado apenas na inicialização
// 3. Não pode criar novas instâncias em runtime
```

---

## Aplicabilidade

**Construtores private** para:
- Garantir singleton (cada constante única)
- Prevenir instanciação externa
- Controlar criação de instâncias
- Segurança de tipo

---

## Armadilhas

### 1. Tentar Public

```java
// ❌ Erro de compilação
public enum Cor {
    VERMELHO;
    
    public Cor() { } // ❌ Illegal modifier
}
```

### 2. Tentar Protected

```java
// ❌ Erro de compilação
public enum Tipo {
    A;
    
    protected Tipo() { } // ❌ Illegal modifier
}
```

### 3. Reflexão

```java
// ❌ Não pode criar via reflexão
// Constructor<Status> ctor = Status.class.getDeclaredConstructor();
// ctor.setAccessible(true);
// Status s = ctor.newInstance(); // IllegalArgumentException
```

---

## Boas Práticas

### 1. Omitir Private

```java
// ✅ Omitir private (implícito)
public enum Status {
    ATIVO;
    
    Status() { } // ✅ Mais conciso
}

// ✅ Ou declarar explícito (mais claro)
private Status() { }
```

### 2. Singleton com Enum

```java
// ✅ Singleton thread-safe
public enum DatabaseConnection {
    INSTANCE;
    
    private final Connection conn;
    
    DatabaseConnection() {
        this.conn = createConnection();
    }
    
    private Connection createConnection() {
        // Criar conexão
        return null;
    }
    
    public Connection getConnection() {
        return conn;
    }
}

// Uso:
Connection c = DatabaseConnection.INSTANCE.getConnection();
```

### 3. Documentar Construtor

```java
// ✅ Documentar parâmetros
public enum Moeda {
    REAL("BRL", "R$");
    
    private final String codigo;
    private final String simbolo;
    
    /**
     * Construtor do enum Moeda.
     * @param codigo Código ISO da moeda (ex: BRL, USD)
     * @param simbolo Símbolo da moeda (ex: R$, $)
     */
    Moeda(String codigo, String simbolo) {
        this.codigo = codigo;
        this.simbolo = simbolo;
    }
}
```

---

## Resumo

**Construtores private**:

```java
public enum Status {
    ATIVO, INATIVO;
    
    // Construtor sempre private (implícito ou explícito)
    Status() {
        System.out.println("Criando " + this.name());
    }
}

// Equivalente:
private Status() { ... }

// ❌ Não permitido:
public Status() { }     // ❌ Erro
protected Status() { }  // ❌ Erro
```

**Visibilidade**:

```java
// Apenas private permitido
public enum Cor {
    VERMELHO;
    
    Cor() { }           // ✅ Implicitamente private
    private Cor() { }   // ✅ Explicitamente private
    
    public Cor() { }    // ❌ Erro de compilação
    protected Cor() { } // ❌ Erro de compilação
}
```

**Não pode instanciar**:

```java
public enum Status {
    ATIVO;
    
    private Status() { }
}

// ❌ Não compila
// Status s = new Status();

// ❌ Reflexão lança exceção
// Constructor<Status> ctor = Status.class.getDeclaredConstructor();
// ctor.setAccessible(true);
// Status s = ctor.newInstance(); // IllegalArgumentException

// ✅ Usar constantes
Status s = Status.ATIVO;
```

**Singleton**:

```java
// ✅ Enum = singleton thread-safe
public enum Config {
    INSTANCE;
    
    private Config() {
        System.out.println("Única instância criada");
    }
    
    public void metodo() { }
}

Config.INSTANCE.metodo();
```

**Regra de Ouro**: Construtores em enums são **sempre private** (implícito ou explícito). **Não pode** usar public, protected ou package-private. **Compilador garante** singleton (cada constante única). **Não pode** criar instância com `new`. **Reflexão** não funciona (IllegalArgumentException). Use enum para **Singleton pattern** thread-safe.
