# T2.05 - Herança e Implementação Simultâneas

## Introdução

**extends + implements**: classe pode **herdar** de outra classe **e** implementar interface(s) simultaneamente.

```java
public abstract class Animal {
    private String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public void comer() {
        System.out.println(nome + " comendo");
    }
}

public interface Voador {
    void voar();
}

// extends + implements (extends ANTES)
public class Passaro extends Animal implements Voador {
    public Passaro(String nome) {
        super(nome);
    }
    
    @Override
    public void voar() {
        System.out.println("Pássaro voando");
    }
}

// Uso
Passaro passaro = new Passaro("Pardal");
passaro.comer(); // Herdado de Animal
passaro.voar();  // Implementado de Voador
```

**Ordem**: **extends** antes de **implements**.
```java
public class Classe extends SuperClasse implements Interface1, Interface2 {
}
```

**Benefícios**:
- **Reuso de código** (herança de classe)
- **Múltiplas capacidades** (implementação de interfaces)
- **Polimorfismo** (múltiplos tipos)

---

## Fundamentos

### 1. Sintaxe: extends Antes de implements

**extends** sempre **antes** de **implements**.

```java
public class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public void comer() {
        System.out.println(nome + " comendo");
    }
}

public interface Nadador {
    void nadar();
}

// ✅ extends antes de implements
public class Pato extends Animal implements Nadador {
    public Pato(String nome) {
        super(nome);
    }
    
    @Override
    public void nadar() {
        System.out.println(nome + " nadando");
    }
}

// ❌ ERRO: implements antes de extends
// public class Errado implements Nadador extends Animal { } // ERRO
```

### 2. Herança + Múltiplas Interfaces

Classe **extends** uma classe **e** **implements** múltiplas interfaces.

```java
public abstract class Veiculo {
    protected String marca;
    
    public Veiculo(String marca) {
        this.marca = marca;
    }
    
    public void mover() {
        System.out.println(marca + " movendo");
    }
}

public interface Voador {
    void voar();
}

public interface Aquatico {
    void navegar();
}

// extends + implements múltiplas interfaces
public class CarroAnfibio extends Veiculo implements Voador, Aquatico {
    public CarroAnfibio(String marca) {
        super(marca);
    }
    
    @Override
    public void voar() {
        System.out.println(marca + " voando");
    }
    
    @Override
    public void navegar() {
        System.out.println(marca + " navegando");
    }
}

// Uso: polimorfismo
Veiculo veiculo = new CarroAnfibio("XYZ");
veiculo.mover(); // Herdado

Voador voador = (Voador) veiculo;
voador.voar();

Aquatico aquatico = (Aquatico) veiculo;
aquatico.navegar();
```

### 3. Chamar Construtor da Superclasse

**super()**: chamar construtor da superclasse.

```java
public class Animal {
    protected String nome;
    protected int idade;
    
    public Animal(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

public interface Corredor {
    void correr();
}

public class Cachorro extends Animal implements Corredor {
    private String raca;
    
    public Cachorro(String nome, int idade, String raca) {
        super(nome, idade); // Chama construtor de Animal
        this.raca = raca;
    }
    
    @Override
    public void correr() {
        System.out.println(nome + " correndo");
    }
}
```

### 4. Sobrescrever Métodos da Superclasse

Subclasse pode **sobrescrever** métodos da superclasse.

```java
public class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public void fazerBarulho() {
        System.out.println("Animal fazendo barulho");
    }
}

public interface Domesticavel {
    void domesticar();
}

public class Cachorro extends Animal implements Domesticavel {
    public Cachorro(String nome) {
        super(nome);
    }
    
    @Override
    public void fazerBarulho() { // Sobrescreve Animal
        System.out.println("Au au!");
    }
    
    @Override
    public void domesticar() { // Implementa Domesticavel
        System.out.println(nome + " domesticado");
    }
}
```

### 5. Usar Métodos da Superclasse

Subclasse: usa métodos **protected/public** da superclasse.

```java
public abstract class Forma {
    protected String cor;
    
    public Forma(String cor) {
        this.cor = cor;
    }
    
    protected void exibir() {
        System.out.println("Forma de cor: " + cor);
    }
}

public interface Desenhavel {
    void desenhar();
}

public class Circulo extends Forma implements Desenhavel {
    private double raio;
    
    public Circulo(String cor, double raio) {
        super(cor);
        this.raio = raio;
    }
    
    @Override
    public void desenhar() {
        exibir(); // Usa método protected da superclasse
        System.out.println("Desenhando círculo de raio: " + raio);
    }
}
```

### 6. Polimorfismo com Múltiplos Tipos

Instância: **múltiplos tipos** (superclasse + interfaces).

```java
public class Animal {
    public void comer() {
        System.out.println("Comendo");
    }
}

public interface Voador {
    void voar();
}

public interface Nadador {
    void nadar();
}

public class Pato extends Animal implements Voador, Nadador {
    @Override
    public void voar() {
        System.out.println("Pato voando");
    }
    
    @Override
    public void nadar() {
        System.out.println("Pato nadando");
    }
}

// Polimorfismo: múltiplos tipos
Pato pato = new Pato();

Animal animal = pato; // Pato é Animal
animal.comer();

Voador voador = pato; // Pato é Voador
voador.voar();

Nadador nadador = pato; // Pato é Nadador
nadador.nadar();

// instanceof
System.out.println(pato instanceof Animal);  // true
System.out.println(pato instanceof Voador);  // true
System.out.println(pato instanceof Nadador); // true
```

### 7. Herança Abstrata + Interface

Superclasse **abstrata** + interface.

```java
public abstract class Veiculo {
    protected String marca;
    
    public Veiculo(String marca) {
        this.marca = marca;
    }
    
    public abstract void mover(); // Abstrato
}

public interface Eletrico {
    void carregarBateria();
}

public class Carro extends Veiculo implements Eletrico {
    public Carro(String marca) {
        super(marca);
    }
    
    @Override
    public void mover() { // Implementa abstrato de Veiculo
        System.out.println(marca + " movendo");
    }
    
    @Override
    public void carregarBateria() { // Implementa Eletrico
        System.out.println("Carregando bateria");
    }
}
```

### 8. Template Method + Interface

Template Method (superclasse) + interface.

```java
public abstract class ProcessadorBase {
    // Template method
    public final void processar() {
        validar();
        executar(); // Abstrato
        finalizar();
    }
    
    protected void validar() {
        System.out.println("Validando");
    }
    
    protected abstract void executar();
    
    protected void finalizar() {
        System.out.println("Finalizando");
    }
}

public interface Exportavel {
    byte[] exportar();
}

public class ProcessadorConcreto extends ProcessadorBase implements Exportavel {
    @Override
    protected void executar() {
        System.out.println("Executando");
    }
    
    @Override
    public byte[] exportar() {
        return new byte[0];
    }
}
```

### 9. Conflito: Superclasse vs Interface

Método **concreto** na superclasse + **default** na interface: **superclasse vence**.

```java
public class SuperClasse {
    public void metodo() {
        System.out.println("SuperClasse");
    }
}

public interface MinhaInterface {
    default void metodo() {
        System.out.println("Interface");
    }
}

// Superclasse vence
public class MinhaClasse extends SuperClasse implements MinhaInterface {
    // metodo() herdado de SuperClasse (não precisa sobrescrever)
}

// Uso
MinhaClasse obj = new MinhaClasse();
obj.metodo(); // SuperClasse (não Interface)
```

### 10. Resolver Conflito Explicitamente

Sobrescrever para **resolver conflito** explicitamente.

```java
public class SuperClasse {
    public void metodo() {
        System.out.println("SuperClasse");
    }
}

public interface MinhaInterface {
    default void metodo() {
        System.out.println("Interface");
    }
}

// Resolve conflito explicitamente
public class MinhaClasse extends SuperClasse implements MinhaInterface {
    @Override
    public void metodo() {
        super.metodo(); // Chama SuperClasse
        MinhaInterface.super.metodo(); // Chama Interface
        // Ou implementação própria
    }
}
```

---

## Aplicabilidade

**Herança + implementação**:
- **Reuso de código** (herança de superclasse)
- **Múltiplas capacidades** (interfaces)
- **Template Method** + interfaces
- **Polimorfismo** (múltiplos tipos)

**Quando usar**:
- Classe precisa **herdar** comportamento **e** implementar **capacidades**
- **Reuso** (superclasse) + **contratos** (interfaces)

---

## Armadilhas

### 1. implements Antes de extends

```java
// ❌ ERRO: implements antes de extends
// public class Errado implements Voador extends Animal { } // ERRO

// ✅ extends antes de implements
public class Correto extends Animal implements Voador { }
```

### 2. Esquecer super()

```java
public class Animal {
    public Animal(String nome) { }
}

public interface Voador {
    void voar();
}

// ❌ ERRO: esquece super()
// public class Passaro extends Animal implements Voador {
//     public Passaro(String nome) {
//         // super(nome) não chamado - ERRO
//     }
// }

// ✅ Chama super()
public class Passaro extends Animal implements Voador {
    public Passaro(String nome) {
        super(nome); // OK
    }
    
    @Override
    public void voar() { }
}
```

### 3. Não Implementar Todos os Métodos

```java
public class Animal {
    public void comer() { }
}

public interface Voador {
    void voar();
}

public interface Nadador {
    void nadar();
}

// ❌ ERRO: não implementa nadar()
// public class Pato extends Animal implements Voador, Nadador {
//     @Override
//     public void voar() { }
//     // nadar() não implementado - ERRO
// }

// ✅ Implementa todos
public class Pato extends Animal implements Voador, Nadador {
    @Override
    public void voar() { }
    
    @Override
    public void nadar() { }
}
```

### 4. Conflito Superclasse vs Interface

```java
public class SuperClasse {
    public void metodo() {
        System.out.println("SuperClasse");
    }
}

public interface MinhaInterface {
    default void metodo() {
        System.out.println("Interface");
    }
}

// ⚠️ Superclasse vence (pode ser confuso)
public class MinhaClasse extends SuperClasse implements MinhaInterface {
    // metodo() de SuperClasse (não de Interface)
}

// ✅ Explícito
public class Explicita extends SuperClasse implements MinhaInterface {
    @Override
    public void metodo() {
        super.metodo(); // Escolhe explicitamente
    }
}
```

### 5. Herança Profunda

```java
// ⚠️ Herança profunda (difícil manutenção)
public class A { }
public class B extends A { }
public class C extends B { }
public class D extends C implements Interface { }

// ✅ Composição
public class D implements Interface {
    private final C c = new C();
}
```

### 6. Sem @Override

```java
public class Animal {
    public void comer() { }
}

public interface Voador {
    void voar();
}

// ⚠️ Sem @Override
public class Passaro extends Animal implements Voador {
    public void comer() { } // Sem @Override
    public void voar() { }  // Sem @Override
}

// ✅ Com @Override
public class Correto extends Animal implements Voador {
    @Override
    public void comer() { }
    
    @Override
    public void voar() { }
}
```

### 7. Visibilidade Reduzida

```java
public class Animal {
    public void comer() { }
}

public interface Voador {
    void voar();
}

// ❌ ERRO: reduz visibilidade
// public class Passaro extends Animal implements Voador {
//     @Override
//     void comer() { } // package-private (erro)
// }

// ✅ Public
public class Correto extends Animal implements Voador {
    @Override
    public void comer() { }
    
    @Override
    public void voar() { }
}
```

---

## Boas Práticas

### 1. extends Antes de implements

```java
// ✅ extends antes de implements
public class Classe extends SuperClasse implements Interface1, Interface2 {
}
```

### 2. Chamar super() Sempre

```java
public class Animal {
    public Animal(String nome) { }
}

public interface Voador {
    void voar();
}

// ✅ super() sempre
public class Passaro extends Animal implements Voador {
    public Passaro(String nome) {
        super(nome); // Sempre
    }
    
    @Override
    public void voar() { }
}
```

### 3. @Override em Todos os Métodos

```java
public class Animal {
    public void comer() { }
}

public interface Voador {
    void voar();
}

// ✅ @Override em todos
public class Passaro extends Animal implements Voador {
    @Override
    public void comer() { } // Sobrescreve Animal
    
    @Override
    public void voar() { } // Implementa Voador
}
```

### 4. Composição vs Herança

```java
// ⚠️ Herança (acoplamento forte)
public class Stack<E> extends Vector<E> {
}

// ✅ Composição (baixo acoplamento)
public class Stack<E> implements Collection<E> {
    private final Vector<E> elements = new Vector<>();
    
    public void push(E item) {
        elements.add(item);
    }
    
    public E pop() {
        return elements.remove(elements.size() - 1);
    }
}
```

### 5. Template Method + Strategy

```java
public abstract class ProcessadorBase {
    public final void processar() { // Template
        validar();
        executar();
        finalizar();
    }
    
    protected abstract void executar();
}

public interface Estrategia {
    void aplicar();
}

// Template + Strategy
public class ProcessadorConcreto extends ProcessadorBase implements Estrategia {
    @Override
    protected void executar() {
        aplicar(); // Usa Strategy
    }
    
    @Override
    public void aplicar() {
        System.out.println("Aplicando estratégia");
    }
}
```

### 6. Adapter Pattern

```java
public class Adaptee {
    public void specificRequest() {
        System.out.println("Specific request");
    }
}

public interface Target {
    void request();
}

// Adapter: herança + interface
public class Adapter extends Adaptee implements Target {
    @Override
    public void request() {
        specificRequest(); // Delega para superclasse
    }
}
```

### 7. Decorator Pattern

```java
public abstract class Componente {
    public abstract void operacao();
}

// Decorator: extends Componente + wrapping
public abstract class Decorator extends Componente {
    protected final Componente componente;
    
    public Decorator(Componente componente) {
        this.componente = componente;
    }
    
    @Override
    public void operacao() {
        componente.operacao();
    }
}

public interface Notificavel {
    void notificar();
}

// Decorator concreto + interface
public class LogDecorator extends Decorator implements Notificavel {
    public LogDecorator(Componente componente) {
        super(componente);
    }
    
    @Override
    public void operacao() {
        System.out.println("Log antes");
        super.operacao();
        System.out.println("Log depois");
    }
    
    @Override
    public void notificar() {
        System.out.println("Notificando");
    }
}
```

### 8. Documentar Herança e Implementação

```java
/**
 * Representa um pássaro que pode voar.
 * 
 * <p>Herda comportamentos básicos de {@link Animal} e
 * implementa a capacidade de voar através de {@link Voador}.
 */
public class Passaro extends Animal implements Voador {
    /**
     * {@inheritDoc}
     * 
     * <p>Implementação específica: bate as asas.
     */
    @Override
    public void voar() {
        System.out.println("Batendo asas");
    }
}
```

### 9. Dependency Injection

```java
public abstract class ServicoBase {
    protected final Logger logger;
    
    protected ServicoBase(Logger logger) {
        this.logger = logger;
    }
}

public interface Notificador {
    void notificar(String mensagem);
}

// Herança + interface + DI
public class MeuServico extends ServicoBase implements Notificador {
    public MeuServico(Logger logger) {
        super(logger);
    }
    
    @Override
    public void notificar(String mensagem) {
        logger.log("Notificando: " + mensagem);
    }
}
```

### 10. Testes com Múltiplos Tipos

```java
public class Animal {
    public void comer() { }
}

public interface Voador {
    void voar();
}

public class Passaro extends Animal implements Voador {
    @Override
    public void voar() { }
}

@Test
public void testPolimorfismo() {
    Passaro passaro = new Passaro();
    
    // Testa como Animal
    assertTrue(passaro instanceof Animal);
    
    // Testa como Voador
    assertTrue(passaro instanceof Voador);
    
    // Testa polimorfismo
    Animal animal = passaro;
    animal.comer();
    
    Voador voador = passaro;
    voador.voar();
}
```

---

## Resumo

**extends + implements**: **extends** antes de **implements**.

```java
public class Classe extends SuperClasse implements Interface1, Interface2 {
}
```

**super()**: chamar construtor da superclasse.
```java
public Classe(String param) {
    super(param);
}
```

**Sobrescrever**:
```java
@Override
public void metodo() { } // Sobrescreve superclasse ou implementa interface
```

**Usar superclasse**:
```java
public void metodo() {
    super.metodo(); // Chama superclasse
    exibir(); // Usa método protected da superclasse
}
```

**Polimorfismo**:
```java
Pato pato = new Pato();
Animal animal = pato; // Pato é Animal
Voador voador = pato; // Pato é Voador
```

**Herança abstrata**:
```java
public abstract class Base {
    public abstract void metodo();
}

public class Concreta extends Base implements Interface {
    @Override
    public void metodo() { } // Implementa abstrato
}
```

**Template Method**:
```java
public abstract class Base {
    public final void processar() { // Template
        executar(); // Abstrato
    }
    
    protected abstract void executar();
}

public class Concreta extends Base implements Interface {
    @Override
    protected void executar() { }
}
```

**Conflito superclasse vs interface**: superclasse vence.
```java
public class Classe extends Super implements Interface {
    // metodo() de Super vence default de Interface
}
```

**Resolver conflito**:
```java
@Override
public void metodo() {
    super.metodo(); // SuperClasse
    Interface.super.metodo(); // Interface
}
```

**Boas práticas**:
- **extends** antes de **implements**
- **super()** sempre
- **@Override** em todos
- Composição vs herança (preferir composição)
- Template Method + Strategy
- Adapter, Decorator patterns
- Documentar herança e implementação
- Dependency Injection
- Testes com múltiplos tipos

**Armadilhas**:
- ❌ implements antes de extends
- ❌ Esquecer super()
- ❌ Não implementar todos os métodos
- ❌ Conflito superclasse vs interface (resolver explicitamente)
- ❌ Herança profunda (preferir composição)
- ❌ Sem @Override
- ❌ Visibilidade reduzida

**Regra de Ouro**: **extends** sempre **antes** de **implements**. Chame **super()** no construtor. Use **@Override** em todos os métodos. Classe **concreta** implementa **todos** métodos de **todas** interfaces. **Superclasse vence** interface em conflitos. Preferir **composição** sobre herança profunda. Polimorfismo: instância tem **múltiplos tipos** (superclasse + interfaces).
