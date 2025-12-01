# T2.05 - Operações em Massa: addAll(), removeAll(), retainAll()

## Introdução

**Operações em massa**: adicionar, remover ou reter **múltiplos** elementos de uma vez.

```java
import java.util.*;

// ✅ Uso básico
public class ExemploBasico {
    public static void main(String[] args) {
        Collection<String> lista1 = new ArrayList<>();
        lista1.add("A");
        lista1.add("B");
        
        Collection<String> lista2 = new ArrayList<>();
        lista2.add("C");
        lista2.add("D");
        
        // ✅ addAll(): adiciona todos
        lista1.addAll(lista2);
        System.out.println(lista1);  // [A, B, C, D]
        
        // ✅ removeAll(): remove todos
        lista1.removeAll(lista2);
        System.out.println(lista1);  // [A, B]
        
        // ✅ retainAll(): mantém apenas comuns
        lista1.add("C");
        lista1.retainAll(lista2);
        System.out.println(lista1);  // [C]
    }
}
```

**Regra**: addAll() **adiciona** todos, removeAll() **remove** todos, retainAll() **mantém** apenas comuns.

---

## Fundamentos

### 1. Método addAll()

```java
// ✅ addAll(): adicionar todos elementos
public class MetodoAddAll {
    public static void main(String[] args) {
        Collection<String> lista1 = new ArrayList<>();
        lista1.add("A");
        lista1.add("B");
        
        Collection<String> lista2 = new ArrayList<>();
        lista2.add("C");
        lista2.add("D");
        
        // ✅ addAll(): adiciona TODOS de lista2
        boolean modificou = lista1.addAll(lista2);
        
        System.out.println("Modificou: " + modificou);  // true
        System.out.println("Lista1: " + lista1);  // [A, B, C, D]
        
        // ✅ addAll() com Set: apenas não duplicados
        Collection<String> set1 = new HashSet<>();
        set1.add("A");
        set1.add("B");
        
        Collection<String> set2 = new HashSet<>();
        set2.add("B");  // Duplicado
        set2.add("C");
        
        boolean modificou2 = set1.addAll(set2);
        
        System.out.println("Modificou: " + modificou2);  // true (C adicionado)
        System.out.println("Set1: " + set1);  // [A, B, C] (B não duplicado)
    }
}

/*
 * addAll():
 * 
 * ASSINATURA:
 * boolean addAll(Collection<? extends E> c)
 * 
 * RETORNO:
 * - true: se coleção MODIFICADA
 * - false: se NÃO modificada
 * 
 * COMPORTAMENTO:
 * - Adiciona TODOS elementos de c
 * - List: adiciona TODOS (permite duplicados)
 * - Set: adiciona apenas NÃO duplicados
 * 
 * PERFORMANCE:
 * - ArrayList: O(n) - adiciona todos
 * - HashSet: O(n) - verifica duplicados
 * 
 * EXCEÇÃO:
 * - UnsupportedOperationException: se imutável
 * - NullPointerException: se c é null
 */
```

**addAll()**: adiciona todos elementos. List permite duplicados, Set **não**.

### 2. Método removeAll()

```java
// ✅ removeAll(): remover todos elementos
public class MetodoRemoveAll {
    public static void main(String[] args) {
        Collection<String> lista1 = new ArrayList<>();
        lista1.add("A");
        lista1.add("B");
        lista1.add("C");
        lista1.add("D");
        
        Collection<String> lista2 = new ArrayList<>();
        lista2.add("B");
        lista2.add("D");
        
        // ✅ removeAll(): remove todos de lista2
        boolean modificou = lista1.removeAll(lista2);
        
        System.out.println("Modificou: " + modificou);  // true
        System.out.println("Lista1: " + lista1);  // [A, C]
        
        // ✅ removeAll() com elemento inexistente
        Collection<String> lista3 = new ArrayList<>();
        lista3.add("X");
        lista3.add("Y");
        
        boolean modificou2 = lista1.removeAll(lista3);
        
        System.out.println("Modificou: " + modificou2);  // false
        System.out.println("Lista1: " + lista1);  // [A, C] (não mudou)
        
        // ✅ removeAll() com duplicados (List)
        Collection<String> lista4 = new ArrayList<>();
        lista4.add("A");
        lista4.add("A");
        lista4.add("B");
        lista4.add("B");
        
        Collection<String> lista5 = new ArrayList<>();
        lista5.add("A");
        
        lista4.removeAll(lista5);
        System.out.println("Lista4: " + lista4);  // [B, B] (remove TODOS "A")
    }
}

/*
 * removeAll():
 * 
 * ASSINATURA:
 * boolean removeAll(Collection<?> c)
 * 
 * RETORNO:
 * - true: se MODIFICADA
 * - false: se NÃO modificada
 * 
 * COMPORTAMENTO:
 * - Remove TODOS elementos que estão em c
 * - List: remove TODAS ocorrências
 * - Usa equals() para comparar
 * 
 * PERFORMANCE:
 * - ArrayList: O(n*m) - percorre ambas
 * - HashSet: O(n) - hash direto
 * 
 * EXCEÇÃO:
 * - UnsupportedOperationException: se imutável
 * - NullPointerException: se c é null
 */
```

**removeAll()**: remove **todos** que estão em outra coleção. Remove **todas** ocorrências.

### 3. Método retainAll()

```java
// ✅ retainAll(): manter apenas comuns (interseção)
public class MetodoRetainAll {
    public static void main(String[] args) {
        Collection<String> lista1 = new ArrayList<>();
        lista1.add("A");
        lista1.add("B");
        lista1.add("C");
        lista1.add("D");
        
        Collection<String> lista2 = new ArrayList<>();
        lista2.add("B");
        lista2.add("D");
        lista2.add("E");
        
        // ✅ retainAll(): mantém apenas B e D (comuns)
        boolean modificou = lista1.retainAll(lista2);
        
        System.out.println("Modificou: " + modificou);  // true
        System.out.println("Lista1: " + lista1);  // [B, D]
        
        // ✅ retainAll() sem comuns
        Collection<String> lista3 = new ArrayList<>();
        lista3.add("A");
        lista3.add("C");
        
        Collection<String> lista4 = new ArrayList<>();
        lista4.add("X");
        lista4.add("Y");
        
        lista3.retainAll(lista4);
        System.out.println("Lista3: " + lista3);  // [] (vazia, sem comuns)
        
        // ✅ retainAll() com duplicados
        Collection<String> lista5 = new ArrayList<>();
        lista5.add("A");
        lista5.add("A");
        lista5.add("B");
        lista5.add("C");
        
        Collection<String> lista6 = new ArrayList<>();
        lista6.add("A");
        
        lista5.retainAll(lista6);
        System.out.println("Lista5: " + lista5);  // [A, A] (mantém AMBOS)
    }
}

/*
 * retainAll():
 * 
 * ASSINATURA:
 * boolean retainAll(Collection<?> c)
 * 
 * RETORNO:
 * - true: se MODIFICADA
 * - false: se NÃO modificada
 * 
 * COMPORTAMENTO:
 * - REMOVE elementos que NÃO estão em c
 * - Mantém apenas INTERSEÇÃO
 * - List: mantém duplicados se c contém
 * 
 * EQUIVALENTE A:
 * Manter apenas elementos que c.contains(elemento) = true
 * 
 * PERFORMANCE:
 * - ArrayList: O(n*m)
 * - HashSet: O(n)
 * 
 * EXCEÇÃO:
 * - UnsupportedOperationException: se imutável
 * - NullPointerException: se c é null
 */
```

**retainAll()**: mantém apenas elementos **comuns** (interseção). Remove os **não** comuns.

### 4. Performance

```java
// ✅ Performance operações massa
public class PerformanceOperacoesMassa {
    public static void main(String[] args) {
        int tamanho = 10000;
        
        // ✅ ArrayList
        Collection<Integer> arrayList1 = new ArrayList<>();
        Collection<Integer> arrayList2 = new ArrayList<>();
        
        for (int i = 0; i < tamanho; i++) {
            arrayList1.add(i);
            arrayList2.add(i * 2);
        }
        
        long inicio1 = System.nanoTime();
        arrayList1.removeAll(arrayList2);
        long fim1 = System.nanoTime();
        System.out.println("ArrayList removeAll: " + (fim1 - inicio1) / 1_000_000 + " ms");
        
        // ✅ HashSet (MUITO MAIS RÁPIDO)
        Collection<Integer> hashSet1 = new HashSet<>();
        Collection<Integer> hashSet2 = new HashSet<>();
        
        for (int i = 0; i < tamanho; i++) {
            hashSet1.add(i);
            hashSet2.add(i * 2);
        }
        
        long inicio2 = System.nanoTime();
        hashSet1.removeAll(hashSet2);
        long fim2 = System.nanoTime();
        System.out.println("HashSet removeAll: " + (fim2 - inicio2) / 1_000_000 + " ms");
    }
}

/*
 * PERFORMANCE:
 * 
 * addAll():
 * ArrayList:  O(n) - adiciona todos
 * HashSet:    O(n) - verifica duplicados
 * 
 * removeAll():
 * ArrayList:  O(n*m) - percorre ambas (LENTO)
 * HashSet:    O(n) - hash direto (RÁPIDO)
 * 
 * retainAll():
 * ArrayList:  O(n*m) - percorre ambas (LENTO)
 * HashSet:    O(n) - hash direto (RÁPIDO)
 * 
 * RECOMENDAÇÃO:
 * - Se removeAll/retainAll frequente: usar HashSet
 * - HashSet 100-1000x MAIS RÁPIDO
 */
```

**Performance**: HashSet 100-1000x **mais rápido** que ArrayList para removeAll/retainAll.

### 5. Operações de Conjunto

```java
// ✅ Operações de conjunto (união, interseção, diferença)
public class OperacoesConjunto {
    public static void main(String[] args) {
        Set<String> set1 = new HashSet<>();
        set1.add("A");
        set1.add("B");
        set1.add("C");
        
        Set<String> set2 = new HashSet<>();
        set2.add("B");
        set2.add("C");
        set2.add("D");
        
        // ✅ UNIÃO: set1 ∪ set2 (todos elementos)
        Set<String> uniao = new HashSet<>(set1);
        uniao.addAll(set2);
        System.out.println("União: " + uniao);  // [A, B, C, D]
        
        // ✅ INTERSEÇÃO: set1 ∩ set2 (apenas comuns)
        Set<String> intersecao = new HashSet<>(set1);
        intersecao.retainAll(set2);
        System.out.println("Interseção: " + intersecao);  // [B, C]
        
        // ✅ DIFERENÇA: set1 - set2 (em set1 mas não em set2)
        Set<String> diferenca = new HashSet<>(set1);
        diferenca.removeAll(set2);
        System.out.println("Diferença: " + diferenca);  // [A]
        
        // ✅ DIFERENÇA SIMÉTRICA: (set1 - set2) ∪ (set2 - set1)
        Set<String> diff1 = new HashSet<>(set1);
        diff1.removeAll(set2);
        
        Set<String> diff2 = new HashSet<>(set2);
        diff2.removeAll(set1);
        
        Set<String> difSimetrica = new HashSet<>(diff1);
        difSimetrica.addAll(diff2);
        System.out.println("Diferença Simétrica: " + difSimetrica);  // [A, D]
    }
}

/*
 * OPERAÇÕES CONJUNTO:
 * 
 * UNIÃO (A ∪ B):
 * Set<E> uniao = new HashSet<>(A);
 * uniao.addAll(B);
 * 
 * INTERSEÇÃO (A ∩ B):
 * Set<E> intersecao = new HashSet<>(A);
 * intersecao.retainAll(B);
 * 
 * DIFERENÇA (A - B):
 * Set<E> diferenca = new HashSet<>(A);
 * diferenca.removeAll(B);
 * 
 * DIFERENÇA SIMÉTRICA (A △ B):
 * Set<E> diff1 = new HashSet<>(A);
 * diff1.removeAll(B);
 * Set<E> diff2 = new HashSet<>(B);
 * diff2.removeAll(A);
 * diff1.addAll(diff2);
 */
```

**Operações conjunto**: união (addAll), interseção (retainAll), diferença (removeAll).

### 6. Exemplos Práticos

```java
// ✅ Exemplos práticos
public class ExemplosPraticos {
    
    // ✅ Exemplo 1: Mesclar listas
    public static <E> Collection<E> mesclar(Collection<E> c1, Collection<E> c2) {
        Collection<E> resultado = new ArrayList<>(c1);
        resultado.addAll(c2);
        return resultado;
    }
    
    // ✅ Exemplo 2: Remover elementos indesejados
    public static <E> void removerIndesejados(Collection<E> colecao, 
                                               Collection<E> indesejados) {
        colecao.removeAll(indesejados);
    }
    
    // ✅ Exemplo 3: Manter apenas válidos
    public static <E> void manterApenas(Collection<E> colecao, 
                                        Collection<E> validos) {
        colecao.retainAll(validos);
    }
    
    // ✅ Exemplo 4: Adicionar múltiplos
    public static <E> void adicionarTodos(Collection<E> destino, E... elementos) {
        destino.addAll(Arrays.asList(elementos));
    }
    
    public static void main(String[] args) {
        // Exemplo 1
        Collection<Integer> nums1 = new ArrayList<>();
        nums1.add(1);
        nums1.add(2);
        
        Collection<Integer> nums2 = new ArrayList<>();
        nums2.add(3);
        nums2.add(4);
        
        Collection<Integer> mesclados = mesclar(nums1, nums2);
        System.out.println("Mesclados: " + mesclados);  // [1, 2, 3, 4]
        
        // Exemplo 2
        Collection<String> palavras = new ArrayList<>();
        palavras.add("Java");
        palavras.add("Python");
        palavras.add("C++");
        
        Collection<String> remover = Arrays.asList("Python");
        removerIndesejados(palavras, remover);
        System.out.println("Sem Python: " + palavras);  // [Java, C++]
        
        // Exemplo 3
        Collection<Integer> numeros = new ArrayList<>();
        numeros.add(1);
        numeros.add(2);
        numeros.add(3);
        numeros.add(4);
        
        Collection<Integer> pares = Arrays.asList(2, 4, 6);
        manterApenas(numeros, pares);
        System.out.println("Apenas pares: " + numeros);  // [2, 4]
        
        // Exemplo 4
        Collection<String> lista = new ArrayList<>();
        adicionarTodos(lista, "A", "B", "C");
        System.out.println("Adicionados: " + lista);  // [A, B, C]
    }
}
```

**Exemplos**: mesclar listas, remover indesejados, manter válidos, adicionar múltiplos.

### 7. Resumo Visual

```java
/*
 * OPERAÇÕES EM MASSA
 * 
 * addAll():
 * 
 * ASSINATURA:
 * boolean addAll(Collection<? extends E> c)
 * 
 * COMPORTAMENTO:
 * - Adiciona TODOS elementos de c
 * - List: permite duplicados
 * - Set: adiciona apenas não duplicados
 * 
 * RETORNO:
 * - true: se modificada
 * - false: se não modificada
 * 
 * 
 * removeAll():
 * 
 * ASSINATURA:
 * boolean removeAll(Collection<?> c)
 * 
 * COMPORTAMENTO:
 * - Remove TODOS elementos que estão em c
 * - Remove TODAS ocorrências (List)
 * - Usa equals() para comparar
 * 
 * RETORNO:
 * - true: se modificada
 * - false: se não modificada
 * 
 * 
 * retainAll():
 * 
 * ASSINATURA:
 * boolean retainAll(Collection<?> c)
 * 
 * COMPORTAMENTO:
 * - MANTÉM apenas elementos que estão em c
 * - Remove os que NÃO estão em c
 * - Interseção
 * 
 * RETORNO:
 * - true: se modificada
 * - false: se não modificada
 * 
 * 
 * PERFORMANCE:
 * 
 * Operação    | ArrayList | HashSet
 * ------------|-----------|----------
 * addAll()    | O(n)      | O(n)
 * removeAll() | O(n*m)    | O(n)
 * retainAll() | O(n*m)    | O(n)
 * 
 * HashSet 100-1000x MAIS RÁPIDO
 * 
 * 
 * OPERAÇÕES CONJUNTO:
 * 
 * União (A ∪ B):
 * Set<E> uniao = new HashSet<>(A);
 * uniao.addAll(B);
 * 
 * Interseção (A ∩ B):
 * Set<E> intersecao = new HashSet<>(A);
 * intersecao.retainAll(B);
 * 
 * Diferença (A - B):
 * Set<E> diferenca = new HashSet<>(A);
 * diferenca.removeAll(B);
 */

public class ExemploOperacoesMassa {
    public static void main(String[] args) {
        Collection<String> lista1 = new ArrayList<>();
        lista1.add("A");
        lista1.add("B");
        
        Collection<String> lista2 = new ArrayList<>();
        lista2.add("C");
        lista2.add("D");
        
        // ✅ addAll: adicionar todos
        lista1.addAll(lista2);
        System.out.println("addAll: " + lista1);  // [A, B, C, D]
        
        // ✅ removeAll: remover todos
        lista1.removeAll(lista2);
        System.out.println("removeAll: " + lista1);  // [A, B]
        
        // ✅ retainAll: manter apenas comuns
        lista1.add("C");
        lista1.retainAll(lista2);
        System.out.println("retainAll: " + lista1);  // [C]
    }
}
```

---

## Aplicabilidade

**addAll()**:
- **Mesclar** coleções
- Adicionar **múltiplos** elementos
- **União** de conjuntos

**removeAll()**:
- Remover **múltiplos** elementos
- **Filtrar** elementos indesejados
- **Diferença** de conjuntos

**retainAll()**:
- Manter apenas **válidos**
- **Interseção** de conjuntos
- Filtrar por **whitelist**

---

## Armadilhas

### 1. Performance ArrayList

```java
// ❌ ArrayList removeAll/retainAll: O(n*m) LENTO
lista1.removeAll(lista2);  // Percorre ambas

// ✅ Converter para HashSet temporariamente
Set<String> set = new HashSet<>(lista2);
lista1.removeAll(set);  // O(n) RÁPIDO
```

### 2. NullPointerException

```java
// ❌ Passar null
lista.addAll(null);  // NullPointerException

// ✅ Verificar null
if (outra != null) {
    lista.addAll(outra);
}
```

---

## Boas Práticas

### 1. Usar HashSet Para Performance

```java
// ✅ HashSet para removeAll/retainAll
Set<String> set = new HashSet<>(lista2);
lista1.removeAll(set);  // Mais rápido
```

### 2. Criar Cópia Para Preservar Original

```java
// ✅ Criar cópia
Collection<String> copia = new ArrayList<>(original);
copia.retainAll(outra);  // Original preservado
```

---

## Resumo

**addAll()**:
- Adiciona **todos** elementos de outra coleção
- List: permite **duplicados**
- Set: adiciona apenas **não** duplicados
- Retorna **true** se modificada
- Performance: **O(n)**

**removeAll()**:
- Remove **todos** que estão em outra coleção
- Remove **todas** ocorrências
- Usa **equals()** para comparar
- Retorna **true** se modificada
- Performance: ArrayList O(n*m), HashSet **O(n)**

**retainAll()**:
- Mantém apenas elementos **comuns** (interseção)
- Remove os **não** comuns
- Retorna **true** se modificada
- Performance: ArrayList O(n*m), HashSet **O(n)**

**Performance**:
- ArrayList: removeAll/retainAll **O(n*m)** (lento)
- HashSet: removeAll/retainAll **O(n)** (rápido)
- HashSet **100-1000x** mais rápido

**Operações conjunto**:
- **União**: addAll() (A ∪ B)
- **Interseção**: retainAll() (A ∩ B)
- **Diferença**: removeAll() (A - B)

**Regra de Ouro**: addAll adiciona todos List duplicados Set não. removeAll remove todos que estão outra todas ocorrências. retainAll mantém apenas comuns interseção. HashSet 100-1000x mais rápido ArrayList removeAll retainAll usar HashSet operações frequentes. Operações conjunto união addAll interseção retainAll diferença removeAll. Criar cópia preservar original.

