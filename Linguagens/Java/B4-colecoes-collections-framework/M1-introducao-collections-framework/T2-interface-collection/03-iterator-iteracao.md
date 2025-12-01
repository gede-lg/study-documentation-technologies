# T2.03 - Iterator e Iteração

## Introdução

**Iterator**: interface para **percorrer** elementos de coleção de forma **segura** e **controlada**.

```java
import java.util.*;

/*
 * ITERATOR
 * 
 * Interface:
 * - Iterator<E>
 * 
 * Métodos principais:
 * - hasNext(): verifica se tem próximo
 * - next(): retorna próximo elemento
 * - remove(): remove elemento atual
 * 
 * Obter Iterator:
 * - collection.iterator()
 */

// ✅ Uso básico
public class ExemploBasico {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("Java");
        lista.add("Python");
        lista.add("C++");
        
        // ✅ Obter Iterator
        Iterator<String> iterator = lista.iterator();
        
        // ✅ Percorrer elementos
        while (iterator.hasNext()) {  // Enquanto tem próximo
            String elemento = iterator.next();  // Obter próximo
            System.out.println(elemento);
        }
        
        // Java
        // Python
        // C++
    }
}
```

**Regra**: Iterator **percorre** elementos. hasNext() verifica, next() obtém, remove() remove.

---

## Fundamentos

### 1. Interface Iterator

```java
// ✅ Interface Iterator
public class InterfaceIterator {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // ✅ Obter Iterator
        Iterator<String> iterator = lista.iterator();
        
        // ✅ hasNext(): verifica se tem próximo
        boolean temProximo1 = iterator.hasNext();  // true
        
        // ✅ next(): obtém próximo elemento
        String elemento1 = iterator.next();  // "A"
        
        // ✅ Após next(), hasNext() verifica próximo
        boolean temProximo2 = iterator.hasNext();  // true (B e C)
        
        String elemento2 = iterator.next();  // "B"
        String elemento3 = iterator.next();  // "C"
        
        // ✅ Após percorrer todos
        boolean temProximo3 = iterator.hasNext();  // false (fim)
        
        // ❌ next() sem hasNext(): NoSuchElementException
        try {
            iterator.next();  // Não tem mais elementos
        } catch (NoSuchElementException e) {
            System.out.println("Sem mais elementos!");
        }
    }
}

/*
 * INTERFACE ITERATOR:
 * 
 * package java.util;
 * 
 * public interface Iterator<E> {
 *     boolean hasNext();
 *     E next();
 *     void remove();  // Opcional (pode lançar UnsupportedOperationException)
 * }
 * 
 * MÉTODOS:
 * 
 * hasNext():
 * - Verifica se TEM próximo elemento
 * - Retorna boolean (true/false)
 * - NÃO avança cursor
 * - Pode chamar MÚLTIPLAS vezes (mesmo resultado)
 * 
 * next():
 * - Retorna PRÓXIMO elemento
 * - AVANÇA cursor para próximo
 * - Lança NoSuchElementException se não tem próximo
 * - SEMPRE verificar hasNext() antes
 * 
 * remove():
 * - Remove ÚLTIMO elemento retornado por next()
 * - Pode chamar APENAS após next()
 * - Lança IllegalStateException se next() não chamado
 * - Pode lançar UnsupportedOperationException se não suportado
 * 
 * PADRÃO DE USO:
 * while (iterator.hasNext()) {
 *     E elemento = iterator.next();
 *     // Processar elemento
 * }
 */
```

**Iterator**: hasNext() verifica, next() retorna e **avança**, remove() remove último.

### 2. Método hasNext()

```java
// ✅ hasNext(): verificar se tem próximo
public class MetodoHasNext {
    public static void main(String[] args) {
        Collection<Integer> lista = new ArrayList<>();
        lista.add(10);
        lista.add(20);
        lista.add(30);
        
        Iterator<Integer> iterator = lista.iterator();
        
        // ✅ hasNext(): não avança cursor
        boolean tem1 = iterator.hasNext();  // true
        boolean tem2 = iterator.hasNext();  // true (MESMO resultado)
        boolean tem3 = iterator.hasNext();  // true (MESMO resultado)
        
        // ✅ next(): avança cursor
        Integer elemento1 = iterator.next();  // 10
        
        // ✅ hasNext() após next()
        boolean tem4 = iterator.hasNext();  // true (20, 30)
        
        Integer elemento2 = iterator.next();  // 20
        Integer elemento3 = iterator.next();  // 30
        
        // ✅ Após percorrer todos
        boolean tem5 = iterator.hasNext();  // false (fim)
        boolean tem6 = iterator.hasNext();  // false (MESMO resultado)
        
        // ✅ Verificar SEMPRE antes de next()
        if (iterator.hasNext()) {
            iterator.next();
        } else {
            System.out.println("Sem mais elementos");
        }
    }
}

/*
 * hasNext():
 * 
 * ASSINATURA:
 * boolean hasNext()
 * 
 * RETORNO:
 * - true: se TEM próximo elemento
 * - false: se NÃO TEM próximo (fim)
 * 
 * COMPORTAMENTO:
 * - NÃO avança cursor
 * - Pode chamar MÚLTIPLAS vezes
 * - Sempre retorna MESMO resultado até next()
 * 
 * PERFORMANCE:
 * - ArrayList: O(1) (verifica índice < size)
 * - LinkedList: O(1) (verifica nó != null)
 * - HashSet: O(1) (verifica bucket != null)
 * 
 * USO:
 * - SEMPRE verificar antes de next()
 * - Evita NoSuchElementException
 * - Condição de parada em loop
 */
```

**hasNext()**: verifica se tem próximo. **Não** avança cursor. Sempre verificar antes next().

### 3. Método next()

```java
// ✅ next(): obter próximo elemento
public class MetodoNext {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        Iterator<String> iterator = lista.iterator();
        
        // ✅ next(): retorna E avança
        String elemento1 = iterator.next();  // "A" (cursor → B)
        String elemento2 = iterator.next();  // "B" (cursor → C)
        String elemento3 = iterator.next();  // "C" (cursor → fim)
        
        System.out.println(elemento1);  // A
        System.out.println(elemento2);  // B
        System.out.println(elemento3);  // C
        
        // ❌ next() sem hasNext(): exceção
        try {
            iterator.next();  // NoSuchElementException
        } catch (NoSuchElementException e) {
            System.out.println("Não tem mais elementos!");
        }
        
        // ✅ SEMPRE verificar hasNext() antes
        Iterator<String> iterator2 = lista.iterator();
        while (iterator2.hasNext()) {
            String elemento = iterator2.next();  // Seguro
            System.out.println(elemento);
        }
    }
}

/*
 * next():
 * 
 * ASSINATURA:
 * E next()
 * 
 * RETORNO:
 * - Próximo elemento da coleção
 * - Tipo E (genérico)
 * 
 * COMPORTAMENTO:
 * - Retorna próximo elemento
 * - AVANÇA cursor para próximo
 * - Cada chamada retorna elemento DIFERENTE
 * 
 * EXCEÇÃO:
 * - NoSuchElementException: se não tem próximo
 * - Ocorre quando hasNext() = false
 * 
 * PREVENIR EXCEÇÃO:
 * - SEMPRE verificar hasNext() antes
 * - Padrão while (hasNext()) { next(); }
 * 
 * PERFORMANCE:
 * - ArrayList: O(1) (acesso índice)
 * - LinkedList: O(1) (acesso nó)
 * - HashSet: O(1) amortizado (percorrer buckets)
 * 
 * ORDEM:
 * - ArrayList, LinkedList: ordem INSERÇÃO
 * - HashSet: ordem IMPREVISÍVEL
 * - TreeSet: ordem NATURAL (compareTo)
 */
```

**next()**: retorna próximo e **avança** cursor. Lança NoSuchElementException se fim. **Sempre** verificar hasNext() antes.

### 4. Método remove()

```java
// ✅ remove(): remover elemento atual
public class MetodoRemove {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        lista.add("D");
        
        Iterator<String> iterator = lista.iterator();
        
        // ✅ Remover elementos durante iteração
        while (iterator.hasNext()) {
            String elemento = iterator.next();
            
            if (elemento.equals("B")) {
                iterator.remove();  // Remove "B"
            }
        }
        
        System.out.println(lista);  // [A, C, D]
        
        // ❌ remove() ANTES de next(): IllegalStateException
        Iterator<String> iterator2 = lista.iterator();
        try {
            iterator2.remove();  // Não chamou next() ainda
        } catch (IllegalStateException e) {
            System.out.println("Deve chamar next() antes de remove()");
        }
        
        // ❌ remove() DUAS vezes seguidas: IllegalStateException
        Iterator<String> iterator3 = lista.iterator();
        iterator3.next();  // "A"
        iterator3.remove();  // Remove "A" (OK)
        
        try {
            iterator3.remove();  // Sem next() entre remoções
        } catch (IllegalStateException e) {
            System.out.println("Deve chamar next() antes de cada remove()");
        }
    }
}

/*
 * remove():
 * 
 * ASSINATURA:
 * void remove()
 * 
 * COMPORTAMENTO:
 * - Remove ÚLTIMO elemento retornado por next()
 * - Pode chamar APENAS após next()
 * - Não pode chamar DUAS vezes sem next() entre
 * 
 * EXCEÇÕES:
 * 
 * IllegalStateException:
 * - Chamar remove() antes de next()
 * - Chamar remove() duas vezes sem next()
 * 
 * UnsupportedOperationException:
 * - Coleção imutável (Arrays.asList())
 * - Iterator não suporta remoção
 * 
 * PADRÃO DE USO:
 * while (iterator.hasNext()) {
 *     E elemento = iterator.next();
 *     if (condicao) {
 *         iterator.remove();  // Remove elemento atual
 *     }
 * }
 * 
 * POR QUE USAR:
 * - SEGURO durante iteração
 * - Evita ConcurrentModificationException
 * - collection.remove(elemento) durante iteração → EXCEÇÃO
 * - iterator.remove() → OK
 * 
 * PERFORMANCE:
 * - ArrayList: O(n) (shift elementos)
 * - LinkedList: O(1) (remove nó)
 * - HashSet: O(1) (remove bucket)
 */
```

**remove()**: remove último retornado por next(). **Seguro** durante iteração. Deve chamar next() **antes**.

### 5. ConcurrentModificationException

```java
// ❌ ConcurrentModificationException: modificar durante iteração
public class ConcurrentModificationException {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // ❌ ERRADO: modificar coleção durante iteração
        try {
            for (String elemento : lista) {
                if (elemento.equals("B")) {
                    lista.remove("B");  // ConcurrentModificationException
                }
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("Não pode modificar durante forEach!");
        }
        
        // ❌ ERRADO: Iterator + collection.remove()
        lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        try {
            Iterator<String> iterator = lista.iterator();
            while (iterator.hasNext()) {
                String elemento = iterator.next();
                if (elemento.equals("B")) {
                    lista.remove("B");  // ConcurrentModificationException
                }
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("Use iterator.remove(), não collection.remove()");
        }
        
        // ✅ CORRETO: iterator.remove()
        lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        Iterator<String> iterator = lista.iterator();
        while (iterator.hasNext()) {
            String elemento = iterator.next();
            if (elemento.equals("B")) {
                iterator.remove();  // OK
            }
        }
        
        System.out.println(lista);  // [A, C]
    }
}

/*
 * CONCURRENTMODIFICATIONEXCEPTION:
 * 
 * QUANDO OCORRE:
 * - Modificar coleção durante iteração
 * - Usar collection.add(), collection.remove()
 * - Durante forEach, while (iterator.hasNext())
 * 
 * FAIL-FAST:
 * - ArrayList, HashSet: fail-fast
 * - Detectam modificação estrutural
 * - Lançam ConcurrentModificationException
 * - NÃO GARANTIDO (best-effort)
 * 
 * FAIL-SAFE:
 * - CopyOnWriteArrayList, ConcurrentHashMap
 * - NÃO lançam exceção
 * - Iterador percorre SNAPSHOT (cópia)
 * - Modificações NÃO visíveis no Iterator
 * 
 * COMO EVITAR:
 * 
 * ❌ ERRADO:
 * for (String s : lista) {
 *     lista.remove(s);  // Exceção
 * }
 * 
 * ✅ CORRETO:
 * Iterator<String> it = lista.iterator();
 * while (it.hasNext()) {
 *     it.next();
 *     it.remove();  // OK
 * }
 * 
 * ✅ ALTERNATIVA:
 * lista.removeIf(s -> s.equals("B"));  // Java 8+
 */
```

**ConcurrentModificationException**: lançada ao modificar coleção durante iteração. **Usar iterator.remove()**, não collection.remove().

### 6. forEach vs Iterator

```java
// ✅ forEach vs Iterator
public class ForEachVsIterator {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("Java");
        lista.add("Python");
        lista.add("C++");
        
        // ✅ forEach: SIMPLES (apenas leitura)
        for (String elemento : lista) {
            System.out.println(elemento);
        }
        
        // ✅ forEach com lambda (Java 8+)
        lista.forEach(elemento -> System.out.println(elemento));
        lista.forEach(System.out::println);  // Method reference
        
        // ✅ Iterator: CONTROLE (remoção durante iteração)
        Iterator<String> iterator = lista.iterator();
        while (iterator.hasNext()) {
            String elemento = iterator.next();
            System.out.println(elemento);
            
            if (elemento.equals("Python")) {
                iterator.remove();  // OK
            }
        }
        
        System.out.println(lista);  // [Java, C++]
    }
}

/*
 * FOREACH vs ITERATOR:
 * 
 * FOREACH (for-each loop):
 * for (E elemento : colecao) {
 *     // Processar
 * }
 * 
 * VANTAGENS:
 * - SIMPLES e LEGÍVEL
 * - Menos código
 * - Compilador gera Iterator automaticamente
 * 
 * LIMITAÇÕES:
 * - NÃO permite remoção (ConcurrentModificationException)
 * - NÃO acessa Iterator (sem remove())
 * - Apenas LEITURA
 * 
 * 
 * ITERATOR:
 * Iterator<E> it = colecao.iterator();
 * while (it.hasNext()) {
 *     E elemento = it.next();
 *     // Processar
 *     it.remove();  // OK
 * }
 * 
 * VANTAGENS:
 * - REMOÇÃO durante iteração (iterator.remove())
 * - CONTROLE total (hasNext, next, remove)
 * - Evita ConcurrentModificationException
 * 
 * LIMITAÇÕES:
 * - Mais código (verbose)
 * - Menos legível
 * 
 * 
 * QUANDO USAR:
 * 
 * forEach:
 * - Apenas LEITURA
 * - Não precisa remover
 * - Código SIMPLES
 * 
 * Iterator:
 * - Precisa REMOVER durante iteração
 * - Precisa CONTROLE (hasNext, next)
 * - Evitar ConcurrentModificationException
 * 
 * 
 * JAVA 8+ forEach com lambda:
 * colecao.forEach(elemento -> {
 *     // Processar
 * });
 * 
 * VANTAGENS:
 * - FUNCIONAL
 * - Conciso
 * - Expressivo
 * 
 * LIMITAÇÕES:
 * - NÃO permite remoção
 * - Apenas LEITURA
 */
```

**forEach**: **simples** (leitura). **Iterator**: **controle** (remoção durante iteração).

### 7. Performance

```java
// ✅ Performance Iterator
public class PerformanceIterator {
    public static void main(String[] args) {
        int tamanho = 1_000_000;
        
        // ✅ ArrayList: Iterator O(n)
        Collection<Integer> arrayList = new ArrayList<>();
        for (int i = 0; i < tamanho; i++) {
            arrayList.add(i);
        }
        
        long inicio1 = System.nanoTime();
        Iterator<Integer> it1 = arrayList.iterator();
        while (it1.hasNext()) {
            it1.next();
        }
        long fim1 = System.nanoTime();
        System.out.println("ArrayList Iterator: " + (fim1 - inicio1) / 1_000_000 + " ms");
        
        // ✅ LinkedList: Iterator O(n)
        Collection<Integer> linkedList = new LinkedList<>();
        for (int i = 0; i < tamanho; i++) {
            linkedList.add(i);
        }
        
        long inicio2 = System.nanoTime();
        Iterator<Integer> it2 = linkedList.iterator();
        while (it2.hasNext()) {
            it2.next();
        }
        long fim2 = System.nanoTime();
        System.out.println("LinkedList Iterator: " + (fim2 - inicio2) / 1_000_000 + " ms");
        
        // ✅ HashSet: Iterator O(n)
        Collection<Integer> hashSet = new HashSet<>();
        for (int i = 0; i < tamanho; i++) {
            hashSet.add(i);
        }
        
        long inicio3 = System.nanoTime();
        Iterator<Integer> it3 = hashSet.iterator();
        while (it3.hasNext()) {
            it3.next();
        }
        long fim3 = System.nanoTime();
        System.out.println("HashSet Iterator: " + (fim3 - inicio3) / 1_000_000 + " ms");
    }
}

/*
 * PERFORMANCE ITERATOR:
 * 
 * PERCORRER (hasNext + next):
 * ArrayList:   O(n) - acesso índice
 * LinkedList:  O(n) - acesso nó
 * HashSet:     O(n) - percorrer buckets
 * TreeSet:     O(n) - percorrer árvore
 * 
 * REMOVE:
 * ArrayList:   O(n) - shift elementos
 * LinkedList:  O(1) - remove nó
 * HashSet:     O(1) - remove bucket
 * TreeSet:     O(log n) - rebalancear
 * 
 * COMPARAÇÃO:
 * - Percorrer: TODAS O(n)
 * - Remove: LinkedList e HashSet RÁPIDOS
 * - ArrayList remove LENTO (shift)
 * 
 * RECOMENDAÇÃO:
 * - ArrayList: acesso ÍNDICE
 * - LinkedList: REMOÇÃO frequente Iterator
 * - HashSet: buscas RÁPIDAS
 */
```

**Performance**: percorrer O(n) em todas. Remove: LinkedList/HashSet O(1), ArrayList O(n).

### 8. Exemplos Práticos

```java
// ✅ Exemplos práticos Iterator
public class ExemplosPraticos {
    
    // ✅ Exemplo 1: Remover elementos pares
    public static void removerPares(Collection<Integer> numeros) {
        Iterator<Integer> iterator = numeros.iterator();
        
        while (iterator.hasNext()) {
            Integer numero = iterator.next();
            
            if (numero % 2 == 0) {
                iterator.remove();  // Remove pares
            }
        }
    }
    
    // ✅ Exemplo 2: Buscar primeiro elemento que satisfaz condição
    public static <E> E buscarPrimeiro(Collection<E> colecao, Predicate<E> condicao) {
        Iterator<E> iterator = colecao.iterator();
        
        while (iterator.hasNext()) {
            E elemento = iterator.next();
            
            if (condicao.test(elemento)) {
                return elemento;  // Retorna primeiro
            }
        }
        
        return null;  // Não encontrou
    }
    
    // ✅ Exemplo 3: Processar e remover
    public static void processarERemover(Collection<String> tarefas) {
        Iterator<String> iterator = tarefas.iterator();
        
        while (iterator.hasNext()) {
            String tarefa = iterator.next();
            
            System.out.println("Processando: " + tarefa);
            // Processar tarefa...
            
            iterator.remove();  // Remove após processar
        }
    }
    
    // ✅ Exemplo 4: Copiar elementos
    public static <E> Collection<E> copiar(Collection<E> original) {
        Collection<E> copia = new ArrayList<>();
        
        Iterator<E> iterator = original.iterator();
        while (iterator.hasNext()) {
            copia.add(iterator.next());
        }
        
        return copia;
    }
    
    public static void main(String[] args) {
        // Exemplo 1
        Collection<Integer> numeros = new ArrayList<>();
        numeros.add(1);
        numeros.add(2);
        numeros.add(3);
        numeros.add(4);
        numeros.add(5);
        
        removerPares(numeros);
        System.out.println("Sem pares: " + numeros);  // [1, 3, 5]
        
        // Exemplo 2
        Collection<String> nomes = new ArrayList<>();
        nomes.add("Ana");
        nomes.add("Bruno");
        nomes.add("Carlos");
        
        String primeiro = buscarPrimeiro(nomes, nome -> nome.startsWith("B"));
        System.out.println("Primeiro com B: " + primeiro);  // Bruno
        
        // Exemplo 3
        Collection<String> tarefas = new ArrayList<>();
        tarefas.add("Tarefa 1");
        tarefas.add("Tarefa 2");
        tarefas.add("Tarefa 3");
        
        processarERemover(tarefas);
        System.out.println("Tarefas restantes: " + tarefas);  // []
        
        // Exemplo 4
        Collection<Integer> original = new ArrayList<>();
        original.add(10);
        original.add(20);
        
        Collection<Integer> copia = copiar(original);
        System.out.println("Cópia: " + copia);  // [10, 20]
    }
}
```

**Exemplos**: remover pares, buscar primeiro, processar e remover, copiar elementos.

### 9. Resumo Visual

```java
/*
 * ITERATOR
 * 
 * INTERFACE:
 * public interface Iterator<E> {
 *     boolean hasNext();
 *     E next();
 *     void remove();  // Opcional
 * }
 * 
 * 
 * hasNext():
 * 
 * ASSINATURA:
 * boolean hasNext()
 * 
 * RETORNO:
 * - true: TEM próximo
 * - false: NÃO TEM próximo (fim)
 * 
 * COMPORTAMENTO:
 * - NÃO avança cursor
 * - Pode chamar MÚLTIPLAS vezes
 * - Retorna MESMO resultado até next()
 * 
 * 
 * next():
 * 
 * ASSINATURA:
 * E next()
 * 
 * RETORNO:
 * - Próximo elemento (tipo E)
 * 
 * COMPORTAMENTO:
 * - Retorna próximo elemento
 * - AVANÇA cursor
 * - Cada chamada elemento DIFERENTE
 * 
 * EXCEÇÃO:
 * - NoSuchElementException: se não tem próximo
 * 
 * PREVENIR:
 * - SEMPRE verificar hasNext() antes
 * 
 * 
 * remove():
 * 
 * ASSINATURA:
 * void remove()
 * 
 * COMPORTAMENTO:
 * - Remove ÚLTIMO elemento retornado por next()
 * - Deve chamar next() ANTES
 * - Não pode chamar DUAS vezes sem next()
 * 
 * EXCEÇÕES:
 * - IllegalStateException: se next() não chamado
 * - UnsupportedOperationException: se não suportado
 * 
 * 
 * PADRÃO DE USO:
 * 
 * Iterator<E> iterator = colecao.iterator();
 * while (iterator.hasNext()) {
 *     E elemento = iterator.next();
 *     // Processar elemento
 *     
 *     if (condicao) {
 *         iterator.remove();  // Remover se necessário
 *     }
 * }
 * 
 * 
 * PERFORMANCE:
 * 
 * Operação  | ArrayList | LinkedList | HashSet
 * ----------|-----------|------------|----------
 * hasNext() | O(1)      | O(1)       | O(1)
 * next()    | O(1)      | O(1)       | O(1)
 * remove()  | O(n)      | O(1)       | O(1)
 * Percorrer | O(n)      | O(n)       | O(n)
 * 
 * 
 * CONCURRENTMODIFICATIONEXCEPTION:
 * 
 * QUANDO:
 * - Modificar coleção durante iteração
 * - Usar collection.add(), collection.remove()
 * 
 * COMO EVITAR:
 * ❌ collection.remove(elemento)  // Exceção
 * ✅ iterator.remove()             // OK
 * 
 * FAIL-FAST:
 * - ArrayList, HashSet: fail-fast
 * - Lançam exceção RAPIDAMENTE
 * 
 * FAIL-SAFE:
 * - CopyOnWriteArrayList: fail-safe
 * - NÃO lançam exceção
 * - Percorrem SNAPSHOT
 * 
 * 
 * FOREACH vs ITERATOR:
 * 
 * forEach:
 * - SIMPLES e LEGÍVEL
 * - Apenas LEITURA
 * - NÃO permite remoção
 * 
 * Iterator:
 * - CONTROLE total
 * - Permite REMOÇÃO
 * - Evita ConcurrentModificationException
 * 
 * QUANDO forEach:
 * - Apenas LEITURA
 * - Código SIMPLES
 * 
 * QUANDO Iterator:
 * - Precisa REMOVER
 * - Precisa CONTROLE
 */

public class ExemploIterator {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // ✅ Obter Iterator
        Iterator<String> iterator = lista.iterator();
        
        // ✅ Percorrer elementos
        while (iterator.hasNext()) {       // Verifica se tem próximo
            String elemento = iterator.next();  // Obtém próximo
            System.out.println(elemento);
            
            if (elemento.equals("B")) {
                iterator.remove();  // Remove "B"
            }
        }
        
        System.out.println(lista);  // [A, C]
        
        // ✅ forEach (apenas leitura)
        for (String elemento : lista) {
            System.out.println(elemento);
        }
        
        // ✅ forEach lambda (Java 8+)
        lista.forEach(System.out::println);
    }
}
```

---

## Aplicabilidade

**Iterator**:
- **Percorrer** elementos de coleção
- **Remover** elementos durante iteração
- Evitar **ConcurrentModificationException**
- **Controle** total sobre iteração

**hasNext()**:
- **Verificar** se tem próximo elemento
- Condição de **parada** em loop
- **Prevenir** NoSuchElementException

**next()**:
- **Obter** próximo elemento
- **Avançar** cursor
- **Processar** elementos um por um

**remove()**:
- **Remover** elementos durante iteração
- **Seguro** (não lança ConcurrentModificationException)
- **Filtrar** coleção (remover elementos indesejados)

**forEach vs Iterator**:
- forEach: **leitura** simples
- Iterator: **remoção** durante iteração

---

## Armadilhas

### 1. next() Sem hasNext()

```java
// ❌ NoSuchElementException
Iterator<String> it = lista.iterator();
it.next();
it.next();
it.next();  // Se só tem 2 elementos → exceção

// ✅ Sempre verificar hasNext()
while (it.hasNext()) {
    it.next();
}
```

### 2. remove() Antes de next()

```java
// ❌ IllegalStateException
Iterator<String> it = lista.iterator();
it.remove();  // Não chamou next() ainda

// ✅ Chamar next() antes
it.next();
it.remove();  // OK
```

### 3. ConcurrentModificationException

```java
// ❌ Modificar coleção durante iteração
for (String s : lista) {
    lista.remove(s);  // Exceção
}

// ✅ Usar iterator.remove()
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    it.next();
    it.remove();  // OK
}
```

---

## Boas Práticas

### 1. Sempre Verificar hasNext()

```java
// ✅ Verificar antes de next()
while (iterator.hasNext()) {
    iterator.next();
}
```

### 2. Usar forEach Para Leitura

```java
// ✅ forEach para leitura simples
for (String elemento : lista) {
    System.out.println(elemento);
}
```

### 3. Usar Iterator Para Remoção

```java
// ✅ Iterator para remover durante iteração
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    String elemento = it.next();
    if (condicao) {
        it.remove();
    }
}
```

---

## Resumo

**Iterator**:
- Interface para **percorrer** coleções
- Métodos: hasNext(), next(), remove()
- **Controle** total sobre iteração
- **Seguro** para remoção durante iteração

**hasNext()**:
- Verifica se tem **próximo** elemento
- Retorna **boolean** (true/false)
- **Não** avança cursor
- Performance: **O(1)** em todas implementações

**next()**:
- Retorna **próximo** elemento
- **Avança** cursor
- Lança **NoSuchElementException** se fim
- **Sempre** verificar hasNext() antes

**remove()**:
- Remove **último** retornado por next()
- Deve chamar next() **antes**
- **Seguro** durante iteração (não ConcurrentModificationException)
- Performance: ArrayList O(n), LinkedList/HashSet O(1)

**ConcurrentModificationException**:
- Lançada ao modificar coleção durante iteração
- **Fail-fast**: ArrayList, HashSet detectam modificação
- **Fail-safe**: CopyOnWriteArrayList não lança exceção
- **Evitar**: usar iterator.remove(), não collection.remove()

**forEach vs Iterator**:
- forEach: **simples**, apenas **leitura**
- Iterator: **controle**, permite **remoção**
- forEach: não pode remover (ConcurrentModificationException)
- Iterator: remove() OK (seguro)

**Performance percorrer**:
- ArrayList: O(n) - acesso índice
- LinkedList: O(n) - acesso nó
- HashSet: O(n) - percorrer buckets
- TreeSet: O(n) - percorrer árvore

**Performance remove()**:
- ArrayList: O(n) - shift elementos (lento)
- LinkedList: O(1) - remove nó (rápido)
- HashSet: O(1) - remove bucket (rápido)
- TreeSet: O(log n) - rebalancear

**Padrão uso**:
```java
Iterator<E> it = colecao.iterator();
while (it.hasNext()) {
    E elemento = it.next();
    if (condicao) {
        it.remove();
    }
}
```

**Exceções**:
- NoSuchElementException: next() sem próximo
- IllegalStateException: remove() sem next()
- UnsupportedOperationException: remove() não suportado
- ConcurrentModificationException: modificar durante iteração

**Quando usar forEach**:
- Apenas **leitura**
- Código **simples** e **legível**
- Não precisa **remover**

**Quando usar Iterator**:
- Precisa **remover** durante iteração
- Precisa **controle** (hasNext, next)
- Evitar **ConcurrentModificationException**

**Regra de Ouro**: Iterator percorre coleções controle total. hasNext() verifica próximo O(1) não avança sempre verificar antes next(). next() retorna avança cursor NoSuchElementException fim sempre hasNext() antes. remove() remove último next() seguro durante iteração não ConcurrentModificationException. forEach simples leitura não remover. Iterator controle remoção. Fail-fast ArrayList HashSet exceção modificação. Fail-safe CopyOnWriteArrayList não exceção snapshot. Performance percorrer O(n) todas remove ArrayList O(n) lento LinkedList HashSet O(1) rápido. Preferir forEach leitura Iterator remoção.

