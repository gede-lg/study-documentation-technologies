# 📊 Performance e Ordem Natural

## 🎯 Performance Comparativa

### EnumSet vs HashSet vs TreeSet

```
Operação          | EnumSet | HashSet | TreeSet
------------------|---------|---------|----------
add()            | 3ns     | 15ns    | 25ns
contains()       | 2ns     | 12ns    | 20ns
Iteração         | 5ns/el  | 18ns/el | 22ns/el
Memória (64 el)  | 8 bytes | 2KB     | 3KB
```

**EnumSet ganha em TODAS as métricas!**

### EnumMap vs HashMap vs TreeMap

```
Operação          | EnumMap | HashMap | TreeMap
------------------|---------|---------|----------
get()            | 1ns     | 12ns    | 18ns
put()            | 2ns     | 15ns    | 22ns
Memória (64 el)  | 512B    | 2.5KB   | 4KB
```

**EnumMap é 6-10x mais rápido!**

## 🔄 Ordem Natural

### EnumSet: Ordem por Ordinal

```java
public enum Prioridade {
    BAIXA,      // ordinal 0
    MEDIA,      // ordinal 1
    ALTA,       // ordinal 2
    CRITICA     // ordinal 3
}

Set<Prioridade> prioridades = EnumSet.of(
    Prioridade.CRITICA,
    Prioridade.BAIXA,
    Prioridade.ALTA
);

// Iteração SEMPRE em ordem de ordinal
for (Prioridade p : prioridades) {
    System.out.println(p);
}
// Saída (ordenada):
// BAIXA
// ALTA
// CRITICA
```

**Independente da ordem de inserção, iteração segue ordinal!**

### EnumMap: Chaves Ordenadas

```java
public enum Mes {
    JAN, FEV, MAR, ABR, MAI, JUN, JUL, AGO, SET, OUT, NOV, DEZ
}

Map<Mes, Integer> vendas = new EnumMap<>(Mes.class);
vendas.put(Mes.DEZ, 100);
vendas.put(Mes.JAN, 50);
vendas.put(Mes.JUN, 75);

// Iteração em ordem de ordinal
for (Map.Entry<Mes, Integer> entry : vendas.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
// Saída (ordenada):
// JAN: 50
// JUN: 75
// DEZ: 100
```

## ⚡ Otimizações Internas

### Bit Vector (EnumSet)

```java
// Para enum com 8 elementos
enum Dia { SEG, TER, QUA, QUI, SEX, SAB, DOM }

Set<Dia> dias = EnumSet.of(SEG, QUA, SEX);

// Internamente: 1 byte (8 bits)
// Bit:    6  5  4  3  2  1  0
// Valor:  0  0  1  0  1  0  1
//       DOM SAB SEX QUI QUA TER SEG

// Operações:
// contains(QUA): (bits & (1 << 2)) != 0  → true
// add(SAB):      bits |= (1 << 5)        → bits = 0b0101101
// remove(SEG):   bits &= ~(1 << 0)       → bits = 0b0101100
```

### Array Indexado (EnumMap)

```java
// Para enum com 4 elementos
enum Status { NOVO, ATIVO, INATIVO, DELETADO }

Map<Status, String> map = new EnumMap<>(Status.class);

// Internamente: String[4]
// Index:  0      1       2         3
// Value: null   "msg"   null      null
//       NOVO   ATIVO  INATIVO  DELETADO

// Operações:
// get(ATIVO):   return values[1]           → O(1)
// put(NOVO, v): values[0] = v              → O(1)
```

## 🎯 Benchmarks Reais

### Teste: 1 milhão de operações

```java
enum Teste { V1, V2, V3, ..., V64 }  // 64 valores

// ========== EnumSet ==========
Set<Teste> enumSet = EnumSet.noneOf(Teste.class);
long start = System.nanoTime();
for (int i = 0; i < 1_000_000; i++) {
    enumSet.add(Teste.values()[i % 64]);
    enumSet.contains(Teste.values()[i % 64]);
}
long enumTime = System.nanoTime() - start;
// Tempo: ~5ms

// ========== HashSet ==========
Set<Teste> hashSet = new HashSet<>();
start = System.nanoTime();
for (int i = 0; i < 1_000_000; i++) {
    hashSet.add(Teste.values()[i % 64]);
    hashSet.contains(Teste.values()[i % 64]);
}
long hashTime = System.nanoTime() - start;
// Tempo: ~45ms

// EnumSet é 9x mais rápido!
```

## 💡 Por Que É Tão Rápido?

### 1. Sem Hashing

```java
// HashSet
int hash = key.hashCode();           // Cálculo de hash
int index = hash & (table.length-1); // Mod operation
// Comparações em bucket (se colisão)

// EnumSet
int index = key.ordinal();  // Direto! Sem cálculo
```

### 2. Cache-Friendly

```java
// EnumSet: bits contíguos na memória
// 64 elementos = 8 bytes sequenciais
// Cabe em 1 cache line (64 bytes)

// HashSet: nodes espalhados na heap
// Cache misses frequentes
```

### 3. Operações Bitwise

```java
// União de EnumSets
Set<Dia> set1 = EnumSet.of(SEG, TER);
Set<Dia> set2 = EnumSet.of(TER, QUA);
set1.addAll(set2);
// Internamente: bits1 | bits2  (1 operação CPU)

// União de HashSets
Set<Dia> hash1 = new HashSet<>(Arrays.asList(SEG, TER));
Set<Dia> hash2 = new HashSet<>(Arrays.asList(TER, QUA));
hash1.addAll(hash2);
// Internamente: loop + hash + comparações (centenas de ops)
```

## 🎯 Quando Performance Importa

**Use EnumSet/EnumMap quando:**

1. **Alta Frequência**: Operações executadas milhões de vezes
2. **Memória Limitada**: Aplicações com constraints de memória
3. **Conjuntos de Flags**: Múltiplos flags booleanos
4. **Lookup Tables**: Mapeamentos enum → valor

**Exemplo: Game Engine**

```java
enum Input { UP, DOWN, LEFT, RIGHT, JUMP, SHOOT }

// 60 FPS = 60x por segundo
public void gameLoop() {
    Set<Input> pressed = EnumSet.noneOf(Input.class);  // Performance crítica!

    while (running) {
        updateInputs(pressed);  // Milhares de contains() por frame
        processInputs(pressed);
        render();
    }
}
```
