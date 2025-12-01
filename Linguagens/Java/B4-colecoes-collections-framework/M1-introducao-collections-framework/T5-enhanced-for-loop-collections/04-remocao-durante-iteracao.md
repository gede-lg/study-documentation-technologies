# T5.04 - Remoção Durante Iteração

## Introdução

**Remoção durante iteração**: **ConcurrentModificationException** com for-each. Usar **Iterator.remove()** ou **removeIf()**.

```java
import java.util.*;

// ❌ For-each: ConcurrentModificationException
public class RemocaoForEach {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
        
        // ❌ ERRO: ConcurrentModificationException
        try {
            for (String s : lista) {
                if (s.equals("B")) {
                    lista.remove(s);  // ERRO RUNTIME
                }
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("ERRO: " + e.getClass().getSimpleName());
        }
    }
}

// ✅ Iterator.remove()
public class RemocaoIterator {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
        
        // ✅ Iterator.remove() OK
        Iterator<String> it = lista.iterator();
        while (it.hasNext()) {
            String s = it.next();
            if (s.equals("B")) {
                it.remove();  // OK
            }
        }
        
        System.out.println(lista);  // [A, C, D]
    }
}

// ✅ removeIf (Java 8+)
public class RemocaoRemoveIf {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
        
        // ✅ removeIf OK
        lista.removeIf(s -> s.equals("B"));
        
        System.out.println(lista);  // [A, C, D]
    }
}
```

**Remoção**: for-each **erro**. Iterator.remove() **OK**. removeIf() **OK**.

---

## Fundamentos

### 1. ConcurrentModificationException

```java
// ❌ ConcurrentModificationException explicado
public class ExplicacaoCME {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // ❌ PROBLEMA: modificar estrutura durante iteração
        try {
            for (String s : lista) {
                System.out.println("Iterando: " + s);
                if (s.equals("C")) {
                    lista.remove(s);  // Modifica estrutura
                    // Iterator detecta modificação
                    // Lança ConcurrentModificationException
                }
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("ERRO: " + e.getMessage());
        }
        
        // MOTIVO:
        // For-each usa Iterator interno
        // Iterator rastreia modificações via modCount
        // lista.remove() incrementa modCount
        // Iterator detecta mudança não autorizada
        // Lança exceção fail-fast
    }
}

/*
 * CONCURRENTMODIFICATIONEXCEPTION:
 * 
 * CAUSA:
 * Modificar coleção durante iteração
 * lista.remove() durante for-each
 * lista.add() durante for-each
 * 
 * MECANISMO:
 * Iterator rastreia modCount
 * lista.remove() altera modCount
 * Iterator.next() detecta mudança
 * Lança exceção
 * 
 * FAIL-FAST:
 * Detecta modificação imediatamente
 * Não permite continuar iteração
 * Previne comportamento indefinido
 */
```

**ConcurrentModificationException**: modificar durante iteração. Iterator detecta via modCount. Fail-fast.

### 2. Iterator.remove() Solução

```java
// ✅ Iterator.remove() correto
public class IteratorRemove {
    public static void main(String[] args) {
        // ✅ REMOVER ELEMENTOS ESPECÍFICOS
        List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        Iterator<String> it = lista.iterator();
        while (it.hasNext()) {
            String s = it.next();
            if (s.equals("B") || s.equals("D")) {
                it.remove();  // Remove elemento atual
            }
        }
        
        System.out.println(lista);  // [A, C, E]
        
        // ✅ REMOVER TODOS PARES
        List<Integer> numeros = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6));
        
        Iterator<Integer> itNum = numeros.iterator();
        while (itNum.hasNext()) {
            Integer num = itNum.next();
            if (num % 2 == 0) {
                itNum.remove();
            }
        }
        
        System.out.println(numeros);  // [1, 3, 5]
        
        // ✅ SET também funciona
        Set<String> conjunto = new HashSet<>(Arrays.asList("X", "Y", "Z"));
        
        Iterator<String> itSet = conjunto.iterator();
        while (itSet.hasNext()) {
            String s = itSet.next();
            if (s.equals("Y")) {
                itSet.remove();
            }
        }
        
        System.out.println(conjunto);  // [X, Z]
    }
}

/*
 * ITERATOR.REMOVE():
 * 
 * SINTAXE:
 * Iterator<T> it = colecao.iterator();
 * while (it.hasNext()) {
 *     T elemento = it.next();
 *     if (condicao) {
 *         it.remove();  // Remove elemento atual
 *     }
 * }
 * 
 * VANTAGENS:
 * - Seguro (não lança exceção)
 * - Funciona todas Collections
 * - Remove elemento atual iteração
 * 
 * IMPORTANTE:
 * - Chamar next() antes remove()
 * - remove() apenas UMA vez por next()
 * - Não pode remover sem next()
 */
```

**Iterator.remove()**: seguro, remove atual, chamar next() antes, uma vez por next().

### 3. removeIf() Solução (Java 8+)

```java
// ✅ removeIf() (Java 8+)
public class RemoveIf {
    public static void main(String[] args) {
        // ✅ SINTAXE SIMPLES
        List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        lista.removeIf(s -> s.equals("B"));
        System.out.println(lista);  // [A, C, D, E]
        
        // ✅ CONDIÇÃO COMPLEXA
        lista.removeIf(s -> s.equals("C") || s.equals("E"));
        System.out.println(lista);  // [A, D]
        
        // ✅ NÚMEROS PARES
        List<Integer> numeros = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8));
        
        numeros.removeIf(n -> n % 2 == 0);
        System.out.println(numeros);  // [1, 3, 5, 7]
        
        // ✅ STRING LENGTH
        List<String> palavras = new ArrayList<>(Arrays.asList("Java", "Python", "C", "C++", "Go"));
        
        palavras.removeIf(p -> p.length() < 3);
        System.out.println(palavras);  // [Java, Python, C++]
        
        // ✅ SET
        Set<Integer> conjunto = new HashSet<>(Arrays.asList(1, 2, 3, 4, 5));
        
        conjunto.removeIf(n -> n > 3);
        System.out.println(conjunto);  // [1, 2, 3]
        
        // ✅ METHOD REFERENCE
        List<String> nomes = new ArrayList<>(Arrays.asList("Ana", "", "Bruno", "", "Carlos"));
        
        nomes.removeIf(String::isEmpty);
        System.out.println(nomes);  // [Ana, Bruno, Carlos]
    }
}

/*
 * REMOVEIF (JAVA 8+):
 * 
 * SINTAXE:
 * colecao.removeIf(elemento -> condicao);
 * 
 * EXEMPLOS:
 * lista.removeIf(s -> s.equals("B"));
 * lista.removeIf(n -> n % 2 == 0);
 * lista.removeIf(s -> s.length() < 3);
 * lista.removeIf(String::isEmpty);
 * 
 * VANTAGENS:
 * - Conciso (1 linha)
 * - Legível
 * - Lambda expression
 * - Method reference
 * 
 * FUNCIONA:
 * - List, Set, Queue
 * - Qualquer Collection
 */
```

**removeIf()**: Java 8+, lambda, conciso, funciona todas Collections.

### 4. Criar Nova Lista

```java
// ✅ Criar nova lista (alternativa)
public class NovaLista {
    public static void main(String[] args) {
        List<String> original = Arrays.asList("A", "B", "C", "D", "E");
        
        // ✅ CRIAR NOVA (filtrada)
        List<String> filtrada = new ArrayList<>();
        for (String s : original) {
            if (!s.equals("B") && !s.equals("D")) {
                filtrada.add(s);
            }
        }
        
        System.out.println(filtrada);  // [A, C, E]
        
        // ✅ STREAM (Java 8+)
        List<String> filtradaStream = original.stream()
            .filter(s -> !s.equals("B") && !s.equals("D"))
            .collect(Collectors.toList());
        
        System.out.println(filtradaStream);  // [A, C, E]
        
        // ✅ NÚMEROS ÍMPARES
        List<Integer> numeros = Arrays.asList(1, 2, 3, 4, 5, 6);
        
        List<Integer> impares = new ArrayList<>();
        for (Integer n : numeros) {
            if (n % 2 != 0) {
                impares.add(n);
            }
        }
        
        System.out.println(impares);  // [1, 3, 5]
        
        // VANTAGEM:
        // Original inalterada
        // Útil quando precisa manter original
    }
}

/*
 * CRIAR NOVA LISTA:
 * 
 * SINTAXE:
 * List<T> nova = new ArrayList<>();
 * for (T elemento : original) {
 *     if (condicao) {
 *         nova.add(elemento);
 *     }
 * }
 * 
 * STREAM:
 * List<T> nova = original.stream()
 *     .filter(condicao)
 *     .collect(Collectors.toList());
 * 
 * VANTAGENS:
 * - Original inalterada
 * - For-each funciona
 * - Sem ConcurrentModificationException
 * 
 * DESVANTAGEM:
 * - Cria nova lista (memória)
 */
```

**Nova lista**: alternativa, original inalterada, for-each OK, stream filter.

### 5. Remover Todos vs Específicos

```java
// Remover todos vs específicos
public class TodosVsEspecificos {
    public static void main(String[] args) {
        // ✅ REMOVER TODOS ELEMENTOS
        List<String> lista1 = new ArrayList<>(Arrays.asList("A", "B", "C"));
        
        lista1.clear();  // Remove TODOS
        System.out.println(lista1);  // []
        
        // ✅ REMOVER ELEMENTOS COLEÇÃO
        List<String> lista2 = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
        List<String> remover = Arrays.asList("B", "D");
        
        lista2.removeAll(remover);  // Remove B e D
        System.out.println(lista2);  // [A, C, E]
        
        // ✅ MANTER APENAS (retainAll)
        List<String> lista3 = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
        List<String> manter = Arrays.asList("A", "C", "E");
        
        lista3.retainAll(manter);  // Mantém apenas A, C, E
        System.out.println(lista3);  // [A, C, E]
        
        // ✅ REMOVER PRIMEIRA OCORRÊNCIA
        List<String> lista4 = new ArrayList<>(Arrays.asList("A", "B", "B", "C"));
        
        lista4.remove("B");  // Remove primeira B
        System.out.println(lista4);  // [A, B, C]
        
        // ✅ REMOVER POR ÍNDICE
        List<String> lista5 = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
        
        lista5.remove(1);  // Remove índice 1 (B)
        System.out.println(lista5);  // [A, C, D]
    }
}

/*
 * MÉTODOS REMOÇÃO:
 * 
 * TODOS:
 * lista.clear()
 * 
 * COLEÇÃO:
 * lista.removeAll(coleção)
 * 
 * MANTER:
 * lista.retainAll(coleção)
 * 
 * PRIMEIRA OCORRÊNCIA:
 * lista.remove(objeto)
 * 
 * POR ÍNDICE:
 * lista.remove(índice)
 * 
 * CONDICIONAL:
 * lista.removeIf(predicado)
 */
```

**Métodos**: clear() todos, removeAll() coleção, retainAll() manter, remove() primeira/índice.

### 6. Fail-Fast vs Fail-Safe

```java
// Fail-fast vs Fail-safe
public class FailFastVsSafe {
    public static void main(String[] args) {
        // ❌ FAIL-FAST: ArrayList, HashSet, HashMap
        List<String> failFast = new ArrayList<>(Arrays.asList("A", "B", "C"));
        
        try {
            for (String s : failFast) {
                failFast.remove(s);  // ConcurrentModificationException
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("Fail-fast: " + e.getClass().getSimpleName());
        }
        
        // ✅ FAIL-SAFE: CopyOnWriteArrayList, ConcurrentHashMap
        List<String> failSafe = new CopyOnWriteArrayList<>(Arrays.asList("A", "B", "C"));
        
        for (String s : failSafe) {
            failSafe.remove(s);  // OK (não lança exceção)
        }
        
        System.out.println(failSafe);  // []
        
        // FAIL-FAST:
        // - ArrayList, LinkedList
        // - HashSet, TreeSet
        // - HashMap, TreeMap
        // - Detecta modificação imediatamente
        // - Lança ConcurrentModificationException
        
        // FAIL-SAFE:
        // - CopyOnWriteArrayList
        // - CopyOnWriteArraySet
        // - ConcurrentHashMap
        // - Itera cópia (snapshot)
        // - Não lança exceção
        // - Modificações não visíveis iteração
    }
}

/*
 * FAIL-FAST:
 * 
 * COLLECTIONS:
 * ArrayList, LinkedList, HashSet, HashMap
 * 
 * COMPORTAMENTO:
 * Detecta modificação durante iteração
 * Lança ConcurrentModificationException
 * Falha rápido (fail-fast)
 * 
 * FAIL-SAFE:
 * 
 * COLLECTIONS:
 * CopyOnWriteArrayList, ConcurrentHashMap
 * 
 * COMPORTAMENTO:
 * Itera snapshot/cópia
 * Não lança exceção
 * Modificações não visíveis iteração
 * 
 * ESCOLHA:
 * Fail-fast: maioria casos
 * Fail-safe: concorrência
 */
```

**Fail-fast**: ArrayList HashSet, detecta modificação, exceção. **Fail-safe**: CopyOnWriteArrayList, snapshot, sem exceção.

### 7. Armadilhas Comuns

```java
// ❌ Armadilhas comuns
public class ArmadilhasRemocao {
    public static void main(String[] args) {
        // ❌ ARMADILHA 1: remove() sem next()
        List<String> lista1 = new ArrayList<>(Arrays.asList("A", "B", "C"));
        Iterator<String> it1 = lista1.iterator();
        
        try {
            it1.remove();  // ERRO: IllegalStateException
        } catch (IllegalStateException e) {
            System.out.println("ERRO: precisa next() antes remove()");
        }
        
        // ❌ ARMADILHA 2: remove() duas vezes
        List<String> lista2 = new ArrayList<>(Arrays.asList("A", "B", "C"));
        Iterator<String> it2 = lista2.iterator();
        
        try {
            it2.next();
            it2.remove();  // OK
            it2.remove();  // ERRO: IllegalStateException
        } catch (IllegalStateException e) {
            System.out.println("ERRO: apenas UMA vez por next()");
        }
        
        // ❌ ARMADILHA 3: lista.remove() E it.remove()
        List<String> lista3 = new ArrayList<>(Arrays.asList("A", "B", "C"));
        Iterator<String> it3 = lista3.iterator();
        
        try {
            it3.next();
            lista3.remove(0);  // Modifica fora Iterator
            it3.next();        // ERRO: ConcurrentModificationException
        } catch (ConcurrentModificationException e) {
            System.out.println("ERRO: não misturar lista.remove() e Iterator");
        }
        
        // ✅ CORRETO
        List<String> lista4 = new ArrayList<>(Arrays.asList("A", "B", "C"));
        Iterator<String> it4 = lista4.iterator();
        
        while (it4.hasNext()) {
            String s = it4.next();
            if (s.equals("B")) {
                it4.remove();  // OK
            }
        }
    }
}

/*
 * ARMADILHAS:
 * 
 * 1. REMOVE SEM NEXT:
 *    it.remove() antes it.next()
 *    IllegalStateException
 * 
 * 2. REMOVE DUAS VEZES:
 *    it.remove() duas vezes mesmo next()
 *    IllegalStateException
 * 
 * 3. MISTURAR:
 *    lista.remove() durante iteração
 *    ConcurrentModificationException
 * 
 * CORRETO:
 * it.next()
 * it.remove() (uma vez)
 * Repetir
 */
```

**Armadilhas**: remove() sem next() erro, duas vezes erro, misturar lista.remove() exceção.

### 8. Resumo Visual

```java
/*
 * REMOÇÃO DURANTE ITERAÇÃO
 * 
 * ❌ FOR-EACH (ERRO):
 * for (T elemento : lista) {
 *     lista.remove(elemento);  // ConcurrentModificationException
 * }
 * 
 * CAUSA:
 * Modificar estrutura durante iteração
 * Iterator detecta via modCount
 * Lança exceção fail-fast
 * 
 * ✅ SOLUÇÃO 1: ITERATOR.REMOVE()
 * Iterator<T> it = lista.iterator();
 * while (it.hasNext()) {
 *     T elemento = it.next();
 *     if (condicao) {
 *         it.remove();  // OK
 *     }
 * }
 * 
 * REGRAS:
 * - Chamar next() antes remove()
 * - remove() apenas UMA vez por next()
 * - Não pode remover sem next()
 * 
 * ✅ SOLUÇÃO 2: REMOVEIF (JAVA 8+)
 * lista.removeIf(elemento -> condicao);
 * 
 * EXEMPLOS:
 * lista.removeIf(s -> s.equals("B"));
 * lista.removeIf(n -> n % 2 == 0);
 * lista.removeIf(String::isEmpty);
 * 
 * VANTAGENS:
 * - Conciso (1 linha)
 * - Lambda expression
 * - Funciona todas Collections
 * 
 * ✅ SOLUÇÃO 3: NOVA LISTA
 * List<T> nova = new ArrayList<>();
 * for (T elemento : original) {
 *     if (!condicao) {
 *         nova.add(elemento);
 *     }
 * }
 * 
 * STREAM:
 * List<T> nova = original.stream()
 *     .filter(condicao)
 *     .collect(Collectors.toList());
 * 
 * OUTROS MÉTODOS:
 * 
 * TODOS:
 * lista.clear()
 * 
 * COLEÇÃO:
 * lista.removeAll(coleção)
 * 
 * MANTER:
 * lista.retainAll(coleção)
 * 
 * PRIMEIRA:
 * lista.remove(objeto)
 * 
 * ÍNDICE:
 * lista.remove(índice)
 * 
 * FAIL-FAST VS FAIL-SAFE:
 * 
 * FAIL-FAST:
 * ArrayList, HashSet, HashMap
 * Detecta modificação
 * Lança exceção
 * 
 * FAIL-SAFE:
 * CopyOnWriteArrayList, ConcurrentHashMap
 * Itera snapshot
 * Não lança exceção
 * 
 * ARMADILHAS:
 * ❌ it.remove() sem next()
 * ❌ it.remove() duas vezes
 * ❌ Misturar lista.remove() e Iterator
 */

// EXEMPLO COMPLETO
public class ExemploCompleto {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
        
        // ✅ Iterator.remove()
        Iterator<String> it = lista.iterator();
        while (it.hasNext()) {
            String s = it.next();
            if (s.equals("B")) {
                it.remove();
            }
        }
        
        // ✅ removeIf()
        lista.removeIf(s -> s.equals("C"));
        
        System.out.println(lista);  // [A, D]
    }
}
```

---

## Aplicabilidade

**Remoção durante iteração**:
- **Iterator.remove()**: seguro, preciso
- **removeIf()**: conciso, lambda (Java 8+)
- **Nova lista**: original inalterada

**Quando usar**:
- **Iterator**: controle preciso, condição complexa
- **removeIf**: condição simples, lambda
- **Nova lista**: manter original

---

## Armadilhas

### 1. For-each Lança Exceção

```java
// ❌ ConcurrentModificationException
for (String s : lista) {
    lista.remove(s);  // ERRO
}

// ✅ Iterator.remove()
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    it.next();
    it.remove();
}
```

### 2. Remove Sem next()

```java
// ❌ IllegalStateException
Iterator<String> it = lista.iterator();
it.remove();  // ERRO: precisa next() antes

// ✅ next() primeiro
it.next();
it.remove();
```

### 3. Remove Duas Vezes

```java
// ❌ IllegalStateException
it.next();
it.remove();  // OK
it.remove();  // ERRO: apenas uma vez

// ✅ next() novamente
it.next();
it.remove();
```

---

## Boas Práticas

### 1. Preferir removeIf

```java
// ✅ removeIf conciso
lista.removeIf(s -> s.equals("B"));

// ❌ Iterator verbose
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    String s = it.next();
    if (s.equals("B")) {
        it.remove();
    }
}
```

### 2. Iterator Condição Complexa

```java
// ✅ Iterator controle preciso
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    String s = it.next();
    if (condicaoComplexa(s)) {
        it.remove();
    }
}
```

### 3. Nova Lista Original Inalterada

```java
// ✅ Manter original
List<String> filtrada = original.stream()
    .filter(s -> !s.equals("B"))
    .collect(Collectors.toList());
```

---

## Resumo

**Problema**:
- For-each **remove()** lança **ConcurrentModificationException**
- Modificar estrutura durante iteração
- Iterator detecta via modCount fail-fast

**Solução 1 - Iterator.remove()**:
- **Seguro**: não lança exceção
- **Preciso**: controle elemento atual
- **Regras**: next() antes, uma vez por next()

**Solução 2 - removeIf() (Java 8+)**:
- **Conciso**: 1 linha lambda
- **Simples**: lista.removeIf(predicado)
- **Funciona**: todas Collections

**Solução 3 - Nova Lista**:
- **Original** inalterada
- **For-each** funciona
- **Stream** filter collect

**Outros Métodos**:
- **clear()**: remove todos
- **removeAll()**: remove coleção
- **retainAll()**: mantém apenas
- **remove(objeto)**: primeira ocorrência
- **remove(índice)**: por posição

**Fail-fast vs Fail-safe**:
- **Fail-fast**: ArrayList HashSet, detecta exceção
- **Fail-safe**: CopyOnWriteArrayList, snapshot sem exceção

**Armadilhas**:
- remove() **sem** next() IllegalStateException
- remove() **duas vezes** IllegalStateException
- **Misturar** lista.remove() Iterator ConcurrentModificationException

**Regra de Ouro**: NUNCA lista.remove durante for-each ConcurrentModificationException. USAR Iterator.remove seguro next antes uma vez por next controle preciso. PREFERIR removeIf Java 8 mais conciso 1 linha lambda predicado simples funciona todas Collections. Nova lista original inalterada stream filter útil manter original. Métodos clear removeAll retainAll primeira índice. Fail-fast ArrayList detecta exceção fail-safe CopyOnWriteArrayList snapshot sem exceção. Armadilhas remove sem next duas vezes misturar lista.remove IllegalStateException ConcurrentModificationException. SEMPRE Iterator.remove ou removeIf NUNCA lista.remove durante iteração.

