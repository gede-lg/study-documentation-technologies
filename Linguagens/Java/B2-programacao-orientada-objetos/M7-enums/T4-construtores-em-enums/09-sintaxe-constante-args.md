# T4.09 - Sintaxe: CONSTANTE(args)

## Introdução

**Sintaxe de argumentos**: `CONSTANTE(arg1, arg2, ...)` passa valores ao construtor.

```java
public enum Status {
    ATIVO("Ativo", 1),      // Status("Ativo", 1)
    INATIVO("Inativo", 0),  // Status("Inativo", 0)
    PENDENTE("Pendente", 2); // Status("Pendente", 2)
    
    private final String descricao;
    private final int codigo;
    
    Status(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
}
```

**Parênteses**: argumentos entre parênteses após nome da constante.

---

## Fundamentos

### 1. Sem Argumentos

```java
public enum Direcao {
    NORTE,  // Direcao()
    SUL,    // Direcao()
    LESTE,  // Direcao()
    OESTE;  // Direcao()
    
    Direcao() {
        System.out.println("Criando: " + this.name());
    }
}
```

### 2. Um Argumento

```java
public enum Cor {
    VERMELHO("#FF0000"), // Cor("#FF0000")
    VERDE("#00FF00"),    // Cor("#00FF00")
    AZUL("#0000FF");     // Cor("#0000FF")
    
    private final String hex;
    
    Cor(String hex) {
        this.hex = hex;
    }
}
```

### 3. Dois Argumentos

```java
public enum Moeda {
    REAL("BRL", "R$"),  // Moeda("BRL", "R$")
    DOLAR("USD", "$"),  // Moeda("USD", "$")
    EURO("EUR", "€");   // Moeda("EUR", "€")
    
    private final String codigo;
    private final String simbolo;
    
    Moeda(String codigo, String simbolo) {
        this.codigo = codigo;
        this.simbolo = simbolo;
    }
}
```

### 4. Múltiplos Argumentos

```java
public enum Produto {
    NOTEBOOK("Notebook", 3000.0, "Eletrônicos", true),
    CADEIRA("Cadeira", 800.0, "Móveis", false),
    MOUSE("Mouse", 150.0, "Eletrônicos", true);
    
    private final String nome;
    private final double preco;
    private final String categoria;
    private final boolean disponivel;
    
    Produto(String nome, double preco, String categoria, boolean disponivel) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
        this.disponivel = disponivel;
    }
}
```

### 5. Tipos Diferentes

```java
public enum Configuracao {
    MAX_CONNECTIONS("max_conn", 100),     // String, int
    TIMEOUT("timeout", 30.5),             // String, double
    ENABLED("enabled", true);             // String, boolean
    
    private final String chave;
    private final Object valor;
    
    Configuracao(String chave, Object valor) {
        this.chave = chave;
        this.valor = valor;
    }
}
```

### 6. String Literal

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
}
```

### 7. Expressões

```java
public enum Temperatura {
    FRIO(0 + 10),        // 10
    MODERADO(10 + 10),   // 20
    QUENTE(20 + 10);     // 30
    
    private final int graus;
    
    Temperatura(int graus) {
        this.graus = graus;
    }
}
```

### 8. Constantes

```java
public enum Circulo {
    PEQUENO(Math.PI * 1 * 1),   // πr²
    MEDIO(Math.PI * 5 * 5),
    GRANDE(Math.PI * 10 * 10);
    
    private final double area;
    
    Circulo(double area) {
        this.area = area;
    }
    
    public double getArea() {
        return area;
    }
}
```

### 9. Array Inline

```java
public enum Permissao {
    ADMIN(new String[]{"ler", "escrever", "deletar"}),
    USER(new String[]{"ler", "escrever"}),
    GUEST(new String[]{"ler"});
    
    private final String[] acoes;
    
    Permissao(String[] acoes) {
        this.acoes = acoes.clone();
    }
    
    public String[] getAcoes() {
        return acoes.clone();
    }
}
```

### 10. Múltiplas Linhas

```java
public enum Relatorio {
    VENDAS(
        "Relatório de Vendas",
        "Exibe todas as vendas do mês",
        Arrays.asList("data", "valor", "cliente")
    ),
    ESTOQUE(
        "Relatório de Estoque",
        "Exibe produtos em estoque",
        Arrays.asList("produto", "quantidade", "valor")
    );
    
    private final String titulo;
    private final String descricao;
    private final List<String> colunas;
    
    Relatorio(String titulo, String descricao, List<String> colunas) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.colunas = new ArrayList<>(colunas);
    }
}
```

---

## Aplicabilidade

**Sintaxe CONSTANTE(args)** para:
- Passar valores únicos a cada constante
- Inicializar atributos específicos
- Configurar comportamento de constantes
- Associar metadados

---

## Armadilhas

### 1. Esquecer Argumento

```java
// ❌ Erro de compilação
public enum Status {
    ATIVO("Ativo", 1),
    INATIVO; // ❌ Falta argumento
    
    private final String descricao;
    private final int codigo;
    
    Status(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
}

// ✅ Fornecer argumento ou criar construtor sem parâmetro
INATIVO("Inativo", 0)
```

### 2. Tipo Errado

```java
// ❌ Erro de compilação
public enum Prioridade {
    ALTA("Alta", "3"); // ❌ Esperava int, passou String
    
    private final String nome;
    private final int nivel;
    
    Prioridade(String nome, int nivel) {
        this.nome = nome;
        this.nivel = nivel;
    }
}

// ✅ Tipo correto
ALTA("Alta", 3)
```

### 3. Ordem Errada

```java
// ❌ Erro de compilação
public enum Moeda {
    REAL("R$", "BRL"); // ❌ Ordem invertida
    
    private final String codigo;
    private final String simbolo;
    
    Moeda(String codigo, String simbolo) {
        this.codigo = codigo;
        this.simbolo = simbolo;
    }
}

// ✅ Ordem correta
REAL("BRL", "R$")
```

---

## Boas Práticas

### 1. Quebra de Linha

```java
// ✅ Quebrar linha para múltiplos argumentos
public enum Produto {
    NOTEBOOK(
        "Notebook Dell",
        3000.0,
        "Eletrônicos",
        true
    ),
    CADEIRA(
        "Cadeira Gamer",
        800.0,
        "Móveis",
        false
    );
}
```

### 2. Constantes Static

```java
// ✅ Usar constantes para valores reutilizados
private static final String CATEGORIA_ELETRONICOS = "Eletrônicos";

public enum Produto {
    NOTEBOOK("Notebook", 3000.0, CATEGORIA_ELETRONICOS),
    MOUSE("Mouse", 150.0, CATEGORIA_ELETRONICOS);
}
```

### 3. Factory Method

```java
// ✅ Factory method para criação complexa
public enum Planeta {
    TERRA(criarTerra()),
    MARTE(criarMarte());
    
    private final DadosPlaneta dados;
    
    Planeta(DadosPlaneta dados) {
        this.dados = dados;
    }
    
    private static DadosPlaneta criarTerra() {
        return new DadosPlaneta(5.976e24, 6.37814e6);
    }
    
    private static DadosPlaneta criarMarte() {
        return new DadosPlaneta(6.421e23, 3.3962e6);
    }
}
```

### 4. Comentários

```java
// ✅ Comentar argumentos complexos
public enum Status {
    ATIVO(
        "Ativo",        // descrição
        1,              // código
        true,           // visível
        "#00FF00"       // cor
    );
}
```

---

## Resumo

**Sintaxe CONSTANTE(args)**:

```java
public enum Status {
    ATIVO("Ativo", 1),      // Status("Ativo", 1)
    INATIVO("Inativo", 0);  // Status("Inativo", 0)
    
    private final String descricao;
    private final int codigo;
    
    Status(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
}
```

**Formas**:

```java
// Sem argumentos
NORTE

// Um argumento
VERMELHO("#FF0000")

// Dois argumentos
REAL("BRL", "R$")

// Múltiplos argumentos
NOTEBOOK("Notebook", 3000.0, "Eletrônicos", true)

// Múltiplas linhas
VENDAS(
    "Relatório de Vendas",
    "Exibe vendas do mês",
    Arrays.asList("data", "valor")
)
```

**Tipos**:

```java
// String
ATIVO("Ativo")

// int
ALTA(3)

// double
PRECO(99.90)

// boolean
ENABLED(true)

// Array
ADMIN(new String[]{"ler", "escrever"})

// List
COLUNAS(Arrays.asList("id", "nome"))

// Expressão
AREA(Math.PI * 10 * 10)
```

**Regra de Ouro**: Sintaxe **CONSTANTE(args)** passa argumentos ao construtor. Argumentos entre **parênteses**, separados por **vírgula**. **Ordem** e **tipo** devem corresponder ao construtor. Sem argumentos: **CONSTANTE** (sem parênteses). **Quebrar linha** para múltiplos argumentos. Pode usar **expressões**, **constantes**, **arrays**, **collections**.
