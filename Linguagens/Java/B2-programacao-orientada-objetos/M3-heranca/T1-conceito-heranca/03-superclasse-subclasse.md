# T1.03 - Superclasse e Subclasse

## Introdução

**Superclasse** (classe pai/base) e **subclasse** (classe filha/derivada) são termos que descrevem **relação de herança**.

**Superclasse**: Classe **mais genérica**, contém código **comum**.
**Subclasse**: Classe **mais específica**, **herda** da superclasse e adiciona **especialização**.

```java
// Superclasse (pai)
public class Animal {
    public void respirar() {
        System.out.println("Respirando...");
    }
}

// Subclasse (filha)
public class Cachorro extends Animal {
    // Herda respirar()
    public void latir() {
        System.out.println("Au au!");
    }
}
```

**Cachorro** herda tudo de **Animal** e adiciona `latir()`.

---

## Fundamentos

### 1. Definição de Superclasse

**Classe que fornece código** para outras classes.

```java
// Superclasse
public class Veiculo {
    protected String marca;
    protected String modelo;
    
    public void ligar() {
        System.out.println("Veículo ligado");
    }
    
    public void desligar() {
        System.out.println("Veículo desligado");
    }
}
```

**Características**:
- Contém **atributos e métodos comuns**
- Pode ser **abstrata** ou **concreta**
- **Não conhece** suas subclasses

### 2. Definição de Subclasse

**Classe que herda de outra** usando `extends`.

```java
// Subclasse
public class Carro extends Veiculo {
    private int portas;
    
    // Herda marca, modelo, ligar(), desligar()
    
    // Adiciona comportamento específico
    public void abrirPorta() {
        System.out.println("Porta aberta");
    }
}
```

**Características**:
- **Herda** atributos e métodos da superclasse
- **Adiciona** novos membros
- Pode **sobrescrever** métodos herdados

### 3. Herança de Atributos

**Subclasse herda atributos** da superclasse (exceto `private`).

```java
public class Pessoa {
    protected String nome;      // Herdável
    private String cpf;         // Não herdável
    public int idade;           // Herdável
}

public class Funcionario extends Pessoa {
    private double salario;
    
    public void exibir() {
        System.out.println(nome);   // ✅ Acessa (protected)
        System.out.println(idade);  // ✅ Acessa (public)
        // System.out.println(cpf); // ❌ Não acessa (private)
    }
}
```

**Visibilidade**:
- `public`: Herdado e acessível
- `protected`: Herdado e acessível
- **`private`: Herdado mas NÃO acessível diretamente**

### 4. Herança de Métodos

**Subclasse herda métodos** da superclasse (exceto `private`).

```java
public class Animal {
    public void dormir() {
        System.out.println("Dormindo...");
    }
    
    private void digerir() {
        System.out.println("Digerindo...");
    }
}

public class Cachorro extends Animal {
    public void teste() {
        dormir();   // ✅ Herdado (public)
        // digerir(); // ❌ Não acessível (private)
    }
}

// Uso
Cachorro c = new Cachorro();
c.dormir(); // ✅ Método herdado
```

### 5. Construtores NÃO São Herdados

**Construtores da superclasse não são herdados**, mas podem ser **invocados** com `super()`.

```java
public class Pessoa {
    protected String nome;
    
    public Pessoa(String nome) {
        this.nome = nome;
    }
}

public class Funcionario extends Pessoa {
    private double salario;
    
    // ❌ Não herda construtor de Pessoa
    // Deve chamar super() explicitamente
    public Funcionario(String nome, double salario) {
        super(nome); // Chama construtor da superclasse
        this.salario = salario;
    }
}
```

**Regra**: Primeira linha do construtor da subclasse **deve chamar** `super()` ou `this()` (implícito se omitido).

### 6. Sobrescrita de Métodos

**Subclasse pode sobrescrever** métodos da superclasse.

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
a.emitirSom(); // Au au! (versão de Cachorro)
```

**`@Override`**: Anotação que garante sobrescrita correta.

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
        System.out.println("Cachorro movendo");
    }
}

// Uso
Cachorro c = new Cachorro();
c.mover();
// Saída:
// Animal movendo
// Cachorro movendo
```

### 8. Tipos de Superclasses

#### Superclasse Concreta

```java
// Concreta (pode ser instanciada)
public class Veiculo {
    public void mover() {
        System.out.println("Movendo");
    }
}

Veiculo v = new Veiculo(); // ✅ Instanciável
```

#### Superclasse Abstrata

```java
// Abstrata (não pode ser instanciada)
public abstract class Animal {
    public abstract void emitirSom();
}

// Animal a = new Animal(); // ❌ Erro
```

### 9. Cadeia de Herança

**Subclasse pode ser superclasse de outra**.

```java
// Superclasse de Mamifero
public class Animal {
    public void respirar() {}
}

// Subclasse de Animal, superclasse de Cachorro
public class Mamifero extends Animal {
    public void amamentar() {}
}

// Subclasse de Mamifero
public class Cachorro extends Mamifero {
    public void latir() {}
}

// Cachorro herda: respirar() + amamentar() + latir()
```

### 10. Relação Um-para-Muitos

**Uma superclasse pode ter múltiplas subclasses**.

```java
// Uma superclasse
public class Forma {
    protected String cor;
    
    public void exibirCor() {
        System.out.println("Cor: " + cor);
    }
}

// Múltiplas subclasses
public class Circulo extends Forma {
    private double raio;
}

public class Quadrado extends Forma {
    private double lado;
}

public class Triangulo extends Forma {
    private double base;
    private double altura;
}
```

---

## Aplicabilidade

**Use superclasse quando**:
- **Código comum** em múltiplas classes
- **Comportamento genérico** compartilhado
- **Hierarquia natural** (Animal → Cachorro)

**Use subclasse quando**:
- **Especializar** comportamento existente
- **Adicionar** funcionalidades específicas
- **Reutilizar** código da superclasse

---

## Armadilhas

### 1. Atributos private Não São Acessíveis

```java
public class Pessoa {
    private String cpf; // Não acessível em Funcionario
}

public class Funcionario extends Pessoa {
    public void teste() {
        // System.out.println(cpf); // ❌ Erro
    }
}

// Solução: use protected ou getter
public class Pessoa {
    protected String cpf; // ✅ Acessível em Funcionario
}
```

### 2. Esquecer super() em Construtores

```java
public class Animal {
    public Animal(String nome) {}
}

public class Cachorro extends Animal {
    // ❌ Erro: deve chamar super(nome)
    public Cachorro() {
        // Compilador insere super() implícito, mas Animal não tem construtor sem parâmetros
    }
}

// Solução
public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome); // ✅
    }
}
```

### 3. Sobrescrita Sem @Override

```java
public class Animal {
    public void emitirSom() {}
}

public class Cachorro extends Animal {
    // ❌ Typo: emitirSom (não sobrescreve)
    public void emitirson() {}
}

// Solução: use @Override
public class Cachorro extends Animal {
    @Override
    public void emitirSom() {} // ✅ Compilador verifica
}
```

---

## Boas Práticas

### 1. Use protected Para Atributos Herdados

```java
public class Animal {
    protected String nome; // Subclasses acessam
}
```

### 2. Sempre Use @Override

```java
@Override
public void metodo() {} // Garante sobrescrita correta
```

### 3. Chame super() Explicitamente

```java
public Subclasse(String param) {
    super(param); // Clareza
}
```

### 4. Documente Contratos

```java
/**
 * Superclasse para todos os veículos.
 * Subclasses devem implementar mover().
 */
public abstract class Veiculo {}
```

### 5. Evite Expor Detalhes Internos

```java
// ❌ Expõe implementação
public class Animal {
    public List<String> orgaosInternos;
}

// ✅ Encapsula
public class Animal {
    private List<String> orgaosInternos;
    
    public List<String> getOrgaos() {
        return new ArrayList<>(orgaosInternos);
    }
}
```

---

## Resumo

**Superclasse e Subclasse**:

**Definições**:
- **Superclasse** (pai): Fornece código comum
- **Subclasse** (filha): Herda e especializa

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
    // Herda nome, respirar()
    
    public void latir() {
        System.out.println("Au au!");
    }
}
```

**O que é herdado**:
- ✅ Atributos `public` e `protected`
- ✅ Métodos `public` e `protected`
- ❌ Construtores (mas podem ser chamados com `super()`)
- ❌ Membros `private` (existem mas não são acessíveis)

**Palavras-chave**:
- `extends`: Declara herança
- `super`: Referencia superclasse
- `@Override`: Garante sobrescrita

**Relação**:
```
Superclasse (1) ──────> (N) Subclasses
```

**Regra de Ouro**: Superclasse contém **código genérico compartilhado**, subclasses **especializam** e **adicionam** comportamento específico. Use `protected` para membros que subclasses devem acessar.
