# Construtor Padrão vs Construtores Parametrizados

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Construtor padrão** (default constructor) é construtor sem parâmetros, que Java gera automaticamente se nenhum construtor for declarado explicitamente, ou que desenvolvedor declara explicitamente sem parâmetros. **Construtores parametrizados** são construtores que recebem argumentos, permitindo que objeto seja inicializado com valores específicos fornecidos no momento da criação.

Conceitualmente, construtor padrão é "criação genérica" - objeto nasce com valores padrão (inline, blocos, ou campos default). Construtor parametrizado é "criação customizada" - objeto nasce com estado específico determinado por argumentos. É diferença entre "criar pessoa qualquer" (`new Pessoa()`) vs "criar Alice de 30 anos" (`new Pessoa("Alice", 30)`).

Escolha entre padrão e parametrizado reflete design: construtor padrão sugere "objeto pode começar vazio/neutro", parametrizado sugere "objeto requer dados específicos para ser válido". `ArrayList` tem construtor padrão (lista vazia é válida), mas `URL` exige parametrizado (URL sem endereço não faz sentido).

### Contexto Histórico e Motivação

Java 1.0 (1996) introduziu construtor padrão automático para simplificar código - classes sem construtores explícitos poderiam ser instanciadas. Influência de Smalltalk (toda classe tem método `new` implícito) e reação ao C++ (onde esquecer construtor causava undefined behavior).

**Motivação para Construtor Padrão:**
- Simplicidade: Classes simples não precisam boilerplate
- Frameworks: JPA, Jackson, XML parsers exigem construtor sem parâmetros para instanciação via reflection
- Prototipagem: Desenvolvimento rápido sem validações complexas

**Motivação para Construtor Parametrizado:**
- Imutabilidade: Atributos `final` exigem inicialização no construtor
- Validação: Forçar que objetos nasçam válidos
- Clareza: API explícita sobre dados obrigatórios

### Problema Fundamental que Resolve

**Problema com Apenas Construtor Padrão:**

```java
// Objeto criado em estado inválido
class Usuario {
    private String nome;
    private String email;

    public Usuario() { }  // Construtor padrão

    // Setters necessários
    public void setNome(String nome) { this.nome = nome; }
    public void setEmail(String email) { this.email = email; }
}

// Uso problemático:
Usuario u = new Usuario();
// u.nome = null, u.email = null - INVÁLIDO!
u.login();  // NullPointerException - objeto não está pronto
// Desenvolvedor esqueceu de chamar setters
```

**Solução com Construtor Parametrizado:**

```java
class Usuario {
    private String nome;
    private String email;

    // Construtor parametrizado força fornecimento de dados
    public Usuario(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }
}

// Uso correto:
Usuario u = new Usuario("Alice", "alice@mail.com");
// Impossível criar usuário sem nome e email!
u.login();  // Seguro - objeto sempre válido
```

**Problema com Apenas Construtor Parametrizado:**

```java
class Configuracao {
    private int timeout;
    private boolean debug;

    // Apenas construtor parametrizado
    public Configuracao(int timeout, boolean debug) {
        this.timeout = timeout;
        this.debug = debug;
    }
}

// Uso verboso mesmo para valores padrão:
Configuracao cfg = new Configuracao(30, false);
// Tediosa quando maioria usa padrões
```

**Solução com Ambos:**

```java
class Configuracao {
    private int timeout;
    private boolean debug;

    // Construtor padrão (valores padrão)
    public Configuracao() {
        this(30, false);  // Delega para construtor parametrizado
    }

    // Construtor parametrizado (customização)
    public Configuracao(int timeout, boolean debug) {
        this.timeout = timeout;
        this.debug = debug;
    }
}

// Flexibilidade:
Configuracao cfg1 = new Configuracao();           // Usa padrões
Configuracao cfg2 = new Configuracao(60, true);   // Customizado
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Construtor Padrão Automático:**
   - Gerado por Java se nenhum construtor for declarado
   - Sem parâmetros, corpo vazio
   - Visibilidade igual à da classe
   - Desaparece se qualquer construtor for declarado

2. **Construtor Padrão Explícito:**
   - Desenvolvedor declara construtor sem parâmetros
   - Pode ter corpo com lógica de inicialização
   - Necessário se houver outros construtores e quiser manter sem parâmetros

3. **Construtor Parametrizado:**
   - Recebe argumentos para inicialização customizada
   - Permite validação de parâmetros
   - Força fornecimento de dados obrigatórios
   - Suporta sobrecarga (múltiplas versões com parâmetros diferentes)

4. **Trade-offs:**
   - Padrão: Conveniência vs risco de objetos inválidos
   - Parametrizado: Segurança vs verbosidade
   - Combinação: Flexibilidade vs complexidade

5. **Impacto no Design:**
   - Padrão sugere "objeto pode começar vazio"
   - Parametrizado comunica "dados obrigatórios"
   - Ausência de padrão força inicialização explícita

### Pilares Fundamentais

- **Construtor Padrão:** `public Classe() { }`
- **Construtor Parametrizado:** `public Classe(Tipo param) { }`
- **Geração Automática:** Apenas se nenhum construtor existir
- **Conveniência vs Segurança:** Padrão (fácil) vs Parametrizado (seguro)
- **Frameworks:** Muitos exigem construtor padrão (JPA, Jackson)

---

## 🧠 Fundamentos Teóricos

### Construtor Padrão: Geração Automática

#### Regra de Geração

```java
// Código fonte (sem construtores)
class Simples {
    int valor;
}

// Compilado (Java adiciona construtor padrão)
class Simples {
    int valor;

    // Gerado automaticamente pelo compilador
    public Simples() {
        // Corpo vazio
    }
}
```

**Características do Construtor Gerado:**
- **Sem parâmetros:** `()`
- **Corpo vazio:** `{ }`
- **Visibilidade:** Mesma da classe
  - Classe `public` → Construtor `public`
  - Classe package-private → Construtor package-private

#### Visibilidade Herdada

```java
// Classe pública
public class Publica {
    // Construtor gerado: public Publica() { }
}

// Classe package-private
class PackagePrivate {
    // Construtor gerado: PackagePrivate() { } (sem public)
}
```

### Construtor Padrão Explícito

Desenvolvedor declara construtor sem parâmetros com lógica customizada:

```java
class Contador {
    private int valor;

    // Construtor padrão EXPLÍCITO
    public Contador() {
        this.valor = 0;  // Inicialização explícita
        System.out.println("Contador criado");
    }
}
```

**Diferença:** Gerado automaticamente tem corpo vazio, explícito pode ter lógica.

### Perda do Construtor Padrão Automático

```java
// Sem construtores declarados - padrão existe
class Classe1 {
    int x;
}
Classe1 c1 = new Classe1();  // ✅ OK - construtor padrão automático

// Com construtor parametrizado - padrão desaparece
class Classe2 {
    int x;

    public Classe2(int x) {  // Declarou construtor
        this.x = x;
    }
}
Classe2 c2 = new Classe2();      // ❌ ERRO - construtor padrão NÃO existe
Classe2 c3 = new Classe2(10);    // ✅ OK

// Mantendo ambos explicitamente
class Classe3 {
    int x;

    public Classe3() {        // Padrão explícito
        this.x = 0;
    }

    public Classe3(int x) {   // Parametrizado
        this.x = x;
    }
}
Classe3 c4 = new Classe3();      // ✅ OK
Classe3 c5 = new Classe3(10);    // ✅ OK
```

**Regra de Ouro:** Declarar qualquer construtor elimina construtor padrão automático. Para manter ambos, declare explicitamente.

---

## 🔍 Análise Conceitual Profunda

### Construtor Parametrizado: Tipos e Padrões

#### Construtor com Parâmetros Obrigatórios

```java
class Pessoa {
    private String nome;  // Obrigatório
    private int idade;    // Obrigatório

    // Todos parâmetros obrigatórios
    public Pessoa(String nome, int idade) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException("Idade inválida");
        }
        this.nome = nome;
        this.idade = idade;
    }
}

// Uso:
Pessoa p = new Pessoa("Alice", 30);  // Obrigado a fornecer ambos
```

#### Construtor com Parâmetros Opcionais via Padrões

```java
class Email {
    private String destinatario;  // Obrigatório
    private String assunto;       // Opcional (padrão: "Sem assunto")
    private boolean urgente;      // Opcional (padrão: false)

    // Todos parâmetros
    public Email(String destinatario, String assunto, boolean urgente) {
        this.destinatario = destinatario;
        this.assunto = assunto;
        this.urgente = urgente;
    }

    // Apenas obrigatório (padrões para opcionais)
    public Email(String destinatario) {
        this(destinatario, "Sem assunto", false);  // Delega
    }

    // Destinatário e assunto (urgente padrão)
    public Email(String destinatario, String assunto) {
        this(destinatario, assunto, false);  // Delega
    }
}

// Uso:
Email e1 = new Email("alice@mail.com");
Email e2 = new Email("bob@mail.com", "Reunião");
Email e3 = new Email("carol@mail.com", "URGENTE", true);
```

### Quando Usar Cada Um

#### Use Construtor Padrão (Sem Parâmetros) Quando:

✅ **1. Valores Padrão São Suficientes:**

```java
class Carrinho {
    private List<Item> itens = new ArrayList<>();  // Inline fornece padrão

    public Carrinho() { }  // Carrinho vazio é válido
}
```

✅ **2. Frameworks Exigem (Reflection):**

```java
@Entity  // JPA
class Produto {
    @Id
    private Long id;
    private String nome;

    // Obrigatório para JPA (usa reflection)
    public Produto() { }

    // Para uso normal
    public Produto(String nome) {
        this.nome = nome;
    }
}
```

✅ **3. Builder Pattern:**

```java
class Pedido {
    private String cliente;
    private List<Item> itens;

    // Construtor padrão privado (apenas builder usa)
    private Pedido() {
        this.itens = new ArrayList<>();
    }

    public static PedidoBuilder builder() {
        return new PedidoBuilder();
    }
}
```

✅ **4. Objeto com Estado Mutável:**

```java
class Configuracao {
    private Map<String, String> propriedades = new HashMap<>();

    public Configuracao() { }  // Começa vazio, preenche com setters

    public void setPropriedade(String chave, String valor) {
        propriedades.put(chave, valor);
    }
}
```

#### Use Construtor Parametrizado Quando:

✅ **1. Atributos Obrigatórios (Não-Null):**

```java
class Usuario {
    private String email;  // Obrigatório

    public Usuario(String email) {
        if (email == null) throw new IllegalArgumentException();
        this.email = email;
    }
}
```

✅ **2. Atributos `final` (Imutabilidade):**

```java
class Ponto {
    private final int x;
    private final int y;

    // Atributos final DEVEM ser inicializados
    public Ponto(int x, int y) {
        this.x = x;
        this.y = y;
    }
}
```

✅ **3. Validação Necessária:**

```java
class CPF {
    private String numero;

    public CPF(String numero) {
        if (!validarCPF(numero)) {
            throw new IllegalArgumentException("CPF inválido");
        }
        this.numero = numero;
    }

    private boolean validarCPF(String numero) {
        // Lógica de validação
        return numero != null && numero.matches("\\d{11}");
    }
}
```

✅ **4. Dependências Externas:**

```java
class PedidoService {
    private PedidoRepository repository;  // Dependência obrigatória

    public PedidoService(PedidoRepository repository) {
        if (repository == null) throw new IllegalArgumentException();
        this.repository = repository;
    }
}
```

### Padrão: Construtor Padrão + Parametrizado

Oferecer ambos para flexibilidade:

```java
class Retangulo {
    private int largura;
    private int altura;

    // Construtor padrão - quadrado unitário
    public Retangulo() {
        this(1, 1);
    }

    // Construtor parametrizado - dimensões específicas
    public Retangulo(int largura, int altura) {
        if (largura <= 0 || altura <= 0) {
            throw new IllegalArgumentException("Dimensões devem ser positivas");
        }
        this.largura = largura;
        this.altura = altura;
    }
}

// Uso:
Retangulo r1 = new Retangulo();         // 1x1
Retangulo r2 = new Retangulo(10, 20);   // 10x20
```

### Construtor Padrão em Herança

#### Chamada Implícita de `super()`

```java
class Animal {
    private String especie;

    // Sem construtor padrão!
    public Animal(String especie) {
        this.especie = especie;
    }
}

class Cachorro extends Animal {
    // ❌ ERRO - Animal não tem construtor padrão
    public Cachorro() {
        // Implicitamente: super(); (não existe!)
    }

    // ✅ CORRETO - chama explicitamente super(String)
    public Cachorro(String nome) {
        super("Canino");  // Deve ser primeira linha
    }
}
```

**Regra:** Se superclasse não tem construtor padrão, subclasse DEVE chamar explicitamente `super(...)` com argumentos.

---

## 🎯 Aplicabilidade e Contextos

### Cenários Comuns

#### 1. Objetos de Valor Imutáveis

```java
// Sempre parametrizado - valores obrigatórios
class Moeda {
    private final double valor;
    private final String simbolo;

    public Moeda(double valor, String simbolo) {
        this.valor = valor;
        this.simbolo = simbolo;
    }

    // Sem construtor padrão - valores são essência do objeto
}
```

#### 2. Entidades JPA

```java
@Entity
class Cliente {
    @Id
    private Long id;
    private String nome;

    // Construtor padrão para JPA (protected/package-private OK)
    protected Cliente() { }

    // Construtor parametrizado para código de negócio
    public Cliente(String nome) {
        this.nome = nome;
    }
}
```

#### 3. Singleton

```java
class Configuracao {
    private static final Configuracao INSTANCIA = new Configuracao();

    // Construtor padrão PRIVADO - impede new
    private Configuracao() {
        // Inicialização
    }

    public static Configuracao getInstance() {
        return INSTANCIA;
    }
}
```

#### 4. Utility Classes

```java
class Matematica {
    // Construtor padrão PRIVADO - classe apenas com métodos static
    private Matematica() {
        throw new AssertionError("Não instanciável");
    }

    public static double raizQuadrada(double n) {
        return Math.sqrt(n);
    }
}
```

---

## ⚠️ Limitações e Considerações

### Telescoping Constructor Anti-Pattern

```java
// ❌ RUIM - muitos construtores sobrecarregados
class Pessoa {
    private String nome;
    private int idade;
    private String email;
    private String telefone;
    private String endereco;

    public Pessoa(String nome) { ... }
    public Pessoa(String nome, int idade) { ... }
    public Pessoa(String nome, int idade, String email) { ... }
    public Pessoa(String nome, int idade, String email, String telefone) { ... }
    public Pessoa(String nome, int idade, String email, String telefone, String endereco) { ... }
    // Explosão combinatória!
}
```

**Solução:** Builder Pattern

```java
class Pessoa {
    private String nome;
    private int idade;
    private String email;

    private Pessoa(PessoaBuilder builder) {
        this.nome = builder.nome;
        this.idade = builder.idade;
        this.email = builder.email;
    }

    public static PessoaBuilder builder() {
        return new PessoaBuilder();
    }

    public static class PessoaBuilder {
        private String nome;
        private int idade;
        private String email;

        public PessoaBuilder nome(String nome) {
            this.nome = nome;
            return this;
        }

        public PessoaBuilder idade(int idade) {
            this.idade = idade;
            return this;
        }

        public PessoaBuilder email(String email) {
            this.email = email;
            return this;
        }

        public Pessoa build() {
            return new Pessoa(this);
        }
    }
}

// Uso:
Pessoa p = Pessoa.builder()
    .nome("Alice")
    .idade(30)
    .email("alice@mail.com")
    .build();
```

### Ordem de Parâmetros

```java
// ❌ Confuso - muitos parâmetros do mesmo tipo
class Endereco {
    public Endereco(String rua, String numero, String bairro, String cidade, String estado, String cep) { ... }
}

Endereco e = new Endereco("Paulista", "1000", "Bela Vista", "São Paulo", "SP", "01310-100");
// Qual é qual? Fácil trocar ordem!

// ✅ Melhor - builder ou métodos com nomes claros
class Endereco {
    private Endereco() { }

    public static EnderecoBuilder builder() {
        return new EnderecoBuilder();
    }
}

Endereco e = Endereco.builder()
    .rua("Paulista")
    .numero("1000")
    .bairro("Bela Vista")
    .cidade("São Paulo")
    .estado("SP")
    .cep("01310-100")
    .build();
```

---

## 🔗 Interconexões Conceituais

### Relação com Sobrecarga

Múltiplos construtores = sobrecarga:

```java
class Produto {
    public Produto() { }                  // Padrão
    public Produto(String nome) { }       // 1 parâmetro
    public Produto(String nome, double preco) { }  // 2 parâmetros
    // Todos têm mesmo nome, assinaturas diferentes
}
```

### Relação com Encapsulamento

Construtor parametrizado permite validação centralizada:

```java
class Idade {
    private final int valor;

    public Idade(int valor) {
        if (valor < 0 || valor > 150) {
            throw new IllegalArgumentException();
        }
        this.valor = valor;  // Validado antes de atribuir
    }

    // Sem setter - imutável, validação apenas no construtor
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **Sobrecarga de Construtores:** Múltiplas versões com parâmetros diferentes
- **Encadeamento de Construtores (`this()`):** Reutilização entre construtores
- **Builder Pattern:** Alternativa para muitos parâmetros
- **Factory Methods:** Métodos estáticos para criação
- **Records (Java 14+):** Construtores gerados automaticamente

---

## 📚 Conclusão

Construtor padrão é construtor sem parâmetros (gerado automaticamente se nenhum construtor existir, ou declarado explicitamente), usado quando objeto pode começar com valores padrão. Construtor parametrizado recebe argumentos, força fornecimento de dados obrigatórios e permite validação, usado quando objeto requer valores específicos para ser válido.

Dominar a distinção significa:
- Entender que construtor padrão é gerado automaticamente APENAS se nenhum construtor for declarado
- Reconhecer que declarar qualquer construtor elimina construtor padrão automático
- Usar construtor padrão quando objeto pode começar vazio/neutro (ArrayList, HashMap)
- Usar construtor parametrizado quando valores são obrigatórios (URL, File, Ponto imutável)
- Declarar ambos explicitamente quando precisar de flexibilidade
- Validar parâmetros em construtores parametrizados antes de atribuir
- Frameworks (JPA, Jackson) exigem construtor padrão para reflection
- Atributos `final` exigem construtor parametrizado (devem ser inicializados)
- Construtor padrão privado impede instanciação (Singleton, Utility classes)
- Builder Pattern resolve "telescoping constructor" (muitos parâmetros)

Escolha entre padrão e parametrizado comunica design: `new ArrayList()` (padrão) vs `new URL(endereco)` (parametrizado) - primeiro aceita vazio, segundo exige dado. Padrão é conveniência, parametrizado é segurança. Combiná-los oferece flexibilidade: `new Retangulo()` (quadrado unitário) e `new Retangulo(10, 20)` (dimensões customizadas). Ausência de construtor padrão é declaração de intenção: "objeto não pode existir sem estes dados" - força desenvolvedor a fornecer argumentos, transformando validação de runtime (esqueceu setter) em compile-time (não compila sem argumentos).

