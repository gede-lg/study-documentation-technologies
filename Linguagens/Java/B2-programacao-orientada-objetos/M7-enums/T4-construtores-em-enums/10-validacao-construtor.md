# T4.10 - Validação no Construtor

## Introdução

**Validação no construtor**: verificar argumentos antes de atribuir.

```java
public enum Percentual {
    P10(10),
    P50(50),
    P100(100);
    
    private final int valor;
    
    Percentual(int valor) {
        if (valor < 0 || valor > 100) {
            throw new IllegalArgumentException("Percentual inválido: " + valor);
        }
        this.valor = valor;
    }
    
    public int getValor() {
        return valor;
    }
}
```

**Construtor**: validar antes de inicializar atributos.

---

## Fundamentos

### 1. Validação de Range

```java
public enum Prioridade {
    BAIXA(1),
    MEDIA(5),
    ALTA(10);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        if (nivel < 1 || nivel > 10) {
            throw new IllegalArgumentException("Nível deve estar entre 1 e 10");
        }
        this.nivel = nivel;
    }
    
    public int getNivel() {
        return nivel;
    }
}
```

### 2. Validação de Null

```java
public enum Status {
    ATIVO("Ativo", 1),
    INATIVO("Inativo", 0);
    
    private final String descricao;
    private final int codigo;
    
    Status(String descricao, int codigo) {
        if (descricao == null || descricao.isEmpty()) {
            throw new IllegalArgumentException("Descrição não pode ser nula ou vazia");
        }
        this.descricao = descricao;
        this.codigo = codigo;
    }
}
```

### 3. Objects.requireNonNull()

```java
public enum Moeda {
    REAL("BRL", "R$"),
    DOLAR("USD", "$");
    
    private final String codigo;
    private final String simbolo;
    
    Moeda(String codigo, String simbolo) {
        this.codigo = Objects.requireNonNull(codigo, "Código não pode ser nulo");
        this.simbolo = Objects.requireNonNull(simbolo, "Símbolo não pode ser nulo");
    }
}
```

### 4. Validação de String

```java
public enum Categoria {
    ELETRONICOS("Eletrônicos"),
    LIVROS("Livros");
    
    private final String nome;
    
    Categoria(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome inválido");
        }
        if (nome.length() > 50) {
            throw new IllegalArgumentException("Nome muito longo (máx 50 caracteres)");
        }
        this.nome = nome;
    }
}
```

### 5. Validação de Valor Positivo

```java
public enum Produto {
    NOTEBOOK("Notebook", 3000.0),
    MOUSE("Mouse", 150.0);
    
    private final String nome;
    private final double preco;
    
    Produto(String nome, double preco) {
        if (preco <= 0) {
            throw new IllegalArgumentException("Preço deve ser positivo");
        }
        this.nome = nome;
        this.preco = preco;
    }
}
```

### 6. Validação de Collection

```java
public enum Permissao {
    ADMIN(Arrays.asList("ler", "escrever", "deletar")),
    USER(Arrays.asList("ler", "escrever"));
    
    private final List<String> acoes;
    
    Permissao(List<String> acoes) {
        if (acoes == null || acoes.isEmpty()) {
            throw new IllegalArgumentException("Ações não podem ser vazias");
        }
        this.acoes = new ArrayList<>(acoes);
    }
}
```

### 7. Validação Customizada

```java
public enum Temperatura {
    FRIO(-10, 15),
    MODERADO(16, 25),
    QUENTE(26, 40);
    
    private final int min;
    private final int max;
    
    Temperatura(int min, int max) {
        if (min >= max) {
            throw new IllegalArgumentException("Min deve ser menor que max");
        }
        if (min < -50 || max > 50) {
            throw new IllegalArgumentException("Temperatura fora do range (-50 a 50)");
        }
        this.min = min;
        this.max = max;
    }
}
```

### 8. Validação com Regex

```java
public enum Contato {
    EMAIL("email@example.com"),
    TELEFONE("11-99999-9999");
    
    private final String valor;
    
    Contato(String valor) {
        if (valor == null || !valor.matches("^[a-zA-Z0-9@.\\-]+$")) {
            throw new IllegalArgumentException("Formato inválido: " + valor);
        }
        this.valor = valor;
    }
}
```

### 9. Validação Múltipla

```java
public enum Usuario {
    ADMIN("admin", "admin@example.com", 30);
    
    private final String nome;
    private final String email;
    private final int idade;
    
    Usuario(String nome, String email, int idade) {
        // Validar nome
        if (nome == null || nome.length() < 3) {
            throw new IllegalArgumentException("Nome deve ter pelo menos 3 caracteres");
        }
        
        // Validar email
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }
        
        // Validar idade
        if (idade < 0 || idade > 120) {
            throw new IllegalArgumentException("Idade inválida");
        }
        
        this.nome = nome;
        this.email = email;
        this.idade = idade;
    }
}
```

### 10. Validação com Mensagem Detalhada

```java
public enum HttpStatus {
    OK("OK", 200),
    NOT_FOUND("Not Found", 404);
    
    private final String mensagem;
    private final int codigo;
    
    HttpStatus(String mensagem, int codigo) {
        if (codigo < 100 || codigo > 599) {
            throw new IllegalArgumentException(
                String.format("Código HTTP inválido: %d (deve estar entre 100 e 599)", codigo)
            );
        }
        if (mensagem == null || mensagem.isEmpty()) {
            throw new IllegalArgumentException("Mensagem não pode ser vazia");
        }
        this.mensagem = mensagem;
        this.codigo = codigo;
    }
}
```

---

## Aplicabilidade

**Validação no construtor** para:
- Garantir integridade de dados
- Prevenir estados inválidos
- Fail-fast (detectar erros cedo)
- Documentar regras de negócio

---

## Armadilhas

### 1. Exceção ao Carregar Enum

```java
// ❌ Exceção ao carregar enum
public enum Status {
    ATIVO("Ativo", 1),
    INVALIDO("", 0); // ❌ Lança exceção
    
    private final String descricao;
    private final int codigo;
    
    Status(String descricao, int codigo) {
        if (descricao.isEmpty()) {
            throw new IllegalArgumentException("Descrição vazia");
        }
        this.descricao = descricao;
        this.codigo = codigo;
    }
}

// ExceptionInInitializerError ao carregar Status
```

### 2. Validação Muito Restritiva

```java
// ⚠️ Validação muito restritiva
Prioridade(int nivel) {
    if (nivel != 1 && nivel != 5 && nivel != 10) {
        throw new IllegalArgumentException("Nível inválido");
    }
    this.nivel = nivel;
}

// Dificulta adicionar novas constantes
```

### 3. Mensagem de Erro Vaga

```java
// ⚠️ Mensagem vaga
if (valor < 0 || valor > 100) {
    throw new IllegalArgumentException("Inválido"); // ⚠️ Vago
}

// ✅ Mensagem clara
throw new IllegalArgumentException(
    "Percentual deve estar entre 0 e 100, recebido: " + valor
);
```

---

## Boas Práticas

### 1. Validar Antes de Atribuir

```java
// ✅ Validar antes de atribuir
Prioridade(int nivel) {
    if (nivel < 1 || nivel > 10) {
        throw new IllegalArgumentException("Nível inválido");
    }
    this.nivel = nivel; // Atribuição após validação
}
```

### 2. Objects.requireNonNull()

```java
// ✅ Objects.requireNonNull() para null
Moeda(String codigo, String simbolo) {
    this.codigo = Objects.requireNonNull(codigo, "Código não pode ser nulo");
    this.simbolo = Objects.requireNonNull(simbolo, "Símbolo não pode ser nulo");
}
```

### 3. Mensagem Clara

```java
// ✅ Mensagem clara e informativa
if (preco <= 0) {
    throw new IllegalArgumentException(
        String.format("Preço deve ser positivo, recebido: %.2f", preco)
    );
}
```

### 4. Método de Validação

```java
// ✅ Método de validação reutilizável
Produto(String nome, double preco) {
    this.nome = validarNome(nome);
    this.preco = validarPreco(preco);
}

private static String validarNome(String nome) {
    if (nome == null || nome.trim().isEmpty()) {
        throw new IllegalArgumentException("Nome inválido");
    }
    return nome;
}

private static double validarPreco(double preco) {
    if (preco <= 0) {
        throw new IllegalArgumentException("Preço deve ser positivo");
    }
    return preco;
}
```

---

## Resumo

**Validação no construtor**:

```java
public enum Percentual {
    P10(10),
    P50(50);
    
    private final int valor;
    
    Percentual(int valor) {
        // Validar antes de atribuir
        if (valor < 0 || valor > 100) {
            throw new IllegalArgumentException("Inválido: " + valor);
        }
        this.valor = valor;
    }
}
```

**Tipos de validação**:

```java
// Range
if (nivel < 1 || nivel > 10) throw new IllegalArgumentException();

// Null
if (descricao == null) throw new IllegalArgumentException();

// Empty
if (nome.isEmpty()) throw new IllegalArgumentException();

// Positivo
if (preco <= 0) throw new IllegalArgumentException();

// Regex
if (!email.matches("^[a-zA-Z0-9@.]+$")) throw new IllegalArgumentException();

// Collection
if (acoes == null || acoes.isEmpty()) throw new IllegalArgumentException();
```

**Objects.requireNonNull()**:

```java
this.codigo = Objects.requireNonNull(codigo, "Código não pode ser nulo");
this.simbolo = Objects.requireNonNull(simbolo, "Símbolo não pode ser nulo");
```

**Mensagem clara**:

```java
// ✅ Mensagem detalhada
throw new IllegalArgumentException(
    String.format("Percentual deve estar entre 0 e 100, recebido: %d", valor)
);

// ❌ Mensagem vaga
throw new IllegalArgumentException("Inválido");
```

**Regra de Ouro**: **Validar** argumentos no construtor antes de atribuir. Use **IllegalArgumentException** para valores inválidos. **Objects.requireNonNull()** para null. Mensagem de erro **clara** e **informativa**. **Fail-fast**: detectar erros cedo. Método de validação **reutilizável**. Validação garante **integridade** dos dados.
