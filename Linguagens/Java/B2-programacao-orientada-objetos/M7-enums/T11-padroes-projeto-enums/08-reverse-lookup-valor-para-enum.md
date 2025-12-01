# 🔄 Reverse Lookup (Valor → Enum)

## 🎯 Introdução

**Reverse lookup** é o padrão de buscar uma constante enum a partir de um **valor de atributo** (código, ID, descrição), ao invés do `name()` padrão. Este padrão é essencial para **deserialização**, **conversão de dados externos** (banco de dados, APIs REST, arquivos) e **interoperabilidade com sistemas legados** que não usam o name() do enum. Implementado através de **lookup maps estáticos**, oferece busca **O(1) eficiente e type-safe**.

### Contexto: De Onde Vem o Valor?

**Cenários Comuns:**

1. **Banco de Dados**: Coluna armazena código/ID ao invés de name()
2. **API REST**: JSON usa códigos customizados
3. **Arquivos CSV/XML**: Valores abreviados
4. **Sistemas Legados**: Códigos numéricos ou siglas

**Exemplo: Banco de Dados**

```sql
-- Tabela armazena código "A", "I", "P"
CREATE TABLE pedidos (
    id INT,
    status VARCHAR(1)  -- "A" = ATIVO, "I" = INATIVO, "P" = PENDENTE
);

-- Ao ler do banco, preciso converter "A" → Status.ATIVO
```

**Sem Reverse Lookup:**

```java
// ❌ valueOf() não funciona com código customizado
String codigoDB = "A";
Status status = Status.valueOf("A");  // IllegalArgumentException!

// ❌ Loop manual em cada uso - O(n) e repetitivo
Status encontrado = null;
for (Status s : Status.values()) {
    if (s.getCodigo().equals(codigoDB)) {
        encontrado = s;
        break;
    }
}
```

**Com Reverse Lookup:**

```java
// ✅ Método estático com lookup map - O(1)
String codigoDB = "A";
Status status = Status.porCodigo("A");  // Status.ATIVO
```

## 📋 Fundamentos Teóricos

### Anatomia do Reverse Lookup

**1. Atributo para Mapear**

```java
private final String codigo;  // Valor usado externamente
```

**2. Lookup Map Estático**

```java
private static final Map<String, Status> POR_CODIGO;
```

**3. Inicialização no Bloco Estático**

```java
static {
    POR_CODIGO = new HashMap<>();
    for (Status s : values()) {
        POR_CODIGO.put(s.codigo, s);
    }
}
```

**4. Método Público de Busca**

```java
public static Status porCodigo(String codigo) {
    return POR_CODIGO.get(codigo);
}
```

## 🔍 Exemplos Práticos

### Reverse Lookup Básico

```java
public enum Status {
    ATIVO("A"),
    INATIVO("I"),
    PENDENTE("P");

    private final String codigo;

    // Lookup map
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

    // Reverse lookup
    public static Status porCodigo(String codigo) {
        Status status = POR_CODIGO.get(codigo);
        if (status == null) {
            throw new IllegalArgumentException("Código inválido: " + codigo);
        }
        return status;
    }

    // Versão com Optional
    public static Optional<Status> porCodigoOpt(String codigo) {
        return Optional.ofNullable(POR_CODIGO.get(codigo));
    }
}

// Uso
String codigoDB = "A";
Status status = Status.porCodigo(codigoDB);  // ATIVO
```

### Reverse Lookup por ID Numérico

```java
public enum TipoUsuario {
    ADMINISTRADOR(1),
    MODERADOR(2),
    USUARIO_COMUM(3),
    CONVIDADO(4);

    private final int id;

    private static final Map<Integer, TipoUsuario> POR_ID;

    static {
        POR_ID = new HashMap<>();
        for (TipoUsuario tipo : values()) {
            POR_ID.put(tipo.id, tipo);
        }
    }

    TipoUsuario(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public static TipoUsuario porId(int id) {
        TipoUsuario tipo = POR_ID.get(id);
        if (tipo == null) {
            throw new IllegalArgumentException("ID de tipo de usuário inválido: " + id);
        }
        return tipo;
    }
}

// Uso - conversão de banco de dados
ResultSet rs = statement.executeQuery("SELECT tipo_id FROM usuarios WHERE id = 1");
if (rs.next()) {
    int tipoId = rs.getInt("tipo_id");  // 1
    TipoUsuario tipo = TipoUsuario.porId(tipoId);  // ADMINISTRADOR
}
```

### Reverse Lookup com Múltiplos Atributos

```java
public enum MeioPagamento {
    CARTAO_CREDITO("CC", 1, "Cartão de Crédito"),
    CARTAO_DEBITO("CD", 2, "Cartão de Débito"),
    PIX("PIX", 3, "PIX"),
    BOLETO("BOL", 4, "Boleto Bancário");

    private final String codigo;
    private final int id;
    private final String descricao;

    // Múltiplos lookup maps
    private static final Map<String, MeioPagamento> POR_CODIGO;
    private static final Map<Integer, MeioPagamento> POR_ID;

    static {
        POR_CODIGO = new HashMap<>();
        POR_ID = new HashMap<>();

        for (MeioPagamento meio : values()) {
            POR_CODIGO.put(meio.codigo, meio);
            POR_ID.put(meio.id, meio);
        }
    }

    MeioPagamento(String codigo, int id, String descricao) {
        this.codigo = codigo;
        this.id = id;
        this.descricao = descricao;
    }

    public static MeioPagamento porCodigo(String codigo) {
        return Optional.ofNullable(POR_CODIGO.get(codigo))
            .orElseThrow(() -> new IllegalArgumentException("Código inválido: " + codigo));
    }

    public static MeioPagamento porId(int id) {
        return Optional.ofNullable(POR_ID.get(id))
            .orElseThrow(() -> new IllegalArgumentException("ID inválido: " + id));
    }

    public String getCodigo() { return codigo; }
    public int getId() { return id; }
    public String getDescricao() { return descricao; }
}

// Uso - API REST retorna código
String codigoAPI = "PIX";
MeioPagamento meio = MeioPagamento.porCodigo(codigoAPI);  // PIX

// Uso - Banco de dados retorna ID
int idDB = 3;
MeioPagamento meio2 = MeioPagamento.porId(idDB);  // PIX
```

### Reverse Lookup Case-Insensitive

```java
public enum UnidadeMedida {
    METRO("m", "Metro"),
    CENTIMETRO("cm", "Centímetro"),
    QUILOMETRO("km", "Quilômetro"),
    LITRO("L", "Litro"),
    MILILITRO("mL", "Mililitro");

    private final String simbolo;
    private final String nome;

    private static final Map<String, UnidadeMedida> POR_SIMBOLO;

    static {
        POR_SIMBOLO = new HashMap<>();
        for (UnidadeMedida unidade : values()) {
            // Armazena em lowercase para busca case-insensitive
            POR_SIMBOLO.put(unidade.simbolo.toLowerCase(), unidade);
        }
    }

    UnidadeMedida(String simbolo, String nome) {
        this.simbolo = simbolo;
        this.nome = nome;
    }

    public static UnidadeMedida porSimbolo(String simbolo) {
        if (simbolo == null) {
            throw new IllegalArgumentException("Símbolo não pode ser null");
        }
        UnidadeMedida unidade = POR_SIMBOLO.get(simbolo.toLowerCase());
        if (unidade == null) {
            throw new IllegalArgumentException("Símbolo inválido: " + simbolo);
        }
        return unidade;
    }

    public String getSimbolo() { return simbolo; }
    public String getNome() { return nome; }
}

// Uso - aceita qualquer case
UnidadeMedida u1 = UnidadeMedida.porSimbolo("KM");   // QUILOMETRO
UnidadeMedida u2 = UnidadeMedida.porSimbolo("km");   // QUILOMETRO
UnidadeMedida u3 = UnidadeMedida.porSimbolo("Km");   // QUILOMETRO
```

### Reverse Lookup com Valor Padrão

```java
public enum Prioridade {
    BAIXA(1),
    MEDIA(2),
    ALTA(3),
    URGENTE(4);

    private final int nivel;

    private static final Map<Integer, Prioridade> POR_NIVEL;
    private static final Prioridade PADRAO = MEDIA;

    static {
        POR_NIVEL = new HashMap<>();
        for (Prioridade p : values()) {
            POR_NIVEL.put(p.nivel, p);
        }
    }

    Prioridade(int nivel) {
        this.nivel = nivel;
    }

    // Retorna padrão se não encontrar
    public static Prioridade porNivel(int nivel) {
        return POR_NIVEL.getOrDefault(nivel, PADRAO);
    }

    // Lança exceção se não encontrar
    public static Prioridade porNivelStrict(int nivel) {
        Prioridade p = POR_NIVEL.get(nivel);
        if (p == null) {
            throw new IllegalArgumentException("Nível inválido: " + nivel);
        }
        return p;
    }

    public int getNivel() { return nivel; }
}

// Uso
Prioridade p1 = Prioridade.porNivel(3);   // ALTA
Prioridade p2 = Prioridade.porNivel(99);  // MEDIA (padrão)
```

## 🎯 Integração com Banco de Dados (JPA)

### Converter para Armazenar Código no DB

```java
public enum Status {
    ATIVO("A"),
    INATIVO("I"),
    PENDENTE("P");

    private final String codigo;

    private static final Map<String, Status> POR_CODIGO =
        Arrays.stream(values())
            .collect(Collectors.toMap(s -> s.codigo, Function.identity()));

    Status(String codigo) {
        this.codigo = codigo;
    }

    public String getCodigo() {
        return codigo;
    }

    public static Status porCodigo(String codigo) {
        return Optional.ofNullable(POR_CODIGO.get(codigo))
            .orElseThrow(() -> new IllegalArgumentException("Código inválido: " + codigo));
    }
}

// JPA AttributeConverter
@Converter(autoApply = true)
public class StatusConverter implements AttributeConverter<Status, String> {

    @Override
    public String convertToDatabaseColumn(Status status) {
        if (status == null) {
            return null;
        }
        return status.getCodigo();  // Salva "A", "I", "P"
    }

    @Override
    public Status convertToEntityAttribute(String codigo) {
        if (codigo == null) {
            return null;
        }
        return Status.porCodigo(codigo);  // Reverse lookup!
    }
}

// Entidade
@Entity
public class Pedido {
    @Id
    private Long id;

    @Convert(converter = StatusConverter.class)
    private Status status;  // JPA converte automaticamente
}
```

### Reverse Lookup em Repositórios

```java
// Query nativa retorna código do DB
@Query(value = "SELECT status FROM pedidos WHERE id = :id", nativeQuery = true)
String buscarCodigoStatus(@Param("id") Long id);

// Converter manualmente
String codigo = repository.buscarCodigoStatus(1L);  // "A"
Status status = Status.porCodigo(codigo);  // ATIVO
```

## 🌐 Integração com APIs REST (Jackson)

### Serializar/Deserializar com Código Customizado

```java
public enum TipoNotificacao {
    EMAIL("E"),
    SMS("S"),
    PUSH("P");

    private final String codigo;

    private static final Map<String, TipoNotificacao> POR_CODIGO =
        Arrays.stream(values())
            .collect(Collectors.toMap(t -> t.codigo, Function.identity()));

    TipoNotificacao(String codigo) {
        this.codigo = codigo;
    }

    @JsonValue  // Serializa usando código
    public String getCodigo() {
        return codigo;
    }

    @JsonCreator  // Deserializa usando reverse lookup
    public static TipoNotificacao porCodigo(String codigo) {
        return Optional.ofNullable(POR_CODIGO.get(codigo))
            .orElseThrow(() -> new IllegalArgumentException("Código inválido: " + codigo));
    }
}

// JSON usa código "E" ao invés de "EMAIL"
// {"tipo": "E"} → TipoNotificacao.EMAIL
```

## 💡 Padrão Avançado: Lookup Composto

```java
public enum Idioma {
    PORTUGUES("pt", "pt-BR", "Português"),
    INGLES("en", "en-US", "English"),
    ESPANHOL("es", "es-ES", "Español");

    private final String codigo;
    private final String locale;
    private final String nome;

    private static final Map<String, Idioma> POR_CODIGO;
    private static final Map<String, Idioma> POR_LOCALE;

    static {
        POR_CODIGO = new HashMap<>();
        POR_LOCALE = new HashMap<>();

        for (Idioma idioma : values()) {
            POR_CODIGO.put(idioma.codigo, idioma);
            POR_LOCALE.put(idioma.locale, idioma);
        }
    }

    Idioma(String codigo, String locale, String nome) {
        this.codigo = codigo;
        this.locale = locale;
        this.nome = nome;
    }

    // Busca por código ou locale
    public static Idioma buscar(String valor) {
        Idioma idioma = POR_CODIGO.get(valor);
        if (idioma == null) {
            idioma = POR_LOCALE.get(valor);
        }
        if (idioma == null) {
            throw new IllegalArgumentException("Idioma não encontrado: " + valor);
        }
        return idioma;
    }

    public static Idioma porCodigo(String codigo) {
        return Optional.ofNullable(POR_CODIGO.get(codigo))
            .orElseThrow(() -> new IllegalArgumentException("Código inválido: " + codigo));
    }

    public static Idioma porLocale(String locale) {
        return Optional.ofNullable(POR_LOCALE.get(locale))
            .orElseThrow(() -> new IllegalArgumentException("Locale inválido: " + locale));
    }
}

// Uso
Idioma i1 = Idioma.buscar("pt");      // PORTUGUES
Idioma i2 = Idioma.buscar("en-US");   // INGLES
```

## ⚡ Vantagens

**1. Performance O(1)**
- Lookup via map é constante

**2. Interoperabilidade**
```java
// Facilita integração com sistemas externos
```

**3. Flexibilidade de Formatos**
```java
// Banco usa ID, API usa código, arquivo usa sigla
```

**4. Type-Safety**
```java
// Retorna enum, não String/int genérico
```

## ⚠️ Boas Práticas

**1. Validar Duplicatas**

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

**2. Usar Optional ou Exceção Clara**

```java
// ✅ Optional para APIs públicas
public static Optional<Status> porCodigoOpt(String codigo) {
    return Optional.ofNullable(POR_CODIGO.get(codigo));
}

// ✅ Exceção descritiva para uso interno
public static Status porCodigo(String codigo) {
    return Optional.ofNullable(POR_CODIGO.get(codigo))
        .orElseThrow(() -> new IllegalArgumentException(
            "Código de status inválido: " + codigo +
            ". Valores válidos: " + POR_CODIGO.keySet()
        ));
}
```

## 🔗 Interconexões

**Relação com JPA Converters**: Reverse lookup usado em conversão DB

**Relação com Jackson**: `@JsonCreator` usa reverse lookup

**Relação com Lookup Map**: Reverse lookup é aplicação de lookup map
