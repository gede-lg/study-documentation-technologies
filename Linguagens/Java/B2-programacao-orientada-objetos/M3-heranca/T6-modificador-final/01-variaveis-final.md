# T6.01 - Variáveis final

## Introdução

**final** em variáveis cria **constantes**.

**Valor não pode ser modificado** após inicialização.

**Deve ser inicializada**: na declaração, no construtor ou em bloco de inicialização.

```java
public class Configuracao {
    private final int MAX_CONEXOES = 10; // Inicializada na declaração
    
    public void alterar() {
        MAX_CONEXOES = 20; // ❌ Erro de compilação
    }
}
```

```java
public class Pessoa {
    private final String cpf;
    
    public Pessoa(String cpf) {
        this.cpf = cpf; // ✅ Inicializada no construtor
    }
    
    public void mudarCpf(String novoCpf) {
        this.cpf = novoCpf; // ❌ Erro de compilação
    }
}
```

---

## Fundamentos

### 1. Variável final Local

**Declarada em método**, deve ser inicializada antes do uso.

```java
public void metodo() {
    final int x = 10;
    x = 20; // ❌ Erro: variável final
}
```

### 2. Variável final de Instância

**Atributo de classe**, deve ser inicializada:
- Na declaração
- No construtor
- Em bloco de inicialização

```java
public class Pessoa {
    private final String cpf = "123.456.789-00"; // Declaração
    private final String nome;
    
    public Pessoa(String nome) {
        this.nome = nome; // Construtor
    }
}
```

### 3. Variável final Estática (Constante)

**Atributo de classe compartilhado**, convenção **MAIÚSCULAS**.

```java
public class Matematica {
    public static final double PI = 3.14159265359;
    public static final int MAX_VALOR = 100;
}

// Uso
double area = Matematica.PI * raio * raio;
```

### 4. Inicialização Obrigatória

**Variáveis final** devem ser inicializadas.

```java
// ❌ Erro: final sem inicialização
public class Exemplo {
    private final int valor; // Erro de compilação
}

// ✅ Correto
public class Exemplo {
    private final int valor = 10;
}
```

### 5. final com Objetos

**Referência** é constante, mas **objeto pode ser modificado**.

```java
public class Exemplo {
    private final List<String> nomes = new ArrayList<>();
    
    public void adicionar() {
        nomes.add("João"); // ✅ Permitido (modifica objeto)
        nomes = new ArrayList<>(); // ❌ Erro (modifica referência)
    }
}
```

### 6. final em Parâmetros

**Parâmetros de métodos** podem ser final.

```java
public void processar(final int valor) {
    valor = valor + 10; // ❌ Erro: parâmetro final
}

// ✅ Uso comum
public void processar(final String texto) {
    System.out.println(texto); // ✅ Leitura permitida
}
```

### 7. Blank Final Variables

**Variável final** sem inicialização na declaração.

```java
public class Pessoa {
    private final String cpf; // Blank final
    
    public Pessoa(String cpf) {
        this.cpf = cpf; // Inicializada no construtor
    }
}
```

Deve ser inicializada **em todos os construtores**.

### 8. final em Variáveis de Loop

**Effectively final** em loops.

```java
for (int i = 0; i < 10; i++) {
    final int valor = i * 2; // ✅ Nova variável a cada iteração
}

// Enhanced for
List<String> nomes = Arrays.asList("João", "Maria");
for (final String nome : nomes) { // ✅ Boa prática
    System.out.println(nome);
}
```

### 9. final vs Imutabilidade

**final** não garante **imutabilidade** de objetos.

```java
public class Pessoa {
    private final List<String> nomes = new ArrayList<>();
    
    public void adicionar(String nome) {
        nomes.add(nome); // ✅ Objeto é mutável
    }
}

// ✅ Imutabilidade real
public class Pessoa {
    private final List<String> nomes;
    
    public Pessoa(List<String> nomes) {
        this.nomes = Collections.unmodifiableList(new ArrayList<>(nomes));
    }
}
```

### 10. final com Primitivos vs Objetos

**Primitivos**: valor constante.

**Objetos**: referência constante (objeto pode mudar).

```java
// Primitivo
private final int idade = 30;
idade = 31; // ❌ Erro

// Objeto
private final StringBuilder sb = new StringBuilder("Java");
sb.append(" 17"); // ✅ Objeto muda
sb = new StringBuilder(); // ❌ Referência não muda
```

---

## Aplicabilidade

**Use final em variáveis quando**:
- Valor **não deve mudar** (constantes)
- **Segurança** em multithreading (visibility)
- **Documentar intenção** (código mais claro)
- **Prevenir bugs** (reatribuição acidental)

**Constantes de classe**:
```java
public static final String VERSAO = "1.0.0";
public static final int TIMEOUT = 5000;
```

**Configurações imutáveis**:
```java
private final String urlBanco;
private final int maxConexoes;
```

---

## Armadilhas

### 1. Esquecer de Inicializar

```java
public class Exemplo {
    private final int valor; // ❌ Erro de compilação
}

// ✅ Correto
public class Exemplo {
    private final int valor = 10;
}
```

### 2. final Não Garante Imutabilidade

```java
private final List<String> lista = new ArrayList<>();

public void adicionar() {
    lista.add("Item"); // ✅ Permitido
}
```

**Solução**: Use coleções imutáveis.

```java
private final List<String> lista = List.of("A", "B"); // Java 9+
```

### 3. Inicialização Parcial em Construtores

```java
public class Pessoa {
    private final String cpf;
    
    public Pessoa() {
        // ❌ Faltando inicializar cpf
    }
    
    public Pessoa(String cpf) {
        this.cpf = cpf; // ✅ Inicializado
    }
}
```

**Todos os construtores** devem inicializar final.

### 4. Confundir final com const (C++)

**Java**: final (variáveis, métodos, classes)

**C++**: const (valores constantes)

```java
// ❌ Não existe 'const' em Java
const int x = 10;

// ✅ Use final
final int x = 10;
```

### 5. Usar final em Tudo

```java
// ❌ Excesso de final (poluição)
public void metodo(final int a, final int b, final int c) {
    final int resultado = a + b + c;
    final String mensagem = "Resultado: " + resultado;
}
```

**Use final** com moderação.

### 6. final em Arrays

```java
private final int[] numeros = {1, 2, 3};

public void alterar() {
    numeros[0] = 10; // ✅ Permitido (conteúdo muda)
    numeros = new int[]{4, 5, 6}; // ❌ Erro (referência não muda)
}
```

---

## Boas Práticas

### 1. Constantes: static final + MAIÚSCULAS

```java
public static final double PI = 3.14159265359;
public static final String VERSAO = "1.0.0";
public static final int MAX_TENTATIVAS = 3;
```

### 2. Atributos Imutáveis: final

```java
public class Pessoa {
    private final String cpf;
    private final LocalDate dataNascimento;
    
    public Pessoa(String cpf, LocalDate dataNascimento) {
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
    }
}
```

### 3. Parâmetros de Métodos: final (Opcional)

```java
// Previne reatribuição acidental
public void processar(final String texto) {
    // texto = "outro"; // Erro
    System.out.println(texto);
}
```

### 4. Variáveis Locais: final Para Clareza

```java
public void calcular() {
    final int base = 100;
    final double taxa = 0.15;
    final double resultado = base * taxa;
}
```

### 5. Defensive Copying com final

```java
public class Pessoa {
    private final List<String> telefones;
    
    public Pessoa(List<String> telefones) {
        this.telefones = new ArrayList<>(telefones); // Cópia defensiva
    }
    
    public List<String> getTelefones() {
        return Collections.unmodifiableList(telefones);
    }
}
```

### 6. Evite final em Tudo

**Use** quando valor **não deve mudar**.

**Não use** por padrão em todas as variáveis.

### 7. Combine com Coleções Imutáveis

```java
// Java 9+
private final List<String> nomes = List.of("João", "Maria");

// Antes do Java 9
private final List<String> nomes = 
    Collections.unmodifiableList(Arrays.asList("João", "Maria"));
```

### 8. Documente Constantes

```java
/**
 * Tempo máximo de espera em milissegundos.
 */
public static final int TIMEOUT_MS = 5000;
```

### 9. Organize Constantes em Interface/Classe

```java
public interface Constantes {
    String VERSAO = "1.0.0";
    int MAX_CONEXOES = 10;
    double TAXA_PADRAO = 0.15;
}
```

---

## Resumo

**Variável final**:
```java
private final int valor = 10;
valor = 20; // ❌ Erro
```

**Constante de classe**:
```java
public static final double PI = 3.14159265359;
```

**Blank final**:
```java
private final String cpf;

public Pessoa(String cpf) {
    this.cpf = cpf; // Inicializada no construtor
}
```

**final com objetos**:
```java
private final List<String> lista = new ArrayList<>();
lista.add("Item"); // ✅ Objeto muda
lista = new ArrayList<>(); // ❌ Referência não muda
```

**Imutabilidade real**:
```java
private final List<String> lista = List.of("A", "B"); // Java 9+
```

**final em parâmetros**:
```java
public void metodo(final int valor) {
    valor = 10; // ❌ Erro
}
```

**final em loop**:
```java
for (final String nome : nomes) {
    System.out.println(nome);
}
```

**Constantes agrupadas**:
```java
public interface Config {
    String VERSAO = "1.0.0";
    int MAX_TENTATIVAS = 3;
    double TAXA = 0.15;
}
```

**Defensive copying**:
```java
public Pessoa(List<String> telefones) {
    this.telefones = new ArrayList<>(telefones);
}

public List<String> getTelefones() {
    return Collections.unmodifiableList(telefones);
}
```

**Regra de Ouro**: Use **final** para **constantes** e **atributos imutáveis**. **final em referências** não garante **imutabilidade do objeto**. Combine com **coleções imutáveis** para verdadeira imutabilidade.
