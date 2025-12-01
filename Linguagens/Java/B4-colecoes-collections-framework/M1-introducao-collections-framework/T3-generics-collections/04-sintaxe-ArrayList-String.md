# T3.04 - Sintaxe: ArrayList<String>

## Introdução

**Sintaxe generics**: Interface<Tipo> referência = new Implementação<Tipo>()

```java
import java.util.*;

// ✅ Sintaxe completa
public class SintaxeCompleta {
    public static void main(String[] args) {
        // ✅ ArrayList<String>
        List<String> lista = new ArrayList<String>();
        
        // ✅ HashSet<Integer>
        Set<Integer> conjunto = new HashSet<Integer>();
        
        // ✅ HashMap<String, Integer>
        Map<String, Integer> mapa = new HashMap<String, Integer>();
    }
}
```

**Regra**: Tipo especificado em **declaração** e **construção**. Interface<T> ref = new Classe<T>()

---

## Fundamentos

### 1. Sintaxe Básica

```java
// ✅ Sintaxe ArrayList<String>
public class SintaxeBasica {
    public static void main(String[] args) {
        // ✅ FORMA COMPLETA
        List<String> lista1 = new ArrayList<String>();
        
        // COMPONENTES:
        // List<String>        - Interface parametrizada (tipo referência)
        // lista1              - Nome variável
        // new ArrayList<String>() - Implementação parametrizada
        
        // ✅ Usando implementação concreta (menos comum)
        ArrayList<String> lista2 = new ArrayList<String>();
        
        // ✅ Set
        Set<Integer> conjunto = new HashSet<Integer>();
        
        // ✅ Map (dois tipos)
        Map<String, Integer> mapa = new HashMap<String, Integer>();
    }
}

/*
 * SINTAXE:
 * 
 * Interface<TipoParametro> variavel = new Implementacao<TipoParametro>();
 * 
 * EXEMPLOS:
 * List<String> lista = new ArrayList<String>();
 * Set<Integer> conjunto = new HashSet<Integer>();
 * Map<K, V> mapa = new HashMap<K, V>();
 * 
 * PREFERIR:
 * - Interface como tipo referência
 * - Implementação no new
 */
```

**Sintaxe**: Interface<T> var = new Classe<T>(). Preferir interface como tipo.

### 2. Diferentes Tipos Parametrizados

```java
// ✅ Tipos parametrizados comuns
public class TiposParametrizados {
    public static void main(String[] args) {
        // ✅ String
        List<String> strings = new ArrayList<String>();
        strings.add("Java");
        
        // ✅ Integer
        List<Integer> inteiros = new ArrayList<Integer>();
        inteiros.add(10);
        
        // ✅ Double
        List<Double> doubles = new ArrayList<Double>();
        doubles.add(10.5);
        
        // ✅ Boolean
        List<Boolean> booleanos = new ArrayList<Boolean>();
        booleanos.add(true);
        
        // ✅ Classe customizada
        class Pessoa {
            String nome;
            Pessoa(String nome) { this.nome = nome; }
        }
        
        List<Pessoa> pessoas = new ArrayList<Pessoa>();
        pessoas.add(new Pessoa("Ana"));
        
        // ✅ Interface
        List<Runnable> tasks = new ArrayList<Runnable>();
        tasks.add(() -> System.out.println("Task"));
    }
}

/*
 * TIPOS ACEITOS:
 * 
 * WRAPPERS:
 * List<Integer>
 * List<Double>
 * List<Boolean>
 * 
 * CLASSES:
 * List<String>
 * List<Date>
 * List<MinhaClasse>
 * 
 * INTERFACES:
 * List<Runnable>
 * List<Comparable>
 * 
 * NÃO ACEITA:
 * List<int>  ❌ (primitivo)
 */
```

**Tipos**: wrappers, classes, interfaces. **Não** aceita primitivos.

### 3. Implementações ArrayList

```java
// ✅ Diferentes implementações List
public class ImplementacoesList {
    public static void main(String[] args) {
        // ✅ ArrayList (mais comum)
        List<String> arrayList = new ArrayList<String>();
        
        // ✅ LinkedList
        List<String> linkedList = new LinkedList<String>();
        
        // ✅ Vector (thread-safe, legado)
        List<String> vector = new Vector<String>();
        
        // ✅ CopyOnWriteArrayList (concurrent)
        List<String> copyOnWrite = new CopyOnWriteArrayList<String>();
        
        // ✅ Arrays.asList (imutável tamanho)
        List<String> asList = Arrays.asList("A", "B", "C");
        
        // ✅ List.of (Java 9+, imutável)
        List<String> listOf = List.of("A", "B", "C");
    }
}

/*
 * IMPLEMENTAÇÕES LIST:
 * 
 * ArrayList:
 * - Mais comum
 * - Acesso rápido por índice
 * - Inserção/remoção meio lenta
 * 
 * LinkedList:
 * - Inserção/remoção rápida
 * - Acesso por índice lento
 * 
 * Vector:
 * - Thread-safe (legado)
 * - Usar CopyOnWriteArrayList
 * 
 * CopyOnWriteArrayList:
 * - Thread-safe
 * - Concurrent
 */
```

**Implementações**: ArrayList (comum), LinkedList, Vector, CopyOnWriteArrayList.

### 4. Implementações Set

```java
// ✅ Diferentes implementações Set
public class ImplementacoesSet {
    public static void main(String[] args) {
        // ✅ HashSet (mais comum)
        Set<String> hashSet = new HashSet<String>();
        
        // ✅ LinkedHashSet (mantém ordem inserção)
        Set<String> linkedHashSet = new LinkedHashSet<String>();
        
        // ✅ TreeSet (ordenado)
        Set<String> treeSet = new TreeSet<String>();
        
        // ✅ ConcurrentHashSet (não existe, usar newKeySet)
        Set<String> concurrentSet = ConcurrentHashMap.<String>newKeySet();
        
        // ✅ Set.of (Java 9+, imutável)
        Set<String> setOf = Set.of("A", "B", "C");
    }
}

/*
 * IMPLEMENTAÇÕES SET:
 * 
 * HashSet:
 * - Mais rápido
 * - Sem ordem
 * - Permite null
 * 
 * LinkedHashSet:
 * - Mantém ordem inserção
 * - Pouco mais lento
 * 
 * TreeSet:
 * - Ordenado (natural/comparator)
 * - Mais lento
 * - Não permite null
 */
```

**Implementações Set**: HashSet (rápido), LinkedHashSet (ordem), TreeSet (ordenado).

### 5. Implementações Map

```java
// ✅ Diferentes implementações Map
public class ImplementacoesMap {
    public static void main(String[] args) {
        // ✅ HashMap (mais comum)
        Map<String, Integer> hashMap = new HashMap<String, Integer>();
        
        // ✅ LinkedHashMap (mantém ordem inserção)
        Map<String, Integer> linkedHashMap = new LinkedHashMap<String, Integer>();
        
        // ✅ TreeMap (ordenado por chave)
        Map<String, Integer> treeMap = new TreeMap<String, Integer>();
        
        // ✅ ConcurrentHashMap (thread-safe)
        Map<String, Integer> concurrentMap = new ConcurrentHashMap<String, Integer>();
        
        // ✅ Hashtable (legado, thread-safe)
        Map<String, Integer> hashtable = new Hashtable<String, Integer>();
        
        // ✅ Map.of (Java 9+, imutável)
        Map<String, Integer> mapOf = Map.of("A", 1, "B", 2);
    }
}

/*
 * IMPLEMENTAÇÕES MAP:
 * 
 * HashMap:
 * - Mais rápido
 * - Sem ordem
 * - Permite null chave (1) e valores
 * 
 * LinkedHashMap:
 * - Mantém ordem inserção
 * - Pouco mais lento
 * 
 * TreeMap:
 * - Ordenado por chave
 * - Mais lento
 * - Não permite null chave
 * 
 * ConcurrentHashMap:
 * - Thread-safe
 * - Não permite null
 */
```

**Implementações Map**: HashMap (rápido), LinkedHashMap (ordem), TreeMap (ordenado).

### 6. Interface vs Implementação

```java
// ✅ Interface vs Implementação
public class InterfaceVsImplementacao {
    public static void main(String[] args) {
        // ✅ PREFERIR: Interface como tipo
        List<String> lista1 = new ArrayList<String>();
        
        // ❌ EVITAR: Implementação como tipo
        ArrayList<String> lista2 = new ArrayList<String>();
        
        // VANTAGEM Interface:
        // Pode trocar implementação facilmente
        List<String> lista3 = new ArrayList<String>();
        lista3 = new LinkedList<String>();  // OK
        
        // PROBLEMA Implementação:
        ArrayList<String> lista4 = new ArrayList<String>();
        // lista4 = new LinkedList<String>();  // ERRO: tipos incompatíveis
    }
    
    // ✅ Parâmetro interface: flexível
    public static void processar(List<String> lista) {
        // Aceita ArrayList, LinkedList, etc
    }
    
    // ❌ Parâmetro implementação: inflexível
    public static void processarArrayList(ArrayList<String> lista) {
        // Aceita APENAS ArrayList
    }
}

/*
 * PREFERIR INTERFACE:
 * 
 * VANTAGENS:
 * - Flexibilidade (trocar implementação)
 * - Polimorfismo
 * - Métodos aceitam qualquer implementação
 * 
 * QUANDO USAR IMPLEMENTAÇÃO:
 * - Precisa métodos específicos
 * - ArrayList.ensureCapacity()
 * - LinkedList.addFirst()
 */
```

**Preferir interface**: flexível, polimórfico. Implementação quando precisa métodos específicos.

### 7. Sintaxe Completa Exemplos

```java
// ✅ Exemplos sintaxe completa
public class ExemplosSintaxe {
    public static void main(String[] args) {
        // ✅ List<String>
        List<String> nomes = new ArrayList<String>();
        nomes.add("Ana");
        nomes.add("Bruno");
        
        // ✅ Set<Integer>
        Set<Integer> numeros = new HashSet<Integer>();
        numeros.add(10);
        numeros.add(20);
        
        // ✅ Map<String, Integer>
        Map<String, Integer> idades = new HashMap<String, Integer>();
        idades.put("Ana", 25);
        idades.put("Bruno", 30);
        
        // ✅ Queue<String>
        Queue<String> fila = new LinkedList<String>();
        fila.offer("Primeiro");
        fila.offer("Segundo");
        
        // ✅ Deque<String>
        Deque<String> deque = new ArrayDeque<String>();
        deque.addFirst("Inicio");
        deque.addLast("Fim");
        
        // ✅ Aninhado Map<String, List<String>>
        Map<String, List<String>> grupos = new HashMap<String, List<String>>();
        
        List<String> grupo1 = new ArrayList<String>();
        grupo1.add("Membro1");
        grupo1.add("Membro2");
        
        grupos.put("Equipe A", grupo1);
    }
}
```

**Exemplos**: List, Set, Map, Queue, Deque, aninhados. Sintaxe consistente.

### 8. Resumo Visual

```java
/*
 * SINTAXE: ArrayList<String>
 * 
 * FORMA COMPLETA:
 * Interface<Tipo> variavel = new Implementacao<Tipo>();
 * 
 * EXEMPLOS:
 * 
 * List<String> lista = new ArrayList<String>();
 * Set<Integer> conjunto = new HashSet<Integer>();
 * Map<String, Integer> mapa = new HashMap<String, Integer>();
 * 
 * COMPONENTES:
 * 
 * List<String>           - Interface parametrizada (tipo referência)
 * lista                  - Nome variável
 * new ArrayList<String>  - Implementação parametrizada
 * ()                     - Construtor
 * 
 * TIPOS ACEITOS:
 * ✅ Wrappers: Integer, Double, Boolean
 * ✅ Classes: String, Date, MinhaClasse
 * ✅ Interfaces: Runnable, Comparable
 * ❌ Primitivos: int, double (usar wrappers)
 * 
 * IMPLEMENTAÇÕES:
 * 
 * List:
 * - ArrayList (comum)
 * - LinkedList
 * - Vector (legado)
 * - CopyOnWriteArrayList (concurrent)
 * 
 * Set:
 * - HashSet (comum)
 * - LinkedHashSet (ordem)
 * - TreeSet (ordenado)
 * 
 * Map:
 * - HashMap (comum)
 * - LinkedHashMap (ordem)
 * - TreeMap (ordenado)
 * - ConcurrentHashMap (concurrent)
 * 
 * PREFERIR:
 * ✅ List<String> lista = new ArrayList<String>();
 * ❌ ArrayList<String> lista = new ArrayList<String>();
 * 
 * Interface como tipo referência
 * Flexível, polimórfico
 */

public class ExemploSintaxe {
    public static void main(String[] args) {
        // ✅ Sintaxe padrão
        List<String> lista = new ArrayList<String>();
        lista.add("Java");
        
        Set<Integer> conjunto = new HashSet<Integer>();
        conjunto.add(10);
        
        Map<String, Integer> mapa = new HashMap<String, Integer>();
        mapa.put("Ana", 25);
    }
}
```

---

## Aplicabilidade

**Sintaxe**:
- **Declarar** coleções tipadas
- **Criar** instâncias parametrizadas
- **Especificar** tipo em compilação

**Quando usar**:
- **Sempre** com coleções
- APIs que retornam coleções
- Variáveis locais, campos, parâmetros

---

## Armadilhas

### 1. Primitivos Não Permitidos

```java
// ❌ Primitivo não aceito
// List<int> numeros = new ArrayList<int>();

// ✅ Usar wrapper
List<Integer> numeros = new ArrayList<Integer>();
```

### 2. Implementação Como Tipo

```java
// ❌ Inflexível
ArrayList<String> lista = new ArrayList<String>();

// ✅ Flexível
List<String> lista = new ArrayList<String>();
```

---

## Boas Práticas

### 1. Interface Como Tipo

```java
// ✅ Interface
List<String> lista = new ArrayList<String>();

// ❌ Implementação
ArrayList<String> lista = new ArrayList<String>();
```

### 2. Sempre Parametrizar

```java
// ✅ Parametrizado
List<String> lista = new ArrayList<String>();

// ❌ Raw type
List lista = new ArrayList();
```

### 3. Usar Wrappers

```java
// ✅ Wrapper
List<Integer> numeros = new ArrayList<Integer>();

// ❌ Primitivo (não compila)
// List<int> numeros = new ArrayList<int>();
```

---

## Resumo

**Sintaxe**:
- Interface<**Tipo**> var = new Classe<**Tipo**>()
- **Tipo** em declaração E construção
- Preferir **interface** como tipo referência

**Exemplos**:
- List<String> lista = new ArrayList<String>()
- Set<Integer> conjunto = new HashSet<Integer>()
- Map<String, Integer> mapa = new HashMap<String, Integer>()

**Tipos aceitos**:
- **Wrappers**: Integer, Double, Boolean
- **Classes**: String, Date, customizadas
- **Interfaces**: Runnable, Comparable
- **Não** aceita: primitivos (int, double)

**Implementações**:
- **List**: ArrayList (comum), LinkedList, Vector
- **Set**: HashSet (comum), LinkedHashSet, TreeSet
- **Map**: HashMap (comum), LinkedHashMap, TreeMap

**Interface vs Implementação**:
- **Preferir** interface: flexível, polimórfico
- **Evitar** implementação: inflexível
- **Exceção**: métodos específicos (ensureCapacity)

**Componentes**:
- List<String> - interface parametrizada
- lista - nome variável
- new ArrayList<String>() - implementação + construtor

**Regra de Ouro**: Sintaxe Interface tipo var new Classe tipo construtor. Tipo especificado declaração construção. Preferir interface tipo referência flexível polimórfico. Aceita wrappers classes interfaces não primitivos. Implementações ArrayList HashSet HashMap comuns. Sempre parametrizar evitar raw types. Interface permite trocar implementação facilmente.

