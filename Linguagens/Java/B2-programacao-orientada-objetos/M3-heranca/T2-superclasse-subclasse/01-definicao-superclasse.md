# T2.01 - Definição de Superclasse

## Introdução

**Superclasse** (ou **classe pai**, **classe base**) é uma classe que **fornece código para outras classes** através de herança.

**Características**:
- Contém **membros comuns** (atributos e métodos)
- Está **acima** na hierarquia de classes
- Pode ser **concreta** ou **abstrata**

```java
// Superclasse
public class Animal {
    protected String nome;
    protected int idade;
    
    public void respirar() {
        System.out.println("Respirando...");
    }
}

// Subclasses herdam de Animal
public class Cachorro extends Animal {} // Animal é superclasse
public class Gato extends Animal {}     // Animal é superclasse
```

---

## Fundamentos

### 1. Conceito de Superclasse

**Classe que serve de base** para outras classes.

```java
// Superclasse: fornece código comum
public class Veiculo {
    protected String marca;
    protected String modelo;
    protected int ano;
    
    public void ligar() {
        System.out.println("Veículo ligado");
    }
    
    public void desligar() {
        System.out.println("Veículo desligado");
    }
}

// Subclasses reutilizam código de Veiculo
public class Carro extends Veiculo {}
public class Moto extends Veiculo {}
```

**Veiculo** é **superclasse** de Carro e Moto.

### 2. Superclasse Concreta

**Pode ser instanciada** diretamente.

```java
public class Pessoa {
    protected String nome;
    protected int idade;
    
    public void apresentar() {
        System.out.println("Olá, sou " + nome);
    }
}

// ✅ Pode instanciar
Pessoa p = new Pessoa();
p.apresentar();

// ✅ Também pode herdar
public class Funcionario extends Pessoa {
    private double salario;
}
```

### 3. Superclasse Abstrata

**Não pode ser instanciada**, apenas herdada.

```java
public abstract class Animal {
    protected String nome;
    
    // Método abstrato (sem implementação)
    public abstract void emitirSom();
    
    // Método concreto
    public void dormir() {
        System.out.println("Dormindo...");
    }
}

// ❌ Não pode instanciar
// Animal a = new Animal(); // ERRO

// ✅ Pode herdar
public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}
```

### 4. Membros da Superclasse

**Atributos e métodos** que serão herdados.

```java
public class Forma {
    // Atributos
    protected String cor;
    protected boolean preenchida;
    
    // Métodos
    public void exibirCor() {
        System.out.println("Cor: " + cor);
    }
    
    public void preencher() {
        preenchida = true;
    }
    
    // Método abstrato (se classe for abstrata)
    public abstract double calcularArea();
}
```

**Subclasses herdam**: `cor`, `preenchida`, `exibirCor()`, `preencher()`, e devem implementar `calcularArea()`.

### 5. Modificadores de Acesso na Superclasse

**Visibilidade dos membros** para subclasses:

```java
public class Base {
    public String publico;       // ✅ Herdado, acessível
    protected String protegido;  // ✅ Herdado, acessível
    String padrao;               // ✅ Herdado, acessível (mesmo pacote)
    private String privado;      // ✅ Herdado, NÃO acessível
}

public class Derivada extends Base {
    public void teste() {
        System.out.println(publico);    // ✅
        System.out.println(protegido);  // ✅
        System.out.println(padrao);     // ✅ (se mesmo pacote)
        // System.out.println(privado); // ❌ ERRO
    }
}
```

**`protected`** é o mais comum para membros herdáveis.

### 6. Construtores da Superclasse

**Não são herdados**, mas podem ser chamados.

```java
public class Pessoa {
    protected String nome;
    protected int idade;
    
    // Construtor da superclasse
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

public class Funcionario extends Pessoa {
    private double salario;
    
    // Deve chamar construtor da superclasse
    public Funcionario(String nome, int idade, double salario) {
        super(nome, idade); // Chama construtor de Pessoa
        this.salario = salario;
    }
}
```

### 7. Superclasse Genérica

**Define comportamento comum** para várias subclasses.

```java
// Superclasse genérica
public class ContaBancaria {
    protected String titular;
    protected double saldo;
    
    public void depositar(double valor) {
        saldo += valor;
    }
    
    public void sacar(double valor) {
        if (saldo >= valor) {
            saldo -= valor;
        }
    }
}

// Subclasses específicas
public class ContaCorrente extends ContaBancaria {
    private double limite;
}

public class ContaPoupanca extends ContaBancaria {
    private double taxaRendimento;
}
```

### 8. Object: Superclasse Universal

**Todas as classes herdam de `Object`** (implicitamente).

```java
// Equivalente
public class MinhaClasse {}
public class MinhaClasse extends Object {}

// Todos os métodos de Object estão disponíveis
MinhaClasse obj = new MinhaClasse();
System.out.println(obj.toString());  // De Object
System.out.println(obj.hashCode());  // De Object
System.out.println(obj.equals(obj)); // De Object
```

### 9. Hierarquia de Superclasses

**Superclasse pode ser subclasse de outra**.

```java
// Nível 1: Superclasse de Mamifero
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
```

**Mamifero** é **subclasse** de Animal e **superclasse** de Cachorro.

### 10. Responsabilidades da Superclasse

**O que colocar na superclasse**:

```java
public class Funcionario {
    // ✅ Comum a TODOS funcionários
    protected String nome;
    protected double salario;
    
    public void calcularBonificacao() {
        // Implementação padrão
    }
    
    // ❌ Não colocar detalhes específicos de subclasses
    // private String departamento; // Só Gerente tem
}

public class Gerente extends Funcionario {
    private String departamento; // Específico de Gerente
}
```

**Regra**: Apenas **código comum** vai na superclasse.

---

## Aplicabilidade

**Use superclasse quando**:
- **Múltiplas classes compartilham código**
- **Hierarquia natural** existe (Animal → Cachorro)
- **Comportamento comum** precisa ser reutilizado
- **Polimorfismo** é necessário

**Não use superclasse quando**:
- **Não há código comum** (use interfaces)
- **Relação não é "é-um"** (use composição)
- **Apenas uma classe** existe

---

## Armadilhas

### 1. Superclasse Muito Específica

```java
// ❌ Superclasse muito específica
public class CachorroGrande {
    // Limite uso (Cachorro pequeno não se encaixa)
}

// ✅ Superclasse genérica
public class Cachorro {
    protected String tamanho;
}
```

### 2. Membros private Inacessíveis

```java
public class Base {
    private String secreto; // Subclasse não acessa
}

public class Derivada extends Base {
    public void teste() {
        // System.out.println(secreto); // ❌ ERRO
    }
}

// Solução: use protected
protected String compartilhado;
```

### 3. Superclasse com Muitas Responsabilidades

```java
// ❌ God Class (faz tudo)
public class Funcionario {
    // Código de RH
    // Código de folha pagamento
    // Código de benefícios
    // ... (muito acoplado)
}

// ✅ Separar responsabilidades
public class Funcionario {
    // Apenas dados básicos
}
public class FolhaPagamento {
    // Lógica de pagamento
}
```

---

## Boas Práticas

### 1. Use protected Para Membros Compartilhados

```java
public class Animal {
    protected String nome; // Subclasses acessam
}
```

### 2. Defina Construtores Claros

```java
public class Pessoa {
    protected String nome;
    
    public Pessoa(String nome) {
        this.nome = nome;
    }
}
```

### 3. Documente a Superclasse

```java
/**
 * Superclasse para todos os veículos.
 * Subclasses devem implementar mover().
 */
public abstract class Veiculo {
    public abstract void mover();
}
```

### 4. Evite Expor Detalhes Internos

```java
// ❌ Expõe implementação
public class Animal {
    public List<String> orgaos; // Muito exposto
}

// ✅ Encapsula
public class Animal {
    private List<String> orgaos;
    
    protected void adicionarOrgao(String orgao) {
        orgaos.add(orgao);
    }
}
```

### 5. Prefira Composição Para Código Não Relacionado

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

**Superclasse (classe pai/base)**:

**Definição**: Classe que **fornece código** para outras classes via herança.

**Tipos**:
- **Concreta**: Pode ser instanciada
- **Abstrata**: Apenas herdada

**Exemplo**:
```java
// Superclasse concreta
public class Animal {
    protected String nome;
    
    public void respirar() {
        System.out.println("Respirando");
    }
}

// Superclasse abstrata
public abstract class Forma {
    protected String cor;
    
    public abstract double calcularArea();
}
```

**Membros**:
- **Atributos**: `public`, `protected`, `private`, package-private
- **Métodos**: Concretos ou abstratos
- **Construtores**: Não herdados (chamados com `super()`)

**Visibilidade**:
```java
public class Base {
    public String a;      // ✅ Herdado, acessível
    protected String b;   // ✅ Herdado, acessível
    String c;             // ✅ Herdado, acessível (mesmo pacote)
    private String d;     // ✅ Herdado, NÃO acessível
}
```

**Object**: Superclasse universal
```java
public class MinhaClasse {} // Implicitamente extends Object
```

**Regra de Ouro**: Superclasse deve conter **APENAS código comum** a todas subclasses. Use **protected** para membros que subclasses devem acessar. Evite expor detalhes de implementação.
