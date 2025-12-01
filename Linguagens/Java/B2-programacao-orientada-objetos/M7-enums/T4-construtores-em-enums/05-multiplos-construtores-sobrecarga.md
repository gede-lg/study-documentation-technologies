# T4.05 - Múltiplos Construtores (Sobrecarga)

## Introdução

**Sobrecarga de construtores**: enum pode ter múltiplos construtores com assinaturas diferentes.

```java
public enum Status {
    ATIVO("Ativo", 1),
    INATIVO("Inativo"),
    PENDENTE;
    
    private final String descricao;
    private final int codigo;
    
    // Construtor 1: dois parâmetros
    Status(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
    
    // Construtor 2: um parâmetro
    Status(String descricao) {
        this(descricao, 0); // chama construtor 1
    }
    
    // Construtor 3: sem parâmetros
    Status() {
        this("Pendente", -1); // chama construtor 1
    }
    
    public String getDescricao() { return descricao; }
    public int getCodigo() { return codigo; }
}
```

**Sobrecarga**: construtores com diferentes números/tipos de parâmetros.

---

## Fundamentos

### 1. Dois Construtores

```java
public enum Prioridade {
    ALTA("Alta", 3),
    BAIXA("Baixa"),
    URGENTE(99);
    
    private final String descricao;
    private final int nivel;
    
    // Construtor 1: dois parâmetros
    Prioridade(String descricao, int nivel) {
        this.descricao = descricao;
        this.nivel = nivel;
    }
    
    // Construtor 2: um parâmetro (String)
    Prioridade(String descricao) {
        this(descricao, 1); // chama construtor 1
    }
    
    // Construtor 3: um parâmetro (int)
    Prioridade(int nivel) {
        this("Prioridade " + nivel, nivel);
    }
}

System.out.println(Prioridade.BAIXA.getDescricao()); // "Baixa"
System.out.println(Prioridade.URGENTE.getNivel()); // 99
```

### 2. Construtor Padrão

```java
public enum Cor {
    VERMELHO("#FF0000"),
    VERDE("#00FF00"),
    CUSTOM; // sem argumento
    
    private final String hex;
    
    // Construtor 1: com parâmetro
    Cor(String hex) {
        this.hex = hex;
    }
    
    // Construtor 2: sem parâmetro (padrão)
    Cor() {
        this("#000000"); // chama construtor 1
    }
    
    public String getHex() {
        return hex;
    }
}

System.out.println(Cor.CUSTOM.getHex()); // "#000000"
```

### 3. this() para Reutilizar

```java
public enum Moeda {
    REAL("BRL", "R$", 2),
    DOLAR("USD"),
    BITCOIN;
    
    private final String codigo;
    private final String simbolo;
    private final int casasDecimais;
    
    // Construtor 1: completo
    Moeda(String codigo, String simbolo, int casasDecimais) {
        this.codigo = codigo;
        this.simbolo = simbolo;
        this.casasDecimais = casasDecimais;
    }
    
    // Construtor 2: código apenas
    Moeda(String codigo) {
        this(codigo, codigo.substring(0, 1), 2); // padrões
    }
    
    // Construtor 3: sem parâmetros
    Moeda() {
        this("BTC", "₿", 8);
    }
}

System.out.println(Moeda.DOLAR.getSimbolo()); // "U"
System.out.println(Moeda.BITCOIN.getCodigo()); // "BTC"
```

### 4. Construtores com Tipos Diferentes

```java
public enum Configuracao {
    MAX_CONNECTIONS(100),
    TIMEOUT("30s"),
    ENABLED(true);
    
    private final Object valor;
    
    // Construtor 1: int
    Configuracao(int valor) {
        this.valor = valor;
    }
    
    // Construtor 2: String
    Configuracao(String valor) {
        this.valor = valor;
    }
    
    // Construtor 3: boolean
    Configuracao(boolean valor) {
        this.valor = valor;
    }
    
    public Object getValor() {
        return valor;
    }
}
```

### 5. Validação Diferenciada

```java
public enum Percentual {
    P10(10),
    P50(50.0),
    CUSTOM;
    
    private final double valor;
    
    // Construtor 1: int
    Percentual(int valor) {
        if (valor < 0 || valor > 100) {
            throw new IllegalArgumentException("Inválido: " + valor);
        }
        this.valor = valor;
    }
    
    // Construtor 2: double
    Percentual(double valor) {
        if (valor < 0.0 || valor > 100.0) {
            throw new IllegalArgumentException("Inválido: " + valor);
        }
        this.valor = valor;
    }
    
    // Construtor 3: sem parâmetro
    Percentual() {
        this.valor = 0.0;
    }
}
```

### 6. Construtor com Varargs

```java
public enum Papel {
    ADMIN("Admin", "ler", "escrever", "deletar"),
    USER("User", "ler", "escrever"),
    GUEST("Guest");
    
    private final String nome;
    private final String[] permissoes;
    
    // Construtor 1: com varargs
    Papel(String nome, String... permissoes) {
        this.nome = nome;
        this.permissoes = permissoes;
    }
    
    // Construtor 2: apenas nome
    Papel(String nome) {
        this(nome, new String[]{"ler"}); // permissão padrão
    }
}

System.out.println(Papel.GUEST.getPermissoes().length); // 1
```

### 7. Construtores Encadeados

```java
public enum Produto {
    NOTEBOOK("Notebook", 3000.0, "Eletrônicos"),
    MOUSE("Mouse", 150.0),
    TECLADO;
    
    private final String nome;
    private final double preco;
    private final String categoria;
    
    // Construtor 1: completo
    Produto(String nome, double preco, String categoria) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
    }
    
    // Construtor 2: nome e preço
    Produto(String nome, double preco) {
        this(nome, preco, "Geral"); // categoria padrão
    }
    
    // Construtor 3: sem parâmetros
    Produto() {
        this("Produto Genérico", 0.0, "Geral");
    }
}
```

### 8. Sobrecarga com Builder Pattern

```java
public enum Tarefa {
    URGENTE("Urgente", 1, true),
    NORMAL("Normal", 5),
    BAIXA;
    
    private final String descricao;
    private final int prioridade;
    private final boolean notificar;
    
    // Construtor 1: completo
    Tarefa(String descricao, int prioridade, boolean notificar) {
        this.descricao = descricao;
        this.prioridade = prioridade;
        this.notificar = notificar;
    }
    
    // Construtor 2: sem notificar
    Tarefa(String descricao, int prioridade) {
        this(descricao, prioridade, false);
    }
    
    // Construtor 3: padrão
    Tarefa() {
        this("Baixa prioridade", 10, false);
    }
}
```

### 9. Construtores com Lógica

```java
public enum Tamanho {
    PEQUENO("P", 1),
    MEDIO("M"),
    GRANDE;
    
    private final String sigla;
    private final int ordem;
    private final String descricao;
    
    // Construtor 1: sigla e ordem
    Tamanho(String sigla, int ordem) {
        this.sigla = sigla;
        this.ordem = ordem;
        this.descricao = gerarDescricao(sigla, ordem);
    }
    
    // Construtor 2: apenas sigla
    Tamanho(String sigla) {
        this(sigla, calcularOrdem(sigla));
    }
    
    // Construtor 3: padrão
    Tamanho() {
        this("G", 3);
    }
    
    private static String gerarDescricao(String sigla, int ordem) {
        return sigla + " - Ordem " + ordem;
    }
    
    private static int calcularOrdem(String sigla) {
        return sigla.equals("M") ? 2 : 0;
    }
}
```

### 10. Sobrecarga com Enum Aninhado

```java
public enum Operacao {
    SOMA("+", TipoOperacao.BINARIA),
    INCREMENTO("++");
    
    private final String simbolo;
    private final TipoOperacao tipo;
    
    // Construtor 1: símbolo e tipo
    Operacao(String simbolo, TipoOperacao tipo) {
        this.simbolo = simbolo;
        this.tipo = tipo;
    }
    
    // Construtor 2: apenas símbolo
    Operacao(String simbolo) {
        this(simbolo, TipoOperacao.UNARIA); // tipo padrão
    }
    
    enum TipoOperacao {
        UNARIA, BINARIA
    }
}
```

---

## Aplicabilidade

**Sobrecarga de construtores** para:
- Flexibilidade na criação de constantes
- Valores padrão para parâmetros opcionais
- Simplificar declaração de constantes
- Reduzir duplicação de código

---

## Armadilhas

### 1. Ambiguidade

```java
// ⚠️ Ambiguidade: dois construtores com int
public enum Config {
    A(10),
    B(20);
    
    private final int valor1;
    private final int valor2;
    
    Config(int valor1) {
        this.valor1 = valor1;
        this.valor2 = 0;
    }
    
    // ❌ Ambíguo: qual construtor usar?
    // Config(int valor2) { ... }
}
```

### 2. Construtor Não Chamado

```java
// ⚠️ Construtor 2 nunca usado
public enum Status {
    ATIVO("Ativo", 1),
    INATIVO("Inativo", 0);
    
    private final String descricao;
    private final int codigo;
    
    Status(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
    
    Status(String descricao) { // ⚠️ Nunca usado
        this(descricao, 0);
    }
}
```

### 3. this() em Loop

```java
// ❌ Erro: this() recursivo
public enum Cor {
    VERMELHO;
    
    private final String hex;
    
    Cor(String hex) {
        this(hex); // ❌ Recursão infinita
    }
}
```

---

## Boas Práticas

### 1. this() para Reutilizar

```java
// ✅ Reutilizar lógica com this()
Prioridade(String descricao) {
    this(descricao, 1); // chama construtor completo
}
```

### 2. Construtor Mais Completo

```java
// ✅ Construtor completo recebe todos os parâmetros
Moeda(String codigo, String simbolo, int casasDecimais) {
    this.codigo = codigo;
    this.simbolo = simbolo;
    this.casasDecimais = casasDecimais;
}

// Outros construtores chamam o completo
Moeda(String codigo) {
    this(codigo, "$", 2);
}
```

### 3. Valores Padrão

```java
// ✅ Valores padrão sensatos
Status() {
    this("Desconhecido", -1);
}
```

---

## Resumo

**Sobrecarga de construtores**:

```java
public enum Status {
    ATIVO("Ativo", 1),
    INATIVO("Inativo"),
    PENDENTE;
    
    private final String descricao;
    private final int codigo;
    
    // Construtor 1: dois parâmetros
    Status(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
    
    // Construtor 2: um parâmetro
    Status(String descricao) {
        this(descricao, 0);
    }
    
    // Construtor 3: sem parâmetros
    Status() {
        this("Pendente", -1);
    }
}
```

**this() para encadear**:

```java
// Construtor completo
Prioridade(String descricao, int nivel) {
    this.descricao = descricao;
    this.nivel = nivel;
}

// Construtores delegam para o completo
Prioridade(String descricao) {
    this(descricao, 1); // valor padrão
}

Prioridade(int nivel) {
    this("Prioridade " + nivel, nivel);
}
```

**Tipos diferentes**:

```java
Config(int valor) { this.valor = valor; }
Config(String valor) { this.valor = Integer.parseInt(valor); }
Config(boolean valor) { this.valor = valor ? 1 : 0; }
```

**Regra de Ouro**: Enum pode ter **múltiplos construtores** (sobrecarga). Use **this()** para reutilizar lógica. Construtor **completo** recebe todos os parâmetros. Outros construtores delegam para o completo com **valores padrão**. Evite **ambiguidade** (mesma assinatura). Construtores sempre **private** (implícito).
