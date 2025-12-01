# T4.02 - Virtual Method Invocation

## Introdução

**Virtual Method Invocation (Invocação de Método Virtual)**: métodos de instância em Java são **virtuais** por padrão, ou seja, resolvidos em **runtime** baseado no **tipo do objeto**.

```java
public class Animal {
    public void som() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}

Animal a = new Cachorro();
a.som(); // Virtual method invocation: runtime determina Cachorro.som()
```

**Virtual**: método pode ser **sobrescrito** e a chamada é **resolvida em runtime**.

**Exceções** (métodos **não virtuais**):
- **static**: resolvido em compile-time
- **final**: não pode ser sobrescrito
- **private**: não herdado

---

## Fundamentos

### 1. Métodos São Virtuais por Padrão

Em Java, **todos** os métodos de instância são **virtuais** (exceto static, final, private).

```java
public class Forma {
    public void desenhar() { // Método virtual
        System.out.println("Forma");
    }
}

public class Circulo extends Forma {
    @Override
    public void desenhar() { // Sobrescreve método virtual
        System.out.println("Circulo");
    }
}

Forma f = new Circulo();
f.desenhar(); // Virtual invocation: Circulo.desenhar()
```

### 2. Contraste com C++

**Java**: virtual por padrão.
**C++**: requer palavra-chave `virtual`.

```java
// Java: virtual por padrão
public class Animal {
    public void som() { } // Virtual
}

// C++ (não é Java, apenas comparação)
// class Animal {
//     virtual void som() { } // Precisa de virtual
// };
```

### 3. Resolução em Runtime

Virtual method invocation: JVM **consulta tipo do objeto** em runtime.

```java
Animal a1 = new Cachorro();
Animal a2 = new Gato();

// Runtime: JVM determina tipo do objeto
a1.som(); // Cachorro.som()
a2.som(); // Gato.som()
```

### 4. Polimorfismo Baseado em Virtual Methods

**Polimorfismo** funciona através de virtual method invocation.

```java
public void processar(Animal animal) {
    animal.som(); // Virtual invocation: runtime determina implementação
}

processar(new Cachorro()); // Virtual: Cachorro.som()
processar(new Gato());     // Virtual: Gato.som()
processar(new Passaro());  // Virtual: Passaro.som()
```

### 5. Métodos static Não São Virtuais

Métodos **static** são resolvidos em **compile-time** (não virtuais).

```java
public class Animal {
    public static void categoria() {
        System.out.println("Animal");
    }
}

public class Cachorro extends Animal {
    public static void categoria() {
        System.out.println("Cachorro");
    }
}

Animal a = new Cachorro();
a.categoria(); // "Animal" - compile-time, não virtual
Animal.categoria(); // "Animal"
Cachorro.categoria(); // "Cachorro"
```

### 6. Métodos final Não São Virtuais

Métodos **final** não podem ser sobrescritos, logo **não são virtuais**.

```java
public class Animal {
    public final void respirar() {
        System.out.println("Respirando");
    }
}

public class Cachorro extends Animal {
    // ❌ Não pode sobrescrever final
}

Animal a = new Cachorro();
a.respirar(); // Chamada direta (não virtual)
```

### 7. Métodos private Não São Virtuais

Métodos **private** não são herdados, logo **não são virtuais**.

```java
public class Animal {
    private void metabolismo() {
        System.out.println("Metabolismo Animal");
    }
    
    public void processar() {
        metabolismo(); // Chamada direta (não virtual)
    }
}

public class Cachorro extends Animal {
    private void metabolismo() { // Não sobrescreve
        System.out.println("Metabolismo Cachorro");
    }
}

Animal a = new Cachorro();
a.processar(); // "Metabolismo Animal" - não virtual
```

### 8. Virtual Method Table (vtable)

JVM usa **vtable** (tabela de métodos virtuais) para implementar virtual method invocation.

```java
// Conceitual: vtable
class Animal {
    vtable: {
        som -> Animal.som()
        mover -> Animal.mover()
    }
}

class Cachorro extends Animal {
    vtable: {
        som -> Cachorro.som()      // Sobrescrito
        mover -> Animal.mover()    // Herdado
        latir -> Cachorro.latir()  // Novo
    }
}

Animal a = new Cachorro();
a.som(); // JVM: consulta vtable de Cachorro → Cachorro.som()
```

### 9. Lookup em Hierarquia

Virtual method invocation faz **lookup** na hierarquia de classes.

```java
public class Animal {
    public void som() {
        System.out.println("Animal");
    }
}

public class Mamifero extends Animal {
    // Não sobrescreve som()
}

public class Cachorro extends Mamifero {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}

Animal a = new Cachorro();
a.som(); // Virtual lookup: Cachorro → Mamifero → Animal → Cachorro (encontrado)
```

### 10. Invocação de Métodos de Object

Métodos de **Object** são virtuais.

```java
public class Pessoa {
    private String nome;
    
    @Override
    public String toString() { // Virtual
        return "Pessoa[nome=" + nome + "]";
    }
}

Object o = new Pessoa();
o.toString(); // Virtual invocation: Pessoa.toString()
```

---

## Aplicabilidade

**Virtual method invocation é usado para**:
- **Polimorfismo**: processar diferentes tipos uniformemente
- **Extensibilidade**: adicionar novos tipos sem alterar código
- **Design patterns**: Strategy, Template Method, Command, State
- **Frameworks**: plugins, callbacks, extensões
- **APIs**: interfaces públicas flexíveis

**Não use virtual methods quando**:
- **Performance crítica** (use final para otimização)
- **Método não deve ser sobrescrito** (use final)
- **Método é auxiliar interno** (use private)

---

## Armadilhas

### 1. Confundir Virtual com Static

```java
public class Animal {
    public static void info() { // Não virtual
        System.out.println("Animal");
    }
}

public class Cachorro extends Animal {
    public static void info() { // Hiding, não virtual
        System.out.println("Cachorro");
    }
}

Animal a = new Cachorro();
a.info(); // "Animal" - compile-time, não virtual
```

### 2. Métodos private Não São Virtuais

```java
public class Animal {
    private void metodo() {
        System.out.println("Animal");
    }
    
    public void executar() {
        metodo(); // Não virtual
    }
}

public class Cachorro extends Animal {
    private void metodo() { // Não sobrescreve
        System.out.println("Cachorro");
    }
}

Animal a = new Cachorro();
a.executar(); // "Animal" - metodo() não é virtual
```

### 3. Construtores e Virtual Methods

```java
public class Animal {
    public Animal() {
        inicializar(); // ⚠️ Virtual method em construtor
    }
    
    public void inicializar() {
        System.out.println("Animal");
    }
}

public class Cachorro extends Animal {
    private String raca = "Labrador";
    
    @Override
    public void inicializar() {
        System.out.println("Raça: " + raca); // null! (campo não inicializado)
    }
}

Cachorro c = new Cachorro(); // "Raça: null"
```

### 4. Métodos final Não São Virtuais

```java
public class Animal {
    public final void respirar() {
        System.out.println("Respirando");
    }
}

Animal a = new Cachorro();
a.respirar(); // Chamada direta (não virtual, pode ser inlined)
```

### 5. Tipo da Referência Limita Acesso

```java
Animal a = new Cachorro();
a.som();    // ✅ Virtual: Cachorro.som()
// a.latir(); // ❌ Erro: Animal não tem latir()

// Solução: cast
((Cachorro) a).latir();
```

### 6. NullPointerException

```java
Animal a = null;
a.som(); // ❌ Runtime: NullPointerException

// Virtual invocation requer objeto não-nulo
```

### 7. Arrays Covariantes

```java
Animal[] animais = new Cachorro[5]; // Covariante

animais[0] = new Cachorro(); // OK
animais[1] = new Gato();     // ❌ Runtime: ArrayStoreException

// Arrays usam runtime checking, mas não são type-safe
```

---

## Boas Práticas

### 1. Use Virtual Methods para Polimorfismo

```java
public abstract class Processador {
    public void executar() {
        inicializar();
        processar(); // Virtual
        finalizar();
    }
    
    protected abstract void processar(); // Virtual
}

public class ProcessadorA extends Processador {
    @Override
    protected void processar() {
        System.out.println("Processando A");
    }
}

Processador p = new ProcessadorA();
p.executar(); // Virtual: ProcessadorA.processar()
```

### 2. Template Method Pattern

```java
public abstract class Relatorio {
    public final void gerar() { // final: não pode ser sobrescrito
        inicializar();
        carregarDados();   // Virtual
        processar();       // Virtual
        salvar();
    }
    
    protected abstract void carregarDados(); // Virtual
    protected abstract void processar();     // Virtual
}

public class RelatorioVendas extends Relatorio {
    @Override
    protected void carregarDados() {
        System.out.println("Carregando vendas");
    }
    
    @Override
    protected void processar() {
        System.out.println("Processando vendas");
    }
}
```

### 3. Strategy Pattern

```java
public interface Strategy {
    void executar(); // Virtual (interface)
}

public class StrategyA implements Strategy {
    @Override
    public void executar() {
        System.out.println("Estratégia A");
    }
}

public class Contexto {
    private Strategy strategy;
    
    public void executar() {
        strategy.executar(); // Virtual invocation
    }
}
```

### 4. Command Pattern

```java
public interface Command {
    void executar(); // Virtual
}

public class SalvarCommand implements Command {
    @Override
    public void executar() {
        System.out.println("Salvando");
    }
}

List<Command> comandos = new ArrayList<>();
comandos.add(new SalvarCommand());
comandos.add(new ImprimirCommand());

for (Command cmd : comandos) {
    cmd.executar(); // Virtual invocation
}
```

### 5. State Pattern

```java
public interface Estado {
    void processar(); // Virtual
}

public class EstadoAtivo implements Estado {
    @Override
    public void processar() {
        System.out.println("Processando ativo");
    }
}

public class Contexto {
    private Estado estado;
    
    public void executar() {
        estado.processar(); // Virtual invocation
    }
}
```

### 6. Observer Pattern

```java
public interface Observer {
    void atualizar(String evento); // Virtual
}

public class ObserverA implements Observer {
    @Override
    public void atualizar(String evento) {
        System.out.println("ObserverA: " + evento);
    }
}

public class Subject {
    private List<Observer> observers = new ArrayList<>();
    
    public void notificar(String evento) {
        for (Observer o : observers) {
            o.atualizar(evento); // Virtual invocation
        }
    }
}
```

### 7. Factory Method

```java
public abstract class Creator {
    public void operacao() {
        Produto p = criarProduto(); // Virtual
        p.usar();
    }
    
    protected abstract Produto criarProduto(); // Virtual
}

public class CreatorA extends Creator {
    @Override
    protected Produto criarProduto() {
        return new ProdutoA();
    }
}
```

### 8. Visitor Pattern (Double Dispatch)

```java
public interface Forma {
    void aceitar(Visitor visitor); // Virtual
}

public class Circulo implements Forma {
    @Override
    public void aceitar(Visitor visitor) {
        visitor.visitar(this); // Virtual
    }
}

public interface Visitor {
    void visitar(Circulo circulo);   // Virtual
    void visitar(Retangulo retangulo); // Virtual
}

// Double dispatch: duas virtual invocations
Forma f = new Circulo();
Visitor v = new DesenharVisitor();
f.aceitar(v); // 1ª virtual: Circulo.aceitar()
              // 2ª virtual: visitor.visitar(Circulo)
```

### 9. Comparable

```java
public class Funcionario implements Comparable<Funcionario> {
    private double salario;
    
    @Override
    public int compareTo(Funcionario outro) { // Virtual
        return Double.compare(this.salario, outro.salario);
    }
}

List<Funcionario> funcionarios = new ArrayList<>();
Collections.sort(funcionarios); // Virtual: compareTo()
```

### 10. Use final para Otimização

```java
public class Animal {
    // Método não será sobrescrito: use final
    public final void respirar() {
        System.out.println("Respirando");
    }
    
    // Método pode ser sobrescrito: virtual
    public void som() {
        System.out.println("Som");
    }
}

// final permite otimizações (inlining)
Animal a = new Cachorro();
a.respirar(); // Chamada direta (não virtual)
a.som();      // Virtual invocation
```

---

## Resumo

**Virtual Method Invocation**: métodos de instância são **virtuais** por padrão, resolvidos em **runtime** baseado no **tipo do objeto**.

```java
Animal a = new Cachorro();
a.som(); // Virtual invocation: runtime → Cachorro.som()
```

**Métodos virtuais**:
- **Métodos de instância** (por padrão)
- **Sobrescritos** em subclasses
- **Resolvidos em runtime**

**Métodos NÃO virtuais**:
```java
// static: compile-time
public static void metodo() { }

// final: não pode ser sobrescrito
public final void metodo() { }

// private: não herdado
private void metodo() { }
```

**Java vs C++**:
- **Java**: virtual por padrão
- **C++**: requer `virtual`

**Virtual Table (vtable)**:
```java
// JVM consulta vtable em runtime
Animal a = new Cachorro();
a.som(); // vtable de Cachorro → Cachorro.som()
```

**Polimorfismo**:
```java
List<Animal> animais = Arrays.asList(
    new Cachorro(), new Gato(), new Passaro()
);

for (Animal a : animais) {
    a.som(); // Virtual invocation: implementação específica
}
```

**Design Patterns**:
- Template Method (métodos virtuais abstratos)
- Strategy (interface virtual)
- Command (executar() virtual)
- State (processar() virtual)
- Observer (atualizar() virtual)
- Factory Method (criarProduto() virtual)

**Otimização**:
```java
// final: não virtual, pode ser inlined
public final void metodo() { }
```

**Quando usar**:
- Polimorfismo (processar diferentes tipos uniformemente)
- Extensibilidade (adicionar novos tipos)
- Design patterns (callbacks, plugins)

**Regra de Ouro**: Métodos de instância são **virtuais** por padrão em Java. Virtual invocation permite **polimorfismo dinâmico**. Use **final** para métodos que **não devem ser sobrescritos** (permite otimizações). Evite virtual methods em **construtores** (campos podem não estar inicializados).
