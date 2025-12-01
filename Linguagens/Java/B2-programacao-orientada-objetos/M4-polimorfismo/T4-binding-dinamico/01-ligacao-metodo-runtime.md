# T4.01 - Ligação de Método em Runtime

## Introdução

**Ligação de método em runtime (Runtime Method Binding)**: decisão de **qual método** chamar é feita durante **execução**, não durante **compilação**.

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

// Compile-time: tipo da referência = Animal
// Runtime: tipo do objeto = Cachorro
Animal a = new Cachorro();
a.som(); // Runtime: JVM determina qual som() chamar
```

**Late Binding (Dynamic Binding)**: ligação **tardia**, ocorre em **runtime**.

**Early Binding (Static Binding)**: ligação **precoce**, ocorre em **compile-time** (sobrecarga, métodos static/final/private).

---

## Fundamentos

### 1. Decisão em Runtime

JVM decide **qual método chamar** baseado no **tipo do objeto** (não da referência).

```java
Animal a1 = new Cachorro();
Animal a2 = new Gato();
Animal a3 = new Passaro();

// Runtime: JVM consulta tipo do objeto
a1.som(); // Cachorro.som()
a2.som(); // Gato.som()
a3.som(); // Passaro.som()
```

### 2. Tipo da Referência vs Tipo do Objeto

**Compile-time**: validação baseada no **tipo da referência**.
**Runtime**: execução baseada no **tipo do objeto**.

```java
Animal a = new Cachorro(); // Referência: Animal, Objeto: Cachorro

// Compile-time: valida Animal.som() existe
a.som(); // ✅ OK: Animal tem som()

// Compile-time: valida Animal.latir() existe
// a.latir(); // ❌ Erro: Animal não tem latir()

// Runtime: executa Cachorro.som()
a.som(); // "Au au" - Cachorro.som()
```

### 3. Polimorfismo Dinâmico

**Polimorfismo dinâmico**: mesmo código, **comportamentos diferentes** em runtime.

```java
public void processar(Animal animal) {
    animal.som(); // Runtime: comportamento depende do tipo do objeto
}

processar(new Cachorro()); // "Au au"
processar(new Gato());     // "Miau"
processar(new Passaro());  // "Piu piu"
```

### 4. Method Lookup em Runtime

JVM faz **method lookup** (busca de método) em runtime:
1. Consulta **tipo do objeto**
2. Busca método na **classe do objeto**
3. Se não encontrar, busca na **superclasse**
4. Continua até **Object** ou encontrar método

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
a.som(); // Runtime lookup: Cachorro → Mamifero (não tem) → Animal (não tem) → Cachorro (encontrado)
```

### 5. Dynamic Dispatch

**Dynamic dispatch**: mecanismo que **despacha** (direciona) chamada de método para implementação correta em runtime.

```java
List<Animal> animais = Arrays.asList(
    new Cachorro(), new Gato(), new Passaro()
);

for (Animal a : animais) {
    a.som(); // Dynamic dispatch: cada iteração chama implementação diferente
}
```

### 6. Resolução de Métodos Sobrescritos

Runtime binding resolve **métodos sobrescritos**.

```java
public class Forma {
    public void desenhar() {
        System.out.println("Forma");
    }
}

public class Circulo extends Forma {
    @Override
    public void desenhar() {
        System.out.println("Circulo");
    }
}

Forma f = new Circulo();
f.desenhar(); // Runtime: Circulo.desenhar()
```

### 7. Métodos Herdados (Não Sobrescritos)

Métodos **herdados** (não sobrescritos) também usam runtime binding.

```java
public class Animal {
    public void respirar() {
        System.out.println("Respirando");
    }
    
    public void som() {
        System.out.println("Som");
    }
}

public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
    // respirar() não é sobrescrito
}

Animal a = new Cachorro();
a.som();      // Runtime: Cachorro.som()
a.respirar(); // Runtime: busca em Cachorro → não encontra → Animal.respirar()
```

### 8. Substituição de Liskov

Runtime binding suporta **Princípio de Substituição de Liskov**: subclasse pode **substituir** superclasse.

```java
public void processar(List<Animal> animais) {
    for (Animal a : animais) {
        a.som(); // Runtime: comportamento correto para cada subtipo
    }
}

// Liskov: substituir Animal por qualquer subtipo
processar(Arrays.asList(new Cachorro(), new Gato()));
```

### 9. instanceof para Verificação

Use **instanceof** para verificar tipo em runtime.

```java
public void processar(Animal animal) {
    if (animal instanceof Cachorro cachorro) { // Pattern matching (Java 16+)
        cachorro.latir(); // Acessa método específico
    }
    
    animal.som(); // Runtime binding
}
```

### 10. Casting e Runtime Binding

**Cast** permite acessar métodos específicos, mas **não afeta** runtime binding.

```java
Animal a = new Cachorro();
a.som(); // Runtime: Cachorro.som()

Cachorro c = (Cachorro) a; // Cast
c.som(); // Runtime: Cachorro.som() (mesmo resultado)
c.latir(); // Acessa método específico de Cachorro
```

---

## Aplicabilidade

**Use runtime binding quando**:
- **Polimorfismo**: processar diferentes tipos uniformemente
- **Extensibilidade**: adicionar novos tipos sem alterar código
- **Design patterns**: Strategy, Template Method, Command, State
- **Collections heterogêneas**: List<Animal>
- **Frameworks**: plugins, extensões

**Evite runtime binding quando**:
- **Performance crítica** (micro-otimização)
- **Tipo conhecido** (use tipo específico)
- **Métodos final/static/private** (não usam runtime binding)

---

## Armadilhas

### 1. Confundir Tipo da Referência com Tipo do Objeto

```java
Animal a = new Cachorro();

// ⚠️ Compile-time: tipo da referência
System.out.println(a.getClass()); // Cachorro (tipo do objeto)

// ❌ Erro: latir() não está em Animal
// a.latir();

// ✅ Runtime: tipo do objeto
a.som(); // "Au au" - Cachorro.som()
```

### 2. ClassCastException

```java
Animal a = new Gato();

// ❌ Runtime error: ClassCastException
// Cachorro c = (Cachorro) a;

// ✅ Verificar antes
if (a instanceof Cachorro cachorro) {
    cachorro.latir();
}
```

### 3. Métodos static Não Usam Runtime Binding

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
a.categoria(); // "Animal" - compile-time, não runtime
```

### 4. Métodos final Não Usam Runtime Binding

```java
public class Animal {
    public final void respirar() {
        System.out.println("Respirando");
    }
}

// final: compilador pode otimizar (inline)
Animal a = new Cachorro();
a.respirar(); // Chamada direta (sem runtime binding)
```

### 5. Métodos private Não São Polimórficos

```java
public class Animal {
    private void metabolismo() {
        System.out.println("Metabolismo Animal");
    }
    
    public void processar() {
        metabolismo(); // Chama Animal.metabolismo()
    }
}

public class Cachorro extends Animal {
    private void metabolismo() {
        System.out.println("Metabolismo Cachorro");
    }
}

Animal a = new Cachorro();
a.processar(); // "Metabolismo Animal" - private não é polimórfico
```

### 6. Construtores e Runtime Binding

```java
public class Animal {
    public Animal() {
        inicializar(); // ⚠️ Chama método sobrescrito antes de inicializar subclasse
    }
    
    public void inicializar() {
        System.out.println("Animal inicializado");
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

### 7. Arrays Covariantes (Não Type-Safe)

```java
Animal[] animais = new Cachorro[5]; // OK: covariante

animais[0] = new Cachorro(); // OK
animais[1] = new Gato();     // ❌ Runtime: ArrayStoreException

// Arrays usam runtime checking, mas não são type-safe
```

---

## Boas Práticas

### 1. Polimorfismo para Collections

```java
List<Animal> animais = new ArrayList<>();
animais.add(new Cachorro());
animais.add(new Gato());
animais.add(new Passaro());

for (Animal a : animais) {
    a.som(); // Runtime binding: cada tipo executa seu método
}
```

### 2. Strategy Pattern

```java
public interface OrdenacaoStrategy {
    void ordenar(int[] array);
}

public class BubbleSort implements OrdenacaoStrategy {
    @Override
    public void ordenar(int[] array) {
        // Implementação
    }
}

public class QuickSort implements OrdenacaoStrategy {
    @Override
    public void ordenar(int[] array) {
        // Implementação
    }
}

// Runtime: estratégia escolhida dinamicamente
OrdenacaoStrategy strategy = escolherEstrategia();
strategy.ordenar(array); // Runtime binding
```

### 3. Template Method Pattern

```java
public abstract class Relatorio {
    public final void gerar() {
        inicializar();
        carregarDados();   // Runtime binding
        processar();       // Runtime binding
        salvar();
    }
    
    protected abstract void carregarDados();
    protected abstract void processar();
}

Relatorio r = obterRelatorio(); // Runtime: tipo específico
r.gerar(); // Runtime binding para métodos abstratos
```

### 4. Command Pattern

```java
public interface Command {
    void executar();
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
    cmd.executar(); // Runtime binding
}
```

### 5. State Pattern

```java
public interface Estado {
    void processar();
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
        estado.processar(); // Runtime binding
    }
}
```

### 6. Visitor Pattern (Double Dispatch)

```java
public interface Forma {
    void aceitar(Visitor visitor);
}

public class Circulo implements Forma {
    @Override
    public void aceitar(Visitor visitor) {
        visitor.visitar(this); // Runtime binding
    }
}

public interface Visitor {
    void visitar(Circulo circulo);
    void visitar(Retangulo retangulo);
}

// Double dispatch: duas resoluções em runtime
Forma f = new Circulo();
Visitor v = new DesenharVisitor();
f.aceitar(v); // 1ª: Circulo.aceitar() - 2ª: visitor.visitar(Circulo)
```

### 7. Factory Method

```java
public abstract class Creator {
    public void operacao() {
        Produto p = criarProduto(); // Runtime binding
        p.usar();
    }
    
    protected abstract Produto criarProduto();
}

public class CreatorA extends Creator {
    @Override
    protected Produto criarProduto() {
        return new ProdutoA();
    }
}
```

### 8. Observer Pattern

```java
public interface Observer {
    void atualizar(String evento);
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
            o.atualizar(evento); // Runtime binding
        }
    }
}
```

### 9. Comparable

```java
List<Funcionario> funcionarios = new ArrayList<>();
funcionarios.add(new Gerente());
funcionarios.add(new Vendedor());

// Runtime binding: compareTo() de cada tipo
Collections.sort(funcionarios);
```

### 10. Evite instanceof Excessivo

```java
// ❌ Evite
public void processar(Animal animal) {
    if (animal instanceof Cachorro) {
        ((Cachorro) animal).latir();
    } else if (animal instanceof Gato) {
        ((Gato) animal).miar();
    }
}

// ✅ Prefira polimorfismo
public interface Animal {
    void fazerSom();
}

public void processar(Animal animal) {
    animal.fazerSom(); // Runtime binding
}
```

---

## Resumo

**Ligação de método em runtime**: JVM decide **qual método** chamar durante **execução**, baseado no **tipo do objeto**.

```java
Animal a = new Cachorro(); // Referência: Animal, Objeto: Cachorro
a.som(); // Runtime: Cachorro.som()
```

**Late Binding (Dynamic Binding)**:
- Ligação **tardia** (runtime)
- JVM consulta **tipo do objeto**
- Suporta **polimorfismo dinâmico**

**Contraste com Early Binding**:
```java
// Early binding (compile-time)
calc.somar(5, 10); // Compilador decide

// Late binding (runtime)
Animal a = new Cachorro();
a.som(); // JVM decide
```

**Method Lookup**:
1. Consulta tipo do objeto
2. Busca método na classe do objeto
3. Se não encontrar, busca na superclasse
4. Continua até Object

**Dynamic Dispatch**:
```java
List<Animal> animais = Arrays.asList(
    new Cachorro(), new Gato(), new Passaro()
);

for (Animal a : animais) {
    a.som(); // Cada iteração: implementação diferente
}
```

**Métodos não usam runtime binding**:
- **static**: tipo da referência
- **final**: pode ser inlined
- **private**: não herdado

**instanceof e cast**:
```java
if (animal instanceof Cachorro cachorro) {
    cachorro.latir();
}
```

**Design Patterns**:
- Strategy, Template Method, Command, State
- Factory Method, Observer, Visitor

**Quando usar**:
- Polimorfismo (processar diferentes tipos uniformemente)
- Extensibilidade (adicionar novos tipos)
- Collections heterogêneas

**Regra de Ouro**: Runtime binding permite **polimorfismo dinâmico**: JVM decide qual método chamar baseado no **tipo do objeto** (não da referência). Métodos **sobrescritos** usam runtime binding. Métodos **static/final/private** não usam.
