# T5.10 - Enum com Múltiplos Atributos

## Introdução

**Enum com múltiplos atributos**: constantes com vários campos de dados.

```java
public enum Produto {
    NOTEBOOK("Notebook", 3000.0, "Eletrônicos", 10),
    MOUSE("Mouse", 50.0, "Periféricos", 100);
    
    private final String nome;
    private final double preco;
    private final String categoria;
    private final int estoque;
    
    Produto(String nome, double preco, String categoria, int estoque) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
        this.estoque = estoque;
    }
    
    public String getNome() { return nome; }
    public double getPreco() { return preco; }
    public String getCategoria() { return categoria; }
    public int getEstoque() { return estoque; }
}

Produto p = Produto.NOTEBOOK;
System.out.println(p.getNome()); // Notebook
```

**Múltiplos atributos**: enum armazena conjunto de dados relacionados.

---

## Fundamentos

### 1. Enum com 3+ Atributos

```java
public enum Usuario {
    ADMIN("João", "admin@email.com", 30),
    USER("Maria", "user@email.com", 25);
    
    private final String nome;
    private final String email;
    private final int idade;
    
    Usuario(String nome, String email, int idade) {
        this.nome = nome;
        this.email = email;
        this.idade = idade;
    }
    
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public int getIdade() { return idade; }
}
```

### 2. Atributos de Tipos Diferentes

```java
public enum Evento {
    CONFERENCIA(
        "Conferência Tech", 
        LocalDate.of(2024, 6, 10), 
        3, 
        500
    );
    
    private final String nome;           // String
    private final LocalDate dataInicio;  // LocalDate
    private final int duracao;           // int
    private final int participantesMax;  // int
    
    Evento(String nome, LocalDate dataInicio, int duracao, int participantesMax) {
        this.nome = nome;
        this.dataInicio = dataInicio;
        this.duracao = duracao;
        this.participantesMax = participantesMax;
    }
    
    public String getNome() { return nome; }
    public LocalDate getDataInicio() { return dataInicio; }
    public int getDuracao() { return duracao; }
    public int getParticipantesMax() { return participantesMax; }
}
```

### 3. Atributos com Collection

```java
public enum Departamento {
    TI(
        "Tecnologia da Informação",
        Arrays.asList("dev", "suporte", "infra"),
        50
    );
    
    private final String nome;
    private final List<String> funcoes;
    private final int funcionarios;
    
    Departamento(String nome, List<String> funcoes, int funcionarios) {
        this.nome = nome;
        this.funcoes = new ArrayList<>(funcoes);
        this.funcionarios = funcionarios;
    }
    
    public String getNome() { return nome; }
    
    public List<String> getFuncoes() {
        return new ArrayList<>(funcoes);
    }
    
    public int getFuncionarios() { return funcionarios; }
}
```

### 4. Atributos Calculados

```java
public enum Plano {
    BASICO("Básico", 100, 0.8, 2),
    PREMIUM("Premium", 300, 1.0, 5);
    
    private final String nome;
    private final double mensalidade;
    private final double cobertura;
    private final int dependentesMax;
    
    // ✅ Calculado
    private final double mensalidadeDependente;
    
    Plano(String nome, double mensalidade, double cobertura, int dependentesMax) {
        this.nome = nome;
        this.mensalidade = mensalidade;
        this.cobertura = cobertura;
        this.dependentesMax = dependentesMax;
        this.mensalidadeDependente = mensalidade * 0.5; // ✅ Calculado
    }
    
    public String getNome() { return nome; }
    public double getMensalidade() { return mensalidade; }
    public double getCobertura() { return cobertura; }
    public int getDependentesMax() { return dependentesMax; }
    public double getMensalidadeDependente() { return mensalidadeDependente; }
}
```

### 5. Enum Aninhado

```java
public enum Configuracao {
    TIMEOUT("timeout", "30", TipoConfig.NUMERO),
    HOST("host", "localhost", TipoConfig.TEXTO);
    
    private final String chave;
    private final String valor;
    private final TipoConfig tipo; // ✅ Enum aninhado
    
    Configuracao(String chave, String valor, TipoConfig tipo) {
        this.chave = chave;
        this.valor = valor;
        this.tipo = tipo;
    }
    
    public String getChave() { return chave; }
    public String getValor() { return valor; }
    public TipoConfig getTipo() { return tipo; }
    
    enum TipoConfig { NUMERO, TEXTO, BOOLEAN }
}
```

### 6. Múltiplos Atributos + Métodos

```java
public enum Moeda {
    REAL("BRL", "R$", 1.0),
    DOLAR("USD", "$", 5.0),
    EURO("EUR", "€", 6.0);
    
    private final String codigo;
    private final String simbolo;
    private final double taxaConversao;
    
    Moeda(String codigo, String simbolo, double taxaConversao) {
        this.codigo = codigo;
        this.simbolo = simbolo;
        this.taxaConversao = taxaConversao;
    }
    
    public String getCodigo() { return codigo; }
    public String getSimbolo() { return simbolo; }
    public double getTaxaConversao() { return taxaConversao; }
    
    // ✅ Método usa múltiplos atributos
    public String formatar(double valor) {
        return simbolo + " " + String.format("%.2f", valor);
    }
    
    public double paraReal(double valor) {
        return valor * taxaConversao;
    }
}

String formatado = Moeda.DOLAR.formatar(10); // "$ 10.00"
```

### 7. Validação de Múltiplos Atributos

```java
public enum Produto {
    NOTEBOOK("Notebook", 3000, 10, "Eletrônicos");
    
    private final String nome;
    private final double preco;
    private final int estoque;
    private final String categoria;
    
    Produto(String nome, double preco, int estoque, String categoria) {
        // ✅ Validar múltiplos atributos
        if (preco <= 0) {
            throw new IllegalArgumentException("Preço inválido");
        }
        if (estoque < 0) {
            throw new IllegalArgumentException("Estoque inválido");
        }
        
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
        this.categoria = categoria;
    }
    
    public String getNome() { return nome; }
    public double getPreco() { return preco; }
    public int getEstoque() { return estoque; }
    public String getCategoria() { return categoria; }
}
```

### 8. Enum como DTO

```java
public enum Pais {
    BRASIL("Brasil", "BRA", 55, "Brasília"),
    EUA("Estados Unidos", "USA", 1, "Washington D.C.");
    
    private final String nome;
    private final String sigla;
    private final int ddi;
    private final String capital;
    
    Pais(String nome, String sigla, int ddi, String capital) {
        this.nome = nome;
        this.sigla = sigla;
        this.ddi = ddi;
        this.capital = capital;
    }
    
    public String getNome() { return nome; }
    public String getSigla() { return sigla; }
    public int getDdi() { return ddi; }
    public String getCapital() { return capital; }
    
    // ✅ toString customizado
    @Override
    public String toString() {
        return String.format("%s (%s) - DDI: +%d - Capital: %s", 
            nome, sigla, ddi, capital);
    }
}
```

### 9. Builder Pattern

```java
public enum Relatorio {
    VENDAS("Vendas", "relatorio_vendas.pdf");
    
    private final String titulo;
    private final String arquivo;
    
    Relatorio(String titulo, String arquivo) {
        this.titulo = titulo;
        this.arquivo = arquivo;
    }
    
    public String getTitulo() { return titulo; }
    public String getArquivo() { return arquivo; }
    
    // ✅ Builder com múltiplos parâmetros
    public Builder builder() {
        return new Builder(this);
    }
    
    public static class Builder {
        private final Relatorio tipo;
        private LocalDate dataInicio;
        private LocalDate dataFim;
        private String autor;
        
        private Builder(Relatorio tipo) {
            this.tipo = tipo;
        }
        
        public Builder dataInicio(LocalDate data) {
            this.dataInicio = data;
            return this;
        }
        
        public Builder dataFim(LocalDate data) {
            this.dataFim = data;
            return this;
        }
        
        public Builder autor(String autor) {
            this.autor = autor;
            return this;
        }
        
        public String gerar() {
            return String.format("%s - De: %s Até: %s - Autor: %s", 
                tipo.titulo, dataInicio, dataFim, autor);
        }
    }
}

String relatorio = Relatorio.VENDAS.builder()
    .dataInicio(LocalDate.now())
    .dataFim(LocalDate.now().plusDays(7))
    .autor("João")
    .gerar();
```

### 10. Comparação por Múltiplos Atributos

```java
public enum Tarefa {
    TAREFA_A("A", Prioridade.ALTA, 10),
    TAREFA_B("B", Prioridade.MEDIA, 5);
    
    private final String nome;
    private final Prioridade prioridade;
    private final int duracao;
    
    Tarefa(String nome, Prioridade prioridade, int duracao) {
        this.nome = nome;
        this.prioridade = prioridade;
        this.duracao = duracao;
    }
    
    public String getNome() { return nome; }
    public Prioridade getPrioridade() { return prioridade; }
    public int getDuracao() { return duracao; }
    
    // ✅ Comparar por prioridade, depois duração
    public static Comparator<Tarefa> porPrioridade() {
        return Comparator.comparing(Tarefa::getPrioridade)
            .thenComparingInt(Tarefa::getDuracao);
    }
    
    enum Prioridade { BAIXA, MEDIA, ALTA }
}
```

---

## Aplicabilidade

**Enum com múltiplos atributos** para:
- Modelar entidades com vários campos
- Evitar classes com poucos objetos fixos
- Agregar dados relacionados
- Configurações complexas

---

## Armadilhas

### 1. Muitos Atributos

```java
// ⚠️ Enum com muitos atributos (difícil manter)
Produto(String nome, double preco, String categoria, int estoque, 
        String fornecedor, LocalDate validade, boolean ativo, String codigo, ...) { }

// ✅ Considerar classe se > 5-7 atributos
public class Produto { }
```

### 2. Ordem dos Parâmetros

```java
// ⚠️ Difícil identificar parâmetros
NOTEBOOK("Notebook", 3000, "Eletrônicos", 10);

// ✅ Comentar ou usar builder
NOTEBOOK(
    /* nome */ "Notebook", 
    /* preco */ 3000, 
    /* categoria */ "Eletrônicos", 
    /* estoque */ 10
);
```

### 3. Não Validar

```java
// ⚠️ Não valida atributos
Produto(String nome, double preco, int estoque) {
    this.nome = nome;
    this.preco = preco; // ⚠️ E se preco < 0?
    this.estoque = estoque;
}

// ✅ Validar
Produto(String nome, double preco, int estoque) {
    if (preco <= 0 || estoque < 0) {
        throw new IllegalArgumentException("Atributos inválidos");
    }
    // ...
}
```

---

## Boas Práticas

### 1. Private Final

```java
// ✅ Atributos private final
private final String nome;
private final double preco;
private final String categoria;
private final int estoque;
```

### 2. Getters Públicos

```java
// ✅ Getters para cada atributo
public String getNome() { return nome; }
public double getPreco() { return preco; }
public String getCategoria() { return categoria; }
public int getEstoque() { return estoque; }
```

### 3. Cópia Defensiva

```java
// ✅ Cópia para collections
Departamento(String nome, List<String> funcoes) {
    this.nome = nome;
    this.funcoes = new ArrayList<>(funcoes);
}

public List<String> getFuncoes() {
    return new ArrayList<>(funcoes);
}
```

### 4. Validar no Construtor

```java
// ✅ Validar atributos
Produto(String nome, double preco, int estoque) {
    Objects.requireNonNull(nome, "Nome não pode ser null");
    if (preco <= 0) {
        throw new IllegalArgumentException("Preço inválido");
    }
    if (estoque < 0) {
        throw new IllegalArgumentException("Estoque inválido");
    }
    
    this.nome = nome;
    this.preco = preco;
    this.estoque = estoque;
}
```

---

## Resumo

**Enum com múltiplos atributos**:

```java
public enum Produto {
    NOTEBOOK("Notebook", 3000.0, "Eletrônicos", 10),
    MOUSE("Mouse", 50.0, "Periféricos", 100);
    
    private final String nome;
    private final double preco;
    private final String categoria;
    private final int estoque;
    
    Produto(String nome, double preco, String categoria, int estoque) {
        // ✅ Validar
        Objects.requireNonNull(nome);
        if (preco <= 0 || estoque < 0) {
            throw new IllegalArgumentException("Atributos inválidos");
        }
        
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
        this.estoque = estoque;
    }
    
    // ✅ Getters
    public String getNome() { return nome; }
    public double getPreco() { return preco; }
    public String getCategoria() { return categoria; }
    public int getEstoque() { return estoque; }
    
    // ✅ Métodos usam múltiplos atributos
    public String detalhar() {
        return String.format("%s - R$ %.2f - Categoria: %s - Estoque: %d", 
            nome, preco, categoria, estoque);
    }
}
```

**Tipos de atributos**:

```java
// String, int, double
private final String nome;
private final int estoque;
private final double preco;

// LocalDate, Collection
private final LocalDate dataInicio;
private final List<String> funcoes;

// Enum aninhado
private final TipoConfig tipo;

// Calculado
private final double mensalidadeDependente;
```

**Regra de Ouro**: Enum com **múltiplos atributos** para entidades **fixas** e **limitadas** (poucos objetos). Atributos **private final**. Getters **públicos**. **Validar** no construtor. **Cópia defensiva** para collections. Considerar **classe** se muitos atributos (> 5-7). Métodos podem **combinar múltiplos atributos** (formatação, cálculo, validação).
