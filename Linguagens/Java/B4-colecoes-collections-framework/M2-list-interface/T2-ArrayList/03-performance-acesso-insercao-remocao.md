# T2.03 - Performance: Acesso O(1), Inserção/Remoção O(n)

## Introdução

**Performance ArrayList**: acesso **O(1)** direto, inserção/remoção **O(n)** desloca elementos.

```java
import java.util.*;

// Performance ArrayList
public class PerformanceArrayList {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // ✅ ACESSO: O(1) - muito rápido
        String elemento = lista.get(2);  // Acesso direto array[2]
        // Tempo constante, independente tamanho
        
        // ❌ INSERÇÃO MEIO: O(n) - lento
        lista.add(2, "X");  // Inserir índice 2
        // Precisa deslocar: C, D, E -> direita
        // Tempo proporcional elementos deslocados
        
        // ❌ REMOÇÃO MEIO: O(n) - lento
        lista.remove(1);    // Remover índice 1
        // Precisa deslocar: X, C, D, E -> esquerda
        // Tempo proporcional elementos deslocados
        
        // ✅ INSERÇÃO FIM: O(1) amortizado - rápido
        lista.add("Z");     // Adicionar fim
        // Sem deslocamento
        
        System.out.println(lista);
    }
}
```

**Performance**: get O(1) direto, add/remove meio O(n) desloca, add fim O(1) amortizado.

---

## Fundamentos

### 1. Acesso O(1)

```java
// ✅ Acesso O(1) - tempo constante
public class AcessoO1 {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>();
        
        // Adicionar 1 milhão elementos
        for (int i = 0; i < 1_000_000; i++) {
            lista.add("Elemento " + i);
        }
        
        // ACESSO: tempo constante qualquer índice
        
        long inicio1 = System.nanoTime();
        String primeiro = lista.get(0);
        long fim1 = System.nanoTime();
        
        long inicio2 = System.nanoTime();
        String meio = lista.get(500_000);
        long fim2 = System.nanoTime();
        
        long inicio3 = System.nanoTime();
        String ultimo = lista.get(999_999);
        long fim3 = System.nanoTime();
        
        System.out.println("Primeiro: " + (fim1 - inicio1) + "ns");
        System.out.println("Meio: " + (fim2 - inicio2) + "ns");
        System.out.println("Último: " + (fim3 - inicio3) + "ns");
        
        // TODOS ~mesma velocidade
        // Tempo NÃO depende posição
        
        // MOTIVO:
        // get(index) -> return elementData[index]
        // Acesso direto array
        // Operação única, constante
    }
}

/*
 * ACESSO O(1):
 * 
 * IMPLEMENTAÇÃO:
 * public E get(int index) {
 *     return (E) elementData[index];
 * }
 * 
 * PROCESSO:
 * 1. Acessa array direto
 * 2. Retorna elemento
 * 
 * TEMPO:
 * Constante O(1)
 * Independente tamanho lista
 * Independente posição
 * 
 * VANTAGEM:
 * Muito rápido
 * Acesso aleatório eficiente
 */
```

**Acesso O(1)**: elementData[index] direto. Tempo constante independente tamanho/posição. Muito rápido.

### 2. Inserção Fim O(1) Amortizado

```java
// ✅ Inserção fim O(1) amortizado
public class InsercaoFimO1 {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>();
        
        // INSERÇÃO FIM: add(elemento)
        
        long total = 0;
        for (int i = 0; i < 100_000; i++) {
            long inicio = System.nanoTime();
            lista.add("Elemento " + i);
            long fim = System.nanoTime();
            total += (fim - inicio);
        }
        
        System.out.println("Tempo médio: " + (total / 100_000) + "ns");
        // Tempo médio constante
        
        // PROCESSO add(elemento):
        // 1. if (size == capacity) expansão O(n) (raro)
        // 2. elementData[size++] = elemento O(1)
        // 
        // MAIORIA: direto O(1)
        // RARAMENTE: expansão O(n)
        // AMORTIZADO: O(1)
        
        // SEM DESLOCAMENTO:
        // Adiciona posição size
        // Não move elementos existentes
    }
}

/*
 * INSERÇÃO FIM O(1):
 * 
 * IMPLEMENTAÇÃO:
 * public boolean add(E elemento) {
 *     if (size == capacity) expansão();
 *     elementData[size++] = elemento;
 *     return true;
 * }
 * 
 * PROCESSO:
 * 1. Verificar capacidade
 * 2. Adicionar elementData[size]
 * 3. Incrementar size
 * 
 * TEMPO:
 * Maioria: O(1) direto
 * Raramente: O(n) expansão
 * Amortizado: O(1)
 * 
 * VANTAGEM:
 * Muito eficiente adicionar fim
 * Sem deslocamento
 */
```

**Inserção fim O(1)**: elementData[size++] direto. Sem deslocamento. Maioria O(1), raramente expansão O(n), amortizado O(1).

### 3. Inserção Meio O(n)

```java
// ❌ Inserção meio O(n) - lento
public class InsercaoMeioOn {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // INSERIR ÍNDICE 2: add(2, "X")
        // 
        // ANTES:  [A, B, C, D, E]
        //          0  1  2  3  4
        // 
        // PROCESSO:
        // 1. Deslocar C, D, E -> direita
        //    [A, B, _, C, D, E]
        // 2. Inserir X posição 2
        //    [A, B, X, C, D, E]
        // 
        // ELEMENTOS DESLOCADOS: 3 (C, D, E)
        
        lista.add(2, "X");
        System.out.println(lista);  // [A, B, X, C, D, E]
        
        // CUSTO INSERÇÃO MEIO:
        // Proporcional elementos depois
        // Pior caso (início): desloca TODOS = O(n)
        // Melhor caso (fim): desloca 0 = O(1)
        // Médio: desloca n/2 = O(n)
        
        // SIMULAÇÃO CUSTO
        List<Integer> grande = new ArrayList<>();
        for (int i = 0; i < 100_000; i++) {
            grande.add(i);
        }
        
        // Inserção início (pior caso)
        long inicio1 = System.nanoTime();
        grande.add(0, -1);
        long fim1 = System.nanoTime();
        System.out.println("Início: " + (fim1 - inicio1) + "ns");
        
        // Inserção meio
        long inicio2 = System.nanoTime();
        grande.add(50_000, -2);
        long fim2 = System.nanoTime();
        System.out.println("Meio: " + (fim2 - inicio2) + "ns");
        
        // Inserção fim (melhor caso)
        long inicio3 = System.nanoTime();
        grande.add(-3);
        long fim3 = System.nanoTime();
        System.out.println("Fim: " + (fim3 - inicio3) + "ns");
        
        // Início >> Meio >> Fim
    }
}

/*
 * INSERÇÃO MEIO O(n):
 * 
 * IMPLEMENTAÇÃO:
 * public void add(int index, E elemento) {
 *     if (size == capacity) expansão();
 *     System.arraycopy(elementData, index,
 *                      elementData, index + 1,
 *                      size - index);
 *     elementData[index] = elemento;
 *     size++;
 * }
 * 
 * PROCESSO:
 * 1. Verificar capacidade
 * 2. Deslocar elementos [index..size] -> direita
 * 3. Inserir elemento posição index
 * 
 * CUSTO:
 * System.arraycopy: O(k) onde k = elementos deslocados
 * Pior caso (início): k = n, O(n)
 * Melhor caso (fim): k = 0, O(1)
 * Médio: k = n/2, O(n)
 * 
 * DESVANTAGEM:
 * Lento para inserções frequentes meio/início
 */
```

**Inserção meio O(n)**: System.arraycopy desloca elementos direita. Pior caso início O(n), melhor fim O(1), médio O(n).

### 4. Remoção Meio O(n)

```java
// ❌ Remoção meio O(n) - lento
public class RemocaoMeioOn {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // REMOVER ÍNDICE 1: remove(1)
        // 
        // ANTES:  [A, B, C, D, E]
        //          0  1  2  3  4
        // 
        // PROCESSO:
        // 1. Remover B
        // 2. Deslocar C, D, E -> esquerda
        //    [A, C, D, E, _]
        // 3. Decrementar size
        //    [A, C, D, E]
        // 
        // ELEMENTOS DESLOCADOS: 3 (C, D, E)
        
        lista.remove(1);
        System.out.println(lista);  // [A, C, D, E]
        
        // CUSTO REMOÇÃO MEIO:
        // Proporcional elementos depois
        // Pior caso (início): desloca TODOS = O(n)
        // Melhor caso (fim): desloca 0 = O(1)
        // Médio: desloca n/2 = O(n)
        
        // SIMULAÇÃO CUSTO
        List<Integer> grande = new ArrayList<>();
        for (int i = 0; i < 100_000; i++) {
            grande.add(i);
        }
        
        // Remoção início (pior caso)
        long inicio1 = System.nanoTime();
        grande.remove(0);
        long fim1 = System.nanoTime();
        System.out.println("Início: " + (fim1 - inicio1) + "ns");
        
        // Remoção meio
        long inicio2 = System.nanoTime();
        grande.remove(50_000);
        long fim2 = System.nanoTime();
        System.out.println("Meio: " + (fim2 - inicio2) + "ns");
        
        // Remoção fim (melhor caso)
        long inicio3 = System.nanoTime();
        grande.remove(grande.size() - 1);
        long fim3 = System.nanoTime();
        System.out.println("Fim: " + (fim3 - inicio3) + "ns");
        
        // Início >> Meio >> Fim
    }
}

/*
 * REMOÇÃO MEIO O(n):
 * 
 * IMPLEMENTAÇÃO:
 * public E remove(int index) {
 *     E oldValue = (E) elementData[index];
 *     int numMoved = size - index - 1;
 *     if (numMoved > 0) {
 *         System.arraycopy(elementData, index + 1,
 *                          elementData, index,
 *                          numMoved);
 *     }
 *     elementData[--size] = null;
 *     return oldValue;
 * }
 * 
 * PROCESSO:
 * 1. Guardar elemento remover
 * 2. Deslocar elementos [index+1..size] -> esquerda
 * 3. Nullificar última posição
 * 4. Decrementar size
 * 
 * CUSTO:
 * System.arraycopy: O(k) onde k = elementos deslocados
 * Pior caso (início): k = n-1, O(n)
 * Melhor caso (fim): k = 0, O(1)
 * Médio: k = n/2, O(n)
 * 
 * DESVANTAGEM:
 * Lento para remoções frequentes meio/início
 */
```

**Remoção meio O(n)**: System.arraycopy desloca esquerda. Pior caso início O(n), melhor fim O(1), médio O(n).

### 5. Busca O(n)

```java
// ❌ Busca O(n) - linear
public class BuscaOn {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // BUSCA: contains(), indexOf()
        
        // contains("C"): procura sequencial
        boolean contem = lista.contains("C");  // true
        // Percorre [A, B, C] até encontrar
        // O(n) pior caso
        
        // indexOf("D"): retorna índice
        int indice = lista.indexOf("D");  // 3
        // Percorre [A, B, C, D] até encontrar
        // O(n) pior caso
        
        // lastIndexOf("E"): busca reversa
        int ultimo = lista.lastIndexOf("E");  // 4
        // O(n) pior caso
        
        // IMPLEMENTAÇÃO contains():
        // public boolean contains(Object o) {
        //     return indexOf(o) >= 0;
        // }
        // 
        // IMPLEMENTAÇÃO indexOf():
        // public int indexOf(Object o) {
        //     for (int i = 0; i < size; i++) {
        //         if (o.equals(elementData[i])) {
        //             return i;
        //         }
        //     }
        //     return -1;
        // }
        
        // CUSTO:
        // Percorre sequencial até encontrar
        // Pior caso: elemento fim ou inexistente = O(n)
        // Melhor caso: elemento início = O(1)
        // Médio: n/2 = O(n)
        
        System.out.println(contem);
    }
}

/*
 * BUSCA O(n):
 * 
 * MÉTODOS:
 * contains(elemento): verifica existência
 * indexOf(elemento): retorna índice primeira ocorrência
 * lastIndexOf(elemento): índice última ocorrência
 * 
 * IMPLEMENTAÇÃO:
 * Loop sequencial
 * Comparação equals() cada elemento
 * 
 * CUSTO:
 * Pior caso: O(n) fim/inexistente
 * Melhor caso: O(1) início
 * Médio: O(n)
 * 
 * ALTERNATIVA:
 * Set para verificação rápida O(1)
 * Map para busca chave-valor O(1)
 */
```

**Busca O(n)**: contains/indexOf loop sequencial. Pior caso O(n), melhor O(1), médio O(n). Alternativa Set O(1).

### 6. Iteração O(n)

```java
// ✅ Iteração O(n) - eficiente
public class IteracaoOn {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // ITERAÇÃO: percorrer todos
        
        // For-each: O(n)
        for (String s : lista) {
            System.out.println(s);
        }
        // Percorre size elementos
        // Cada get() O(1)
        // Total: n * O(1) = O(n)
        
        // For tradicional: O(n)
        for (int i = 0; i < lista.size(); i++) {
            String s = lista.get(i);
            System.out.println(s);
        }
        // Percorre n elementos
        // Cada get(i) O(1)
        // Total: O(n)
        
        // Iterator: O(n)
        Iterator<String> it = lista.iterator();
        while (it.hasNext()) {
            String s = it.next();
            System.out.println(s);
        }
        // Percorre n elementos
        // Total: O(n)
        
        // TODOS EFICIENTES: O(n)
        // ArrayList otimizado iteração sequencial
    }
}

/*
 * ITERAÇÃO O(n):
 * 
 * FOR-EACH:
 * for (E elemento : lista) { }
 * O(n) total
 * 
 * FOR TRADICIONAL:
 * for (int i = 0; i < lista.size(); i++) {
 *     lista.get(i);  // O(1)
 * }
 * O(n) total
 * 
 * ITERATOR:
 * Iterator<E> it = lista.iterator();
 * while (it.hasNext()) {
 *     it.next();  // O(1)
 * }
 * O(n) total
 * 
 * VANTAGEM:
 * Acesso sequencial cache-friendly
 * Memória contígua
 * Muito eficiente
 */
```

**Iteração O(n)**: for-each, for, Iterator todos O(n). Cada acesso O(1), total n * O(1) = O(n). Cache-friendly.

### 7. Tabela Complexidade

```java
/*
 * COMPLEXIDADE ARRAYLIST
 * 
 * OPERAÇÃO              COMPLEXIDADE    DESCRIÇÃO
 * =====================================================
 * get(i)                O(1)            Acesso direto array
 * set(i, elemento)      O(1)            Modificação direta
 * 
 * add(elemento)         O(1) amortizado Adicionar fim
 * add(i, elemento)      O(n)            Desloca elementos
 * 
 * remove(i)             O(n)            Desloca elementos
 * remove(elemento)      O(n)            Busca + desloca
 * 
 * contains(elemento)    O(n)            Busca sequencial
 * indexOf(elemento)     O(n)            Busca sequencial
 * 
 * size()                O(1)            Campo size
 * isEmpty()             O(1)            Verificação size == 0
 * clear()               O(n)            Nullificar elementos
 * 
 * toArray()             O(n)            Copiar array
 * iterator()            O(1)            Criar iterator
 * iterator.next()       O(1)            Próximo elemento
 * 
 * MELHOR CASO:
 * add(elemento) fim: O(1)
 * remove(size-1) fim: O(1)
 * 
 * PIOR CASO:
 * add(0, elemento) início: O(n)
 * remove(0) início: O(n)
 * contains(elemento) inexistente: O(n)
 * 
 * MÉDIO:
 * add(i, elemento) meio: O(n)
 * remove(i) meio: O(n)
 */

public class TabelaComplexidade {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>();
        
        // O(1)
        lista.add("A");           // Fim
        String elemento = lista.get(0);  // Acesso
        lista.set(0, "B");        // Modificação
        int tamanho = lista.size();  // Size
        
        // O(n)
        lista.add(0, "C");        // Início
        lista.remove(0);          // Início
        boolean contem = lista.contains("X");  // Busca
        
        System.out.println(lista);
    }
}
```

**Tabela**: get/set O(1), add fim O(1), add/remove meio O(n), busca O(n), size O(1), iteração O(n).

### 8. Resumo Visual

```java
/*
 * PERFORMANCE ARRAYLIST
 * 
 * ACESSO O(1):
 * get(index) -> elementData[index]
 * Direto, constante
 * 
 * INSERÇÃO FIM O(1) AMORTIZADO:
 * add(elemento) -> elementData[size++] = elemento
 * Sem deslocamento
 * Raramente expansão O(n)
 * 
 * INSERÇÃO MEIO O(n):
 * add(index, elemento):
 * 1. Deslocar [index..size] -> direita
 * 2. elementData[index] = elemento
 * 
 * Pior caso (início): desloca TODOS = O(n)
 * Melhor caso (fim): desloca 0 = O(1)
 * 
 * REMOÇÃO MEIO O(n):
 * remove(index):
 * 1. Deslocar [index+1..size] -> esquerda
 * 2. Decrementar size
 * 
 * Pior caso (início): desloca TODOS = O(n)
 * Melhor caso (fim): desloca 0 = O(1)
 * 
 * BUSCA O(n):
 * contains/indexOf: loop sequencial
 * Percorre até encontrar
 * Pior caso: O(n)
 * 
 * ITERAÇÃO O(n):
 * For-each/for/Iterator: percorre n elementos
 * Cada get() O(1)
 * Total: O(n)
 * 
 * QUANDO ARRAYLIST É EFICIENTE:
 * ✅ Acesso aleatório frequente
 * ✅ Adicionar/remover fim
 * ✅ Iteração sequencial
 * ✅ Modificação elementos (set)
 * 
 * QUANDO ARRAYLIST É INEFICIENTE:
 * ❌ Inserção/remoção início/meio frequente
 * ❌ Busca elemento frequente (usar Set)
 * ❌ Tamanho muito variável imprevisível
 */

// EXEMPLO PERFORMANCE
public class ExemploPerformance {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>();
        
        // ✅ Eficiente O(1)
        lista.add("A");
        String elemento = lista.get(0);
        
        // ❌ Ineficiente O(n)
        lista.add(0, "B");  // Desloca todos
        lista.remove(0);    // Desloca todos
        
        System.out.println(lista);
    }
}
```

---

## Aplicabilidade

**ArrayList eficiente**:
- **Acesso** aleatório frequente
- **Adicionar/remover** fim
- **Iteração** sequencial
- **Tamanho** conhecido/estimado

**ArrayList ineficiente**:
- **Inserção/remoção** meio/início frequente
- **Busca** elemento frequente
- **Tamanho** muito variável

---

## Armadilhas

### 1. Inserção Início Frequente

```java
// ❌ Muito lento
List<String> lista = new ArrayList<>();
for (int i = 0; i < 10000; i++) {
    lista.add(0, "Elemento");  // O(n) cada
}
// Total: O(n²)

// ✅ Usar LinkedList
List<String> lista = new LinkedList<>();
for (int i = 0; i < 10000; i++) {
    lista.add(0, "Elemento");  // O(1)
}
```

### 2. Busca Frequente

```java
// ❌ Lento O(n)
if (lista.contains("X")) {  // Loop completo
}

// ✅ Usar Set O(1)
Set<String> conjunto = new HashSet<>(lista);
if (conjunto.contains("X")) {  // Hash direto
}
```

---

## Boas Práticas

### 1. Adicionar Fim

```java
// ✅ Eficiente O(1)
lista.add("Elemento");

// ❌ Evitar início O(n)
lista.add(0, "Elemento");
```

### 2. LinkedList Inserção Frequente

```java
// ❌ ArrayList inserção meio
List<String> lista = new ArrayList<>();
lista.add(middle, "X");  // O(n)

// ✅ LinkedList
List<String> lista = new LinkedList<>();
lista.add(middle, "X");  // Melhor
```

### 3. Set Busca Frequente

```java
// ❌ ArrayList busca O(n)
if (lista.contains("X")) { }

// ✅ Set busca O(1)
Set<String> set = new HashSet<>();
if (set.contains("X")) { }
```

---

## Resumo

**Performance**:
- **get(i)**: O(1) acesso direto
- **add(elemento)**: O(1) amortizado fim
- **add(i, elemento)**: O(n) desloca
- **remove(i)**: O(n) desloca
- **contains**: O(n) busca
- **iteração**: O(n) sequencial

**Acesso O(1)**:
- elementData[index] direto
- Independente tamanho/posição
- Muito rápido

**Inserção fim O(1)**:
- elementData[size++] sem deslocamento
- Raramente expansão O(n)
- Amortizado O(1)

**Inserção/Remoção meio O(n)**:
- System.arraycopy desloca elementos
- Pior caso início O(n)
- Melhor caso fim O(1)
- Médio O(n)

**Busca O(n)**:
- Loop sequencial equals()
- Pior caso fim/inexistente
- Alternativa Set O(1)

**Iteração O(n)**:
- For-each/for/Iterator
- Cada get() O(1)
- Total n * O(1) = O(n)
- Cache-friendly

**Eficiente**:
- Acesso aleatório
- Adicionar/remover fim
- Iteração sequencial
- Modificação set()

**Ineficiente**:
- Inserção/remoção meio/início frequente
- Busca frequente (usar Set)
- Tamanho muito variável

**Regra de Ouro**: ArrayList acesso O1 direto array muito rápido independente posição. Inserção fim O1 amortizado sem deslocamento raramente expansão. Inserção remoção meio On System.arraycopy desloca elementos pior caso início On melhor fim O1. Busca On loop sequencial equals pior caso fim alternativa Set O1. Iteração On eficiente cache-friendly contíguo. EFICIENTE acesso aleatório adicionar remover fim iteração sequencial. INEFICIENTE inserção remoção meio início busca frequente usar LinkedList Set. SEMPRE adicionar fim EVITAR início meio frequente.

