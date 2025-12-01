# T5.02 - Uso com Collection e Iterable

## Introdução

**For-each funciona**: qualquer classe **Iterable**. Collection extends Iterable. Arrays também.

```java
import java.util.*;

// ✅ For-each com Collection
public class ForEachCollection {
    public static void main(String[] args) {
        // Collection extends Iterable
        // For-each funciona TODAS Collections
        
        // ✅ List (Collection)
        List<String> lista = Arrays.asList("A", "B", "C");
        for (String s : lista) {
            System.out.println(s);
        }
        
        // ✅ Set (Collection)
        Set<Integer> conjunto = Set.of(1, 2, 3);
        for (Integer n : conjunto) {
            System.out.println(n);
        }
        
        // ✅ Queue (Collection)
        Queue<String> fila = new LinkedList<>(Arrays.asList("X", "Y", "Z"));
        for (String item : fila) {
            System.out.println(item);
        }
    }
}

// ✅ For-each com Iterable customizado
public class IterableCustomizado implements Iterable<String> {
    private List<String> elementos = Arrays.asList("Um", "Dois", "Três");
    
    @Override
    public Iterator<String> iterator() {
        return elementos.iterator();
    }
    
    public static void main(String[] args) {
        IterableCustomizado obj = new IterableCustomizado();
        
        // ✅ For-each funciona (implementa Iterable)
        for (String elemento : obj) {
            System.out.println(elemento);
        }
    }
}
```

**Funciona**: Collection (extends Iterable), classes Iterable, arrays.

---

## Fundamentos

### 1. Interface Iterable

```java
// Interface Iterable
public class InterfaceIterable {
    public static void main(String[] args) {
        // HIERARQUIA:
        // Iterable (interface raiz)
        //    └── Collection (extends Iterable)
        //           ├── List
        //           ├── Set
        //           └── Queue
        
        // ITERABLE:
        // public interface Iterable<T> {
        //     Iterator<T> iterator();
        // }
        
        // ÚNICO MÉTODO: iterator()
        // Retorna Iterator para iterar elementos
        
        // FOR-EACH FUNCIONA:
        // Qualquer classe que implementa Iterable
    }
}

/*
 * INTERFACE ITERABLE:
 * 
 * public interface Iterable<T> {
 *     Iterator<T> iterator();
 * }
 * 
 * MÉTODO:
 * - iterator(): retorna Iterator<T>
 * 
 * HIERARQUIA:
 * Iterable
 *   └── Collection
 *         ├── List (ArrayList, LinkedList)
 *         ├── Set (HashSet, TreeSet)
 *         └── Queue (LinkedList, PriorityQueue)
 * 
 * FOR-EACH REQUER:
 * Implementar Iterable
 * Fornecer iterator()
 */
```

**Iterable**: interface raiz. Método iterator(). Collection extends Iterable.

### 2. Collection e Iterable

```java
// Collection extends Iterable
public class CollectionIterable {
    public static void main(String[] args) {
        // Collection HERDA de Iterable
        // public interface Collection<E> extends Iterable<E> {
        //     // métodos Collection
        // }
        
        // TODAS Collections são Iterable
        // List, Set, Queue
        
        // ✅ List é Iterable
        List<String> lista = Arrays.asList("A", "B", "C");
        for (String s : lista) {
            System.out.println(s);
        }
        
        // ✅ Set é Iterable
        Set<Integer> conjunto = Set.of(1, 2, 3);
        for (Integer n : conjunto) {
            System.out.println(n);
        }
        
        // ✅ Queue é Iterable
        Queue<String> fila = new LinkedList<>();
        fila.offer("X");
        for (String item : fila) {
            System.out.println(item);
        }
        
        // ✅ Collection genérica é Iterable
        Collection<String> colecao = new ArrayList<>();
        colecao.add("Elemento");
        for (String elemento : colecao) {
            System.out.println(elemento);
        }
    }
}

/*
 * HIERARQUIA:
 * 
 * Iterable<E>
 *   └── Collection<E>
 *         ├── List<E>
 *         ├── Set<E>
 *         └── Queue<E>
 * 
 * TODAS COLLECTIONS SÃO ITERABLE:
 * - List: ArrayList, LinkedList, Vector
 * - Set: HashSet, TreeSet, LinkedHashSet
 * - Queue: LinkedList, PriorityQueue
 * - Deque: ArrayDeque, LinkedList
 * 
 * FOR-EACH FUNCIONA:
 * Qualquer Collection
 */
```

**Collection**: extends Iterable. Todas Collections são Iterable. For-each funciona.

### 3. Map e Iterable

```java
// Map NÃO é Iterable
public class MapIterable {
    public static void main(String[] args) {
        Map<String, Integer> mapa = new HashMap<>();
        mapa.put("Ana", 25);
        mapa.put("Bruno", 30);
        
        // ❌ ERRO: Map não é Iterable
        // for (??? : mapa) {  // ERRO compilação
        // }
        
        // ✅ SOLUÇÃO: iterar entrySet, keySet, values
        // (são Collections, portanto Iterable)
        
        // entrySet() -> Set<Entry<K,V>> (Iterable)
        for (Map.Entry<String, Integer> entry : mapa.entrySet()) {
            System.out.println(entry.getKey() + " = " + entry.getValue());
        }
        
        // keySet() -> Set<K> (Iterable)
        for (String chave : mapa.keySet()) {
            System.out.println("Chave: " + chave);
        }
        
        // values() -> Collection<V> (Iterable)
        for (Integer valor : mapa.values()) {
            System.out.println("Valor: " + valor);
        }
    }
}

/*
 * MAP NÃO É ITERABLE:
 * 
 * Map NÃO extends Iterable
 * Map NÃO extends Collection
 * 
 * SOLUÇÃO:
 * 
 * entrySet() -> Set<Entry<K,V>>
 * keySet() -> Set<K>
 * values() -> Collection<V>
 * 
 * TODOS SÃO ITERABLE:
 * for (var entry : map.entrySet()) { }
 * for (var key : map.keySet()) { }
 * for (var value : map.values()) { }
 */
```

**Map**: **não** é Iterable. Usar entrySet(), keySet(), values() (são Iterable).

### 4. Arrays e For-each

```java
// Arrays com for-each
public class ArraysForEach {
    public static void main(String[] args) {
        // Arrays NÃO implementam Iterable
        // MAS for-each funciona
        // Compilador converte automaticamente
        
        // ✅ Array String
        String[] nomes = {"Ana", "Bruno", "Carlos"};
        for (String nome : nomes) {
            System.out.println(nome);
        }
        
        // ✅ Array int
        int[] numeros = {1, 2, 3, 4, 5};
        for (int num : numeros) {
            System.out.println(num);
        }
        
        // ✅ Array Object
        Object[] objetos = {new Object(), new Object()};
        for (Object obj : objetos) {
            System.out.println(obj);
        }
        
        // COMPILADOR CONVERTE:
        // for (String nome : nomes)
        // PARA:
        // for (int i = 0; i < nomes.length; i++) {
        //     String nome = nomes[i];
        // }
    }
}

/*
 * ARRAYS FOR-EACH:
 * 
 * Arrays NÃO implementam Iterable
 * For-each funciona via compilador
 * 
 * CONVERSÃO:
 * for (Tipo elemento : array) { }
 * 
 * COMPILADOR GERA:
 * for (int i = 0; i < array.length; i++) {
 *     Tipo elemento = array[i];
 * }
 * 
 * FUNCIONA:
 * - String[]
 * - int[]
 * - Object[]
 * - Qualquer array
 */
```

**Arrays**: **não** Iterable. For-each funciona compilador converte automaticamente.

### 5. Classe Customizada Iterable

```java
// ✅ Classe customizada implementando Iterable
public class MinhaColecao implements Iterable<String> {
    private List<String> elementos = new ArrayList<>();
    
    public void adicionar(String elemento) {
        elementos.add(elemento);
    }
    
    @Override
    public Iterator<String> iterator() {
        return elementos.iterator();
    }
    
    public static void main(String[] args) {
        MinhaColecao colecao = new MinhaColecao();
        colecao.adicionar("A");
        colecao.adicionar("B");
        colecao.adicionar("C");
        
        // ✅ For-each funciona (implementa Iterable)
        for (String elemento : colecao) {
            System.out.println(elemento);
        }
    }
}

/*
 * IMPLEMENTAR ITERABLE:
 * 
 * public class MinhaClasse implements Iterable<T> {
 *     @Override
 *     public Iterator<T> iterator() {
 *         // retornar Iterator
 *     }
 * }
 * 
 * FOR-EACH FUNCIONA:
 * for (T elemento : minhaClasse) { }
 * 
 * COMPILADOR USA:
 * Iterator<T> it = minhaClasse.iterator();
 * while (it.hasNext()) {
 *     T elemento = it.next();
 * }
 */
```

**Customizada**: implementar Iterable<T>, fornecer iterator(). For-each funciona.

### 6. Como For-each Funciona Internamente

```java
// Como for-each funciona
public class ForEachInterno {
    public static void main(String[] args) {
        List<String> lista = Arrays.asList("A", "B", "C");
        
        // ✅ FOR-EACH (código)
        for (String elemento : lista) {
            System.out.println(elemento);
        }
        
        // COMPILADOR CONVERTE PARA:
        Iterator<String> it = lista.iterator();
        while (it.hasNext()) {
            String elemento = it.next();
            System.out.println(elemento);
        }
        
        // PROCESSO:
        // 1. Chama iterator() na coleção
        // 2. Cria Iterator
        // 3. Loop while(hasNext())
        // 4. Chama next() cada iteração
        // 5. Atribui variável temporária
    }
}

/*
 * CONVERSÃO FOR-EACH:
 * 
 * CÓDIGO:
 * for (Tipo elemento : colecao) {
 *     // usar elemento
 * }
 * 
 * COMPILADOR GERA:
 * Iterator<Tipo> it = colecao.iterator();
 * while (it.hasNext()) {
 *     Tipo elemento = it.next();
 *     // usar elemento
 * }
 * 
 * PROCESSO:
 * 1. colecao.iterator() -> Iterator
 * 2. while (it.hasNext())
 * 3. elemento = it.next()
 * 4. Executar corpo loop
 * 5. Repetir 2-4
 */
```

**Internamente**: compilador chama iterator(), loop while(hasNext()), next() cada iteração.

### 7. Métodos Aceitando Iterable

```java
// ✅ Métodos com parâmetro Iterable
public class MetodosIterable {
    // ✅ Parâmetro Iterable (flexível)
    public static void imprimir(Iterable<String> iterable) {
        for (String elemento : iterable) {
            System.out.println(elemento);
        }
    }
    
    // ✅ Genérico com Iterable
    public static <T> void imprimirGenerico(Iterable<T> iterable) {
        for (T elemento : iterable) {
            System.out.println(elemento);
        }
    }
    
    public static void main(String[] args) {
        // ✅ Aceita List
        List<String> lista = Arrays.asList("A", "B", "C");
        imprimir(lista);
        
        // ✅ Aceita Set
        Set<String> conjunto = Set.of("X", "Y", "Z");
        imprimir(conjunto);
        
        // ✅ Aceita qualquer Iterable
        Collection<String> colecao = new ArrayList<>();
        colecao.add("Elemento");
        imprimir(colecao);
        
        // ✅ Genérico
        List<Integer> numeros = Arrays.asList(1, 2, 3);
        imprimirGenerico(numeros);
    }
}

/*
 * PARÂMETRO ITERABLE:
 * 
 * VANTAGEM:
 * Aceita qualquer Collection
 * List, Set, Queue
 * Classe customizada Iterable
 * 
 * ASSINATURA:
 * public void metodo(Iterable<T> iterable) { }
 * 
 * USO:
 * for (T elemento : iterable) { }
 * 
 * FLEXIBILIDADE:
 * Não restrito List, Set, etc
 * Qualquer Iterable funciona
 */
```

**Métodos**: parâmetro Iterable<T> flexível. Aceita qualquer Collection, customizado.

### 8. Resumo Visual

```java
/*
 * USO COM COLLECTION E ITERABLE
 * 
 * INTERFACE ITERABLE:
 * public interface Iterable<T> {
 *     Iterator<T> iterator();
 * }
 * 
 * HIERARQUIA:
 * Iterable<E>
 *   └── Collection<E>
 *         ├── List<E> (ArrayList, LinkedList)
 *         ├── Set<E> (HashSet, TreeSet)
 *         └── Queue<E> (LinkedList, PriorityQueue)
 * 
 * FOR-EACH FUNCIONA:
 * 
 * 1. COLLECTIONS (extends Iterable):
 *    List, Set, Queue, Deque
 *    for (T elemento : collection) { }
 * 
 * 2. ARRAYS (suporte especial):
 *    String[], int[], Object[]
 *    for (T elemento : array) { }
 * 
 * 3. CLASSES CUSTOMIZADAS (implements Iterable):
 *    class MinhaClasse implements Iterable<T> {
 *        public Iterator<T> iterator() { }
 *    }
 *    for (T elemento : minhaClasse) { }
 * 
 * MAP (NÃO É ITERABLE):
 * 
 * Map NÃO extends Iterable
 * 
 * SOLUÇÃO:
 * - entrySet() -> Set<Entry<K,V>>
 * - keySet() -> Set<K>
 * - values() -> Collection<V>
 * 
 * for (var entry : map.entrySet()) { }
 * for (var key : map.keySet()) { }
 * for (var value : map.values()) { }
 * 
 * CONVERSÃO COMPILADOR:
 * 
 * CÓDIGO:
 * for (T elemento : iterable) {
 *     System.out.println(elemento);
 * }
 * 
 * COMPILADOR GERA:
 * Iterator<T> it = iterable.iterator();
 * while (it.hasNext()) {
 *     T elemento = it.next();
 *     System.out.println(elemento);
 * }
 * 
 * PROCESSO:
 * 1. Chama iterator()
 * 2. Loop while(hasNext())
 * 3. Chama next()
 * 4. Atribui variável
 * 5. Executa corpo
 * 
 * IMPLEMENTAR ITERABLE:
 * 
 * public class MinhaColecao implements Iterable<T> {
 *     private List<T> elementos = new ArrayList<>();
 *     
 *     @Override
 *     public Iterator<T> iterator() {
 *         return elementos.iterator();
 *     }
 * }
 * 
 * MÉTODOS:
 * 
 * Parâmetro Iterable (flexível):
 * public void processar(Iterable<T> iterable) {
 *     for (T elemento : iterable) { }
 * }
 * 
 * Aceita:
 * - List, Set, Queue
 * - Classes customizadas
 * - Qualquer Iterable
 */

// ✅ EXEMPLO COMPLETO
public class ExemploCompleto {
    public static void main(String[] args) {
        // Collection (Iterable)
        List<String> lista = Arrays.asList("A", "B", "C");
        for (String s : lista) {
            System.out.println(s);
        }
        
        // Array (suporte especial)
        String[] array = {"X", "Y", "Z"};
        for (String s : array) {
            System.out.println(s);
        }
    }
}
```

---

## Aplicabilidade

**For-each funciona**:
- **Collections**: List, Set, Queue (extends Iterable)
- **Arrays**: suporte especial compilador
- **Classes customizadas**: implements Iterable<T>

**Quando usar**:
- **Iterar** qualquer Collection
- **Métodos** parâmetro Iterable (flexível)
- **Classes** próprias (implementar Iterable)

---

## Armadilhas

### 1. Map Não É Iterable

```java
// ❌ Map não é Iterable
Map<String, Integer> mapa = new HashMap<>();
// for (??? : mapa) { }  // ERRO

// ✅ Usar entrySet, keySet, values
for (var entry : mapa.entrySet()) { }
```

### 2. Implementar iterator()

```java
// ❌ Esquecer implementar iterator()
class MinhaClasse implements Iterable<String> {
    // ERRO: não implementa iterator()
}

// ✅ Implementar obrigatório
class MinhaClasse implements Iterable<String> {
    @Override
    public Iterator<String> iterator() {
        return elementos.iterator();
    }
}
```

---

## Boas Práticas

### 1. Parâmetro Iterable

```java
// ✅ Iterable flexível
public void processar(Iterable<String> iterable) { }

// ❌ List específico inflexível
public void processar(List<String> lista) { }
```

### 2. Implementar Iterable Classes Customizadas

```java
// ✅ Implementar Iterable
public class MinhaColecao implements Iterable<T> {
    @Override
    public Iterator<T> iterator() {
        return elementos.iterator();
    }
}

// For-each funciona
for (T elemento : minhaColecao) { }
```

### 3. Delegar Iterator

```java
// ✅ Delegar para Collection interna
public class MinhaColecao implements Iterable<String> {
    private List<String> elementos = new ArrayList<>();
    
    @Override
    public Iterator<String> iterator() {
        return elementos.iterator();  // Delegar
    }
}
```

---

## Resumo

**Interface Iterable**:
- Método **iterator()** retorna Iterator<T>
- **Collection** extends Iterable
- For-each requer Iterable

**Hierarquia**:
- Iterable → Collection → (List, Set, Queue)
- **Todas** Collections são Iterable
- For-each funciona todas

**Map**:
- **Não** é Iterable
- **Não** extends Collection
- Usar **entrySet()**, **keySet()**, **values()** (são Iterable)

**Arrays**:
- **Não** implementam Iterable
- For-each funciona **compilador** converte
- String[], int[], Object[]

**Classe customizada**:
- **implements Iterable<T>**
- Implementar **iterator()**
- For-each funciona

**Conversão compilador**:
- for (T elemento : iterable) { }
- Compilador gera: Iterator it = iterable.iterator(); while(hasNext()) elemento = next()
- Processo: iterator(), hasNext(), next()

**Métodos**:
- Parâmetro **Iterable<T>** flexível
- Aceita List, Set, Queue, customizado
- Mais genérico que Collection

**Regra de Ouro**: For-each funciona qualquer Iterable Collection extends Iterable todas List Set Queue são Iterable. Map NÃO Iterable usar entrySet keySet values são Iterable. Arrays não Iterable compilador converte automaticamente. Classe customizada implements Iterable fornecer iterator retorna Iterator for-each funciona. Conversão compilador chama iterator loop while hasNext next atribui variável. Métodos parâmetro Iterable flexível aceita qualquer Collection customizado mais genérico. Implementar Iterable classes próprias delegar Collection interna elementos.iterator simples. SEMPRE Iterable Collection arrays customizado for-each funciona automaticamente.

