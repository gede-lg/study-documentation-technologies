# 🔍 Lookup Map para valueOf() Customizado

## 🎯 Introdução

Um **lookup map** em enums oferece busca **O(1) customizada** baseada em atributos específicos, ao invés de apenas `name()` como `valueOf()` padrão. Este padrão utiliza um **Map estático privado** inicializado no bloco estático do enum, mapeando valores customizados (código, ID, descrição) para constantes, permitindo buscas eficientes e type-safe sem repetir lógica de iteração.

### Problema do valueOf() Padrão

**Limitação: Apenas name()**

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// ✅ valueOf() busca por name
Status status = Status.valueOf("ATIVO");  // Funciona

// ❌ Não funciona com valores customizados
// Status status = Status.valueOf("A");  // Lança IllegalArgumentException

// ❌ Solução ingênua: iterar values()
public static Status porCodigo(String codigo) {
    for (Status s : Status.values()) {
        if (s.getCodigo().equals(codigo)) {
            return s;
        }
    }
    return null;
}
// Problema: O(n) - linear search, ineficiente
```

**Solução: Lookup Map**

```java
public enum Status {
    ATIVO("A"), INATIVO("I"), PENDENTE("P");

    private final String codigo;

    // Lookup map estático - O(1)
    private static final Map<String, Status> POR_CODIGO;

    static {
        POR_CODIGO = new HashMap<>();
        for (Status s : values()) {
            POR_CODIGO.put(s.codigo, s);
        }
    }

    Status(String codigo) {
        this.codigo = codigo;
    }

    public String getCodigo() {
        return codigo;
    }

    // Busca O(1) via map
    public static Status porCodigo(String codigo) {
        Status status = POR_CODIGO.get(codigo);
        if (status == null) {
            throw new IllegalArgumentException("Código inválido: " + codigo);
        }
        return status;
    }
}

// Uso
Status status = Status.porCodigo("A");  // O(1) - rápido!
```

## 📋 Fundamentos Teóricos

### Por Que Lookup Map?

**1. Performance: O(1) vs O(n)**

```java
// ❌ Iteração linear - O(n)
for (Status s : Status.values()) {
    if (s.getCodigo().equals(codigo)) return s;
}

// ✅ Lookup map - O(1)
return POR_CODIGO.get(codigo);
```

**2. Inicialização Única**

Map é criado uma única vez no class loading, sem overhead em cada chamada.

```java
static {
    POR_CODIGO = new HashMap<>();  // Uma vez apenas
    for (Status s : values()) {
        POR_CODIGO.put(s.codigo, s);
    }
}
```

**3. Thread-Safe**

Map imutável (apenas leitura após inicialização) é naturalmente thread-safe.

## 🔍 Exemplos Práticos

### Lookup por Código Numérico

```java
public enum TipoDocumento {
    CPF(1, "Cadastro de Pessoa Física"),
    CNPJ(2, "Cadastro Nacional de Pessoa Jurídica"),
    RG(3, "Registro Geral"),
    CNH(4, "Carteira Nacional de Habilitação"),
    PASSAPORTE(5, "Passaporte");

    private final int codigo;
    private final String descricao;

    // Lookup map por código
    private static final Map<Integer, TipoDocumento> POR_CODIGO;

    static {
        POR_CODIGO = new HashMap<>();
        for (TipoDocumento tipo : values()) {
            POR_CODIGO.put(tipo.codigo, tipo);
        }
    }

    TipoDocumento(int codigo, String descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }

    public int getCodigo() {
        return codigo;
    }

    public String getDescricao() {
        return descricao;
    }

    public static TipoDocumento porCodigo(int codigo) {
        TipoDocumento tipo = POR_CODIGO.get(codigo);
        if (tipo == null) {
            throw new IllegalArgumentException("Código de documento inválido: " + codigo);
        }
        return tipo;
    }

    // Método opcional que retorna Optional
    public static Optional<TipoDocumento> porCodigoOpt(int codigo) {
        return Optional.ofNullable(POR_CODIGO.get(codigo));
    }
}

// Uso
TipoDocumento tipo = TipoDocumento.porCodigo(1);  // CPF
Optional<TipoDocumento> opt = TipoDocumento.porCodigoOpt(99);  // empty
```

### Múltiplos Lookup Maps

```java
public enum Pais {
    BRASIL("BR", "BRA", "Brasil", "+55"),
    ESTADOS_UNIDOS("US", "USA", "Estados Unidos", "+1"),
    ARGENTINA("AR", "ARG", "Argentina", "+54"),
    PORTUGAL("PT", "PRT", "Portugal", "+351");

    private final String codigoISO2;
    private final String codigoISO3;
    private final String nome;
    private final String ddi;

    // Múltiplos lookups
    private static final Map<String, Pais> POR_ISO2;
    private static final Map<String, Pais> POR_ISO3;
    private static final Map<String, Pais> POR_DDI;

    static {
        POR_ISO2 = new HashMap<>();
        POR_ISO3 = new HashMap<>();
        POR_DDI = new HashMap<>();

        for (Pais pais : values()) {
            POR_ISO2.put(pais.codigoISO2, pais);
            POR_ISO3.put(pais.codigoISO3, pais);
            POR_DDI.put(pais.ddi, pais);
        }
    }

    Pais(String codigoISO2, String codigoISO3, String nome, String ddi) {
        this.codigoISO2 = codigoISO2;
        this.codigoISO3 = codigoISO3;
        this.nome = nome;
        this.ddi = ddi;
    }

    public static Pais porISO2(String codigo) {
        return Optional.ofNullable(POR_ISO2.get(codigo))
            .orElseThrow(() -> new IllegalArgumentException("Código ISO2 inválido: " + codigo));
    }

    public static Pais porISO3(String codigo) {
        return Optional.ofNullable(POR_ISO3.get(codigo))
            .orElseThrow(() -> new IllegalArgumentException("Código ISO3 inválido: " + codigo));
    }

    public static Pais porDDI(String ddi) {
        return Optional.ofNullable(POR_DDI.get(ddi))
            .orElseThrow(() -> new IllegalArgumentException("DDI inválido: " + ddi));
    }

    public String getCodigoISO2() { return codigoISO2; }
    public String getCodigoISO3() { return codigoISO3; }
    public String getNome() { return nome; }
    public String getDDI() { return ddi; }
}

// Uso
Pais pais1 = Pais.porISO2("BR");       // BRASIL
Pais pais2 = Pais.porISO3("USA");      // ESTADOS_UNIDOS
Pais pais3 = Pais.porDDI("+351");      // PORTUGAL
```

### Lookup Case-Insensitive

```java
public enum Moeda {
    REAL("BRL", "Real Brasileiro"),
    DOLAR("USD", "Dólar Americano"),
    EURO("EUR", "Euro"),
    LIBRA("GBP", "Libra Esterlina");

    private final String codigo;
    private final String nome;

    // Lookup case-insensitive
    private static final Map<String, Moeda> POR_CODIGO;

    static {
        POR_CODIGO = new HashMap<>();
        for (Moeda moeda : values()) {
            // Armazena em UPPERCASE para lookup case-insensitive
            POR_CODIGO.put(moeda.codigo.toUpperCase(), moeda);
        }
    }

    Moeda(String codigo, String nome) {
        this.codigo = codigo;
        this.nome = nome;
    }

    public static Moeda porCodigo(String codigo) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código não pode ser null");
        }
        Moeda moeda = POR_CODIGO.get(codigo.toUpperCase());
        if (moeda == null) {
            throw new IllegalArgumentException("Código de moeda inválido: " + codigo);
        }
        return moeda;
    }

    public String getCodigo() { return codigo; }
    public String getNome() { return nome; }
}

// Uso - aceita qualquer case
Moeda m1 = Moeda.porCodigo("brl");  // REAL
Moeda m2 = Moeda.porCodigo("BRL");  // REAL
Moeda m3 = Moeda.porCodigo("Brl");  // REAL
```

### Lookup com Valor Padrão

```java
public enum NivelLog {
    TRACE(1), DEBUG(2), INFO(3), WARN(4), ERROR(5);

    private final int nivel;

    private static final Map<Integer, NivelLog> POR_NIVEL;
    private static final NivelLog PADRAO = INFO;

    static {
        POR_NIVEL = new HashMap<>();
        for (NivelLog log : values()) {
            POR_NIVEL.put(log.nivel, log);
        }
    }

    NivelLog(int nivel) {
        this.nivel = nivel;
    }

    // Retorna padrão se não encontrar
    public static NivelLog porNivel(int nivel) {
        return POR_NIVEL.getOrDefault(nivel, PADRAO);
    }

    // Retorna Optional
    public static Optional<NivelLog> porNivelOpt(int nivel) {
        return Optional.ofNullable(POR_NIVEL.get(nivel));
    }

    // Lança exceção
    public static NivelLog porNivelStrict(int nivel) {
        NivelLog log = POR_NIVEL.get(nivel);
        if (log == null) {
            throw new IllegalArgumentException("Nível inválido: " + nivel);
        }
        return log;
    }

    public int getNivel() { return nivel; }
}

// Uso
NivelLog log1 = NivelLog.porNivel(3);    // INFO
NivelLog log2 = NivelLog.porNivel(99);   // INFO (padrão)
Optional<NivelLog> log3 = NivelLog.porNivelOpt(99);  // empty
```

### Lookup Composto (Múltiplos Atributos)

```java
public enum StatusPedido {
    NOVO(1, "N", "Novo"),
    PROCESSANDO(2, "P", "Em Processamento"),
    CONCLUIDO(3, "C", "Concluído"),
    CANCELADO(4, "X", "Cancelado");

    private final int id;
    private final String codigo;
    private final String descricao;

    private static final Map<Integer, StatusPedido> POR_ID;
    private static final Map<String, StatusPedido> POR_CODIGO;

    static {
        POR_ID = new HashMap<>();
        POR_CODIGO = new HashMap<>();

        for (StatusPedido status : values()) {
            POR_ID.put(status.id, status);
            POR_CODIGO.put(status.codigo, status);
        }
    }

    StatusPedido(int id, String codigo, String descricao) {
        this.id = id;
        this.codigo = codigo;
        this.descricao = descricao;
    }

    public static StatusPedido porId(int id) {
        return Optional.ofNullable(POR_ID.get(id))
            .orElseThrow(() -> new IllegalArgumentException("ID inválido: " + id));
    }

    public static StatusPedido porCodigo(String codigo) {
        return Optional.ofNullable(POR_CODIGO.get(codigo))
            .orElseThrow(() -> new IllegalArgumentException("Código inválido: " + codigo));
    }

    public int getId() { return id; }
    public String getCodigo() { return codigo; }
    public String getDescricao() { return descricao; }
}

// Uso
StatusPedido s1 = StatusPedido.porId(1);        // NOVO
StatusPedido s2 = StatusPedido.porCodigo("C");  // CONCLUIDO
```

## 💡 Padrão: Lookup com Stream API

```java
public enum TipoArquivo {
    PDF(".pdf", "application/pdf"),
    EXCEL(".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
    WORD(".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
    IMAGEM(".jpg", "image/jpeg");

    private final String extensao;
    private final String mimeType;

    // Usando Map.of (Java 9+) e Collectors
    private static final Map<String, TipoArquivo> POR_EXTENSAO =
        Arrays.stream(values())
            .collect(Collectors.toMap(
                t -> t.extensao,
                Function.identity()
            ));

    TipoArquivo(String extensao, String mimeType) {
        this.extensao = extensao;
        this.mimeType = mimeType;
    }

    public static TipoArquivo porExtensao(String extensao) {
        return Optional.ofNullable(POR_EXTENSAO.get(extensao))
            .orElseThrow(() -> new IllegalArgumentException("Extensão não suportada: " + extensao));
    }

    public String getExtensao() { return extensao; }
    public String getMimeType() { return mimeType; }
}
```

## ⚡ Vantagens

**1. Performance O(1)**
- Map lookup é constante, independente do número de constantes

**2. Código Limpo**
```java
// Sem loops repetitivos em todo o código
```

**3. Thread-Safe**
- Map imutável após inicialização

**4. Type-Safe**
```java
// Retorna tipo enum, não String/int genérico
```

## ⚠️ Boas Práticas

**1. Usar Collections Imutáveis**

```java
// ✅ Java 9+
private static final Map<String, Status> POR_CODIGO =
    Map.of("A", ATIVO, "I", INATIVO, "P", PENDENTE);

// ✅ Java 8
private static final Map<String, Status> POR_CODIGO;
static {
    Map<String, Status> map = new HashMap<>();
    map.put("A", ATIVO);
    POR_CODIGO = Collections.unmodifiableMap(map);
}
```

**2. Validar Duplicatas**

```java
static {
    Map<String, Status> map = new HashMap<>();
    for (Status s : values()) {
        if (map.put(s.codigo, s) != null) {
            throw new IllegalStateException("Código duplicado: " + s.codigo);
        }
    }
    POR_CODIGO = Collections.unmodifiableMap(map);
}
```

**3. Retornar Optional ou Lançar Exceção**

```java
// ✅ Para APIs públicas: Optional
public static Optional<Status> porCodigoOpt(String codigo) {
    return Optional.ofNullable(POR_CODIGO.get(codigo));
}

// ✅ Para uso interno: exceção
public static Status porCodigo(String codigo) {
    return Optional.ofNullable(POR_CODIGO.get(codigo))
        .orElseThrow(() -> new IllegalArgumentException("Código inválido"));
}
```

## 🔗 Interconexões

**Relação com valueOf()**: Lookup customiza busca além de name()

**Relação com HashMap**: Usa HashMap interno para O(1)

**Relação com Reverse Lookup**: Padrão fundamental para reverse lookup
