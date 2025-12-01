# T10.09 - Conversão String ↔ Enum

## Introdução

**Conversão**: String → Enum (parsing) e Enum → String (formatação).

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// ✅ String → Enum
Status s1 = Status.valueOf("ATIVO");

// ✅ Enum → String
String str = Status.ATIVO.name();
```

**valueOf()**: converter String para enum. **name()**: obter nome da constante.

---

## Fundamentos

### 1. valueOf(): String → Enum

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

// ✅ Converter String para enum
String str = "VERMELHO";
Cor cor = Cor.valueOf(str);

System.out.println(cor); // VERMELHO
```

### 2. name(): Enum → String

```java
public enum Tipo {
    A, B, C
}

// ✅ Obter nome da constante
Tipo tipo = Tipo.A;
String nome = tipo.name();

System.out.println(nome); // "A"
```

### 3. toString(): Enum → String

```java
public enum Status {
    ATIVO, INATIVO;
    
    @Override
    public String toString() {
        return name().toLowerCase();
    }
}

Status s = Status.ATIVO;

// ✅ name() (sempre maiúsculo)
System.out.println(s.name()); // "ATIVO"

// ✅ toString() (customizado)
System.out.println(s.toString()); // "ativo"
```

### 4. valueOf() com Exceção

```java
public enum Nivel {
    BASICO, INTERMEDIARIO, AVANCADO
}

// ❌ Lança IllegalArgumentException se não encontrar
try {
    Nivel n = Nivel.valueOf("INVALIDO");
} catch (IllegalArgumentException e) {
    System.err.println("Valor inválido");
}
```

### 5. Método Customizado para Parsing

```java
public enum Prioridade {
    ALTA, MEDIA, BAIXA;
    
    // ✅ Método customizado (case insensitive)
    public static Prioridade fromString(String valor) {
        if (valor == null) {
            return null;
        }
        
        for (Prioridade p : values()) {
            if (p.name().equalsIgnoreCase(valor)) {
                return p;
            }
        }
        
        throw new IllegalArgumentException("Prioridade inválida: " + valor);
    }
}

// ✅ Uso
Prioridade p1 = Prioridade.fromString("alta");   // ALTA
Prioridade p2 = Prioridade.fromString("ALTA");   // ALTA
Prioridade p3 = Prioridade.fromString("Alta");   // ALTA
```

### 6. Parsing com Fallback

```java
public enum Status {
    ATIVO, INATIVO, DESCONHECIDO;
    
    // ✅ Parsing com valor padrão
    public static Status fromStringSafe(String valor) {
        try {
            return valueOf(valor.toUpperCase());
        } catch (Exception e) {
            return DESCONHECIDO; // Fallback
        }
    }
}

// ✅ Valor inválido → DESCONHECIDO
Status s = Status.fromStringSafe("invalido");
System.out.println(s); // DESCONHECIDO
```

### 7. Parsing por Atributo

```java
public enum Produto {
    NOTEBOOK("NB", "Notebook"),
    MOUSE("MS", "Mouse");
    
    private final String codigo;
    private final String nome;
    
    Produto(String codigo, String nome) {
        this.codigo = codigo;
        this.nome = nome;
    }
    
    public String getCodigo() { return codigo; }
    public String getNome() { return nome; }
    
    // ✅ Parsing por código
    public static Produto fromCodigo(String codigo) {
        for (Produto p : values()) {
            if (p.codigo.equals(codigo)) {
                return p;
            }
        }
        throw new IllegalArgumentException("Código inválido: " + codigo);
    }
    
    // ✅ Parsing por nome
    public static Produto fromNome(String nome) {
        for (Produto p : values()) {
            if (p.nome.equalsIgnoreCase(nome)) {
                return p;
            }
        }
        throw new IllegalArgumentException("Nome inválido: " + nome);
    }
}

// ✅ Uso
Produto p1 = Produto.fromCodigo("NB");      // NOTEBOOK
Produto p2 = Produto.fromNome("notebook");  // NOTEBOOK
```

### 8. Conversão com Map (Cache)

```java
import java.util.Map;
import java.util.HashMap;

public enum Tipo {
    A("Tipo A"),
    B("Tipo B"),
    C("Tipo C");
    
    private final String descricao;
    
    Tipo(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() { return descricao; }
    
    // ✅ Cache (Map estático)
    private static final Map<String, Tipo> DESCRICAO_MAP = new HashMap<>();
    
    static {
        for (Tipo t : values()) {
            DESCRICAO_MAP.put(t.descricao, t);
        }
    }
    
    // ✅ Parsing com cache (performance)
    public static Tipo fromDescricao(String descricao) {
        Tipo tipo = DESCRICAO_MAP.get(descricao);
        if (tipo == null) {
            throw new IllegalArgumentException("Descrição inválida: " + descricao);
        }
        return tipo;
    }
}

// ✅ Busca rápida (O(1))
Tipo t = Tipo.fromDescricao("Tipo A");
```

### 9. Parsing com Stream

```java
import java.util.Optional;

public enum Cor {
    VERMELHO("R"),
    VERDE("G"),
    AZUL("B");
    
    private final String sigla;
    
    Cor(String sigla) {
        this.sigla = sigla;
    }
    
    public String getSigla() { return sigla; }
    
    // ✅ Parsing com Stream
    public static Optional<Cor> fromSigla(String sigla) {
        return Arrays.stream(values())
            .filter(c -> c.sigla.equals(sigla))
            .findFirst();
    }
}

// ✅ Uso com Optional
Optional<Cor> cor = Cor.fromSigla("R");
cor.ifPresent(c -> System.out.println(c)); // VERMELHO
```

### 10. Conversão Bidirecional

```java
public enum Status {
    ATIVO("A", "Ativo"),
    INATIVO("I", "Inativo");
    
    private final String codigo;
    private final String descricao;
    
    Status(String codigo, String descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }
    
    public String getCodigo() { return codigo; }
    public String getDescricao() { return descricao; }
    
    // ✅ String → Enum
    public static Status fromCodigo(String codigo) {
        for (Status s : values()) {
            if (s.codigo.equals(codigo)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Código inválido: " + codigo);
    }
    
    // ✅ Enum → String (código)
    public String toCodigo() {
        return codigo;
    }
    
    // ✅ Enum → String (descrição)
    public String toDescricao() {
        return descricao;
    }
}

// ✅ Uso
Status s1 = Status.fromCodigo("A");  // ATIVO
String codigo = s1.toCodigo();       // "A"
String desc = s1.toDescricao();      // "Ativo"
```

---

## Aplicabilidade

**Conversão** para:
- Parsing de entrada do usuário
- Deserialização
- Configuração
- API REST

---

## Armadilhas

### 1. valueOf() Case Sensitive

```java
public enum Status {
    ATIVO, INATIVO
}

// ❌ Erro (case mismatch)
// Status s = Status.valueOf("ativo"); // IllegalArgumentException

// ✅ Usar toUpperCase()
String valor = "ativo";
Status s = Status.valueOf(valor.toUpperCase());
```

### 2. valueOf() com null

```java
// ❌ NullPointerException
// Status s = Status.valueOf(null); // NPE

// ✅ Verificar null
String valor = null;
if (valor != null) {
    Status s = Status.valueOf(valor);
}
```

### 3. valueOf() Sem Tratamento

```java
// ⚠️ Sem tratamento
String valor = "INVALIDO";
// Status s = Status.valueOf(valor); // IllegalArgumentException

// ✅ Com tratamento
try {
    Status s = Status.valueOf(valor);
} catch (IllegalArgumentException e) {
    System.err.println("Valor inválido");
}
```

---

## Boas Práticas

### 1. Método fromString() Customizado

```java
public static Status fromString(String valor) {
    if (valor == null) {
        return null;
    }
    
    for (Status s : values()) {
        if (s.name().equalsIgnoreCase(valor)) {
            return s;
        }
    }
    
    throw new IllegalArgumentException("Valor inválido: " + valor);
}
```

### 2. Fallback para Valor Padrão

```java
public static Status fromStringSafe(String valor) {
    try {
        return valueOf(valor.toUpperCase());
    } catch (Exception e) {
        return DESCONHECIDO;
    }
}
```

### 3. Cache com Map

```java
private static final Map<String, Tipo> MAP = new HashMap<>();

static {
    for (Tipo t : values()) {
        MAP.put(t.codigo, t);
    }
}

public static Tipo fromCodigo(String codigo) {
    return MAP.get(codigo);
}
```

### 4. Optional para Parsing

```java
public static Optional<Cor> fromSigla(String sigla) {
    return Arrays.stream(values())
        .filter(c -> c.sigla.equals(sigla))
        .findFirst();
}
```

---

## Resumo

**valueOf()**:

```java
public enum Status {
    ATIVO, INATIVO
}

// ✅ String → Enum
Status s = Status.valueOf("ATIVO");

// ⚠️ Case sensitive
Status s = Status.valueOf("ativo"); // ❌ Erro
```

**name()**:

```java
// ✅ Enum → String
Status s = Status.ATIVO;
String nome = s.name(); // "ATIVO"
```

**Customizado**:

```java
public static Status fromString(String valor) {
    if (valor == null) {
        return null;
    }
    
    for (Status s : values()) {
        if (s.name().equalsIgnoreCase(valor)) {
            return s;
        }
    }
    
    throw new IllegalArgumentException("Valor inválido: " + valor);
}

// ✅ Case insensitive
Status s = Status.fromString("ativo"); // ATIVO
```

**Fallback**:

```java
public static Status fromStringSafe(String valor) {
    try {
        return valueOf(valor.toUpperCase());
    } catch (Exception e) {
        return DESCONHECIDO;
    }
}
```

**Cache**:

```java
private static final Map<String, Tipo> MAP = new HashMap<>();

static {
    for (Tipo t : values()) {
        MAP.put(t.codigo, t);
    }
}

public static Tipo fromCodigo(String codigo) {
    return MAP.get(codigo);
}
```

**Regra de Ouro**: **valueOf()** é case sensitive. **Criar método customizado** (fromString) case insensitive. **Tratar exceções** ou usar fallback. **Cache com Map** para performance. **Optional** para parsing seguro. **Verificar null** antes de converter.
