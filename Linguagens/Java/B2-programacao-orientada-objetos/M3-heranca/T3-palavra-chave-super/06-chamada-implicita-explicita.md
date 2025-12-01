# T3.06 - Chamada Implícita vs Explícita de super()

## Introdução

**Java permite chamar `super()` de duas formas**:
- **Implícita**: Compilador insere automaticamente
- **Explícita**: Desenvolvedor escreve manualmente

**Chamada implícita**: Se construtor **NÃO** possui `super()` ou `this()`, compilador adiciona `super()` sem parâmetros.

```java
public class Animal {
    public Animal() {
        System.out.println("Construtor de Animal");
    }
}

public class Cachorro extends Animal {
    // Chamada IMPLÍCITA
    public Cachorro() {
        // super(); ← Compilador adiciona automaticamente
        System.out.println("Construtor de Cachorro");
    }
}

// Uso
Cachorro c = new Cachorro();
// Saída:
// Construtor de Animal
// Construtor de Cachorro
```

**Chamada explícita**: Desenvolvedor **escreve `super()`** manualmente.

```java
public class Cachorro extends Animal {
    // Chamada EXPLÍCITA
    public Cachorro() {
        super();  // ← Escrito manualmente
        System.out.println("Construtor de Cachorro");
    }
}
```

---

## Fundamentos

### 1. Chamada Implícita de super()

**Compilador insere `super()` automaticamente** se:
- Construtor **NÃO** possui `super()` explícito
- Construtor **NÃO** possui `this()`

```java
public class Pessoa {
    public Pessoa() {
        System.out.println("Pessoa criada");
    }
}

public class Funcionario extends Pessoa {
    // Equivalente a:
    public Funcionario() {
        // super(); ← IMPLÍCITO
        System.out.println("Funcionário criado");
    }
}
```

### 2. Chamada Explícita de super()

**Desenvolvedor escreve `super()`** quando:
- Quer **passar parâmetros** para construtor da superclasse
- Quer **deixar claro** que está chamando superclasse
- Superclasse **NÃO** possui construtor padrão

```java
public class Pessoa {
    protected String nome;
    
    public Pessoa(String nome) {
        this.nome = nome;
    }
}

public class Funcionario extends Pessoa {
    private double salario;
    
    // EXPLÍCITO: passa parâmetro
    public Funcionario(String nome, double salario) {
        super(nome);  // ← EXPLÍCITO
        this.salario = salario;
    }
}
```

### 3. Quando Implícita NÃO Funciona

**Chamada implícita FALHA** se superclasse **NÃO** possui construtor padrão.

```java
public class Veiculo {
    protected String marca;
    
    // Apenas construtor com parâmetro
    public Veiculo(String marca) {
        this.marca = marca;
    }
}

// ❌ ERRO: Veiculo não tem construtor padrão
/*
public class Carro extends Veiculo {
    public Carro() {
        // super(); ← IMPLÍCITO, mas Veiculo() não existe
    }
}
*/

// ✅ CORRETO: super() explícito com parâmetro
public class Carro extends Veiculo {
    public Carro(String marca) {
        super(marca); // ← EXPLÍCITO
    }
}
```

### 4. super() vs this()

**`this()` impede chamada implícita** de `super()`.

```java
public class Funcionario extends Pessoa {
    private double salario;
    
    // Construtor 1
    public Funcionario(String nome) {
        this(nome, 0.0); // ← Chama construtor 2 (impede super() implícito)
    }
    
    // Construtor 2
    public Funcionario(String nome, double salario) {
        super(nome);     // ← EXPLÍCITO
        this.salario = salario;
    }
}
```

**Ordem**:
```
Funcionario("João") → this("João", 0.0) → super("João")
```

### 5. Hierarquia de Chamadas

**Chamada `super()` percorre hierarquia** de baixo para cima.

```java
public class Animal {
    public Animal() {
        System.out.println("1. Animal");
    }
}

public class Mamifero extends Animal {
    public Mamifero() {
        // super(); ← IMPLÍCITO: chama Animal()
        System.out.println("2. Mamífero");
    }
}

public class Cachorro extends Mamifero {
    public Cachorro() {
        // super(); ← IMPLÍCITO: chama Mamifero()
        System.out.println("3. Cachorro");
    }
}

// Uso
Cachorro c = new Cachorro();
// Saída:
// 1. Animal
// 2. Mamífero
// 3. Cachorro
```

### 6. Explícito Com Parâmetros

**Parâmetros exigem `super()` explícito**.

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
    
    // EXPLÍCITO: passa parâmetros
    public Funcionario(String nome, int idade, double salario) {
        super(nome, idade); // ← EXPLÍCITO
        this.salario = salario;
    }
}
```

### 7. Escolha do Construtor da Superclasse

**`super()` escolhe construtor** por **quantidade e tipo** de parâmetros.

```java
public class Animal {
    protected String nome;
    
    // Construtor 1
    public Animal() {
        this.nome = "Sem nome";
    }
    
    // Construtor 2
    public Animal(String nome) {
        this.nome = nome;
    }
}

public class Cachorro extends Animal {
    public Cachorro() {
        super();        // ← Chama Animal()
    }
    
    public Cachorro(String nome) {
        super(nome);    // ← Chama Animal(String)
    }
}
```

### 8. Implícito em Construtores Derivados

**Cada construtor** da cadeia de herança **chama `super()` implicitamente**.

```java
public class A {
    public A() {
        System.out.println("A");
    }
}

public class B extends A {
    public B() {
        // super(); ← IMPLÍCITO
        System.out.println("B");
    }
}

public class C extends B {
    public C() {
        // super(); ← IMPLÍCITO
        System.out.println("C");
    }
}

// Uso
C obj = new C();
// Saída:
// A
// B
// C
```

### 9. super() em Classes Abstratas

**Classes abstratas também chamam `super()`** (implícito ou explícito).

```java
public abstract class Forma {
    protected String cor;
    
    public Forma(String cor) {
        this.cor = cor;
    }
}

public class Circulo extends Forma {
    private double raio;
    
    public Circulo(String cor, double raio) {
        super(cor); // ← EXPLÍCITO
        this.raio = raio;
    }
}
```

### 10. Object e super()

**Toda classe** (exceto `Object`) **chama `super()`** direta ou indiretamente.

```java
// Implicitamente, toda classe estende Object
public class MinhaClasse {
    public MinhaClasse() {
        // super(); ← Chama Object()
    }
}
```

**Hierarquia completa**:
```java
public class Animal {
    public Animal() {
        // super(); ← Chama Object()
    }
}

public class Cachorro extends Animal {
    public Cachorro() {
        // super(); ← Chama Animal()
    }
}

// Cachorro() → Animal() → Object()
```

---

## Aplicabilidade

**Use `super()` IMPLÍCITO**:
- Superclasse possui **construtor padrão** (sem parâmetros)
- **Não** precisa passar parâmetros
- Quer **código conciso**

**Use `super()` EXPLÍCITO**:
- Superclasse **NÃO** possui construtor padrão
- Precisa **passar parâmetros**
- Quer **deixar claro** a chamada (boas práticas)
- Múltiplos construtores na superclasse

---

## Armadilhas

### 1. Superclasse Sem Construtor Padrão

```java
public class Animal {
    public Animal(String nome) { }
}

// ❌ ERRO: super() implícito não encontra Animal()
/*
public class Cachorro extends Animal {
    public Cachorro() {
        // super(); ← IMPLÍCITO, mas Animal() não existe
    }
}
*/

// ✅ CORRETO: super() explícito
public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }
}
```

### 2. Esquecer super() Explícito

```java
public class Pessoa {
    protected String nome;
    
    public Pessoa(String nome) {
        this.nome = nome;
    }
}

// ❌ ERRO: Pessoa não tem construtor padrão
/*
public class Funcionario extends Pessoa {
    public Funcionario() {
        // super(); ← IMPLÍCITO (não existe)
    }
}
*/

// ✅ CORRETO
public class Funcionario extends Pessoa {
    public Funcionario(String nome) {
        super(nome);
    }
}
```

### 3. this() e super() Juntos

```java
// ❌ ERRO: não pode usar ambos
/*
public Funcionario(String nome) {
    super(nome);
    this();  // ERRO
}
*/

// ✅ CORRETO: apenas um
public Funcionario(String nome) {
    this(nome, 0.0);
}

public Funcionario(String nome, double salario) {
    super(nome);
    this.salario = salario;
}
```

### 4. Ordem de Execução

**super() executa ANTES** de qualquer código do construtor.

```java
public Cachorro() {
    System.out.println("Antes"); // ❌ ERRO: antes de super()
    super();
}

// ✅ CORRETO
public Cachorro() {
    super();
    System.out.println("Depois");
}
```

---

## Boas Práticas

### 1. Prefira Explícito Para Clareza

```java
// ✅ Explícito (mais claro)
public Cachorro() {
    super();  // ← Claro que chama Animal()
}

// ✅ Implícito (conciso)
public Cachorro() {
    // super() implícito
}
```

### 2. Sempre Explícito Com Parâmetros

```java
public Cachorro(String nome) {
    super(nome); // ✅ Sempre explícito
}
```

### 3. Documente Chamadas Complexas

```java
// Chama construtor de Animal com nome padrão
public Cachorro() {
    super("Desconhecido");
}
```

### 4. Valide Parâmetros Antes de super()

```java
public Funcionario(String nome, double salario) {
    // Validação em expressão
    super(nome != null ? nome : "Sem nome");
    this.salario = salario > 0 ? salario : 0.0;
}
```

### 5. Use this() Para Delegar Entre Construtores

```java
public Funcionario(String nome) {
    this(nome, 0.0); // Delega para outro construtor
}

public Funcionario(String nome, double salario) {
    super(nome);
    this.salario = salario;
}
```

---

## Resumo

**Chamada Implícita**:
```java
public Cachorro() {
    // super(); ← IMPLÍCITO (compilador adiciona)
}
```

**Chamada Explícita**:
```java
public Cachorro(String nome) {
    super(nome); // ← EXPLÍCITO (desenvolvedor escreve)
}
```

**Quando usar IMPLÍCITO**:
- Superclasse tem **construtor padrão**
- **Não** precisa passar parâmetros

**Quando usar EXPLÍCITO**:
- Superclasse **NÃO** tem construtor padrão
- Precisa **passar parâmetros**
- Quer **clareza** no código

**Regras**:
- `super()` ou `this()` **DEVE ser primeira instrução**
- **Apenas um** (`super()` OU `this()`)
- **Implícito** se não especificado

**Hierarquia**:
```java
Cachorro() → super() → Mamifero() → super() → Animal() → super() → Object()
```

**Escolha do construtor**:
```java
super();        // Construtor sem parâmetros
super(nome);    // Construtor com String
super(a, b);    // Construtor com 2 parâmetros
```

**Erro comum**:
```java
// ❌ Superclasse sem construtor padrão
public class Animal {
    public Animal(String nome) { }
}

public class Cachorro extends Animal {
    public Cachorro() {
        // super(); ← ERRO: Animal() não existe
    }
}

// ✅ Correto
public Cachorro(String nome) {
    super(nome);
}
```

**Regra de Ouro**: Se superclasse **NÃO** tem construtor padrão, **DEVE** usar `super()` **explícito** com parâmetros. Caso contrário, `super()` **implícito** funciona automaticamente.
