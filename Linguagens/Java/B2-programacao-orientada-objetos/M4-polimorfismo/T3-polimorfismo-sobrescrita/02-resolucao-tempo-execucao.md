# T3.02 - Resolução em Tempo de Execução (Dynamic Binding)

## Introdução

**Resolução em tempo de execução (Runtime Resolution)**: compilador **não** decide qual método chamar; JVM decide **durante execução** baseado no **tipo do objeto**.

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
a.som(); // Runtime: Cachorro.som()
```

**Dynamic Binding (Late Binding)**: ligação entre **chamada de método** e **implementação** ocorre em **runtime**.

**Contraste com Sobrecarga**:
- **Sobrecarga**: compile-time (early binding)
- **Sobrescrita**: runtime (late binding)

---

## Fundamentos

### 1. Tipo da Referência vs Tipo do Objeto

**Tipo da referência**: conhecido em **compile-time**.
**Tipo do objeto**: conhecido em **runtime**.

```java
Animal a = new Cachorro(); // Referência: Animal, Objeto: Cachorro
a.som(); // Runtime: Cachorro.som()

a = new Gato(); // Referência: Animal, Objeto: Gato
a.som(); // Runtime: Gato.som()
```

### 2. JVM Consulta Tipo do Objeto

JVM consulta o **tipo do objeto** (não da referência) para determinar qual método chamar.

```java
public class Teste {
    public static void main(String[] args) {
        Animal a1 = new Cachorro();
        Animal a2 = new Gato();
        Animal a3 = new Passaro();
        
        a1.som(); // Runtime: tipo do objeto = Cachorro
        a2.som(); // Runtime: tipo do objeto = Gato
        a3.som(); // Runtime: tipo do objeto = Passaro
    }
}
```

### 3. Polimorfismo Dinâmico

**Polimorfismo dinâmico**: comportamento muda baseado no **tipo do objeto em runtime**.

```java
public class Processador {
    public void processar(Animal animal) {
        animal.som(); // Método chamado depende do tipo do objeto
    }
}

Processador p = new Processador();
p.processar(new Cachorro()); // "Au au"
p.processar(new Gato());     // "Miau"
p.processar(new Passaro());  // "Piu piu"
```

### 4. Virtual Method Invocation

Java usa **virtual method invocation**: métodos de instância são **sempre virtuais** (exceto final, static, private).

```java
// Método virtual: resolvido em runtime
Animal a = new Cachorro();
a.som(); // Virtual method invocation

// Método não virtual: resolvido em compile-time
Animal.info(); // Método static
```

### 5. Tabela de Métodos Virtuais (VTable)

JVM usa **vtable** (virtual method table) para cada classe, contendo ponteiros para implementações de métodos.

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
        latir -> Cachorro.latir()  // Novo método
    }
}

Animal a = new Cachorro();
a.som(); // JVM: consulta vtable de Cachorro, chama Cachorro.som()
```

### 6. Resolução em Runtime vs Compile-time

**Sobrescrita (runtime)**:
```java
Animal a = new Cachorro();
a.som(); // Runtime: Cachorro.som()
```

**Sobrecarga (compile-time)**:
```java
Calculadora c = new Calculadora();
c.somar(5, 10);     // Compile-time: somar(int, int)
c.somar(5.5, 10.2); // Compile-time: somar(double, double)
```

### 7. Compilador Valida Tipo da Referência

Compilador **valida** métodos disponíveis baseado no **tipo da referência**.

```java
Animal a = new Cachorro();
a.som();    // ✅ OK: Animal tem som()
// a.latir(); // ❌ Erro: Animal não tem latir()

Cachorro c = new Cachorro();
c.som();    // ✅ OK
c.latir();  // ✅ OK
```

### 8. Cast para Acessar Métodos da Subclasse

Use **cast** para acessar métodos específicos da subclasse.

```java
Animal a = new Cachorro();
// a.latir(); // ❌ Erro

// ✅ Cast
((Cachorro) a).latir(); // OK

// ✅ Cast com verificação
if (a instanceof Cachorro) {
    Cachorro c = (Cachorro) a;
    c.latir();
}
```

### 9. instanceof para Verificar Tipo

Use **instanceof** para verificar tipo do objeto em runtime.

```java
public void processar(Animal animal) {
    if (animal instanceof Cachorro) {
        System.out.println("É cachorro");
        ((Cachorro) animal).latir();
    } else if (animal instanceof Gato) {
        System.out.println("É gato");
        ((Gato) animal).miar();
    }
}
```

### 10. Performance de Dynamic Binding

**Dynamic binding** tem **pequeno overhead** comparado a chamada direta.

```java
// Chamada direta (mais rápida)
Cachorro c = new Cachorro();
c.som(); // Chamada direta

// Dynamic binding (overhead mínimo)
Animal a = new Cachorro();
a.som(); // Consulta vtable

// Otimização JIT: JVM pode inline métodos frequentes
```

---

## Aplicabilidade

**Use dynamic binding quando**:
- **Polimorfismo**: processar diferentes tipos uniformemente
- **Extensibilidade**: adicionar novos tipos sem alterar código
- **Design patterns**: Strategy, Template Method, Command
- **Collections heterogêneas**: List<Animal>

**Evite dynamic binding quando**:
- **Performance crítica** (micro-otimização)
- **Tipo conhecido** (use tipo específico)
- **Métodos final, static, private** (não usam dynamic binding)

---

## Armadilhas

### 1. Confundir Tipo da Referência com Tipo do Objeto

```java
Animal a = new Cachorro();

// ⚠️ Tipo da referência: Animal
// System.out.println(a.getClass()); // Cachorro

// ❌ Erro: latir() não está em Animal
// a.latir();

// ✅ Cast necessário
((Cachorro) a).latir();
```

### 2. ClassCastException

```java
Animal a = new Gato();

// ❌ Runtime error: ClassCastException
// Cachorro c = (Cachorro) a;

// ✅ Verificar antes
if (a instanceof Cachorro) {
    Cachorro c = (Cachorro) a;
}
```

### 3. Métodos static Não Usam Dynamic Binding

```java
public class Animal {
    public static void info() {
        System.out.println("Animal");
    }
}

public class Cachorro extends Animal {
    public static void info() {
        System.out.println("Cachorro");
    }
}

Animal a = new Cachorro();
a.info(); // "Animal" - tipo da referência, não do objeto
```

### 4. Métodos private Não São Polimórficos

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

### 5. Métodos final Não Usam Dynamic Binding

```java
public class Animal {
    public final void respirar() {
        System.out.println("Respirando");
    }
}

// final: compilador pode otimizar (inline)
Animal a = new Cachorro();
a.respirar(); // Chamada direta (sem vtable)
```

### 6. Construtores Não São Polimórficos

```java
public class Animal {
    public Animal() {
        inicializar(); // Chama Cachorro.inicializar()
    }
    
    public void inicializar() {
        System.out.println("Animal inicializado");
    }
}

public class Cachorro extends Animal {
    private String raca = "Labrador";
    
    @Override
    public void inicializar() {
        System.out.println("Raça: " + raca); // null!
    }
}

// ⚠️ Perigo: campo não inicializado
Cachorro c = new Cachorro();
// Raça: null (campo não inicializado ainda)
```

### 7. Arrays Covariantes

```java
Animal[] animais = new Cachorro[5]; // OK: covariante

animais[0] = new Cachorro(); // OK
animais[1] = new Gato();     // ❌ Runtime: ArrayStoreException
```

---

## Boas Práticas

### 1. Prefira Tipo da Interface/Superclasse

```java
// ✅ Tipo da interface
List<String> lista = new ArrayList<>();

// ⚠️ Tipo da implementação
ArrayList<String> lista2 = new ArrayList<>();
```

### 2. Use instanceof Antes de Cast

```java
public void processar(Animal animal) {
    if (animal instanceof Cachorro cachorro) { // Pattern matching (Java 16+)
        cachorro.latir();
    }
}
```

### 3. Polimorfismo para Collections

```java
List<Animal> animais = new ArrayList<>();
animais.add(new Cachorro());
animais.add(new Gato());
animais.add(new Passaro());

for (Animal a : animais) {
    a.som(); // Polimorfismo: cada tipo executa seu método
}
```

### 4. Strategy Pattern

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
strategy.ordenar(array);
```

### 5. Template Method Pattern

```java
public abstract class Relatorio {
    public final void gerar() {
        inicializar();
        carregarDados();   // Runtime: implementação específica
        processar();       // Runtime: implementação específica
        salvar();
    }
    
    protected abstract void carregarDados();
    protected abstract void processar();
}

Relatorio r = obterRelatorio(); // Runtime: tipo específico
r.gerar(); // Dynamic binding para métodos abstratos
```

### 6. Command Pattern

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

public class ImprimirCommand implements Command {
    @Override
    public void executar() {
        System.out.println("Imprimindo");
    }
}

// Runtime: comando escolhido dinamicamente
List<Command> comandos = new ArrayList<>();
comandos.add(new SalvarCommand());
comandos.add(new ImprimirCommand());

for (Command cmd : comandos) {
    cmd.executar(); // Dynamic binding
}
```

### 7. Visitor Pattern (Double Dispatch)

```java
public interface Forma {
    void aceitar(Visitor visitor);
}

public class Circulo implements Forma {
    @Override
    public void aceitar(Visitor visitor) {
        visitor.visitar(this);
    }
}

public interface Visitor {
    void visitar(Circulo circulo);
    void visitar(Retangulo retangulo);
}

// Double dispatch: duas resoluções em runtime
Forma f = new Circulo();
Visitor v = new DesenharVisitor();
f.aceitar(v); // 1ª resolução: Circulo.aceitar()
              // 2ª resolução: visitor.visitar(Circulo)
```

### 8. Factory Method

```java
public abstract class Creator {
    public void operacao() {
        Produto p = criarProduto(); // Runtime: implementação específica
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

### 9. Comparable

```java
List<Funcionario> funcionarios = new ArrayList<>();
funcionarios.add(new Gerente());
funcionarios.add(new Vendedor());

// Runtime: compareTo() de cada tipo
Collections.sort(funcionarios);
```

### 10. Evite Métodos Polimórficos em Construtores

```java
// ❌ Evite
public class Animal {
    public Animal() {
        inicializar(); // Chama método polimórfico
    }
    
    public void inicializar() { }
}

// ✅ Prefira
public class Animal {
    private Animal() { }
    
    public static Animal criar() {
        Animal a = new Animal();
        a.inicializar();
        return a;
    }
    
    public void inicializar() { }
}
```

---

## Resumo

**Resolução em runtime**: JVM decide qual método chamar baseado no **tipo do objeto** (não da referência).

```java
Animal a = new Cachorro(); // Referência: Animal, Objeto: Cachorro
a.som(); // Runtime: Cachorro.som()
```

**Dynamic Binding (Late Binding)**:
- Ligação entre **chamada** e **implementação** em **runtime**
- JVM consulta **vtable** do tipo do objeto
- **Métodos de instância** são virtuais (exceto final, static, private)

**Tipo da referência vs Tipo do objeto**:
```java
Animal a = new Cachorro();
a.som();    // ✅ Runtime: Cachorro.som()
// a.latir(); // ❌ Compile-time: Animal não tem latir()
```

**instanceof e cast**:
```java
if (a instanceof Cachorro cachorro) {
    cachorro.latir();
}
```

**Métodos não polimórficos**:
- **static**: tipo da referência
- **final**: pode ser inlined
- **private**: não herdado

**Polimorfismo dinâmico**:
```java
List<Animal> animais = Arrays.asList(
    new Cachorro(), new Gato(), new Passaro()
);

for (Animal a : animais) {
    a.som(); // Runtime: tipo específico
}
```

**Performance**:
- **Overhead mínimo** (consulta vtable)
- **JIT otimiza** métodos frequentes
- **Métodos final** podem ser inlined

**Quando usar**:
- Polimorfismo (processar diferentes tipos uniformemente)
- Design patterns (Strategy, Template Method, Command)
- Collections heterogêneas

**Regra de Ouro**: **Sobrescrita** usa **dynamic binding** (runtime). **Tipo do objeto** determina método chamado. **Tipo da referência** determina métodos disponíveis em compile-time. Use **instanceof** antes de **cast**.
