# T4.07 - Enum com Nome e Valor

## Introdução

**Enum com nome e valor**: padrão comum para associar descrição e código a constantes.

```java
public enum Status {
    ATIVO("Ativo", 1),
    INATIVO("Inativo", 0),
    PENDENTE("Pendente", 2);
    
    private final String nome;
    private final int valor;
    
    Status(String nome, int valor) {
        this.nome = nome;
        this.valor = valor;
    }
    
    public String getNome() { return nome; }
    public int getValor() { return valor; }
}

System.out.println(Status.ATIVO.getNome());  // "Ativo"
System.out.println(Status.ATIVO.getValor()); // 1
```

**Padrão**: constante com nome legível e valor numérico/código.

---

## Fundamentos

### 1. Nome e Código

```java
public enum Prioridade {
    BAIXA("Baixa", 1),
    MEDIA("Média", 2),
    ALTA("Alta", 3);
    
    private final String nome;
    private final int codigo;
    
    Prioridade(String nome, int codigo) {
        this.nome = nome;
        this.codigo = codigo;
    }
    
    public String getNome() { return nome; }
    public int getCodigo() { return codigo; }
}

System.out.println(Prioridade.ALTA.getNome()); // "Alta"
System.out.println(Prioridade.ALTA.getCodigo()); // 3
```

### 2. Descrição e Valor

```java
public enum HttpStatus {
    OK("OK", 200),
    NOT_FOUND("Not Found", 404),
    INTERNAL_ERROR("Internal Server Error", 500);
    
    private final String descricao;
    private final int codigo;
    
    HttpStatus(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
    
    public String getDescricao() { return descricao; }
    public int getCodigo() { return codigo; }
}

System.out.println(HttpStatus.NOT_FOUND.getDescricao()); // "Not Found"
System.out.println(HttpStatus.NOT_FOUND.getCodigo()); // 404
```

### 3. Lookup por Valor

```java
public enum Cor {
    VERMELHO("Vermelho", 1),
    VERDE("Verde", 2),
    AZUL("Azul", 3);
    
    private final String nome;
    private final int valor;
    
    Cor(String nome, int valor) {
        this.nome = nome;
        this.valor = valor;
    }
    
    public String getNome() { return nome; }
    public int getValor() { return valor; }
    
    // Buscar por valor
    public static Cor porValor(int valor) {
        for (Cor cor : values()) {
            if (cor.valor == valor) {
                return cor;
            }
        }
        throw new IllegalArgumentException("Valor inválido: " + valor);
    }
}

Cor cor = Cor.porValor(2);
System.out.println(cor); // VERDE
```

### 4. Lookup por Nome

```java
public enum Moeda {
    REAL("Real", "BRL"),
    DOLAR("Dólar", "USD"),
    EURO("Euro", "EUR");
    
    private final String nome;
    private final String codigo;
    
    Moeda(String nome, String codigo) {
        this.nome = nome;
        this.codigo = codigo;
    }
    
    public String getNome() { return nome; }
    public String getCodigo() { return codigo; }
    
    // Buscar por código
    public static Moeda porCodigo(String codigo) {
        for (Moeda m : values()) {
            if (m.codigo.equals(codigo)) {
                return m;
            }
        }
        return null;
    }
}

Moeda moeda = Moeda.porCodigo("USD");
System.out.println(moeda); // DOLAR
```

### 5. Map para Lookup Eficiente

```java
public enum TipoConta {
    CORRENTE("Conta Corrente", 1),
    POUPANCA("Poupança", 2),
    SALARIO("Salário", 3);
    
    private static final Map<Integer, TipoConta> MAP = new HashMap<>();
    
    static {
        for (TipoConta tipo : values()) {
            MAP.put(tipo.codigo, tipo);
        }
    }
    
    private final String nome;
    private final int codigo;
    
    TipoConta(String nome, int codigo) {
        this.nome = nome;
        this.codigo = codigo;
    }
    
    public String getNome() { return nome; }
    public int getCodigo() { return codigo; }
    
    public static TipoConta porCodigo(int codigo) {
        return MAP.get(codigo);
    }
}

TipoConta tipo = TipoConta.porCodigo(2);
System.out.println(tipo.getNome()); // "Poupança"
```

### 6. Sigla e Descrição

```java
public enum Estado {
    SP("SP", "São Paulo"),
    RJ("RJ", "Rio de Janeiro"),
    MG("MG", "Minas Gerais");
    
    private final String sigla;
    private final String nome;
    
    Estado(String sigla, String nome) {
        this.sigla = sigla;
        this.nome = nome;
    }
    
    public String getSigla() { return sigla; }
    public String getNome() { return nome; }
}

System.out.println(Estado.SP.getSigla()); // "SP"
System.out.println(Estado.SP.getNome()); // "São Paulo"
```

### 7. Nome Português e Inglês

```java
public enum DiaSemana {
    SEGUNDA("Segunda-feira", "Monday"),
    TERCA("Terça-feira", "Tuesday"),
    QUARTA("Quarta-feira", "Wednesday");
    
    private final String nomePt;
    private final String nomeEn;
    
    DiaSemana(String nomePt, String nomeEn) {
        this.nomePt = nomePt;
        this.nomeEn = nomeEn;
    }
    
    public String getNomePt() { return nomePt; }
    public String getNomeEn() { return nomeEn; }
}

System.out.println(DiaSemana.SEGUNDA.getNomePt()); // "Segunda-feira"
System.out.println(DiaSemana.SEGUNDA.getNomeEn()); // "Monday"
```

### 8. Valor e Peso

```java
public enum Tamanho {
    PEQUENO("Pequeno", 1, 0.5),
    MEDIO("Médio", 2, 1.0),
    GRANDE("Grande", 3, 2.0);
    
    private final String nome;
    private final int ordem;
    private final double peso;
    
    Tamanho(String nome, int ordem, double peso) {
        this.nome = nome;
        this.ordem = ordem;
        this.peso = peso;
    }
    
    public String getNome() { return nome; }
    public int getOrdem() { return ordem; }
    public double getPeso() { return peso; }
}
```

### 9. ID e Label

```java
public enum Categoria {
    ELETRONICOS("Eletrônicos", "electronics"),
    LIVROS("Livros", "books"),
    ROUPAS("Roupas", "clothing");
    
    private final String label;
    private final String id;
    
    Categoria(String label, String id) {
        this.label = label;
        this.id = id;
    }
    
    public String getLabel() { return label; }
    public String getId() { return id; }
}

System.out.println(Categoria.ELETRONICOS.getLabel()); // "Eletrônicos"
System.out.println(Categoria.ELETRONICOS.getId()); // "electronics"
```

### 10. Nome e Símbolo

```java
public enum Operacao {
    SOMA("Soma", "+"),
    SUBTRACAO("Subtração", "-"),
    MULTIPLICACAO("Multiplicação", "*"),
    DIVISAO("Divisão", "/");
    
    private final String nome;
    private final String simbolo;
    
    Operacao(String nome, String simbolo) {
        this.nome = nome;
        this.simbolo = simbolo;
    }
    
    public String getNome() { return nome; }
    public String getSimbolo() { return simbolo; }
}

System.out.println(Operacao.SOMA.getNome()); // "Soma"
System.out.println(Operacao.SOMA.getSimbolo()); // "+"
```

---

## Aplicabilidade

**Enum com nome e valor** para:
- Associar descrição legível a constantes
- Mapear valores numéricos (banco de dados, API)
- Lookup reverso (valor → enum)
- Internacionalização (nome em múltiplos idiomas)

---

## Armadilhas

### 1. Valor Duplicado

```java
// ⚠️ Valores duplicados
public enum Status {
    ATIVO("Ativo", 1),
    PENDENTE("Pendente", 1); // ⚠️ Mesmo valor
    
    private final String nome;
    private final int valor;
    
    Status(String nome, int valor) {
        this.nome = nome;
        this.valor = valor;
    }
    
    // ⚠️ porValor() retorna apenas primeiro
    public static Status porValor(int valor) {
        for (Status s : values()) {
            if (s.valor == valor) {
                return s; // ⚠️ ATIVO (não PENDENTE)
            }
        }
        return null;
    }
}
```

### 2. Lookup Ineficiente

```java
// ⚠️ Busca linear (O(n))
public static Status porValor(int valor) {
    for (Status s : values()) { // ⚠️ Percorre array
        if (s.valor == valor) {
            return s;
        }
    }
    return null;
}

// ✅ Usar Map (O(1))
private static final Map<Integer, Status> MAP = ...
```

### 3. Null em Lookup

```java
// ⚠️ Retorna null
public static Status porValor(int valor) {
    for (Status s : values()) {
        if (s.valor == valor) {
            return s;
        }
    }
    return null; // ⚠️ Pode causar NullPointerException
}

// ✅ Lançar exceção
throw new IllegalArgumentException("Valor inválido: " + valor);
```

---

## Boas Práticas

### 1. Map para Lookup

```java
// ✅ Map para busca eficiente (O(1))
private static final Map<Integer, Status> MAP = new HashMap<>();

static {
    for (Status s : values()) {
        MAP.put(s.valor, s);
    }
}

public static Status porValor(int valor) {
    return MAP.get(valor);
}
```

### 2. Validar Duplicação

```java
// ✅ Validar valores únicos
static {
    Set<Integer> valores = new HashSet<>();
    for (Status s : values()) {
        if (!valores.add(s.valor)) {
            throw new IllegalStateException("Valor duplicado: " + s.valor);
        }
    }
}
```

### 3. Lançar Exceção

```java
// ✅ Exceção em vez de null
public static Status porValor(int valor) {
    Status s = MAP.get(valor);
    if (s == null) {
        throw new IllegalArgumentException("Valor inválido: " + valor);
    }
    return s;
}
```

### 4. Atributos Final

```java
// ✅ Atributos final (imutável)
private final String nome;
private final int valor;
```

---

## Resumo

**Enum com nome e valor**:

```java
public enum Status {
    ATIVO("Ativo", 1),
    INATIVO("Inativo", 0);
    
    private final String nome;
    private final int valor;
    
    Status(String nome, int valor) {
        this.nome = nome;
        this.valor = valor;
    }
    
    public String getNome() { return nome; }
    public int getValor() { return valor; }
}
```

**Lookup por valor**:

```java
// Map para lookup eficiente (O(1))
private static final Map<Integer, Status> MAP = new HashMap<>();

static {
    for (Status s : values()) {
        MAP.put(s.valor, s);
    }
}

public static Status porValor(int valor) {
    Status s = MAP.get(valor);
    if (s == null) {
        throw new IllegalArgumentException("Inválido: " + valor);
    }
    return s;
}

// Uso:
Status s = Status.porValor(1); // ATIVO
```

**Casos de uso**:

```java
// HTTP Status
HttpStatus.OK("OK", 200)

// Moeda
Moeda.REAL("Real", "BRL")

// Estado
Estado.SP("SP", "São Paulo")

// Prioridade
Prioridade.ALTA("Alta", 3)
```

**Regra de Ouro**: Enum com **nome** (descrição) e **valor** (código/ID) é padrão comum. Atributos **final** e **private**. Getter **público**. **Map** para lookup eficiente por valor (O(1)). **Validar** valores únicos. **Exceção** em vez de null. Use para mapear **banco de dados**, **API**, **internacionalização**.
