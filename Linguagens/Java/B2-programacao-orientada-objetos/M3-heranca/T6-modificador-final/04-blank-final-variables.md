# T6.04 - Blank Final Variables

## Introdução

**Blank final** é variável **final sem inicialização** na declaração.

**Deve ser inicializada**:
- No construtor (para atributos de instância)
- No bloco de inicialização estática (para atributos static)
- Antes do uso (para variáveis locais)

**Permite inicialização dinâmica** de constantes.

```java
public class Pessoa {
    private final String cpf; // Blank final
    
    public Pessoa(String cpf) {
        this.cpf = cpf; // Inicializada no construtor
    }
}
```

```java
public class Configuracao {
    private static final String AMBIENTE; // Blank final static
    
    static {
        AMBIENTE = System.getenv("ENV"); // Inicializada no bloco static
    }
}
```

---

## Fundamentos

### 1. Blank Final de Instância

**Atributo final** sem valor inicial.

```java
public class Pessoa {
    private final String nome; // Blank final
    
    public Pessoa(String nome) {
        this.nome = nome; // Deve inicializar no construtor
    }
}
```

### 2. Inicialização no Construtor

**Todos os construtores** devem inicializar blank finals.

```java
public class Produto {
    private final int codigo;
    
    public Produto(int codigo) {
        this.codigo = codigo; // ✅ Inicializado
    }
    
    public Produto() {
        // ❌ Erro: faltando inicializar codigo
    }
}
```

### 3. Inicialização Única

**Blank final** pode ser atribuída **apenas uma vez**.

```java
public class Exemplo {
    private final int valor;
    
    public Exemplo(int valor) {
        this.valor = valor;
        this.valor = valor + 10; // ❌ Erro: já inicializada
    }
}
```

### 4. Blank Final Static

**Atributo static final** sem valor inicial.

```java
public class Configuracao {
    private static final String URL; // Blank final static
    
    static {
        URL = carregarUrl(); // Inicializada no bloco static
    }
    
    private static String carregarUrl() {
        return "https://api.exemplo.com";
    }
}
```

### 5. Inicialização em Bloco de Inicialização

**Bloco de instância** pode inicializar blank finals.

```java
public class Exemplo {
    private final int valor;
    
    {
        valor = calcularValor(); // Inicializado no bloco de instância
    }
    
    private int calcularValor() {
        return 42;
    }
}
```

### 6. Blank Final vs Inicialização Inline

**Inline**: valor conhecido em tempo de compilação.

**Blank final**: valor calculado em runtime.

```java
// Inline
private final int MAX = 100;

// Blank final
private final int max;

public Configuracao(int max) {
    this.max = max; // Valor dinâmico
}
```

### 7. Blank Final Local

**Variável local final** sem inicialização.

```java
public void metodo(boolean condicao) {
    final int valor; // Blank final local
    
    if (condicao) {
        valor = 10;
    } else {
        valor = 20;
    }
    
    System.out.println(valor); // Deve estar inicializada antes do uso
}
```

### 8. Erro: Falta de Inicialização

```java
public class Exemplo {
    private final int valor; // ❌ Erro: não inicializada
}

// ✅ Correto
public class Exemplo {
    private final int valor;
    
    public Exemplo() {
        valor = 10; // Inicializada no construtor
    }
}
```

### 9. Inicialização Condicional

**Blank final** permite inicialização baseada em condição.

```java
public class Usuario {
    private final String tipo;
    
    public Usuario(int idade) {
        if (idade < 18) {
            tipo = "MENOR";
        } else {
            tipo = "ADULTO";
        }
    }
}
```

### 10. Múltiplos Construtores

**Todos os construtores** devem inicializar blank finals.

```java
public class Produto {
    private final int codigo;
    
    public Produto(int codigo) {
        this.codigo = codigo; // ✅
    }
    
    public Produto() {
        this(0); // ✅ Delega para outro construtor
    }
}
```

---

## Aplicabilidade

**Use blank final quando**:
- Valor é **calculado em runtime**
- Valor depende de **parâmetros do construtor**
- Valor depende de **configuração externa**
- Inicialização **complexa** requer lógica

**Exemplos**:
```java
// Valor de configuração externa
private static final String API_URL;
static {
    API_URL = System.getenv("API_URL");
}

// Valor calculado
private final LocalDateTime criadoEm;
public Entidade() {
    criadoEm = LocalDateTime.now();
}
```

---

## Armadilhas

### 1. Esquecer de Inicializar em Todos os Construtores

```java
public class Pessoa {
    private final String cpf;
    
    public Pessoa(String cpf) {
        this.cpf = cpf; // ✅
    }
    
    public Pessoa() {
        // ❌ Erro: faltando inicializar cpf
    }
}
```

### 2. Tentar Reatribuir

```java
public class Exemplo {
    private final int valor;
    
    public Exemplo(int valor) {
        this.valor = valor;
        this.valor = valor * 2; // ❌ Erro: já inicializada
    }
}
```

### 3. Inicialização Parcial

```java
public void metodo(boolean condicao) {
    final int valor;
    
    if (condicao) {
        valor = 10;
    }
    // ❌ Erro: valor pode não estar inicializada
    System.out.println(valor);
}

// ✅ Correto
public void metodo(boolean condicao) {
    final int valor;
    
    if (condicao) {
        valor = 10;
    } else {
        valor = 20;
    }
    
    System.out.println(valor); // ✅ Inicializada em todos os caminhos
}
```

### 4. Confundir com Variável Não Inicializada

```java
// ❌ Variável local não inicializada (erro)
int x;
System.out.println(x); // Erro

// ✅ Blank final (deve inicializar antes do uso)
final int x;
x = 10;
System.out.println(x);
```

### 5. Esquecer Bloco Static Para static final

```java
public class Config {
    private static final String URL; // ❌ Erro: não inicializada
}

// ✅ Correto
public class Config {
    private static final String URL;
    
    static {
        URL = "https://api.com";
    }
}
```

---

## Boas Práticas

### 1. Use Para Valores Dinâmicos

```java
public class Entidade {
    private final UUID id;
    private final LocalDateTime criadoEm;
    
    public Entidade() {
        this.id = UUID.randomUUID();
        this.criadoEm = LocalDateTime.now();
    }
}
```

### 2. Delegue Entre Construtores

```java
public class Produto {
    private final int codigo;
    private final String nome;
    
    public Produto(int codigo, String nome) {
        this.codigo = codigo;
        this.nome = nome;
    }
    
    public Produto(int codigo) {
        this(codigo, "Sem nome"); // ✅ Delega
    }
}
```

### 3. Use Bloco Static Para Configuração

```java
public class Configuracao {
    private static final String AMBIENTE;
    private static final int TIMEOUT;
    
    static {
        AMBIENTE = System.getenv("AMBIENTE");
        TIMEOUT = Integer.parseInt(System.getenv("TIMEOUT"));
    }
}
```

### 4. Valide no Construtor

```java
public class Pessoa {
    private final String cpf;
    
    public Pessoa(String cpf) {
        if (cpf == null || cpf.isBlank()) {
            throw new IllegalArgumentException("CPF inválido");
        }
        this.cpf = cpf;
    }
}
```

### 5. Inicialize em Bloco Para Lógica Complexa

```java
public class Configuracao {
    private final Map<String, String> propriedades;
    
    {
        propriedades = new HashMap<>();
        propriedades.put("ambiente", System.getenv("ENV"));
        propriedades.put("versao", "1.0.0");
    }
}
```

### 6. Documente Razão do Blank Final

```java
/**
 * ID gerado automaticamente no construtor.
 */
private final UUID id;

public Entidade() {
    this.id = UUID.randomUUID();
}
```

### 7. Use Para Imutabilidade Condicional

```java
public class Usuario {
    private final String tipo;
    
    public Usuario(int idade) {
        this.tipo = idade >= 18 ? "ADULTO" : "MENOR";
    }
}
```

### 8. Combine com Defensive Copying

```java
public class Pessoa {
    private final List<String> telefones;
    
    public Pessoa(List<String> telefones) {
        this.telefones = new ArrayList<>(telefones); // Cópia defensiva
    }
}
```

### 9. Evite Lógica Complexa no Construtor

```java
// ❌ Lógica complexa no construtor
public Configuracao() {
    this.valor = calcularValorComplexo();
}

// ✅ Use método privado
public Configuracao() {
    this.valor = inicializarValor();
}

private int inicializarValor() {
    // Lógica complexa
    return 42;
}
```

---

## Resumo

**Blank final**:
```java
private final int valor; // Sem inicialização

public Exemplo(int valor) {
    this.valor = valor; // Inicializada no construtor
}
```

**Blank final static**:
```java
private static final String URL;

static {
    URL = "https://api.com";
}
```

**Inicialização em bloco**:
```java
private final int valor;

{
    valor = calcularValor();
}
```

**Inicialização condicional**:
```java
private final String tipo;

public Usuario(int idade) {
    if (idade >= 18) {
        tipo = "ADULTO";
    } else {
        tipo = "MENOR";
    }
}
```

**Múltiplos construtores**:
```java
private final int codigo;

public Produto(int codigo) {
    this.codigo = codigo;
}

public Produto() {
    this(0); // Delega
}
```

**Blank final local**:
```java
final int valor;

if (condicao) {
    valor = 10;
} else {
    valor = 20;
}

System.out.println(valor); // Inicializada em todos os caminhos
```

**Erro: falta inicialização**:
```java
private final int valor; // ❌ Erro

public Exemplo() {
    // Faltando inicializar valor
}
```

**Valores dinâmicos**:
```java
private final UUID id;
private final LocalDateTime criadoEm;

public Entidade() {
    this.id = UUID.randomUUID();
    this.criadoEm = LocalDateTime.now();
}
```

**Regra de Ouro**: **Blank final** permite **inicialização dinâmica** de constantes. **Todos os construtores** devem inicializar. **Apenas uma atribuição** permitida. Use para **valores calculados em runtime**.
