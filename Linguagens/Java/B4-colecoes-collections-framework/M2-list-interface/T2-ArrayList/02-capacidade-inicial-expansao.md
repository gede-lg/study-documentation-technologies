# T2.02 - Capacidade Inicial e Expansão

## Introdução

**Capacidade inicial**: tamanho array interno inicial. **Expansão**: crescimento automático quando cheio. Padrão **10**, cresce **1.5x**.

```java
import java.util.*;

// Capacidade inicial e expansão
public class CapacidadeExpansao {
    public static void main(String[] args) {
        // ✅ Capacidade padrão: 10
        List<String> lista1 = new ArrayList<>();
        // capacity = 10, size = 0
        
        // ✅ Capacidade inicial customizada
        List<String> lista2 = new ArrayList<>(100);
        // capacity = 100, size = 0
        
        // ✅ Expansão automática
        List<Integer> lista3 = new ArrayList<>(2);  // capacity = 2
        lista3.add(1);  // size = 1
        lista3.add(2);  // size = 2, capacity = 2 (CHEIO)
        lista3.add(3);  // EXPANSÃO: capacity = 3 (2 * 1.5)
        lista3.add(4);  // size = 4, capacity = 3 (CHEIO)
        lista3.add(5);  // EXPANSÃO: capacity = 4 (3 * 1.5 arredondado)
        
        System.out.println(lista3.size());  // 5
    }
}
```

**Capacidade inicial**: padrão 10, customizável. **Expansão**: automática 1.5x quando cheio.

---

## Fundamentos

### 1. Capacidade Inicial Padrão

```java
// Capacidade inicial padrão
public class CapacidadeInicialPadrao {
    public static void main(String[] args) {
        // ✅ CONSTRUTOR VAZIO: capacidade 10
        List<String> lista = new ArrayList<>();
        
        // INTERNAMENTE:
        // private static final int DEFAULT_CAPACITY = 10;
        // 
        // public ArrayList() {
        //     this.elementData = new Object[DEFAULT_CAPACITY];
        // }
        
        // capacity = 10
        // size = 0
        // elementData = [null, null, ..., null] (10 posições)
        
        // Adicionar 10 elementos: sem expansão
        for (int i = 1; i <= 10; i++) {
            lista.add("Elemento " + i);
        }
        // size = 10, capacity = 10 (CHEIO)
        
        // 11º elemento: EXPANSÃO
        lista.add("Elemento 11");
        // size = 11
        // capacity = 15 (10 * 1.5)
        
        System.out.println(lista.size());  // 11
    }
}

/*
 * CAPACIDADE PADRÃO:
 * 
 * VALOR: 10
 * 
 * CONSTRUTOR VAZIO:
 * new ArrayList<>()
 * capacity = 10
 * 
 * PRIMEIRA EXPANSÃO:
 * 11º elemento -> capacity 15
 * 
 * MOTIVO:
 * Balanço entre:
 * - Pequeno (economiza memória)
 * - Grande suficiente (maioria casos)
 */
```

**Padrão**: 10 posições. Construtor vazio. Primeira expansão 11º elemento → 15.

### 2. Capacidade Inicial Customizada

```java
// ✅ Capacidade inicial customizada
public class CapacidadeCustomizada {
    public static void main(String[] args) {
        // ✅ ESPECIFICAR CAPACIDADE
        List<String> pequena = new ArrayList<>(5);
        // capacity = 5
        
        List<String> media = new ArrayList<>(100);
        // capacity = 100
        
        List<String> grande = new ArrayList<>(10000);
        // capacity = 10000
        
        // VANTAGEM: evitar expansões desnecessárias
        
        // ❌ SEM capacidade: múltiplas expansões
        List<Integer> semCapacidade = new ArrayList<>();
        for (int i = 0; i < 10000; i++) {
            semCapacidade.add(i);
        }
        // Expansões: 10 -> 15 -> 22 -> 33 -> 49 -> 73 -> ... (muitas)
        
        // ✅ COM capacidade: zero expansões
        List<Integer> comCapacidade = new ArrayList<>(10000);
        for (int i = 0; i < 10000; i++) {
            comCapacidade.add(i);
        }
        // Expansões: 0 (já tem espaço)
        
        System.out.println(comCapacidade.size());  // 10000
    }
}

/*
 * CAPACIDADE CUSTOMIZADA:
 * 
 * CONSTRUTOR:
 * new ArrayList<>(capacidade)
 * 
 * VANTAGENS:
 * - Evitar expansões
 * - Melhor performance
 * - Menos realocações
 * 
 * QUANDO USAR:
 * - Tamanho conhecido/estimado
 * - Adicionar muitos elementos
 * - Performance crítica
 * 
 * EXEMPLO:
 * new ArrayList<>(1000)
 * Adicionar 1000 elementos: 0 expansões
 */
```

**Customizada**: new ArrayList<>(capacidade). Evita expansões. Melhor performance tamanho conhecido.

### 3. Fórmula Expansão

```java
// Fórmula expansão
public class FormulaExpansao {
    public static void main(String[] args) {
        // FÓRMULA EXPANSÃO:
        // novaCapacidade = capacidadeAtual + (capacidadeAtual >> 1)
        // 
        // capacidadeAtual >> 1 = capacidadeAtual / 2
        // 
        // novaCapacidade = capacidade + (capacidade / 2)
        // novaCapacidade = capacidade * 1.5
        
        // EXEMPLOS:
        
        // capacity = 10
        // nova = 10 + (10 >> 1) = 10 + 5 = 15
        
        // capacity = 15
        // nova = 15 + (15 >> 1) = 15 + 7 = 22
        
        // capacity = 22
        // nova = 22 + (22 >> 1) = 22 + 11 = 33
        
        // capacity = 33
        // nova = 33 + (33 >> 1) = 33 + 16 = 49
        
        // SEQUÊNCIA EXPANSÕES:
        // 10 -> 15 -> 22 -> 33 -> 49 -> 73 -> 109 -> 163 -> 244 -> 366 -> ...
        
        // SIMULAÇÃO
        int capacity = 10;
        System.out.println("Capacidades: ");
        for (int i = 0; i < 10; i++) {
            System.out.print(capacity + " -> ");
            capacity = capacity + (capacity >> 1);
        }
    }
}

/*
 * FÓRMULA EXPANSÃO:
 * 
 * CÓDIGO:
 * int newCapacity = oldCapacity + (oldCapacity >> 1);
 * 
 * EQUIVALENTE:
 * newCapacity = oldCapacity * 1.5
 * 
 * OPERADOR >>:
 * >> 1 = dividir por 2 (shift right)
 * 10 >> 1 = 5
 * 15 >> 1 = 7
 * 
 * MOTIVO 1.5:
 * - Não muito grande (desperdício memória)
 * - Não muito pequeno (muitas expansões)
 * - Balanço eficiência
 * 
 * SEQUÊNCIA:
 * 10, 15, 22, 33, 49, 73, 109, 163, 244, 366
 */
```

**Fórmula**: nova = atual + (atual >> 1) = atual * 1.5. Shift right divide 2. Balanço eficiência.

### 4. Processo Expansão Detalhado

```java
// Processo expansão detalhado
public class ProcessoExpansao {
    public static void main(String[] args) {
        // EXPANSÃO PASSO A PASSO
        
        List<String> lista = new ArrayList<>(2);
        
        // ESTADO INICIAL:
        // elementData = [null, null]
        // size = 0
        // capacity = 2
        
        lista.add("A");
        // elementData = [A, null]
        // size = 1
        // capacity = 2
        
        lista.add("B");
        // elementData = [A, B]
        // size = 2
        // capacity = 2 (CHEIO)
        
        // ADICIONAR "C": trigger expansão
        lista.add("C");
        
        // PROCESSO INTERNO:
        // 
        // 1. DETECTAR CHEIO:
        //    if (size == elementData.length)
        // 
        // 2. CALCULAR NOVA CAPACIDADE:
        //    int newCapacity = 2 + (2 >> 1) = 2 + 1 = 3
        // 
        // 3. CRIAR NOVO ARRAY:
        //    Object[] newArray = new Object[3];
        // 
        // 4. COPIAR ELEMENTOS:
        //    System.arraycopy(elementData, 0, newArray, 0, size);
        //    newArray = [A, B, null]
        // 
        // 5. SUBSTITUIR ARRAY:
        //    elementData = newArray;
        // 
        // 6. ADICIONAR ELEMENTO:
        //    elementData[size++] = "C";
        
        // ESTADO FINAL:
        // elementData = [A, B, C]
        // size = 3
        // capacity = 3
        
        System.out.println(lista);  // [A, B, C]
    }
}

/*
 * PROCESSO EXPANSÃO:
 * 
 * 1. DETECTAR:
 *    size == capacity
 * 
 * 2. CALCULAR:
 *    newCapacity = capacity * 1.5
 * 
 * 3. CRIAR:
 *    new Object[newCapacity]
 * 
 * 4. COPIAR:
 *    System.arraycopy(old, new)
 * 
 * 5. SUBSTITUIR:
 *    elementData = newArray
 * 
 * 6. ADICIONAR:
 *    elementData[size++] = elemento
 * 
 * CUSTO:
 * O(n) copiar elementos
 * Amortizado O(1) adicionar
 */
```

**Processo**: detectar cheio, calcular 1.5x, criar array, copiar System.arraycopy, substituir, adicionar. O(n) cópia.

### 5. Custo Amortizado

```java
// Custo amortizado expansão
public class CustoAmortizado {
    public static void main(String[] args) {
        // ANÁLISE CUSTO AMORTIZADO
        
        // Adicionar N elementos: quantas cópias?
        
        // EXEMPLO: N = 100
        // 
        // Expansões:
        // 10 -> 15 (copia 10)
        // 15 -> 22 (copia 15)
        // 22 -> 33 (copia 22)
        // 33 -> 49 (copia 33)
        // 49 -> 73 (copia 49)
        // 73 -> 109 (copia 73)
        // 
        // Total cópias: 10 + 15 + 22 + 33 + 49 + 73 = 202
        // 
        // Custo amortizado por elemento:
        // 202 / 100 = 2.02 ≈ O(1)
        
        // CONCLUSÃO:
        // Embora expansão seja O(n)
        // Ocorre raramente
        // Custo amortizado por add() é O(1)
        
        // SIMULAÇÃO
        int n = 10000;
        int copias = 0;
        int capacity = 10;
        int size = 0;
        
        for (int i = 0; i < n; i++) {
            if (size == capacity) {
                // Expansão: copia todos
                copias += size;
                capacity = capacity + (capacity >> 1);
            }
            size++;
        }
        
        System.out.println("Elementos: " + n);
        System.out.println("Cópias totais: " + copias);
        System.out.println("Cópias por elemento: " + (double) copias / n);
        // Cópias por elemento ≈ 2 (constante)
    }
}

/*
 * CUSTO AMORTIZADO:
 * 
 * ANÁLISE:
 * N elementos
 * Expansões logarítmicas (log N)
 * Cópias totais ≈ 2N
 * 
 * AMORTIZADO:
 * Custo por elemento = 2N / N = 2 = O(1)
 * 
 * EMBORA:
 * Expansão individual O(n)
 * 
 * RARIDADE:
 * Ocorre raramente
 * Maioria add() O(1) direto
 * 
 * CONCLUSÃO:
 * add(elemento) fim: O(1) amortizado
 */
```

**Amortizado**: expansão O(n) rara, cópias totais ≈ 2N, custo por elemento O(1). Add fim O(1) amortizado.

### 6. Desperdício Memória

```java
// Desperdício memória
public class DesperdícioMemoria {
    public static void main(String[] args) {
        // ❌ PROBLEMA: capacidade > size
        
        List<String> lista = new ArrayList<>(1000);
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // capacity = 1000
        // size = 3
        // Desperdício: 997 posições vazias
        
        // SOLUÇÃO 1: trimToSize()
        List<String> lista2 = new ArrayList<>(1000);
        lista2.add("A");
        lista2.add("B");
        lista2.add("C");
        
        if (lista2 instanceof ArrayList) {
            ((ArrayList<String>) lista2).trimToSize();
        }
        // capacity = 3 (reduz para size)
        
        // SOLUÇÃO 2: capacidade correta inicial
        List<String> lista3 = new ArrayList<>(3);
        lista3.add("A");
        lista3.add("B");
        lista3.add("C");
        // capacity = 3, size = 3 (sem desperdício)
        
        // TRADE-OFF:
        // Capacidade grande: desperdício memória
        // Capacidade pequena: múltiplas expansões
        
        System.out.println(lista.size());  // 3
    }
}

/*
 * DESPERDÍCIO MEMÓRIA:
 * 
 * CAUSA:
 * capacity > size
 * Espaço não utilizado
 * 
 * EXEMPLO:
 * capacity = 1000
 * size = 3
 * Desperdício: 997 posições
 * 
 * SOLUÇÃO:
 * 1. trimToSize() - reduz capacidade
 * 2. Capacidade inicial correta
 * 3. Não especificar capacidade excessiva
 * 
 * TRADE-OFF:
 * Memória vs Expansões
 * Grande: desperdício
 * Pequena: expansões
 */
```

**Desperdício**: capacity > size. trimToSize() reduz. Capacidade correta inicial. Trade-off memória vs expansões.

### 7. Expansão vs Capacidade Inicial

```java
// Comparação expansão vs capacidade inicial
public class ExpansaoVsCapacidade {
    public static void main(String[] args) {
        // ❌ SEM CAPACIDADE INICIAL
        long inicio1 = System.nanoTime();
        List<Integer> semCapacidade = new ArrayList<>();
        for (int i = 0; i < 100000; i++) {
            semCapacidade.add(i);
        }
        long fim1 = System.nanoTime();
        System.out.println("Sem capacidade: " + (fim1 - inicio1) / 1_000_000 + "ms");
        
        // ✅ COM CAPACIDADE INICIAL
        long inicio2 = System.nanoTime();
        List<Integer> comCapacidade = new ArrayList<>(100000);
        for (int i = 0; i < 100000; i++) {
            comCapacidade.add(i);
        }
        long fim2 = System.nanoTime();
        System.out.println("Com capacidade: " + (fim2 - inicio2) / 1_000_000 + "ms");
        
        // RESULTADO ESPERADO:
        // Com capacidade: mais rápido
        // Evita múltiplas expansões/cópias
        
        // NÚMERO EXPANSÕES:
        // Sem capacidade: ~20 expansões (10 -> 15 -> 22 -> ... -> 163k)
        // Com capacidade: 0 expansões
    }
}

/*
 * COMPARAÇÃO:
 * 
 * SEM CAPACIDADE:
 * - Múltiplas expansões
 * - Múltiplas cópias
 * - Mais lento
 * 
 * COM CAPACIDADE:
 * - Zero expansões
 * - Zero cópias
 * - Mais rápido
 * 
 * QUANDO ESPECIFICAR:
 * - Tamanho conhecido
 * - Adicionar muitos elementos
 * - Performance importante
 * 
 * QUANDO NÃO:
 * - Tamanho desconhecido
 * - Poucos elementos
 * - Memória limitada
 */
```

**Comparação**: sem capacidade múltiplas expansões lento, com capacidade zero expansões rápido. Especificar quando conhecido.

### 8. Resumo Visual

```java
/*
 * CAPACIDADE INICIAL E EXPANSÃO
 * 
 * CAPACIDADE INICIAL PADRÃO:
 * 
 * new ArrayList<>()
 * capacity = 10 (DEFAULT_CAPACITY)
 * 
 * CUSTOMIZADA:
 * 
 * new ArrayList<>(100)
 * capacity = 100
 * 
 * FÓRMULA EXPANSÃO:
 * 
 * newCapacity = oldCapacity + (oldCapacity >> 1)
 * newCapacity = oldCapacity * 1.5
 * 
 * OPERADOR >>:
 * >> 1 = dividir por 2 (shift right)
 * 10 >> 1 = 5
 * 
 * SEQUÊNCIA EXPANSÕES (padrão 10):
 * 10 -> 15 -> 22 -> 33 -> 49 -> 73 -> 109 -> 163 -> 244 -> 366
 * 
 * PROCESSO EXPANSÃO:
 * 
 * 1. DETECTAR: size == capacity
 * 2. CALCULAR: newCapacity = capacity * 1.5
 * 3. CRIAR: new Object[newCapacity]
 * 4. COPIAR: System.arraycopy(old, new)
 * 5. SUBSTITUIR: elementData = newArray
 * 6. ADICIONAR: elementData[size++] = elemento
 * 
 * CUSTO:
 * Expansão individual: O(n) copiar
 * Amortizado: O(1) por elemento
 * 
 * CUSTO AMORTIZADO:
 * 
 * N elementos
 * Cópias totais ≈ 2N
 * Custo por elemento = 2N / N = 2 = O(1)
 * 
 * DESPERDÍCIO MEMÓRIA:
 * 
 * capacity > size
 * Espaço não utilizado
 * 
 * SOLUÇÃO:
 * - trimToSize()
 * - Capacidade inicial correta
 * 
 * TRADE-OFF:
 * Grande: desperdício memória
 * Pequena: múltiplas expansões
 * 
 * COMPARAÇÃO PERFORMANCE:
 * 
 * SEM CAPACIDADE (100k elementos):
 * - ~20 expansões
 * - Mais lento
 * 
 * COM CAPACIDADE (100k):
 * - 0 expansões
 * - Mais rápido
 * 
 * QUANDO ESPECIFICAR CAPACIDADE:
 * ✅ Tamanho conhecido/estimado
 * ✅ Adicionar muitos elementos
 * ✅ Performance crítica
 * 
 * QUANDO NÃO:
 * ❌ Tamanho desconhecido
 * ❌ Poucos elementos
 * ❌ Memória limitada
 */

// EXEMPLO COMPLETO
public class ExemploCompleto {
    public static void main(String[] args) {
        // Capacidade padrão 10
        List<String> lista1 = new ArrayList<>();
        
        // Capacidade customizada
        List<String> lista2 = new ArrayList<>(1000);
        
        // Expansão automática
        List<Integer> lista3 = new ArrayList<>(2);
        lista3.add(1);  // size = 1, capacity = 2
        lista3.add(2);  // size = 2, capacity = 2 (CHEIO)
        lista3.add(3);  // EXPANSÃO: capacity = 3 (2 * 1.5)
        
        System.out.println(lista3.size());  // 3
    }
}
```

---

## Aplicabilidade

**Capacidade inicial**:
- **Especificar** quando tamanho conhecido
- **Padrão 10** maioria casos
- **Evitar** capacidade excessiva

**Expansão**:
- **Automática** transparente
- **1.5x** balanço eficiência
- **O(1) amortizado** adicionar

---

## Armadilhas

### 1. Capacidade Excessiva

```java
// ❌ Desperdício memória
List<String> lista = new ArrayList<>(10000);
lista.add("A");
lista.add("B");

// capacity = 10000, size = 2
// Desperdício: 9998 posições
```

### 2. Sem Capacidade Muitos Elementos

```java
// ❌ Múltiplas expansões
List<Integer> lista = new ArrayList<>();
for (int i = 0; i < 100000; i++) {
    lista.add(i);  // ~20 expansões
}

// ✅ Com capacidade
List<Integer> lista = new ArrayList<>(100000);
for (int i = 0; i < 100000; i++) {
    lista.add(i);  // 0 expansões
}
```

---

## Boas Práticas

### 1. Especificar Capacidade Conhecida

```java
// ✅ Tamanho conhecido
List<String> lista = new ArrayList<>(1000);
for (int i = 0; i < 1000; i++) {
    lista.add("Elemento " + i);
}
// 0 expansões
```

### 2. trimToSize() Após Preencher

```java
// ✅ Reduzir desperdício
List<String> lista = new ArrayList<>(1000);
lista.add("A");
lista.add("B");

((ArrayList<String>) lista).trimToSize();
// capacity = 2 (reduz para size)
```

### 3. Padrão Tamanho Desconhecido

```java
// ✅ Usar padrão quando desconhecido
List<String> lista = new ArrayList<>();
// capacity = 10 (razoável)
```

---

## Resumo

**Capacidade inicial**:
- **Padrão**: 10 posições
- **Customizada**: new ArrayList<>(capacidade)
- **Vantagem**: evitar expansões

**Expansão**:
- **Fórmula**: nova = atual + (atual >> 1) = atual * 1.5
- **Trigger**: size == capacity
- **Processo**: criar, copiar, substituir
- **Custo**: O(n) cópia, O(1) amortizado

**Sequência**:
- 10 → 15 → 22 → 33 → 49 → 73 → 109 → 163 → 244 → 366

**Processo**:
1. Detectar size == capacity
2. Calcular nova * 1.5
3. Criar new Object[nova]
4. Copiar System.arraycopy
5. Substituir elementData
6. Adicionar elemento

**Custo amortizado**:
- N elementos, cópias ≈ 2N
- Custo por elemento O(1)
- Expansão rara

**Desperdício**:
- capacity > size espaço não usado
- trimToSize() reduz
- Trade-off memória vs expansões

**Performance**:
- Sem capacidade: ~20 expansões 100k elementos
- Com capacidade: 0 expansões
- Mais rápido capacidade inicial

**Regra de Ouro**: Capacidade inicial padrão 10 construtor vazio customizada new ArrayList capacidade quando conhecido. Expansão automática 1.5x atual shift right divide 2 balanço eficiência. Processo detectar cheio calcular criar array copiar System.arraycopy substituir adicionar custo On cópia O1 amortizado. Sequência 10 15 22 33 49 73 109 crescimento. Custo amortizado N elementos cópias 2N por elemento O1 constante expansão rara. Desperdício capacity maior size trimToSize reduz trade-off memória expansões. Performance sem capacidade múltiplas expansões lento com capacidade zero expansões rápido. ESPECIFICAR capacidade tamanho conhecido adicionar muitos performance crítica. USAR padrão desconhecido poucos elementos. EVITAR capacidade excessiva desperdício memória.

