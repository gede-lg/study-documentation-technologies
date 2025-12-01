# Capacidade e Incremento em Vector: Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Capacidade (capacity)** é o tamanho do array interno de Vector - quantos elementos podem ser armazenados sem realocação. **Incremento (capacityIncrement)** define quanto a capacidade cresce quando array enche. Conceitualmente, são parâmetros de **gerenciamento de memória dinâmica**.

**Diferencial de Vector:** Permite customizar estratégia de crescimento via `capacityIncrement`, ao contrário de ArrayList que usa crescimento fixo de 50%.

### Contexto Histórico e Motivação

**Java 1.0 (1996):** Memória era recurso escasso. Vector foi projetada com flexibilidade para controlar trade-off entre:
- **Crescimento agressivo:** Menos realocações, mais desperdício de memória
- **Crescimento conservador:** Mais realocações, menos desperdício

**Motivação:** Permitir que desenvolvedor otimizasse para seu caso específico (muitos dados vs pouca memória).

**Realidade Moderna:** Memória abundante, otimização prematura raramente vale complexidade. ArrayList com crescimento fixo 50% é adequado para maioria dos casos.

### Problema Fundamental

**Problema:** Como balancear realocações de array (custosas) vs desperdício de memória (capacidade não utilizada)?

**Solução Vector:** Parâmetro configurável `capacityIncrement`:
- `capacityIncrement = 0`: Dobra capacidade (crescimento agressivo)
- `capacityIncrement > 0`: Cresce por valor fixo (crescimento conservador)

**Solução ArrayList:** Crescimento fixo de 50% - meio-termo eficaz sem configuração.

### Por Que Importa

Entender capacidade e incremento é crucial para:
1. **Análise de Performance:** Realocações são O(n), impactam operações add()
2. **Otimização de Memória:** Evitar desperdício em grandes coleções
3. **Previsibilidade:** Saber quando realocações ocorrerão

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Capacity vs Size:** Capacidade é tamanho do array, size é elementos presentes
2. **Dynamic Resizing:** Array cresce automaticamente quando necessário
3. **CapacityIncrement:** Parâmetro que controla estratégia de crescimento
4. **Amortized O(1):** add() é O(1) amortizado apesar de realocações ocasionais O(n)
5. **Customizabilidade:** Vector permite controle fino, ArrayList não

### Pilares Fundamentais

- **elementData:** Array interno que armazena elementos
- **elementCount:** Número de elementos presentes (size)
- **capacityIncrement:** Incremento de crescimento (0 = dobrar)
- **ensureCapacity():** Método para pré-alocar capacidade
- **trimToSize():** Reduz capacidade ao tamanho exato

### Visão Geral das Nuances

- **Initial Capacity:** Capacidade pode ser definida no construtor
- **Lazy Allocation:** Alguns construtores alocam array vazio inicialmente
- **Growth Factor:** capacityIncrement = 0 resulta em fator 2x
- **Memory Waste:** Capacidade excessiva desperdiça memória
- **Shrinking:** Vector não reduz capacidade automaticamente

---

## 🧠 Fundamentos Teóricos

### Estrutura Interna de Vector

**Campos Principais:**

```java
public class Vector<E> {
    protected Object[] elementData;     // Array interno
    protected int elementCount;         // Tamanho atual (size)
    protected int capacityIncrement;    // Incremento de crescimento

    public Vector(int initialCapacity, int capacityIncrement) {
        this.elementData = new Object[initialCapacity];
        this.capacityIncrement = capacityIncrement;
    }
}
```

**Relação:**
- `elementData.length` = capacidade atual
- `elementCount` = número de elementos (size)
- `capacityIncrement` = quanto crescer quando encher

### Construtores

**Construtor com Capacidade Inicial e Incremento:**

```java
Vector<String> v = new Vector<>(10, 5);
// Capacidade inicial: 10
// Incremento: +5 a cada crescimento
// Sequência: 10 → 15 → 20 → 25 → 30 ...
```

**Construtor com Apenas Capacidade Inicial:**

```java
Vector<String> v = new Vector<>(10);
// Capacidade inicial: 10
// Incremento: 0 (padrão - dobrar)
// Sequência: 10 → 20 → 40 → 80 → 160 ...
```

**Construtor Vazio:**

```java
Vector<String> v = new Vector<>();
// Capacidade inicial: 10 (padrão)
// Incremento: 0 (padrão - dobrar)
// Sequência: 10 → 20 → 40 → 80 ...
```

### Algoritmo de Crescimento

**Lógica Conceitual (simplificada):**

```java
private void grow(int minCapacity) {
    int oldCapacity = elementData.length;
    int newCapacity;

    if (capacityIncrement > 0) {
        // Crescimento por incremento fixo
        newCapacity = oldCapacity + capacityIncrement;
    } else {
        // Crescimento dobrando capacidade
        newCapacity = oldCapacity * 2;
    }

    // Garantir que newCapacity >= minCapacity
    if (newCapacity < minCapacity) {
        newCapacity = minCapacity;
    }

    // Realocar array
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

**Conceito:** Estratégia de crescimento é binária - incremental (fixo) ou multiplicativa (dobrar).

### Crescimento com capacityIncrement = 0 (Dobrar)

**Exemplo:**

```java
Vector<Integer> v = new Vector<>(4, 0);  // Cap inicial 4, dobrar
v.add(1);  // [1, _, _, _]       Cap: 4, Size: 1
v.add(2);  // [1, 2, _, _]       Cap: 4, Size: 2
v.add(3);  // [1, 2, 3, _]       Cap: 4, Size: 3
v.add(4);  // [1, 2, 3, 4]       Cap: 4, Size: 4
v.add(5);  // [1, 2, 3, 4, 5, _, _, _]  Cap: 8, Size: 5  (cresceu!)
```

**Sequência de Capacidades:** 4 → 8 → 16 → 32 → 64 → 128 ...

**Característica:** Crescimento exponencial - poucos redimensionamentos, mais desperdício.

### Crescimento com capacityIncrement > 0 (Incremental)

**Exemplo:**

```java
Vector<Integer> v = new Vector<>(4, 2);  // Cap inicial 4, incremento +2
v.add(1);  // [1, _, _, _]       Cap: 4, Size: 1
v.add(2);  // [1, 2, _, _]       Cap: 4, Size: 2
v.add(3);  // [1, 2, 3, _]       Cap: 4, Size: 3
v.add(4);  // [1, 2, 3, 4]       Cap: 4, Size: 4
v.add(5);  // [1, 2, 3, 4, 5, _]       Cap: 6, Size: 5  (cresceu +2)
v.add(6);  // [1, 2, 3, 4, 5, 6]       Cap: 6, Size: 6
v.add(7);  // [1, 2, 3, 4, 5, 6, 7, _] Cap: 8, Size: 7  (cresceu +2)
```

**Sequência de Capacidades:** 4 → 6 → 8 → 10 → 12 → 14 ...

**Característica:** Crescimento linear - mais redimensionamentos, menos desperdício.

---

## 🔍 Análise Conceitual Profunda

### Comparação: Vector vs ArrayList

**Vector (capacityIncrement = 0):**

```java
Vector<String> v = new Vector<>(10);
// Capacidades: 10 → 20 → 40 → 80 → 160
// Crescimento: 2x (dobra)
```

**ArrayList:**

```java
ArrayList<String> a = new ArrayList<>(10);
// Capacidades: 10 → 15 → 22 → 33 → 49
// Crescimento: 1.5x (50% adicional)
// Implementação: newCap = oldCap + (oldCap >> 1)
```

**Análise:**
- **Vector:** Crescimento mais agressivo (2x vs 1.5x)
- **Vector:** Menos realocações
- **ArrayList:** Menos desperdício de memória

**Exemplo Numérico (100 elementos):**

```
ArrayList: 10 → 15 → 22 → 33 → 49 → 73 → 109
Realocações: 6
Desperdício final: 109 - 100 = 9 elementos

Vector: 10 → 20 → 40 → 80 → 160
Realocações: 4
Desperdício final: 160 - 100 = 60 elementos
```

### Custo de Realocação

**Operação de Crescimento (O(n)):**

```java
// Quando array enche:
1. Criar novo array maior
2. Copiar TODOS elementos do array antigo para novo
3. Atribuir novo array a elementData
4. Array antigo é coletado por GC

// Custo: O(n) onde n = elementCount
```

**Amortização:**

```
Adicionar 1000 elementos em Vector inicial cap=10:
- 990 operações add(): O(1) direto
- 10 operações add(): O(n) com realocação
- Custo amortizado: O(1)
```

**Conceito:** Embora realocações sejam O(n), são raras o suficiente para que custo amortizado de add() seja O(1).

### ensureCapacity() - Pré-alocação

**Método:**

```java
public synchronized void ensureCapacity(int minCapacity);
```

**Uso:**

```java
Vector<Integer> v = new Vector<>();  // Cap inicial: 10

// Se souber que adicionará 1000 elementos:
v.ensureCapacity(1000);  // Pré-aloca array de 1000

for (int i = 0; i < 1000; i++) {
    v.add(i);  // NUNCA realoca - capacidade já suficiente
}
```

**Benefício:** Elimina realocações quando tamanho final é conhecido antecipadamente.

### trimToSize() - Reduzir Capacidade

**Método:**

```java
public synchronized void trimToSize();
```

**Uso:**

```java
Vector<String> v = new Vector<>(1000);  // Cap: 1000
// Adiciona apenas 50 elementos
v.trimToSize();  // Reduz capacidade para 50 exatamente
// Libera memória desperdiçada: 1000 - 50 = 950 slots
```

**Conceito:** Reduz capacidade ao mínimo necessário, liberando memória não utilizada.

### capacity() - Consultar Capacidade

**Método:**

```java
public synchronized int capacity();
```

**Diferença capacity() vs size():**

```java
Vector<String> v = new Vector<>(10);
v.add("A");
v.add("B");

int capacidade = v.capacity();  // 10 (tamanho do array)
int tamanho = v.size();         // 2 (elementos presentes)
// Desperdício: 10 - 2 = 8 slots vazios
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar capacityIncrement > 0

**Cenário: Memória Limitada**

```java
// Dispositivo embarcado com pouca memória
Vector<Byte> dados = new Vector<>(100, 10);
// Cresce conservadoramente: +10 por vez
// Reduz desperdício em ambiente com memória escassa
```

**Conceito:** Crescimento incremental evita grandes blocos de memória não utilizada.

### Quando Usar capacityIncrement = 0 (Padrão)

**Cenário: Performance Prioritária**

```java
Vector<String> logs = new Vector<>(1000, 0);
// Dobra capacidade quando enche
// Menos realocações = melhor performance
```

**Trade-off:** Mais memória desperdiçada, mas menos operações de cópia.

### Quando Usar ensureCapacity()

**Cenário: Tamanho Conhecido**

```java
Vector<Integer> numeros = new Vector<>();
numeros.ensureCapacity(10000);  // Pré-aloca

for (int i = 0; i < 10000; i++) {
    numeros.add(i);  // Sem realocações
}
```

**Benefício:** Elimina todas realocações, melhorando performance.

### Quando Usar trimToSize()

**Cenário: Coleção de Longa Duração**

```java
Vector<String> cache = new Vector<>(10000);
// Popula cache com apenas 1000 elementos

cache.trimToSize();  // Libera 9000 slots desperdiçados
// Cache permanecerá em memória por horas/dias
```

**Conceito:** Útil quando coleção persiste mas tamanho final é muito menor que capacidade alocada.

---

## ⚠️ Limitações e Considerações

**1. Vector Não Encolhe Automaticamente:**

```java
Vector<String> v = new Vector<>();
// Adiciona 1000 elementos (capacidade cresce para ~1280)
// Remove 900 elementos
// Capacidade continua ~1280 (não reduz)
// Memória desperdiçada até trimToSize() manual
```

**2. capacityIncrement É Legado:**

Característica raramente usada - adiciona complexidade sem benefício claro em aplicações modernas.

**3. Sincronização de Métodos de Capacidade:**

```java
v.ensureCapacity(1000);  // synchronized
v.trimToSize();          // synchronized
v.capacity();            // synchronized
// Overhead de lock mesmo para operações de metadados
```

**4. ArrayList Não Permite Customização:**

ArrayList sempre cresce 50%, sem parâmetro configurável - mas na prática isso é adequado.

---

## 🔗 Interconexões Conceituais

**Relação com ArrayList:** Ambas usam array dinâmico, mas ArrayList tem crescimento fixo 50%.

**Relação com ensureCapacity():** Método comum em coleções baseadas em array (ArrayList também tem).

**Relação com Dynamic Arrays:** Conceito universal em estruturas de dados - Vector é implementação Java.

**Relação com Memory Management:** Trade-off entre realocações e desperdício de memória.

---

## 🚀 Evolução e Próximos Conceitos

**Evolução de Crescimento:**

1. **Vector (1996):** Crescimento customizável via capacityIncrement
2. **ArrayList (1998):** Crescimento fixo 50% - simplificação adequada
3. **Streams/Collectors (2014):** Abstraem gerenciamento de capacidade

**Tópicos Relacionados:**
- Amortized analysis
- ArrayList internal implementation
- Dynamic array data structure
- Memory allocation strategies

---

## 📚 Conclusão

Vector gerencia capacidade via array dinâmico interno com crescimento configurável através de `capacityIncrement`. Quando `capacityIncrement = 0` (padrão), capacidade dobra ao encher. Quando `capacityIncrement > 0`, cresce por incremento fixo. ArrayList usa crescimento fixo de 50%, sem customização mas adequado para maioria dos casos. Métodos `ensureCapacity()` e `trimToSize()` permitem otimização manual. Compreender capacidade é essencial para otimização de memória e performance, mas em código moderno, ArrayList com comportamento padrão raramente precisa ajuste.
