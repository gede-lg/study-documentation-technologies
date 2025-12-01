# T3.01 - Referência à Superclasse com super

## Introdução

**`super`** é uma **palavra-chave** que referencia a **superclasse** imediata de um objeto.

**Usos**:
- **Acessar atributos** da superclasse (quando há shadowing)
- **Chamar métodos** da superclasse (mesmo sobrescritos)
- **Invocar construtor** da superclasse

```java
public class Animal {
    protected String nome = "Animal";
    
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    protected String nome = "Cachorro"; // Shadowing
    
    public void exibir() {
        System.out.println(this.nome);   // Cachorro
        System.out.println(super.nome);  // Animal
        
        super.emitirSom(); // Chama método de Animal
    }
}
```

---

## Fundamentos

### 1. Conceito de super

**`super` referencia a superclasse** imediata.

```java
public class Base {
    protected int valor = 10;
}

public class Derivada extends Base {
    protected int valor = 20; // Shadowing
    
    public void mostrar() {
        System.out.println(valor);       // 20 (this.valor)
        System.out.println(this.valor);  // 20 (Derivada)
        System.out.println(super.valor); // 10 (Base)
    }
}
```

**`super`** acessa **versão da superclasse**.

### 2. super vs this

**`this`**: Referencia **objeto atual** (instância da classe).
**`super`**: Referencia **superclasse** do objeto.

```java
public class Pessoa {
    protected String nome = "Pessoa";
    
    public void exibir() {
        System.out.println("Método de Pessoa");
    }
}

public class Funcionario extends Pessoa {
    protected String nome = "Funcionario";
    
    public void mostrar() {
        System.out.println(this.nome);   // Funcionario (próprio)
        System.out.println(super.nome);  // Pessoa (superclasse)
        
        this.exibir();   // Chama versão atual (Pessoa, se não sobrescrito)
        super.exibir();  // Chama versão de Pessoa
    }
}
```

### 3. Acesso a Atributos da Superclasse

**`super.atributo`** acessa atributo da superclasse.

```java
public class Veiculo {
    protected String marca = "Genérico";
    protected int ano = 2020;
}

public class Carro extends Veiculo {
    protected String marca = "Carro"; // Shadowing
    
    public void exibir() {
        System.out.println(marca);        // Carro
        System.out.println(this.marca);   // Carro
        System.out.println(super.marca);  // Genérico
        System.out.println(super.ano);    // 2020
    }
}
```

### 4. Acesso a Métodos da Superclasse

**`super.metodo()`** chama método da superclasse.

```java
public class Animal {
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
    
    public void testar() {
        emitirSom();       // Au au! (versão de Cachorro)
        this.emitirSom();  // Au au! (versão de Cachorro)
        super.emitirSom(); // Som genérico (versão de Animal)
    }
}
```

### 5. Chamada de Construtor com super()

**`super()`** chama construtor da superclasse.

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
        super(nome); // Chama construtor de Pessoa
        this.salario = salario;
    }
}
```

**Detalhado em arquivo separado** (04-chamada-construtor-super.md).

### 6. super Apenas para Superclasse Imediata

**`super` acessa apenas a superclasse direta**, não ancestrais distantes.

```java
// Nível 1
public class Animal {
    protected String tipo = "Animal";
}

// Nível 2
public class Mamifero extends Animal {
    protected String tipo = "Mamifero";
}

// Nível 3
public class Cachorro extends Mamifero {
    protected String tipo = "Cachorro";
    
    public void mostrar() {
        System.out.println(tipo);       // Cachorro
        System.out.println(super.tipo); // Mamifero (NÃO Animal)
        
        // Não há super.super.tipo (ERRO)
    }
}
```

**Não existe `super.super`**: Apenas uma camada acima.

### 7. super em Métodos Sobrescritos

**Comum chamar `super` em métodos sobrescritos**.

```java
public class ContaBancaria {
    protected double saldo;
    
    public void depositar(double valor) {
        saldo += valor;
        System.out.println("Depósito realizado");
    }
}

public class ContaPremium extends ContaBancaria {
    @Override
    public void depositar(double valor) {
        super.depositar(valor); // Chama versão da superclasse
        saldo += valor * 0.01;  // Bônus de 1%
        System.out.println("Bônus aplicado");
    }
}
```

**Reutiliza lógica** da superclasse e adiciona comportamento.

### 8. super Não Pode Ser Usado em Contextos Estáticos

**`super` requer instância** (não funciona em métodos `static`).

```java
public class Base {
    protected int valor = 10;
    
    public void metodo() {
        System.out.println("Base");
    }
}

public class Derivada extends Base {
    public static void testar() {
        // super.valor;  // ❌ ERRO (contexto estático)
        // super.metodo(); // ❌ ERRO (contexto estático)
    }
}
```

### 9. super em Construtores vs Métodos

**Em construtores**: `super()` chama construtor da superclasse.
**Em métodos**: `super.metodo()` chama método da superclasse.

```java
public class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public void exibir() {
        System.out.println("Animal: " + nome);
    }
}

public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome); // ← Chama construtor de Animal
    }
    
    @Override
    public void exibir() {
        super.exibir(); // ← Chama método de Animal
        System.out.println("Cachorro");
    }
}
```

### 10. Quando Usar super

**Use `super` quando**:
- **Shadowing**: Atributo com mesmo nome na subclasse
- **Sobrescrita**: Chamar versão original do método
- **Extensão**: Adicionar comportamento ao método sobrescrito
- **Construtor**: Inicializar superclasse

```java
public class Base {
    protected int valor = 10;
    
    public void processar() {
        System.out.println("Processando na Base");
    }
}

public class Derivada extends Base {
    protected int valor = 20; // Shadowing
    
    @Override
    public void processar() {
        super.processar();      // Chama versão de Base
        System.out.println("Processando na Derivada");
    }
    
    public void exibir() {
        System.out.println(super.valor); // Acessa valor de Base
    }
}
```

---

## Aplicabilidade

**Use `super` quando**:
- **Acessar membros** da superclasse (com shadowing)
- **Reutilizar lógica** da superclasse em método sobrescrito
- **Chamar construtor** da superclasse
- **Evitar duplicação** de código

**Não use `super` quando**:
- **Não há shadowing** ou sobrescrita (acesso direto funciona)
- **Contexto estático** (não tem instância)

---

## Armadilhas

### 1. Tentar Usar super.super

```java
public class A {
    protected int valor = 1;
}

public class B extends A {
    protected int valor = 2;
}

public class C extends B {
    public void teste() {
        System.out.println(super.valor);       // 2 (B)
        // System.out.println(super.super.valor); // ❌ ERRO
    }
}
```

**Solução**: `super` acessa apenas **uma camada** acima.

### 2. super em Contexto Estático

```java
public class Base {
    protected int valor = 10;
}

public class Derivada extends Base {
    public static void teste() {
        // super.valor; // ❌ ERRO (estático)
    }
}
```

### 3. Confundir super() com super.metodo()

```java
public Subclasse() {
    super();        // ← Chama CONSTRUTOR
}

public void metodo() {
    super.metodo(); // ← Chama MÉTODO
}
```

---

## Boas Práticas

### 1. Use super Para Reutilizar Lógica

```java
@Override
public void metodo() {
    super.metodo(); // Reutiliza lógica da superclasse
    // Código adicional
}
```

### 2. Evite Shadowing (Use super Quando Necessário)

```java
// ❌ Shadowing confuso
protected String nome; // Mesmo nome que superclasse

// ✅ Nome diferente
protected String nomeCompleto;

// ✅ Ou use super quando necessário
System.out.println(super.nome);
```

### 3. Documente Uso de super

```java
@Override
public void processar() {
    super.processar(); // Chama versão base antes de processar
    // Código adicional
}
```

### 4. Use super() em Construtores

```java
public Subclasse(String param) {
    super(param); // Inicializa superclasse
}
```

---

## Resumo

**Palavra-chave `super`**:

**Definição**: Referencia a **superclasse imediata**.

**Usos**:
```java
super.atributo;   // Acessa atributo da superclasse
super.metodo();   // Chama método da superclasse
super(params);    // Chama construtor da superclasse
```

**Exemplo**:
```java
public class Animal {
    protected String nome = "Animal";
    
    public void emitirSom() {
        System.out.println("Som");
    }
}

public class Cachorro extends Animal {
    protected String nome = "Cachorro"; // Shadowing
    
    @Override
    public void emitirSom() {
        super.emitirSom(); // Chama versão de Animal
        System.out.println("Au au!");
    }
    
    public void exibir() {
        System.out.println(nome);       // Cachorro
        System.out.println(super.nome); // Animal
    }
}
```

**`super` vs `this`**:
```java
this.atributo  → Atributo da classe atual
super.atributo → Atributo da superclasse

this.metodo()  → Método da classe atual
super.metodo() → Método da superclasse
```

**Limitações**:
- ❌ Não funciona em contexto **estático**
- ❌ Não existe **`super.super`** (apenas uma camada)
- ✅ Acessa apenas **superclasse imediata**

**Construtor**:
```java
public Subclasse(String param) {
    super(param); // Primeira linha
}
```

**Regra de Ouro**: Use **`super`** para acessar membros da **superclasse** quando há **shadowing** ou **sobrescrita**, e para **reutilizar lógica** da superclasse em métodos sobrescritos.
