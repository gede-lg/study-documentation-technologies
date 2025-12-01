# T5.09 - Métodos Utilitários

## Introdução

**Métodos utilitários**: funções auxiliares que facilitam operações comuns.

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
    
    // ✅ Método utilitário: buscar por código
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

**Utilitário**: método que simplifica tarefas repetitivas.

---

## Fundamentos

### 1. Método de Busca (Lookup)

```java
public enum Cor {
    VERMELHO("R"),
    VERDE("G"),
    AZUL("B");
    
    private final String codigo;
    
    Cor(String codigo) {
        this.codigo = codigo;
    }
    
    // ✅ Utilitário: buscar por código
    public static Cor porCodigo(String codigo) {
        for (Cor c : values()) {
            if (c.codigo.equals(codigo)) {
                return c;
            }
        }
        return null;
    }
}

Cor cor = Cor.porCodigo("G"); // VERDE
```

### 2. Método de Validação

```java
public enum TipoConta {
    CORRENTE, POUPANCA, SALARIO;
    
    // ✅ Utilitário: validar nome
    public static boolean isValid(String nome) {
        for (TipoConta tipo : values()) {
            if (tipo.name().equals(nome)) {
                return true;
            }
        }
        return false;
    }
}

boolean valido = TipoConta.isValid("CORRENTE"); // true
```

### 3. Método de Conversão

```java
public enum DiaSemana {
    SEGUNDA(1), TERCA(2), QUARTA(3);
    
    private final int numero;
    
    DiaSemana(int numero) {
        this.numero = numero;
    }
    
    // ✅ Utilitário: converter número para enum
    public static DiaSemana doNumero(int numero) {
        for (DiaSemana dia : values()) {
            if (dia.numero == numero) {
                return dia;
            }
        }
        throw new IllegalArgumentException("Número inválido: " + numero);
    }
}

DiaSemana dia = DiaSemana.doNumero(1); // SEGUNDA
```

### 4. Método de Listagem

```java
public enum Prioridade {
    BAIXA(1), MEDIA(5), ALTA(10);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
    }
    
    // ✅ Utilitário: listar descrições
    public static List<String> descricoes() {
        return Arrays.stream(values())
            .map(Enum::name)
            .collect(Collectors.toList());
    }
    
    // ✅ Utilitário: listar valores ordenados
    public static List<Prioridade> ordenadas() {
        return Arrays.stream(values())
            .sorted(Comparator.comparingInt(p -> p.nivel))
            .collect(Collectors.toList());
    }
}

List<String> nomes = Prioridade.descricoes(); // ["BAIXA", "MEDIA", "ALTA"]
```

### 5. Método de Filtro

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
    
    // ✅ Utilitário: filtrar visíveis
    public static List<Status> visiveis() {
        return Arrays.stream(values())
            .filter(s -> s.visivel)
            .collect(Collectors.toList());
    }
}

List<Status> visiveis = Status.visiveis(); // [ATIVO, PENDENTE]
```

### 6. Método de Contagem

```java
public enum Permissao {
    ADMIN, USER, GUEST;
    
    // ✅ Utilitário: contar total
    public static int total() {
        return values().length;
    }
    
    // ✅ Utilitário: verificar existência
    public static boolean existe(String nome) {
        try {
            valueOf(nome);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}

int total = Permissao.total(); // 3
```

### 7. Método Aleatório

```java
public enum Carta {
    AS, DOIS, TRES, QUATRO;
    
    private static final Random RANDOM = new Random();
    
    // ✅ Utilitário: carta aleatória
    public static Carta random() {
        Carta[] cartas = values();
        return cartas[RANDOM.nextInt(cartas.length)];
    }
}

Carta carta = Carta.random();
```

### 8. Método de Comparação

```java
public enum Prioridade {
    BAIXA(1), MEDIA(5), ALTA(10);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
    }
    
    // ✅ Utilitário: retornar maior
    public static Prioridade maior(Prioridade p1, Prioridade p2) {
        return p1.nivel > p2.nivel ? p1 : p2;
    }
    
    // ✅ Utilitário: retornar menor
    public static Prioridade menor(Prioridade p1, Prioridade p2) {
        return p1.nivel < p2.nivel ? p1 : p2;
    }
}

Prioridade alta = Prioridade.maior(Prioridade.BAIXA, Prioridade.ALTA); // ALTA
```

### 9. Método de Map/Transformação

```java
public enum Moeda {
    REAL("BRL"), DOLAR("USD"), EURO("EUR");
    
    private final String codigo;
    
    Moeda(String codigo) {
        this.codigo = codigo;
    }
    
    // ✅ Utilitário: codificar todas
    public static Map<String, Moeda> mapPorCodigo() {
        return Arrays.stream(values())
            .collect(Collectors.toMap(m -> m.codigo, m -> m));
    }
    
    public static List<String> codigos() {
        return Arrays.stream(values())
            .map(m -> m.codigo)
            .collect(Collectors.toList());
    }
}

Map<String, Moeda> map = Moeda.mapPorCodigo();
```

### 10. Método de Padrão

```java
public enum Idioma {
    PT_BR("Português", "pt-BR"),
    EN_US("English", "en-US"),
    ES_ES("Español", "es-ES");
    
    private final String nome;
    private final String codigo;
    
    Idioma(String nome, String codigo) {
        this.nome = nome;
        this.codigo = codigo;
    }
    
    // ✅ Utilitário: retornar padrão
    public static Idioma padrao() {
        return PT_BR;
    }
    
    // ✅ Utilitário: do código ou padrão
    public static Idioma doCodigoOuPadrao(String codigo) {
        for (Idioma i : values()) {
            if (i.codigo.equals(codigo)) {
                return i;
            }
        }
        return padrao(); // retorna padrão se não encontrar
    }
}

Idioma idioma = Idioma.doCodigoOuPadrao("invalid"); // PT_BR (padrão)
```

---

## Aplicabilidade

**Métodos utilitários** para:
- Busca/lookup (porCodigo, doNumero)
- Validação (isValid, existe)
- Conversão (doNumero, porCodigo)
- Listagem (descricoes, ordenadas)
- Filtro (visiveis)
- Random (random)
- Padrão (padrao)

---

## Armadilhas

### 1. Lookup Ineficiente

```java
// ⚠️ O(n) - percorre array sempre
public static Status porCodigo(int codigo) {
    for (Status s : values()) {
        if (s.codigo == codigo) {
            return s;
        }
    }
    return null;
}

// ✅ O(1) - usa Map
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

### 2. Retornar Null

```java
// ⚠️ Retorna null
public static Status porCodigo(int codigo) {
    // ...
    return null; // ⚠️ NullPointerException
}

// ✅ Lançar exceção
public static Status porCodigo(int codigo) {
    Status s = MAP.get(codigo);
    if (s == null) {
        throw new IllegalArgumentException("Inválido: " + codigo);
    }
    return s;
}

// ✅ Ou usar Optional
public static Optional<Status> porCodigoOpt(int codigo) {
    return Optional.ofNullable(MAP.get(codigo));
}
```

### 3. Nome Confuso

```java
// ⚠️ Nome genérico
public static Status get(int codigo) { }

// ✅ Nome descritivo
public static Status porCodigo(int codigo) { }
public static Status fromCode(int codigo) { }
```

---

## Boas Práticas

### 1. Nomes Descritivos

```java
// ✅ Nomes claros
public static Status porCodigo(int codigo) { }
public static Status fromCode(int codigo) { }
public static List<Status> visiveis() { }
public static Status padrao() { }
public static boolean existe(String nome) { }
```

### 2. Map para Performance

```java
// ✅ Map static para lookup O(1)
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

### 3. Exceção vs Null

```java
// ✅ Lançar exceção (comportamento crítico)
public static Status porCodigo(int codigo) {
    Status s = MAP.get(codigo);
    if (s == null) {
        throw new IllegalArgumentException("Código inválido: " + codigo);
    }
    return s;
}

// ✅ Retornar padrão (comportamento não crítico)
public static Status porCodigoOuPadrao(int codigo) {
    Status s = MAP.get(codigo);
    return s != null ? s : Status.ATIVO;
}
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

**Métodos utilitários**:

```java
public enum Status {
    ATIVO("Ativo", 1),
    INATIVO("Inativo", 0);
    
    private static final Map<Integer, Status> MAP = new HashMap<>();
    
    static {
        for (Status s : values()) {
            MAP.put(s.codigo, s);
        }
    }
    
    private final String descricao;
    private final int codigo;
    
    Status(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
    
    // ✅ Utilitários
    public static Status porCodigo(int codigo) {
        Status s = MAP.get(codigo);
        if (s == null) {
            throw new IllegalArgumentException("Inválido: " + codigo);
        }
        return s;
    }
    
    public static boolean existe(String nome) {
        try {
            valueOf(nome);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
    
    public static List<String> descricoes() {
        return Arrays.stream(values())
            .map(Status::getDescricao)
            .collect(Collectors.toList());
    }
}
```

**Tipos de utilitários**:

```java
// Busca
public static Status porCodigo(int codigo) { }

// Validação
public static boolean isValid(String nome) { }

// Conversão
public static Status doNumero(int numero) { }

// Listagem
public static List<String> descricoes() { }

// Filtro
public static List<Status> visiveis() { }

// Random
public static Status random() { }

// Contagem
public static int total() { }

// Comparação
public static Status maior(Status a, Status b) { }

// Padrão
public static Status padrao() { }
```

**Regra de Ouro**: Métodos **utilitários** são **static**. **Nomes descritivos** (porCodigo, fromCode, visiveis). Usar **Map** para lookup eficiente (O(1)). **Exceção** em vez de null (ou Optional). **Documentar** (Javadoc). Utilitários **simplificam** tarefas comuns (busca, validação, conversão, filtro).
