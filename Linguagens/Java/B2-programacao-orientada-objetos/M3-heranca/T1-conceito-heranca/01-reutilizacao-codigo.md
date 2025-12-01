# T1.01 - Reutilização de Código com Herança

## Introdução

**Herança** permite **reutilizar código** de uma classe existente, evitando duplicação e promovendo manutenibilidade.

**Princípio DRY** (Don't Repeat Yourself): Código comum em uma **classe base**, classes específicas **herdam** funcionalidades.

```java
// Classe base (reutilizável)
public class Animal {
    public void respirar() {
        System.out.println("Respirando...");
    }
}

// Classes específicas (reutilizam código)
public class Cachorro extends Animal {
    // Herda respirar()
}

public class Gato extends Animal {
    // Herda respirar()
}
```

---

## Fundamentos

### 1. Problema: Duplicação de Código

**Sem herança**: Código repetido em múltiplas classes.

```java
public class Cachorro {
    private String nome;
    
    public void respirar() {
        System.out.println("Respirando...");
    }
    
    public void dormir() {
        System.out.println("Dormindo...");
    }
}

public class Gato {
    private String nome;
    
    public void respirar() {
        System.out.println("Respirando...");
    }
    
    public void dormir() {
        System.out.println("Dormindo...");
    }
}

public class Passaro {
    private String nome;
    
    public void respirar() {
        System.out.println("Respirando...");
    }
    
    public void dormir() {
        System.out.println("Dormindo...");
    }
}
// Código duplicado em 3 classes!
```

**Problemas**:
- **Manutenção difícil**: Alterar `respirar()` requer mudanças em 3 lugares
- **Erro propenso**: Esquecimento de atualizar uma classe
- **Código verboso**: Repetição desnecessária

### 2. Solução: Herança

**Extrair código comum** para classe base:

```java
// Classe base (código comum)
public class Animal {
    private String nome;
    
    public void respirar() {
        System.out.println("Respirando...");
    }
    
    public void dormir() {
        System.out.println("Dormindo...");
    }
}

// Classes específicas (reutilizam)
public class Cachorro extends Animal {
    public void latir() {
        System.out.println("Au au!");
    }
}

public class Gato extends Animal {
    public void miar() {
        System.out.println("Miau!");
    }
}

public class Passaro extends Animal {
    public void voar() {
        System.out.println("Voando...");
    }
}
```

**Benefícios**:
- **Código centralizado**: `respirar()` e `dormir()` em um só lugar
- **Manutenção fácil**: Alterar `Animal` afeta todas subclasses
- **Menos código**: Subclasses focam em comportamentos específicos

### 3. Reutilização de Atributos

**Atributos também são herdados**:

```java
public class Veiculo {
    protected String marca;
    protected String modelo;
    protected int ano;
    
    public void exibirInfo() {
        System.out.println(marca + " " + modelo + " " + ano);
    }
}

public class Carro extends Veiculo {
    private int portas;
    
    // Herda marca, modelo, ano, exibirInfo()
    
    public void abrirPorta() {
        System.out.println("Abrindo porta...");
    }
}

public class Moto extends Veiculo {
    private boolean temCarenagem;
    
    // Herda marca, modelo, ano, exibirInfo()
    
    public void empinar() {
        System.out.println("Empinando...");
    }
}
```

### 4. Reutilização de Métodos

**Métodos da classe base disponíveis nas subclasses**:

```java
public class Funcionario {
    protected String nome;
    protected double salario;
    
    public void calcularBonificacao() {
        System.out.println("Bonificação: " + salario * 0.1);
    }
}

public class Gerente extends Funcionario {
    // Herda calcularBonificacao()
}

public class Desenvolvedor extends Funcionario {
    // Herda calcularBonificacao()
}

// Uso
Gerente g = new Gerente();
g.calcularBonificacao(); // Método herdado

Desenvolvedor d = new Desenvolvedor();
d.calcularBonificacao(); // Método herdado
```

### 5. Extensão de Funcionalidades

**Subclasses adicionam comportamentos específicos**:

```java
public class Forma {
    protected String cor;
    
    public void exibirCor() {
        System.out.println("Cor: " + cor);
    }
}

public class Circulo extends Forma {
    private double raio;
    
    // Herda cor e exibirCor()
    // Adiciona cálculo de área
    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}

public class Retangulo extends Forma {
    private double largura;
    private double altura;
    
    // Herda cor e exibirCor()
    // Adiciona cálculo de área
    public double calcularArea() {
        return largura * altura;
    }
}
```

### 6. Hierarquias Multinível

**Herança em cadeia**:

```java
// Nível 1: Base
public class Veiculo {
    public void mover() {
        System.out.println("Movendo...");
    }
}

// Nível 2: Intermediária
public class VeiculoMotorizado extends Veiculo {
    public void ligarMotor() {
        System.out.println("Motor ligado");
    }
}

// Nível 3: Específica
public class Carro extends VeiculoMotorizado {
    public void abrirPorta() {
        System.out.println("Porta aberta");
    }
}

// Carro herda: mover() + ligarMotor() + abrirPorta()
```

### 7. Código Comum em Construtores

**Construtor da superclasse pode inicializar atributos comuns**:

```java
public class Pessoa {
    protected String nome;
    protected int idade;
    
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

public class Estudante extends Pessoa {
    private String matricula;
    
    public Estudante(String nome, int idade, String matricula) {
        super(nome, idade); // Reutiliza construtor da superclasse
        this.matricula = matricula;
    }
}

public class Professor extends Pessoa {
    private String disciplina;
    
    public Professor(String nome, int idade, String disciplina) {
        super(nome, idade); // Reutiliza construtor da superclasse
        this.disciplina = disciplina;
    }
}
```

### 8. Manutenção Centralizada

**Alterar uma vez, afetar todas subclasses**:

```java
public class ContaBancaria {
    protected double saldo;
    
    public void depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
        }
    }
}

public class ContaCorrente extends ContaBancaria {}
public class ContaPoupanca extends ContaBancaria {}

// Mudança em ContaBancaria.depositar() afeta todas subclasses automaticamente
```

### 9. Polimorfismo e Reutilização

**Método único processa diferentes tipos**:

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
}

public class Gato extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Miau!");
    }
}

// Reutilização polimórfica
public void fazerBarulho(Animal animal) {
    animal.emitirSom(); // Funciona para qualquer Animal
}

fazerBarulho(new Cachorro()); // Au au!
fazerBarulho(new Gato());     // Miau!
```

### 10. Evitar Duplicação em Bibliotecas

**Exemplo real: Collections Framework**:

```java
// AbstractList (código comum)
public abstract class AbstractList<E> {
    public boolean isEmpty() {
        return size() == 0;
    }
    
    public boolean contains(Object o) {
        // Implementação genérica
    }
}

// ArrayList e LinkedList reutilizam
public class ArrayList<E> extends AbstractList<E> {
    // Herda isEmpty(), contains()
}

public class LinkedList<E> extends AbstractList<E> {
    // Herda isEmpty(), contains()
}
```

---

## Aplicabilidade

**Use herança para reutilização quando**:
- **Código duplicado** em múltiplas classes
- **Relação "é-um"** clara (Cachorro **é um** Animal)
- **Hierarquia natural** (Funcionário → Gerente)
- **Comportamento comum** compartilhado

**Evite herança quando**:
- **Relação "tem-um"** (Carro **tem um** Motor → composição)
- **Código não relacionado** (evitar herança forçada)
- **Flexibilidade necessária** (preferir interfaces)

---

## Armadilhas

### 1. Herança Desnecessária

```java
// ❌ Herança forçada
public class Quadrado extends Retangulo {
    // Herda largura e altura (redundante para quadrado)
}

// ✅ Classes separadas
public class Quadrado {
    private double lado;
}

public class Retangulo {
    private double largura;
    private double altura;
}
```

### 2. Acoplamento Forte

**Herança cria dependência forte** entre classes.

```java
// Mudança em Animal afeta TODAS subclasses
public class Animal {
    public void mover() {} // Mudar assinatura quebra subclasses
}
```

### 3. Hierarquias Profundas

```java
// ❌ Excessivamente profundo (difícil manter)
Animal → Mamifero → Carnivoro → Felino → Gato → GatoPersa

// ✅ Mais raso
Animal → Gato
```

---

## Boas Práticas

### 1. Extraia Código Comum

**Identifique duplicações** e mova para superclasse.

### 2. Use protected Para Atributos Herdados

```java
public class Animal {
    protected String nome; // Subclasses acessam
}
```

### 3. Favoreça Composição Quando Apropriado

```java
// ✅ Composição (Carro TEM Motor)
public class Carro {
    private Motor motor;
}

// ❌ Herança incorreta
public class Carro extends Motor {}
```

### 4. Documente Contratos da Superclasse

```java
/**
 * Classe base para todos os animais.
 * Subclasses devem implementar emitirSom().
 */
public abstract class Animal {
    public abstract void emitirSom();
}
```

### 5. Evite Alterar Contratos Públicos

**Mudanças na superclasse afetam todas subclasses**.

---

## Resumo

**Reutilização de código com herança**:

**Problema**: Duplicação de código
```java
// ❌ Código repetido
class Cachorro { void respirar() {} }
class Gato { void respirar() {} }
```

**Solução**: Herança
```java
// ✅ Código reutilizado
class Animal { void respirar() {} }
class Cachorro extends Animal {}
class Gato extends Animal {}
```

**Benefícios**:
- **Menos código**: Evita duplicação
- **Manutenção fácil**: Alterar uma vez
- **Consistência**: Comportamento uniforme
- **Extensibilidade**: Adicionar funcionalidades

**O que é herdado**:
- Atributos (exceto `private`)
- Métodos (exceto `private`)
- Construtores **não são herdados**

**Exemplo prático**:
```java
public class Funcionario {
    protected double salario;
    
    public void calcularBonificacao() {
        System.out.println(salario * 0.1);
    }
}

public class Gerente extends Funcionario {
    // Herda salario e calcularBonificacao()
}
```

**Regra de Ouro**: Use herança para **reutilizar código comum** quando houver **relação "é-um"** clara, evite herança para **relações "tem-um"** (use composição).
