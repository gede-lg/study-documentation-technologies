# Classes Abstratas e Palavra-chave `abstract`

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Classe abstrata** é classe marcada com `abstract` que **não pode ser instanciada diretamente** - serve apenas como base para outras classes. Representa conceito **incompleto** ou **genérico** demais para existir por si só. `abstract` é palavra-chave que declara "esta classe é modelo/template, não entidade concreta".

Conceitualmente, classe abstrata é **contrato parcialmente implementado**: define estrutura comum (atributos, métodos concretos) e **deixa lacunas** (métodos abstratos) para subclasses preencherem. Analogia: planta arquitetônica de "casa" define fundação, estrutura, mas não especifica acabamento - cada casa concreta (apartamento, sobrado) completa detalhes.

Propósito fundamental é **abstração e reutilização**: extrair comportamento comum para superclasse, forçar subclasses a implementar comportamento específico. Cliente usa tipo abstrato (polimorfismo), trabalha com conceito geral ("Animal"), não implementação específica ("Cachorro"). É separação entre **interface** (o que) e **implementação** (como).

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Não Instanciável:** `new ClasseAbstrata()` gera erro de compilação
2. **Herança Obrigatória:** Só existe via subclasses concretas
3. **Pode ter Métodos Concretos:** Implementação compartilhada
4. **Pode ter Métodos Abstratos:** Contrato para subclasses
5. **Pode ter Construtores:** Chamados por `super()` de subclasses
6. **Abstração Conceitual:** Representa conceito genérico

---

## 🧠 Fundamentos Teóricos

### Sintaxe e Não-Instanciabilidade

```java
// ✅ Classe abstrata
abstract class Animal {
    private String nome;

    public Animal(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    // Método concreto compartilhado
    public void dormir() {
        System.out.println(nome + " está dormindo");
    }
}

// ❌ ERRO: não pode instanciar classe abstrata
// Animal a = new Animal("Rex");  // ERRO de compilação

// ✅ Subclasse concreta
class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }
}

// ✅ Pode instanciar subclasse concreta
Animal a = new Cachorro("Rex");  // OK - Cachorro é concreto
a.dormir();  // "Rex está dormindo"
```

**Fundamento:** `abstract` torna classe **não instanciável** - compilador rejeita `new` direto. Única forma de usar é via **subclasses concretas** que herdam e podem ser instanciadas. Classe abstrata existe apenas como **tipo** (polimorfismo), não como **objeto**.

### Métodos Concretos em Classes Abstratas

```java
abstract class Forma {
    private String cor;

    public Forma(String cor) {
        this.cor = cor;
    }

    // ✅ Método concreto: implementação compartilhada
    public String getCor() {
        return cor;
    }

    // ✅ Método concreto: comportamento comum
    public void desenhar() {
        System.out.println("Desenhando forma " + cor);
    }
}

class Circulo extends Forma {
    private double raio;

    public Circulo(String cor, double raio) {
        super(cor);
        this.raio = raio;
    }

    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}

class Quadrado extends Forma {
    private double lado;

    public Quadrado(String cor, double lado) {
        super(cor);
        this.lado = lado;
    }

    public double calcularArea() {
        return lado * lado;
    }
}

// Uso:
Forma c = new Circulo("vermelho", 5);
c.desenhar();  // Método herdado de Forma
System.out.println(c.getCor());  // "vermelho"
```

**Fundamento:** Classe abstrata **pode ter métodos concretos** (com implementação completa). Métodos concretos definem **comportamento compartilhado** - todas subclasses herdam sem reimplementar. `getCor()` e `desenhar()` são comuns a todas formas - não há razão para reimplementar em cada subclasse.

### Construtores em Classes Abstratas

```java
abstract class Veiculo {
    private String marca;
    private String modelo;
    private int ano;

    // ✅ Construtor em classe abstrata
    public Veiculo(String marca, String modelo, int ano) {
        if (marca == null || marca.isEmpty()) {
            throw new IllegalArgumentException("Marca obrigatória");
        }
        if (ano < 1900 || ano > 2100) {
            throw new IllegalArgumentException("Ano inválido");
        }
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
    }

    public String getMarca() { return marca; }
    public String getModelo() { return modelo; }
    public int getAno() { return ano; }
}

class Carro extends Veiculo {
    private int numeroPortas;

    public Carro(String marca, String modelo, int ano, int numeroPortas) {
        super(marca, modelo, ano);  // Chama construtor da abstrata
        this.numeroPortas = numeroPortas;
    }
}

// Uso:
Veiculo v = new Carro("Toyota", "Corolla", 2023, 4);
System.out.println(v.getMarca());  // "Toyota"
```

**Fundamento:** Classe abstrata **pode ter construtores** mesmo não sendo instanciável diretamente. Construtor é chamado via `super()` de subclasses concretas. Propósito é **inicializar estado compartilhado** - validação e atribuição de atributos comuns a todas subclasses.

**Importante:** Construtor abstrato não pode ser `public` em alguns designs - pode ser `protected` para restringir herança.

---

## 🔍 Análise Conceitual Profunda

### Abstração como Generalização

```java
// Conceito abstrato: "Funcionario" é genérico
abstract class Funcionario {
    private String nome;
    private String cpf;
    protected double salarioBase;  // protected: subclasses acessam

    public Funcionario(String nome, String cpf, double salarioBase) {
        this.nome = nome;
        this.cpf = cpf;
        this.salarioBase = salarioBase;
    }

    public String getNome() { return nome; }
    public String getCpf() { return cpf; }

    // Método concreto: comportamento comum
    public void exibirDados() {
        System.out.println("Nome: " + nome);
        System.out.println("CPF: " + cpf);
        System.out.println("Salário: " + calcularSalario());
    }

    // ❓ Cálculo de salário é abstrato - cada tipo calcula diferente
    // Será declarado abstrato em próximos arquivos
}

// Conceitos concretos: "Gerente" e "Vendedor" são específicos
class Gerente extends Funcionario {
    private double bonus;

    public Gerente(String nome, String cpf, double salarioBase, double bonus) {
        super(nome, cpf, salarioBase);
        this.bonus = bonus;
    }

    public double calcularSalario() {
        return salarioBase + bonus;  // Gerente: base + bônus
    }
}

class Vendedor extends Funcionario {
    private double comissao;

    public Vendedor(String nome, String cpf, double salarioBase, double comissao) {
        super(nome, cpf, salarioBase);
        this.comissao = comissao;
    }

    public double calcularSalario() {
        return salarioBase + comissao;  // Vendedor: base + comissão
    }
}

// ❌ Não faz sentido ter "Funcionario" puro
// Funcionario f = new Funcionario("João", "123", 3000);  // Genérico demais

// ✅ Sempre é tipo específico
Funcionario f1 = new Gerente("Maria", "456", 5000, 2000);
Funcionario f2 = new Vendedor("Pedro", "789", 3000, 1500);

f1.exibirDados();  // Usa método herdado
f2.exibirDados();
```

**Análise:** "Funcionario" é **conceito abstrato** - todo funcionário real é gerente, vendedor, estagiário, etc. Não existe "funcionário puro" sem tipo específico. Classe abstrata captura **generalização**: atributos e comportamentos comuns a todos, sem ser instanciável por si só.

### Abstrata com Implementação Parcial

```java
abstract class ContaBancaria {
    protected String numeroConta;
    protected double saldo;

    public ContaBancaria(String numeroConta) {
        this.numeroConta = numeroConta;
        this.saldo = 0;
    }

    // ✅ Método concreto: implementação completa
    public void depositar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor inválido");
        }
        saldo += valor;
        System.out.println("Depósito: " + valor);
    }

    // ✅ Método concreto: comportamento comum
    public double getSaldo() {
        return saldo;
    }

    // ✅ Método concreto: comportamento comum
    public String getNumeroConta() {
        return numeroConta;
    }

    // ❓ Saque depende do tipo de conta
    // - Conta Corrente: pode ter cheque especial (saldo negativo)
    // - Conta Poupança: só saca se tiver saldo
    // Será abstrato - cada tipo implementa
}

class ContaCorrente extends ContaBancaria {
    private double limite;

    public ContaCorrente(String numeroConta, double limite) {
        super(numeroConta);
        this.limite = limite;
    }

    public void sacar(double valor) {
        if (saldo + limite >= valor) {
            saldo -= valor;
        } else {
            throw new IllegalStateException("Saldo insuficiente");
        }
    }
}

class ContaPoupanca extends ContaBancaria {
    public ContaPoupanca(String numeroConta) {
        super(numeroConta);
    }

    public void sacar(double valor) {
        if (saldo >= valor) {
            saldo -= valor;
        } else {
            throw new IllegalStateException("Saldo insuficiente");
        }
    }
}
```

**Análise:** Classe abstrata implementa **comportamento comum** (`depositar`, `getSaldo`) e deixa **comportamento variável** para subclasses (`sacar`). É **template parcialmente preenchido** - parte já implementada (depósito é igual para todos), parte a ser completada (saque difere por tipo).

### Polimorfismo com Classes Abstratas

```java
abstract class Animal {
    private String nome;

    public Animal(String nome) {
        this.nome = nome;
    }

    public String getNome() { return nome; }

    public void dormir() {
        System.out.println(nome + " está dormindo");
    }
}

class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }

    public void latir() {
        System.out.println(getNome() + " está latindo");
    }
}

class Gato extends Animal {
    public Gato(String nome) {
        super(nome);
    }

    public void miar() {
        System.out.println(getNome() + " está miando");
    }
}

// ✅ Polimorfismo: lista de tipo abstrato
List<Animal> animais = new ArrayList<>();
animais.add(new Cachorro("Rex"));
animais.add(new Gato("Mimi"));
animais.add(new Cachorro("Bob"));

// ✅ Itera sobre tipo abstrato, executa em concretos
for (Animal a : animais) {
    a.dormir();  // Método herdado funciona para todos
}

// ✅ Método aceita tipo abstrato
void alimentar(Animal animal) {
    System.out.println("Alimentando " + animal.getNome());
}

alimentar(new Cachorro("Rex"));  // ✅ Cachorro é-um Animal
alimentar(new Gato("Mimi"));     // ✅ Gato é-um Animal
```

**Análise:** Classe abstrata serve como **tipo polimórfico** - código trabalha com tipo abstrato (`Animal`), executa em instâncias concretas (`Cachorro`, `Gato`). Cliente não sabe (e não precisa saber) tipo específico - depende apenas de interface comum definida pela abstrata.

### Classes Abstratas Aninhadas em Hierarquia

```java
// Nível 1: Abstrata raiz
abstract class Veiculo {
    protected String marca;

    public Veiculo(String marca) {
        this.marca = marca;
    }

    public String getMarca() { return marca; }
}

// Nível 2: Abstrata intermediária
abstract class VeiculoTerrestre extends Veiculo {
    protected int numeroRodas;

    public VeiculoTerrestre(String marca, int numeroRodas) {
        super(marca);
        this.numeroRodas = numeroRodas;
    }

    public int getNumeroRodas() { return numeroRodas; }
}

// Nível 3: Concretas
class Carro extends VeiculoTerrestre {
    public Carro(String marca) {
        super(marca, 4);
    }
}

class Moto extends VeiculoTerrestre {
    public Moto(String marca) {
        super(marca, 2);
    }
}

// Nível 2: Outra abstrata intermediária
abstract class VeiculoAquatico extends Veiculo {
    public VeiculoAquatico(String marca) {
        super(marca);
    }
}

class Barco extends VeiculoAquatico {
    public Barco(String marca) {
        super(marca);
    }
}
```

**Análise:** Classes abstratas podem formar **hierarquia** - abstrata estende abstrata. Cada nível adiciona **refinamento** - `Veiculo` é genérico, `VeiculoTerrestre` especializa para terrestres, `Carro`/`Moto` são concretos finais. Abstração em múltiplos níveis permite **gradação de generalização**.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Classes Abstratas

**✅ Use classe abstrata quando:**

1. **Conceito é genérico demais para instanciar**
```java
abstract class Forma { }  // "Forma" pura não existe - sempre é círculo, quadrado, etc.
abstract class Animal { }  // "Animal" genérico não existe - sempre é cachorro, gato, etc.
```

2. **Há comportamento compartilhado entre subclasses**
```java
abstract class Funcionario {
    // Todos funcionários têm nome, CPF, métodos comuns
    public void exibirDados() { /* implementação comum */ }
}
```

3. **Quer forçar subclasses a implementar comportamento específico**
```java
abstract class Relatorio {
    // Todos relatórios geram, mas COMO geram varia
    // Método abstrato força implementação
}
```

4. **Quer compartilhar estado (atributos)**
```java
abstract class Conta {
    protected double saldo;  // Compartilhado entre todas contas
}
```

**❌ Não use classe abstrata quando:**

1. **Não há implementação compartilhada** → Use interface
2. **Precisa de herança múltipla** → Use interfaces
3. **Classe pode ser instanciada** → Use classe concreta normal

---

## ⚠️ Limitações e Considerações

### Abstrata Sem Métodos Abstratos

```java
// ✅ Válido: abstrata sem métodos abstratos
abstract class Base {
    public void metodo() {
        System.out.println("Concreto");
    }
}

// Por que abstrair se tudo é concreto?
// Resposta: impedir instanciação direta
Base b = new Base();  // ❌ ERRO - não pode instanciar
```

**Consideração:** Classe abstrata **não é obrigada** a ter métodos abstratos. Pode ser abstrata apenas para **impedir instanciação** - força uso via subclasses. Raro, mas válido.

### Construtores Não São Herdados

```java
abstract class Animal {
    private String nome;

    public Animal(String nome) {
        this.nome = nome;
    }
}

class Cachorro extends Animal {
    // ❌ ERRO se não chamar super()
    public Cachorro() {
        // Compilador insere super() implícito
        // Mas Animal não tem construtor sem parâmetros!
    }

    // ✅ Deve chamar construtor da superclasse
    public Cachorro(String nome) {
        super(nome);
    }
}
```

**Limitação:** Construtores **não são herdados**. Subclasse deve **explicitamente chamar** `super()` para inicializar parte da superclasse.

### `abstract` e `final` São Incompatíveis

```java
// ❌ ERRO: abstract e final são opostos
abstract final class Errado { }
// abstract = deve ser herdada
// final = não pode ser herdada
// Contradição!

abstract class Base {
    // ❌ ERRO: método abstract final
    public abstract final void metodo();
    // abstract = deve ser sobrescrito
    // final = não pode ser sobrescrito
    // Contradição!
}
```

**Limitação:** `abstract` requer herança, `final` proíbe herança - **mutuamente exclusivos**.

---

## 🔗 Interconexões Conceituais

### Relação com Herança

Classe abstrata **depende de herança** - só existe via subclasses. É aplicação direta de herança para criar hierarquias de generalização/especialização.

### Relação com Polimorfismo

Classe abstrata serve como **tipo polimórfico** - referência é abstrata, objeto é concreto. Permite código genérico que trabalha com abstrações.

### Relação com Interfaces

Ambas definem **contratos**, mas classe abstrata pode ter **implementação** e **estado**. Interfaces (pré-Java 8) são puramente contratos.

---

## 🚀 Evolução e Próximos Conceitos

### Progressão: Métodos Abstratos

Próximo passo é entender **métodos abstratos** - declaração sem implementação que força subclasses a implementar.

### Direção: Interfaces

Compreender **interfaces** como contratos puros, e diferença entre interface e classe abstrata (quando usar cada).

### Caminho: Template Method Pattern

Pattern de design que usa classes abstratas para definir **esqueleto de algoritmo**, delegando passos para subclasses.

---

## 📚 Conclusão

Classe abstrata é classe marcada com `abstract` que não pode ser instanciada - serve como base para subclasses concretas. Pode ter métodos concretos (implementação compartilhada), construtores (inicializar estado comum), e representa conceitos genéricos demais para existir isoladamente.

Dominar classes abstratas significa:
- Reconhecer que `abstract` torna classe não instanciável
- Usar abstratas para representar conceitos genéricos (Animal, Forma, Funcionario)
- Implementar comportamento compartilhado em métodos concretos
- Criar construtores para inicializar estado comum
- Aplicar em hierarquias onde há generalização/especialização
- Usar como tipo polimórfico em assinaturas e coleções
- Entender que abstratas podem formar hierarquias multinível
- Saber que abstrata sem métodos abstratos é válida (impede instanciação)
- Reconhecer incompatibilidade entre `abstract` e `final`

Classe abstrata não é apenas "classe que não instancia" - é **ferramenta de abstração** que captura generalização, compartilha implementação, e força estrutura em hierarquias. "Animal" abstrato permite código que trabalha com conceito geral sem conhecer se é cachorro ou gato. É separação entre interface (métodos públicos) e variações de implementação (subclasses concretas). Abstração é fundamento de design orientado a objetos - permite raciocinar em alto nível sem se prender a detalhes de implementação específica.
