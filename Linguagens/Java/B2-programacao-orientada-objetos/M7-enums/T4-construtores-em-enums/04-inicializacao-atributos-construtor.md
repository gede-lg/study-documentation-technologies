# T4.04 - Inicialização de Atributos via Construtor

## Introdução

**Inicialização de atributos**: construtor atribui valores aos campos.

```java
public enum Status {
    ATIVO("Ativo", 1),
    INATIVO("Inativo", 0);
    
    private final String descricao;
    private final int codigo;
    
    Status(String descricao, int codigo) {
        this.descricao = descricao; // Inicialização
        this.codigo = codigo;       // Inicialização
    }
    
    public String getDescricao() { return descricao; }
    public int getCodigo() { return codigo; }
}
```

**Construtor**: atribui valores recebidos aos atributos.

---

## Fundamentos

### 1. Atributo Final

```java
public enum Cor {
    VERMELHO("#FF0000");
    
    private final String hex; // final = imutável
    
    Cor(String hex) {
        this.hex = hex; // Inicializado no construtor
    }
    
    public String getHex() {
        return hex;
    }
}

System.out.println(Cor.VERMELHO.getHex()); // "#FF0000"
```

### 2. Múltiplos Atributos

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

System.out.println(Moeda.YEN.getCasasDecimais()); // 0
```

### 3. Atributo Derivado

```java
public enum Tamanho {
    PEQUENO("P", 1),
    MEDIO("M", 2),
    GRANDE("G", 3);
    
    private final String sigla;
    private final int ordem;
    private final String descricao; // derivado
    
    Tamanho(String sigla, int ordem) {
        this.sigla = sigla;
        this.ordem = ordem;
        this.descricao = sigla + " (" + ordem + ")"; // calculado
    }
    
    public String getDescricao() {
        return descricao;
    }
}

System.out.println(Tamanho.PEQUENO.getDescricao()); // "P (1)"
```

### 4. Atributo Static

```java
public enum Temperatura {
    FRIO(0, 15),
    QUENTE(26, 40);
    
    private static final String UNIDADE = "°C"; // static
    
    private final int min;
    private final int max;
    
    Temperatura(int min, int max) {
        this.min = min;
        this.max = max;
    }
    
    public String getDescricao() {
        return min + UNIDADE + " - " + max + UNIDADE;
    }
}

System.out.println(Temperatura.FRIO.getDescricao()); // "0°C - 15°C"
```

### 5. Atributo Não Final

```java
// ⚠️ Evitar: atributo mutável
public enum Contador {
    INSTANCE;
    
    private int count = 0; // não final
    
    Contador() {
        this.count = 0;
    }
    
    public void incrementar() {
        count++;
    }
    
    public int getCount() {
        return count;
    }
}

Contador.INSTANCE.incrementar();
System.out.println(Contador.INSTANCE.getCount()); // 1
```

### 6. Inicialização com Validação

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
        this.valor = valor; // Inicializado após validação
    }
    
    public int getValor() {
        return valor;
    }
}
```

### 7. Atributo Collection

```java
public enum Permissao {
    ADMIN(Arrays.asList("ler", "escrever", "deletar")),
    USER(Arrays.asList("ler", "escrever"));
    
    private final List<String> acoes;
    
    Permissao(List<String> acoes) {
        this.acoes = new ArrayList<>(acoes); // cópia defensiva
    }
    
    public List<String> getAcoes() {
        return new ArrayList<>(acoes); // cópia defensiva
    }
}
```

### 8. Atributo Default

```java
public enum Status {
    ATIVO("Ativo"),
    INATIVO("Inativo"),
    PENDENTE; // sem argumento
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    Status() {
        this.descricao = "Pendente"; // valor padrão
    }
    
    public String getDescricao() {
        return descricao;
    }
}

System.out.println(Status.PENDENTE.getDescricao()); // "Pendente"
```

### 9. Atributo com Cálculo

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

### 10. Atributo Primitivo e Objeto

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

---

## Aplicabilidade

**Inicialização via construtor** para:
- Atribuir valores únicos a cada constante
- Garantir imutabilidade (final)
- Calcular atributos derivados
- Validar valores recebidos

---

## Armadilhas

### 1. Atributo Não Inicializado

```java
// ❌ Erro de compilação
public enum Status {
    ATIVO;
    
    private final String descricao; // ❌ final não inicializado
    
    Status() {
        // ❌ this.descricao não atribuído
    }
}

// ✅ Inicializar no construtor
Status() {
    this.descricao = "Ativo";
}
```

### 2. Atributo Mutável

```java
// ⚠️ Evitar: atributo não final
public enum Contador {
    INSTANCE;
    
    private int count; // sem final
    
    public void setCount(int c) {
        this.count = c; // ❌ Constante mutável
    }
}

// ✅ Preferir final
private final int count;
```

### 3. Atributo Não Private

```java
// ⚠️ Evitar: atributo public
public enum Status {
    ATIVO("Ativo");
    
    public final String descricao; // ⚠️ public (pode acessar direto)
    
    Status(String descricao) {
        this.descricao = descricao;
    }
}

// ✅ Preferir private + getter
private final String descricao;
public String getDescricao() { return descricao; }
```

---

## Boas Práticas

### 1. Atributos Final e Private

```java
// ✅ final (imutável) + private (encapsulado)
public enum Moeda {
    REAL("BRL");
    
    private final String codigo; // ✅ final + private
    
    Moeda(String codigo) {
        this.codigo = codigo;
    }
    
    public String getCodigo() {
        return codigo;
    }
}
```

### 2. Validação no Construtor

```java
// ✅ Validar antes de atribuir
public enum Prioridade {
    ALTA(3);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        if (nivel < 1 || nivel > 10) {
            throw new IllegalArgumentException("Nível inválido");
        }
        this.nivel = nivel;
    }
}
```

### 3. Cópia Defensiva

```java
// ✅ Cópia defensiva para collections
public enum Permissao {
    ADMIN(Arrays.asList("ler", "escrever"));
    
    private final List<String> acoes;
    
    Permissao(List<String> acoes) {
        this.acoes = new ArrayList<>(acoes); // ✅ Cópia
    }
    
    public List<String> getAcoes() {
        return new ArrayList<>(acoes); // ✅ Cópia
    }
}
```

### 4. Getter Público

```java
// ✅ Atributo private + getter público
public enum Status {
    ATIVO("Ativo");
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() { // ✅ Getter
        return descricao;
    }
}
```

---

## Resumo

**Inicialização de atributos**:

```java
public enum Status {
    ATIVO("Ativo", 1);
    
    private final String descricao;
    private final int codigo;
    
    Status(String descricao, int codigo) {
        this.descricao = descricao; // Inicialização
        this.codigo = codigo;
    }
    
    public String getDescricao() { return descricao; }
    public int getCodigo() { return codigo; }
}
```

**Atributos final**:

```java
private final String descricao; // ✅ Imutável
private final int nivel;        // ✅ Imutável

// ❌ Evitar: mutável
private String descricao; // sem final
```

**Atributo derivado**:

```java
Tamanho(String sigla, int ordem) {
    this.sigla = sigla;
    this.ordem = ordem;
    this.descricao = sigla + " (" + ordem + ")"; // calculado
}
```

**Validação**:

```java
Percentual(int valor) {
    if (valor < 0 || valor > 100) {
        throw new IllegalArgumentException("Inválido: " + valor);
    }
    this.valor = valor;
}
```

**Regra de Ouro**: Atributos **inicializados no construtor**. Use **final** (imutável). Atributos **private** + getter **público**. **Validar** antes de atribuir. **Cópia defensiva** para collections. Atributos derivados **calculados** no construtor. Cada constante tem valores **únicos**.
