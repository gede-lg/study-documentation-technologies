# T5.05 - Métodos Static em Enums

## Introdução

**Métodos static**: compartilhados por todas as constantes, chamados via classe.

```java
public enum Status {
    ATIVO("Ativo", 1),
    INATIVO("Inativo", 0),
    PENDENTE("Pendente", 2);
    
    private final String descricao;
    private final int codigo;
    
    Status(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
    
    // ✅ Método static
    public static Status porCodigo(int codigo) {
        for (Status s : values()) {
            if (s.codigo == codigo) {
                return s;
            }
        }
        throw new IllegalArgumentException("Código inválido: " + codigo);
    }
}

Status status = Status.porCodigo(1); // ATIVO
```

**Static**: chamado via `NomeEnum.metodo()`, não via constante.

---

## Fundamentos

### 1. Lookup por Valor

```java
public enum Cor {
    VERMELHO(1),
    VERDE(2),
    AZUL(3);
    
    private final int codigo;
    
    Cor(int codigo) {
        this.codigo = codigo;
    }
    
    // ✅ Método static para lookup
    public static Cor porCodigo(int codigo) {
        for (Cor c : values()) {
            if (c.codigo == codigo) {
                return c;
            }
        }
        return null;
    }
}

Cor cor = Cor.porCodigo(2); // VERDE
```

### 2. Lookup com Map (Eficiente)

```java
public enum Moeda {
    REAL("BRL"),
    DOLAR("USD"),
    EURO("EUR");
    
    private static final Map<String, Moeda> MAP = new HashMap<>();
    
    static {
        for (Moeda m : values()) {
            MAP.put(m.codigo, m);
        }
    }
    
    private final String codigo;
    
    Moeda(String codigo) {
        this.codigo = codigo;
    }
    
    // ✅ Lookup O(1)
    public static Moeda porCodigo(String codigo) {
        return MAP.get(codigo);
    }
}

Moeda moeda = Moeda.porCodigo("USD"); // DOLAR
```

### 3. Método de Validação Static

```java
public enum TipoConta {
    CORRENTE, POUPANCA, SALARIO;
    
    // ✅ Validação static
    public static boolean isValid(String nome) {
        for (TipoConta tipo : values()) {
            if (tipo.name().equals(nome)) {
                return true;
            }
        }
        return false;
    }
    
    public static TipoConta parse(String nome) {
        if (!isValid(nome)) {
            throw new IllegalArgumentException("Tipo inválido: " + nome);
        }
        return valueOf(nome);
    }
}

boolean valido = TipoConta.isValid("CORRENTE"); // true
```

### 4. Método Factory Static

```java
public enum Temperatura {
    CELSIUS, FAHRENHEIT, KELVIN;
    
    // ✅ Factory method
    public static Temperatura doCodigo(String codigo) {
        switch (codigo.toUpperCase()) {
            case "C": return CELSIUS;
            case "F": return FAHRENHEIT;
            case "K": return KELVIN;
            default: throw new IllegalArgumentException("Código inválido");
        }
    }
    
    public static Temperatura padrao() {
        return CELSIUS;
    }
}

Temperatura temp = Temperatura.doCodigo("F"); // FAHRENHEIT
```

### 5. Método Utilitário Static

```java
public enum Prioridade {
    BAIXA(1), MEDIA(5), ALTA(10);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
    }
    
    // ✅ Utilitário static
    public static Prioridade maisAlta(Prioridade p1, Prioridade p2) {
        return p1.nivel > p2.nivel ? p1 : p2;
    }
    
    public static List<Prioridade> ordenadas() {
        return Arrays.stream(values())
            .sorted(Comparator.comparingInt(p -> p.nivel))
            .collect(Collectors.toList());
    }
}

Prioridade alta = Prioridade.maisAlta(Prioridade.BAIXA, Prioridade.ALTA); // ALTA
```

### 6. Método de Conversão Static

```java
public enum DiaSemana {
    SEGUNDA(1), TERCA(2), QUARTA(3);
    
    private final int numero;
    
    DiaSemana(int numero) {
        this.numero = numero;
    }
    
    // ✅ Conversão static
    public static DiaSemana doNumero(int numero) {
        for (DiaSemana dia : values()) {
            if (dia.numero == numero) {
                return dia;
            }
        }
        throw new IllegalArgumentException("Dia inválido: " + numero);
    }
    
    public static List<String> nomes() {
        return Arrays.stream(values())
            .map(Enum::name)
            .collect(Collectors.toList());
    }
}
```

### 7. Atributo Static

```java
public enum Config {
    INSTANCE;
    
    private static final String VERSAO = "1.0.0"; // ✅ static
    private static int contador = 0;              // ✅ static
    
    // ✅ Getter static
    public static String getVersao() {
        return VERSAO;
    }
    
    public static int getContador() {
        return contador;
    }
    
    public static void incrementarContador() {
        contador++;
    }
}

String versao = Config.getVersao(); // "1.0.0"
```

### 8. Bloco Static

```java
public enum Permissao {
    ADMIN, USER, GUEST;
    
    private static final Map<String, Permissao> CACHE = new HashMap<>();
    
    // ✅ Bloco static de inicialização
    static {
        for (Permissao p : values()) {
            CACHE.put(p.name().toLowerCase(), p);
        }
    }
    
    public static Permissao parse(String nome) {
        return CACHE.get(nome.toLowerCase());
    }
}
```

### 9. Método Random Static

```java
public enum Cor {
    VERMELHO, VERDE, AZUL;
    
    private static final Random RANDOM = new Random();
    
    // ✅ Retorna constante aleatória
    public static Cor random() {
        Cor[] valores = values();
        return valores[RANDOM.nextInt(valores.length)];
    }
}

Cor corAleatoria = Cor.random();
```

### 10. Método de Filtro Static

```java
public enum Status {
    ATIVO("Ativo", true),
    INATIVO("Inativo", false),
    PENDENTE("Pendente", true);
    
    private final String descricao;
    private final boolean visivel;
    
    Status(String descricao, boolean visivel) {
        this.descricao = descricao;
        this.visivel = visivel;
    }
    
    // ✅ Filtro static
    public static List<Status> visiveis() {
        return Arrays.stream(values())
            .filter(s -> s.visivel)
            .collect(Collectors.toList());
    }
    
    public static long contar(boolean visivel) {
        return Arrays.stream(values())
            .filter(s -> s.visivel == visivel)
            .count();
    }
}

List<Status> visiveis = Status.visiveis(); // [ATIVO, PENDENTE]
```

---

## Aplicabilidade

**Métodos static** para:
- Lookup reverso (valor → enum)
- Factory methods
- Validação de entrada
- Métodos utilitários

---

## Armadilhas

### 1. Lookup Ineficiente

```java
// ⚠️ O(n) - percorre array
public static Status porCodigo(int codigo) {
    for (Status s : values()) {
        if (s.codigo == codigo) {
            return s;
        }
    }
    return null;
}

// ✅ O(1) - usa Map
private static final Map<Integer, Status> MAP = ...
public static Status porCodigo(int codigo) {
    return MAP.get(codigo);
}
```

### 2. Retornar Null

```java
// ⚠️ Retorna null
public static Status porCodigo(int codigo) {
    // ...
    return null; // ⚠️ NullPointerException
}

// ✅ Lançar exceção ou Optional
public static Status porCodigo(int codigo) {
    Status s = MAP.get(codigo);
    if (s == null) {
        throw new IllegalArgumentException("Inválido: " + codigo);
    }
    return s;
}
```

### 3. Nome Confuso

```java
// ⚠️ Nome não intuitivo
public static Status get(int codigo) { }

// ✅ Nome descritivo
public static Status porCodigo(int codigo) { }
public static Status fromCode(int codigo) { }
```

---

## Boas Práticas

### 1. Map para Lookup

```java
// ✅ Map para performance
private static final Map<Integer, Status> MAP = new HashMap<>();

static {
    for (Status s : values()) {
        MAP.put(s.codigo, s);
    }
}

public static Status porCodigo(int codigo) {
    return MAP.get(codigo);
}
```

### 2. Exceção em vez de Null

```java
// ✅ Lançar exceção
public static Status porCodigo(int codigo) {
    Status s = MAP.get(codigo);
    if (s == null) {
        throw new IllegalArgumentException("Código inválido: " + codigo);
    }
    return s;
}

// ✅ Ou usar Optional
public static Optional<Status> porCodigoOpt(int codigo) {
    return Optional.ofNullable(MAP.get(codigo));
}
```

### 3. Nome Descritivo

```java
// ✅ Nomes claros
public static Status porCodigo(int codigo) { }
public static Status fromCode(int codigo) { }
public static Status parse(String nome) { }
public static List<Status> visiveis() { }
```

### 4. Documentar

```java
// ✅ Javadoc
/**
 * Busca Status pelo código.
 * @param codigo código numérico (1, 0, 2)
 * @return Status correspondente
 * @throws IllegalArgumentException se código inválido
 */
public static Status porCodigo(int codigo) {
    // ...
}
```

---

## Resumo

**Métodos static**:

```java
public enum Status {
    ATIVO(1), INATIVO(0);
    
    private static final Map<Integer, Status> MAP = new HashMap<>();
    
    static {
        for (Status s : values()) {
            MAP.put(s.codigo, s);
        }
    }
    
    private final int codigo;
    
    Status(int codigo) {
        this.codigo = codigo;
    }
    
    // ✅ Método static
    public static Status porCodigo(int codigo) {
        Status s = MAP.get(codigo);
        if (s == null) {
            throw new IllegalArgumentException("Inválido: " + codigo);
        }
        return s;
    }
}

Status.porCodigo(1); // ATIVO
```

**Tipos de métodos static**:

```java
// Lookup
public static Status porCodigo(int codigo) { }

// Factory
public static Status padrao() { }
public static Status doCodigo(String codigo) { }

// Validação
public static boolean isValid(String nome) { }

// Utilitário
public static Status maisAlta(Status a, Status b) { }
public static List<Status> ordenadas() { }

// Random
public static Status random() { }

// Filtro
public static List<Status> visiveis() { }
```

**Regra de Ouro**: Métodos **static** chamados via classe (`Status.porCodigo()`), não via constante. Use para **lookup reverso** (valor → enum), **factory methods**, **validação**, **utilitários**. **Map** para lookup eficiente (O(1)). **Exceção** em vez de null. **Nome descritivo** (porCodigo, fromCode, parse).
