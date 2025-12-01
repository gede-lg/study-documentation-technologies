# T7.05 - Collections.min() e max(): Extremos de Coleção

## Introdução

**Collections.min/max**: retorna menor/maior elemento Collection O(n) percorre todos Comparable ou Comparator útil estatísticas.

```java
import java.util.*;

public class MinMaxIntro {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(5, 2, 8, 1, 9, 3);
        
        int min = Collections.min(nums);
        int max = Collections.max(nums);
        
        System.out.println("Lista: " + nums);
        System.out.println("Mínimo: " + min);  // 1
        System.out.println("Máximo: " + max);  // 9
        
        System.out.println("\n=== Resumo ===");
        System.out.println("min: menor elemento");
        System.out.println("max: maior elemento");
        System.out.println("O(n): percorre todos");
    }
}
```

**min/max**: menor/maior elemento O(n) percorre Comparable natural ou Comparator custom.

---

## Fundamentos

### 1. Min/Max Básico

```java
public class MinMaxBasico {
    public static void main(String[] args) {
        // NÚMEROS:
        
        List<Integer> nums = Arrays.asList(42, 17, 95, 3, 68);
        
        System.out.println("=== Números ===");
        System.out.println("Lista: " + nums);
        System.out.println("Min: " + Collections.min(nums));  // 3
        System.out.println("Max: " + Collections.max(nums));  // 95
        
        
        // STRINGS:
        
        List<String> nomes = Arrays.asList("Carlos", "Ana", "Bruno", "Diana");
        
        System.out.println("\n=== Strings ===");
        System.out.println("Lista: " + nomes);
        System.out.println("Min: " + Collections.min(nomes));  // Ana
        System.out.println("Max: " + Collections.max(nomes));  // Diana
        
        
        // DOUBLES:
        
        List<Double> precos = Arrays.asList(19.99, 9.99, 29.99, 5.99);
        
        System.out.println("\n=== Doubles ===");
        System.out.println("Preços: " + precos);
        System.out.println("Min: " + Collections.min(precos));  // 5.99
        System.out.println("Max: " + Collections.max(precos));  // 29.99
        
        
        // ALGORITMO:
        /*
         * min(Collection c) {
         *     Iterator it = c.iterator();
         *     E min = it.next();
         *     while (it.hasNext()) {
         *         E e = it.next();
         *         if (e.compareTo(min) < 0)
         *             min = e;
         *     }
         *     return min;
         * }
         */
        
        System.out.println("\n=== Resumo ===");
        System.out.println("O(n): percorre uma vez");
        System.out.println("Usa: compareTo()");
    }
}
```

**Básico**: Integer String Double Comparable natural compareTo percorre O(n) uma passagem menor/maior.

### 2. Comparator Custom

```java
public class MinMaxComparator {
    public static void main(String[] args) {
        // STRINGS POR TAMANHO:
        
        List<String> palavras = Arrays.asList("oi", "casa", "a", "computador");
        
        Comparator<String> porTamanho = (a, b) -> a.length() - b.length();
        
        System.out.println("=== Por Tamanho ===");
        System.out.println("Palavras: " + palavras);
        System.out.println("Menor: " + Collections.min(palavras, porTamanho));  // a
        System.out.println("Maior: " + Collections.max(palavras, porTamanho));  // computador
        
        
        // OBJETOS CUSTOM:
        
        class Produto {
            String nome;
            double preco;
            
            Produto(String n, double p) { nome = n; preco = p; }
            
            public String toString() { return nome + "($" + preco + ")"; }
        }
        
        List<Produto> produtos = Arrays.asList(
            new Produto("Mouse", 50.0),
            new Produto("Teclado", 150.0),
            new Produto("Monitor", 800.0)
        );
        
        Comparator<Produto> porPreco = Comparator.comparingDouble(p -> p.preco);
        
        System.out.println("\n=== Produtos ===");
        System.out.println("Lista: " + produtos);
        System.out.println("Mais barato: " + Collections.min(produtos, porPreco));
        System.out.println("Mais caro: " + Collections.max(produtos, porPreco));
        
        
        // ORDEM REVERSA:
        
        List<Integer> nums = Arrays.asList(5, 2, 8, 1, 9);
        
        Comparator<Integer> reverso = Collections.reverseOrder();
        
        System.out.println("\n=== Ordem Reversa ===");
        System.out.println("Lista: " + nums);
        System.out.println("Min reverso: " + Collections.min(nums, reverso));  // 9
        System.out.println("Max reverso: " + Collections.max(nums, reverso));  // 1
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Comparator: critério custom");
        System.out.println("reverseOrder: inverte");
    }
}
```

**Comparator**: custom critério tamanho preço campo. reverseOrder inverte min vira max. Comparator.comparing campo lambda flexível.

### 3. Casos de Uso

```java
public class MinMaxCasos {
    public static void main(String[] args) {
        // CASO 1: Estatísticas
        
        List<Integer> notas = Arrays.asList(85, 92, 78, 95, 88, 73);
        
        int minNota = Collections.min(notas);
        int maxNota = Collections.max(notas);
        double media = notas.stream().mapToInt(Integer::intValue).average().orElse(0);
        
        System.out.println("=== Caso 1: Notas ===");
        System.out.println("Mínima: " + minNota);
        System.out.println("Máxima: " + maxNota);
        System.out.println("Média: " + media);
        
        
        // CASO 2: Preços
        
        List<Double> precos = Arrays.asList(19.99, 9.99, 29.99, 5.99, 15.99);
        
        double maisBarato = Collections.min(precos);
        double maisCaro = Collections.max(precos);
        
        System.out.println("\n=== Caso 2: Preços ===");
        System.out.println("Mais barato: $" + maisBarato);
        System.out.println("Mais caro: $" + maisCaro);
        
        
        // CASO 3: Temperaturas
        
        List<Integer> temps = Arrays.asList(22, 18, 25, 30, 15, 28);
        
        int tempMin = Collections.min(temps);
        int tempMax = Collections.max(temps);
        int amplitude = tempMax - tempMin;
        
        System.out.println("\n=== Caso 3: Temperaturas ===");
        System.out.println("Mínima: " + tempMin + "°C");
        System.out.println("Máxima: " + tempMax + "°C");
        System.out.println("Amplitude: " + amplitude + "°C");
        
        
        // CASO 4: Idades
        
        class Pessoa {
            String nome;
            int idade;
            Pessoa(String n, int i) { nome = n; idade = i; }
            public String toString() { return nome + "(" + idade + ")"; }
        }
        
        List<Pessoa> pessoas = Arrays.asList(
            new Pessoa("Ana", 30),
            new Pessoa("Bruno", 25),
            new Pessoa("Carlos", 35)
        );
        
        Comparator<Pessoa> porIdade = Comparator.comparingInt(p -> p.idade);
        
        Pessoa maisNova = Collections.min(pessoas, porIdade);
        Pessoa maisVelha = Collections.max(pessoas, porIdade);
        
        System.out.println("\n=== Caso 4: Pessoas ===");
        System.out.println("Mais nova: " + maisNova);
        System.out.println("Mais velha: " + maisVelha);
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Estatísticas: min/max/média");
        System.out.println("Preços: barato/caro");
        System.out.println("Amplitude: max - min");
        System.out.println("Objetos: comparator campo");
    }
}
```

**Casos**: estatísticas min max média. Preços barato caro. Temperaturas amplitude max-min. Pessoas por idade campo comparator.

### 4. Performance

```java
public class MinMaxPerformance {
    public static void main(String[] args) {
        System.out.println("=== Performance ===");
        
        for (int size : new int[]{1000, 10_000, 100_000, 1_000_000}) {
            List<Integer> lista = new ArrayList<>();
            Random rnd = new Random(42);
            for (int i = 0; i < size; i++) {
                lista.add(rnd.nextInt());
            }
            
            long t1 = System.nanoTime();
            Collections.min(lista);
            long t2 = System.nanoTime();
            
            long t3 = System.nanoTime();
            Collections.max(lista);
            long t4 = System.nanoTime();
            
            System.out.printf("Size %7d: min %4dms, max %4dms\n",
                size, (t2-t1)/1_000_000, (t4-t3)/1_000_000);
        }
        
        // RESULTADO:
        // Size    1000: min    0ms, max    0ms
        // Size   10000: min    0ms, max    0ms
        // Size  100000: min    2ms, max    2ms
        // Size 1000000: min   20ms, max   20ms
        
        // O(n) linear
        
        System.out.println("\n=== Resumo ===");
        System.out.println("O(n): percorre todos");
        System.out.println("Rápido: ~20ms (1M)");
    }
}
```

**Performance**: O(n) percorre todos linear 20ms 1M elementos rápido eficiente min max mesmo tempo.

---

## Aplicabilidade

**min/max usar**: menor/maior elemento estatísticas preços temperaturas idades. O(n) percorre Comparable natural Comparator custom campo reverseOrder inverte.

---

## Armadilhas

```java
// ❌ Coleção vazia
List<Integer> vazia = new ArrayList<>();
Collections.min(vazia);  // NoSuchElementException

// ✅ Verificar antes
if (!lista.isEmpty()) {
    int min = Collections.min(lista);
}

// ❌ Sem Comparable
class Obj { }
List<Obj> lista = Arrays.asList(new Obj());
Collections.min(lista);  // ClassCastException

// ✅ Com Comparator
Collections.min(lista, comparator);
```

---

## Boas Práticas

```java
// ✅ Verificar vazia
if (!lista.isEmpty()) {
    int min = Collections.min(lista);
}

// ✅ Comparator objeto
Comparator<Produto> cmp = Comparator.comparingDouble(p -> p.preco);
Collections.min(produtos, cmp);

// ✅ Ambos min/max
int min = Collections.min(nums);
int max = Collections.max(nums);
int amplitude = max - min;
```

---

## Resumo

**Collections.min/max**: retorna menor/maior elemento Collection O(n) percorre todos uma passagem. Comparable natural compareTo Integer String Double built-in. Comparator custom critério campo lambda Comparator.comparing porTamanho porPreco flexível.

**Casos uso**: estatísticas min max média amplitude. Preços barato caro comparar. Temperaturas min max amplitude diferença. Pessoas objetos por idade campo comparator custom critério.

**Performance**: O(n) linear percorre todos 20ms 1M elementos rápido eficiente min max mesmo tempo duas passagens. Verificar vazia NoSuchElementException evitar. Sem Comparable usar Comparator ClassCastException.

