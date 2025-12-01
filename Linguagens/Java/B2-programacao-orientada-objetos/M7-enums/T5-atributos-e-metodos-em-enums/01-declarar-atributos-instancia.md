# T5.01 - Declarar Atributos de Instância

## Introdução

**Atributos de instância**: cada constante possui seus próprios valores.

```java
public enum Status {
    ATIVO("Ativo", 1),
    INATIVO("Inativo", 0),
    PENDENTE("Pendente", 2);
    
    private final String descricao; // atributo de instância
    private final int codigo;       // atributo de instância
    
    Status(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
    
    public String getDescricao() { return descricao; }
    public int getCodigo() { return codigo; }
}

System.out.println(Status.ATIVO.getDescricao()); // "Ativo"
System.out.println(Status.ATIVO.getCodigo()); // 1
```

**Instância**: cada constante tem valores únicos.

---

## Fundamentos

### 1. Atributo String

```java
public enum Cor {
    VERMELHO("#FF0000"),
    VERDE("#00FF00"),
    AZUL("#0000FF");
    
    private final String hex;
    
    Cor(String hex) {
        this.hex = hex;
    }
    
    public String getHex() {
        return hex;
    }
}

System.out.println(Cor.VERMELHO.getHex()); // "#FF0000"
```

### 2. Atributo int

```java
public enum Prioridade {
    BAIXA(1),
    MEDIA(5),
    ALTA(10);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
    }
    
    public int getNivel() {
        return nivel;
    }
}

System.out.println(Prioridade.ALTA.getNivel()); // 10
```

### 3. Múltiplos Atributos

```java
public enum Moeda {
    REAL("BRL", "R$", 2),
    DOLAR("USD", "$", 2),
    YEN("JPY", "¥", 0);
    
    private final String codigo;
    private final String simbolo;
    private final int casasDecimais;
    
    Moeda(String codigo, String simbolo, int casasDecimais) {
        this.codigo = codigo;
        this.simbolo = simbolo;
        this.casasDecimais = casasDecimais;
    }
    
    public String getCodigo() { return codigo; }
    public String getSimbolo() { return simbolo; }
    public int getCasasDecimais() { return casasDecimais; }
}
```

### 4. Atributo boolean

```java
public enum TipoConta {
    CORRENTE("Conta Corrente", true),
    POUPANCA("Poupança", false),
    SALARIO("Salário", false);
    
    private final String nome;
    private final boolean permiteCredito;
    
    TipoConta(String nome, boolean permiteCredito) {
        this.nome = nome;
        this.permiteCredito = permiteCredito;
    }
    
    public String getNome() { return nome; }
    public boolean permiteCredito() { return permiteCredito; }
}
```

### 5. Atributo double

```java
public enum Tamanho {
    PEQUENO("P", 0.5),
    MEDIO("M", 1.0),
    GRANDE("G", 2.0);
    
    private final String sigla;
    private final double multiplicador;
    
    Tamanho(String sigla, double multiplicador) {
        this.sigla = sigla;
        this.multiplicador = multiplicador;
    }
    
    public double getMultiplicador() {
        return multiplicador;
    }
}
```

### 6. Atributo Collection

```java
public enum Permissao {
    ADMIN(Arrays.asList("ler", "escrever", "deletar")),
    USER(Arrays.asList("ler", "escrever")),
    GUEST(Arrays.asList("ler"));
    
    private final List<String> acoes;
    
    Permissao(List<String> acoes) {
        this.acoes = new ArrayList<>(acoes); // cópia defensiva
    }
    
    public List<String> getAcoes() {
        return new ArrayList<>(acoes); // cópia defensiva
    }
}
```

### 7. Atributo Objeto

```java
public enum Produto {
    NOTEBOOK("Notebook", 3000.0, LocalDate.of(2024, 1, 1));
    
    private final String nome;
    private final double preco;
    private final LocalDate dataLancamento;
    
    Produto(String nome, double preco, LocalDate dataLancamento) {
        this.nome = nome;
        this.preco = preco;
        this.dataLancamento = dataLancamento;
    }
    
    public String getNome() { return nome; }
    public double getPreco() { return preco; }
    public LocalDate getDataLancamento() { return dataLancamento; }
}
```

### 8. Atributo Enum

```java
public enum Documento {
    CPF("CPF", TipoDocumento.PESSOA_FISICA),
    CNPJ("CNPJ", TipoDocumento.PESSOA_JURIDICA);
    
    private final String nome;
    private final TipoDocumento tipo;
    
    Documento(String nome, TipoDocumento tipo) {
        this.nome = nome;
        this.tipo = tipo;
    }
    
    public TipoDocumento getTipo() {
        return tipo;
    }
    
    enum TipoDocumento {
        PESSOA_FISICA, PESSOA_JURIDICA
    }
}
```

### 9. Atributo Array

```java
public enum Papel {
    ADMIN(new String[]{"ler", "escrever", "deletar"}),
    USER(new String[]{"ler", "escrever"});
    
    private final String[] permissoes;
    
    Papel(String[] permissoes) {
        this.permissoes = permissoes.clone(); // cópia defensiva
    }
    
    public String[] getPermissoes() {
        return permissoes.clone(); // cópia defensiva
    }
}
```

### 10. Atributo Calculado

```java
public enum Planeta {
    TERRA(5.976e24, 6.37814e6);
    
    private final double massa;
    private final double raio;
    private final double gravidade; // calculado
    
    Planeta(double massa, double raio) {
        this.massa = massa;
        this.raio = raio;
        this.gravidade = calcularGravidade(massa, raio);
    }
    
    private static double calcularGravidade(double massa, double raio) {
        final double G = 6.67300E-11;
        return G * massa / (raio * raio);
    }
    
    public double getGravidade() {
        return gravidade;
    }
}
```

---

## Aplicabilidade

**Atributos de instância** para:
- Armazenar dados específicos de cada constante
- Associar metadados (código, descrição)
- Configurar comportamento único
- Implementar lógica de negócio

---

## Armadilhas

### 1. Atributo Não Final

```java
// ⚠️ Evitar: atributo mutável
public enum Status {
    ATIVO("Ativo");
    
    private String descricao; // sem final
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    public void setDescricao(String d) {
        this.descricao = d; // ❌ Constante mutável
    }
}

// ✅ Preferir: final
private final String descricao;
```

### 2. Atributo Public

```java
// ⚠️ Evitar: atributo public
public enum Cor {
    VERMELHO("#FF0000");
    
    public final String hex; // ⚠️ public
    
    Cor(String hex) {
        this.hex = hex;
    }
}

// ✅ Preferir: private + getter
private final String hex;
public String getHex() { return hex; }
```

### 3. Collection Mutável

```java
// ❌ Vazamento de referência
public enum Permissao {
    ADMIN(Arrays.asList("ler", "escrever"));
    
    private final List<String> acoes;
    
    Permissao(List<String> acoes) {
        this.acoes = acoes; // ❌ Referência direta
    }
    
    public List<String> getAcoes() {
        return acoes; // ❌ Vazamento
    }
}

// ✅ Cópia defensiva
Permissao(List<String> acoes) {
    this.acoes = new ArrayList<>(acoes);
}
public List<String> getAcoes() {
    return new ArrayList<>(acoes);
}
```

---

## Boas Práticas

### 1. Atributos Final

```java
// ✅ Sempre final (imutável)
private final String descricao;
private final int codigo;
```

### 2. Atributos Private

```java
// ✅ Private + getter público
private final String nome;

public String getNome() {
    return nome;
}
```

### 3. Cópia Defensiva

```java
// ✅ Cópia defensiva para collections
Permissao(List<String> acoes) {
    this.acoes = new ArrayList<>(acoes);
}

public List<String> getAcoes() {
    return new ArrayList<>(acoes);
}
```

### 4. Validação no Construtor

```java
// ✅ Validar antes de atribuir
Prioridade(int nivel) {
    if (nivel < 1 || nivel > 10) {
        throw new IllegalArgumentException("Nível inválido");
    }
    this.nivel = nivel;
}
```

---

## Resumo

**Declarar atributos de instância**:

```java
public enum Status {
    ATIVO("Ativo", 1),
    INATIVO("Inativo", 0);
    
    private final String descricao; // atributo de instância
    private final int codigo;       // atributo de instância
    
    Status(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
    
    public String getDescricao() { return descricao; }
    public int getCodigo() { return codigo; }
}
```

**Tipos de atributos**:

```java
// String
private final String nome;

// int
private final int nivel;

// double
private final double preco;

// boolean
private final boolean ativo;

// Collection
private final List<String> acoes;

// Objeto
private final LocalDate data;

// Enum
private final TipoDocumento tipo;

// Array
private final String[] itens;
```

**Modificadores**:

```java
// ✅ Preferir
private final String descricao;

// ❌ Evitar
public String descricao;        // public
private String descricao;       // não final
protected final String descricao; // protected
```

**Regra de Ouro**: Atributos de instância armazenam **dados específicos** de cada constante. Sempre **private final** (encapsulado e imutável). Getter **público** para acessar. **Cópia defensiva** para collections/arrays. **Validar** no construtor. Cada constante tem **valores únicos**.

