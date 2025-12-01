# T2.02 - Definição de Subclasse

## Introdução

**Subclasse** (ou **classe filha**, **classe derivada**) é uma classe que **herda** de outra classe usando a palavra-chave `extends`.

**Características**:
- **Herda** atributos e métodos da superclasse
- **Adiciona** novos membros específicos
- **Sobrescreve** métodos herdados (opcional)
- **Especializa** comportamento da superclasse

```java
// Superclasse
public class Animal {
    protected String nome;
    
    public void respirar() {
        System.out.println("Respirando...");
    }
}

// Subclasse
public class Cachorro extends Animal {
    // Herda: nome, respirar()
    
    // Adiciona: latir()
    public void latir() {
        System.out.println("Au au!");
    }
}
```

---

## Fundamentos

### 1. Conceito de Subclasse

**Classe que herda de outra** usando `extends`.

```java
// Subclasse herda de Veiculo
public class Carro extends Veiculo {
    // Herda membros de Veiculo
    // Adiciona membros específicos de Carro
}
```

**Relação "é-um"**: Carro **é um** Veículo.

### 2. Declaração de Subclasse

**Sintaxe**: `class Subclasse extends Superclasse`

```java
// Superclasse
public class Pessoa {
    protected String nome;
    protected int idade;
    
    public void apresentar() {
        System.out.println("Olá, sou " + nome);
    }
}

// Subclasse
public class Funcionario extends Pessoa {
    private double salario;
    
    // Herda: nome, idade, apresentar()
    // Adiciona: salario
}
```

### 3. Herança de Membros

**Subclasse herda todos os membros** (exceto `private` não é acessível).

```java
public class Animal {
    public String especie;      // ✅ Herdado e acessível
    protected String nome;      // ✅ Herdado e acessível
    String habitat;             // ✅ Herdado e acessível (mesmo pacote)
    private int energia;        // ✅ Herdado mas NÃO acessível
    
    public void dormir() {}     // ✅ Herdado
    protected void comer() {}   // ✅ Herdado
    private void digerir() {}   // ✅ Herdado mas NÃO acessível
}

public class Cachorro extends Animal {
    public void teste() {
        especie = "Canis";      // ✅ Acessa
        nome = "Rex";           // ✅ Acessa
        habitat = "Casa";       // ✅ Acessa (mesmo pacote)
        // energia = 100;       // ❌ NÃO acessa (private)
        
        dormir();               // ✅ Acessa
        comer();                // ✅ Acessa
        // digerir();           // ❌ NÃO acessa (private)
    }
}
```

### 4. Adição de Novos Membros

**Subclasse adiciona membros específicos**.

```java
public class Forma {
    protected String cor;
    
    public void exibirCor() {
        System.out.println("Cor: " + cor);
    }
}

public class Circulo extends Forma {
    // Herda: cor, exibirCor()
    
    // Adiciona: raio
    private double raio;
    
    // Adiciona: calcularArea()
    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}
```

### 5. Sobrescrita de Métodos

**Subclasse pode sobrescrever** métodos herdados.

```java
public class Animal {
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    // Sobrescreve emitirSom()
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}

// Uso
Animal a = new Cachorro();
a.emitirSom(); // Au au! (versão de Cachorro)
```

### 6. Construtores na Subclasse

**Subclasse deve chamar construtor da superclasse**.

```java
public class Pessoa {
    protected String nome;
    
    public Pessoa(String nome) {
        this.nome = nome;
    }
}

public class Funcionario extends Pessoa {
    private double salario;
    
    // Construtor da subclasse
    public Funcionario(String nome, double salario) {
        super(nome); // Chama construtor de Pessoa
        this.salario = salario;
    }
}

// Uso
Funcionario f = new Funcionario("João", 5000.0);
```

**`super()`** deve ser **primeira linha** do construtor.

### 7. Acesso à Superclasse com super

**`super` referencia a superclasse**.

```java
public class Animal {
    public void mover() {
        System.out.println("Animal movendo");
    }
}

public class Cachorro extends Animal {
    @Override
    public void mover() {
        super.mover(); // Chama versão da superclasse
        System.out.println("Cachorro correndo");
    }
}

// Uso
Cachorro c = new Cachorro();
c.mover();
// Saída:
// Animal movendo
// Cachorro correndo
```

### 8. Subclasse Como Superclasse

**Subclasse pode ser superclasse de outra**.

```java
// Nível 1
public class Animal {
    public void respirar() {}
}

// Nível 2: Subclasse de Animal, superclasse de Cachorro
public class Mamifero extends Animal {
    public void amamentar() {}
}

// Nível 3: Subclasse de Mamifero
public class Cachorro extends Mamifero {
    public void latir() {}
}

// Cachorro herda: respirar() + amamentar() + latir()
```

### 9. Subclasse Abstrata

**Subclasse pode ser abstrata** (não precisa implementar todos métodos abstratos).

```java
public abstract class Animal {
    public abstract void emitirSom();
    public abstract void mover();
}

// Subclasse abstrata (implementa parcialmente)
public abstract class Mamifero extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Som de mamífero");
    }
    // Não implementa mover()
}

// Subclasse concreta (implementa tudo)
public class Cachorro extends Mamifero {
    @Override
    public void mover() {
        System.out.println("Correndo");
    }
}
```

### 10. Subclasse e Polimorfismo

**Subclasse pode ser referenciada como superclasse**.

```java
public class Animal {
    public void emitirSom() {
        System.out.println("Som");
    }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au");
    }
}

// Polimorfismo
Animal a1 = new Animal();    // Animal → Animal
Animal a2 = new Cachorro();  // Cachorro → Animal (upcasting)

a1.emitirSom(); // Som
a2.emitirSom(); // Au au (versão de Cachorro)
```

---

## Aplicabilidade

**Use subclasse quando**:
- **Especializar** comportamento existente
- **Reutilizar código** da superclasse
- **Relação "é-um"** existe (Cachorro **é um** Animal)
- **Adicionar funcionalidades** específicas

**Não use subclasse quando**:
- **Relação "tem-um"** (Carro **tem um** Motor → composição)
- **Apenas reutilizar código** sem relação semântica
- **Não há substituibilidade** (Princípio de Liskov)

---

## Armadilhas

### 1. Esquecer super() em Construtores

```java
public class Animal {
    public Animal(String nome) {}
}

public class Cachorro extends Animal {
    // ❌ ERRO: deve chamar super(nome)
    public Cachorro() {
        // Compilador insere super() sem parâmetros, mas não existe
    }
}

// ✅ Solução
public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }
}
```

### 2. Acessar Membros private da Superclasse

```java
public class Animal {
    private int energia; // Não acessível em subclasse
}

public class Cachorro extends Animal {
    public void gastarEnergia() {
        // energia -= 10; // ❌ ERRO
    }
}

// Solução: use protected ou getter/setter
public class Animal {
    protected int energia; // ✅ Acessível
    
    // Ou
    private int energia;
    protected int getEnergia() { return energia; }
    protected void setEnergia(int e) { energia = e; }
}
```

### 3. Sobrescrita Sem @Override

```java
public class Animal {
    public void emitirSom() {}
}

public class Cachorro extends Animal {
    // ❌ Typo: não sobrescreve (método diferente)
    public void emitirson() {}
}

// ✅ Use @Override (compilador verifica)
public class Cachorro extends Animal {
    @Override
    public void emitirSom() {} // Compilador verifica assinatura
}
```

### 4. Modificador Mais Restritivo na Sobrescrita

```java
public class Animal {
    public void mover() {}
}

public class Cachorro extends Animal {
    // ❌ ERRO: sobrescrita não pode ser menos acessível
    // protected void mover() {}
    
    // ✅ Deve ser public ou maior
    @Override
    public void mover() {}
}
```

---

## Boas Práticas

### 1. Sempre Use @Override

```java
@Override
public void metodo() {} // Garante sobrescrita correta
```

### 2. Chame super() Explicitamente

```java
public Subclasse(String param) {
    super(param); // Clareza
}
```

### 3. Documente a Herança

```java
/**
 * Cachorro é uma subclasse de Animal.
 * Herda respirar() e adiciona latir().
 */
public class Cachorro extends Animal {}
```

### 4. Mantenha Coesão

```java
// ✅ Subclasse coesa (tudo relacionado a Cachorro)
public class Cachorro extends Animal {
    private String raca;
    
    public void latir() {}
}

// ❌ Subclasse não coesa (mistura responsabilidades)
public class Cachorro extends Animal {
    private String raca;
    private Connection db; // Não relacionado
}
```

### 5. Prefira Composição Quando em Dúvida

```java
// ❌ Herança forçada
// public class Carro extends Motor {}

// ✅ Composição
public class Carro {
    private Motor motor;
}
```

---

## Resumo

**Subclasse (classe filha/derivada)**:

**Definição**: Classe que **herda** de outra usando `extends`.

**Sintaxe**:
```java
public class Subclasse extends Superclasse {
    // Código
}
```

**Exemplo**:
```java
// Superclasse
public class Animal {
    protected String nome;
    
    public void respirar() {
        System.out.println("Respirando");
    }
}

// Subclasse
public class Cachorro extends Animal {
    // Herda: nome, respirar()
    
    // Adiciona: latir()
    public void latir() {
        System.out.println("Au au!");
    }
}
```

**O que subclasse faz**:
- ✅ **Herda** atributos e métodos
- ✅ **Adiciona** novos membros
- ✅ **Sobrescreve** métodos (opcional)
- ✅ **Especializa** comportamento

**Construtores**:
```java
public Cachorro(String nome) {
    super(nome); // Chama construtor da superclasse
}
```

**Sobrescrita**:
```java
@Override
public void metodo() {
    super.metodo(); // Opcional: chama superclasse
    // Código adicional
}
```

**Visibilidade herdada**:
```java
public    → ✅ Herdado e acessível
protected → ✅ Herdado e acessível
default   → ✅ Herdado e acessível (mesmo pacote)
private   → ✅ Herdado mas NÃO acessível diretamente
```

**Regra de Ouro**: Subclasse **herda tudo** da superclasse, **adiciona** membros específicos, e pode **sobrescrever** métodos para especializar comportamento. Use `super()` para chamar construtor da superclasse e `@Override` para sobrescrever métodos.
