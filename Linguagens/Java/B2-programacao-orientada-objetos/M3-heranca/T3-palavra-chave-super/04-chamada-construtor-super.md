# T3.04 - Chamada ao Construtor da Superclasse: super()

## Introdução

**`super()`** chama **construtor da superclasse** na primeira linha do construtor da subclasse.

**Sintaxe**: `super(parametros);`

```java
public class Pessoa {
    protected String nome;
    protected int idade;
    
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

public class Funcionario extends Pessoa {
    private double salario;
    
    public Funcionario(String nome, int idade, double salario) {
        super(nome, idade); // Chama construtor de Pessoa
        this.salario = salario;
    }
}
```

**`super()`** **inicializa superclasse** antes de subclasse.

---

## Fundamentos

### 1. Sintaxe de super()

**Primeira linha do construtor** chama construtor da superclasse.

```java
public class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    public Cachorro(String nome, String raca) {
        super(nome);      // ← Primeira linha
        this.raca = raca;
    }
}
```

### 2. Por Que Chamar super()

**Superclasse deve ser inicializada** antes de subclasse usar seus membros.

```java
public class Veiculo {
    protected String marca;
    
    public Veiculo(String marca) {
        this.marca = marca;
        System.out.println("Veículo criado: " + marca);
    }
}

public class Carro extends Veiculo {
    private int portas;
    
    public Carro(String marca, int portas) {
        super(marca); // Inicializa marca primeiro
        this.portas = portas;
        System.out.println("Carro com " + portas + " portas");
    }
}

// Uso
Carro c = new Carro("Toyota", 4);
// Saída:
// Veículo criado: Toyota
// Carro com 4 portas
```

### 3. super() com Múltiplos Construtores

**Subclasse pode ter vários construtores**, cada um chama `super()`.

```java
public class Pessoa {
    protected String nome;
    protected int idade;
    
    // Construtor 1
    public Pessoa(String nome) {
        this.nome = nome;
    }
    
    // Construtor 2
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

public class Funcionario extends Pessoa {
    private double salario;
    
    // Construtor 1: chama Pessoa(String)
    public Funcionario(String nome) {
        super(nome);
        this.salario = 0.0;
    }
    
    // Construtor 2: chama Pessoa(String, int)
    public Funcionario(String nome, int idade, double salario) {
        super(nome, idade);
        this.salario = salario;
    }
}
```

### 4. super() vs this()

**`super()`**: Chama construtor da **superclasse**.
**`this()`**: Chama **outro construtor da mesma classe**.

```java
public class Funcionario extends Pessoa {
    private double salario;
    
    // Construtor 1: usa this()
    public Funcionario(String nome) {
        this(nome, 0.0); // Chama construtor 2
    }
    
    // Construtor 2: usa super()
    public Funcionario(String nome, double salario) {
        super(nome);     // Chama construtor de Pessoa
        this.salario = salario;
    }
}
```

**Apenas um** pode ser usado: `super()` **OU** `this()` (nunca ambos).

### 5. Passar Parâmetros para super()

**`super()` aceita parâmetros** conforme construtor da superclasse.

```java
public class Animal {
    protected String especie;
    protected int idade;
    
    public Animal(String especie, int idade) {
        this.especie = especie;
        this.idade = idade;
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    public Cachorro(String especie, int idade, String raca) {
        super(especie, idade); // Passa parâmetros
        this.raca = raca;
    }
}
```

### 6. super() em Hierarquias Profundas

**Cada nível chama construtor do nível acima**.

```java
// Nível 1
public class Animal {
    public Animal() {
        System.out.println("1. Construtor de Animal");
    }
}

// Nível 2
public class Mamifero extends Animal {
    public Mamifero() {
        super(); // Chama Animal()
        System.out.println("2. Construtor de Mamifero");
    }
}

// Nível 3
public class Cachorro extends Mamifero {
    public Cachorro() {
        super(); // Chama Mamifero()
        System.out.println("3. Construtor de Cachorro");
    }
}

// Uso
Cachorro c = new Cachorro();
// Saída:
// 1. Construtor de Animal
// 2. Construtor de Mamifero
// 3. Construtor de Cachorro
```

**Ordem de execução**: Superclasse → ... → Subclasse.

### 7. Erro: Superclasse Sem Construtor Padrão

**Se superclasse não tem construtor sem parâmetros**, `super()` deve ser **explícito**.

```java
public class Animal {
    protected String nome;
    
    // Apenas construtor com parâmetro
    public Animal(String nome) {
        this.nome = nome;
    }
}

public class Cachorro extends Animal {
    // ❌ ERRO: super() implícito procura Animal(), que não existe
    public Cachorro() {
        // Compilador insere super() implícito
    }
}

// ✅ Solução: chame super(nome) explicitamente
public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }
}
```

### 8. super() em Classes Abstratas

**Classes abstratas podem ter construtores** (chamados por subclasses).

```java
public abstract class Forma {
    protected String cor;
    
    // Construtor em classe abstrata
    protected Forma(String cor) {
        this.cor = cor;
    }
}

public class Circulo extends Forma {
    private double raio;
    
    public Circulo(String cor, double raio) {
        super(cor); // Chama construtor de Forma
        this.raio = raio;
    }
}

// ❌ Não pode instanciar Forma
// Forma f = new Forma("azul");

// ✅ Pode instanciar Circulo
Circulo c = new Circulo("azul", 5.0);
```

### 9. super() com Expressões

**Parâmetros de `super()` podem ser expressões**.

```java
public class Pessoa {
    protected String nome;
    
    public Pessoa(String nome) {
        this.nome = nome;
    }
}

public class Funcionario extends Pessoa {
    public Funcionario(String primeiroNome, String sobrenome) {
        super(primeiroNome + " " + sobrenome); // Expressão
    }
}

// Uso
Funcionario f = new Funcionario("João", "Silva");
// nome = "João Silva"
```

### 10. Construtores protected e super()

**Construtor `protected` permite herança**, mas impede instanciação externa.

```java
public class Base {
    protected String valor;
    
    // Construtor protected
    protected Base(String valor) {
        this.valor = valor;
    }
}

public class Derivada extends Base {
    public Derivada(String valor) {
        super(valor); // ✅ Subclasse pode chamar
    }
}

// ❌ NÃO pode instanciar Base (se em pacote diferente)
// Base b = new Base("teste");

// ✅ Pode instanciar Derivada
Derivada d = new Derivada("teste");
```

---

## Aplicabilidade

**Use `super()` quando**:
- **Inicializar atributos** da superclasse
- **Executar lógica** do construtor da superclasse
- **Superclasse não tem construtor padrão** (obrigatório)

**Use `this()` quando**:
- **Evitar duplicação** entre construtores
- **Delegar** para construtor mais completo

---

## Armadilhas

### 1. Esquecer super() Quando Necessário

```java
public class Animal {
    public Animal(String nome) {} // Sem construtor padrão
}

public class Cachorro extends Animal {
    // ❌ ERRO: super() procura Animal(), que não existe
    public Cachorro() {}
}

// ✅ Solução
public Cachorro(String nome) {
    super(nome);
}
```

### 2. super() Não É Primeira Linha

```java
public Funcionario(String nome, double salario) {
    // ❌ ERRO: super() não é primeira linha
    // this.salario = salario;
    // super(nome);
    
    // ✅ super() primeiro
    super(nome);
    this.salario = salario;
}
```

### 3. Usar super() E this() Juntos

```java
public Funcionario(String nome) {
    // ❌ ERRO: não pode usar ambos
    // super(nome);
    // this();
    
    // ✅ Apenas um
    this(nome, 0.0);
}
```

---

## Boas Práticas

### 1. Chame super() Explicitamente

```java
public Subclasse(String param) {
    super(param); // Clareza
}
```

### 2. Use this() Para Evitar Duplicação

```java
public Funcionario(String nome) {
    this(nome, 0.0); // Delega para construtor completo
}

public Funcionario(String nome, double salario) {
    super(nome);
    this.salario = salario;
}
```

### 3. Documente Construtores

```java
/**
 * Cria um Funcionario.
 * @param nome Nome (passado para Pessoa)
 * @param salario Salário do funcionário
 */
public Funcionario(String nome, double salario) {
    super(nome);
    this.salario = salario;
}
```

### 4. Inicialize Superclasse Primeiro

```java
public Subclasse(String param) {
    super(param);        // 1. Inicializa superclasse
    this.local = valor;  // 2. Inicializa subclasse
}
```

### 5. Use Expressões Quando Apropriado

```java
super(valor * 2);              // Cálculo
super(obj.getNome());          // Método
super(a != null ? a : "padrão"); // Ternário
```

---

## Resumo

**Chamada ao construtor da superclasse**:

**Sintaxe**:
```java
super(parametros); // Primeira linha do construtor
```

**Exemplo**:
```java
public class Pessoa {
    protected String nome;
    
    public Pessoa(String nome) {
        this.nome = nome;
    }
}

public class Funcionario extends Pessoa {
    private double salario;
    
    public Funcionario(String nome, double salario) {
        super(nome); // Chama Pessoa(String)
        this.salario = salario;
    }
}
```

**Regras**:
- **Primeira linha** do construtor
- **Apenas `super()` OU `this()`** (nunca ambos)
- **Obrigatório** se superclasse não tem construtor padrão

**super() vs this()**:
```java
super(params); // Chama construtor da SUPERCLASSE
this(params);  // Chama construtor da MESMA CLASSE
```

**Ordem de execução**:
```java
Animal → Mamifero → Cachorro
// Construtores executam de cima para baixo
```

**Erro comum**:
```java
public class Animal {
    public Animal(String nome) {} // Sem construtor padrão
}

public class Cachorro extends Animal {
    public Cachorro() {} // ❌ ERRO: super() procura Animal()
}

// ✅ Solução
public Cachorro(String nome) {
    super(nome);
}
```

**Com expressões**:
```java
super(nome + " " + sobrenome);
super(valor != null ? valor : "padrão");
```

**Regra de Ouro**: **`super()`** deve ser **primeira linha** do construtor. Se superclasse **não tem construtor padrão**, **DEVE** chamar **`super(parametros)`** explicitamente.
