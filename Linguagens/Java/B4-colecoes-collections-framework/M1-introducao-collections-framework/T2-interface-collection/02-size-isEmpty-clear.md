# T2.02 - size(), isEmpty(), clear()

## Introdução

**Métodos utilitários**: informações sobre **tamanho** e **limpeza** de coleção.

```java
import java.util.*;

/*
 * MÉTODOS UTILITÁRIOS
 * 
 * size():
 * - Retorna número de elementos
 * - int (quantidade)
 * 
 * isEmpty():
 * - Verifica se vazia
 * - boolean (true se vazia)
 * 
 * clear():
 * - Remove TODOS elementos
 * - void (sem retorno)
 */

// ✅ Uso básico
public class ExemploBasico {
    public static void main(String[] args) {
        Collection<String> colecao = new ArrayList<>();
        
        // ✅ isEmpty(): verificar se vazia
        boolean vazia1 = colecao.isEmpty();  // true (0 elementos)
        
        // ✅ size(): obter tamanho
        int tamanho1 = colecao.size();  // 0
        
        // Adicionar elementos
        colecao.add("Java");
        colecao.add("Python");
        colecao.add("C++");
        
        // ✅ size(): 3 elementos
        int tamanho2 = colecao.size();  // 3
        
        // ✅ isEmpty(): false (tem elementos)
        boolean vazia2 = colecao.isEmpty();  // false
        
        // ✅ clear(): remover todos
        colecao.clear();
        
        // ✅ Após clear(): vazia
        int tamanho3 = colecao.size();  // 0
        boolean vazia3 = colecao.isEmpty();  // true
        
        System.out.println("Tamanho final: " + tamanho3);  // 0
    }
}
```

**Regra**: size() retorna **quantidade**, isEmpty() verifica se **vazia**, clear() **remove todos**.

---

## Fundamentos

### 1. Método size()

```java
// ✅ size(): obter quantidade de elementos
public class MetodoSize {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        
        // ✅ Lista vazia: size() = 0
        int tamanho1 = lista.size();  // 0
        System.out.println("Tamanho inicial: " + tamanho1);
        
        // ✅ Adicionar elementos
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        int tamanho2 = lista.size();  // 3
        System.out.println("Após adicionar: " + tamanho2);
        
        // ✅ Adicionar duplicata (List permite)
        lista.add("A");
        
        int tamanho3 = lista.size();  // 4 (duplicata conta)
        System.out.println("Com duplicata: " + tamanho3);
        
        // ✅ Remover elemento
        lista.remove("A");  // Remove primeira ocorrência
        
        int tamanho4 = lista.size();  // 3
        System.out.println("Após remover: " + tamanho4);
        
        // ✅ HashSet: sem duplicatas
        Collection<String> conjunto = new HashSet<>();
        conjunto.add("X");
        conjunto.add("Y");
        conjunto.add("X");  // Duplicata ignorada
        
        int tamanho5 = conjunto.size();  // 2 (duplicata NÃO conta)
        System.out.println("HashSet: " + tamanho5);
    }
}

/*
 * size():
 * 
 * ASSINATURA:
 * int size()
 * 
 * RETORNO:
 * - Número de elementos na coleção
 * - int (0 a Integer.MAX_VALUE)
 * 
 * COMPORTAMENTO:
 * 
 * LISTA VAZIA:
 * size() → 0
 * 
 * APÓS ADD:
 * add("A") → size() aumenta em 1
 * 
 * APÓS REMOVE:
 * remove("A") → size() diminui em 1
 * 
 * DUPLICATAS:
 * List: duplicatas CONTAM (size aumenta)
 * Set: duplicatas NÃO contam (size não aumenta)
 * 
 * NULL:
 * Se permitido, null CONTA como elemento
 * 
 * PERFORMANCE:
 * - ArrayList, HashSet: O(1) (contador interno)
 * - ConcurrentLinkedQueue: O(n) (pode percorrer)
 * 
 * LIMITES:
 * - Máximo: Integer.MAX_VALUE (2.147.483.647)
 * - Se exceder, comportamento indefinido
 */
```

**size()**: retorna **quantidade** de elementos. O(1) na maioria das implementações.

### 2. Método isEmpty()

```java
// ✅ isEmpty(): verificar se vazia
public class MetodoIsEmpty {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        
        // ✅ Lista vazia: isEmpty() = true
        boolean vazia1 = lista.isEmpty();  // true
        int tamanho1 = lista.size();       // 0
        
        System.out.println("Vazia: " + vazia1);  // true
        System.out.println("isEmpty() equivale a size() == 0: " + 
            (vazia1 == (tamanho1 == 0)));  // true
        
        // ✅ Adicionar elemento
        lista.add("A");
        
        boolean vazia2 = lista.isEmpty();  // false
        System.out.println("Após add: " + vazia2);
        
        // ✅ Remover único elemento
        lista.remove("A");
        
        boolean vazia3 = lista.isEmpty();  // true (volta a vazia)
        System.out.println("Após remover: " + vazia3);
        
        // ✅ Adicionar null (se permitido)
        lista.add(null);
        
        boolean vazia4 = lista.isEmpty();  // false (null CONTA)
        System.out.println("Com null: " + vazia4);
    }
}

/*
 * isEmpty():
 * 
 * ASSINATURA:
 * boolean isEmpty()
 * 
 * RETORNO:
 * - true: se coleção VAZIA (size() == 0)
 * - false: se coleção TEM elementos (size() > 0)
 * 
 * EQUIVALÊNCIA:
 * isEmpty() ≡ (size() == 0)
 * 
 * POR QUE USAR isEmpty():
 * - Mais LEGÍVEL que size() == 0
 * - Intenção CLARA
 * - Pode ser mais EFICIENTE (algumas implementações)
 * 
 * COMPORTAMENTO:
 * 
 * VAZIA:
 * isEmpty() → true
 * 
 * COM ELEMENTOS:
 * isEmpty() → false
 * 
 * COM NULL:
 * Se null permitido, conta como elemento
 * isEmpty() → false
 * 
 * PERFORMANCE:
 * - Geralmente O(1) (mesmo que size())
 * - Algumas implementações podem otimizar
 * 
 * BOA PRÁTICA:
 * ✅ if (lista.isEmpty())      // PREFERIR
 * ❌ if (lista.size() == 0)    // Menos legível
 */
```

**isEmpty()**: retorna **true** se vazia. Equivalente a `size() == 0`, mas mais **legível**.

### 3. Método clear()

```java
// ✅ clear(): remover todos elementos
public class MetodoClear {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        
        // ✅ Adicionar elementos
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        System.out.println("Antes clear: " + lista);  // [A, B, C]
        System.out.println("Size: " + lista.size());  // 3
        
        // ✅ Remover TODOS elementos
        lista.clear();
        
        System.out.println("Após clear: " + lista);   // []
        System.out.println("Size: " + lista.size());  // 0
        System.out.println("isEmpty: " + lista.isEmpty());  // true
        
        // ✅ clear() em coleção vazia: sem efeito
        lista.clear();  // OK (não lança exceção)
        
        System.out.println("Clear em vazia: " + lista.size());  // 0
        
        // ✅ Após clear(), pode adicionar novamente
        lista.add("X");
        lista.add("Y");
        
        System.out.println("Reutilizada: " + lista);  // [X, Y]
    }
}

/*
 * clear():
 * 
 * ASSINATURA:
 * void clear()
 * 
 * COMPORTAMENTO:
 * - Remove TODOS elementos da coleção
 * - Após clear(): size() = 0, isEmpty() = true
 * - Coleção pode ser REUTILIZADA
 * 
 * EQUIVALENTE A:
 * while (!colecao.isEmpty()) {
 *     colecao.remove(colecao.iterator().next());
 * }
 * 
 * MAS:
 * - clear() é MUITO MAIS EFICIENTE
 * - O(1) ou O(n) dependendo implementação
 * - Não precisa iterar manualmente
 * 
 * EM COLEÇÃO VAZIA:
 * - clear() não lança exceção
 * - Sem efeito (já vazia)
 * 
 * EXCEÇÃO:
 * - UnsupportedOperationException: se coleção imutável
 * 
 * MEMÓRIA:
 * - Elementos removidos podem ser GC
 * - ArrayList: não reduz capacidade interna
 * - Use trimToSize() para reduzir capacidade
 * 
 * APÓS CLEAR:
 * - Coleção REUTILIZÁVEL
 * - Pode adicionar novos elementos
 * - Estrutura interna preservada
 */
```

**clear()**: remove **todos** elementos. Após clear(): size() = 0, isEmpty() = true.

### 4. Performance

```java
// ✅ Performance dos métodos
public class Performance {
    public static void main(String[] args) {
        // ✅ size() e isEmpty(): O(1)
        Collection<String> lista = new ArrayList<>();
        
        for (int i = 0; i < 1_000_000; i++) {
            lista.add("Elemento " + i);
        }
        
        // O(1): contador interno
        long inicio1 = System.nanoTime();
        int tamanho = lista.size();
        long fim1 = System.nanoTime();
        System.out.println("size(): " + (fim1 - inicio1) + " ns");  // ~100 ns
        
        // O(1): verifica contador == 0
        long inicio2 = System.nanoTime();
        boolean vazia = lista.isEmpty();
        long fim2 = System.nanoTime();
        System.out.println("isEmpty(): " + (fim2 - inicio2) + " ns");  // ~100 ns
        
        // ✅ clear(): O(n) na maioria
        long inicio3 = System.nanoTime();
        lista.clear();  // Precisa invalidar elementos
        long fim3 = System.nanoTime();
        System.out.println("clear(): " + (fim3 - inicio3) + " ns");  // Milhares ns
    }
}

/*
 * PERFORMANCE:
 * 
 * size():
 * ArrayList:        O(1) - contador interno
 * LinkedList:       O(1) - contador interno
 * HashSet:          O(1) - contador interno
 * TreeSet:          O(1) - contador interno
 * ConcurrentLinkedQueue: O(n) - pode percorrer
 * 
 * isEmpty():
 * Todas:            O(1) - verifica size == 0
 * 
 * clear():
 * ArrayList:        O(n) - null todos elementos
 * LinkedList:       O(n) - remover links
 * HashSet:          O(n) - limpar buckets
 * TreeSet:          O(n) - remover nós
 * 
 * COMPARAÇÃO:
 * size() ≈ isEmpty() >> clear()
 * 
 * size() e isEmpty() são MUITO RÁPIDOS (O(1))
 * clear() é MAIS LENTO (O(n))
 */
```

**Performance**: size() e isEmpty() **O(1)** (rápido), clear() **O(n)** (percorre).

### 5. isEmpty() vs size() == 0

```java
// ✅ isEmpty() vs size() == 0
public class IsEmptyVsSize {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        
        // ✅ Ambos equivalentes
        boolean vazia1 = lista.isEmpty();       // PREFERIR
        boolean vazia2 = (lista.size() == 0);   // Menos legível
        
        System.out.println("isEmpty(): " + vazia1);     // true
        System.out.println("size() == 0: " + vazia2);   // true
        System.out.println("Equivalentes: " + (vazia1 == vazia2));  // true
        
        // ✅ Legibilidade
        // CLARO
        if (lista.isEmpty()) {
            System.out.println("Lista vazia");
        }
        
        // MENOS CLARO
        if (lista.size() == 0) {
            System.out.println("Lista vazia");
        }
        
        // ✅ Negação
        // CLARO
        if (!lista.isEmpty()) {
            System.out.println("Lista TEM elementos");
        }
        
        // MENOS CLARO
        if (lista.size() > 0) {
            System.out.println("Lista TEM elementos");
        }
    }
}

/*
 * isEmpty() vs size() == 0:
 * 
 * EQUIVALÊNCIA:
 * isEmpty() ≡ (size() == 0)
 * !isEmpty() ≡ (size() > 0)
 * 
 * PREFERIR isEmpty():
 * 
 * 1. LEGIBILIDADE:
 *    if (lista.isEmpty())  // ✅ Intenção CLARA
 *    if (lista.size() == 0)  // ❌ Menos claro
 * 
 * 2. SEMÂNTICA:
 *    isEmpty() expressa INTENÇÃO (verificar se vazia)
 *    size() == 0 expressa IMPLEMENTAÇÃO (tamanho zero)
 * 
 * 3. MANUTENIBILIDADE:
 *    isEmpty() mais RESISTENTE a mudanças
 *    Implementação pode otimizar isEmpty()
 * 
 * 4. CONVENÇÃO:
 *    isEmpty() é PADRÃO Java
 *    Usado em toda API Collections
 * 
 * QUANDO size():
 * - Quando precisa VALOR tamanho
 * - Comparar com outros valores (size() > 10)
 * - Cálculos envolvendo tamanho
 */
```

**Preferir isEmpty()**: mais **legível** e **semântico** que `size() == 0`.

### 6. clear() vs Remover Manualmente

```java
// ✅ clear() vs remover manualmente
public class ClearVsRemoverManual {
    public static void main(String[] args) {
        int tamanho = 100000;
        
        // ❌ Remover manualmente: LENTO
        Collection<Integer> lista1 = new ArrayList<>();
        for (int i = 0; i < tamanho; i++) {
            lista1.add(i);
        }
        
        long inicio1 = System.nanoTime();
        while (!lista1.isEmpty()) {
            lista1.remove(lista1.iterator().next());  // Remove um por um
        }
        long fim1 = System.nanoTime();
        System.out.println("Remover manualmente: " + (fim1 - inicio1) / 1_000_000 + " ms");
        
        // ✅ clear(): RÁPIDO
        Collection<Integer> lista2 = new ArrayList<>();
        for (int i = 0; i < tamanho; i++) {
            lista2.add(i);
        }
        
        long inicio2 = System.nanoTime();
        lista2.clear();  // Remove TODOS de uma vez
        long fim2 = System.nanoTime();
        System.out.println("clear(): " + (fim2 - inicio2) / 1_000_000 + " ms");
        
        // clear() é MUITO MAIS RÁPIDO (10-100x)
    }
}

/*
 * clear() vs REMOVER MANUALMENTE:
 * 
 * REMOVER MANUALMENTE:
 * while (!lista.isEmpty()) {
 *     lista.remove(lista.iterator().next());
 * }
 * 
 * PROBLEMAS:
 * - LENTO (O(n²) para ArrayList)
 * - Cada remove() pode shift elementos
 * - Iterator overhead
 * 
 * clear():
 * lista.clear();
 * 
 * VANTAGENS:
 * - RÁPIDO (O(n))
 * - Otimizado pela implementação
 * - Código LIMPO (uma linha)
 * - 10-100x MAIS RÁPIDO
 * 
 * SEMPRE PREFERIR clear()
 */
```

**clear()**: 10-100x **mais rápido** que remover manualmente.

### 7. UnsupportedOperationException

```java
// ❌ Coleção imutável: UnsupportedOperationException
public class ColecaoImutavel {
    public static void main(String[] args) {
        // ❌ Arrays.asList(): imutável
        Collection<String> imutavel1 = Arrays.asList("A", "B", "C");
        
        // ✅ size() e isEmpty(): OK (leitura)
        int tamanho = imutavel1.size();      // 3 (OK)
        boolean vazia = imutavel1.isEmpty();  // false (OK)
        
        try {
            imutavel1.clear();  // ❌ UnsupportedOperationException
        } catch (UnsupportedOperationException e) {
            System.out.println("Arrays.asList() não permite clear()");
        }
        
        // ❌ Collections.unmodifiableCollection()
        Collection<String> mutavel = new ArrayList<>();
        mutavel.add("X");
        mutavel.add("Y");
        
        Collection<String> imutavel2 = Collections.unmodifiableCollection(mutavel);
        
        // ✅ Leitura OK
        System.out.println("Size: " + imutavel2.size());      // 2
        System.out.println("isEmpty: " + imutavel2.isEmpty());  // false
        
        try {
            imutavel2.clear();  // ❌ UnsupportedOperationException
        } catch (UnsupportedOperationException e) {
            System.out.println("unmodifiableCollection() não permite clear()");
        }
    }
}

/*
 * UNSUPPORTEDOPERATIONEXCEPTION:
 * 
 * COLEÇÕES IMUTÁVEIS:
 * 
 * Arrays.asList():
 * - size(), isEmpty() → OK (leitura)
 * - clear() → UnsupportedOperationException
 * 
 * Collections.unmodifiableXxx():
 * - size(), isEmpty() → OK (leitura)
 * - clear() → UnsupportedOperationException
 * 
 * List.of(), Set.of() (Java 9+):
 * - size(), isEmpty() → OK (leitura)
 * - clear() → UnsupportedOperationException
 * 
 * REGRA:
 * - LEITURA sempre permitida
 * - MODIFICAÇÃO (clear) lança exceção
 */
```

**Imutável**: size() e isEmpty() **OK** (leitura), clear() lança **UnsupportedOperationException**.

### 8. Exemplos Práticos

```java
// ✅ Exemplos práticos
public class ExemplosPraticos {
    
    // ✅ Exemplo 1: Processar se não vazia
    public static void processar(Collection<String> elementos) {
        if (elementos.isEmpty()) {
            System.out.println("Nada a processar");
            return;
        }
        
        System.out.println("Processando " + elementos.size() + " elementos");
        for (String elemento : elementos) {
            // Processar...
        }
    }
    
    // ✅ Exemplo 2: Limpar antes de preencher
    public static void preencherLista(Collection<Integer> lista, int quantidade) {
        lista.clear();  // Limpar antes
        
        for (int i = 1; i <= quantidade; i++) {
            lista.add(i);
        }
        
        System.out.println("Preenchida com " + lista.size() + " elementos");
    }
    
    // ✅ Exemplo 3: Verificar tamanho antes de operação
    public static String obterPrimeiro(Collection<String> lista) {
        if (lista.isEmpty()) {
            return null;  // ou throw exception
        }
        
        return lista.iterator().next();
    }
    
    // ✅ Exemplo 4: Validar tamanho
    public static void validarTamanho(Collection<?> colecao, int minimo, int maximo) {
        int tamanho = colecao.size();
        
        if (tamanho < minimo) {
            throw new IllegalArgumentException(
                "Tamanho " + tamanho + " menor que mínimo " + minimo);
        }
        
        if (tamanho > maximo) {
            throw new IllegalArgumentException(
                "Tamanho " + tamanho + " maior que máximo " + maximo);
        }
    }
    
    // ✅ Exemplo 5: Estatísticas
    public static void imprimirEstatisticas(Collection<?> colecao) {
        System.out.println("Estatísticas:");
        System.out.println("  Tamanho: " + colecao.size());
        System.out.println("  Vazia: " + colecao.isEmpty());
        System.out.println("  Tem elementos: " + !colecao.isEmpty());
    }
    
    public static void main(String[] args) {
        // Exemplo 1
        Collection<String> lista1 = new ArrayList<>();
        processar(lista1);  // "Nada a processar"
        
        lista1.add("A");
        lista1.add("B");
        processar(lista1);  // "Processando 2 elementos"
        
        // Exemplo 2
        Collection<Integer> lista2 = new ArrayList<>();
        lista2.add(999);
        preencherLista(lista2, 5);  // Limpa 999 e preenche 1-5
        
        // Exemplo 3
        Collection<String> lista3 = new ArrayList<>();
        String primeiro1 = obterPrimeiro(lista3);  // null
        
        lista3.add("X");
        String primeiro2 = obterPrimeiro(lista3);  // "X"
        
        // Exemplo 4
        try {
            validarTamanho(lista3, 3, 10);  // Lança exceção (tamanho 1 < 3)
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
        
        // Exemplo 5
        imprimirEstatisticas(lista3);
    }
}
```

**Exemplos**: verificar vazia, limpar antes preencher, validar tamanho, estatísticas.

### 9. Resumo Visual

```java
/*
 * size(), isEmpty(), clear()
 * 
 * size():
 * 
 * ASSINATURA:
 * int size()
 * 
 * RETORNO:
 * - Número de elementos (0 a Integer.MAX_VALUE)
 * 
 * PERFORMANCE:
 * - ArrayList, HashSet, LinkedList: O(1)
 * - ConcurrentLinkedQueue: O(n) (pode percorrer)
 * 
 * COMPORTAMENTO:
 * Vazia:        size() → 0
 * Com elementos: size() → quantidade
 * Duplicatas (List): CONTAM
 * Duplicatas (Set): NÃO contam
 * Null: CONTA (se permitido)
 * 
 * 
 * isEmpty():
 * 
 * ASSINATURA:
 * boolean isEmpty()
 * 
 * RETORNO:
 * - true: se vazia (size() == 0)
 * - false: se tem elementos (size() > 0)
 * 
 * EQUIVALÊNCIA:
 * isEmpty() ≡ (size() == 0)
 * !isEmpty() ≡ (size() > 0)
 * 
 * PREFERIR:
 * ✅ if (lista.isEmpty())      // Legível
 * ❌ if (lista.size() == 0)    // Menos claro
 * 
 * PERFORMANCE:
 * - O(1) em todas implementações
 * 
 * 
 * clear():
 * 
 * ASSINATURA:
 * void clear()
 * 
 * COMPORTAMENTO:
 * - Remove TODOS elementos
 * - Após: size() = 0, isEmpty() = true
 * - Coleção REUTILIZÁVEL
 * 
 * EQUIVALENTE (mas LENTO):
 * while (!colecao.isEmpty()) {
 *     colecao.remove(colecao.iterator().next());
 * }
 * 
 * PERFORMANCE:
 * - ArrayList, HashSet, LinkedList: O(n)
 * - 10-100x MAIS RÁPIDO que remover manualmente
 * 
 * EM VAZIA:
 * - clear() não lança exceção
 * - Sem efeito
 * 
 * EXCEÇÃO:
 * - UnsupportedOperationException: se imutável
 * 
 * 
 * COMPARAÇÃO:
 * 
 * Método    | Retorno | Performance | Modifica
 * ----------|---------|-------------|----------
 * size()    | int     | O(1)        | NÃO
 * isEmpty() | boolean | O(1)        | NÃO
 * clear()   | void    | O(n)        | SIM
 * 
 * 
 * COLEÇÕES IMUTÁVEIS:
 * 
 * Arrays.asList():
 * - size(), isEmpty() → OK
 * - clear() → UnsupportedOperationException
 * 
 * Collections.unmodifiableXxx():
 * - size(), isEmpty() → OK
 * - clear() → UnsupportedOperationException
 * 
 * List.of(), Set.of():
 * - size(), isEmpty() → OK
 * - clear() → UnsupportedOperationException
 * 
 * REGRA:
 * - LEITURA sempre OK
 * - MODIFICAÇÃO lança exceção
 */

public class ExemploMetodosUtilitarios {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        
        // ✅ Vazia
        System.out.println("Size: " + lista.size());        // 0
        System.out.println("isEmpty: " + lista.isEmpty());  // true
        
        // ✅ Adicionar elementos
        lista.add("Java");
        lista.add("Python");
        lista.add("C++");
        
        System.out.println("Size: " + lista.size());        // 3
        System.out.println("isEmpty: " + lista.isEmpty());  // false
        
        // ✅ Verificar antes de processar
        if (!lista.isEmpty()) {
            System.out.println("Processando " + lista.size() + " elementos");
            for (String elemento : lista) {
                System.out.println("  - " + elemento);
            }
        }
        
        // ✅ Limpar todos
        lista.clear();
        
        System.out.println("Após clear:");
        System.out.println("Size: " + lista.size());        // 0
        System.out.println("isEmpty: " + lista.isEmpty());  // true
        
        // ✅ Reutilizar coleção
        lista.add("Novo");
        System.out.println("Reutilizada: " + lista);  // [Novo]
    }
}
```

---

## Aplicabilidade

**size()**:
- Obter **quantidade** de elementos
- Validar **tamanho** (mínimo/máximo)
- Cálculos envolvendo quantidade

**isEmpty()**:
- Verificar se coleção **vazia**
- Validação antes de processar
- Mais **legível** que `size() == 0`

**clear()**:
- Remover **todos** elementos
- Limpar antes de **preencher**
- Resetar coleção

---

## Armadilhas

### 1. size() em ConcurrentLinkedQueue

```java
// ❌ ConcurrentLinkedQueue.size() O(n)
Collection<String> queue = new ConcurrentLinkedQueue<>();
int tamanho = queue.size();  // LENTO (percorre)

// ✅ Usar isEmpty() se só precisa verificar vazia
boolean vazia = queue.isEmpty();  // OK
```

### 2. size() == 0 vs isEmpty()

```java
// ❌ Menos legível
if (lista.size() == 0) { }

// ✅ Mais legível
if (lista.isEmpty()) { }
```

### 3. clear() em Imutável

```java
// ❌ UnsupportedOperationException
Collection<String> imutavel = Arrays.asList("A", "B");
imutavel.clear();  // Exceção

// ✅ Verificar se suporta modificação
Collection<String> mutavel = new ArrayList<>(imutavel);
mutavel.clear();  // OK
```

---

## Boas Práticas

### 1. Preferir isEmpty()

```java
// ✅ Legível
if (lista.isEmpty()) { }

// ❌ Menos claro
if (lista.size() == 0) { }
```

### 2. clear() Antes de Preencher

```java
// ✅ Garantir vazia antes
lista.clear();
preencherLista(lista);
```

### 3. Validar Tamanho

```java
// ✅ Verificar vazia antes de operar
if (lista.isEmpty()) {
    throw new IllegalStateException("Lista vazia");
}
String primeiro = lista.iterator().next();
```

---

## Resumo

**size()**:
- Retorna **quantidade** de elementos (int)
- Performance: **O(1)** na maioria (ArrayList, HashSet, LinkedList)
- ConcurrentLinkedQueue: **O(n)** (pode percorrer)
- Duplicatas List: **contam**, Set: **não** contam
- Null: **conta** se permitido

**isEmpty()**:
- Retorna **true** se vazia (size() == 0)
- Performance: **O(1)** em todas
- Equivalente a `size() == 0`, mas mais **legível**
- **Preferir** isEmpty() para verificar se vazia

**clear()**:
- Remove **todos** elementos (void)
- Após clear(): size() = 0, isEmpty() = true
- Performance: **O(n)** (percorre elementos)
- 10-100x **mais rápido** que remover manualmente
- Coleção **reutilizável** após clear()
- Em vazia: sem efeito, **não** lança exceção

**Comparação**:
- size() e isEmpty(): **O(1)**, **rápidos**
- clear(): **O(n)**, mais lento
- size() e isEmpty(): **leitura** (não modifica)
- clear(): **modificação** (remove todos)

**Preferir isEmpty()**:
- Mais **legível** que `size() == 0`
- Intenção **clara** (verificar vazia)
- **Semântico** (não implementação)
- Padrão Java **convenção**

**clear() vs remover manual**:
- clear(): **O(n)**, otimizado
- Remover manual: **O(n²)**, lento
- clear() 10-100x **mais rápido**

**Imutável**:
- size(), isEmpty(): **OK** (leitura)
- clear(): **UnsupportedOperationException** (modificação)
- Arrays.asList(), Collections.unmodifiableXxx(), List.of()

**Exemplos uso**:
- Verificar vazia antes processar
- Limpar antes preencher
- Validar tamanho (mínimo/máximo)
- Obter primeiro elemento (verificar isEmpty() antes)

**Regra de Ouro**: size() quantidade O(1) rápido. isEmpty() verificar vazia mais legível que size() == 0 preferir sempre. clear() remove todos O(n) muito mais rápido que manual reutilizável após. Imutável leitura OK modificação exceção. Validar isEmpty() antes operar evitar exceção.

