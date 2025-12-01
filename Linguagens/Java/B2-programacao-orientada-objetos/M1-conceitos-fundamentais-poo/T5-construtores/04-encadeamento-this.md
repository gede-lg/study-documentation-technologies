# Chamada entre Construtores com this()

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Encadeamento de construtores com `this()`** (constructor chaining) é técnica onde um construtor chama outro construtor da mesma classe usando sintaxe `this(argumentos)`, permitindo reutilização de lógica de inicialização e centralização de validação. Conceitualmente, construtores formam hierarquia interna - construtores simples delegam para mais complexos, evitando duplicação de código.

É uso especial da palavra-chave `this`: enquanto `this.atributo` referencia atributo do objeto atual, `this()` invoca outro construtor. `this()` DEVE ser primeira instrução do construtor - antes de qualquer outro código. É "passe de bastão" entre construtores: "não vou inicializar tudo, vou deixar outro construtor fazer o trabalho pesado".

Propósito é **DRY (Don't Repeat Yourself)**: evitar que cada construtor sobrecarregado duplique validação e inicialização. Construtor "mestre" contém toda lógica, demais construtores apenas fornecem valores padrão e delegam. Mudanças na lógica de inicialização ocorrem em um único local.

### Contexto Histórico e Motivação

`this()` para chamar construtores vem de C++ (onde também existe), mas Java simplificou regras. Desde Java 1.0, `this()` é ferramenta fundamental para sobrecarga de construtores sem duplicação. Motivação: construtores sobrecarregados frequentemente precisam da mesma validação/inicialização - sem `this()`, código seria duplicado em cada construtor.

**Motivação Original:**
```java
// SEM this() - duplicação de validação
class Produto {
    public Produto(String nome, double preco) {
        if (preco < 0) throw new IllegalArgumentException();  // Duplicado
        this.nome = nome;
        this.preco = preco;
    }

    public Produto(String nome) {
        if (nome == null) throw new IllegalArgumentException();  // Duplicado
        this.nome = nome;
        this.preco = 0.0;
    }
}

// COM this() - validação centralizada
class Produto {
    public Produto(String nome, double preco) {
        if (preco < 0) throw new IllegalArgumentException();  // Uma vez
        this.nome = nome;
        this.preco = preco;
    }

    public Produto(String nome) {
        this(nome, 0.0);  // Delega - reutiliza validação
    }
}
```

### Problema Fundamental que Resolve

**Problema:** Duplicação de código entre construtores:

```java
// ❌ RUIM - validação/inicialização duplicada
class Retangulo {
    private int largura;
    private int altura;

    public Retangulo() {
        if (largura <= 0) throw new IllegalArgumentException();  // Duplicado
        if (altura <= 0) throw new IllegalArgumentException();   // Duplicado
        this.largura = 1;
        this.altura = 1;
    }

    public Retangulo(int lado) {
        if (lado <= 0) throw new IllegalArgumentException();     // Duplicado
        this.largura = lado;
        this.altura = lado;
    }

    public Retangulo(int largura, int altura) {
        if (largura <= 0) throw new IllegalArgumentException();  // Duplicado
        if (altura <= 0) throw new IllegalArgumentException();   // Duplicado
        this.largura = largura;
        this.altura = altura;
    }
}
// Validação triplicada - mudar uma exige mudar três
```

**Solução:** Encadeamento centraliza lógica:

```java
// ✅ BOM - validação centralizada
class Retangulo {
    private int largura;
    private int altura;

    // Construtor padrão → delega para quadrado 1x1
    public Retangulo() {
        this(1);  // Chama Retangulo(int)
    }

    // Construtor quadrado → delega para completo
    public Retangulo(int lado) {
        this(lado, lado);  // Chama Retangulo(int, int)
    }

    // Construtor completo (MESTRE) - validação aqui
    public Retangulo(int largura, int altura) {
        if (largura <= 0 || altura <= 0) {
            throw new IllegalArgumentException("Dimensões devem ser positivas");
        }
        this.largura = largura;
        this.altura = altura;
    }
}
// Validação em um único local - mudança única
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Sintaxe `this(argumentos)`:**
   - Chama outro construtor da mesma classe
   - DEVE ser primeira instrução (não pode ter código antes)
   - Argumentos determinam qual construtor será chamado

2. **Encadeamento Unidirecional:**
   - Construtor pode chamar apenas UM outro construtor via `this()`
   - Não pode chamar `this()` e `super()` simultaneamente
   - Encadeamento forma árvore (não ciclo)

3. **Resolução em Compilação:**
   - Compilador determina qual construtor será chamado baseado em argumentos
   - Mesmas regras de sobrecarga aplicam

4. **Padrão Comum:**
   - Construtores simples → chamam mais complexos
   - Construtor "mestre" contém toda lógica de validação/inicialização
   - Demais fornecem valores padrão e delegam

5. **Restrições:**
   - `this()` deve ser PRIMEIRA instrução
   - Não pode ter recursão (ciclo de chamadas)
   - Apenas um `this()` por construtor

### Pilares Fundamentais

- **`this(args)`:** Chama construtor sobrecarregado
- **Primeira Instrução:** Obrigatoriamente início do construtor
- **Delegação:** Construtores simples delegam para complexos
- **Centralização:** Validação e lógica em construtor "mestre"
- **DRY:** Evita duplicação de código de inicialização

---

## 🧠 Fundamentos Teóricos

### Sintaxe e Uso Básico

#### Forma Geral

```java
public NomeClasse(parametros) {
    this(argumentos);  // DEVE ser primeira linha
    // Código adicional (opcional, após this())
}
```

#### Exemplo Simples

```java
class Pessoa {
    private String nome;
    private int idade;

    // Construtor 1: nome apenas
    public Pessoa(String nome) {
        this(nome, 0);  // Chama Pessoa(String, int)
    }

    // Construtor 2: nome e idade (mestre)
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

// Uso:
Pessoa p = new Pessoa("Alice");
// Fluxo: new Pessoa("Alice")
//    → this("Alice", 0)
//        → this.nome = "Alice", this.idade = 0
```

### Regra: `this()` Deve Ser Primeira Instrução

```java
class Exemplo {
    private int valor;

    // ❌ ERRO - código antes de this()
    public Exemplo(String texto) {
        System.out.println("Convertendo");  // ❌ Não pode ter antes!
        this(Integer.parseInt(texto));
    }

    // ✅ CORRETO - this() primeiro
    public Exemplo(String texto) {
        this(Integer.parseInt(texto));  // Primeira linha
    }

    // ✅ CORRETO - código após this()
    public Exemplo(int valor, boolean log) {
        this(valor);  // Primeira linha
        if (log) {
            System.out.println("Valor: " + valor);  // Após this() OK
        }
    }

    public Exemplo(int valor) {
        this.valor = valor;
    }
}
```

### Resolução de Sobrecarga

Compilador escolhe construtor baseado em tipos dos argumentos:

```java
class Numero {
    public Numero() {
        this(0);  // Chama Numero(int)
    }

    public Numero(int valor) {
        System.out.println("int: " + valor);
    }

    public Numero(double valor) {
        System.out.println("double: " + valor);
    }
}

new Numero();     // int: 0 (this(0) resolve para Numero(int))
```

---

## 🔍 Análise Conceitual Profunda

### Padrão: Construtor Mestre

Convenção comum: construtor mais complexo é "mestre", demais delegam:

```java
class Produto {
    private String codigo;
    private String nome;
    private double preco;
    private int estoque;
    private boolean ativo;

    // Construtor 1: mínimo
    public Produto(String codigo, String nome, double preco) {
        this(codigo, nome, preco, 0, true);  // Delega para mestre
    }

    // Construtor 2: com estoque
    public Produto(String codigo, String nome, double preco, int estoque) {
        this(codigo, nome, preco, estoque, true);  // Delega para mestre
    }

    // Construtor 3: MESTRE - toda lógica aqui
    public Produto(String codigo, String nome, double preco, int estoque, boolean ativo) {
        // Validação centralizada
        if (codigo == null || codigo.isEmpty()) {
            throw new IllegalArgumentException("Código obrigatório");
        }
        if (preco < 0) {
            throw new IllegalArgumentException("Preço negativo");
        }
        if (estoque < 0) {
            throw new IllegalArgumentException("Estoque negativo");
        }

        // Inicialização
        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
        this.ativo = ativo;
    }
}
```

**Benefício:** Mudar validação/lógica = alterar apenas construtor mestre.

### Encadeamento em Cascata

Construtores podem formar cadeia:

```java
class Config {
    private String host;
    private int porta;
    private int timeout;
    private boolean ssl;

    // 1️⃣ Construtor padrão
    public Config() {
        this("localhost");  // → 2️⃣
    }

    // 2️⃣ Host apenas
    public Config(String host) {
        this(host, 8080);  // → 3️⃣
    }

    // 3️⃣ Host e porta
    public Config(String host, int porta) {
        this(host, porta, 30);  // → 4️⃣
    }

    // 4️⃣ Host, porta, timeout
    public Config(String host, int porta, int timeout) {
        this(host, porta, timeout, false);  // → 5️⃣ MESTRE
    }

    // 5️⃣ MESTRE - completo
    public Config(String host, int porta, int timeout, boolean ssl) {
        this.host = host;
        this.porta = porta;
        this.timeout = timeout;
        this.ssl = ssl;
    }
}

// Uso:
Config c = new Config();
// Fluxo: Config() → Config("localhost") → Config("localhost", 8080)
//        → Config("localhost", 8080, 30) → Config("localhost", 8080, 30, false)
//        → inicialização final
```

### Código Após `this()`

Permitido adicionar código após `this()`:

```java
class Logger {
    private String nome;
    private boolean ativo;

    public Logger(String nome) {
        this(nome, true);  // DEVE ser primeira linha

        // Código adicional APÓS this() é permitido
        System.out.println("Logger '" + nome + "' criado");
    }

    public Logger(String nome, boolean ativo) {
        this.nome = nome;
        this.ativo = ativo;
    }
}
```

**Ordem de Execução:**
1. `this(nome, true)` executa completamente (inicializa atributos)
2. Código após `this()` executa
3. Construtor finaliza

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar `this()`

✅ **Use `this()` quando:**

1. **Validação Centralizada:**
   ```java
   class Idade {
       private int valor;

       public Idade(int valor) {
           if (valor < 0 || valor > 150) throw new IllegalArgumentException();
           this.valor = valor;
       }

       public Idade() {
           this(0);  // Reutiliza validação
       }
   }
   ```

2. **Valores Padrão:**
   ```java
   class Conexao {
       public Conexao(String url) {
           this(url, 30);  // Timeout padrão
       }

       public Conexao(String url, int timeout) {
           // Inicialização completa
       }
   }
   ```

3. **Simplificação de Sobrecarga:**
   ```java
   class Ponto {
       public Ponto() {
           this(0, 0);  // Origem
       }

       public Ponto(int x, int y) {
           this.x = x;
           this.y = y;
       }
   }
   ```

### Quando Evitar `this()`

❌ **Evite `this()` quando:**

1. **Lógica Muito Diferente:**
   ```java
   // ❌ RUIM - construtores fazem coisas diferentes
   class Usuario {
       public Usuario(String nome) {
           // Cria usuário novo
           this.id = gerarNovoId();
           this.nome = nome;
       }

       public Usuario(int id) {
           // Carrega usuário existente do banco
           Usuario u = carregarDoBanco(id);
           this.id = u.id;
           this.nome = u.nome;
       }
       // Não faz sentido um chamar o outro via this()
   }
   ```

2. **Encadeamento Excessivamente Complexo:**
   ```java
   // ⚠️ Confuso - muitos níveis
   public C() { this(1); }
   public C(int a) { this(a, 2); }
   public C(int a, int b) { this(a, b, 3); }
   public C(int a, int b, int c) { this(a, b, c, 4); }
   // Difícil de seguir - considerar simplificar
   ```

---

## ⚠️ Limitações e Considerações

### Não Pode Chamar `this()` e `super()` Juntos

```java
class Animal {
    public Animal(String especie) { }
}

class Cachorro extends Animal {
    // ❌ ERRO - não pode ter this() E super()
    public Cachorro(String nome) {
        super("Canino");  // Chamada a super
        this(nome, 0);    // ❌ ERRO - this() também primeira linha!
    }

    public Cachorro(String nome, int idade) {
        super("Canino");
        // Inicialização
    }
}

// Solução: escolher um ou delegar diferentemente
class Cachorro extends Animal {
    public Cachorro(String nome) {
        this(nome, 0);  // Chama outro construtor Cachorro
    }

    public Cachorro(String nome, int idade) {
        super("Canino");  // Este chama super
        this.nome = nome;
        this.idade = idade;
    }
}
```

### Não Pode Ter Recursão

```java
class Recursivo {
    public Recursivo() {
        this(10);  // Chama Recursivo(int)
    }

    public Recursivo(int valor) {
        this();  // ❌ Chama Recursivo() - CICLO INFINITO!
    }
}
// Erro de compilação: "recursive constructor invocation"
```

### `this()` Não Permite Acesso a `this` Antes

```java
class Problema {
    private int valor;

    // ❌ ERRO - não pode usar 'this' antes de this()
    public Problema(int valor) {
        this.valor = valor + 10;  // Usa this.valor
        this(valor);  // ❌ ERRO - this() não é primeira linha
    }

    public Problema(int a) { }
}
```

### Inicializações Inline Executam Antes

```java
class Ordem {
    private int x = 10;  // 1️⃣ Inline

    public Ordem() {
        this(20);  // 2️⃣ this() → chama Ordem(int)
    }

    public Ordem(int valor) {
        System.out.println("x = " + x);  // x já é 10 (inline executou)
        x = valor;  // 3️⃣ Atribui novo valor
    }
}

new Ordem();
// Ordem de execução:
// 1. Inline: x = 10
// 2. Ordem() chama this(20)
// 3. Ordem(int) executa: imprime "x = 10", depois x = 20
```

---

## 🔗 Interconexões Conceituais

### Relação com Sobrecarga

`this()` é ferramenta para gerenciar sobrecarga sem duplicação:

```java
class Retangulo {
    // Sobrecarga de construtores
    public Retangulo() { this(1, 1); }
    public Retangulo(int lado) { this(lado, lado); }
    public Retangulo(int largura, int altura) { /* mestre */ }

    // this() gerencia delegação entre sobrecargas
}
```

### Relação com Herança (`super()`)

Construtor pode chamar `this()` OU `super()`, não ambos:

```java
class Pai {
    public Pai(String nome) { }
}

class Filho extends Pai {
    // Opção 1: super() direto
    public Filho(String nome) {
        super(nome);  // Chama construtor de Pai
    }

    // Opção 2: this() que eventualmente chama super()
    public Filho() {
        this("Padrão");  // Chama Filho(String), que chama super()
    }
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **Herança e `super()`:** Chamada de construtor de superclasse
- **Ordem de Inicialização:** Inline → Blocos → Construtor
- **Builder Pattern:** Alternativa quando construtores explodem
- **Factory Methods:** Métodos estáticos em vez de construtores

---

## 📚 Conclusão

Encadeamento de construtores com `this()` permite que construtor chame outro construtor da mesma classe, centralizando validação e inicialização no construtor "mestre" enquanto demais construtores fornecem valores padrão e delegam. `this()` DEVE ser primeira instrução do construtor.

Dominar `this()` significa:
- Usar sintaxe `this(argumentos)` para chamar construtor sobrecarregado
- Garantir que `this()` seja PRIMEIRA instrução - nenhum código antes
- Código após `this()` é permitido e executa depois da inicialização delegada
- Construtor mestre contém validação/lógica, demais delegam via `this()`
- Encadeamento forma árvore (não ciclo) - construtor simples → complexo → mestre
- Compilador resolve qual construtor chamar baseado em tipos dos argumentos
- Não pode chamar `this()` e `super()` simultaneamente - escolher um
- Recursão (ciclo de chamadas) causa erro de compilação
- Valores padrão em construtores simples: `this(nome, 0, true)`
- Centralização evita duplicação de validação entre construtores

`this()` é ferramenta DRY para sobrecarga: em vez de duplicar validação em cada construtor, delegar para "mestre". `new Retangulo()` → `this(1, 1)` → `Retangulo(int, int)` valida uma vez. Mudança na validação = alterar apenas mestre. É hierarquia interna de construtores - simples na superfície (poucos parâmetros, convenientes), complexo no fundo (todos parâmetros, validação pesada). `this()` é ponte entre conveniência da API pública e robustez da implementação interna.
