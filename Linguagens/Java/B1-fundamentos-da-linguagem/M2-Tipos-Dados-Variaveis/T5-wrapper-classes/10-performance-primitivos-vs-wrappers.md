# Performance: Primitivos vs Wrappers

## 🎯 Introdução e Definição

### Definição Conceitual

**Performance** é um critério fundamental na escolha entre **tipos primitivos** e **wrapper classes**. Primitivos oferecem **melhor desempenho** em praticamente todos os cenários devido à ausência de overhead de objetos, enquanto wrappers trazem **funcionalidades** às custas de **custo computacional** e **uso de memória**.

**Trade-off fundamental**:
- **Primitivos**: ⚡ Performance (velocidade, memória) | ❌ Funcionalidades limitadas
- **Wrappers**: ✅ Funcionalidades (null, collections, métodos) | 🐢 Overhead (memória, CPU, GC)

**Exemplo de impacto**:
```java
// Primitivo: ~10ms para 1 milhão de iterações
int soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;
}

// Wrapper: ~100ms para 1 milhão de iterações (10x mais lento!)
Integer somaObj = 0;
for (Integer i = 0; i < 1_000_000; i++) {
    somaObj += i;  // Autoboxing/unboxing a cada iteração
}
```

### Características Fundamentais

**Primitivos**:
- 💾 **Stack**: Armazenados na pilha (rápido)
- 📏 **Tamanho fixo**: 1-8 bytes (eficiente)
- ⚡ **Acesso direto**: Sem indireção
- 🚀 **Cache-friendly**: Melhor localidade espacial
- 🔥 **Sem GC**: Limpeza automática da stack

**Wrappers**:
- 💾 **Heap**: Armazenados no monte (mais lento)
- 📦 **Overhead**: 16+ bytes (object header + valor)
- 🔗 **Indireção**: Referência → objeto → valor
- 🐌 **Cache-unfriendly**: Objetos espalhados no heap
- 🗑️ **GC pressure**: Garbage Collector precisa coletar

---

## 📋 Sumário Conceitual

### Comparação de Performance

| Aspecto | Primitivo | Wrapper | Diferença |
|---------|-----------|---------|-----------|
| **Memória (int)** | 4 bytes | 16 bytes | **4x maior** |
| **Alocação** | Stack | Heap | **~10x mais lenta** |
| **Acesso** | Direto | Indireção | **~2x mais lento** |
| **Loop 1M** | ~10ms | ~100ms | **~10x mais lento** |
| **Array 1M** | 4 MB | 16 MB | **4x maior** |
| **GC** | Não | Sim | **Overhead** |

### Quando Usar Cada Um

**Use Primitivo**:
- ✅ Loops intensivos
- ✅ Cálculos matemáticos
- ✅ Arrays grandes
- ✅ Variáveis locais
- ✅ Performance crítica

**Use Wrapper**:
- ✅ Collections (obrigatório)
- ✅ Generics (obrigatório)
- ✅ Null é significativo
- ✅ Métodos utilitários necessários
- ✅ Serialização/deserialização

---

## 🧠 Fundamentos Teóricos

### 1. Tamanho em Memória

**Primitivos** (tamanho exato):
```java
byte    → 1 byte
short   → 2 bytes
int     → 4 bytes
long    → 8 bytes
float   → 4 bytes
double  → 8 bytes
char    → 2 bytes
boolean → 1 byte (implementação pode variar)
```

**Wrappers** (aproximado, JVM dependente):
```java
// Object header: 8-16 bytes (metadados do objeto)
// Alignment: múltiplo de 8 bytes

Byte      → 16 bytes (header 12 + value 1 + padding 3)
Short     → 16 bytes (header 12 + value 2 + padding 2)
Integer   → 16 bytes (header 12 + value 4)
Long      → 24 bytes (header 12 + value 8 + padding 4)
Float     → 16 bytes (header 12 + value 4)
Double    → 24 bytes (header 12 + value 8 + padding 4)
Character → 16 bytes (header 12 + value 2 + padding 2)
Boolean   → 16 bytes (header 12 + value 1 + padding 3)
```

**Exemplo de overhead**:
```java
int primitivo = 10;       // 4 bytes
Integer wrapper = 10;     // 16 bytes (4x maior!)

// Array de 1 milhão
int[] arrayPrim = new int[1_000_000];
// Memória: 1_000_000 * 4 = 4 MB

Integer[] arrayWrap = new Integer[1_000_000];
for (int i = 0; i < 1_000_000; i++) {
    arrayWrap[i] = i;
}
// Memória: 1_000_000 * 16 = 16 MB (4x maior!)
// + overhead do array (24 bytes header)
```

### 2. Alocação: Stack vs Heap

**Stack** (primitivos e referências locais):
- ⚡ **Rápida**: Allocation é apenas mover ponteiro
- 🧹 **Limpeza automática**: Liberada ao sair do escopo
- 📏 **Tamanho limitado**: ~1-2 MB (configurável)
- 🚀 **Cache-friendly**: Localidade espacial

**Heap** (objetos, incluindo wrappers):
- 🐌 **Lenta**: Allocation complexa (free-list, fragmentação)
- 🗑️ **Garbage Collection**: Precisa ser coletada
- 📦 **Tamanho grande**: GBs disponíveis
- 💥 **Cache-unfriendly**: Objetos espalhados

**Benchmark** (conceitual):
```java
// Stack allocation: ~1 ns por alocação
for (int i = 0; i < 1_000_000; i++) {
    int x = 10;  // Stack
}

// Heap allocation: ~10 ns por alocação
for (int i = 0; i < 1_000_000; i++) {
    Integer x = 10;  // Heap (ou cache)
}
```

### 3. Acesso: Direto vs Indireção

**Primitivo**: Acesso direto.
```java
int x = 10;
int y = x;  // Lê valor diretamente (1 acesso à memória)
```

**Wrapper**: Acesso indireto (referência → objeto → valor).
```java
Integer x = 10;
Integer y = x;  // Copia referência (1 acesso)
int z = x;      // Unboxing: referência → objeto → valor (2 acessos)
```

**Impacto em loops**:
```java
// Primitivo: acesso direto
int soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;  // 1 acesso à memória
}

// Wrapper: indireção
Integer somaObj = 0;
for (Integer i = 0; i < 1_000_000; i++) {
    somaObj += i;  // Múltiplos acessos (unboxing + boxing)
}
```

### 4. Autoboxing/Unboxing: Overhead Oculto

**Autoboxing** cria objetos:
```java
Integer x = 10;
// Compilador: Integer x = Integer.valueOf(10);
```

**valueOf() pode criar objetos** (fora do cache):
```java
public static Integer valueOf(int i) {
    if (i >= -128 && i <= 127) {
        return cache[i + 128];  // Cache (rápido)
    }
    return new Integer(i);  // Novo objeto (lento)
}
```

**Unboxing** chama método:
```java
Integer x = 100;
int y = x;
// Compilador: int y = x.intValue();
```

**Overhead em loops**:
```java
// Primitivo: 0 overhead
int soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;
}

// Wrapper: autoboxing/unboxing a CADA iteração
Integer somaObj = 0;
for (Integer i = 0; i < 1_000_000; i++) {
    somaObj += i;
    // Compilador:
    // int temp1 = i.intValue();             // Unboxing (i)
    // int temp2 = somaObj.intValue();       // Unboxing (somaObj)
    // int temp3 = temp2 + temp1;            // Soma
    // somaObj = Integer.valueOf(temp3);     // Autoboxing (cria objeto!)
}
// 1_000_000 unboxings + 1_000_000 boxings = 2_000_000 operações extras!
```

### 5. Garbage Collection Pressure

**Primitivos**: Sem GC (limpeza automática da stack).
```java
for (int i = 0; i < 1_000_000; i++) {
    int x = i;  // Alocado na stack, liberado automaticamente
}
// GC: 0 objetos coletados
```

**Wrappers**: GC precisa coletar objetos.
```java
for (int i = 0; i < 1_000_000; i++) {
    Integer x = i;  // Cria objeto no heap (se fora do cache)
}
// GC: ~999_744 objetos para coletar (excluindo cache -128 a 127)
```

**Impacto do GC**:
- 🕐 **Pause times**: Stop-the-world (aplicação para)
- 🔥 **CPU**: GC consome CPU
- 💾 **Memória**: Fragmentação do heap

### 6. Cache-Friendliness

**Primitivos** (cache-friendly):
```java
int[] array = new int[1000];
for (int i = 0; i < 1000; i++) {
    array[i] = i;
}
// Valores contíguos na memória → ótima localidade espacial
// Cache L1/L2/L3 carrega múltiplos valores de uma vez
```

**Wrappers** (cache-unfriendly):
```java
Integer[] array = new Integer[1000];
for (int i = 0; i < 1000; i++) {
    array[i] = i;
}
// Array armazena REFERÊNCIAS (contíguas)
// Objetos Integer espalhados no heap (má localidade)
// Cache miss frequente → lentidão
```

**Impacto**:
- ✅ **Primitivos**: Cache hit rate alto (~95%+)
- ⚠️ **Wrappers**: Cache miss rate alto (~50%+)

### 7. Comparação: == vs equals()

**Primitivo** (==): Rápido (comparação de valor).
```java
int a = 100;
int b = 100;
if (a == b) { /* ... */ }  // 1 comparação (rápida)
```

**Wrapper** (==): Rápido (comparação de referência), mas incorreto!
```java
Integer a = 200;
Integer b = 200;
if (a == b) { /* ... */ }  // 1 comparação (rápida, mas ERRADA!)
```

**Wrapper** (equals()): Mais lento (chamada de método).
```java
Integer a = 200;
Integer b = 200;
if (a.equals(b)) { /* ... */ }  
// 1. Chamada de método
// 2. Verificação de tipo
// 3. Cast
// 4. Comparação de valor
// Mais lento que primitivo, mas CORRETO
```

---

## 🔍 Análise Conceitual Profunda

### Benchmark Realista

**Loop simples** (1 milhão de iterações):
```java
// Primitivo: ~5ms
long inicio = System.nanoTime();
int soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;
}
long fim = System.nanoTime();
System.out.println("Primitivo: " + (fim - inicio) / 1_000_000 + " ms");

// Wrapper: ~50ms (10x mais lento)
inicio = System.nanoTime();
Integer somaObj = 0;
for (Integer i = 0; i < 1_000_000; i++) {
    somaObj += i;
}
fim = System.nanoTime();
System.out.println("Wrapper: " + (fim - inicio) / 1_000_000 + " ms");
```

**Collections** (1 milhão de inserções):
```java
// ArrayList<Integer>: ~100ms
List<Integer> lista = new ArrayList<>();
long inicio = System.nanoTime();
for (int i = 0; i < 1_000_000; i++) {
    lista.add(i);  // Autoboxing
}
long fim = System.nanoTime();
System.out.println("ArrayList<Integer>: " + (fim - inicio) / 1_000_000 + " ms");

// Array de primitivos: ~20ms (5x mais rápido)
int[] array = new int[1_000_000];
inicio = System.nanoTime();
for (int i = 0; i < 1_000_000; i++) {
    array[i] = i;
}
fim = System.nanoTime();
System.out.println("int[]: " + (fim - inicio) / 1_000_000 + " ms");
```

### Memory Layout

**Primitivo**:
```
Stack:
[x: 10]  (4 bytes)
```

**Wrapper**:
```
Stack:
[referência: 0x7F3A]  (8 bytes em JVM 64-bit)

Heap (endereço 0x7F3A):
[Object Header: 12 bytes]
[value: 10]  (4 bytes)
[padding: 0 bytes]
Total: 16 bytes
```

**Array de primitivos**:
```
Heap:
[Array Header: 24 bytes]
[0, 1, 2, 3, 4, ...]  (contíguos, 4 bytes cada)
```

**Array de wrappers**:
```
Heap:
[Array Header: 24 bytes]
[ref1, ref2, ref3, ...]  (8 bytes cada)
  ↓      ↓      ↓
[Obj1] [Obj2] [Obj3] ... (16 bytes cada, espalhados)
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Loops Intensivos (Primitivos Vencem)

```java
public class LoopsIntensivos {
    // ❌ LENTO: wrapper
    public Integer somaLenta(int n) {
        Integer soma = 0;
        for (Integer i = 0; i < n; i++) {
            soma += i;  // Autoboxing/unboxing
        }
        return soma;
    }
    
    // ✅ RÁPIDO: primitivo
    public int somaRapida(int n) {
        int soma = 0;
        for (int i = 0; i < n; i++) {
            soma += i;
        }
        return soma;
    }
    
    public void benchmark() {
        // Lento: ~100ms
        long inicio = System.nanoTime();
        somaLenta(1_000_000);
        System.out.println("Lenta: " + (System.nanoTime() - inicio) / 1_000_000 + " ms");
        
        // Rápido: ~10ms
        inicio = System.nanoTime();
        somaRapida(1_000_000);
        System.out.println("Rápida: " + (System.nanoTime() - inicio) / 1_000_000 + " ms");
    }
}
```

### Caso 2: Collections (Wrappers Obrigatórios)

```java
import java.util.*;

public class CollectionsPerformance {
    // Wrapper obrigatório (não há alternativa para Collections)
    public List<Integer> criarLista(int n) {
        List<Integer> lista = new ArrayList<>(n);
        for (int i = 0; i < n; i++) {
            lista.add(i);  // Autoboxing (custo inevitável)
        }
        return lista;
    }
    
    // Alternativa: array de primitivos (quando possível)
    public int[] criarArray(int n) {
        int[] array = new int[n];
        for (int i = 0; i < n; i++) {
            array[i] = i;  // Sem autoboxing (mais rápido)
        }
        return array;
    }
}
```

### Caso 3: Streams (IntStream vs Stream<Integer>)

```java
import java.util.stream.*;

public class StreamsPerformance {
    // ❌ LENTO: Stream<Integer> (autoboxing)
    public int somaLenta() {
        return Stream.iterate(0, i -> i + 1)
                     .limit(1_000_000)
                     .reduce(0, Integer::sum);
        // Muitos boxing/unboxing
    }
    
    // ✅ RÁPIDO: IntStream (primitivos)
    public int somaRapida() {
        return IntStream.range(0, 1_000_000)
                       .sum();
        // Sem autoboxing!
    }
    
    public void benchmark() {
        long inicio = System.nanoTime();
        somaLenta();
        System.out.println("Stream<Integer>: " + (System.nanoTime() - inicio) / 1_000_000 + " ms");
        
        inicio = System.nanoTime();
        somaRapida();
        System.out.println("IntStream: " + (System.nanoTime() - inicio) / 1_000_000 + " ms");
    }
}
```

### Caso 4: Campos de Classe (Trade-off)

```java
public class CamposClasse {
    // ❌ Wrapper: mais memória, permite null
    private Integer idade;  // 16 bytes + referência (8 bytes) = 24 bytes
    
    // ✅ Primitivo: menos memória, não permite null
    private int idadePrim;  // 4 bytes
    
    // Decisão:
    // - Se null é significativo (ex: "não informado") → use Wrapper
    // - Se 0 é default aceitável → use primitivo
}
```

### Caso 5: Otimização de Memória

```java
public class OtimizacaoMemoria {
    // ❌ Grande: 16 MB + overhead
    public void arrayWrapper() {
        Integer[] array = new Integer[1_000_000];
        for (int i = 0; i < 1_000_000; i++) {
            array[i] = i;
        }
    }
    
    // ✅ Compacto: 4 MB
    public void arrayPrimitivo() {
        int[] array = new int[1_000_000];
        for (int i = 0; i < 1_000_000; i++) {
            array[i] = i;
        }
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Wrappers em Loops

**Problema**: Performance degradada.
```java
Integer soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;  // ⚠️ 10x mais lento
}
```

**Solução**: Usar primitivos.
```java
int soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;  // ✅ Rápido
}
```

### 2. Arrays Grandes

**Problema**: Overhead de memória (4x).
```java
Integer[] array = new Integer[1_000_000];  // 16 MB
```

**Solução**: Usar primitivos.
```java
int[] array = new int[1_000_000];  // 4 MB
```

### 3. GC Pressure

**Problema**: Muitos objetos temporários.
```java
for (int i = 0; i < 1_000_000; i++) {
    Integer x = i;  // ~1M objetos para GC
}
```

**Solução**: Minimizar criação de objetos.
```java
for (int i = 0; i < 1_000_000; i++) {
    int x = i;  // Sem GC
}
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Autoboxing/Unboxing**: Overhead em conversões
- **Cache**: Mitiga custo de boxing (-128 a 127)
- **Imutabilidade**: Operações criam novos objetos
- **Collections**: Requerem wrappers (custo inevitável)
- **Streams**: IntStream/DoubleStream evitam autoboxing

---

## 🚀 Boas Práticas

1. ✅ **Use primitivos em loops intensivos**
   ```java
   int soma = 0;
   for (int i = 0; i < 1_000_000; i++) { soma += i; }
   ```

2. ✅ **Use IntStream ao invés de Stream<Integer>**
   ```java
   IntStream.range(0, 1_000_000).sum();
   ```

3. ✅ **Prefira arrays de primitivos quando possível**
   ```java
   int[] array = new int[1_000_000];
   ```

4. ✅ **Use wrappers apenas quando necessário**
   ```java
   // Necessário: Collections
   List<Integer> lista = new ArrayList<>();
   
   // Desnecessário: variável local
   int x = 10;  // ✅ Não: Integer x = 10;
   ```

5. ✅ **Minimize autoboxing/unboxing em código crítico**
   ```java
   // ❌ Evitar
   Integer sum = 0;
   for (Integer i : list) { sum += i; }
   
   // ✅ Preferir
   int sum = 0;
   for (int i : list) { sum += i; }
   ```

6. ✅ **Profile antes de otimizar**
   ```java
   // Meça performance real antes de trocar wrapper por primitivo
   ```

7. ✅ **Equilibre performance e clareza**
   ```java
   // Nem sempre primitivo é a melhor escolha
   // Ex: null é significativo → use wrapper
   ```

8. ✅ **Entenda o custo de Collections**
   ```java
   // Collections sempre usam wrappers (custo inevitável)
   // Use quando flexibilidade > performance
   ```
