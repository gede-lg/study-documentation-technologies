# T2.06 - Construtores Não São Herdados

## Introdução

**Construtores NÃO são herdados** pelas subclasses. Cada classe deve definir seus **próprios construtores**.

**Por quê?**: Construtores têm **nome da classe**, logo subclasse não pode herdar construtor com nome diferente.

```java
public class Pessoa {
    protected String nome;
    
    // Construtor de Pessoa
    public Pessoa(String nome) {
        this.nome = nome;
    }
}

public class Funcionario extends Pessoa {
    private double salario;
    
    // ❌ NÃO herda construtor de Pessoa
    // Deve criar próprio construtor
    public Funcionario(String nome, double salario) {
        super(nome); // Chama construtor de Pessoa
        this.salario = salario;
    }
}
```

**`super()`**: Chama construtor da superclasse.

---

## Fundamentos

### 1. Construtores Não São Herdados

**Subclasse não herda construtores** da superclasse.

```java
public class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
}

public class Cachorro extends Animal {
    // ❌ NÃO existe construtor Cachorro() automaticamente
    // Deve criar explicitamente
}

// ❌ ERRO: Cachorro não tem construtor sem parâmetros
// Cachorro c = new Cachorro();

// ✅ Deve criar construtor
public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }
}
```

### 2. Chamada Implícita de super()

**Primeira linha do construtor** chama `super()` **implicitamente** (se não especificado).

```java
public class Animal {
    public Animal() {
        System.out.println("Construtor de Animal");
    }
}

public class Cachorro extends Animal {
    public Cachorro() {
        // super(); // ← Chamada implícita
        System.out.println("Construtor de Cachorro");
    }
}

// Uso
Cachorro c = new Cachorro();
// Saída:
// Construtor de Animal
// Construtor de Cachorro
```

### 3. Chamada Explícita de super()

**`super()`** chama construtor da superclasse **explicitamente**.

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

### 4. super() Deve Ser Primeira Linha

**`super()` deve ser primeira instrução** do construtor.

```java
public class Funcionario extends Pessoa {
    private double salario;
    
    public Funcionario(String nome, double salario) {
        // ❌ ERRO: super() não é primeira linha
        // this.salario = salario;
        // super(nome);
        
        // ✅ super() primeiro
        super(nome);
        this.salario = salario;
    }
}
```

**Razão**: Superclasse deve estar **inicializada** antes de subclasse.

### 5. Erro: Superclasse Sem Construtor Padrão

**Se superclasse não tem construtor sem parâmetros**, subclasse **deve chamar `super()` explicitamente**.

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
        // Compilador insere super() implícito, mas Animal() não existe
    }
}

// ✅ Solução: chame super(nome) explicitamente
public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }
}
```

### 6. Múltiplos Construtores

**Subclasse pode ter múltiplos construtores**, cada um chama `super()` ou `this()`.

```java
public class Pessoa {
    protected String nome;
    protected int idade;
    
    public Pessoa(String nome) {
        this.nome = nome;
    }
    
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

public class Funcionario extends Pessoa {
    private double salario;
    
    // Construtor 1
    public Funcionario(String nome) {
        super(nome); // Chama Pessoa(String)
        this.salario = 0.0;
    }
    
    // Construtor 2
    public Funcionario(String nome, int idade, double salario) {
        super(nome, idade); // Chama Pessoa(String, int)
        this.salario = salario;
    }
}
```

### 7. this() vs super()

**`this()`**: Chama **outro construtor da mesma classe**.
**`super()`**: Chama **construtor da superclasse**.

```java
public class Funcionario extends Pessoa {
    private double salario;
    
    // Construtor 1
    public Funcionario(String nome) {
        this(nome, 0.0); // Chama construtor 2
    }
    
    // Construtor 2
    public Funcionario(String nome, double salario) {
        super(nome);     // Chama construtor de Pessoa
        this.salario = salario;
    }
}
```

**Apenas um** pode ser usado: `this()` **OU** `super()` (nunca ambos no mesmo construtor).

### 8. Construtores em Hierarquias Profundas

**Cada nível chama construtor do nível acima**.

```java
// Nível 1
public class Animal {
    public Animal() {
        System.out.println("Construtor de Animal");
    }
}

// Nível 2
public class Mamifero extends Animal {
    public Mamifero() {
        super(); // Chama Animal()
        System.out.println("Construtor de Mamifero");
    }
}

// Nível 3
public class Cachorro extends Mamifero {
    public Cachorro() {
        super(); // Chama Mamifero()
        System.out.println("Construtor de Cachorro");
    }
}

// Uso
Cachorro c = new Cachorro();
// Saída:
// Construtor de Animal
// Construtor de Mamifero
// Construtor de Cachorro
```

**Ordem**: Superclasse → ... → Subclasse.

### 9. Construtores em Classes Abstratas

**Classes abstratas podem ter construtores** (chamados por subclasses).

```java
public abstract class Animal {
    protected String nome;
    
    // Construtor em classe abstrata
    protected Animal(String nome) {
        this.nome = nome;
    }
}

public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome); // Chama construtor de Animal
    }
}

// ❌ Não pode instanciar Animal
// Animal a = new Animal("Rex");

// ✅ Pode instanciar Cachorro
Cachorro c = new Cachorro("Rex");
```

### 10. Construtores protected

**Construtor `protected`** permite herança, mas **impede instanciação externa**.

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
// Base b = new Base("Teste");

// ✅ Pode instanciar Derivada
Derivada d = new Derivada("Teste");
```

---

## Aplicabilidade

**Use `super()` quando**:
- **Inicializar atributos** da superclasse
- **Chamar lógica** do construtor da superclasse
- **Superclasse não tem construtor padrão**

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
    // ❌ ERRO: super() implícito procura Animal(), que não existe
    public Cachorro() {}
}

// ✅ Solução
public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }
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

### 3. Usar this() E super() Juntos

```java
public Funcionario(String nome, double salario) {
    // ❌ ERRO: não pode usar ambos
    // super(nome);
    // this();
    
    // ✅ Apenas um
    super(nome);
}
```

### 4. Chamar super() Múltiplas Vezes

```java
public Funcionario(String nome, double salario) {
    super(nome);
    // super(nome); // ❌ ERRO: apenas uma vez
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
    super(param);      // ✅ Primeiro: inicializa superclasse
    this.local = valor; // Depois: inicializa subclasse
}
```

### 5. Use protected em Construtores de Classes Base

```java
protected Base(String valor) {
    this.valor = valor;
}
```

---

## Resumo

**Construtores não são herdados**:

**Regra**: Subclasse **NÃO herda** construtores da superclasse.

**Exemplo**:
```java
public class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
}

public class Cachorro extends Animal {
    // ❌ NÃO herda Animal(String)
    // Deve criar próprio construtor
    public Cachorro(String nome) {
        super(nome); // Chama construtor de Animal
    }
}
```

**`super()`**: Chama construtor da superclasse
```java
super(parametros); // Primeira linha do construtor
```

**Chamada implícita**:
```java
public Cachorro() {
    // super(); ← Implícito (se não especificado)
}
```

**`this()` vs `super()`**:
```java
this(params);  // Chama construtor da MESMA classe
super(params); // Chama construtor da SUPERCLASSE
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
    public Cachorro() {} // ❌ ERRO: super() procura Animal(), que não existe
}

// ✅ Solução
public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }
}
```

**Regra de Ouro**: **`super()`** deve ser **primeira linha** do construtor. Se superclasse **não tem construtor padrão**, subclasse **DEVE** chamar **`super(parametros)`** explicitamente.
