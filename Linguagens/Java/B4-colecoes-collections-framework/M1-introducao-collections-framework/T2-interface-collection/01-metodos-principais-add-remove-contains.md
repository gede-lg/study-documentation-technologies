# T2.01 - Métodos Principais: add(), remove(), contains()

## Introdução

**Interface Collection**: define métodos **fundamentais** para manipular coleções.

```java
import java.util.*;

/*
 * MÉTODOS PRINCIPAIS
 * 
 * add(E element):
 * - Adiciona elemento na coleção
 * - Retorna true se modificou
 * - Retorna false se não permitiu (Set com duplicata)
 * 
 * remove(Object o):
 * - Remove elemento da coleção
 * - Retorna true se removeu
 * - Retorna false se não encontrou
 * 
 * contains(Object o):
 * - Verifica se contém elemento
 * - Retorna true se encontrou
 * - Retorna false se não encontrou
 */

// ✅ Uso básico
public class ExemploBasico {
    public static void main(String[] args) {
        Collection<String> colecao = new ArrayList<>();
        
        // ✅ add(): adicionar elementos
        colecao.add("Java");     // true (adicionado)
        colecao.add("Python");   // true
        colecao.add("C++");      // true
        
        // ✅ contains(): verificar se contém
        boolean tem = colecao.contains("Java");  // true
        boolean naoTem = colecao.contains("Ruby");  // false
        
        // ✅ remove(): remover elemento
        boolean removeu = colecao.remove("Python");  // true (removido)
        boolean naoRemoveu = colecao.remove("Ruby");  // false (não existe)
        
        System.out.println(colecao);  // [Java, C++]
    }
}
```

**Regra**: add() adiciona, remove() **remove**, contains() **verifica** presença.

---

## Fundamentos

### 1. Método add(E element)

```java
// ✅ add(): adicionar elementos
public class MetodoAdd {
    public static void main(String[] args) {
        // ✅ ArrayList: sempre retorna true
        Collection<String> lista = new ArrayList<>();
        boolean adicionou1 = lista.add("A");  // true
        boolean adicionou2 = lista.add("B");  // true
        boolean adicionou3 = lista.add("A");  // true (PERMITE duplicata)
        
        System.out.println(lista);  // [A, B, A]
        
        // ✅ HashSet: retorna false se duplicata
        Collection<String> conjunto = new HashSet<>();
        boolean adicionou4 = conjunto.add("X");  // true
        boolean adicionou5 = conjunto.add("Y");  // true
        boolean adicionou6 = conjunto.add("X");  // false (NÃO permite duplicata)
        
        System.out.println(conjunto);  // [X, Y]
    }
}

/*
 * add(E element):
 * 
 * ASSINATURA:
 * boolean add(E element)
 * 
 * RETORNO:
 * - true: se coleção MODIFICOU (elemento adicionado)
 * - false: se coleção NÃO modificou (ex: Set com duplicata)
 * 
 * COMPORTAMENTO:
 * 
 * LIST (ArrayList, LinkedList):
 * - SEMPRE adiciona
 * - SEMPRE retorna true
 * - PERMITE duplicatas
 * - Ordem inserção preservada
 * 
 * SET (HashSet, TreeSet):
 * - Adiciona se NÃO existir
 * - Retorna true se adicionou
 * - Retorna false se já existe (duplicata)
 * - NÃO permite duplicatas
 * 
 * QUEUE (LinkedList, PriorityQueue):
 * - Adiciona no final (ou posição ordenada)
 * - Retorna true se adicionou
 * - Pode lançar exceção se fila cheia (capacidade limitada)
 * 
 * EXCEÇÕES:
 * - UnsupportedOperationException: se add() não suportado (coleção imutável)
 * - ClassCastException: se tipo elemento incompatível
 * - NullPointerException: se null não permitido (algumas implementações)
 * - IllegalArgumentException: se propriedade elemento impede adição
 */
```

**add()**: retorna **true** se modificou, **false** se não (Set duplicata).

### 2. Método remove(Object o)

```java
// ✅ remove(): remover elementos
public class MetodoRemove {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        lista.add("A");  // Duplicata
        
        // ✅ Remove primeira ocorrência
        boolean removeu1 = lista.remove("A");  // true (remove primeiro "A")
        System.out.println(lista);  // [B, C, A]
        
        boolean removeu2 = lista.remove("B");  // true
        System.out.println(lista);  // [C, A]
        
        boolean removeu3 = lista.remove("X");  // false (não existe)
        System.out.println(lista);  // [C, A]
        
        // ✅ HashSet: remove elemento
        Collection<Integer> conjunto = new HashSet<>();
        conjunto.add(10);
        conjunto.add(20);
        conjunto.add(30);
        
        boolean removeu4 = conjunto.remove(20);  // true
        System.out.println(conjunto);  // [10, 30]
        
        boolean removeu5 = conjunto.remove(99);  // false (não existe)
    }
}

/*
 * remove(Object o):
 * 
 * ASSINATURA:
 * boolean remove(Object o)
 * 
 * RETORNO:
 * - true: se elemento REMOVIDO
 * - false: se elemento NÃO encontrado
 * 
 * COMPORTAMENTO:
 * 
 * LIST:
 * - Remove PRIMEIRA ocorrência
 * - Se duplicatas, remove apenas primeira
 * - Usa equals() para comparar
 * 
 * SET:
 * - Remove elemento (não há duplicatas)
 * - Usa equals() e hashCode()
 * 
 * COMPARAÇÃO:
 * - Usa equals() do objeto
 * - NÃO usa == (identidade)
 * - Elemento null pode ser removido se permitido
 * 
 * EXCEÇÕES:
 * - UnsupportedOperationException: se remove() não suportado
 * - ClassCastException: se tipo incompatível
 * - NullPointerException: se null não permitido
 */
```

**remove()**: retorna **true** se removeu, **false** se não encontrou. Lista: remove **primeira** ocorrência.

### 3. Método contains(Object o)

```java
// ✅ contains(): verificar presença
public class MetodoContains {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("Java");
        lista.add("Python");
        lista.add("C++");
        
        // ✅ Verificar se contém
        boolean tem1 = lista.contains("Java");    // true
        boolean tem2 = lista.contains("Python");  // true
        boolean tem3 = lista.contains("Ruby");    // false
        boolean tem4 = lista.contains("java");    // false (case-sensitive)
        
        // ✅ Com null
        lista.add(null);
        boolean tem5 = lista.contains(null);  // true
        
        // ✅ HashSet: busca rápida O(1)
        Collection<Integer> conjunto = new HashSet<>();
        conjunto.add(10);
        conjunto.add(20);
        conjunto.add(30);
        
        boolean tem6 = conjunto.contains(20);  // true (O(1))
        boolean tem7 = conjunto.contains(99);  // false
    }
}

/*
 * contains(Object o):
 * 
 * ASSINATURA:
 * boolean contains(Object o)
 * 
 * RETORNO:
 * - true: se coleção CONTÉM elemento
 * - false: se coleção NÃO contém
 * 
 * COMPARAÇÃO:
 * - Usa equals() para comparar
 * - NÃO usa == (identidade)
 * - Case-sensitive para Strings
 * - null pode ser verificado se permitido
 * 
 * PERFORMANCE:
 * 
 * LIST (ArrayList, LinkedList):
 * - O(n): percorre TODOS elementos
 * - Usa equals() sequencialmente
 * - LENTO para listas grandes
 * 
 * SET (HashSet):
 * - O(1): busca por HASH
 * - Usa hashCode() e equals()
 * - RÁPIDO mesmo com muitos elementos
 * 
 * SET (TreeSet):
 * - O(log n): busca em ÁRVORE
 * - Usa Comparable/Comparator
 * - Mais rápido que List, mais lento que HashSet
 * 
 * EXCEÇÕES:
 * - ClassCastException: se tipo incompatível
 * - NullPointerException: se null não permitido
 */
```

**contains()**: retorna **true** se encontrou. Performance: HashSet **O(1)**, ArrayList **O(n)**.

### 4. Comparação com equals()

```java
// ✅ Comparação: usa equals()
public class ComparacaoEquals {
    public static void main(String[] args) {
        // ✅ String: equals() compara conteúdo
        Collection<String> lista = new ArrayList<>();
        lista.add("Java");
        
        String s1 = new String("Java");  // Objeto diferente
        boolean tem = lista.contains(s1);  // true (equals() compara conteúdo)
        boolean removeu = lista.remove(s1);  // true
        
        // ✅ Objeto customizado: precisa equals()
        Collection<Pessoa> pessoas = new ArrayList<>();
        pessoas.add(new Pessoa("João", 30));
        
        Pessoa p = new Pessoa("João", 30);  // Mesmo conteúdo
        boolean tem2 = pessoas.contains(p);  // true (se equals() implementado)
        
        // ❌ Sem equals(): usa Object.equals() (identidade ==)
        Collection<PessoaSemEquals> lista2 = new ArrayList<>();
        lista2.add(new PessoaSemEquals("Maria", 25));
        
        PessoaSemEquals ps = new PessoaSemEquals("Maria", 25);
        boolean tem3 = lista2.contains(ps);  // false (objetos diferentes, sem equals())
    }
}

// ✅ Com equals() implementado
class Pessoa {
    String nome;
    int idade;
    
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Pessoa pessoa = (Pessoa) o;
        return idade == pessoa.idade && nome.equals(pessoa.nome);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(nome, idade);
    }
}

// ❌ Sem equals() (usa Object.equals() - identidade)
class PessoaSemEquals {
    String nome;
    int idade;
    
    public PessoaSemEquals(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

/*
 * COMPARAÇÃO EQUALS():
 * 
 * REGRA:
 * - contains(), remove() usam equals()
 * - NÃO usam == (identidade)
 * 
 * STRING:
 * - equals() compara CONTEÚDO
 * - "Java".equals("Java") → true
 * - Objetos diferentes, mesmo conteúdo: equals
 * 
 * OBJETOS CUSTOMIZADOS:
 * - DEVE implementar equals()
 * - Caso contrário usa Object.equals() (==)
 * - Objetos diferentes, mesmo conteúdo: NÃO equals
 * 
 * HASH-BASED (HashSet, HashMap):
 * - DEVE implementar equals() E hashCode()
 * - hashCode() identifica bucket
 * - equals() compara dentro bucket
 */
```

**Comparação**: usa **equals()**, não == (identidade). Objetos customizados: implementar **equals()** e **hashCode()**.

### 5. Performance: List vs Set

```java
// ✅ Performance: List O(n) vs Set O(1)
public class PerformanceListSet {
    public static void main(String[] args) {
        int tamanho = 100000;
        
        // ✅ ArrayList: contains() O(n)
        Collection<Integer> lista = new ArrayList<>();
        for (int i = 0; i < tamanho; i++) {
            lista.add(i);
        }
        
        long inicio1 = System.nanoTime();
        boolean tem1 = lista.contains(99999);  // Percorre TODOS (pior caso)
        long fim1 = System.nanoTime();
        System.out.println("ArrayList.contains(): " + (fim1 - inicio1) + " ns");
        
        // ✅ HashSet: contains() O(1)
        Collection<Integer> conjunto = new HashSet<>();
        for (int i = 0; i < tamanho; i++) {
            conjunto.add(i);
        }
        
        long inicio2 = System.nanoTime();
        boolean tem2 = conjunto.contains(99999);  // Busca DIRETA por hash
        long fim2 = System.nanoTime();
        System.out.println("HashSet.contains(): " + (fim2 - inicio2) + " ns");
        
        // HashSet: ~100-1000x MAIS RÁPIDO que ArrayList
    }
}

/*
 * PERFORMANCE:
 * 
 * ARRAYLIST:
 * add(element):     O(1) amortizado (final da lista)
 * remove(element):  O(n) (precisa encontrar + shift)
 * contains(element): O(n) (percorre todos)
 * 
 * HASHSET:
 * add(element):     O(1) (hash direto)
 * remove(element):  O(1) (hash direto)
 * contains(element): O(1) (hash direto)
 * 
 * TREESET:
 * add(element):     O(log n) (árvore balanceada)
 * remove(element):  O(log n)
 * contains(element): O(log n)
 * 
 * QUANDO USAR:
 * 
 * ArrayList:
 * - Acesso por ÍNDICE frequente
 * - Ordem INSERÇÃO importante
 * - Poucas buscas contains()
 * 
 * HashSet:
 * - Muitas buscas contains()
 * - Não permite DUPLICATAS
 * - Ordem NÃO importa
 * 
 * TreeSet:
 * - Elementos ORDENADOS
 * - Não permite DUPLICATAS
 * - contains() mais rápido que List
 */
```

**Performance**: HashSet contains() **O(1)**, ArrayList **O(n)**. HashSet 100-1000x mais rápido.

### 6. Null Elements

```java
// ✅ Null: permitido em algumas implementações
public class NullElements {
    public static void main(String[] args) {
        // ✅ ArrayList: permite null
        Collection<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add(null);  // ✅ Permitido
        lista.add("B");
        lista.add(null);  // ✅ Múltiplos null permitidos
        
        boolean tem1 = lista.contains(null);  // true
        boolean removeu1 = lista.remove(null);  // true (remove primeiro null)
        
        System.out.println(lista);  // [A, B, null]
        
        // ✅ HashSet: permite UM null
        Collection<String> conjunto = new HashSet<>();
        conjunto.add("X");
        conjunto.add(null);  // ✅ Permitido
        conjunto.add("Y");
        conjunto.add(null);  // Ignora (duplicata)
        
        boolean tem2 = conjunto.contains(null);  // true
        System.out.println(conjunto);  // [null, X, Y]
        
        // ❌ TreeSet: NÃO permite null (NullPointerException)
        try {
            Collection<String> tree = new TreeSet<>();
            tree.add("A");
            tree.add(null);  // ❌ NullPointerException
        } catch (NullPointerException e) {
            System.out.println("TreeSet não permite null");
        }
    }
}

/*
 * NULL ELEMENTS:
 * 
 * ARRAYLIST/LINKEDLIST:
 * ✅ Permite null
 * ✅ Múltiplos null permitidos
 * - add(null) → OK
 * - contains(null) → OK
 * - remove(null) → remove primeiro
 * 
 * HASHSET:
 * ✅ Permite UM null
 * - add(null) primeira vez → OK
 * - add(null) segunda vez → ignora (duplicata)
 * - contains(null) → OK
 * 
 * TREESET:
 * ❌ NÃO permite null
 * - add(null) → NullPointerException
 * - Precisa comparar elementos (null não comparável)
 * 
 * PRIORITYQUEUE:
 * ❌ NÃO permite null
 * - add(null) → NullPointerException
 * 
 * CONCURRENT COLLECTIONS:
 * ❌ Geralmente NÃO permitem null
 * - ConcurrentHashMap: NPE
 * - CopyOnWriteArrayList: permite null
 */
```

**Null**: ArrayList permite **múltiplos**, HashSet permite **um**, TreeSet **não** permite.

### 7. UnsupportedOperationException

```java
// ❌ Coleção imutável: UnsupportedOperationException
public class ColecaoImutavel {
    public static void main(String[] args) {
        // ✅ Coleção mutável
        Collection<String> mutavel = new ArrayList<>();
        mutavel.add("A");  // OK
        mutavel.remove("A");  // OK
        
        // ❌ Coleção imutável: Arrays.asList()
        Collection<String> imutavel1 = Arrays.asList("A", "B", "C");
        
        try {
            imutavel1.add("D");  // ❌ UnsupportedOperationException
        } catch (UnsupportedOperationException e) {
            System.out.println("Arrays.asList() retorna lista imutável (tamanho fixo)");
        }
        
        try {
            imutavel1.remove("A");  // ❌ UnsupportedOperationException
        } catch (UnsupportedOperationException e) {
            System.out.println("Não pode remover");
        }
        
        // ❌ Coleção imutável: Collections.unmodifiableCollection()
        Collection<String> original = new ArrayList<>();
        original.add("X");
        original.add("Y");
        
        Collection<String> imutavel2 = Collections.unmodifiableCollection(original);
        
        try {
            imutavel2.add("Z");  // ❌ UnsupportedOperationException
        } catch (UnsupportedOperationException e) {
            System.out.println("unmodifiableCollection() não permite modificação");
        }
        
        // ✅ contains() funciona mesmo em imutável
        boolean tem = imutavel2.contains("X");  // true (leitura OK)
    }
}

/*
 * UNSUPPORTEDOPERATIONEXCEPTION:
 * 
 * COLEÇÕES IMUTÁVEIS:
 * 
 * Arrays.asList():
 * - Lista tamanho FIXO
 * - add() → UnsupportedOperationException
 * - remove() → UnsupportedOperationException
 * - set(index, element) → OK (modificar existente)
 * 
 * Collections.unmodifiableXxx():
 * - Wrapper IMUTÁVEL
 * - add() → UnsupportedOperationException
 * - remove() → UnsupportedOperationException
 * - clear() → UnsupportedOperationException
 * - contains() → OK (leitura permitida)
 * 
 * List.of(), Set.of() (Java 9+):
 * - IMUTÁVEL completo
 * - Qualquer modificação → UnsupportedOperationException
 * - Performance otimizada
 * 
 * QUANDO USAR IMUTÁVEL:
 * - API retorna coleção que não deve ser modificada
 * - Thread-safety (leitura concorrente)
 * - Garantir dados não mudam
 */
```

**Imutável**: Arrays.asList(), Collections.unmodifiableXxx() lançam **UnsupportedOperationException** em add/remove.

### 8. Exemplos Práticos

```java
// ✅ Exemplos práticos de uso
public class ExemplosPraticos {
    
    // ✅ Exemplo 1: Filtrar elementos
    public static Collection<Integer> filtrarPares(Collection<Integer> numeros) {
        Collection<Integer> pares = new ArrayList<>();
        
        for (Integer numero : numeros) {
            if (numero % 2 == 0) {
                pares.add(numero);  // Adicionar pares
            }
        }
        
        return pares;
    }
    
    // ✅ Exemplo 2: Remover elementos específicos
    public static void removerNegativos(Collection<Integer> numeros) {
        Collection<Integer> negativos = new ArrayList<>();
        
        for (Integer numero : numeros) {
            if (numero < 0) {
                negativos.add(numero);
            }
        }
        
        // Remover todos negativos
        for (Integer negativo : negativos) {
            numeros.remove(negativo);
        }
    }
    
    // ✅ Exemplo 3: Verificar se contém todos
    public static boolean contemTodos(Collection<String> colecao, String... elementos) {
        for (String elemento : elementos) {
            if (!colecao.contains(elemento)) {
                return false;
            }
        }
        return true;
    }
    
    // ✅ Exemplo 4: Eliminar duplicatas (List → Set)
    public static <T> Collection<T> eliminarDuplicatas(Collection<T> colecao) {
        return new HashSet<>(colecao);  // Set não permite duplicatas
    }
    
    public static void main(String[] args) {
        // Exemplo 1
        Collection<Integer> numeros1 = new ArrayList<>();
        numeros1.add(1);
        numeros1.add(2);
        numeros1.add(3);
        numeros1.add(4);
        
        Collection<Integer> pares = filtrarPares(numeros1);
        System.out.println("Pares: " + pares);  // [2, 4]
        
        // Exemplo 2
        Collection<Integer> numeros2 = new ArrayList<>();
        numeros2.add(10);
        numeros2.add(-5);
        numeros2.add(20);
        numeros2.add(-3);
        
        removerNegativos(numeros2);
        System.out.println("Sem negativos: " + numeros2);  // [10, 20]
        
        // Exemplo 3
        Collection<String> linguagens = new ArrayList<>();
        linguagens.add("Java");
        linguagens.add("Python");
        linguagens.add("C++");
        
        boolean tem = contemTodos(linguagens, "Java", "Python");
        System.out.println("Contém Java e Python: " + tem);  // true
        
        // Exemplo 4
        Collection<String> comDuplicatas = new ArrayList<>();
        comDuplicatas.add("A");
        comDuplicatas.add("B");
        comDuplicatas.add("A");
        comDuplicatas.add("C");
        comDuplicatas.add("B");
        
        Collection<String> semDuplicatas = eliminarDuplicatas(comDuplicatas);
        System.out.println("Sem duplicatas: " + semDuplicatas);  // [A, B, C]
    }
}
```

**Exemplos**: filtrar, remover específicos, verificar presença, eliminar duplicatas.

### 9. Resumo Visual

```java
/*
 * MÉTODOS PRINCIPAIS: add(), remove(), contains()
 * 
 * add(E element):
 * 
 * ASSINATURA:
 * boolean add(E element)
 * 
 * RETORNO:
 * - true: elemento ADICIONADO
 * - false: não adicionado (Set duplicata)
 * 
 * LIST:
 * lista.add("A") → true (sempre)
 * lista.add("A") → true (duplicata permitida)
 * 
 * SET:
 * set.add("A") → true (primeira vez)
 * set.add("A") → false (duplicata)
 * 
 * 
 * remove(Object o):
 * 
 * ASSINATURA:
 * boolean remove(Object o)
 * 
 * RETORNO:
 * - true: elemento REMOVIDO
 * - false: elemento NÃO encontrado
 * 
 * COMPARAÇÃO:
 * - Usa equals()
 * - NÃO usa == (identidade)
 * 
 * LIST:
 * lista.remove("A") → true (remove PRIMEIRA ocorrência)
 * 
 * SET:
 * set.remove("A") → true (remove elemento)
 * 
 * 
 * contains(Object o):
 * 
 * ASSINATURA:
 * boolean contains(Object o)
 * 
 * RETORNO:
 * - true: coleção CONTÉM
 * - false: coleção NÃO contém
 * 
 * COMPARAÇÃO:
 * - Usa equals()
 * - Case-sensitive (String)
 * 
 * PERFORMANCE:
 * ArrayList: O(n) (percorre todos)
 * HashSet:   O(1) (hash direto)
 * TreeSet:   O(log n) (árvore)
 * 
 * 
 * EQUALS() E HASHCODE():
 * 
 * OBJETOS CUSTOMIZADOS:
 * - DEVE implementar equals()
 * - HashSet/HashMap: DEVE implementar hashCode()
 * - Caso contrário usa Object.equals() (==)
 * 
 * 
 * NULL:
 * 
 * ArrayList/LinkedList: ✅ múltiplos null
 * HashSet:              ✅ um null
 * TreeSet:              ❌ NullPointerException
 * PriorityQueue:        ❌ NullPointerException
 * 
 * 
 * IMUTÁVEL:
 * 
 * Arrays.asList():
 * - add() → UnsupportedOperationException
 * - remove() → UnsupportedOperationException
 * 
 * Collections.unmodifiableXxx():
 * - Qualquer modificação → UnsupportedOperationException
 * 
 * 
 * PERFORMANCE COMPARAÇÃO:
 * 
 * Operação       | ArrayList | HashSet | TreeSet
 * ---------------|-----------|---------|----------
 * add()          | O(1)      | O(1)    | O(log n)
 * remove()       | O(n)      | O(1)    | O(log n)
 * contains()     | O(n)      | O(1)    | O(log n)
 * 
 * HashSet: 100-1000x MAIS RÁPIDO que ArrayList para contains()
 */

public class ExemploMetodosPrincipais {
    public static void main(String[] args) {
        // ✅ ArrayList
        Collection<String> lista = new ArrayList<>();
        
        lista.add("Java");      // true
        lista.add("Python");    // true
        lista.add("Java");      // true (duplicata permitida)
        
        boolean tem1 = lista.contains("Java");     // true
        boolean tem2 = lista.contains("Ruby");     // false
        
        boolean removeu1 = lista.remove("Java");   // true (remove PRIMEIRA)
        boolean removeu2 = lista.remove("Ruby");   // false (não existe)
        
        System.out.println(lista);  // [Python, Java]
        
        // ✅ HashSet
        Collection<String> conjunto = new HashSet<>();
        
        conjunto.add("A");  // true
        conjunto.add("B");  // true
        conjunto.add("A");  // false (duplicata)
        
        boolean tem3 = conjunto.contains("A");  // true (O(1) - rápido)
        boolean removeu3 = conjunto.remove("A");  // true
        
        System.out.println(conjunto);  // [B]
        
        // ✅ Com objetos customizados
        Collection<Pessoa> pessoas = new ArrayList<>();
        pessoas.add(new Pessoa("João", 30));
        pessoas.add(new Pessoa("Maria", 25));
        
        Pessoa p = new Pessoa("João", 30);
        boolean tem4 = pessoas.contains(p);  // true (equals() implementado)
        boolean removeu4 = pessoas.remove(p);  // true
        
        System.out.println(pessoas.size());  // 1
    }
}
```

---

## Aplicabilidade

**add()**:
- Adicionar **elementos** na coleção
- List: sempre adiciona (permite duplicata)
- Set: adiciona se **não** existir

**remove()**:
- Remover **elementos** da coleção
- List: remove **primeira** ocorrência
- Usa **equals()** para comparar

**contains()**:
- Verificar **presença** de elemento
- HashSet: **O(1)** (rápido)
- ArrayList: **O(n)** (lento)

---

## Armadilhas

### 1. Esquecer equals()

```java
// ❌ Sem equals(): usa == (identidade)
class Pessoa {
    String nome;
}

Collection<Pessoa> lista = new ArrayList<>();
lista.add(new Pessoa("João"));
boolean tem = lista.contains(new Pessoa("João"));  // false

// ✅ Com equals()
@Override
public boolean equals(Object o) { /* ... */ }
```

### 2. Performance contains() em List

```java
// ❌ ArrayList.contains() O(n)
Collection<Integer> lista = new ArrayList<>();  // Milhares
boolean tem = lista.contains(9999);  // LENTO

// ✅ HashSet.contains() O(1)
Collection<Integer> conjunto = new HashSet<>();
boolean tem2 = conjunto.contains(9999);  // RÁPIDO
```

### 3. Null em TreeSet

```java
// ❌ TreeSet não permite null
Collection<String> tree = new TreeSet<>();
tree.add(null);  // NullPointerException

// ✅ HashSet permite null
Collection<String> set = new HashSet<>();
set.add(null);  // OK
```

---

## Boas Práticas

### 1. Implementar equals() e hashCode()

```java
// ✅ Objetos customizados
@Override
public boolean equals(Object o) { /* ... */ }

@Override
public int hashCode() { /* ... */ }
```

### 2. Usar Set para Buscas Frequentes

```java
// ✅ Muitos contains(): usar HashSet
Collection<String> conjunto = new HashSet<>();
// contains() O(1)
```

### 3. Verificar Retorno

```java
// ✅ Verificar se adicionou/removeu
boolean adicionou = conjunto.add("A");
if (adicionou) {
    System.out.println("Adicionado");
}
```

---

## Resumo

**add(E element)**:
- Adiciona elemento na coleção
- Retorna **true** se modificou, **false** se não (Set duplicata)
- List: sempre adiciona (permite duplicata)
- Set: adiciona se não existir
- Exceção: UnsupportedOperationException se imutável

**remove(Object o)**:
- Remove elemento da coleção
- Retorna **true** se removeu, **false** se não encontrou
- List: remove **primeira** ocorrência
- Usa **equals()** para comparar (não ==)
- Exceção: UnsupportedOperationException se imutável

**contains(Object o)**:
- Verifica se coleção contém elemento
- Retorna **true** se encontrou, **false** se não
- Usa **equals()** para comparar
- Performance: HashSet **O(1)**, ArrayList **O(n)**, TreeSet **O(log n)**

**Comparação**:
- Usa **equals()**, não == (identidade)
- Objetos customizados: implementar **equals()** e **hashCode()**
- String: equals() compara **conteúdo**

**Null elements**:
- ArrayList/LinkedList: permite **múltiplos** null
- HashSet: permite **um** null
- TreeSet/PriorityQueue: **não** permite null (NullPointerException)

**Performance**:
- HashSet: add/remove/contains **O(1)** (100-1000x mais rápido)
- ArrayList: contains/remove **O(n)** (percorre todos)
- TreeSet: add/remove/contains **O(log n)**

**Imutável**:
- Arrays.asList(), Collections.unmodifiableXxx(): **UnsupportedOperationException** em add/remove
- contains() funciona (leitura permitida)

**Regra de Ouro**: add() adiciona retorna true se modificou. remove() remove primeira ocorrência equals(). contains() verifica presença equals(). HashSet O(1) rápido ArrayList O(n) lento. Implementar equals() hashCode() objetos customizados. Null ArrayList múltiplos HashSet um TreeSet não permite. Imutável UnsupportedOperationException modificação.

