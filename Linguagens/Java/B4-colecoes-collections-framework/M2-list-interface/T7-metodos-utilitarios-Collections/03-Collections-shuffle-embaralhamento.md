# T7.03 - Collections.shuffle(): Embaralhamento Aleatório

## Introdução

**Collections.shuffle()**: embaralha List ordem aleatória O(n) Random in-place útil jogos testes simulações.

```java
import java.util.*;

public class ShuffleIntro {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        
        System.out.println("Original: " + nums);
        
        Collections.shuffle(nums);
        
        System.out.println("Embaralhado: " + nums);
        // Ordem aleatória: [3, 1, 5, 2, 4]
        
        System.out.println("\n=== Resumo ===");
        System.out.println("shuffle(list): ordem aleatória");
        System.out.println("In-place: modifica original");
        System.out.println("O(n) complexidade");
    }
}
```

**shuffle()**: embaralha List aleatório O(n) in-place Random cada execução diferente.

---

## Fundamentos

### 1. Shuffle Básico

```java
public class ShuffleBasico {
    public static void main(String[] args) {
        // SHUFFLE SIMPLES:
        
        List<String> cartas = new ArrayList<>(Arrays.asList(
            "A♠", "K♠", "Q♠", "J♠", "10♠"
        ));
        
        System.out.println("Original: " + cartas);
        
        Collections.shuffle(cartas);
        
        System.out.println("Embaralhado: " + cartas);
        // Aleatório: [Q♠, A♠, 10♠, J♠, K♠]
        
        
        // MÚLTIPLAS EXECUÇÕES:
        
        List<Integer> nums = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        
        System.out.println("\n=== Múltiplas Execuções ===");
        for (int i = 0; i < 5; i++) {
            Collections.shuffle(nums);
            System.out.println("Execução " + (i+1) + ": " + nums);
        }
        // Cada execução: ordem diferente
        
        
        // ALGORITMO (Fisher-Yates):
        /*
         * for (i = size-1; i > 0; i--) {
         *     j = random(0, i+1)
         *     swap(list[i], list[j])
         * }
         */
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Cada shuffle: diferente");
        System.out.println("Fisher-Yates: O(n)");
    }
}
```

**Básico**: embaralha ordem aleatória cada execução diferente Fisher-Yates O(n) swap aleatório.

### 2. Shuffle com Random Customizado

```java
public class ShuffleRandom {
    public static void main(String[] args) {
        // RANDOM DEFAULT (nanoTime seed):
        
        List<Integer> nums1 = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        Collections.shuffle(nums1);
        System.out.println("Default: " + nums1);
        
        
        // RANDOM COM SEED (reproduzível):
        
        List<Integer> nums2 = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        Random rnd = new Random(42);  // Seed fixo
        Collections.shuffle(nums2, rnd);
        System.out.println("\nSeed 42: " + nums2);
        
        // Mesma seed = mesma sequência:
        List<Integer> nums3 = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        rnd = new Random(42);  // Mesma seed
        Collections.shuffle(nums3, rnd);
        System.out.println("Seed 42 novamente: " + nums3);
        // IGUAIS!
        
        
        // TESTES REPRODUZÍVEIS:
        
        Random testRnd = new Random(123);
        List<String> deck = new ArrayList<>(Arrays.asList("A", "K", "Q", "J", "10"));
        
        Collections.shuffle(deck, testRnd);
        System.out.println("\nTeste 1: " + deck);
        
        testRnd = new Random(123);  // Reset seed
        deck = new ArrayList<>(Arrays.asList("A", "K", "Q", "J", "10"));
        Collections.shuffle(deck, testRnd);
        System.out.println("Teste 2: " + deck);
        // Mesmo resultado (reproduzível)
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Default: seed aleatório");
        System.out.println("Custom: seed fixo (testes)");
        System.out.println("Mesma seed = mesma ordem");
    }
}
```

**Random**: default seed nanoTime aleatório. Custom seed fixo reproduzível testes mesma seed mesma ordem útil debug.

### 3. Casos de Uso

```java
public class ShuffleCasos {
    public static void main(String[] args) {
        // CASO 1: Baralho
        
        List<String> baralho = new ArrayList<>();
        String[] naipes = {"♠", "♥", "♦", "♣"};
        String[] valores = {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"};
        
        for (String naipe : naipes) {
            for (String valor : valores) {
                baralho.add(valor + naipe);
            }
        }
        
        System.out.println("=== Caso 1: Baralho ===");
        System.out.println("Total cartas: " + baralho.size());
        
        Collections.shuffle(baralho);
        
        System.out.println("Primeiras 5: " + baralho.subList(0, 5));
        
        
        // CASO 2: Quiz aleatório
        
        List<String> perguntas = new ArrayList<>(Arrays.asList(
            "Pergunta 1", "Pergunta 2", "Pergunta 3", 
            "Pergunta 4", "Pergunta 5"
        ));
        
        Collections.shuffle(perguntas);
        
        System.out.println("\n=== Caso 2: Quiz ===");
        for (int i = 0; i < perguntas.size(); i++) {
            System.out.println((i+1) + ". " + perguntas.get(i));
        }
        
        
        // CASO 3: Sorteio
        
        List<String> participantes = new ArrayList<>(Arrays.asList(
            "Ana", "Bruno", "Carlos", "Diana", "Eduardo"
        ));
        
        Collections.shuffle(participantes);
        
        System.out.println("\n=== Caso 3: Sorteio ===");
        System.out.println("Vencedor: " + participantes.get(0));
        
        
        // CASO 4: Playlist aleatória
        
        List<String> musicas = new ArrayList<>(Arrays.asList(
            "Música 1", "Música 2", "Música 3", "Música 4"
        ));
        
        Collections.shuffle(musicas);
        
        System.out.println("\n=== Caso 4: Playlist ===");
        System.out.println("Ordem: " + musicas);
        
        
        // CASO 5: Dados de teste
        
        List<Integer> testData = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            testData.add(i);
        }
        
        Collections.shuffle(testData, new Random(999));  // Reproduzível
        
        System.out.println("\n=== Caso 5: Testes ===");
        System.out.println("Dados embaralhados: " + testData);
        
        
        System.out.println("\n=== Resumo Casos ===");
        System.out.println("Baralho: shuffle cartas");
        System.out.println("Quiz: ordem aleatória");
        System.out.println("Sorteio: primeiro elemento");
        System.out.println("Playlist: música aleatória");
        System.out.println("Testes: dados variados");
    }
}
```

**Casos**: baralho shuffle cartas. Quiz perguntas aleatórias. Sorteio primeiro elemento. Playlist shuffle músicas. Testes dados reproduzíveis seed.

### 4. Performance

```java
public class ShufflePerformance {
    public static void main(String[] args) {
        // PERFORMANCE TAMANHOS:
        
        System.out.println("=== Performance ===");
        for (int size : new int[]{1000, 10_000, 100_000}) {
            List<Integer> lista = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                lista.add(i);
            }
            
            long t1 = System.nanoTime();
            Collections.shuffle(lista);
            long t2 = System.nanoTime();
            
            System.out.printf("Size %6d: %3dms\n", size, (t2-t1)/1_000_000);
        }
        
        // RESULTADO:
        // Size   1000:   0ms
        // Size  10000:   1ms
        // Size 100000:  10ms
        
        // O(n) linear
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Complexidade: O(n)");
        System.out.println("Rápido: ~10ms (100K)");
    }
}
```

**Performance**: O(n) linear 10ms 100K rápido eficiente Fisher-Yates swap aleatório.

---

## Aplicabilidade

**shuffle usar**: embaralhar ordem aleatória baralho quiz sorteio playlist testes. Random seed reproduzível debug testes. O(n) rápido in-place.

---

## Armadilhas

```java
// ❌ Imutável
List<Integer> imutavel = Arrays.asList(1,2,3);
Collections.shuffle(imutavel);  // UnsupportedOperationException

// ✅ Mutável
List<Integer> mutavel = new ArrayList<>(Arrays.asList(1,2,3));
Collections.shuffle(mutavel);
```

---

## Boas Práticas

```java
// ✅ Default aleatório
Collections.shuffle(lista);

// ✅ Seed testes
Collections.shuffle(lista, new Random(42));
```

---

## Resumo

**Collections.shuffle**: embaralha List ordem aleatória O(n) Fisher-Yates in-place modifica original. Default Random seed nanoTime cada execução diferente. Custom seed fixo reproduzível testes debug mesma seed mesma ordem.

**Casos uso**: baralho shuffle cartas jogar. Quiz perguntas aleatórias cada execução. Sorteio shuffle primeiro vencedor. Playlist músicas ordem aleatória. Testes dados variados seed reproduzível.

**Performance**: O(n) linear swap aleatório 10ms 100K rápido eficiente. Algoritmo Fisher-Yates garantia distribuição uniforme aleatória.

