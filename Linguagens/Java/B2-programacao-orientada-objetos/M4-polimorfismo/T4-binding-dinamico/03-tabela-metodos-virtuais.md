# T4.03 - Tabela de Métodos Virtuais (VTable)

## Introdução

**VTable (Virtual Method Table)**: estrutura de dados usada pela JVM para implementar **polimorfismo dinâmico**, contendo **ponteiros** para implementações de métodos virtuais.

```java
// Conceitual: cada classe tem sua vtable
class Animal {
    vtable: {
        som()    -> Animal.som()
        mover()  -> Animal.mover()
        toString() -> Object.toString()
    }
}

class Cachorro extends Animal {
    vtable: {
        som()    -> Cachorro.som()      // Sobrescrito
        mover()  -> Animal.mover()      // Herdado
        latir()  -> Cachorro.latir()    // Novo
        toString() -> Object.toString()  // Herdado
    }
}
```

**Funcionamento**:
1. Cada **classe** tem uma **vtable**
2. Cada **objeto** tem **ponteiro** para vtable da classe
3. **Virtual method invocation**: JVM consulta vtable

**Objetivo**: implementar **dynamic dispatch** eficientemente.

---

## Fundamentos

### 1. Estrutura da VTable

VTable contém **endereços** de métodos virtuais.

```java
// Conceitual: vtable
class Animal {
    public void som() { }     // Índice 0
    public void mover() { }   // Índice 1
}

vtable_Animal:
    [0] -> Animal.som()
    [1] -> Animal.mover()
```

### 2. VTable em Herança

Subclasse **herda** vtable da superclasse e **atualiza** entradas sobrescritas.

```java
class Animal {
    public void som() { }
    public void mover() { }
}

class Cachorro extends Animal {
    @Override
    public void som() { } // Sobrescreve
    public void latir() { } // Novo
}

vtable_Animal:
    [0] -> Animal.som()
    [1] -> Animal.mover()

vtable_Cachorro:
    [0] -> Cachorro.som()   // Sobrescrito
    [1] -> Animal.mover()   // Herdado
    [2] -> Cachorro.latir() // Novo
```

### 3. Objeto Aponta para VTable

Cada **objeto** tem ponteiro para vtable da **classe**.

```java
Animal a1 = new Animal();
Animal a2 = new Cachorro();

// Internamente (conceitual):
// a1 -> vtable_Animal
// a2 -> vtable_Cachorro
```

### 4. Lookup de Método

Virtual method invocation:
1. Obtém **ponteiro para vtable** do objeto
2. Consulta **índice do método** na vtable
3. **Chama** método apontado

```java
Animal a = new Cachorro();
a.som(); // Runtime:
         // 1. a -> vtable_Cachorro
         // 2. vtable_Cachorro[0] -> Cachorro.som()
         // 3. Chama Cachorro.som()
```

### 5. Índices Consistentes

Métodos têm **mesmos índices** em toda a hierarquia.

```java
class Animal {
    public void som() { }   // Índice 0
    public void mover() { } // Índice 1
}

class Cachorro extends Animal {
    @Override
    public void som() { }   // Índice 0 (mesmo)
    public void latir() { } // Índice 2 (novo)
}

// som() tem índice 0 em Animal e Cachorro
```

### 6. Métodos Herdados

Métodos **herdados** (não sobrescritos) apontam para **implementação da superclasse**.

```java
class Animal {
    public void som() { }
    public void mover() { }
}

class Cachorro extends Animal {
    @Override
    public void som() { } // Sobrescrito
    // mover() não é sobrescrito
}

vtable_Cachorro:
    [0] -> Cachorro.som()  // Sobrescrito
    [1] -> Animal.mover()  // Herdado (aponta para Animal)
```

### 7. Métodos de Object

VTable inclui métodos de **Object** (toString, equals, hashCode).

```java
class Pessoa {
    @Override
    public String toString() { }
}

vtable_Pessoa:
    [0] -> Pessoa.toString()   // Sobrescrito de Object
    [1] -> Object.equals()     // Herdado
    [2] -> Object.hashCode()   // Herdado
    [3] -> Object.clone()      // Herdado
    // ... outros métodos de Object
```

### 8. Métodos Não Estão na VTable

**Não estão na vtable**:
- Métodos **static** (resolvidos em compile-time)
- Métodos **final** (não podem ser sobrescritos)
- Métodos **private** (não herdados)

```java
class Animal {
    public void som() { }         // VTable
    public static void info() { } // Não vtable
    public final void dormir() { } // Não vtable
    private void interno() { }    // Não vtable
}
```

### 9. Interface VTable

**Interfaces** também têm vtables (implementação específica da JVM).

```java
interface Voador {
    void voar();
}

class Passaro implements Voador {
    @Override
    public void voar() { }
}

vtable_Passaro:
    [0] -> Passaro.voar() // Implementação de Voador.voar()
```

### 10. Multiple Interfaces

Classe implementando **múltiplas interfaces** tem entradas na vtable para cada interface.

```java
interface Voador {
    void voar();
}

interface Nadador {
    void nadar();
}

class Pato implements Voador, Nadador {
    @Override
    public void voar() { }
    
    @Override
    public void nadar() { }
}

vtable_Pato:
    [0] -> Pato.voar()  // Voador
    [1] -> Pato.nadar() // Nadador
```

---

## Aplicabilidade

**VTable é usado internamente pela JVM para**:
- **Dynamic dispatch** (polimorfismo)
- **Virtual method invocation**
- **Interface polymorphism**
- **Otimização** de chamadas virtuais

**Desenvolvedor não acessa vtable diretamente**, mas entende o conceito para:
- **Performance**: saber custo de virtual methods
- **Design**: escolher final quando apropriado
- **Debug**: entender comportamento de polimorfismo

---

## Armadilhas

### 1. Overhead de Virtual Method

Virtual method tem **pequeno overhead** comparado a chamada direta.

```java
// Chamada direta (mais rápida)
Cachorro c = new Cachorro();
c.som(); // Chamada direta

// Virtual method (overhead mínimo)
Animal a = new Cachorro();
a.som(); // Consulta vtable
```

### 2. Métodos final Não Usam VTable

```java
class Animal {
    public final void respirar() { } // Não vtable
}

// Compilador pode inline (otimização)
Animal a = new Cachorro();
a.respirar(); // Chamada direta (não vtable)
```

### 3. Métodos static Não Usam VTable

```java
class Animal {
    public static void categoria() { } // Não vtable
}

Animal a = new Cachorro();
a.categoria(); // Compile-time (tipo da referência)
```

### 4. Métodos private Não Usam VTable

```java
class Animal {
    private void interno() { } // Não vtable
}

// private: não herdado, não vtable
```

### 5. VTable em Construtores

Construtores **não estão na vtable**, mas podem chamar métodos virtuais.

```java
class Animal {
    public Animal() {
        inicializar(); // Virtual method em construtor
    }
    
    public void inicializar() { } // VTable
}

class Cachorro extends Animal {
    private String raca = "Labrador";
    
    @Override
    public void inicializar() {
        System.out.println(raca); // null! (campo não inicializado)
    }
}

// ⚠️ Perigo: vtable usada antes de objeto totalmente inicializado
Cachorro c = new Cachorro(); // null
```

### 6. VTable Size

Classe com **muitos métodos** tem vtable **maior**.

```java
// Muitos métodos virtuais
class GrandeClasse {
    public void m1() { }
    public void m2() { }
    // ... 100 métodos
    public void m100() { }
}

// vtable_GrandeClasse tem 100+ entradas
```

### 7. Interface Segregation

**Muitas interfaces** aumentam vtable.

```java
// ⚠️ Interface grande
interface GrandeInterface {
    void m1();
    void m2();
    // ... 50 métodos
}

// ✅ Prefira interfaces menores
interface Interface1 {
    void m1();
}

interface Interface2 {
    void m2();
}
```

---

## Boas Práticas

### 1. Use final para Otimização

```java
class Animal {
    // Método não será sobrescrito: use final
    public final void respirar() {
        System.out.println("Respirando");
    }
    
    // Método pode ser sobrescrito: vtable
    public void som() {
        System.out.println("Som");
    }
}

// final: compilador pode inline (sem vtable)
```

### 2. Prefira Composição para Muitos Métodos

```java
// ❌ Evite hierarquia profunda
class A {
    public void m1() { }
}
class B extends A {
    public void m2() { }
}
class C extends B {
    public void m3() { }
}
// vtable_C herda todos os métodos (grande)

// ✅ Prefira composição
class ComponenteA {
    public void m1() { }
}
class ComponenteB {
    public void m2() { }
}
class Classe {
    private ComponenteA a = new ComponenteA();
    private ComponenteB b = new ComponenteB();
}
```

### 3. Interface Segregation Principle

```java
// ❌ Interface grande (vtable grande)
interface Repositorio {
    void salvar();
    void atualizar();
    void deletar();
    void buscar();
    void listar();
    void exportar();
    void importar();
}

// ✅ Interfaces segregadas (vtables menores)
interface Salvavel {
    void salvar();
}

interface Buscavel {
    void buscar();
}

class RepositorioImpl implements Salvavel, Buscavel {
    @Override
    public void salvar() { }
    
    @Override
    public void buscar() { }
}
```

### 4. Evite Virtual Methods em Construtores

```java
// ❌ Evite
class Animal {
    public Animal() {
        inicializar(); // Virtual method em construtor
    }
    
    public void inicializar() { }
}

// ✅ Prefira Factory Method
class Animal {
    private Animal() { }
    
    public static Animal criar() {
        Animal a = new Animal();
        a.inicializar(); // Objeto já inicializado
        return a;
    }
    
    public void inicializar() { }
}
```

### 5. JIT Otimiza Virtual Methods

JIT (Just-In-Time) compiler **otimiza** virtual methods frequentes.

```java
// JIT pode:
// - Inline métodos pequenos
// - Devirtualize chamadas (se tipo conhecido)
// - Cache vtable lookups

Animal a = new Cachorro();
for (int i = 0; i < 100000; i++) {
    a.som(); // JIT otimiza após várias execuções
}
```

### 6. Método Pequeno para Inlining

```java
// Método pequeno: JIT pode inline
class Animal {
    public void som() {
        System.out.println("Som");
    }
}

// Método grande: menos provável de ser inlined
class Animal {
    public void processar() {
        // 100 linhas de código
    }
}
```

### 7. Monomorphic Call Sites

**Monomorphic** (um tipo): JIT otimiza melhor.
**Polymorphic** (múltiplos tipos): menos otimização.

```java
// Monomorphic: sempre Cachorro
Animal a = new Cachorro();
for (int i = 0; i < 100000; i++) {
    a.som(); // JIT: devirtualize para Cachorro.som()
}

// Polymorphic: tipos variados
List<Animal> animais = Arrays.asList(
    new Cachorro(), new Gato(), new Passaro()
);
for (Animal a : animais) {
    a.som(); // JIT: menos otimização (tipos variados)
}
```

### 8. Profile-Guided Optimization

JVM usa **profiling** para otimizar chamadas virtuais.

```java
// Código executado milhares de vezes
Animal a = obterAnimal(); // Sempre retorna Cachorro
a.som(); // JVM: profiling → sempre Cachorro → devirtualize
```

### 9. VTable Cache

Processadores modernos fazem **cache** de vtable lookups.

```java
// Loop: vtable lookup cacheado
List<Animal> animais = new ArrayList<>();
for (Animal a : animais) {
    a.som(); // Cache hit após primeira iteração
}
```

### 10. Benchmark Antes de Otimizar

```java
// ⚠️ Não otimize prematuramente
// Virtual method overhead é mínimo na maioria dos casos

// ✅ Benchmark primeiro
@Benchmark
public void testVirtual() {
    Animal a = new Cachorro();
    a.som();
}

@Benchmark
public void testDirect() {
    Cachorro c = new Cachorro();
    c.som();
}

// Diferença: geralmente < 1ns
```

---

## Resumo

**VTable (Virtual Method Table)**: estrutura de dados para implementar **polimorfismo dinâmico**.

```java
// Conceitual
class Animal {
    vtable: {
        [0] som()   -> Animal.som()
        [1] mover() -> Animal.mover()
    }
}

class Cachorro extends Animal {
    vtable: {
        [0] som()   -> Cachorro.som()   // Sobrescrito
        [1] mover() -> Animal.mover()   // Herdado
        [2] latir() -> Cachorro.latir() // Novo
    }
}
```

**Virtual method invocation**:
```java
Animal a = new Cachorro();
a.som(); // Runtime:
         // 1. a -> vtable_Cachorro
         // 2. vtable_Cachorro[0] -> Cachorro.som()
         // 3. Chama Cachorro.som()
```

**VTable contém**:
- Métodos **virtuais** (instância)
- Métodos **sobrescritos** (nova implementação)
- Métodos **herdados** (ponteiro para superclasse)

**Não estão na vtable**:
- Métodos **static** (compile-time)
- Métodos **final** (não podem ser sobrescritos)
- Métodos **private** (não herdados)

**Otimização**:
```java
// final: não vtable, pode ser inlined
public final void metodo() { }
```

**JIT otimiza**:
- **Inline** métodos pequenos
- **Devirtualize** chamadas monomorphic
- **Cache** vtable lookups

**Performance**:
- Virtual method: overhead **mínimo** (< 1ns)
- JIT otimiza chamadas **frequentes**
- Monomorphic call sites: melhor otimização

**Boas práticas**:
- Use **final** para métodos que não serão sobrescritos
- Evite virtual methods em **construtores**
- **Interface Segregation** (interfaces menores)
- **Benchmark** antes de otimizar

**Regra de Ouro**: VTable implementa **dynamic dispatch** eficientemente. Cada **classe** tem vtable com ponteiros para métodos virtuais. JVM consulta vtable em **runtime** para virtual method invocation. **Overhead mínimo**, JIT otimiza chamadas frequentes. Use **final** para otimização quando método não será sobrescrito.
