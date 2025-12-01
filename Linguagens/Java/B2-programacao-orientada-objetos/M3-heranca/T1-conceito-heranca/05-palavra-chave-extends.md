# T1.05 - Palavra-chave extends

## Introdução

**`extends`** é a palavra-chave que **declara herança** em Java.

**Sintaxe**: `class Subclasse extends Superclasse`

```java
// Animal é a superclasse
public class Animal {
    public void respirar() {
        System.out.println("Respirando...");
    }
}

// Cachorro herda de Animal usando extends
public class Cachorro extends Animal {
    public void latir() {
        System.out.println("Au au!");
    }
}
```

**`extends`** estabelece **relação de herança**: Cachorro herda tudo de Animal.

---

## Fundamentos

### 1. Sintaxe Básica

```java
public class Superclasse {
    // Código da superclasse
}

public class Subclasse extends Superclasse {
    // Subclasse herda de Superclasse
}
```

**Palavras-chave**:
- `class`: Declara classe
- `extends`: Declara herança
- Nome da superclasse após `extends`

### 2. Herança Simples

**Java permite apenas uma superclasse** por classe.

```java
// ✅ Correto: uma superclasse
public class Cachorro extends Animal {}

// ❌ Erro: múltiplas superclasses
// public class Cachorro extends Animal, Mamifero {}
```

**Herança múltipla de classes não é permitida** (evita problema do diamante).

### 3. Herança de Atributos

**Subclasse herda atributos** da superclasse.

```java
public class Pessoa {
    protected String nome;
    protected int idade;
}

public class Funcionario extends Pessoa {
    private double salario;
    
    public void exibir() {
        System.out.println(nome);  // ✅ Herdado de Pessoa
        System.out.println(idade); // ✅ Herdado de Pessoa
        System.out.println(salario);
    }
}
```

### 4. Herança de Métodos

**Subclasse herda métodos** da superclasse.

```java
public class Animal {
    public void respirar() {
        System.out.println("Respirando");
    }
    
    public void dormir() {
        System.out.println("Dormindo");
    }
}

public class Cachorro extends Animal {
    // Herda respirar() e dormir()
}

// Uso
Cachorro c = new Cachorro();
c.respirar(); // ✅ Método herdado
c.dormir();   // ✅ Método herdado
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
    @Override
    public void emitirSom() {
        System.out.println("Au au!"); // Sobrescreve
    }
}

// Uso
Animal a = new Cachorro();
a.emitirSom(); // Au au! (versão sobrescrita)
```

### 6. Construtores e extends

**Construtores não são herdados**, mas podem ser chamados com `super()`.

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
        super(nome); // Chama construtor de Animal
        this.raca = raca;
    }
}
```

**Primeira linha** do construtor deve chamar `super()` ou `this()` (implícito se omitido).

### 7. extends com Modificadores de Acesso

**Subclasse pode ser mais permissiva**, mas **não mais restritiva**.

```java
// ✅ Superclasse package-private, subclasse public
class Animal {}
public class Cachorro extends Animal {}

// ✅ Superclasse public, subclasse public
public class Animal {}
public class Cachorro extends Animal {}

// ❌ Erro: subclasse não pode ser menos acessível
public class Animal {}
class Cachorro extends Animal {} // Erro se em arquivo diferente
```

### 8. extends e Classes Abstratas

**Classe abstrata pode ser estendida**.

```java
public abstract class Animal {
    public abstract void emitirSom();
    
    public void respirar() {
        System.out.println("Respirando");
    }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}
```

**Subclasse concreta** deve implementar **todos métodos abstratos**.

### 9. extends e Classes final

**Classe `final` não pode ser estendida**.

```java
// Classe final
public final class String {
    // ...
}

// ❌ Erro: não pode estender classe final
// public class MinhaString extends String {}
```

**Uso**: Prevenir herança (segurança, design).

### 10. Cadeia de Herança com extends

**Uma classe pode estender outra que já estende**.

```java
// Nível 1
public class Animal {
    public void respirar() {}
}

// Nível 2
public class Mamifero extends Animal {
    public void amamentar() {}
}

// Nível 3
public class Cachorro extends Mamifero {
    public void latir() {}
}

// Cachorro herda: respirar() + amamentar() + latir()
```

---

## Aplicabilidade

**Use `extends` quando**:
- **Relação "é-um"** clara (Cachorro **é um** Animal)
- **Reutilizar código** da superclasse
- **Especializar** comportamento existente
- **Criar hierarquia** de classes

**Não use `extends` quando**:
- **Relação "tem-um"** (Carro **tem um** Motor → composição)
- **Herança múltipla** necessária (use interfaces)
- **Classe é `final`** (não pode ser estendida)

---

## Armadilhas

### 1. Tentar Estender Múltiplas Classes

```java
// ❌ Erro: herança múltipla não permitida
// public class Cachorro extends Animal, Mamifero {}

// ✅ Use interfaces
public class Cachorro extends Animal implements Nadador, Corredor {}
```

### 2. Estender Classe final

```java
public final class Util {}

// ❌ Erro: não pode estender final
// public class MinhaUtil extends Util {}
```

### 3. Esquecer super() em Construtores

```java
public class Animal {
    public Animal(String nome) {}
}

public class Cachorro extends Animal {
    // ❌ Erro: deve chamar super(nome)
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

### 4. Modificador de Acesso Mais Restritivo

```java
public class Animal {
    public void mover() {}
}

public class Cachorro extends Animal {
    // ❌ Erro: sobrescrita não pode ser menos acessível
    // protected void mover() {}
    
    // ✅ Deve ser public ou maior
    @Override
    public void mover() {}
}
```

---

## Boas Práticas

### 1. Sempre Use @Override Ao Sobrescrever

```java
public class Cachorro extends Animal {
    @Override // ✅ Compilador verifica
    public void emitirSom() {}
}
```

### 2. Documente a Hierarquia

```java
/**
 * Cachorro é uma subclasse de Animal.
 * Herda respirar() e dormir().
 */
public class Cachorro extends Animal {}
```

### 3. Prefira Composição Quando em Dúvida

```java
// ❌ Herança forçada
// public class Carro extends Motor {}

// ✅ Composição
public class Carro {
    private Motor motor;
}
```

### 4. Evite Hierarquias Profundas

```java
// ❌ Muito profundo
Animal → Vertebrado → Mamifero → Carnivoro → Felino → Gato

// ✅ Mais raso
Animal → Gato
```

### 5. Use extends Para Relações "é-um"

```java
// ✅ Gerente É UM Funcionário
public class Gerente extends Funcionario {}
```

---

## Resumo

**Palavra-chave `extends`**:

**Sintaxe**:
```java
public class Subclasse extends Superclasse {
    // Código
}
```

**O que `extends` faz**:
- Declara **herança**
- Subclasse **herda** atributos e métodos da superclasse
- Permite **sobrescrita** de métodos
- Estabelece **relação "é-um"**

**Exemplo básico**:
```java
public class Animal {
    public void respirar() {
        System.out.println("Respirando");
    }
}

public class Cachorro extends Animal {
    // Herda respirar()
    
    public void latir() {
        System.out.println("Au au!");
    }
}

// Uso
Cachorro c = new Cachorro();
c.respirar(); // Herdado
c.latir();    // Próprio
```

**Regras**:
- **Uma única superclasse** por classe (herança simples)
- **Construtores não herdados** (use `super()`)
- **Classes `final` não podem ser estendidas**
- **Subclasse pode sobrescrever** métodos (use `@Override`)

**Construtores**:
```java
public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome); // Chama construtor de Animal
    }
}
```

**Sobrescrita**:
```java
@Override
public void metodo() {
    super.metodo(); // Opcional: chama versão da superclasse
    // Código adicional
}
```

**Regra de Ouro**: Use `extends` **APENAS** para **relações "é-um"** claras. Java permite **apenas uma superclasse** (herança simples), mas **múltiplas interfaces** (use `implements` para isso).
