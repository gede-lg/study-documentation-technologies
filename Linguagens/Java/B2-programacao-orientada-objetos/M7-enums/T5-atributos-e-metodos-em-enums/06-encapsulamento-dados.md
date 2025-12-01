# T5.06 - Encapsulamento de Dados

## Introdução

**Encapsulamento**: atributos privados, acessados via métodos públicos.

```java
public enum Produto {
    NOTEBOOK("Notebook", 3000.0);
    
    // ✅ Atributos private
    private final String nome;
    private final double preco;
    
    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
    
    // ✅ Getters públicos
    public String getNome() {
        return nome;
    }
    
    public double getPreco() {
        return preco;
    }
}

// ✅ Acesso via getter
String nome = Produto.NOTEBOOK.getNome();

// ❌ Não pode acessar diretamente
// Produto.NOTEBOOK.nome; // Erro: 'nome' has private access
```

**Encapsulamento**: ocultar implementação interna.

---

## Fundamentos

### 1. Atributos Private

```java
public enum Status {
    ATIVO("Ativo", 1);
    
    // ✅ private (encapsulado)
    private final String descricao;
    private final int codigo;
    
    Status(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
    
    public String getDescricao() { return descricao; }
    public int getCodigo() { return codigo; }
}
```

### 2. Sem Setter

```java
public enum Moeda {
    REAL("BRL", "R$");
    
    private final String codigo;
    private final String simbolo;
    
    Moeda(String codigo, String simbolo) {
        this.codigo = codigo;
        this.simbolo = simbolo;
    }
    
    // ✅ Apenas getter (imutável)
    public String getCodigo() {
        return codigo;
    }
    
    // ❌ Sem setter
    // public void setCodigo(String c) { }
}
```

### 3. Cópia Defensiva

```java
public enum Permissao {
    ADMIN(Arrays.asList("ler", "escrever", "deletar"));
    
    private final List<String> acoes;
    
    Permissao(List<String> acoes) {
        // ✅ Cópia defensiva (construtor)
        this.acoes = new ArrayList<>(acoes);
    }
    
    public List<String> getAcoes() {
        // ✅ Cópia defensiva (getter)
        return new ArrayList<>(acoes);
    }
}

// Modificar retorno não afeta original
List<String> acoes = Permissao.ADMIN.getAcoes();
acoes.add("novo"); // não afeta Permissao.ADMIN
```

### 4. Collections.unmodifiable

```java
public enum Papel {
    ADMIN(Arrays.asList("ler", "escrever"));
    
    private final List<String> permissoes;
    
    Papel(List<String> permissoes) {
        this.permissoes = new ArrayList<>(permissoes);
    }
    
    // ✅ Retorna lista imutável
    public List<String> getPermissoes() {
        return Collections.unmodifiableList(permissoes);
    }
}

// ❌ Não pode modificar
List<String> perms = Papel.ADMIN.getPermissoes();
// perms.add("deletar"); // UnsupportedOperationException
```

### 5. Validação no Getter

```java
public enum TipoConta {
    CORRENTE("Corrente", 1000);
    
    private final String nome;
    private final double limiteMinimo;
    
    TipoConta(String nome, double limiteMinimo) {
        this.nome = nome;
        this.limiteMinimo = limiteMinimo;
    }
    
    public String getNome() {
        return nome;
    }
    
    // ✅ Validação encapsulada
    public boolean validarSaldo(double saldo) {
        return saldo >= limiteMinimo; // acessa atributo private
    }
}
```

### 6. Método Interno Private

```java
public enum Temperatura {
    CELSIUS("C"),
    FAHRENHEIT("F");
    
    private final String simbolo;
    
    Temperatura(String simbolo) {
        this.simbolo = simbolo;
    }
    
    public String formatar(double valor) {
        return format(valor) + "°" + simbolo;
    }
    
    // ✅ Método private (encapsulado)
    private String format(double valor) {
        return String.format("%.1f", valor);
    }
}
```

### 7. Atributo Calculado Encapsulado

```java
public enum Desconto {
    BRONZE(0.05),
    PRATA(0.10);
    
    private final double percentual;
    
    Desconto(double percentual) {
        this.percentual = percentual;
    }
    
    // ✅ Cálculo encapsulado
    public double aplicar(double valor) {
        return valor - calcularDesconto(valor); // usa método private
    }
    
    private double calcularDesconto(double valor) {
        return valor * percentual; // acessa atributo private
    }
}
```

### 8. Ocultando Implementação

```java
public enum Cache {
    INSTANCE;
    
    // ✅ Implementação privada (HashMap)
    private final Map<String, Object> dados = new HashMap<>();
    
    // ✅ Interface pública (sem expor HashMap)
    public void put(String chave, Object valor) {
        dados.put(chave, valor);
    }
    
    public Object get(String chave) {
        return dados.get(chave);
    }
    
    public boolean contem(String chave) {
        return dados.containsKey(chave);
    }
}

// Cliente não sabe que usa HashMap internamente
Cache.INSTANCE.put("key", "value");
```

### 9. Builder Pattern Encapsulado

```java
public enum Relatorio {
    VENDAS("Vendas");
    
    private final String titulo;
    
    Relatorio(String titulo) {
        this.titulo = titulo;
    }
    
    public Builder builder() {
        return new Builder(this);
    }
    
    // ✅ Builder interno (acessa atributos private)
    public static class Builder {
        private final Relatorio tipo;
        private LocalDate dataInicio;
        
        private Builder(Relatorio tipo) {
            this.tipo = tipo;
        }
        
        public Builder dataInicio(LocalDate data) {
            this.dataInicio = data;
            return this;
        }
        
        public String gerar() {
            return tipo.titulo + ": " + dataInicio; // acessa tipo.titulo
        }
    }
}
```

### 10. Atributo Static Private

```java
public enum Configuracao {
    TIMEOUT("timeout", "30"),
    MAX_CONN("max_conn", "100");
    
    // ✅ Cache private
    private static final Map<String, Configuracao> MAP = new HashMap<>();
    
    static {
        for (Configuracao c : values()) {
            MAP.put(c.chave, c);
        }
    }
    
    private final String chave;
    private final String valor;
    
    Configuracao(String chave, String valor) {
        this.chave = chave;
        this.valor = valor;
    }
    
    // ✅ Acesso público via método
    public static Configuracao porChave(String chave) {
        return MAP.get(chave); // acessa MAP private
    }
}
```

---

## Aplicabilidade

**Encapsulamento** para:
- Ocultar implementação interna
- Garantir imutabilidade
- Controlar acesso a dados
- Prevenir modificações indevidas

---

## Armadilhas

### 1. Atributo Public

```java
// ❌ Atributo public (não encapsulado)
public enum Status {
    ATIVO("Ativo");
    
    public final String descricao; // ❌ public
    
    Status(String descricao) {
        this.descricao = descricao;
    }
}

// ⚠️ Acesso direto
String desc = Status.ATIVO.descricao;

// ✅ Preferir private + getter
private final String descricao;
public String getDescricao() { return descricao; }
```

### 2. Vazamento de Referência

```java
// ❌ Retorna referência direta
public List<String> getAcoes() {
    return acoes; // ❌ Vazamento
}

// ⚠️ Pode modificar
Permissao.ADMIN.getAcoes().add("deletar");

// ✅ Retornar cópia ou unmodifiable
public List<String> getAcoes() {
    return new ArrayList<>(acoes);
}
```

### 3. Setter em Enum

```java
// ❌ Setter quebra imutabilidade
public void setDescricao(String d) {
    this.descricao = d; // ❌ Constante mutável
}

// ✅ Sem setter (imutável)
// Apenas getter
```

---

## Boas Práticas

### 1. Private + Getter

```java
// ✅ Atributo private + getter público
private final String nome;

public String getNome() {
    return nome;
}
```

### 2. Cópia Defensiva

```java
// ✅ Cópia para collections
Permissao(List<String> acoes) {
    this.acoes = new ArrayList<>(acoes);
}

public List<String> getAcoes() {
    return new ArrayList<>(acoes);
}
```

### 3. Collections.unmodifiable

```java
// ✅ Lista imutável
public List<String> getPermissoes() {
    return Collections.unmodifiableList(permissoes);
}
```

### 4. Métodos Private

```java
// ✅ Lógica interna private
private double calcular(double valor) {
    return valor * percentual;
}

// ✅ Interface pública
public double aplicar(double valor) {
    return calcular(valor); // usa método private
}
```

---

## Resumo

**Encapsulamento**:

```java
public enum Produto {
    NOTEBOOK("Notebook", 3000.0);
    
    // ✅ Atributos private
    private final String nome;
    private final double preco;
    
    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
    
    // ✅ Getters públicos
    public String getNome() { return nome; }
    public double getPreco() { return preco; }
    
    // ❌ Sem setter (imutável)
}

// ✅ Acesso via getter
Produto.NOTEBOOK.getNome();

// ❌ Não acessa direto
// Produto.NOTEBOOK.nome; // Erro
```

**Cópia defensiva**:

```java
// ✅ Construtor
Permissao(List<String> acoes) {
    this.acoes = new ArrayList<>(acoes);
}

// ✅ Getter
public List<String> getAcoes() {
    return new ArrayList<>(acoes);
}
```

**Vantagens**:

```java
// 1. Ocultar implementação
private final Map<String, Object> dados; // cliente não vê HashMap

// 2. Imutabilidade
private final String nome; // sem setter

// 3. Validação
public boolean validar(double saldo) {
    return saldo >= limiteMinimo; // encapsula lógica
}

// 4. Flexibilidade
public String getDescricao() {
    return nome + " (" + codigo + ")"; // pode mudar implementação
}
```

**Regra de Ouro**: Atributos **private final** (encapsulados e imutáveis). Getter **público**. **Sem setter**. **Cópia defensiva** para collections/arrays. **Collections.unmodifiable** para imutabilidade. Métodos internos **private**. Ocultar **implementação** (cliente não vê detalhes).
