# Definição e Propósito de Construtores

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Construtor** é método especial de uma classe, invocado automaticamente no momento de instanciação de objeto com operador `new`, cuja responsabilidade é **inicializar estado do objeto recém-criado**, garantindo que objeto comece existência em estado válido e consistente. Conceitualmente, construtor é "cerimônia de nascimento" do objeto - enquanto `new` aloca memória e cria estrutura física, construtor configura valores iniciais e estabelece invariantes de classe.

É diferença entre objeto existir (alocação de memória) e objeto ser utilizável (estado válido). `new Pessoa()` cria espaço na heap, mas construtor `Pessoa()` define nome, idade, CPF - transformando memória vazia em pessoa real. Construtor não é método comum: não tem tipo de retorno (nem `void`), tem mesmo nome da classe, e executa exatamente uma vez por objeto.

Propósito fundamental é **garantir impossibilidade de criar objeto em estado inválido** - não pode existir `ContaBancaria` sem número de conta, `Usuario` sem ID, `Produto` sem código. Construtor força que argumentos obrigatórios sejam fornecidos no momento de criação, eliminando janela temporal onde objeto existe mas não está pronto.

### Contexto Histórico e Motivação

Conceito de construtor vem de Simula 67 (primeira linguagem OO, 1967) e foi refinado em C++ (1983) e Smalltalk. Java herdou construtor de C++, mas simplificou: sem destrutores (garbage collector cuida disso), sem construtores virtuais, sem construtor de cópia automático.

**Motivação Original:** Linguagens procedurais (C, Pascal) exigiam inicialização manual - desenvolvedores frequentemente esqueciam de inicializar variáveis, causando bugs. POO centralizou inicialização em construtor automático - impossível criar objeto sem executar código de inicialização.

```c
// C - inicialização manual (propenso a erros)
struct Pessoa pessoa;
pessoa.nome = "Alice";  // Desenvolvedor pode esquecer
pessoa.idade = 30;      // Código pode criar pessoa inválida

// Java - inicialização automática via construtor
Pessoa pessoa = new Pessoa("Alice", 30);  // Garante inicialização
```

Java Code Conventions (1997) estabeleceram que toda classe deve ter pelo menos um construtor (explícito ou padrão) para garantir objetos sempre inicializados.

### Problema Fundamental que Resolve

**Problema:** Objetos podem existir em estado inválido se inicialização for opcional:

```java
// SEM construtor adequado
class ContaBancaria {
    String numero;
    double saldo;
}

// Objeto criado mas não inicializado - INVÁLIDO!
ContaBancaria conta = new ContaBancaria();
// conta.numero = null, conta.saldo = 0.0
conta.depositar(100);  // NullPointerException ao acessar numero!
```

**Problema Real:** Janela temporal entre criação e inicialização onde objeto é inutilizável:

```java
// Duas etapas - objeto inválido temporariamente
Usuario usuario = new Usuario();  // 1️⃣ Criação (estado inválido)
usuario.setNome("Alice");          // 2️⃣ Inicialização
usuario.setEmail("alice@mail.com");
// Entre 1️⃣ e 2️⃣, objeto está incompleto!
```

**Solução:** Construtor garante objeto nasce completo:

```java
// COM construtor adequado
class ContaBancaria {
    private String numero;
    private double saldo;

    // Construtor força fornecimento de valores obrigatórios
    public ContaBancaria(String numero, double saldoInicial) {
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

// Uma única etapa - objeto sempre válido
ContaBancaria conta = new ContaBancaria("12345", 100.0);
// Impossível criar conta sem número e saldo!
// conta.numero e conta.saldo garantidamente válidos
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Método Especial:**
   - Mesmo nome da classe
   - Sem tipo de retorno (nem `void`)
   - Invocado automaticamente por `new`
   - Não pode ser chamado diretamente após criação

2. **Timing de Execução:**
   - Executado imediatamente após alocação de memória
   - Após valores padrão e inicializações inline/blocos
   - Antes de referência ao objeto ser retornada
   - Executa exatamente uma vez na vida do objeto

3. **Propósito de Inicialização:**
   - Atribuir valores iniciais aos atributos
   - Validar parâmetros recebidos
   - Estabelecer invariantes de classe
   - Configurar dependências e recursos

4. **Construtor Padrão:**
   - Gerado automaticamente se nenhum construtor for declarado
   - Sem parâmetros, corpo vazio
   - Desaparece se qualquer construtor for declarado explicitamente

5. **Garantia de Validade:**
   - Impossível criar objeto sem executar construtor
   - Ponto único de validação na criação
   - Força fornecimento de dados obrigatórios

### Pilares Fundamentais

- **Sintaxe:** `public NomeClasse(parametros) { corpo }`
- **Invocação:** Automática via `new NomeClasse(argumentos)`
- **Inicialização:** Atribuir valores a atributos
- **Validação:** Verificar parâmetros antes de atribuir
- **Sem Retorno:** Não tem tipo de retorno (nem `void`)

---

## � Fundamentos Teóricos

### Anatomia do Construtor

#### Estrutura Sintática

```java
[modificadorAcesso] NomeClasse(parametros) {
    // Corpo do construtor
}
```

**Componentes:**

1. **Modificador de Acesso:** `public`, `private`, `protected`, ou package-private
2. **Nome:** DEVE ser exatamente igual ao nome da classe
3. **Parâmetros:** Lista de parâmetros (pode ser vazia)
4. **Corpo:** Código de inicialização

**Não Possui:**
- Tipo de retorno (nem `void`)
- Palavra-chave `return` com valor (apenas `return;` sozinho, raro)

#### Exemplo Completo

```java
class Produto {
    private String codigo;
    private String nome;
    private double preco;

    // Construtor
    public Produto(String codigo, String nome, double preco) {
        // Validação
        if (codigo == null || codigo.isEmpty()) {
            throw new IllegalArgumentException("Código é obrigatório");
        }
        if (preco < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo");
        }

        // Inicialização
        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
    }
}

// Uso:
Produto p = new Produto("P001", "Mouse", 25.90);
// Impossível criar Produto sem código, nome e preço!
```

### Diferença: Construtor vs Método

| Aspecto | Construtor | Método Comum |
|---------|-----------|--------------|
| **Nome** | Mesmo nome da classe | Qualquer nome válido |
| **Tipo de Retorno** | Nenhum (nem `void`) | Deve declarar tipo ou `void` |
| **Invocação** | Automática via `new` | Manual via `objeto.metodo()` |
| **Propósito** | Inicializar objeto novo | Executar comportamento |
| **Quando Executa** | Uma vez, na criação | Quantas vezes chamar |
| **Herança** | Não herdado | Herdado (exceto `private`/`static`) |
| **Palavra `return`** | Não retorna valor | Pode retornar valor |

```java
class Exemplo {
    private int valor;

    // CONSTRUTOR
    public Exemplo(int valor) {  // Sem tipo de retorno
        this.valor = valor;
    }

    // MÉTODO
    public void setValor(int valor) {  // Tem tipo de retorno (void)
        this.valor = valor;
    }
}

Exemplo e = new Exemplo(10);  // Construtor executado automaticamente
e.setValor(20);                // Método chamado manualmente
```

### Timing: Quando Construtor Executa

```java
class Timeline {
    private int x = 10;  // 1️⃣ Inicialização inline

    {
        x += 5;  // 2️⃣ Bloco de inicialização (x = 15)
    }

    // 3️⃣ Construtor
    public Timeline() {
        x += 10;  // x = 25
        System.out.println("Construtor: x = " + x);
    }
}

// Chamada:
Timeline t = new Timeline();
// Ordem:
// 0️⃣ new aloca memória, valores padrão (x = 0)
// 1️⃣ Inicialização inline: x = 10
// 2️⃣ Bloco de inicialização: x = 15
// 3️⃣ Construtor: x = 25
// Saída: "Construtor: x = 25"
```

**Sequência Completa:**
1. **JVM:** Aloca memória, preenche com valores padrão
2. **Inline:** Executa inicializações inline
3. **Blocos:** Executa blocos de inicialização
4. **Construtor:** Executa corpo do construtor
5. **Retorno:** Referência ao objeto é retornada para quem chamou `new`

### Construtor Padrão (Default Constructor)

#### Geração Automática

Se classe não declara nenhum construtor, Java gera automaticamente construtor padrão:

```java
// Código escrito
class Pessoa {
    String nome;
    int idade;
}

// Equivalente (Java gera automaticamente)
class Pessoa {
    String nome;
    int idade;

    // Construtor padrão gerado pelo compilador
    public Pessoa() {
        // Corpo vazio
    }
}

// Uso:
Pessoa p = new Pessoa();  // Funciona! Construtor padrão disponível
```

**Características do Construtor Padrão:**
- Sem parâmetros
- Corpo vazio
- Visibilidade igual à da classe (`public` se classe é `public`)
- Gerado apenas se nenhum construtor for declarado

#### Construtor Padrão Desaparece

```java
class Produto {
    String nome;

    // Declarou construtor parametrizado
    public Produto(String nome) {
        this.nome = nome;
    }
}

// ❌ ERRO - construtor padrão NÃO existe mais!
Produto p = new Produto();
// Erro: "constructor Produto in class Produto cannot be applied to given types"

// ✅ CORRETO
Produto p = new Produto("Mouse");
```

**Regra:** Declarar qualquer construtor elimina construtor padrão automático.

#### Manter Construtor Padrão Explicitamente

```java
class Produto {
    String nome;

    // Construtor padrão explícito
    public Produto() {
        this.nome = "Sem nome";
    }

    // Construtor parametrizado
    public Produto(String nome) {
        this.nome = nome;
    }
}

// Ambos funcionam:
Produto p1 = new Produto();           // Usa construtor padrão
Produto p2 = new Produto("Mouse");    // Usa construtor parametrizado
```

---

## 🔍 Análise Conceitual Profunda

### Propósito: Inicialização e Validação

#### Inicialização de Atributos

```java
class Usuario {
    private String nome;
    private String email;
    private LocalDateTime dataCriacao;
    private UUID id;

    public Usuario(String nome, String email) {
        // Inicialização com parâmetros
        this.nome = nome;
        this.email = email;

        // Inicialização com valores computados
        this.dataCriacao = LocalDateTime.now();
        this.id = UUID.randomUUID();
    }
}
```

#### Validação de Parâmetros

```java
class Idade {
    private int valor;

    public Idade(int valor) {
        // Validação antes de atribuir
        if (valor < 0) {
            throw new IllegalArgumentException("Idade não pode ser negativa");
        }
        if (valor > 150) {
            throw new IllegalArgumentException("Idade inválida: " + valor);
        }
        this.valor = valor;
    }
}

// Uso:
Idade i1 = new Idade(30);    // ✅ OK
Idade i2 = new Idade(-5);    // ❌ Exceção: "Idade não pode ser negativa"
Idade i3 = new Idade(200);   // ❌ Exceção: "Idade inválida: 200"
```

#### Estabelecimento de Invariantes

```java
class ContaBancaria {
    private final String numero;  // Invariante: nunca null/vazio
    private double saldo;         // Invariante: nunca negativo

    public ContaBancaria(String numero, double saldoInicial) {
        // Garante invariante: numero sempre válido
        if (numero == null || numero.trim().isEmpty()) {
            throw new IllegalArgumentException("Número de conta obrigatório");
        }

        // Garante invariante: saldo sempre >= 0
        if (saldoInicial < 0) {
            throw new IllegalArgumentException("Saldo inicial não pode ser negativo");
        }

        this.numero = numero;
        this.saldo = saldoInicial;

        // Invariantes estabelecidos - conta sempre válida!
    }
}
```

### Construtor vs Métodos de Inicialização

#### Anti-Padrão: Métodos `init()`

```java
// ❌ RUIM - objeto pode existir não inicializado
class Usuario {
    private String nome;
    private String email;

    public Usuario() { }  // Objeto criado mas inválido

    public void init(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }
}

// Problema: janela onde objeto é inválido
Usuario u = new Usuario();  // u.nome = null, u.email = null
// ...código intermediário...
u.init("Alice", "alice@mail.com");  // Finalmente válido
// E se esquecer de chamar init()? Bug!
```

#### Padrão Correto: Construtor

```java
// ✅ BOM - objeto sempre válido
class Usuario {
    private String nome;
    private String email;

    public Usuario(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }
}

// Impossível criar objeto inválido
Usuario u = new Usuario("Alice", "alice@mail.com");
// u é válido desde o momento de criação
```

### Palavra-chave `this` em Construtores

#### Diferenciação de Parâmetros

```java
class Pessoa {
    private String nome;
    private int idade;

    // SEM this - conflito de nomes
    public Pessoa(String nome, int idade) {
        nome = nome;    // ❌ Atribui parâmetro a si mesmo!
        idade = idade;  // ❌ Não modifica atributo
        // Atributos permanecem com valores padrão (null, 0)
    }

    // COM this - correto
    public Pessoa(String nome, int idade) {
        this.nome = nome;    // ✅ this.nome (atributo) = nome (parâmetro)
        this.idade = idade;  // ✅ this.idade (atributo) = idade (parâmetro)
    }
}
```

**Regra:** Quando parâmetro tem mesmo nome que atributo, use `this.atributo` para referenciar atributo.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Construtor Parametrizado

✅ **Use construtor parametrizado quando:**

1. **Valores Obrigatórios:**
   ```java
   class Email {
       private String endereco;

       public Email(String endereco) {  // Email SEM endereço não faz sentido
           this.endereco = endereco;
       }
   }
   ```

2. **Imutabilidade:**
   ```java
   class Ponto {
       private final int x;
       private final int y;

       public Ponto(int x, int y) {  // Atributos final DEVEM ser inicializados
           this.x = x;
           this.y = y;
       }
   }
   ```

3. **Validação Necessária:**
   ```java
   class CPF {
       private String numero;

       public CPF(String numero) {
           if (!validar(numero)) {
               throw new IllegalArgumentException("CPF inválido");
           }
           this.numero = numero;
       }
   }
   ```

### Quando Usar Construtor Padrão

✅ **Use construtor padrão quando:**

1. **Valores Padrão Adequados:**
   ```java
   class Contador {
       private int valor = 0;  // Inline já fornece padrão

       public Contador() { }  // Construtor padrão explícito
   }
   ```

2. **Frameworks Exigem:**
   ```java
   @Entity  // JPA requer construtor padrão
   class Produto {
       @Id
       private Long id;

       public Produto() { }  // Obrigatório para JPA

       public Produto(Long id) {
           this.id = id;
       }
   }
   ```

3. **Builder Pattern:**
   ```java
   class Pedido {
       private String cliente;
       private List<Item> itens = new ArrayList<>();

       public Pedido() { }  // Construtor padrão para builder

       public static PedidoBuilder builder() {
           return new PedidoBuilder();
       }
   }
   ```

---

## ⚠️ Limitações e Considerações

### Construtor Não Pode Ser Chamado Diretamente

```java
class Teste {
    public Teste() {
        System.out.println("Construtor");
    }

    public void metodo() {
        Teste();  // ❌ ERRO - não pode chamar construtor como método
        // Construtor só é invocado via 'new'
    }
}
```

### Construtor Não Pode Ser Herdado

```java
class Pai {
    public Pai(String nome) {
        System.out.println("Pai: " + nome);
    }
}

class Filho extends Pai {
    // ❌ ERRO - Pai não tem construtor padrão
    public Filho() {
        // Implicitamente tenta chamar super(), que não existe
    }

    // ✅ CORRETO - chama explicitamente construtor de Pai
    public Filho(String nome) {
        super(nome);  // Primeira linha deve chamar super()
    }
}
```

### Exceções em Construtores

```java
class Arquivo {
    private String conteudo;

    // Construtor pode lançar exceções
    public Arquivo(String caminho) throws IOException {
        this.conteudo = Files.readString(Path.of(caminho));
    }
}

// Uso:
try {
    Arquivo arq = new Arquivo("config.txt");
} catch (IOException e) {
    // Se exceção ocorre, objeto NÃO é criado
    // Referência 'arq' permanece não atribuída
}
```

**Importante:** Se construtor lança exceção, objeto não é criado - referência não é inicializada.

---

## 🔗 Interconexões Conceituais

### Relação com Inicialização de Atributos

Construtor é terceira e última forma de inicializar atributos:

```java
class Completo {
    private int a = 10;  // 1️⃣ Inicialização inline

    {
        a += 5;  // 2️⃣ Bloco de inicialização (a = 15)
    }

    public Completo(int extra) {
        a += extra;  // 3️⃣ Construtor (a = 15 + extra)
    }
}
```

### Relação com Encapsulamento

Construtor é ponto de entrada - único local onde validação pode ser forçada:

```java
class Salario {
    private double valor;  // Encapsulado

    public Salario(double valor) {
        if (valor < 1320.00) {  // Salário mínimo
            throw new IllegalArgumentException("Abaixo do salário mínimo");
        }
        this.valor = valor;  // Validado antes de atribuir
    }

    // Sem setter - imutável após construção
}
```

### Relação com Padrões de Design

- **Singleton:** Construtor privado
- **Factory Method:** Construtor privado/protected, criação via método estático
- **Builder:** Construtor privado, criação via builder
- **Prototype:** Construtor de cópia

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **Sobrecarga de Construtores:** Múltiplos construtores com parâmetros diferentes
- **Chamada de Construtores (`this()`):** Construtores chamando outros construtores
- **Construtor Privado:** Padrões Singleton, Factory, Utility classes
- **Construtor de Cópia:** Criar objeto copiando outro
- **Builder Pattern:** Alternativa para muitos parâmetros

### Progressão Natural

1. **Construtor Básico** → Inicialização simples (tópico atual)
2. **Sobrecarga** → Múltiplas formas de criar objeto
3. **Encadeamento (`this()`)** → Reutilização entre construtores
4. **Padrões Avançados** → Singleton, Factory, Builder

---

## 📚 Conclusão

Construtor é método especial, com mesmo nome da classe e sem tipo de retorno, invocado automaticamente por `new` para **inicializar estado de objeto recém-criado**, garantindo que objeto comece existência em estado válido e consistente.

Dominar construtores significa:
- Declarar com sintaxe `public NomeClasse(parametros) { }` - sem tipo de retorno
- Entender que construtor executa automaticamente após alocação de memória
- Usar construtor para atribuir valores iniciais aos atributos
- Validar parâmetros antes de atribuir, lançando exceções se inválidos
- Reconhecer que construtor padrão (sem parâmetros, corpo vazio) é gerado automaticamente apenas se nenhum construtor for declarado
- Usar `this.atributo` quando parâmetro tem mesmo nome que atributo
- Forçar fornecimento de valores obrigatórios via parâmetros do construtor
- Estabelecer invariantes de classe que nunca podem ser quebrados
- Diferenciar construtor (inicialização, executa uma vez) de método (comportamento, executa quantas vezes chamar)
- Preferir construtor parametrizado a métodos `init()` - elimina janela de objeto inválido

Construtor é contrato de criação válida - `new Produto()` sem parâmetros vs `new Produto(codigo, nome, preco)` com validação. Não é possível contornar: impossível criar objeto sem executar construtor. É barreira de entrada que força código cliente a fornecer dados necessários, transformando compilador em aliado que previne bugs de objetos mal formados. Produto sem código, usuário sem email, conta sem número - construtores tornam esses cenários impossíveis sintaticamente, não apenas indesejados logicamente.

