# T4.04 - Performance de Polimorfismo

## Introdução

**Performance de polimorfismo**: virtual method invocation tem **pequeno overhead** comparado a chamadas diretas, mas JVM **otimiza** agressivamente.

```java
// Chamada direta (mais rápida)
Cachorro c = new Cachorro();
c.som(); // ~1ns

// Virtual method (overhead mínimo)
Animal a = new Cachorro();
a.som(); // ~1-2ns (inclui vtable lookup)

// Diferença: < 1ns (desprezível na maioria dos casos)
```

**Otimizações da JVM**:
- **JIT compilation** (Just-In-Time)
- **Method inlining**
- **Devirtualization**
- **Profile-guided optimization**

**Regra geral**: não otimize prematuramente. Polimorfismo raramente é gargalo.

---

## Fundamentos

### 1. Overhead de Virtual Method

Virtual method: **vtable lookup** antes da chamada.

```java
// Chamada direta
Cachorro c = new Cachorro();
c.som(); // Chamada direta: CALL Cachorro.som()

// Virtual method
Animal a = new Cachorro();
a.som(); // Vtable lookup:
         // 1. Obter vtable do objeto
         // 2. Buscar método no índice
         // 3. Chamar método
```

### 2. Custo de VTable Lookup

**VTable lookup**: ~1-2 instruções de CPU.

```java
// Pseudo-assembly (conceitual)
// a.som()
MOV RAX, [objeto]     // Obter ponteiro do objeto
MOV RBX, [RAX]        // Obter vtable
CALL [RBX + offset]   // Chamar método

// Custo: ~1-2 ciclos de CPU (< 1ns)
```

### 3. Cache de VTable

Processadores modernos fazem **cache** de vtable lookups.

```java
// Primeira chamada: cache miss
Animal a = new Cachorro();
a.som(); // ~2ns (vtable lookup + cache miss)

// Chamadas subsequentes: cache hit
a.som(); // ~1ns (cache hit)
a.som(); // ~1ns (cache hit)
```

### 4. JIT Compilation

JIT compiler **compila bytecode para código nativo** e **otimiza**.

```java
// Código executado ~10.000 vezes: JIT compila
Animal a = new Cachorro();
for (int i = 0; i < 10000; i++) {
    a.som(); // JIT: otimiza após múltiplas execuções
}
```

### 5. Method Inlining

JIT pode **inline** métodos pequenos (elimina chamada).

```java
class Animal {
    public void som() { // Método pequeno
        System.out.println("Som");
    }
}

// JIT pode inline:
Animal a = new Cachorro();
a.som(); // JIT substitui por: System.out.println("Som");
```

### 6. Devirtualization

JIT pode **devirtualizar** chamadas quando tipo é **conhecido**.

```java
// Monomorphic: sempre Cachorro
Animal a = new Cachorro();
for (int i = 0; i < 100000; i++) {
    a.som(); // JIT: profiling → sempre Cachorro → devirtualize
}

// JIT substitui por chamada direta:
// CALL Cachorro.som() (sem vtable lookup)
```

### 7. Monomorphic vs Polymorphic

**Monomorphic** (um tipo): JIT otimiza melhor.
**Polymorphic** (múltiplos tipos): menos otimização.

```java
// Monomorphic: um tipo
Animal a = new Cachorro();
for (int i = 0; i < 100000; i++) {
    a.som(); // JIT: devirtualize
}

// Polymorphic: múltiplos tipos
List<Animal> animais = Arrays.asList(
    new Cachorro(), new Gato(), new Passaro()
);
for (Animal a : animais) {
    a.som(); // JIT: menos otimização (tipos variados)
}
```

### 8. Profile-Guided Optimization

JVM faz **profiling** (coleta estatísticas) e otimiza.

```java
Animal a = obterAnimal(); // 99% retorna Cachorro
a.som(); // JVM: profiling → 99% Cachorro → otimiza para Cachorro

// JIT gera código otimizado:
// if (a instanceof Cachorro) {
//     CALL Cachorro.som(); // Caminho rápido
// } else {
//     vtable lookup // Caminho lento
// }
```

### 9. Branch Prediction

CPU faz **branch prediction** para otimizar.

```java
// Código com padrão previsível
for (int i = 0; i < 100; i++) {
    Animal a = (i % 2 == 0) ? new Cachorro() : new Gato();
    a.som(); // CPU: prediz branch
}
```

### 10. Megamorphic Call Sites

**Megamorphic** (muitos tipos): JIT **não** otimiza.

```java
// Megamorphic: 10+ tipos diferentes
List<Animal> animais = Arrays.asList(
    new Cachorro(), new Gato(), new Passaro(), 
    new Leao(), new Tigre(), new Elefante(),
    // ... 10+ tipos
);

for (Animal a : animais) {
    a.som(); // JIT: megamorphic → não otimiza
}
```

---

## Aplicabilidade

**Polimorfismo é apropriado quando**:
- **Extensibilidade** > Performance
- **Código limpo** > Micro-otimização
- **Design patterns** (Strategy, Template Method)
- Performance **não é gargalo**

**Considere alternativas quando**:
- **Performance crítica** (loops internos, hot paths)
- **Megamorphic call sites** (10+ tipos)
- **Real-time systems** (latência determinística)

---

## Armadilhas

### 1. Otimização Prematura

```java
// ❌ Evite otimização prematura
public void processar(Cachorro c) { // Tipo específico
    c.som();
}

// ✅ Prefira polimorfismo (otimize SE necessário)
public void processar(Animal a) { // Polimorfismo
    a.som(); // JIT otimiza
}
```

### 2. Megamorphic Call Sites

```java
// ⚠️ Muitos tipos: performance degradada
List<Animal> animais = new ArrayList<>();
animais.add(new Cachorro());
animais.add(new Gato());
// ... 20 tipos diferentes

for (Animal a : animais) {
    a.som(); // Megamorphic: JIT não otimiza
}

// ✅ Solução: separar por tipo
List<Cachorro> cachorros = new ArrayList<>();
List<Gato> gatos = new ArrayList<>();

for (Cachorro c : cachorros) {
    c.som(); // Monomorphic
}
for (Gato g : gatos) {
    g.som(); // Monomorphic
}
```

### 3. Virtual Methods em Loops Internos

```java
// ⚠️ Virtual method em loop interno
for (int i = 0; i < 1_000_000; i++) {
    Animal a = new Cachorro();
    a.som(); // Virtual method
}

// ✅ JIT otimiza (devirtualize)
// Ou use tipo específico se crítico
for (int i = 0; i < 1_000_000; i++) {
    Cachorro c = new Cachorro();
    c.som(); // Chamada direta
}
```

### 4. Métodos Grandes Não São Inlined

```java
// ⚠️ Método grande: não inlined
class Animal {
    public void processar() {
        // 100+ linhas de código
    }
}

// ✅ Método pequeno: pode ser inlined
class Animal {
    public void som() {
        System.out.println("Som");
    }
}
```

### 5. Exception em Hot Path

```java
// ⚠️ Exception em hot path: degrada performance
class Animal {
    public void som() throws Exception {
        // ...
    }
}

// ✅ Evite exceptions em hot path
class Animal {
    public void som() {
        // Sem exception
    }
}
```

### 6. Synchronized em Virtual Method

```java
// ⚠️ Synchronized: overhead adicional
class Animal {
    public synchronized void som() {
        System.out.println("Som");
    }
}

// ✅ Sincronize apenas quando necessário
class Animal {
    private final Object lock = new Object();
    
    public void som() {
        synchronized (lock) {
            // Apenas seção crítica
        }
    }
}
```

### 7. Allocação em Loop

```java
// ⚠️ Allocação em loop: overhead de GC
for (int i = 0; i < 1_000_000; i++) {
    Animal a = new Cachorro(); // Allocação
    a.som();
}

// ✅ Reutilize objeto
Animal a = new Cachorro();
for (int i = 0; i < 1_000_000; i++) {
    a.som(); // Sem allocação
}
```

---

## Boas Práticas

### 1. Benchmark Antes de Otimizar

```java
// Use JMH (Java Microbenchmark Harness)
@Benchmark
public void testPolimorfismo() {
    Animal a = new Cachorro();
    a.som();
}

@Benchmark
public void testDireto() {
    Cachorro c = new Cachorro();
    c.som();
}

// Compare resultados
```

### 2. Profile com JProfiler/YourKit

```java
// Use profiler para identificar gargalos
// - Hotspots (métodos mais executados)
// - Megamorphic call sites
// - Allocação excessiva
```

### 3. Use final para Otimização

```java
class Animal {
    // final: JIT pode inline
    public final void respirar() {
        System.out.println("Respirando");
    }
    
    // Virtual: pode ser sobrescrito
    public void som() {
        System.out.println("Som");
    }
}
```

### 4. Monomorphic Call Sites

```java
// ✅ Monomorphic: sempre mesmo tipo
Animal a = new Cachorro();
for (int i = 0; i < 100000; i++) {
    a.som(); // JIT: devirtualize
}

// ⚠️ Polymorphic: tipos variados
for (Animal a : animais) {
    a.som(); // Menos otimização
}
```

### 5. Method Pequenos

```java
// ✅ Método pequeno: pode ser inlined
class Animal {
    public void som() {
        System.out.println("Som");
    }
}

// ⚠️ Método grande: não inlined
class Animal {
    public void processar() {
        // 100+ linhas
    }
}
```

### 6. Escape Analysis

JVM usa **escape analysis** para otimizar allocação.

```java
public void processar() {
    Animal a = new Cachorro(); // Não escapa do método
    a.som();
}

// JVM: escape analysis → allocação pode ser eliminada (stack)
```

### 7. Scalar Replacement

JVM pode fazer **scalar replacement** (elimina objeto).

```java
class Ponto {
    int x, y;
}

public void processar() {
    Ponto p = new Ponto(); // Não escapa
    p.x = 10;
    p.y = 20;
    usar(p.x, p.y);
}

// JVM: scalar replacement → elimina objeto, usa variáveis
public void processar() {
    int x = 10;
    int y = 20;
    usar(x, y);
}
```

### 8. Lock Elision

JVM pode **eliminar locks** desnecessários.

```java
public void processar() {
    List<String> lista = new ArrayList<>(); // Não escapa
    synchronized (lista) {
        lista.add("item");
    }
}

// JVM: lock elision → elimina synchronized (não compartilhado)
```

### 9. Warmup para Benchmarks

```java
// JIT precisa de warmup
@Benchmark
@Warmup(iterations = 5, time = 1, timeUnit = TimeUnit.SECONDS)
@Measurement(iterations = 10, time = 1, timeUnit = TimeUnit.SECONDS)
public void testPolimorfismo() {
    Animal a = new Cachorro();
    a.som();
}
```

### 10. CompileThreshold

```java
// JVM parâmetros
// -XX:CompileThreshold=10000 (padrão)
// Método executado 10.000 vezes: JIT compila

// Para testes: reduzir threshold
// -XX:CompileThreshold=100
```

---

## Resumo

**Performance de polimorfismo**: overhead **mínimo** (< 1ns), JVM **otimiza** agressivamente.

**Virtual method vs Direto**:
```java
// Direto: ~1ns
Cachorro c = new Cachorro();
c.som();

// Virtual: ~1-2ns
Animal a = new Cachorro();
a.som(); // Vtable lookup: < 1ns
```

**Otimizações da JVM**:
- **JIT compilation** (código nativo)
- **Method inlining** (elimina chamada)
- **Devirtualization** (chamada direta)
- **Profile-guided optimization** (estatísticas)

**Monomorphic vs Polymorphic**:
```java
// Monomorphic: JIT otimiza
Animal a = new Cachorro();
a.som(); // Devirtualize

// Polymorphic: menos otimização
for (Animal a : animais) { // Tipos variados
    a.som();
}
```

**Megamorphic** (10+ tipos): JIT **não** otimiza.

**Boas práticas**:
- **Benchmark** antes de otimizar
- Use **final** para métodos não sobrescritos
- Métodos **pequenos** (< 35 bytes) podem ser inlined
- **Monomorphic call sites** (sempre mesmo tipo)
- **Profile** com JProfiler/YourKit

**Evite**:
- Otimização **prematura**
- **Megamorphic call sites** (muitos tipos)
- Virtual methods em **loops internos** (SE crítico)

**JIT precisa de warmup**:
```java
// Primeiras execuções: interpretado
// Após ~10.000 execuções: compilado e otimizado
```

**Performance típica**:
- Virtual method: **1-2ns**
- Chamada direta: **~1ns**
- Diferença: **< 1ns** (desprezível)

**Quando otimizar**:
- **Profiler** identifica gargalo
- **Megamorphic call sites** (10+ tipos)
- **Real-time systems** (latência determinística)

**Regra de Ouro**: Polimorfismo tem **overhead mínimo**, JVM otimiza agressivamente. **Não otimize prematuramente**. Use **polimorfismo** para código limpo e extensível. **Benchmark** se performance é crítica. JIT **devirtualiza** chamadas monomorphic. **Megamorphic** (10+ tipos) degrada performance.
