# T6.01 - Referência ao Objeto Atual (this)

## Introdução e Definição

A palavra-chave `this` é uma **referência implícita ao objeto atual** sobre o qual um método de instância está sendo executado. Em Java, `this` representa o próprio objeto que recebeu a chamada do método, permitindo acesso explícito aos atributos e métodos daquela instância específica.

Quando você invoca um método em um objeto (`objeto.metodo()`), dentro desse método o `this` aponta para o `objeto` que fez a chamada. É como se o objeto tivesse uma referência para si mesmo, permitindo manipular seus próprios dados e comportamentos de forma explícita.

O `this` é fundamental para:
- Diferenciar atributos de parâmetros quando têm o mesmo nome
- Chamar outros construtores da mesma classe
- Passar o próprio objeto como argumento para outros métodos
- Retornar o próprio objeto para encadeamento de métodos (method chaining)
- Acessar membros da classe de forma explícita e clara

**Importante**: `this` só existe em contextos de **instância** (métodos de instância, construtores, blocos de inicialização). Em métodos estáticos (`static`), `this` não está disponível, pois métodos estáticos não pertencem a nenhum objeto específico.

---

## 10 Fundamentos Teóricos

### 1. this Como Referência ao Objeto Atual

`this` é uma **referência implícita** que aponta para o objeto sobre o qual o método de instância está sendo executado no momento. Cada vez que um método é chamado em um objeto, o `this` dentro desse método refere-se ao objeto que fez a chamada.

```java
public class Pessoa {
    private String nome;

    public void apresentar() {
        // this refere-se ao objeto Pessoa que chamou apresentar()
        System.out.println("Meu nome é " + this.nome);
    }
}

// Uso:
Pessoa p1 = new Pessoa();
p1.nome = "João";
p1.apresentar(); // Dentro de apresentar(), this = p1

Pessoa p2 = new Pessoa();
p2.nome = "Maria";
p2.apresentar(); // Dentro de apresentar(), this = p2
```

Quando `p1.apresentar()` é chamado, `this` dentro do método aponta para `p1`. Quando `p2.apresentar()` é executado, `this` aponta para `p2`. O `this` é dinâmico, sempre apontando para o objeto que recebeu a chamada.

---

### 2. Acesso Explícito a Atributos com this

Você pode acessar os atributos de uma classe de duas formas:
- **Implicitamente**: simplesmente usando o nome do atributo (`nome`)
- **Explicitamente**: usando `this.atributo` (`this.nome`)

Ambas as formas são equivalentes. Quando você escreve apenas `nome` dentro de um método de instância, o compilador assume automaticamente `this.nome`.

```java
public class Carro {
    private String modelo;

    public void exibir() {
        // Forma implícita (compilador assume this.modelo)
        System.out.println(modelo);
        
        // Forma explícita (mais claro)
        System.out.println(this.modelo);
    }
}
```

O uso explícito de `this.atributo` é opcional quando não há ambiguidade, mas torna o código mais claro e explícito sobre a origem do atributo.

---

### 3. this Para Diferenciar Atributos de Parâmetros

O uso mais comum e **necessário** de `this` é diferenciar um atributo de um parâmetro quando ambos têm o **mesmo nome**. Isso é muito frequente em construtores e setters, onde os parâmetros geralmente têm os mesmos nomes dos atributos.

```java
public class Produto {
    private String nome;
    private double preco;

    public Produto(String nome, double preco) {
        // this.nome refere-se ao ATRIBUTO da classe
        // nome (sem this) refere-se ao PARÂMETRO do construtor
        this.nome = nome;
        this.preco = preco;
    }

    public void setNome(String nome) {
        this.nome = nome; // Atributo = parâmetro
    }
}
```

**Regra**: Quando há um parâmetro ou variável local com o mesmo nome do atributo, o parâmetro/variável **tem prioridade** (shadowing). Para acessar o atributo, você **DEVE** usar `this.atributo`.

Sem o `this`, você estaria atribuindo o parâmetro a ele mesmo (`nome = nome`), o que não tem efeito.

---

### 4. this em Métodos de Instância

Em qualquer método de instância (não-estático), `this` está disponível e refere-se ao objeto atual. Você pode usar `this` para:
- Acessar atributos: `this.atributo`
- Chamar outros métodos: `this.outroMetodo()`

```java
public class ContaBancaria {
    private double saldo;

    public void depositar(double valor) {
        this.saldo += valor;
        this.exibirSaldo(); // Chama outro método do próprio objeto
    }

    public void exibirSaldo() {
        System.out.println("Saldo: " + this.saldo);
    }
}
```

Chamar `this.exibirSaldo()` é equivalente a simplesmente `exibirSaldo()`, mas o uso de `this` deixa claro que você está invocando um método do próprio objeto.

---

### 5. this Não Existe em Contexto Estático

Métodos estáticos (`static`) pertencem à **classe**, não a instâncias específicas. Como `this` representa um objeto específico e métodos estáticos podem ser chamados sem criar objetos, **`this` não está disponível em métodos estáticos**.

```java
public class Calculadora {
    private int valor;

    // Método de instância - this disponível
    public void incrementar() {
        this.valor++; // OK
    }

    // Método estático - this NÃO disponível
    public static int somar(int a, int b) {
        // this.valor = a + b; // ERRO: Cannot use this in static context
        return a + b;
    }
}
```

Em métodos estáticos, você não pode usar `this` nem acessar atributos de instância diretamente, pois não há objeto associado à execução.

---

### 6. this em Construtores

Construtores são os locais mais comuns para o uso de `this`, pois geralmente os parâmetros têm os mesmos nomes dos atributos que estão sendo inicializados.

```java
public class Livro {
    private String titulo;
    private String autor;
    private int paginas;

    public Livro(String titulo, String autor, int paginas) {
        this.titulo = titulo;   // Atributo = parâmetro
        this.autor = autor;     // Atributo = parâmetro
        this.paginas = paginas; // Atributo = parâmetro
    }
}
```

Sem `this`, você teria que usar nomes diferentes para os parâmetros (como `_titulo`, `tituloParam`), o que é menos idiomático em Java.

---

### 7. Passagem de this Como Argumento

Você pode passar `this` (o próprio objeto) como argumento para outros métodos. Isso é útil quando um método externo precisa manipular ou referenciar o objeto atual.

```java
public class Funcionario {
    private String nome;

    public Funcionario(String nome) {
        this.nome = nome;
    }

    public void registrar(SistemaRH sistema) {
        // Passa o próprio objeto para o sistema
        sistema.adicionar(this);
    }

    public String getNome() {
        return this.nome;
    }
}

public class SistemaRH {
    private List<Funcionario> funcionarios = new ArrayList<>();

    public void adicionar(Funcionario funcionario) {
        funcionarios.add(funcionario);
        System.out.println("Funcionário " + funcionario.getNome() + " registrado");
    }
}

// Uso:
Funcionario f = new Funcionario("Ana");
SistemaRH sistema = new SistemaRH();
f.registrar(sistema); // Passa o próprio objeto Funcionario
```

Aqui, `this` é passado para `sistema.adicionar()`, permitindo que o `SistemaRH` adicione o próprio objeto `Funcionario` à sua lista.

---

### 8. Retorno de this Para Method Chaining

Retornar `this` de um método permite **encadeamento de chamadas** (method chaining), onde múltiplos métodos são invocados em sequência no mesmo objeto.

```java
public class Construtor {
    private String nome;
    private int idade;
    private String cidade;

    public Construtor setNome(String nome) {
        this.nome = nome;
        return this; // Retorna o próprio objeto
    }

    public Construtor setIdade(int idade) {
        this.idade = idade;
        return this;
    }

    public Construtor setCidade(String cidade) {
        this.cidade = cidade;
        return this;
    }

    public void exibir() {
        System.out.println(nome + ", " + idade + " anos, " + cidade);
    }
}

// Uso com encadeamento:
Construtor c = new Construtor()
    .setNome("Carlos")
    .setIdade(30)
    .setCidade("São Paulo");

c.exibir(); // Carlos, 30 anos, São Paulo
```

Cada método `setXxx()` retorna `this`, permitindo chamar outro método imediatamente no resultado. Esse padrão é comum em **builders** e **fluent APIs**.

---

### 9. this em Blocos de Inicialização

`this` também está disponível em **blocos de inicialização de instância**, que são executados antes do construtor.

```java
public class Exemplo {
    private int valor;

    // Bloco de inicialização de instância
    {
        this.valor = 10; // this disponível
        System.out.println("Bloco de inicialização");
    }

    public Exemplo() {
        System.out.println("Construtor, valor = " + this.valor);
    }
}

// Saída ao criar new Exemplo():
// Bloco de inicialização
// Construtor, valor = 10
```

Blocos de inicialização de instância têm acesso a `this` porque são executados no contexto de um objeto específico.

---

### 10. this em Classes Internas (Inner Classes)

Em classes internas não-estáticas (inner classes), `this` refere-se à **instância da classe interna**. Para acessar o `this` da classe externa, use `NomeClasseExterna.this`.

```java
public class Externa {
    private String nome = "Classe Externa";

    public class Interna {
        private String nome = "Classe Interna";

        public void exibir() {
            System.out.println(this.nome);         // "Classe Interna"
            System.out.println(Externa.this.nome); // "Classe Externa"
        }
    }
}

// Uso:
Externa externa = new Externa();
Externa.Interna interna = externa.new Interna();
interna.exibir();
// Classe Interna
// Classe Externa
```

`this.nome` acessa o atributo da classe interna, enquanto `Externa.this.nome` acessa o atributo da classe externa.

---

## Aplicabilidade

### Quando Usar this

1. **Construtores e Setters**: Quando os parâmetros têm os mesmos nomes dos atributos (prática idiomática em Java).
   ```java
   public void setNome(String nome) {
       this.nome = nome; // Necessário
   }
   ```

2. **Method Chaining**: Para retornar o próprio objeto e permitir encadeamento de métodos.
   ```java
   return this; // Builder pattern
   ```

3. **Passar o Objeto Como Argumento**: Quando um método externo precisa referenciar o objeto atual.
   ```java
   outroObjeto.processar(this);
   ```

4. **Clareza e Legibilidade**: Usar `this` explicitamente torna claro que você está acessando um membro do objeto, não uma variável local.
   ```java
   this.calcular(); // Deixa claro que é método do próprio objeto
   ```

5. **Chamar Construtores Sobrecarregados**: Usar `this()` para chamar outro construtor da mesma classe (será visto em outro tópico).

### Quando NÃO Usar this

1. **Métodos Estáticos**: `this` não existe em contexto estático.
2. **Sem Ambiguidade**: Se não há parâmetros ou variáveis locais com o mesmo nome, `this` é opcional (mas pode ser usado para clareza).
3. **Uso Excessivo**: Não é necessário usar `this` em todos os acessos a atributos; use quando houver ambiguidade ou para clareza.

---

## Armadilhas Comuns

### 1. Esquecer this em Construtores/Setters

```java
public class Produto {
    private String nome;

    public Produto(String nome) {
        nome = nome; // ERRO: Atribui o parâmetro a ele mesmo, não ao atributo!
    }
}
```

**Solução**: Usar `this.nome = nome;` para diferenciar o atributo do parâmetro.

---

### 2. Usar this em Métodos Estáticos

```java
public class Util {
    private int valor;

    public static void processar() {
        this.valor = 10; // ERRO: Cannot use 'this' in static context
    }
}
```

**Solução**: Métodos estáticos não têm acesso a `this`. Use apenas membros estáticos ou passe o objeto como parâmetro.

---

### 3. Confundir this com super

`this` refere-se ao objeto atual (da própria classe), enquanto `super` refere-se à superclasse. Não confunda os dois.

```java
public class Filho extends Pai {
    public void metodo() {
        this.atributo;  // Atributo da classe Filho (ou herdado)
        super.atributo; // Atributo da superclasse Pai
    }
}
```

---

### 4. Uso Desnecessário de this

Usar `this` excessivamente quando não há ambiguidade pode poluir o código.

```java
public class Exemplo {
    private int valor;

    public void incrementar() {
        this.valor = this.valor + 1; // OK, mas desnecessário
        valor = valor + 1;           // Mais limpo (sem ambiguidade)
    }
}
```

Use `this` para clareza ou quando necessário, não indiscriminadamente.

---

### 5. this em Classes Anônimas e Lambdas

Em classes anônimas, `this` refere-se à instância da classe anônima, não à classe externa. Em lambdas, `this` refere-se à classe externa.

```java
public class Teste {
    private String nome = "Classe Teste";

    public void executar() {
        // Classe anônima
        Runnable r1 = new Runnable() {
            public void run() {
                // this refere-se à instância de Runnable, não Teste
                // System.out.println(this.nome); // ERRO
            }
        };

        // Lambda
        Runnable r2 = () -> {
            // this refere-se à instância de Teste
            System.out.println(this.nome); // OK: "Classe Teste"
        };
    }
}
```

---

## Boas Práticas

### 1. Use this Para Diferenciar Atributos de Parâmetros

Sempre use `this.atributo = parametro;` em construtores e setters quando os nomes coincidem.

```java
public void setNome(String nome) {
    this.nome = nome; // Claro e idiomático
}
```

---

### 2. Use this Para Method Chaining

Retorne `this` em métodos que modificam o estado do objeto para permitir encadeamento.

```java
public Builder setValor(int valor) {
    this.valor = valor;
    return this; // Permite builder.setValor(10).setOutro(20)
}
```

---

### 3. Use this Para Clareza, Não Excessivamente

Use `this` quando houver ambiguidade ou para deixar o código mais claro, mas evite uso desnecessário.

```java
// Com ambiguidade: this necessário
public void setNome(String nome) {
    this.nome = nome;
}

// Sem ambiguidade: this opcional
public void processar() {
    calcular();      // OK
    this.calcular(); // OK, mas desnecessário (use se preferir clareza)
}
```

---

### 4. Passe this Quando Necessário

Passe `this` como argumento quando outro objeto precisa manipular ou referenciar o objeto atual.

```java
gerenciador.registrar(this); // Registra o próprio objeto
```

---

### 5. Evite this em Métodos Estáticos

Não tente usar `this` em métodos estáticos; use apenas membros estáticos.

```java
public static void metodoEstatico() {
    // Acesse apenas membros static, this não está disponível
}
```

---

### 6. Documente o Uso de this em Retornos

Quando retornar `this`, documente que o método permite encadeamento.

```java
/**
 * Define o nome do produto.
 * @param nome Nome do produto
 * @return Este objeto para encadeamento (method chaining)
 */
public Produto setNome(String nome) {
    this.nome = nome;
    return this;
}
```

---

### 7. Use this Para Chamar Construtores Sobrecarregados

Use `this()` para chamar outro construtor da mesma classe, evitando duplicação de código (será detalhado em tópico específico).

```java
public Pessoa(String nome) {
    this(nome, 0); // Chama construtor com dois parâmetros
}
```

---

### 8. this em Classes Internas: Use Qualificação Quando Necessário

Em classes internas, use `ClasseExterna.this` para acessar membros da classe externa.

```java
Externa.this.atributo; // Acessa atributo da classe externa
```

---

### 9. Evite this em Variáveis Locais

Variáveis locais nunca usam `this`; só atributos de instância.

```java
public void metodo() {
    int local = 10;
    // this.local; // ERRO: local não é atributo
}
```

---

### 10. Use this Para Auto-Referência em APIs Fluentes

Em APIs fluentes (fluent APIs), retorne `this` para permitir chamadas encadeadas e melhorar a legibilidade.

```java
Query query = new Query()
    .select("nome")
    .from("usuarios")
    .where("idade > 18")
    .orderBy("nome");
```

---

## Resumo Executivo

A palavra-chave **`this`** é uma referência ao objeto atual sobre o qual um método de instância está sendo executado. É usada principalmente para:
1. **Diferenciar atributos de parâmetros** quando têm o mesmo nome (`this.nome = nome;`).
2. **Acessar membros do próprio objeto** de forma explícita (`this.atributo`, `this.metodo()`).
3. **Passar o próprio objeto** como argumento para outros métodos (`outroObjeto.processar(this);`).
4. **Retornar o próprio objeto** para method chaining (`return this;`).
5. **Chamar construtores sobrecarregados** com `this()` (será visto em outro tópico).

**Regras Importantes**:
- `this` **só existe em contexto de instância** (métodos de instância, construtores, blocos de inicialização). Em métodos estáticos, `this` não está disponível.
- Quando há **shadowing** (parâmetro com mesmo nome do atributo), `this` é **necessário** para acessar o atributo.
- Usar `this` torna o código **mais explícito e claro**, especialmente em construtores e setters.
- Retornar `this` permite **encadeamento de métodos** (method chaining), padrão comum em builders e fluent APIs.

**Boas Práticas**:
- Use `this.atributo = parametro;` em construtores e setters para clareza.
- Retorne `this` para permitir method chaining quando apropriado.
- Evite uso excessivo de `this` onde não há ambiguidade, mas use para clareza quando necessário.
- Passe `this` como argumento quando outro objeto precisa manipular o objeto atual.
- Em classes internas, use `ClasseExterna.this` para acessar membros da classe externa.

`this` é uma ferramenta fundamental para trabalhar com objetos em Java, permitindo auto-referência, diferenciação de escopo e construção de APIs expressivas e fluentes.
