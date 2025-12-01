# Inicialização de Atributos

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Inicialização de atributos** é o processo de atribuir valores iniciais aos atributos de uma classe, garantindo que objetos comecem em estado válido e consistente. Conceitualmente, representa a configuração inicial da "memória" do objeto - transformar um objeto recém-criado (com valores padrão automáticos) em objeto com estado significativo.

Enquanto **declaração** define existência de atributo (`int idade;`), **inicialização** define primeiro valor real (`idade = 25;`). É diferença entre "pessoa tem idade" (declaração) e "pessoa tem 25 anos" (inicialização). Java permite inicialização em três momentos distintos: inline (na declaração), em blocos de inicialização, ou em construtores - cada abordagem com timing e propósito específicos.

Inicialização não é apenas atribuir valor - é garantir **invariante de classe** (estado sempre válido) desde momento de criação. Conta bancária não pode existir sem número, usuário sem ID - inicialização força objetos a nascerem completos.

### Contexto Histórico e Motivação

Linguagens antigas (C, Pascal) exigiam inicialização manual - variáveis não inicializadas tinham "lixo de memória" (valores aleatórios perigosos). Java, desde 1.0 (1996), fornece valores padrão automáticos (0, null, false) - segurança mínima. Mas valores padrão são raramente valores corretos - `saldo = 0.0` é ok para conta nova, mas `cliente = null` não é estado válido.

**Motivação:** Permitir que desenvolvedores especifiquem valores iniciais apropriados, garantindo objetos sempre começam em estado válido. Java oferece múltiplas formas de inicialização para diferentes cenários: inicialização inline para valores constantes, construtores para valores parametrizados, blocos para lógica complexa.

### Problema Fundamental que Resolve

**Problema:** Objetos recém-criados têm valores padrão, não valores semanticamente corretos:

```java
// Apenas valores padrão - objeto em estado inválido
class Usuario {
    String nome;     // null (não queremos usuário sem nome!)
    String email;    // null (não queremos usuário sem email!)
    boolean ativo;   // false (talvez devesse ser true por padrão)
}

Usuario u = new Usuario();
// u.nome = null, u.email = null - estado inválido!
u.exibirPerfil();  // NullPointerException!
```

**Solução:** Inicialização garante estado válido desde criação:

```java
// Inicialização adequada
class Usuario {
    String nome;
    String email;
    boolean ativo = true;  // Inicialização inline

    // Construtor garante valores obrigatórios
    Usuario(String nome, String email) {
        this.nome = nome;
        this.email = email;
        // ativo já é true (inicialização inline)
    }
}

Usuario u = new Usuario("Alice", "alice@example.com");
// Objeto sempre válido - nunca pode ter nome/email null!
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Três Formas de Inicialização:**
   - **Inline:** `int contador = 0;` (na declaração)
   - **Bloco de Inicialização:** `{ contador = 0; }` (bloco anônimo)
   - **Construtor:** `Classe() { contador = 0; }` (método especial)

2. **Ordem de Execução Rígida:**
   - Valores padrão → Inicialização inline → Blocos de inicialização → Construtor
   - Para herança: Superclasse primeiro, depois subclasse

3. **Propósito de Cada Forma:**
   - Inline: Valores constantes simples
   - Blocos: Lógica complexa compartilhada entre construtores
   - Construtores: Valores parametrizados, validação

4. **Inicialização Static vs Instância:**
   - `static`: Ocorre uma vez quando classe é carregada
   - Instância: Ocorre toda vez que objeto é criado

5. **Garantia de Estado Válido:**
   - Inicialização evita objetos em estado inconsistente
   - Construtor é último ponto de validação antes objeto ser usável

### Pilares Fundamentais

- **Inicialização Inline:** Sintaxe `tipo atributo = valor;` executada antes de construtor
- **Blocos de Inicialização:** `{ código }` executados em ordem, antes de construtor
- **Construtores:** Método especial chamado com `new`, recebe parâmetros
- **Ordem de Execução:** Determinística e previsível (padrão → inline → bloco → construtor)
- **Static vs Instância:** Static executa uma vez, instância executa por objeto

---

## 🧠 Fundamentos Teóricos

### Três Formas de Inicialização

#### 1. Inicialização Inline (na Declaração)

Atributo recebe valor imediatamente na declaração:

```java
class Configuracao {
    // Inicialização inline com literais
    int timeout = 30;
    String prefixo = "LOG_";
    boolean debug = false;

    // Inicialização inline com expressões
    double taxa = 1.05 * 0.10;  // 0.105
    String versao = "v" + 2 + ".0";  // "v2.0"

    // Inicialização inline com construtores
    List<String> tags = new ArrayList<>();
    LocalDate hoje = LocalDate.now();
    UUID id = UUID.randomUUID();
}
```

**Quando Ocorre:** Antes de qualquer construtor executar, na ordem de declaração.

**Uso Típico:**
- Valores constantes: `boolean ativo = true;`
- Valores padrão universais: `int tentativas = 0;`
- Objetos imutáveis: `String prefixo = "USR_";`

#### 2. Blocos de Inicialização (Instance Initializers)

Bloco de código anônimo `{ }` em nível de classe:

```java
class BaseDados {
    Connection conexao;

    // Bloco de inicialização
    {
        try {
            conexao = DriverManager.getConnection("jdbc:mysql://localhost/db");
            System.out.println("Conexão estabelecida");
        } catch (SQLException e) {
            throw new RuntimeException("Falha ao conectar", e);
        }
    }
}
```

**Quando Ocorre:** Após inicialização inline, antes de construtor, na ordem de declaração.

**Uso Típico:**
- Lógica complexa não adequada para inline
- Código compartilhado entre múltiplos construtores
- Inicialização que lança exceções

#### 3. Construtores

Método especial sem tipo de retorno, mesmo nome da classe:

```java
class Produto {
    String nome;
    double preco;
    int estoque;

    // Construtor
    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
        this.estoque = 0;  // Valor padrão
    }

    // Sobrecarga de construtor
    Produto(String nome, double preco, int estoque) {
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }
}
```

**Quando Ocorre:** Por último, após inline e blocos.

**Uso Típico:**
- Valores parametrizados (vindos de argumentos)
- Validação de parâmetros
- Lógica específica por construtor

### Ordem de Execução Completa

#### Sem Herança

```java
class Exemplo {
    // 1️⃣ Valores padrão automáticos (JVM)
    int valor;      // 0
    String texto;   // null

    // 2️⃣ Inicialização inline
    int contador = 10;

    // 3️⃣ Bloco de inicialização
    {
        System.out.println("Bloco executado");
        contador += 5;  // Agora contador = 15
    }

    // 4️⃣ Construtor
    Exemplo() {
        System.out.println("Construtor executado");
        contador += 10;  // Agora contador = 25
    }
}

// Chamada:
Exemplo e = new Exemplo();
// Saída:
// Bloco executado
// Construtor executado
// e.contador = 25
```

**Ordem Exata:**
1. **JVM:** Aloca memória, preenche com valores padrão (0, null, false)
2. **Inline:** Executa inicializações inline na ordem de declaração
3. **Blocos:** Executa blocos de inicialização na ordem de aparição
4. **Construtor:** Executa corpo do construtor chamado

#### Com Herança

```java
class Mae {
    int x = 10;

    { System.out.println("Bloco Mae"); }

    Mae() { System.out.println("Construtor Mae"); }
}

class Filha extends Mae {
    int y = 20;

    { System.out.println("Bloco Filha"); }

    Filha() { System.out.println("Construtor Filha"); }
}

// Chamada:
Filha f = new Filha();
// Saída:
// Bloco Mae
// Construtor Mae
// Bloco Filha
// Construtor Filha
```

**Ordem com Herança:**
1. Valores padrão (toda hierarquia)
2. Inline superclasse → Blocos superclasse → Construtor superclasse
3. Inline subclasse → Blocos subclasse → Construtor subclasse

---

## 🔍 Análise Conceitual Profunda

### Inicialização Static vs Instância

#### Atributos Static

Inicializados uma única vez quando classe é carregada pela JVM:

```java
class Aplicacao {
    // Inicialização static inline
    static String versao = "1.0";

    // Bloco static
    static {
        System.out.println("Classe carregada");
        versao = versao + "-RELEASE";
    }

    // Atributo de instância
    int id;

    Aplicacao(int id) {
        this.id = id;
    }
}

// Primeira referência à classe:
Aplicacao app1 = new Aplicacao(1);
// Saída: "Classe carregada" (bloco static executa)

Aplicacao app2 = new Aplicacao(2);
// Sem saída (bloco static NÃO executa novamente)
```

**Timing:**
- **Static:** Uma vez, quando classe é carregada (lazy loading)
- **Instância:** Toda vez que `new` é chamado

#### Ordem Static vs Instância

```java
class Completo {
    // 1️⃣ Inicialização static inline
    static int total = 0;

    // 2️⃣ Bloco static
    static {
        System.out.println("Static executado");
        total = 10;
    }

    // 3️⃣ Inicialização instância inline (por objeto)
    int id = ++total;

    // 4️⃣ Bloco instância (por objeto)
    {
        System.out.println("Bloco instância");
    }

    // 5️⃣ Construtor (por objeto)
    Completo() {
        System.out.println("Construtor, id=" + id);
    }
}

// Chamada:
Completo c1 = new Completo();
// Saída:
// Static executado
// Bloco instância
// Construtor, id=11

Completo c2 = new Completo();
// Saída:
// Bloco instância
// Construtor, id=12
// (Static NÃO executa novamente!)
```

### Comparação das Três Formas

| Aspecto | Inline | Bloco de Inicialização | Construtor |
|---------|--------|------------------------|------------|
| **Sintaxe** | `int x = 10;` | `{ x = 10; }` | `Classe() { x = 10; }` |
| **Timing** | Antes de construtor | Antes de construtor | Por último |
| **Parâmetros** | Não (apenas literais/expressões) | Não | Sim (argumentos) |
| **Complexidade** | Simples (uma linha) | Complexa (múltiplas linhas) | Complexa + validação |
| **Uso Típico** | Valores constantes | Lógica compartilhada | Valores parametrizados |
| **Sobrecarga** | Não (único valor) | Não (executa sempre) | Sim (múltiplos construtores) |
| **Exceções** | Não tratadas | Try-catch permitido | Try-catch permitido |

### Escolhendo a Forma Adequada

#### Use Inicialização Inline Para:

✅ **Valores constantes simples:**
```java
class Usuario {
    boolean ativo = true;      // Todos usuários iniciam ativos
    int tentativas = 0;         // Contador inicial
    String papel = "GUEST";     // Papel padrão
}
```

✅ **Expressões simples:**
```java
class Config {
    double taxaComDesconto = 0.10 * 0.9;  // 9%
    String versaoCompleta = "App " + "v2.0";
}
```

✅ **Objetos imutáveis:**
```java
class Registro {
    LocalDateTime criacao = LocalDateTime.now();
    UUID uuid = UUID.randomUUID();
}
```

#### Use Blocos de Inicialização Para:

✅ **Lógica complexa compartilhada:**
```java
class BaseDados {
    Properties props;

    {
        // Código compartilhado entre todos construtores
        props = new Properties();
        try {
            props.load(new FileInputStream("config.properties"));
        } catch (IOException e) {
            props.setProperty("default", "value");
        }
    }

    BaseDados() { }
    BaseDados(String extra) { props.setProperty("extra", extra); }
}
```

✅ **Inicialização de coleções:**
```java
class Dados {
    Map<String, Integer> mapa;

    {
        mapa = new HashMap<>();
        mapa.put("um", 1);
        mapa.put("dois", 2);
        mapa.put("tres", 3);
    }
}
```

#### Use Construtores Para:

✅ **Valores parametrizados:**
```java
class Pessoa {
    String nome;
    int idade;

    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}
```

✅ **Validação de parâmetros:**
```java
class ContaBancaria {
    String numero;
    double saldo;

    ContaBancaria(String numero, double saldoInicial) {
        if (numero == null || numero.isEmpty()) {
            throw new IllegalArgumentException("Número inválido");
        }
        if (saldoInicial < 0) {
            throw new IllegalArgumentException("Saldo inicial negativo");
        }
        this.numero = numero;
        this.saldo = saldoInicial;
    }
}
```

✅ **Lógica específica por sobrecarga:**
```java
class Produto {
    String nome;
    double preco;
    String categoria;

    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = "GERAL";  // Padrão
    }

    Produto(String nome, double preco, String categoria) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;  // Específico
    }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Padrões de Inicialização Comuns

#### 1. Inicialização Defensiva

Garantir objetos sempre válidos:

```java
class Email {
    private String endereco;

    Email(String endereco) {
        if (endereco == null || !endereco.contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }
        this.endereco = endereco;
    }
}
```

#### 2. Valores Padrão Significativos

Inline para valores universais, construtor para exceções:

```java
class Pedido {
    String status = "PENDENTE";  // Inline (todos iniciam assim)
    LocalDateTime data = LocalDateTime.now();
    List<Item> itens = new ArrayList<>();

    Pedido() { }  // Usa padrões

    Pedido(String statusInicial) {
        this.status = statusInicial;  // Sobrescreve inline
    }
}
```

#### 3. Composição de Objetos

Inicializar objetos dependentes:

```java
class Carro {
    Motor motor;
    Bateria bateria;

    {
        // Bloco garante componentes sempre existem
        motor = new Motor();
        bateria = new Bateria();
    }

    Carro() { }

    Carro(int potenciaMotor) {
        motor = new Motor(potenciaMotor);  // Sobrescreve bloco
    }
}
```

### Casos Especiais

#### Atributos Final

Devem ser inicializados exatamente uma vez:

```java
class Config {
    // Inline
    final String versao = "1.0";

    // Construtor
    final String ambiente;

    Config(String ambiente) {
        this.ambiente = ambiente;  // Única inicialização
    }

    // Bloco
    final int codigo;
    {
        codigo = calcularCodigo();
    }
}
```

#### Referências Circulares

Cuidado com inicialização mútua:

```java
class A {
    B b = new B();  // Cria B
}

class B {
    A a = new A();  // Cria A, que cria B, que cria A... StackOverflowError!
}

// Solução: Inicialização tardia (lazy)
class ASafe {
    B b;

    B getB() {
        if (b == null) b = new B();
        return b;
    }
}
```

---

## ⚠️ Limitações e Considerações

### Shadowing em Construtores

```java
class Exemplo {
    int valor = 10;  // Inline

    Exemplo(int valor) {
        valor = valor;  // ❌ ERRO: atribui parâmetro a si mesmo!
        // Atributo permanece 10
    }

    // CORRETO:
    Exemplo(int valor) {
        this.valor = valor;  // ✅ Atributo recebe parâmetro
    }
}
```

### Exceções em Inicialização

```java
class Problema {
    String conteudo = lerArquivo();  // ❌ Checked exception não tratada!

    static String lerArquivo() throws IOException {
        return Files.readString(Path.of("config.txt"));
    }
}

// SOLUÇÃO 1: Bloco de inicialização com try-catch
class Solucao1 {
    String conteudo;

    {
        try {
            conteudo = Files.readString(Path.of("config.txt"));
        } catch (IOException e) {
            conteudo = "PADRAO";
        }
    }
}

// SOLUÇÃO 2: Construtor
class Solucao2 {
    String conteudo;

    Solucao2() throws IOException {
        conteudo = Files.readString(Path.of("config.txt"));
    }
}
```

### Ordem de Declaração Importa

```java
class Ordem {
    // Inline usa valor de outro inline
    int a = 10;
    int b = a + 5;  // ✅ OK - a já foi inicializado (15)

    int c = d + 1;  // ❌ ERRO - d ainda não foi inicializado!
    int d = 20;
}

// Bloco pode usar qualquer atributo (executado após todos inline)
class OrdemBloco {
    int x;
    int y;

    {
        x = 10;
        y = x + 5;  // ✅ OK - mesmo que y esteja declarado depois
    }
}
```

### NullPointerException em Inicialização

```java
class Perigo {
    String nome;
    int tamanho = nome.length();  // ❌ NullPointerException!
    // nome ainda é null (valor padrão)
}

// CORRETO:
class Seguro {
    String nome = "Padrão";  // Inline ordem correta
    int tamanho = nome.length();  // 6
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Construtores

Inicialização inline/blocos executam antes de construtores:

```java
class Timeline {
    int etapa = 1;  // 1️⃣ Inline

    { etapa++; }    // 2️⃣ Bloco (etapa = 2)

    Timeline() {
        etapa++;     // 3️⃣ Construtor (etapa = 3)
    }
}
```

### Relação com Encapsulamento

Construtores validam, inline fornece defaults:

```java
class SaldoSeguro {
    private double saldo = 0.0;  // Inline: padrão seguro

    SaldoSeguro(double saldoInicial) {
        // Construtor: validação
        if (saldoInicial < 0) {
            throw new IllegalArgumentException("Saldo negativo");
        }
        this.saldo = saldoInicial;
    }
}
```

### Relação com Herança

Superclasse inicializa antes de subclasse:

```java
class Animal {
    String tipo = "Animal";  // 1️⃣
    { System.out.println(tipo); }  // 2️⃣
}

class Cachorro extends Animal {
    String raca = "Labrador";  // 3️⃣
    { System.out.println(raca); }  // 4️⃣
}

// new Cachorro():
// Animal
// Labrador
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **Atributos Final:** Inicialização obrigatória, imutabilidade
- **Factory Methods:** Alternativa a construtores para inicialização complexa
- **Builder Pattern:** Inicialização fluente de objetos com muitos atributos
- **Dependency Injection:** Frameworks gerenciam inicialização
- **Lazy Initialization:** Adiar inicialização até primeiro uso

### Progressão Natural

1. **Declaração** → Define existência
2. **Valores Padrão** → Segurança mínima
3. **Inicialização** → Estado válido (tópico atual)
4. **Atributos Final** → Imutabilidade
5. **Construtor Complexo** → Builder Pattern

---

## 📚 Conclusão

Inicialização de atributos é processo de atribuir valores iniciais para garantir objetos começam em estado válido. Java oferece três formas - inline (`int x = 10;`), blocos de inicialização (`{ x = 10; }`), e construtores (`Classe() { x = 10; }`) - executadas em ordem fixa: valores padrão → inline → blocos → construtor.

Dominar inicialização significa:
- Usar inline para valores constantes simples: `boolean ativo = true;`
- Usar blocos para lógica complexa compartilhada entre construtores
- Usar construtores para valores parametrizados e validação
- Entender ordem de execução: inline primeiro, construtor último
- Diferenciar static (uma vez, classe) vs instância (por objeto)
- Usar `this.atributo` para resolver shadowing com parâmetros
- Tratar exceções em blocos ou construtores (não em inline)
- Garantir atributos final são inicializados exatamente uma vez
- Ordem de declaração importa para inicialização inline
- Evitar null dereferencing durante inicialização

Inicialização é ponte entre declaração (atributo existe) e uso (atributo tem valor válido). Não é opcional - Java força valores padrão, mas desenvolvedor deve fornecer valores corretos. Conta bancária com `saldo = 0` é inicializada, mas sem `numero` não é válida - construtor garante estado completo antes objeto ser usável. Inicialização apropriada é fundamento de programação defensiva e contratos de classe confiáveis.
