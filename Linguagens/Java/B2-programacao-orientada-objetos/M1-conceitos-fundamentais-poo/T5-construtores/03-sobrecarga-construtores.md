# Sobrecarga de Construtores

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Sobrecarga de construtores** (constructor overloading) é capacidade de uma classe ter múltiplos construtores com **assinaturas diferentes** (número ou tipo de parâmetros distintos), permitindo que objetos sejam criados de formas variadas conforme contexto. Conceitualmente, sobrecarga oferece "múltiplas portas de entrada" para criação do objeto - cada construtor é caminho diferente para chegar ao mesmo destino (objeto válido).

É aplicação do princípio de sobrecarga (overloading) especificamente a construtores: mesmo nome (nome da classe), comportamentos diferentes baseados em parâmetros. `new Pessoa("Alice")` vs `new Pessoa("Alice", 30)` vs `new Pessoa("Alice", 30, "alice@mail.com")` - três construtores, três níveis de detalhe na inicialização.

Propósito é **flexibilidade** - permitir que objetos sejam criados com informações mínimas (padrões para o resto) ou máximas (tudo especificado). ArrayList tem `new ArrayList()` (capacidade padrão) e `new ArrayList(100)` (capacidade custom) - sobrecarga elimina necessidade de múltiplas classes para variações de inicialização.

### Contexto Histórico e Motivação

Sobrecarga vem de linguagens procedurais (Ada, anos 1980) e foi refinada em C++ (sobrecarga de funções e operadores). Java herdou sobrecarga de métodos/construtores mas removeu sobrecarga de operadores (decisão de simplicidade). Desde Java 1.0, sobrecarga é mecanismo central de API design.

**Motivação:** API conveniente sem explosão de nomes. Sem sobrecarga, seria necessário `criarPessoaComNome()`, `criarPessoaComNomeEIdade()`, `criarPessoaCompleta()` - poluição de namespace. Sobrecarga unifica em único conceito: `new Pessoa(...)` com variações.

Classes Java fundamentais usam extensivamente: `String` tem 13+ construtores, `BigDecimal` tem 8+, `ArrayList` tem 3. Padrão estabelecido que boas APIs oferecem construtores sobrecarregados para casos comuns.

### Problema Fundamental que Resolve

**Problema:** Sem sobrecarga, criar objeto com diferentes conjuntos de dados exige compromisso:

```java
// Opção 1: Construtor com TODOS parâmetros (verboso)
class Produto {
    public Produto(String codigo, String nome, String descricao,
                   double preco, int estoque, String categoria) { ... }
}

Produto p = new Produto("P001", "Mouse", "", 25.90, 0, "");
// Tediosa - precisa fornecer até campos opcionais

// Opção 2: Construtor mínimo + setters (objeto temporariamente inválido)
class Produto {
    public Produto(String codigo) { ... }
    public void setNome(String nome) { ... }
    // ...
}

Produto p = new Produto("P001");
p.setNome("Mouse");  // Entre criação e aqui, objeto incompleto
p.setPreco(25.90);
```

**Solução:** Sobrecarga oferece múltiplas formas de inicialização:

```java
class Produto {
    private String codigo;
    private String nome;
    private String descricao;
    private double preco;
    private int estoque;

    // Mínimo obrigatório
    public Produto(String codigo, String nome, double preco) {
        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
        this.descricao = "";
        this.estoque = 0;
    }

    // Com estoque
    public Produto(String codigo, String nome, double preco, int estoque) {
        this(codigo, nome, preco);  // Reutiliza construtor anterior
        this.estoque = estoque;
    }

    // Completo
    public Produto(String codigo, String nome, String descricao,
                   double preco, int estoque) {
        this.codigo = codigo;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.estoque = estoque;
    }
}

// Flexibilidade:
Produto p1 = new Produto("P001", "Mouse", 25.90);
Produto p2 = new Produto("P002", "Teclado", 89.90, 50);
Produto p3 = new Produto("P003", "Monitor", "Full HD", 799.90, 10);
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Assinatura Única:**
   - Cada construtor deve ter assinatura diferente
   - Assinatura = número + tipo + ordem dos parâmetros
   - Nome é sempre igual (nome da classe)

2. **Resolução em Tempo de Compilação:**
   - Compilador escolhe construtor baseado em argumentos
   - Matching exato de tipos (com conversões primitivas)
   - Erro de compilação se ambíguo

3. **Encadeamento Comum:**
   - Construtores sobrecarregados frequentemente delegam trabalho
   - `this(...)` chama outro construtor da mesma classe
   - Evita duplicação de código de inicialização

4. **Padrão de Design:**
   - Construtor mais simples → menos parâmetros, mais padrões
   - Construtor mais complexo → mais parâmetros, menos padrões
   - Construtores intermediários entre extremos

5. **Trade-off:**
   - Flexibilidade vs complexidade da API
   - Muitos construtores = confusão (considerar Builder Pattern)
   - Poucos construtores = menos conveniente

### Pilares Fundamentais

- **Múltiplos Construtores:** Mesmo nome, assinaturas diferentes
- **Assinatura:** Número + tipo + ordem de parâmetros
- **Resolução:** Compilador escolhe baseado em argumentos
- **Encadeamento:** `this(...)` para reutilização
- **Conveniência:** Oferecer opções comuns de criação

---

## 🧠 Fundamentos Teóricos

### Definição de Assinatura

**Assinatura do construtor** = número de parâmetros + tipo de cada parâmetro + ordem dos parâmetros.

```java
class Exemplo {
    // Assinatura 1: ()
    public Exemplo() { }

    // Assinatura 2: (int)
    public Exemplo(int x) { }

    // Assinatura 3: (String)
    public Exemplo(String s) { }

    // Assinatura 4: (int, String)
    public Exemplo(int x, String s) { }

    // Assinatura 5: (String, int) - DIFERENTE de (int, String)
    public Exemplo(String s, int x) { }

    // ❌ ERRO - assinatura duplicada com assinatura 2
    // public Exemplo(int y) { }  // Número e tipo iguais!
}
```

**Nome de parâmetro não importa:**
```java
public Exemplo(int x) { }
public Exemplo(int y) { }  // ❌ ERRO - mesma assinatura (int)
```

### Resolução de Sobrecarga

Compilador escolhe construtor em tempo de compilação baseado em tipos dos argumentos:

```java
class Numero {
    public Numero(int valor) {
        System.out.println("int: " + valor);
    }

    public Numero(double valor) {
        System.out.println("double: " + valor);
    }

    public Numero(String valor) {
        System.out.println("String: " + valor);
    }
}

// Chamadas:
Numero n1 = new Numero(10);      // int: 10
Numero n2 = new Numero(10.5);    // double: 10.5
Numero n3 = new Numero("dez");   // String: dez
```

#### Conversões Automáticas

```java
class Conversao {
    public Conversao(int x) {
        System.out.println("int");
    }

    public Conversao(long x) {
        System.out.println("long");
    }
}

byte b = 10;
short s = 20;
int i = 30;
long l = 40;

new Conversao(b);  // int (byte → int, widening)
new Conversao(s);  // int (short → int, widening)
new Conversao(i);  // int (match exato)
new Conversao(l);  // long (match exato)
```

#### Ambiguidade

```java
class Ambiguo {
    public Ambiguo(int x, double y) { }
    public Ambiguo(double x, int y) { }
}

new Ambiguo(10, 20.5);    // ✅ OK - (int, double)
new Ambiguo(10.5, 20);    // ✅ OK - (double, int)
// new Ambiguo(10, 20);   // ❌ ERRO - ambíguo! Ambos aceitam (int, int) com conversão
```

---

## 🔍 Análise Conceitual Profunda

### Padrões de Sobrecarga

#### 1. Construtor Telescópico

Construtores vão acumulando parâmetros:

```java
class Pessoa {
    private String nome;
    private int idade;
    private String email;
    private String telefone;

    public Pessoa(String nome) {
        this(nome, 0);
    }

    public Pessoa(String nome, int idade) {
        this(nome, idade, null);
    }

    public Pessoa(String nome, int idade, String email) {
        this(nome, idade, email, null);
    }

    public Pessoa(String nome, int idade, String email, String telefone) {
        this.nome = nome;
        this.idade = idade;
        this.email = email;
        this.telefone = telefone;
    }
}
```

**Vantagem:** Reutilização via `this()`.
**Desvantagem:** Explosão de construtores (N parâmetros = até N construtores).

#### 2. Construtor com Variações Semânticas

Diferentes formas de expressar mesma informação:

```java
class Temperatura {
    private double kelvin;

    // A partir de Celsius
    public Temperatura(double celsius) {
        this.kelvin = celsius + 273.15;
    }

    // A partir de Fahrenheit
    public static Temperatura fromFahrenheit(double fahrenheit) {
        double celsius = (fahrenheit - 32) * 5/9;
        return new Temperatura(celsius);
    }

    // A partir de Kelvin
    public static Temperatura fromKelvin(double kelvin) {
        Temperatura t = new Temperatura(0);  // Dummy
        t.kelvin = kelvin;
        return t;
    }
}

// Uso:
Temperatura t1 = new Temperatura(25);                      // Celsius
Temperatura t2 = Temperatura.fromFahrenheit(77);           // Fahrenheit
Temperatura t3 = Temperatura.fromKelvin(298.15);           // Kelvin
```

**Nota:** Quando tipos são iguais mas significados diferentes, use factory methods nomeados em vez de construtores sobrecarregados.

#### 3. Construtor com Parâmetros Opcionais

```java
class Livro {
    private String titulo;
    private String autor;
    private int ano;
    private String isbn;

    // Obrigatórios
    public Livro(String titulo, String autor) {
        this(titulo, autor, 0, null);
    }

    // Com ano
    public Livro(String titulo, String autor, int ano) {
        this(titulo, autor, ano, null);
    }

    // Completo
    public Livro(String titulo, String autor, int ano, String isbn) {
        this.titulo = titulo;
        this.autor = autor;
        this.ano = ano;
        this.isbn = isbn;
    }
}
```

#### 4. Construtor de Cópia

```java
class Ponto {
    private int x;
    private int y;

    // Construtor normal
    public Ponto(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // Construtor de cópia
    public Ponto(Ponto outro) {
        this(outro.x, outro.y);  // Copia coordenadas
    }
}

// Uso:
Ponto p1 = new Ponto(10, 20);
Ponto p2 = new Ponto(p1);  // Cópia de p1
```

### Encadeamento com `this()`

Construtores sobrecarregados frequentemente delegam:

```java
class Retangulo {
    private int largura;
    private int altura;

    // Construtor padrão → delega para (1, 1)
    public Retangulo() {
        this(1, 1);
    }

    // Construtor quadrado → delega para (lado, lado)
    public Retangulo(int lado) {
        this(lado, lado);
    }

    // Construtor completo (mestre)
    public Retangulo(int largura, int altura) {
        if (largura <= 0 || altura <= 0) {
            throw new IllegalArgumentException("Dimensões inválidas");
        }
        this.largura = largura;
        this.altura = altura;
    }
}

// Uso:
Retangulo r1 = new Retangulo();        // 1x1
Retangulo r2 = new Retangulo(5);       // 5x5 (quadrado)
Retangulo r3 = new Retangulo(10, 20);  // 10x20
```

**Vantagem:** Validação centralizada no construtor "mestre", outros apenas delegam.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Sobrecarga

✅ **Use sobrecarga quando:**

1. **Múltiplas Formas Naturais de Criação:**
   ```java
   class Data {
       public Data(int ano, int mes, int dia) { }
       public Data(long timestamp) { }
       public Data(String dataFormatada) { }
   }
   ```

2. **Parâmetros Opcionais:**
   ```java
   class Email {
       public Email(String destinatario) { }
       public Email(String destinatario, String assunto) { }
       public Email(String destinatario, String assunto, List<Anexo> anexos) { }
   }
   ```

3. **Diferentes Níveis de Detalhe:**
   ```java
   class Conexao {
       public Conexao(String url) { }  // Padrões para timeout, pool
       public Conexao(String url, int timeout) { }
       public Conexao(String url, int timeout, int poolSize) { }
   }
   ```

### Quando Evitar Sobrecarga

❌ **Evite sobrecarga quando:**

1. **Muitos Construtores (>4-5):**
   ```java
   // ❌ RUIM - explosão de combinações
   class Pessoa {
       public Pessoa(String nome) { }
       public Pessoa(String nome, int idade) { }
       public Pessoa(String nome, String email) { }
       public Pessoa(String nome, int idade, String email) { }
       public Pessoa(String nome, int idade, String email, String telefone) { }
       // ...10+ construtores
   }

   // ✅ MELHOR - Builder Pattern
   Pessoa p = Pessoa.builder()
       .nome("Alice")
       .idade(30)
       .email("alice@mail.com")
       .build();
   ```

2. **Parâmetros do Mesmo Tipo mas Significados Diferentes:**
   ```java
   // ❌ CONFUSO
   class Retangulo {
       public Retangulo(int largura, int altura) { }
       public Retangulo(int x, int y) { }  // ❌ ERRO - mesma assinatura!
   }

   // ✅ MELHOR - Factory methods
   class Retangulo {
       private Retangulo(int largura, int altura) { }

       public static Retangulo comDimensoes(int largura, int altura) { ... }
       public static Retangulo naPosicao(int x, int y) { ... }
   }
   ```

3. **Lógica de Inicialização Muito Diferente:**
   ```java
   // ❌ RUIM - construtores fazem coisas muito diferentes
   class Usuario {
       public Usuario(String nome) {
           // Cria usuário novo
       }

       public Usuario(int id) {
           // Carrega usuário do banco de dados
       }
   }

   // ✅ MELHOR - métodos estáticos descritivos
   class Usuario {
       private Usuario() { }

       public static Usuario novo(String nome) { ... }
       public static Usuario carregar(int id) { ... }
   }
   ```

---

## ⚠️ Limitações e Considerações

### Não Pode Diferenciar Apenas por Tipo de Retorno

```java
// ❌ ERRO - construtores não têm tipo de retorno
class Teste {
    public Teste() { }
    public String Teste() { }  // ❌ Isso é método, não construtor!
}
```

### Ambiguidade com Autoboxing/Unboxing

```java
class Numero {
    public Numero(Integer valor) {
        System.out.println("Integer");
    }

    public Numero(int valor) {
        System.out.println("int");
    }
}

Numero n1 = new Numero(10);           // int (match exato)
Numero n2 = new Numero(Integer.valueOf(10));  // Integer (match exato)

Integer i = 20;
Numero n3 = new Numero(i);            // Integer (sem unboxing desnecessário)
```

### Varargs e Ambiguidade

```java
class Ambiguo {
    public Ambiguo(String... args) {
        System.out.println("varargs");
    }

    public Ambiguo(String s1, String s2) {
        System.out.println("dois Strings");
    }
}

new Ambiguo("a", "b");  // dois Strings (específico tem prioridade)
new Ambiguo("a", "b", "c");  // varargs
new Ambiguo();  // varargs (array vazio)
```

---

## 🔗 Interconexões Conceituais

### Relação com Encadeamento (`this()`)

Sobrecarga + encadeamento = padrão poderoso de reutilização:

```java
class Produto {
    private String codigo;
    private String nome;
    private double preco;
    private int estoque;

    public Produto(String codigo, String nome, double preco) {
        this(codigo, nome, preco, 0);  // Delega
    }

    public Produto(String codigo, String nome, double preco, int estoque) {
        // Construtor mestre - validação centralizada
        if (preco < 0) throw new IllegalArgumentException();
        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }
}
```

### Relação com Factory Methods

Quando construtores não bastam, factory methods complementam:

```java
class LocalDate {
    private int year, month, day;

    private LocalDate(int year, int month, int day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    // Factory methods nomeados
    public static LocalDate of(int year, int month, int day) { ... }
    public static LocalDate now() { ... }
    public static LocalDate parse(String text) { ... }
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **Encadeamento de Construtores (`this()`):** Reuso entre construtores sobrecarregados
- **Builder Pattern:** Alternativa para muitos parâmetros
- **Factory Methods:** Construtores nomeados via métodos estáticos
- **Telescoping Constructor Anti-Pattern:** Problema resolvido por Builder
- **Records (Java 14+):** Construtores gerados automaticamente

---

## 📚 Conclusão

Sobrecarga de construtores permite que classe tenha múltiplos construtores com assinaturas diferentes (número/tipo/ordem de parâmetros), oferecendo flexibilidade na criação de objetos - cada construtor é forma diferente de inicializar objeto conforme contexto.

Dominar sobrecarga de construtores significa:
- Criar múltiplos construtores com assinaturas únicas (diferentes em número, tipo ou ordem de parâmetros)
- Entender que nome de parâmetro não importa, apenas tipo importa para assinatura
- Compilador resolve qual construtor chamar baseado em tipos dos argumentos (tempo de compilação)
- Usar encadeamento (`this()`) para evitar duplicação - construtores simples delegam para complexos
- Oferecer construtores para casos comuns (padrão, mínimo, completo)
- Evitar muitos construtores (>4-5) - considerar Builder Pattern
- Factory methods nomeados quando parâmetros têm mesmo tipo mas significados diferentes
- Construtor de cópia (`public Classe(Classe outro)`) para clonar objetos
- Validação centralizada no construtor "mestre" que outros delegam
- Ambiguidade causa erro de compilação - cada chamada deve ter match único

Sobrecarga é ferramenta de conveniência API - `new ArrayList()` vs `new ArrayList(100)` oferece escolha sem nomes diferentes (`newArrayListWithCapacity`). Padrão telescópico (`this()` cascata) centraliza lógica. Mas excesso de construtores confunde - Builder Pattern resolve quando parâmetros explodem. Sobrecarga diz "há múltiplas formas sensatas de criar este objeto", não "aqui estão todas combinações possíveis de parâmetros". Boas APIs oferecem 2-4 construtores cobrindo casos 80% mais comuns, não 20 construtores cobrindo 100% das possibilidades.
