# T7.02 - Collections.reverse(): Inversão de Listas

## Introdução

**Collections.reverse()**: inverte ordem elementos List in-place O(n) swap pontas para centro rápido eficiente.

```java
import java.util.*;

// COLLECTIONS.REVERSE: Inversão
public class CollectionsReverseIntro {
    public static void main(String[] args) {
        // INVERSÃO:
        
        List<Integer> numeros = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        
        System.out.println("Antes: " + numeros);
        
        Collections.reverse(numeros);  // In-place
        
        System.out.println("Depois: " + numeros);
        // [5, 4, 3, 2, 1]
        
        
        // STRINGS:
        
        List<String> nomes = new ArrayList<>(Arrays.asList("Ana", "Bruno", "Carlos"));
        
        System.out.println("\nAntes: " + nomes);
        
        Collections.reverse(nomes);
        
        System.out.println("Depois: " + nomes);
        // [Carlos, Bruno, Ana]
        
        
        // COMPLEXIDADE:
        
        // Tempo: O(n)
        // Espaço: O(1) - in-place
        // Swap: n/2 trocas
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Collections.reverse(list): inverte");
        System.out.println("In-place: modifica original");
        System.out.println("Complexidade: O(n)");
    }
}
```

**reverse()**: inverte List in-place O(n) swap n/2 trocas modifica original.

---

## Fundamentos

### 1. Funcionamento reverse()

```java
// FUNCIONAMENTO: reverse
public class ReverseFunc{
    public static void main(String[] args) {
        // IMPLEMENTAÇÃO SIMPLIFICADA:
        
        /*
         * public static void reverse(List<?> list) {
         *     int size = list.size();
         *     
         *     if (size < 2) return;  // Vazio ou 1 elemento
         *     
         *     ListIterator fwd = list.listIterator();
         *     ListIterator rev = list.listIterator(size);
         *     
         *     for (int i = 0; i < size/2; i++) {
         *         Object tmp = fwd.next();
         *         fwd.set(rev.previous());
         *         rev.set(tmp);
         *     }
         * }
         */
        
        
        // PROCESSO:
        
        List<Integer> nums = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        
        // Inicial: [1, 2, 3, 4, 5]
        //           ↑           ↑
        //          fwd         rev
        
        // Iteração 1: swap(0, 4)
        // [5, 2, 3, 4, 1]
        //     ↑        ↑
        //    fwd      rev
        
        // Iteração 2: swap(1, 3)
        // [5, 4, 3, 2, 1]
        //        ↑  ↑
        //       fwd rev
        
        // Iteração 3: FIM (i >= size/2)
        // Total: 2 swaps (size/2 arredondado)
        
        
        System.out.println("Antes: " + nums);
        Collections.reverse(nums);
        System.out.println("Depois: " + nums);
        
        
        // ELEMENTO CENTRAL:
        
        List<Integer> impar = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        // 5 elementos: swaps 0↔4, 1↔3
        // Elemento 2 (centro) não move
        
        Collections.reverse(impar);
        System.out.println("\nÍmpar: " + impar);
        // [5, 4, 3, 2, 1] - centro (3) permanece
        
        
        List<Integer> par = new ArrayList<>(Arrays.asList(1, 2, 3, 4));
        // 4 elementos: swaps 0↔3, 1↔2
        // Sem elemento central
        
        Collections.reverse(par);
        System.out.println("Par: " + par);
        // [4, 3, 2, 1]
        
        
        // CASOS ESPECIAIS:
        
        // Vazia:
        List<Integer> vazia = new ArrayList<>();
        Collections.reverse(vazia);
        System.out.println("\nVazia: " + vazia);  // []
        
        // 1 elemento:
        List<Integer> um = new ArrayList<>(Arrays.asList(42));
        Collections.reverse(um);
        System.out.println("Um: " + um);  // [42]
        
        // 2 elementos:
        List<Integer> dois = new ArrayList<>(Arrays.asList(1, 2));
        Collections.reverse(dois);
        System.out.println("Dois: " + dois);  // [2, 1]
        
        
        // PERFORMANCE:
        
        int n = 100_000;
        List<Integer> big = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            big.add(i);
        }
        
        long t1 = System.nanoTime();
        Collections.reverse(big);
        long t2 = System.nanoTime();
        
        System.out.println("\n=== Performance ===");
        System.out.println("100K elementos: " + (t2-t1)/1_000_000 + "ms");
        // ~5ms - RÁPIDO O(n)
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Swaps: n/2");
        System.out.println("Centro: não move (ímpar)");
        System.out.println("In-place: modifica original");
        System.out.println("O(n) tempo, O(1) espaço");
    }
}

/*
 * REVERSE FUNCIONAMENTO:
 * 
 * ALGORITMO:
 * 1. Dois iteradores: início e fim
 * 2. Loop n/2 vezes
 * 3. Swap elementos
 * 4. Avançar início, retroceder fim
 * 
 * COMPLEXIDADE:
 * - Tempo: O(n)
 * - Espaço: O(1)
 * - Swaps: n/2
 * 
 * CASOS:
 * - Vazia/1: return imediato
 * - Ímpar: centro não move
 * - Par: todos movem
 * 
 * IN-PLACE:
 * - Modifica lista original
 * - Não cria nova lista
 */
```

**Funcionamento**: dois iteradores fwd início rev fim loop n/2 swap avançar retroceder. Ímpar centro não move par todos. In-place modifica original O(n) tempo O(1) espaço.

### 2. ArrayList vs LinkedList

```java
// ARRAYLIST vs LINKEDLIST: reverse
public class ReverseArrayVsLinked {
    public static void main(String[] args) {
        // ARRAYLIST:
        
        List<Integer> array = new ArrayList<>();
        for (int i = 0; i < 100_000; i++) {
            array.add(i);
        }
        
        long t1 = System.nanoTime();
        Collections.reverse(array);
        long t2 = System.nanoTime();
        
        System.out.println("=== ArrayList ===");
        System.out.println("100K: " + (t2-t1)/1_000_000 + "ms");
        // ~5ms - RÁPIDO
        
        // ArrayList:
        // - get(i): O(1)
        // - set(i, val): O(1)
        // - Total: O(n)
        // - Cache-friendly (contíguo)
        
        
        // LINKEDLIST:
        
        List<Integer> linked = new LinkedList<>();
        for (int i = 0; i < 100_000; i++) {
            linked.add(i);
        }
        
        long t3 = System.nanoTime();
        Collections.reverse(linked);
        long t4 = System.nanoTime();
        
        System.out.println("\n=== LinkedList ===");
        System.out.println("100K: " + (t4-t3)/1_000_000 + "ms");
        // ~10ms - LENTO (2x)
        
        // LinkedList:
        // - ListIterator eficiente
        // - Troca referências (não valores)
        // - Cache-unfriendly (espalhado)
        
        
        // COMPARAÇÃO TAMANHOS:
        
        System.out.println("\n=== Comparação ===");
        for (int size : new int[]{1000, 10_000, 100_000}) {
            List<Integer> a = new ArrayList<>();
            List<Integer> l = new LinkedList<>();
            for (int i = 0; i < size; i++) {
                a.add(i);
                l.add(i);
            }
            
            long ta1 = System.nanoTime();
            Collections.reverse(a);
            long ta2 = System.nanoTime();
            
            long tl1 = System.nanoTime();
            Collections.reverse(l);
            long tl2 = System.nanoTime();
            
            System.out.printf("Size %6d: ArrayList %3dms, LinkedList %3dms\n",
                size, (ta2-ta1)/1_000_000, (tl2-tl1)/1_000_000);
        }
        
        // RESULTADO:
        // Size   1000: ArrayList   0ms, LinkedList   0ms
        // Size  10000: ArrayList   0ms, LinkedList   1ms
        // Size 100000: ArrayList   5ms, LinkedList  10ms
        
        // ArrayList ~2x mais rápida (cache)
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("ArrayList: mais rápida (cache)");
        System.out.println("LinkedList: mais lenta (2x)");
        System.out.println("Ambos: O(n)");
    }
}

/*
 * ARRAYLIST vs LINKEDLIST:
 * 
 * ARRAYLIST:
 * - get/set: O(1)
 * - Cache-friendly
 * - ~5ms (100K)
 * - MAIS RÁPIDA
 * 
 * LINKEDLIST:
 * - ListIterator eficiente
 * - Cache-unfriendly
 * - ~10ms (100K)
 * - 2x mais lenta
 * 
 * AMBOS:
 * - Complexidade: O(n)
 * - In-place
 */
```

**ArrayList vs LinkedList**: ArrayList get set O(1) cache-friendly 5ms rápida. LinkedList ListIterator cache-unfriendly 10ms 2x lenta. Ambos O(n) in-place ArrayList melhor cache.

### 3. Alternativas reverse()

```java
// ALTERNATIVAS: reverse
public class AlternativasReverse {
    public static void main(String[] args) {
        // 1. COLLECTIONS.REVERSE (padrão):
        
        List<Integer> lista1 = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        Collections.reverse(lista1);
        System.out.println("Collections.reverse: " + lista1);
        // [5, 4, 3, 2, 1]
        
        
        // 2. MANUAL (loop):
        
        List<Integer> lista2 = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        
        for (int i = 0; i < lista2.size() / 2; i++) {
            int j = lista2.size() - 1 - i;
            Integer temp = lista2.get(i);
            lista2.set(i, lista2.get(j));
            lista2.set(j, temp);
        }
        
        System.out.println("Manual: " + lista2);
        // [5, 4, 3, 2, 1]
        
        
        // 3. STREAM (cria nova):
        
        List<Integer> lista3 = Arrays.asList(1, 2, 3, 4, 5);
        
        List<Integer> reverso = new ArrayList<>(lista3);
        Collections.reverse(reverso);
        
        System.out.println("Stream (via Collections): " + reverso);
        // [5, 4, 3, 2, 1]
        
        
        // 4. LINKEDLIST (addFirst):
        
        List<Integer> original = Arrays.asList(1, 2, 3, 4, 5);
        LinkedList<Integer> reverso2 = new LinkedList<>();
        
        for (Integer num : original) {
            reverso2.addFirst(num);  // Adiciona no início
        }
        
        System.out.println("LinkedList addFirst: " + reverso2);
        // [5, 4, 3, 2, 1]
        
        
        // 5. STACK (push/pop):
        
        List<Integer> original2 = Arrays.asList(1, 2, 3, 4, 5);
        Stack<Integer> stack = new Stack<>();
        
        for (Integer num : original2) {
            stack.push(num);
        }
        
        List<Integer> reverso3 = new ArrayList<>();
        while (!stack.isEmpty()) {
            reverso3.add(stack.pop());
        }
        
        System.out.println("Stack: " + reverso3);
        // [5, 4, 3, 2, 1]
        
        
        // PERFORMANCE COMPARAÇÃO:
        
        int n = 100_000;
        List<Integer> big = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            big.add(i);
        }
        
        System.out.println("\n=== Performance (100K) ===");
        
        // Collections.reverse:
        List<Integer> c1 = new ArrayList<>(big);
        long t1 = System.nanoTime();
        Collections.reverse(c1);
        long t2 = System.nanoTime();
        System.out.println("Collections.reverse: " + (t2-t1)/1_000_000 + "ms");
        
        // Manual:
        List<Integer> c2 = new ArrayList<>(big);
        long t3 = System.nanoTime();
        for (int i = 0; i < c2.size() / 2; i++) {
            int j = c2.size() - 1 - i;
            Integer temp = c2.get(i);
            c2.set(i, c2.get(j));
            c2.set(j, temp);
        }
        long t4 = System.nanoTime();
        System.out.println("Manual: " + (t4-t3)/1_000_000 + "ms");
        
        // LinkedList addFirst:
        long t5 = System.nanoTime();
        LinkedList<Integer> c3 = new LinkedList<>();
        for (Integer num : big) {
            c3.addFirst(num);
        }
        long t6 = System.nanoTime();
        System.out.println("LinkedList addFirst: " + (t6-t5)/1_000_000 + "ms");
        
        
        // RESULTADO:
        // Collections.reverse: ~5ms
        // Manual: ~5ms (similar)
        // LinkedList addFirst: ~30ms (6x mais lento)
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Collections.reverse: MELHOR (rápido, claro)");
        System.out.println("Manual: similar (verboso)");
        System.out.println("LinkedList addFirst: LENTO (6x)");
    }
}

/*
 * ALTERNATIVAS REVERSE:
 * 
 * 1. COLLECTIONS.REVERSE:
 *    ✅ Rápido: ~5ms
 *    ✅ Claro: 1 linha
 *    ✅ In-place
 *    ✅ RECOMENDADO
 * 
 * 2. MANUAL LOOP:
 *    ✅ Rápido: ~5ms
 *    ❌ Verboso: múltiplas linhas
 *    ✅ In-place
 * 
 * 3. LINKEDLIST ADDFIRST:
 *    ❌ Lento: ~30ms (6x)
 *    ❌ Cria nova lista
 *    ❌ Overhead Node
 * 
 * PREFERÊNCIA:
 * Collections.reverse (padrão)
 */
```

**Alternativas**: Collections.reverse padrão 5ms 1 linha in-place MELHOR. Manual loop 5ms similar verboso. LinkedList addFirst 30ms 6x lento cria nova overhead. Collections.reverse recomendado.

### 4. Casos de Uso

```java
// CASOS DE USO: reverse
public class CasosUsoReverse {
    public static void main(String[] args) {
        // CASO 1: Ordenação decrescente
        
        List<Integer> nums = new ArrayList<>(Arrays.asList(5, 2, 8, 1, 9));
        
        Collections.sort(nums);      // Crescente
        Collections.reverse(nums);   // Inverte para decrescente
        
        System.out.println("=== Caso 1: Decrescente ===");
        System.out.println(nums);
        // [9, 8, 5, 2, 1]
        
        // Alternativa (mais eficiente):
        Collections.sort(nums, Collections.reverseOrder());
        
        
        // CASO 2: Inverter string
        
        String texto = "Java";
        List<Character> chars = new ArrayList<>();
        for (char c : texto.toCharArray()) {
            chars.add(c);
        }
        
        Collections.reverse(chars);
        
        StringBuilder sb = new StringBuilder();
        for (char c : chars) {
            sb.append(c);
        }
        
        System.out.println("\n=== Caso 2: String ===");
        System.out.println("Original: " + texto);
        System.out.println("Reverso: " + sb.toString());
        // avaJ
        
        // Alternativa (mais simples):
        String reverso = new StringBuilder(texto).reverse().toString();
        
        
        // CASO 3: Desfazer operações (stack)
        
        List<String> operacoes = new ArrayList<>(Arrays.asList("Op1", "Op2", "Op3"));
        
        Collections.reverse(operacoes);  // Ordem reversa
        
        System.out.println("\n=== Caso 3: Desfazer ===");
        for (String op : operacoes) {
            System.out.println("Desfazer: " + op);
        }
        // Desfazer: Op3
        // Desfazer: Op2
        // Desfazer: Op1
        
        
        // CASO 4: Espelhar dados
        
        List<Integer> metade = new ArrayList<>(Arrays.asList(1, 2, 3));
        List<Integer> completo = new ArrayList<>(metade);
        
        Collections.reverse(metade);
        completo.addAll(metade);
        
        System.out.println("\n=== Caso 4: Espelhar ===");
        System.out.println(completo);
        // [1, 2, 3, 3, 2, 1]
        
        
        // CASO 5: Processar ordem inversa
        
        List<String> tarefas = new ArrayList<>(Arrays.asList("Tarefa1", "Tarefa2", "Tarefa3"));
        
        Collections.reverse(tarefas);
        
        System.out.println("\n=== Caso 5: Ordem Inversa ===");
        for (String tarefa : tarefas) {
            System.out.println("Executando: " + tarefa);
        }
        // Executando: Tarefa3
        // Executando: Tarefa2
        // Executando: Tarefa1
        
        
        // CASO 6: Palíndromo (verificar)
        
        List<Character> palavra = new ArrayList<>();
        for (char c : "arara".toCharArray()) {
            palavra.add(c);
        }
        
        List<Character> reversa = new ArrayList<>(palavra);
        Collections.reverse(reversa);
        
        boolean palindromo = palavra.equals(reversa);
        
        System.out.println("\n=== Caso 6: Palíndromo ===");
        System.out.println("É palíndromo? " + palindromo);
        // true
        
        
        System.out.println("\n=== Resumo Casos ===");
        System.out.println("Decrescente: sort + reverse");
        System.out.println("String: chars + reverse");
        System.out.println("Desfazer: ordem reversa");
        System.out.println("Espelhar: original + reverso");
        System.out.println("Palíndromo: equals reverso");
    }
}

/*
 * CASOS DE USO:
 * 
 * 1. ORDENAÇÃO DECRESCENTE:
 *    sort() + reverse()
 *    Ou: reverseOrder()
 * 
 * 2. INVERTER STRING:
 *    toCharArray + reverse
 *    Ou: StringBuilder.reverse()
 * 
 * 3. DESFAZER OPERAÇÕES:
 *    Processar ordem reversa
 *    LIFO: última primeiro
 * 
 * 4. ESPELHAR DADOS:
 *    original + reverso
 *    Simétrico
 * 
 * 5. PALÍNDROMO:
 *    equals(reverso)
 *    Verificação
 */
```

**Casos uso**: decrescente sort reverse. String toCharArray reverse StringBuilder melhor. Desfazer ordem reversa LIFO. Espelhar original reverso simétrico. Palíndromo equals reverso verificação.

### 5. Resumo Collections.reverse

```java
/*
 * COLLECTIONS.REVERSE: Resumo Completo
 * 
 * ASSINATURA:
 * public static void reverse(List<?> list)
 * 
 * 
 * FUNCIONAMENTO:
 * - Dois iteradores: início e fim
 * - Swap n/2 elementos
 * - In-place: modifica original
 * 
 * 
 * COMPLEXIDADE:
 * - Tempo: O(n)
 * - Espaço: O(1)
 * - Swaps: n/2
 * 
 * 
 * PERFORMANCE:
 * - ArrayList: ~5ms (100K)
 * - LinkedList: ~10ms (100K) - 2x lenta
 * - Cache: ArrayList melhor
 * 
 * 
 * ALTERNATIVAS:
 * 1. Collections.reverse: MELHOR
 * 2. Manual loop: similar
 * 3. LinkedList addFirst: 6x lento
 * 4. StringBuilder.reverse: strings
 * 
 * 
 * CASOS DE USO:
 * - Ordenação decrescente
 * - Inverter string
 * - Desfazer operações
 * - Espelhar dados
 * - Palíndromo
 * 
 * 
 * EXEMPLOS:
 * 
 * // Básico:
 * List<Integer> nums = Arrays.asList(1,2,3);
 * Collections.reverse(nums);
 * // [3, 2, 1]
 * 
 * // Decrescente:
 * Collections.sort(nums);
 * Collections.reverse(nums);
 * 
 * // String:
 * List<Character> chars = ...;
 * Collections.reverse(chars);
 */

// DECISÃO RÁPIDA
public class DecisaoReverse {
    public static void main(String[] args) {
        // ✅ Inverter lista
        List<Integer> nums = new ArrayList<>(Arrays.asList(1,2,3));
        Collections.reverse(nums);
        
        // ✅ Decrescente (método 1)
        Collections.sort(nums);
        Collections.reverse(nums);
        
        // ✅ Decrescente (método 2 - melhor)
        Collections.sort(nums, Collections.reverseOrder());
        
        // ✅ String
        String texto = "Java";
        String reverso = new StringBuilder(texto).reverse().toString();
        
        System.out.println("Operações aplicadas!");
    }
}
```

---

## Aplicabilidade

**Collections.reverse usar**:
- **Inversão**: in-place modifica original O(n) swap n/2 eficiente
- **ArrayList**: get set O(1) cache-friendly 5ms melhor performance
- **Casos**: decrescente sort reverse string chars desfazer ordem reversa espelhar palíndromo
- **Alternativa**: StringBuilder.reverse strings mais simples eficiente

---

## Armadilhas

### 1. Imutável

```java
// ❌ Lista imutável
List<Integer> imutavel = Arrays.asList(1,2,3);
Collections.reverse(imutavel);  // UnsupportedOperationException

// ✅ Mutável
List<Integer> mutavel = new ArrayList<>(Arrays.asList(1,2,3));
Collections.reverse(mutavel);  // OK
```

### 2. String Direta

```java
// ❌ Verboso
List<Character> chars = new ArrayList<>();
for (char c : "Java".toCharArray()) chars.add(c);
Collections.reverse(chars);

// ✅ StringBuilder
String reverso = new StringBuilder("Java").reverse().toString();
```

---

## Boas Práticas

### 1. Collections.reverse Padrão

```java
// ✅ Simples claro
Collections.reverse(lista);
```

### 2. StringBuilder para Strings

```java
// ✅ Strings
String reverso = new StringBuilder(texto).reverse().toString();
```

### 3. reverseOrder para Decrescente

```java
// ✅ Mais eficiente
Collections.sort(lista, Collections.reverseOrder());

// ⚠️ Funciona mas menos eficiente
Collections.sort(lista);
Collections.reverse(lista);
```

---

## Resumo

**Collections.reverse**: inverte ordem elementos List in-place modifica original O(n) tempo O(1) espaço. Funcionamento dois iteradores fwd início rev fim loop n/2 swap avançar retroceder. Ímpar centro não move par todos movem.

**Performance**: ArrayList get set O(1) cache-friendly 5ms 100K rápida MELHOR. LinkedList ListIterator cache-unfriendly 10ms 2x lenta. Ambos O(n) complexidade ArrayList vence cache localidade.

**Alternativas**: Collections.reverse padrão 5ms 1 linha in-place RECOMENDADO. Manual loop 5ms similar verboso. LinkedList addFirst 30ms 6x lento cria nova overhead ruim. StringBuilder.reverse strings mais simples eficiente.

**Casos uso**: decrescente sort reverse ou reverseOrder melhor. String toCharArray reverse ou StringBuilder.reverse preferir. Desfazer ordem reversa LIFO última primeiro. Espelhar original reverso simétrico. Palíndromo equals reverso verificação.

**Decisão**: inverter lista Collections.reverse in-place rápido. Decrescente reverseOrder direto eficiente. String StringBuilder.reverse simples. ArrayList preferir LinkedList cache performance. In-place modifica original cuidado imutável UnsupportedOperationException.

