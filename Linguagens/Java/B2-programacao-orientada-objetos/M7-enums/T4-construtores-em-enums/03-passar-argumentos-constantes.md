# T4.03 - Passar Argumentos para Constantes

## Introdução

**Argumentos para constantes**: passados entre parênteses na declaração.

```java
public enum Status {
    ATIVO("Ativo"),
    INATIVO("Inativo"),
    PENDENTE("Pendente");
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
}

System.out.println(Status.ATIVO.getDescricao()); // "Ativo"
```

**Sintaxe**: `CONSTANTE(arg1, arg2, ...)`

---

## Fundamentos

### 1. Um Argumento

```java
public enum Prioridade {
    BAIXA(1),
    MEDIA(2),
    ALTA(3);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
    }
    
    public int getNivel() {
        return nivel;
    }
}

System.out.println(Prioridade.ALTA.getNivel()); // 3
```

### 2. Dois Argumentos

```java
public enum Moeda {
    REAL("BRL", "R$"),
    DOLAR("USD", "$"),
    EURO("EUR", "€");
    
    private final String codigo;
    private final String simbolo;
    
    Moeda(String codigo, String simbolo) {
        this.codigo = codigo;
        this.simbolo = simbolo;
    }
    
    public String getCodigo() { return codigo; }
    public String getSimbolo() { return simbolo; }
}

System.out.println(Moeda.REAL.getSimbolo()); // "R$"
```

### 3. Múltiplos Argumentos

```java
public enum Produto {
    NOTEBOOK("Notebook Dell", 3000.0, "Eletrônicos"),
    CADEIRA("Cadeira Gamer", 800.0, "Móveis"),
    MOUSE("Mouse Logitech", 150.0, "Eletrônicos");
    
    private final String nome;
    private final double preco;
    private final String categoria;
    
    Produto(String nome, double preco, String categoria) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
    }
    
    public String getNome() { return nome; }
    public double getPreco() { return preco; }
    public String getCategoria() { return categoria; }
}

System.out.println(Produto.NOTEBOOK.getPreco()); // 3000.0
```

### 4. Tipos Diferentes

```java
public enum Configuracao {
    CONEXOES_MAX("max_connections", 100),
    TIMEOUT("timeout", 30),
    ATIVO("active", true);
    
    private final String chave;
    private final Object valor;
    
    Configuracao(String chave, Object valor) {
        this.chave = chave;
        this.valor = valor;
    }
    
    public String getChave() { return chave; }
    public Object getValor() { return valor; }
}
```

### 5. String e Int

```java
public enum HttpStatus {
    OK("OK", 200),
    NOT_FOUND("Not Found", 404),
    INTERNAL_ERROR("Internal Server Error", 500);
    
    private final String mensagem;
    private final int codigo;
    
    HttpStatus(String mensagem, int codigo) {
        this.mensagem = mensagem;
        this.codigo = codigo;
    }
    
    public String getMensagem() { return mensagem; }
    public int getCodigo() { return codigo; }
}

System.out.println(HttpStatus.OK.getCodigo()); // 200
```

### 6. Enum Aninhado

```java
public enum Operacao {
    SOMA("+", TipoOperacao.BINARIA),
    MULTIPLICACAO("*", TipoOperacao.BINARIA),
    INCREMENTO("++", TipoOperacao.UNARIA);
    
    private final String simbolo;
    private final TipoOperacao tipo;
    
    Operacao(String simbolo, TipoOperacao tipo) {
        this.simbolo = simbolo;
        this.tipo = tipo;
    }
    
    public String getSimbolo() { return simbolo; }
    public TipoOperacao getTipo() { return tipo; }
    
    enum TipoOperacao {
        UNARIA, BINARIA
    }
}

System.out.println(Operacao.SOMA.getTipo()); // BINARIA
```

### 7. Array como Argumento

```java
public enum Permissao {
    ADMIN(new String[]{"ler", "escrever", "deletar"}),
    USER(new String[]{"ler", "escrever"}),
    GUEST(new String[]{"ler"});
    
    private final String[] acoes;
    
    Permissao(String[] acoes) {
        this.acoes = acoes.clone(); // cópia defensiva
    }
    
    public String[] getAcoes() {
        return acoes.clone(); // cópia defensiva
    }
}

System.out.println(Arrays.toString(Permissao.ADMIN.getAcoes()));
// [ler, escrever, deletar]
```

### 8. Varargs

```java
public enum Papel {
    ADMIN("ler", "escrever", "deletar"),
    USER("ler", "escrever"),
    GUEST("ler");
    
    private final String[] permissoes;
    
    Papel(String... permissoes) {
        this.permissoes = permissoes;
    }
    
    public String[] getPermissoes() {
        return permissoes.clone();
    }
}

System.out.println(Arrays.toString(Papel.USER.getPermissoes()));
// [ler, escrever]
```

### 9. Sem Argumento

```java
public enum Direcao {
    NORTE,
    SUL,
    LESTE,
    OESTE;
    
    // Construtor sem argumentos (implícito)
    // Direcao() { }
}
```

### 10. Argumentos Mistos

```java
public enum Tamanho {
    PEQUENO("P", 1, true),
    MEDIO("M", 2, true),
    GRANDE("G", 3, false);
    
    private final String sigla;
    private final int ordem;
    private final boolean disponivel;
    
    Tamanho(String sigla, int ordem, boolean disponivel) {
        this.sigla = sigla;
        this.ordem = ordem;
        this.disponivel = disponivel;
    }
    
    public String getSigla() { return sigla; }
    public int getOrdem() { return ordem; }
    public boolean isDisponivel() { return disponivel; }
}
```

---

## Aplicabilidade

**Passar argumentos** para:
- Inicializar atributos de constantes
- Associar metadados (descrição, código)
- Configurar comportamento específico
- Atribuir valores únicos

---

## Armadilhas

### 1. Esquecer Argumento

```java
// ❌ Erro de compilação
public enum Prioridade {
    ALTA(3),
    BAIXA; // ❌ Falta argumento
    
    private final int nivel;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
    }
}

// ✅ Passar argumento
BAIXA(1)
```

### 2. Tipo Errado

```java
// ❌ Erro de compilação
public enum Moeda {
    REAL(100, "R$"); // ❌ Esperava String, passou int
    
    private final String codigo;
    private final String simbolo;
    
    Moeda(String codigo, String simbolo) {
        this.codigo = codigo;
        this.simbolo = simbolo;
    }
}

// ✅ Tipo correto
REAL("BRL", "R$")
```

### 3. Ordem Errada

```java
// ❌ Erro de compilação
public enum Produto {
    MOUSE(150.0, "Mouse"); // ❌ Ordem invertida
    
    private final String nome;
    private final double preco;
    
    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
}

// ✅ Ordem correta
MOUSE("Mouse", 150.0)
```

---

## Boas Práticas

### 1. Atributos Final

```java
// ✅ Atributos final (imutável)
public enum Status {
    ATIVO("Ativo");
    
    private final String descricao; // ✅ final
    
    Status(String descricao) {
        this.descricao = descricao;
    }
}
```

### 2. Getter Público

```java
// ✅ Getter para acessar atributos
public enum Prioridade {
    ALTA(3);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
    }
    
    public int getNivel() { // ✅ Getter público
        return nivel;
    }
}
```

### 3. Validação no Construtor

```java
// ✅ Validar argumentos
public enum Percentual {
    P50(50);
    
    private final int valor;
    
    Percentual(int valor) {
        if (valor < 0 || valor > 100) {
            throw new IllegalArgumentException("Inválido: " + valor);
        }
        this.valor = valor;
    }
}
```

### 4. Documentar Parâmetros

```java
// ✅ Javadoc para construtor
public enum Moeda {
    REAL("BRL", "R$");
    
    private final String codigo;
    private final String simbolo;
    
    /**
     * @param codigo Código ISO (ex: BRL)
     * @param simbolo Símbolo (ex: R$)
     */
    Moeda(String codigo, String simbolo) {
        this.codigo = codigo;
        this.simbolo = simbolo;
    }
}
```

---

## Resumo

**Passar argumentos**:

```java
public enum Status {
    ATIVO("Ativo"),
    INATIVO("Inativo");
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
}
```

**Sintaxe**:

```java
// Um argumento
ATIVO("Ativo")

// Dois argumentos
REAL("BRL", "R$")

// Múltiplos argumentos
NOTEBOOK("Notebook", 3000.0, "Eletrônicos")

// Sem argumento
NORTE

// Varargs
ADMIN("ler", "escrever", "deletar")
```

**Tipos diferentes**:

```java
public enum HttpStatus {
    OK("OK", 200); // String, int
    
    private final String mensagem;
    private final int codigo;
    
    HttpStatus(String mensagem, int codigo) {
        this.mensagem = mensagem;
        this.codigo = codigo;
    }
}
```

**Varargs**:

```java
public enum Papel {
    ADMIN("ler", "escrever", "deletar"); // Varargs
    
    private final String[] permissoes;
    
    Papel(String... permissoes) {
        this.permissoes = permissoes;
    }
}
```

**Regra de Ouro**: Argumentos passados entre **parênteses** na declaração da constante: `CONSTANTE(arg1, arg2)`. Construtor recebe e inicializa **atributos**. Atributos devem ser **final** (imutável). Getter **público** para acessar. **Validar** argumentos no construtor. **Ordem** e **tipo** devem corresponder ao construtor.
