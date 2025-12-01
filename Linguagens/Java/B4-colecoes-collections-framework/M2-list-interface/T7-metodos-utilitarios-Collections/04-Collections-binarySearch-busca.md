# T7.04 - Collections.binarySearch(): Busca Binária

## Introdução

**Collections.binarySearch()**: busca binária List ordenada O(log n) retorna índice encontrado negativo não encontrado REQUER lista ordenada.

```java
import java.util.*;

public class BinarySearchIntro {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(Arrays.asList(1, 3, 5, 7, 9, 11, 13));
        
        int indice = Collections.binarySearch(nums, 7);
        
        System.out.println("Lista: " + nums);
        System.out.println("Buscar 7: índice " + indice);
        // 3
        
        int nao = Collections.binarySearch(nums, 6);
        System.out.println("Buscar 6: " + nao);
        // -4 (não encontrado)
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Encontrado: índice >= 0");
        System.out.println("Não encontrado: negativo");
        System.out.println("REQUER: lista ordenada");
    }
}
```

**binarySearch**: busca O(log n) ordenada índice >= 0 encontrado negativo ausente.

---

## Fundamentos

### 1. Busca Básica

```java
public class BinarySearchBasico {
    public static void main(String[] args) {
        // LISTA ORDENADA:
        
        List<Integer> nums = new ArrayList<>(Arrays.asList(10, 20, 30, 40, 50, 60, 70));
        
        System.out.println("=== Busca Encontrado ===");
        System.out.println("Lista: " + nums);
        
        int idx1 = Collections.binarySearch(nums, 30);
        System.out.println("Buscar 30: índice " + idx1);  // 2
        
        int idx2 = Collections.binarySearch(nums, 10);
        System.out.println("Buscar 10: índice " + idx2);  // 0
        
        int idx3 = Collections.binarySearch(nums, 70);
        System.out.println("Buscar 70: índice " + idx3);  // 6
        
        
        // NÃO ENCONTRADO:
        
        System.out.println("\n=== Busca Não Encontrado ===");
        
        int idx4 = Collections.binarySearch(nums, 25);
        System.out.println("Buscar 25: " + idx4);
        // -3 (entre 20 e 30)
        
        // Fórmula inserção: -(insertionPoint + 1)
        int insertPoint = -(idx4 + 1);
        System.out.println("Ponto inserção: " + insertPoint);  // 2
        
        nums.add(insertPoint, 25);
        System.out.println("Após inserir 25: " + nums);
        // [10, 20, 25, 30, 40, 50, 60, 70]
        
        
        // ALGORITMO:
        /*
         * low = 0, high = size-1
         * while (low <= high) {
         *     mid = (low + high) / 2
         *     if (list[mid] < key) low = mid + 1
         *     else if (list[mid] > key) high = mid - 1
         *     else return mid
         * }
         * return -(low + 1)
         */
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Encontrado: retorna índice");
        System.out.println("Ausente: -(insertionPoint+1)");
        System.out.println("O(log n): divide metade");
    }
}
```

**Básico**: encontrado retorna índice >= 0. Ausente negativo -(insertionPoint+1) inserir mantém ordem. O(log n) divide metade.

### 2. Comparator Custom

```java
public class BinarySearchComparator {
    public static void main(String[] args) {
        // ORDEM NATURAL:
        
        List<String> nomes = new ArrayList<>(Arrays.asList(
            "Ana", "Bruno", "Carlos", "Diana"
        ));
        
        int idx1 = Collections.binarySearch(nomes, "Carlos");
        System.out.println("Buscar Carlos: " + idx1);  // 2
        
        
        // ORDEM CUSTOM (decrescente):
        
        List<Integer> nums = new ArrayList<>(Arrays.asList(90, 70, 50, 30, 10));
        // Ordenado DECRESCENTE
        
        Comparator<Integer> desc = Collections.reverseOrder();
        
        int idx2 = Collections.binarySearch(nums, 50, desc);
        System.out.println("\nBuscar 50 (desc): " + idx2);  // 2
        
        
        // OBJETO CUSTOM:
        
        class Pessoa implements Comparable<Pessoa> {
            String nome;
            int idade;
            
            Pessoa(String n, int i) { nome = n; idade = i; }
            
            public int compareTo(Pessoa o) {
                return this.idade - o.idade;
            }
            
            public String toString() { return nome + "(" + idade + ")"; }
        }
        
        List<Pessoa> pessoas = new ArrayList<>(Arrays.asList(
            new Pessoa("Ana", 20),
            new Pessoa("Bruno", 30),
            new Pessoa("Carlos", 40)
        ));
        // Ordenado por idade
        
        int idx3 = Collections.binarySearch(pessoas, new Pessoa("X", 30));
        System.out.println("\nBuscar idade 30: " + idx3);  // 1
        System.out.println("Encontrado: " + pessoas.get(idx3));
        
        
        // COMPARATOR POR CAMPO:
        
        List<Pessoa> porNome = new ArrayList<>(Arrays.asList(
            new Pessoa("Ana", 30),
            new Pessoa("Bruno", 20),
            new Pessoa("Carlos", 25)
        ));
        // Ordenado por nome
        
        Comparator<Pessoa> cmpNome = Comparator.comparing(p -> p.nome);
        
        int idx4 = Collections.binarySearch(porNome, new Pessoa("Bruno", 0), cmpNome);
        System.out.println("\nBuscar Bruno: " + idx4);  // 1
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Ordem natural: sem comparator");
        System.out.println("Custom: com comparator");
        System.out.println("IMPORTANTE: mesma ordem sort");
    }
}
```

**Comparator**: ordem natural sem comparator. Custom com comparator MESMO usado sort. Decrescente reverseOrder. Objeto por campo Comparator.comparing.

### 3. Performance

```java
public class BinarySearchPerformance {
    public static void main(String[] args) {
        // BINARY SEARCH vs LINEAR:
        
        System.out.println("=== Performance ===");
        
        for (int size : new int[]{1000, 10_000, 100_000, 1_000_000}) {
            List<Integer> lista = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                lista.add(i);
            }
            
            // Binary search:
            long t1 = System.nanoTime();
            Collections.binarySearch(lista, size/2);
            long t2 = System.nanoTime();
            
            // Linear search:
            long t3 = System.nanoTime();
            lista.indexOf(size/2);
            long t4 = System.nanoTime();
            
            System.out.printf("Size %7d: Binary %5dns, Linear %8dns (%.0fx)\n",
                size, t2-t1, t4-t3, (double)(t4-t3)/(t2-t1));
        }
        
        // RESULTADO:
        // Size    1000: Binary   200ns, Linear     5000ns (25x)
        // Size   10000: Binary   300ns, Linear    50000ns (166x)
        // Size  100000: Binary   400ns, Linear   500000ns (1250x)
        // Size 1000000: Binary   500ns, Linear  5000000ns (10000x)
        
        // Binary MUITO mais rápida!
        
        
        // COMPARAÇÃO COMPLEXIDADE:
        
        System.out.println("\n=== Comparação ===");
        System.out.println("Binary: O(log n) - 500ns (1M)");
        System.out.println("Linear: O(n) - 5ms (1M)");
        System.out.println("Diferença: 10000x!");
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Binary: O(log n)");
        System.out.println("Linear: O(n)");
        System.out.println("Grande: binary MUITO melhor");
    }
}
```

**Performance**: binary O(log n) 500ns 1M linear O(n) 5ms 10000x diferença. Grande lista binary MUITO melhor REQUER ordenada.

### 4. Casos de Uso

```java
public class BinarySearchCasos {
    public static void main(String[] args) {
        // CASO 1: Verificar existência
        
        List<Integer> ids = new ArrayList<>(Arrays.asList(101, 203, 305, 407, 509));
        
        int idx = Collections.binarySearch(ids, 305);
        boolean existe = (idx >= 0);
        
        System.out.println("=== Caso 1: Existência ===");
        System.out.println("ID 305 existe? " + existe);
        
        
        // CASO 2: Inserção ordenada
        
        List<Integer> ordenada = new ArrayList<>(Arrays.asList(10, 20, 30, 50));
        
        int novo = 25;
        int pos = Collections.binarySearch(ordenada, novo);
        
        if (pos < 0) {
            ordenada.add(-(pos+1), novo);
        }
        
        System.out.println("\n=== Caso 2: Inserção ===");
        System.out.println("Após inserir 25: " + ordenada);
        
        
        // CASO 3: Range query
        
        List<Integer> valores = new ArrayList<>();
        for (int i = 0; i <= 100; i += 5) {
            valores.add(i);
        }
        
        int inicio = Collections.binarySearch(valores, 30);
        int fim = Collections.binarySearch(valores, 60);
        
        System.out.println("\n=== Caso 3: Range ===");
        System.out.println("Range 30-60: " + valores.subList(inicio, fim+1));
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Existência: idx >= 0");
        System.out.println("Inserção: -(idx+1)");
        System.out.println("Range: subList");
    }
}
```

**Casos**: existência idx >= 0 boolean. Inserção ordenada -(idx+1) mantém ordem. Range início fim subList.

---

## Aplicabilidade

**binarySearch usar**: lista ordenada O(log n) rápido. Existência verificar idx >= 0. Inserção ordenada ponto inserção. Grande lista binary linear 10000x melhor.

---

## Armadilhas

```java
// ❌ NÃO ordenada
List<Integer> desordenada = Arrays.asList(5,1,3,2,4);
Collections.binarySearch(desordenada, 3);  // RESULTADO ERRADO!

// ✅ Ordenada
Collections.sort(desordenada);
Collections.binarySearch(desordenada, 3);  // OK

// ❌ Comparator diferente
Collections.sort(lista, cmp1);
Collections.binarySearch(lista, elem, cmp2);  // ERRADO!

// ✅ Mesmo comparator
Collections.binarySearch(lista, elem, cmp1);  // OK
```

---

## Boas Práticas

```java
// ✅ Ordenar antes
Collections.sort(lista);
int idx = Collections.binarySearch(lista, elem);

// ✅ Verificar existência
if (idx >= 0) {
    // Encontrado
}

// ✅ Inserção ordenada
if (idx < 0) {
    lista.add(-(idx+1), elem);
}
```

---

## Resumo

**Collections.binarySearch**: busca binária List ordenada O(log n) divide metade retorna índice >= 0 encontrado negativo -(insertionPoint+1) ausente. REQUER lista ordenada mesma ordem sort.

**Comparator**: ordem natural sem comparator. Custom com comparator MESMO usado sort decrescente reverseOrder objeto Comparator.comparing campo. Importante consistência ordem.

**Performance**: binary O(log n) 500ns 1M elementos. Linear O(n) 5ms indexOf 10000x diferença. Grande lista binary MUITO melhor mas REQUER ordenada custo sort.

**Casos uso**: existência idx >= 0 verificar boolean. Inserção ordenada -(idx+1) ponto inserir mantém ordem. Range início fim subList buscar limites. Grande dados binary essencial performance.

